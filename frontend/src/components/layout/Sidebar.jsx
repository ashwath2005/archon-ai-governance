import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  BookOpen,
  BarChart2,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldCheck
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
        backgroundColor: '#09090b',
        borderRight: '1px solid rgba(255, 255, 255, 0.08)',
        padding: isCollapsed ? '16px 10px' : '16px 14px',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        height: '100vh',
        top: 0,
        left: 0,
        zIndex: 50,
        transition: 'width 0.2s ease'
      }}
    >
      {/* Brand Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'space-between',
          paddingBottom: '16px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          marginBottom: '16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
          <img
            src={archonLogo}
            alt="ARCHON Logo"
            style={{
              height: '30px',
              width: '30px',
              borderRadius: '6px',
              objectFit: 'contain',
              flexShrink: 0
            }}
          />
          {!isCollapsed && (
            <div>
              <h2 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--archon-text)', margin: 0, letterSpacing: '0.04em' }}>
                ARCHON
              </h2>
              <span style={{ fontSize: '0.62rem', color: 'var(--archon-text-muted)', display: 'block', marginTop: '1px' }}>
                Governance OS
              </span>
            </div>
          )}
        </div>

        <button
          onClick={onToggleCollapse}
          className="btn btn-ghost btn-sm"
          style={{ padding: '4px', color: 'var(--archon-text-muted)', borderRadius: '6px' }}
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
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
                  style={{
                    fontSize: '0.65rem',
                    fontWeight: 600,
                    color: 'var(--archon-text-muted)',
                    marginBottom: '6px',
                    paddingLeft: '10px',
                    letterSpacing: '0.04em'
                  }}
                >
                  {section.title}
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
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
                      fontSize: '0.82rem',
                      fontWeight: isActive ? 600 : 500,
                      borderRadius: '8px',
                      textDecoration: 'none',
                      backgroundColor: isActive ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                      color: isActive ? '#FFFFFF' : 'var(--archon-text-secondary)',
                      transition: 'all 0.15s ease'
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

      {/* User Profile Footer */}
      <div style={{ paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
        {!isCollapsed && (
          <div style={{ marginBottom: '10px', padding: '10px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <div style={{ fontWeight: 600, fontSize: '0.8rem', color: 'var(--archon-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.name}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--archon-text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.email}
            </div>
            <div style={{ marginTop: '6px' }}>
              <span className="badge-premium badge-emerald" style={{ fontSize: '0.62rem', padding: '2px 8px' }}>
                <ShieldCheck size={10} /> {user?.role}
              </span>
            </div>
          </div>
        )}

        <button
          onClick={logout}
          className="btn btn-secondary btn-sm"
          style={{ width: '100%', justifyContent: isCollapsed ? 'center' : 'flex-start', color: 'var(--archon-danger)', borderRadius: '6px' }}
          title="Sign Out"
        >
          <LogOut size={14} /> {!isCollapsed && 'Sign Out'}
        </button>
      </div>
    </aside>
  );
};
