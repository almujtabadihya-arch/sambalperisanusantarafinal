import React, { useState, useContext } from 'react';
import { ShoppingCart, User, Menu } from 'lucide-react';
import { AppContext } from '../App';
import { Link, useNavigate } from 'react-router-dom';

// IMPORT LOGO SULTAN (Biar Vercel nggak bingung)
import logoImg from '../assets/logo.png';

export default function Navbar() {
  const { cart, setIsCartOpen, user, logout } = useContext(AppContext);
  const navigate = useNavigate();

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="navbar" style={{ background: 'white', borderBottom: '1px solid #EEE', position: 'sticky', top: 0, zIndex: 1000 }}>
      <div className="container navbar-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '70px' }}>
        {/* LOGO & TULISAN KIRI ATAS */}
        <Link to="/" className="navbar-brand" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
          <img src={logoImg} alt="Logo" style={{ height: '45px', width: 'auto' }} onError={(e) => e.target.src = 'https://via.placeholder.com/45?text=SP'} />
          <span style={{ fontSize: '1.4rem', fontWeight: '900', color: '#D32F2F', letterSpacing: '1px' }}>SAMBAL PERISA</span>
        </Link>

        {/* ACTIONS KANAN */}
        <div className="navbar-actions" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <button 
            className="btn-icon" 
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            onClick={() => navigate('/track-order')}
          >
            <Menu size={28} />
          </button>

          <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => setIsCartOpen(true)}>
            <ShoppingCart size={24} />
            {cartCount > 0 && (
              <span style={{ position: 'absolute', top: '-10px', right: '-10px', background: '#D32F2F', color: 'white', fontSize: '0.7rem', padding: '2px 7px', borderRadius: '50%', fontWeight: '900' }}>
                {cartCount}
              </span>
            )}
          </div>

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
