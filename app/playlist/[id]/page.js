'use client';

import { notFound } from 'next/navigation';
import { useMusic } from '../../../context/MusicContext';
import AppShell from '../../../components/AppShell';
import TrackTable from '../../../components/TrackTable';
import CoverArt from '../../../components/CoverArt';
import { useParams } from 'next/navigation';
import { LIKES_PLAYLIST_ID } from '../../../lib/data';
import { formatTime } from '../../../lib/utils';

export default function PlaylistPage() {
  const params = useParams();
  const { allTracks, playTrack, playlists, deletePlaylist, likedTrackIds, translate, router } = useMusic();

  const id = params?.id;
  const isLikes = id === LIKES_PLAYLIST_ID || id === 'likes';
  const playlist = isLikes ? { id: LIKES_PLAYLIST_ID, name: translate('library.likes'), trackIds: likedTrackIds, isLikes: true } : playlists.find((p) => String(p.id) === String(id));
  const tracks = isLikes
    ? likedTrackIds.map((tid) => allTracks.find((t) => t.id === tid)).filter(Boolean)
    : playlist ? playlist.trackIds.map((tid) => allTracks.find((t) => t.id === tid)).filter(Boolean) : [];

  if (!playlist && !isLikes) {
    return (
      <AppShell>
        <section className="tab-panel">
          <div className="section-heading hero-heading">
            <div>
              <h1>Playlist no encontrada</h1>
              <span>La playlist que buscas no existe.</span>
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
            <h1>{playlist?.name || translate('library.likes')}</h1>
            <span>{tracks.length} canciones</span>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            {tracks.length > 0 && (
              <button type="button" className="primary-btn" onClick={() => playTrack(tracks[0].id)}>
                Reproducir
              </button>
            )}
            {!isLikes && (
              <button type="button" className="staff-btn-warn" onClick={() => { deletePlaylist(playlist.id); router.push('/library'); }}>
                Borrar
              </button>
            )}
          </div>
        </div>

        {tracks.length > 0 ? (
          <TrackTable tracks={tracks} heading={playlist?.name || translate('library.likes')} />
        ) : (
          <div className="queue-empty">No hay canciones en esta playlist todavia.</div>
        )}
      </section>
    </AppShell>
  );
}
