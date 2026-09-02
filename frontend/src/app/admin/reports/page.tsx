'use client';
import { useState } from 'react';
import Link from 'next/link';
import { FileText, Download, Calendar, Filter, Plus, FileSpreadsheet, FileIcon, Search } from 'lucide-react';

const MOCK_REPORTS = [
  { id: 'REP-2026-08-01', title: 'Monthly Ward Performance Report', type: 'PDF', date: 'Aug 1, 2026', size: '2.4 MB', author: 'System Auto-Generated' },
  { id: 'REP-2026-07-28', title: 'Critical Hotspots Analysis', type: 'CSV', date: 'Jul 28, 2026', size: '840 KB', author: 'Admin User' },
  { id: 'REP-2026-07-15', title: 'SLA Breach Summary (Q2)', type: 'PDF', date: 'Jul 15, 2026', size: '1.8 MB', author: 'System Auto-Generated' },
  { id: 'REP-2026-07-02', title: 'Citizen Engagement Metrics', type: 'Excel', date: 'Jul 2, 2026', size: '3.1 MB', author: 'Analytics Team' },
  { id: 'REP-2026-06-30', title: 'Department Resource Allocation', type: 'PDF', date: 'Jun 30, 2026', size: '1.2 MB', author: 'Admin User' },
];

export default function ReportsPage() {
  const [reports] = useState(MOCK_REPORTS);
  const [search, setSearch] = useState('');
  
  const filteredReports = reports.filter(r => r.title.toLowerCase().includes(search.toLowerCase()) || r.id.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">Reports</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Generate, view, and export civic intelligence reports</div>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Plus size={14} className="lucide-icon" /> New Report</button>
        </div>
      </div>

      <div className="page-content">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          <Link href="#" className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px', textDecoration: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FileText size={20} className="lucide-icon" /></div>
              <div>
                <div style={{ fontWeight: '700', fontSize: '14px', color: 'var(--text-main)' }}>Executive Summary</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>High-level overview</div>
              </div>
            </div>
            <button className="btn btn-secondary btn-sm" style={{ width: '100%', justifyContent: 'center' }}>Generate</button>
          </Link>
          
          <Link href="#" className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px', textDecoration: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'var(--critical-light)', color: 'var(--critical)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FileSpreadsheet size={20} className="lucide-icon" /></div>
              <div>
                <div style={{ fontWeight: '700', fontSize: '14px', color: 'var(--text-main)' }}>Raw Data Export</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Full datasets for analysis</div>
              </div>
            </div>
            <button className="btn btn-secondary btn-sm" style={{ width: '100%', justifyContent: 'center' }}>Configure</button>
          </Link>
          
          <Link href="#" className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px', textDecoration: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'var(--warning-light)', color: 'var(--warning)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Calendar size={20} className="lucide-icon" /></div>
              <div>
                <div style={{ fontWeight: '700', fontSize: '14px', color: 'var(--text-main)' }}>Automated Reports</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Scheduled deliveries</div>
              </div>
            </div>
            <button className="btn btn-secondary btn-sm" style={{ width: '100%', justifyContent: 'center' }}>Manage</button>
          </Link>
        </div>

        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontWeight: '700', fontSize: '15px' }}>Report Archive</div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <div className="form-group" style={{ marginBottom: 0, position: 'relative' }}>
                <Search size={14} className="lucide-icon" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input className="input" placeholder="Search reports..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: '32px', width: '220px', height: '32px', fontSize: '12px' }} />
              </div>
              <button className="btn btn-secondary btn-sm" style={{ padding: '0 10px' }}><Filter size={14} className="lucide-icon" /></button>
            </div>
          </div>
          
          <table className="data-table">
            <thead>
              <tr>
                <th>Report Name</th>
                <th>Type</th>
                <th>Generated Date</th>
                <th>Author</th>
                <th>Size</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map(r => (
                <tr key={r.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FileIcon size={16} className="lucide-icon text-muted" />
                      <div>
                        <div style={{ fontWeight: '700', fontSize: '13px', color: 'var(--text-main)' }}>{r.title}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{r.id}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${r.type === 'PDF' ? 'badge-critical' : r.type === 'CSV' ? 'badge-success' : 'badge-primary'}`}>
                      {r.type}
                    </span>
                  </td>
                  <td style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{r.date}</td>
                  <td style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{r.author}</td>
                  <td style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{r.size}</td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="btn btn-secondary btn-sm" style={{ display: 'inline-flex', padding: '4px 8px' }}>
                      <Download size={14} className="lucide-icon" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredReports.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    No reports found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
