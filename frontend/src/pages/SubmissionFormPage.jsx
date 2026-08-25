import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Save, AlertCircle } from 'lucide-react';

export const SubmissionFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    internName: user?.name || '',
    projectTitle: '',
    projectDomain: 'Healthcare',
    githubUrl: '',
    onePagerUrl: '',
    dateSubmitted: new Date().toISOString().split('T')[0]
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit) {
      const fetchDetail = async () => {
        try {
          const res = await axiosClient.get(`/submissions/${id}`);
          if (res.success) {
            setFormData({
              internName: res.data.internName || '',
              projectTitle: res.data.projectTitle || '',
              projectDomain: res.data.projectDomain || 'Healthcare',
              githubUrl: res.data.githubUrl || '',
              onePagerUrl: res.data.onePagerUrl || '',
              dateSubmitted: res.data.dateSubmitted || new Date().toISOString().split('T')[0]
            });
          }
        } catch (err) {
          setError('Failed to fetch submission details');
        }
      };
      fetchDetail();
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      if (isEdit) {
        await axiosClient.put(`/submissions/${id}`, formData);
      } else {
        await axiosClient.post('/submissions', formData);
      }
      navigate('/submissions');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save submission');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }} className="page-transition">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button className="btn btn-secondary btn-sm" onClick={() => navigate('/submissions')} style={{ borderRadius: '8px' }}>
          <ArrowLeft size={14} /> Back
        </button>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--archon-text)', margin: 0, letterSpacing: '-0.02em' }}>
            {isEdit ? 'Edit Architecture Submission' : 'New Architecture Submission'}
          </h1>
          <p style={{ color: 'var(--archon-text-secondary)', fontSize: '0.8rem', marginTop: '2px' }}>
            Provide capstone details and architecture repository links for review
          </p>
        </div>
      </div>

      <div className="premium-card" style={{ padding: '28px' }}>
        {error && (
          <div style={{ background: 'rgba(251, 113, 133, 0.1)', border: '1px solid rgba(251, 113, 133, 0.25)', color: '#FB7185', padding: '10px 12px', borderRadius: '8px', marginBottom: '18px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={14} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, color: 'var(--archon-text-secondary)', marginBottom: '5px' }}>
              Intern Name
            </label>
            <input
              type="text"
              name="internName"
              required
              value={formData.internName}
              onChange={handleChange}
              placeholder="e.g. Alex Rivera"
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
              Project Title
            </label>
            <input
              type="text"
              name="projectTitle"
              required
              value={formData.projectTitle}
              onChange={handleChange}
              placeholder="e.g. MedRAG: Multi-Agent Clinical Decision Support"
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
              Domain Focus
            </label>
            <select
              name="projectDomain"
              value={formData.projectDomain}
              onChange={handleChange}
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
              <option value="Healthcare">Healthcare & Clinical AI</option>
              <option value="Finance">Finance & Risk Modeling</option>
              <option value="Legal">Legal & Contract Analytics</option>
              <option value="E-Commerce">E-Commerce & Agentic Search</option>
              <option value="DevTools">Developer Tools & Code Generation</option>
              <option value="General">General Enterprise GenAI</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, color: 'var(--archon-text-secondary)', marginBottom: '5px' }}>
              GitHub Repository URL
            </label>
            <input
              type="url"
              name="githubUrl"
              required
              value={formData.githubUrl}
              onChange={handleChange}
              placeholder="https://github.com/org/repo"
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
              Architecture 1-Pager URL / Design Document
            </label>
            <input
              type="url"
              name="onePagerUrl"
              required
              value={formData.onePagerUrl}
              onChange={handleChange}
              placeholder="https://docs.google.com/document/d/..."
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

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button
              type="button"
              onClick={() => navigate('/submissions')}
              className="btn btn-secondary"
              style={{ padding: '8px 16px', borderRadius: '8px' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary"
              style={{ padding: '8px 20px', borderRadius: '8px' }}
            >
              {submitting ? 'Saving...' : isEdit ? 'Update Submission' : 'Submit Architecture'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
