import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  BookOpen,
  BarChart2,
  LogOut,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Shield,
  Activity,
  Zap,
  Sliders
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import archonLogo from '../../logo/ARCHON .svg';

export const Sidebar = ({ isCollapsed, onToggleCollapse }) => {
  const { user, logout, isIntern, isReviewer, isAdmin } = useAuth();

  const sections = [
    {
      title: 'COMMAND CENTER',
      items: [
        { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', roles: ['ADMIN', 'REVIEWER', 'INTERN'] }
      ]
    },
    {
      title: 'REVIEW',
      items: [
        { label: 'Submissions', icon: FileText, path: '/submissions', roles: ['ADMIN', 'REVIEWER', 'INTERN'] },
        { label: 'Rubric Standard', icon: BookOpen, path: '/rubric', roles: ['ADMIN', 'REVIEWER', 'INTERN'] }
      ]
    },
    {
      title: 'INSIGHTS',
      items: [
        { label: 'Governance Intel', icon: BarChart2, path: '/analytics', roles: ['ADMIN', 'REVIEWER'] }
      ]
    }
  ];

  return (
    <aside
      style={{
        width: isCollapsed ? '68px' : '240px',
        backgroundColor: 'var(--archon-bg)',
        borderRight: '1px solid var(--archon-border)',
        padding: isCollapsed ? '16px 10px' : '16px 14px',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        height: '100vh',
        top: 0,
        left: 0,
        zIndex: 50,
        transition: 'width var(--motion-normal)'
      }}
    >
      {/* Brand Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'space-between',
          paddingBottom: '16px',
          borderBottom: '1px solid var(--archon-border)',
          marginBottom: '16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
          <img
            src={archonLogo}
            alt="ARCHON Logo"
            style={{
              height: '32px',
              width: '32px',
              borderRadius: '6px',
              objectFit: 'contain',
              flexShrink: 0
            }}
          />
          {!isCollapsed && (
            <div>
              <h2 className="font-brand" style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--archon-text)', lineHeight: 1.1 }}>
                ARCHON
              </h2>
              <span className="mono" style={{ fontSize: '0.55rem', color: 'var(--archon-text-muted)', letterSpacing: '0.08em', display: 'block', marginTop: '2px' }}>
                GOVERNANCE OS
              </span>
            </div>
          )}
        </div>

        <button
          onClick={onToggleCollapse}
          className="btn btn-ghost btn-sm"
          style={{ padding: '4px', color: 'var(--archon-text-muted)', borderRadius: '4px' }}
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, overflowY: 'auto' }}>
        {sections.map((section) => {
          const visibleItems = section.items.filter((item) => item.roles.includes(user?.role));
          if (visibleItems.length === 0) return null;

          return (
            <div key={section.title}>
              {!isCollapsed && (
                <div
                  className="mono"
                  style={{
                    fontSize: '0.6rem',
                    fontWeight: 700,
                    color: 'var(--archon-text-muted)',
                    marginBottom: '6px',
                    paddingLeft: '8px',
                    letterSpacing: '0.08em'
                  }}
                >
                  {section.title}
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {visibleItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    title={isCollapsed ? item.label : undefined}
                    style={({ isActive }) => ({
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: isCollapsed ? '10px 0' : '8px 10px',
                      justifyContent: isCollapsed ? 'center' : 'flex-start',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      borderRadius: 'var(--radius-md)',
                      textDecoration: 'none',
                      backgroundColor: isActive ? 'var(--archon-surface-subtle)' : 'transparent',
                      color: isActive ? 'var(--archon-text)' : 'var(--archon-text-secondary)',
                      borderLeft: isActive ? '3px solid var(--archon-cyan)' : '3px solid transparent',
                      transition: 'all var(--motion-fast)'
                    })}
                  >
                    {({ isActive }) => (
                      <>
                        <item.icon
                          size={16}
                          style={{
                            color: isActive ? 'var(--archon-cyan)' : 'var(--archon-text-muted)',
                            flexShrink: 0
                          }}
                        />
                        {!isCollapsed && <span>{item.label}</span>}
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          );
        })}
      </nav>

      {/* User Footer Profile */}
      <div style={{ paddingTop: '12px', borderTop: '1px solid var(--archon-border)' }}>
        {!isCollapsed && (
          <div style={{ marginBottom: '10px', padding: '8px 10px', background: 'var(--archon-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--archon-border)' }}>
            <div style={{ fontWeight: 700, fontSize: '0.775rem', color: 'var(--archon-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.name}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--archon-text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.email}
            </div>
            <span
              className="status-pill status-approved"
              style={{ marginTop: '4px', fontSize: '0.6rem', padding: '1px 6px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
            >
              <ShieldCheck size={10} /> {user?.role}
            </span>
          </div>
        )}

        <button
          onClick={logout}
          className="btn btn-secondary btn-sm"
          style={{ width: '100%', justifyContent: isCollapsed ? 'center' : 'flex-start', color: 'var(--archon-danger)' }}
          title="Sign Out"
        >
          <LogOut size={14} /> {!isCollapsed && 'Sign Out'}
        </button>
      </div>
    </aside>
  );
};
