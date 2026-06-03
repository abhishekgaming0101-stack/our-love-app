import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Plus, Trash2, MapPin, Clock, FileText, Link, Sparkles, ArrowLeft, ArrowRight } from 'lucide-react';
import { format, addMonths, subMonths, getDaysInMonth, startOfMonth } from 'date-fns';
import './Plan.css';

const MOODS = [
  { value: 'romantic', emoji: '🌹', label: 'Romantic' },
  { value: 'adventure', emoji: '🏔️', label: 'Adventure' },
  { value: 'cozy', emoji: '☕', label: 'Cozy' },
  { value: 'fun', emoji: '🎉', label: 'Fun' },
  { value: 'fancy', emoji: '🥂', label: 'Fancy' },
  { value: 'surprise', emoji: '🎁', label: 'Surprise' },
];

const COVER_EMOJIS = ['💕', '🌹', '🌸', '✨', '🥂', '🎭', '🌙', '☀️', '🌊', '🏔️', '🎪', '🍃'];

const emptyPlace = () => ({
  id: Date.now().toString(),
  name: '',
  start_time: '',
  end_time: '',
  address: '',
  maps_url: '',
  notes: '',
});

export default function PlanDate() {
  const navigate = useNavigate();
  const { addDate } = useApp();

  const [step, setStep] = useState(1); // 1=calendar 2=details
  const [calMonth, setCalMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [title, setTitle] = useState('');
  const [mood, setMood] = useState('romantic');
  const [coverEmoji, setCoverEmoji] = useState('💕');
  const [places, setPlaces] = useState([emptyPlace()]);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const year = calMonth.getFullYear();
  const month = calMonth.getMonth();
  const daysInMonth = getDaysInMonth(calMonth);
  const firstDay = startOfMonth(calMonth).getDay();
  const today = new Date();

  const calDays = [];
  for (let i = 0; i < firstDay; i++) calDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) calDays.push(d);

  const isSelected = (d) => {
    if (!d || !selectedDate) return false;
    return selectedDate.getDate() === d && selectedDate.getMonth() === month && selectedDate.getFullYear() === year;
  };

  const isPast = (d) => {
    if (!d) return false;
    const date = new Date(year, month, d);
    return date < new Date(today.getFullYear(), today.getMonth(), today.getDate());
  };

  const addPlace = () => setPlaces(prev => [...prev, emptyPlace()]);
  const removePlace = (id) => setPlaces(prev => prev.filter(p => p.id !== id));
  const updatePlace = (id, field, value) =>
    setPlaces(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));

  const handleSave = async () => {
    if (!selectedDate || !title.trim()) return;
    setSaving(true);
    try {
      const entry = {
        title: title.trim(),
        date: format(selectedDate, 'yyyy-MM-dd'),
        status: 'upcoming',
        mood,
        cover_emoji: coverEmoji,
        places: places.filter(p => p.name.trim()),
        notes: notes.trim(),
        photos: [],
      };
      const created = await addDate(entry);
      navigate('/upcoming');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="plan-page">
      <div className="plan-bg" />

      <div className="plan-container">
        <motion.div
          className="plan-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="plan-header-emoji">🗓️</span>
          <h1>Plan a Date</h1>
          <p>Build something beautiful to look forward to</p>
        </motion.div>

        {/* STEP INDICATOR */}
        <div className="step-indicator">
          {['Pick a Date', 'Build Itinerary'].map((label, i) => (
            <div key={i} className={`step-item ${step === i + 1 ? 'active' : ''} ${step > i + 1 ? 'done' : ''}`}>
              <div className="step-circle">{step > i + 1 ? '✓' : i + 1}</div>
              <span>{label}</span>
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="step-content"
            >
              {/* CALENDAR */}
              <div className="calendar-card glass">
                <div className="cal-header">
                  <button className="cal-nav" onClick={() => setCalMonth(m => subMonths(m, 1))}>
                    <ArrowLeft size={18} />
                  </button>
                  <h2 className="cal-month-title">{format(calMonth, 'MMMM yyyy')}</h2>
                  <button className="cal-nav" onClick={() => setCalMonth(m => addMonths(m, 1))}>
                    <ArrowRight size={18} />
                  </button>
                </div>

                <div className="cal-weekdays">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                    <div key={d} className="cal-weekday">{d}</div>
                  ))}
                </div>

                <div className="cal-grid">
                  {calDays.map((d, i) => (
                    <motion.div
                      key={i}
                      className={`cal-day ${d ? 'active' : 'empty'} ${isSelected(d) ? 'selected' : ''} ${isPast(d) ? 'past' : ''}`}
                      whileHover={d && !isPast(d) ? { scale: 1.1 } : {}}
                      whileTap={d && !isPast(d) ? { scale: 0.95 } : {}}
                      onClick={() => d && !isPast(d) && setSelectedDate(new Date(year, month, d))}
                    >
                      {d && <span>{d}</span>}
                      {isSelected(d) && (
                        <motion.div className="cal-day-dot" layoutId="cal-dot" />
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>

              {selectedDate && (
                <motion.div
                  className="selected-date-preview glass-sm"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <span>📅</span>
                  <div>
                    <strong>{format(selectedDate, 'EEEE, MMMM do yyyy')}</strong>
                    <p>Ready to plan something special?</p>
                  </div>
                </motion.div>
              )}

              <div className="step-actions">
                <button
                  className="btn-primary"
                  disabled={!selectedDate}
                  onClick={() => setStep(2)}
                >
                  Continue <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              className="step-content"
            >
              <div className="details-grid">
                {/* LEFT: Title, mood, emoji */}
                <div className="details-left glass">
                  <div className="detail-date-badge">
                    📅 {format(selectedDate, 'EEEE, MMMM do')}
                  </div>

                  <div className="form-field">
                    <label>Date Name *</label>
                    <input
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      placeholder="e.g. Rooftop Dinner Under Stars"
                    />
                  </div>

                  <div className="form-field">
                    <label>Cover Emoji</label>
                    <div className="emoji-picker">
                      {COVER_EMOJIS.map(em => (
                        <button
                          key={em}
                          className={`emoji-btn ${coverEmoji === em ? 'selected' : ''}`}
                          onClick={() => setCoverEmoji(em)}
                        >
                          {em}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="form-field">
                    <label>Vibe / Mood</label>
                    <div className="mood-picker">
                      {MOODS.map(m => (
                        <button
                          key={m.value}
                          className={`mood-btn ${mood === m.value ? 'selected' : ''}`}
                          onClick={() => setMood(m.value)}
                        >
                          {m.emoji} {m.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="form-field">
                    <label>Overall Notes</label>
                    <textarea
                      value={notes}
                      onChange={e => setNotes(e.target.value)}
                      placeholder="Any special notes, surprises planned, things to remember..."
                      rows={4}
                    />
                  </div>
                </div>

                {/* RIGHT: Places */}
                <div className="details-right">
                  <div className="places-header">
                    <h3>Itinerary</h3>
                    <p className="places-subtitle">Add multiple stops for the day</p>
                  </div>

                  <div className="places-list">
                    <AnimatePresence>
                      {places.map((place, idx) => (
                        <motion.div
                          key={place.id}
                          className="place-card glass"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, height: 0 }}
                          layout
                        >
                          <div className="place-card-header">
                            <div className="place-number">{idx + 1}</div>
                            <h4>Stop {idx + 1}</h4>
                            {places.length > 1 && (
                              <button className="place-remove" onClick={() => removePlace(place.id)}>
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>

                          <div className="place-fields">
                            <div className="form-field">
                              <label><MapPin size={11} /> Place Name</label>
                              <input
                                value={place.name}
                                onChange={e => updatePlace(place.id, 'name', e.target.value)}
                                placeholder="e.g. The Rooftop Lounge"
                              />
                            </div>

                            <div className="place-times">
                              <div className="form-field">
                                <label><Clock size={11} /> From</label>
                                <input
                                  type="time"
                                  value={place.start_time}
                                  onChange={e => updatePlace(place.id, 'start_time', e.target.value)}
                                />
                              </div>
                              <div className="form-field">
                                <label><Clock size={11} /> To</label>
                                <input
                                  type="time"
                                  value={place.end_time}
                                  onChange={e => updatePlace(place.id, 'end_time', e.target.value)}
                                />
                              </div>
                            </div>

                            <div className="form-field">
                              <label><MapPin size={11} /> Address</label>
                              <input
                                value={place.address}
                                onChange={e => updatePlace(place.id, 'address', e.target.value)}
                                placeholder="Full address"
                              />
                            </div>

                            <div className="form-field">
                              <label><Link size={11} /> Google Maps Link</label>
                              <input
                                value={place.maps_url}
                                onChange={e => updatePlace(place.id, 'maps_url', e.target.value)}
                                placeholder="Paste Google Maps URL"
                              />
                            </div>

                            <div className="form-field">
                              <label><FileText size={11} /> Notes for this stop</label>
                              <textarea
                                value={place.notes}
                                onChange={e => updatePlace(place.id, 'notes', e.target.value)}
                                placeholder="What to do, what to order, what to bring..."
                                rows={2}
                              />
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>

                  <button className="add-place-btn" onClick={addPlace}>
                    <Plus size={16} /> Add Another Stop
                  </button>
                </div>
              </div>

              <div className="step-actions">
                <button className="btn-ghost" onClick={() => setStep(1)}>
                  <ArrowLeft size={16} /> Back
                </button>
                <button
                  className="btn-primary"
                  disabled={!title.trim() || saving}
                  onClick={handleSave}
                >
                  {saving ? '💕 Saving...' : <><Sparkles size={16} /> Save Date Plan</>}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
