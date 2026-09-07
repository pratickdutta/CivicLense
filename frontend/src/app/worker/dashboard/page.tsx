'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Camera, CheckCircle2, MapPin, Map, Play, ShieldAlert, Clock, ArrowLeft, Loader2, BrainCircuit } from 'lucide-react';

const TASKS = [
  {
    id: 1, complaint_number: 'CL10001',
    category: 'Road Infrastructure', subcategory: 'Pothole',
    address: 'Nagar Road near City School, Ward 14, Pune',
    latitude: 18.5536, longitude: 73.9243,
    priority: 'critical', priority_score: 91,
    status: 'in_progress', deadline: new Date(Date.now() + 6 * 3600000).toISOString(),
    description: 'Large pothole near school causing vehicle damage. Urgent repair needed.',
    department: 'Roads Department', sla_hours_remaining: 6,
    cluster_info: { title: 'Road Damage — Ward 14', count: 42, risk: 91 },
  },
  {
    id: 2, complaint_number: 'CL10025',
    category: 'Streetlights', subcategory: 'Light Not Working',
    address: 'Market Road, Ward 14, Pune',
    latitude: 18.5540, longitude: 73.9250,
    priority: 'high', priority_score: 68,
    status: 'assigned', deadline: new Date(Date.now() + 24 * 3600000).toISOString(),
    description: 'Three consecutive streetlights not working.',
    department: 'Electrical Department', sla_hours_remaining: 24,
    cluster_info: null,
  },
];

const PRIORITY_COLOR: Record<string, string> = { critical: 'var(--critical)', high: 'var(--warning)', medium: 'var(--primary)', low: 'var(--success)' };

export default function WorkerDashboard() {
  const [tasks, setTasks] = useState(TASKS);
  const [selected, setSelected] = useState<typeof TASKS[0] | null>(null);
  const [beforePhoto, setBeforePhoto] = useState<string | null>(null);
  const [afterPhoto, setAfterPhoto] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [completing, setCompleting] = useState(false);
  const [completed, setCompleted] = useState<number[]>([]);

  const handleComplete = (taskId: number) => {
    setCompleting(true);
    setTimeout(() => {
      setCompleted(p => [...p, taskId]);
      setCompleting(false);
      setSelected(null);
    }, 1500);
  };

  const handlePhotoUpload = (type: 'before' | 'after') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      if (type === 'before') setBeforePhoto(url);
      else setAfterPhoto(url);
    }
  };

  if (selected) {
    const isCompleted = completed.includes(selected.id);
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', fontFamily: 'var(--font-main)' }}>
        <div style={{ background: 'var(--primary)', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={() => setSelected(null)} style={{ color: 'rgba(255,255,255,0.8)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}><ArrowLeft size={20} className="lucide-icon" /></button>
          <div style={{ color: '#fff', fontWeight: '700', fontSize: '16px' }}>Task #{selected.complaint_number}</div>
          <span className={`badge badge-${selected.priority}`} style={{ marginLeft: 'auto' }}>{selected.priority}</span>
        </div>

        <div style={{ maxWidth: '480px', margin: '0 auto', padding: '20px 16px 40px' }}>
          {isCompleted ? (
            <div className="card" style={{ textAlign: 'center', padding: '36px' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}><CheckCircle2 size={48} className="lucide-icon text-success animate-float" /></div>
              <div style={{ fontWeight: '800', fontSize: '18px', marginBottom: '8px' }}>Task Completed!</div>
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px' }}>Evidence submitted. Awaiting officer approval.</div>
              <div style={{ background: 'var(--insight-light)', border: '1px solid var(--insight)', borderRadius: '8px', padding: '12px', fontSize: '13px', color: 'var(--insight)', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <BrainCircuit size={16} className="lucide-icon" /> AI Verification Score: 92% visual change detected
              </div>
              <button onClick={() => setSelected(null)} className="btn btn-primary" style={{ justifyContent: 'center', width: '100%', display: 'flex', alignItems: 'center', gap: '6px' }}><ArrowLeft size={16} className="lucide-icon" /> Back to Tasks</button>
            </div>
          ) : (
            <>
              {/* SLA Warning */}
              {selected.sla_hours_remaining <= 8 && (
                <div style={{ background: 'var(--critical-light)', border: '1.5px solid var(--critical)', borderRadius: '10px', padding: '12px 14px', marginBottom: '16px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <span style={{ display: 'flex', alignItems: 'center', color: 'var(--critical)' }}><Clock size={20} className="lucide-icon animate-pulse" /></span>
                  <div>
                    <div style={{ fontWeight: '700', color: 'var(--critical)', fontSize: '13px' }}>SLA Alert — {selected.sla_hours_remaining}h remaining</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Complete before {new Date(selected.deadline).toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })}</div>
                  </div>
                </div>
              )}

              {/* Task Details */}
              <div className="card" style={{ marginBottom: '16px' }}>
                <div style={{ fontWeight: '700', fontSize: '15px', marginBottom: '12px' }}>Task Details</div>
                <div style={{ fontSize: '14px', color: 'var(--text-main)', lineHeight: '1.6', padding: '10px', background: 'var(--bg)', borderRadius: '8px', marginBottom: '12px' }}>
                  {selected.description}
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={14} className="lucide-icon" /> {selected.address}</div>
                <a href={`https://maps.google.com/?q=${selected.latitude},${selected.longitude}`} target="_blank" rel="noopener noreferrer"
                  className="btn btn-secondary btn-sm" style={{ gap: '6px', display: 'inline-flex', alignItems: 'center' }}>
                  <Map size={14} className="lucide-icon" /> Open in Google Maps
                </a>

                {selected.cluster_info && (
                  <div style={{ marginTop: '12px', padding: '10px 12px', background: 'var(--critical-light)', border: '1px solid var(--critical)', borderRadius: '8px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ShieldAlert size={14} className="lucide-icon text-critical animate-pulse" />
                    <div><strong style={{ color: 'var(--critical)' }}>Part of Issue Cluster:</strong> {selected.cluster_info.title}
                    <span style={{ color: 'var(--text-secondary)', marginLeft: '6px' }}>· {selected.cluster_info.count} complaints · {selected.cluster_info.risk}% risk</span></div>
                  </div>
                )}
              </div>

              {/* Evidence Upload */}
              <div className="card" style={{ marginBottom: '16px' }}>
                <div style={{ fontWeight: '700', fontSize: '15px', marginBottom: '14px' }}>Evidence Upload</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
                  {(['before', 'after'] as const).map(type => (
                    <div key={type}>
                      <label className="label">{type === 'before' ? 'Before Photo' : 'After Photo'}</label>
                      <div style={{ border: '1.5px dashed var(--border-light)', borderRadius: '10px', overflow: 'hidden', cursor: 'pointer', position: 'relative', height: '120px', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '4px' }}>
                        {(type === 'before' ? beforePhoto : afterPhoto) ? (
                          <img src={type === 'before' ? beforePhoto! : afterPhoto!} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <>
                            <div style={{ display: 'flex', justifyContent: 'center' }}>{type === 'before' ? <Camera size={24} className="lucide-icon text-muted" /> : <CheckCircle2 size={24} className="lucide-icon text-muted" />}</div>
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>{type === 'before' ? 'Upload Before' : 'Upload After'}</span>
                          </>
                        )}
                        <input type="file" accept="image/*" onChange={handlePhotoUpload(type)}
                          style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="form-group">
                  <label className="label">Work Notes</label>
                  <textarea className="input" rows={2} placeholder="Describe the work done..."
                    value={notes} onChange={e => setNotes(e.target.value)}
                    style={{ resize: 'none' }} />
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button className="btn btn-primary" style={{ justifyContent: 'center', padding: '12px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '15px' }}
                  onClick={() => handleComplete(selected.id)} disabled={completing}>
                  {completing ? <><Loader2 size={18} className="lucide-icon animate-spin-slow" /> Submitting evidence...</> : <><CheckCircle2 size={18} className="lucide-icon" /> Mark Complete & Submit Evidence</>}
                </button>
                {selected.status === 'assigned' && (
                  <button className="btn btn-secondary" style={{ justifyContent: 'center', padding: '12px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '15px', border: '2px solid #000' }}
                    onClick={() => {
                      setTasks(ts => ts.map(t => t.id === selected.id ? {...t, status: 'in_progress'} : t));
                      setSelected(s => s ? {...s, status: 'in_progress'} : null);
                    }}>
                    <Play size={18} className="lucide-icon" /> Accept Task & Start Work
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', fontFamily: 'var(--font-main)' }}>
      {/* Header */}
      <div style={{ background: 'var(--primary)', padding: '20px 20px 24px' }}>
        <div style={{ maxWidth: '480px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ color: '#fff', fontWeight: '800', fontSize: '18px' }}>CivicLens</div>
            <span style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', padding: '3px 10px', borderRadius: '100px', fontSize: '11px', fontWeight: '700' }}>FIELD WORKER</span>
          </div>
          <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: '12px' }}>Welcome,</div>
          <div style={{ color: '#fff', fontWeight: '800', fontSize: '20px', letterSpacing: '-0.02em' }}>Vijay Singh</div>
        </div>
      </div>

      <div style={{ maxWidth: '480px', margin: '-12px auto 0', padding: '0 16px 40px', position: 'relative' }}>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '20px' }}>
          {[
            { label: 'Today', value: tasks.length, color: 'var(--primary)' },
            { label: 'Completed', value: completed.length, color: 'var(--success)' },
            { label: 'Pending', value: tasks.length - completed.length, color: 'var(--warning)' },
          ].map(s => (
            <div key={s.label} className="card card-sm" style={{ textAlign: 'center', padding: '14px' }}>
              <div style={{ fontSize: '24px', fontWeight: '900', color: s.color, letterSpacing: '-0.03em' }}>{s.value}</div>
              <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '2px' }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ fontWeight: '700', fontSize: '15px', marginBottom: '12px' }}>My Assigned Tasks</div>

        {tasks.map(task => {
          const done = completed.includes(task.id);
          const hoursLeft = task.sla_hours_remaining;
          return (
            <div key={task.id} className="card" style={{ marginBottom: '12px', borderLeft: `4px solid ${done ? 'var(--success)' : PRIORITY_COLOR[task.priority]}`, opacity: done ? 0.7 : 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <div>
                  <span className={`badge badge-${done ? 'resolved' : task.priority}`} style={{ marginBottom: '6px' }}>{done ? 'completed' : task.priority}</span>
                  <div style={{ fontWeight: '700', fontSize: '14px', color: 'var(--text-main)' }}>{task.category}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>#{task.complaint_number} · {task.subcategory}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '11px', fontWeight: '700', color: hoursLeft <= 8 ? 'var(--critical)' : 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {done ? 'Done ✓' : `${hoursLeft}h left`}
                  </div>
                </div>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={12} className="lucide-icon" /> {task.address}</div>
              {!done && (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="btn btn-primary btn-sm" onClick={() => setSelected(task)}>View Task →</button>
                  <a href={`https://maps.google.com/?q=${task.latitude},${task.longitude}`} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Map size={14} className="lucide-icon" /> Navigate</a>
                </div>
              )}
            </div>
          );
        })}

        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <Link href="/login" style={{ fontSize: '13px', color: 'var(--text-muted)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}><ArrowLeft size={14} className="lucide-icon" /> Sign Out</Link>
        </div>
      </div>
    </div>
  );
}
