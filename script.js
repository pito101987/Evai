async function sendMessage() {
  const input = document.getElementById("user-input");
  const message = input.value;
  if (!message) return;

  const chatBox = document.getElementById("chat-box");
  chatBox.innerHTML += `<p><b>You:</b> ${message}</p>`;

  const response = await fetch("/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message })
  });

  const data = await response.json();
  chatBox.innerHTML += `<p><b>EVAI:</b> ${data.reply}</p>`;
  input.value = "";
  chatBox.scrollTop = chatBox.scrollHeight;
}
