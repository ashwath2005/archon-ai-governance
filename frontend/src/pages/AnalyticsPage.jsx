import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { ErrorState } from '../components/common/ErrorState';
import { GovernanceScore } from '../components/analytics/GovernanceScore';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

export const AnalyticsPage = () => {
  const [summary, setSummary] = useState(null);
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(false);
    try {
      const [sumRes, domRes] = await Promise.all([
        axiosClient.get('/dashboard/summary'),
        axiosClient.get('/dashboard/domain-distribution')
      ]);

      if (sumRes.success) setSummary(sumRes.data);
      if (domRes.success) setDomains(domRes.data);
    } catch (err) {
      console.error('Failed to load governance intelligence', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) return <LoadingSkeleton count={4} height="100px" />;
  if (error) return <ErrorState title="Governance Analytics Error" message="Could not retrieve domain analytics from the backend API." onRetry={fetchAnalytics} />;

  const radarData = [
    { subject: 'RAG Systems', ProjectScore: 92, EnterpriseSLA: 95 },
    { subject: 'Agentic Loops', ProjectScore: 81, EnterpriseSLA: 85 },
    { subject: 'Model Trade-Offs', ProjectScore: 89, EnterpriseSLA: 90 },
    { subject: 'Distillation', ProjectScore: 83, EnterpriseSLA: 80 },
    { subject: 'LLMOps & Evals', ProjectScore: 76, EnterpriseSLA: 88 },
    { subject: 'Safety & PII', ProjectScore: 95, EnterpriseSLA: 98 }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} className="page-transition">
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--archon-text)', margin: 0, letterSpacing: '-0.02em' }}>
          Governance Intelligence
        </h1>
        <p style={{ color: 'var(--archon-text-secondary)', fontSize: '0.85rem', marginTop: '2px' }}>
          Benchmark radar scores, reasoning compliance & evaluation quality metrics
        </p>
      </div>

      {/* Intelligence Insight Banner */}
      <div
        className="premium-card"
        style={{
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: 'rgba(56, 189, 248, 0.1)', color: 'var(--archon-cyan)', padding: '8px', borderRadius: '8px' }}>
            <Sparkles size={18} />
          </div>
          <div>
            <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--archon-text)' }}>
              Governance Quality Insight
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--archon-text-secondary)', marginTop: '2px' }}>
              Safety & Prompt Injection criteria account for <strong>38%</strong> of revision requests across submitted architectures.
            </div>
          </div>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={() => navigate('/submissions?status=NEEDS_REVISION')} style={{ borderRadius: '6px' }}>
          View Revisions <ArrowRight size={13} />
        </button>
      </div>

      {/* Governance Metric Card */}
      <div className="premium-card" style={{ padding: '24px' }}>
        <GovernanceScore
          score={91.4}
          reasoningScore={summary?.reasoningRate || 96}
          completenessScore={88}
          safetyScore={94}
          reviewQuality={91}
        />
      </div>

      {/* SLA Radar Benchmark */}
      <div className="premium-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--archon-text)', margin: 0 }}>
            Enterprise SLA Benchmark Radar
          </h3>
          <span className="badge-premium badge-cyan">
            95% Baseline SLA
          </span>
        </div>
        <div style={{ height: 280 }}>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
              <PolarGrid stroke="rgba(255, 255, 255, 0.08)" />
              <PolarAngleAxis dataKey="subject" stroke="var(--archon-text-secondary)" fontSize={11} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="var(--archon-text-muted)" fontSize={10} />
              <Radar name="Project Score" dataKey="ProjectScore" stroke="var(--archon-cyan)" fill="var(--archon-cyan)" fillOpacity={0.25} />
              <Radar name="Enterprise SLA" dataKey="EnterpriseSLA" stroke="var(--archon-indigo)" fill="var(--archon-indigo)" fillOpacity={0.15} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
