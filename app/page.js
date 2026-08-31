'use client';

import { useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useMusic } from '../context/MusicContext';
import AuthShell from '../components/AuthShell';

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
      <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#080808', color: '#fff' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 56, height: 56, margin: '0 auto 16px', borderRadius: '50%', overflow: 'hidden', background: 'var(--accent)' }}>
            <img src="/logo.png" alt="VOLTAGE MUSIC" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, letterSpacing: '0.05em' }}>VOLTAGE MUSIC</p>
        </div>
      </div>
    );
  }

  if (session) {
    return (
      <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#080808', color: '#fff' }}>
        <p>Redirigiendo...</p>
      </div>
    );
  }

  if (showAuth) {
    return <AuthShell />;
  }

  return <GuestHome />;
}

function GuestHome() {
  const router = useRouter();
  const { session } = useMusic();
  const {
    allTracks, playTrack, selectedTrack, isPlaying, recommendedTracks,
    translate, setSearch, searchFilter, setSearchFilter, filteredTracks,
    moods, activeMood, setActiveMood, playlistData
  } = useMusic();

  return (
    <div style={{ minHeight: '100vh', background: '#080808', color: '#fff' }}>
      <header style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: '50%', overflow: 'hidden', background: 'var(--accent)' }}>
            <img src="/logo.png" alt="VOLTAGE MUSIC" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.1rem', letterSpacing: '0.05em' }}>VOLTAGE MUSIC</span>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button type="button" className="secondary-btn" onClick={() => router.push('/?auth=true')}>{translate('auth.login')}</button>
          <button type="button" className="primary-btn" onClick={() => router.push('/?auth=true')}>{translate('auth.register')}</button>
        </div>
      </header>

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
        <section style={{ marginBottom: 40 }}>
          <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', lineHeight: 1.05, margin: '0 0 16px', fontFamily: 'var(--font-display)', fontWeight: 800 }}>
            Tu musica,<br />tu energia.
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '1.1rem', maxWidth: 480, margin: '0 0 24px' }}>
            Millones de canciones. Sin tarifas. Empieza a escuchar ahora.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button type="button" className="primary-btn" style={{ padding: '14px 32px', fontSize: '1rem', borderRadius: 999 }} onClick={() => router.push('/?auth=true')}>
              Empezar ahora
            </button>
            <button type="button" className="secondary-btn" style={{ padding: '14px 32px', fontSize: '1rem', borderRadius: 999 }} onClick={() => setSearch('pop')}>
              Explorar musica
            </button>
          </div>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: '1.35rem', margin: '0 0 14px', fontFamily: 'var(--font-display)', fontWeight: 800 }}>{translate('home.madeForYou')}</h2>
          <div className="home-grid">
            {(playlistData || []).slice(0, 5).map((playlist, index) => {
              const playlistTrack = (allTracks || [])[index % (allTracks || []).length];
              const playlistIsPlaying = selectedTrack.id === playlistTrack.id && isPlaying;
              return (
                <div key={playlist.title} className="cover-card" onClick={() => playTrack(playlistTrack.id)}>
                  <div className={`cover-art ${playlist.accent}`} aria-hidden="true">
                    <span>{String(index + 1).padStart(2, '0')}</span>
                  </div>
                  <button
                    type="button"
                    className="cover-play"
                    aria-label={`Reproducir ${playlist.title}`}
                    onClick={(e) => { e.stopPropagation(); playTrack(playlistTrack.id); }}
                  >
                    <span aria-hidden="true">{playlistIsPlaying ? '\u275A\u275A' : '\u25B6'}</span>
                  </button>
                  <h3>{playlist.title}</h3>
                  <p>{playlist.subtitle}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: '1.35rem', margin: '0 0 14px', fontFamily: 'var(--font-display)', fontWeight: 800 }}>Recomendado para ti</h2>
          <div className="home-grid">
            {(recommendedTracks || []).slice(0, 8).map((track) => (
              <div key={track.id} className="cover-card" onClick={() => playTrack(track.id)}>
                <div className={`cover-art ${track.accent}`} aria-hidden="true">
                  <span>{track.title.slice(0, 1)}</span>
                </div>
                <button
                  type="button"
                  className="cover-play"
                  aria-label={`Reproducir ${track.title}`}
                  onClick={(e) => { e.stopPropagation(); playTrack(track.id); }}
                >
                  <span aria-hidden="true">{selectedTrack.id === track.id && isPlaying ? '\u275A\u275A' : '\u25B6'}</span>
                </button>
                <h3>{track.title}</h3>
                <p>{track.artist}</p>
              </div>
            ))}
          </div>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: '1.35rem', margin: '0 0 14px', fontFamily: 'var(--font-display)', fontWeight: 800 }}>Explorar por estado de animo</h2>
          <div className="tag-list">
            {moods.map((mood) => (
              <button
                key={mood}
                type="button"
                className={`mood-tag ${activeMood === mood ? 'active' : ''}`}
                onClick={() => setActiveMood(mood)}
              >
                {mood}
              </button>
            ))}
          </div>
        </section>
      </main>

      <footer style={{ padding: '40px 24px', textAlign: 'center', color: 'var(--muted)', fontSize: '0.85rem', borderTop: '1px solid var(--border)' }}>
        <p> VOLTAGE MUSIC. Tu plataforma musical.</p>
      </footer>
    </div>
  );
}
