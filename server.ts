import express from 'express';
import cors from 'cors';
import dns from 'dns/promises';
import rateLimit from 'express-rate-limit';



async function isSafeUrl(input: string): Promise<boolean> {
  let url: URL;
  try {
    url = new URL(input);
  } catch {
    return false; // not a valid URL at all
  }

  if (!['http:', 'https:'].includes(url.protocol)) {
    return false; // block file:, ftp:, gopher:, etc.
  }

  let address: string;
  try {
    const result = await dns.lookup(url.hostname);
    address = result.address;
  } catch {
    return false; // couldn't resolve — reject rather than risk it
  }

  const blocked = /^(127\.|10\.|169\.254\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.|::1$|0\.0\.0\.0)/;
  return !blocked.test(address);
}
const app = express();

const submitLimiter = rateLimit({
    windowMs: 60_000, // 1 minute
    max: 30,           // 30 requests per IP per minute
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        error: 'Too many requests. Please slow down.',
    },
});



app.use(cors({
    origin: process.env.FRONTEND_URL || "https://localhost:5173"
}));



app.use(express.json());

const PORT = process.env.PORT || 5001;

app.post('/api/submit', async (req, res) => {
    const { input } = req.body;

    if (!input) {
        return res.status(400).json({
            success: false,
            error: 'No URL provided.'
        });
    }

    if (!(await isSafeUrl(input))) {
        return res.status(400).json({
            success: false,
            error: "That URL isn't allowed."
        });
    }


    try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10_000); // 10s cap

    // measure the speed before the call
    const start = performance.now()

    const apiRes = await fetch(input, { signal: controller.signal });

    clearTimeout(timeout);

    // measure the speed after the call
    const end = performance.now()

    // calculate speed of api call
    const responseTime = Math.round(end - start)

    const contentType = apiRes.headers.get('content-type');

    let body = null;

    if (contentType?.includes('application/json')) {
        body = await apiRes.json();
    } else {
        body = await apiRes.text();
    }

    res.json({
        success: apiRes.ok,
        status: apiRes.status,
        statusText: apiRes.statusText,
        responseTime,
        headers: Object.fromEntries(apiRes.headers.entries()),
        body
    });

} catch (err) {
    const isTimeout = err instanceof Error && err.name === 'AbortError';
    res.status(500).json({
        success: false,
        status: 500,
        error: isTimeout ? 'Request timed out.' : 'Unable to reach server.',
        message: err instanceof Error ? err.message : 'Unknown error'
    });
}
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
