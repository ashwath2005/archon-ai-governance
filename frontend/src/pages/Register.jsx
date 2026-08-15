import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, AlertCircle } from 'lucide-react';
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
        style={{
          width: '100%',
          maxWidth: '420px',
          background: 'var(--archon-surface)',
          border: '1px solid var(--archon-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '36px 32px'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <img src={archonLogo} alt="ARCHON Logo" style={{ height: '48px', width: 'auto', marginBottom: '12px', objectFit: 'contain' }} />
          <h2 className="font-brand" style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--archon-text)', marginBottom: '6px' }}>
            ARCHON
          </h2>
          <div className="brand-tagline">
            ACCOUNT REGISTRATION
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
              FULL NAME
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Alex Rivera"
              style={{ width: '100%' }}
            />
          </div>

          <div>
            <label className="mono" style={{ display: 'block', fontSize: '0.68rem', fontWeight: 600, color: 'var(--archon-text-muted)', marginBottom: '4px', textTransform: 'uppercase' }}>
              EMAIL ADDRESS
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@example.com"
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

          <div>
            <label className="mono" style={{ display: 'block', fontSize: '0.68rem', fontWeight: 600, color: 'var(--archon-text-muted)', marginBottom: '4px', textTransform: 'uppercase' }}>
              SYSTEM ROLE
            </label>
            <select value={role} onChange={(e) => setRole(e.target.value)} style={{ width: '100%' }}>
              <option value="INTERN">Intern (Submit Projects)</option>
              <option value="REVIEWER">Reviewer (Evaluate Architecture)</option>
              <option value="ADMIN">Administrator (System Control)</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary" disabled={submitting} style={{ marginTop: '6px', padding: '10px' }}>
            {submitting ? 'Registering...' : <><UserPlus size={15} /> Create Account</>}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '18px', fontSize: '0.775rem', color: 'var(--archon-text-muted)' }}>
          Already registered? <Link to="/login" style={{ color: 'var(--archon-cyan)', fontWeight: 600 }}>Sign In</Link>
        </div>
      </div>
    </div>
  );
};
