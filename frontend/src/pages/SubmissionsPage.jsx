import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { StatusBadge, ReasoningBadge } from '../components/common/Badge';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { ErrorState } from '../components/common/ErrorState';
import { useAuth } from '../context/AuthContext';
import { Search, Download, Plus, ChevronLeft, ChevronRight, ArrowRight, ExternalLink } from 'lucide-react';

export const SubmissionsPage = () => {
  const [searchParams] = useSearchParams();
  const initialStatus = searchParams.get('status') || 'ALL';

  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [reasoningFilter, setReasoningFilter] = useState('ALL');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const { isIntern } = useAuth();

  useEffect(() => {
    fetchSubmissions();
  }, [page, statusFilter, reasoningFilter]);

  const fetchSubmissions = async () => {
    setLoading(true);
    setError(false);
    try {
      let url = `/submissions?page=${page}&size=10`;
      if (statusFilter !== 'ALL') url += `&status=${statusFilter}`;
      if (reasoningFilter !== 'ALL') url += `&reasoningIncluded=${reasoningFilter === 'INCLUDED'}`;
      if (search.trim()) url += `&search=${encodeURIComponent(search.trim())}`;

      const res = await axiosClient.get(url);
      if (res.success) {
        setSubmissions(res.data.content || []);
        setTotalPages(res.data.totalPages || 1);
      }
    } catch (err) {
      console.error('Failed to fetch submissions', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(0);
    fetchSubmissions();
  };

  const handleExportCsv = () => {
    window.open('http://localhost:8080/api/submissions/export', '_blank');
  };

  if (error) {
    return <ErrorState title="Failed to Load Submissions" message="Could not fetch submission list from the API." onRetry={fetchSubmissions} />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} className="page-transition">
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--archon-text)', margin: 0, letterSpacing: '-0.02em' }}>
            Architecture Registry
          </h1>
          <p style={{ color: 'var(--archon-text-secondary)', fontSize: '0.85rem', marginTop: '2px' }}>
            Review, evaluate, and govern GenAI architecture submissions
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={handleExportCsv} className="btn btn-secondary btn-sm" style={{ padding: '8px 14px', borderRadius: '8px' }}>
            <Download size={14} /> Export CSV
          </button>
          {isIntern && (
            <Link to="/submissions/new" className="btn btn-primary btn-sm" style={{ padding: '8px 16px', borderRadius: '8px' }}>
              <Plus size={14} /> Submit Architecture
            </Link>
          )}
        </div>
      </div>

      {/* Filter Toolbar */}
      <div
        className="premium-card"
        style={{
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '8px', flex: 1, minWidth: '240px', maxWidth: '380px' }}>
          <div style={{ position: 'relative', width: '100%', display: 'flex', alignItems: 'center' }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', color: 'var(--archon-text-muted)', pointerEvents: 'none' }} />
            <input
              type="text"
              placeholder="Search by project, intern, domain..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                paddingLeft: '30px',
                paddingRight: '12px',
                height: '34px',
                fontSize: '0.8rem',
                background: '#0e0e11',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '6px',
                color: 'var(--archon-text)'
              }}
            />
          </div>
          <button type="submit" className="btn btn-secondary btn-sm" style={{ height: '34px', borderRadius: '6px' }}>
            Search
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* Status Filter Tabs */}
          <div style={{ display: 'flex', background: '#0e0e11', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', padding: '2px' }}>
            {['ALL', 'NOT_REVIEWED', 'NEEDS_REVISION', 'APPROVED'].map((st) => (
              <button
                key={st}
                onClick={() => { setStatusFilter(st); setPage(0); }}
                style={{
                  padding: '4px 10px',
                  fontSize: '0.72rem',
                  fontWeight: 500,
                  borderRadius: '4px',
                  background: statusFilter === st ? 'rgba(255,255,255,0.08)' : 'transparent',
                  color: statusFilter === st ? '#FFFFFF' : 'var(--archon-text-muted)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {st === 'NOT_REVIEWED' ? 'Not Reviewed' : st === 'NEEDS_REVISION' ? 'Revision' : st === 'APPROVED' ? 'Approved' : 'All Status'}
              </button>
            ))}
          </div>

          {/* Reasoning Filter Tabs */}
          <div style={{ display: 'flex', background: '#0e0e11', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', padding: '2px' }}>
            {[
              { key: 'ALL', label: 'All Reasoning' },
              { key: 'INCLUDED', label: 'Verified' },
              { key: 'MISSING', label: 'Missing' }
            ].map((rf) => (
              <button
                key={rf.key}
                onClick={() => { setReasoningFilter(rf.key); setPage(0); }}
                style={{
                  padding: '4px 10px',
                  fontSize: '0.72rem',
                  fontWeight: 500,
                  borderRadius: '4px',
                  background: reasoningFilter === rf.key ? 'rgba(255,255,255,0.08)' : 'transparent',
                  color: reasoningFilter === rf.key ? '#FFFFFF' : 'var(--archon-text-muted)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {rf.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Submissions Table */}
      <div className="premium-card" style={{ padding: '0px', overflow: 'hidden' }}>
        <div className="table-container" style={{ border: 'none', borderRadius: '0' }}>
          <table>
            <thead>
              <tr>
                <th style={{ background: '#0e0e11', padding: '12px 16px' }}>ID</th>
                <th style={{ background: '#0e0e11', padding: '12px 16px' }}>Project Title</th>
                <th style={{ background: '#0e0e11', padding: '12px 16px' }}>Domain</th>
                <th style={{ background: '#0e0e11', padding: '12px 16px' }}>Intern</th>
                <th style={{ background: '#0e0e11', padding: '12px 16px' }}>Status</th>
                <th style={{ background: '#0e0e11', padding: '12px 16px' }}>Reasoning</th>
                <th style={{ background: '#0e0e11', padding: '12px 16px' }}>Submitted</th>
                <th style={{ background: '#0e0e11', padding: '12px 16px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" style={{ padding: '24px' }}>
                    <LoadingSkeleton count={4} height="36px" />
                  </td>
                </tr>
              ) : submissions.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '48px 16px', color: 'var(--archon-text-muted)' }}>
                    No architecture submissions found.
                  </td>
                </tr>
              ) : (
                submissions.map((sub) => (
                  <tr key={sub.id}>
                    <td style={{ padding: '12px 16px', fontSize: '0.75rem', color: 'var(--archon-text-muted)', fontFamily: 'var(--font-mono)' }}>
                      #{sub.id}
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--archon-text)' }}>
                      <Link to={`/submissions/${sub.id}`} style={{ color: 'var(--archon-text)', textDecoration: 'none' }}>
                        {sub.projectTitle}
                      </Link>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span className="badge-premium badge-gray">
                        {sub.projectDomain || 'GenAI'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', color: 'var(--archon-text-secondary)', fontSize: '0.8rem' }}>
                      {sub.internName}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <StatusBadge status={sub.status} />
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <ReasoningBadge included={sub.reasoningIncluded} />
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '0.75rem', color: 'var(--archon-text-muted)' }}>
                      {sub.dateSubmitted}
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                        {sub.githubUrl && (
                          <a
                            href={sub.githubUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-ghost btn-sm"
                            style={{ padding: '4px 8px', color: 'var(--archon-text-muted)' }}
                            title="GitHub Repository"
                          >
                            <ExternalLink size={13} />
                          </a>
                        )}
                        <Link
                          to={`/submissions/${sub.id}`}
                          className="btn btn-secondary btn-sm"
                          style={{ fontSize: '0.72rem', padding: '4px 10px', borderRadius: '6px' }}
                        >
                          Review <ArrowRight size={12} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--archon-text-muted)' }}>
              Page {page + 1} of {totalPages}
            </span>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="btn btn-secondary btn-sm"
                style={{ padding: '4px 8px', borderRadius: '6px' }}
              >
                <ChevronLeft size={14} /> Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="btn btn-secondary btn-sm"
                style={{ padding: '4px 8px', borderRadius: '6px' }}
              >
                Next <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
