import { getSupabaseClient, isSupabaseEnabled } from './supabase';

const supabase = () => getSupabaseClient();

export const getCurrentUser = async () => {
  if (!isSupabaseEnabled()) return null;
  const { data: { user } } = await supabase().auth.getUser();
  return user;
};

export const signUp = async (email, password, name) => {
  if (!isSupabaseEnabled()) throw new Error('Supabase not configured');
  const { data, error } = await supabase().auth.signUp({
    email,
    password,
    options: { data: { name } }
  });
  if (error) throw error;
  return data;
};

export const signIn = async (email, password) => {
  if (!isSupabaseEnabled()) throw new Error('Supabase not configured');
  const { data, error } = await supabase().auth.signInWithPassword({
    email,
    password
  });
  if (error) throw error;
  return data;
};

export const signOut = async () => {
  if (!isSupabaseEnabled()) return;
  await supabase().auth.signOut();
};

export const loadTracks = async () => {
  if (!isSupabaseEnabled()) return [];
  const { data, error } = await supabase().from('tracks').select('*').order('created_at', { ascending: false });
  if (error) return [];
  return data || [];
};

export const saveTrack = async (track) => {
  if (!isSupabaseEnabled()) return track;
  const { data, error } = await supabase().from('tracks').insert(track).select().single();
  if (error) return track;
  return data;
};

export const deleteTrack = async (trackId) => {
  if (!isSupabaseEnabled()) return;
  await supabase().from('tracks').delete().eq('id', trackId);
};

export const loadPlaylists = async (userId) => {
  if (!isSupabaseEnabled()) return [];
  const { data, error } = await supabase().from('playlists').select('*').eq('user_id', userId).order('created_at', { ascending: false });
  if (error) return [];
  return data || [];
};

export const savePlaylist = async (playlist) => {
  if (!isSupabaseEnabled()) return playlist;
  const { data, error } = await supabase().from('playlists').insert(playlist).select().single();
  if (error) return playlist;
  return data;
};

export const deletePlaylist = async (id) => {
  if (!isSupabaseEnabled()) return;
  await supabase().from('playlists').delete().eq('id', id);
};

export const loadAlbums = async () => {
  if (!isSupabaseEnabled()) return [];
  const { data, error } = await supabase().from('albums').select('*').order('created_at', { ascending: false });
  if (error) return [];
  return data || [];
};

export const saveAlbum = async (album) => {
  if (!isSupabaseEnabled()) return album;
  const { data, error } = await supabase().from('albums').insert(album).select().single();
  if (error) return album;
  return data;
};

export const deleteAlbum = async (id) => {
  if (!isSupabaseEnabled()) return;
  await supabase().from('albums').delete().eq('id', id);
};

export const loadLikes = async (userId) => {
  if (!isSupabaseEnabled()) return [];
  const { data, error } = await supabase().from('likes').select('track_id').eq('user_id', userId);
  if (error) return [];
  return (data || []).map((item) => item.track_id);
};

export const saveLike = async (userId, trackId) => {
  if (!isSupabaseEnabled()) return;
  await supabase().from('likes').insert({ user_id: userId, track_id: trackId });
};

export const deleteLike = async (userId, trackId) => {
  if (!isSupabaseEnabled()) return;
  await supabase().from('likes').delete().eq('user_id', userId).eq('track_id', trackId);
};

export const loadHistory = async (userId) => {
  if (!isSupabaseEnabled()) return [];
  const { data, error } = await supabase().from('history').select('*').eq('user_id', userId).order('played_at', { ascending: false });
  if (error) return [];
  return data || [];
};

export const saveHistoryItem = async (item) => {
  if (!isSupabaseEnabled()) return;
  await supabase().from('history').insert(item);
};

export const loadNotifications = async (userId) => {
  if (!isSupabaseEnabled()) return [];
  const { data, error } = await supabase().from('notifications').select('*').eq('user_id', userId).order('created_at', { ascending: false });
  if (error) return [];
  return data || [];
};

export const saveNotification = async (notification) => {
  if (!isSupabaseEnabled()) return;
  await supabase().from('notifications').insert(notification);
};

export const loadSettings = async (userId) => {
  if (!isSupabaseEnabled()) return null;
  const { data, error } = await supabase().from('profiles').select('*').eq('id', userId).single();
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
  if (!isSupabaseEnabled()) return;
  const { error } = await supabase().from('profiles').update({
    language: settings.language,
    theme: settings.theme,
    autoplay: settings.autoplay,
    private_profile: settings.privateProfile,
    crossfade: settings.crossfade
  }).eq('id', userId);
  if (error) console.error('Error saving settings:', error);
};

export const loadFollows = async (userId) => {
  if (!isSupabaseEnabled()) return [];
  const { data, error } = await supabase().from('follows').select('following_id').eq('follower_id', userId);
  if (error) return [];
  return (data || []).map((item) => item.following_id);
};

export const getFollowersOf = async (userId) => {
  if (!isSupabaseEnabled()) return [];
  const { data, error } = await supabase().from('follows').select('follower_id').eq('following_id', userId);
  if (error) return [];
  return (data || []).map((item) => item.follower_id);
};

export const toggleFollow = async (followerId, followingId) => {
  if (!isSupabaseEnabled()) return false;
  const { data: existing } = await supabase()
    .from('follows')
    .select('id')
    .eq('follower_id', followerId)
    .eq('following_id', followingId)
    .maybeSingle();

  if (existing) {
    await supabase().from('follows').delete().eq('id', existing.id);
    return false;
  }

  const { error } = await supabase().from('follows').insert({ follower_id: followerId, following_id: followingId });
  if (error) return false;
  return true;
};

export const uploadAudio = async (file, userId) => {
  if (!isSupabaseEnabled()) return null;
  const path = `${userId}/${Date.now()}-${file.name}`;
  const { data, error } = await supabase().storage
    .from('audio')
    .upload(path, file, { contentType: file.type, upsert: true });
  if (error) return null;
  const { data: { publicUrl } } = supabase().storage.from('audio').getPublicUrl(path);
  return publicUrl;
};
