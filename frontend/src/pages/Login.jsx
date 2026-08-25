import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, AlertCircle } from 'lucide-react';
import archonLogo from '../logo/ARCHON .svg';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (loginEmail, loginPassword) => {
    setError('');
    setSubmitting(true);
    try {
      await login(loginEmail, loginPassword);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin(email, password);
  };

  const handleQuickLogin = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    handleLogin(demoEmail, demoPassword);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000000', padding: '24px' }}>
      <div
        className="premium-card"
        style={{
          width: '100%',
          maxWidth: '400px',
          padding: '36px 30px',
          background: '#09090b',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '14px'
        }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <img src={archonLogo} alt="ARCHON Logo" style={{ height: '42px', width: 'auto', marginBottom: '12px', objectFit: 'contain' }} />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--archon-text)', margin: 0, letterSpacing: '-0.01em' }}>
            Sign In to ARCHON
          </h2>
          <p style={{ color: 'var(--archon-text-secondary)', fontSize: '0.8rem', marginTop: '4px' }}>
            AI Architecture Review & Governance Network
          </p>
        </div>

        {error && (
          <div style={{ background: 'rgba(251, 113, 133, 0.1)', border: '1px solid rgba(251, 113, 133, 0.25)', color: '#FB7185', padding: '10px 12px', borderRadius: '8px', marginBottom: '18px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={14} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, color: 'var(--archon-text-secondary)', marginBottom: '5px' }}>
              Email address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              style={{
                width: '100%',
                padding: '9px 12px',
                fontSize: '0.82rem',
                background: '#0e0e11',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '8px',
                color: 'var(--archon-text)'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, color: 'var(--archon-text-secondary)', marginBottom: '5px' }}>
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '9px 12px',
                fontSize: '0.82rem',
                background: '#0e0e11',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '8px',
                color: 'var(--archon-text)'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary"
            style={{ marginTop: '8px', padding: '10px', borderRadius: '8px', fontSize: '0.84rem', fontWeight: 600 }}
          >
            {submitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Quick Demo Access Buttons */}
        <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--archon-text-muted)', marginBottom: '10px', textAlign: 'center' }}>
            Quick Demo Accounts
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
            <button
              type="button"
              onClick={() => handleQuickLogin('admin@example.com', 'Admin@123')}
              className="btn btn-secondary btn-sm"
              style={{ padding: '6px 4px', fontSize: '0.7rem', borderRadius: '6px' }}
            >
              Admin
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('reviewer@example.com', 'Reviewer@123')}
              className="btn btn-secondary btn-sm"
              style={{ padding: '6px 4px', fontSize: '0.7rem', borderRadius: '6px' }}
            >
              Reviewer
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('intern@example.com', 'Intern@123')}
              className="btn btn-secondary btn-sm"
              style={{ padding: '6px 4px', fontSize: '0.7rem', borderRadius: '6px' }}
            >
              Intern
            </button>
          </div>
        </div>

        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.78rem', color: 'var(--archon-text-secondary)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--archon-cyan)', fontWeight: 600 }}>
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};
