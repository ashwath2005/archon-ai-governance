import React, { useState } from 'react';
import { Sparkles, AlertTriangle, CheckCircle2, ShieldAlert, Plus } from 'lucide-react';

export const AIReviewPanel = ({ activeSectionCode = '01', reasoningIncluded = false, onAppendNote }) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [insight, setInsight] = useState(null);

  const getSectionInsight = (code) => {
    switch (code) {
      case '01':
        return {
          sectionName: 'RAG SYSTEM ARCHITECTURE',
          observation: 'Hybrid vector retrieval (Pinecone + BM25) deployed with 512-token chunks and 50-token overlap.',
          tradeoff: 'Memory footprint vs. retrieval latency: 512-token chunks balance context granularity against vector DB index RAM overhead.',
          riskLevel: reasoningIncluded ? 'LOW' : 'HIGH',
          missingEvidence: reasoningIncluded ? 'None' : 'Quantitative latency vs. recall SLA benchmark',
          recommendation: 'Request latency justification for vector similarity threshold tuning.'
        };
      case '02':
        return {
          sectionName: 'AGENTIC WORKFLOWS',
          observation: 'Multi-agent state planner with tool calling execution loop and human-in-the-loop triggers.',
          tradeoff: 'Tool execution budget vs. loop timeout: Maximum 5 iteration steps prevent infinite agent recursion.',
          riskLevel: 'MEDIUM',
          missingEvidence: 'Agent state fallback policy for failed tool calls',
          recommendation: 'Verify error handling when external API tools time out.'
        };
      case '03':
        return {
          sectionName: 'MODEL TRADE-OFFS',
          observation: 'Fine-tuned Llama-3-8B compared against zero-shot GPT-4o prompting.',
          tradeoff: 'Parameter size vs. serving cost: 8B quantized model reduces inference cost by 65% with 2% accuracy delta.',
          riskLevel: 'LOW',
          missingEvidence: 'None',
          recommendation: 'Architecture trade-off rationale validated.'
        };
      case '06':
        return {
          sectionName: 'SAFETY & GOVERNANCE',
          observation: 'Input PII regex masking + output hallucination check guardrails.',
          tradeoff: 'Guardrail overhead vs. latency SLA: Guardrail processing adds ~45ms per request.',
          riskLevel: 'LOW',
          missingEvidence: 'None',
          recommendation: 'Safety guardrails meet enterprise governance threshold.'
        };
      default:
        return {
          sectionName: `SECTION ${code}`,
          observation: 'Architectural evaluation criteria and reasoning state analyzed.',
          tradeoff: 'Standard implementation trade-offs evaluated against baseline.',
          riskLevel: reasoningIncluded ? 'LOW' : 'MEDIUM',
          missingEvidence: reasoningIncluded ? 'None' : 'Architectural reasoning justification',
          recommendation: 'Ensure all criteria reasoning fields contain technical rationale.'
        };
    }
  };

  const handleRunAnalysis = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setInsight(getSectionInsight(activeSectionCode));
      setAnalyzing(false);
    }, 450);
  };

  return (
    <div style={{ background: 'var(--archon-surface)', border: '1px solid var(--archon-border)', borderRadius: 'var(--radius-lg)', padding: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Sparkles size={15} style={{ color: 'var(--archon-cyan)' }} />
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--archon-text)' }}>ARCHON INTELLIGENCE</span>
        </div>
        <button
          onClick={handleRunAnalysis}
          disabled={analyzing}
          className="btn btn-secondary btn-sm"
          style={{ fontSize: '0.7rem', padding: '3px 8px' }}
        >
          {analyzing ? 'Analyzing...' : 'Analyze Section'}
        </button>
      </div>

      {!insight && !analyzing && (
        <p style={{ fontSize: '0.75rem', color: 'var(--archon-text-muted)', lineHeight: 1.4 }}>
          Click <strong style={{ color: 'var(--archon-text)' }}>Analyze Section</strong> to run AI trade-off detection and governance risk assessment for Section [{activeSectionCode}].
        </p>
      )}

      {analyzing && (
        <div className="mono" style={{ fontSize: '0.725rem', color: 'var(--archon-cyan)', padding: '8px 10px', background: 'var(--archon-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--archon-border)' }}>
          ANALYZING SECTION [{activeSectionCode}] TRADE-OFFS & GOVERNANCE RISKS...
        </div>
      )}

      {insight && !analyzing && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.75rem' }}>
          <div style={{ padding: '8px 10px', background: 'var(--archon-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--archon-border)' }}>
            <div className="mono" style={{ fontSize: '0.625rem', fontWeight: 700, color: 'var(--archon-text-muted)', marginBottom: '2px' }}>
              TRADE-OFF ANALYSIS [{insight.sectionName}]
            </div>
            <div style={{ color: 'var(--archon-text-secondary)', fontSize: '0.725rem' }}>{insight.tradeoff}</div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 10px', background: 'var(--archon-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--archon-border)' }}>
            <span className="mono" style={{ fontSize: '0.625rem', color: 'var(--archon-text-muted)' }}>RISK LEVEL</span>
            <span
              className="status-pill"
              style={{
                background: insight.riskLevel === 'LOW' ? 'var(--archon-success-bg)' : insight.riskLevel === 'MEDIUM' ? 'var(--archon-warning-bg)' : 'var(--archon-danger-bg)',
                color: insight.riskLevel === 'LOW' ? 'var(--archon-success)' : insight.riskLevel === 'MEDIUM' ? 'var(--archon-warning)' : 'var(--archon-danger)',
                border: insight.riskLevel === 'LOW' ? '1px solid var(--archon-success-border)' : insight.riskLevel === 'MEDIUM' ? '1px solid var(--archon-warning-border)' : '1px solid var(--archon-danger-border)'
              }}
            >
              ● {insight.riskLevel} RISK
            </span>
          </div>

          {insight.missingEvidence !== 'None' && (
            <div style={{ padding: '8px 10px', background: 'var(--archon-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--archon-danger-border)' }}>
              <div className="mono" style={{ fontSize: '0.625rem', fontWeight: 700, color: 'var(--archon-danger)', marginBottom: '2px' }}>MISSING EVIDENCE WARNING</div>
              <div style={{ color: 'var(--archon-text-secondary)', fontSize: '0.725rem' }}>{insight.missingEvidence}</div>
            </div>
          )}

          <div style={{ padding: '8px 10px', background: 'var(--archon-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--archon-border)' }}>
            <div className="mono" style={{ fontSize: '0.625rem', fontWeight: 700, color: 'var(--archon-cyan)', marginBottom: '2px' }}>RECOMMENDED REVIEW QUESTION</div>
            <div style={{ color: 'var(--archon-text)', fontSize: '0.725rem' }}>{insight.recommendation}</div>
          </div>

          {onAppendNote && (
            <button
              onClick={() => onAppendNote(insight.recommendation)}
              className="btn btn-secondary btn-sm"
              style={{ width: '100%', marginTop: '4px', fontSize: '0.7rem' }}
            >
              <Plus size={12} /> Append Recommendation to Reviewer Notes
            </button>
          )}
        </div>
      )}
    </div>
  );
};
