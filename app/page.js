'use client';

import { useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useMusic } from '../context/MusicContext';
import AuthShell from '../components/AuthShell';
import AppShell from '../components/AppShell';
import { useMusic as useMusicGuest } from '../context/MusicContext';

function GuestHome() {
  const router = useRouter();
  const { session } = useMusic();
  const {
    allTracks, playTrack, selectedTrack, isPlaying, recommendedTracks,
    translate, setSearch, searchFilter, setSearchFilter, filteredTracks,
    moods, activeMood, setActiveMood, playlistData
  } = useMusicGuest();

  return (
    <AppShell>
      <section className="home-hero">
        <div className="hero-heading">
          <span className="eyebrow">{translate('home.playlistOfDay')}</span>
          <h1>Bienvenido a VOLTAGE MUSIC</h1>
        </div>
        <div className="quick-grid">
          {(allTracks || []).map((track) => (
            <button key={track.id} type="button" className={`quick-card ${selectedTrack.id === track.id ? 'selected' : ''}`} onClick={() => playTrack(track.id)}>
              <div className={`cover-art ${track.accent} quick-cover`} aria-hidden="true">
                <span>{track.title.slice(0, 1)}</span>
              </div>
              <strong>{track.title}</strong>
              <button type="button" className="quick-play" aria-label={`Reproducir ${track.title}`} onClick={(e) => { e.stopPropagation(); playTrack(track.id); }}>
                <span aria-hidden="true">{selectedTrack.id === track.id && isPlaying ? '\u275A\u275A' : '\u25B6'}</span>
              </button>
            </button>
          ))}
        </div>
      </section>

      <section className="shelf">
        <div className="section-heading">
          <div>
            <h2>{translate('home.madeForYou')}</h2>
            <span>{translate('home.basedOn', { mood: activeMood })}</span>
          </div>
        </div>
        <div className="playlist-grid">
          {(playlistData || []).map((playlist, index) => {
            const playlistTrack = (allTracks || [])[index % (allTracks || []).length];
            const playlistIsPlaying = selectedTrack.id === playlistTrack.id && isPlaying;
            return (
              <article key={playlist.title} className="playlist-card">
                <div className={`cover-art ${playlist.accent} playlist-cover`} aria-hidden="true">
                  <span>{String(index + 1).padStart(2, '0')}</span>
                </div>
                <button type="button" className="play-fab" aria-label={`Reproducir ${playlist.title}`} onClick={() => playTrack(playlistTrack.id)}>
                  <span aria-hidden="true">{playlistIsPlaying ? '\u275A\u275A' : '\u25B6'}</span>
                </button>
                <h3>{playlist.title}</h3>
                <p>{playlist.subtitle}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="shelf">
        <div className="section-heading">
          <div>
            <h2>Recomendado para ti</h2>
            <span>Personalizado segun tus gustos</span>
          </div>
        </div>
        <div className="table-card">
          <div className="section-heading compact">
            <div>
              <h2>Canciones recomendadas</h2>
              <span>{(recommendedTracks || []).length} canciones</span>
            </div>
          </div>
          <div className="track-list">
            {recommendedTracks.slice(0, 5).map((track, index) => (
              <button key={track.id} type="button" className={`track-row ${selectedTrack.id === track.id ? 'selected' : ''}`} onClick={() => playTrack(track.id)}>
                <span className="track-index">{selectedTrack.id === track.id && isPlaying ? '\u25B6' : index + 1}</span>
                <span className="track-meta">
                  <div className={`cover-art ${track.accent} track-cover`} aria-hidden="true">
                    <span>{track.title.slice(0, 1)}</span>
                  </div>
                  <span className="track-copy">
                    <strong>{track.title}</strong>
                    <span>{track.artist}</span>
                  </span>
                </span>
                <span className="track-album">{track.album}</span>
                <span className="track-time">{track.duration ? track.duration : ''}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="bottom-layout">
        <aside className="mood-card">
          <div className="section-heading compact">
            <div>
              <h2>{translate('home.mood')}</h2>
              <span>{translate('home.moodHint')}</span>
            </div>
          </div>
          <div className="tag-list">
            {moods.map((mood) => (
              <button key={mood} type="button" className={`mood-tag ${activeMood === mood ? 'active' : ''}`} onClick={() => setActiveMood(mood)}>
                {mood}
              </button>
            ))}
          </div>
        </aside>
      </section>
    </AppShell>
  );
}

export default function RootPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { session, hydrated } = useMusic();

  const showAuth = searchParams.get('auth') === 'true';

  useEffect(() => {
    if (!hydrated) return;
    if (session) {
      router.replace('/home');
    }
  }, [session, hydrated, router]);

  if (!hydrated) {
    return (
      <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#000', color: '#fff' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, margin: '0 auto 16px', borderRadius: '50%', overflow: 'hidden', background: 'var(--green)' }}>
            <img src="/logo.png" alt="VOLTAGE MUSIC" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <p>Cargando VOLTAGE MUSIC...</p>
        </div>
      </div>
    );
  }

  if (session) {
    return (
      <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#000', color: '#fff' }}>
        <p>Redirigiendo...</p>
      </div>
    );
  }

  if (showAuth) {
    return <AuthShell />;
  }

  return <GuestHome />;
}
