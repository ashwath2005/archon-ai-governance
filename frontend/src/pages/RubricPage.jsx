import React, { useState, useEffect, useMemo } from 'react';
import axiosClient from '../api/axiosClient';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { ErrorState } from '../components/common/ErrorState';
import {
  BookOpen,
  Search,
  CheckCircle2,
  Shield,
  Layers,
  Cpu,
  Database,
  Bot,
  Sliders,
  Sparkles,
  Server,
  ChevronRight,
  Filter
} from 'lucide-react';

export const RubricPage = () => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSection, setSelectedSection] = useState('ALL');

  const fetchRubric = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await axiosClient.get('/rubric');
      if (res.success) {
        setSections(res.data || []);
      }
    } catch (err) {
      console.error('Failed to load rubric standard', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRubric();
  }, []);

  const getSectionIcon = (code) => {
    switch (Number(code)) {
      case 0: return Sliders;
      case 1: return Database;
      case 2: return Bot;
      case 3: return Cpu;
      case 4: return Layers;
      case 5: return Server;
      default: return BookOpen;
    }
  };

  const getDomainTag = (code) => {
    const num = Number(code);
    return `Domain 0${num}`;
  };

  const filteredSections = useMemo(() => {
    if (!sections || sections.length === 0) return [];

    return sections
      .filter((sec) => {
        if (selectedSection === 'ALL') return true;
        return String(sec.sectionCode) === String(selectedSection);
      })
      .map((sec) => {
        if (!searchQuery.trim()) return sec;

        const q = searchQuery.toLowerCase();
        const matchesSection =
          sec.sectionName?.toLowerCase().includes(q) ||
          sec.description?.toLowerCase().includes(q);

        const filteredItems = (sec.items || []).filter((item) =>
          item.itemName?.toLowerCase().includes(q) ||
          item.itemKey?.toLowerCase().includes(q) ||
          item.description?.toLowerCase().includes(q) ||
          (item.options && item.options.some((opt) => opt.toLowerCase().includes(q)))
        );

        if (matchesSection || filteredItems.length > 0) {
          return {
            ...sec,
            items: filteredItems.length > 0 ? filteredItems : sec.items
          };
        }
        return null;
      })
      .filter(Boolean);
  }, [sections, selectedSection, searchQuery]);

  const totalCriteriaCount = useMemo(() => {
    return sections.reduce((acc, sec) => acc + (sec.items?.length || 0), 0);
  }, [sections]);

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <LoadingSkeleton count={1} height="60px" />
        <LoadingSkeleton count={3} height="200px" />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to Load Rubric Standard"
        message="Could not load the 6-domain architecture rubric from the server."
        onRetry={fetchRubric}
      />
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }} className="page-transition">
      
      {/* 1. PAGE HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge-premium badge-cyan">
              <BookOpen size={12} /> ARCHON Evaluation Specification
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--archon-text-muted)' }}>
              • {sections.length} Domains ({totalCriteriaCount} Total Criteria)
            </span>
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--archon-text)', margin: 0, letterSpacing: '-0.02em' }}>
            Architecture Standard Rubric
          </h1>
          <p style={{ color: 'var(--archon-text-secondary)', fontSize: '0.85rem', marginTop: '2px' }}>
            Official evaluation criteria, technology options & compulsory reasoning rules across all GenAI domains
          </p>
        </div>
      </div>

      {/* 2. FILTER TOOLBAR & DOMAIN NAV PILLS */}
      <div className="premium-card" style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          
          {/* Live Search */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', flex: 1, minWidth: '240px', maxWidth: '400px' }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', color: 'var(--archon-text-muted)', pointerEvents: 'none' }} />
            <input
              type="text"
              placeholder="Search criteria (e.g. Chunking, Vector DB, MCP, LoRA, Guardrails)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                paddingLeft: '32px',
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

          <span style={{ fontSize: '0.75rem', color: 'var(--archon-text-muted)' }}>
            Showing {filteredSections.length} of {sections.length} domains
          </span>
        </div>

        {/* Domain Navigation Tabs */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', paddingTop: '4px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <button
            onClick={() => setSelectedSection('ALL')}
            style={{
              padding: '5px 12px',
              fontSize: '0.75rem',
              fontWeight: 500,
              borderRadius: '6px',
              background: selectedSection === 'ALL' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
              color: selectedSection === 'ALL' ? '#FFFFFF' : 'var(--archon-text-muted)',
              border: '1px solid',
              borderColor: selectedSection === 'ALL' ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            All Domains ({sections.length})
          </button>
          
          {sections.map((sec) => {
            const isSelected = String(selectedSection) === String(sec.sectionCode);
            const Icon = getSectionIcon(sec.sectionCode);
            return (
              <button
                key={sec.id || sec.sectionCode}
                onClick={() => setSelectedSection(String(sec.sectionCode))}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '5px 12px',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  borderRadius: '6px',
                  background: isSelected ? 'rgba(56, 189, 248, 0.12)' : 'transparent',
                  color: isSelected ? 'var(--archon-cyan)' : 'var(--archon-text-secondary)',
                  border: '1px solid',
                  borderColor: isSelected ? 'rgba(56, 189, 248, 0.3)' : 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon size={12} />
                <span>{sec.sectionName}</span>
                <span style={{ fontSize: '0.65rem', opacity: 0.7 }}>({sec.items?.length || 0})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. DOMAIN SPECIFICATION CARDS */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {filteredSections.length === 0 ? (
          <div className="premium-card" style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--archon-text-muted)' }}>
            No rubric criteria found matching "{searchQuery}".
          </div>
        ) : (
          filteredSections.map((sec) => {
            const Icon = getSectionIcon(sec.sectionCode);
            return (
              <div key={sec.id || sec.sectionCode} className="premium-card" style={{ padding: '24px' }}>
                
                {/* Domain Card Header */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', paddingBottom: '16px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ background: 'rgba(56, 189, 248, 0.1)', color: 'var(--archon-cyan)', padding: '10px', borderRadius: '10px' }}>
                      <Icon size={20} />
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                        <span className="badge-premium badge-cyan" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
                          {getDomainTag(sec.sectionCode)}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--archon-text-muted)' }}>
                          • {sec.items?.length || 0} Evaluation Criteria
                        </span>
                      </div>
                      <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--archon-text)', margin: 0, letterSpacing: '-0.01em' }}>
                        {sec.sectionName}
                      </h2>
                    </div>
                  </div>

                  <span className="badge-premium badge-emerald" style={{ fontSize: '0.7rem' }}>
                    <CheckCircle2 size={12} /> Compulsory Reasoning Required
                  </span>
                </div>

                {/* Domain Description / Purpose */}
                {sec.description && (
                  <p style={{ color: 'var(--archon-text-secondary)', fontSize: '0.84rem', lineHeight: 1.5, marginBottom: '20px' }}>
                    {sec.description}
                  </p>
                )}

                {/* Criteria Grid */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {sec.items?.map((item, idx) => (
                    <div
                      key={item.id || item.itemKey || idx}
                      style={{
                        padding: '14px 16px',
                        background: '#0c0c0e',
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                        borderRadius: '8px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                        transition: 'border-color 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--archon-text-muted)', fontFamily: 'var(--font-mono)' }}>
                            #{idx + 1}
                          </span>
                          <span style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--archon-text)' }}>
                            {item.itemName}
                          </span>
                          <span style={{ fontSize: '0.68rem', padding: '2px 6px', background: 'rgba(255,255,255,0.04)', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--archon-text-muted)', fontFamily: 'var(--font-mono)' }}>
                            {item.itemKey}
                          </span>
                        </div>

                        <span style={{ fontSize: '0.7rem', color: 'var(--archon-success)' }}>
                          ● Mandatory ADR Rule
                        </span>
                      </div>

                      {item.description && (
                        <div style={{ fontSize: '0.8rem', color: 'var(--archon-text-secondary)', lineHeight: 1.45 }}>
                          {item.description}
                        </div>
                      )}

                      {/* Options list */}
                      {item.options && item.options.length > 0 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginTop: '4px' }}>
                          <span style={{ fontSize: '0.7rem', color: 'var(--archon-text-muted)', marginRight: '2px' }}>
                            Options:
                          </span>
                          {item.options.map((opt, optIdx) => (
                            <span
                              key={optIdx}
                              style={{
                                fontSize: '0.7rem',
                                padding: '2px 8px',
                                background: 'rgba(56, 189, 248, 0.05)',
                                border: '1px solid rgba(56, 189, 248, 0.15)',
                                borderRadius: '4px',
                                color: 'var(--archon-cyan)',
                                fontFamily: 'var(--font-mono)'
                              }}
                            >
                              {opt}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
