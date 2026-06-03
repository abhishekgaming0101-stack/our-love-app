import { createClient } from '@supabase/supabase-js';

// These will be replaced by the user's own Supabase credentials
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseKey);

// ── Date Entries ──
export const getDateEntries = async () => {
  const { data, error } = await supabase
    .from('date_entries')
    .select('*')
    .order('date', { ascending: true });
  if (error) throw error;
  return data || [];
};

export const createDateEntry = async (entry) => {
  const { data, error } = await supabase
    .from('date_entries')
    .insert([entry])
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const updateDateEntry = async (id, updates) => {
  const { data, error } = await supabase
    .from('date_entries')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const deleteDateEntry = async (id) => {
  const { error } = await supabase
    .from('date_entries')
    .delete()
    .eq('id', id);
  if (error) throw error;
};

// ── Photo Upload ──
export const uploadPhoto = async (file, path) => {
  const { data, error } = await supabase.storage
    .from('date-photos')
    .upload(path, file, { upsert: true });
  if (error) throw error;
  const { data: urlData } = supabase.storage.from('date-photos').getPublicUrl(data.path);
  return urlData.publicUrl;
};

export const getPhotos = async (dateId) => {
  const { data, error } = await supabase
    .from('date_photos')
    .select('*')
    .eq('date_id', dateId)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data || [];
};

export const addPhoto = async (photo) => {
  const { data, error } = await supabase
    .from('date_photos')
    .insert([photo])
    .select()
    .single();
  if (error) throw error;
  return data;
};
