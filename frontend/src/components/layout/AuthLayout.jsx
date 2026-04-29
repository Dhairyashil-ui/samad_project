import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', backgroundColor: 'var(--color-background)' }}>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <Outlet />
      </div>
      {/* Optional Side Image for Auth */}
      <div style={{ flex: 1, display: 'none', backgroundColor: 'var(--color-primary-light)', padding: '4rem', alignItems: 'center', justifyContent: 'center' }} className="md-flex">
        <div style={{ maxWidth: '400px', textAlign: 'center' }}>
          <h2 className="font-serif" style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--color-primary-dark)' }}>LibraVault</h2>
          <p style={{ color: 'var(--color-secondary)', fontSize: '1.125rem' }}>The elegant solution for modern library management. Streamline your operations today.</p>
        </div>
      </div>
      <style>{`
        @media (min-width: 768px) {
          .md-flex { display: flex !important; }
        }
      `}</style>
    </div>
  );
};

export default AuthLayout;
