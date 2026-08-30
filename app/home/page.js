'use client';

import { useMusic } from '../../context/MusicContext';
import AppShell from '../../components/AppShell';
import TrackTable from '../../components/TrackTable';
import CoverArt from '../../components/CoverArt';
import { useRouter } from 'next/navigation';
import { getGreeting, formatTime } from '../../lib/utils';
import { playlistData } from '../../lib/data';

export default function HomePage() {
  const router = useRouter();
  const {
    allTracks, selectedTrack, isPlaying, playTrack, activeMood, setActiveMood,
    moods, recommendedTracks, translate, lang
  } = useMusic();

  const greeting = getGreeting(lang);

  const renderPlaylistCard = (playlist, index) => {
    const playlistTrack = allTracks[index % allTracks.length];
    const playlistIsPlaying = selectedTrack.id === playlistTrack.id && isPlaying;

    return (
      <article key={playlist.title} className="playlist-card">
        <CoverArt accent={playlist.accent} label={String(index + 1).padStart(2, '0')} className="playlist-cover" />
        <button type="button" className="play-fab" aria-label={`Reproducir ${playlist.title}`} onClick={() => playTrack(playlistTrack.id)}>
          <span aria-hidden="true">{playlistIsPlaying ? '\u275A\u275A' : '\u25B6'}</span>
        </button>
        <h3>{playlist.title}</h3>
        <p>{playlist.subtitle}</p>
      </article>
    );
  };

  return (
    <AppShell>
      <section className="home-hero">
        <div className="hero-heading">
          <span className="eyebrow">{translate('home.playlistOfDay')}</span>
          <h1>{greeting}</h1>
        </div>
        <div className="quick-grid">
          {allTracks.map((track) => (
            <button key={track.id} type="button" className={`quick-card ${selectedTrack.id === track.id ? 'selected' : ''}`} onClick={() => playTrack(track.id)}>
              <CoverArt accent={track.accent} label={track.title.slice(0, 1)} className="quick-cover" track={track} />
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
          <button type="button" className="link-btn" onClick={() => router.push('/search')}>
            {translate('home.seeAll')}
          </button>
        </div>
        <div className="playlist-grid">
          {playlistData.map((playlist, index) => renderPlaylistCard(playlist, index))}
        </div>
      </section>

      <section className="shelf">
        <div className="section-heading">
          <div>
            <h2>Recomendado para ti</h2>
            <span>Personalizado segun tus gustos</span>
          </div>
        </div>
        <TrackTable tracks={recommendedTracks} heading="Canciones recomendadas" />
      </section>

      <section className="bottom-layout">
        <TrackTable tracks={allTracks} heading={translate('home.topTracks')} />
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
          <div className="artist-card">
            <CoverArt accent={selectedTrack.accent} label={selectedTrack.artist.slice(0, 1)} className="artist-cover" track={selectedTrack} />
            <span>{translate('home.featuredArtist')}</span>
            <h3>{selectedTrack.artist}</h3>
            <p>{translate('home.featuredHint')}</p>
          </div>
        </aside>
      </section>
    </AppShell>
  );
}
