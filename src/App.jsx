import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./App.css"; // Make sure to create this file

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    try {
      const response = await axios.post("http://localhost:5000/api/chat", {
        message: input,

      });
      console.log(response.data);
      const botMsg = { role: "bot", content: response.data.reply };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      const errorMsg = {
        role: "bot",
        content: "सर्वर से कनेक्शन में त्रुटि। कृपया पुनः प्रयास करें।",
      };
      setMessages((prev) => [...prev, errorMsg]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chat-container">
      <div className="chat-header">🎓 Moodle ChatBot</div>

      <div className="chat-box">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`chat-bubble ${msg.role === "user" ? "user" : "bot"}`}
          >
            {msg.content}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-area">
        <input
          type="text"
          placeholder="अपना सवाल पूछें..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <button onClick={sendMessage}>📤 भेजें</button>
      </div>
    </div>
  );
}

export default App;
