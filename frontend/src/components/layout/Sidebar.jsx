import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, Book, Users, Repeat, FileText, Calendar, Settings } from 'lucide-react';

const Sidebar = () => {
  const { isAdmin } = useAuth();

  const links = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/books', icon: Book, label: 'Books Catalog' },
    { to: '/transactions', icon: Repeat, label: 'Borrowings' },
    { to: '/reservations', icon: Calendar, label: 'Reservations' },
    { to: '/fines', icon: FileText, label: 'Fines & Fees' },
  ];

  if (isAdmin) {
    links.splice(2, 0, { to: '/members', icon: Users, label: 'Members' });
  }

  return (
    <aside style={{
      width: '260px',
      backgroundColor: 'var(--color-surface)',
      borderRight: '1px solid var(--color-border)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{ padding: '1.5rem 1.5rem', borderBottom: '1px solid var(--color-border)' }}>
        <h1 className="font-serif" style={{ color: 'var(--color-primary)', fontSize: '1.5rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Book size={28} />
          LibraVault
        </h1>
      </div>
      <nav style={{ flex: 1, padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
                backgroundColor: isActive ? 'var(--color-primary-light)' : 'transparent',
                fontWeight: isActive ? '600' : '500',
                textDecoration: 'none',
                transition: 'all var(--transition-fast)'
              })}
            >
              <Icon size={20} />
              {link.label}
            </NavLink>
          );
        })}
      </nav>
      <div style={{ padding: '1.5rem 1rem', borderTop: '1px solid var(--color-border)' }}>
        <NavLink to="/settings" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', color: 'var(--color-text-muted)', fontWeight: '500', textDecoration: 'none' }}>
          <Settings size={20} /> Settings
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
