import { useState, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { format } from 'date-fns';
import { ArrowUpRight, Camera, Upload, MapPin, Clock, ExternalLink, Heart, Trash2, ChevronLeft } from 'lucide-react';

function PhotoUpload({ dateId, photos = [], onAdd }) {
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [local, setLocal] = useState(photos);

  const handle = async (files) => {
    if (!files.length) return;
    setUploading(true);
    const added = [];
    for (const f of files) {
      const url = await new Promise(r => { const rd = new FileReader(); rd.onload = e => r(e.target.result); rd.readAsDataURL(f); });
      added.push({ id: Date.now() + Math.random(), url, type: f.type.startsWith('video') ? 'video' : 'photo' });
    }
    const updated = [...local, ...added];
    setLocal(updated);
    onAdd(updated);
    setUploading(false);
  };

  return (
    <div>
      {local.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px,1fr))', gap: '8px', marginBottom: '16px' }}>
          {local.map((p, i) => (
            <motion.div key={p.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }} style={{ borderRadius: '2px', overflow: 'hidden', aspectRatio: '1' }}>
              {p.type === 'video' ? <video src={p.url} controls style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <img src={p.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />}
            </motion.div>
          ))}
        </div>
      )}
      <div
        onClick={() => fileRef.current?.click()}
        onDrop={e => { e.preventDefault(); handle(Array.from(e.dataTransfer.files)); }}
        onDragOver={e => e.preventDefault()}
        data-hover
        style={{ border: '1px dashed rgba(232,64,90,0.3)', borderRadius: '2px', padding: '32px', textAlign: 'center', cursor: 'pointer', color: 'var(--text3)', fontSize: '0.8rem', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', transition: 'all 0.3s' }}
      >
        <input ref={fileRef} type="file" multiple accept="image/*,video/*" style={{ display: 'none' }} onChange={e => handle(Array.from(e.target.files))} />
        {uploading ? <span style={{ color: 'var(--rose)' }}>Uploading…</span> : <><Upload size={14} /> Drop photos & videos or click to upload</>}
      </div>
    </div>
  );
}

function MemoryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { dates, editDate, removeDate } = useApp();
  const date = dates.find(d => d.id === id);
  if (!date) return <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Link to="/memories" className="btn btn-outline">← Back</Link></div>;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: '120px 48px 80px' }}>
      <div className="orb orb-rose" style={{ width: 400, height: 400, top: 0, right: '-10%' }} />
      <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <Link to="/memories" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text3)', textDecoration: 'none', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '48px', transition: 'color 0.2s' }} data-hover>
          <ChevronLeft size={14} /> All Memories
        </Link>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', marginBottom: '48px' }}>
          <span style={{ fontSize: '3.5rem', lineHeight: 1 }}>{date.cover_emoji || '💕'}</span>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <span className="tag">{date.mood}</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--rose)' }}>{format(new Date(date.date), 'MMM do, yyyy')}</span>
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,4vw,3.5rem)', fontWeight: 400, color: 'var(--text)', lineHeight: 1 }}>{date.title}</h1>
          </div>
          <button onClick={async () => { if (window.confirm('Delete this memory?')) { await removeDate(id); navigate('/memories'); } }} style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', padding: '8px' }} data-hover>
            <Trash2 size={16} />
          </button>
        </div>

        {date.notes && (
          <div style={{ padding: '24px', background: 'rgba(232,64,90,0.04)', border: '1px solid rgba(232,64,90,0.15)', borderRadius: '2px', marginBottom: '32px', display: 'flex', gap: '12px' }}>
            <Heart size={14} fill="var(--rose)" color="var(--rose)" style={{ flexShrink: 0, marginTop: 2 }} />
            <p style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: 'var(--text2)', fontSize: '0.95rem', lineHeight: 1.7 }}>"{date.notes}"</p>
          </div>
        )}

        {date.places?.filter(p=>p.name).length > 0 && (
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '4px', padding: '32px', marginBottom: '32px' }}>
            <div style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--rose)', marginBottom: '24px', fontWeight: 400 }}>The Itinerary</div>
            {date.places.filter(p=>p.name).map((p, i, arr) => (
              <div key={p.id} style={{ display: 'flex', gap: '16px', marginBottom: i < arr.length-1 ? 8 : 0 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 20 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--rose)', flexShrink: 0, marginTop: 14, boxShadow: '0 0 8px var(--rose)' }} />
                  {i < arr.length-1 && <div style={{ width: 1, flex: 1, background: 'linear-gradient(to bottom, rgba(232,64,90,0.4),transparent)', margin: '4px 0', minHeight: 20 }} />}
                </div>
                <div style={{ flex: 1, padding: '10px 16px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '2px', marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontWeight: 500, color: 'var(--text)', fontSize: '0.9rem' }}>{p.name}</span>
                    {p.start_time && <span style={{ fontSize: '0.75rem', color: 'var(--rose)', display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={11} />{p.start_time}{p.end_time?` – ${p.end_time}`:''}</span>}
                  </div>
                  {p.address && <div style={{ fontSize: '0.78rem', color: 'var(--text3)', display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={11} />{p.address}{p.maps_url&&<a href={p.maps_url} target="_blank" rel="noreferrer" style={{ color: 'var(--rose)', marginLeft: 6, fontSize: '0.72rem' }}><ExternalLink size={10}/> Maps</a>}</div>}
                  {p.notes && <div style={{ fontSize: '0.8rem', color: 'var(--text2)', fontStyle: 'italic', marginTop: 4 }}>"{p.notes}"</div>}
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ border: '1px solid var(--border)', borderRadius: '4px', padding: '32px' }}>
          <div style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--rose)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Camera size={12} /> Photos & Videos
          </div>
          <PhotoUpload dateId={id} photos={date.photos || []} onAdd={photos => editDate(id, { photos })} />
        </div>
      </div>
    </div>
  );
}

function MemoriesList() {
  const { pastDates } = useApp();
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: '120px 48px 80px' }}>
      <div className="orb orb-gold" style={{ width: 500, height: 500, bottom: '10%', right: '-10%' }} />
      <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '64px' }}>
          <div className="tag" style={{ marginBottom: '16px' }}>Archive</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem,5vw,4.5rem)', fontWeight: 400, color: 'var(--text)', lineHeight: 1 }}>
            Our <em style={{ color: 'var(--rose)' }}>Memories</em>
          </h1>
        </motion.div>

        {pastDates.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '80px', border: '1px dashed var(--border)', borderRadius: '4px' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '4rem', color: 'rgba(232,64,90,0.2)', marginBottom: '16px' }}>∅</div>
            <p style={{ color: 'var(--text3)', fontStyle: 'italic', fontFamily: 'var(--font-serif)' }}>Past dates will live here, forever.</p>
          </motion.div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1px', background: 'var(--border)' }}>
            {pastDates.map((d, i) => (
              <motion.div key={d.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.06 }}>
                <Link to={`/memories/${d.id}`} data-hover style={{ display: 'block', textDecoration: 'none', background: 'var(--bg)', padding: '32px', transition: 'background 0.3s', position: 'relative', overflow: 'hidden', minHeight: '220px' }}>
                  <motion.div whileHover={{ background: 'var(--surface)' }} style={{ position: 'absolute', inset: 0 }} />
                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                      <span style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', color: 'rgba(232,64,90,0.15)' }}>{String(i+1).padStart(2,'0')}</span>
                      <motion.div whileHover={{ x: 3, y: -3 }} style={{ color: 'var(--text3)', transition: 'color 0.3s' }}>
                        <ArrowUpRight size={16} />
                      </motion.div>
                    </div>
                    <div style={{ fontSize: '1.5rem', marginBottom: '12px' }}>{d.cover_emoji || '💕'}</div>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--text)', fontWeight: 400, marginBottom: '8px', lineHeight: 1.2 }}>{d.title}</h3>
                    <p style={{ fontSize: '0.75rem', color: 'var(--rose)', letterSpacing: '0.08em' }}>{format(new Date(d.date), 'MMM do, yyyy')}</p>
                    {d.photos?.length > 0 && <p style={{ fontSize: '0.7rem', color: 'var(--text3)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}><Camera size={10} /> {d.photos.length} photo{d.photos.length>1?'s':''}</p>}
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: '40%', height: '1px', background: 'linear-gradient(90deg, var(--rose), transparent)', opacity: 0.3, transform: 'translateY(32px)' }} />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Memories() {
  const { id } = useParams();
  return id ? <MemoryDetail /> : <MemoriesList />;
}
