import React, { useState, useContext } from 'react';
import { ShoppingCart, ArrowRight } from 'lucide-react';
import { AppContext } from '../App';

import cumiImg from '../assets/cumi_asli.png';
import tongkolImg from '../assets/tongkol_asli.png';
import ayamImg from '../assets/ayam_asli.png';

const products = [
  { id: 1, name: 'Sambal Cumi Umami', theme: 'theme-cumi', price: 25000, volume: '150ml', image: cumiImg, description: 'Sensasi umami cumi kenyal dipadu pedas nampol.' },
  { id: 2, name: 'Sambal Tongkol Ngokol', theme: 'theme-tongkol', price: 25000, volume: '150ml', image: tongkolImg, description: 'Ikan tongkol segar yang melimpah di setiap suapan.' },
  { id: 3, name: 'Sambal Ayam Suwir', theme: 'theme-ayam', price: 25000, volume: '150ml', image: ayamImg, description: 'Suwiran ayam melimpah dengan bumbu meresap sempurna.' }
];

export default function Home() {
  const { addToCart } = useContext(AppContext);
  const [selected, setSelected] = useState(null);

  return (
    <div className="home-page">
      {/* Hero */}
      <section className="hero-section" style={{ padding: '60px 0' }}>
        <div className="hero-content">
          <h1 className="hero-title">Sambal Premium<br/>Asli <span style={{ color: 'var(--primary)' }}>Nusantara.</span></h1>
          <p className="hero-subtitle">Nikmati kemewahan rasa dalam setiap suapan. Tanpa pengawet, 100% bahan segar.</p>
          <button className="btn btn-primary" onClick={() => document.getElementById('products').scrollIntoView({ behavior: 'smooth' })}>
            BELI SEKARANG <ArrowRight size={20} />
          </button>
        </div>
        <div style={{ textAlign: 'center' }}>
          <img src={products[0].image} alt="Hero" style={{ width: '80%', filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.15))' }} />
        </div>
      </section>

      {/* Products */}
      <section id="products" style={{ padding: '40px 0' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '3rem', fontWeight: '900' }}>Produk Kami</h2>
          <p style={{ color: '#666' }}>Pilih varian favoritmu.</p>
        </div>
        <div className="products-grid">
          {products.map(p => (
            <div key={p.id} className="product-card-premium" style={{ border: '1px solid #EEE' }}>
              <div style={{ background: '#F9F9F9', borderRadius: '20px', padding: '1.5rem', marginBottom: '1rem' }}>
                <img src={p.image} alt={p.name} onClick={() => setSelected(p)} style={{ cursor: 'pointer', width: '100%' }} />
              </div>
              <h3>{p.name}</h3>
              <p style={{ color: '#666', marginBottom: '1.5rem', fontSize: '0.9rem' }}>{p.description}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '1.4rem', fontWeight: '900', color: 'var(--primary)' }}>Rp 25.000</span>
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
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ background: 'white' }}>
            <img src={selected.image} alt={selected.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ padding: '30px' }}>
              <h2 style={{ fontSize: '2.5rem', fontWeight: '900' }}>{selected.name}</h2>
              <p style={{ color: '#666', margin: '20px 0' }}>{selected.description}</p>
              <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => { addToCart(selected); setSelected(null); }}>
                TAMBAH KE KERANJANG
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
