'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import { useMusic } from '../../context/MusicContext';
import AppShell from '../../components/AppShell';
import { useRouter } from 'next/navigation';

const accentColors = {
  lofi: ['#3252a8', '#5f8cff'],
  sunset: ['#da4d24', '#f6a33a'],
  violet: ['#20123b', '#7a4bd8'],
  forest: ['#094d3b', '#1db954'],
  neon: ['#031d2f', '#16d2d4'],
  'cat-pop': ['#b0256b', '#ff4d4d'],
  'cat-hop': ['#8d67ab', '#c39bd3'],
  'cat-electro': ['#1e3264', '#3498db'],
  'cat-indie': ['#e8115b', '#ff6b81'],
  'cat-rock': ['#ba5d07', '#f39c12'],
  'cat-latin': ['#148a08', '#2ecc71'],
  'cat-chill': ['#0d73ec', '#5dade2'],
  'cat-podcast': ['#777', '#bbb']
};

function CoverCard({ track, selectedTrack, isPlaying, onPlay }) {
  return (
    <div className="cover-card" onClick={() => onPlay(track.id)}>
      <div className={`cover-art ${track.accent}`} aria-hidden="true">
        {track.coverUrl ? (
          <img src={track.coverUrl} alt={track.title} loading="lazy" />
        ) : (
          <span>{track.title.slice(0, 1)}</span>
        )}
      </div>
      <button
        type="button"
        className="cover-play"
        aria-label={`Reproducir ${track.title}`}
        onClick={(e) => { e.stopPropagation(); onPlay(track.id); }}
      >
        <span aria-hidden="true">{selectedTrack.id === track.id && isPlaying ? '\u275A\u275A' : '\u25B6'}</span>
      </button>
      <h3>{track.title}</h3>
      <p>{track.artist}</p>
    </div>
  );
}

function ArtistCard({ user, onPlay }) {
  return (
    <div className="artist-card" onClick={() => onPlay(user.id)}>
      <div className={`cover-art neon`} aria-hidden="true">
        {user.avatarUrl ? (
          <img src={user.avatarUrl} alt={user.name} loading="lazy" />
        ) : (
          <span>{user.name.slice(0, 2).toUpperCase()}</span>
        )}
      </div>
      <div>
        <h3>{user.name}</h3>
        <p>Artista</p>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="cover-card" style={{ pointerEvents: 'none' }}>
      <div className="skeleton-cover" aria-hidden="true" />
      <div className="skeleton-line short" />
      <div className="skeleton-line" />
    </div>
  );
}

export default function HomePage() {
  const router = useRouter();
  const {
    allTracks, selectedTrack, isPlaying, playTrack, activeMood, setActiveMood,
    moods, playlists, recommendedTracks, translate, lang, session, history, users, albums, hydrated
  } = useMusic();

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos dias';
    if (hour < 19) return 'Buenas tardes';
    return 'Buenas noches';
  }, []);

  const userName = session?.name?.split(' ')[0] || '';

  const recentlyPlayed = useMemo(() => {
    const ids = (history || []).slice(0, 8).map((h) => h.trackId);
    const seen = new Set();
    return allTracks.filter((t) => ids.includes(t.id) && !seen.has(t.id) && (seen.add(t.id), true));
  }, [history, allTracks]);

  const trendingTracks = useMemo(() => {
    const counts = {};
    (history || []).forEach((item) => {
      counts[item.trackId] = (counts[item.trackId] || 0) + 1;
    });
    return allTracks
      .filter((t) => counts[t.id])
      .sort((a, b) => (counts[b.id] || 0) - (counts[a.id] || 0))
      .slice(0, 8);
  }, [history, allTracks]);

  const newReleases = useMemo(() => {
    return [...allTracks].reverse().slice(0, 8);
  }, [allTracks]);

  const becauseOf = useMemo(() => {
    const last = (history || [])[0];
    if (!last) return [];
    const track = allTracks.find((t) => t.id === last.trackId);
    if (!track) return [];
    return allTracks
      .filter((t) => t.id !== track.id && (t.mood === track.mood || t.genre === track.genre))
      .slice(0, 6);
  }, [history, allTracks]);

  const artists = useMemo(() => {
    const artistNames = [...new Set(allTracks.map((t) => t.artist))];
    return users.filter((u) => artistNames.includes(u.name)).slice(0, 6);
  }, [allTracks, users]);

  const pulseTracks = useMemo(() => {
    return [...allTracks].sort(() => Math.random() - 0.5).slice(0, 5);
  }, [allTracks]);

  if (!hydrated) {
    return (
      <AppShell>
        <section className="home-hero">
          <div className="skeleton-line short" style={{ width: 220, height: 28, marginBottom: 14 }} />
          <div className="skeleton-line" style={{ width: 160, height: 18 }} />
        </section>
        <section className="shelf">
          <div className="skeleton-line short" style={{ width: 180, height: 24, marginBottom: 14 }} />
          <div className="home-grid">
            <SkeletonCard /><SkeletonCard /><SkeletonCard /><SkeletonCard /><SkeletonCard /><SkeletonCard />
          </div>
        </section>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <section className="home-hero" style={{ paddingBottom: '6px' }}>
        <div className="hero-heading" style={{ marginBottom: '4px' }}>
          <h1 className="greeting">{greeting}{userName ? `, ${userName}` : ''}</h1>
          <p className="greeting-sub">Escucha lo que te apetezca.</p>
        </div>
      </section>

      {recentlyPlayed.length > 0 && (
        <section className="shelf" style={{ paddingTop: '10px' }}>
          <div className="section-header">
            <div>
              <h2>{translate('history.title') || 'Ultimamente reproducido'}</h2>
            </div>
          </div>
          <div className="recently-grid">
            {recentlyPlayed.map((track) => {
              const artistUser = users.find((u) => u.name.toLowerCase() === track.artist.toLowerCase());
              return (
                <div key={track.id} className="recent-card" onClick={() => playTrack(track.id)}>
                  <div className={`cover-art ${track.accent}`} aria-hidden="true">
                    {track.coverUrl ? (
                      <img src={track.coverUrl} alt={track.title} loading="lazy" />
                    ) : (
                      <span>{track.title.slice(0, 1)}</span>
                    )}
                  </div>
                  <div>
                    <strong>{track.title}</strong>
                    {artistUser ? (
                      <button type="button" className="artist-link" onClick={(e) => { e.stopPropagation(); router.push(`/profile/${artistUser.id}`); }}>{track.artist}</button>
                    ) : (
                      <span>{track.artist}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <section className="shelf">
        <div className="section-header">
          <div>
            <h2>{translate('home.madeForYou') || 'Hecho para ti'}</h2>
            <span>{translate('home.basedOn', { mood: activeMood })}</span>
          </div>
        </div>
        <div className="home-grid">
          {(playlists || []).slice(0, 5).map((playlist) => {
            const firstTrackId = playlist.trackIds?.[0];
            const playlistTrack = firstTrackId ? (allTracks || []).find((t) => t.id === firstTrackId) : (allTracks || [])[0];
            if (!playlistTrack) return null;
            return (
              <CoverCard
                key={playlist.id}
                track={{ ...playlistTrack, title: playlist.name, artist: `${playlist.trackIds?.length || 0} canciones`, accent: 'neon', coverUrl: playlist.coverUrl || playlistTrack.coverUrl || '' }}
                selectedTrack={selectedTrack}
                isPlaying={isPlaying}
                onPlay={() => playTrack(playlistTrack.id)}
              />
            );
          })}
        </div>
      </section>

      {trendingTracks.length > 0 && (
        <section className="shelf">
          <div className="section-header">
            <div>
              <h2>{translate('home.trending') || 'Lo mas escuchado'}</h2>
              <span>Tendencias segun tu historial</span>
            </div>
          </div>
          <div className="home-grid">
            {trendingTracks.map((track) => (
              <CoverCard
                key={track.id}
                track={track}
                selectedTrack={selectedTrack}
                isPlaying={isPlaying}
                onPlay={playTrack}
              />
            ))}
          </div>
        </section>
      )}

      <section className="shelf">
        <div className="section-header">
          <div>
            <h2>{translate('home.newReleases') || 'Nuevos lanzamientos'}</h2>
            <span>Lo mas reciente de Voltage</span>
          </div>
        </div>
        <div className="home-grid">
          {newReleases.map((track) => (
            <CoverCard
              key={track.id}
              track={track}
              selectedTrack={selectedTrack}
              isPlaying={isPlaying}
              onPlay={playTrack}
            />
          ))}
        </div>
      </section>

      <section className="shelf">
        <div className="section-header">
          <div>
            <h2>{translate('home.recommended') || 'Recomendado para ti'}</h2>
            <span>Basado en tus gustos</span>
          </div>
        </div>
        <div className="home-grid">
          {(recommendedTracks || []).slice(0, 8).map((track) => (
            <CoverCard
              key={track.id}
              track={track}
              selectedTrack={selectedTrack}
              isPlaying={isPlaying}
              onPlay={playTrack}
            />
          ))}
        </div>
      </section>

      {becauseOf.length > 0 && (
        <section className="shelf">
          <div className="section-header">
            <div>
              <h2>{translate('home.because') || 'Porque escuchaste'}</h2>
              <span>Basado en tu ultima reproduccion</span>
            </div>
          </div>
          <div className="home-grid">
            {becauseOf.map((track) => (
              <CoverCard
                key={track.id}
                track={track}
                selectedTrack={selectedTrack}
                isPlaying={isPlaying}
                onPlay={playTrack}
              />
            ))}
          </div>
        </section>
      )}

      {artists.length > 0 && (
        <section className="shelf">
          <div className="section-header">
            <div>
              <h2>{translate('home.yourArtists') || 'Tus artistas'}</h2>
            </div>
          </div>
          <div className="artist-grid">
            {artists.map((user) => (
              <ArtistCard
                key={user.id}
                user={user}
                onPlay={(id) => router.push(`/profile/${id}`)}
              />
            ))}
          </div>
        </section>
      )}

      <section className="shelf">
        <div className="section-header">
          <div>
            <h2>{translate('home.popularPlaylists') || 'Playlists populares'}</h2>
          </div>
        </div>
        <div className="home-grid">
          {(playlists || []).slice(0, 6).map((playlist) => {
            const firstTrackId = playlist.trackIds?.[0];
            const playlistTrack = firstTrackId ? (allTracks || []).find((t) => t.id === firstTrackId) : (allTracks || [])[0];
            if (!playlistTrack) return null;
            return (
              <CoverCard
                key={playlist.id}
                track={{ ...playlistTrack, title: playlist.name, artist: `${playlist.trackIds?.length || 0} canciones`, accent: 'neon', coverUrl: playlist.coverUrl || playlistTrack.coverUrl || '' }}
                selectedTrack={selectedTrack}
                isPlaying={isPlaying}
                onPlay={() => playTrack(playlistTrack.id)}
              />
            );
          })}
        </div>
      </section>

      <section className="shelf" style={{ paddingBottom: '110px' }}>
        <div className="pulse-section">
          <div className="pulse-header">
            <span style={{ fontSize: '1.4rem' }}>⚡</span>
            <div>
              <h2>Voltage Pulse</h2>
              <span className="shelf-subtitle">Lo que esta sonando ahora</span>
            </div>
          </div>
          <div className="pulse-list">
            {pulseTracks.map((track, idx) => (
              <div key={track.id} className="pulse-item" onClick={() => playTrack(track.id)}>
                <span className="pulse-rank">{String(idx + 1).padStart(2, '0')}</span>
                <div className={`cover-art ${track.accent}`} style={{ width: 40, height: 40, borderRadius: 4 }} aria-hidden="true">
                  {track.coverUrl ? (
                    <img src={track.coverUrl} alt={track.title} loading="lazy" />
                  ) : (
                    <span>{track.title.slice(0, 1)}</span>
                  )}
                </div>
                <div className="pulse-meta">
                  <strong>{track.title}</strong>
                  <span>{track.artist}</span>
                </div>
                <div className="pulse-bar">
                  <div className="pulse-bar-fill" style={{ width: `${Math.max(20, 100 - idx * 15)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </AppShell>
  );
}
