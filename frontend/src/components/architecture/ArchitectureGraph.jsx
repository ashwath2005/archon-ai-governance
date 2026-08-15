import React, { useState } from 'react';
import { User, Cpu, Database, ShieldAlert, Activity, GitCommit, ChevronRight, Clock } from 'lucide-react';

export const ArchitectureGraph = ({ activeSectionCode = '01', projectDomain = 'RAG & Multi-Agent Architecture' }) => {
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [viewMode, setViewMode] = useState('structure'); // 'structure' | 'latency'

  const nodes = [
    { id: 'user', label: 'Client App', icon: User, sectionCodes: ['01', '06'], desc: 'HTTP API Client / React Front-end Interface', latency: '0ms', cost: '$0.00' },
    { id: 'guardrail', label: 'Input Guardrail', icon: ShieldAlert, sectionCodes: ['06'], desc: 'Regex & NER PII Token Masking + Injection Scanner', latency: '+45ms', cost: '$0.0001' },
    { id: 'orchestrator', label: 'Agent Orchestrator', icon: Cpu, sectionCodes: ['02', '03'], desc: 'LangChain/LlamaIndex State Machine & Tool Execution Loop', latency: '+120ms', cost: '$0.0012' },
    { id: 'rag_engine', label: 'RAG Hybrid Engine', icon: GitCommit, sectionCodes: ['01'], desc: 'Dense Vector Retrieval + BM25 Lexical Keyword Reranker', latency: '+38ms', cost: '$0.0004' },
    { id: 'vector_db', label: 'Pinecone Vector DB', icon: Database, sectionCodes: ['01', '04'], desc: '1536-dim Cosine Similarity Embedding Index', latency: '+18ms', cost: '$0.0002' },
    { id: 'evals', label: 'LLMOps & Evals', icon: Activity, sectionCodes: ['05'], desc: 'Continuous Faithfulness, Answer Relevance & Tracing', latency: '+22ms', cost: '$0.0001' }
  ];

  // Context-aware node determination
  const isNodeHighlighted = (node) => {
    if (selectedNodeId === node.id) return true;
    if (activeSectionCode === '01' && (node.id === 'rag_engine' || node.id === 'vector_db')) return true;
    if (activeSectionCode === '02' && node.id === 'orchestrator') return true;
    if (activeSectionCode === '03' && node.id === 'orchestrator') return true;
    if (activeSectionCode === '04' && (node.id === 'vector_db' || node.id === 'orchestrator')) return true;
    if (activeSectionCode === '05' && node.id === 'evals') return true;
    if (activeSectionCode === '06' && node.id === 'guardrail') return true;
    return false;
  };

  const activeNode = nodes.find((n) => n.id === selectedNodeId) || nodes.find((n) => isNodeHighlighted(n)) || nodes[0];

  return (
    <div style={{ background: 'var(--archon-surface)', border: '1px solid var(--archon-border)', borderRadius: 'var(--radius-lg)', padding: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div>
          <h3 style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--archon-text)' }}>
            INTERACTIVE ARCHITECTURE PIPELINE GRAPH
          </h3>
          <span className="mono" style={{ fontSize: '0.68rem', color: 'var(--archon-text-muted)' }}>
            Active Section [{activeSectionCode}] • Total Latency: <strong style={{ color: 'var(--archon-cyan)' }}>243ms</strong>
          </span>
        </div>

        {/* View Mode Toggle */}
        <div style={{ display: 'flex', gap: '2px', background: 'var(--archon-bg)', padding: '2px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--archon-border)' }}>
          <button
            onClick={() => setViewMode('structure')}
            className="mono"
            style={{
              padding: '2px 8px',
              borderRadius: '3px',
              fontSize: '0.65rem',
              fontWeight: 600,
              border: 'none',
              background: viewMode === 'structure' ? 'var(--archon-surface-elevated)' : 'transparent',
              color: viewMode === 'structure' ? 'var(--archon-cyan)' : 'var(--archon-text-muted)'
            }}
          >
            Structure
          </button>
          <button
            onClick={() => setViewMode('latency')}
            className="mono"
            style={{
              padding: '2px 8px',
              borderRadius: '3px',
              fontSize: '0.65rem',
              fontWeight: 600,
              border: 'none',
              background: viewMode === 'latency' ? 'var(--archon-surface-elevated)' : 'transparent',
              color: viewMode === 'latency' ? 'var(--archon-cyan)' : 'var(--archon-text-muted)'
            }}
          >
            Latency SLAs
          </button>
        </div>
      </div>

      {/* Visual Node Flow Line */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px', padding: '12px', background: 'var(--archon-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--archon-border)' }}>
        {nodes.map((node, idx) => {
          const Icon = node.icon;
          const highlighted = isNodeHighlighted(node);

          return (
            <React.Fragment key={node.id}>
              <div
                onClick={() => setSelectedNodeId(node.id)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '8px 10px',
                  borderRadius: 'var(--radius-md)',
                  background: highlighted ? 'var(--archon-surface-elevated)' : 'var(--archon-surface)',
                  border: highlighted ? '1px solid var(--archon-cyan)' : '1px solid var(--archon-border)',
                  cursor: 'pointer',
                  minWidth: '105px',
                  transition: 'all var(--motion-fast)'
                }}
              >
                <div style={{ padding: '5px', borderRadius: '4px', background: 'var(--archon-bg)', color: highlighted ? 'var(--archon-cyan)' : 'var(--archon-text-muted)' }}>
                  <Icon size={14} />
                </div>
                <span className="mono" style={{ fontSize: '0.65rem', fontWeight: 600, textAlign: 'center', color: highlighted ? 'var(--archon-text)' : 'var(--archon-text-secondary)' }}>
                  {node.label}
                </span>

                {viewMode === 'latency' && (
                  <span className="mono" style={{ fontSize: '0.6rem', padding: '1px 4px', background: 'var(--archon-cyan-bg)', color: 'var(--archon-cyan)', border: '1px solid var(--archon-cyan-border)', borderRadius: '3px', marginTop: '2px' }}>
                    {node.latency}
                  </span>
                )}
              </div>
              {idx < nodes.length - 1 && (
                <ChevronRight size={12} style={{ color: 'var(--archon-text-muted)', flexShrink: 0 }} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Node Context Metadata Panel */}
      {activeNode && (
        <div className="animate-fade-in" style={{ marginTop: '10px', padding: '10px 12px', background: 'var(--archon-surface-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--archon-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '0.775rem', fontWeight: 700, color: 'var(--archon-text)' }}>{activeNode.label}</div>
            <div style={{ fontSize: '0.725rem', color: 'var(--archon-text-muted)', marginTop: '2px' }}>{activeNode.desc}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span className="mono" style={{ fontSize: '0.65rem', color: 'var(--archon-cyan)', display: 'block' }}>
              Latency: {activeNode.latency}
            </span>
            <span className="mono" style={{ fontSize: '0.6rem', color: 'var(--archon-text-muted)' }}>
              Est. Cost: {activeNode.cost} / req
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
