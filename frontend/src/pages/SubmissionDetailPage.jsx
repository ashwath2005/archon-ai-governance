import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';
import { StatusBadge, ReasoningBadge } from '../components/common/Badge';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { DecisionSelector } from '../components/common/DecisionSelector';
import { ApprovalDialog } from '../components/common/ApprovalDialog';
import { RevisionDialog } from '../components/common/RevisionDialog';
import { ShortcutModal } from '../components/common/ShortcutModal';
import { ReviewTimeline } from '../components/common/ReviewTimeline';
import { ArchitectureGraph } from '../components/architecture/ArchitectureGraph';
import { AIReviewPanel } from '../components/intelligence/AIReviewPanel';
import { ExternalLink, CheckCircle2, AlertTriangle, ArrowLeft, Check, Download, Keyboard, XCircle } from 'lucide-react';

export const SubmissionDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isReviewer, isAdmin } = useAuth();

  const [submission, setSubmission] = useState(null);
  const [rubricSections, setRubricSections] = useState([]);
  const [evaluations, setEvaluations] = useState({});
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeSectionCode, setActiveSectionCode] = useState('01');
  const [reviewerNotes, setReviewerNotes] = useState('');

  // Dialog & Shortcut Modal States
  const [approvalOpen, setApprovalOpen] = useState(false);
  const [revisionOpen, setRevisionOpen] = useState(false);
  const [shortcutOpen, setShortcutOpen] = useState(false);

  useEffect(() => {
    fetchDetailData();
  }, [id]);

  // Global Keyboard Shortcuts Listener (J/K, 1/2/3, ?)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't intercept when user is typing in textarea or input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

      if (e.key === '?') {
        e.preventDefault();
        setShortcutOpen((prev) => !prev);
      } else if (e.key.toLowerCase() === 'j') {
        // Next Section
        e.preventDefault();
        setRubricSections((sections) => {
          const idx = sections.findIndex((s) => s.code === activeSectionCode);
          if (idx !== -1 && idx < sections.length - 1) {
            setActiveSectionCode(sections[idx + 1].code);
          }
          return sections;
        });
      } else if (e.key.toLowerCase() === 'k') {
        // Previous Section
        e.preventDefault();
        setRubricSections((sections) => {
          const idx = sections.findIndex((s) => s.code === activeSectionCode);
          if (idx > 0) {
            setActiveSectionCode(sections[idx - 1].code);
          }
          return sections;
        });
      } else if (['1', '2', '3'].includes(e.key)) {
        // Select Decision for first item in active section
        const activeSec = rubricSections.find((s) => s.code === activeSectionCode);
        if (activeSec?.items?.length > 0) {
          const firstItemId = activeSec.items[0].id;
          const optMap = { '1': 'YES', '2': 'NO', '3': 'DEFERRED' };
          handleDecisionChange(firstItemId, optMap[e.key]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeSectionCode, rubricSections]);

  const fetchDetailData = async () => {
    setLoading(true);
    try {
      const [subRes, rubRes, evalRes, histRes] = await Promise.all([
        axiosClient.get(`/submissions/${id}`),
        axiosClient.get('/rubric'),
        axiosClient.get(`/submissions/${id}/evaluations`),
        axiosClient.get(`/submissions/${id}/history`)
      ]);

      if (subRes.success) {
        setSubmission(subRes.data);
        setReviewerNotes(subRes.data.reviewerNotes || '');
      }

      if (rubRes.success && rubRes.data?.length > 0) {
        setRubricSections(rubRes.data || []);
        setActiveSectionCode(rubRes.data[0].code);
      }

      if (evalRes.success) {
        const evalMap = {};
        (evalRes.data || []).forEach((item) => {
          evalMap[item.rubricItemId] = {
            id: item.id,
            decision: item.decision || '',
            reasoning: item.reasoning || '',
            reviewerComment: item.reviewerComment || ''
          };
        });
        setEvaluations(evalMap);
      }

      if (histRes.success) {
        setHistory(histRes.data || []);
      }
    } catch (err) {
      console.error('Failed to load submission workspace', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDecisionChange = (rubricItemId, newDecision) => {
    setEvaluations((prev) => ({
      ...prev,
      [rubricItemId]: {
        ...prev[rubricItemId],
        decision: newDecision
      }
    }));
  };

  const handleReasoningChange = (rubricItemId, newReasoning) => {
    setEvaluations((prev) => ({
      ...prev,
      [rubricItemId]: {
        ...prev[rubricItemId],
        reasoning: newReasoning
      }
    }));
  };

  const handleAppendAINote = (recommendationText) => {
    setReviewerNotes((prev) => (prev ? `${prev}\n\n[AI Recommendation]: ${recommendationText}` : `[AI Recommendation]: ${recommendationText}`));
  };

  // Enterprise Governance Record (AGR) Exporter
  const handleExportAGR = () => {
    if (!submission) return;

    let doc = `# ARCHON ENTERPRISE ARCHITECTURE GOVERNANCE RECORD (AGR)\n`;
    doc += `**Project Code**: ARCH-${String(submission.id).padStart(3, '0')}\n`;
    doc += `**Project Title**: ${submission.projectTitle}\n`;
    doc += `**Intern Author**: ${submission.internName}\n`;
    doc += `**Domain**: ${submission.projectDomain}\n`;
    doc += `**Date Submitted**: ${submission.dateSubmitted}\n`;
    doc += `**Governance Status**: ${submission.status}\n`;
    doc += `**Reasoning Compliance**: ${submission.reasoningIncluded ? 'VERIFIED' : 'MISSING'}\n\n`;
    doc += `---\n\n## ARCHITECTURE DECISION RECORDS (ADR)\n\n`;

    rubricSections.forEach((sec) => {
      doc += `### Section ${sec.code} · ${sec.title}\n\n`;
      sec.items?.forEach((item) => {
        const ev = evaluations[item.id] || {};
        doc += `#### ${item.title}\n`;
        doc += `- **Decision**: ${ev.decision || 'UNSET'}\n`;
        doc += `- **Reasoning Justification**: ${ev.reasoning || 'None provided'}\n\n`;
      });
    });

    doc += `---\n\n## AUDIT TIMELINE LOG\n\n`;
    history.forEach((h) => {
      doc += `- **${h.timestamp}** | Action: \`${h.action}\` | Actor: ${h.actorName} | Notes: "${h.notes || ''}"\n`;
    });

    const blob = new Blob([doc], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ARCHON_Governance_Record_ARCH-${String(submission.id).padStart(3, '0')}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const saveEvaluations = async () => {
    setSubmitting(true);
    try {
      const payload = Object.keys(evaluations).map((itemId) => ({
        rubricItemId: parseInt(itemId),
        decision: evaluations[itemId].decision,
        reasoning: evaluations[itemId].reasoning,
        reviewerComment: evaluations[itemId].reviewerComment
      }));

      await axiosClient.post(`/submissions/${id}/evaluations`, payload);
      await fetchDetailData();
    } catch (err) {
      alert('Failed to save evaluations: ' + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusTransition = async (newStatus, notesToSave) => {
    setSubmitting(true);
    try {
      await saveEvaluations();

      const res = await axiosClient.post(`/submissions/${id}/review`, {
        status: newStatus,
        reviewerNotes: notesToSave
      });

      if (res.success) {
        setApprovalOpen(false);
        setRevisionOpen(false);
        await fetchDetailData();
      }
    } catch (err) {
      alert('Failed to update status: ' + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSkeleton count={6} height="120px" />;
  if (!submission) return <div style={{ color: 'var(--archon-text-muted)' }}>Submission not found.</div>;

  const canReview = isReviewer || isAdmin;

  // Rubric Completion Calculations
  let totalItems = 0;
  let completedItems = 0;
  let validReasoningCount = 0;

  rubricSections.forEach((sec) => {
    sec.items?.forEach((item) => {
      totalItems++;
      const itemData = evaluations[item.id];
      if (itemData?.decision) {
        completedItems++;
      }
      if (itemData?.reasoning && itemData.reasoning.trim().length > 5) {
        validReasoningCount++;
      }
    });
  });

  const progressPercent = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Workspace Header Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button className="btn btn-secondary btn-sm" onClick={() => navigate('/submissions')}>
            <ArrowLeft size={13} /> Back
          </button>
          <div>
            <h1 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--archon-text)', marginBottom: '2px' }}>
              {submission.projectTitle}
            </h1>
            <div style={{ fontSize: '0.775rem', color: 'var(--archon-text-muted)' }}>
              ID: <span className="mono" style={{ color: 'var(--archon-cyan)' }}>ARCH-{String(submission.id).padStart(3, '0')}</span> • Author: <strong style={{ color: 'var(--archon-text)' }}>{submission.internName}</strong> • Domain: <span className="mono">{submission.projectDomain}</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button className="btn btn-secondary btn-sm" onClick={() => setShortcutOpen(true)} title="Keyboard Shortcuts Cheatsheet">
            <Keyboard size={12} /> Hotkeys (?)
          </button>
          <button className="btn btn-secondary btn-sm" onClick={handleExportAGR}>
            <Download size={12} /> Export AGR Report
          </button>
          <a href={submission.githubUrl} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">
            GitHub Repo <ExternalLink size={11} />
          </a>
          <a href={submission.onePagerUrl} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">
            Mapping Doc <ExternalLink size={11} />
          </a>
        </div>
      </div>

      {/* 3-COLUMN ARCHITECTURE REVIEW WORKSPACE */}
      <div style={{ display: 'grid', gridTemplateColumns: '230px 1fr 310px', gap: '16px', alignItems: 'start' }}>
        
        {/* COLUMN 1: Sticky Rubric Section Navigation */}
        <div
          style={{
            position: 'sticky',
            top: '70px',
            background: 'var(--archon-surface)',
            border: '1px solid var(--archon-border)',
            borderRadius: 'var(--radius-lg)',
            padding: '14px 10px'
          }}
        >
          <div className="mono" style={{ fontSize: '0.625rem', fontWeight: 700, color: 'var(--archon-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px', paddingLeft: '6px' }}>
            ARCHITECTURE RUBRIC
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            {rubricSections.map((sec) => {
              const isActive = activeSectionCode === sec.code;
              const secItems = sec.items || [];
              const completedCount = secItems.filter((item) => evaluations[item.id]?.decision).length;
              const isSecComplete = secItems.length > 0 && completedCount === secItems.length;

              return (
                <button
                  key={sec.code}
                  onClick={() => setActiveSectionCode(sec.code)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 8px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.775rem',
                    fontWeight: isActive ? 700 : 500,
                    textAlign: 'left',
                    borderLeft: isActive ? '3px solid var(--archon-cyan)' : '3px solid transparent',
                    background: isActive ? 'var(--archon-surface-elevated)' : 'transparent',
                    color: isActive ? 'var(--archon-text)' : 'var(--archon-text-secondary)',
                    transition: 'all var(--motion-fast)'
                  }}
                >
                  <span className="truncate">{sec.code} · {sec.title}</span>
                  <span className="mono" style={{ fontSize: '0.65rem', color: isSecComplete ? 'var(--archon-success)' : 'var(--archon-text-muted)' }}>
                    {isSecComplete ? <Check size={12} /> : `${completedCount}/${secItems.length}`}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Review Completion Progress Bar */}
          <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--archon-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--archon-text-muted)', marginBottom: '4px' }}>
              <span>Completion Progress</span>
              <span className="mono" style={{ color: 'var(--archon-cyan)' }}>{progressPercent}%</span>
            </div>
            <div style={{ height: '4px', width: '100%', background: 'var(--archon-bg)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${progressPercent}%`, background: 'var(--archon-cyan)', transition: 'width var(--motion-normal)' }} />
            </div>
          </div>
        </div>

        {/* COLUMN 2: Architecture Decision Review Workspace */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Context-Aware Interactive Architecture Node Graph */}
          <ArchitectureGraph activeSectionCode={activeSectionCode} projectDomain={submission.projectDomain} />

          {/* Criteria Evaluation ADR Cards */}
          {rubricSections
            .filter((sec) => sec.code === activeSectionCode)
            .map((sec) => (
              <div key={sec.code} style={{ background: 'var(--archon-surface)', border: '1px solid var(--archon-border)', borderRadius: 'var(--radius-lg)', padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <h2 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--archon-text)' }}>
                    Section {sec.code} · {sec.title}
                  </h2>
                  <span className="mono" style={{ fontSize: '0.65rem', color: 'var(--archon-text-muted)' }}>
                    {sec.items?.length || 0} CRITERIA ITEMS
                  </span>
                </div>
                <p style={{ color: 'var(--archon-text-muted)', fontSize: '0.8rem', marginBottom: '20px' }}>
                  {sec.description}
                </p>

                {/* Criteria List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  {sec.items?.map((item) => {
                    const evalData = evaluations[item.id] || { decision: '', reasoning: '', reviewerComment: '' };
                    const allowedOptions = item.allowedOptions ? item.allowedOptions.split(',').map((s) => s.trim()) : ['YES', 'NO', 'DEFERRED'];
                    
                    const charCount = evalData.reasoning?.trim().length || 0;
                    const isReasoningValid = charCount > 5;
                    const isReasoningEmpty = charCount === 0;

                    return (
                      <div
                        key={item.id}
                        style={{
                          background: 'var(--archon-bg)',
                          padding: '16px',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--archon-border)'
                        }}
                      >
                        <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--archon-text)', marginBottom: '4px' }}>
                          {item.title}
                        </div>
                        <p style={{ fontSize: '0.775rem', color: 'var(--archon-text-secondary)', marginBottom: '12px' }}>
                          {item.description}
                        </p>

                        {/* Decision Selector */}
                        <div style={{ marginBottom: '12px' }}>
                          <label className="mono" style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, color: 'var(--archon-text-muted)', marginBottom: '4px', textTransform: 'uppercase' }}>
                            DECISION SELECTOR
                          </label>
                          <DecisionSelector
                            options={allowedOptions}
                            value={evalData.decision}
                            onChange={(val) => handleDecisionChange(item.id, val)}
                            disabled={!canReview}
                          />
                        </div>

                        {/* Architectural Reasoning Area */}
                        <div style={{ marginBottom: '8px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                            <label className="mono" style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--archon-text-muted)', textTransform: 'uppercase' }}>
                              ARCHITECTURAL REASONING (COMPULSORY)
                            </label>
                            <span className="mono" style={{ fontSize: '0.65rem', color: isReasoningValid ? 'var(--archon-success)' : 'var(--archon-text-muted)' }}>
                              {charCount} / 5000 chars
                            </span>
                          </div>

                          <textarea
                            rows={3}
                            disabled={!canReview}
                            value={evalData.reasoning}
                            onChange={(e) => handleReasoningChange(item.id, e.target.value)}
                            placeholder="State technical justification (e.g. data shape, latency SLA, memory footprint)..."
                            style={{ width: '100%' }}
                          />
                        </div>

                        {/* Live Reasoning Validation Callout */}
                        <div className="mono" style={{ fontSize: '0.7rem' }}>
                          {isReasoningValid && (
                            <span style={{ color: 'var(--archon-success)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <CheckCircle2 size={12} /> ✓ REASONING VALID
                            </span>
                          )}
                          {!isReasoningValid && !isReasoningEmpty && (
                            <span style={{ color: 'var(--archon-warning)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <AlertTriangle size={12} /> REASONING TOO SHORT (MIN 5 CHARS)
                            </span>
                          )}
                          {isReasoningEmpty && (
                            <span style={{ color: 'var(--archon-danger)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <XCircle size={12} /> ⚠ ARCHITECTURAL REASONING REQUIRED
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
        </div>

        {/* COLUMN 3: Sticky Governance Control Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', position: 'sticky', top: '70px' }}>
          
          {/* Status & Review Controls */}
          <div style={{ background: 'var(--archon-surface)', border: '1px solid var(--archon-border)', borderRadius: 'var(--radius-lg)', padding: '16px' }}>
            <div className="mono" style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--archon-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>
              GOVERNANCE CONTROL
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.775rem', color: 'var(--archon-text-muted)' }}>Status:</span>
              <StatusBadge status={submission.status} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <span style={{ fontSize: '0.775rem', color: 'var(--archon-text-muted)' }}>Reasoning:</span>
              <span className="mono" style={{ fontSize: '0.75rem', color: validReasoningCount === totalItems ? 'var(--archon-success)' : 'var(--archon-warning)' }}>
                {validReasoningCount} / {totalItems} VALID
              </span>
            </div>

            {canReview && (
              <>
                <div style={{ marginBottom: '12px' }}>
                  <label className="mono" style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, color: 'var(--archon-text-muted)', marginBottom: '4px', textTransform: 'uppercase' }}>
                    REVIEWER OVERALL NOTES
                  </label>
                  <textarea
                    rows={2}
                    value={reviewerNotes}
                    onChange={(e) => setReviewerNotes(e.target.value)}
                    placeholder="General feedback for intern..."
                    style={{ width: '100%' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <button
                    className="btn btn-warning"
                    disabled={submitting}
                    onClick={() => setRevisionOpen(true)}
                    style={{ width: '100%', fontSize: '0.775rem' }}
                  >
                    <AlertTriangle size={13} /> Request Revision
                  </button>

                  <button
                    className="btn btn-success"
                    disabled={submitting}
                    onClick={() => setApprovalOpen(true)}
                    style={{ width: '100%', fontSize: '0.775rem' }}
                  >
                    <CheckCircle2 size={13} /> Approve Submission
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Contextual Criterion-Linked AI Review Assistant */}
          <AIReviewPanel
            activeSectionCode={activeSectionCode}
            reasoningIncluded={submission.reasoningIncluded}
            onAppendNote={handleAppendAINote}
          />

          {/* Audit History Timeline */}
          <div style={{ background: 'var(--archon-surface)', border: '1px solid var(--archon-border)', borderRadius: 'var(--radius-lg)', padding: '16px' }}>
            <div className="mono" style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--archon-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>
              AUDIT TIMELINE
            </div>
            <ReviewTimeline history={history} />
          </div>

        </div>

      </div>

      {/* Confirmation & Shortcut Modals */}
      <ApprovalDialog
        isOpen={approvalOpen}
        onClose={() => setApprovalOpen(false)}
        onConfirm={() => handleStatusTransition('APPROVED', reviewerNotes)}
        submitting={submitting}
        reasoningIncluded={submission.reasoningIncluded}
      />

      <RevisionDialog
        isOpen={revisionOpen}
        onClose={() => setRevisionOpen(false)}
        onConfirm={(notes) => handleStatusTransition('NEEDS_REVISION', notes)}
        submitting={submitting}
        reviewerNotes={reviewerNotes}
        setReviewerNotes={setReviewerNotes}
      />

      <ShortcutModal
        isOpen={shortcutOpen}
        onClose={() => setShortcutOpen(false)}
      />
    </div>
  );
};
