# EVAI — Minimal MVP (Node + Express + OpenAI Streaming)

A tiny, working starter you can run locally and deploy. It serves a simple chat UI and streams responses from OpenAI via a secure server proxy (no API key in the browser).

## 1) Prereqs
- Node 20+ installed
- Your OpenAI API key

## 2) Setup
```bash
npm install
cp .env.example .env
# edit .env to paste your OPENAI_API_KEY
npm start
```

Then open http://localhost:3000 in your browser.

## 3) Dev mode with auto-reload
```bash
npm run dev
```

## 4) Deploy (Render / Railway / Fly.io)
- Create a new Web Service from this folder/repo
- Runtime: Node 20+
- Build command: `npm install`
- Start command: `npm start`
- Add environment variable: `OPENAI_API_KEY` (do NOT set it in code)
- Optional: `EVAI_MODEL` (default is `gpt-4o-mini`)

## 5) File structure
```
evai-mvp/
├─ public/
│  ├─ index.html
│  └─ app.js
├─ server.js
├─ package.json
├─ .env.example
└─ README.md
```

## 6) Notes
- This uses the official `openai` Node SDK and streams via Server-Sent Events.
- Keep prompts lightweight; this is a minimal starter meant to evolve.
- Next steps you can add quickly:
  - Conversation history with a session ID
  - File uploads and RAG (vector search)
  - Auth (passcode or OAuth) before accessing `/public`
  - A simple system prompt editor
