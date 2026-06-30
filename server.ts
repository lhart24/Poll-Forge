import express from 'express'; 
import cors from 'cors';


const app = express();

app.use(cors()); // allow requests from React

app.use(express.json());

const PORT = process.env.PORT || 5001;

app.post('/api/submit', async (req, res) => {
    const { input } = req.body;

    try {
        const apiRes = await fetch(input);
        const data = await apiRes.json();
        res.json({ message: JSON.stringify(data) });
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch input URL' });
    }
});


app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});
