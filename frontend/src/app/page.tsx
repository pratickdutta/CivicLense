'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { BrainCircuit, Map, Zap, Target, RefreshCcw, BarChart3, Smartphone, MousePointer2, ClipboardList } from 'lucide-react';

const features = [
  { icon: <BrainCircuit size={26} />, title: 'Smart Complaint Understanding', desc: 'Converts text, images, and voice into structured civic data accurately.' },
  { icon: <Map size={26} />, title: 'Geographic Intelligence', desc: 'Maps complaints spatially, detects hotspots, and identifies emerging problem zones.' },
  { icon: <Zap size={26} />, title: 'Proactive Escalation', desc: 'Forecasts which issues will become critical — before citizens are forced to escalate.' },
  { icon: <Target size={26} />, title: 'Clear Recommendations', desc: 'Every insight shows its evidence. Why is this urgent? Exactly who needs to act?' },
  { icon: <RefreshCcw size={26} />, title: 'Closed-Loop Resolution', desc: 'Complaint → Action → Evidence → Verification → Citizen Confirmation.' },
  { icon: <BarChart3 size={26} />, title: 'Civic Management Dashboard', desc: 'Transform individual complaints into actionable civic insights.' },
];

const demoFlow = [
  { step: '01', title: 'Citizen Reports', desc: 'Photo + voice + location submitted in under 60 seconds.' },
  { step: '02', title: 'System Understands', desc: 'Classified into category, severity, department, ward.' },
  { step: '03', title: 'Patterns Detected', desc: '42 individual complaints → 1 underlying issue cluster.' },
  { step: '04', title: 'Risk Predicted', desc: '+64% growth, 2 schools nearby → 91% escalation risk.' },
  { step: '05', title: 'Action Recommended', desc: '"Schedule road inspection within 24 hours."' },
  { step: '06', title: 'Verified & Confirmed', desc: 'Team verifies evidence. Citizen confirms resolution.' },
];

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', fontFamily: 'var(--font-main)', overflow: 'hidden', position: 'relative' }}>
      
      {/* ── AMBIENT BLOBS ── */}
      <div className="blob animate-blob" style={{ top: '-10%', left: '-10%', width: '40vw', height: '40vw', background: 'rgba(234, 88, 12, 0.15)' }} />
      <div className="blob animate-blob delay-200" style={{ top: '20%', right: '-5%', width: '35vw', height: '35vw', background: 'rgba(245, 158, 11, 0.12)' }} />
      <div className="blob animate-blob delay-100" style={{ bottom: '-20%', left: '20%', width: '50vw', height: '50vw', background: 'rgba(234, 88, 12, 0.08)' }} />

      {/* ── NAVBAR ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        background: scrolled ? 'rgba(255, 253, 247, 0.8)' : 'transparent',
        borderBottom: scrolled ? '1px solid rgba(0,0,0,0.05)' : 'none',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
        padding: '0 40px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: '72px',
        transition: 'all 0.3s ease',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="app-logo" style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #F59E0B, #EA580C)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 4px 12px rgba(234, 88, 12, 0.3)',
          }}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide-icon animate-float">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
              <path d="M7 16V9h3v7" />
              <path d="M10 16V6h4v10" />
              <path d="M14 16v-4h3v4" />
            </svg>
          </div>
          <span style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.02em', fontFamily: 'var(--font-sans)' }}>CivicLens</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link href="/login" style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s ease' }} onMouseOver={e => e.currentTarget.style.color = 'var(--text-main)'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-secondary)'}>Sign In</Link>
          <Link href="/register" className="btn btn-primary">Get Started</Link>
        </div>
      </nav>

      {/* ── HERO — Howrah Bridge Background ── */}
      <section style={{
        minHeight: '100vh', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        padding: '120px 40px 80px',
        position: 'relative', zIndex: 10,
        backgroundImage: 'url("/hero-bg.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        {/* Semi-transparent cream overlay to ensure text readability */}
        <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(255, 253, 247, 0.88)', zIndex: 0 }} />

        <div style={{ maxWidth: '1280px', width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center', position: 'relative', zIndex: 10 }}>
          
          {/* LEFT SIDE: TEXT */}
          <div className="animate-fade" style={{ textAlign: 'left' }}>
            <div style={{
              display: 'inline-block', padding: '6px 16px', borderRadius: '999px',
              background: 'rgba(234, 88, 12, 0.1)', color: '#EA580C',
              fontSize: '13px', fontWeight: '700', letterSpacing: '0.05em', marginBottom: '24px',
              border: '1px solid rgba(234, 88, 12, 0.2)'
            }}>
              AI-POWERED CIVIC INTELLIGENCE
            </div>
            
            <h1 style={{
              fontSize: 'clamp(48px, 5vw, 76px)',
              fontWeight: '600', letterSpacing: '-0.03em', lineHeight: '1.05',
              color: 'var(--text-main)', marginBottom: '32px',
              fontFamily: 'var(--font-serif)'
            }}>
              Uncover civic insights.<br />
              <span style={{ 
                background: 'linear-gradient(135deg, #F59E0B, #EA580C)', 
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                fontStyle: 'italic'
              }}>Transform</span> governance.
            </h1>

            <p style={{
              fontSize: '18px', color: 'var(--text-secondary)', maxWidth: '520px',
              marginBottom: '48px', lineHeight: '1.6',
              fontWeight: '400'
            }}>
              CivicLens transforms individual complaints into geographic clusters, risk predictions, and evidence-backed recommendations — helping you move from reactive to <strong>predictive governance</strong>.
            </p>

            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <Link href="/admin/dashboard" className="btn btn-primary btn-lg">
                Explore Dashboard
              </Link>
              <Link href="/citizen/report" className="btn btn-secondary btn-lg" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Smartphone size={20} className="lucide-icon" /> Report an Issue
              </Link>
            </div>
          </div>

          {/* RIGHT SIDE: VIDEO */}
          <div className="animate-fade delay-200" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* The new converted GIF */}
            <div className="glass-panel" style={{ padding: '12px', borderRadius: '32px', boxShadow: 'var(--shadow-glass)' }}>
              <img src="/hero-side.gif" alt="Platform Demo" style={{ width: '100%', borderRadius: '20px', display: 'block' }} />
            </div>
          </div>
        </div>

        {/* Bottom solid block */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '40px',
          background: '#FFF8F0',
          borderTop: '3px solid #000',
        }} />
      </section>

      {/* ── PRIORITY INSIGHTS STRIP ── */}
      <section style={{ padding: '80px 40px', position: 'relative', zIndex: 10 }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontSize: '36px', fontWeight: '600', letterSpacing: '-0.02em', fontFamily: 'var(--font-serif)', marginBottom: '12px' }}>
              Active Civic Intelligence
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '18px' }}>Prioritized insights automatically detected across the city.</p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            
            {/* Card 1: Critical */}
            <div className="glass-panel" style={{ borderRadius: '24px', padding: '24px', textAlign: 'left', overflow: 'hidden', position: 'relative' }}>
              <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', background: 'var(--critical)' }} />
              <div style={{ paddingLeft: '8px' }}>
                <div style={{ color: 'var(--critical)', fontSize: '11px', fontWeight: '800', letterSpacing: '0.08em', marginBottom: '8px' }}>⚠ CRITICAL PRIORITY</div>
                <div style={{ fontWeight: '700', fontSize: '20px', marginBottom: '12px', color: 'var(--text-main)', fontFamily: 'var(--font-serif)' }}>Road Damage — Ward 14</div>
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--critical)', letterSpacing: '0.06em', marginBottom: '8px' }}>ESCALATION RISK — 91%</div>
                  <div style={{ background: 'rgba(0,0,0,0.05)', height: '6px', borderRadius: '3px', overflow: 'hidden' }}><div style={{ background: 'var(--critical)', width: '91%', height: '100%' }} /></div>
                </div>
                <div style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>Multiple severe potholes reported. 42 recent reports detected. 2 schools within 500m. Immediate inspection required.</div>
              </div>
            </div>

            {/* Card 2: High */}
            <div className="glass-panel" style={{ borderRadius: '24px', padding: '24px', textAlign: 'left', overflow: 'hidden', position: 'relative' }}>
              <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', background: 'var(--warning)' }} />
              <div style={{ paddingLeft: '8px' }}>
                <div style={{ color: 'var(--warning)', fontSize: '11px', fontWeight: '800', letterSpacing: '0.08em', marginBottom: '8px' }}>⚡ HIGH PRIORITY</div>
                <div style={{ fontWeight: '700', fontSize: '20px', marginBottom: '12px', color: 'var(--text-main)', fontFamily: 'var(--font-serif)' }}>Water Logging — Ward 08</div>
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--warning)', letterSpacing: '0.06em', marginBottom: '8px' }}>ESCALATION RISK — 78%</div>
                  <div style={{ background: 'rgba(0,0,0,0.05)', height: '6px', borderRadius: '3px', overflow: 'hidden' }}><div style={{ background: 'var(--warning)', width: '78%', height: '100%' }} /></div>
                </div>
                <div style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>Drain blockage causing water logging near market area. Threatens local businesses and traffic flow.</div>
              </div>
            </div>

            {/* Card 3: Medium */}
            <div className="glass-panel" style={{ borderRadius: '24px', padding: '24px', textAlign: 'left', overflow: 'hidden', position: 'relative' }}>
              <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', background: 'var(--primary)' }} />
              <div style={{ paddingLeft: '8px' }}>
                <div style={{ color: 'var(--primary)', fontSize: '11px', fontWeight: '800', letterSpacing: '0.08em', marginBottom: '8px' }}>✓ MEDIUM PRIORITY</div>
                <div style={{ fontWeight: '700', fontSize: '20px', marginBottom: '12px', color: 'var(--text-main)', fontFamily: 'var(--font-serif)' }}>Streetlight Outage — Ward 21</div>
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--primary)', letterSpacing: '0.06em', marginBottom: '8px' }}>ESCALATION RISK — 45%</div>
                  <div style={{ background: 'rgba(0,0,0,0.05)', height: '6px', borderRadius: '3px', overflow: 'hidden' }}><div style={{ background: 'var(--primary)', width: '45%', height: '100%' }} /></div>
                </div>
                <div style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>Cluster of 5 streetlights reported broken along 3rd Avenue. Low immediate risk, impacts nighttime visibility.</div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── INTELLIGENCE LOOP ── */}
      <section style={{ padding: '100px 40px', maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}><MousePointer2 size={36} className="lucide-icon text-primary animate-float" /></div>
          <div style={{ fontSize: '13px', fontWeight: '700', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--primary)', marginBottom: '16px' }}>
            The Intelligence Loop
          </div>
          <h2 style={{ fontSize: '48px', fontWeight: '600', letterSpacing: '-0.02em', color: 'var(--text-main)', marginBottom: '20px', fontFamily: 'var(--font-serif)' }}>
            From complaint to intelligence
          </h2>
          <p style={{ fontSize: '18px', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
            CivicLens does not just record complaints — it understands them, finds patterns, predicts risk, and recommends action.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
          {demoFlow.map((item, i) => (
            <div key={i} className="card">
              <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--primary)', letterSpacing: '0.08em', marginBottom: '12px' }}>
                STEP {item.step}
              </div>
              <div style={{ fontWeight: '600', fontSize: '18px', marginBottom: '10px', color: 'var(--text-main)', fontFamily: 'var(--font-serif)' }}>{item.title}</div>
              <div style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ padding: '100px 40px', position: 'relative', zIndex: 10 }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h2 style={{ fontSize: '48px', fontWeight: '600', letterSpacing: '-0.02em', marginBottom: '20px', fontFamily: 'var(--font-serif)' }}>
              Why CivicLens is different
            </h2>
            <p style={{ fontSize: '18px', color: 'var(--text-secondary)' }}>
              Not just &quot;we use AI&quot; — a complete intelligence system.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            {features.map((f, i) => (
              <div key={i} className="card">
                <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center' }}>
                  <div style={{ background: 'rgba(234, 88, 12, 0.1)', padding: '12px', borderRadius: '12px' }}>
                    {f.icon}
                  </div>
                </div>
                <div style={{ fontWeight: '600', fontSize: '18px', marginBottom: '10px', color: 'var(--text-main)', fontFamily: 'var(--font-serif)' }}>{f.title}</div>
                <div style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '100px 40px', textAlign: 'center', position: 'relative', zIndex: 10 }}>
        <div className="glass-panel" style={{ maxWidth: '700px', margin: '0 auto', padding: '64px 40px', borderRadius: '32px' }}>
          <h2 style={{ fontSize: '42px', fontWeight: '600', letterSpacing: '-0.02em', marginBottom: '20px', fontFamily: 'var(--font-serif)' }}>
            Ready to see civic intelligence in action?
          </h2>
          <p style={{ fontSize: '18px', color: 'var(--text-secondary)', marginBottom: '40px', lineHeight: '1.6' }}>
            Explore the full platform with 50,000 synthetic complaints and pre-seeded AI insights.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/admin/dashboard" className="btn btn-primary btn-lg">
              Explore Admin Dashboard
            </Link>
            <Link href="/citizen/dashboard" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '16px 36px', borderRadius: '4px', fontSize: '16px', fontWeight: '900',
              background: '#fff', color: '#000',
              border: '3px solid #000', boxShadow: '6px 6px 0 #000',
              textDecoration: 'none',
            }}>
              Citizen Portal
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        padding: '40px', position: 'relative', zIndex: 10,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        fontSize: '15px', borderTop: '1px solid rgba(0,0,0,0.05)',
        fontWeight: '500'
      }}>
        <div>
          <span style={{ color: 'var(--primary)', fontWeight: '700' }}>CivicLens</span> <span style={{ color: 'var(--text-secondary)' }}>— AI Civic Intelligence Platform</span>
        </div>
        <div style={{ color: 'var(--text-muted)' }}>Premium Organic Design</div>
      </footer>
    </div>
  );
}
