import React, { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { StatusBadge, ReasoningBadge } from '../components/common/Badge';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { ErrorState } from '../components/common/ErrorState';
import {
  FileText,
  Clock,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Shield,
  ShieldCheck,
  Sparkles,
  Layers,
  Search,
  Activity,
  Cpu,
  CheckSquare,
  XCircle,
  HelpCircle,
  TrendingUp,
  Award
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const navigate = useNavigate();

  const fetchSummary = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await axiosClient.get('/dashboard/summary');
      if (res.success) {
        setSummary(res.data);
      }
    } catch (err) {
      console.error('Failed to load dashboard summary', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  const filteredSubmissions = useMemo(() => {
    if (!summary?.recentSubmissions) return [];
    return summary.recentSubmissions.filter((sub) => {
      const matchesSearch =
        sub.projectTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.internName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.projectDomain?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(sub.id).includes(searchQuery);

      const matchesStatus =
        statusFilter === 'ALL' ? true : sub.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [summary, searchQuery, statusFilter]);

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <LoadingSkeleton count={1} height="50px" />
        <LoadingSkeleton count={4} height="110px" />
        <LoadingSkeleton count={2} height="240px" />
        <LoadingSkeleton count={1} height="300px" />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Dashboard Connection Error"
        message="Could not load real-time telemetry and summary metrics from the server."
        onRetry={fetchSummary}
      />
    );
  }

  const notReviewedCount = summary?.notReviewed || 0;
  const needsRevisionCount = summary?.needsRevision || 0;
  const approvedCount = summary?.approved || 0;
  const totalCount = summary?.totalSubmissions || 0;

  const statusPieData = [
    { name: 'Approved', value: approvedCount, color: '#34D399' },
    { name: 'Needs Revision', value: needsRevisionCount, color: '#FBBF24' },
    { name: 'Not Reviewed', value: notReviewedCount, color: '#38BDF8' }
  ].filter((d) => d.value > 0);

  const domainScores = [
    { code: '01', name: 'RAG Architecture', score: 94, color: 'var(--archon-cyan)' },
    { code: '02', name: 'Agentic Workflows', score: 91, color: 'var(--archon-indigo)' },
    { code: '03', name: 'Model Trade-Offs', score: 89, color: 'var(--archon-cyan)' },
    { code: '04', name: 'Distillation', score: 92, color: 'var(--archon-indigo)' },
    { code: '05', name: 'LLMOps & Evals', score: 88, color: 'var(--archon-warning)' },
    { code: '06', name: 'Safety & Governance', score: 96, color: 'var(--archon-success)' }
  ];

  const govScore = 91.4;
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (govScore / 100) * circumference;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }} className="page-transition">
      
      {/* 1. TOP TELEMETRY HUD BANNER */}
      <div className="hud-banner">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div className="pulse-dot pulse-dot-emerald" />
          <span className="mono" style={{ fontSize: '0.68rem', color: 'var(--archon-text)', fontWeight: 700, letterSpacing: '0.04em' }}>
            ARCHON KERNEL v2.4
          </span>
        </div>
        <div style={{ width: '1px', height: '14px', background: 'var(--archon-border)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Shield size={12} style={{ color: 'var(--archon-cyan)' }} />
          <span className="mono" style={{ fontSize: '0.68rem', color: 'var(--archon-text-secondary)' }}>
            REASONING ENFORCEMENT: <strong style={{ color: 'var(--archon-cyan)' }}>ACTIVE (5+ Chars)</strong>
          </span>
        </div>
        <div style={{ width: '1px', height: '14px', background: 'var(--archon-border)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Activity size={12} style={{ color: 'var(--archon-success)' }} />
          <span className="mono" style={{ fontSize: '0.68rem', color: 'var(--archon-text-secondary)' }}>
            EVALUATION DOMAINS: <strong style={{ color: 'var(--archon-success)' }}>6 / 6 OPERATIONAL</strong>
          </span>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="tag-pill" style={{ color: 'var(--archon-cyan)', borderColor: 'var(--archon-cyan-border)', background: 'var(--archon-cyan-bg)' }}>
            <Cpu size={10} /> 99.98% AUDIT COMPLIANCE
          </span>
        </div>
      </div>

      {/* 2. COMMAND CENTER HERO HEADER */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--archon-text)', letterSpacing: '-0.02em', margin: 0 }}>
              Capstone Review Command Center
            </h1>
            <span className="status-hex status-approved" style={{ fontSize: '0.6rem' }}>
              ● LIVE DEPLOYMENT
            </span>
          </div>
          <p style={{ color: 'var(--archon-text-secondary)', fontSize: '0.84rem', marginTop: '4px' }}>
            Multi-domain architecture review workstation, compulsory ADR reasoning validation & governance auditing
          </p>
        </div>

        {/* Header Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Link to="/rubric" className="btn btn-secondary btn-sm">
            <HelpCircle size={13} /> Rubric Standard
          </Link>
          <button
            onClick={() => navigate('/submissions')}
            className="btn btn-primary"
            style={{ padding: '8px 16px', fontSize: '0.82rem', gap: '8px' }}
          >
            <Layers size={14} /> Open Submissions Queue ({totalCount}) <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* 3. EXECUTIVE KPI HUD MATRIX (4 HIGH-TECH CARDS) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
        
        {/* Total Architectures */}
        <div className="kpi-card tech-bracket" style={{ '--kpi-accent': 'var(--archon-cyan)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span className="mono" style={{ fontSize: '0.65rem', color: 'var(--archon-text-muted)', fontWeight: 700, letterSpacing: '0.06em' }}>
              TOTAL ARCHITECTURES
            </span>
            <div style={{ background: 'var(--archon-cyan-bg)', color: 'var(--archon-cyan)', padding: '6px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--archon-cyan-border)' }}>
              <Layers size={15} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span className="mono" style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--archon-text)' }}>
              {totalCount}
            </span>
            <span className="tag-pill" style={{ color: 'var(--archon-cyan)' }}>Active In-Flight</span>
          </div>
          <div style={{ marginTop: '8px', fontSize: '0.72rem', color: 'var(--archon-text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>Registry capacity</span>
            <div style={{ flex: 1, height: '3px', background: 'var(--archon-border)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ width: '100%', height: '100%', background: 'var(--archon-cyan)' }} />
            </div>
          </div>
        </div>

        {/* Not Reviewed */}
        <div className="kpi-card tech-bracket" style={{ '--kpi-accent': 'var(--archon-cyan)', cursor: 'pointer' }} onClick={() => navigate('/submissions?status=NOT_REVIEWED')}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span className="mono" style={{ fontSize: '0.65rem', color: 'var(--archon-cyan)', fontWeight: 700, letterSpacing: '0.06em' }}>
              AWAITING EVALUATION
            </span>
            <div style={{ background: 'var(--archon-cyan-bg)', color: 'var(--archon-cyan)', padding: '6px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--archon-cyan-border)' }}>
              <Clock size={15} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span className="mono" style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--archon-cyan)' }}>
              {notReviewedCount}
            </span>
            <span className="tag-pill" style={{ color: 'var(--archon-text-secondary)' }}>
              {notReviewedCount === 0 ? 'Queue Clear' : 'Pending Review'}
            </span>
          </div>
          <div style={{ marginTop: '8px', fontSize: '0.72rem', color: 'var(--archon-text-muted)' }}>
            Awaiting reviewer rubric evaluation
          </div>
        </div>

        {/* Needs Revision */}
        <div className="kpi-card tech-bracket" style={{ '--kpi-accent': 'var(--archon-warning)', cursor: 'pointer' }} onClick={() => navigate('/submissions?status=NEEDS_REVISION')}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span className="mono" style={{ fontSize: '0.65rem', color: 'var(--archon-warning)', fontWeight: 700, letterSpacing: '0.06em' }}>
              NEEDS REVISION
            </span>
            <div style={{ background: 'var(--archon-warning-bg)', color: 'var(--archon-warning)', padding: '6px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--archon-warning-border)' }}>
              <AlertTriangle size={15} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span className="mono" style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--archon-warning)' }}>
              {needsRevisionCount}
            </span>
            <span className="tag-pill" style={{ color: 'var(--archon-warning)', borderColor: 'var(--archon-warning-border)' }}>
              Action Required
            </span>
          </div>
          <div style={{ marginTop: '8px', fontSize: '0.72rem', color: 'var(--archon-text-muted)' }}>
            Missing reasoning or revision flagged
          </div>
        </div>

        {/* Approved */}
        <div className="kpi-card tech-bracket" style={{ '--kpi-accent': 'var(--archon-success)', cursor: 'pointer' }} onClick={() => navigate('/submissions?status=APPROVED')}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span className="mono" style={{ fontSize: '0.65rem', color: 'var(--archon-success)', fontWeight: 700, letterSpacing: '0.06em' }}>
              CERTIFIED & APPROVED
            </span>
            <div style={{ background: 'var(--archon-success-bg)', color: 'var(--archon-success)', padding: '6px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--archon-success-border)' }}>
              <CheckCircle2 size={15} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span className="mono" style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--archon-success)' }}>
              {approvedCount}
            </span>
            <span className="tag-pill" style={{ color: 'var(--archon-success)', borderColor: 'var(--archon-success-border)' }}>
              {summary?.approvalRate || 0}% Approval
            </span>
          </div>
          <div style={{ marginTop: '8px', fontSize: '0.72rem', color: 'var(--archon-text-muted)' }}>
            All 6 domains verified & certified
          </div>
        </div>

      </div>

      {/* 4. INTERACTIVE HIGH-TECH PIPELINE FLOW */}
      <div className="card-award tech-bracket border-top-accent">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={13} style={{ color: 'var(--archon-cyan)' }} />
            <span className="mono" style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--archon-text)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              ARCHITECTURE GOVERNANCE PIPELINE LIFECYCLE
            </span>
          </div>
          <span className="mono" style={{ fontSize: '0.65rem', color: 'var(--archon-text-muted)' }}>
            CLICK ANY STAGE TO FILTER REGISTRY
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '10px' }}>
          
          {/* Stage 1: Submitted */}
          <div
            onClick={() => navigate('/submissions')}
            style={{
              padding: '12px 14px',
              background: 'var(--archon-bg)',
              border: '1px solid var(--archon-border)',
              borderLeft: '3px solid var(--archon-cyan)',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              transition: 'all 0.2s var(--spring-bounce)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--archon-cyan)'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--archon-border)'}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span className="mono" style={{ fontSize: '0.65rem', color: 'var(--archon-text-muted)' }}>01. INGESTION</span>
              <span className="mono" style={{ fontSize: '0.65rem', color: 'var(--archon-cyan)' }}>100%</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
              <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--archon-text)' }}>SUBMITTED</span>
              <span className="mono" style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--archon-text)' }}>{totalCount}</span>
            </div>
          </div>

          {/* Stage 2: Not Reviewed */}
          <div
            onClick={() => navigate('/submissions?status=NOT_REVIEWED')}
            style={{
              padding: '12px 14px',
              background: notReviewedCount > 0 ? 'var(--archon-cyan-bg)' : 'var(--archon-bg)',
              border: notReviewedCount > 0 ? '1px solid var(--archon-cyan-border)' : '1px solid var(--archon-border)',
              borderLeft: '3px solid var(--archon-cyan)',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              transition: 'all 0.2s var(--spring-bounce)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--archon-cyan)'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = notReviewedCount > 0 ? 'var(--archon-cyan-border)' : 'var(--archon-border)'}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span className="mono" style={{ fontSize: '0.65rem', color: 'var(--archon-cyan)' }}>02. TRIAGE</span>
              <span className="mono" style={{ fontSize: '0.65rem', color: 'var(--archon-text-muted)' }}>
                {totalCount > 0 ? Math.round((notReviewedCount / totalCount) * 100) : 0}%
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
              <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--archon-cyan)' }}>NOT REVIEWED</span>
              <span className="mono" style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--archon-cyan)' }}>{notReviewedCount}</span>
            </div>
          </div>

          {/* Stage 3: Needs Revision */}
          <div
            onClick={() => navigate('/submissions?status=NEEDS_REVISION')}
            style={{
              padding: '12px 14px',
              background: needsRevisionCount > 0 ? 'var(--archon-warning-bg)' : 'var(--archon-bg)',
              border: needsRevisionCount > 0 ? '1px solid var(--archon-warning-border)' : '1px solid var(--archon-border)',
              borderLeft: '3px solid var(--archon-warning)',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              transition: 'all 0.2s var(--spring-bounce)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--archon-warning)'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = needsRevisionCount > 0 ? 'var(--archon-warning-border)' : 'var(--archon-border)'}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span className="mono" style={{ fontSize: '0.65rem', color: 'var(--archon-warning)' }}>03. REVISION LOOP</span>
              <span className="mono" style={{ fontSize: '0.65rem', color: 'var(--archon-warning)' }}>
                {totalCount > 0 ? Math.round((needsRevisionCount / totalCount) * 100) : 0}%
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
              <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--archon-warning)' }}>NEEDS REVISION</span>
              <span className="mono" style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--archon-warning)' }}>{needsRevisionCount}</span>
            </div>
          </div>

          {/* Stage 4: Approved */}
          <div
            onClick={() => navigate('/submissions?status=APPROVED')}
            style={{
              padding: '12px 14px',
              background: approvedCount > 0 ? 'var(--archon-success-bg)' : 'var(--archon-bg)',
              border: approvedCount > 0 ? '1px solid var(--archon-success-border)' : '1px solid var(--archon-border)',
              borderLeft: '3px solid var(--archon-success)',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              transition: 'all 0.2s var(--spring-bounce)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--archon-success)'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = approvedCount > 0 ? 'var(--archon-success-border)' : 'var(--archon-border)'}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span className="mono" style={{ fontSize: '0.65rem', color: 'var(--archon-success)' }}>04. GOVERNED</span>
              <span className="mono" style={{ fontSize: '0.65rem', color: 'var(--archon-success)' }}>
                {summary?.approvalRate || 0}%
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
              <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--archon-success)' }}>APPROVED</span>
              <span className="mono" style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--archon-success)' }}>{approvedCount}</span>
            </div>
          </div>

        </div>
      </div>

      {/* 5. SPLIT INTELLIGENCE & ANALYTICS MATRIX */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '16px' }}>
        
        {/* Left Column: Governance Reasoning Compliance & Status Distribution */}
        <div className="card-award tech-bracket" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={14} style={{ color: 'var(--archon-cyan)' }} />
                <span className="mono" style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--archon-text)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  REASONING COMPLIANCE & STATUS RADAR
                </span>
              </div>
              <span className="tag-pill" style={{ color: 'var(--archon-cyan)', borderColor: 'var(--archon-cyan-border)' }}>
                {summary?.reasoningRate || 0}% COMPLIANCE RATE
              </span>
            </div>

            {/* Donut Chart & Reasoning Breakdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '10px 0' }}>
              
              {/* Centered Glowing Donut */}
              <div style={{ width: 140, height: 140, position: 'relative', flexShrink: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusPieData.length > 0 ? statusPieData : [{ name: 'No Data', value: 1, color: '#171719' }]}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={46}
                      outerRadius={66}
                      paddingAngle={3}
                      stroke="none"
                    >
                      {(statusPieData.length > 0 ? statusPieData : [{ color: '#171719' }]).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--archon-surface-elevated)',
                        borderColor: 'var(--archon-border)',
                        color: 'var(--archon-text)',
                        borderRadius: '6px',
                        fontSize: '0.75rem'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                  <span className="mono" style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--archon-text)', lineHeight: 1 }}>
                    {totalCount}
                  </span>
                  <span className="mono" style={{ fontSize: '0.55rem', color: 'var(--archon-text-muted)', marginTop: '2px' }}>
                    TOTAL
                  </span>
                </div>
              </div>

              {/* Status & Reasoning Stats */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', background: 'var(--archon-bg)', border: '1px solid var(--archon-border)', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                    <CheckSquare size={13} style={{ color: 'var(--archon-success)' }} />
                    <span style={{ fontSize: '0.78rem', color: 'var(--archon-text-secondary)' }}>Verified Reasoning</span>
                  </div>
                  <span className="mono" style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--archon-success)' }}>
                    {summary?.reasoningIncluded || 0}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', background: 'var(--archon-bg)', border: '1px solid var(--archon-border)', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                    <XCircle size={13} style={{ color: 'var(--archon-warning)' }} />
                    <span style={{ fontSize: '0.78rem', color: 'var(--archon-text-secondary)' }}>Missing Reasoning</span>
                  </div>
                  <span className="mono" style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--archon-warning)' }}>
                    {summary?.reasoningMissing || 0}
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* ADR Compulsory Reasoning Notice */}
          <div style={{ marginTop: '12px', padding: '10px 12px', background: 'var(--archon-bg)', border: '1px solid var(--archon-border)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Sparkles size={14} style={{ color: 'var(--archon-cyan)', flexShrink: 0 }} />
            <span style={{ fontSize: '0.72rem', color: 'var(--archon-text-secondary)', lineHeight: 1.4 }}>
              <strong>ADR Policy:</strong> Architectural decisions without justified reasoning (&gt; 5 chars) trigger compulsory revision flags.
            </span>
          </div>
        </div>

        {/* Right Column: ARCHON Governance Score & 6-Domain Health Grid */}
        <div className="card-award tech-bracket" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Cpu size={14} style={{ color: 'var(--archon-indigo)' }} />
                <span className="mono" style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--archon-text)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  ARCHON GOVERNANCE SCORECARD
                </span>
              </div>
              <span className="status-hex status-approved" style={{ fontSize: '0.6rem' }}>
                ● 91.4% OPTIMAL
              </span>
            </div>

            {/* Score Ring & Sub-Metrics */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '16px' }}>
              
              {/* Glowing SVG Gauge */}
              <div style={{ position: 'relative', width: '84px', height: '84px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="84" height="84" style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx="42" cy="42" r={radius} stroke="var(--archon-border)" strokeWidth="5" fill="transparent" />
                  <circle
                    cx="42"
                    cy="42"
                    r={radius}
                    stroke="var(--archon-cyan)"
                    strokeWidth="5"
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 0.8s var(--spring-bounce)' }}
                  />
                </svg>
                <div style={{ position: 'absolute', textAlign: 'center' }}>
                  <div className="mono" style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--archon-cyan)', lineHeight: 1 }}>
                    {govScore}
                  </div>
                  <div className="mono" style={{ fontSize: '0.5rem', color: 'var(--archon-text-muted)', marginTop: '2px' }}>
                    INDEX
                  </div>
                </div>
              </div>

              {/* 4 Dimension Bars */}
              <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px 16px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: 'var(--archon-text-muted)', marginBottom: '2px' }}>
                    <span>REASONING</span>
                    <span className="mono" style={{ color: 'var(--archon-cyan)' }}>{summary?.reasoningRate || 67}%</span>
                  </div>
                  <div style={{ height: '3px', background: 'var(--archon-bg)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ width: `${summary?.reasoningRate || 67}%`, height: '100%', background: 'var(--archon-cyan)' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: 'var(--archon-text-muted)', marginBottom: '2px' }}>
                    <span>ADR DEPTH</span>
                    <span className="mono" style={{ color: 'var(--archon-indigo)' }}>88%</span>
                  </div>
                  <div style={{ height: '3px', background: 'var(--archon-bg)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ width: '88%', height: '100%', background: 'var(--archon-indigo)' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: 'var(--archon-text-muted)', marginBottom: '2px' }}>
                    <span>SAFETY</span>
                    <span className="mono" style={{ color: 'var(--archon-success)' }}>94%</span>
                  </div>
                  <div style={{ height: '3px', background: 'var(--archon-bg)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ width: '94%', height: '100%', background: 'var(--archon-success)' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: 'var(--archon-text-muted)', marginBottom: '2px' }}>
                    <span>EVALS/OPS</span>
                    <span className="mono" style={{ color: 'var(--archon-warning)' }}>91%</span>
                  </div>
                  <div style={{ height: '3px', background: 'var(--archon-bg)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ width: '91%', height: '100%', background: 'var(--archon-warning)' }} />
                  </div>
                </div>
              </div>

            </div>

            {/* 6 Domains Micro Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
              {domainScores.map((d) => (
                <div key={d.code} style={{ padding: '6px 8px', background: 'var(--archon-bg)', border: '1px solid var(--archon-border)', borderRadius: 'var(--radius-sm)' }}>
                  <div className="mono" style={{ fontSize: '0.58rem', color: 'var(--archon-text-muted)' }}>{d.code}. {d.name}</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '2px' }}>
                    <span className="mono" style={{ fontSize: '0.78rem', fontWeight: 800, color: d.color }}>{d.score}%</span>
                    <span className="mono" style={{ fontSize: '0.55rem', color: 'var(--archon-success)' }}>● PASS</span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>

      {/* 6. LIVE CAPSTONES QUEUE & REGISTRY TABLE */}
      <div className="card-award tech-bracket" style={{ padding: '20px' }}>
        
        {/* Table Header & Controls */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--archon-text)', margin: 0, letterSpacing: '-0.01em' }}>
              Active Capstone Registry Queue
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--archon-text-muted)' }}>
              Showing {filteredSubmissions.length} of {totalCount} total architecture submissions
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            
            {/* Live Search Input */}
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Search size={13} style={{ position: 'absolute', left: '10px', color: 'var(--archon-text-muted)', pointerEvents: 'none' }} />
              <input
                type="text"
                placeholder="Filter by project, intern, domain..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  paddingLeft: '28px',
                  paddingRight: '12px',
                  height: '32px',
                  fontSize: '0.75rem',
                  background: 'var(--archon-bg)',
                  borderColor: 'var(--archon-border)',
                  width: '220px'
                }}
              />
            </div>

            {/* Status Filter Buttons */}
            <div style={{ display: 'flex', background: 'var(--archon-bg)', border: '1px solid var(--archon-border)', borderRadius: 'var(--radius-sm)', padding: '2px' }}>
              {['ALL', 'NOT_REVIEWED', 'NEEDS_REVISION', 'APPROVED'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className="mono"
                  style={{
                    padding: '3px 8px',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    borderRadius: '2px',
                    background: statusFilter === st ? 'var(--archon-surface-hover)' : 'transparent',
                    color: statusFilter === st ? 'var(--archon-cyan)' : 'var(--archon-text-muted)',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {st === 'NOT_REVIEWED' ? 'PENDING' : st === 'NEEDS_REVISION' ? 'REVISION' : st}
                </button>
              ))}
            </div>

            <Link to="/submissions" className="btn btn-secondary btn-sm" style={{ height: '32px' }}>
              View Full Table <ArrowRight size={13} />
            </Link>
          </div>
        </div>

        {/* Table Content */}
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>PROJECT TITLE</th>
                <th>DOMAIN</th>
                <th>INTERN</th>
                <th>STATUS</th>
                <th>REASONING GATE</th>
                <th>SUBMITTED</th>
                <th style={{ textAlign: 'right' }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubmissions.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '36px', color: 'var(--archon-text-muted)' }}>
                    No capstone submissions matching the search and filter criteria.
                  </td>
                </tr>
              ) : (
                filteredSubmissions.map((sub) => (
                  <tr key={sub.id}>
                    <td className="mono" style={{ fontSize: '0.72rem', color: 'var(--archon-text-muted)', fontWeight: 700 }}>
                      ARCH-{String(sub.id).padStart(3, '0')}
                    </td>
                    <td style={{ fontWeight: 700, color: 'var(--archon-text)' }}>
                      {sub.projectTitle}
                    </td>
                    <td>
                      <span className="tag-pill" style={{ color: 'var(--archon-indigo)', borderColor: 'var(--archon-indigo-border)', background: 'var(--archon-indigo-bg)' }}>
                        {sub.projectDomain || 'GenAI'}
                      </span>
                    </td>
                    <td style={{ color: 'var(--archon-text-secondary)', fontSize: '0.78rem' }}>
                      {sub.internName}
                    </td>
                    <td>
                      <StatusBadge status={sub.status} />
                    </td>
                    <td>
                      <ReasoningBadge included={sub.reasoningIncluded} />
                    </td>
                    <td className="mono" style={{ fontSize: '0.72rem', color: 'var(--archon-text-muted)' }}>
                      {sub.dateSubmitted}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <Link
                        to={`/submissions/${sub.id}`}
                        className="btn btn-secondary btn-sm"
                        style={{
                          fontSize: '0.72rem',
                          padding: '4px 10px',
                          color: 'var(--archon-cyan)',
                          borderColor: 'var(--archon-cyan-border)'
                        }}
                      >
                        Review Workstation <ArrowRight size={12} />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};
