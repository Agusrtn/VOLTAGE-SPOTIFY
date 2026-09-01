export const LIKES_PLAYLIST_ID = 'likes';

export const defaultUsers = [
  {
    id: 1,
    name: 'Admin',
    email: 'admin@admin.com',
    password: 'Z2Y6YWRtaW4xMjM=',
    role: 'admin',
    isVerified: true
  },
  {
    id: 2,
    name: 'Demo User',
    email: 'demo@demo.com',
    password: 'Z2Y6MTIzNDU2',
    role: 'user',
    isVerified: true
  },
  {
    id: 3,
    name: 'Voltage Music',
    email: 'voltage@music.com',
    password: 'Z2Y6dm9sdGFnZTIwMjY=',
    role: 'label',
    isVerified: true,
    avatarUrl: 'https://ui-avatars.com/api/?name=VOLTAGE&background=ff4d4d&color=fff&size=150'
  },
  {
    id: 4,
    name: 'Voltage Admin',
    email: 'voltage@admin.com',
    password: 'Z2Y6dm9sdGFnZTIwMjY=',
    role: 'admin',
    isVerified: true,
    avatarUrl: 'https://ui-avatars.com/api/?name=VOLTAGE+ADMIN&background=ff4d4d&color=fff&size=150'
  }
];

export const navRoutes = [
  { labelKey: 'nav.home', path: '/home', icon: '\u2302' },
  { labelKey: 'nav.search', path: '/search', icon: '\u2315' },
  { labelKey: 'nav.library', path: '/library', icon: '\u25A4' },
  { labelKey: 'nav.radio', path: '/radio', icon: '\u25CE' }
];

export const playlistData = [];

export const baseTracks = [
  {
    id: 1,
    title: 'Midnight Echo',
    artist: 'Nova Bloom',
    album: 'City Lights',
    duration: 222,
    mood: 'Night drive',
    accent: 'lofi',
    genre: 'Pop',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
  },
  {
    id: 2,
    title: 'Golden Skyline',
    artist: 'Aster Lane',
    album: 'Sunset Club',
    duration: 250,
    mood: 'Focus',
    accent: 'sunset',
    genre: 'Indie',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
  },
  {
    id: 3,
    title: 'Cloudline',
    artist: 'Mila Woods',
    album: 'Soft Signals',
    duration: 178,
    mood: 'Chill',
    accent: 'violet',
    genre: 'Chill',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
  },
  {
    id: 4,
    title: 'Sugar Rush',
    artist: 'Kite Club',
    album: 'After Hours',
    duration: 206,
    mood: 'Workout',
    accent: 'forest',
    genre: 'Hip-Hop',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3'
  },
  {
    id: 5,
    title: 'Velvet Road',
    artist: 'Sora Vale',
    album: 'Low Sun',
    duration: 244,
    mood: 'Study',
    accent: 'neon',
    genre: 'Electronica',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3'
  },
  {
    id: 6,
    title: 'Morning Brief',
    artist: 'Podcast Hub',
    album: 'Daily Talks',
    duration: 320,
    mood: 'Focus',
    accent: 'cat-podcast',
    genre: 'Podcasts',
    isPodcast: true,
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3'
  }
];

export const moods = ['Focus', 'Night drive', 'Workout', 'Chill', 'Study'];

export const browseCategories = [
  { title: 'Pop', accent: 'cat-pop' },
  { title: 'Hip-Hop', accent: 'cat-hop' },
  { title: 'Electronica', accent: 'cat-electro' },
  { title: 'Indie', accent: 'cat-indie' },
  { title: 'Rock', accent: 'cat-rock' },
  { title: 'Latin', accent: 'cat-latin' },
  { title: 'Chill', accent: 'cat-chill' },
  { title: 'Podcasts', accent: 'cat-podcast' }
];

export const radioStations = [
  { title: 'Night Drive Radio', subtitle: 'Con Nova Bloom y Aster Lane', accent: 'lofi', listeners: '42k', mood: 'Night drive' },
  { title: 'Focus Radio', subtitle: 'Instrumentales y electronica suave', accent: 'violet', listeners: '31k', mood: 'Focus' },
  { title: 'Workout Radio', subtitle: 'Ritmos rapidos para entrenar', accent: 'forest', listeners: '58k', mood: 'Workout' },
  { title: 'Indie Radio', subtitle: 'Canciones nuevas y favoritas', accent: 'sunset', listeners: '24k', mood: 'Chill' }
];

export const accentOptions = [
  'lofi', 'sunset', 'violet', 'forest', 'neon',
  'cat-pop', 'cat-hop', 'cat-electro', 'cat-indie', 'cat-rock', 'cat-latin', 'cat-chill', 'cat-podcast'
];

export const playbackRates = [0.5, 0.75, 1, 1.25, 1.5, 2];
