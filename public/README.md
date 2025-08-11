# EVAI (Node + Express + OpenAI)

A tiny, ready-to-deploy Express app that serves a simple chat UI and calls OpenAI for real responses.

## Quick start (GitHub ➜ Render deploy)
1. Create a **GitHub repo** (e.g., `evai`).
2. Add these files (keep the `public/` folder).
3. Go to **render.com** → New → **Web Service** → Connect your GitHub repo.
4. Render settings:
   - Build command: `npm install`
   - Start command: `node server.js`
5. In Render **Environment** → add secret:  
   - `OPENAI_API_KEY=your real key`
   - (optional) `MODEL=gpt-4o-mini`  
   - (optional) `SYSTEM_PROMPT=You are EVAI: warm, encouraging, concise, and helpful.`
6. Open the live URL Render gives you and chat.

## Local config
- `MODEL` default: `gpt-4o-mini`
- `SYSTEM_PROMPT` default shown above

## Endpoints
- `GET /health` – health check
- `POST /api/chat` – JSON `{ "message": "Hello" }`
