import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

const AppContext = createContext();

// ── LocalStorage helpers ──
const LS_KEY = 'loveapp-dates-v2';

const loadFromLS = () => {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
};

const saveToLS = (dates) => {
  try { localStorage.setItem(LS_KEY, JSON.stringify(dates)); } catch {}
};

// ── Try Supabase in background (optional sync) ──
let supabaseClient = null;

const initSupabase = async () => {
  try {
    const url = process.env.REACT_APP_SUPABASE_URL;
    const key = process.env.REACT_APP_SUPABASE_ANON_KEY;
    if (!url || url === 'YOUR_SUPABASE_URL' || !key || key === 'YOUR_SUPABASE_ANON_KEY') return null;
    const { createClient } = await import('@supabase/supabase-js');
    return createClient(url, key);
  } catch { return null; }
};

export function AppProvider({ children }) {
  const [dates, setDates] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load from localStorage immediately on mount
  useEffect(() => {
    const stored = loadFromLS();
    if (stored && stored.length > 0) {
      setDates(stored);
      setLoading(false);
    } else {
      // First time — try Supabase, else show empty
      initSupabase().then(async (client) => {
        if (client) {
          try {
            supabaseClient = client;
            const { data } = await client.from('date_entries').select('*').order('date');
            if (data && data.length > 0) {
              setDates(data);
              saveToLS(data);
            }
          } catch {}
        }
        setLoading(false);
      });
    }
  }, []);

  // ── Sync to Supabase in background ──
  const syncToSupabase = async (entry, action) => {
    try {
      if (!supabaseClient) supabaseClient = await initSupabase();
      if (!supabaseClient) return;
      if (action === 'insert') {
        await supabaseClient.from('date_entries').upsert([entry]);
      } else if (action === 'update') {
        await supabaseClient.from('date_entries').upsert([entry]);
      } else if (action === 'delete') {
        await supabaseClient.from('date_entries').delete().eq('id', entry);
      }
    } catch {} // Silent fail — localStorage is source of truth
  };

  const addDate = useCallback(async (entry) => {
    const newEntry = {
      ...entry,
      id: `local_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      created_at: new Date().toISOString(),
    };
    setDates(prev => {
      const updated = [...prev, newEntry];
      saveToLS(updated);
      return updated;
    });
    toast.success(entry.status === 'past' ? 'Memory saved! 📸' : 'Date planned! 💜');
    syncToSupabase(newEntry, 'insert');
    return newEntry;
  }, []);

  const editDate = useCallback(async (id, updates) => {
    setDates(prev => {
      const updated = prev.map(d => d.id === id ? { ...d, ...updates } : d);
      saveToLS(updated);
      return updated;
    });
    syncToSupabase({ id, ...updates }, 'update');
  }, []);

  const removeDate = useCallback(async (id) => {
    setDates(prev => {
      const updated = prev.filter(d => d.id !== id);
      saveToLS(updated);
      return updated;
    });
    toast.success('Removed 🌸');
    syncToSupabase(id, 'delete');
  }, []);

  const upcomingDates = dates
    .filter(d => d.status === 'upcoming')
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const pastDates = dates
    .filter(d => d.status === 'past')
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <AppContext.Provider value={{
      dates, upcomingDates, pastDates, loading,
      addDate, editDate, removeDate,
      theme: 'dark', setTheme: () => {},
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
