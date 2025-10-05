import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dark, setDark] = React.useState(() => localStorage.getItem('theme') === 'dark');

  React.useEffect(() => {
    if (dark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    }
  }, [dark]);
  return (
    <nav className="nav">
      <div className="nav-inner">
        <div className="links">
          <Link to="/books" className="brand">BOOKSTORE</Link>
          {user && <Link to="/books/new">Add Book</Link>}
        </div>
        <div className="links">
          <button className="btn" onClick={() => setDark((v) => !v)}>{dark ? 'Light' : 'Dark'}</button>
          {!user ? (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup">Signup</Link>
            </>
          ) : (
            <>
              <span className="muted">Hi, {user.name}</span>
              <button className="btn" onClick={() => { logout(); navigate('/login'); }}>
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
