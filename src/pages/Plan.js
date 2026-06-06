import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ArrowLeft, ArrowRight, Plus, Check, MapPin, Clock } from 'lucide-react';
import { format, addMonths, subMonths, getDaysInMonth, startOfMonth } from 'date-fns';
import './Plan.css';

const EMOJIS = ['💕','🌹','🌸','✨','🥂','🎭','🌙','☀️','🌊','🏔️','🎪','🍃','🎆','🌺','💎','🕯️'];
const ACTIVITIES = ['Dinner','Lunch','Coffee','Movie','Walk','Shopping','Beach','Hiking','Concert','Museum','Picnic','Stargazing','Cooking','Gaming','Spa','Road Trip'];

const newPlace = () => ({ id: Date.now().toString(), name:'', start_time:'', end_time:'', address:'', maps_url:'', notes:'' });

// Steps: 1=Calendar, 2=Name+Emoji, 3=Add Place, 4=Notes for place, 5=Summary
export default function PlanDate() {
  const navigate = useNavigate();
  const { addDate } = useApp();
  const [step, setStep] = useState(1);
  const [calMonth, setCalMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [title, setTitle] = useState('');
  const [emoji, setEmoji] = useState('💕');
  const [places, setPlaces] = useState([newPlace()]);
  const [currentPlaceIdx, setCurrentPlaceIdx] = useState(0);
  const [saving, setSaving] = useState(false);
  const touchStartX = useRef(null);

  const curPlace = places[currentPlaceIdx];
  const updateCurPlace = (field, val) => {
    setPlaces(prev => prev.map((p,i) => i===currentPlaceIdx ? {...p,[field]:val} : p));
  };

  const year = calMonth.getFullYear();
  const month = calMonth.getMonth();
  const daysInMonth = getDaysInMonth(calMonth);
  const firstDay = startOfMonth(calMonth).getDay();
  const today = new Date();
  const calDays = [];
  for(let i=0;i<firstDay;i++) calDays.push(null);
  for(let d=1;d<=daysInMonth;d++) calDays.push(d);
  const isPast = d => false; // Allow all dates including past
  const isSelected = d => d && selectedDate && selectedDate.getDate()===d && selectedDate.getMonth()===month && selectedDate.getFullYear()===year;

  // Swipe to change month on calendar
  const onTouchStart = e => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd = e => {
    if(touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if(Math.abs(diff) > 50) { diff > 0 ? setCalMonth(m=>addMonths(m,1)) : setCalMonth(m=>subMonths(m,1)); }
    touchStartX.current = null;
  };

  const addNextStop = () => {
    const next = newPlace();
    setPlaces(prev => [...prev, next]);
    setCurrentPlaceIdx(places.length);
    setStep(3);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const isPastDate = selectedDate < new Date(today.getFullYear(), today.getMonth(), today.getDate());
      await addDate({
        title: title.trim(), date: format(selectedDate,'yyyy-MM-dd'),
        status: isPastDate ? 'past' : 'upcoming', mood: 'romantic', cover_emoji: emoji,
        places: places.filter(p=>p.name.trim()), notes:'', photos:[],
      });
      navigate('/upcoming');
    } finally { setSaving(false); }
  };

  const STEPS = ['Date','Name','Location','Notes','Done'];

  return (
    <div className="plan-page">
      
      <div className="plan-container">
        <motion.div className="plan-header" initial={{opacity:0,y:-20}} animate={{opacity:1,y:0}}>
          <h1>Plan a Date 🗓️</h1>
          <p>Let's build something magical together</p>
        </motion.div>

        {/* STEP INDICATOR */}
        <div className="wizard-steps">
          {STEPS.map((s,i) => (
            <div key={i} style={{display:'flex',alignItems:'center'}}>
              <div className={`wizard-step ${step===i+1?'active':''} ${step>i+1?'done':''}`}>
                <div className="step-num">{step>i+1?'✓':i+1}</div>
                <span style={{display:window.innerWidth<500?'none':'inline'}}>{s}</span>
              </div>
              {i<STEPS.length-1 && <div className={`step-line ${step>i+1?'done':''}`}/>}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">

          {/* STEP 1: CALENDAR */}
          {step===1 && (
            <motion.div key="s1" className="wizard-card glass"
              initial={{opacity:0,x:-30}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-30}}
            >
              <h2 className="step-title">Pick a date</h2>
              <p className="step-subtitle">Swipe left/right on mobile to change months</p>

              <div onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
                <div className="cal-header">
                  <button className="cal-nav" onClick={()=>setCalMonth(m=>subMonths(m,1))}><ArrowLeft size={16}/></button>
                  <span className="cal-month-title">{format(calMonth,'MMMM yyyy')}</span>
                  <button className="cal-nav" onClick={()=>setCalMonth(m=>addMonths(m,1))}><ArrowRight size={16}/></button>
                </div>
                <div className="cal-weekdays">
                  {['S','M','T','W','T','F','S'].map((d,i)=><div key={i} className="cal-weekday">{d}</div>)}
                </div>
                <div className="cal-grid">
                  {calDays.map((d,i)=>(
                    <motion.div key={i}
                      className={`cal-day ${d?'':'empty'} ${isSelected(d)?'selected':''} ${isPast(d)?'past':''}`}
                      whileHover={d&&!isPast(d)?{scale:1.15}:{}}
                      whileTap={d&&!isPast(d)?{scale:0.9}:{}}
                      onClick={()=>d&&!isPast(d)&&setSelectedDate(new Date(year,month,d))}
                    >
                      {d}
                    </motion.div>
                  ))}
                </div>
              </div>

              {selectedDate && (
                <motion.div className="selected-preview glass-sm" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}>
                  <span style={{fontSize:'1.5rem'}}>📅</span>
                  <div>
                    <strong>{format(selectedDate,'EEEE, MMMM do yyyy')}</strong>
                    <span>Ready to plan something special?</span>
                  </div>
                </motion.div>
              )}

              <div className="wizard-actions center" style={{marginTop:24}}>
                <button className="btn-primary" disabled={!selectedDate} onClick={()=>setStep(2)}>
                  Continue <ArrowRight size={15}/>
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: NAME + EMOJI */}
          {step===2 && (
            <motion.div key="s2" className="wizard-card glass"
              initial={{opacity:0,x:30}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-30}}
            >
              <h2 className="step-title">Name this date</h2>
              <p className="step-subtitle">{format(selectedDate,'EEEE, MMMM do')}</p>

              <div className="form-field name-input-big">
                <label>Date Name</label>
                <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="e.g. Rooftop Dinner Under Stars" autoFocus/>
              </div>

              <div className="form-field">
                <label>Cover Emoji</label>
                <div className="emoji-picker">
                  {EMOJIS.map(em=>(
                    <motion.button key={em} className={`emoji-btn ${emoji===em?'selected':''}`}
                      onClick={()=>setEmoji(em)} whileHover={{scale:1.15}} whileTap={{scale:0.9}}>
                      {em}
                    </motion.button>
                  ))}
                </div>
              </div>

              <div className="wizard-actions">
                <button className="btn-ghost" onClick={()=>setStep(1)}><ArrowLeft size={15}/> Back</button>
                <button className="btn-primary" disabled={!title.trim()} onClick={()=>setStep(3)}>
                  Add Location <ArrowRight size={15}/>
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: PLACE DETAILS */}
          {step===3 && (
            <motion.div key="s3" className="wizard-card glass"
              initial={{opacity:0,x:30}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-30}}
            >
              {places.length>1 && (
                <div className="places-summary">
                  {places.map((p,i)=>(
                    <div key={p.id} className="place-chip" onClick={()=>{setCurrentPlaceIdx(i);setStep(3);}}>
                      <div className="place-chip-num">{i+1}</div>
                      <span>{p.name||`Stop ${i+1}`}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="place-step-header">
                <div className="place-step-num">{currentPlaceIdx+1}</div>
                <div>
                  <h2 className="step-title" style={{marginBottom:0}}>Where are you going?</h2>
                  <p className="step-subtitle" style={{marginBottom:0}}>Stop {currentPlaceIdx+1} of {places.length}</p>
                </div>
              </div>

              <div className="form-field">
                <label><MapPin size={11}/> Place Name</label>
                <input value={curPlace.name} onChange={e=>updateCurPlace('name',e.target.value)} placeholder="e.g. The Rooftop Lounge" autoFocus/>
              </div>

              <div className="form-field time-row">
                <div>
                  <label><Clock size={11}/> From</label>
                  <input type="time" value={curPlace.start_time} onChange={e=>updateCurPlace('start_time',e.target.value)}/>
                </div>
                <div>
                  <label><Clock size={11}/> To</label>
                  <input type="time" value={curPlace.end_time} onChange={e=>updateCurPlace('end_time',e.target.value)}/>
                </div>
              </div>

              <div className="form-field">
                <label>Address</label>
                <input value={curPlace.address} onChange={e=>updateCurPlace('address',e.target.value)} placeholder="Full address"/>
              </div>

              <div className="form-field">
                <label>Google Maps Link</label>
                <input value={curPlace.maps_url} onChange={e=>updateCurPlace('maps_url',e.target.value)} placeholder="Paste link from Google Maps"/>
              </div>

              <div className="wizard-actions">
                <button className="btn-ghost" onClick={()=>setStep(2)}><ArrowLeft size={15}/> Back</button>
                <button className="btn-primary" disabled={!curPlace.name.trim()} onClick={()=>setStep(4)}>
                  What's the plan? <ArrowRight size={15}/>
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: NOTES / ACTIVITIES */}
          {step===4 && (
            <motion.div key="s4" className="wizard-card glass"
              initial={{opacity:0,x:30}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-30}}
            >
              <h2 className="step-title">What's the plan at {curPlace.name}?</h2>
              <p className="step-subtitle">Add activities, what to eat, what to bring</p>

              <div className="form-field">
                <label>Quick Tags</label>
                <div className="activity-tags">
                  {ACTIVITIES.map(a=>(
                    <button key={a} className={`activity-tag ${curPlace.notes?.includes(a)?'selected':''}`}
                      onClick={()=>updateCurPlace('notes', curPlace.notes?.includes(a) ? curPlace.notes.replace(a,'').trim() : ((curPlace.notes||'')+' '+a).trim())}>
                      {a}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-field">
                <label>Notes</label>
                <textarea value={curPlace.notes} onChange={e=>updateCurPlace('notes',e.target.value)}
                  placeholder="What to do, what to order, anything special..." rows={4}/>
              </div>

              <div className="wizard-actions">
                <button className="btn-ghost" onClick={()=>setStep(3)}><ArrowLeft size={15}/> Back</button>
                <div style={{display:'flex',gap:10}}>
                  <button className="add-stop-btn" onClick={addNextStop}>
                    <Plus size={14}/> Add Another Stop
                  </button>
                  <button className="btn-primary" onClick={()=>setStep(5)}>
                    Review <ArrowRight size={15}/>
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 5: SUMMARY */}
          {step===5 && (
            <motion.div key="s5" className="wizard-card glass"
              initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:0.95}}
            >
              <div style={{textAlign:'center',marginBottom:24}}>
                <motion.div style={{fontSize:'3.5rem',marginBottom:8}} animate={{scale:[1,1.1,1]}} transition={{repeat:Infinity,duration:2}}>{emoji}</motion.div>
                <h2 className="step-title">{title}</h2>
                <p className="step-subtitle">{format(selectedDate,'EEEE, MMMM do yyyy')}</p>
              </div>

              <div style={{display:'flex',flexDirection:'column',gap:10,marginBottom:24}}>
                {places.filter(p=>p.name).map((p,i)=>(
                  <div key={p.id} className="glass-sm" style={{padding:'14px 18px',borderRadius:14}}>
                    <div style={{display:'flex',alignItems:'center',gap:10}}>
                      <div className="place-step-num">{i+1}</div>
                      <div>
                        <div style={{fontWeight:600,color:'#fff',fontSize:'0.95rem'}}>{p.name}</div>
                        {p.start_time && <div style={{fontSize:'0.78rem',color:'var(--accent)'}}>{p.start_time}{p.end_time?` – ${p.end_time}`:''}</div>}
                        {p.address && <div style={{fontSize:'0.78rem',color:'var(--text3)'}}>{p.address}</div>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="wizard-actions">
                <button className="btn-ghost" onClick={()=>setStep(4)}><ArrowLeft size={15}/> Back</button>
                <button className="btn-primary" disabled={saving} onClick={handleSave}>
                  {saving ? '💕 Saving...' : <><Check size={15}/> Save Date Plan</>}
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
