import React, { useState, useEffect, useContext } from 'react';
import { ShoppingCart, ArrowRight, Flame, Utensils, Star, ShieldCheck } from 'lucide-react';
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
      {/* Hero */}
      <section className="hero-section section-reveal active">
        <div className="hero-content">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <span style={{ width: '40px', height: '2px', background: 'var(--primary)' }}></span>
            <span style={{ fontWeight: '800', letterSpacing: '3px', fontSize: '0.7rem', color: 'var(--primary)' }}>CRAFTED WITH PASSION</span>
          </div>
          <h1 className="hero-title">Pedas<br/>Yang Mengubah<br/><span style={{ color: 'var(--primary)' }}>Suasana.</span></h1>
          <p className="hero-subtitle">Mahakarya bumbu Indonesia yang diracik khusus untuk kemewahan rasa dalam setiap hidangan Anda.</p>
          <button className="btn btn-primary" onClick={() => document.getElementById('products').scrollIntoView({ behavior: 'smooth' })}>
            BELI SEKARANG <ArrowRight size={20} />
          </button>
        </div>
        <div style={{ textAlign: 'center' }}>
          <img src={products[1].image} alt="Hero" style={{ width: '80%', filter: 'drop-shadow(0 30px 50px rgba(0,0,0,0.2))' }} />
        </div>
      </section>

      {/* Marquee */}
      <div style={{ background: '#000', color: '#FFF', padding: '1.5rem 0', overflow: 'hidden', whiteSpace: 'nowrap', margin: '4rem 0' }}>
         <div style={{ display: 'inline-block', animation: 'marquee 20s linear infinite', fontWeight: '900', letterSpacing: '2px' }}>
            {[...Array(10)].map((_, i) => (
              <span key={i} style={{ marginRight: '4rem' }}>🔥 SENSASI PEDAS ASLI INDONESIA 🌶️ RESEP WARISAN LELUHUR ✨ KUALITAS PREMIUM</span>
            ))}
         </div>
      </div>

      {/* Products */}
      <section id="products" style={{ padding: '4rem 0' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }} className="section-reveal">
          <h2 style={{ fontSize: '3rem', fontWeight: '900' }}>Koleksi Utama</h2>
          <p style={{ color: 'var(--text-light)' }}>Pilih sensasi pedas favoritmu.</p>
        </div>
        <div className="products-grid">
          {products.map(p => (
            <div key={p.id} className="product-card-premium section-reveal" 
                 onMouseEnter={() => { document.body.className = p.theme; setActivePair(p); }}
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

      {/* Pairing */}
      <section className="section-reveal" style={{ padding: '6rem 0' }}>
        <div className="food-pairing-card">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: 'var(--primary)', fontWeight: '800', marginBottom: '1.5rem' }}>
              <Utensils size={20} /> SARAN PENYAJIAN
            </div>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '900', lineHeight: '1.2', marginBottom: '2rem' }}>
              {activePair.name} paling pas dinikmati dengan <span style={{ color: 'var(--primary)' }}>{activePair.pairing}</span>.
            </h2>
            <button className="btn btn-outline" onClick={() => addToCart(activePair)}>PESAN SEKARANG</button>
          </div>
          <div style={{ textAlign: 'center' }}>
            <img src={activePair.image} alt="Pair" style={{ width: '70%', borderRadius: '30px' }} />
          </div>
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
              <div style={{ marginBottom: '3rem' }}>
                <div style={{ fontWeight: '800', color: 'var(--primary)', fontSize: '0.8rem' }}>KOMPOSISI</div>
                <p style={{ fontSize: '0.9rem', color: '#888' }}>Cabai Pilihan, Bumbu Rahasia Nusantara, Bahan Segar Tanpa Pengawet.</p>
              </div>
              <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => { addToCart(selected); setSelected(null); }}>
                MASUKKAN KERANJANG - Rp 25.000
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
