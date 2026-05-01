import React, { useState, useEffect, useContext, useRef } from 'react';
import { MessageCircle, Send, X } from 'lucide-react';
import { AppContext } from '../App';
import { io } from 'socket.io-client';

const getSocketUrl = () => {
    if (window.location.hostname === 'localhost') return 'http://localhost:5000';
    return window.location.origin;
};

export default function ChatWidget() {
  const { user } = useContext(AppContext);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [socket, setSocket] = useState(null);
  const scrollRef = useRef(null);
  const isHistoryLoaded = useRef(false);

  const [tempId] = useState('user-' + Math.random().toString(36).substring(2, 9));
  const currentUserId = user?.email || tempId;
  const baseUrl = getSocketUrl();

  useEffect(() => {
    const newSocket = io(baseUrl, { transports: ['websocket', 'polling'] });
    setSocket(newSocket);

    newSocket.emit('join_chat', currentUserId);

    // Ambil history HANYA SEKALI
    if (!isHistoryLoaded.current) {
        fetch(`${baseUrl}/api/messages/${currentUserId}`)
          .then(res => res.json())
          .then(data => {
            if (Array.isArray(data)) setMessages(data);
            isHistoryLoaded.current = true;
          })
          .catch(() => {});
    }

    newSocket.on('receive_message', (msg) => {
      setMessages(prev => {
          const exists = prev.find(p => p.timestamp === msg.timestamp && p.text === msg.text);
          if (exists) return prev;
          return [...prev, msg];
      });
    });

    return () => newSocket.disconnect();
  }, [currentUserId, baseUrl]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;

    const msgData = {
      userId: currentUserId,
      text: text,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    // TAMPILIN LANGSUNG (INSTAN & PAKSA)
    setMessages(prev => [...prev, msgData]);
    setInput('');

    // Kirim ke Socket
    if (socket) {
        socket.emit('send_message', msgData);
    }

    // Simpan ke DB
    try {
      await fetch(`${baseUrl}/api/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(msgData)
      });
    } catch (err) {}
  };

  return (
    <div className="chat-widget-container">
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
                <div style={{ fontSize: '0.7rem', opacity: 0.7 }}>Online</div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
              <X size={20} />
            </button>
          </div>

          <div className="chat-messages" style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '15px' }}>
            {messages.map((m, i) => (
              <div key={i} className={`chat-bubble ${m.sender === 'user' ? 'user' : 'admin'}`} 
                   style={{ 
                     alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                     background: m.sender === 'user' ? 'var(--primary)' : 'white',
                     color: m.sender === 'user' ? 'white' : 'black',
                     padding: '10px 15px', borderRadius: '18px', maxWidth: '85%',
                     boxShadow: '0 3px 8px rgba(0,0,0,0.08)', fontSize: '0.95rem',
                     wordBreak: 'break-word'
                   }}>
                {m.text}
              </div>
            ))}
            <div ref={scrollRef} />
          </div>

          <form onSubmit={handleSend} className="chat-input-area" style={{ borderTop: '1px solid #EEE' }}>
            <input 
              type="text" 
              placeholder="Tulis pesan..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{ width: '100%', border: 'none', outline: 'none', padding: '15px' }}
            />
            <button type="submit" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)', padding: '0 15px' }}>
              <Send size={22} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
