'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Hexagon } from 'lucide-react';

export default function RegisterPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(49,90,125,0.05) 1px, transparent 0)', backgroundSize: '28px 28px' }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '10px 20px', background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
              <Image src="/logo.png?v=2" alt="Logo" width={34} height={34} style={{ borderRadius: '8px' }} className="animate-float" />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)' }}>CivicLens</div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '500', letterSpacing: '0.06em', textTransform: 'uppercase' }}>AI Civic Intelligence</div>
              </div>
            </div>
          </Link>
        </div>

        <div className="card" style={{ padding: '32px' }}>
          <h1 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '4px' }}>Create Citizen Account</h1>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '24px' }}>Join CivicLens to report and track civic issues.</p>
          <div className="form-group"><label className="label">Full Name</label><input className="input" placeholder="Your full name" /></div>
          <div className="form-group"><label className="label">Mobile Number</label><input className="input" placeholder="+91 XXXXX XXXXX" /></div>
          <div className="form-group"><label className="label">Email address</label><input className="input" type="email" placeholder="you@example.com" /></div>
          <div className="form-group"><label className="label">Password</label><input className="input" type="password" placeholder="Create password" /></div>
          <div className="form-group">
            <label className="label">Preferred Language</label>
            <select className="input select">
              <option value="en">English</option>
              <option value="hi">हिंदी (Hindi)</option>
              <option value="bn">বাংলা (Bengali)</option>
            </select>
          </div>
          <Link href="/citizen/dashboard" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '11px', fontSize: '15px', display: 'flex' }}>Create Account →</Link>
        </div>
        <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '13px', color: 'var(--text-muted)' }}>
          Already have an account? <Link href="/login" style={{ color: 'var(--primary)', fontWeight: '600', textDecoration: 'none' }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
}
