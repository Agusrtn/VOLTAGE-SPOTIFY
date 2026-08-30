import { getSupabaseClient } from './supabase';

const supabase = () => getSupabaseClient();

export const getCurrentUser = async () => {
  const db = supabase();
  if (!db) return null;
  const { data: { user } } = await db.auth.getUser();
  return user;
};

export const signUp = async (email, password, name) => {
  const db = supabase();
  if (!db) throw new Error('Supabase not configured');
  const { data, error } = await db.auth.signUp({
    email,
    password,
    options: { data: { name } }
  });
  if (error) throw error;
  return data;
};

export const signIn = async (email, password) => {
  const db = supabase();
  if (!db) throw new Error('Supabase not configured');
  const { data, error } = await db.auth.signInWithPassword({
    email,
    password
  });
  if (error) throw error;
  return data;
};

export const signOut = async () => {
  const db = supabase();
  if (!db) return;
  await db.auth.signOut();
};

export const loadTracks = async () => {
  const db = supabase();
  if (!db) return [];
  const { data, error } = await db.from('tracks').select('*').order('created_at', { ascending: false });
  if (error) return [];
  return data || [];
};

export const saveTrack = async (track) => {
  const db = supabase();
  if (!db) return track;
  const { data, error } = await db.from('tracks').insert(track).select().single();
  if (error) return track;
  return data;
};

export const deleteTrack = async (trackId) => {
  const db = supabase();
  if (!db) return;
  await db.from('tracks').delete().eq('id', trackId);
};

export const loadPlaylists = async (userId) => {
  const db = supabase();
  if (!db) return [];
  const { data, error } = await db.from('playlists').select('*').eq('user_id', userId).order('created_at', { ascending: false });
  if (error) return [];
  return data || [];
};

export const savePlaylist = async (playlist) => {
  const db = supabase();
  if (!db) return playlist;
  const { data, error } = await db.from('playlists').insert(playlist).select().single();
  if (error) return playlist;
  return data;
};

export const deletePlaylist = async (id) => {
  const db = supabase();
  if (!db) return;
  await db.from('playlists').delete().eq('id', id);
};

export const loadAlbums = async () => {
  const db = supabase();
  if (!db) return [];
  const { data, error } = await db.from('albums').select('*').order('created_at', { ascending: false });
  if (error) return [];
  return data || [];
};

export const saveAlbum = async (album) => {
  const db = supabase();
  if (!db) return album;
  const { data, error } = await db.from('albums').insert(album).select().single();
  if (error) return album;
  return data;
};

export const deleteAlbum = async (id) => {
  const db = supabase();
  if (!db) return;
  await db.from('albums').delete().eq('id', id);
};

export const loadLikes = async (userId) => {
  const db = supabase();
  if (!db) return [];
  const { data, error } = await db.from('likes').select('track_id').eq('user_id', userId);
  if (error) return [];
  return (data || []).map((item) => item.track_id);
};

export const saveLike = async (userId, trackId) => {
  const db = supabase();
  if (!db) return;
  await db.from('likes').insert({ user_id: userId, track_id: trackId });
};

export const deleteLike = async (userId, trackId) => {
  const db = supabase();
  if (!db) return;
  await db.from('likes').delete().eq('user_id', userId).eq('track_id', trackId);
};

export const loadHistory = async (userId) => {
  const db = supabase();
  if (!db) return [];
  const { data, error } = await db.from('history').select('*').eq('user_id', userId).order('played_at', { ascending: false });
  if (error) return [];
  return data || [];
};

export const saveHistoryItem = async (item) => {
  const db = supabase();
  if (!db) return;
  await db.from('history').insert(item);
};

export const loadNotifications = async (userId) => {
  const db = supabase();
  if (!db) return [];
  const { data, error } = await db.from('notifications').select('*').eq('user_id', userId).order('created_at', { ascending: false });
  if (error) return [];
  return data || [];
};

export const saveNotification = async (notification) => {
  const db = supabase();
  if (!db) return;
  await db.from('notifications').insert(notification);
};

export const loadSettings = async (userId) => {
  const db = supabase();
  if (!db) return null;
  const { data, error } = await db.from('profiles').select('*').eq('id', userId).single();
  if (error || !data) return null;
  return {
    language: data.language || 'es',
    theme: data.theme || 'dark',
    autoplay: data.autoplay ?? true,
    privateProfile: data.private_profile ?? false,
    crossfade: data.crossfade ?? false
  };
};

export const saveSettings = async (userId, settings) => {
  const db = supabase();
  if (!db) return;
  const { error } = await db.from('profiles').update({
    language: settings.language,
    theme: settings.theme,
    autoplay: settings.autoplay,
    private_profile: settings.privateProfile,
    crossfade: settings.crossfade
  }).eq('id', userId);
  if (error) console.error('Error saving settings:', error);
};

export const loadFollows = async (userId) => {
  const db = supabase();
  if (!db) return [];
  const { data, error } = await db.from('follows').select('following_id').eq('follower_id', userId);
  if (error) return [];
  return (data || []).map((item) => item.following_id);
};

export const getFollowersOf = async (userId) => {
  const db = supabase();
  if (!db) return [];
  const { data, error } = await db.from('follows').select('follower_id').eq('following_id', userId);
  if (error) return [];
  return (data || []).map((item) => item.follower_id);
};

export const toggleFollow = async (followerId, followingId) => {
  const db = supabase();
  if (!db) return false;
  const { data: existing } = await db
    .from('follows')
    .select('id')
    .eq('follower_id', followerId)
    .eq('following_id', followingId)
    .maybeSingle();

  if (existing) {
    await db.from('follows').delete().eq('id', existing.id);
    return false;
  }

  const { error } = await db.from('follows').insert({ follower_id: followerId, following_id: followingId });
  if (error) return false;
  return true;
};

export const uploadAudio = async (file, userId) => {
  const db = supabase();
  if (!db) return null;
  const path = `${userId}/${Date.now()}-${file.name}`;
  const { data, error } = await db.storage
    .from('audio')
    .upload(path, file, { contentType: file.type, upsert: true });
  if (error) return null;
  const { data: { publicUrl } } = db.storage.from('audio').getPublicUrl(path);
  return publicUrl;
};
