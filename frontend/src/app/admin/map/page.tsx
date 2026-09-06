'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Diamond, ArrowRight, ClipboardList, BarChart3, Zap } from 'lucide-react';

const CLUSTERS = [
  { id: 1, title: 'Road Damage — Ward 14', lat: 18.5536, lng: 73.9243, category: 'Road Infrastructure', severity: 'critical', risk_score: 91, complaint_count: 42, growth_rate: 64, ward_name: 'Nagar Road' },
  { id: 2, title: 'Garbage Overflow — Ward 8', lat: 18.5590, lng: 73.7868, category: 'Garbage & Sanitation', severity: 'high', risk_score: 72, complaint_count: 28, growth_rate: 35, ward_name: 'Baner' },
  { id: 3, title: 'Streetlight Failure — Ward 3', lat: 18.5018, lng: 73.9260, category: 'Streetlights', severity: 'high', risk_score: 67, complaint_count: 18, growth_rate: 22, ward_name: 'Hadapsar' },
  { id: 4, title: 'Pothole Cluster — Ward 2', lat: 18.5074, lng: 73.8077, category: 'Road Infrastructure', severity: 'high', risk_score: 63, complaint_count: 19, growth_rate: 28, ward_name: 'Kothrud' },
  { id: 5, title: 'Water Leakage — Ward 7', lat: 18.5590, lng: 73.8070, category: 'Water Supply', severity: 'medium', risk_score: 48, complaint_count: 12, growth_rate: 15, ward_name: 'Aundh' },
];

const SEVERITY_COLOR: Record<string, string> = { critical: '#B95C5C', high: '#C58A32', medium: '#315A7D', low: '#4F8A68' };

export default function CivicMapPage() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<typeof CLUSTERS[0] | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Use MapLibre GL for the map
    let map: any;
    const loadMap = async () => {
      try {
        const maplibre = await import('maplibre-gl');
        await import('maplibre-gl/dist/maplibre-gl.css' as any);

        if (!mapRef.current) return;

        map = new maplibre.Map({
          container: mapRef.current,
          style: {
            version: 8,
            sources: {
              'osm': {
                type: 'raster',
                tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
                tileSize: 256,
                attribution: '© OpenStreetMap contributors',
              }
            },
            layers: [{ id: 'osm-tiles', type: 'raster', source: 'osm', minzoom: 0, maxzoom: 19 }]
          },
          center: [73.8567, 18.5204],
          zoom: 12,
        });

        map.on('load', () => {
          setMapLoaded(true);

          // Add cluster markers
          CLUSTERS.forEach(cluster => {
            const wrapper = document.createElement('div');
            
            const el = document.createElement('div');
            el.style.cssText = `
              width: ${Math.max(40, cluster.complaint_count * 0.8)}px;
              height: ${Math.max(40, cluster.complaint_count * 0.8)}px;
              border-radius: 50%;
              background: ${SEVERITY_COLOR[cluster.severity]}22;
              border: 3px solid ${SEVERITY_COLOR[cluster.severity]};
              display: flex; align-items: center; justify-content: center;
              cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.2);
              font-weight: 800; font-size: 13px; color: ${SEVERITY_COLOR[cluster.severity]};
              font-family: Inter, sans-serif;
              transition: transform 0.15s ease;
            `;
            el.textContent = String(cluster.complaint_count);
            
            wrapper.appendChild(el);
            
            wrapper.onmouseenter = () => { el.style.transform = 'scale(1.15)'; };
            wrapper.onmouseleave = () => { el.style.transform = 'scale(1)'; };
            wrapper.onclick = () => setSelected(cluster);

            new maplibre.Marker({ element: wrapper })
              .setLngLat([cluster.lng, cluster.lat])
              .addTo(map);
          });
        });
      } catch (e) {
        console.error('Map failed to load:', e);
        setMapLoaded(true); // Show fallback
      }
    };

    loadMap();
    return () => { if (map) map.remove(); };
  }, []);

  const filteredClusters = filter === 'all' ? CLUSTERS : CLUSTERS.filter(c => c.severity === filter);

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">Civic Intelligence Map</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Geographic view of civic problems · {CLUSTERS.length} active hotspots</div>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <select className="input select" style={{ width: '140px', fontSize: '13px' }} value={filter} onChange={e => setFilter(e.target.value)}>
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
          </select>
        </div>
      </div>

      <div style={{ position: 'relative', height: 'calc(100vh - 73px)', display: 'flex' }}>
        {/* Map */}
        <div style={{ flex: 1, position: 'relative' }}>
          <div ref={mapRef} style={{ width: '100%', height: '100%' }} />

          {/* Legend */}
          <div style={{
            position: 'absolute', bottom: '20px', left: '20px',
            background: 'var(--surface)', border: '1.5px solid var(--border)',
            borderRadius: '10px', padding: '12px 16px', boxShadow: 'var(--shadow-sm)',
            zIndex: 10,
          }}>
            <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '8px', color: 'var(--text-muted)' }}>Severity Legend</div>
            {['critical', 'high', 'medium', 'low'].map(s => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: SEVERITY_COLOR[s] }} />
                <span style={{ fontSize: '12px', fontWeight: '600', textTransform: 'capitalize' }}>{s}</span>
              </div>
            ))}
          </div>

          {/* Cluster count overlay */}
          <div style={{
            position: 'absolute', top: '16px', left: '16px',
            background: 'rgba(255,255,255,0.95)', border: '1.5px solid var(--border)',
            borderRadius: '10px', padding: '10px 14px', boxShadow: 'var(--shadow-sm)',
            zIndex: 10, backdropFilter: 'blur(8px)',
          }}>
            <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '4px' }}>Active Hotspots</div>
            <div style={{ fontSize: '24px', fontWeight: '900', color: 'var(--critical)', letterSpacing: '-0.03em' }}>{CLUSTERS.length}</div>
          </div>
        </div>

        {/* Sidebar */}
        <div style={{
          width: '340px', background: 'var(--surface)', borderLeft: '1.5px solid var(--border)',
          overflowY: 'auto', display: 'flex', flexDirection: 'column',
        }}>
          {/* Selected cluster */}
          {selected ? (
            <div style={{ padding: '16px', borderBottom: '1.5px solid var(--border-subtle)' }}>
              <button onClick={() => setSelected(null)} style={{ fontSize: '12px', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <ArrowLeft size={14} className="lucide-icon" /> Back to all hotspots
              </button>
              <div style={{ borderLeft: `4px solid ${SEVERITY_COLOR[selected.severity]}`, paddingLeft: '12px' }}>
                <div style={{ fontSize: '11px', fontWeight: '700', color: SEVERITY_COLOR[selected.severity], textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Diamond size={10} fill="currentColor" className="lucide-icon animate-pulse" /> CIVIC INSIGHT · {selected.severity.toUpperCase()}
                </div>
                <div style={{ fontWeight: '700', fontSize: '15px', marginBottom: '12px' }}>{selected.title}</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '14px' }}>
                  {[
                    ['Complaints', selected.complaint_count], ['Risk Score', `${selected.risk_score}%`],
                    ['Growth', `+${selected.growth_rate}%`], ['Category', selected.category],
                  ].map(([k, v]) => (
                    <div key={String(k)} style={{ background: 'var(--bg)', borderRadius: '6px', padding: '8px 10px' }}>
                      <div style={{ fontSize: '10px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{k}</div>
                      <div style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-main)', marginTop: '2px' }}>{v}</div>
                    </div>
                  ))}
                </div>
                <div style={{ marginBottom: '14px' }}>
                  <div style={{ fontSize: '11px', fontWeight: '700', color: SEVERITY_COLOR[selected.severity], letterSpacing: '0.06em', marginBottom: '4px' }}>ESCALATION RISK</div>
                  <div className="risk-bar-container">
                    <div className={`risk-bar ${selected.severity}`} style={{ width: `${selected.risk_score}%` }} />
                  </div>
                </div>
                <Link href={`/admin/intelligence?cluster=${selected.id}`} className="btn btn-primary btn-sm" style={{ width: '100%', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  Full Intelligence Report <ArrowRight size={14} className="lucide-icon" />
                </Link>
              </div>
            </div>
          ) : (
            <div style={{ padding: '14px 16px', borderBottom: '1.5px solid var(--border-subtle)' }}>
              <div style={{ fontWeight: '700', fontSize: '14px' }}>Civic Hotspots</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Click map markers or select below</div>
            </div>
          )}

          {/* Cluster list */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
            {filteredClusters.map(c => (
              <div key={c.id}
                onClick={() => setSelected(c)}
                style={{
                  padding: '12px 14px', borderRadius: '10px', marginBottom: '8px',
                  borderTop: `1.5px solid ${selected?.id === c.id ? SEVERITY_COLOR[c.severity] : 'var(--border-light)'}`,
                  borderRight: `1.5px solid ${selected?.id === c.id ? SEVERITY_COLOR[c.severity] : 'var(--border-light)'}`,
                  borderBottom: `1.5px solid ${selected?.id === c.id ? SEVERITY_COLOR[c.severity] : 'var(--border-light)'}`,
                  borderLeft: `4px solid ${SEVERITY_COLOR[c.severity]}`,
                  background: selected?.id === c.id ? `${SEVERITY_COLOR[c.severity]}10` : 'var(--bg)',
                  cursor: 'pointer', transition: 'all 0.12s ease',
                }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                  <div style={{ fontWeight: '700', fontSize: '13px', color: 'var(--text-main)', flex: 1, paddingRight: '8px' }}>{c.title}</div>
                  <span className={`badge badge-${c.severity}`} style={{ flexShrink: 0, fontSize: '10px' }}>{c.severity}</span>
                </div>
                <div style={{ display: 'flex', gap: '10px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><ClipboardList size={12} className="lucide-icon" /> {c.complaint_count}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><BarChart3 size={12} className="lucide-icon" /> +{c.growth_rate}%</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Zap size={12} className="lucide-icon text-warning" /> {c.risk_score}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
