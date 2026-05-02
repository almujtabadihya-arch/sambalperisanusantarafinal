import React, { useState, useEffect } from 'react';
import { Package, Truck, CheckCircle, Clock, Search, MapPin } from 'lucide-react';

export default function OrderTracking() {
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchOrder = async (e) => {
    if (e) e.preventDefault();
    if (!orderId.trim()) return;

    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/orders?t=' + Date.now());
      let data = [];
      try { data = await res.json(); } catch(e) {}
      if (!Array.isArray(data)) data = [];
      
      const localData = JSON.parse(localStorage.getItem('sultan_orders') || '[]');
      const allData = [...localData, ...data];
      
      // Cari orderId yang cocok (bisa case-insensitive)
      const found = allData.find(o => o.orderId.toUpperCase() === orderId.trim().toUpperCase());
      
      if (found) {
        setOrder(found);
      } else {
        setError('Pesanan tidak ditemukan! Cek kembali ID pesanan Kakak.');
        setOrder(null);
      }
    } catch (err) {
      setError('Sistem sedang sibuk. Coba beberapa saat lagi.');
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh kalau lagi nungguin paket
  useEffect(() => {
    let interval;
    if (order && order.status !== 'Selesai') {
      interval = setInterval(() => {
        fetchOrder();
      }, 10000); // Cek tiap 10 detik
    }
    return () => clearInterval(interval);
  }, [order, orderId]);

  const getStatusStep = (status) => {
    const steps = ['Menunggu Pembayaran', 'Diproses', 'Dikirim', 'Selesai'];
    return steps.indexOf(status);
  };

  return (
    <div className="container" style={{ padding: '60px 20px', minHeight: '80vh' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        <h1 style={{ textAlign: 'center', fontWeight: '900', marginBottom: '10px' }}>LACAK PESANAN</h1>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '40px' }}>Masukkan nomor pesanan Anda untuk melihat status pengiriman.</p>

        <form onSubmit={fetchOrder} style={{ display: 'flex', gap: '10px', marginBottom: '40px' }}>
          <input 
            type="text" 
            placeholder="Contoh: PRSA-A1B2C3" 
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            style={{ flex: 1, padding: '15px', borderRadius: '12px', border: '2px solid #EEE', fontSize: '1rem', outline: 'none' }}
          />
          <button type="submit" className="btn btn-primary" style={{ padding: '0 30px' }}>
            <Search size={20} />
          </button>
        </form>

        {loading && <p style={{ textAlign: 'center' }}>Mencari data pesanan...</p>}
        {error && <div style={{ padding: '20px', background: '#FFEBEE', color: '#D32F2F', borderRadius: '12px', textAlign: 'center', marginBottom: '20px' }}>{error}</div>}

        {order && (
          <div style={{ background: 'white', padding: '30px', borderRadius: '25px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)', border: '1px solid #F0F0F0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid #F0F0F0', paddingBottom: '20px' }}>
              <div>
                <p style={{ color: '#888', fontSize: '0.8rem', fontWeight: 'bold' }}>NOMOR PESANAN</p>
                <h2 style={{ fontWeight: '900', color: 'var(--primary)' }}>{order.orderId}</h2>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ color: '#888', fontSize: '0.8rem', fontWeight: 'bold' }}>STATUS SAAT INI</p>
                <span style={{ padding: '5px 15px', background: '#E8F5E9', color: '#2E7D32', borderRadius: '99px', fontWeight: 'bold', fontSize: '0.9rem' }}>{order.status}</span>
              </div>
            </div>

            {/* PROGRESS VISUAL */}
            <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', marginBottom: '50px', padding: '0 10px' }}>
               <div style={{ position: 'absolute', top: '15px', left: '10%', right: '10%', height: '2px', background: '#EEE', zIndex: 0 }}>
                 <div style={{ height: '100%', background: 'var(--primary)', width: `${(getStatusStep(order.status) / 3) * 100}%`, transition: 'width 0.5s' }}></div>
               </div>
               {['Menunggu', 'Diproses', 'Dikirim', 'Selesai'].map((step, i) => (
                 <div key={i} style={{ textAlign: 'center', zIndex: 1, position: 'relative' }}>
                   <div style={{ width: '32px', height: '32px', background: getStatusStep(order.status) >= i ? 'var(--primary)' : 'white', border: `2px solid ${getStatusStep(order.status) >= i ? 'var(--primary)' : '#EEE'}`, borderRadius: '50%', margin: '0 auto 10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: getStatusStep(order.status) >= i ? 'white' : '#CCC' }}>
                     {i === 0 && <Clock size={16} />}
                     {i === 1 && <Package size={16} />}
                     {i === 2 && <Truck size={16} />}
                     {i === 3 && <CheckCircle size={16} />}
                   </div>
                   <p style={{ fontSize: '0.7rem', fontWeight: 'bold', color: getStatusStep(order.status) >= i ? 'black' : '#CCC' }}>{step}</p>
                 </div>
               ))}
            </div>

            {/* LOGISTIK HISTORY */}
            <div style={{ borderTop: '1px solid #F0F0F0', paddingTop: '25px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '900', marginBottom: '20px' }}>RIWAYAT PENGIRIMAN</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {order.history && [...order.history].reverse().map((h, i) => (
                  <div key={i} style={{ display: 'flex', gap: '15px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ width: '10px', height: '10px', background: i === 0 ? 'var(--primary)' : '#CCC', borderRadius: '50%' }}></div>
                      {i !== order.history.length - 1 && <div style={{ width: '2px', flex: 1, background: '#EEE' }}></div>}
                    </div>
                    <div>
                      <p style={{ fontWeight: 'bold', fontSize: '0.9rem', color: i === 0 ? 'black' : '#666' }}>{h.status}</p>
                      <p style={{ fontSize: '0.8rem', color: '#888' }}>{new Date(h.date).toLocaleString()}</p>
                      <p style={{ fontSize: '0.85rem', color: '#444', marginTop: '5px' }}>{h.notes}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
