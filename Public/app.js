const chatEl = document.getElementById("chat");
const inputEl = document.getElementById("input");
const sendBtn = document.getElementById("send");
const clearBtn = document.getElementById("clear");

function appendMessage(text, who) {
  const div = document.createElement("div");
  div.className = `msg ${who}`;
  div.textContent = text;
  chatEl.appendChild(div);
  chatEl.scrollTop = chatEl.scrollHeight;
}

clearBtn.onclick = () => {
  chatEl.innerHTML = "";
  inputEl.value = "";
  inputEl.focus();
};

sendBtn.onclick = async () => {
  const content = inputEl.value.trim();
  if (!content) return;
  appendMessage(content, "user");
  inputEl.value = "";
  sendBtn.disabled = true;

  const messages = [
    { role: "system", content: "You are EVAI, a concise, encouraging AI copilot that helps build EVAI together." },
    { role: "user", content }
  ];

  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages })
  });

  if (!res.ok) {
    appendMessage("Error starting stream.", "ai");
    sendBtn.disabled = false;
    return;
  }

  const reader = res.body.getReader();
  let buffer = "";
  appendMessage("", "ai"); // placeholder for streaming
  const last = chatEl.lastChild;

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    const chunk = new TextDecoder().decode(value);
    buffer += chunk;

    // Parse SSE lines
    const lines = buffer.split("\n\n");
    buffer = lines.pop() || "";
    for (const block of lines) {
      const line = block.trim();
      if (!line.startsWith("data:")) continue;
      const payload = line.slice(5).trim();
      if (payload === "[DONE]") continue;
      try {
        const text = JSON.parse(payload);
        last.textContent += text;
        chatEl.scrollTop = chatEl.scrollHeight;
      } catch {
        // ignore
      }
    }
  }

  sendBtn.disabled = false;
};
