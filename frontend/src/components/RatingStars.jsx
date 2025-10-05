import React from 'react';

export default function RatingStars({ value = 0, max = 5 }) {
  const full = Math.round(value);
  return (
    <div aria-label={`Rating ${value} out of ${max}`} style={{ color: '#f5a524' }}>
      {Array.from({ length: max }).map((_, i) => (
        <span key={i}>{i < full ? '★' : '☆'}</span>
      ))}
      <span style={{ color: '#666', marginLeft: 6, fontSize: 13 }}>({Number(value || 0).toFixed(1)})</span>
    </div>
  );
}
