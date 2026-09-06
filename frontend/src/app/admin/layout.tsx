'use client';
import { useState } from 'react';
import AdminSidebar from '@/components/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Mobile overlay backdrop */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main-content" style={{ flex: 1 }}>
        {/* Mobile top bar with hamburger */}
        <div className="mobile-topbar" style={{
          display: 'none',
          alignItems: 'center', gap: '12px',
          padding: '12px 16px',
          background: 'var(--surface)',
          borderBottom: '1.5px solid var(--border-subtle)',
          position: 'sticky', top: 0, zIndex: 50,
        }}>
          <button
            className="mobile-menu-btn"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open navigation menu"
          >
            <span style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {[0,1,2].map(i => (
                <span key={i} style={{ display: 'block', width: '18px', height: '2px', background: 'var(--text-main)', borderRadius: '2px' }} />
              ))}
            </span>
          </button>
          <span style={{ fontWeight: '800', fontSize: '16px', color: 'var(--primary)', letterSpacing: '-0.02em' }}>CivicLens</span>
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
