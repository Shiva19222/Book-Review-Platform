import React from 'react';
import { useToast } from '../context/ToastContext.jsx';

export default function Toasts(){
  const { toasts, removeToast } = useToast();
  return (
    <div style={{ position:'fixed', right:16, bottom:16, display:'grid', gap:8, zIndex:9999 }}>
      {toasts.map(t => (
        <div key={t.id} className="card" style={{ padding:'0.5rem 0.75rem', background: t.type==='error' ? '#fff6f6' : undefined, borderColor: t.type==='error' ? '#ffd4d4' : undefined }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <span>{t.msg}</span>
            <button className="btn" onClick={() => removeToast(t.id)} style={{ padding:'0 8px' }}>×</button>
          </div>
        </div>
      ))}
    </div>
  );
}
