import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { differenceInDays } from 'date-fns';
import { Heart } from 'lucide-react';
import './Home.css';

const COUPLE = {
  name1: 'Abhi',
  name2: 'Pakhu',
  togetherSince: '2023-02-14',
  note: 'Every moment with you is a forever I choose',
};

const NAV_CARDS = [
  { to: '/plan', icon: '🗓️', label: 'Plan a Date' },
  { to: '/upcoming', icon: '✨', label: 'Coming Up' },
  { to: '/memories', icon: '📸', label: 'Memories' },
];

function OrbitRing({ size, duration, reverse, dotColor }) {
  return (
    <motion.div
      style={{
        position: 'absolute', borderRadius: '50%',
        width: size, height: size,
        border: '1px solid rgba(255,45,85,0.12)',
        top: '50%', left: '50%',
        x: '-50%', y: '-50%',
      }}
      animate={{ rotate: reverse ? -360 : 360 }}
      transition={{ duration, repeat: Infinity, ease: 'linear' }}
    >
      <div style={{
        position: 'absolute', width: 6, height: 6,
        background: 'var(--rose)', borderRadius: '50%',
        top: -3, left: '50%', transform: 'translateX(-50%)',
        boxShadow: '0 0 10px #ff2d55, 0 0 20px #ff2d55',
      }} />
    </motion.div>
  );
}

export default function Home() {
  const { upcomingDates, pastDates } = useApp();
  const daysTogether = differenceInDays(new Date(), new Date(COUPLE.togetherSince));

  return (
    <div className="home">
      {/* AURORA */}
      <div className="home-aurora">
        <div className="aurora-blob" />
        <div className="aurora-blob" />
        <div className="aurora-blob" />
      </div>

      {/* GRID */}
      <div className="home-grid" />

      {/* ORBIT RINGS */}
      <div className="orbit-container">
        <OrbitRing size={280} duration={20} />
        <OrbitRing size={420} duration={30} reverse />
        <OrbitRing size={560} duration={45} />
      </div>

      {/* MAIN */}
      <div className="home-center">
        <motion.div className="home-eyebrow"
          initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
          transition={{ delay:0.2, duration:0.7 }}
        >
          <motion.span animate={{ scale:[1,1.3,1] }} transition={{ repeat:Infinity, duration:1.6 }}>
            <Heart size={12} fill="#ff2d55" color="#ff2d55" />
          </motion.span>
          Our Love Story
          <motion.span animate={{ scale:[1,1.3,1] }} transition={{ repeat:Infinity, duration:1.6, delay:0.8 }}>
            <Heart size={12} fill="#ff2d55" color="#ff2d55" />
          </motion.span>
        </motion.div>

        <motion.h1 className="home-names"
          initial={{ opacity:0, y:40 }} animate={{ opacity:1, y:0 }}
          transition={{ delay:0.4, duration:0.9, ease:[0.16,1,0.3,1] }}
        >
          {COUPLE.name1}
          <span className="amp"> &amp; </span>
          {COUPLE.name2}
        </motion.h1>

        <motion.p className="home-tagline"
          initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
          transition={{ delay:0.6, duration:0.7 }}
        >
          {COUPLE.note}
        </motion.p>

        <motion.div className="home-nav-cards"
          initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }}
          transition={{ delay:0.8, duration:0.7 }}
        >
          {NAV_CARDS.map(({ to, icon, label }, i) => (
            <motion.div key={to}
              initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }}
              transition={{ delay: 0.9 + i*0.1, duration:0.6 }}
              whileHover={{ scale:1.05 }} whileTap={{ scale:0.97 }}
            >
              <Link to={to} className="home-nav-card glass">
                <div className="card-glow" />
                <span className="card-icon">{icon}</span>
                <span className="card-label">{label}</span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* BOTTOM COUNTER */}
      <motion.div className="home-counter glass"
        initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }}
        transition={{ delay:1.2, duration:0.7 }}
      >
        <div className="counter-item">
          <div className="counter-value">{daysTogether.toLocaleString()}</div>
          <div className="counter-label">Days Together</div>
        </div>
        <div className="counter-divider" />
        <div className="counter-item">
          <div className="counter-value">{upcomingDates.length + pastDates.length}</div>
          <div className="counter-label">Dates Planned</div>
        </div>
        <div className="counter-divider" />
        <div className="counter-item">
          <div className="counter-value">{upcomingDates.length}</div>
          <div className="counter-label">Coming Up</div>
        </div>
        <div className="counter-divider" />
        <div className="counter-item">
          <div className="counter-value">{pastDates.length}</div>
          <div className="counter-label">Memories</div>
        </div>
      </motion.div>
    </div>
  );
}
