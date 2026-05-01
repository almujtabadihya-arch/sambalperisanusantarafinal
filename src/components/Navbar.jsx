import React, { useState, useContext } from 'react';
import { ShoppingCart, User, Menu, X, Search, Package } from 'lucide-react';
import { AppContext } from '../App';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const { cart, setIsCartOpen, user, logout } = useContext(AppContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        {/* LOGO SULTAN */}
        <Link to="/" className="navbar-brand">
          <img src="/src/assets/logo.png" alt="Logo" style={{ height: '45px' }} onError={(e) => e.target.src = 'https://via.placeholder.com/45?text=SP'} />
          <span>PERISA NUSANTARA</span>
        </Link>

        {/* ACTIONS */}
        <div className="navbar-actions">
          {/* Tombol Lacak Pesanan (Garis Tiga yang lu mau) */}
          <button 
            className="btn btn-outline" 
            style={{ padding: '8px', border: 'none' }}
            onClick={() => navigate('/track-order')}
            title="Lacak Pesanan"
          >
            <Menu size={28} color="black" />
          </button>

          <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => setIsCartOpen(true)}>
            <ShoppingCart size={24} />
            {cartCount > 0 && (
              <span style={{ position: 'absolute', top: '-8px', right: '-8px', background: 'var(--primary)', color: 'white', fontSize: '0.7rem', padding: '2px 6px', borderRadius: '50%', fontWeight: 'bold' }}>
                {cartCount}
              </span>
            )}
          </div>

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{user.name}</span>
              <button onClick={logout} className="btn btn-outline" style={{ padding: '5px 12px', fontSize: '0.8rem' }}>Keluar</button>
            </div>
          ) : (
            <Link to="/auth" className="btn btn-primary" style={{ padding: '8px 20px', fontSize: '0.9rem' }}>
              <User size={18} style={{ marginRight: '8px' }} /> Masuk
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
