import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/books';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'grid', placeItems: 'center' }}>
      <div className="card" style={{ maxWidth: 440, width: '100%' }}>
        <h2 style={{ marginTop: 0 }}>Login</h2>
        <form onSubmit={onSubmit} style={{ display: 'grid', gap: '0.75rem' }}>
          <input className="input" placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input className="input" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          {error && <div style={{ color: 'crimson', fontSize: 14 }}>{error}</div>}
          <button className="btn" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
        </form>
        <p className="muted" style={{ marginTop: 8 }}>Don't have an account? <Link to="/signup">Signup</Link></p>
      </div>
    </div>
  );
}
