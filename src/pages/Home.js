import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import './Home.css';

const TAGLINE = 'Every moment with you is a forever I choose';

function OrbitRing({ size, duration, reverse, opacity=1 }) {
  return (
    <motion.div style={{
      position:'absolute', borderRadius:'50%',
      width:size, height:size,
      border:`1px solid rgba(167,139,250,${opacity*0.15})`,
      top:'50%', left:'50%', x:'-50%', y:'-50%',
    }}
      animate={{ rotate: reverse ? -360 : 360 }}
      transition={{ duration, repeat:Infinity, ease:'linear' }}
    >
      <div style={{
        position:'absolute', width:7, height:7,
        background:'var(--accent)', borderRadius:'50%',
        top:-3.5, left:'50%', transform:'translateX(-50%)',
        boxShadow:'0 0 14px #a78bfa,0 0 28px #a78bfa',
        opacity,
      }}/>
    </motion.div>
  );
}

export default function Home() {
  return (
    <div className="home">
      <div className="orbit-wrap">
        <OrbitRing size="38%" duration={18}/>
        <OrbitRing size="62%" duration={28} reverse opacity={0.7}/>
        <OrbitRing size="90%" duration={44} opacity={0.35}/>
      </div>

      <div className="home-content">
        <motion.div className="home-eyebrow glass-accent"
          initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}
          transition={{delay:.2,duration:.7}}>
          <motion.span animate={{scale:[1,1.3,1]}} transition={{repeat:Infinity,duration:1.6}}>
            <Heart size={11} fill="var(--accent)" color="var(--accent)"/>
          </motion.span>
          Our Love Story
          <motion.span animate={{scale:[1,1.3,1]}} transition={{repeat:Infinity,duration:1.6,delay:.8}}>
            <Heart size={11} fill="var(--accent)" color="var(--accent)"/>
          </motion.span>
        </motion.div>

        <motion.h1 className="home-title"
          initial={{opacity:0,y:50}} animate={{opacity:1,y:0}}
          transition={{delay:.4,duration:.9,ease:[.16,1,.3,1]}}>
          Abhi<span className="amp">&</span>Pakhu
        </motion.h1>

        <motion.p className="home-tagline"
          initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}
          transition={{delay:.6,duration:.7}}>
          {TAGLINE}
        </motion.p>

        <motion.div className="home-cards"
          initial={{opacity:0,y:30}} animate={{opacity:1,y:0}}
          transition={{delay:.8,duration:.7}}>
          {[
            {to:'/plan',    icon:'🗓️', label:'Plan a Date'},
            {to:'/upcoming',icon:'✨',  label:'Coming Up'},
            {to:'/memories',icon:'📸',  label:'Memories'},
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
    </div>
  );
}
