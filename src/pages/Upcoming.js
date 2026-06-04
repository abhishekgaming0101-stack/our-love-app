import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { format, differenceInDays } from 'date-fns';
import { MapPin, Clock, ExternalLink, Trash2, ChevronDown, Plus } from 'lucide-react';

function Countdown({ date }) {
  const d = differenceInDays(new Date(date), new Date());
  if (d === 0) return <span style={{ color: 'var(--rose)', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Today 🎉</span>;
  if (d === 1) return <span style={{ color: 'var(--rose)', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Tomorrow</span>;
  return <span style={{ color: 'var(--text3)', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>In {d} days</span>;
}

function DateCard({ date, index, onDelete }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.7, ease: [0.16,1,0.3,1] }}
      style={{ border: '1px solid var(--border)', borderRadius: '4px', overflow: 'hidden', transition: 'border-color 0.3s' }}
      whileHover={{ borderColor: 'rgba(232,64,90,0.25)' }}
    >
      {/* Header */}
      <div
        onClick={() => setOpen(o => !o)}
        style={{ display: 'flex', alignItems: 'center', gap: '24px', padding: '28px 32px', cursor: 'pointer', background: 'rgba(255,255,255,0.01)' }}
      >
        {/* Number */}
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', color: 'rgba(232,64,90,0.15)', lineHeight: 1, flexShrink: 0, width: '60px', textAlign: 'right' }}>
          {String(index + 1).padStart(2, '0')}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
            <span style={{ fontSize: '1.4rem' }}>{date.cover_emoji || '💕'}</span>
            <Countdown date={date.date} />
            <span style={{ fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text3)', padding: '3px 10px', border: '1px solid var(--border)', borderRadius: '1px' }}>{date.mood}</span>
          </div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--text)', fontWeight: 400, marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {date.title}
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text3)' }}>
            {format(new Date(date.date), 'EEEE, MMMM do yyyy')}
            {date.places?.length > 0 && ` · ${date.places.filter(p=>p.name).map(p=>p.name).join(' → ')}`}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
          <button onClick={e => { e.stopPropagation(); onDelete(date.id); }} style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', padding: '6px', transition: 'color 0.2s' }} data-hover>
            <Trash2 size={14} />
          </button>
          <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.3 }} style={{ color: 'var(--text3)' }}>
            <ChevronDown size={18} />
          </motion.div>
        </div>
      </div>

      {/* Body */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16,1,0.3,1] }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: '0 32px 32px 116px', borderTop: '1px solid var(--border)' }}>
              <div style={{ height: '24px' }} />
              {date.places?.filter(p=>p.name).map((p, i) => (
                <div key={p.id} style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                  {/* Timeline */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 20 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--rose)', flexShrink: 0, marginTop: 14, boxShadow: '0 0 8px var(--rose)' }} />
                    {i < date.places.filter(p=>p.name).length - 1 && <div style={{ width: 1, flex: 1, background: 'linear-gradient(to bottom, rgba(232,64,90,0.4), transparent)', margin: '4px 0', minHeight: 20 }} />}
                  </div>
                  <div style={{ flex: 1, padding: '10px 16px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '2px', marginBottom: i < date.places.filter(p=>p.name).length - 1 ? 8 : 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontWeight: 500, color: 'var(--text)', fontSize: '0.9rem' }}>{p.name}</span>
                      {p.start_time && <span style={{ fontSize: '0.75rem', color: 'var(--rose)', display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={11} />{p.start_time}{p.end_time?` – ${p.end_time}`:''}</span>}
                    </div>
                    {p.address && <div style={{ fontSize: '0.78rem', color: 'var(--text3)', display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={11} />{p.address}{p.maps_url&&<a href={p.maps_url} target="_blank" rel="noreferrer" style={{ color: 'var(--rose)', marginLeft: 6, fontSize: '0.72rem', display:'inline-flex',alignItems:'center',gap:2 }}><ExternalLink size={10}/>Maps</a>}</div>}
                    {p.notes && <div style={{ fontSize: '0.8rem', color: 'var(--text2)', fontStyle: 'italic', marginTop: 4 }}>"{p.notes}"</div>}
                  </div>
                </div>
              ))}
              {date.notes && <p style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: 'var(--text2)', fontSize: '0.9rem', marginTop: 8 }}>"{date.notes}"</p>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function Upcoming() {
  const { upcomingDates, removeDate } = useApp();
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: '120px 48px 80px' }}>
      <div className="orb orb-rose" style={{ width: 400, height: 400, top: '10%', left: '-10%' }} />
      <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '64px' }}>
          <div className="tag" style={{ marginBottom: '16px' }}>Coming Up</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem,5vw,4.5rem)', fontWeight: 400, color: 'var(--text)', lineHeight: 1 }}>
              Our <em style={{ color: 'var(--rose)' }}>Next</em><br />Adventures
            </h1>
            <Link to="/plan" className="btn btn-outline" data-hover style={{ textDecoration: 'none', marginBottom: '4px' }}>
              <Plus size={14} /> Plan New
            </Link>
          </div>
        </motion.div>

        {upcomingDates.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '80px', border: '1px dashed var(--border)', borderRadius: '4px' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '4rem', color: 'rgba(232,64,90,0.2)', marginBottom: '16px' }}>∅</div>
            <p style={{ color: 'var(--text3)', marginBottom: '24px', fontStyle: 'italic', fontFamily: 'var(--font-serif)' }}>Nothing planned yet. Time to change that.</p>
            <Link to="/plan" className="btn btn-primary" data-hover style={{ textDecoration: 'none' }}>Plan a Date</Link>
          </motion.div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {upcomingDates.map((d, i) => <DateCard key={d.id} date={d} index={i} onDelete={removeDate} />)}
          </div>
        )}
      </div>
    </div>
  );
}
