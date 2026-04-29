import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut, Bell, User as UserIcon } from 'lucide-react';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
  };

  return (
    <header style={{
      height: '70px',
      backgroundColor: 'var(--color-surface)',
      borderBottom: '1px solid var(--color-border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      padding: '0 2rem',
      gap: '1.5rem'
    }}>
      <button style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', position: 'relative' }}>
        <Bell size={20} />
        <span style={{ position: 'absolute', top: 0, right: 0, width: '8px', height: '8px', backgroundColor: 'var(--color-danger)', borderRadius: '50%' }}></span>
      </button>
      
      <div style={{ position: 'relative' }}>
        <button 
          onClick={() => setDropdownOpen(!dropdownOpen)}
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--color-text-main)', margin: 0 }}>{user?.name}</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', margin: 0, textTransform: 'capitalize' }}>{user?.role}</p>
          </div>
          {user?.avatar ? (
            <img src={user.avatar} alt="Avatar" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <UserIcon size={20} />
            </div>
          )}
        </button>

        {dropdownOpen && (
          <div style={{
            position: 'absolute', top: '120%', right: '0', backgroundColor: 'white',
            borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--color-border)',
            minWidth: '200px', zIndex: 50, padding: '0.5rem'
          }}>
            <div style={{ padding: '0.5rem 1rem', borderBottom: '1px solid var(--color-border)', marginBottom: '0.5rem' }}>
              <p style={{ fontSize: '0.875rem', fontWeight: '600' }}>{user?.name}</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{user?.email}</p>
            </div>
            <button onClick={handleLogout} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'none', border: 'none', color: 'var(--color-danger)', textAlign: 'left', borderRadius: 'var(--radius-sm)' }} className="hover-bg-gray">
              <LogOut size={16} /> Logout
            </button>
          </div>
        )}
      </div>
      <style>{`
        .hover-bg-gray:hover { background-color: var(--color-background); }
      `}</style>
    </header>
  );
};

export default Navbar;
