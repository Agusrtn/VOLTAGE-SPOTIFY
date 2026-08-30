'use client';

import { useMusic } from '../../context/MusicContext';
import AppShell from '../../components/AppShell';
import { radioStations } from '../../lib/data';

export default function RadioPage() {
  const { allTracks, playTrack, translate } = useMusic();

  return (
    <AppShell>
      <section className="tab-panel">
        <div className="section-heading hero-heading">
          <div>
            <h1>Radio</h1>
            <span>Estaciones basadas en lo que escuchas.</span>
          </div>
        </div>

        <div className="radio-grid">
          {radioStations.map((radio, index) => (
            <article key={radio.title} className="radio-card">
              <div className={`cover-art ${radio.accent} station-cover`} aria-hidden="true">
                <span>{'\u25CE'}</span>
              </div>
              <button type="button" className="play-fab" aria-label={`Reproducir ${radio.title}`} onClick={() => playTrack(allTracks[index % allTracks.length].id)}>
                <span aria-hidden="true">{'\u25B6'}</span>
              </button>
              <h3>{radio.title}</h3>
              <p>{radio.subtitle}</p>
              <span className="listeners">{radio.listeners} oyentes</span>
            </article>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
