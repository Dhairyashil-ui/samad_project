import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const MainLayout = () => {
  return (
    <div className="flex h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
      <Sidebar />
      <div className="flex-col flex-1" style={{ display: 'flex', overflow: 'hidden' }}>
        <Navbar />
        <main style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
          <div className="container" style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
