import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    // Add user's message
    setChat(prev => [...prev, { sender: 'user', text: message }]);

    try {
      const res = await axios.post('http://localhost:5000/chat', { message });
      setChat(prev => [
        ...prev,
        { sender: 'user', text: message },
        { sender: 'bot', text: res.data.reply },
      ]);
    } catch (err) {
      setChat(prev => [
        ...prev,
        { sender: 'user', text: message },
        { sender: 'bot', text: '❌ Error: ' + err.message },
      ]);
    }

    setMessage('');
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>🧠 Gemini ChatBot</h1>

      <div style={styles.chatBox}>
        {chat.map((msg, index) => (
          <div
            key={index}
            style={{
              ...styles.message,
              alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              backgroundColor: msg.sender === 'user' ? '#DCF8C6' : '#ECECEC',
            }}
          >
            <strong>{msg.sender === 'user' ? 'You' : 'Bot'}:</strong> {msg.text}
          </div>
        ))}
      </div>

      <div style={styles.inputArea}>
        <input
          style={styles.input}
          type="text"
          value={message}
          placeholder="Type your message..."
          onChange={e => setMessage(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
        />
        <button style={styles.button} onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '600px',
    margin: 'auto',
    padding: '1rem',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    textAlign: 'center',
    marginBottom: '1rem',
  },
  chatBox: {
    height: '400px',
    overflowY: 'scroll',
    border: '1px solid #ccc',
    borderRadius: '10px',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    backgroundColor: '#F9F9F9',
  },
  message: {
    padding: '10px 15px',
    borderRadius: '20px',
    maxWidth: '75%',
    wordBreak: 'break-word',
  },
  inputArea: {
    marginTop: '1rem',
    display: 'flex',
    gap: '10px',
  },
  input: {
    flex: 1,
    padding: '10px',
    fontSize: '16px',
    borderRadius: '10px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
  },
};

export default App;
