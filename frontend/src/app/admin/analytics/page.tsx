'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import { Download, TrendingUp, Building2, Clock } from 'lucide-react';

const API = 'http://localhost:8000';

const MOCK_TRENDS = Array.from({ length: 30 }, (_, i) => {
  const d = new Date(); d.setDate(d.getDate() - (29 - i));
  return {
    date: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
    total: 80 + Math.floor(Math.random() * 80),
    resolved: 50 + Math.floor(Math.random() * 60),
    critical: 3 + Math.floor(Math.random() * 15),
    road: 25 + Math.floor(Math.random() * 30),
    sanitation: 15 + Math.floor(Math.random() * 25),
    water: 10 + Math.floor(Math.random() * 20),
  };
});

const MOCK_DEPTS = [
  { id: 1, name: 'Roads', total: 14820, resolved: 12100, pending: 2720, sla_compliance: 87, avg_hours: 38, resolution_rate: 81.6 },
  { id: 2, name: 'Sanitation', total: 11340, resolved: 9800, pending: 1540, sla_compliance: 91, avg_hours: 22, resolution_rate: 86.4 },
  { id: 3, name: 'Water Supply', total: 8920, resolved: 7100, pending: 1820, sla_compliance: 79, avg_hours: 45, resolution_rate: 79.6 },
  { id: 4, name: 'Drainage', total: 5600, resolved: 4200, pending: 1400, sla_compliance: 75, avg_hours: 56, resolution_rate: 75.0 },
  { id: 5, name: 'Electrical', total: 4800, resolved: 4100, pending: 700, sla_compliance: 85, avg_hours: 28, resolution_rate: 85.4 },
  { id: 6, name: 'Public Works', total: 3200, resolved: 2600, pending: 600, sla_compliance: 81, avg_hours: 48, resolution_rate: 81.3 },
];

export default function AnalyticsPage() {
  const [trends, setTrends] = useState(MOCK_TRENDS);
  const [depts, setDepts] = useState(MOCK_DEPTS);
  const [tab, setTab] = useState<'trends' | 'departments' | 'sla'>('trends');
  const [range, setRange] = useState('30');

  useEffect(() => {
    Promise.all([
      fetch(`${API}/api/analytics/trends?days=${range}`).then(r => r.json()).catch(() => MOCK_TRENDS),
      fetch(`${API}/api/analytics/departments`).then(r => r.json()).catch(() => MOCK_DEPTS),
    ]).then(([t, d]) => {
      setTrends(Array.isArray(t) ? t : MOCK_TRENDS);
      setDepts(Array.isArray(d) ? d : MOCK_DEPTS);
    });
  }, [range]);

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">Analytics & Reports</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>City-wide civic performance intelligence</div>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <select className="input select" value={range} onChange={e => setRange(e.target.value)} style={{ width: '130px', fontSize: '13px' }}>
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
          <button className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Download size={14} className="lucide-icon" /> Export</button>
        </div>
      </div>

      <div className="page-content">
        <div className="tabs">
          {(['trends', 'departments', 'sla'] as const).map(t => (
            <div key={t} className={`tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {t === 'trends' ? <><TrendingUp size={16} className="lucide-icon" /> Trends</> : t === 'departments' ? <><Building2 size={16} className="lucide-icon" /> Departments</> : <><Clock size={16} className="lucide-icon" /> SLA</>}
            </div>
          ))}
        </div>

        {tab === 'trends' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Summary KPIs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
              {[
                { label: 'Total (Period)', value: trends.reduce((a, t) => a + t.total, 0).toLocaleString(), color: 'var(--primary)', href: '/admin/complaints' },
                { label: 'Resolved', value: trends.reduce((a, t) => a + t.resolved, 0).toLocaleString(), color: 'var(--success)', href: '/admin/complaints?status=resolved' },
                { label: 'Critical', value: trends.reduce((a, t) => a + t.critical, 0).toLocaleString(), color: 'var(--critical)', href: '/admin/complaints?severity=critical' },
                { label: 'Resolution Rate', value: `${Math.round(trends.reduce((a, t) => a + t.resolved, 0) / trends.reduce((a, t) => a + t.total, 0) * 100)}%`, color: 'var(--secondary)', href: '/admin/analytics' },
              ].map(s => (
                <Link href={s.href} key={s.label} className="kpi-card" style={{ textAlign: 'center', padding: '16px', textDecoration: 'none', display: 'block' }}>
                  <div style={{ fontSize: '28px', fontWeight: '900', color: s.color, letterSpacing: '-0.03em' }}>{s.value}</div>
                  <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginTop: '4px' }}>{s.label}</div>
                </Link>
              ))}
            </div>

            <div className="card">
              <div style={{ fontWeight: '700', fontSize: '15px', marginBottom: '16px' }}>Complaint Volume Over Time</div>
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={trends}>
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} interval={Math.ceil(trends.length / 10)} />
                  <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: '8px', fontSize: '12px', boxShadow: 'var(--shadow-sm)' }} />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Area type="monotone" dataKey="total" stroke="#315A7D" fill="#AFCBE3" fillOpacity={0.3} strokeWidth={2} name="Total" />
                  <Area type="monotone" dataKey="resolved" stroke="#4F8A68" fill="#4F8A68" fillOpacity={0.2} strokeWidth={2} name="Resolved" />
                  <Area type="monotone" dataKey="critical" stroke="#B95C5C" fill="#B95C5C" fillOpacity={0.15} strokeWidth={2} name="Critical" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="card">
              <div style={{ fontWeight: '700', fontSize: '15px', marginBottom: '16px' }}>Issue Category Breakdown</div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={trends} stackOffset="expand">
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} interval={Math.ceil(trends.length / 8)} />
                  <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: '8px', fontSize: '12px' }} />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Bar dataKey="road" stackId="a" fill="#315A7D" name="Roads" />
                  <Bar dataKey="sanitation" stackId="a" fill="#5B8C85" name="Sanitation" />
                  <Bar dataKey="water" stackId="a" fill="#6875A8" name="Water" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {tab === 'departments' && (
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Department</th>
                  <th>Total</th>
                  <th>Resolved</th>
                  <th>Pending</th>
                  <th>Resolution Rate</th>
                  <th>SLA Compliance</th>
                  <th>Avg Resolution</th>
                  <th>Performance</th>
                </tr>
              </thead>
              <tbody>
                {depts.map(d => (
                  <tr key={d.id}>
                    <td style={{ fontWeight: '700', fontSize: '14px' }}>{d.name}</td>
                    <td style={{ fontWeight: '600' }}>{d.total.toLocaleString()}</td>
                    <td style={{ color: 'var(--success)', fontWeight: '600' }}>{d.resolved.toLocaleString()}</td>
                    <td style={{ color: 'var(--warning)', fontWeight: '600' }}>{d.pending.toLocaleString()}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '60px', height: '6px', background: 'var(--bg)', border: '1px solid var(--border-light)', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${d.resolution_rate}%`, background: d.resolution_rate >= 85 ? 'var(--success)' : d.resolution_rate >= 75 ? 'var(--warning)' : 'var(--critical)', borderRadius: '3px' }} />
                        </div>
                        <span style={{ fontSize: '13px', fontWeight: '700' }}>{d.resolution_rate}%</span>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: '13px', fontWeight: '700', color: d.sla_compliance >= 85 ? 'var(--success)' : d.sla_compliance >= 75 ? 'var(--warning)' : 'var(--critical)' }}>
                        {d.sla_compliance}%
                      </span>
                    </td>
                    <td style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{d.avg_hours}h</td>
                    <td>
                      <span className={`badge ${d.sla_compliance >= 85 ? 'badge-low' : d.sla_compliance >= 75 ? 'badge-medium' : 'badge-critical'}`}>
                        {d.sla_compliance >= 85 ? 'On Track' : d.sla_compliance >= 75 ? 'At Risk' : 'Critical'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'sla' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {[
              { priority: 'Critical', target: '24h', compliance: 78, avg: '22h', color: 'var(--critical)' },
              { priority: 'High', target: '48h', compliance: 84, avg: '41h', color: 'var(--warning)' },
              { priority: 'Medium', target: '5 days', compliance: 89, avg: '98h', color: 'var(--primary)' },
              { priority: 'Low', target: '10 days', compliance: 93, avg: '210h', color: 'var(--success)' },
            ].map(sla => (
              <Link href={`/admin/complaints?priority=${sla.priority.toLowerCase()}`} key={sla.priority} className="card" style={{ textDecoration: 'none', display: 'block' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '15px', color: 'var(--text-main)' }}>{sla.priority} Priority</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Target: {sla.target}</div>
                  </div>
                  <div style={{ fontSize: '32px', fontWeight: '900', color: sla.color, letterSpacing: '-0.03em' }}>{sla.compliance}%</div>
                </div>
                <div className="risk-bar-container" style={{ height: '10px', marginBottom: '8px' }}>
                  <div style={{ height: '100%', width: `${sla.compliance}%`, background: sla.color, borderRadius: '100px', transition: 'width 1s ease' }} />
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Average actual resolution: <strong>{sla.avg}</strong>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
