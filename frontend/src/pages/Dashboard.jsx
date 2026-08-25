import React, { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { StatusBadge, ReasoningBadge } from '../components/common/Badge';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { ErrorState } from '../components/common/ErrorState';
import {
  Layers,
  Clock,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Shield,
  Search,
  BookOpen,
  CheckSquare,
  XCircle,
  TrendingUp,
  SlidersHorizontal,
  ChevronRight
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
        <LoadingSkeleton count={1} height="60px" />
        <LoadingSkeleton count={4} height="120px" />
        <LoadingSkeleton count={2} height="280px" />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Unable to Load Dashboard"
        message="Could not connect to the ARCHON governance service."
        onRetry={fetchSummary}
      />
    );
  }

  const notReviewedCount = summary?.notReviewed || 0;
  const needsRevisionCount = summary?.needsRevision || 0;
  const approvedCount = summary?.approved || 0;
  const totalCount = summary?.totalSubmissions || 0;
  const reasoningRate = summary?.reasoningRate || 0;

  const statusPieData = [
    { name: 'Approved', value: approvedCount, color: '#34D399' },
    { name: 'Needs Revision', value: needsRevisionCount, color: '#FBBF24' },
    { name: 'Not Reviewed', value: notReviewedCount, color: '#38BDF8' }
  ].filter((d) => d.value > 0);

  const domainScores = [
    { code: '01', name: 'RAG Architecture', score: 94 },
    { code: '02', name: 'Agentic Workflows', score: 91 },
    { code: '03', name: 'Model Trade-Offs', score: 89 },
    { code: '04', name: 'Distillation', score: 92 },
    { code: '05', name: 'LLMOps & Evals', score: 88 },
    { code: '06', name: 'Safety & Governance', score: 96 }
  ];

  const govScore = 91.4;
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (govScore / 100) * circumference;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }} className="page-transition">
      
      {/* 1. CLEAN PREMIUM HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge-premium badge-emerald">
              <span className="badge-dot" /> Live System
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--archon-text-muted)' }}>• ARCHON OS v2.4</span>
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--archon-text)', letterSpacing: '-0.02em', margin: 0 }}>
            Command Center
          </h1>
          <p style={{ color: 'var(--archon-text-secondary)', fontSize: '0.85rem', marginTop: '2px' }}>
            Executive architecture governance, compulsory reasoning compliance & review tracking
          </p>
        </div>

        {/* Header Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Link to="/rubric" className="btn btn-secondary btn-sm" style={{ padding: '8px 14px', borderRadius: '8px' }}>
            <BookOpen size={14} /> Rubric Standard
          </Link>
          <button
            onClick={() => navigate('/submissions')}
            className="btn btn-primary"
            style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '0.82rem', gap: '8px' }}
          >
            Submissions Queue ({totalCount}) <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* 2. REFINED 4 KPI METRIC CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
        
        {/* Card 1: Total Architectures */}
        <div className="premium-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--archon-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Total Architectures
            </span>
            <div style={{ background: 'rgba(255, 255, 255, 0.05)', color: 'var(--archon-text-secondary)', padding: '6px', borderRadius: '6px' }}>
              <Layers size={15} />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--archon-text)', lineHeight: 1.1 }}>
            {totalCount}
          </div>
          <div style={{ marginTop: '8px', fontSize: '0.75rem', color: 'var(--archon-text-secondary)' }}>
            All active submissions in registry
          </div>
        </div>

        {/* Card 2: Not Reviewed */}
        <div
          className="premium-card"
          style={{ cursor: 'pointer' }}
          onClick={() => navigate('/submissions?status=NOT_REVIEWED')}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--archon-cyan)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Awaiting Review
            </span>
            <div style={{ background: 'rgba(56, 189, 248, 0.1)', color: 'var(--archon-cyan)', padding: '6px', borderRadius: '6px' }}>
              <Clock size={15} />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--archon-cyan)', lineHeight: 1.1 }}>
            {notReviewedCount}
          </div>
          <div style={{ marginTop: '8px', fontSize: '0.75rem', color: 'var(--archon-text-secondary)' }}>
            {notReviewedCount === 0 ? 'Queue is clear' : 'Pending reviewer evaluation'}
          </div>
        </div>

        {/* Card 3: Needs Revision */}
        <div
          className="premium-card"
          style={{ cursor: 'pointer' }}
          onClick={() => navigate('/submissions?status=NEEDS_REVISION')}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--archon-warning)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Needs Revision
            </span>
            <div style={{ background: 'rgba(251, 191, 36, 0.1)', color: 'var(--archon-warning)', padding: '6px', borderRadius: '6px' }}>
              <AlertTriangle size={15} />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--archon-warning)', lineHeight: 1.1 }}>
            {needsRevisionCount}
          </div>
          <div style={{ marginTop: '8px', fontSize: '0.75rem', color: 'var(--archon-text-secondary)' }}>
            Missing reasoning or review edits
          </div>
        </div>

        {/* Card 4: Approved */}
        <div
          className="premium-card"
          style={{ cursor: 'pointer' }}
          onClick={() => navigate('/submissions?status=APPROVED')}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--archon-success)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Approved
            </span>
            <div style={{ background: 'rgba(52, 211, 153, 0.1)', color: 'var(--archon-success)', padding: '6px', borderRadius: '6px' }}>
              <CheckCircle2 size={15} />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--archon-success)', lineHeight: 1.1 }}>
            {approvedCount}
          </div>
          <div style={{ marginTop: '8px', fontSize: '0.75rem', color: 'var(--archon-text-secondary)' }}>
            {summary?.approvalRate || 0}% overall approval rate
          </div>
        </div>

      </div>

      {/* 3. SLEEK CONNECTED REVIEW PIPELINE */}
      <div className="premium-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--archon-text)' }}>
            Review Pipeline Flow
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--archon-text-muted)' }}>
            Interactive stage navigation
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
          
          <div
            onClick={() => navigate('/submissions')}
            style={{
              padding: '12px 14px',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.18s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)'}
          >
            <div style={{ fontSize: '0.7rem', color: 'var(--archon-text-muted)', marginBottom: '4px' }}>01. Submitted</div>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--archon-text)' }}>{totalCount}</span>
              <span style={{ fontSize: '0.7rem', color: 'var(--archon-text-muted)' }}>100%</span>
            </div>
          </div>

          <div
            onClick={() => navigate('/submissions?status=NOT_REVIEWED')}
            style={{
              padding: '12px 14px',
              background: notReviewedCount > 0 ? 'rgba(56, 189, 248, 0.04)' : 'rgba(255, 255, 255, 0.02)',
              border: notReviewedCount > 0 ? '1px solid rgba(56, 189, 248, 0.25)' : '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.18s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--archon-cyan)'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = notReviewedCount > 0 ? 'rgba(56, 189, 248, 0.25)' : 'rgba(255, 255, 255, 0.06)'}
          >
            <div style={{ fontSize: '0.7rem', color: 'var(--archon-cyan)', marginBottom: '4px' }}>02. Not Reviewed</div>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--archon-cyan)' }}>{notReviewedCount}</span>
              <span style={{ fontSize: '0.7rem', color: 'var(--archon-text-muted)' }}>
                {totalCount > 0 ? Math.round((notReviewedCount / totalCount) * 100) : 0}%
              </span>
            </div>
          </div>

          <div
            onClick={() => navigate('/submissions?status=NEEDS_REVISION')}
            style={{
              padding: '12px 14px',
              background: needsRevisionCount > 0 ? 'rgba(251, 191, 36, 0.04)' : 'rgba(255, 255, 255, 0.02)',
              border: needsRevisionCount > 0 ? '1px solid rgba(251, 191, 36, 0.25)' : '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.18s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--archon-warning)'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = needsRevisionCount > 0 ? 'rgba(251, 191, 36, 0.25)' : 'rgba(255, 255, 255, 0.06)'}
          >
            <div style={{ fontSize: '0.7rem', color: 'var(--archon-warning)', marginBottom: '4px' }}>03. Needs Revision</div>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--archon-warning)' }}>{needsRevisionCount}</span>
              <span style={{ fontSize: '0.7rem', color: 'var(--archon-text-muted)' }}>
                {totalCount > 0 ? Math.round((needsRevisionCount / totalCount) * 100) : 0}%
              </span>
            </div>
          </div>

          <div
            onClick={() => navigate('/submissions?status=APPROVED')}
            style={{
              padding: '12px 14px',
              background: approvedCount > 0 ? 'rgba(52, 211, 153, 0.04)' : 'rgba(255, 255, 255, 0.02)',
              border: approvedCount > 0 ? '1px solid rgba(52, 211, 153, 0.25)' : '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.18s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--archon-success)'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = approvedCount > 0 ? 'rgba(52, 211, 153, 0.25)' : 'rgba(255, 255, 255, 0.06)'}
          >
            <div style={{ fontSize: '0.7rem', color: 'var(--archon-success)', marginBottom: '4px' }}>04. Approved</div>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--archon-success)' }}>{approvedCount}</span>
              <span style={{ fontSize: '0.7rem', color: 'var(--archon-text-muted)' }}>
                {summary?.approvalRate || 0}%
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* 4. BALANCED 2-COLUMN INTELLIGENCE HUB */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '16px' }}>
        
        {/* Left Card: Review Distribution & Reasoning Compliance */}
        <div className="premium-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--archon-text)' }}>
                Review Status & Reasoning Compliance
              </span>
              <span className="badge-premium badge-cyan">
                {reasoningRate}% Verified
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', padding: '6px 0' }}>
              
              {/* Clean Donut Chart */}
              <div style={{ width: 130, height: 130, position: 'relative', flexShrink: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusPieData.length > 0 ? statusPieData : [{ name: 'Empty', value: 1, color: '#27272a' }]}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={44}
                      outerRadius={62}
                      paddingAngle={4}
                      stroke="none"
                    >
                      {(statusPieData.length > 0 ? statusPieData : [{ color: '#27272a' }]).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#18181b',
                        borderColor: '#27272a',
                        color: '#f4f4f5',
                        borderRadius: '8px',
                        fontSize: '0.75rem',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                  <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--archon-text)', lineHeight: 1 }}>
                    {totalCount}
                  </span>
                  <span style={{ fontSize: '0.6rem', color: 'var(--archon-text-muted)', marginTop: '2px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Total
                  </span>
                </div>
              </div>

              {/* Status & Reasoning List */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: 'var(--archon-text-secondary)' }}>
                    <CheckSquare size={13} style={{ color: 'var(--archon-success)' }} />
                    <span>Verified Reasoning</span>
                  </div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--archon-success)' }}>
                    {summary?.reasoningIncluded || 0}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: 'var(--archon-text-secondary)' }}>
                    <XCircle size={13} style={{ color: 'var(--archon-warning)' }} />
                    <span>Missing Reasoning</span>
                  </div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--archon-warning)' }}>
                    {summary?.reasoningMissing || 0}
                  </span>
                </div>
              </div>

            </div>
          </div>

          <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: '0.72rem', color: 'var(--archon-text-muted)' }}>
            Decisions without valid architectural reasoning (&gt; 5 chars) require intern revision before approval.
          </div>
        </div>

        {/* Right Card: Governance Health & Domain Scorecard */}
        <div className="premium-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--archon-text)' }}>
                System Governance Index
              </span>
              <span className="badge-premium badge-emerald">
                91.4% Optimal
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '16px' }}>
              
              {/* Clean Animated Score Ring */}
              <div style={{ position: 'relative', width: '80px', height: '80px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="80" height="80" style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx="40" cy="40" r={radius} stroke="rgba(255,255,255,0.08)" strokeWidth="5" fill="transparent" />
                  <circle
                    cx="40"
                    cy="40"
                    r={radius}
                    stroke="var(--archon-cyan)"
                    strokeWidth="5"
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 0.8s ease' }}
                  />
                </svg>
                <div style={{ position: 'absolute', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--archon-text)', lineHeight: 1 }}>
                    {govScore}
                  </div>
                  <div style={{ fontSize: '0.55rem', color: 'var(--archon-text-muted)', marginTop: '2px' }}>
                    / 100
                  </div>
                </div>
              </div>

              {/* Sub-Metrics Progress Bars */}
              <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px 18px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--archon-text-muted)', marginBottom: '3px' }}>
                    <span>Reasoning</span>
                    <span style={{ color: 'var(--archon-text)', fontWeight: 600 }}>{reasoningRate}%</span>
                  </div>
                  <div style={{ height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ width: `${reasoningRate}%`, height: '100%', background: 'var(--archon-cyan)' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--archon-text-muted)', marginBottom: '3px' }}>
                    <span>ADR Depth</span>
                    <span style={{ color: 'var(--archon-text)', fontWeight: 600 }}>88%</span>
                  </div>
                  <div style={{ height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ width: '88%', height: '100%', background: 'var(--archon-indigo)' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--archon-text-muted)', marginBottom: '3px' }}>
                    <span>Safety</span>
                    <span style={{ color: 'var(--archon-text)', fontWeight: 600 }}>94%</span>
                  </div>
                  <div style={{ height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ width: '94%', height: '100%', background: 'var(--archon-success)' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--archon-text-muted)', marginBottom: '3px' }}>
                    <span>LLMOps</span>
                    <span style={{ color: 'var(--archon-text)', fontWeight: 600 }}>91%</span>
                  </div>
                  <div style={{ height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ width: '91%', height: '100%', background: 'var(--archon-warning)' }} />
                  </div>
                </div>
              </div>

            </div>

            {/* 6 Domains Minimalist Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
              {domainScores.map((d) => (
                <div key={d.code} style={{ padding: '6px 10px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '6px' }}>
                  <div style={{ fontSize: '0.65rem', color: 'var(--archon-text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {d.name}
                  </div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--archon-text)', marginTop: '2px' }}>
                    {d.score}%
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>

      {/* 5. RECENT SUBMISSIONS TABLE */}
      <div className="premium-card" style={{ padding: '20px' }}>
        
        {/* Table Controls */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--archon-text)', margin: 0 }}>
              Recent Architecture Submissions
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--archon-text-muted)' }}>
              Showing {filteredSubmissions.length} of {totalCount} total submissions
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            
            {/* Search Input */}
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Search size={13} style={{ position: 'absolute', left: '10px', color: 'var(--archon-text-muted)', pointerEvents: 'none' }} />
              <input
                type="text"
                placeholder="Search projects, interns..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  paddingLeft: '28px',
                  paddingRight: '12px',
                  height: '32px',
                  fontSize: '0.78rem',
                  background: '#0e0e11',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '6px',
                  color: 'var(--archon-text)',
                  width: '200px'
                }}
              />
            </div>

            {/* Status Filter Buttons */}
            <div style={{ display: 'flex', background: '#0e0e11', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', padding: '2px' }}>
              {['ALL', 'NOT_REVIEWED', 'NEEDS_REVISION', 'APPROVED'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  style={{
                    padding: '3px 8px',
                    fontSize: '0.7rem',
                    fontWeight: 500,
                    borderRadius: '4px',
                    background: statusFilter === st ? 'rgba(255,255,255,0.08)' : 'transparent',
                    color: statusFilter === st ? '#FFFFFF' : 'var(--archon-text-muted)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {st === 'NOT_REVIEWED' ? 'Not Reviewed' : st === 'NEEDS_REVISION' ? 'Revision' : st === 'APPROVED' ? 'Approved' : 'All'}
                </button>
              ))}
            </div>

            <Link to="/submissions" className="btn btn-secondary btn-sm" style={{ height: '32px', borderRadius: '6px' }}>
              View All <ArrowRight size={13} />
            </Link>
          </div>
        </div>

        {/* Table Content */}
        <div className="table-container" style={{ border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px' }}>
          <table>
            <thead>
              <tr>
                <th style={{ background: '#0e0e11' }}>ID</th>
                <th style={{ background: '#0e0e11' }}>Project Title</th>
                <th style={{ background: '#0e0e11' }}>Domain</th>
                <th style={{ background: '#0e0e11' }}>Intern</th>
                <th style={{ background: '#0e0e11' }}>Status</th>
                <th style={{ background: '#0e0e11' }}>Reasoning</th>
                <th style={{ background: '#0e0e11' }}>Submitted</th>
                <th style={{ background: '#0e0e11', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubmissions.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '36px', color: 'var(--archon-text-muted)' }}>
                    No matching submissions found.
                  </td>
                </tr>
              ) : (
                filteredSubmissions.map((sub) => (
                  <tr key={sub.id}>
                    <td style={{ fontSize: '0.75rem', color: 'var(--archon-text-muted)', fontFamily: 'var(--font-mono)' }}>
                      #{sub.id}
                    </td>
                    <td style={{ fontWeight: 600, color: 'var(--archon-text)' }}>
                      {sub.projectTitle}
                    </td>
                    <td>
                      <span className="badge-premium badge-gray">
                        {sub.projectDomain || 'GenAI'}
                      </span>
                    </td>
                    <td style={{ color: 'var(--archon-text-secondary)', fontSize: '0.8rem' }}>
                      {sub.internName}
                    </td>
                    <td>
                      <StatusBadge status={sub.status} />
                    </td>
                    <td>
                      <ReasoningBadge included={sub.reasoningIncluded} />
                    </td>
                    <td style={{ fontSize: '0.75rem', color: 'var(--archon-text-muted)' }}>
                      {sub.dateSubmitted}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <Link
                        to={`/submissions/${sub.id}`}
                        className="btn btn-secondary btn-sm"
                        style={{
                          fontSize: '0.72rem',
                          padding: '4px 10px',
                          borderRadius: '6px'
                        }}
                      >
                        Review <ArrowRight size={12} />
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
