const express = require("express");
const cors = require("cors");


const app = express();

app.use(cors()); // allow requests from React

app.use(express.json());

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});

