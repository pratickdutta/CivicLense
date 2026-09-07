'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Camera, Mic, Type, CheckCircle2, ArrowLeft, Hexagon } from 'lucide-react';

const MY_COMPLAINTS = [
  { id: 10001, number: 'CL10001', category: 'Road Infrastructure', subcategory: 'Pothole', address: 'Nagar Road, Ward 14', severity: 'critical', status: 'in_progress', created_at: new Date(Date.now() - 4 * 86400000).toISOString(), priority_score: 91 },
  { id: 10048, number: 'CL10048', category: 'Streetlights', subcategory: 'Light Not Working', address: 'Market Road, Ward 14', severity: 'high', status: 'resolved', created_at: new Date(Date.now() - 10 * 86400000).toISOString(), priority_score: 68 },
  { id: 10076, number: 'CL10076', category: 'Garbage & Sanitation', subcategory: 'Overflowing Bins', address: 'Station Road, Ward 14', severity: 'medium', status: 'assigned', created_at: new Date(Date.now() - 2 * 86400000).toISOString(), priority_score: 52 },
];

const STATUS_STEPS = ['submitted', 'classified', 'assigned', 'in_progress', 'resolved'];

export default function CitizenDashboard() {
  const getStatusIndex = (s: string) => STATUS_STEPS.indexOf(s);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', fontFamily: 'var(--font-main)' }}>
      {/* Header */}
      <div style={{
        background: 'var(--primary)', padding: '20px 24px 32px',
        borderBottom: '1.5px solid var(--border)',
      }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: '#fff' }}>
              <Image src="/logo_v4.png" alt="Logo" width={28} height={28} style={{ borderRadius: '6px', border: '1px solid rgba(255,255,255,0.3)' }} />
              <div style={{ fontWeight: '800', fontSize: '18px', letterSpacing: '-0.02em' }}>CivicLens</div>
            </Link>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Link href="/citizen/report" className="btn btn-accent btn-sm">+ Report Issue</Link>
              <Link href="/login" className="btn btn-sm">Sign Out</Link>
            </div>
          </div>
          <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px', marginBottom: '4px' }}>Welcome back,</div>
          <div style={{ color: '#fff', fontSize: '22px', fontWeight: '800', letterSpacing: '-0.02em' }}>Priya Sharma</div>
        </div>
      </div>

      <div style={{ maxWidth: '680px', margin: '-16px auto 0', padding: '0 16px 40px', position: 'relative' }}>
        {/* Quick Actions */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
          <Link href="/citizen/report" style={{ textDecoration: 'none' }}>
            <div className="card" style={{ textAlign: 'center', padding: '20px 16px', cursor: 'pointer' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}><Camera size={28} className="lucide-icon text-primary animate-float" /></div>
              <div style={{ fontWeight: '700', fontSize: '13px', color: 'var(--text-main)', marginBottom: '4px' }}>Report with Photo</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Upload evidence</div>
            </div>
          </Link>
          <Link href="/citizen/report?mode=voice" style={{ textDecoration: 'none' }}>
            <div className="card" style={{ textAlign: 'center', padding: '20px 16px', cursor: 'pointer' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}><Mic size={28} className="lucide-icon text-primary animate-float" /></div>
              <div style={{ fontWeight: '700', fontSize: '13px', color: 'var(--text-main)', marginBottom: '4px' }}>Report by Voice</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Speak your issue</div>
            </div>
          </Link>
          <Link href="/citizen/report?mode=text" style={{ textDecoration: 'none' }}>
            <div className="card" style={{ textAlign: 'center', padding: '20px 16px', cursor: 'pointer' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}><Type size={28} className="lucide-icon text-primary animate-float" /></div>
              <div style={{ fontWeight: '700', fontSize: '13px', color: 'var(--text-main)', marginBottom: '4px' }}>Describe Problem</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Type description</div>
            </div>
          </Link>
        </div>

        {/* Stats Strip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '24px' }}>
          {[
            { label: 'Total', value: MY_COMPLAINTS.length, color: 'var(--primary)' },
            { label: 'Active', value: MY_COMPLAINTS.filter(c => !['resolved', 'closed'].includes(c.status)).length, color: 'var(--warning)' },
            { label: 'Resolved', value: MY_COMPLAINTS.filter(c => ['resolved', 'closed'].includes(c.status)).length, color: 'var(--success)' },
          ].map(s => (
            <div key={s.label} className="card card-sm" style={{ textAlign: 'center', padding: '14px' }}>
              <div style={{ fontSize: '26px', fontWeight: '900', color: s.color, letterSpacing: '-0.03em' }}>{s.value}</div>
              <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '2px' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* My Complaints */}
        <div style={{ fontWeight: '700', fontSize: '15px', marginBottom: '12px' }}>My Complaints</div>

        {MY_COMPLAINTS.map(c => {
          const stepIdx = getStatusIndex(c.status);
          const isResolved = c.status === 'resolved';
          return (
            <Link key={c.id} href={`/citizen/complaint/${c.id}`} style={{ textDecoration: 'none', display: 'block', marginBottom: '12px' }}>
              <div className="card" style={{ borderLeft: `4px solid ${isResolved ? 'var(--success)' : c.severity === 'critical' ? 'var(--critical)' : c.severity === 'high' ? 'var(--warning)' : 'var(--primary)'}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '2px' }}>#{c.number}</div>
                    <div style={{ fontWeight: '700', fontSize: '15px', color: 'var(--text-main)', marginBottom: '2px' }}>{c.category}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{c.address}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className={`badge badge-${c.status}`}>{c.status.replace('_', ' ')}</span>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                      {new Date(c.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </div>
                  </div>
                </div>

                {/* Progress Steps */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {STATUS_STEPS.map((step, i) => (
                    <div key={step} style={{ display: 'flex', alignItems: 'center', flex: i < STATUS_STEPS.length - 1 ? 1 : 'none' }}>
                      <div style={{
                        width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0,
                        background: i <= stepIdx ? (isResolved && i === stepIdx ? 'var(--success)' : 'var(--primary)') : 'var(--bg)',
                        border: `2px solid ${i <= stepIdx ? (isResolved && i === stepIdx ? 'var(--success)' : 'var(--primary)') : 'var(--border-light)'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '10px', color: i <= stepIdx ? '#fff' : 'var(--text-muted)',
                        fontWeight: '700',
                      }}>
                        {i < stepIdx ? <CheckCircle2 size={12} className="lucide-icon" /> : i + 1}
                      </div>
                      {i < STATUS_STEPS.length - 1 && (
                        <div style={{ flex: 1, height: '2px', background: i < stepIdx ? 'var(--primary)' : 'var(--border-light)', margin: '0 2px' }} />
                      )}
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                  {STATUS_STEPS.map((step, i) => (
                    <span key={step} style={{ fontSize: '9px', fontWeight: i === stepIdx ? '700' : '500', color: i === stepIdx ? 'var(--primary)' : 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>
                      {step.replace('_', ' ')}
                    </span>
                  ))}
                </div>

                {isResolved && (
                  <div style={{ marginTop: '12px', padding: '8px 12px', background: 'var(--success-light)', border: '1px solid var(--success)', borderRadius: '6px', fontSize: '12px', color: 'var(--success)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={14} className="lucide-icon" /> Resolved · Tap to confirm resolution
                  </div>
                )}
              </div>
            </Link>
          );
        })}

        {/* Footer nav */}
        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '13px', color: 'var(--text-muted)' }}>
          <Link href="/" style={{ color: 'var(--primary)', fontWeight: '600', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}><ArrowLeft size={14} className="lucide-icon" /> Back to Home</Link>
          {' · '}
          <Link href="/admin/dashboard" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Admin Portal</Link>
        </div>
      </div>
    </div>
  );
}
