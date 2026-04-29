import React from 'react';
import { BookOpen } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { user } = useAuth();
  
  if (user) {
    return <Navigate to="/dashboard" />;
  }

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/google`;
  };

  return (
    <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '450px', padding: '3rem 2.5rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)', borderRadius: '50%', marginBottom: '1rem' }}>
          <BookOpen size={32} />
        </div>
        <h1 className="font-serif" style={{ fontSize: '2rem', marginBottom: '0.5rem', color: 'var(--color-text-main)' }}>Welcome Back</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>Sign in to manage your library</p>
      </div>

      <button
        onClick={handleGoogleLogin}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.75rem',
          padding: '0.875rem',
          backgroundColor: 'white',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          fontSize: '1rem',
          fontWeight: '500',
          cursor: 'pointer',
          transition: 'all var(--transition-fast)',
          boxShadow: 'var(--shadow-sm)'
        }}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--color-background)'}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
      >
        <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
          <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
            <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
            <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
            <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
            <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
          </g>
        </svg>
        Continue with Google
      </button>

      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default Login;
