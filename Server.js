import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { OpenAI } from "openai";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));  // serves index.html + app.js

if (!process.env.OPENAI_API_KEY) {
  console.warn("[WARN] OPENAI_API_KEY is not set. Create a .env on Render.");
}

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Health check
app.get("/health", (req, res) => res.json({ ok: true, service: "evai-mvp" }));

// Chat endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body ?? {};
    if (!Array.isArray(messages)) {
      res.status(400).json({ error: "messages must be an array of {role, content}" });
      return;
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders?.();

    const model = process.env.EVAI_MODEL || "gpt-4o-mini";

    const stream = await client.chat.completions.create({
      model,
      messages,
      temperature: 0.7,
      stream: true,
    });

    for await (const chunk of stream) {
      const delta = chunk.choices?.[0]?.delta?.content || "";
      if (delta) {
        res.write(`data: ${JSON.stringify(delta)}\n\n`);
      }
    }

    res.write("event: done\n");
    res.write("data: [DONE]\n\n");
    res.end();
  } catch (err) {
    console.error(err);
    try {
      res.write(`event: error\n`);
      res.write(`data: ${JSON.stringify(String(err))}\n\n`);
      res.end();
    } catch {
      res.status(500).json({ error: "Chat streaming failed" });
    }
  }
});

// ✅ Important: must listen on Render’s PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`EVAI MVP server running on port ${PORT}`);
});
