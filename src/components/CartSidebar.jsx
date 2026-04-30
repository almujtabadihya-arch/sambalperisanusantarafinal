import React, { useContext } from 'react';
import { X, Trash2, ChevronRight, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../App';

export default function CartSidebar() {
  const { cart, setIsCartOpen, updateQty, removeFromCart, user } = useContext(AppContext);
  const navigate = useNavigate();

  const total = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    if (user) {
      navigate('/checkout');
    } else {
      navigate('/auth');
    }
  };

  return (
    <>
      <div className="cart-sidebar-overlay" onClick={() => setIsCartOpen(false)}></div>
      <div className="cart-sidebar">
        <div className="cart-header">
          <h3 style={{fontWeight: 800, fontSize: '1.4rem'}}>Keranjang</h3>
          <button className="btn-outline" style={{padding: '0.5rem', borderRadius: '50%'}} onClick={() => setIsCartOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <div className="cart-items">
          {cart.length === 0 ? (
            <div style={{height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#999'}}>
              <ShoppingBag size={60} strokeWidth={1} style={{marginBottom: '1rem'}} />
              <p>Keranjang lu masih kosong nih.</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="cart-item">
                <img src={item.image} alt={item.name} className="cart-item-img" />
                <div className="cart-item-info">
                  <div className="cart-item-title">{item.name}</div>
                  <div className="cart-item-price">Rp {item.price.toLocaleString('id-ID')}</div>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.8rem'}}>
                    <div className="qty-controls">
                      <button className="qty-btn" onClick={() => updateQty(item.id, -1)}>-</button>
                      <span style={{fontWeight: 800, minWidth: '20px', textAlign: 'center'}}>{item.qty}</span>
                      <button className="qty-btn" onClick={() => updateQty(item.id, 1)}>+</button>
                    </div>
                    <button style={{background: 'none', border:'none', color: '#D32F2F', cursor: 'pointer'}} onClick={() => removeFromCart(item.id)}>
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <span>Total:</span>
              <span style={{color: 'var(--primary)'}}>Rp {total.toLocaleString('id-ID')}</span>
            </div>
            <button className="btn btn-primary" style={{width: '100%', padding: '1.2rem', fontSize: '1.1rem'}} onClick={handleCheckoutClick}>
              LANJUT KE BAYAR <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </>
  );
}
