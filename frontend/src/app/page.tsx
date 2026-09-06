'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Hexagon, BrainCircuit, Map, Zap, Target, RefreshCcw, BarChart3, Smartphone, MousePointer2, ClipboardList, TrendingUp, ArrowRight } from 'lucide-react';

const SAFFRON         = '#FF9933';
const SAFFRON_DEEP    = '#E07000';
const SAFFRON_LIGHT   = '#FFB566';

const stats = [
  { label: 'Complaints Processed', value: '50,000+' },
  { label: 'Issue Clusters Detected', value: '1,200+' },
  { label: 'Resolution Rate', value: '87%' },
  { label: 'Wards Covered', value: '20' },
];

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
    <div style={{ background: '#FFF8F0', minHeight: '100vh', fontFamily: 'var(--font-main)' }}>

      {/* ── NAVBAR ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        background: scrolled ? '#FFF' : 'transparent',
        borderBottom: scrolled ? '3px solid #000' : 'none',
        padding: '0 clamp(16px, 4vw, 48px)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: '74px',
        transition: 'all 0.2s ease',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Image src="/logo_v3.png" alt="CivicLens Logo" width={38} height={38} style={{ border: '2px solid #000', borderRadius: '4px', boxShadow: scrolled ? '2px 2px 0 #000' : '2px 2px 0 rgba(0,0,0,0.5)' }} />
          <span style={{
            fontSize: '24px', fontWeight: '900',
            color: scrolled ? '#000' : '#fff',
            letterSpacing: '-0.03em',
            textShadow: scrolled ? 'none' : '2px 2px 0 #000',
            transition: 'color 0.2s',
          }}>CivicLens</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href="/login" style={{
            padding: '10px 20px', borderRadius: '4px', fontSize: '15px', fontWeight: '800',
            border: scrolled ? '2px solid #000' : '2px solid #fff',
            color: scrolled ? '#000' : '#fff',
            textDecoration: 'none', transition: 'all 0.2s',
            background: scrolled ? '#fff' : 'transparent',
            boxShadow: scrolled ? '3px 3px 0 #000' : 'none',
          }}>Sign In</Link>
          <Link href="/register" style={{
            padding: '10px 24px', borderRadius: '4px', fontSize: '15px', fontWeight: '900',
            background: SAFFRON, color: '#000', textDecoration: 'none',
            border: '3px solid #000', boxShadow: '4px 4px 0 #000',
            transition: 'all 0.2s',
          }}>Get Started</Link>
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
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.8) 100%)',
          pointerEvents: 'none',
        }} />

        <div className="animate-fade" style={{ maxWidth: '860px', position: 'relative', zIndex: 1 }}>

          <h1 style={{
            fontSize: 'clamp(38px, 6vw, 76px)',
            fontWeight: '900', letterSpacing: '-0.04em', lineHeight: '1.06',
            color: '#fff', marginBottom: '24px',
            textShadow: '4px 4px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000',
          }}>
            Uncover civic insights.<br />
            <span style={{ color: SAFFRON }}>Empower</span> decision makers.<br />
            <span style={{ color: SAFFRON_LIGHT }}>Transform governance.</span>
          </h1>

          <p style={{
            fontSize: 'clamp(16px, 2vw, 20px)', color: '#fff',
            maxWidth: '680px', margin: '0 auto 40px', lineHeight: '1.6',
            fontWeight: '600', textShadow: '2px 2px 0 #000',
          }}>
            CivicLens bridges the gap between citizens and local government. We turn community feedback into clear, actionable steps to build safer, smarter, and more responsive cities together.
          </p>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', padding: '0 8px' }}>
            <Link href="/login?redirect=/admin/dashboard" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '14px 32px', borderRadius: '4px', fontSize: '16px', fontWeight: '900',
              background: SAFFRON, color: '#000', textDecoration: 'none',
              border: '3px solid #000', boxShadow: '6px 6px 0 #000',
              transition: 'transform 0.1s',
            }}>
              View Admin Dashboard <ArrowRight size={20} strokeWidth={3} />
            </Link>
            <Link href="/citizen/report" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '14px 32px', borderRadius: '4px', fontSize: '16px', fontWeight: '900',
              background: '#fff', color: '#000',
              border: '3px solid #000', boxShadow: '6px 6px 0 #000',
              textDecoration: 'none',
              transition: 'transform 0.1s',
            }}>
              <Smartphone size={20} strokeWidth={3} /> Report an Issue
            </Link>
          </div>
        </div>

        {/* Floating insight card (Neubrutalism style) */}
        <div className="animate-fade" style={{
          marginTop: '64px', position: 'relative', zIndex: 1,
          background: '#fff', border: '3px solid #000',
          borderRadius: '4px', padding: '24px',
          maxWidth: '520px', width: '100%',
          textAlign: 'left',
          boxShadow: '8px 8px 0 #000',
        }}>
          <div style={{ position: 'absolute', left: '-3px', top: '-3px', bottom: '-3px', width: '8px', background: '#E05555', border: '3px solid #000', borderRight: 'none' }} />
          <div style={{ paddingLeft: '14px' }}>
            <div style={{ fontSize: '11px', fontWeight: '900', color: '#E05555', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
              ⚠ CIVIC INSIGHT — CRITICAL
            </div>
            <div style={{ fontWeight: '900', fontSize: '18px', marginBottom: '10px', color: '#000' }}>
              Road Damage — Ward 14 (Nagar Road)
            </div>
            <div style={{ fontSize: '14px', color: '#333', display: 'flex', gap: '16px', marginBottom: '16px', flexWrap: 'wrap', fontWeight: '700' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><ClipboardList size={16} strokeWidth={2.5} /> 42 related reports</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><TrendingUp size={16} strokeWidth={2.5} /> +64% this week</span>
            </div>
            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '12px', fontWeight: '900', color: '#E05555', letterSpacing: '0.06em', marginBottom: '6px' }}>ESCALATION RISK — 91%</div>
              <div style={{ background: '#eee', height: '12px', border: '2px solid #000' }}>
                <div style={{ width: '91%', height: '100%', background: '#E05555', borderRight: '2px solid #000' }} />
              </div>
            </div>
            <div style={{ background: '#FFF8F0', border: '2px solid #000', padding: '10px 14px', fontSize: '14px', color: '#000', fontWeight: '700' }}>
              <strong style={{ color: SAFFRON_DEEP }}>Recommended:</strong> Schedule road inspection within 24 hours.
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

      {/* ── STATS STRIP ── */}
      <section style={{
        background: SAFFRON,
        padding: 'clamp(28px,4vw,44px) clamp(16px,4vw,40px)',
        borderBottom: '3px solid #000',
      }}>
        <div className="hero-grid-4" style={{
          maxWidth: '1000px', margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '20px', textAlign: 'center',
        }}>
          {stats.map(s => (
            <div key={s.label}>
              <div style={{ fontSize: 'clamp(32px,4vw,42px)', fontWeight: '900', color: '#000', letterSpacing: '-0.03em', textShadow: '2px 2px 0 #fff' }}>{s.value}</div>
              <div style={{ fontSize: '14px', color: '#000', fontWeight: '800', marginTop: '6px', letterSpacing: '0.02em', textTransform: 'uppercase' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── INTELLIGENCE LOOP ── */}
      <section style={{ padding: 'clamp(60px,6vw,100px) clamp(16px,4vw,40px)', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
            <MousePointer2 size={40} style={{ color: '#000' }} className="lucide-icon animate-float" strokeWidth={2.5} />
          </div>
          <div style={{ fontSize: '14px', fontWeight: '900', letterSpacing: '0.12em', textTransform: 'uppercase', color: SAFFRON_DEEP, marginBottom: '12px' }}>
            The Process
          </div>
          <h2 style={{ fontSize: 'clamp(32px,4vw,48px)', fontWeight: '900', letterSpacing: '-0.03em', color: '#000', marginBottom: '16px' }}>
            From complaint to resolution
          </h2>
          <p style={{ fontSize: '18px', color: '#333', maxWidth: '640px', margin: '0 auto', lineHeight: '1.6', fontWeight: '600' }}>
            CivicLens doesn't just record complaints — it understands them, finds patterns, predicts risks, and empowers human action.
          </p>
        </div>

        <div className="hero-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
          {demoFlow.map((item, i) => (
            <div key={i} style={{
              background: '#fff', border: '3px solid #000',
              borderRadius: '4px', padding: '32px',
              boxShadow: '8px 8px 0 #000',
              transition: 'transform 0.1s',
            }}>
              <div style={{
                fontSize: '14px', fontWeight: '900', color: '#000',
                letterSpacing: '0.08em', marginBottom: '16px',
                background: SAFFRON, display: 'inline-block',
                padding: '4px 12px', border: '2px solid #000'
              }}>
                STEP {item.step}
              </div>
              <div style={{ fontWeight: '900', fontSize: '20px', marginBottom: '12px', color: '#000' }}>{item.title}</div>
              <div style={{ fontSize: '16px', color: '#333', lineHeight: '1.5', fontWeight: '600' }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{
        padding: 'clamp(60px,5vw,100px) clamp(16px,4vw,40px)',
        background: '#FFEBCC',
        borderTop: '3px solid #000',
        borderBottom: '3px solid #000',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h2 style={{ fontSize: 'clamp(32px,4vw,48px)', fontWeight: '900', letterSpacing: '-0.03em', marginBottom: '16px', color: '#000' }}>
              Why CivicLens is different
            </h2>
            <p style={{ fontSize: '18px', color: '#333', fontWeight: '600' }}>
              A complete, human-centered civic management system.
            </p>
          </div>
          <div className="hero-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            {features.map((f, i) => (
              <div key={i} style={{
                background: '#fff', border: '3px solid #000',
                borderRadius: '4px', padding: '32px',
                boxShadow: '8px 8px 0 #000',
              }}>
                <div style={{
                  marginBottom: '20px', display: 'flex', alignItems: 'center',
                  width: '56px', height: '56px',
                  background: SAFFRON,
                  border: '3px solid #000', boxShadow: '4px 4px 0 #000',
                  justifyContent: 'center', color: '#000',
                }}>{f.icon}</div>
                <div style={{ fontWeight: '900', fontSize: '18px', marginBottom: '12px', color: '#000' }}>{f.title}</div>
                <div style={{ fontSize: '15px', color: '#333', lineHeight: '1.5', fontWeight: '600' }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: 'clamp(60px,6vw,100px) clamp(16px,4vw,40px)', textAlign: 'center', background: '#FFF8F0' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(32px,4vw,48px)', fontWeight: '900', letterSpacing: '-0.03em', marginBottom: '24px', color: '#000' }}>
            Ready to empower your community?
          </h2>
          <p style={{ fontSize: '18px', color: '#333', marginBottom: '40px', lineHeight: '1.6', fontWeight: '600' }}>
            Explore the full platform with 50,000 synthetic complaints and data-driven insights.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/login?redirect=/admin/dashboard" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '16px 36px', borderRadius: '4px', fontSize: '16px', fontWeight: '900',
              background: SAFFRON, color: '#000', textDecoration: 'none',
              border: '3px solid #000', boxShadow: '6px 6px 0 #000',
            }}>
              Explore Admin Dashboard <ArrowRight size={20} strokeWidth={3} />
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
        background: '#000',
        color: '#fff',
        padding: 'clamp(32px,4vw,48px) clamp(16px,4vw,40px)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: '20px',
        borderTop: '5px solid #000',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Image src="/logo_v3.png" alt="CivicLens Logo" width={32} height={32} style={{ border: '2px solid #fff', borderRadius: '4px' }} />
          <div>
            <span style={{ fontWeight: '900', color: '#fff', fontSize: '16px', letterSpacing: '0.02em' }}>CivicLens</span>
            <span style={{ color: '#aaa', marginLeft: '12px', fontWeight: '600' }}>— Civic Management Platform</span>
          </div>
        </div>
        <div style={{ color: '#aaa', fontSize: '14px', fontWeight: '600' }}>
          Built for Smart India Hackathon · Kolkata 🌉
        </div>
      </footer>
    </div>
  );
}
