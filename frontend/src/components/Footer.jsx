import React from 'react';

export default function Footer(){
  return (
    <footer className="footer">
      <div className="footer-inner">
        <span>© {new Date().getFullYear()} Bookstore</span>
        <span className="muted">Built with MERN</span>
      </div>
    </footer>
  );
}
