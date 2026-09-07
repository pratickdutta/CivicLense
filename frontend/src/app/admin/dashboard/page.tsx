'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ClipboardList, AlertCircle, CheckCircle2, Clock, Map, BarChart3, Building2, Diamond, ShieldAlert } from 'lucide-react';

const API = 'http://localhost:8000';

// Mock data for demo when API is unavailable
const MOCK_OVERVIEW = {
  total_complaints: 50000, critical_complaints: 143, pending_complaints: 8420,
  resolved_complaints: 41580, this_week_new: 1847, sla_breaches: 21,
  resolution_rate: 87.0, avg_resolution_hours: 34.2, active_clusters: 5,
  high_risk_hotspots: 3, overloaded_departments: 3,
};

const MOCK_CLUSTERS = [
  { id: 1, title: 'Road Damage — Ward 14', category: 'Road Infrastructure', ward_name: 'Nagar Road', complaint_count: 42, severity: 'critical', growth_rate: 64, risk_score: 91, recommended_action: 'Schedule road inspection within 24 hours.', evidence_factors: ['42 related complaints', '+64% growth this week', '2 schools within 500m', 'Unresolved for 4 days', 'Historical recurrence'] },
  { id: 2, title: 'Garbage Overflow — Ward 8', category: 'Garbage & Sanitation', ward_name: 'Baner', complaint_count: 28, severity: 'high', growth_rate: 35, risk_score: 72, recommended_action: 'Double collection frequency in Ward 8.', evidence_factors: ['28 related complaints', '+35% growth', '1 school within 300m'] },
  { id: 3, title: 'Streetlight Failure — Ward 3', category: 'Streetlights', ward_name: 'Hadapsar', complaint_count: 18, severity: 'high', growth_rate: 22, risk_score: 67, recommended_action: 'Electrical team inspection of main supply line.', evidence_factors: ['18 complaints', '+22% growth', 'Night safety risk'] },
  { id: 4, title: 'Pothole Cluster — Ward 2', category: 'Road Infrastructure', ward_name: 'Kothrud', complaint_count: 19, severity: 'high', growth_rate: 28, risk_score: 63, recommended_action: 'Repair potholes and investigate drainage.', evidence_factors: ['19 complaints', '+28% growth', 'Near college'] },
  { id: 5, title: 'Water Leakage — Ward 7', category: 'Water Supply', ward_name: 'Aundh', complaint_count: 12, severity: 'medium', growth_rate: 15, risk_score: 48, recommended_action: 'Water department inspection of distribution line.', evidence_factors: ['12 complaints', '+15% growth'] },
];

const MOCK_TREND = Array.from({ length: 14 }, (_, i) => ({
  date: `Aug ${7 + i}`, total: 80 + Math.floor(Math.random() * 80),
  resolved: 50 + Math.floor(Math.random() * 60), critical: 3 + Math.floor(Math.random() * 15),
}));

const MOCK_CATEGORIES = [
  { category: 'Road Infrastructure', count: 14820 },
  { category: 'Garbage & Sanitation', count: 11340 },
  { category: 'Water Supply', count: 8920 },
  { category: 'Drainage', count: 5600 },
  { category: 'Streetlights', count: 4800 },
  { category: 'Other', count: 4520 },
];

const SEVERITY_COLORS: Record<string, string> = {
  critical: '#B95C5C', high: '#C58A32', medium: '#315A7D', low: '#4F8A68'
};

const CAT_COLORS = ['#315A7D', '#5B8C85', '#6875A8', '#C58A32', '#4F8A68', '#AFCBE3'];

function SeverityBadge({ severity }: { severity: string }) {
  return <span className={`badge badge-${severity}`}>{severity}</span>;
}

function KPICard({ title, value, subtitle, accent, icon, href }: { title: string; value: string | number; subtitle?: string; accent?: string; icon?: React.ReactNode; href?: string }) {
  const content = (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
        <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-muted)' }}>{title}</div>
        {icon && <span className="lucide-icon text-muted" style={{ display: 'flex' }}>{icon}</span>}
      </div>
      <div style={{ fontSize: '34px', fontWeight: '900', letterSpacing: '-0.03em', color: 'var(--text-main)', lineHeight: '1' }}>{value}</div>
      {subtitle && <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px', fontWeight: '500' }}>{subtitle}</div>}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={`kpi-card ${accent || ''}`} style={{ animationDelay: '0.1s', textDecoration: 'none', display: 'block' }}>
        {content}
      </Link>
    );
  }
  return (
    <div className={`kpi-card ${accent || ''}`} style={{ animationDelay: '0.1s' }}>
      {content}
    </div>
  );
}

function CivicInsightCard({ cluster, index }: { cluster: typeof MOCK_CLUSTERS[0]; index: number }) {
  const urgencyClass = cluster.severity === 'critical' ? 'critical' : cluster.severity === 'high' ? 'high' : 'medium';
  return (
    <Link href={`/admin/intelligence?cluster=${cluster.id}`} className={`civic-insight-card ${urgencyClass}`} style={{ marginBottom: '12px', animationDelay: `${index * 0.08}s`, textDecoration: 'none', display: 'block' }}>
      <div style={{ paddingLeft: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
          <div className="insight-label" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: cluster.severity === 'critical' ? 'var(--critical)' : cluster.severity === 'high' ? 'var(--warning)' : 'var(--insight)' }}>
            <Diamond size={10} fill="currentColor" className="lucide-icon animate-pulse" /> CIVIC INSIGHT
          </div>
          <span className={`badge badge-${cluster.severity}`}>{cluster.severity}</span>
        </div>
        <div style={{ fontWeight: '700', fontSize: '14px', marginBottom: '6px', color: 'var(--text-main)' }}>{cluster.title}</div>
        <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '10px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><ClipboardList size={14} className="lucide-icon" /> {cluster.complaint_count} reports</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><BarChart3 size={14} className="lucide-icon" /> +{cluster.growth_rate}% this week</span>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ fontSize: '11px', fontWeight: '700', color: SEVERITY_COLORS[cluster.severity] || 'var(--insight)', letterSpacing: '0.06em' }}>ESCALATION RISK</span>
            <span style={{ fontSize: '13px', fontWeight: '800', color: SEVERITY_COLORS[cluster.severity] || 'var(--insight)' }}>{cluster.risk_score}%</span>
          </div>
          <div className="risk-bar-container">
            <div className={`risk-bar ${urgencyClass}`} style={{ width: `${cluster.risk_score}%` }} />
          </div>
        </div>
        <div style={{ background: 'var(--bg)', borderRadius: '6px', padding: '8px 10px', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '10px' }}>
          <strong style={{ color: 'var(--text-main)' }}>Recommended: </strong>{cluster.recommended_action}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '10px' }}>
          {cluster.evidence_factors.map((f: string) => (
            <span key={f} style={{ fontSize: '11px', color: 'var(--success)', fontWeight: '600' }}>✓ {f}</span>
          ))}
        </div>
        <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
          VIEW DETAILS →
        </div>
      </div>
    </Link>
  );
}

export default function AdminDashboard() {
  const [overview, setOverview] = useState(MOCK_OVERVIEW);
  const [clusters, setClusters] = useState(MOCK_CLUSTERS);
  const [trends, setTrends] = useState(MOCK_TREND);
  const [categories, setCategories] = useState(MOCK_CATEGORIES);
  const [userRole, setUserRole] = useState<string>('admin');

  useEffect(() => {
    try {
      const u = localStorage.getItem('user');
      if (u) {
        const parsed = JSON.parse(u);
        setUserRole(parsed.role);
        
        if (parsed.role === 'supervisor') {
          // Filter to Ward 14 only
          setClusters(MOCK_CLUSTERS.filter(c => c.ward_name === 'Nagar Road'));
          setOverview({
            ...MOCK_OVERVIEW, total_complaints: 4120, pending_complaints: 842, resolved_complaints: 3278,
            this_week_new: 154, sla_breaches: 2, active_clusters: 1, high_risk_hotspots: 1
          });
        } else if (parsed.role === 'officer') {
          // Filter to Roads and Streetlights only
          setClusters(MOCK_CLUSTERS.filter(c => c.category === 'Road Infrastructure' || c.category === 'Streetlights'));
          setOverview({
            ...MOCK_OVERVIEW, total_complaints: 19620, pending_complaints: 3120, resolved_complaints: 16500,
            this_week_new: 847, sla_breaches: 12, active_clusters: 3, high_risk_hotspots: 2
          });
        }
      }
    } catch {}
  }, []);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ov, cl, tr, cat] = await Promise.all([
          fetch(`${API}/api/analytics/overview`).then(r => r.json()).catch(() => MOCK_OVERVIEW),
          fetch(`${API}/api/ai/recommendations`).then(r => r.json()).catch(() => MOCK_CLUSTERS),
          fetch(`${API}/api/analytics/trends?days=14`).then(r => r.json()).catch(() => MOCK_TREND),
          fetch(`${API}/api/analytics/category-distribution`).then(r => r.json()).catch(() => MOCK_CATEGORIES),
        ]);
        setOverview(ov);
        setClusters(Array.isArray(cl) ? cl : MOCK_CLUSTERS);
        setTrends(Array.isArray(tr) ? tr : MOCK_TREND);
        setCategories(Array.isArray(cat) ? cat : MOCK_CATEGORIES);
      } catch {
        // Use mock data
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">
            {userRole === 'supervisor' ? 'Ward 14 (Nagar Road) Overview' : userRole === 'officer' ? 'Departmental Overview' : 'City-wide Overview'}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
            {userRole === 'supervisor' ? 'Local ward performance and task management.' : userRole === 'officer' ? 'Departmental performance and SLA tracking.' : 'Global operational metrics, AI alerts, and SLA performance across all wards.'}
            {' · '}
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', marginTop: '8px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)', display: 'inline-block' }} className="animate-pulse" />
            AI Engine Active
          </div>
          <Link href="/admin/complaints" className="btn btn-primary btn-sm">+ New Assignment</Link>
        </div>
      </div>

      <div className="page-content" style={{ paddingBottom: '40px' }}>
        {/* Intelligence Alert Banner */}
        {clusters.filter(c => c.risk_score >= 80).length > 0 && (
          <div style={{
            background: '#FEF2F2', border: '2px solid var(--critical)',
            borderRadius: '12px', padding: '16px', marginBottom: '20px',
            display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap',
            boxShadow: '4px 4px 0px rgba(0,0,0,1)'
          }}>
            <span style={{ display: 'flex', alignItems: 'center', color: 'var(--critical)' }}><ShieldAlert size={24} className="lucide-icon animate-pulse" /></span>
            <div>
              <strong style={{ color: 'var(--critical)', fontSize: '13px' }}>CRITICAL ALERT</strong>
              <span style={{ color: 'var(--text-main)', fontSize: '13px', marginLeft: '8px' }}>
                {clusters.filter(c => c.risk_score >= 80).length} high-risk civic cluster{clusters.filter(c => c.risk_score >= 80).length > 1 ? 's' : ''} require immediate attention.
              </span>
            </div>
            <Link href="/admin/intelligence" className="btn btn-danger btn-sm" style={{ marginLeft: 'auto' }}>
              View Intelligence →
            </Link>
          </div>
        )}

        {/* KPI Cards */}
        <div className="grid-kpi" style={{ marginBottom: '20px' }}>
          <KPICard title="Total Complaints" value={overview.total_complaints.toLocaleString()} subtitle={`↑ ${overview.this_week_new?.toLocaleString()} this week`} icon={<ClipboardList size={20} />} accent="primary" href="/admin/complaints" />
          <KPICard title="Critical" value={overview.critical_complaints} subtitle="Require immediate action" icon={<AlertCircle size={20} />} accent="critical" href="/admin/complaints?severity=critical" />
          <KPICard title="Resolution Rate" value={`${overview.resolution_rate}%`} subtitle={`${overview.resolved_complaints?.toLocaleString()} resolved`} icon={<CheckCircle2 size={20} />} accent="success" href="/admin/analytics" />
          <KPICard title="SLA Breaches" value={overview.sla_breaches} subtitle="Active violations" icon={<Clock size={20} />} accent="warning" href="/admin/complaints?status=sla_breached" />
        </div>

        <div className="hero-grid-4" style={{ display: 'grid', gap: '16px', marginBottom: '24px' }}>
          <Link href="/admin/intelligence" className="card card-sm" style={{ textAlign: 'center', padding: '16px', textDecoration: 'none', display: 'block' }}>
            <div style={{ fontSize: '26px', fontWeight: '800', color: 'var(--insight)' }}>{overview.active_clusters}</div>
            <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '2px' }}>Active Clusters</div>
          </Link>
          <Link href="/admin/map" className="card card-sm" style={{ textAlign: 'center', padding: '16px', textDecoration: 'none', display: 'block' }}>
            <div style={{ fontSize: '26px', fontWeight: '800', color: 'var(--critical)' }}>{overview.high_risk_hotspots}</div>
            <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '2px' }}>High-Risk Hotspots</div>
          </Link>
          <Link href="/admin/departments" className="card card-sm" style={{ textAlign: 'center', padding: '16px', textDecoration: 'none', display: 'block' }}>
            <div style={{ fontSize: '26px', fontWeight: '800', color: 'var(--warning)' }}>{overview.overloaded_departments}</div>
            <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '2px' }}>Overloaded Depts</div>
          </Link>
          <Link href="/admin/analytics" className="card card-sm" style={{ textAlign: 'center', padding: '16px', textDecoration: 'none', display: 'block' }}>
            <div style={{ fontSize: '26px', fontWeight: '800', color: 'var(--text-main)' }}>{overview.avg_resolution_hours}h</div>
            <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '2px' }}>Avg Resolution</div>
          </Link>
        </div>

        {/* Main Grid */}
        <div className="grid-main" style={{ alignItems: 'start' }}>
          {/* Left: Charts */}
          <div>
            {/* Trend Chart */}
            <div className="card" style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '15px' }}>Complaint Trends</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Last 14 days</div>
                </div>
                <Link href="/admin/analytics" style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: '600', textDecoration: 'none' }}>View Analytics →</Link>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={trends}>
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: '8px', fontSize: '12px', boxShadow: 'var(--shadow-sm)' }} />
                  <Area type="monotone" dataKey="total" stroke="#315A7D" fill="#AFCBE3" fillOpacity={0.3} strokeWidth={2} name="Total" />
                  <Area type="monotone" dataKey="resolved" stroke="#4F8A68" fill="#4F8A68" fillOpacity={0.2} strokeWidth={2} name="Resolved" />
                  <Area type="monotone" dataKey="critical" stroke="#B95C5C" fill="#B95C5C" fillOpacity={0.2} strokeWidth={2} name="Critical" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Category distribution */}
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ fontWeight: '700', fontSize: '15px' }}>Issue Distribution</div>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>By category</span>
              </div>
              <div className="hero-grid-3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'center' }}>
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie data={categories} cx="50%" cy="50%" innerRadius={45} outerRadius={75} dataKey="count" paddingAngle={2}>
                      {categories.map((_, i) => <Cell key={i} fill={CAT_COLORS[i % CAT_COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: '8px', fontSize: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
                <div>
                  {categories.slice(0, 5).map((cat, i) => (
                    <div key={cat.category} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: CAT_COLORS[i], flexShrink: 0 }} />
                      <div style={{ fontSize: '12px', color: 'var(--text-main)', flex: 1, fontWeight: '500' }}>{cat.category}</div>
                      <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)' }}>{cat.count.toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Civic Insights Panel */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div>
                <div style={{ fontWeight: '700', fontSize: '15px' }}>AI Civic Insights</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{clusters.length} active recommendations</div>
              </div>
              <Link href="/admin/intelligence" style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: '600', textDecoration: 'none' }}>
                All Insights →
              </Link>
            </div>
            {clusters.map((c, i) => (
              <CivicInsightCard key={c.id} cluster={c} index={i} />
            ))}

            {/* Quick Actions */}
            <div className="card" style={{ padding: '16px', marginTop: '4px' }}>
              <div style={{ fontWeight: '700', fontSize: '13px', marginBottom: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Quick Actions</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Link href="/admin/map" className="btn btn-secondary btn-sm" style={{ justifyContent: 'flex-start' }}><Map size={14} className="lucide-icon" /> Open Civic Map</Link>
                <Link href="/admin/complaints" className="btn btn-secondary btn-sm" style={{ justifyContent: 'flex-start' }}><ClipboardList size={14} className="lucide-icon" /> Review Complaints</Link>
                <Link href="/admin/analytics" className="btn btn-secondary btn-sm" style={{ justifyContent: 'flex-start' }}><BarChart3 size={14} className="lucide-icon" /> View Analytics</Link>
                <Link href="/admin/departments" className="btn btn-secondary btn-sm" style={{ justifyContent: 'flex-start' }}><Building2 size={14} className="lucide-icon" /> Department Status</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
