import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { StatusBadge, ReasoningBadge } from '../components/common/Badge';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { ErrorState } from '../components/common/ErrorState';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { MetricCard } from '../components/dashboard/MetricCard';
import { ReviewPipeline } from '../components/dashboard/ReviewPipeline';
import { ComplianceCard } from '../components/dashboard/ComplianceCard';
import { FileText, Clock, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';
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
    return <ErrorState title="Dashboard Connection Error" message="Could not load summary metrics from the server." onRetry={fetchSummary} />;
  }
  const statusPieData = [
    { name: 'Approved', value: summary?.approved || 0, color: '#03DAC6' },
    { name: 'Needs Revision', value: summary?.needsRevision || 0, color: '#FFB74D' },
    { name: 'Not Reviewed', value: summary?.notReviewed || 0, color: '#82B1FF' }
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Dashboard Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '2px', letterSpacing: '-0.02em' }}>
            Capstone Review Command Center
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Track architecture decisions, reasoning compliance, and evaluation progress
          </p>
        </div>
        <Button variant="primary" onClick={() => navigate('/submissions')}>
          Open Submissions Queue →
        </Button>
      </div>
      {/* Metric Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
        <MetricCard
          label="Total Projects"
          value={summary?.totalSubmissions || 0}
          description="All active capstone submissions"
          icon={FileText}
          iconColor="var(--accent-primary-light)"
        />
        <MetricCard
          label="Not Reviewed"
          value={summary?.notReviewed || 0}
          description="Awaiting reviewer evaluation"
          icon={Clock}
          iconColor="var(--info-text)"
        />
        <MetricCard
          label="Needs Revision"
          value={summary?.needsRevision || 0}
          description="Pending intern adjustments"
          icon={AlertTriangle}
          iconColor="var(--warning-text)"
        />
        <MetricCard
          label="Approved"
          value={summary?.approved || 0}
          description={`${summary?.approvalRate || 0}% overall approval rate`}
          icon={CheckCircle2}
          iconColor="var(--success-text)"
        />
      </div>

      {/* Interactive Review Pipeline */}
      <ReviewPipeline summary={summary} />

      {/* Analytics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '16px' }}>
        <Card>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '14px', color: 'var(--text-primary)' }}>
            Review Status Distribution
          </h3>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={75} label>
                  {statusPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-strong)', color: 'var(--text-primary)' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <ComplianceCard summary={summary} />
      </div>

      {/* Active Queue Table */}
      <Card style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>Active Submissions Queue</h3>
          <Link to="/submissions" className="btn btn-secondary btn-sm">
            View Full Table <ArrowRight size={14} />
          </Link>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Project Title</th>
                <th>Intern</th>
                <th>Status</th>
                <th>Reviewer</th>
                <th>Submitted</th>
                <th>Reasoning</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {summary?.recentSubmissions?.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                    No capstone submissions in queue.
                  </td>
                </tr>
              ) : (
                summary?.recentSubmissions?.map((sub) => (
                  <tr key={sub.id}>
                    <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{sub.projectTitle}</td>
                    <td>{sub.internName}</td>
                    <td><StatusBadge status={sub.status} /></td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Reviewer</td>
                    <td style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{sub.dateSubmitted}</td>
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
      </Card>
    </div>
  );
};
