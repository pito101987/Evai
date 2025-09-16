# EVAI (Node + Express + OpenAI)

A tiny, ready-to-deploy Express app that serves a simple chat UI and calls OpenAI for real responses.

## Quick start (GitHub ➜ Render deploy)

1. **Create a GitHub repo** (name it `evai`).
2. Add these files to the repo (keep the `public/` folder).
3. Go to **render.com** → New ➜ Web Service → Connect your GitHub repo.
4. When prompted:
   - Build command: `npm install`
   - Start command: `node server.js`
5. In Render's **Environment** tab, add a secret env var: **OPENAI_API_KEY** with your real key.
6. Open the live URL Render gives you and start chatting.

## Local variables
You can configure the model and system prompt (optional):
- `MODEL` (default: `gpt-4o-mini`)
- `SYSTEM_PROMPT` (default: *You are EVAI: warm, encouraging, concise, and helpful.*)

## Endpoints
- `GET /health` – health check
- `POST /api/chat` – body `{ "message": "Hello" }`

## Notes
- Do **not** commit your real API key. Use env vars (Render Secrets).
- If deploying elsewhere (Railway, Fly, etc.), the same `node server.js` works.
