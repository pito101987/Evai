const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const { OpenAI } = require('openai');
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Serve the simple web UI
app.use(express.static('public'));

app.get('/health', (_req, res) => res.json({ ok: true, app: 'EVAI' }));

// Chat endpoint (real AI)
app.post('/api/chat', async (req, res) => {
  try {
    const userMessage = (req.body?.message || '').toString().slice(0, 4000);
    const systemPrompt =
      process.env.SYSTEM_PROMPT ||
      "You are EVAI: warm, encouraging, concise, and helpful.";

    const model = process.env.MODEL || 'gpt-4o-mini';

    const completion = await client.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ],
      temperature: 0.7
    });

    const reply =
      completion.choices?.[0]?.message?.content?.trim() ||
      "I'm here. How can I help?";

    res.json({ reply, model });
  } catch (err) {
    console.error('EVAI /api/chat error:', err);
    res.status(500).json({
      error: 'AI request failed. Check your API key and model.',
      details: err?.message || 'Unknown error'
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`EVAI server running on http://localhost:${PORT}`);
});
