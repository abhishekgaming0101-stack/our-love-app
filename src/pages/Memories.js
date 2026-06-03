import { useState, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { format } from 'date-fns';
import { Camera, Upload, X, ChevronLeft, MapPin, Clock, ExternalLink, Heart, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
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
        // Try Supabase upload; fall back to data URL for demo
        let url;
        try {
          const path = `${dateId}/${Date.now()}-${file.name}`;
          url = await uploadPhoto(file, path);
        } catch {
          url = await new Promise(res => {
            const reader = new FileReader();
            reader.onload = e => res(e.target.result);
            reader.readAsDataURL(file);
          });
        }
        const photo = {
          id: Date.now().toString() + Math.random(),
          date_id: dateId,
          url,
          caption: '',
          type: file.type.startsWith('video') ? 'video' : 'photo',
        };
        try {
          await addPhoto(photo);
        } catch {
          // local only
        }
        newPhotos.push(photo);
      } catch (e) {
        console.error(e);
      }
    }
    const updated = [...localPhotos, ...newPhotos];
    setLocalPhotos(updated);
    onAddPhotos(updated);
    setUploading(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    handleFiles(Array.from(e.dataTransfer.files));
  };

  return (
    <div className="photo-section">
      <div className="photo-section-label">
        <Camera size={14} /> Photos & Videos
      </div>

      {localPhotos.length > 0 && (
        <div className="photo-grid">
          {localPhotos.map((photo, i) => (
            <motion.div
              key={photo.id}
              className="photo-item"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
            >
              {photo.type === 'video' ? (
                <video src={photo.url} controls className="photo-media" />
              ) : (
                <img src={photo.url} alt={photo.caption || `Memory ${i + 1}`} className="photo-media" />
              )}
            </motion.div>
          ))}
        </div>
      )}

      <div
        className={`photo-drop-zone ${uploading ? 'uploading' : ''}`}
        onDrop={onDrop}
        onDragOver={e => e.preventDefault()}
        onClick={() => fileRef.current?.click()}
        data-hover
      >
        <input
          ref={fileRef}
          type="file"
          multiple
          accept="image/*,video/*"
          style={{ display: 'none' }}
          onChange={e => handleFiles(Array.from(e.target.files))}
        />
        {uploading ? (
          <div className="upload-spinner">💕 Uploading...</div>
        ) : (
          <>
            <Upload size={20} />
            <span>Drop photos/videos or click to upload</span>
          </>
        )}
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
      <div className="upcoming-container" style={{ textAlign: 'center', padding: '120px 24px' }}>
        <div style={{ fontSize: '3rem' }}>🌸</div>
        <h3>Memory not found</h3>
        <Link to="/memories" className="btn-ghost" style={{ marginTop: '16px', display: 'inline-flex' }}>Back to Memories</Link>
      </div>
    </div>
  );

  const handleAddPhotos = (photos) => {
    editDate(id, { photos });
  };

  const handleDelete = async () => {
    if (window.confirm('Remove this memory? 💔')) {
      await removeDate(id);
      navigate('/memories');
    }
  };

  return (
    <div className="memories-page">
      <div className="memory-detail-bg" />

      <div className="memory-detail-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link to="/memories" className="back-link">
            <ChevronLeft size={16} /> All Memories
          </Link>

          <div className="memory-hero">
            <div className="memory-hero-emoji">{date.cover_emoji || '💕'}</div>
            <div>
              <div className={`mood-tag mood-${date.mood}`}>{date.mood}</div>
              <h1>{date.title}</h1>
              <p className="memory-hero-date">
                <MapPin size={14} />
                {format(new Date(date.date), 'EEEE, MMMM do, yyyy')}
              </p>
            </div>
            <button className="delete-btn" onClick={handleDelete} style={{ marginLeft: 'auto' }}>
              <Trash2 size={16} />
            </button>
          </div>

          {date.notes && (
            <div className="memory-notes glass-sm">
              <Heart size={14} fill="var(--rose)" color="var(--rose)" />
              <p>"{date.notes}"</p>
            </div>
          )}

          {date.places?.length > 0 && (
            <div className="memory-itinerary glass">
              <div className="body-section-label">How the day went</div>
              <div className="place-timeline">
                {date.places.map((place, i) => (
                  <div key={place.id} className="timeline-item">
                    <div className="timeline-line">
                      <div className="timeline-dot" />
                      {i < date.places.length - 1 && <div className="timeline-connector" />}
                    </div>
                    <div className="timeline-content glass-sm">
                      <div className="timeline-header">
                        <h4>{place.name}</h4>
                        {place.start_time && (
                          <span className="timeline-time">
                            <Clock size={12} />
                            {place.start_time}{place.end_time ? ` – ${place.end_time}` : ''}
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
                  </div>
                ))}
              </div>
            </div>
          )}

          <PhotoGrid photos={date.photos || []} onAddPhotos={handleAddPhotos} dateId={id} />
        </motion.div>
      </div>
    </div>
  );
}

function MemoriesList() {
  const { pastDates } = useApp();

  return (
    <div className="memories-page">
      <div className="memories-bg" />

      <div className="memories-container">
        <motion.div
          className="page-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="page-header-emoji">📸</span>
          <h1>Memories</h1>
          <p>Every chapter of our story</p>
        </motion.div>

        {pastDates.length === 0 ? (
          <motion.div
            className="empty-state glass"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="empty-emoji">📷</div>
            <h3>No memories yet</h3>
            <p>Past dates will appear here with all your photos</p>
            <Link to="/plan" className="btn-primary">Plan Your First Date</Link>
          </motion.div>
        ) : (
          <div className="memories-grid">
            {pastDates.map((date, i) => (
              <motion.div
                key={date.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <Link to={`/memories/${date.id}`} className="memory-card glass" data-hover>
                  <div className="memory-card-cover">
                    {date.photos?.length > 0 ? (
                      <img src={date.photos[0].url} alt={date.title} className="memory-cover-img" />
                    ) : (
                      <div className="memory-cover-placeholder">
                        <span>{date.cover_emoji || '💕'}</span>
                      </div>
                    )}
                    <div className="memory-card-overlay" />
                    <span className={`mood-tag mood-${date.mood}`} style={{ position: 'absolute', top: 16, right: 16 }}>
                      {date.mood}
                    </span>
                  </div>
                  <div className="memory-card-body">
                    <h3>{date.title}</h3>
                    <p className="memory-card-date">
                      {format(new Date(date.date), 'MMMM do, yyyy')}
                    </p>
                    {date.places?.length > 0 && (
                      <p className="memory-card-places">
                        <MapPin size={11} />
                        {date.places.map(p => p.name).filter(Boolean).slice(0, 2).join(', ')}
                        {date.places.length > 2 && ` +${date.places.length - 2} more`}
                      </p>
                    )}
                    {date.photos?.length > 0 && (
                      <p className="memory-photo-count">
                        <Camera size={11} /> {date.photos.length} photo{date.photos.length > 1 ? 's' : ''}
                      </p>
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
  return id ? <MemoryDetail /> : <MemoriesList />;
}
