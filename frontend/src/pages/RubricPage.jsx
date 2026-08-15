import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { ChevronRight, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const RubricPage = () => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedCode, setExpandedCode] = useState(null);

  useEffect(() => {
    const fetchRubric = async () => {
      try {
        const res = await axiosClient.get('/rubric');
        if (res.success) {
          setSections(res.data || []);
        }
      } catch (err) {
        console.error('Failed to load rubric standard', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRubric();
  }, []);

  const domainMetadata = {
    '01': { purpose: 'Retrieval decisions must be justified against data shape & query latency SLAs.', evalAreas: 'Vector DB · Embeddings · Chunking · Hybrid Search', commonRisk: 'Vector DB memory footprint vs. chunk recall trade-off missing' },
    '02': { purpose: 'Agent task decomposition, planning loops, and tool execution budgets must be bounded.', evalAreas: 'Multi-Agent · Tool Calling · Planning · Memory Loops', commonRisk: 'Unbounded tool call iteration loops causing infinite recursion' },
    '03': { purpose: 'RAG vs Fine-Tuning vs Zero-Shot trade-offs must be evaluated with benchmark SLAs.', evalAreas: 'RAG vs FT · Quantization · Serving Cost · Latency', commonRisk: 'Choosing fine-tuning without baseline RAG retrieval benchmarks' },
    '04': { purpose: 'Model compression, pruning, and deployment formats must be documented.', evalAreas: 'Distillation · Pruning · GGUF · AWQ · GPTQ', commonRisk: 'Accuracy drop (>3%) from aggressive quantization' },
    '05': { purpose: 'Continuous evaluation benchmarks, hallucination checks, and tracing must be configured.', evalAreas: 'Ragas Evals · TruLens · LangSmith Tracing · Fallbacks', commonRisk: 'Lack of automated faithfulness & answer relevance metrics' },
    '06': { purpose: 'PII masking, prompt injection guards, and immutable audit logging must be enforced.', evalAreas: 'PII Masking · Injection Guards · Hallucination Filter · Audit', commonRisk: 'Unsanitized user inputs reaching raw LLM orchestrator' }
  };

  if (loading) return <LoadingSkeleton count={6} height="90px" />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h1 className="font-brand" style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--archon-text)', marginBottom: '2px' }}>
          ARCHITECTURE STANDARD
        </h1>
        <p style={{ color: 'var(--archon-text-muted)', fontSize: '0.8rem' }}>
          The six domains governing GenAI architecture quality.
        </p>
      </div>

      {/* Interactive 6-Domain Engineering Module Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '16px' }}>
        {sections.map((sec) => {
          const isExpanded = expandedCode === sec.code;
          const meta = domainMetadata[sec.code] || { purpose: sec.description, evalAreas: 'Architecture Criteria', commonRisk: 'Missing reasoning' };

          return (
            <div
              key={sec.code}
              style={{
                background: 'var(--archon-surface)',
                border: '1px solid var(--archon-border)',
                borderRadius: 'var(--radius-lg)',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'border-color var(--motion-fast)'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span className="mono" style={{ fontSize: '0.7rem', fontWeight: 800, background: 'var(--archon-cyan-bg)', color: 'var(--archon-cyan)', padding: '2px 8px', borderRadius: '4px', border: '1px solid var(--archon-cyan-border)' }}>
                    DOMAIN {sec.code}
                  </span>
                  <span className="mono" style={{ fontSize: '0.7rem', color: 'var(--archon-text-muted)' }}>
                    {sec.items?.length || 0} CRITERIA
                  </span>
                </div>

                <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--archon-text)', marginBottom: '6px' }}>
                  {sec.title}
                </h2>

                <p style={{ color: 'var(--archon-text-secondary)', fontSize: '0.8rem', marginBottom: '12px', lineHeight: 1.4 }}>
                  {meta.purpose}
                </p>

                <div className="mono" style={{ fontSize: '0.7rem', color: 'var(--archon-text-muted)', marginBottom: '16px' }}>
                  Areas: <strong style={{ color: 'var(--archon-text)' }}>{meta.evalAreas}</strong>
                </div>
              </div>

              {/* Criteria Specification Drawer Toggle */}
              <div>
                <button
                  onClick={() => setExpandedCode(isExpanded ? null : sec.code)}
                  className="btn btn-secondary btn-sm"
                  style={{ width: '100%', justifyContent: 'space-between' }}
                >
                  <span>{isExpanded ? 'Hide Criteria Specifications' : 'Explore Criteria Specifications'}</span>
                  <ChevronRight size={14} style={{ transform: isExpanded ? 'rotate(90deg)' : 'none', transition: 'transform var(--motion-fast)' }} />
                </button>

                {isExpanded && (
                  <div className="animate-fade-in" style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--archon-border)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ padding: '8px 10px', background: 'var(--archon-danger-bg)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--archon-danger-border)', fontSize: '0.725rem' }}>
                      <strong className="mono" style={{ color: 'var(--archon-danger)' }}>COMMON GOVERNANCE RISK:</strong>
                      <div style={{ color: 'var(--archon-text-secondary)', marginTop: '2px' }}>{meta.commonRisk}</div>
                    </div>

                    {sec.items?.map((item) => (
                      <div key={item.id} style={{ padding: '8px 10px', background: 'var(--archon-bg)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--archon-border)', fontSize: '0.75rem' }}>
                        <div style={{ fontWeight: 700, color: 'var(--archon-text)' }}>{item.title}</div>
                        <div style={{ color: 'var(--archon-text-muted)', fontSize: '0.7rem', marginTop: '2px' }}>{item.description}</div>
                        <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                          {item.allowedOptions?.split(',').map((opt) => (
                            <span key={opt} className="mono" style={{ fontSize: '0.65rem', padding: '1px 4px', borderRadius: '3px', background: 'var(--archon-surface)', color: 'var(--archon-text-secondary)', border: '1px solid var(--archon-border)' }}>
                              {opt.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
