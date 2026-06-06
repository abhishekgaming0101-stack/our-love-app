import { useState, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { format } from 'date-fns';
import { Camera, Upload, ChevronLeft, MapPin, Clock, ExternalLink, Heart, Trash2, Plus } from 'lucide-react';
import { uploadPhoto, addPhoto } from '../utils/supabase';
import './Memories.css';

function PhotoGrid({ photos, onAddPhotos, dateId }) {
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [localPhotos, setLocalPhotos] = useState(photos || []);

  const handleFiles = async (files) => {
    if (!files.length) return;
    setUploading(true);
    const newPhotos = [];
    for (const file of files) {
      try {
        let url;
        try {
          const path = `${dateId}/${Date.now()}-${file.name}`;
          url = await uploadPhoto(file, path);
        } catch {
          url = await new Promise(res => {
            const r = new FileReader();
            r.onload = e => res(e.target.result);
            r.readAsDataURL(file);
          });
        }
        const photo = {
          id: Date.now().toString() + Math.random(),
          date_id: dateId, url,
          caption: '',
          type: file.type.startsWith('video') ? 'video' : 'photo',
        };
        try { await addPhoto(photo); } catch {}
        newPhotos.push(photo);
      } catch (e) { console.error(e); }
    }
    const updated = [...localPhotos, ...newPhotos];
    setLocalPhotos(updated);
    onAddPhotos(updated);
    setUploading(false);
  };

  return (
    <div className="photo-section">
      <div className="photo-section-label"><Camera size={13}/> Photos & Videos</div>
      {localPhotos.length > 0 && (
        <div className="photo-grid">
          {localPhotos.map((photo, i) => (
            <motion.div key={photo.id} className="photo-item"
              initial={{opacity:0,scale:.85}} animate={{opacity:1,scale:1}}
              transition={{delay:i*.05}}>
              {photo.type === 'video'
                ? <video src={photo.url} controls className="photo-media"/>
                : <img src={photo.url} alt={`Memory ${i+1}`} className="photo-media"/>}
            </motion.div>
          ))}
        </div>
      )}
      <div className="photo-drop-zone"
        onClick={() => fileRef.current?.click()}
        onDrop={e=>{e.preventDefault();handleFiles(Array.from(e.dataTransfer.files));}}
        onDragOver={e=>e.preventDefault()}
        data-hover>
        <input ref={fileRef} type="file" multiple accept="image/*,video/*"
          style={{display:'none'}} onChange={e=>handleFiles(Array.from(e.target.files))}/>
        {uploading
          ? <span className="upload-spinner">💜 Uploading...</span>
          : <><Upload size={18}/><span>Drop photos/videos or click to upload</span></>}
      </div>
    </div>
  );
}

function MemoryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { dates, editDate, removeDate } = useApp();
  const date = dates.find(d => d.id === id);

  if (!date) return (
    <div className="memories-page">
      <div className="memories-container" style={{textAlign:'center',paddingTop:80}}>
        <div style={{fontSize:'3rem',marginBottom:12}}>🌸</div>
        <h3 style={{fontFamily:'var(--font-display)',fontSize:'1.8rem',fontWeight:300,color:'#fff',marginBottom:8}}>Memory not found</h3>
        <Link to="/memories" className="btn-ghost" style={{marginTop:16,display:'inline-flex'}}>Back to Memories</Link>
      </div>
    </div>
  );

  return (
    <div className="memories-page">
      <div className="memories-container">
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}>
          <Link to="/memories" className="back-link"><ChevronLeft size={15}/> All Memories</Link>

          <div className="memory-hero">
            <div className="memory-hero-emoji">{date.cover_emoji||'💕'}</div>
            <div>
              {date.mood && <span className="mood-tag" style={{display:'inline-block',marginBottom:8}}>{date.mood}</span>}
              <h1>{date.title}</h1>
              <p className="memory-hero-date"><MapPin size={13}/>{format(new Date(date.date),'EEEE, MMMM do, yyyy')}</p>
            </div>
            <button className="delete-btn" style={{marginLeft:'auto'}}
              onClick={async()=>{if(window.confirm('Remove this memory? 💔')){await removeDate(id);navigate('/memories');}}}>
              <Trash2 size={16}/>
            </button>
          </div>

          {date.notes && (
            <div className="memory-notes glass-sm">
              <Heart size={13} fill="var(--accent)" color="var(--accent)"/>
              <p>"{date.notes}"</p>
            </div>
          )}

          {date.places?.filter(p=>p.name).length > 0 && (
            <div className="memory-itinerary glass">
              <div className="body-section-label">How the day went</div>
              <div className="place-timeline">
                {date.places.filter(p=>p.name).map((p,i,arr)=>(
                  <div key={p.id} className="timeline-item">
                    <div className="timeline-line">
                      <div className="timeline-dot"/>
                      {i<arr.length-1&&<div className="timeline-connector"/>}
                    </div>
                    <div className="timeline-content">
                      <div className="timeline-header">
                        <h4>{p.name}</h4>
                        {p.start_time&&<span className="timeline-time"><Clock size={11}/>{p.start_time}{p.end_time?` – ${p.end_time}`:''}</span>}
                      </div>
                      {p.address&&<p className="timeline-address"><MapPin size={11}/>{p.address}{p.maps_url&&<a href={p.maps_url} target="_blank" rel="noreferrer" className="maps-link"><ExternalLink size={10}/> Maps</a>}</p>}
                      {p.notes&&<p className="timeline-notes">"{p.notes}"</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <PhotoGrid photos={date.photos||[]} onAddPhotos={p=>editDate(id,{photos:p})} dateId={id}/>
        </motion.div>
      </div>
    </div>
  );
}

function MemoriesList() {
  const { pastDates } = useApp();
  return (
    <div className="memories-page">
      <div className="memories-container">
        <motion.div className="page-header"
          initial={{opacity:0,y:-20}} animate={{opacity:1,y:0}}>
          <span className="page-header-emoji">📸</span>
          <h1>Our <em>Memories</em></h1>
          <p>Every chapter of our story</p>
        </motion.div>

        {pastDates.length === 0 ? (
          <motion.div className="empty-state glass"
            initial={{opacity:0,scale:.92}} animate={{opacity:1,scale:1}}>
            <div className="empty-emoji">📷</div>
            <h3>No memories yet</h3>
            <p>Past dates will appear here with all your photos</p>
            <Link to="/plan" className="btn-primary"><Plus size={14}/> Plan Your First Date</Link>
          </motion.div>
        ) : (
          <div className="memories-grid">
            {pastDates.map((date, i) => (
              <motion.div key={date.id}
                initial={{opacity:0,y:30}} animate={{opacity:1,y:0}}
                transition={{delay:i*.08}}>
                <Link to={`/memories/${date.id}`} className="memory-card" data-hover>
                  <div className="memory-card-cover">
                    {date.photos?.length > 0
                      ? <img src={date.photos[0].url} alt={date.title} className="memory-cover-img"/>
                      : <div className="memory-cover-placeholder"><span>{date.cover_emoji||'💕'}</span></div>}
                    <div className="memory-card-overlay"/>
                    {date.mood && (
                      <span className="mood-tag" style={{position:'absolute',top:14,right:14}}>
                        {date.mood}
                      </span>
                    )}
                  </div>
                  <div className="memory-card-body">
                    <h3>{date.title}</h3>
                    <p className="memory-card-date">{format(new Date(date.date),'MMMM do, yyyy')}</p>
                    {date.places?.filter(p=>p.name).length > 0 && (
                      <p className="memory-card-places">
                        <MapPin size={11}/>
                        {date.places.filter(p=>p.name).slice(0,2).map(p=>p.name).join(', ')}
                        {date.places.filter(p=>p.name).length > 2 && ` +${date.places.filter(p=>p.name).length-2}`}
                      </p>
                    )}
                    {date.photos?.length > 0 && (
                      <p className="memory-photo-count"><Camera size={11}/> {date.photos.length} photo{date.photos.length>1?'s':''}</p>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Memories() {
  const { id } = useParams();
  return id ? <MemoryDetail/> : <MemoriesList/>;
}
