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
      weight: '150ml',
      level: 3
    },
    { 
      id: 2, 
      name: 'Sambal Tongkol Ngokol', 
      price: 25000, 
      img: tongkolImg,
      desc: 'Ikan tongkol suwir asap yang harum berpadu dengan pedasnya sambal nusantara. Juara di lidah!',
      weight: '150ml',
      level: 4
    },
    { 
      id: 3, 
      name: 'Sambal Ayam Suwir', 
      price: 25000, 
      img: ayamImg,
      desc: 'Ayam suwir bumbu rempah dengan tingkat kepedasan yang pas. Cocok untuk teman nasi hangat!',
      weight: '150ml',
      level: 2
    }
  ];

  return (
    <div className="home-container">
      {/* HERO SECTION */}
      <section className="hero-section container" style={{ padding: '60px 0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'center' }}>
        <div className="hero-content">
          <h1 className="hero-title" style={{ fontSize: '3.5rem', fontWeight: '900', lineHeight: 1.1, marginBottom: '20px' }}>
            RASAKAN SENSASI <span style={{ color: '#D32F2F' }}>PEDAS SULTAN</span>
          </h1>
          <p style={{ fontSize: '1.2rem', color: '#555', marginBottom: '30px' }}>
            Dibuat dengan bahan premium 100% segar, tanpa pengawet, dan cinta yang tulus dari dapur nusantara.
          </p>
          <a href="#products" style={{ background: '#000', color: 'white', textDecoration: 'none', padding: '15px 35px', borderRadius: '50px', fontWeight: 'bold', fontSize: '1.1rem', display: 'inline-block' }}>BELI SEKARANG</a>
        </div>
        <div className="hero-image" style={{ textAlign: 'right' }}>
           <img src={cumiImg} alt="Hero" style={{ width: '85%', filter: 'drop-shadow(0 20px 50px rgba(0,0,0,0.15))' }} />
        </div>
      </section>

      {/* PRODUCTS SECTION */}
      <section id="products" className="container" style={{ padding: '80px 0' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '50px', fontWeight: '900', fontSize: '2.5rem' }}>PRODUK UNGGULAN KAMI</h2>
        <div className="products-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
          {products.map(p => (
            <div key={p.id} className="product-card-premium" style={{ background: 'white', padding: '25px', borderRadius: '30px', border: '1px solid #F0F0F0', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', transition: 'transform 0.3s' }}>
              <div style={{ position: 'relative', marginBottom: '20px' }}>
                <img src={p.img} alt={p.name} style={{ width: '100%', height: '220px', objectFit: 'contain' }} />
                <div style={{ position: 'absolute', top: '0', right: '0', background: 'white', padding: '6px 15px', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 'bold', boxShadow: '0 5px 15px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Package size={14} /> {p.weight}
                </div>
              </div>
              
              <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '8px' }}>{p.name}</h3>

              <p style={{ fontSize: '0.95rem', color: '#666', marginBottom: '25px', lineHeight: 1.5, minHeight: '60px' }}>{p.desc}</p>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #F5F5F5', paddingTop: '20px' }}>
                <span style={{ fontSize: '1.6rem', fontWeight: '900' }}>Rp {p.price.toLocaleString()}</span>
                <button 
                  style={{ background: '#000', color: 'white', border: 'none', padding: '12px 25px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                  onClick={() => addToCart(p)}
                >
                  <ShoppingCart size={18} /> AMBIL
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
