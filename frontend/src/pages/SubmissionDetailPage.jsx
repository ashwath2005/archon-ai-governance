import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';
import { StatusBadge, ReasoningBadge } from '../components/common/Badge';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { ErrorState } from '../components/common/ErrorState';
import { DecisionSelector } from '../components/common/DecisionSelector';
import { ApprovalDialog } from '../components/common/ApprovalDialog';
import { RevisionDialog } from '../components/common/RevisionDialog';
import { ShortcutModal } from '../components/common/ShortcutModal';
import { ReviewTimeline } from '../components/common/ReviewTimeline';
import { ArchitectureGraph } from '../components/architecture/ArchitectureGraph';
import { AIReviewPanel } from '../components/intelligence/AIReviewPanel';
import {
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Check,
  Download,
  Keyboard,
  Save,
  Clock,
  Shield,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';

export const SubmissionDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isReviewer, isAdmin } = useAuth();

  const [submission, setSubmission] = useState(null);
  const [rubricSections, setRubricSections] = useState([]);
  const [evaluations, setEvaluations] = useState({});
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [activeSectionCode, setActiveSectionCode] = useState('0');
  const [reviewerNotes, setReviewerNotes] = useState('');

  // Dialog & Shortcut Modal States
  const [approvalOpen, setApprovalOpen] = useState(false);
  const [revisionOpen, setRevisionOpen] = useState(false);
  const [shortcutOpen, setShortcutOpen] = useState(false);

  const fetchDetailData = async () => {
    setLoading(true);
    setError(false);
    try {
      const [subRes, rubRes, evalRes, histRes] = await Promise.allSettled([
        axiosClient.get(`/submissions/${id}`),
        axiosClient.get('/rubric'),
        axiosClient.get(`/submissions/${id}/evaluations`),
        axiosClient.get(`/submissions/${id}/review-history`)
      ]);

      if (subRes.status === 'fulfilled' && subRes.value?.success) {
        setSubmission(subRes.value.data);
        setReviewerNotes(subRes.value.data.reviewerNotes || '');
      } else {
        setError(true);
      }

      if (rubRes.status === 'fulfilled' && rubRes.value?.success && rubRes.value.data?.length > 0) {
        const sectionsData = rubRes.value.data || [];
        setRubricSections(sectionsData);
        setActiveSectionCode(String(sectionsData[0].sectionCode ?? sectionsData[0].code ?? '0'));
      }

      if (evalRes.status === 'fulfilled' && evalRes.value?.success) {
        const evalMap = {};
        (evalRes.value.data || []).forEach((item) => {
          evalMap[item.rubricItemId] = {
            id: item.id,
            decision: item.decision || '',
            reasoning: item.reasoning || '',
            reviewerComment: item.reviewerComment || ''
          };
        });
        setEvaluations(evalMap);
      }

      if (histRes.status === 'fulfilled' && histRes.value?.success) {
        setHistory(histRes.value.data || []);
      }
    } catch (err) {
      console.error('Failed to load submission workspace', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetailData();
  }, [id]);

  // Global Keyboard Shortcuts (J/K, 1/2/3, ?)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

      if (e.key === '?') {
        e.preventDefault();
        setShortcutOpen((prev) => !prev);
      } else if (e.key.toLowerCase() === 'j') {
        e.preventDefault();
        setRubricSections((sections) => {
          const idx = sections.findIndex((s) => String(s.sectionCode ?? s.code) === String(activeSectionCode));
          if (idx !== -1 && idx < sections.length - 1) {
            setActiveSectionCode(String(sections[idx + 1].sectionCode ?? sections[idx + 1].code));
          }
          return sections;
        });
      } else if (e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setRubricSections((sections) => {
          const idx = sections.findIndex((s) => String(s.sectionCode ?? s.code) === String(activeSectionCode));
          if (idx > 0) {
            setActiveSectionCode(String(sections[idx - 1].sectionCode ?? sections[idx - 1].code));
          }
          return sections;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeSectionCode, rubricSections]);

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
      doc += `### Section ${sec.sectionCode ?? sec.code} · ${sec.sectionName ?? sec.title}\n\n`;
      sec.items?.forEach((item) => {
        const ev = evaluations[item.id] || {};
        doc += `#### ${item.itemName ?? item.title}\n`;
        doc += `- **Decision**: ${ev.decision || 'UNSET'}\n`;
        doc += `- **Reasoning Justification**: ${ev.reasoning || 'None provided'}\n\n`;
      });
    });

    doc += `---\n\n## AUDIT TIMELINE LOG\n\n`;
    history.forEach((h) => {
      doc += `- **${h.createdAt || h.timestamp}** | Status: \`${h.previousStatus} -> ${h.newStatus}\` | Reviewer: ${h.reviewerName} | Comments: "${h.comments || ''}"\n`;
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
        decision: evaluations[itemId].decision || '',
        reasoning: evaluations[itemId].reasoning || '',
        reviewerComment: evaluations[itemId].reviewerComment || ''
      }));

      await axiosClient.post(`/submissions/${id}/evaluations`, { evaluations: payload });
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

      const res = await axiosClient.put(`/submissions/${id}/review`, {
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

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <LoadingSkeleton count={1} height="50px" />
        <LoadingSkeleton count={3} height="160px" />
      </div>
    );
  }

  if (error || !submission) {
    return (
      <ErrorState
        title="Submission Not Found"
        message={`Could not load capstone submission details for ID #${id}.`}
        onRetry={fetchDetailData}
      />
    );
  }

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
  const currentSection = rubricSections.find((sec) => String(sec.sectionCode ?? sec.code) === String(activeSectionCode)) || rubricSections[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} className="page-transition">
      
      {/* 1. WORKSTATION HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button className="btn btn-secondary btn-sm" onClick={() => navigate('/submissions')} style={{ borderRadius: '8px' }}>
            <ArrowLeft size={14} /> Back
          </button>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--archon-text-muted)', fontFamily: 'var(--font-mono)' }}>
                ARCH-{String(submission.id).padStart(3, '0')}
              </span>
              <StatusBadge status={submission.status} />
              <ReasoningBadge included={submission.reasoningIncluded} />
            </div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--archon-text)', margin: 0, letterSpacing: '-0.02em' }}>
              {submission.projectTitle}
            </h1>
            <div style={{ fontSize: '0.78rem', color: 'var(--archon-text-secondary)', marginTop: '2px' }}>
              Intern: <strong style={{ color: 'var(--archon-text)' }}>{submission.internName}</strong> • Domain: <span className="badge-premium badge-gray" style={{ fontSize: '0.68rem', padding: '1px 6px' }}>{submission.projectDomain}</span> • Submitted: {submission.dateSubmitted}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <button className="btn btn-secondary btn-sm" onClick={() => setShortcutOpen(true)} style={{ borderRadius: '6px' }} title="Keyboard Hotkeys">
            <Keyboard size={13} /> Hotkeys (?)
          </button>
          <button className="btn btn-secondary btn-sm" onClick={handleExportAGR} style={{ borderRadius: '6px' }}>
            <Download size={13} /> Export AGR
          </button>
          {submission.githubUrl && (
            <a href={submission.githubUrl} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm" style={{ borderRadius: '6px' }}>
              GitHub Repo <ExternalLink size={12} />
            </a>
          )}
          {submission.onePagerUrl && (
            <a href={submission.onePagerUrl} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm" style={{ borderRadius: '6px' }}>
              Mapping Doc <ExternalLink size={12} />
            </a>
          )}
        </div>
      </div>

      {/* 2. 3-COLUMN WORKSPACE CANVAS */}
      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr 310px', gap: '16px', alignItems: 'start' }}>
        
        {/* COLUMN 1: Sticky Rubric Sections Navigator */}
        <div
          className="premium-card"
          style={{
            position: 'sticky',
            top: '70px',
            padding: '12px 8px'
          }}
        >
          <div style={{ fontSize: '0.68rem', fontWeight: 600, color: 'var(--archon-text-muted)', textTransform: 'uppercase', padding: '4px 10px', marginBottom: '6px', letterSpacing: '0.04em' }}>
            Rubric Domains
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {rubricSections.map((sec) => {
              const code = String(sec.sectionCode ?? sec.code);
              const isActive = activeSectionCode === code;
              const secItems = sec.items || [];
              const completedCount = secItems.filter((item) => evaluations[item.id]?.decision).length;
              const isComplete = secItems.length > 0 && completedCount === secItems.length;

              return (
                <button
                  key={code}
                  onClick={() => setActiveSectionCode(code)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    fontWeight: isActive ? 600 : 400,
                    textAlign: 'left',
                    background: isActive ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                    color: isActive ? '#FFFFFF' : 'var(--archon-text-secondary)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    0{code}. {sec.sectionName ?? sec.title}
                  </span>
                  <span style={{ fontSize: '0.68rem', color: isComplete ? 'var(--archon-success)' : 'var(--archon-text-muted)', marginLeft: '6px', flexShrink: 0 }}>
                    {isComplete ? <Check size={12} /> : `${completedCount}/${secItems.length}`}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Progress Bar */}
          <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingLeft: '6px', paddingRight: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--archon-text-muted)', marginBottom: '4px' }}>
              <span>Evaluation Progress</span>
              <span style={{ color: 'var(--archon-cyan)', fontWeight: 600 }}>{progressPercent}%</span>
            </div>
            <div style={{ height: '4px', width: '100%', background: 'rgba(255, 255, 255, 0.06)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${progressPercent}%`, background: 'var(--archon-cyan)', transition: 'width 0.2s ease' }} />
            </div>
          </div>
        </div>

        {/* COLUMN 2: Center Evaluation Canvas */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Architecture Pipeline Graph */}
          <ArchitectureGraph activeSectionCode={activeSectionCode} projectDomain={submission.projectDomain} />

          {/* Active Section ADR Criteria */}
          {currentSection && (
            <div className="premium-card" style={{ padding: '22px' }}>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--archon-text)', margin: 0 }}>
                  0{currentSection.sectionCode ?? currentSection.code}. {currentSection.sectionName ?? currentSection.title}
                </h2>
                <span style={{ fontSize: '0.72rem', color: 'var(--archon-text-muted)' }}>
                  {currentSection.items?.length || 0} Criteria Items
                </span>
              </div>
              
              {currentSection.description && (
                <p style={{ color: 'var(--archon-text-secondary)', fontSize: '0.82rem', marginBottom: '20px', lineHeight: 1.45 }}>
                  {currentSection.description}
                </p>
              )}

              {/* Criteria List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {currentSection.items?.map((item) => {
                  const evalData = evaluations[item.id] || { decision: '', reasoning: '', reviewerComment: '' };
                  
                  let allowedOptions = ['YES', 'NO', 'DEFERRED'];
                  if (Array.isArray(item.options)) {
                    allowedOptions = item.options;
                  } else if (typeof item.options === 'string') {
                    try {
                      allowedOptions = JSON.parse(item.options);
                    } catch (e) {
                      allowedOptions = item.options.split(',').map((s) => s.trim());
                    }
                  } else if (item.allowedOptions) {
                    allowedOptions = item.allowedOptions.split(',').map((s) => s.trim());
                  }

                  const charCount = evalData.reasoning?.trim().length || 0;
                  const isReasoningValid = charCount > 5;

                  return (
                    <div
                      key={item.id}
                      style={{
                        padding: '16px',
                        background: '#0c0c0e',
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                        borderRadius: '8px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px' }}>
                        <span style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--archon-text)' }}>
                          {item.itemName ?? item.title}
                        </span>
                        <span style={{ fontSize: '0.68rem', color: 'var(--archon-text-muted)', fontFamily: 'var(--font-mono)' }}>
                          {item.itemKey ?? item.key}
                        </span>
                      </div>

                      {item.description && (
                        <div style={{ fontSize: '0.78rem', color: 'var(--archon-text-secondary)', lineHeight: 1.4 }}>
                          {item.description}
                        </div>
                      )}

                      {/* Decision Selector */}
                      <DecisionSelector
                        options={allowedOptions}
                        value={evalData.decision}
                        onChange={(opt) => handleDecisionChange(item.id, opt)}
                        disabled={!canReview}
                      />

                      {/* Reasoning Textarea */}
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--archon-text-muted)', marginBottom: '4px' }}>
                          <span>Architectural Reasoning Justification</span>
                          <span style={{ color: isReasoningValid ? 'var(--archon-success)' : charCount > 0 ? 'var(--archon-warning)' : 'var(--archon-text-muted)', fontFamily: 'var(--font-mono)' }}>
                            {charCount} / 5+ chars {isReasoningValid && '✓ Valid'}
                          </span>
                        </div>
                        <textarea
                          rows={2}
                          value={evalData.reasoning}
                          onChange={(e) => handleReasoningChange(item.id, e.target.value)}
                          placeholder="Provide architectural trade-off justification for this decision (compulsory for approval)..."
                          disabled={!canReview}
                          style={{
                            width: '100%',
                            fontSize: '0.8rem',
                            background: '#070709',
                            border: `1px solid ${isReasoningValid ? 'rgba(52, 211, 153, 0.3)' : charCount > 0 ? 'rgba(251, 191, 36, 0.3)' : 'rgba(255, 255, 255, 0.08)'}`,
                            borderRadius: '6px',
                            padding: '8px 10px',
                            color: 'var(--archon-text)'
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Save Evaluations CTA */}
              {canReview && (
                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    onClick={saveEvaluations}
                    disabled={submitting}
                    className="btn btn-primary"
                    style={{ padding: '8px 18px', borderRadius: '8px', fontSize: '0.82rem' }}
                  >
                    <Save size={14} /> {submitting ? 'Saving...' : 'Save Evaluations'}
                  </button>
                </div>
              )}

            </div>
          )}

        </div>

        {/* COLUMN 3: Right Governance & Review Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Status & Action Card */}
          <div className="premium-card" style={{ padding: '18px' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--archon-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
              Governance Status
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <StatusBadge status={submission.status} />
              <span style={{ fontSize: '0.75rem', color: 'var(--archon-text-secondary)', fontFamily: 'var(--font-mono)' }}>
                {validReasoningCount}/{totalItems} Valid
              </span>
            </div>

            {canReview && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button
                  onClick={() => setApprovalOpen(true)}
                  disabled={submitting}
                  className="btn btn-success"
                  style={{ width: '100%', padding: '9px', borderRadius: '6px', fontWeight: 600, fontSize: '0.8rem' }}
                >
                  <CheckCircle2 size={14} /> Approve Submission
                </button>
                <button
                  onClick={() => setRevisionOpen(true)}
                  disabled={submitting}
                  className="btn btn-warning"
                  style={{ width: '100%', padding: '9px', borderRadius: '6px', fontWeight: 600, fontSize: '0.8rem' }}
                >
                  <AlertTriangle size={14} /> Request Revision
                </button>
              </div>
            )}
          </div>

          {/* AI Review Copilot Panel */}
          <AIReviewPanel
            activeSectionCode={activeSectionCode}
            evaluations={evaluations}
            onAppendNote={handleAppendAINote}
          />

          {/* Review History Audit Timeline */}
          <div className="premium-card" style={{ padding: '18px' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--archon-text)', marginBottom: '12px' }}>
              Audit History Timeline
            </div>
            <ReviewTimeline history={history} />
          </div>

        </div>

      </div>

      {/* Confirmation Modals */}
      <ApprovalDialog
        isOpen={approvalOpen}
        onClose={() => setApprovalOpen(false)}
        onConfirm={(notes) => handleStatusTransition('APPROVED', notes)}
        submitting={submitting}
        submission={submission}
        reviewerNotes={reviewerNotes}
        validReasoningCount={validReasoningCount}
        totalCriteriaCount={totalItems}
      />

      <RevisionDialog
        isOpen={revisionOpen}
        onClose={() => setRevisionOpen(false)}
        onConfirm={(notes) => handleStatusTransition('NEEDS_REVISION', notes)}
        submitting={submitting}
        submission={submission}
        reviewerNotes={reviewerNotes}
        rubricSections={rubricSections}
        evaluations={evaluations}
      />

      <ShortcutModal isOpen={shortcutOpen} onClose={() => setShortcutOpen(false)} />

    </div>
  );
};
