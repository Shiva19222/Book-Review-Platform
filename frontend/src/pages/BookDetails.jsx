import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../lib/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import Hero from '../components/Hero.jsx';
import RatingStars from '../components/RatingStars.jsx';
import { useToast } from '../context/ToastContext.jsx';

export default function BookDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToast } = useToast();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function load() {
    setLoading(true);
    setError('');
    try {
      const [b, r] = await Promise.all([
        api.get(`/books/${id}`),
        api.get(`/books/${id}/reviews`),
      ]);
      setBook(b.data);
      setReviews(r.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [id]);

  const myReview = useMemo(() => reviews.find((rv) => rv.userId?._id === user?.id), [reviews, user]);

  return (
    <div>
      <Hero background="/lib.jpg" height="28vh" title="Book Details" subtitle="Explore reviews and share your thoughts" ctaText="" />
      <div className="hero-spacer" />
      {loading && <div className="card">Loading...</div>}
      {error && <div className="card" style={{ borderColor: '#ffd4d4', background: '#fff6f6', color: '#a40000' }}>{error}</div>}
      {book && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: 16 }}>
            {/* Cover */}
            <div style={{ width: 220, flexShrink: 0 }}>
              {book.coverUrl ? (
                <img
                  src={book.coverUrl}
                  alt={book.title}
                  onError={(e) => {
                    if (e.currentTarget.dataset.fallback) return;
                    e.currentTarget.dataset.fallback = '1';
                    e.currentTarget.src = '/cover-placeholder.png';
                  }}
                  style={{ width: '100%', aspectRatio: '3 / 4', objectFit: 'cover', borderRadius: 8 }}
                />
              ) : (
                <div className="skeleton" style={{ width: '100%', aspectRatio: '3 / 4' }} />
              )}
            </div>
            {/* Meta */}
            <div style={{ flex: 1 }}>
              <h2 style={{ margin: 0 }}>{book.title}</h2>
              <div className="muted" style={{ marginTop: 4 }}>by {book.author} · {book.genre || '—'} · {book.year || '—'}</div>
              <div style={{ marginTop: 12 }}>{book.description}</div>
              <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                <RatingStars value={Number(book.averageRating || 0)} />
                <span className="muted">{book.reviewsCount} reviews</span>
              </div>
            </div>
            {user && user.id === String(book.addedBy) && (
              <div style={{ display: 'flex', gap: 8 }}>
                <Link to={`/books/${book._id}/edit`}>
                  <button className="btn btn-primary">Edit Book</button>
                </Link>
              </div>
            )}
          </div>

          <section style={{ marginTop: 24 }}>
            <h3 style={{ marginTop: 0 }}>Reviews</h3>
            {user && <ReviewEditor bookId={book._id} existing={myReview} onSaved={load} />}
            {!reviews.length && <div className="muted">No reviews yet.</div>}
            <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: 12 }}>
              {reviews.map((rv) => (
                <li key={rv._id} className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontWeight: 600 }}>{rv.userId?.name || 'User'}</div>
                      <div style={{ marginTop: 4 }}>⭐ {rv.rating}</div>
                      <div style={{ marginTop: 6 }}>{rv.reviewText}</div>
                    </div>
                    {user && rv.userId?._id === user.id && (
                      <ReviewActions review={rv} onChanged={load} />
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}
    </div>
  );
}

function ReviewEditor({ bookId, existing, onSaved }) {
  const { addToast } = useToast();
  const [rating, setRating] = useState(existing?.rating || 5);
  const [text, setText] = useState(existing?.reviewText || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setRating(existing?.rating || 5);
    setText(existing?.reviewText || '');
  }, [existing]);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await api.post(`/books/${bookId}/reviews`, { rating, reviewText: text });
      onSaved?.();
      addToast(existing ? 'Review updated' : 'Review added', 'info');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save review');
      addToast(err.response?.data?.message || 'Failed to save review', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={save} className="card" style={{ display: 'grid', gap: 8, marginBottom: 12 }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <label className="muted" style={{ minWidth: 60 }}>Rating</label>
        <select className="input" value={rating} onChange={(e) => setRating(Number(e.target.value))}>
          {[1,2,3,4,5].map((n) => <option key={n} value={n}>{n}</option>)}
        </select>
      </div>
      <textarea className="input" rows={3} placeholder="Write your review" value={text} onChange={(e) => setText(e.target.value)} />
      {error && <div style={{ color: 'crimson' }}>{error}</div>}
      <button className="btn" disabled={saving}>{saving ? 'Saving...' : (existing ? 'Update Review' : 'Add Review')}</button>
    </form>
  );
}

function ReviewActions({ review, onChanged }) {
  const { addToast } = useToast();
  const [deleting, setDeleting] = useState(false);
  const onDelete = async () => {
    if (!confirm('Delete this review?')) return;
    setDeleting(true);
    try {
      await api.delete(`/reviews/${review._id}`);
      onChanged?.();
      addToast('Review deleted', 'info');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to delete review', 'error');
    } finally {
      setDeleting(false);
    }
  };
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <button onClick={onDelete} disabled={deleting}>{deleting ? 'Deleting...' : 'Delete'}</button>
    </div>
  );
}
