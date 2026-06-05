import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { format, differenceInDays } from 'date-fns';
import { Calendar, MapPin, Clock, ChevronDown, ChevronUp, Trash2, ExternalLink, Plus } from 'lucide-react';
import './Upcoming.css';

function Countdown({ date }) {
  const d = differenceInDays(new Date(date), new Date());
  if (d === 0) return <span className="countdown today">Today 🎉</span>;
  if (d === 1) return <span className="countdown tomorrow">Tomorrow 💕</span>;
  if (d <= 7)  return <span className="countdown soon">In {d} days ✨</span>;
  return <span className="countdown far">In {d} days</span>;
}

function DateCard({ date, onDelete }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div className="date-card" layout
      initial={{ opacity:0, y:28 }} animate={{ opacity:1, y:0 }}
      exit={{ opacity:0, scale:.95 }}
    >
      <div className="date-card-top" onClick={() => setOpen(o => !o)}>
        <div className="date-card-emoji">{date.cover_emoji || '💕'}</div>
        <div className="date-card-info">
          <div className="date-card-meta">
            <Countdown date={date.date}/>
            {date.mood && <span className="mood-tag">{date.mood}</span>}
          </div>
          <h3>{date.title}</h3>
          <p className="date-card-date">
            <Calendar size={13}/>
            {format(new Date(date.date),'EEEE, MMMM do, yyyy')}
          </p>
          {date.places?.filter(p=>p.name).length > 0 && (
            <p className="date-card-places">
              <MapPin size={13}/>
              {date.places.filter(p=>p.name).map(p=>p.name).join(' → ')}
            </p>
          )}
        </div>
        <div className="date-card-actions">
          <button className="delete-btn" onClick={e=>{e.stopPropagation();onDelete(date.id);}}>
            <Trash2 size={14}/>
          </button>
          <button className="expand-btn">
            {open ? <ChevronUp size={18}/> : <ChevronDown size={18}/>}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div className="date-card-body"
            initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}}
            exit={{height:0,opacity:0}} transition={{duration:.4,ease:[.16,1,.3,1]}}>
            <div className="date-card-body-inner">
              {date.places?.filter(p=>p.name).length > 0 && (
                <>
                  <div className="body-section-label">Itinerary</div>
                  <div className="place-timeline">
                    {date.places.filter(p=>p.name).map((p,i,arr)=>(
                      <motion.div key={p.id} className="timeline-item"
                        initial={{opacity:0,x:-16}} animate={{opacity:1,x:0}}
                        transition={{delay:i*.07}}>
                        <div className="timeline-line">
                          <div className="timeline-dot"/>
                          {i<arr.length-1 && <div className="timeline-connector"/>}
                        </div>
                        <div className="timeline-content">
                          <div className="timeline-header">
                            <h4>{p.name}</h4>
                            {(p.start_time||p.end_time) && (
                              <span className="timeline-time">
                                <Clock size={11}/>
                                {p.start_time}{p.end_time?` – ${p.end_time}`:''}
                              </span>
                            )}
                          </div>
                          {p.address && (
                            <p className="timeline-address">
                              <MapPin size={11}/> {p.address}
                              {p.maps_url && (
                                <a href={p.maps_url} target="_blank" rel="noreferrer" className="maps-link">
                                  <ExternalLink size={10}/> Maps
                                </a>
                              )}
                            </p>
                          )}
                          {p.notes && <p className="timeline-notes">"{p.notes}"</p>}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </>
              )}
              {date.notes && (
                <div className="date-notes">
                  <div className="body-section-label" style={{marginTop:16}}>Notes</div>
                  <p className="date-notes-text">"{date.notes}"</p>
                </div>
              )}
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
    <div className="upcoming-page">
      <div className="upcoming-bg"/>
      <div className="upcoming-container">

        <motion.div className="page-header"
          initial={{opacity:0,y:-24}} animate={{opacity:1,y:0}} transition={{duration:.7}}>
          <span className="page-header-emoji">✨</span>
          <h1>Our <em>Next</em> Adventures</h1>
          <p>The moments we're looking forward to</p>
        </motion.div>

        <motion.div className="page-top-row"
          initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.3}}>
          <h2>{upcomingDates.length} date{upcomingDates.length !== 1 ? 's' : ''} planned</h2>
          <Link to="/plan" className="btn-primary" style={{fontSize:'.75rem',padding:'10px 20px'}}>
            <Plus size={14}/> Plan New
          </Link>
        </motion.div>

        {upcomingDates.length === 0 ? (
          <motion.div className="empty-state glass"
            initial={{opacity:0,scale:.92}} animate={{opacity:1,scale:1}}>
            <div className="empty-emoji">🌸</div>
            <h3>Nothing planned yet</h3>
            <p>Plan something magical together</p>
            <Link to="/plan" className="btn-primary">Plan a Date</Link>
          </motion.div>
        ) : (
          <AnimatePresence>
            <div className="dates-list">
              {upcomingDates.map(d => <DateCard key={d.id} date={d} onDelete={removeDate}/>)}
            </div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
