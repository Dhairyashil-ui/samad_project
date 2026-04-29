import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('lv_token');
    if (token) {
      authAPI.getMe()
        .then(res => setUser(res.data.data))
        .catch(() => {
          localStorage.removeItem('lv_token');
          localStorage.removeItem('lv_user');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const loginWithToken = (token) => {
    localStorage.setItem('lv_token', token);
    authAPI.getMe()
      .then(res => {
        setUser(res.data.data);
        localStorage.setItem('lv_user', JSON.stringify(res.data.data));
      })
      .catch(console.error);
  };

  const logout = async () => {
    try { await authAPI.logout(); } catch (_) {}
    localStorage.removeItem('lv_token');
    localStorage.removeItem('lv_user');
    setUser(null);
  };

  const isAdmin = user?.role === 'admin' || user?.role === 'librarian';
  const isSuperAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, loading, loginWithToken, logout, isAdmin, isSuperAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
