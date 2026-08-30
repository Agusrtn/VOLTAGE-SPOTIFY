'use client';

import Link from 'next/link';
import { useMusic } from '../context/MusicContext';
import { formatTime } from '../lib/utils';
import CoverArt from './CoverArt';

export default function TrackTable({ tracks, heading = 'Canciones' }) {
  const { selectedTrack, isPlaying, playTrack, users, setViewTrackId, setTrackViewOpen, translate } = useMusic();

  return (
    <section className="table-card">
      <div className="section-heading compact">
        <div>
          <h2>{heading}</h2>
          <span>{tracks.length} {translate('common.tracks')}</span>
        </div>
      </div>

      <div className="track-table-head" aria-hidden="true">
        <span>#</span>
        <span>Titulo</span>
        <span>Album</span>
        <span>Duracion</span>
        <span></span>
      </div>

      <div className="track-list">
        {tracks.map((track, index) => {
          const artistUser = users.find((u) => u.name.toLowerCase() === track.artist.toLowerCase());
          return (
            <div key={track.id} className={`track-row ${selectedTrack.id === track.id ? 'selected' : ''}`}>
              <span className="track-index">
                {selectedTrack.id === track.id && isPlaying ? '\u25B6' : index + 1}
              </span>
              <button
                type="button"
                className="track-meta track-meta-btn"
                onClick={() => { setViewTrackId(track.id); setTrackViewOpen(true); }}
              >
                <CoverArt accent={track.accent} label={track.title.slice(0, 1)} className="track-cover" track={track} />
                <span className="track-copy">
                  <strong>{track.title}</strong>
                  {artistUser ? (
                    <Link href={`/profile/${artistUser.id}`} className="artist-link" onClick={(e) => e.stopPropagation()}>{track.artist}</Link>
                  ) : (
                    <span>{track.artist}</span>
                  )}
                </span>
              </button>
              <span className="track-album">{track.album}</span>
              <span className="track-time">{formatTime(track.duration)}</span>
              <button type="button" className="icon-btn subtle track-play-btn" aria-label={translate('common.play')} onClick={() => playTrack(track.id)}>
                <span aria-hidden="true">{selectedTrack.id === track.id && isPlaying ? '\u275A\u275A' : '\u25B6'}</span>
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
