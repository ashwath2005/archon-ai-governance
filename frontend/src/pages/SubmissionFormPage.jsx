import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';
import {
  ArrowLeft,
  Save,
  AlertCircle,
  FileCode,
  Github,
  FileText,
  User,
  Layers,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  ArrowRight
} from 'lucide-react';

export const SubmissionFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    internName: user?.name || '',
    projectTitle: '',
    projectDomain: 'Healthcare & Clinical AI',
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
              projectDomain: res.data.projectDomain || 'Healthcare & Clinical AI',
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

  const domainOptions = [
    'Healthcare & Clinical AI',
    'FinTech & Quantitative Analytics',
    'Developer Tools & Code Generation',
    'Legal & Regulatory Compliance',
    'E-Commerce & Intelligent Search',
    'Autonomous Multi-Agent Systems',
    'Enterprise Knowledge Assistant'
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} className="page-transition">
      
      {/* 1. HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button className="btn btn-secondary btn-sm" onClick={() => navigate('/submissions')} style={{ borderRadius: '8px' }}>
            <ArrowLeft size={14} /> Back
          </button>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
              <span className="badge-premium badge-cyan">
                {isEdit ? 'Revision Mode' : 'New Ingestion'}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--archon-text-muted)' }}>
                • ARCHON Governance OS
              </span>
            </div>
            <h1 style={{ fontSize: '1.45rem', fontWeight: 700, color: 'var(--archon-text)', margin: 0, letterSpacing: '-0.02em' }}>
              {isEdit ? 'Edit Architecture Submission' : 'Submit GenAI Architecture'}
            </h1>
            <p style={{ color: 'var(--archon-text-secondary)', fontSize: '0.82rem', marginTop: '2px' }}>
              Register your capstone architecture for automated governance validation and reviewer rubric evaluation
            </p>
          </div>
        </div>
      </div>

      {/* 2. 2-COLUMN SPLIT FORM & GUIDELINES */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 340px', gap: '20px', alignItems: 'start' }}>
        
        {/* LEFT COLUMN: THE FORM */}
        <div className="premium-card" style={{ padding: '24px' }}>
          {error && (
            <div style={{ background: 'rgba(251, 113, 133, 0.1)', border: '1px solid rgba(251, 113, 133, 0.25)', color: '#FB7185', padding: '10px 14px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={15} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Section A: Core Identity */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--archon-text)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                1. Project Identity & Domain
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, color: 'var(--archon-text-secondary)', marginBottom: '6px' }}>
                  Project Title
                </label>
                <input
                  type="text"
                  name="projectTitle"
                  required
                  value={formData.projectTitle}
                  onChange={handleChange}
                  placeholder="e.g. MedRAG: Multi-Agent Clinical Decision Support Engine"
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    fontSize: '0.82rem',
                    background: '#0c0c0e',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '8px',
                    color: 'var(--archon-text)'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, color: 'var(--archon-text-secondary)', marginBottom: '6px' }}>
                    Author / Intern Name
                  </label>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <User size={13} style={{ position: 'absolute', left: '10px', color: 'var(--archon-text-muted)', pointerEvents: 'none' }} />
                    <input
                      type="text"
                      name="internName"
                      required
                      value={formData.internName}
                      onChange={handleChange}
                      placeholder="e.g. Alex Rivera"
                      style={{
                        width: '100%',
                        paddingLeft: '30px',
                        paddingRight: '12px',
                        paddingTop: '9px',
                        paddingBottom: '9px',
                        fontSize: '0.82rem',
                        background: '#0c0c0e',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '8px',
                        color: 'var(--archon-text)'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, color: 'var(--archon-text-secondary)', marginBottom: '6px' }}>
                    Architecture Domain Focus
                  </label>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <Layers size={13} style={{ position: 'absolute', left: '10px', color: 'var(--archon-text-muted)', pointerEvents: 'none' }} />
                    <select
                      name="projectDomain"
                      value={formData.projectDomain}
                      onChange={handleChange}
                      style={{
                        width: '100%',
                        paddingLeft: '30px',
                        paddingRight: '12px',
                        paddingTop: '9px',
                        paddingBottom: '9px',
                        fontSize: '0.82rem',
                        background: '#0c0c0e',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '8px',
                        color: 'var(--archon-text)'
                      }}
                    >
                      {domainOptions.map((dom) => (
                        <option key={dom} value={dom}>{dom}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Section B: Architecture Artifacts */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--archon-text)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                2. Repository & Documentation Artifacts
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, color: 'var(--archon-text-secondary)', marginBottom: '6px' }}>
                  GitHub Repository URL
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Github size={14} style={{ position: 'absolute', left: '10px', color: 'var(--archon-text-muted)', pointerEvents: 'none' }} />
                  <input
                    type="url"
                    name="githubUrl"
                    required
                    value={formData.githubUrl}
                    onChange={handleChange}
                    placeholder="https://github.com/organization/project-name"
                    style={{
                      width: '100%',
                      paddingLeft: '32px',
                      paddingRight: '12px',
                      paddingTop: '9px',
                      paddingBottom: '9px',
                      fontSize: '0.82rem',
                      background: '#0c0c0e',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '8px',
                      color: 'var(--archon-text)'
                    }}
                  />
                </div>
                <span style={{ fontSize: '0.7rem', color: 'var(--archon-text-muted)', marginTop: '4px', display: 'block' }}>
                  Must contain source code, configuration files, and evaluation scripts.
                </span>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, color: 'var(--archon-text-secondary)', marginBottom: '6px' }}>
                  Architecture 1-Pager / Design Specification URL
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <FileText size={14} style={{ position: 'absolute', left: '10px', color: 'var(--archon-text-muted)', pointerEvents: 'none' }} />
                  <input
                    type="url"
                    name="onePagerUrl"
                    required
                    value={formData.onePagerUrl}
                    onChange={handleChange}
                    placeholder="https://notion.so/... or https://docs.google.com/..."
                    style={{
                      width: '100%',
                      paddingLeft: '32px',
                      paddingRight: '12px',
                      paddingTop: '9px',
                      paddingBottom: '9px',
                      fontSize: '0.82rem',
                      background: '#0c0c0e',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '8px',
                      color: 'var(--archon-text)'
                    }}
                  />
                </div>
                <span style={{ fontSize: '0.7rem', color: 'var(--archon-text-muted)', marginTop: '4px', display: 'block' }}>
                  A public link to your architecture diagram, ADR trade-offs, and evaluation benchmark results.
                </span>
              </div>
            </div>

            {/* Form Actions */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px', marginTop: '12px', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
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
                style={{ padding: '8px 20px', borderRadius: '8px', fontSize: '0.84rem' }}
              >
                {submitting ? 'Submitting Architecture...' : isEdit ? 'Update Architecture' : 'Submit Architecture for Review →'}
              </button>
            </div>

          </form>
        </div>

        {/* RIGHT COLUMN: GOVERNANCE RULES & EVALUATION CHECKLIST */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Card 1: Compulsory ADR Rule */}
          <div className="premium-card" style={{ padding: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <ShieldCheck size={16} style={{ color: 'var(--archon-cyan)' }} />
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--archon-text)' }}>
                Compulsory ADR Rule
              </span>
            </div>
            <p style={{ fontSize: '0.76rem', color: 'var(--archon-text-secondary)', lineHeight: 1.45, margin: 0 }}>
              Merely selecting a tech stack item is not gradeable. Every architectural choice requires written reasoning (&gt; 5 chars) explaining trade-offs.
            </p>
          </div>

          {/* Card 2: 6 Rubric Evaluation Domains */}
          <div className="premium-card" style={{ padding: '18px' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--archon-text)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '10px' }}>
              Evaluation Domains Covered
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {[
                '00. Decision Gate (RAG, Agents, FT, Distil)',
                '01. RAG Architecture (Chunking, Vector DB)',
                '02. Agentic AI & Tool Protocols (MCP)',
                '03. Model Trade-Offs & Fine-Tuning',
                '04. Distillation & Compression Methods',
                '05. LLMOps, Guardrails & Evals (Ragas)'
              ].map((domain, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.74rem', color: 'var(--archon-text-secondary)' }}>
                  <CheckCircle2 size={12} style={{ color: 'var(--archon-success)', flexShrink: 0 }} />
                  <span>{domain}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 3: Review Standard Quick Link */}
          <div className="premium-card" style={{ padding: '16px', background: 'rgba(56, 189, 248, 0.03)', borderColor: 'rgba(56, 189, 248, 0.15)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <Sparkles size={14} style={{ color: 'var(--archon-cyan)' }} />
              <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--archon-cyan)' }}>
                Need Help Preparing?
              </span>
            </div>
            <p style={{ fontSize: '0.74rem', color: 'var(--archon-text-secondary)', lineHeight: 1.4, marginBottom: '10px' }}>
              Review the full rubric standard and expected architectural justifications before submitting.
            </p>
            <Link to="/rubric" className="btn btn-secondary btn-sm" style={{ width: '100%', justifyContent: 'center', borderRadius: '6px' }}>
              View Rubric Standard <ArrowRight size={12} />
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
};
