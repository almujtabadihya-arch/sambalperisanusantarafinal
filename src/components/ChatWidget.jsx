import React, { useState, useEffect, useContext, useRef } from 'react';
import { MessageCircle, Send, X, User } from 'lucide-react';
import { AppContext } from '../App';
import { io } from 'socket.io-client';

// Smart Connection: Otomatis deteksi jalur terbaik
const SOCKET_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000' 
  : window.location.origin;

export default function ChatWidget() {
  const { user } = useContext(AppContext);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [socket, setSocket] = useState(null);
  const scrollRef = useRef(null);

  // Pakai ID unik per session kalau belum login
  const [tempId] = useState('user-' + Math.random().toString(36).substring(2, 9));
  const currentUserId = user?.email || tempId;

  useEffect(() => {
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    newSocket.emit('join_chat', currentUserId);

    // Ambil history chat lama
    fetch(`${SOCKET_URL}/api/messages/${currentUserId}`)
      .then(res => res.json())
      .then(data => setMessages(data))
      .catch(() => {});

    newSocket.on('receive_message', (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    return () => newSocket.disconnect();
  }, [currentUserId]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || !socket) return;

    const msgData = {
      userId: currentUserId,
      text: input.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    socket.emit('send_message', msgData);
    setMessages(prev => [...prev, msgData]);
    setInput('');

    // Save to DB
    try {
      await fetch(`${SOCKET_URL}/api/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(msgData)
      });
    } catch (err) {}
  };

  return (
    <div className="chat-widget-container">
      {/* Tombol Chat Sultan di Kanan Bawah */}
      {!isOpen && (
        <button className="chat-toggle-btn" onClick={() => setIsOpen(true)}>
          <MessageCircle size={28} />
        </button>
      )}

      {isOpen && (
        <div className="chat-window-premium">
          <div className="chat-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div className="chat-avatar">SP</div>
              <div>
                <div style={{ fontWeight: '800', fontSize: '0.9rem' }}>Admin Sambal Perisa</div>
                <div style={{ fontSize: '0.7rem', opacity: 0.7 }}>Online • Siap Melayani</div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
              <X size={20} />
            </button>
          </div>

          <div className="chat-messages">
            {messages.length === 0 && (
              <div style={{ textAlign: 'center', marginTop: '20px', color: '#888', fontSize: '0.8rem' }}>
                Halo! Ada yang bisa kami bantu?
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`chat-bubble ${m.sender === 'user' ? 'user' : 'admin'}`}>
                {m.text}
              </div>
            ))}
            <div ref={scrollRef} />
          </div>

          <form onSubmit={handleSend} className="chat-input-area">
            <input 
              type="text" 
              placeholder="Tulis pesan..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit">
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
