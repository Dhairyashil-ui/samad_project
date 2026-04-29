import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { reservationsAPI } from '../services/api';
import Loader from '../components/common/Loader';
import { useAuth } from '../context/AuthContext';

const Reservations = () => {
  const { isAdmin } = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: ['reservations'],
    queryFn: async () => {
      const res = isAdmin ? await reservationsAPI.getAll({}) : await reservationsAPI.getMy();
      return res.data;
    }
  });

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center" style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem' }}>Book Reservations</h1>
      </div>

      {isLoading ? <Loader fullScreen={false} /> : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ backgroundColor: 'var(--color-background)', borderBottom: '1px solid var(--color-border)' }}>
              <tr>
                <th style={{ padding: '1rem 1.5rem' }}>Book</th>
                {isAdmin && <th style={{ padding: '1rem 1.5rem' }}>Member</th>}
                <th style={{ padding: '1rem 1.5rem' }}>Date</th>
                <th style={{ padding: '1rem 1.5rem' }}>Status</th>
                <th style={{ padding: '1rem 1.5rem' }}>Queue Pos</th>
              </tr>
            </thead>
            <tbody>
              {data?.data?.map((res) => (
                <tr key={res._id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '1rem 1.5rem', fontWeight: '500' }}>{res.book?.title}</td>
                  {isAdmin && <td style={{ padding: '1rem 1.5rem' }}>{res.member?.name}</td>}
                  <td style={{ padding: '1rem 1.5rem' }}>{new Date(res.reservationDate).toLocaleDateString()}</td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span className={`badge ${
                      res.status === 'pending' ? 'badge-warning' : 
                      res.status === 'ready' ? 'badge-success' : 'badge-danger'
                    }`}>
                      {res.status.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', textAlign: 'center' }}>{res.queuePosition}</td>
                </tr>
              ))}
              {(!data?.data || data.data.length === 0) && (
                <tr>
                  <td colSpan={isAdmin ? 5 : 4} style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                    No reservations found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Reservations;
