'use client';

import { useMusic } from '../context/MusicContext';
import CoverArt from './CoverArt';

export default function CoverDetailModal() {
  const { coverDetailOpen, setCoverDetailOpen, coverDetailTrack, playTrack, selectedTrack, isPlaying } = useMusic();

  if (!coverDetailOpen || !coverDetailTrack) return null;

  return (
    <div className="track-detail-overlay" onClick={() => setCoverDetailOpen(false)}>
      <div className="track-detail-modal cover-detail-modal" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="icon-btn subtle" aria-label="Cerrar" onClick={() => setCoverDetailOpen(false)} style={{ alignSelf: 'flex-end' }}>
          ✕
        </button>
        <CoverArt accent={coverDetailTrack.accent} label={coverDetailTrack.title.slice(0, 1)} className="detail-cover-art" track={coverDetailTrack} />
        <h2>{coverDetailTrack.title}</h2>
        <p>{coverDetailTrack.artist} - {coverDetailTrack.album}</p>
        <button type="button" className="primary-btn" onClick={() => playTrack(coverDetailTrack.id)}>
          {selectedTrack.id === coverDetailTrack.id && isPlaying ? 'Pausar' : 'Reproducir'}
        </button>
      </div>
    </div>
  );
}
