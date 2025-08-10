// server.js
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);

// WebSocket server (wss works automatically if served over HTTPS)
const wss = new WebSocket.Server({ server });

// In-memory clients = demo only (use DB for prod)
let clients = {};

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      if (data.type === 'join') {
        ws.id = Date.now() + '-' + Math.random().toString(36).substr(2, 9);
        ws.nickname = data.nickname || 'Anon';
        ws.tags = data.tags || '';
        clients[ws.id] = ws;
        broadcastUsers();
      } else if (data.type === 'introduce') {
        if (clients[data.to]) {
          clients[data.to].send(JSON.stringify({ type: 'intro_request', from: ws.id, nickname: ws.nickname }));
        }
      } else if (data.type === 'accept_intro') {
        if (clients[data.to]) {
          clients[data.to].send(JSON.stringify({ type: 'intro_accepted', from: ws.id, nickname: ws.nickname }));
        }
      } else if (data.type === 'message') {
        if (clients[data.to]) {
          clients[data.to].send(JSON.stringify({ type: 'message', from: ws.id, nickname: ws.nickname, text: data.text }));
        }
      }
    } catch (e) {
      console.error('Invalid message', e);
    }
  });

  ws.on('close', () => {
    delete clients[ws.id];
    broadcastUsers();
  });
});

function broadcastUsers() {
  const userList = Object.keys(clients).map(id => ({
    id,
    nickname: clients[id]?.nickname,
    tags: clients[id]?.tags
  }));
  const data = JSON.stringify({ type: 'user_list', users: userList });
  for (const id in clients) {
    try { clients[id].send(data); } catch(e) {}
  }
}

// Serve static files (index.html, etc.)
app.use(express.static(path.join(__dirname)));

// Use the PORT provided by the host (Render sets PORT)
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
