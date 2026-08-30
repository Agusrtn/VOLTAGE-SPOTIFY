'use client';

import { useMusic } from '../../context/MusicContext';
import AppShell from '../../components/AppShell';
import { formatTime } from '../../lib/utils';

export default function StatsPage() {
  const { stats, history, allTracks, translate } = useMusic();

  const topTracks = history.slice(0, 10).map((item) => allTracks.find((t) => t.id === item.trackId)).filter(Boolean);

  return (
    <AppShell>
      <section className="tab-panel">
        <div className="section-heading hero-heading">
          <div>
            <h1>{translate('stats.title')}</h1>
            <span>Tu resumen musical.</span>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-value">{stats.plays}</span>
            <span className="stat-label">{translate('stats.plays')}</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{stats.topArtist}</span>
            <span className="stat-label">{translate('stats.topArtist')}</span>
          </div>
        </div>

        <section className="shelf" style={{ marginTop: '24px' }}>
          <div className="section-heading">
            <div>
              <h2>Top canciones</h2>
              <span>Las mas escuchadas</span>
            </div>
          </div>
          {topTracks.length > 0 ? (
            <div className="track-list">
              {topTracks.map((track, index) => (
                <div key={track.id} className="track-row">
                  <span className="track-index">{index + 1}</span>
                  <span className="track-meta">
                    <div className={`cover-art ${track.accent || 'neon'} track-cover`} aria-hidden="true">
                      <span>{track.title.slice(0, 1)}</span>
                    </div>
                    <span className="track-copy">
                      <strong>{track.title}</strong>
                      <span>{track.artist}</span>
                    </span>
                  </span>
                  <span className="track-album">{track.album}</span>
                  <span className="track-time">{track.duration ? formatTime(track.duration) : ''}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="queue-empty">Aun no hay estadisticas. Escucha mas musica!</div>
          )}
        </section>
      </section>
    </AppShell>
  );
}
