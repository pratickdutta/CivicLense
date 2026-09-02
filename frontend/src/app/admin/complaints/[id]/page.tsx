'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ClipboardList, TrendingUp, School, Clock, RotateCcw, Diamond, CheckCircle2, ArrowRight } from 'lucide-react';

const API = 'http://localhost:8000';

const MOCK_DETAIL = {
  id: 10001, complaint_number: 'CL10001',
  description: 'Large pothole near City School on Nagar Road. It is causing vehicle damage and is particularly dangerous for school buses and two-wheelers. The pothole has been getting bigger over the last 4 days.',
  category: 'Road Infrastructure', subcategory: 'Pothole',
  severity: 'critical', priority_score: 91, status: 'in_progress',
  ward_id: 14, address: 'Nagar Road near City School, Ward 14, Pune',
  latitude: 18.5536, longitude: 73.9243,
  ai_confidence: 0.94,
  is_duplicate: false,
  cluster: { id: 1, title: 'Road Damage — Ward 14', complaint_count: 42, risk_score: 91, growth_rate: 64 },
  timeline: [
    { time: new Date(Date.now() - 4 * 86400000).toISOString(), action: 'Complaint submitted by citizen (Priya Sharma)', actor: 'Priya Sharma' },
    { time: new Date(Date.now() - 4 * 86400000 + 120000).toISOString(), action: 'AI classified as Road Infrastructure — Pothole (94% confidence)', actor: 'AI Engine' },
    { time: new Date(Date.now() - 3 * 86400000).toISOString(), action: 'Grouped into Issue Cluster: Road Damage Ward 14 (42 complaints)', actor: 'AI Engine' },
    { time: new Date(Date.now() - 2 * 86400000).toISOString(), action: 'Assigned to Roads Department — Officer Rajesh Kumar', actor: 'Admin' },
    { time: new Date(Date.now() - 86400000).toISOString(), action: 'Field worker Vijay Singh accepted task', actor: 'Vijay Singh' },
    { time: new Date(Date.now() - 12 * 3600000).toISOString(), action: 'Work started — field worker on-site', actor: 'Vijay Singh' },
  ],
  created_at: new Date(Date.now() - 4 * 86400000).toISOString(),
  updated_at: new Date(Date.now() - 12 * 3600000).toISOString(),
};

const AI_EXPLANATION = {
  risk_score: 91,
  factors: [
    { label: '42 related complaints', icon: <ClipboardList size={14} className="lucide-icon" />, weight: 25 },
    { label: '+64% weekly growth in complaints', icon: <TrendingUp size={14} className="lucide-icon" />, weight: 20 },
    { label: '2 schools within 500m', icon: <School size={14} className="lucide-icon" />, weight: 15 },
    { label: 'Unresolved for 4 days', icon: <Clock size={14} className="lucide-icon" />, weight: 20 },
    { label: 'Historical recurrence detected', icon: <RotateCcw size={14} className="lucide-icon" />, weight: 11 },
  ]
};

export default function ComplaintDetailPage() {
  const params = useParams();
  const [complaint, setComplaint] = useState(MOCK_DETAIL);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetch(`${API}/api/complaints/${params.id}`)
      .then(r => r.ok ? r.json() : MOCK_DETAIL)
      .then(data => setComplaint(data))
      .catch(() => setComplaint(MOCK_DETAIL));
  }, [params.id]);

  const getSeverityColor = (s: string) => ({ critical: 'var(--critical)', high: 'var(--warning)', medium: 'var(--primary)', low: 'var(--success)' }[s] || 'var(--text-muted)');

  return (
    <>
      <div className="page-header">
        <div>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '2px' }}>
            <Link href="/admin/complaints" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Complaints</Link> / #{complaint.complaint_number}
          </div>
          <div className="page-title">#{complaint.complaint_number}</div>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <select className="input select" style={{ width: '160px', fontSize: '13px' }}
            value={complaint.status}
            onChange={async e => {
              setComplaint({ ...complaint, status: e.target.value });
              await fetch(`${API}/api/complaints/${complaint.id}/status?status=${e.target.value}`, { method: 'PATCH' });
            }}>
            {['submitted', 'classified', 'assigned', 'in_progress', 'resolved', 'closed'].map(s => (
              <option key={s} value={s}>{s.replace('_', ' ')}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="page-content">
        {/* Status Bar */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '24px', flexWrap: 'wrap' }}>
          <span className={`badge badge-${complaint.severity}`}>{complaint.severity}</span>
          <span className={`badge badge-${complaint.status}`}>{complaint.status.replace('_', ' ')}</span>
          <span className="badge badge-default">Ward {complaint.ward_id}</span>
          <span className="badge badge-default">{complaint.category}</span>
          {complaint.cluster && <span className="badge badge-insight">Part of cluster: {complaint.cluster.complaint_count} complaints</span>}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px', alignItems: 'start' }}>
          {/* Main */}
          <div>
            {/* Complaint Details */}
            <div className="card" style={{ marginBottom: '16px' }}>
              <div style={{ fontWeight: '700', fontSize: '15px', marginBottom: '16px' }}>Complaint Details</div>
              <div style={{ fontSize: '15px', color: 'var(--text-main)', lineHeight: '1.6', marginBottom: '16px', padding: '14px', background: 'var(--bg)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                "{complaint.description}"
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {[
                  ['Category', complaint.category], ['Subcategory', complaint.subcategory],
                  ['Location', complaint.address], ['Ward', `Ward ${complaint.ward_id}`],
                  ['Reported', new Date(complaint.created_at).toLocaleString('en-IN')],
                  ['Last Updated', new Date(complaint.updated_at).toLocaleString('en-IN')],
                ].map(([label, value]) => (
                  <div key={label}>
                    <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '3px' }}>{label}</div>
                    <div style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-main)' }}>{value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline */}
            <div className="card">
              <div style={{ fontWeight: '700', fontSize: '15px', marginBottom: '16px' }}>Activity Timeline</div>
              <div className="timeline">
                {complaint.timeline.map((item, i) => (
                  <div key={i} className="timeline-item">
                    <div className={`timeline-dot ${item.actor === 'AI Engine' ? 'warning' : i === complaint.timeline.length - 1 ? 'success' : ''}`} />
                    <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-main)', marginBottom: '2px' }}>{item.action}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      {item.actor} · {new Date(item.time).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Priority Score */}
            <div className="card">
              <div style={{ fontWeight: '700', fontSize: '14px', marginBottom: '14px' }}>Priority Score</div>
              <div style={{ textAlign: 'center', marginBottom: '14px' }}>
                <div style={{ fontSize: '48px', fontWeight: '900', color: getSeverityColor(complaint.severity), letterSpacing: '-0.04em', lineHeight: '1' }}>
                  {complaint.priority_score}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>/ 100 · {complaint.severity.toUpperCase()}</div>
              </div>
              <div className="risk-bar-container" style={{ height: '10px', marginBottom: '8px' }}>
                <div style={{ height: '100%', width: `${complaint.priority_score}%`, background: getSeverityColor(complaint.severity), borderRadius: '100px', transition: 'width 1s ease' }} />
              </div>
            </div>

            {/* AI Analysis */}
            <div className="card">
              <div className="insight-label" style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '4px' }}><Diamond size={10} fill="currentColor" className="lucide-icon animate-pulse" /> AI ANALYSIS</div>
              <div style={{ fontWeight: '700', fontSize: '14px', marginBottom: '4px' }}>WHY IS THIS CRITICAL?</div>
              <div style={{ marginBottom: '14px' }}>
                {AI_EXPLANATION.factors.map(f => (
                  <div key={f.label} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '20px', color: 'var(--text-muted)' }}>{f.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--success)', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}><CheckCircle2 size={12} className="lucide-icon" /> {f.label}</div>
                      <div style={{ height: '4px', background: 'var(--bg)', border: '1px solid var(--border-subtle)', borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${f.weight * 4}%`, background: 'var(--insight)', borderRadius: '2px' }} />
                      </div>
                    </div>
                    <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)' }}>{f.weight}</span>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>AI Confidence</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div className="risk-bar-container" style={{ flex: 1 }}>
                  <div className="risk-bar" style={{ width: `${complaint.ai_confidence * 100}%`, background: 'var(--success)' }} />
                </div>
                <span style={{ fontSize: '14px', fontWeight: '800', color: 'var(--success)' }}>{Math.round(complaint.ai_confidence * 100)}%</span>
              </div>
            </div>

            {/* Cluster Info */}
            {complaint.cluster && (
              <div className="civic-insight-card critical">
                <div style={{ paddingLeft: '10px' }}>
                  <div className="insight-label" style={{ color: 'var(--critical)' }}>ISSUE CLUSTER</div>
                  <div style={{ fontWeight: '700', fontSize: '13px', marginBottom: '8px' }}>{complaint.cluster.title}</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px' }}>
                    <div style={{ textAlign: 'center', background: 'var(--bg)', borderRadius: '6px', padding: '8px' }}>
                      <div style={{ fontSize: '20px', fontWeight: '800', color: 'var(--critical)' }}>{complaint.cluster.complaint_count}</div>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Reports</div>
                    </div>
                    <div style={{ textAlign: 'center', background: 'var(--bg)', borderRadius: '6px', padding: '8px' }}>
                      <div style={{ fontSize: '20px', fontWeight: '800', color: 'var(--critical)' }}>{complaint.cluster.risk_score}%</div>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Risk</div>
                    </div>
                  </div>
                  <Link href={`/admin/intelligence?cluster=${complaint.cluster.id}`} className="btn btn-danger btn-sm" style={{ width: '100%', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    View Cluster Intelligence <ArrowRight size={14} className="lucide-icon" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
