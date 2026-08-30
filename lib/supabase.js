import { createClient } from '@supabase/supabase-js';

let client = null;

export const getSupabaseClient = () => {
  if (client) return client;
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key || url.includes('placeholder') || key.includes('placeholder')) {
      return null;
    }
    client = createClient(url, key);
    return client;
  } catch (error) {
    console.error('Supabase init error:', error);
    return null;
  }
};

export const isSupabaseEnabled = () => {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    return Boolean(url && key && !url.includes('placeholder') && !key.includes('placeholder'));
  } catch {
    return false;
  }
};
