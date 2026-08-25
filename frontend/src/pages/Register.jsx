import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AlertCircle } from 'lucide-react';
import archonLogo from '../logo/ARCHON .svg';

export const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('INTERN');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { register, login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const res = await register(name, email, password, role);
      if (res.success) {
        await login(email, password);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000000', padding: '24px' }}>
      <div
        className="premium-card"
        style={{
          width: '100%',
          maxWidth: '420px',
          padding: '36px 30px',
          background: '#09090b',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '14px'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <img src={archonLogo} alt="ARCHON Logo" style={{ height: '42px', width: 'auto', marginBottom: '12px', objectFit: 'contain' }} />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--archon-text)', margin: 0, letterSpacing: '-0.01em' }}>
            Create an Account
          </h2>
          <p style={{ color: 'var(--archon-text-secondary)', fontSize: '0.8rem', marginTop: '4px' }}>
            Join the ARCHON AI Governance Network
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
              Full name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Alex Rivera"
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
              Email address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@example.com"
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

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, color: 'var(--archon-text-secondary)', marginBottom: '5px' }}>
              Select Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px',
                fontSize: '0.82rem',
                background: '#0e0e11',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '8px',
                color: 'var(--archon-text)'
              }}
            >
              <option value="INTERN">Intern (Submit Capstones)</option>
              <option value="REVIEWER">Reviewer (Evaluate Architectures)</option>
              <option value="ADMIN">Admin (Full System Access)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary"
            style={{ marginTop: '8px', padding: '10px', borderRadius: '8px', fontSize: '0.84rem', fontWeight: 600 }}
          >
            {submitting ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.78rem', color: 'var(--archon-text-secondary)' }}>
          Already registered?{' '}
          <Link to="/login" style={{ color: 'var(--archon-cyan)', fontWeight: 600 }}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
