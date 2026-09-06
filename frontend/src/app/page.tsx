'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Hexagon, BrainCircuit, Map, Zap, Target, RefreshCcw, BarChart3, Smartphone, MousePointer2, ClipboardList, TrendingUp, ArrowRight } from 'lucide-react';

/* ── Saffron Palette ──────────────────────────────────────────
   Primary saffron:  #FF9933
   Deep saffron:     #E07000
   Light saffron:    #FFB566
   Accent white:     #FFFFFF
   Dark overlay:     rgba(15,10,5,0.72)
──────────────────────────────────────────────────────────────── */

const SAFFRON         = '#FF9933';
const SAFFRON_DEEP    = '#E07000';
const SAFFRON_LIGHT   = '#FFB566';
const SAFFRON_GLOW    = 'rgba(255,153,51,0.18)';

const stats = [
  { label: 'Complaints Processed', value: '50,000+' },
  { label: 'Issue Clusters Detected', value: '1,200+' },
  { label: 'Resolution Rate', value: '87%' },
  { label: 'Wards Covered', value: '20' },
];

const features = [
  { icon: <BrainCircuit size={26} />, title: 'AI Complaint Understanding', desc: 'Converts text, images, and voice into structured civic intelligence with 94%+ accuracy.' },
  { icon: <Map size={26} />, title: 'Geographic Intelligence', desc: 'Maps complaints spatially, detects hotspots, and identifies emerging problem zones.' },
  { icon: <Zap size={26} />, title: 'Predictive Escalation', desc: 'Forecasts which issues will become critical — before citizens are forced to escalate.' },
  { icon: <Target size={26} />, title: 'Explainable Recommendations', desc: 'Every AI insight shows its evidence. Why is this urgent? Exactly who needs to act?' },
  { icon: <RefreshCcw size={26} />, title: 'Closed-Loop Resolution', desc: 'Complaint → Action → Evidence → AI Verification → Citizen Confirmation.' },
  { icon: <BarChart3 size={26} />, title: 'Civic Intelligence Dashboard', desc: 'Transform 50,000 individual complaints into 8 actionable civic insights.' },
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
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div style={{ background: '#FFF8F0', minHeight: '100vh', fontFamily: 'var(--font-main)' }}>

      {/* ── NAVBAR ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        background: scrolled ? 'rgba(255,255,255,0.96)' : 'transparent',
        borderBottom: scrolled ? `1.5px solid ${SAFFRON_LIGHT}40` : 'none',
        backdropFilter: scrolled ? 'blur(14px)' : 'none',
        padding: '0 clamp(16px, 4vw, 48px)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: '68px',
        transition: 'all 0.25s ease',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Image src="/logo.png?v=2" alt="CivicLens Logo" width={34} height={34} style={{ borderRadius: '9px', boxShadow: `0 2px 8px ${SAFFRON_GLOW}` }} className="animate-float" />
          <span style={{
            fontSize: '20px', fontWeight: '900',
            color: scrolled ? '#1A0A00' : '#fff',
            letterSpacing: '-0.03em',
            textShadow: scrolled ? 'none' : '0 1px 4px rgba(0,0,0,0.4)',
            transition: 'color 0.25s',
          }}>CivicLens</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Link href="/login" style={{
            padding: '8px 18px', borderRadius: '8px', fontSize: '14px', fontWeight: '600',
            border: scrolled ? `1.5px solid ${SAFFRON}` : '1.5px solid rgba(255,255,255,0.5)',
            color: scrolled ? SAFFRON : '#fff',
            textDecoration: 'none', transition: 'all 0.2s',
            background: 'transparent',
          }}>Sign In</Link>
          <Link href="/register" style={{
            padding: '8px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: '700',
            background: `linear-gradient(135deg, ${SAFFRON}, ${SAFFRON_DEEP})`,
            color: '#fff', textDecoration: 'none',
            boxShadow: `0 2px 10px ${SAFFRON}55`,
            border: 'none', transition: 'all 0.2s',
          }}>Get Started →</Link>
        </div>
      </nav>

      {/* ── HERO — Howrah Bridge Background ── */}
      <section style={{
        minHeight: '100vh',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: 'clamp(90px,12vw,120px) clamp(16px,4vw,48px) clamp(60px,8vw,80px)',
        textAlign: 'center',
        position: 'relative', overflow: 'hidden',
        backgroundImage: 'url(/howrah_bridge.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center 60%',
        backgroundRepeat: 'no-repeat',
      }}>
        {/* Dark gradient overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(10,5,0,0.75) 0%, rgba(20,10,0,0.65) 50%, rgba(10,5,0,0.85) 100%)',
          pointerEvents: 'none',
        }} />
        {/* Saffron glow vignette at top */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '260px',
          background: `linear-gradient(to bottom, ${SAFFRON}22 0%, transparent 100%)`,
          pointerEvents: 'none',
        }} />

        <div className="animate-fade" style={{ maxWidth: '860px', position: 'relative', zIndex: 1 }}>
          {/* Eyebrow badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: `${SAFFRON}22`, border: `1px solid ${SAFFRON}66`,
            borderRadius: '100px', padding: '5px 16px', marginBottom: '24px',
            backdropFilter: 'blur(8px)',
          }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: SAFFRON, display: 'inline-block' }} className="animate-pulse" />
            <span style={{ fontSize: '12px', fontWeight: '700', color: SAFFRON_LIGHT, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              AI Civic Intelligence Platform
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(32px, 6vw, 72px)',
            fontWeight: '900', letterSpacing: '-0.04em', lineHeight: '1.06',
            color: '#fff', marginBottom: '24px',
            textShadow: '0 2px 20px rgba(0,0,0,0.5)',
          }}>
            Uncover civic insights.{' '}
            <span style={{
              color: SAFFRON,
              textShadow: `0 0 30px ${SAFFRON}88`,
            }}>Empower</span>{' '}
            decision makers.{' '}
            <span style={{ color: SAFFRON_LIGHT }}>Transform governance.</span>
          </h1>

          <p style={{
            fontSize: 'clamp(15px, 2vw, 18px)', color: 'rgba(255,255,255,0.82)',
            maxWidth: '600px', margin: '0 auto 40px', lineHeight: '1.7',
          }}>
            CivicLens transforms thousands of individual citizen complaints into geographic clusters, risk predictions, and evidence-backed recommendations — helping governments move from <strong style={{ color: SAFFRON_LIGHT }}>reactive</strong> to <strong style={{ color: SAFFRON_LIGHT }}>predictive governance</strong>.
          </p>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', padding: '0 8px' }}>
            <Link href="/login?redirect=/admin/dashboard" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '13px 28px', borderRadius: '10px', fontSize: '15px', fontWeight: '700',
              background: `linear-gradient(135deg, ${SAFFRON}, ${SAFFRON_DEEP})`,
              color: '#fff', textDecoration: 'none',
              boxShadow: `0 4px 20px ${SAFFRON}66`,
              border: 'none', transition: 'all 0.2s',
            }}>
              View Admin Dashboard <ArrowRight size={17} />
            </Link>
            <Link href="/citizen/report" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '13px 28px', borderRadius: '10px', fontSize: '15px', fontWeight: '700',
              background: 'rgba(255,255,255,0.12)', color: '#fff',
              border: '1.5px solid rgba(255,255,255,0.35)',
              textDecoration: 'none', backdropFilter: 'blur(8px)',
              transition: 'all 0.2s',
            }}>
              <Smartphone size={18} /> Report an Issue
            </Link>
            <Link href="/login" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '13px 24px', borderRadius: '10px', fontSize: '15px', fontWeight: '600',
              background: 'transparent', color: 'rgba(255,255,255,0.75)',
              border: '1.5px solid rgba(255,255,255,0.25)',
              textDecoration: 'none', transition: 'all 0.2s',
            }}>
              Sign In
            </Link>
          </div>
        </div>

        {/* Floating insight card */}
        <div className="animate-fade" style={{
          marginTop: '56px', position: 'relative', zIndex: 1,
          background: 'rgba(255,255,255,0.08)',
          border: `1.5px solid ${SAFFRON}55`,
          borderRadius: '16px',
          padding: '20px 24px',
          maxWidth: '480px', width: '100%',
          backdropFilter: 'blur(16px)',
          textAlign: 'left',
          boxShadow: `0 8px 32px rgba(0,0,0,0.3), 0 0 0 1px ${SAFFRON}22`,
        }}>
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', background: '#E05555', borderRadius: '16px 0 0 16px' }} />
          <div style={{ paddingLeft: '10px' }}>
            <div style={{ fontSize: '10px', fontWeight: '700', color: '#FF8080', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '6px' }}>
              ⚠ CIVIC INSIGHT — CRITICAL
            </div>
            <div style={{ fontWeight: '700', fontSize: '16px', marginBottom: '8px', color: '#fff' }}>
              Road Damage — Ward 14 (Nagar Road)
            </div>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.65)', display: 'flex', gap: '16px', marginBottom: '12px', flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><ClipboardList size={13} /> 42 related reports</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><TrendingUp size={13} /> +64% this week</span>
            </div>
            <div style={{ marginBottom: '10px' }}>
              <div style={{ fontSize: '11px', fontWeight: '700', color: '#FF8080', letterSpacing: '0.06em', marginBottom: '4px' }}>ESCALATION RISK — 91%</div>
              <div style={{ background: 'rgba(255,255,255,0.12)', borderRadius: '100px', height: '8px', overflow: 'hidden' }}>
                <div style={{ width: '91%', height: '100%', background: '#E05555', borderRadius: '100px' }} />
              </div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '8px', padding: '8px 12px', fontSize: '13px', color: 'rgba(255,255,255,0.8)' }}>
              <strong style={{ color: SAFFRON_LIGHT }}>Recommended:</strong> Schedule road inspection within 24 hours.
            </div>
          </div>
        </div>

        {/* Bottom fade to white */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '80px',
          background: 'linear-gradient(to bottom, transparent, #FFF8F0)',
          pointerEvents: 'none',
        }} />
      </section>

      {/* ── STATS STRIP ── */}
      <section style={{
        background: `linear-gradient(135deg, ${SAFFRON_DEEP} 0%, ${SAFFRON} 100%)`,
        padding: 'clamp(28px,4vw,44px) clamp(16px,4vw,40px)',
      }}>
        <div className="hero-grid-4" style={{
          maxWidth: '900px', margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '20px', textAlign: 'center',
        }}>
          {stats.map(s => (
            <div key={s.label}>
              <div style={{ fontSize: 'clamp(28px,4vw,38px)', fontWeight: '900', color: '#fff', letterSpacing: '-0.03em' }}>{s.value}</div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.78)', fontWeight: '600', marginTop: '4px', letterSpacing: '0.02em' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── INTELLIGENCE LOOP ── */}
      <section style={{ padding: 'clamp(40px,6vw,80px) clamp(16px,4vw,40px)', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '52px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
            <MousePointer2 size={30} style={{ color: SAFFRON }} className="lucide-icon animate-float" />
          </div>
          <div style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.12em', textTransform: 'uppercase', color: SAFFRON, marginBottom: '12px' }}>
            The Intelligence Loop
          </div>
          <h2 style={{ fontSize: 'clamp(26px,4vw,40px)', fontWeight: '800', letterSpacing: '-0.03em', color: '#1A0A00', marginBottom: '16px' }}>
            From complaint to civic intelligence
          </h2>
          <p style={{ fontSize: '16px', color: '#6B4A2A', maxWidth: '560px', margin: '0 auto', lineHeight: '1.65' }}>
            CivicLens doesn't just record complaints — it understands them, finds patterns, predicts risk, and recommends action.
          </p>
        </div>

        <div className="hero-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {demoFlow.map((item, i) => (
            <div key={i} style={{
              background: '#fff', border: `1.5px solid ${SAFFRON}33`,
              borderRadius: '14px', padding: '24px',
              boxShadow: `0 2px 12px ${SAFFRON}18`,
              transition: 'box-shadow 0.2s, transform 0.2s',
            }}>
              <div style={{
                fontSize: '12px', fontWeight: '900', color: SAFFRON,
                letterSpacing: '0.08em', marginBottom: '10px',
                background: `${SAFFRON}15`, display: 'inline-block',
                padding: '3px 10px', borderRadius: '100px',
              }}>
                STEP {item.step}
              </div>
              <div style={{ fontWeight: '700', fontSize: '16px', marginBottom: '8px', color: '#1A0A00' }}>{item.title}</div>
              <div style={{ fontSize: '14px', color: '#6B4A2A', lineHeight: '1.55' }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{
        padding: 'clamp(32px,5vw,60px) clamp(16px,4vw,40px)',
        background: `linear-gradient(180deg, #FFF0E0 0%, #FFF8F0 100%)`,
        borderTop: `1.5px solid ${SAFFRON}22`,
        borderBottom: `1.5px solid ${SAFFRON}22`,
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontSize: 'clamp(24px,4vw,36px)', fontWeight: '800', letterSpacing: '-0.03em', marginBottom: '12px', color: '#1A0A00' }}>
              Why CivicLens is different
            </h2>
            <p style={{ fontSize: '16px', color: '#6B4A2A' }}>
              Not just "we use AI" — a complete intelligence system.
            </p>
          </div>
          <div className="hero-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {features.map((f, i) => (
              <div key={i} style={{
                background: '#fff', border: `1.5px solid ${SAFFRON}30`,
                borderRadius: '14px', padding: '22px',
                boxShadow: `0 2px 12px ${SAFFRON}12`,
                transition: 'box-shadow 0.2s, transform 0.2s',
              }}>
                <div style={{
                  marginBottom: '14px', display: 'flex', alignItems: 'center',
                  width: '48px', height: '48px', borderRadius: '12px',
                  background: `linear-gradient(135deg, ${SAFFRON}25, ${SAFFRON}10)`,
                  border: `1px solid ${SAFFRON}40`,
                  justifyContent: 'center', color: SAFFRON,
                }}>{f.icon}</div>
                <div style={{ fontWeight: '700', fontSize: '15px', marginBottom: '8px', color: '#1A0A00' }}>{f.title}</div>
                <div style={{ fontSize: '14px', color: '#6B4A2A', lineHeight: '1.55' }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: 'clamp(40px,6vw,80px) clamp(16px,4vw,40px)', textAlign: 'center', background: '#FFF8F0' }}>
        <div style={{ maxWidth: '620px', margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(24px,4vw,40px)', fontWeight: '800', letterSpacing: '-0.03em', marginBottom: '16px', color: '#1A0A00' }}>
            Ready to see civic intelligence in action?
          </h2>
          <p style={{ fontSize: '16px', color: '#6B4A2A', marginBottom: '32px', lineHeight: '1.65' }}>
            Explore the full platform with 50,000 synthetic complaints and pre-seeded AI insights.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/login?redirect=/admin/dashboard" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '13px 28px', borderRadius: '10px', fontSize: '15px', fontWeight: '700',
              background: `linear-gradient(135deg, ${SAFFRON}, ${SAFFRON_DEEP})`,
              color: '#fff', textDecoration: 'none',
              boxShadow: `0 4px 20px ${SAFFRON}55`,
            }}>
              Explore Admin Dashboard <ArrowRight size={16} />
            </Link>
            <Link href="/citizen/dashboard" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '13px 28px', borderRadius: '10px', fontSize: '15px', fontWeight: '700',
              background: '#fff', color: SAFFRON_DEEP,
              border: `1.5px solid ${SAFFRON}`,
              textDecoration: 'none',
              boxShadow: `0 2px 12px ${SAFFRON}20`,
            }}>
              Citizen Portal
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        background: `linear-gradient(135deg, #1A0A00 0%, #2A1200 100%)`,
        color: 'rgba(255,255,255,0.55)',
        padding: 'clamp(24px,4vw,36px) clamp(16px,4vw,40px)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: '12px',
        fontSize: '13px',
        borderTop: `2px solid ${SAFFRON}44`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Image src="/logo.png?v=2" alt="CivicLens Logo" width={28} height={28} style={{ borderRadius: '7px' }} />
          <div>
            <span style={{ fontWeight: '800', color: '#fff', fontSize: '14px' }}>CivicLens</span>
            <span style={{ color: `${SAFFRON}99`, marginLeft: '8px' }}>— AI Civic Intelligence Platform</span>
          </div>
        </div>
        <div style={{ color: `${SAFFRON}77`, fontSize: '12px' }}>
          Built for Smart India Hackathon · Kolkata 🌉
        </div>
      </footer>
    </div>
  );
}
