import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { StatusBadge, ReasoningBadge } from '../components/common/Badge';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { ErrorState } from '../components/common/ErrorState';
import { Button } from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { Search, Download, ExternalLink, Plus, ChevronLeft, ChevronRight } from 'lucide-react';

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 className="font-brand" style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--archon-text)', marginBottom: '2px' }}>
            ARCHITECTURE REGISTRY
          </h1>
          <p style={{ color: 'var(--archon-text-muted)', fontSize: '0.8rem' }}>
            Review, evaluate, and govern every GenAI architecture.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <Button variant="secondary" size="sm" onClick={handleExportCsv}>
            <Download size={13} /> Export CSV
          </Button>
          {isIntern && (
            <Link to="/submissions/new" className="btn btn-primary btn-sm">
              <Plus size={13} /> Submit Architecture
            </Link>
          )}
        </div>
      </div>

      {/* Compact Filter Toolbar */}
      <div
        style={{
          background: 'var(--archon-surface)',
          border: '1px solid var(--archon-border)',
          borderRadius: 'var(--radius-md)',
          padding: '10px 14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '240px' }}>
          <Search size={14} style={{ color: 'var(--archon-text-muted)' }} />
          <input
            type="text"
            placeholder="Search by project title, intern name, or domain..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', border: 'none', background: 'transparent', padding: '2px', fontSize: '0.8rem' }}
          />
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {/* Status Tabs */}
          <div style={{ display: 'flex', gap: '2px', background: 'var(--archon-bg)', padding: '2px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--archon-border)' }}>
            {['ALL', 'NOT_REVIEWED', 'NEEDS_REVISION', 'APPROVED'].map((st) => (
              <button
                key={st}
                onClick={() => { setStatusFilter(st); setPage(0); }}
                className="mono"
                style={{
                  padding: '3px 8px',
                  borderRadius: '3px',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  border: 'none',
                  background: statusFilter === st ? 'var(--archon-surface-elevated)' : 'transparent',
                  color: statusFilter === st ? 'var(--archon-cyan)' : 'var(--archon-text-muted)'
                }}
              >
                {st.replace('_', ' ')}
              </button>
            ))}
          </div>

          <select
            value={reasoningFilter}
            onChange={(e) => { setReasoningFilter(e.target.value); setPage(0); }}
            className="mono"
            style={{ fontSize: '0.75rem', padding: '3px 8px' }}
          >
            <option value="ALL">All Reasoning</option>
            <option value="INCLUDED">Reasoning Valid</option>
            <option value="MISSING">Reasoning Missing</option>
          </select>
        </div>
      </div>

      {/* Main Table Infrastructure */}
      <div style={{ background: 'var(--archon-surface)', border: '1px solid var(--archon-border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '16px' }}><LoadingSkeleton count={6} height="32px" /></div>
        ) : (
          <div className="table-container" style={{ border: 'none' }}>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>PROJECT TITLE</th>
                  <th>INTERN</th>
                  <th>DOMAIN</th>
                  <th>SUBMITTED</th>
                  <th>REASONING</th>
                  <th>STATUS</th>
                  <th>EVIDENCE</th>
                  <th style={{ textAlign: 'right' }}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {submissions.length === 0 ? (
                  <tr>
                    <td colSpan="9" style={{ textAlign: 'center', padding: '32px', color: 'var(--archon-text-muted)' }}>
                      No architecture submissions matching filter criteria.
                    </td>
                  </tr>
                ) : (
                  submissions.map((sub) => (
                    <tr key={sub.id}>
                      <td className="mono" style={{ fontSize: '0.725rem', color: 'var(--archon-text-muted)' }}>ARCH-{String(sub.id).padStart(3, '0')}</td>
                      <td style={{ fontWeight: 700, color: 'var(--archon-text)' }}>{sub.projectTitle}</td>
                      <td style={{ color: 'var(--archon-text-secondary)' }}>{sub.internName}</td>
                      <td>
                        <span className="mono" style={{ fontSize: '0.7rem', background: 'var(--archon-bg)', padding: '2px 6px', borderRadius: '4px', border: '1px solid var(--archon-border)' }}>
                          {sub.projectDomain}
                        </span>
                      </td>
                      <td className="mono" style={{ fontSize: '0.725rem', color: 'var(--archon-text-muted)' }}>{sub.dateSubmitted}</td>
                      <td><ReasoningBadge included={sub.reasoningIncluded} /></td>
                      <td><StatusBadge status={sub.status} /></td>
                      <td>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <a href={sub.githubUrl} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm" style={{ padding: '2px 6px', fontSize: '0.7rem' }}>
                            Repo <ExternalLink size={10} />
                          </a>
                          <a href={sub.onePagerUrl} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm" style={{ padding: '2px 6px', fontSize: '0.7rem' }}>
                            Doc <ExternalLink size={10} />
                          </a>
                        </div>
                      </td>
                      <td style={{ textAlign: 'right' }}>
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
        )}

        {/* Table Footer Pagination */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderTop: '1px solid var(--archon-border)', fontSize: '0.75rem', color: 'var(--archon-text-muted)' }}>
          <div className="mono">Page {page + 1} of {totalPages}</div>
          <div style={{ display: 'flex', gap: '6px' }}>
            <Button variant="secondary" size="sm" disabled={page === 0} onClick={() => setPage((p) => Math.max(0, p - 1))}>
              <ChevronLeft size={13} /> Prev
            </Button>
            <Button variant="secondary" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage((p) => p + 1)}>
              Next <ChevronRight size={13} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
