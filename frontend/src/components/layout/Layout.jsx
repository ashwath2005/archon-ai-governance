import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { GovernanceTerminal } from './GovernanceTerminal';

export const Layout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  return (
    <div className="app-container">
      <Sidebar
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed((prev) => !prev)}
      />
      <div
        className="main-content"
        style={{
          marginLeft: isCollapsed ? '68px' : '240px',
          transition: 'margin-left var(--spring-bounce) 0.28s'
        }}
      >
        <Topbar />
        <main key={location.pathname} className="page-content page-transition">
          <Outlet />
        </main>
      </div>

      {/* Floating System Governance Terminal Log Drawer */}
      <GovernanceTerminal />
    </div>
  );
};
