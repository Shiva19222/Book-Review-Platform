import React from 'react';
import { Link } from 'react-router-dom';
import RatingStars from './RatingStars.jsx';

export default function BookCard({ book }) {
  const onImgError = (e) => {
    if (e.target.dataset.fallback) return; // prevent infinite loop
    e.target.dataset.fallback = '1';
    e.target.src = '/cover-placeholder.png';
  };
  const isNew = (() => {
    if (!book.createdAt) return false;
    const created = new Date(book.createdAt).getTime();
    return Date.now() - created < 7 * 24 * 60 * 60 * 1000;
  })();
  const topRated = (book.averageRating || 0) >= 4.5;
  return (
    <article className="card">
      {book.coverUrl ? (
        <img src={book.coverUrl} onError={onImgError} alt={book.title} style={{ width: '100%', aspectRatio: '3 / 4', objectFit: 'cover', borderRadius: 8 }} />
      ) : (
        <img src="/cover-placeholder.png" alt="Cover" style={{ width: '100%', aspectRatio: '3 / 4', objectFit: 'cover', borderRadius: 8, background: '#f2f4f7' }} />
      )}
      <h4 title={book.title} style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        <Link to={`/books/${book._id}`}>{book.title}</Link>
      </h4>
      <div className="muted" style={{ fontSize: 13 }}>by {book.author}</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <RatingStars value={book.averageRating || 0} />
        <span className="badge">{book.genre || '—'}</span>
      </div>
      <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
        {isNew && <span className="badge" style={{ background: '#e9fff2', color: '#067647' }}>New</span>}
        {topRated && <span className="badge" style={{ background: '#fff4db', color: '#8a6100' }}>Top Rated</span>}
      </div>
    </article>
  );
}
