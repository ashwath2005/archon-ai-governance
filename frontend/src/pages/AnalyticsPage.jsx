import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { ErrorState } from '../components/common/ErrorState';
import { GovernanceScore } from '../components/analytics/GovernanceScore';
import { Sparkles, ArrowRight } from 'lucide-react';
import { BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h1 className="font-brand" style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--archon-text)', marginBottom: '2px' }}>
          GOVERNANCE INTELLIGENCE
        </h1>
        <p style={{ color: 'var(--archon-text-muted)', fontSize: '0.8rem' }}>
          Domain velocity, architectural reasoning compliance & quality scores.
        </p>
      </div>

      {/* Contextual Intelligence Insight Callout */}
      <div style={{ background: 'var(--archon-surface)', border: '1px solid var(--archon-cyan-border)', borderRadius: 'var(--radius-lg)', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Sparkles size={18} style={{ color: 'var(--archon-cyan)' }} />
          <div>
            <div className="mono" style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--archon-cyan)' }}>GOVERNANCE INTELLIGENCE INSIGHT</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--archon-text)' }}>
              Safety & Prompt Injection criteria account for <strong>38%</strong> of revision requests this period.
            </div>
          </div>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={() => navigate('/submissions?status=NEEDS_REVISION')}>
          View Affected Architectures <ArrowRight size={12} />
        </button>
      </div>

      {/* Signature ARCHON Governance Metric */}
      <GovernanceScore
        score={91.4}
        reasoningScore={summary?.reasoningRate || 96}
        completenessScore={88}
        safetyScore={94}
        reviewQuality={91}
      />

      {/* Benchmark Radar Chart & Domain Distribution Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '16px' }}>
        {/* Industry SLA Radar Benchmark */}
        <div style={{ background: 'var(--archon-surface)', border: '1px solid var(--archon-border)', borderRadius: 'var(--radius-lg)', padding: '20px' }}>
          <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--archon-text)', marginBottom: '14px' }}>
            ENTERPRISE SLA BENCHMARK RADAR
          </h3>
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="var(--archon-border)" />
                <PolarAngleAxis dataKey="subject" stroke="var(--archon-text-muted)" fontSize={10} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="var(--archon-text-muted)" fontSize={9} />
                <Radar name="Project Score" dataKey="ProjectScore" stroke="var(--archon-cyan)" fill="var(--archon-cyan)" fillOpacity={0.25} />
                <Radar name="Enterprise SLA" dataKey="EnterpriseSLA" stroke="var(--archon-indigo)" fill="var(--archon-indigo)" fillOpacity={0.15} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--archon-surface-elevated)', borderColor: 'var(--archon-border)', color: 'var(--archon-text)', borderRadius: '6px' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Submissions by Domain Bar Chart */}
        <div style={{ background: 'var(--archon-surface)', border: '1px solid var(--archon-border)', borderRadius: 'var(--radius-lg)', padding: '20px' }}>
          <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--archon-text)', marginBottom: '14px' }}>
            DOMAIN DISTRIBUTION BREAKDOWN
          </h3>
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={domains}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--archon-border)" />
                <XAxis dataKey="domain" stroke="var(--archon-text-muted)" fontSize={11} />
                <YAxis allowDecimals={false} stroke="var(--archon-text-muted)" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--archon-surface-elevated)', borderColor: 'var(--archon-border)', color: 'var(--archon-text)', borderRadius: '6px' }} />
                <Bar dataKey="count" fill="var(--archon-cyan)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
