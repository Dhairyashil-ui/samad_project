import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { transactionsAPI } from '../services/api';
import Loader from '../components/common/Loader';
import { useAuth } from '../context/AuthContext';

const Transactions = () => {
  const { isAdmin } = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      const res = isAdmin ? await transactionsAPI.getAll({}) : await transactionsAPI.getMy();
      return res.data;
    }
  });

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center" style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem' }}>Borrowing History</h1>
      </div>

      {isLoading ? <Loader fullScreen={false} /> : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ backgroundColor: 'var(--color-background)', borderBottom: '1px solid var(--color-border)' }}>
              <tr>
                <th style={{ padding: '1rem 1.5rem' }}>Book</th>
                {isAdmin && <th style={{ padding: '1rem 1.5rem' }}>Member</th>}
                <th style={{ padding: '1rem 1.5rem' }}>Issue Date</th>
                <th style={{ padding: '1rem 1.5rem' }}>Due Date</th>
                <th style={{ padding: '1rem 1.5rem' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {data?.data?.map((trx) => (
                <tr key={trx._id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '1rem 1.5rem', fontWeight: '500' }}>{trx.book?.title}</td>
                  {isAdmin && <td style={{ padding: '1rem 1.5rem' }}>{trx.member?.name}</td>}
                  <td style={{ padding: '1rem 1.5rem' }}>{new Date(trx.issueDate).toLocaleDateString()}</td>
                  <td style={{ padding: '1rem 1.5rem' }}>{new Date(trx.dueDate).toLocaleDateString()}</td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span className={`badge ${
                      trx.status === 'borrowed' ? 'badge-primary' : 
                      trx.status === 'returned' ? 'badge-success' : 'badge-danger'
                    }`}>
                      {trx.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
              {(!data?.data || data.data.length === 0) && (
                <tr>
                  <td colSpan={isAdmin ? 5 : 4} style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                    No transactions found.
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

export default Transactions;
