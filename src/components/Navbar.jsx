import React, { useState, useContext } from 'react';
import { ShoppingCart, User, Menu } from 'lucide-react';
import { AppContext } from '../App';
import { Link } from 'react-router-dom';

// IMPORT LOGO SULTAN (Cara Paling Aman)
import logoImg from '../assets/Sastramiharja.png';

export default function Navbar() {
  const { cart, setIsCartOpen, user, logout } = useContext(AppContext);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="navbar" style={{ background: 'white', borderBottom: '1px solid #EEE', position: 'sticky', top: 0, zIndex: 1000 }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '70px', padding: '0 20px' }}>
        
        {/* LOGO & TULISAN (FIX) */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <img src={logoImg} alt="Logo" style={{ height: '45px', width: 'auto' }} />
          <span style={{ fontSize: '1.4rem', fontWeight: '900', color: '#D32F2F', letterSpacing: '1px' }}>PERISA NUSANTARA</span>
        </Link>

        {/* ACTIONS */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          
          {/* TOMBOL GARIS TIGA (Pake Link Langsung Biar Joss) */}
          <Link to="/track-order" style={{ color: 'black', textDecoration: 'none' }}>
            <Menu size={32} />
          </Link>

          {/* KERANJANG */}
          <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => setIsCartOpen(true)}>
            <ShoppingCart size={26} />
            {cartCount > 0 && (
              <span style={{ position: 'absolute', top: '-10px', right: '-10px', background: '#D32F2F', color: 'white', fontSize: '0.75rem', padding: '2px 7px', borderRadius: '50%', fontWeight: '900' }}>
                {cartCount}
              </span>
            )}
          </div>

          {/* USER / LOGIN */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontWeight: '800', fontSize: '0.9rem' }}>{user.name}</span>
              <button onClick={logout} style={{ background: '#000', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Keluar</button>
            </div>
          ) : (
            <Link to="/auth" style={{ background: '#000', color: 'white', textDecoration: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={18} /> Masuk
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
