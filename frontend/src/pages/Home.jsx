import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Shield, Clock, Users } from 'lucide-react';

const Home = () => {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-surface)', display: 'flex', flexDirection: 'column' }}>
      <header style={{ padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--color-primary)' }}>
          <BookOpen size={32} />
          <h1 className="font-serif" style={{ fontSize: '1.5rem', fontWeight: '800' }}>LibraVault</h1>
        </div>
        <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <Link to="/login" style={{ color: 'var(--color-text-main)', fontWeight: '500' }}>Sign In</Link>
          <Link to="/login" className="btn btn-primary" style={{ padding: '0.5rem 1.5rem' }}>Get Started</Link>
        </nav>
      </header>

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Hero Section */}
        <section style={{ padding: '6rem 2rem', textAlign: 'center', backgroundColor: 'var(--color-background)', borderBottom: '1px solid var(--color-border)' }}>
          <div className="container animate-fade-in" style={{ maxWidth: '800px' }}>
            <h2 className="font-serif" style={{ fontSize: '3.5rem', marginBottom: '1.5rem', color: 'var(--color-text-main)', lineHeight: 1.1 }}>
              The elegant way to manage your library
            </h2>
            <p style={{ fontSize: '1.25rem', color: 'var(--color-text-muted)', marginBottom: '2.5rem', lineHeight: 1.6 }}>
              A professional, all-in-one system for managing books, tracking loans, and engaging with your members. Built for modern libraries.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <Link to="/login" className="btn btn-primary" style={{ padding: '0.875rem 2rem', fontSize: '1.125rem' }}>Start Managing Now</Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section style={{ padding: '5rem 2rem' }}>
          <div className="container">
            <h3 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '3rem', color: 'var(--color-text-main)' }}>Everything you need in one place</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: BookOpen, title: 'Catalog Management', desc: 'Easily organize and search your entire book collection.' },
                { icon: Users, title: 'Member Tracking', desc: 'Manage member profiles, histories, and communication.' },
                { icon: Clock, title: 'Loan System', desc: 'Seamless borrowing, returning, and automatic overdue tracking.' },
                { icon: Shield, title: 'Secure & Reliable', desc: 'Enterprise-grade security with Google OAuth integration.' }
              ].map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <div key={i} className="card" style={{ padding: '2rem', textAlign: 'center' }}>
                    <div style={{ width: '48px', height: '48px', margin: '0 auto 1.5rem', backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={24} />
                    </div>
                    <h4 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>{feature.title}</h4>
                    <p style={{ color: 'var(--color-text-muted)' }}>{feature.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <footer style={{ padding: '2rem', textAlign: 'center', borderTop: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }}>
        <p>&copy; {new Date().getFullYear()} LibraVault. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
