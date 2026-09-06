'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Hexagon, LayoutDashboard, ClipboardList, Map, BrainCircuit, BarChart3, Building2, FileText, Settings, LogOut, ChevronLeft, ChevronRight, X } from 'lucide-react';

const navItems = [
  { label: 'Overview', href: '/admin/dashboard', icon: <LayoutDashboard size={18} /> },
  { label: 'Complaints', href: '/admin/complaints', icon: <ClipboardList size={18} /> },
  { label: 'Civic Map', href: '/admin/map', icon: <Map size={18} /> },
  { label: 'Intelligence', href: '/admin/intelligence', icon: <BrainCircuit size={18} /> },
  { label: 'Analytics', href: '/admin/analytics', icon: <BarChart3 size={18} /> },
  { label: 'Departments', href: '/admin/departments', icon: <Building2 size={18} /> },
  { label: 'Reports', href: '/admin/reports', icon: <FileText size={18} /> },
];

const bottomItems = [
  { label: 'Settings', href: '/admin/settings', icon: <Settings size={18} /> },
];

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function AdminSidebar({ isOpen = false, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    // Clear the auth cookie so middleware blocks re-entry
    document.cookie = 'cl_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
    router.push('/login');
  };

  const handleNavClick = () => {
    // Close sidebar on mobile after nav click
    if (onClose) onClose();
  };

  return (
    <aside className={`sidebar ${isOpen ? 'mobile-open' : ''}`} style={{ width: collapsed ? '64px' : 'var(--sidebar-width)', transition: 'width 0.2s ease' }}>
      {/* Logo */}
      <div className="sidebar-logo" style={{ padding: collapsed ? '20px 16px' : '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: collapsed ? 'center' : 'flex-start', flex: 1 }}>
          <div className="app-logo" style={{
            width: '30px', height: '30px', background: 'var(--primary)',
            borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', flexShrink: 0,
            border: '1.5px solid var(--border)', boxShadow: 'var(--shadow-sm)',
          }}><Hexagon size={18} fill="currentColor" className="lucide-icon animate-float" /></div>
          {!collapsed && (
            <div>
              <div style={{ fontSize: '16px', fontWeight: '800', color: 'var(--primary)', letterSpacing: '-0.02em', lineHeight: '1.1' }}>CivicLens</div>
              <div style={{ fontSize: '9px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.08em' }}>AI Civic Intelligence</div>
            </div>
          )}
        </div>
        {/* Mobile close button */}
        {onClose && (
          <button onClick={onClose} className="sidebar-mobile-close" style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--text-muted)', display: 'flex', alignItems: 'center',
            padding: '4px',
          }}>
            <X size={18} className="lucide-icon" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {!collapsed && <div className="nav-section-label">Navigation</div>}
        {navItems.map(item => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link key={item.href} href={item.href}
              className={`nav-item ${active ? 'active' : ''}`}
              style={{ justifyContent: collapsed ? 'center' : 'flex-start', paddingLeft: collapsed ? '12px' : '10px' }}
              title={collapsed ? item.label : undefined}
              onClick={handleNavClick}>
              <span className="lucide-icon" style={{ display: 'flex', width: '20px', justifyContent: 'center' }}>{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="divider" style={{ margin: '8px 0' }} />
        {!collapsed && (
          <div style={{ padding: '8px 10px', marginBottom: '4px' }}>
            <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-main)' }}>Admin User</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>admin@civiclens.gov</div>
          </div>
        )}
        <button onClick={handleLogout}
          className="nav-item"
          style={{ width: '100%', border: 'none', background: 'none', cursor: 'pointer', justifyContent: collapsed ? 'center' : 'flex-start' }}>
          <span className="lucide-icon" style={{ display: 'flex', width: '20px', justifyContent: 'center' }}><LogOut size={18} /></span>
          {!collapsed && <span>Sign Out</span>}
        </button>
        <button onClick={() => setCollapsed(!collapsed)}
          className="sidebar-collapse-btn"
          style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '6px', border: '1px solid var(--border-subtle)', borderRadius: '6px',
            background: 'var(--bg)', cursor: 'pointer', marginTop: '8px',
            fontSize: '12px', color: 'var(--text-muted)',
          }}>
          {collapsed ? <ChevronRight size={16} className="lucide-icon" /> : <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><ChevronLeft size={16} className="lucide-icon" /> Collapse</span>}
        </button>
      </div>
    </aside>
  );
}

