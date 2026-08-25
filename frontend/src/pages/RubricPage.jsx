import React, { useState, useEffect, useMemo } from 'react';
import axiosClient from '../api/axiosClient';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { ErrorState } from '../components/common/ErrorState';
import {
  Search,
  BookOpen,
  Sliders,
  Database,
  Bot,
  Cpu,
  Layers,
  Server,
  ChevronRight,
  Info
} from 'lucide-react';

export const RubricPage = () => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchRubric = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await axiosClient.get('/rubric');
      if (res.success && res.data?.length > 0) {
        setSections(res.data);
        setActiveSectionId(res.data[0].id || res.data[0].sectionCode);
      }
    } catch (err) {
      console.error('Failed to load rubric', err);
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

  const activeSection = useMemo(() => {
    if (!sections.length) return null;
    return sections.find((s) => (s.id || s.sectionCode) === activeSectionId) || sections[0];
  }, [sections, activeSectionId]);

  const filteredItems = useMemo(() => {
    if (!activeSection?.items) return [];
    if (!searchQuery.trim()) return activeSection.items;

    const q = searchQuery.toLowerCase();
    return activeSection.items.filter((item) =>
      item.itemName?.toLowerCase().includes(q) ||
      item.itemKey?.toLowerCase().includes(q) ||
      item.description?.toLowerCase().includes(q) ||
      (item.options && item.options.some((opt) => opt.toLowerCase().includes(q)))
    );
  }, [activeSection, searchQuery]);

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <LoadingSkeleton count={1} height="50px" />
        <LoadingSkeleton count={1} height="350px" />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to Load Rubric"
        message="Could not load the evaluation standards."
        onRetry={fetchRubric}
      />
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} className="page-transition">
      
      {/* 1. CLEAN HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.45rem', fontWeight: 600, color: 'var(--archon-text)', margin: 0, letterSpacing: '-0.02em' }}>
            Rubric Standard
          </h1>
          <p style={{ color: 'var(--archon-text-secondary)', fontSize: '0.82rem', marginTop: '2px' }}>
            Architecture evaluation criteria and required decision reasoning across 6 GenAI domains.
          </p>
        </div>

        {/* Minimal Search Bar */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <Search size={13} style={{ position: 'absolute', left: '10px', color: 'var(--archon-text-muted)', pointerEvents: 'none' }} />
          <input
            type="text"
            placeholder="Search criteria..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              paddingLeft: '28px',
              paddingRight: '12px',
              height: '32px',
              fontSize: '0.78rem',
              background: '#0c0c0e',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '6px',
              color: 'var(--archon-text)',
              width: '200px'
            }}
          />
        </div>
      </div>

      {/* 2. MASTER-DETAIL SPLIT CANVAS */}
      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '16px', alignItems: 'start' }}>
        
        {/* Left Navigation: 6 Domains Menu */}
        <div
          style={{
            background: '#09090b',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '10px',
            padding: '8px',
            display: 'flex',
            flexDirection: 'column',
            gap: '2px'
          }}
        >
          <div style={{ padding: '6px 10px', fontSize: '0.68rem', fontWeight: 600, color: 'var(--archon-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Domains ({sections.length})
          </div>

          {sections.map((sec) => {
            const isSelected = (sec.id || sec.sectionCode) === activeSectionId;
            const Icon = getSectionIcon(sec.sectionCode);

            return (
              <button
                key={sec.id || sec.sectionCode}
                onClick={() => {
                  setActiveSectionId(sec.id || sec.sectionCode);
                  setSearchQuery('');
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '9px 10px',
                  borderRadius: '6px',
                  background: isSelected ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                  color: isSelected ? '#FFFFFF' : 'var(--archon-text-secondary)',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  fontWeight: isSelected ? 600 : 400,
                  textAlign: 'left',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                  <Icon size={14} style={{ color: isSelected ? 'var(--archon-cyan)' : 'var(--archon-text-muted)', flexShrink: 0 }} />
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {sec.sectionName}
                  </span>
                </div>
                <span style={{ fontSize: '0.7rem', color: 'var(--archon-text-muted)', marginLeft: '6px', flexShrink: 0 }}>
                  {sec.items?.length || 0}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right Detail Content: Active Domain Criteria */}
        {activeSection && (
          <div
            style={{
              background: '#09090b',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '10px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px'
            }}
          >
            {/* Active Domain Header */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--archon-cyan)', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                  Domain 0{activeSection.sectionCode}
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--archon-text-muted)' }}>
                  • {activeSection.items?.length || 0} criteria
                </span>
              </div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--archon-text)', margin: 0 }}>
                {activeSection.sectionName}
              </h2>
              {activeSection.description && (
                <p style={{ color: 'var(--archon-text-secondary)', fontSize: '0.82rem', marginTop: '4px', lineHeight: 1.45 }}>
                  {activeSection.description}
                </p>
              )}
            </div>

            {/* Criteria List */}
            <div style={{ display: 'flex', flexDirection: 'column', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '8px', overflow: 'hidden' }}>
              {filteredItems.length === 0 ? (
                <div style={{ padding: '32px', textAlign: 'center', color: 'var(--archon-text-muted)', fontSize: '0.8rem' }}>
                  No criteria matching "{searchQuery}" in this domain.
                </div>
              ) : (
                filteredItems.map((item, idx) => (
                  <div
                    key={item.id || item.itemKey || idx}
                    style={{
                      padding: '14px 18px',
                      background: idx % 2 === 0 ? 'rgba(255, 255, 255, 0.01)' : 'transparent',
                      borderBottom: idx < filteredItems.length - 1 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--archon-text)' }}>
                        {item.itemName}
                      </span>
                      <span style={{ fontSize: '0.68rem', color: 'var(--archon-text-muted)', fontFamily: 'var(--font-mono)' }}>
                        {item.itemKey}
                      </span>
                    </div>

                    {item.description && (
                      <div style={{ fontSize: '0.78rem', color: 'var(--archon-text-secondary)', lineHeight: 1.4 }}>
                        {item.description}
                      </div>
                    )}

                    {/* Options list */}
                    {item.options && item.options.length > 0 && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexWrap: 'wrap', marginTop: '4px' }}>
                        <span style={{ fontSize: '0.68rem', color: 'var(--archon-text-muted)' }}>
                          Options:
                        </span>
                        {item.options.map((opt, optIdx) => (
                          <span
                            key={optIdx}
                            style={{
                              fontSize: '0.68rem',
                              padding: '1px 6px',
                              background: 'rgba(255, 255, 255, 0.04)',
                              border: '1px solid rgba(255, 255, 255, 0.08)',
                              borderRadius: '4px',
                              color: 'var(--archon-text-secondary)'
                            }}
                          >
                            {opt}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Clean Note Footer */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.74rem', color: 'var(--archon-text-muted)', padding: '8px 12px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '6px' }}>
              <Info size={13} style={{ color: 'var(--archon-cyan)', flexShrink: 0 }} />
              <span>All architectural decisions require written reasoning (&gt; 5 characters) for approval certification.</span>
            </div>

          </div>
        )}

      </div>

    </div>
  );
};
