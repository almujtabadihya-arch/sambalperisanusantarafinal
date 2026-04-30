import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, MessageSquare } from 'lucide-react';
import { io } from 'socket.io-client';

// Connect to local server
const socket = io('http://localhost:5000');

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const [userId] = useState(() => {
    let uid = localStorage.getItem('chatUserId');
    if (!uid) {
      uid = 'USER-' + Math.floor(Math.random() * 1000000);
      localStorage.setItem('chatUserId', uid);
    }
    return uid;
  });

  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Join private room
    socket.emit('join_chat', userId);

    // Load history
    socket.on('chat_history', (history) => {
      setMessages(history);
    });

    // Receive message
    socket.on('receive_message', (msg) => {
      setMessages((prev) => [...prev, msg]);
      if (!isOpen) {
        setUnreadCount((prev) => prev + 1);
      }
    });

    return () => {
      socket.off('chat_history');
      socket.off('receive_message');
    };
  }, [userId, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const data = {
      userId,
      text: input.trim(),
      sender: 'user'
    };

    socket.emit('send_message', data);
    setInput('');
  };

  return (
    <div className="chat-widget">
      {/* Floating Button */}
      {!isOpen && (
        <button className="chat-btn" onClick={() => setIsOpen(true)}>
          <MessageSquare size={32} />
          {unreadCount > 0 && <span className="cart-badge" style={{top: '-5px', right: '-5px'}}>{unreadCount}</span>}
        </button>
      )}

      {/* Chat Window */}
      <div className={`chat-window ${isOpen ? 'open' : ''}`}>
        <div className="chat-header">
          <div style={{display: 'flex', alignItems: 'center', gap: '0.8rem'}}>
            <div style={{width: '10px', height: '10px', background: '#4CAF50', borderRadius: '50%'}}></div>
            <div>
              <div style={{fontWeight: 800, fontSize: '0.9rem'}}>Admin Sambal</div>
              <div style={{fontSize: '0.7rem', opacity: 0.8}}>Online</div>
            </div>
          </div>
          <button style={{background:'none', border:'none', color:'white', cursor:'pointer'}} onClick={() => setIsOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="chat-body">
          {messages.length === 0 && (
            <div style={{textAlign: 'center', color: '#999', marginTop: '2rem', fontSize: '0.8rem'}}>
              Halo! Ada yang bisa kami bantu seputar Sambal Perisa? 🌶️
            </div>
          )}
          {messages.map((msg, i) => (
            <div key={i} className={`chat-message ${msg.sender === 'admin' ? 'msg-seller' : 'msg-user'}`}>
              {msg.text}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form className="chat-input-area" onSubmit={handleSend}>
          <input 
            type="text" 
            placeholder="Ketik pesan..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" disabled={!input.trim()}>
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
