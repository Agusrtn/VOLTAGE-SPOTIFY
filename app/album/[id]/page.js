'use client';

import { useMusic } from '../../../context/MusicContext';
import AppShell from '../../../components/AppShell';
import TrackTable from '../../../components/TrackTable';
import CoverArt from '../../../components/CoverArt';
import { useParams } from 'next/navigation';
import { formatTime } from '../../../lib/utils';

export default function AlbumPage() {
  const params = useParams();
  const { allTracks, albums, playTrack, translate } = useMusic();

  const album = albums.find((a) => String(a.id) === String(params?.id));
  const tracks = album ? album.trackIds.map((tid) => allTracks.find((t) => t.id === tid)).filter(Boolean) : [];

  if (!album) {
    return (
      <AppShell>
        <section className="tab-panel">
          <div className="section-heading hero-heading">
            <div>
              <h1>Album no encontrado</h1>
              <span>El album que buscas no existe.</span>
            </div>
          </div>
        </section>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <section className="tab-panel">
        <div className="section-heading hero-heading">
          <div>
            <h1>{album.name}</h1>
            <span>{tracks.length} canciones</span>
          </div>
          {tracks.length > 0 && (
            <button type="button" className="primary-btn" onClick={() => playTrack(tracks[0].id)}>
              Reproducir
            </button>
          )}
        </div>

        {album.coverUrl && (
          <div style={{ marginBottom: '18px' }}>
            <img src={album.coverUrl} alt={album.name} style={{ width: '200px', height: '200px', objectFit: 'cover', borderRadius: '8px' }} />
          </div>
        )}

        {tracks.length > 0 ? (
          <TrackTable tracks={tracks} heading={album.name} />
        ) : (
          <div className="queue-empty">No hay canciones en este album todavia.</div>
        )}
      </section>
    </AppShell>
  );
}
