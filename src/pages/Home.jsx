import React, { useState, useEffect, useContext } from 'react';
import { ShoppingCart, ArrowRight, Flame, Utensils, Star, CheckCircle } from 'lucide-react';
import { AppContext } from '../App';

import cumiImg from '../assets/cumi_umami.png';
import tongkolImg from '../assets/tongkol_ngokol.png';
import ayamImg from '../assets/ayam_suwir.png';

const products = [
  { id: 1, name: 'Sambal Ayam Suwir', theme: 'theme-ayam', price: 25000, volume: '150ml', image: ayamImg, description: 'Suwiran ayam melimpah dengan bumbu meresap sempurna.', pairing: 'Nasi Liwet & Tahu Tempe' },
  { id: 2, name: 'Sambal Tongkol Ngokol', theme: 'theme-tongkol', price: 25000, volume: '150ml', image: tongkolImg, description: 'Ikan tongkol segar yang melimpah di setiap suapan.', pairing: 'Nasi Hangat & Telur Dadar' },
  { id: 3, name: 'Sambal Cumi Umami', theme: 'theme-cumi', price: 25000, volume: '150ml', image: cumiImg, description: 'Sensasi umami cumi kenyal dipadu pedas nampol.', pairing: 'Nasi Kuning & Kerupuk' }
];

export default function Home() {
  const { addToCart } = useContext(AppContext);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('active'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('.section-reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="home-page">
      {/* Hero */}
      <section className="hero-section section-reveal active">
        <div className="hero-content">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <span style={{ width: '40px', height: '2px', background: 'var(--primary)' }}></span>
            <span style={{ fontWeight: '800', letterSpacing: '3px', fontSize: '0.7rem', color: 'var(--primary)' }}>ASLI NUSANTARA</span>
          </div>
          <h1 className="hero-title">Pedas<br/>Yang Bikin<br/><span style={{ color: 'var(--primary)' }}>Nambah.</span></h1>
          <p className="hero-subtitle">Sambal premium dengan resep asli yang diracik khusus untuk rasa yang tak terlupakan.</p>
          <button className="btn btn-primary" onClick={() => document.getElementById('products').scrollIntoView({ behavior: 'smooth' })}>
            BELI SEKARANG <ArrowRight size={20} />
          </button>
        </div>
        <div style={{ textAlign: 'center' }}>
          <img src={products[1].image} alt="Hero" style={{ width: '80%', filter: 'drop-shadow(0 30px 50px rgba(0,0,0,0.2))' }} />
        </div>
      </section>

      {/* Products */}
      <section id="products" style={{ padding: '4rem 0' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }} className="section-reveal">
          <h2 style={{ fontSize: '3rem', fontWeight: '900' }}>Pilihan Sambal</h2>
          <p style={{ color: 'var(--text-light)' }}>Pilih sensasi pedas favoritmu.</p>
        </div>
        <div className="products-grid">
          {products.map(p => (
            <div key={p.id} className="product-card-premium section-reveal" 
                 onMouseEnter={() => document.body.className = p.theme}
                 onMouseLeave={() => document.body.className = ''}>
              <img src={p.image} alt={p.name} onClick={() => setSelected(p)} style={{ cursor: 'pointer' }} />
              <h3>{p.name}</h3>
              <p style={{ color: '#666', marginBottom: '2rem', fontSize: '0.9rem' }}>{p.description}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--primary)' }}>Rp 25.000</span>
                <button className="btn btn-primary" style={{ padding: '0.8rem' }} onClick={() => addToCart(p)}>
                  <ShoppingCart size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Detail Modal */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <img src={selected.image} alt={selected.name} style={{ width: '100%', height: '100%', objectFit: 'cover', background: '#F9F9F9' }} />
            <div style={{ padding: '3rem' }}>
              <h2 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '1rem' }}>{selected.name}</h2>
              <p style={{ color: '#666', marginBottom: '2rem' }}>{selected.description}</p>
              <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => { addToCart(selected); setSelected(null); }}>
                TAMBAH KE KERANJANG - Rp 25.000
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
