import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { dashboardAPI } from '../services/api';
import { Book, Users, Repeat, AlertCircle } from 'lucide-react';
import Loader from '../components/common/Loader';

const Dashboard = () => {
  const { data: statsData, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const res = await dashboardAPI.getStats();
      return res.data.data;
    }
  });

  if (isLoading) return <Loader fullScreen={false} />;

  const stats = [
    { label: 'Total Books', value: statsData?.totalBooks || 0, icon: Book, color: 'var(--color-primary)' },
    { label: 'Total Members', value: statsData?.totalMembers || 0, icon: Users, color: 'var(--color-success)' },
    { label: 'Active Loans', value: statsData?.activeLoans || 0, icon: Repeat, color: 'var(--color-warning)' },
    { label: 'Overdue', value: statsData?.overdueLoans || 0, icon: AlertCircle, color: 'var(--color-danger)' },
  ];

  return (
    <div className="animate-fade-in">
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="card flex items-center justify-between">
              <div>
                <p className="text-muted" style={{ marginBottom: '0.25rem', fontSize: '0.875rem' }}>{stat.label}</p>
                <h3 style={{ fontSize: '1.75rem' }}>{stat.value}</h3>
              </div>
              <div style={{ padding: '1rem', backgroundColor: `${stat.color}15`, color: stat.color, borderRadius: 'var(--radius-md)' }}>
                <Icon size={24} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem' }}>Monthly Summary</h3>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <li className="flex justify-between items-center">
              <span className="text-muted">Books Added This Month</span>
              <span className="badge badge-primary">{statsData?.booksAddedThisMonth || 0}</span>
            </li>
            <li className="flex justify-between items-center">
              <span className="text-muted">New Members Joined</span>
              <span className="badge badge-success">{statsData?.newMembersThisMonth || 0}</span>
            </li>
            <li className="flex justify-between items-center">
              <span className="text-muted">Total Loans Processed</span>
              <span className="badge badge-warning">{statsData?.loansThisMonth || 0}</span>
            </li>
          </ul>
        </div>
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem' }}>Financial Overview</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center', justifyContent: 'center', height: 'calc(100% - 3.5rem)' }}>
            <div style={{ textAlign: 'center' }}>
              <p className="text-muted">Total Fines Collected</p>
              <h2 style={{ color: 'var(--color-success)', fontSize: '2.5rem' }}>₹{statsData?.totalFinesCollected || 0}</h2>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p className="text-muted">Pending Unpaid Fines</p>
              <h3 style={{ color: 'var(--color-danger)', fontSize: '1.5rem' }}>₹{statsData?.unpaidFines || 0}</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
