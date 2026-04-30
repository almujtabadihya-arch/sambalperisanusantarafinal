import React, { useState, useContext } from 'react';
import { AppContext } from '../App';

export default function UserAuth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
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
        alert(data.error || 'Gagal terhubung ke server.');
        return;
      }
      login(data.user);
    } catch (err) {
      alert('Koneksi bermasalah. Coba lagi ya.');
    }
  };

  return (
    <div style={{ padding: '60px 20px', display: 'flex', justifyContent: 'center', minHeight: '60vh' }}>
      <div style={{ background: 'white', padding: '40px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px', border: '1px solid #EEE' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px', fontWeight: '900', fontSize: '2rem' }}>
          {isLogin ? 'MASUK' : 'DAFTAR'}
        </h2>
        
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>NAMA</label>
              <input 
                type="text" 
                placeholder="Nama Lengkap"
                style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #DDD' }}
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>
          )}
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>EMAIL</label>
            <input 
              type="email" 
              placeholder="email@anda.com"
              style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #DDD' }}
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>PASSWORD</label>
            <input 
              type="password" 
              placeholder="••••••••"
              style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #DDD' }}
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" style={{ width: '100%', background: 'black', color: 'white', padding: '15px', borderRadius: '10px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
            {isLogin ? 'MASUK SEKARANG' : 'BUAT AKUN BARU'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', color: '#666' }}>
          {isLogin ? 'Belum punya akun? ' : 'Sudah punya akun? '}
          <span 
            style={{ color: '#D32F2F', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline' }}
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Daftar' : 'Login'}
          </span>
        </p>
      </div>
    </div>
  );
}
