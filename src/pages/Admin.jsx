import React, { useState, useEffect } from 'react';

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('adminToken') === 'true';
  });
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [orders, setOrders] = useState([]);
  const [chats, setChats] = useState({});
  const [activeTab, setActiveTab] = useState('orders');
  const [selectedUserChat, setSelectedUserChat] = useState(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    if (isLoggedIn) {
      fetchOrders();
      fetchChats();
      const interval = setInterval(() => {
        fetchOrders();
        fetchChats();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isLoggedIn]);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (Array.isArray(data)) setOrders(data);
    } catch (err) {}
  };

  const fetchChats = async () => {
    try {
      const res = await fetch('/api/messages/admin/list');
      const data = await res.json();
      if (data && typeof data === 'object') setChats(data);
    } catch (err) {}
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin123') {
      localStorage.setItem('adminToken', 'true');
      setIsLoggedIn(true);
    } else {
      alert('Login Gagal!');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsLoggedIn(false);
  };

  const updateStatus = async (id, newStatus) => {
    const notes = prompt("Catatan Logistik:", `Pesanan dalam status ${newStatus}`);
    try {
      await fetch(`/api/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, notes: notes || 'Update status oleh Admin.' })
      });
      fetchOrders();
    } catch (err) {
      alert('Gagal update');
    }
  };

  const sendReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedUserChat) return;

    const msgData = {
      userId: selectedUserChat,
      text: replyText.trim(),
      sender: 'admin',
      timestamp: new Date().toISOString()
    };

    try {
      await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(msgData)
      });
      setReplyText('');
      fetchChats();
    } catch (err) {
      alert('Gagal kirim');
    }
  };

  if (!isLoggedIn) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f0f0', padding: '20px' }}>
        <div style={{ background: 'white', padding: '40px', borderRadius: '20px', width: '100%', maxWidth: '400px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '30px', fontWeight: '900' }}>ADMIN LOGIN</h2>
          <form onSubmit={handleLogin}>
            <input type="text" placeholder="Username" style={{ width: '100%', padding: '15px', marginBottom: '15px', borderRadius: '10px', border: '1px solid #ddd' }} value={username} onChange={e => setUsername(e.target.value)} required />
            <input type="password" placeholder="Password" style={{ width: '100%', padding: '15px', marginBottom: '25px', borderRadius: '10px', border: '1px solid #ddd' }} value={password} onChange={e => setPassword(e.target.value)} required />
            <button type="submit" style={{ width: '100%', padding: '15px', background: 'black', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>MASUK SEKARANG</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      <div style={{ background: 'black', color: 'white', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '1.2rem', fontWeight: '900' }}>SAMBAL PERISA - ADMIN</h1>
        <button onClick={handleLogout} style={{ background: 'transparent', border: '1px solid #555', color: 'white', padding: '5px 15px', borderRadius: '5px', cursor: 'pointer' }}>
           🚪 Keluar
        </button>
      </div>

      <div style={{ display: 'flex', maxWidth: '1400px', margin: '0 auto', padding: '20px', gap: '20px' }}>
        <div style={{ width: '250px' }}>
          <div onClick={() => setActiveTab('orders')} style={{ padding: '15px', background: activeTab === 'orders' ? 'black' : 'white', color: activeTab === 'orders' ? 'white' : 'black', borderRadius: '12px', cursor: 'pointer', marginBottom: '10px', fontWeight: 'bold' }}>
            📦 Pesanan Masuk
          </div>
          <div onClick={() => setActiveTab('chats')} style={{ padding: '15px', background: activeTab === 'chats' ? 'black' : 'white', color: activeTab === 'chats' ? 'white' : 'black', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' }}>
            💬 Chat Pelanggan
          </div>
        </div>

        <div style={{ flex: 1 }}>
          {activeTab === 'orders' ? (
            <div style={{ display: 'grid', gap: '15px' }}>
              {orders.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', background: 'white', borderRadius: '20px', color: '#888' }}>
                  <p>📭 Belum ada pesanan masuk.</p>
                </div>
              ) : (
                orders.map((order) => (
                  <div key={order.id || order._id} style={{ background: 'white', padding: '20px', borderRadius: '20px', border: '1px solid #eee' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                      <div>
                        <div style={{ fontWeight: '900', color: '#D32F2F' }}>{order.orderId}</div>
                        <div style={{ fontSize: '0.8rem', color: '#888' }}>{new Date(order.date).toLocaleString()}</div>
                      </div>
                      <div style={{ padding: '5px 15px', background: '#FFF3E0', color: '#E65100', borderRadius: '99px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                        {order.status}
                      </div>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                      <div>
                        <p style={{ fontWeight: 'bold', fontSize: '0.8rem', color: '#888' }}>PEMBELI:</p>
                        <p>{order.customer?.name}</p>
                        <p style={{ fontSize: '0.9rem' }}>WA: {order.customer?.whatsapp}</p>
                      </div>
                      <div>
                        <p style={{ fontWeight: 'bold', fontSize: '0.8rem', color: '#888' }}>DETAIL:</p>
                        {order.items?.map((item, i) => (
                          <div key={i} style={{ fontSize: '0.9rem' }}>{item.name} x {item.quantity}</div>
                        ))}
                        <p style={{ fontWeight: '900', marginTop: '5px' }}>Total: Rp {order.totalAmount?.toLocaleString()}</p>
                      </div>
                    </div>

                    <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                      <button onClick={() => updateStatus(order.id, 'Diproses')} style={{ flex: 1, padding: '10px', background: '#E3F2FD', color: '#1565C0', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}>⚡ PROSES</button>
                      <button onClick={() => updateStatus(order.id, 'Dikirim')} style={{ flex: 1, padding: '10px', background: '#F3E5F5', color: '#7B1FA2', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}>🚚 KIRIM</button>
                      <button onClick={() => updateStatus(order.id, 'Selesai')} style={{ flex: 1, padding: '10px', background: '#E8F5E9', color: '#2E7D32', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}>✅ SELESAI</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '20px', background: 'white', borderRadius: '20px', overflow: 'hidden', minHeight: '500px', border: '1px solid #eee' }}>
               {/* List Users */}
               <div style={{ borderRight: '1px solid #eee', overflowY: 'auto' }}>
                 <div style={{ padding: '20px', borderBottom: '1px solid #eee', fontWeight: '900' }}>DAFTAR CHAT</div>
                 {Object.keys(chats).map(userId => (
                   <div key={userId} onClick={() => setSelectedUserChat(userId)} style={{ padding: '15px', borderBottom: '1px solid #f9f9f9', cursor: 'pointer', background: selectedUserChat === userId ? '#f0f0f0' : 'white' }}>
                     <p style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>👤 {userId}</p>
                     <p style={{ fontSize: '0.8rem', color: '#888', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{chats[userId][chats[userId].length-1]?.text}</p>
                   </div>
                 ))}
               </div>

               {/* Chat Window */}
               <div style={{ display: 'flex', flexDirection: 'column' }}>
                 {selectedUserChat ? (
                   <>
                    <div style={{ padding: '20px', borderBottom: '1px solid #eee', fontWeight: 'bold' }}>Chat: {selectedUserChat}</div>
                    <div style={{ flex: 1, padding: '20px', overflowY: 'auto', background: '#fafafa', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {chats[selectedUserChat]?.map((m, i) => (
                        <div key={i} style={{ alignSelf: m.sender === 'admin' ? 'flex-end' : 'flex-start', background: m.sender === 'admin' ? 'black' : 'white', color: m.sender === 'admin' ? 'white' : 'black', padding: '10px 15px', borderRadius: '15px', maxWidth: '80%', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                          {m.text}
                        </div>
                      ))}
                    </div>
                    <form onSubmit={sendReply} style={{ padding: '20px', borderTop: '1px solid #eee', display: 'flex', gap: '10px' }}>
                      <input type="text" placeholder="Tulis balasan..." style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid #ddd' }} value={replyText} onChange={e => setReplyText(e.target.value)} />
                      <button type="submit" style={{ padding: '12px 25px', background: 'black', color: 'white', borderRadius: '10px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>KIRIM</button>
                    </form>
                   </>
                 ) : (
                   <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>Pilih chat untuk membalas</div>
                 )}
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
