import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../App';
import { useNavigate } from 'react-router-dom';
import { MapPin, CreditCard, Banknote, Truck, CheckCircle, ChevronLeft } from 'lucide-react';

export default function Checkout() {
  const { cart, user, setCart } = useContext(AppContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: '',
    address: '',
    postalCode: '',
    notes: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);

  useEffect(() => {
    if (!user) navigate('/auth');
    if (cart.length === 0 && !orderSuccess) navigate('/');
  }, [user, navigate, cart, orderSuccess]);

  const total = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const shipping = 15000;

  const handleProcessOrder = async (e) => {
    e.preventDefault();
    if (!paymentMethod) {
      alert('Pilih metode pembayaran dulu ya kak!');
      return;
    }
    
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: formData,
          items: cart,
          totalAmount: total + shipping,
          paymentMethod
        })
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Gagal membuat pesanan');
      
      setCreatedOrder(data);
      setOrderSuccess(true);
      setCart([]); // Kosongkan keranjang
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  if (orderSuccess) {
    return (
      <div style={{padding: '60px 20px', textAlign: 'center', minHeight: '80vh'}}>
        <CheckCircle size={80} color="#4CAF50" style={{marginBottom: '20px'}} />
        <h2 style={{fontSize: '2rem', fontWeight: '900'}}>PESANAN BERHASIL!</h2>
        <p style={{color: '#666', marginBottom: '30px'}}>Pesanan Kakak sedang kami proses. Mohon tunggu kabar selanjutnya ya!</p>
        
        <div style={{background: '#F9F9F9', padding: '30px', borderRadius: '20px', border: '2px dashed #DDD', maxWidth: '500px', margin: '0 auto 40px'}}>
          <p style={{marginBottom: '10px', fontSize: '0.9rem', color: '#888'}}>SIMPAN NOMOR PESANAN ANDA:</p>
          <h1 style={{fontSize: '2.5rem', color: 'var(--primary)', fontWeight: '900'}}>{createdOrder?.orderId || createdOrder?.id}</h1>
        </div>

        <button className="btn btn-primary" onClick={() => navigate('/')}>KEMBALI KE BERANDA</button>
      </div>
    );
  }

  return (
    <div style={{padding: '40px 0'}}>
      <button onClick={() => navigate(-1)} style={{background:'none', border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'20px', fontWeight:'700'}}>
        <ChevronLeft size={20} /> KEMBALI
      </button>

      <div style={{display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '30px'}}>
        <form onSubmit={handleProcessOrder}>
          <div style={{background:'white', padding:'30px', borderRadius:'24px', border:'1px solid #EEE', marginBottom:'30px'}}>
            <h3 style={{marginBottom:'20px', display:'flex', alignItems:'center', gap:'10px'}}><MapPin size={24} /> ALAMAT PENGIRIMAN</h3>
            <div style={{marginBottom:'15px'}}>
              <label style={{display:'block', fontWeight:'bold', fontSize:'0.8rem', marginBottom:'5px'}}>NAMA PENERIMA</label>
              <input type="text" style={{width:'100%', padding:'12px', borderRadius:'10px', border:'1px solid #DDD'}} required 
                value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'15px', marginBottom:'15px'}}>
              <div>
                <label style={{display:'block', fontWeight:'bold', fontSize:'0.8rem', marginBottom:'5px'}}>WHATSAPP</label>
                <input type="tel" style={{width:'100%', padding:'12px', borderRadius:'10px', border:'1px solid #DDD'}} required 
                  value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>
              <div>
                <label style={{display:'block', fontWeight:'bold', fontSize:'0.8rem', marginBottom:'5px'}}>KODE POS</label>
                <input type="number" style={{width:'100%', padding:'12px', borderRadius:'10px', border:'1px solid #DDD'}} required 
                  value={formData.postalCode} onChange={e => setFormData({...formData, postalCode: e.target.value})} />
              </div>
            </div>
            <div>
              <label style={{display:'block', fontWeight:'bold', fontSize:'0.8rem', marginBottom:'5px'}}>ALAMAT LENGKAP</label>
              <textarea rows="3" style={{width:'100%', padding:'12px', borderRadius:'10px', border:'1px solid #DDD'}} required 
                value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})}></textarea>
            </div>
          </div>

          <div style={{background:'white', padding:'30px', borderRadius:'24px', border:'1px solid #EEE'}}>
            <h3 style={{marginBottom:'20px', display:'flex', alignItems:'center', gap:'10px'}}><CreditCard size={24} /> METODE PEMBAYARAN</h3>
            <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'15px'}}>
              <div onClick={() => setPaymentMethod('dana')} style={{padding:'20px', border: paymentMethod === 'dana' ? '2px solid black' : '1px solid #EEE', borderRadius:'15px', cursor:'pointer', textAlign:'center'}}>
                <div style={{color:'#118ee9', fontWeight:'900', fontSize:'1.2rem'}}>DANA</div>
              </div>
              <div onClick={() => setPaymentMethod('transfer')} style={{padding:'20px', border: paymentMethod === 'transfer' ? '2px solid black' : '1px solid #EEE', borderRadius:'15px', cursor:'pointer', textAlign:'center'}}>
                <Banknote size={24} style={{marginBottom:'5px'}} />
                <div style={{fontSize:'0.8rem', fontWeight:'bold'}}>TRANSFER</div>
              </div>
              <div onClick={() => setPaymentMethod('cod')} style={{padding:'20px', border: paymentMethod === 'cod' ? '2px solid black' : '1px solid #EEE', borderRadius:'15px', cursor:'pointer', textAlign:'center'}}>
                <Truck size={24} style={{marginBottom:'5px'}} />
                <div style={{fontSize:'0.8rem', fontWeight:'bold'}}>COD</div>
              </div>
            </div>
          </div>
        </form>

        <div style={{background:'white', padding:'30px', borderRadius:'24px', border:'1px solid #EEE', height:'fit-content', position:'sticky', top:'100px'}}>
          <h3 style={{marginBottom:'20px'}}>RINGKASAN</h3>
          {cart.map(item => (
            <div key={item.id} style={{display:'flex', justifyContent:'space-between', marginBottom:'10px', fontSize:'0.9rem'}}>
              <span>{item.name} x {item.qty}</span>
              <span style={{fontWeight:'700'}}>Rp {(item.price * item.qty).toLocaleString('id-ID')}</span>
            </div>
          ))}
          <hr style={{margin:'20px 0', border:'none', borderTop:'1px dashed #EEE'}} />
          <div style={{display:'flex', justifyContent:'space-between', marginBottom:'10px', color:'#888'}}>
            <span>Ongkir</span>
            <span>Rp {shipping.toLocaleString('id-ID')}</span>
          </div>
          <div style={{display:'flex', justifyContent:'space-between', fontSize:'1.4rem', fontWeight:'900', color:'var(--primary)'}}>
            <span>Total</span>
            <span>Rp {(total + shipping).toLocaleString('id-ID')}</span>
          </div>
          <button onClick={handleProcessOrder} className="btn btn-primary" style={{width:'100%', marginTop:'30px', padding:'1rem', fontSize:'1.1rem'}}>
            PROSES SEKARANG
          </button>
        </div>
      </div>
    </div>
  );
}
