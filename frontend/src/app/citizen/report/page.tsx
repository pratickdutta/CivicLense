'use client';
import { useState, useRef, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Type, Mic, Camera, MapPin, CheckCircle2, Diamond, Map, ArrowLeft, ArrowRight, Loader2, Square, Search } from 'lucide-react';

const API = 'http://localhost:8000';

const CATEGORIES = ['Road Infrastructure', 'Garbage & Sanitation', 'Water Supply', 'Drainage', 'Streetlights', 'Public Infrastructure', 'Traffic', 'Other'];

const WARDS = [
  { id: 1, name: 'Shivajinagar' }, { id: 2, name: 'Kothrud' }, { id: 3, name: 'Hadapsar' },
  { id: 4, name: 'Yerawada' }, { id: 5, name: 'Bibwewadi' }, { id: 6, name: 'Wanowrie' },
  { id: 7, name: 'Aundh' }, { id: 8, name: 'Baner' }, { id: 9, name: 'Pimple Saudagar' },
  { id: 10, name: 'Wakad' }, { id: 14, name: 'Nagar Road' }, { id: 17, name: 'Deccan' },
  { id: 18, name: 'Camp' },
];

function ReportPageContent() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [wardId, setWardId] = useState(14);
  const [address, setAddress] = useState('Nagar Road, Pune');
  const [lat, setLat] = useState(18.5536);
  const [lng, setLng] = useState(73.9243);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [voiceText, setVoiceText] = useState('');
  const [aiResult, setAiResult] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<any>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  // Voice recording
  const startVoice = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) { alert('Voice recognition not supported in this browser. Use Chrome.'); return; }
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.lang = 'en-IN';
    recognitionRef.current.continuous = true;
    recognitionRef.current.onresult = (e: any) => {
      const text = Array.from(e.results).map((r: any) => r[0].transcript).join(' ');
      setVoiceText(text);
      setDescription(text);
    };
    recognitionRef.current.start();
    setIsRecording(true);
  };
  const stopVoice = () => {
    if (recognitionRef.current) { recognitionRef.current.stop(); setIsRecording(false); }
  };

  // Image upload
  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).slice(0, 5);
    setImages(files);
    setImagePreviews(files.map(f => URL.createObjectURL(f)));
  };

  // Get location
  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(pos => {
      setLat(pos.coords.latitude);
      setLng(pos.coords.longitude);
      setAddress(`${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`);
    }, () => { setAddress('Location unavailable — using default'); });
  };

  // AI classify in real-time
  useEffect(() => {
    if (description.length < 10) { setAiResult(null); return; }
    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(`${API}/api/ai/classify?text=${encodeURIComponent(description)}`);
        if (res.ok) setAiResult(await res.json());
        else setAiResult(mockAI(description));
      } catch {
        setAiResult(mockAI(description));
      }
    }, 600);
    return () => clearTimeout(timeout);
  }, [description]);

  const mockAI = (text: string) => {
    const t = text.toLowerCase();
    const cat = t.includes('pothole') || t.includes('road') ? 'Road Infrastructure' :
      t.includes('garbage') || t.includes('waste') ? 'Garbage & Sanitation' :
      t.includes('water') ? 'Water Supply' :
      t.includes('light') ? 'Streetlights' : 'Other';
    const severity = t.includes('dangerous') || t.includes('urgent') || t.includes('accident') ? 'critical' :
      t.includes('large') || t.includes('major') ? 'high' : 'medium';
    return { category: cat, subcategory: cat === 'Road Infrastructure' ? 'Pothole' : cat, severity, department_name: 'Roads', ai_confidence: 0.89, priority_score: severity === 'critical' ? 88 : severity === 'high' ? 68 : 50 };
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch(`${API}/api/complaints`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description, category: category || aiResult?.category, latitude: lat, longitude: lng, address, ward_id: wardId }),
      });
      if (res.ok) {
        const data = await res.json();
        setSubmitted(data);
      } else throw new Error();
    } catch {
      setSubmitted({ complaint_number: `CL${Math.floor(Math.random() * 99999).toString().padStart(5, '0')}`, ai_analysis: aiResult, message: 'Complaint submitted (demo mode)' });
    } finally {
      setSubmitting(false);
    }
  };

  const SEVERITY_COLOR: Record<string, string> = { critical: 'var(--critical)', high: 'var(--warning)', medium: 'var(--primary)', low: 'var(--success)' };

  if (submitted) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
        <div style={{ maxWidth: '480px', width: '100%', textAlign: 'center' }}>
          <div className="card" style={{ padding: '36px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}><CheckCircle2 size={48} className="lucide-icon text-success animate-float" /></div>
            <h1 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '8px', letterSpacing: '-0.02em' }}>Complaint Submitted!</h1>
            <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Your complaint has been registered and classified by AI.
            </div>
            <div style={{ background: 'var(--bg)', border: '1.5px solid var(--border)', borderRadius: '10px', padding: '16px', marginBottom: '20px' }}>
              <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '4px' }}>Tracking Number</div>
              <div style={{ fontSize: '24px', fontWeight: '900', color: 'var(--primary)', letterSpacing: '-0.02em' }}>#{submitted.complaint_number}</div>
            </div>
            {submitted.ai_analysis && (
              <div style={{ textAlign: 'left', marginBottom: '20px' }}>
                <div style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-muted)', marginBottom: '10px' }}>AI Classification</div>
                {[
                  ['Category', submitted.ai_analysis.category],
                  ['Severity', submitted.ai_analysis.severity],
                  ['Department', submitted.ai_analysis.department_name],
                  ['AI Confidence', `${Math.round((submitted.ai_analysis.ai_confidence || 0.89) * 100)}%`],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-subtle)', fontSize: '13px' }}>
                    <span style={{ color: 'var(--text-muted)', fontWeight: '600' }}>{k}</span>
                    <span style={{ fontWeight: '700', color: k === 'Severity' ? SEVERITY_COLOR[String(v)] || 'var(--text-main)' : 'var(--text-main)' }}>{String(v)}</span>
                  </div>
                ))}
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Link href="/citizen/dashboard" className="btn btn-primary" style={{ justifyContent: 'center' }}>Track Complaint →</Link>
              <button onClick={() => { setSubmitted(null); setDescription(''); setStep(1); setImages([]); setImagePreviews([]); setAiResult(null); }}
                className="btn btn-secondary" style={{ justifyContent: 'center' }}>Submit Another</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', fontFamily: 'var(--font-main)' }}>
      {/* Header */}
      <div style={{ background: 'var(--primary)', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Link href="/citizen/dashboard" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', display: 'flex', alignItems: 'center' }}><ArrowLeft size={20} className="lucide-icon" /></Link>
        <div style={{ color: '#fff', fontWeight: '700', fontSize: '16px' }}>Report a Civic Issue</div>
      </div>

      {/* Step Progress */}
      <div style={{ background: 'var(--surface)', padding: '14px 20px', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', gap: '8px', maxWidth: '480px', margin: '0 auto' }}>
          {[1, 2, 3].map(s => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', flex: s < 3 ? 1 : 'none' }}>
              <div style={{
                width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
                background: s <= step ? 'var(--primary)' : 'var(--bg)',
                border: `2px solid ${s <= step ? 'var(--primary)' : 'var(--border-light)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '12px', fontWeight: '800', color: s <= step ? '#fff' : 'var(--text-muted)',
              }}>{s < step ? <CheckCircle2 size={14} className="lucide-icon" /> : s}</div>
              {s < 3 && <div style={{ flex: 1, height: '2px', background: s < step ? 'var(--primary)' : 'var(--border-light)', margin: '0 6px' }} />}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: '480px', margin: '4px auto 0' }}>
          {['Describe', 'Location', 'Review'].map(l => (
            <span key={l} style={{ fontSize: '10px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{l}</span>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: '480px', margin: '0 auto', padding: '20px 16px 40px' }}>
        {step === 1 && (
          <div className="animate-fade">
            <div style={{ fontWeight: '800', fontSize: '18px', marginBottom: '4px' }}>What civic problem would you like to report?</div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px' }}>You can submit in under 60 seconds.</div>

            {/* Input modes */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '16px' }}>
              {[
                { mode: 'text', icon: <Type size={20} className="lucide-icon text-primary" />, label: 'Type' },
                { mode: 'voice', icon: <Mic size={20} className="lucide-icon text-primary" />, label: 'Voice' },
                { mode: 'photo', icon: <Camera size={20} className="lucide-icon text-primary" />, label: 'Photo' },
              ].map(m => (
                <button key={m.mode} className="btn btn-secondary btn-sm" style={{ flexDirection: 'column', gap: '4px', padding: '12px 8px', height: 'auto', justifyContent: 'center', fontSize: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'center' }}>{m.icon}</div>{m.label}
                </button>
              ))}
            </div>

            {/* Voice */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <button onClick={isRecording ? stopVoice : startVoice}
                  className={`btn btn-sm ${isRecording ? 'btn-danger' : 'btn-secondary'}`}
                  style={{ gap: '6px', display: 'flex', alignItems: 'center' }}>
                  {isRecording ? <><Square size={14} className="lucide-icon" /> Stop Recording</> : <><Mic size={14} className="lucide-icon" /> Start Voice Input</>}
                </button>
                {isRecording && <span style={{ fontSize: '12px', color: 'var(--critical)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }} className="animate-pulse">● Recording...</span>}
              </div>
            </div>

            {/* Text description */}
            <div className="form-group">
              <label className="label">Describe the problem</label>
              <textarea className="input" rows={4} placeholder="e.g. There is a large pothole near the school on Nagar Road. It is causing vehicle damage and is very dangerous for school buses..."
                value={description} onChange={e => setDescription(e.target.value)}
                style={{ resize: 'vertical', minHeight: '100px' }} />
              {voiceText && <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}><Mic size={12} className="lucide-icon" /> Voice transcript applied</div>}
            </div>

            {/* Image upload */}
            <div className="form-group">
              <label className="label">Add Photos (optional, up to 5)</label>
              <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleImages} style={{ display: 'none' }} />
              <button className="btn btn-secondary btn-sm" onClick={() => fileRef.current?.click()} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Camera size={14} className="lucide-icon" /> Upload Photos</button>
              {imagePreviews.length > 0 && (
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
                  {imagePreviews.map((p, i) => (
                    <div key={i} style={{ width: '72px', height: '72px', borderRadius: '8px', overflow: 'hidden', border: '1.5px solid var(--border-light)' }}>
                      <img src={p} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="label">Category (optional, AI will detect)</label>
              <select className="input select" value={category} onChange={e => setCategory(e.target.value)}>
                <option value="">AI will classify automatically...</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* AI Preview */}
            {aiResult && description.length >= 10 && (
              <div style={{ background: 'var(--insight-light)', border: '1.5px solid var(--insight)', borderRadius: '10px', padding: '12px 14px', marginBottom: '16px' }}>
                <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--insight)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}><Diamond size={10} fill="currentColor" className="lucide-icon animate-pulse" /> AI CLASSIFICATION PREVIEW</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {[['Category', aiResult.category], ['Severity', aiResult.severity], ['Department', aiResult.department_name], ['Confidence', `${Math.round((aiResult.ai_confidence || 0.89) * 100)}%`]].map(([k, v]) => (
                    <div key={k}>
                      <div style={{ fontSize: '10px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{k}</div>
                      <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-main)' }}>{String(v)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
              onClick={() => setStep(2)} disabled={description.length < 5}>
              Next: Add Location →
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade">
            <div style={{ fontWeight: '800', fontSize: '18px', marginBottom: '4px' }}>Where is the problem?</div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px' }}>GPS, map, or describe the location.</div>

            <div className="form-group">
              <label className="label">Ward</label>
              <select className="input select" value={wardId} onChange={e => setWardId(Number(e.target.value))}>
                {WARDS.map(w => <option key={w.id} value={w.id}>Ward {w.id} — {w.name}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="label">Address / Landmark</label>
              <input className="input" value={address} onChange={e => setAddress(e.target.value)} placeholder="Describe the location..." />
            </div>

            <button className="btn btn-secondary btn-sm" onClick={getLocation} style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MapPin size={14} className="lucide-icon" /> Use My GPS Location
            </button>

            {/* Static map placeholder */}
            <div style={{ background: 'var(--bg)', border: '1.5px solid var(--border-light)', borderRadius: '12px', height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'center' }}><Map size={32} className="lucide-icon text-muted" /></div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '500' }}>{lat.toFixed(4)}, {lng.toFixed(4)}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Ward {wardId} · {WARDS.find(w => w.id === wardId)?.name}</div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn btn-secondary" onClick={() => setStep(1)} style={{ flex: 1, justifyContent: 'center' }}>← Back</button>
              <button className="btn btn-primary" onClick={() => setStep(3)} style={{ flex: 2, justifyContent: 'center' }}>Next: Review →</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-fade">
            <div style={{ fontWeight: '800', fontSize: '18px', marginBottom: '16px' }}>Review & Submit</div>

            <div className="card" style={{ marginBottom: '16px' }}>
              <div style={{ fontWeight: '700', fontSize: '14px', marginBottom: '12px' }}>Your Complaint</div>
              <div style={{ fontSize: '14px', color: 'var(--text-main)', background: 'var(--bg)', borderRadius: '8px', padding: '12px', marginBottom: '12px', lineHeight: '1.55' }}>
                "{description}"
              </div>
              {imagePreviews.length > 0 && (
                <div style={{ display: 'flex', gap: '6px', marginBottom: '12px', flexWrap: 'wrap' }}>
                  {imagePreviews.map((p, i) => (
                    <img key={i} src={p} alt="" style={{ width: '60px', height: '60px', borderRadius: '6px', objectFit: 'cover', border: '1px solid var(--border-light)' }} />
                  ))}
                </div>
              )}
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={14} className="lucide-icon" /> {address}</div>
            </div>

            {aiResult && (
              <div style={{ background: 'var(--insight-light)', border: '1.5px solid var(--insight)', borderRadius: '10px', padding: '14px', marginBottom: '16px' }}>
                <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--insight)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '4px' }}><Diamond size={10} fill="currentColor" className="lucide-icon animate-pulse" /> AI WILL CLASSIFY AS</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  {[['Category', aiResult.category], ['Severity', aiResult.severity], ['Department', aiResult.department_name], ['Confidence', `${Math.round((aiResult.ai_confidence || 0.89) * 100)}%`]].map(([k, v]) => (
                    <div key={k} style={{ background: 'var(--surface)', borderRadius: '6px', padding: '8px 10px' }}>
                      <div style={{ fontSize: '10px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '2px' }}>{k}</div>
                      <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-main)' }}>{String(v)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn btn-secondary" onClick={() => setStep(2)} style={{ flex: 1, justifyContent: 'center' }}>← Back</button>
              <button className="btn btn-primary" onClick={handleSubmit} disabled={submitting} style={{ flex: 2, justifyContent: 'center', padding: '12px' }}>
                {submitting ? <><Loader2 size={14} className="lucide-icon animate-spin-slow" /> Submitting...</> : <><CheckCircle2 size={14} className="lucide-icon" /> Submit Complaint</>}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ReportPage() {
  return (
    <Suspense fallback={<div style={{ padding: '40px', textAlign: 'center', fontFamily: 'var(--font-main)' }}>Loading...</div>}>
      <ReportPageContent />
    </Suspense>
  );
}
