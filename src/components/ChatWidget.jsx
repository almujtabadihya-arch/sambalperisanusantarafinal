import React, { useState, useEffect, useContext, useRef } from 'react';
import { MessageCircle, Send, X } from 'lucide-react';
import { AppContext } from '../App';

export default function ChatWidget() {
  const { user } = useContext(AppContext);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const scrollRef = useRef(null);
  const previousMessagesLength = useRef(0);
  
  const [tempId] = useState('user-' + Math.random().toString(36).substring(2, 9));
  const currentUserId = user?.email || tempId;

  // SISTEM POLLING (Cek pesan tiap 3 detik - Cocok buat Vercel)
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/messages/${currentUserId}`);
        const data = await res.json();
        if (Array.isArray(data)) {
          if (!isOpen && data.length > previousMessagesLength.current) {
            // Cuma nambah unread kalau itu pesan dari admin (bukan pesan user sendiri)
            const newMessages = data.slice(previousMessagesLength.current);
            const adminReplies = newMessages.filter(m => m.sender === 'admin');
            if (adminReplies.length > 0) {
              setUnreadCount(prev => prev + adminReplies.length);
            }
          }
          previousMessagesLength.current = data.length;
          setMessages(data);
        }
      } catch (err) {}
    };

    fetchMessages(); // Ambil pertama kali
    const interval = setInterval(fetchMessages, 3000); // Cek tiap 3 detik
    return () => clearInterval(interval);
  }, [currentUserId, isOpen]);

  useEffect(() => {
    if (isOpen) {
        setUnreadCount(0); // Reset notif pas dibuka
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
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

    // TAMPILIN LANGSUNG
    setMessages(prev => [...prev, msgData]);
    setInput('');

    // SIMPAN KE DB (Pake API Vercel)
    try {
      await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(msgData)
      });
    } catch (err) {}
  };

  return (
    <div className="chat-widget-container" style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 9999 }}>
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          style={{ background: '#000', color: 'white', border: 'none', borderRadius: '50%', width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 5px 15px rgba(0,0,0,0.2)', position: 'relative' }}
        >
          <MessageCircle size={28} />
          {unreadCount > 0 && (
            <span style={{ position: 'absolute', top: '-5px', right: '-5px', background: '#D32F2F', color: 'white', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold', border: '2px solid white' }}>
              {unreadCount}
            </span>
          )}
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
