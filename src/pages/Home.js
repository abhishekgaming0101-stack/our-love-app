import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { differenceInDays } from 'date-fns';
import { Heart } from 'lucide-react';
import './Home.css';

const TAGLINE = 'Every moment with you is a forever I choose';

function OrbitRing({ size, duration, reverse, dotOpacity=1 }) {
  return (
    <motion.div style={{
      position:'absolute', borderRadius:'50%',
      width:size, height:size,
      border:`1px solid rgba(255,45,85,${dotOpacity * 0.13})`,
      top:'50%', left:'50%', x:'-50%', y:'-50%',
    }}
      animate={{ rotate: reverse ? -360 : 360 }}
      transition={{ duration, repeat:Infinity, ease:'linear' }}
    >
      <div style={{
        position:'absolute', width:6, height:6,
        background:'var(--rose)', borderRadius:'50%',
        top:-3, left:'50%', transform:'translateX(-50%)',
        boxShadow:'0 0 12px #ff2d55,0 0 24px #ff2d55',
        opacity: dotOpacity,
      }}/>
    </motion.div>
  );
}

export default function Home() {
  const { upcomingDates, pastDates } = useApp();
  const days = differenceInDays(new Date(), new Date('2023-02-14'));

  return (
    <div className="home">
      {/* AURORA */}
      <div className="home-aurora">
        <div className="aurora-blob"/><div className="aurora-blob"/><div className="aurora-blob"/>
      </div>

      {/* ORBITS */}
      <div className="orbit-wrap">
        <OrbitRing size="40%" duration={18}/>
        <OrbitRing size="65%" duration={28} reverse dotOpacity={0.7}/>
        <OrbitRing size="90%" duration={42} dotOpacity={0.4}/>
      </div>

      {/* CONTENT */}
      <div className="home-content">
        <motion.div className="home-eyebrow glass-rose"
          initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:.2,duration:.7}}>
          <motion.span animate={{scale:[1,1.3,1]}} transition={{repeat:Infinity,duration:1.6}}>
            <Heart size={11} fill="var(--rose)" color="var(--rose)"/>
          </motion.span>
          Our Love Story
          <motion.span animate={{scale:[1,1.3,1]}} transition={{repeat:Infinity,duration:1.6,delay:.8}}>
            <Heart size={11} fill="var(--rose)" color="var(--rose)"/>
          </motion.span>
        </motion.div>

        <motion.h1 className="home-title"
          initial={{opacity:0,y:50}} animate={{opacity:1,y:0}}
          transition={{delay:.4,duration:.9,ease:[.16,1,.3,1]}}>
          Abhi<span className="amp">&</span>Pakhu
        </motion.h1>

        <motion.p className="home-tagline"
          initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:.6,duration:.7}}>
          {TAGLINE}
        </motion.p>

        <motion.div className="home-cards"
          initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{delay:.8,duration:.7}}>
          {[
            {to:'/plan', icon:'🗓️', label:'Plan a Date'},
            {to:'/upcoming', icon:'✨', label:'Coming Up'},
            {to:'/memories', icon:'📸', label:'Memories'},
          ].map(({to,icon,label},i)=>(
            <motion.div key={to}
              initial={{opacity:0,y:30}} animate={{opacity:1,y:0}}
              transition={{delay:.9+i*.1,duration:.6}}
              whileHover={{scale:1.04}} whileTap={{scale:.97}}>
              <Link to={to} className="home-card glass">
                <span className="card-icon">{icon}</span>
                <span className="card-label">{label}</span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* COUNTER */}
      <motion.div className="home-counter glass"
        initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{delay:1.2,duration:.7}}>
        {[
          {val:days.toLocaleString(), lbl:'Days Together'},
          {val:upcomingDates.length+pastDates.length, lbl:'Dates Planned'},
          {val:upcomingDates.length, lbl:'Coming Up'},
          {val:pastDates.length, lbl:'Memories'},
        ].map(({val,lbl},i,arr)=>(
          <div key={lbl} style={{display:'flex',alignItems:'center',gap:28}}>
            <div className="ctr-item">
              <div className="ctr-val">{val}</div>
              <div className="ctr-lbl">{lbl}</div>
            </div>
            {i<arr.length-1 && <div className="ctr-div"/>}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
