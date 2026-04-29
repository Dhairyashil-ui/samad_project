import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { booksAPI } from '../services/api';
import Loader from '../components/common/Loader';
import { Search, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Books = () => {
  const { isAdmin } = useAuth();
  const [search, setSearch] = useState('');
  
  const { data, isLoading } = useQuery({
    queryKey: ['books', search],
    queryFn: async () => {
      const res = await booksAPI.getAll({ search });
      return res.data;
    }
  });

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center" style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem' }}>Books Catalog</h1>
        {isAdmin && (
          <button className="btn btn-primary">
            <Plus size={18} /> Add New Book
          </button>
        )}
      </div>

      <div className="card mb-8">
        <div className="flex gap-4">
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
            <input 
              type="text" 
              className="form-control" 
              placeholder="Search by title, author, or ISBN..." 
              style={{ paddingLeft: '3rem' }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="btn btn-secondary">Filter</button>
        </div>
      </div>

      {isLoading ? <Loader fullScreen={false} /> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.data?.map(book => (
            <div key={book._id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ width: '80px', height: '120px', backgroundColor: 'var(--color-background)', borderRadius: 'var(--radius-sm)', overflow: 'hidden', flexShrink: 0 }}>
                  {book.coverImage ? (
                    <img src={book.coverImage} alt={book.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>No Cover</div>
                  )}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.125rem', marginBottom: '0.25rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{book.title}</h3>
                  <p className="text-muted" style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>{book.author}</p>
                  <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>{book.genre}</span>
                </div>
              </div>
              <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className={`badge ${book.availableCopies > 0 ? 'badge-success' : 'badge-danger'}`}>
                  {book.availableCopies} / {book.totalCopies} Available
                </span>
                <button className="btn btn-secondary" style={{ padding: '0.25rem 0.75rem' }}>Details</button>
              </div>
            </div>
          ))}
          {data?.data?.length === 0 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem' }} className="card">
              <p className="text-muted">No books found matching your search.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Books;
