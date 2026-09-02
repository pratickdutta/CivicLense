'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Building2, ShieldCheck, ClipboardCheck, Wrench, User, Hexagon } from 'lucide-react';

const DEMO_CREDENTIALS = [
  { role: 'Admin', email: 'admin@civiclens.gov', password: 'admin123', icon: <Building2 size={18} />, color: 'var(--primary)', route: '/admin/dashboard' },
  { role: 'Officer', email: 'officer@civiclens.gov', password: 'officer123', icon: <ShieldCheck size={18} />, color: 'var(--secondary)', route: '/admin/dashboard' },
  { role: 'Supervisor', email: 'supervisor@civiclens.gov', password: 'supervisor123', icon: <ClipboardCheck size={18} />, color: 'var(--insight)', route: '/admin/dashboard' },
  { role: 'Field Worker', email: 'worker@civiclens.gov', password: 'worker123', icon: <Wrench size={18} />, color: 'var(--warning)', route: '/worker/dashboard' },
  { role: 'Citizen', email: 'citizen@civiclens.gov', password: 'citizen123', icon: <User size={18} />, color: 'var(--success)', route: '/citizen/dashboard' },
];

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error('Invalid credentials');
      const data = await res.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      const route = data.user.role === 'citizen' ? '/citizen/dashboard'
        : data.user.role === 'worker' ? '/worker/dashboard'
        : '/admin/dashboard';
      router.push(route);
    } catch (err) {
      // For demo: check local credentials
      const cred = DEMO_CREDENTIALS.find(c => c.email === email && c.password === password);
      if (cred) {
        const user = { name: cred.role + ' User', email, role: cred.role.toLowerCase().replace(' ', '') };
        localStorage.setItem('user', JSON.stringify(user));
        router.push(cred.route);
      } else {
        setError('Invalid credentials. Use demo credentials below.');
      }
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = (cred: typeof DEMO_CREDENTIALS[0]) => {
    setEmail(cred.email);
    setPassword(cred.password);
    const user = { name: cred.role + ' User', email: cred.email, role: cred.role.toLowerCase().replace(' ', '') };
    localStorage.setItem('user', JSON.stringify(user));
    router.push(cred.route);
  };

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '40px 20px',
      backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(49,90,125,0.05) 1px, transparent 0)',
      backgroundSize: '28px 28px',
    }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '10px',
              padding: '10px 20px', background: 'var(--surface)',
              border: '1.5px solid var(--border)', borderRadius: '12px',
              boxShadow: 'var(--shadow-sm)',
            }}>
              <div className="app-logo" style={{
                width: '34px', height: '34px', background: 'var(--primary)',
                borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff',
              }}><Hexagon size={20} fill="currentColor" className="lucide-icon animate-float" /></div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)', lineHeight: '1' }}>CivicLens</div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '500', letterSpacing: '0.06em', textTransform: 'uppercase' }}>AI Civic Intelligence</div>
              </div>
            </div>
          </Link>
        </div>

        {/* Login Card */}
        <div className="card" style={{ padding: '32px' }}>
          <h1 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '4px', letterSpacing: '-0.02em' }}>Welcome back</h1>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '24px' }}>Sign in to your CivicLens account</p>

          {error && (
            <div style={{
              background: 'var(--critical-light)', border: '1px solid var(--critical)',
              borderRadius: '8px', padding: '10px 14px', marginBottom: '16px',
              fontSize: '13px', color: 'var(--critical)', fontWeight: '500',
            }}>{error}</div>
          )}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="label">Email address</label>
              <input className="input" type="email" placeholder="you@example.com"
                value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="label">Password</label>
              <input className="input" type="password" placeholder="Enter password"
                value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <button className="btn btn-primary w-full" type="submit" disabled={loading}
              style={{ width: '100%', justifyContent: 'center', padding: '11px', fontSize: '15px' }}>
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>

          <div className="divider" style={{ margin: '24px 0', position: 'relative', textAlign: 'center' }}>
            <span style={{ position: 'relative', zIndex: 1, background: 'var(--surface)', padding: '0 12px', fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Quick Demo Login
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {DEMO_CREDENTIALS.map(cred => (
              <button key={cred.role} onClick={() => quickLogin(cred)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '9px 14px', background: 'var(--bg)',
                  border: '1.5px solid var(--border-light)', borderRadius: '8px',
                  cursor: 'pointer', fontSize: '13px', fontWeight: '500',
                  color: 'var(--text-main)', transition: 'all 0.12s ease',
                  textAlign: 'left',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--primary)'; (e.currentTarget as HTMLButtonElement).style.background = 'var(--surface)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border-light)'; (e.currentTarget as HTMLButtonElement).style.background = 'var(--bg)'; }}
              >
                <span className="lucide-icon" style={{ display: 'flex', alignItems: 'center', color: cred.color }}>{cred.icon}</span>
                <div>
                  <span style={{ fontWeight: '700', color: cred.color }}>{cred.role}</span>
                  <span style={{ color: 'var(--text-muted)', marginLeft: '6px' }}>{cred.email}</span>
                </div>
                <span style={{ marginLeft: 'auto', fontSize: '11px', color: 'var(--text-muted)' }}>→</span>
              </button>
            ))}
          </div>
        </div>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: 'var(--text-muted)' }}>
          New citizen?{' '}
          <Link href="/register" style={{ color: 'var(--primary)', fontWeight: '600', textDecoration: 'none' }}>
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}
