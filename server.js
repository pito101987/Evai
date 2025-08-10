const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let clients = {};

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      if (data.type === 'join') {
        ws.id = Date.now() + '-' + Math.random().toString(36).substr(2, 9);
        ws.nickname = data.nickname;
        ws.tags = data.tags;
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
      console.error('Error parsing message', e);
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
    nickname: clients[id].nickname,
    tags: clients[id].tags
  }));
  const data = JSON.stringify({ type: 'user_list', users: userList });
  for (let id in clients) {
    clients[id].send(data);
  }
}

app.use(express.static('.'));
server.listen(3000, () => console.log('Server running on http://localhost:3000'));
