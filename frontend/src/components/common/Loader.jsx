import React from 'react';
import { Loader2 } from 'lucide-react';

const Loader = ({ fullScreen = true }) => {
  if (fullScreen) {
    return (
      <div style={{ height: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-background)' }}>
        <Loader2 size={48} color="var(--color-primary)" style={{ animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }
  return (
    <div style={{ padding: '2rem', display: 'flex', justifyContent: 'center' }}>
      <Loader2 size={24} color="var(--color-primary)" style={{ animation: 'spin 1s linear infinite' }} />
    </div>
  );
};

export default Loader;
