import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
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

    try {
        // measure the speed before the call
        const start = performance.now()

        const apiRes = await fetch(input);

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

        // Always return 200 from YOUR server.
        // The remote API's status is included below.
        res.json({
            success: apiRes.ok,
            status: apiRes.status,
            statusText: apiRes.statusText,
            responseTime,
            headers: Object.fromEntries(apiRes.headers.entries()),
            body
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            status: 500,
            error: 'Unable to reach server.',
            message: err instanceof Error ? err.message : 'Unknown error'
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});