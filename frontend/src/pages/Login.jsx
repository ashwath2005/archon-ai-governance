import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, AlertCircle, Shield } from 'lucide-react';
import { Button } from '../components/common/Button';
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
        style={{
          width: '100%',
          maxWidth: '400px',
          background: 'var(--archon-surface)',
          border: '1px solid var(--archon-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '36px 32px'
        }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <img src={archonLogo} alt="ARCHON Logo" style={{ height: '48px', width: 'auto', marginBottom: '12px', objectFit: 'contain' }} />
          <h2 className="font-brand" style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--archon-text)', marginBottom: '6px' }}>
            ARCHON
          </h2>
          <div className="brand-tagline">
            AI ARCHITECTURE REVIEW & GOVERNANCE
          </div>
        </div>

        {error && (
          <div style={{ background: 'var(--archon-danger-bg)', border: '1px solid var(--archon-danger-border)', color: 'var(--archon-danger)', padding: '8px 12px', borderRadius: 'var(--radius-md)', marginBottom: '18px', fontSize: '0.775rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={14} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label className="mono" style={{ display: 'block', fontSize: '0.68rem', fontWeight: 600, color: 'var(--archon-text-muted)', marginBottom: '4px', textTransform: 'uppercase' }}>
              EMAIL ADDRESS
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              style={{ width: '100%' }}
            />
          </div>

          <div>
            <label className="mono" style={{ display: 'block', fontSize: '0.68rem', fontWeight: 600, color: 'var(--archon-text-muted)', marginBottom: '4px', textTransform: 'uppercase' }}>
              PASSWORD
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{ width: '100%' }}
            />
          </div>

          <Button type="submit" variant="primary" disabled={submitting} style={{ marginTop: '6px', padding: '10px' }}>
            {submitting ? 'Authenticating...' : <><LogIn size={15} /> Authenticate & Access</>}
          </Button>
        </form>

        {/* Developer Quick Controls */}
        <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--archon-border)' }}>
          <span className="mono" style={{ fontSize: '0.65rem', color: 'var(--archon-text-muted)', display: 'block', marginBottom: '8px' }}>
            DEVELOPMENT QUICK ACCESS:
          </span>
          <div style={{ display: 'flex', gap: '6px' }}>
            <Button variant="secondary" size="sm" disabled={submitting} onClick={() => handleQuickLogin('admin@example.com', 'Admin@123')} style={{ flex: 1, fontSize: '0.7rem' }}>
              Admin
            </Button>
            <Button variant="secondary" size="sm" disabled={submitting} onClick={() => handleQuickLogin('reviewer@example.com', 'Reviewer@123')} style={{ flex: 1, fontSize: '0.7rem' }}>
              Reviewer
            </Button>
            <Button variant="secondary" size="sm" disabled={submitting} onClick={() => handleQuickLogin('intern@example.com', 'Intern@123')} style={{ flex: 1, fontSize: '0.7rem' }}>
              Intern
            </Button>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '18px', fontSize: '0.775rem', color: 'var(--archon-text-muted)' }}>
          Need an account? <Link to="/register" style={{ color: 'var(--archon-cyan)', fontWeight: 600 }}>Create Registration</Link>
        </div>
      </div>
    </div>
  );
};
