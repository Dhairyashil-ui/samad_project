import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { membersAPI } from '../services/api';
import Loader from '../components/common/Loader';
import { Search } from 'lucide-react';

const Members = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['members'],
    queryFn: async () => {
      const res = await membersAPI.getAll({});
      return res.data;
    }
  });

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center" style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem' }}>Members Directory</h1>
      </div>

      <div className="card mb-8">
        <div className="flex gap-4">
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
            <input type="text" className="form-control" placeholder="Search members by name or email..." style={{ paddingLeft: '3rem' }} />
          </div>
        </div>
      </div>

      {isLoading ? <Loader fullScreen={false} /> : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ backgroundColor: 'var(--color-background)', borderBottom: '1px solid var(--color-border)' }}>
              <tr>
                <th style={{ padding: '1rem 1.5rem', fontWeight: '600', color: 'var(--color-text-muted)' }}>Member</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: '600', color: 'var(--color-text-muted)' }}>ID</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: '600', color: 'var(--color-text-muted)' }}>Role</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: '600', color: 'var(--color-text-muted)' }}>Status</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: '600', color: 'var(--color-text-muted)' }}>Fines</th>
              </tr>
            </thead>
            <tbody>
              {data?.data?.map((member) => (
                <tr key={member._id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      {member.avatar ? (
                        <img src={member.avatar} alt="" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                      ) : (
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--color-primary-light)' }} />
                      )}
                      <div>
                        <p style={{ fontWeight: '500' }}>{member.name}</p>
                        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>{member.email}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', fontFamily: 'monospace' }}>{member.membershipId}</td>
                  <td style={{ padding: '1rem 1.5rem', textTransform: 'capitalize' }}>{member.role}</td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span className={`badge ${member.isActive ? 'badge-success' : 'badge-danger'}`}>
                      {member.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', color: member.totalFines > 0 ? 'var(--color-danger)' : 'inherit' }}>
                    ₹{member.totalFines}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Members;
