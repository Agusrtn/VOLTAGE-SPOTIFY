import { createClient } from '@supabase/supabase-js';

let client = null;
let checked = false;

export const getSupabaseClient = () => {
  if (client) return client;
  if (checked) return null;

  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key || url.includes('placeholder') || key.includes('placeholder')) {
      checked = true;
      return null;
    }
    client = createClient(url, key);
    return client;
  } catch (error) {
    console.error('Supabase init error:', error);
    checked = true;
    return null;
  }
};

export const isSupabaseEnabled = () => {
  return getSupabaseClient() !== null;
};
