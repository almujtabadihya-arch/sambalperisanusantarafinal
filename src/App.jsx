import React, { useState, createContext, useContext } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import CartSidebar from './components/CartSidebar';
import ChatWidget from './components/ChatWidget';
import Footer from './components/Footer';
import Home from './pages/Home';
import Checkout from './pages/Checkout';
import UserAuth from './pages/UserAuth';
import OrderTracking from './pages/OrderTracking';
import Admin from './pages/Admin';

export const AppContext = createContext();

function App() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isAdminPage = location.pathname.includes('/admin');
  
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('sambalUser');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch { return null; }
  });

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(p => p.id === product.id);
      if (existing) return prev.map(p => p.id === product.id ? { ...p, qty: p.qty + 1 } : p);
      return [...prev, { ...product, qty: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQty = (id, delta) => {
    setCart(prev => prev.map(p => {
      if (p.id === id) {
        const newQty = Math.max(1, p.qty + delta);
        return { ...p, qty: newQty };
      }
      return p;
    }));
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(p => p.id !== id));
  };

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('sambalUser', JSON.stringify(userData));
    navigate('/');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('sambalUser');
    navigate('/');
  };

  return (
    <AppContext.Provider value={{
      cart, addToCart, updateQty, removeFromCart, isCartOpen, setIsCartOpen, user, login, logout, setCart
    }}>
      {!isAdminPage && <Navbar />}
      
      <main className={isAdminPage ? "" : "container"} style={{ minHeight: '80vh' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/auth" element={<UserAuth />} />
          <Route path="/lacak" element={<OrderTracking />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>

      {!isAdminPage && <Footer />}
      {isCartOpen && <CartSidebar />}
      {!isAdminPage && <ChatWidget />}
    </AppContext.Provider>
  );
}

export default App;
