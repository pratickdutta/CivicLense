'use client';
import Link from 'next/link';

import { Map, Trash2, Droplets, Waves, Zap, TreePine, TrafficCone, HardHat } from 'lucide-react';

const DEPTS = [
  { id: 1, name: 'Roads Department', code: 'ROADS', head: 'Rajesh Kumar', active: 2720, workers: 45, sla: 87, icon: <Map size={24} className="lucide-icon text-primary" />, overloaded: true },
  { id: 2, name: 'Sanitation Department', code: 'SANIT', head: 'Meena Patel', active: 1540, workers: 62, sla: 91, icon: <Trash2 size={24} className="lucide-icon text-secondary" />, overloaded: false },
  { id: 3, name: 'Water Supply Department', code: 'WATER', head: 'Arun Sharma', active: 1820, workers: 38, sla: 79, icon: <Droplets size={24} className="lucide-icon text-primary" />, overloaded: true },
  { id: 4, name: 'Drainage Department', code: 'DRAIN', head: 'Sanjay Gupta', active: 1400, workers: 29, sla: 75, icon: <Waves size={24} className="lucide-icon text-primary" />, overloaded: true },
  { id: 5, name: 'Electrical Department', code: 'ELECT', head: 'Priya Nair', active: 700, workers: 22, sla: 85, icon: <Zap size={24} className="lucide-icon text-warning" />, overloaded: false },
  { id: 6, name: 'Parks & Recreation', code: 'PARKS', head: 'Amit Singh', active: 340, workers: 18, sla: 92, icon: <TreePine size={24} className="lucide-icon text-success" />, overloaded: false },
  { id: 7, name: 'Traffic Department', code: 'TRAFF', head: 'Vikram Das', active: 280, workers: 15, sla: 88, icon: <TrafficCone size={24} className="lucide-icon text-warning" />, overloaded: false },
  { id: 8, name: 'Public Works', code: 'PWD', head: 'Rekha Joshi', active: 600, workers: 35, sla: 81, icon: <HardHat size={24} className="lucide-icon text-insight" />, overloaded: false },
];

export default function DepartmentsPage() {
  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">Departments</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Department workload and performance overview</div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--critical)', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span className="animate-pulse" style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--critical)', display: 'inline-block' }} />
            3 Overloaded
          </span>
        </div>
      </div>

      <div className="page-content">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
          {DEPTS.map(d => (
            <div key={d.id} className="card" style={{ borderLeft: d.overloaded ? '4px solid var(--critical)' : '4px solid var(--border-light)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>{d.icon}</div>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '15px', color: 'var(--text-main)' }}>{d.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Head: {d.head}</div>
                  </div>
                </div>
                {d.overloaded && <span className="badge badge-critical" style={{ fontSize: '10px' }}>Overloaded</span>}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '14px' }}>
                {[
                  { label: 'Active', value: d.active.toLocaleString(), color: 'var(--warning)' },
                  { label: 'Workers', value: d.workers, color: 'var(--primary)' },
                  { label: 'SLA', value: `${d.sla}%`, color: d.sla >= 85 ? 'var(--success)' : d.sla >= 75 ? 'var(--warning)' : 'var(--critical)' },
                ].map(s => (
                  <div key={s.label} style={{ background: 'var(--bg)', borderRadius: '8px', padding: '10px', textAlign: 'center' }}>
                    <div style={{ fontSize: '18px', fontWeight: '900', color: s.color, letterSpacing: '-0.02em' }}>{s.value}</div>
                    <div style={{ fontSize: '10px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '2px' }}>{s.label}</div>
                  </div>
                ))}
              </div>

              <div style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  <span>SLA Compliance</span>
                  <span style={{ color: d.sla >= 85 ? 'var(--success)' : d.sla >= 75 ? 'var(--warning)' : 'var(--critical)' }}>{d.sla}%</span>
                </div>
                <div className="risk-bar-container">
                  <div style={{ height: '100%', width: `${d.sla}%`, background: d.sla >= 85 ? 'var(--success)' : d.sla >= 75 ? 'var(--warning)' : 'var(--critical)', borderRadius: '100px', transition: 'width 1s ease' }} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <Link href={`/admin/complaints?dept=${d.id}`} className="btn btn-secondary btn-sm">View Complaints</Link>
                <Link href="/admin/analytics" className="btn btn-ghost btn-sm">Analytics</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
