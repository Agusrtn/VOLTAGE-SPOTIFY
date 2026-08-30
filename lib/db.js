export const DB_NAME = 'grooveflow-store';
export const DB_VERSION = 2;

export const STORES = {
  tracks: 'tracks',
  playlists: 'playlists',
  albums: 'albums',
  likes: 'likes',
  history: 'history',
  notifications: 'notifications',
  settings: 'settings',
  follows: 'follows'
};

export const openDb = () =>
  new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      return reject(new Error('IndexedDB no soportado'));
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORES.tracks)) {
        db.createObjectStore(STORES.tracks, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORES.playlists)) {
        db.createObjectStore(STORES.playlists, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORES.albums)) {
        db.createObjectStore(STORES.albums, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORES.likes)) {
        const likes = db.createObjectStore(STORES.likes, { keyPath: ['userId', 'trackId'] });
        likes.createIndex('userId', 'userId', { unique: false });
        likes.createIndex('userId_trackId', ['userId', 'trackId'], { unique: true });
      }
      if (!db.objectStoreNames.contains(STORES.history)) {
        const history = db.createObjectStore(STORES.history, { keyPath: 'id' });
        history.createIndex('userId', 'userId', { unique: false });
        history.createIndex('userId_playedAt', ['userId', 'playedAt'], { unique: false });
      }
      if (!db.objectStoreNames.contains(STORES.notifications)) {
        const notes = db.createObjectStore(STORES.notifications, { keyPath: 'id' });
        notes.createIndex('userId', 'userId', { unique: false });
        notes.createIndex('userId_createdAt', ['userId', 'createdAt'], { unique: false });
      }
      if (!db.objectStoreNames.contains(STORES.settings)) {
        db.createObjectStore(STORES.settings, { keyPath: 'userId' });
      }
      if (!db.objectStoreNames.contains(STORES.follows)) {
        const follows = db.createObjectStore(STORES.follows, { keyPath: ['followerId', 'followingId'] });
        follows.createIndex('followerId', 'followerId', { unique: false });
        follows.createIndex('followingId', 'followingId', { unique: false });
        follows.createIndex('follower_following', ['followerId', 'followingId'], { unique: true });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

const withStore = async (storeName, mode, callback) => {
  const db = await openDb();
  const tx = db.transaction(storeName, mode);
  const store = tx.objectStore(storeName);
  return new Promise((resolve, reject) => {
    const result = callback(store);
    if (result instanceof IDBRequest) {
      result.onsuccess = () => resolve(result.result);
      result.onerror = () => reject(result.error);
    } else {
      tx.oncomplete = () => resolve(result);
      tx.onerror = () => reject(tx.error);
    }
  });
};

const filterByUserId = (items, userId, field = 'userId') =>
  (items || []).filter((item) => item[field] === userId);

const getByIndex = async (storeName, indexName, key) => {
  try {
    const db = await openDb();
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const index = store.index(indexName);
    return new Promise((resolve, reject) => {
      const req = index.getAll(key);
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  } catch {
    return [];
  }
};

export const loadTracksFromDb = () =>
  withStore(STORES.tracks, 'readonly', (s) => s.getAll()).catch(() => []);

export const saveTrackToDb = (track) => withStore(STORES.tracks, 'readwrite', (s) => s.put(track));

export const deleteTrackFromDb = (trackId) => withStore(STORES.tracks, 'readwrite', (s) => s.delete(trackId));

export const loadPlaylists = () => withStore(STORES.playlists, 'readonly', (s) => s.getAll()).catch(() => []);

export const savePlaylist = (playlist) => withStore(STORES.playlists, 'readwrite', (s) => s.put(playlist));

export const deletePlaylistFromDb = (id) => withStore(STORES.playlists, 'readwrite', (s) => s.delete(id));

export const loadAlbums = () => withStore(STORES.albums, 'readonly', (s) => s.getAll()).catch(() => []);

export const saveAlbum = (album) => withStore(STORES.albums, 'readwrite', (s) => s.put(album));

export const deleteAlbumFromDb = (id) => withStore(STORES.albums, 'readwrite', (s) => s.delete(id));

export const loadLikes = async (userId) => {
  if (!userId) return [];
  try {
    const items = await getByIndex(STORES.likes, 'userId', userId);
    return items.length ? items : filterByUserId(await withStore(STORES.likes, 'readonly', (s) => s.getAll()), userId);
  } catch {
    return [];
  }
};

export const saveLike = (like) => withStore(STORES.likes, 'readwrite', (s) => s.put(like));

export const deleteLike = async (userId, trackId) => {
  const db = await openDb();
  const tx = db.transaction(STORES.likes, 'readwrite');
  const store = tx.objectStore(STORES.likes);
  const index = store.index('userId_trackId');
  return new Promise((resolve, reject) => {
    const req = index.delete([userId, trackId]);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
};

export const loadHistory = async (userId) => {
  if (!userId) return [];
  try {
    const items = await getByIndex(STORES.history, 'userId', userId);
    return items.sort((a, b) => new Date(b.playedAt) - new Date(a.playedAt));
  } catch {
    return [];
  }
};

export const saveHistoryItem = (item) => withStore(STORES.history, 'readwrite', (s) => s.put(item));

export const loadNotifications = async (userId) => {
  if (!userId) return [];
  try {
    const items = await getByIndex(STORES.notifications, 'userId', userId);
    return items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } catch {
    return [];
  }
};

export const saveNotification = (notification) =>
  withStore(STORES.notifications, 'readwrite', (s) => s.put(notification));

export const loadSettings = async (userId) => {
  const defaults = { userId, language: 'es', theme: 'dark', autoplay: true, privateProfile: false, crossfade: false };
  try {
    const result = await withStore(STORES.settings, 'readonly', (s) => s.get(userId));
    return result || defaults;
  } catch {
    return defaults;
  }
};

export const saveSettings = (settings) => withStore(STORES.settings, 'readwrite', (s) => s.put(settings));

export const loadFollows = async (userId) => {
  if (!userId) return [];
  try {
    const items = await getByIndex(STORES.follows, 'followerId', userId);
    return items.map((f) => f.followingId);
  } catch {
    return [];
  }
};

export const getFollowersOf = async (userId) => {
  try {
    const items = await getByIndex(STORES.follows, 'followingId', userId);
    return items.map((f) => f.followerId);
  } catch {
    return [];
  }
};

export const toggleFollow = async (followerId, followingId) => {
  const db = await openDb();
  const tx = db.transaction(STORES.follows, 'readwrite');
  const store = tx.objectStore(STORES.follows);
  const index = store.index('follower_following');
  return new Promise((resolve, reject) => {
    const req = index.openCursor([followerId, followingId]);
    req.onsuccess = () => {
      const cursor = req.result;
      if (cursor) {
        cursor.delete();
        resolve(false);
      } else {
        store.add({ followerId, followingId, createdAt: new Date().toISOString() });
        resolve(true);
      }
    };
    req.onerror = () => reject(req.error);
  });
};
