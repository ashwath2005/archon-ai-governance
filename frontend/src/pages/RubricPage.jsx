import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { ChevronRight, Shield, CheckCircle2 } from 'lucide-react';

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

  if (loading) return <LoadingSkeleton count={6} height="100px" />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} className="page-transition">
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--archon-text)', margin: 0, letterSpacing: '-0.02em' }}>
          Architecture Standard Rubric
        </h1>
        <p style={{ color: 'var(--archon-text-secondary)', fontSize: '0.85rem', marginTop: '2px' }}>
          The six evaluation domains governing enterprise GenAI architectural compliance
        </p>
      </div>

      {/* 6-Domain Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '16px' }}>
        {sections.map((sec) => {
          const isExpanded = expandedCode === sec.code;
          const meta = domainMetadata[sec.code] || { purpose: sec.description, evalAreas: 'Architecture Criteria', commonRisk: 'Missing reasoning' };

          return (
            <div
              key={sec.code}
              className="premium-card"
              style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span className="badge-premium badge-cyan">
                    Domain {sec.code}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--archon-text-muted)' }}>
                    {sec.items?.length || 0} Criteria
                  </span>
                </div>

                <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--archon-text)', marginBottom: '6px' }}>
                  {sec.title}
                </h2>

                <p style={{ color: 'var(--archon-text-secondary)', fontSize: '0.82rem', marginBottom: '12px', lineHeight: 1.45 }}>
                  {meta.purpose}
                </p>

                <div style={{ fontSize: '0.75rem', color: 'var(--archon-text-muted)', marginBottom: '16px' }}>
                  Focus: <strong style={{ color: 'var(--archon-text)' }}>{meta.evalAreas}</strong>
                </div>
              </div>

              {/* Expand Toggle */}
              <div>
                <button
                  onClick={() => setExpandedCode(isExpanded ? null : sec.code)}
                  className="btn btn-secondary btn-sm"
                  style={{ width: '100%', justifyContent: 'space-between', borderRadius: '6px' }}
                >
                  <span>{isExpanded ? 'Hide Criteria Specifications' : 'View Criteria Specifications'}</span>
                  <ChevronRight size={14} style={{ transform: isExpanded ? 'rotate(90deg)' : 'none', transition: 'transform 0.18s ease' }} />
                </button>

                {isExpanded && (
                  <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {sec.items?.map((item) => (
                      <div key={item.id} style={{ padding: '8px 10px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '6px' }}>
                        <div style={{ fontWeight: 600, fontSize: '0.78rem', color: 'var(--archon-text)' }}>
                          {item.key} — {item.label}
                        </div>
                        {item.description && (
                          <div style={{ fontSize: '0.72rem', color: 'var(--archon-text-muted)', marginTop: '2px' }}>
                            {item.description}
                          </div>
                        )}
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
