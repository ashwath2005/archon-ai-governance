import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '../components/common/Button';

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
    <div style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button className="btn btn-secondary btn-sm" onClick={() => navigate('/submissions')}>
          <ArrowLeft size={13} /> Back
        </button>
        <h1 className="font-brand" style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--archon-text)' }}>
          {isEdit ? 'EDIT CAPSTONE SUBMISSION' : 'NEW CAPSTONE SUBMISSION'}
        </h1>
      </div>

      <div style={{ background: 'var(--archon-surface)', border: '1px solid var(--archon-border)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
        {error && (
          <div style={{ background: 'var(--archon-danger-bg)', border: '1px solid var(--archon-danger-border)', color: 'var(--archon-danger)', padding: '8px 12px', borderRadius: 'var(--radius-md)', marginBottom: '16px', fontSize: '0.8rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label className="mono" style={{ display: 'block', fontSize: '0.68rem', fontWeight: 600, color: 'var(--archon-text-muted)', marginBottom: '4px', textTransform: 'uppercase' }}>
              INTERN NAME
            </label>
            <input
              type="text"
              name="internName"
              required
              value={formData.internName}
              onChange={handleChange}
              placeholder="Rahul Kumar"
              style={{ width: '100%' }}
            />
          </div>

          <div>
            <label className="mono" style={{ display: 'block', fontSize: '0.68rem', fontWeight: 600, color: 'var(--archon-text-muted)', marginBottom: '4px', textTransform: 'uppercase' }}>
              PROJECT TITLE
            </label>
            <input
              type="text"
              name="projectTitle"
              required
              value={formData.projectTitle}
              onChange={handleChange}
              placeholder="Enterprise RAG Knowledge Assistant"
              style={{ width: '100%' }}
            />
          </div>

          <div>
            <label className="mono" style={{ display: 'block', fontSize: '0.68rem', fontWeight: 600, color: 'var(--archon-text-muted)', marginBottom: '4px', textTransform: 'uppercase' }}>
              PROJECT DOMAIN
            </label>
            <select name="projectDomain" value={formData.projectDomain} onChange={handleChange} style={{ width: '100%' }}>
              <option value="Healthcare">Healthcare</option>
              <option value="Finance">Finance</option>
              <option value="E-Commerce">E-Commerce</option>
              <option value="Legal Tech">Legal Tech</option>
              <option value="Education">Education</option>
              <option value="Developer Tools">Developer Tools</option>
              <option value="Cybersecurity">Cybersecurity</option>
            </select>
          </div>

          <div>
            <label className="mono" style={{ display: 'block', fontSize: '0.68rem', fontWeight: 600, color: 'var(--archon-text-muted)', marginBottom: '4px', textTransform: 'uppercase' }}>
              GITHUB REPOSITORY LINK
            </label>
            <input
              type="url"
              name="githubUrl"
              required
              value={formData.githubUrl}
              onChange={handleChange}
              placeholder="https://github.com/username/capstone-repo"
              style={{ width: '100%' }}
            />
          </div>

          <div>
            <label className="mono" style={{ display: 'block', fontSize: '0.68rem', fontWeight: 600, color: 'var(--archon-text-muted)', marginBottom: '4px', textTransform: 'uppercase' }}>
              MAPPING ONE-PAGER DOCUMENT LINK
            </label>
            <input
              type="url"
              name="onePagerUrl"
              required
              value={formData.onePagerUrl}
              onChange={handleChange}
              placeholder="https://notion.so/username/one-pager-mapping"
              style={{ width: '100%' }}
            />
          </div>

          <div>
            <label className="mono" style={{ display: 'block', fontSize: '0.68rem', fontWeight: 600, color: 'var(--archon-text-muted)', marginBottom: '4px', textTransform: 'uppercase' }}>
              DATE SUBMITTED
            </label>
            <input
              type="date"
              name="dateSubmitted"
              required
              value={formData.dateSubmitted}
              onChange={handleChange}
              style={{ width: '100%' }}
            />
          </div>

          <Button type="submit" variant="primary" disabled={submitting} style={{ marginTop: '8px', padding: '10px' }}>
            <Save size={14} /> {submitting ? 'Saving...' : isEdit ? 'Save Changes' : 'Submit Project Architecture'}
          </Button>
        </form>
      </div>
    </div>
  );
};
