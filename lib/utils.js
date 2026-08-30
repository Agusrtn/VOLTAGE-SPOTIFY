export const formatTime = (seconds) => {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${String(secs).padStart(2, '0')}`;
};

export const getGreeting = (lang = 'es') => {
  const hour = new Date().getHours();
  if (lang === 'en') {
    if (hour < 12) return 'Good morning';
    if (hour < 19) return 'Good afternoon';
    return 'Good evening';
  }
  if (hour < 12) return 'Buenos dias';
  if (hour < 19) return 'Buenas tardes';
  return 'Buenas noches';
};

export const hashPassword = (password) => {
  if (typeof btoa === 'undefined') return password;
  return btoa(`gf:${password}`);
};

export const verifyPassword = (input, stored) => {
  if (stored.startsWith('Z2Y6')) return hashPassword(input) === stored;
  return input === stored;
};

export const parseShareCode = (code) => {
  const match = String(code).trim().match(/^([A-Z]+)-(\d+)$/i);
  if (!match) return null;
  return { type: match[1].toLowerCase(), id: Number(match[2]) };
};

export const buildShareCode = (type, id) => `${type.toUpperCase()}-${id}`;

export const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export const getCoverUrl = (track) => {
  if (track?.coverUrl) return track.coverUrl;
  if (track?.id) return `https://picsum.photos/seed/grooveflow-${track.id}/300/300`;
  return null;
};
