'use client';
import { useState } from 'react';
import AdminSidebar from '@/components/AdminSidebar';

const COLLAPSED_WIDTH = '64px';
const EXPANDED_WIDTH  = '240px';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen,     setSidebarOpen]     = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const sidebarWidth = sidebarCollapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Mobile overlay backdrop */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      <AdminSidebar
        isOpen={sidebarOpen}
        collapsed={sidebarCollapsed}
        onClose={() => setSidebarOpen(false)}
        onCollapse={() => setSidebarCollapsed(prev => !prev)}
      />

      {/* Main content — margin tracks sidebar width on desktop */}
      <div
        className="main-content"
        style={{
          flex: 1,
          marginLeft: sidebarWidth,
          transition: 'margin-left 0.22s ease',
          minWidth: 0,
        }}
      >
        {/* Mobile top bar with hamburger */}
        <div className="mobile-topbar" style={{
          display: 'none',
          alignItems: 'center', gap: '12px',
          padding: '12px 16px',
          background: 'rgba(255,248,235,0.85)',
          borderBottom: '1.5px solid rgba(224,112,0,0.18)',
          backdropFilter: 'blur(12px)',
          position: 'sticky', top: 0, zIndex: 50,
        }}>
          <button
            className="mobile-menu-btn"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open navigation menu"
          >
            <span style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {[0,1,2].map(i => (
                <span key={i} style={{ display: 'block', width: '18px', height: '2px', background: '#E07000', borderRadius: '2px' }} />
              ))}
            </span>
          </button>
          <span style={{ fontWeight: '800', fontSize: '16px', color: '#E07000', letterSpacing: '-0.02em' }}>CivicLens</span>
        </div>

        {children}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .mobile-topbar { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
