'use client';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, BookOpen, User, ShieldCheck, ClipboardCheck, Wrench, AlertTriangle, Cpu, Map, Zap } from 'lucide-react';

export default function HelpPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', fontFamily: 'var(--font-main)' }}>
      {/* Header */}
      <nav style={{
        padding: '20px 40px', borderBottom: '1px solid var(--border-light)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'var(--surface)', position: 'sticky', top: 0, zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Image src="/logo_v4.png" alt="CivicLens Logo" width={32} height={32} style={{ borderRadius: '8px' }} />
          <span style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.02em' }}>CivicLens</span>
        </div>
        <Link href="/" className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ArrowLeft size={16} /> Back to Home
        </Link>
      </nav>

      <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <BookOpen size={48} color="var(--primary)" style={{ marginBottom: '16px' }} />
          <h1 style={{ fontSize: '36px', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.03em', marginBottom: '12px' }}>
            Help & Glossary
          </h1>
          <p style={{ fontSize: '16px', color: 'var(--text-secondary)' }}>
            Everything you need to know to understand the CivicLens platform terminology and features.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* User Roles */}
          <div className="card" style={{ padding: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <User size={24} color="var(--primary)" />
              <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>User Roles</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div><strong>Admin:</strong> Has full access. Views city-wide metrics, all departments, and manages the entire system.</div>
              <div><strong>Officer (Department Head):</strong> Manages a specific domain (e.g., Water Supply). Reviews AI recommendations and tracks departmental SLAs.</div>
              <div><strong>Supervisor (Ward Manager):</strong> Manages operations for a specific geographic Ward. Dispatches field workers and monitors local resolution rates.</div>
              <div><strong>Field Worker:</strong> On-ground staff who receive tasks, fix issues, and upload before/after photo evidence.</div>
              <div><strong>Citizen:</strong> End-users who report issues via text, voice, or photo and track their status.</div>
            </div>
          </div>

          {/* SLA */}
          <div className="card" style={{ padding: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <AlertTriangle size={24} color="var(--critical)" />
              <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>Service Level Agreements (SLA)</h2>
            </div>
            <p style={{ lineHeight: '1.6', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              An SLA is the guaranteed maximum time allowed to resolve a complaint. Limits depend on AI-assigned severity:
            </p>
            <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--text-main)' }}>
              <li><strong style={{ color: 'var(--critical)' }}>Critical:</strong> 24 Hours (e.g., Burst water main)</li>
              <li><strong style={{ color: 'var(--warning)' }}>High:</strong> 48 Hours (e.g., Dead streetlight in a dark alley)</li>
              <li><strong style={{ color: 'var(--insight)' }}>Medium:</strong> 3 Days (e.g., Uncollected garbage)</li>
              <li><strong style={{ color: 'var(--success)' }}>Low:</strong> 14 Days (e.g., Faded road paint)</li>
            </ul>
            <div style={{ marginTop: '16px', padding: '16px', background: 'var(--critical-light)', borderRadius: '8px', border: '1px solid var(--critical)' }}>
              <strong>What is an SLA Breach?</strong><br/>
              An SLA Breach occurs when a complaint is not resolved within its time limit. The system flags these in red, escalating them to higher authorities and negatively impacting departmental scores.
            </div>
          </div>

          {/* AI Features */}
          <div className="card" style={{ padding: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <Cpu size={24} color="var(--insight)" />
              <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>AI Features</h2>
            </div>
            
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Map size={18} color="var(--primary)" />
                <h3 style={{ fontSize: '16px', fontWeight: '700', margin: 0 }}>AI Cluster / Hotspot</h3>
              </div>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', margin: 0 }}>
                When multiple citizens report similar issues in the exact same area, the AI Engine groups them into a single "Cluster". This identifies major hotspots and prevents duplicate work assignments.
              </p>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Zap size={18} color="var(--warning)" />
                <h3 style={{ fontSize: '16px', fontWeight: '700', margin: 0 }}>Escalation Risk</h3>
              </div>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', margin: 0 }}>
                A predictive score (0-100%) determining how likely a cluster is to become a severe public hazard. It factors in complaint velocity (growth rate), duration unresolved, and geographic proximity to schools or hospitals.
              </p>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <ShieldCheck size={18} color="var(--success)" />
                <h3 style={{ fontSize: '16px', fontWeight: '700', margin: 0 }}>AI Verification</h3>
              </div>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', margin: 0 }}>
                When a worker finishes a task, they upload an "After" photo. The AI visually compares the "Before" and "After" photos to automatically verify the repair was completed.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer style={{ padding: '40px', textAlign: 'center', borderTop: '1px solid var(--border-light)', color: 'var(--text-secondary)', fontSize: '14px', marginTop: '60px' }}>
        © 2026 All rights reserved to Team Syntax Error-404.
      </footer>
    </div>
  );
}
