import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getDateEntries, createDateEntry, updateDateEntry, deleteDateEntry } from '../utils/supabase';
import toast from 'react-hot-toast';

const AppContext = createContext();

const DEMO_DATES = [
  {
    id: 'demo1',
    title: 'Rooftop Dinner Under Stars',
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'upcoming', cover_emoji: '🌹', mood: 'romantic',
    places: [
      { id:'p1', name:'The Rooftop Lounge', start_time:'19:00', end_time:'21:00', address:'Sky Bar, Level 32, MG Road', maps_url:'', notes:'Pre-dinner cocktails, watch the sunset 🌅' },
      { id:'p2', name:'Celeste Restaurant', start_time:'21:00', end_time:'23:00', address:'14 Koregaon Park, Pune', maps_url:'', notes:'Candlelit dinner, surprise dessert 🕯️' },
    ],
    photos: [], created_at: new Date().toISOString(),
  },
  {
    id: 'demo2',
    title: 'Cozy Cafe & Bookshop Morning',
    date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'past', cover_emoji: '☕', mood: 'cozy',
    places: [{ id:'p3', name:'The Reading Cafe', start_time:'10:00', end_time:'12:30', address:'FC Road, Pune', maps_url:'', notes:'Lattes, croissants, reading together' }],
    photos: [], notes: 'The best lazy Sunday morning 💕', created_at: new Date().toISOString(),
  },
];

export function AppProvider({ children }) {
  const [dates, setDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usingDemo, setUsingDemo] = useState(false);

  // Always dark theme
  useEffect(() => { document.documentElement.setAttribute('data-theme', 'dark'); }, []);

  const saveLocally = (updated) => {
    localStorage.setItem('love-dates-local', JSON.stringify(updated));
    setDates(updated);
  };

  const fetchDates = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getDateEntries();
      if (data.length === 0) { setDates(DEMO_DATES); setUsingDemo(true); }
      else { setDates(data); setUsingDemo(false); }
    } catch {
      const stored = localStorage.getItem('love-dates-local');
      if (stored) { setDates(JSON.parse(stored)); }
      else { setDates(DEMO_DATES); setUsingDemo(true); }
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchDates(); }, [fetchDates]);

  const addDate = async (entry) => {
    try {
      if (usingDemo || !process.env.REACT_APP_SUPABASE_URL || process.env.REACT_APP_SUPABASE_URL === 'YOUR_SUPABASE_URL') {
        const newEntry = { ...entry, id: Date.now().toString(), created_at: new Date().toISOString() };
        const updated = [...dates.filter(d => !d.id.startsWith('demo')), newEntry];
        saveLocally(updated); setUsingDemo(false);
        toast.success('Date planned! 💕'); return newEntry;
      }
      const created = await createDateEntry(entry);
      setDates(prev => [...prev, created]);
      toast.success('Date planned! 💕'); return created;
    } catch {
      const newEntry = { ...entry, id: Date.now().toString(), created_at: new Date().toISOString() };
      saveLocally([...dates, newEntry]);
      toast.success('Date saved! 💕'); return newEntry;
    }
  };

  const editDate = async (id, updates) => {
    try {
      if (!usingDemo && process.env.REACT_APP_SUPABASE_URL && process.env.REACT_APP_SUPABASE_URL !== 'YOUR_SUPABASE_URL') {
        await updateDateEntry(id, updates);
      }
    } catch {}
    const updated = dates.map(d => d.id === id ? { ...d, ...updates } : d);
    saveLocally(updated);
  };

  const removeDate = async (id) => {
    try {
      if (!usingDemo && process.env.REACT_APP_SUPABASE_URL && process.env.REACT_APP_SUPABASE_URL !== 'YOUR_SUPABASE_URL') {
        await deleteDateEntry(id);
      }
    } catch {}
    saveLocally(dates.filter(d => d.id !== id));
    toast.success('Removed 🌸');
  };

  const upcomingDates = dates.filter(d => d.status === 'upcoming').sort((a,b) => new Date(a.date)-new Date(b.date));
  const pastDates     = dates.filter(d => d.status === 'past').sort((a,b) => new Date(b.date)-new Date(a.date));

  return (
    <AppContext.Provider value={{ dates, upcomingDates, pastDates, loading, addDate, editDate, removeDate, fetchDates, usingDemo, theme:'dark', setTheme:()=>{} }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
