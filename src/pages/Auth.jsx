import React, { useState, useContext } from 'react';
import { AppContext } from '../App';
import { User, Mail, Lock, ArrowRight } from 'lucide-react';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AppContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isLogin ? '/api/userlogin' : '/api/register';
      const body = isLogin ? { email, password } : { name, email, password };
      
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Terjadi kesalahan');
        return;
      }
      
      login(data.user);
    } catch (err) {
      alert('Gagal menyambung ke server. Pastikan internet aktif.');
    }
  };

  return (
    <div className="auth-page" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="auth-card" style={{ background: '#FFF', padding: '2.5rem', borderRadius: '24px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px', border: '1px solid #EEE' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: '900', textAlign: 'center', marginBottom: '2rem' }}>
          {isLogin ? 'Masuk' : 'Daftar'}
        </h2>
        
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div style={{ marginBottom: '1.2rem' }}>
              <label style={{ display: 'block', fontWeight: '700', marginBottom: '0.5rem', fontSize: '0.8rem' }}>NAMA LENGKAP</label>
              <input 
                type="text" 
                className="form-input" 
                style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', border: '1.5px solid #EEE' }}
                placeholder="Nama Anda"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>
          )}
          
          <div style={{ marginBottom: '1.2rem' }}>
            <label style={{ display: 'block', fontWeight: '700', marginBottom: '0.5rem', fontSize: '0.8rem' }}>EMAIL</label>
            <input 
              type="email" 
              className="form-input" 
              style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', border: '1.5px solid #EEE' }}
              placeholder="email@contoh.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', fontWeight: '700', marginBottom: '0.5rem', fontSize: '0.8rem' }}>KATA SANDI</label>
            <input 
              type="password" 
              className="form-input" 
              style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', border: '1.5px solid #EEE' }}
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem', display: 'flex', gap: '0.8rem' }}>
            {isLogin ? 'MASUK SEKARANG' : 'BUAT AKUN'} <ArrowRight size={20} />
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: '#666' }}>
          {isLogin ? 'Belum punya akun? ' : 'Sudah punya akun? '}
          <span 
            style={{ color: 'var(--primary)', fontWeight: '800', cursor: 'pointer', textDecoration: 'underline' }}
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Daftar' : 'Login'}
          </span>
        </p>
      </div>
    </div>
  );
}
