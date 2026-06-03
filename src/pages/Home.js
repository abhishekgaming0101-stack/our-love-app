import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { Heart, Calendar, MapPin, Camera, Sparkles, ArrowRight } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import './Home.css';

// Configurable – change these to your details
const COUPLE = {
  name1: 'You',
  name2: 'Her',
  togetherSince: '2023-02-14', // Valentine's Day – change this!
  couplePhoto: null, // Will use initials
  note: 'Every moment with you is a story worth telling',
};

function LoveStat({ label, value, emoji, delay }) {
  return (
    <motion.div
      className="love-stat glass-sm"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <span className="love-stat-emoji">{emoji}</span>
      <div className="love-stat-value">{value}</div>
      <div className="love-stat-label">{label}</div>
    </motion.div>
  );
}

function FloatingHeart({ x, y, size, delay, duration }) {
  return (
    <motion.div
      style={{ position: 'absolute', left: x, top: y, fontSize: size, pointerEvents: 'none' }}
      animate={{ y: [0, -30, 0], opacity: [0.4, 0.8, 0.4], rotate: [-10, 10, -10] }}
      transition={{ repeat: Infinity, duration, delay, ease: 'easeInOut' }}
    >
      ♡
    </motion.div>
  );
}

function ScrollReveal({ children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default function Home() {
  const { upcomingDates, pastDates } = useApp();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);

  const daysTogether = differenceInDays(new Date(), new Date(COUPLE.togetherSince));
  const totalDates = upcomingDates.length + pastDates.length;
  const nextDate = upcomingDates[0];

  // Mouse parallax for hero
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const onMouse = (e) => {
      mouseX.set((e.clientX / window.innerWidth - 0.5) * 20);
      mouseY.set((e.clientY / window.innerHeight - 0.5) * 20);
    };
    window.addEventListener('mousemove', onMouse);
    return () => window.removeEventListener('mousemove', onMouse);
  }, [mouseX, mouseY]);

  return (
    <div className="home">
      {/* HERO */}
      <section className="hero" ref={heroRef}>
        <motion.div className="hero-bg" style={{ y: heroY }} />

        {/* Floating hearts decoration */}
        <div className="hero-hearts">
          {[
            { x: '10%', y: '20%', size: '1.5rem', delay: 0, duration: 4 },
            { x: '85%', y: '15%', size: '1rem', delay: 1, duration: 5 },
            { x: '75%', y: '60%', size: '1.8rem', delay: 0.5, duration: 4.5 },
            { x: '5%', y: '70%', size: '1.2rem', delay: 1.5, duration: 3.5 },
            { x: '50%', y: '10%', size: '0.9rem', delay: 2, duration: 6 },
          ].map((h, i) => <FloatingHeart key={i} {...h} />)}
        </div>

        <motion.div
          className="hero-content"
          style={{ opacity: heroOpacity, scale: heroScale, x: springX, y: springY }}
        >
          <motion.div
            className="hero-badge"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <Heart size={12} fill="var(--rose)" color="var(--rose)" />
            <span>Our Story</span>
            <Heart size={12} fill="var(--rose)" color="var(--rose)" />
          </motion.div>

          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            {COUPLE.name1} <em>&</em> {COUPLE.name2}
          </motion.h1>

          <motion.p
            className="hero-subtitle"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            {COUPLE.note}
          </motion.p>

          <motion.div
            className="hero-cta"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.7 }}
          >
            <Link to="/plan" className="btn-primary">
              Plan a Date <Sparkles size={16} />
            </Link>
            <Link to="/upcoming" className="btn-ghost">
              See What's Next <ArrowRight size={16} />
            </Link>
          </motion.div>
        </motion.div>

        <div className="scroll-hint">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            ↓
          </motion.div>
        </div>
      </section>

      {/* LOVE STATS */}
      <section className="stats-section">
        <div className="stats-grid">
          <LoveStat label="Days Together" value={daysTogether.toLocaleString()} emoji="🌹" delay={0} />
          <LoveStat label="Dates Planned" value={totalDates} emoji="📅" delay={0.1} />
          <LoveStat label="Upcoming Dates" value={upcomingDates.length} emoji="✨" delay={0.2} />
          <LoveStat label="Memories Made" value={pastDates.length} emoji="📸" delay={0.3} />
        </div>
      </section>

      {/* NEXT DATE TEASER */}
      {nextDate && (
        <ScrollReveal>
          <section className="next-date-section">
            <div className="section-label">Coming Up Next</div>
            <Link to="/upcoming" className="next-date-card glass" data-hover>
              <div className="next-date-emoji">{nextDate.cover_emoji || '💕'}</div>
              <div className="next-date-info">
                <h3>{nextDate.title}</h3>
                <p className="next-date-meta">
                  <Calendar size={14} />
                  {format(new Date(nextDate.date), 'EEEE, MMMM do')}
                </p>
                {nextDate.places?.[0] && (
                  <p className="next-date-meta">
                    <MapPin size={14} />
                    {nextDate.places[0].name}
                  </p>
                )}
              </div>
              <div className="next-date-arrow">
                <ArrowRight size={20} />
              </div>
            </Link>
          </section>
        </ScrollReveal>
      )}

      {/* FEATURE CARDS */}
      <section className="features-section">
        <ScrollReveal>
          <div className="section-label">Everything in one place</div>
          <h2 className="section-title">Your love story,<br /><em>beautifully organised</em></h2>
        </ScrollReveal>

        <div className="features-grid">
          {[
            {
              icon: <Calendar size={28} />, emoji: '🗓️',
              title: 'Plan a Date',
              desc: 'Pick a date, choose locations, set a timeline, and build the perfect itinerary together.',
              to: '/plan', cta: 'Start Planning',
              delay: 0.1,
            },
            {
              icon: <Sparkles size={28} />, emoji: '✨',
              title: 'Coming Up',
              desc: 'View all your upcoming dates with full details, timings, and places to visit.',
              to: '/upcoming', cta: 'See Dates',
              delay: 0.2,
            },
            {
              icon: <Camera size={28} />, emoji: '📸',
              title: 'Memories',
              desc: 'Relive every past date with photos, notes, and the story of your time together.',
              to: '/memories', cta: 'View Memories',
              delay: 0.3,
            },
          ].map(({ icon, emoji, title, desc, to, cta, delay }) => (
            <ScrollReveal key={to} delay={delay}>
              <Link to={to} className="feature-card glass" data-hover>
                <div className="feature-icon">{emoji}</div>
                <h3>{title}</h3>
                <p>{desc}</p>
                <span className="feature-cta">{cta} →</span>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* RECENT MEMORIES */}
      {pastDates.length > 0 && (
        <section className="recent-section">
          <ScrollReveal>
            <div className="section-label">Recent Memories</div>
            <h2 className="section-title"><em>Where we've been</em></h2>
          </ScrollReveal>
          <div className="recent-grid">
            {pastDates.slice(0, 3).map((date, i) => (
              <ScrollReveal key={date.id} delay={i * 0.1}>
                <Link to={`/memories/${date.id}`} className="recent-card glass-sm" data-hover>
                  <div className="recent-card-emoji">{date.cover_emoji || '💕'}</div>
                  <div className="recent-card-content">
                    <h3>{date.title}</h3>
                    <p>{format(new Date(date.date), 'MMM d, yyyy')}</p>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
          <ScrollReveal delay={0.3}>
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <Link to="/memories" className="btn-ghost">See All Memories</Link>
            </div>
          </ScrollReveal>
        </section>
      )}

      {/* FOOTER */}
      <footer className="home-footer">
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1.8 }}
        >
          <Heart size={20} fill="var(--rose)" color="var(--rose)" />
        </motion.div>
        <p>Made with love, just for us</p>
      </footer>
    </div>
  );
}
