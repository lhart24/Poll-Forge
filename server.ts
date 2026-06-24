import express from 'express'; 
import cors from 'cors';
import { handleInput } from './main';

const app = express();

app.use(cors()); // allow requests from React

app.use(express.json());

const PORT = process.env.PORT || 5001;



app.post('/api/submit', async (req, res) => {
    const { input } = req.body;
    const result = await handleInput(input);
    res.json({ message: result });
});

app.get('/test', (req, res) => {
    res.json({ message: 'works' });
});

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});
