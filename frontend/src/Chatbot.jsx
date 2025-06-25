import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const vscode = window.acquireVsCodeApi ? window.acquireVsCodeApi() : null;

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);
  const backendUrl = 'http://localhost:8080/chat';

  useEffect(() => {
    if (!vscode) return;

    vscode.postMessage({ command: 'ready' });

    const handleMessage = event => {
      const message = event.data;
      if (message.command === 'loadHistory') {
        setMessages(message.history || []);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    vscode?.postMessage({ command: 'saveHistory', history: messages });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    try {
      const response = await axios.post(backendUrl, {
        history: updatedMessages,
      });

      const botMessage = { sender: 'bot', text: response.data.message };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = { sender: 'bot', text: 'Error: Unable to fetch response.' };
      setMessages(prev => [...prev, errorMessage]);
    }

    setInput('');
  };

  const handleClearChat = () => {
    setMessages([]);
    vscode?.postMessage({ command: 'saveHistory', history: [] });
  };

  return (
    <div style={styles.container}>
      <div style={styles.headerContainer}>
        <h2 style={styles.header}>Chat with Bot</h2>
        <button onClick={handleClearChat} style={styles.clearButton}>🗑️</button>
      </div>

      <div style={styles.chatBox}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              ...styles.message,
              alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              backgroundColor: msg.sender === 'user' ? '#DCF8C6' : '#E6E6E6',
            }}
          >
            <div style={styles.sender}>{msg.sender === 'user' ? 'You' : 'Bot'}</div>
            <div style={styles.text}>{msg.text}</div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div style={styles.inputBox}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type your message..."
          style={styles.input}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
        />
        <button onClick={handleSend} style={styles.button}>Send</button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: '100%',
    maxWidth: '500px',
    margin: '40px auto',
    padding: '20px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
    fontFamily: 'Segoe UI, sans-serif',
    backgroundColor: '#ffffff',
  },
  headerContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  header: {
    margin: 0,
    color: '#333',
  },
  clearButton: {
    background: 'transparent',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer',
    color: '#888',
    padding: '4px',
  },
  chatBox: {
    height: '400px',
    border: '1px solid #ccc',
    padding: '10px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f0f0f0',
    borderRadius: '6px',
    marginBottom: '10px',
  },
  inputBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  input: {
    flex: 1,
    padding: '12px',
    fontSize: '16px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    outline: 'none',
  },
  button: {
    padding: '12px 18px',
    fontSize: '16px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  message: {
    padding: '10px',
    margin: '6px 0',
    borderRadius: '10px',
    maxWidth: '80%',
    wordWrap: 'break-word',
    whiteSpace: 'pre-wrap',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  sender: {
    fontWeight: 'bold',
    marginBottom: '5px',
    fontSize: '14px',
    color: '#555',
  },
  text: {
    fontSize: '15px',
    color: '#555',
  },
};

export default ChatBot;
