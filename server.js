const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

// Sample endpoint
app.get('/', (req, res) => {
    res.send('Welcome to EVAI - Emotionally Intelligent AI Server!');
});

// AI interaction endpoint (basic placeholder)
app.post('/message', (req, res) => {
    const userMessage = req.body.message || '';
    const responseMessage = `You said: "${userMessage}" — EVAI hears you.`;
    res.json({ reply: responseMessage });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`EVAI server running on port ${PORT}`);
});
