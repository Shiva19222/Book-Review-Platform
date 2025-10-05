import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../lib/api.js';
import Hero from '../components/Hero.jsx';
import BookCard from '../components/BookCard.jsx';

export default function BookList() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();

  const page = useMemo(() => Number(searchParams.get('page') || 1), [searchParams]);
  const q = useMemo(() => searchParams.get('q') || '', [searchParams]);
  const genre = useMemo(() => searchParams.get('genre') || '', [searchParams]);
  const sort = useMemo(() => searchParams.get('sort') || 'created_desc', [searchParams]);

  useEffect(() => {
    let ignore = false;
    async function load() {
      setLoading(true);
      setError('');
      try {
        const { data } = await api.get('/books', { params: { page, q, genre, sort } });
        if (!ignore) {
          setItems(data.items);
          setPages(data.pages);
          setTotal(data.total);
        }
      } catch (err) {
        if (!ignore) setError(err.response?.data?.message || 'Failed to load books');
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    load();
    return () => { ignore = true; };
  }, [page, q, genre, sort]);

  const goPage = (p) => setSearchParams({ ...(q ? { q } : {}), ...(genre ? { genre } : {}), ...(sort ? { sort } : {}), page: p.toString() });
  const onSearch = (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const v = fd.get('q');
    const g = fd.get('genre');
    const s = fd.get('sort');
    setSearchParams({ ...(v ? { q: v } : {}), ...(g ? { genre: g } : {}), ...(s ? { sort: s } : {}), page: '1' });
  };

  return (
    <div>
      <Hero
        background="/lib.jpg"
        subtitle="COME AND JOIN THE READING CLUB"
        title="Enjoy the silence in our reading room."
        onCta={() => window.scrollTo({ top: 420, behavior: 'smooth' })}
      />
      <div className="hero-spacer" />

      <h2 className="section-title">Books</h2>
      <form onSubmit={onSearch} style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <input className="input" name="q" placeholder="Search by title or author" defaultValue={q} />
        <input className="input" name="genre" placeholder="Genre" style={{ minWidth: 160 }} defaultValue={genre} />
        <select className="input" name="sort" defaultValue={sort} style={{ minWidth: 180 }}>
          <option value="created_desc">Newest</option>
          <option value="year_desc">Year: New → Old</option>
          <option value="year_asc">Year: Old → New</option>
          <option value="rating_desc">Rating: High → Low</option>
          <option value="rating_asc">Rating: Low → High</option>
        </select>
        <button className="btn">Apply</button>
        {(q || genre || sort !== 'created_desc') && (
          <button
            type="button"
            className="btn"
            style={{ background: '#eef1ff', color: '#3a32a3' }}
            onClick={() => setSearchParams({ page: '1' })}
          >
            Clear
          </button>
        )}
      </form>

      {error && (
        <div className="card" style={{ borderColor: '#ffd4d4', background: '#fff6f6' }}>
          <div style={{ color: '#a40000' }}>Failed to load books</div>
        </div>
      )}

      {loading ? (
        <div className="grid">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="card">
              <div className="skeleton" style={{ aspectRatio: '3 / 4' }} />
              <div className="skeleton" style={{ height: 16, width: '80%' }} />
              <div className="skeleton" style={{ height: 12, width: '50%' }} />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid">
          {items.map((b) => (
            <BookCard key={b._id} book={b} />
          ))}
        </div>
      )}

      <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <button className="btn" disabled={page <= 1} onClick={() => goPage(page - 1)}>Prev</button>
        <span className="muted">Page {page} / {pages}</span>
        <button className="btn" disabled={page >= pages} onClick={() => goPage(page + 1)}>Next</button>
      </div>
      <div className="muted" style={{ marginTop: 6 }}>{total} total</div>
    </div>
  );
}
