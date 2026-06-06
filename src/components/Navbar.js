import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import './Navbar.css';

const NAV = [
  { to:'/', label:'Home', emoji:'🏠' },
  { to:'/plan', label:'Plan a Date', emoji:'🗓️' },
  { to:'/upcoming', label:'Coming Up', emoji:'✨' },
  { to:'/memories', label:'Memories', emoji:'📸' },
];

export default function Navbar() {
  const { pathname } = useLocation();
  return (
    <motion.nav className="navbar glass"
      initial={{ y:-80, opacity:0 }}
      animate={{ y:0, opacity:1 }}
      transition={{ duration:.8, ease:[.16,1,.3,1] }}
    >
      <Link to="/" className="nav-brand">
        <motion.div
          animate={{ scale:[1,1.3,1] }}
          transition={{ repeat:Infinity, duration:1.8, ease:'easeInOut' }}
        >
          <Heart size={15} fill="var(--accent)" color="var(--accent)"
            style={{ filter:'drop-shadow(0 0 6px #a78bfa)' }}/>
        </motion.div>
        <span className="nav-brand-text">
          Abhi <span className="heart">♥</span> Pakhu
        </span>
      </Link>

      <div className="nav-links">
        {NAV.map(({ to, label, emoji }) => (
          <Link key={to} to={to}
            className={`nav-link ${pathname===to?'active':''}`}>
            <span className="nav-link-emoji">{emoji}</span>
            <span>{label}</span>
          </Link>
        ))}
      </div>
    </motion.nav>
  );
}
