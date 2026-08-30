'use client';

import { useMusic } from '../../context/MusicContext';
import AppShell from '../../components/AppShell';
import TrackTable from '../../components/TrackTable';
import CoverArt from '../../components/CoverArt';
import { useRouter } from 'next/navigation';

export default function LibraryPage() {
  const router = useRouter();
  const {
    userPlaylists, playlists, playTrack, translate, libraryFilter, setLibraryFilter, allTracks
  } = useMusic();

  const displayedPlaylists = userPlaylists;

  return (
    <AppShell>
      <section className="tab-panel">
        <div className="library-header">
          <div>
            <h1>{translate('library.title')}</h1>
            <p>{translate('library.subtitle')}</p>
          </div>
          <button type="button" className="primary-btn" onClick={() => {}}>
            Reproducir
          </button>
        </div>

        <div className="filter-row" aria-label="Filtros de biblioteca">
          {[
            { key: 'playlists', label: translate('filter.playlistsLib') },
            { key: 'artists', label: translate('filter.artistsLib') },
            { key: 'albums', label: translate('filter.albumsLib') }
          ].map((filter, index) => (
            <button key={filter.key} type="button" className={libraryFilter === filter.key ? 'active' : ''} onClick={() => setLibraryFilter(filter.key)}>
              {filter.label}
            </button>
          ))}
        </div>

        <div className="library-list">
          {(displayedPlaylists || []).slice(0, 5).map((playlist, index) => (
            <button
              key={playlist.id}
              type="button"
              className="library-row"
              onClick={() => {
                if (playlist.isLikes) {
                  router.push('/playlist/likes');
                } else {
                  router.push(`/playlist/${playlist.id}`);
                }
              }}
            >
              <CoverArt accent={playlist.isLikes ? 'cat-pop' : 'sunset'} label={playlist.name.slice(0, 1)} className="library-thumb" />
              <span>
                <strong>{playlist.name}</strong>
                <small>Playlist - {playlist.trackIds?.length || 0} canciones</small>
              </span>
            </button>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
