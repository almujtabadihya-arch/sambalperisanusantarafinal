import React, { useState, useEffect, useContext } from 'react';
import { ShoppingCart, ArrowRight, Flame, Utensils, Star, CheckCircle, Mail } from 'lucide-react';
import { AppContext } from '../App';

import cumiImg from '../assets/cumi_umami.png';
import tongkolImg from '../assets/tongkol_ngokol.png';
import ayamImg from '../assets/ayam_suwir.png';
import logoImg from '../assets/Sastramiharja.png';

const products = [
  { id: 1, name: 'Sambal Ayam Suwir', theme: 'theme-ayam', price: 25000, volume: '150ml', image: ayamImg, description: 'Suwiran ayam melimpah dengan bumbu meresap sempurna.', pairing: 'Nasi Liwet & Tahu Tempe' },
  { id: 2, name: 'Sambal Tongkol Ngokol', theme: 'theme-tongkol', price: 25000, volume: '150ml', image: tongkolImg, description: 'Ikan tongkol segar yang melimpah di setiap suapan.', pairing: 'Nasi Hangat & Telur Dadar' },
  { id: 3, name: 'Sambal Cumi Umami', theme: 'theme-cumi', price: 25000, volume: '150ml', image: cumiImg, description: 'Sensasi umami cumi kenyal dipadu pedas nampol.', pairing: 'Nasi Kuning & Kerupuk' }
];

const testimonials = [
  { name: 'Andi Pratama', text: 'Gila sih, cumi umaminya bener-bener berasa bumbunya. Nggak pelit potongan cuminya!', role: 'Food Enthusiast' },
  { name: 'Sari Wijaya', text: 'Sambal ayam suwirnya jadi menu wajib setiap makan siang. Pedasnya pas, gurihnya dapet.', role: 'Ibu Rumah Tangga' },
  { name: 'Budi Santoso', text: 'Pengiriman cepet, packing aman banget pake bubble wrap tebel. Rasa? Bintang 5 pokoknya.', role: 'Pelanggan Setia' }
];

export default function Home() {
  const { addToCart } = useContext(AppContext);
  const [selected, setSelected] = useState(null);
  const [activePair, setActivePair] = useState(products[0]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('active'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('.section-reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="home-page">
      <div className="promo-bar">🚚 GRATIS ONGKIR SELURUH JAWA UNTUK PEMBELIAN MIN. 3 BOTOL! 🌶️</div>

      {/* Hero */}
      <section className="hero-section section-reveal active">
        <div className="hero-content">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <span style={{ width: '40px', height: '2px', background: 'var(--primary)' }}></span>
            <span style={{ fontWeight: '800', letterSpacing: '3px', fontSize: '0.7rem', color: 'var(--primary)' }}>PREMIUM CRAFTED SINCE 2024</span>
          </div>
          <h1 className="hero-title">Pedas<br/>Yang Mengubah<br/><span style={{ color: 'var(--primary)' }}>Setiap Suapan.</span></h1>
          <p className="hero-subtitle">Mahakarya bumbu Indonesia yang diracik khusus untuk kamu yang mendambakan kemewahan rasa autentik.</p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn btn-primary" onClick={() => document.getElementById('products').scrollIntoView({ behavior: 'smooth' })}>
              MULAI BELANJA <ArrowRight size={20} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: '700' }}>
               <CheckCircle size={18} color="#4CAF50" /> 100% Halal & Tanpa Pengawet
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <img src={products[2].image} alt="Hero" style={{ width: '85%', filter: 'drop-shadow(0 40px 70px rgba(0,0,0,0.25))' }} />
        </div>
      </section>

      {/* Marquee */}
      <div style={{ background: '#000', color: '#FFF', padding: '1.5rem 0', overflow: 'hidden', whiteSpace: 'nowrap', margin: '2rem 0' }}>
         <div style={{ display: 'inline-block', animation: 'marquee 25s linear infinite', fontWeight: '900', letterSpacing: '2px' }}>
            {[...Array(10)].map((_, i) => (
              <span key={i} style={{ marginRight: '4rem' }}>🔥 SAMBAL SULTAN 🌶️ RESEP RAHASIA NUSANTARA ✨ TERJUAL RIBUAN BOTOL 🚀 PENGIRIMAN SELURUH INDONESIA</span>
            ))}
         </div>
      </div>

      {/* Products */}
      <section id="products" style={{ padding: '6rem 0' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }} className="section-reveal">
          <h2 style={{ fontSize: '3.5rem', fontWeight: '900' }}>Varian Juara</h2>
          <p style={{ color: 'var(--text-light)' }}>Diracik dengan bahan pilihan, menghasilkan rasa yang tak terlupakan.</p>
        </div>
        <div className="products-grid">
          {products.map(p => (
            <div key={p.id} className="product-card-premium section-reveal" 
                 onMouseEnter={() => { document.body.className = p.theme; setActivePair(p); }}
                 onMouseLeave={() => document.body.className = ''}>
              <div style={{ background: '#F9F9F9', borderRadius: '30px', padding: '2rem', marginBottom: '1.5rem' }}>
                <img src={p.image} alt={p.name} onClick={() => setSelected(p)} style={{ cursor: 'pointer' }} />
              </div>
              <h3 style={{ fontSize: '1.8rem', fontWeight: '800' }}>{p.name}</h3>
              <p style={{ color: '#666', marginBottom: '2rem', fontSize: '0.95rem' }}>{p.description}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '0.75rem', color: '#888', fontWeight: '700' }}>HARGA</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: '900', color: 'var(--primary)' }}>Rp 25.000</div>
                </div>
                <button className="btn btn-primary" style={{ padding: '1rem', borderRadius: '20px' }} onClick={() => addToCart(p)}>
                  <ShoppingCart size={24} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: '6rem 0', background: 'rgba(0,0,0,0.02)', borderRadius: '60px' }} className="section-reveal">
         <div className="container">
            <h2 style={{ fontSize: '2.5rem', fontWeight: '900', textAlign: 'center' }}>Apa Kata Mereka?</h2>
            <div className="testi-grid">
               {testimonials.map((t, i) => (
                  <div key={i} className="testi-card">
                     <div style={{ display: 'flex', gap: '0.2rem', marginBottom: '1rem', color: '#FFC107' }}>
                        {[...Array(5)].map((_, j) => <Star key={j} size={16} fill="#FFC107" />)}
                     </div>
                     <p className="testi-text">"{t.text}"</p>
                     <div className="testi-author">{t.name}</div>
                     <div style={{ fontSize: '0.75rem', color: '#999' }}>{t.role}</div>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* Newsletter */}
      <section className="container section-reveal">
         <div className="newsletter">
            <h2 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '1rem' }}>Dapatkan Info Promo Eksklusif!</h2>
            <p style={{ opacity: 0.8 }}>Bergabunglah dengan 10,000+ pecinta pedas lainnya untuk mendapatkan info diskon terbaru.</p>
            <div className="news-input-group">
               <input type="email" placeholder="Alamat Email Anda" className="news-input" />
               <button className="btn btn-primary" style={{ background: 'var(--primary)' }}>BERLANGGANAN</button>
            </div>
         </div>
      </section>

      {/* Detail Modal */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <img src={selected.image} alt={selected.name} style={{ width: '100%', height: '100%', objectFit: 'cover', background: '#F9F9F9' }} />
            <div style={{ padding: '3.5rem' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '1rem' }}>BEST SELLER</div>
              <h2 style={{ fontSize: '3rem', fontWeight: '900', lineHeight: '1', marginBottom: '1.5rem' }}>{selected.name}</h2>
              <p style={{ color: '#666', marginBottom: '2.5rem', fontSize: '1.1rem' }}>{selected.description}</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
                <div>
                   <div style={{ fontWeight: '800', fontSize: '0.75rem', marginBottom: '0.5rem' }}>KOMPOSISI</div>
                   <p style={{ fontSize: '0.85rem', color: '#888' }}>Cabai Rawit, Bawang Merah, Bumbu Rempah Pilihan, Ikan Segar.</p>
                </div>
                <div>
                   <div style={{ fontWeight: '800', fontSize: '0.75rem', marginBottom: '0.5rem' }}>BERAT BERSIH</div>
                   <p style={{ fontSize: '0.85rem', color: '#888' }}>{selected.volume}</p>
                </div>
              </div>
              <button className="btn btn-primary" style={{ width: '100%', padding: '1.2rem', fontSize: '1.1rem' }} onClick={() => { addToCart(selected); setSelected(null); }}>
                BELI SEKARANG - Rp 25.000
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
