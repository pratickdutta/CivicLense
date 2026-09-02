'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Hexagon, BrainCircuit, Map, Zap, Target, RefreshCcw, BarChart3, Smartphone, MousePointer2, ClipboardList, TrendingUp } from 'lucide-react';

const stats = [
  { label: 'Complaints Processed', value: '50,000+' },
  { label: 'Issue Clusters Detected', value: '1,200+' },
  { label: 'Resolution Rate', value: '87%' },
  { label: 'Wards Covered', value: '20' },
];

const features = [
  {
    icon: <BrainCircuit size={28} className="lucide-icon text-primary" />,
    title: 'AI Complaint Understanding',
    desc: 'Converts text, images, and voice into structured civic intelligence with 94%+ accuracy.',
  },
  {
    icon: <Map size={28} className="lucide-icon text-primary" />,
    title: 'Geographic Intelligence',
    desc: 'Maps complaints spatially, detects hotspots, and identifies emerging problem zones.',
  },
  {
    icon: <Zap size={28} className="lucide-icon text-warning" />,
    title: 'Predictive Escalation',
    desc: 'Forecasts which issues will become critical — before citizens are forced to escalate.',
  },
  {
    icon: <Target size={28} className="lucide-icon text-critical" />,
    title: 'Explainable Recommendations',
    desc: 'Every AI insight shows its evidence. Why is this urgent? Exactly who needs to act?',
  },
  {
    icon: <RefreshCcw size={28} className="lucide-icon text-success" />,
    title: 'Closed-Loop Resolution',
    desc: 'Complaint → Action → Evidence → AI Verification → Citizen Confirmation.',
  },
  {
    icon: <BarChart3 size={28} className="lucide-icon text-primary" />,
    title: 'Civic Intelligence Dashboard',
    desc: 'Transform 50,000 individual complaints into 8 actionable civic insights.',
  },
];

const demoFlow = [
  { step: '01', title: 'Citizen Reports', desc: 'Photo + voice + location submitted in under 60 seconds.' },
  { step: '02', title: 'AI Understands', desc: 'Classified into category, severity, department, ward.' },
  { step: '03', title: 'Patterns Detected', desc: '42 individual complaints → 1 underlying issue cluster.' },
  { step: '04', title: 'Risk Predicted', desc: '+64% growth, 2 schools nearby → 91% escalation risk.' },
  { step: '05', title: 'Action Recommended', desc: '"Schedule road inspection within 24 hours."' },
  { step: '06', title: 'Verified & Confirmed', desc: 'AI verifies evidence. Citizen confirms resolution.' },
];

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', fontFamily: 'var(--font-main)' }}>
      {/* ── NAVBAR ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        background: scrolled ? 'rgba(255,255,255,0.95)' : 'transparent',
        borderBottom: scrolled ? '1.5px solid var(--border-subtle)' : 'none',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        padding: '0 40px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: '64px',
        transition: 'all 0.2s ease',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div className="app-logo" style={{
            width: '32px', height: '32px', borderRadius: '8px',
            background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff',
            border: '1.5px solid var(--border)', boxShadow: 'var(--shadow-sm)',
          }}><Hexagon size={18} fill="currentColor" className="lucide-icon animate-float" /></div>
          <span style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.02em' }}>CivicLens</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href="/login" className="btn btn-secondary btn-sm">Sign In</Link>
          <Link href="/register" className="btn btn-primary btn-sm">Get Started</Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '80px 40px 60px',
        textAlign: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Background grid pattern */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(49,90,125,0.06) 1px, transparent 0)',
          backgroundSize: '28px 28px',
          pointerEvents: 'none',
        }} />

        <div className="animate-fade" style={{ maxWidth: '860px', position: 'relative' }}>
          <h1 style={{
            fontSize: 'clamp(36px, 6vw, 72px)',
            fontWeight: '900', letterSpacing: '-0.04em', lineHeight: '1.05',
            color: 'var(--text-main)', marginBottom: '24px',
          }}>
            See the problem.{' '}
            <span style={{ color: 'var(--primary)' }}>Understand</span>{' '}
            the pattern.{' '}
            <span style={{ color: 'var(--secondary)' }}>Act smarter.</span>
          </h1>

          <p style={{
            fontSize: '18px', color: 'var(--text-secondary)', maxWidth: '620px',
            margin: '0 auto 36px', lineHeight: '1.65',
          }}>
            CivicLens transforms thousands of individual citizen complaints into geographic clusters, risk predictions, and evidence-backed recommendations — helping governments move from <strong>reactive</strong> to <strong>predictive governance</strong>.
          </p>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/admin/dashboard" className="btn btn-primary btn-lg">
              View Admin Dashboard →
            </Link>
            <Link href="/citizen/report" className="btn btn-accent btn-lg" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Smartphone size={20} className="lucide-icon" /> Report an Issue
            </Link>
            <Link href="/login" className="btn btn-secondary btn-lg">
              Sign In
            </Link>
          </div>
        </div>

        {/* Demo insight card floating */}
        <div className="animate-fade" style={{
          marginTop: '60px',
          background: 'var(--surface)',
          border: '1.5px solid var(--border)',
          borderRadius: '16px',
          padding: '20px 24px',
          maxWidth: '480px',
          width: '100%',
          boxShadow: 'var(--shadow-elevated)',
          position: 'relative',
          textAlign: 'left',
        }}>
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', background: 'var(--critical)', borderRadius: '16px 0 0 16px' }} />
          <div style={{ paddingLeft: '8px' }}>
            <div className="insight-label" style={{ color: 'var(--critical)' }}>⚠ CIVIC INSIGHT — CRITICAL</div>
            <div style={{ fontWeight: '700', fontSize: '16px', marginBottom: '8px', color: 'var(--text-main)' }}>
              Road Damage — Ward 14 (Nagar Road)
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', gap: '16px', marginBottom: '12px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><ClipboardList size={14} className="lucide-icon" /> 42 related reports</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><TrendingUp size={14} className="lucide-icon" /> +64% this week</span>
            </div>
            <div style={{ marginBottom: '10px' }}>
              <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--critical)', letterSpacing: '0.06em', marginBottom: '4px' }}>
                ESCALATION RISK — 91%
              </div>
              <div className="risk-bar-container">
                <div className="risk-bar critical" style={{ width: '91%' }} />
              </div>
            </div>
            <div style={{ background: 'var(--bg)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '8px 12px', fontSize: '13px' }}>
              <strong>Recommended:</strong> Schedule road inspection within 24 hours.
            </div>
            <div style={{ marginTop: '10px', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
              {['42 related complaints', '+64% weekly increase', '2 schools within 500m', '4 days unresolved'].map(f => (
                <span key={f} style={{ fontSize: '11px', color: 'var(--success)', fontWeight: '600' }}>✓ {f}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <section style={{ background: 'var(--primary)', padding: '40px', borderTop: '1.5px solid var(--border)', borderBottom: '1.5px solid var(--border)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', textAlign: 'center' }}>
          {stats.map(s => (
            <div key={s.label}>
              <div style={{ fontSize: '36px', fontWeight: '900', color: '#fff', letterSpacing: '-0.03em' }}>{s.value}</div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', fontWeight: '500', marginTop: '4px' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── INTELLIGENCE LOOP ── */}
      <section style={{ padding: '80px 40px', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}><MousePointer2 size={32} className="lucide-icon text-insight animate-float" /></div>
          <div style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--insight)', marginBottom: '12px' }}>
            The Intelligence Loop
          </div>
          <h2 style={{ fontSize: '40px', fontWeight: '800', letterSpacing: '-0.03em', color: 'var(--text-main)', marginBottom: '16px' }}>
            From complaint to civic intelligence
          </h2>
          <p style={{ fontSize: '16px', color: 'var(--text-secondary)', maxWidth: '560px', margin: '0 auto' }}>
            CivicLens doesn't just record complaints — it understands them, finds patterns, predicts risk, and recommends action.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {demoFlow.map((item, i) => (
            <div key={i} className="card" style={{ padding: '24px' }}>
              <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--primary)', letterSpacing: '0.08em', marginBottom: '10px' }}>
                STEP {item.step}
              </div>
              <div style={{ fontWeight: '700', fontSize: '16px', marginBottom: '8px', color: 'var(--text-main)' }}>{item.title}</div>
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ padding: '60px 40px', background: 'var(--surface)', borderTop: '1.5px solid var(--border-subtle)', borderBottom: '1.5px solid var(--border-subtle)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontSize: '36px', fontWeight: '800', letterSpacing: '-0.03em', marginBottom: '12px' }}>
              Why CivicLens is different
            </h2>
            <p style={{ fontSize: '16px', color: 'var(--text-secondary)' }}>
              Not just "we use AI" — a complete intelligence system.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {features.map((f, i) => (
              <div key={i} className="card" style={{ padding: '22px' }}>
                <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center' }}>{f.icon}</div>
                <div style={{ fontWeight: '700', fontSize: '15px', marginBottom: '8px', color: 'var(--text-main)' }}>{f.title}</div>
                <div style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.55' }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '80px 40px', textAlign: 'center' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '40px', fontWeight: '800', letterSpacing: '-0.03em', marginBottom: '16px' }}>
            Ready to see civic intelligence in action?
          </h2>
          <p style={{ fontSize: '16px', color: 'var(--text-secondary)', marginBottom: '32px' }}>
            Explore the full platform with 50,000 synthetic complaints and pre-seeded AI insights.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/admin/dashboard" className="btn btn-primary btn-lg">
              Explore Admin Dashboard →
            </Link>
            <Link href="/citizen/dashboard" className="btn btn-secondary btn-lg">
              Citizen Portal
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        background: 'var(--text-main)', color: 'rgba(255,255,255,0.6)',
        padding: '32px 40px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        fontSize: '13px', borderTop: '1.5px solid var(--border)',
      }}>
        <div style={{ fontWeight: '700', color: '#fff' }}>
          CivicLens <span style={{ fontWeight: '400', color: 'rgba(255,255,255,0.5)' }}>— AI Civic Intelligence Platform</span>
        </div>
        <div>Soft Neubrutalism + Modern Enterprise</div>
      </footer>
    </div>
  );
}
