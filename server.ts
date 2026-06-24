import express from 'express'; 
import cors from 'cors';
import { handleInput } from './main';

const app = express();

app.use(cors()); // allow requests from React

app.use(express.json());

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});


app.post('/api/submit', async (req, res) => {
    const { input } = req.body;
    const result = await handleInput(input);
    res.json({ message: result });
});