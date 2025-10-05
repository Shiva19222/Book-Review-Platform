import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../lib/api.js';
import { useToast } from '../context/ToastContext.jsx';

export default function BookForm({ mode }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addToast } = useToast();

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [genre, setGenre] = useState('');
  const [year, setYear] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [loading, setLoading] = useState(mode === 'edit');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (mode !== 'edit') return;
    let ignore = false;
    async function load() {
      try {
        const { data } = await api.get(`/books/${id}`);
        if (ignore) return;
        setTitle(data.title || '');
        setAuthor(data.author || '');
        setDescription(data.description || '');
        setGenre(data.genre || '');
        setYear(data.year || '');
        setCoverUrl(data.coverUrl || '');
      } catch (err) {
        if (!ignore) setError(err.response?.data?.message || 'Failed to load book');
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    load();
    return () => { ignore = true; };
  }, [id, mode]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const normalizedCover = (() => {
        if (!coverUrl) return '';
        const url = coverUrl.trim();
        if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/')) return url;
        // treat as local public asset
        return `/${url}`;
      })();
      const payload = { title, author, description, genre, year: year ? Number(year) : undefined, coverUrl: normalizedCover };
      if (mode === 'create') {
        const { data } = await api.post('/books', payload);
        const newId = String(data._id || data.id);
        addToast('Book created', 'info');
        navigate(`/books/${newId}`);
      } else {
        const { data } = await api.put(`/books/${id}`, payload);
        const updatedId = String(data._id || data.id || id);
        addToast('Book updated', 'info');
        navigate(`/books/${updatedId}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save');
      addToast(err.response?.data?.message || 'Failed to save', 'error');
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async () => {
    if (mode !== 'edit') return;
    if (!confirm('Delete this book? This will also remove its reviews.')) return;
    try {
      setSaving(true);
      await api.delete(`/books/${id}`);
      addToast('Book deleted', 'info');
      navigate('/books');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete');
      addToast(err.response?.data?.message || 'Failed to delete', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="card" style={{ maxWidth: 640, margin: '0 auto' }}>
      <h2 style={{ marginTop: 0 }}>{mode === 'create' ? 'Add Book' : 'Edit Book'}</h2>
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: '0.75rem' }}>
        <input className="input" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <input className="input" placeholder="Author" value={author} onChange={(e) => setAuthor(e.target.value)} required />
        <input className="input" placeholder="Genre" value={genre} onChange={(e) => setGenre(e.target.value)} />
        <input className="input" placeholder="Published Year" type="number" value={year} onChange={(e) => setYear(e.target.value)} />
        <input className="input" placeholder="Cover URL (optional)" value={coverUrl} onChange={(e) => setCoverUrl(e.target.value)} />
        <div className="muted" style={{ fontSize: 12 }}>
          Use a full URL (https://...) or a file placed in <code>frontend/public/</code> like <code>/mycover.jpg</code>.
        </div>
        <textarea className="input" placeholder="Description" rows={5} value={description} onChange={(e) => setDescription(e.target.value)} />
        {error && <div style={{ color: 'crimson' }}>{error}</div>}
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
          {mode === 'edit' && (
            <button type="button" onClick={onDelete} disabled={saving} className="btn" style={{ background: '#fee', color: '#a40000', border: '1px solid #f7b2b2' }}>Delete</button>
          )}
        </div>
      </form>
    </div>
  );
}
