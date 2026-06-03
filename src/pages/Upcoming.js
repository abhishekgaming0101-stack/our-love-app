import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { format, differenceInDays } from 'date-fns';
import { Calendar, MapPin, Clock, ChevronDown, ChevronUp, Trash2, ExternalLink, Sparkles } from 'lucide-react';
import './Upcoming.css';

function CountdownBadge({ date }) {
  const days = differenceInDays(new Date(date), new Date());
  if (days === 0) return <span className="countdown today">Today! 🎉</span>;
  if (days === 1) return <span className="countdown tomorrow">Tomorrow 💕</span>;
  if (days <= 7) return <span className="countdown soon">In {days} days ✨</span>;
  return <span className="countdown far">In {days} days</span>;
}

function PlaceTimeline({ places }) {
  return (
    <div className="place-timeline">
      {places.map((place, i) => (
        <motion.div
          key={place.id}
          className="timeline-item"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.08 }}
        >
          <div className="timeline-line">
            <div className="timeline-dot" />
            {i < places.length - 1 && <div className="timeline-connector" />}
          </div>
          <div className="timeline-content glass-sm">
            <div className="timeline-header">
              <h4>{place.name || 'Unnamed Stop'}</h4>
              {(place.start_time || place.end_time) && (
                <span className="timeline-time">
                  <Clock size={12} />
                  {place.start_time && place.end_time
                    ? `${place.start_time} – ${place.end_time}`
                    : place.start_time || place.end_time}
                </span>
              )}
            </div>
            {place.address && (
              <p className="timeline-address">
                <MapPin size={12} /> {place.address}
                {place.maps_url && (
                  <a href={place.maps_url} target="_blank" rel="noreferrer" className="maps-link">
                    <ExternalLink size={11} /> Maps
                  </a>
                )}
              </p>
            )}
            {place.notes && <p className="timeline-notes">"{place.notes}"</p>}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function DateCard({ date, onDelete }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      className="date-card glass"
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
    >
      <div className="date-card-top" onClick={() => setExpanded(e => !e)}>
        <div className="date-card-emoji">{date.cover_emoji || '💕'}</div>
        <div className="date-card-info">
          <div className="date-card-meta">
            <CountdownBadge date={date.date} />
            <span className={`mood-tag mood-${date.mood}`}>{date.mood}</span>
          </div>
          <h3>{date.title}</h3>
          <p className="date-card-date">
            <Calendar size={13} />
            {format(new Date(date.date), 'EEEE, MMMM do, yyyy')}
          </p>
          {date.places?.length > 0 && (
            <p className="date-card-places">
              <MapPin size={13} />
              {date.places.map(p => p.name).filter(Boolean).join(' → ')}
            </p>
          )}
        </div>
        <div className="date-card-actions">
          <button
            className="delete-btn"
            onClick={(e) => { e.stopPropagation(); onDelete(date.id); }}
          >
            <Trash2 size={14} />
          </button>
          <button className="expand-btn">
            {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            className="date-card-body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="date-card-body-inner">
              {date.places?.length > 0 && (
                <>
                  <div className="body-section-label">Itinerary</div>
                  <PlaceTimeline places={date.places} />
                </>
              )}
              {date.notes && (
                <div className="date-notes">
                  <div className="body-section-label">Notes</div>
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
      <div className="upcoming-bg" />

      <div className="upcoming-container">
        <motion.div
          className="page-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="page-header-emoji">✨</span>
          <h1>Coming Up</h1>
          <p>The adventures that await us</p>
        </motion.div>

        {upcomingDates.length === 0 ? (
          <motion.div
            className="empty-state glass"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="empty-emoji">🌸</div>
            <h3>Nothing planned yet</h3>
            <p>Time to plan something magical together</p>
            <Link to="/plan" className="btn-primary">
              <Sparkles size={16} /> Plan a Date
            </Link>
          </motion.div>
        ) : (
          <AnimatePresence>
            <div className="dates-list">
              {upcomingDates.map(date => (
                <DateCard key={date.id} date={date} onDelete={removeDate} />
              ))}
            </div>
          </AnimatePresence>
        )}

        <div className="upcoming-footer">
          <Link to="/plan" className="btn-ghost">
            <Sparkles size={14} /> Plan Another Date
          </Link>
        </div>
      </div>
    </div>
  );
}
