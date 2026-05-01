import React, { useState, useContext } from 'react';
import { AppContext } from '../App';
import { Package, Flame, ShoppingCart } from 'lucide-react';

// IMPORT GAMBAR SULTAN (Biar Vercel nggak bingung)
import cumiImg from '../assets/cumi_asli.png';
import tongkolImg from '../assets/tongkol_asli.png';
import ayamImg from '../assets/ayam_asli.png';

export default function Home() {
  const { addToCart } = useContext(AppContext);
  
  const products = [
    { 
      id: 1, 
      name: 'Sambal Cumi Ciamik', 
      price: 25000, 
      img: cumiImg,
      desc: 'Potongan cumi segar yang melimpah dengan racikan cabai pilihan. Gurih, pedas, dan bikin nagih!',
      weight: '150g',
      level: 3
    },
    { 
      id: 2, 
      name: 'Sambal Tongkol Ngokol', 
      price: 25000, 
      img: tongkolImg,
      desc: 'Ikan tongkol suwir asap yang harum berpadu dengan pedasnya sambal nusantara. Juara di lidah!',
      weight: '150g',
      level: 4
    },
    { 
      id: 3, 
      name: 'Sambal Ayam Suwir', 
      price: 25000, 
      img: ayamImg,
      desc: 'Ayam suwir bumbu rempah dengan tingkat kepedasan yang pas. Cocok untuk teman nasi hangat!',
      weight: '150g',
      level: 2
    }
  ];

  return (
    <div className="home-container">
      <section className="hero-section container">
        <div className="hero-content">
          <h1 className="hero-title">RASAKAN SENSASI <span style={{ color: 'var(--primary)' }}>PEDAS SULTAN</span></h1>
          <p style={{ fontSize: '1.1rem', color: '#555', marginBottom: '2rem' }}>
            Dibuat dengan bahan premium 100% segar, tanpa pengawet, dan cinta yang tulus dari dapur nusantara.
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <a href="#products" className="btn btn-primary">BELI SEKARANG</a>
          </div>
        </div>
        <div className="hero-image">
           <img src={cumiImg} alt="Hero" style={{ width: '80%', filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.2))' }} />
        </div>
      </section>

      <section id="products" className="container" style={{ padding: '4rem 0' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '3rem', fontWeight: '900', fontSize: '2.5rem' }}>PRODUK UNGGULAN KAMI</h2>
        <div className="products-grid">
          {products.map(p => (
            <div key={p.id} className="product-card-premium">
              <div style={{ position: 'relative' }}>
                <img src={p.img} alt={p.name} style={{ width: '100%', maxHeight: '200px', objectFit: 'contain' }} />
                <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(255,255,255,0.9)', padding: '5px 12px', borderRadius: '99px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                  {p.weight}
                </div>
              </div>
              
              <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginTop: '15px' }}>{p.name}</h3>
              
              <div style={{ display: 'flex', justifyContent: 'center', gap: '5px', marginBottom: '10px' }}>
                {[...Array(5)].map((_, i) => (
                  <Flame key={i} size={16} color={i < p.level ? '#D32F2F' : '#EEE'} fill={i < p.level ? '#D32F2F' : '#EEE'} />
                ))}
              </div>

              <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '20px', minHeight: '60px' }}>{p.desc}</p>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #EEE', paddingTop: '15px' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: '900' }}>Rp {p.price.toLocaleString()}</span>
                <button className="btn btn-primary" onClick={() => addToCart(p)}>
                  <ShoppingCart size={18} style={{ marginRight: '8px' }} /> AMBIL
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
