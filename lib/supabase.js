import { createClient } from '@supabase/supabase-js';

let client = null;

export const getSupabaseClient = () => {
  if (!client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (url && key && !url.includes('placeholder') && !key.includes('placeholder')) {
      client = createClient(url, key);
    }
  }
  return client;
};

export const isSupabaseEnabled = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return Boolean(url && key && !url.includes('placeholder') && !key.includes('placeholder'));
};
