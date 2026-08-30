'use client';

import { useMusic } from '../../context/MusicContext';
import AppShell from '../../components/AppShell';
import CoverArt from '../../components/CoverArt';
import { formatTime } from '../../lib/utils';

export default function HistoryPage() {
  const { history, allTracks, translate } = useMusic();

  return (
    <AppShell>
      <section className="tab-panel">
        <div className="section-heading hero-heading">
          <div>
            <h1>{translate('nav.history')}</h1>
            <span>Tus ultimas canciones reproducidas.</span>
          </div>
        </div>
        <div className="track-list">
          {history.length === 0 && <div className="queue-empty">No hay reproducciones todavia.</div>}
          {history.slice(0, 50).map((item) => {
            const track = allTracks.find((t) => t.id === item.trackId);
            if (!track) return null;
            return (
              <div key={item.id} className="track-row">
                <span className="track-index">{new Date(item.playedAt).toLocaleDateString()}</span>
                <span className="track-meta">
                  <CoverArt accent={track.accent} label={track.coverUrl || track.title.slice(0, 1)} className="track-cover" track={track} />
                  <span className="track-copy">
                    <strong>{track.title}</strong>
                    <span>{track.artist}</span>
                  </span>
                </span>
                <span className="track-album">{track.album}</span>
                <span className="track-time">{track.duration ? formatTime(track.duration) : ''}</span>
              </div>
            );
          })}
        </div>
      </section>
    </AppShell>
  );
}
