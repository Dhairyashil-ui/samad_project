import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { finesAPI } from '../services/api';
import Loader from '../components/common/Loader';
import { useAuth } from '../context/AuthContext';

const Fines = () => {
  const { isAdmin } = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: ['fines'],
    queryFn: async () => {
      const res = isAdmin ? await finesAPI.getAll({}) : await finesAPI.getMy();
      return res.data;
    }
  });

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center" style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem' }}>Fines & Fees</h1>
      </div>

      {isLoading ? <Loader fullScreen={false} /> : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ backgroundColor: 'var(--color-background)', borderBottom: '1px solid var(--color-border)' }}>
              <tr>
                {isAdmin && <th style={{ padding: '1rem 1.5rem' }}>Member</th>}
                <th style={{ padding: '1rem 1.5rem' }}>Amount</th>
                <th style={{ padding: '1rem 1.5rem' }}>Reason</th>
                <th style={{ padding: '1rem 1.5rem' }}>Date</th>
                <th style={{ padding: '1rem 1.5rem' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {data?.data?.map((fine) => (
                <tr key={fine._id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  {isAdmin && <td style={{ padding: '1rem 1.5rem', fontWeight: '500' }}>{fine.member?.name}</td>}
                  <td style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>₹{fine.amount}</td>
                  <td style={{ padding: '1rem 1.5rem', textTransform: 'capitalize' }}>{fine.reason}</td>
                  <td style={{ padding: '1rem 1.5rem' }}>{new Date(fine.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span className={`badge ${fine.isPaid ? 'badge-success' : 'badge-danger'}`}>
                      {fine.isPaid ? 'PAID' : 'UNPAID'}
                    </span>
                  </td>
                </tr>
              ))}
              {(!data?.data || data.data.length === 0) && (
                <tr>
                  <td colSpan={isAdmin ? 5 : 4} style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                    No fines found.
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

export default Fines;
