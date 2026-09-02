'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { Map, ClipboardList, BarChart3, ShieldAlert, Diamond, CheckCircle2, Clock, X, BrainCircuit, Play } from 'lucide-react';

const CLUSTERS = [
  { id: 1, title: 'Road Damage — Ward 14 (Nagar Road)', category: 'Road Infrastructure', ward_name: 'Nagar Road', complaint_count: 42, severity: 'critical', growth_rate: 64, risk_score: 91, status: 'active', root_cause_hypothesis: 'Sustained heavy traffic combined with poor sub-base condition causing progressive road failure. Possible drainage saturation weakening the road base.', recommended_action: 'Schedule road inspection within 24 hours. Emergency patching for the top 5 pothole locations.', evidence_factors: ['42 related complaints', '+64% growth this week', '2 schools within 500m', 'Unresolved for 4 days', 'Historical recurrence detected'], trend: [2, 4, 7, 11, 18, 28, 42] },
  { id: 2, title: 'Garbage Overflow — Ward 8 (Baner)', category: 'Garbage & Sanitation', ward_name: 'Baner', complaint_count: 28, severity: 'high', growth_rate: 35, risk_score: 72, status: 'active', root_cause_hypothesis: 'Inadequate garbage collection frequency in rapidly urbanizing area. Collection route not updated for new residential blocks.', recommended_action: 'Double collection frequency in Ward 8 immediately. Review and update collection routes.', evidence_factors: ['28 related complaints', '+35% growth this week', '1 school within 300m', 'Unresolved for 6 days'], trend: [5, 8, 11, 15, 19, 24, 28] },
  { id: 3, title: 'Streetlight Failure — Ward 3 (Hadapsar)', category: 'Streetlights', ward_name: 'Hadapsar', complaint_count: 18, severity: 'high', growth_rate: 22, risk_score: 67, status: 'active', root_cause_hypothesis: 'Aging electrical infrastructure causing cascade failures in Hadapsar grid sector.', recommended_action: 'Electrical team inspection of main supply line for Hadapsar sector within 48 hours.', evidence_factors: ['18 related complaints', '+22% growth', 'Night safety risk', '3 consecutive days'], trend: [3, 5, 8, 11, 14, 16, 18] },
  { id: 4, title: 'Pothole Cluster — Ward 2 (Kothrud)', category: 'Road Infrastructure', ward_name: 'Kothrud', complaint_count: 19, severity: 'high', growth_rate: 28, risk_score: 63, status: 'active', root_cause_hypothesis: 'Drainage failure causing subgrade saturation.', recommended_action: 'Repair potholes and investigate drainage in Kothrud sector.', evidence_factors: ['19 complaints', '+28% growth', 'Near college area'], trend: [2, 4, 7, 10, 14, 17, 19] },
  { id: 5, title: 'Water Leakage — Ward 7 (Aundh)', category: 'Water Supply', ward_name: 'Aundh', complaint_count: 12, severity: 'medium', growth_rate: 15, risk_score: 48, status: 'monitoring', root_cause_hypothesis: 'Possible pipe joint failure in Aundh distribution network. Area saw recent road work that may have disturbed water mains.', recommended_action: 'Water department inspection of main distribution line in Aundh.', evidence_factors: ['12 related complaints', '+15% growth', 'Potential road damage secondary risk'], trend: [2, 3, 5, 7, 9, 11, 12] },
];

const SEVERITY_COLOR: Record<string, string> = { critical: '#B95C5C', high: '#C58A32', medium: '#315A7D', low: '#4F8A68' };

export default function IntelligencePage() {
  const [selected, setSelected] = useState(CLUSTERS[0]);
  const [activeTab, setActiveTab] = useState<'overview' | 'risk' | 'recommendations'>('overview');

  const trendData = selected.trend.map((v, i) => ({ day: `Day ${i + 1}`, count: v }));

  const riskFactors = [
    { subject: 'Velocity', A: Math.min(100, selected.growth_rate * 1.5), fullMark: 100 },
    { subject: 'Severity', A: { critical: 90, high: 70, medium: 45, low: 20 }[selected.severity] || 50, fullMark: 100 },
    { subject: 'Duration', A: 65, fullMark: 100 },
    { subject: 'Proximity', A: selected.severity === 'critical' ? 80 : 50, fullMark: 100 },
    { subject: 'Historical', A: selected.risk_score > 70 ? 75 : 40, fullMark: 100 },
    { subject: 'Volume', A: Math.min(100, selected.complaint_count * 2), fullMark: 100 },
  ];

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">AI Intelligence Engine</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Issue clusters, escalation risk, and recommendations</div>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link href="/admin/map" className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Map size={14} className="lucide-icon" /> Open Map</Link>
        </div>
      </div>

      <div className="page-content">
        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '20px', alignItems: 'start' }}>
          {/* Cluster List */}
          <div>
            <div style={{ fontWeight: '700', fontSize: '13px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '10px' }}>
              Active Clusters ({CLUSTERS.length})
            </div>
            {CLUSTERS.map(c => (
              <div key={c.id}
                onClick={() => setSelected(c)}
                style={{
                  padding: '14px', borderRadius: '10px', marginBottom: '8px',
                  borderTop: `1.5px solid ${selected.id === c.id ? SEVERITY_COLOR[c.severity] : 'var(--border-light)'}`,
                  borderRight: `1.5px solid ${selected.id === c.id ? SEVERITY_COLOR[c.severity] : 'var(--border-light)'}`,
                  borderBottom: `1.5px solid ${selected.id === c.id ? SEVERITY_COLOR[c.severity] : 'var(--border-light)'}`,
                  borderLeft: `4px solid ${SEVERITY_COLOR[c.severity]}`,
                  background: selected.id === c.id ? 'var(--surface)' : 'var(--bg)',
                  cursor: 'pointer', transition: 'all 0.12s ease',
                  boxShadow: selected.id === c.id ? 'var(--shadow-sm)' : 'none',
                }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span className={`badge badge-${c.severity}`} style={{ fontSize: '10px' }}>{c.severity}</span>
                  <span style={{ fontSize: '12px', fontWeight: '800', color: SEVERITY_COLOR[c.severity] }}>Risk: {c.risk_score}%</span>
                </div>
                <div style={{ fontWeight: '700', fontSize: '13px', color: 'var(--text-main)', marginBottom: '4px' }}>{c.ward_name}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)'}}>{c.category}</div>
                <div style={{ display: 'flex', gap: '10px', fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', alignItems: 'center' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><ClipboardList size={12} className="lucide-icon" /> {c.complaint_count}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><BarChart3 size={12} className="lucide-icon" /> +{c.growth_rate}%</span>
                  <span style={{ marginLeft: 'auto', fontWeight: '600', color: c.status === 'active' ? 'var(--critical)' : 'var(--warning)', display: 'flex', alignItems: 'center', gap: '4px' }}><span className={c.status === 'active' ? "animate-pulse" : ""} style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor' }} /> {c.status}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Detail Panel */}
          <div>
            {/* Header */}
            <div className={`civic-insight-card ${selected.severity}`} style={{ marginBottom: '16px', padding: '20px 24px' }}>
              <div style={{ paddingLeft: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <div>
                    <div className="insight-label" style={{ color: SEVERITY_COLOR[selected.severity], display: 'flex', alignItems: 'center', gap: '4px' }}><Diamond size={10} fill="currentColor" className="lucide-icon animate-pulse" /> CIVIC INSIGHT — ACTIVE CLUSTER #{selected.id}</div>
                    <div style={{ fontWeight: '800', fontSize: '18px', color: 'var(--text-main)' }}>{selected.title}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '36px', fontWeight: '900', color: SEVERITY_COLOR[selected.severity], letterSpacing: '-0.03em', lineHeight: '1' }}>{selected.risk_score}%</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Escalation Risk</div>
                  </div>
                </div>
                <div className="risk-bar-container" style={{ height: '10px', marginBottom: '12px' }}>
                  <div className={`risk-bar ${selected.severity}`} style={{ width: `${selected.risk_score}%` }} />
                </div>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  {selected.evidence_factors.map(f => (
                    <span key={f} style={{ fontSize: '12px', color: 'var(--success)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}><CheckCircle2 size={12} className="lucide-icon" /> {f}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="tabs">
              {(['overview', 'risk', 'recommendations'] as const).map(tab => (
                <div key={tab} className={`tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </div>
              ))}
            </div>

            {activeTab === 'overview' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="card">
                  <div style={{ fontWeight: '700', fontSize: '14px', marginBottom: '14px' }}>Complaint Trend</div>
                  <ResponsiveContainer width="100%" height={160}>
                    <BarChart data={trendData}>
                      <XAxis dataKey="day" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: '8px', fontSize: '12px' }} />
                      <Bar dataKey="count" fill={SEVERITY_COLOR[selected.severity]} radius={[3, 3, 0, 0]} name="Complaints" />
                    </BarChart>
                  </ResponsiveContainer>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px', textAlign: 'center' }}>
                    Growth: <strong style={{ color: SEVERITY_COLOR[selected.severity] }}>+{selected.growth_rate}% this week</strong>
                  </div>
                </div>

                <div className="card">
                  <div style={{ fontWeight: '700', fontSize: '14px', marginBottom: '10px' }}>Risk Factors</div>
                  <ResponsiveContainer width="100%" height={160}>
                    <RadarChart data={riskFactors}>
                      <PolarGrid stroke="var(--border-light)" />
                      <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
                      <Radar name="Risk" dataKey="A" stroke={SEVERITY_COLOR[selected.severity]} fill={SEVERITY_COLOR[selected.severity]} fillOpacity={0.25} strokeWidth={2} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                <div className="card" style={{ gridColumn: '1 / -1' }}>
                  <div style={{ fontWeight: '700', fontSize: '14px', marginBottom: '10px' }}>Root Cause Hypothesis</div>
                  <div style={{ background: 'var(--insight-light)', border: '1px solid var(--insight)', borderRadius: '8px', padding: '12px 14px', fontSize: '14px', color: 'var(--text-main)', lineHeight: '1.6' }}>
                    {selected.root_cause_hypothesis}
                  </div>
                  <div style={{ marginTop: '10px', fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <ShieldAlert size={12} className="lucide-icon text-warning" /> AI-generated hypothesis. Must be reviewed by authorized officer before action.
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'risk' && (
              <div className="card">
                <div style={{ fontWeight: '700', fontSize: '14px', marginBottom: '16px' }}>Escalation Risk Analysis</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                  {riskFactors.map(rf => (
                    <div key={rf.subject} style={{ padding: '12px', background: 'var(--bg)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <span style={{ fontSize: '13px', fontWeight: '600' }}>{rf.subject}</span>
                        <span style={{ fontSize: '14px', fontWeight: '800', color: rf.A >= 70 ? 'var(--critical)' : rf.A >= 50 ? 'var(--warning)' : 'var(--text-secondary)' }}>{rf.A}</span>
                      </div>
                      <div className="risk-bar-container">
                        <div style={{ height: '100%', width: `${rf.A}%`, background: rf.A >= 70 ? 'var(--critical)' : rf.A >= 50 ? 'var(--warning)' : 'var(--primary)', borderRadius: '100px', transition: 'width 1s ease' }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ padding: '14px', background: 'var(--critical-light)', border: '1px solid var(--critical)', borderRadius: '8px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <span style={{ display: 'flex', alignItems: 'center', color: 'var(--critical)' }}><ShieldAlert size={24} className="lucide-icon animate-pulse" /></span>
                  <div>
                    <div style={{ fontWeight: '700', color: 'var(--critical)', marginBottom: '2px' }}>Escalation Probability: {selected.risk_score}%</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-main)' }}>Based on {selected.evidence_factors.length} verified risk indicators. Human review required.</div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'recommendations' && (
              <div className="card">
                <div className="insight-label" style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}><Diamond size={10} fill="currentColor" className="lucide-icon animate-pulse" /> AI RECOMMENDATION</div>
                <div style={{ fontWeight: '700', fontSize: '16px', marginBottom: '12px', color: 'var(--text-main)' }}>Recommended Action</div>
                <div style={{ fontSize: '15px', lineHeight: '1.6', padding: '14px', background: 'var(--bg)', borderRadius: '8px', border: '1.5px solid var(--border-light)', marginBottom: '16px' }}>
                  {selected.recommended_action}
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontWeight: '700', fontSize: '13px', marginBottom: '10px' }}>Supporting Evidence</div>
                  {selected.evidence_factors.map(f => (
                    <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                      <CheckCircle2 size={14} className="lucide-icon text-success" />
                      <span style={{ fontSize: '14px', color: 'var(--text-main)' }}>{f}</span>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><CheckCircle2 size={14} className="lucide-icon" /> Accept Recommendation</button>
                  <button className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={14} className="lucide-icon" /> Defer for Review</button>
                  <button className="btn btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><X size={14} className="lucide-icon" /> Dismiss</button>
                </div>
                <div style={{ marginTop: '14px', fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                  AI recommends. Authorized humans decide. All accepted recommendations create assignments.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
