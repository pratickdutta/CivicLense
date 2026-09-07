'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, ArrowRight, ArrowLeft } from 'lucide-react';

const API = 'http://localhost:8000';
const SEVERITIES = ['', 'critical', 'high', 'medium', 'low'];
const STATUSES = ['', 'submitted', 'classified', 'assigned', 'in_progress', 'resolved', 'closed'];
const CATEGORIES = ['', 'Road Infrastructure', 'Garbage & Sanitation', 'Water Supply', 'Drainage', 'Streetlights', 'Public Infrastructure', 'Traffic', 'Other'];

const MOCK_COMPLAINTS = Array.from({ length: 20 }, (_, i) => ({
  id: 10001 + i,
  complaint_number: `CL${(10001 + i).toString().padStart(5, '0')}`,
  description: ['Large pothole near school causing vehicle damage.', 'Garbage overflow near market.', 'No water supply for 3 days.', 'Streetlight not working near junction.', 'Blocked drain flooding road.'][i % 5],
  category: ['Road Infrastructure', 'Garbage & Sanitation', 'Water Supply', 'Streetlights', 'Drainage'][i % 5],
  subcategory: ['Pothole', 'Overflowing Bins', 'No Water Supply', 'Light Not Working', 'Blocked Drain'][i % 5],
  severity: ['critical', 'high', 'medium', 'high', 'medium', 'low', 'critical', 'high', 'medium', 'high'][i % 10],
  priority_score: [91, 72, 55, 68, 48, 32, 88, 75, 50, 65][i % 10],
  status: ['submitted', 'classified', 'assigned', 'in_progress', 'resolved'][i % 5],
  ward_id: (i % 20) + 1,
  address: `Ward ${(i % 20) + 1}, Pune`,
  ai_confidence: 0.82 + (i % 5) * 0.03,
  cluster_id: i < 5 ? 1 : null,
  created_at: new Date(Date.now() - i * 3600000 * 8).toISOString(),
}));

function SeverityBadge({ severity }: { severity: string }) {
  return <span className={`badge badge-${severity}`}>{severity}</span>;
}
function StatusBadge({ status }: { status: string }) {
  const labels: Record<string, string> = { submitted: 'Submitted', classified: 'Classified', assigned: 'Assigned', in_progress: 'In Progress', resolved: 'Resolved', closed: 'Closed' };
  return <span className={`badge badge-${status}`}>{labels[status] || status}</span>;
}

export default function ComplaintsPage() {
  const router = useRouter();
  const [complaints, setComplaints] = useState(MOCK_COMPLAINTS);
  const [total, setTotal] = useState(50000);
  const [page, setPage] = useState(1);
  const [severity, setSeverity] = useState('');
  const [status, setStatus] = useState('');
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const u = localStorage.getItem('user');
      if (u) {
        const parsed = JSON.parse(u);
        if (parsed.role === 'supervisor') {
          setComplaints(MOCK_COMPLAINTS.filter(c => c.ward_id === 14));
          setTotal(145);
        } else if (parsed.role === 'officer') {
          setComplaints(MOCK_COMPLAINTS.filter(c => c.category === 'Road Infrastructure' || c.category === 'Streetlights'));
          setTotal(2420);
        }
      }
    } catch {}
  }, []);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20' });
      if (severity) params.append('severity', severity);
      if (status) params.append('status', status);
      if (category) params.append('category', category);
      if (search) params.append('search', search);
      const res = await fetch(`${API}/api/complaints?${params}`);
      if (res.ok) {
        const data = await res.json();
        setComplaints(data.complaints);
        setTotal(data.total);
      }
    } catch {
      setComplaints(MOCK_COMPLAINTS);
      setTotal(50000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchComplaints(); }, [page, severity, status, category]);

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">Complaints Management</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{total.toLocaleString()} total complaints</div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-secondary btn-sm" onClick={() => window.location.reload()}>Refresh Data</button>
          <Link href="/admin/reports" className="btn btn-primary btn-sm">Export Report</Link>
        </div>
      </div>

      <div className="page-content">
        {/* Filters */}
        <div className="card" style={{ padding: '16px', marginBottom: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto auto auto', gap: '10px', alignItems: 'end' }}>
            <div>
              <label className="label">Search</label>
              <input className="input" placeholder="Search complaints..."
                value={search} onChange={e => setSearch(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && fetchComplaints()}
                style={{ fontSize: '13px' }} />
            </div>
            <div>
              <label className="label">Severity</label>
              <select className="input select" value={severity} onChange={e => { setSeverity(e.target.value); setPage(1); }} style={{ fontSize: '13px', width: '130px' }}>
                {SEVERITIES.map(s => <option key={s} value={s}>{s || 'All Severities'}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Status</label>
              <select className="input select" value={status} onChange={e => { setStatus(e.target.value); setPage(1); }} style={{ fontSize: '13px', width: '140px' }}>
                {STATUSES.map(s => <option key={s} value={s}>{s ? s.replace('_', ' ') : 'All Statuses'}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Category</label>
              <select className="input select" value={category} onChange={e => { setCategory(e.target.value); setPage(1); }} style={{ fontSize: '13px', width: '160px' }}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c || 'All Categories'}</option>)}
              </select>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={fetchComplaints} style={{ height: '38px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Search size={14} className="lucide-icon" /> Filter
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading complaints...</div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Complaint ID</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Ward</th>
                  <th>Severity</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>AI Conf.</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map(c => (
                  <tr key={c.id} style={{ cursor: 'pointer' }} onClick={() => router.push(`/admin/complaints/${c.id}`)}>
                    <td>
                      <Link href={`/admin/complaints/${c.id}`} style={{ fontWeight: '700', color: 'var(--primary)', textDecoration: 'none', fontSize: '13px' }} onClick={e => e.stopPropagation()}>
                        #{c.complaint_number}
                      </Link>
                      {c.cluster_id && (
                        <Link href={`/admin/intelligence?cluster=${c.cluster_id}`} style={{ textDecoration: 'none' }} onClick={e => e.stopPropagation()}>
                          <span className="badge badge-insight" style={{ marginLeft: '4px', fontSize: '10px', cursor: 'pointer' }}>Clustered</span>
                        </Link>
                      )}
                    </td>
                    <td style={{ maxWidth: '220px' }}>
                      <div style={{ fontSize: '13px', color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {c.description}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{c.subcategory}</div>
                    </td>
                    <td><span style={{ fontSize: '13px', fontWeight: '500' }}>{c.category}</span></td>
                    <td><span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Ward {c.ward_id}</span></td>
                    <td><SeverityBadge severity={c.severity} /></td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ width: '32px', height: '6px', background: 'var(--bg)', border: '1px solid var(--border-light)', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ width: `${c.priority_score}%`, height: '100%', background: c.priority_score >= 76 ? 'var(--critical)' : c.priority_score >= 56 ? 'var(--warning)' : c.priority_score >= 31 ? 'var(--primary)' : 'var(--success)', borderRadius: '3px' }} />
                        </div>
                        <span style={{ fontSize: '12px', fontWeight: '700' }}>{c.priority_score}</span>
                      </div>
                    </td>
                    <td><StatusBadge status={c.status} /></td>
                    <td>
                      <span style={{ fontSize: '12px', fontWeight: '600', color: c.ai_confidence >= 0.85 ? 'var(--success)' : 'var(--warning)' }}>
                        {Math.round(c.ai_confidence * 100)}%
                      </span>
                    </td>
                    <td style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      {new Date(c.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </td>
                    <td>
                      <Link href={`/admin/complaints/${c.id}`} onClick={e => e.stopPropagation()} className="btn btn-ghost btn-sm" style={{ fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>View <ArrowRight size={12} className="lucide-icon" /></Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Pagination */}
          <div style={{ padding: '14px 16px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Showing {Math.min(20, complaints.length)} of {total.toLocaleString()} complaints
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn btn-secondary btn-sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><ArrowLeft size={14} className="lucide-icon" /> Prev</button>
              <span style={{ padding: '5px 12px', background: 'var(--primary)', color: '#fff', borderRadius: '6px', fontSize: '13px', fontWeight: '700' }}>{page}</span>
              <button className="btn btn-secondary btn-sm" onClick={() => setPage(p => p + 1)} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>Next <ArrowRight size={14} className="lucide-icon" /></button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
