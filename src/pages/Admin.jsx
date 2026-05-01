import React, { useState, useEffect } from 'react';
import { ShoppingBag, MessageSquare, Clock, Package, CheckCircle, Truck, AlertCircle, LogOut } from 'lucide-react';

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [orders, setOrders] = useState([]);
  const [chats, setChats] = useState({});
  const [activeTab, setActiveTab] = useState('orders');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) setIsLoggedIn(true);
  }, []);

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
      if (Array.isArray(data)) {
        setOrders(data);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error('Fetch Orders Error:', err);
    }
  };

  const fetchChats = async () => {
    try {
      const res = await fetch('/api/messages/admin/list');
      const data = await res.json();
      if (data && typeof data === 'object') {
        setChats(data);
      }
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
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, notes: notes || 'Update status oleh Admin.' })
      });
      if (res.ok) fetchOrders();
    } catch (err) {
      alert('Gagal update');
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
      {/* Sidebar / Header */}
      <div style={{ background: 'black', color: 'white', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '1.2rem', fontWeight: '900' }}>SAMBAL PERISA - ADMIN</h1>
        <button onClick={handleLogout} style={{ background: 'transparent', border: '1px solid #555', color: 'white', padding: '5px 15px', borderRadius: '5px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <LogOut size={16} /> Keluar
        </button>
      </div>

      <div style={{ display: 'flex', maxWidth: '1400px', margin: '0 auto', padding: '20px', gap: '20px' }}>
        {/* Tab Selector */}
        <div style={{ width: '250px' }}>
          <div onClick={() => setActiveTab('orders')} style={{ padding: '15px', background: activeTab === 'orders' ? 'black' : 'white', color: activeTab === 'orders' ? 'white' : 'black', borderRadius: '12px', cursor: 'pointer', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'bold', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
            <ShoppingBag size={20} /> Pesanan Masuk
          </div>
          <div onClick={() => setActiveTab('chats')} style={{ padding: '15px', background: activeTab === 'chats' ? 'black' : 'white', color: activeTab === 'chats' ? 'white' : 'black', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'bold', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
            <MessageSquare size={20} /> Chat Pelanggan
          </div>
        </div>

        {/* Content Area */}
        <div style={{ flex: 1 }}>
          {activeTab === 'orders' ? (
            <div style={{ display: 'grid', gap: '15px' }}>
              {orders.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', background: 'white', borderRadius: '20px', color: '#888' }}>
                  <Package size={48} style={{ marginBottom: '10px', opacity: 0.3 }} />
                  <p>Belum ada pesanan masuk hari ini.</p>
                </div>
              ) : (
                orders.map((order) => (
                  <div key={order.id || order._id} style={{ background: 'white', padding: '20px', borderRadius: '20px', boxShadow: '0 5px 15px rgba(0,0,0,0.05)', border: '1px solid #eee' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', borderBottom: '1px solid #f0f0f0', paddingBottom: '10px' }}>
                      <div>
                        <div style={{ fontWeight: '900', color: 'var(--primary)' }}>{order.orderId}</div>
                        <div style={{ fontSize: '0.8rem', color: '#888' }}>{new Date(order.date).toLocaleString()}</div>
                      </div>
                      <div style={{ padding: '5px 15px', background: '#FFF3E0', color: '#E65100', borderRadius: '99px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                        {order.status}
                      </div>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                      <div>
                        <p style={{ fontWeight: 'bold', fontSize: '0.8rem', color: '#888', marginBottom: '5px' }}>PEMBELI:</p>
                        <p style={{ fontWeight: 'bold' }}>{order.customer?.name}</p>
                        <p style={{ fontSize: '0.9rem' }}>WA: {order.customer?.whatsapp}</p>
                        <p style={{ fontSize: '0.8rem', color: '#666' }}>{order.customer?.address}</p>
                      </div>
                      <div>
                        <p style={{ fontWeight: 'bold', fontSize: '0.8rem', color: '#888', marginBottom: '5px' }}>DETAIL PESANAN:</p>
                        {order.items?.map((item, i) => (
                          <div key={i} style={{ fontSize: '0.9rem' }}>{item.name} x {item.quantity}</div>
                        ))}
                        <p style={{ fontWeight: '900', marginTop: '10px', fontSize: '1.1rem' }}>Total: Rp {order.totalAmount?.toLocaleString()}</p>
                      </div>
                    </div>

                    <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                      <button onClick={() => updateStatus(order.id, 'Diproses')} style={{ flex: 1, padding: '10px', background: '#E3F2FD', color: '#1565C0', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}>PROSES</button>
                      <button onClick={() => updateStatus(order.id, 'Dikirim')} style={{ flex: 1, padding: '10px', background: '#F3E5F5', color: '#7B1FA2', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}>KIRIM</button>
                      <button onClick={() => updateStatus(order.id, 'Selesai')} style={{ flex: 1, padding: '10px', background: '#E8F5E9', color: '#2E7D32', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}>SELESAI</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div style={{ background: 'white', padding: '20px', borderRadius: '20px', minHeight: '400px' }}>
               <h2 style={{ marginBottom: '20px' }}>Live Chat Admin</h2>
               {Object.keys(chats).length === 0 ? (
                 <p style={{ color: '#888' }}>Belum ada chat masuk.</p>
               ) : (
                 Object.keys(chats).map(userId => (
                   <div key={userId} style={{ borderBottom: '1px solid #eee', padding: '15px 0' }}>
                     <p style={{ fontWeight: 'bold' }}>{userId}</p>
                     <p style={{ fontSize: '0.9rem', color: '#666' }}>{chats[userId][chats[userId].length - 1]?.text}</p>
                   </div>
                 ))
               )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
