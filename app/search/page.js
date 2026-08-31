'use client';

import { useMusic } from '../../context/MusicContext';
import AppShell from '../../components/AppShell';
import CoverArt from '../../components/CoverArt';
import { useRouter } from 'next/navigation';
import { browseCategories } from '../../lib/data';
import { formatTime } from '../../lib/utils';

export default function SearchPage() {
  const router = useRouter();
  const {
    search, setSearch, searchFilter, setSearchFilter, filteredTracks, filteredArtists, filteredAlbumsList, filteredPlaylistsList,
    allTracks, playTrack, translate, users, selectedTrackId
  } = useMusic();

  return (
    <AppShell>
      <section className="tab-panel">
        <div className="section-heading hero-heading">
          <div>
            <h1>{translate('search.title')}</h1>
            <span>{translate('search.subtitle')}</span>
          </div>
        </div>

        <div className="filter-row" style={{ marginBottom: '18px' }} aria-label="Filtros de busqueda">
          {[
            { key: 'all', label: translate('filter.all') },
            { key: 'tracks', label: translate('filter.tracks') },
            { key: 'artists', label: translate('filter.artists') },
            { key: 'albums', label: translate('filter.albums') },
            { key: 'playlists', label: translate('filter.playlists') }
          ].map((filter) => (
            <button key={filter.key} type="button" className={searchFilter === filter.key ? 'active' : ''} onClick={() => setSearchFilter(filter.key)}>
              {filter.label}
            </button>
          ))}
        </div>

        {search.trim() ? (
          <>
            {searchFilter === 'artists' && (filteredArtists || []).length > 0 && (
              <section className="table-card">
                <div className="section-heading compact">
                  <div>
                    <h2>Artistas</h2>
                    <span>{(filteredArtists || []).length} resultados</span>
                  </div>
                </div>
                <div className="track-list">
                  {(filteredArtists || []).map((user, index) => (
                    <button key={user.id} type="button" className="track-row" onClick={() => router.push(`/profile/${user.id}`)}>
                      <span className="track-index">{index + 1}</span>
                      <span className="track-meta">
                        <div className={`cover-art neon track-cover`} aria-hidden="true">
                          <span>{user.name.slice(0, 2).toUpperCase()}</span>
                        </div>
                        <span className="track-copy">
                          <strong>{user.name}</strong>
                          <span>{user.email}</span>
                        </span>
                      </span>
                      <span className="track-time">{user.isVerified ? 'Verificado' : ''}</span>
                    </button>
                  ))}
                </div>
              </section>
            )}

            {searchFilter === 'albums' && (filteredAlbumsList || []).length > 0 && (
              <section className="table-card">
                <div className="section-heading compact">
                  <div>
                    <h2>Albumes</h2>
                    <span>{(filteredAlbumsList || []).length} resultados</span>
                  </div>
                </div>
                <div className="track-list">
                  {(filteredAlbumsList || []).map((track, index) => (
                    <button key={track.album + index} type="button" className="track-row" onClick={() => playTrack(track.id)}>
                      <span className="track-index">{index + 1}</span>
                      <span className="track-meta">
                        <div className={`cover-art ${track.accent} track-cover`} aria-hidden="true">
                          <span>{track.album.slice(0, 1)}</span>
                        </div>
                        <span className="track-copy">
                          <strong>{track.album}</strong>
                          <span>{track.artist}</span>
                        </span>
                      </span>
                      <span className="track-album">{track.album}</span>
                      <span className="track-time">{track.duration ? formatTime(track.duration) : ''}</span>
                    </button>
                  ))}
                </div>
              </section>
            )}

            {searchFilter === 'playlists' && (filteredPlaylistsList || []).length > 0 && (
              <section className="table-card">
                <div className="section-heading compact">
                  <div>
                    <h2>Playlists</h2>
                    <span>{(filteredPlaylistsList || []).length} resultados</span>
                  </div>
                </div>
                <div className="track-list">
                  {(filteredPlaylistsList || []).map((pl, index) => (
                    <button key={pl.id} type="button" className="track-row" onClick={() => router.push(`/playlist/${pl.id}`)}>
                      <span className="track-index">{index + 1}</span>
                      <span className="track-meta">
                        <div className={`cover-art sunset track-cover`} aria-hidden="true">
                          <span>{pl.name.slice(0, 1)}</span>
                        </div>
                        <span className="track-copy">
                          <strong>{pl.name}</strong>
                          <span>{pl.trackIds.length} canciones</span>
                        </span>
                      </span>
                      <span className="track-time"></span>
                    </button>
                  ))}
                </div>
              </section>
            )}

            {(searchFilter === 'all' || searchFilter === 'tracks') && (
              <section className="table-card">
                <div className="section-heading compact">
                  <div>
                    <h2>Canciones</h2>
                    <span>{(filteredTracks || []).length} resultados</span>
                  </div>
                </div>
                <div className="track-list">
                  {(filteredTracks || []).slice(0, 20).map((track, index) => (
                    <button key={track.id} type="button" className={`track-row ${selectedTrackId === track.id ? 'selected' : ''}`} onClick={() => playTrack(track.id)}>
                      <span className="track-index">{index + 1}</span>
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
                      <span className="track-time">{track.duration ? formatTime(track.duration) : ''}</span>
                    </button>
                  ))}
                </div>
              </section>
            )}
          </>
        ) : (
          <>
            <div className="section-heading">
              <h2>Explorar todo</h2>
            </div>
            <div className="category-grid">
              {browseCategories.map((category) => (
                <button key={category.title} type="button" className={`category-card ${category.accent}`} onClick={() => setSearch(category.title)}>
                  <span>{category.title}</span>
                  <i aria-hidden="true" />
                </button>
              ))}
            </div>
          </>
        )}
      </section>
    </AppShell>
  );
}
