import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { StatusBadge, ReasoningBadge } from '../components/common/Badge';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { ErrorState } from '../components/common/ErrorState';
import { Button } from '../components/common/Button';
import { ReviewPipeline } from '../components/dashboard/ReviewPipeline';
import { GovernanceScore } from '../components/analytics/GovernanceScore';
import { ReasoningCoverage } from '../components/analytics/ReasoningCoverage';
import { ComplianceCard } from '../components/dashboard/ComplianceCard';
import { ArrowRight, ShieldCheck, Cpu, Activity, Radio } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
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

  if (loading) {
    return <LoadingSkeleton count={4} height="90px" />;
  }

  if (error) {
    return <ErrorState title="Command Center Connection Error" message="Could not load summary metrics from the server." onRetry={fetchSummary} />;
  }

  const statusPieData = [
    { name: 'Approved', value: summary?.approved || 0, color: 'var(--archon-success)' },
    { name: 'Needs Revision', value: summary?.needsRevision || 0, color: 'var(--archon-warning)' },
    { name: 'Not Reviewed', value: summary?.notReviewed || 0, color: 'var(--archon-cyan)' }
  ];

  const domainHealth = [
    { domain: 'RAG ARCHITECTURE', score: 92 },
    { domain: 'AGENTIC WORKFLOWS', score: 81 },
    { domain: 'MODEL TRADE-OFFS', score: 89 },
    { domain: 'LLMOPS & EVALS', score: 76 },
    { domain: 'SAFETY & GOVERNANCE', score: 95 },
    { domain: 'DISTILLATION', score: 83 }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Elevated Command Control Panel Header with Tech Brackets */}
      <div className="card-award tech-bracket border-top-accent" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="mono" style={{ fontSize: '0.65rem', padding: '2px 8px', borderRadius: '4px', background: 'var(--archon-cyan-bg)', color: 'var(--archon-cyan)', border: '1px solid var(--archon-cyan-border)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Radio size={10} /> SYSTEM ONLINE • GOVERNANCE OS 2.4
            </span>
          </div>
          <h1 className="font-brand" style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--archon-text)', marginBottom: '2px' }}>
            ARCHON COMMAND CENTER
          </h1>
          <p style={{ color: 'var(--archon-text-muted)', fontSize: '0.8rem' }}>
            Architecture governance, decision reasoning compliance & operational review.
          </p>
        </div>
        <Button variant="primary" onClick={() => navigate('/submissions')}>
          Open Architecture Registry →
        </Button>
      </div>

      {/* 1. REVIEW PIPELINE */}
      <ReviewPipeline summary={summary} />

      {/* 2. GOVERNANCE SCORE */}
      <GovernanceScore
        score={91.4}
        reasoningScore={summary?.reasoningRate || 96}
        completenessScore={88}
        safetyScore={94}
        reviewQuality={91}
      />

      {/* 3. REASONING COVERAGE */}
      <ReasoningCoverage
        reasoningIncludedCount={summary?.reasoningIncluded || 44}
        totalCriteria={summary?.totalSubmissions ? summary.totalSubmissions * 6 : 50}
      />

      {/* 4. ARCHITECTURE HEALTH BY DOMAIN */}
      <div className="card-award tech-bracket">
        <div className="mono" style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--archon-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '14px' }}>
          ARCHITECTURE HEALTH BY DOMAIN
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
          {domainHealth.map((d) => (
            <div key={d.domain} style={{ padding: '12px', background: 'var(--archon-bg)', border: '1px solid var(--archon-border)', borderRadius: 'var(--radius-md)' }}>
              <div className="mono" style={{ fontSize: '0.65rem', color: 'var(--archon-text-muted)', marginBottom: '4px' }}>{d.domain}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                <span className="mono" style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--archon-cyan)' }}>{d.score}%</span>
                <span className="mono" style={{ fontSize: '0.65rem', color: 'var(--archon-success)' }}>● OPTIMAL</span>
              </div>
              <div style={{ height: '3px', background: 'var(--archon-surface)', borderRadius: '2px', marginTop: '6px', overflow: 'hidden' }}>
                <div style={{ width: `${d.score}%`, height: '100%', background: 'var(--archon-cyan)', transition: 'width 0.6s var(--spring-bounce)' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Analytics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '16px' }}>
        <div className="card-award">
          <h3 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '14px', color: 'var(--archon-text)' }}>
            STATUS DISTRIBUTION
          </h3>
          <div style={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={40} outerRadius={70}>
                  {statusPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'var(--archon-surface-elevated)', borderColor: 'var(--archon-border)', color: 'var(--archon-text)', borderRadius: '6px' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <ComplianceCard summary={summary} />
      </div>

      {/* 5. RECENT ARCHITECTURES QUEUE TABLE */}
      <div className="card-award tech-bracket">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--archon-text)' }}>
            RECENT ARCHITECTURES REGISTRY
          </h3>
          <Link to="/submissions" className="btn btn-secondary btn-sm">
            View All <ArrowRight size={12} />
          </Link>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>PROJECT TITLE</th>
                <th>INTERN</th>
                <th>STATUS</th>
                <th>SUBMITTED</th>
                <th>REASONING</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {summary?.recentSubmissions?.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '24px', color: 'var(--archon-text-muted)' }}>
                    No capstone submissions in queue.
                  </td>
                </tr>
              ) : (
                summary?.recentSubmissions?.map((sub) => (
                  <tr key={sub.id}>
                    <td className="mono" style={{ fontSize: '0.725rem', color: 'var(--archon-text-muted)' }}>ARCH-{String(sub.id).padStart(3, '0')}</td>
                    <td style={{ fontWeight: 700, color: 'var(--archon-text)' }}>{sub.projectTitle}</td>
                    <td style={{ color: 'var(--archon-text-secondary)' }}>{sub.internName}</td>
                    <td><StatusBadge status={sub.status} /></td>
                    <td className="mono" style={{ fontSize: '0.725rem', color: 'var(--archon-text-muted)' }}>{sub.dateSubmitted}</td>
                    <td><ReasoningBadge included={sub.reasoningIncluded} /></td>
                    <td>
                      <Link to={`/submissions/${sub.id}`} className="btn btn-secondary btn-sm">
                        Review →
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
