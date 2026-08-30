'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  baseTracks,
  defaultUsers,
  LIKES_PLAYLIST_ID,
  moods,
  playlistData
} from '../lib/data';
import {
  deleteAlbum,
  deleteLike,
  deletePlaylist,
  deleteTrack,
  getFollowersOf,
  loadAlbums,
  loadFollows,
  loadHistory,
  loadLikes,
  loadNotifications,
  loadPlaylists,
  loadSettings,
  loadTracks,
  saveAlbum,
  saveHistoryItem,
  saveLike,
  saveNotification,
  savePlaylist,
  saveSettings,
  saveTrack,
  toggleFollow,
  signIn as supabaseSignIn,
  signUp as supabaseSignUp,
  signOut as supabaseSignOut,
  getCurrentUser,
} from '../lib/db';
import { isSupabaseEnabled } from '../lib/supabase';
import { t } from '../lib/i18n';
import { buildShareCode, getGreeting, hashPassword, parseShareCode, readFileAsDataUrl, verifyPassword } from '../lib/utils';

const MusicContext = createContext(null);

export function MusicProvider({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [authMode, setAuthMode] = useState('login');
  const [users, setUsers] = useState(defaultUsers);
  const [session, setSession] = useState(null);
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' });
  const [activeMood, setActiveMood] = useState('Night drive');
  const [selectedTrackId, setSelectedTrackId] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [search, setSearch] = useState('');
  const [volume, setVolume] = useState(0.7);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [queueOpen, setQueueOpen] = useState(false);
  const [customQueue, setCustomQueue] = useState(null);
  const [likedTrackIds, setLikedTrackIds] = useState([]);
  const [trackDetailOpen, setTrackDetailOpen] = useState(false);
  const [editTrack, setEditTrack] = useState({ id: null, title: '', album: '', accent: 'neon', coverUrl: '', genre: '', mood: '', isPodcast: false });
  const [trackViewOpen, setTrackViewOpen] = useState(false);
  const [viewTrackId, setViewTrackId] = useState(null);
  const audioRef = useRef(null);
  const [userTracks, setUserTracks] = useState([]);
  const [uploadForm, setUploadForm] = useState({ artistId: '', title: '', album: '', genre: '', mood: '', isPodcast: false, coverUrl: '', file: null });
  const [playlists, setPlaylists] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [profileEditOpen, setProfileEditOpen] = useState(false);
  const [profileEdit, setProfileEdit] = useState({ name: '', email: '', avatarUrl: '' });
  const [newPlaylistOpen, setNewPlaylistOpen] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistTrackIds, setNewPlaylistTrackIds] = useState([]);
  const [newAlbumOpen, setNewAlbumOpen] = useState(false);
  const [newAlbum, setNewAlbum] = useState({ name: '', artistId: '', coverUrl: '', trackIds: [] });
  const [selectedTrackIdsForAlbum, setSelectedTrackIdsForAlbum] = useState([]);
  const [history, setHistory] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [settings, setSettings] = useState({ language: 'es', theme: 'dark', autoplay: true, privateProfile: false, crossfade: false });
  const [searchFilter, setSearchFilter] = useState('all');
  const [libraryFilter, setLibraryFilter] = useState('playlists');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [shareData, setShareData] = useState({ type: '', id: 0, name: '' });
  const [followingIds, setFollowingIds] = useState([]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [nowPlayingOpen, setNowPlayingOpen] = useState(false);
  const [lyricsOpen, setLyricsOpen] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [connectOpen, setConnectOpen] = useState(false);
  const [activeDevice, setActiveDevice] = useState('Este dispositivo');
  const [installPrompt, setInstallPrompt] = useState(null);
  const [hydrated, setHydrated] = useState(false);
  const [baseTrackOverrides, setBaseTrackOverrides] = useState({});

  const lang = settings.language || 'es';
  const translate = useCallback((key, vars) => t(key, lang, vars), [lang]);

  const allTracks = useMemo(
    () => [...baseTracks.map((track) => ({ ...track, ...(baseTrackOverrides[track.id] || {}) })), ...userTracks],
    [userTracks, baseTrackOverrides]
  );

  const selectedTrack = useMemo(
    () => allTracks.find((track) => track.id === selectedTrackId) || allTracks[0],
    [selectedTrackId, allTracks]
  );

  const currentIndex = useMemo(
    () => allTracks.findIndex((track) => track.id === selectedTrackId),
    [selectedTrackId, allTracks]
  );

  const likesPlaylist = useMemo(
    () => ({
      id: LIKES_PLAYLIST_ID,
      name: translate('library.likes'),
      userId: session?.id,
      trackIds: likedTrackIds,
      isLikes: true
    }),
    [likedTrackIds, session?.id, translate]
  );

  const userPlaylists = useMemo(
    () => (session ? [likesPlaylist, ...playlists.filter((p) => p.userId === session.id)] : []),
    [likesPlaylist, playlists, session]
  );

  const recommendedTracks = useMemo(() => {
    const historyIds = history.slice(0, 10).map((h) => h.trackId);
    const scored = allTracks.map((track) => {
      let score = 0;
      if (track.mood === activeMood) score += 3;
      if (likedTrackIds.includes(track.id)) score += 2;
      if (historyIds.includes(track.id)) score += 1;
      return { track, score };
    });
    return scored.sort((a, b) => b.score - a.score).map((s) => s.track);
  }, [allTracks, activeMood, likedTrackIds, history]);

  const moodPlaylists = useMemo(
    () => playlistData.filter((p) => p.mood === activeMood || activeMood === 'Night drive'),
    [activeMood]
  );

  const queueTracks = useMemo(() => {
    const base = customQueue || allTracks;
    if (isShuffle) {
      const shuffled = [...base].sort(() => Math.random() - 0.5);
      return shuffled.filter((track) => track.id !== selectedTrackId);
    }
    const idx = base.findIndex((track) => track.id === selectedTrackId);
    if (idx === -1) return base.filter((track) => track.id !== selectedTrackId);
    return [...base.slice(idx + 1), ...base.slice(0, idx)].filter((track) => track.id !== selectedTrackId);
  }, [customQueue, allTracks, isShuffle, selectedTrackId]);

  const stats = useMemo(() => {
    const counts = {};
    history.forEach((item) => {
      const track = allTracks.find((t) => t.id === item.trackId);
      if (track) counts[track.artist] = (counts[track.artist] || 0) + 1;
    });
    const topArtist = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
    return { topArtist: topArtist?.[0] || '-', plays: history.length };
  }, [history, allTracks]);

  useEffect(() => {
    const savedUsers = JSON.parse(localStorage.getItem('spotify-clone-users') || 'null');
    const savedTheme = localStorage.getItem('grooveflow-theme') || 'dark';
    const savedLanguage = localStorage.getItem('grooveflow-language') || 'es';

    if (Array.isArray(savedUsers) && savedUsers.length) {
      const migrated = savedUsers.map((user) => ({
        ...user,
        role: user.role || 'user',
        isVerified: user.isVerified ?? false
      }));
      if (!migrated.some((user) => user.role === 'admin')) {
        migrated.unshift(defaultUsers[0]);
      }
      setUsers(migrated);
      localStorage.setItem('spotify-clone-users', JSON.stringify(migrated));
    }

    const savedSession = JSON.parse(localStorage.getItem('spotify-clone-session') || 'null');
    if (savedSession?.email) setSession(savedSession);
    setSettings((prev) => ({ ...prev, theme: savedTheme, language: savedLanguage }));

    const init = async () => {
      let tracks = [];
      let pls = [];
      let albs = [];
      let likes = [];
      let hist = [];
      let notes = [];
      let sett = null;
      let follows = [];
      let currentUser = savedSession;

      if (isSupabaseEnabled()) {
        try {
          const supaUser = await getCurrentUser();
          if (supaUser) {
            currentUser = {
              id: supaUser.id,
              email: supaUser.email,
              name: supaUser.user_metadata?.name || supaUser.email,
              role: 'user',
              isVerified: false
            };
            setSession(currentUser);
            localStorage.setItem('spotify-clone-session', JSON.stringify(currentUser));
          }
          const uid = currentUser?.id;
          [tracks, pls, albs, likes, hist, notes, sett, follows] = await Promise.all([
            loadTracks(),
            loadPlaylists(uid),
            loadAlbums(),
            uid ? loadLikes(uid) : Promise.resolve([]),
            uid ? loadHistory(uid) : Promise.resolve([]),
            uid ? loadNotifications(uid) : Promise.resolve([]),
            uid ? loadSettings(uid) : Promise.resolve(null),
            uid ? loadFollows(uid) : Promise.resolve([])
          ]);
        } catch (e) {
          console.error('Supabase init error:', e);
        }
      }

      if (!isSupabaseEnabled() || tracks.length === 0) {
        [tracks, pls, albs, likes, hist, notes, sett, follows] = await Promise.all([
          loadTracks(),
          loadPlaylists(),
          loadAlbums(),
          savedSession?.id ? loadLikes(savedSession.id) : Promise.resolve([]),
          savedSession?.id ? loadHistory(savedSession.id) : Promise.resolve([]),
          savedSession?.id ? loadNotifications(savedSession.id) : Promise.resolve([]),
          savedSession?.id ? loadSettings(savedSession.id) : Promise.resolve({ userId: savedSession?.id, language: savedLanguage, theme: savedTheme, autoplay: true, privateProfile: false }),
          savedSession?.id ? loadFollows(savedSession.id) : Promise.resolve([])
        ]);
      }

      if (Array.isArray(tracks)) setUserTracks(tracks);
      if (Array.isArray(pls)) setPlaylists(pls);
      if (Array.isArray(albs)) setAlbums(albs);
      if (Array.isArray(likes)) setLikedTrackIds(likes.map((l) => l.trackId));
      if (Array.isArray(hist)) setHistory(hist);
      if (Array.isArray(notes)) setNotifications(notes);
      if (sett) setSettings((prev) => ({ ...prev, ...sett }));
      if (Array.isArray(follows)) setFollowingIds(follows);
      setHydrated(true);
    };

    init();

    const onBeforeInstall = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
    return () => window.removeEventListener('beforeinstallprompt', onBeforeInstall);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem('spotify-clone-users', JSON.stringify(users));
  }, [users, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    if (session) localStorage.setItem('spotify-clone-session', JSON.stringify(session));
    else localStorage.removeItem('spotify-clone-session');
  }, [session, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem('grooveflow-theme', settings.theme);
    localStorage.setItem('grooveflow-language', settings.language);
    if (session) saveSettings(session.id, settings);
  }, [settings, session, hydrated]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', settings.theme);
    document.documentElement.lang = settings.language;
  }, [settings.theme, settings.language]);

  useEffect(() => {
    if (!hydrated || !session) return;
    if (pathname === '/') router.replace('/home');
  }, [hydrated, session, pathname, router]);

  useEffect(() => {
    const share = searchParams.get('share');
    if (!share || !hydrated || !session) return;
    const parsed = parseShareCode(share);
    if (!parsed) return;
    if (parsed.type === 'playlist') {
      if (parsed.id === LIKES_PLAYLIST_ID || String(parsed.id) === 'likes') router.push('/playlist/likes');
      else router.push(`/playlist/${parsed.id}`);
    } else if (parsed.type === 'album') router.push(`/album/${parsed.id}`);
    else if (parsed.type === 'profile') router.push(`/profile/${parsed.id}`);
  }, [searchParams, hydrated, session, router]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
    audio.playbackRate = playbackRate;
  }, [volume, playbackRate]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !selectedTrack) return;
    audio.src = selectedTrack.url;
    audio.load();
    setCurrentTime(0);
    if (isPlaying) audio.play().catch(() => setIsPlaying(false));
    else audio.pause();
  }, [selectedTrackId, selectedTrack?.url]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) audio.play().catch(() => setIsPlaying(false));
    else audio.pause();
  }, [isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTime = () => setCurrentTime(audio.currentTime || 0);
    const handleLoaded = () => setDuration(Number.isFinite(audio.duration) ? audio.duration : selectedTrack?.duration || 0);

    const playNext = () => {
      if (isRepeat) {
        audio.currentTime = 0;
        audio.play();
        return;
      }
      const pool = customQueue || allTracks;
      if (isShuffle) {
        const candidates = pool.filter((track) => track.id !== selectedTrackId);
        const nextTrack = candidates[Math.floor(Math.random() * candidates.length)] || pool[0];
        if (nextTrack) {
          setSelectedTrackId(nextTrack.id);
          if (settings.autoplay) setIsPlaying(true);
        }
        return;
      }
      const idx = pool.findIndex((track) => track.id === selectedTrackId);
      const nextTrack = pool[(idx + 1) % pool.length];
      if (nextTrack) {
        setSelectedTrackId(nextTrack.id);
        if (settings.autoplay) setIsPlaying(true);
      }
    };

    const handleEnded = () => {
      if (settings.crossfade) {
        setTimeout(playNext, 300);
      } else {
        playNext();
      }
    };

    audio.addEventListener('timeupdate', handleTime);
    audio.addEventListener('loadedmetadata', handleLoaded);
    audio.addEventListener('ended', handleEnded);
    return () => {
      audio.removeEventListener('timeupdate', handleTime);
      audio.removeEventListener('loadedmetadata', handleLoaded);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [selectedTrackId, selectedTrack?.duration, isRepeat, isShuffle, currentIndex, allTracks, customQueue, settings.autoplay, settings.crossfade]);

  useEffect(() => {
    const onKey = (e) => {
      if (!session) return;
      const tag = e.target.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (e.code === 'Space') {
        e.preventDefault();
        setIsPlaying((p) => !p);
      }
      if (e.code === 'ArrowRight') changeTrack(1);
      if (e.code === 'ArrowLeft') changeTrack(-1);
      if (e.key === '/') {
        e.preventDefault();
        router.push('/search');
      }
      if (e.key === 'l' || e.key === 'L') toggleLikedTrack(selectedTrackId);
      if (e.key === 'q' || e.key === 'Q') setQueueOpen((p) => !p);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const filteredTracks = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return recommendedTracks;
    return allTracks.filter((track) => {
      if (searchFilter === 'tracks') return track.title.toLowerCase().includes(query);
      if (searchFilter === 'artists') return track.artist.toLowerCase().includes(query);
      if (searchFilter === 'albums') return track.album.toLowerCase().includes(query);
      return (
        track.title.toLowerCase().includes(query) ||
        track.artist.toLowerCase().includes(query) ||
        track.album.toLowerCase().includes(query) ||
        track.mood.toLowerCase().includes(query) ||
        (track.genre || '').toLowerCase().includes(query)
      );
    });
  }, [search, searchFilter, allTracks, recommendedTracks]);

  const playTrack = async (trackId, queue = null) => {
    setSelectedTrackId(trackId);
    if (queue) setCustomQueue(queue);
    else setCustomQueue(null);
    setIsPlaying(true);
    if (session) {
      const item = { id: Date.now(), userId: session.id, trackId, playedAt: new Date().toISOString() };
      await saveHistoryItem(item);
      setHistory((prev) => [item, ...prev.filter((h) => !(h.userId === session.id && h.trackId === trackId))].slice(0, 200));
    }
  };

  const playQueueTrack = (trackId) => playTrack(trackId, customQueue || allTracks);

  const changeTrack = (direction) => {
    const pool = customQueue || allTracks;
    const idx = pool.findIndex((track) => track.id === selectedTrackId);
    const nextIndex = (idx + direction + pool.length) % pool.length;
    playTrack(pool[nextIndex].id, customQueue);
  };

  const reorderQueue = (fromIndex, toIndex) => {
    const base = [...(customQueue || allTracks)];
    const currentIdx = base.findIndex((t) => t.id === selectedTrackId);
    const withoutCurrent = base.filter((t) => t.id !== selectedTrackId);
    const [moved] = withoutCurrent.splice(fromIndex, 1);
    withoutCurrent.splice(toIndex, 0, moved);
    const current = base[currentIdx];
    const newQueue = [current, ...withoutCurrent.filter((t) => t.id !== current.id)];
    setCustomQueue(newQueue);
  };

  const toggleLikedTrack = async (trackId) => {
    const isLiked = likedTrackIds.includes(trackId);
    if (isLiked) {
      setLikedTrackIds((prev) => prev.filter((id) => id !== trackId));
      if (session) await deleteLike(session.id, trackId);
    } else {
      setLikedTrackIds((prev) => [...prev, trackId]);
      if (session) await saveLike({ userId: session.id, trackId, createdAt: new Date().toISOString() });
    }
  };

  const handleAuthSubmit = async (event) => {
    event.preventDefault();
    if (authMode === 'register') {
      if (!authForm.name || !authForm.email || !authForm.password) {
        alert(lang === 'en' ? 'Fill all fields.' : 'Completa todos los campos.');
        return;
      }
      if (users.some((u) => u.email.toLowerCase() === authForm.email.toLowerCase())) {
        alert(lang === 'en' ? 'Email already exists.' : 'Ya existe una cuenta con ese correo.');
        return;
      }
      if (isSupabaseEnabled()) {
        try {
          const data = await supabaseSignUp(authForm.email, authForm.password, authForm.name);
          const newUser = {
            id: data.user?.id || Date.now(),
            name: authForm.name,
            email: authForm.email,
            role: 'user',
            isVerified: false
          };
          setUsers((prev) => [...prev, newUser]);
          setSession(newUser);
          setAuthForm({ name: '', email: '', password: '' });
          router.push('/home');
          return;
        } catch (error) {
          alert(error.message || 'Error al registrarse');
          return;
        }
      }
      const newUser = {
        id: Date.now(),
        name: authForm.name,
        email: authForm.email,
        password: hashPassword(authForm.password),
        role: 'user',
        isVerified: false
      };
      setUsers((prev) => [...prev, newUser]);
      setSession(newUser);
      setAuthForm({ name: '', email: '', password: '' });
      router.push('/home');
      return;
    }
    if (isSupabaseEnabled()) {
      try {
        const data = await supabaseSignIn(authForm.email, authForm.password);
        const supaUser = data.user;
        const localUser = users.find((u) => u.email.toLowerCase() === authForm.email.toLowerCase());
        const user = {
          id: supaUser.id,
          email: supaUser.email,
          name: supaUser.user_metadata?.name || localUser?.name || supaUser.email,
          role: localUser?.role || 'user',
          isVerified: localUser?.isVerified || false
        };
        setSession(user);
        setAuthForm({ name: '', email: '', password: '' });
        router.push('/home');
        return;
      } catch (error) {
        alert(error.message || 'Credenciales incorrectas');
        return;
      }
    }
    const user = users.find((u) => u.email.toLowerCase() === authForm.email.toLowerCase() && verifyPassword(authForm.password, u.password));
    if (!user) {
      alert(lang === 'en' ? 'Invalid credentials.' : 'Credenciales incorrectas');
      return;
    }
    setSession(user);
    setAuthForm({ name: '', email: '', password: '' });
    router.push('/home');
  };

  const logout = async () => {
    await supabaseSignOut();
    setSession(null);
    setIsPlaying(false);
    router.push('/');
  };

  const handleUploadTrack = async (event) => {
    event.preventDefault();
    if (!session || (session.role !== 'admin' && session.role !== 'label')) {
      alert(lang === 'en' ? 'Only admins and labels can upload music.' : 'Solo administradores y discograficas pueden subir musica.');
      return;
    }
    const artist = users.find((u) => u.id === Number(uploadForm.artistId));
    if (!artist || !uploadForm.file) return;
    let url = '';
    if (isSupabaseEnabled() && uploadForm.file) {
      url = await uploadAudio(uploadForm.file, session.id) || '';
    }
    if (!url) {
      url = await readFileAsDataUrl(uploadForm.file);
    }
    const newTrack = {
      id: Date.now(),
      title: uploadForm.title,
      artist: artist.name,
      album: uploadForm.album || 'Subido por staff',
      duration: 0,
      mood: uploadForm.mood || 'Staff upload',
      genre: uploadForm.genre || 'Pop',
      accent: 'neon',
      coverUrl: uploadForm.coverUrl || '',
      isPodcast: uploadForm.isPodcast || false,
      url
    };
    await saveTrack(newTrack);
    setUserTracks((prev) => [...prev, newTrack]);
    setUploadForm({ artistId: '', title: '', album: '', genre: '', mood: '', isPodcast: false, coverUrl: '', file: null });

    const followers = await getFollowersOf(artist.id);
    for (const followerId of followers) {
      const notification = {
        id: Date.now() + Math.random(),
        userId: followerId,
        message: `${artist.name} subio una nueva cancion: ${newTrack.title}`,
        read: false,
        createdAt: new Date().toISOString()
      };
      await saveNotification(notification);
      if (followerId === session?.id) setNotifications((prev) => [notification, ...prev]);
    }
  };

  const createPlaylist = async () => {
    if (!newPlaylistName.trim() || !session) return;
    const playlist = {
      id: Date.now(),
      name: newPlaylistName.trim(),
      userId: session.id,
      trackIds: [...newPlaylistTrackIds],
      createdAt: new Date().toISOString()
    };
    await savePlaylist(playlist);
    setPlaylists((prev) => [...prev, playlist]);
    setNewPlaylistName('');
    setNewPlaylistTrackIds([]);
    setNewPlaylistOpen(false);
    router.push(`/playlist/${playlist.id}`);
  };

  const createAlbum = async () => {
    if (!newAlbum.name.trim() || !newAlbum.artistId || !session) return;
    const album = {
      id: Date.now(),
      name: newAlbum.name.trim(),
      artistId: Number(newAlbum.artistId),
      coverUrl: newAlbum.coverUrl || '',
      trackIds: [...selectedTrackIdsForAlbum],
      createdBy: session.id,
      createdAt: new Date().toISOString()
    };
    await saveAlbum(album);
    setAlbums((prev) => [...prev, album]);
    setNewAlbum({ name: '', artistId: '', coverUrl: '', trackIds: [] });
    setSelectedTrackIdsForAlbum([]);
    setNewAlbumOpen(false);
    router.push(`/album/${album.id}`);
  };

  const saveTrackEdit = async () => {
    const updated = {
      title: editTrack.title,
      album: editTrack.album,
      accent: editTrack.accent,
      coverUrl: editTrack.coverUrl || '',
      genre: editTrack.genre || '',
      mood: editTrack.mood || '',
      isPodcast: editTrack.isPodcast || false
    };
    if (userTracks.some((t) => t.id === editTrack.id)) {
      setUserTracks((prev) => prev.map((track) => (track.id === editTrack.id ? { ...track, ...updated } : track)));
      const track = userTracks.find((t) => t.id === editTrack.id);
      if (track) await saveTrack({ ...track, ...updated });
    } else {
      setBaseTrackOverrides((prev) => ({ ...prev, [editTrack.id]: updated }));
    }
    setTrackDetailOpen(false);
  };

  const canViewProfile = (profileUser, viewerId) => {
    if (!profileUser) return false;
    if (profileUser.id === viewerId) return true;
    if (profileUser.role === 'admin') return true;
    const viewer = users.find((u) => u.id === viewerId);
    if (viewer?.role === 'admin') return true;
    if (profileUser.id === viewerId) return true;
    const profileSettings = profileUser.id === session?.id ? settings : null;
    if (profileSettings?.privateProfile && profileUser.id !== viewerId) return false;
    return !settings.privateProfile || profileUser.id === viewerId;
  };

  const installApp = async () => {
    if (installPrompt) {
      installPrompt.prompt();
      await installPrompt.userChoice;
      setInstallPrompt(null);
    } else {
      alert(lang === 'en' ? 'Install from browser menu (Add to Home Screen).' : 'Instala desde el menu del navegador (Anadir a inicio).');
    }
  };

  const skipPodcast = (seconds) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.max(0, Math.min(audio.duration || 0, audio.currentTime + seconds));
  };

  const clearNonAdminUserData = async () => {
    if (!session || session.role !== 'admin') return;
    const nonAdmins = users.filter((u) => u.role !== 'admin');
    for (const user of nonAdmins) {
      await Promise.all([
        loadLikes(user.id).then((likes) => Promise.all(likes.map((l) => deleteLike(user.id, l.trackId)))),
        loadHistory(user.id).then((hist) => Promise.all(hist.map((h) => saveHistoryItem({ ...h, _deleted: true })))),
        loadNotifications(user.id).then((notes) => Promise.all(notes.map((n) => saveNotification({ ...n, _deleted: true })))),
        loadFollows(user.id).then((follows) => Promise.all(follows.map((f) => toggleFollow(user.id, f)))),
        loadPlaylists(user.id).then((pls) => Promise.all(pls.map((p) => deletePlaylist(p.id))))
      ]);
    }
    setLikedTrackIds([]);
    setHistory([]);
    setNotifications([]);
    setFollowingIds([]);
    setPlaylists((prev) => prev.filter((p) => p.userId === session.id));
  };

  const createAdminPlaylist = async (name, coverUrl, trackIds) => {
    if (!session || session.role !== 'admin') return;
    const playlist = {
      id: Date.now(),
      name,
      userId: session.id,
      trackIds: trackIds || [],
      coverUrl: coverUrl || '',
      createdAt: new Date().toISOString()
    };
    await savePlaylist(playlist);
    setPlaylists((prev) => [...prev, playlist]);
    return playlist;
  };

  const addTrackToPlaylist = async (playlistId, trackId) => {
    const playlist = playlists.find((p) => p.id === playlistId);
    if (!playlist || playlist.trackIds.includes(trackId)) return;
    await savePlaylist({ ...playlist, trackIds: [...playlist.trackIds, trackId] });
    setPlaylists((prev) => prev.map((p) => (p.id === playlistId ? { ...p, trackIds: [...p.trackIds, trackId] } : p)));
  };

  const removeTrackFromPlaylist = async (playlistId, trackId) => {
    const playlist = playlists.find((p) => p.id === playlistId);
    if (!playlist) return;
    await savePlaylist({ ...playlist, trackIds: playlist.trackIds.filter((id) => id !== trackId) });
    setPlaylists((prev) => prev.map((p) => (p.id === playlistId ? { ...p, trackIds: p.trackIds.filter((id) => id !== trackId) } : p)));
  };

  const value = {
    authMode, setAuthMode, users, setUsers, session, setSession, authForm, setAuthForm,
    activeMood, setActiveMood, selectedTrackId, setSelectedTrackId, selectedTrack,
    isPlaying, setIsPlaying, search, setSearch, volume, setVolume,
    currentTime, setCurrentTime, duration, isShuffle, setIsShuffle, isRepeat, setIsRepeat,
    queueOpen, setQueueOpen, customQueue, setCustomQueue, likedTrackIds,
    trackDetailOpen, setTrackDetailOpen, editTrack, setEditTrack,
    trackViewOpen, setTrackViewOpen, viewTrackId, setViewTrackId,
    audioRef, userTracks, setUserTracks, uploadForm, setUploadForm,
    playlists, setPlaylists, albums, setAlbums,
    profileEditOpen, setProfileEditOpen, profileEdit, setProfileEdit,
    newPlaylistOpen, setNewPlaylistOpen, newPlaylistName, setNewPlaylistName,
    newPlaylistTrackIds, setNewPlaylistTrackIds,
    newAlbumOpen, setNewAlbumOpen, newAlbum, setNewAlbum,
    selectedTrackIdsForAlbum, setSelectedTrackIdsForAlbum,
    history, notifications, setNotifications, settings, setSettings,
    searchFilter, setSearchFilter, libraryFilter, setLibraryFilter,
    settingsOpen, setSettingsOpen, shareOpen, setShareOpen, shareData, setShareData,
    followingIds, notificationsOpen, setNotificationsOpen,
    nowPlayingOpen, setNowPlayingOpen, lyricsOpen, setLyricsOpen,
    playbackRate, setPlaybackRate, connectOpen, setConnectOpen,
    activeDevice, setActiveDevice, installPrompt,
    allTracks, recommendedTracks, moodPlaylists, queueTracks, userPlaylists, likesPlaylist,
    filteredTracks, stats, moods, translate, lang, getGreeting: () => getGreeting(lang),
    playTrack, playQueueTrack, changeTrack, reorderQueue, toggleLikedTrack,
    handleAuthSubmit, logout, handleUploadTrack, createPlaylist, createAlbum,
    saveTrackEdit, canViewProfile, installApp, skipPodcast,
    deleteUserTrack: async (trackId) => {
      await deleteTrack(trackId);
      setUserTracks((prev) => prev.filter((t) => t.id !== trackId));
      if (selectedTrackId === trackId) {
        setSelectedTrackId(allTracks[0]?.id || 1);
        setIsPlaying(false);
      }
    },
    deleteAllTracks: async () => {
      const ids = userTracks.map((t) => t.id);
      await Promise.all(ids.map((id) => deleteTrack(id)));
      setUserTracks([]);
    },
    deletePlaylist: async (id) => {
      await deletePlaylist(id);
      setPlaylists((prev) => prev.filter((p) => p.id !== id));
    },
    deleteAlbum: async (id) => {
      await deleteAlbum(id);
      setAlbums((prev) => prev.filter((a) => a.id !== id));
    },
    saveProfile: async () => {
      if (!session) return;
      const updated = { ...session, ...profileEdit };
      setSession(updated);
      setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
      setProfileEditOpen(false);
    },
    handleAvatarUpload: async (event) => {
      const file = event.target.files?.[0];
      if (!file) return;
      const url = await readFileAsDataUrl(file);
      setProfileEdit((prev) => ({ ...prev, avatarUrl: url }));
    },
    handleFollowToggle: async (userId) => {
      if (!session || session.id === userId) return;
      const nowFollowing = await toggleFollow(session.id, userId);
      setFollowingIds((prev) => (nowFollowing ? [...prev, userId] : prev.filter((id) => id !== userId)));
    },
    toggleUserVerified: (userId) => setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, isVerified: !u.isVerified } : u))),
    toggleUserArtist: (userId) => setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: u.role === 'artist' ? 'user' : 'artist' } : u))),
    toggleUserLabel: (userId) => setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: u.role === 'label' ? 'user' : 'label' } : u))),
    deleteUserAccount: (userId) => setUsers((prev) => prev.filter((u) => u.id !== userId)),
    resetUserPassword: (userId, newPass) => {
      if (!newPass || newPass.length < 4) return;
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, password: hashPassword(newPass) } : u)));
      localStorage.setItem('spotify-clone-users', JSON.stringify(users.map((u) => (u.id === userId ? { ...u, password: hashPassword(newPass) } : u))));
    },
    clearNonAdminUserData,
    createAdminPlaylist,
    addTrackToPlaylist,
    removeTrackFromPlaylist,
    setPlaylistCover: async (playlistId, coverUrl) => {
      const playlist = playlists.find((p) => p.id === playlistId);
      if (!playlist) return;
      await savePlaylist({ ...playlist, coverUrl });
      setPlaylists((prev) => prev.map((p) => (p.id === playlistId ? { ...p, coverUrl } : p)));
    },
    openShare: (type, id, name) => {
      setShareData({ type, id, name });
      setShareOpen(true);
    },
    buildShareCode,
    router, pathname, hydrated
  };

  return <MusicContext.Provider value={value}>{children}</MusicContext.Provider>;
}

export const useMusic = () => {
  const ctx = useContext(MusicContext);
  if (!ctx) throw new Error('useMusic must be used within MusicProvider');
  return ctx;
};
