import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { Sun, Moon, Heart } from 'lucide-react';
import './Navbar.css';

const NAV_LINKS = [
  { to: '/', label: 'Home', emoji: '🏠' },
  { to: '/plan', label: 'Plan a Date', emoji: '🗓️' },
  { to: '/upcoming', label: 'Coming Up', emoji: '✨' },
  { to: '/memories', label: 'Memories', emoji: '📸' },
];

export default function Navbar() {
  const location = useLocation();
  const { theme, setTheme } = useApp();
  return (
    <motion.nav className="navbar glass"
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16,1,0.3,1] }}
    >
      <Link to="/" className="nav-brand">
        <motion.div animate={{ scale:[1,1.25,1] }} transition={{ repeat:Infinity, duration:1.8 }}>
          <Heart size={18} fill="var(--rose)" color="var(--rose)" style={{filter:'drop-shadow(0 0 6px #ff2d55)'}} />
        </motion.div>
        <span className="nav-brand-text">Us</span>
      </Link>
      <div className="nav-links">
        {NAV_LINKS.map(({ to, label, emoji }) => (
          <Link key={to} to={to} className={`nav-link ${location.pathname === to ? 'active' : ''}`}>
            <span className="nav-link-emoji">{emoji}</span>
            <span>{label}</span>
          </Link>
        ))}
      </div>
      <button className="theme-toggle" onClick={() => setTheme(t => t==='light'?'dark':'light')}>
        {theme==='dark' ? <Sun size={16}/> : <Moon size={16}/>}
      </button>
    </motion.nav>
  );
}
