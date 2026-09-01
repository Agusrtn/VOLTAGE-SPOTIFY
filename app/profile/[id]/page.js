'use client';

import { notFound } from 'next/navigation';
import { useMusic } from '../../../context/MusicContext';
import AppShell from '../../../components/AppShell';
import TrackTable from '../../../components/TrackTable';
import CoverArt from '../../../components/CoverArt';
import { useParams, useRouter } from 'next/navigation';
import { formatTime } from '../../../lib/utils';

export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();
  const {
    users, session, allTracks, playlists, albums, history, followingIds,
    handleFollowToggle, openShare, setProfileEdit, setProfileEditOpen, translate
  } = useMusic();

  const profileUser = users.find((u) => u.id === Number(params?.id));
  if (!profileUser) {
    return (
      <AppShell>
        <section className="tab-panel">
          <div className="section-heading hero-heading">
            <div>
              <h1>Usuario no encontrado</h1>
              <span>El usuario que buscas no existe.</span>
            </div>
          </div>
        </section>
      </AppShell>
    );
  }

  const isOwnProfile = session?.id === profileUser.id;
  const profileTracks = allTracks.filter((track) => track.artist.toLowerCase() === profileUser.name.toLowerCase());
  const profilePlaylists = playlists.filter((p) => p.userId === profileUser.id);
  const profileAlbums = albums.filter((a) => a.artistId === profileUser.id);
  const isFollowing = followingIds.includes(profileUser.id);

  return (
    <AppShell>
      <section className="tab-panel profile-panel">
        <div className="profile-header">
          <div className="profile-avatar">
            {profileUser.avatarUrl ? (
              <img src={profileUser.avatarUrl} alt={profileUser.name} className="profile-cover-img" />
            ) : (
              <div className={`cover-art neon profile-cover`} aria-hidden="true">
                <span>{profileUser.name.slice(0, 2).toUpperCase()}</span>
              </div>
            )}
          </div>
          <div className="profile-meta">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className={`profile-role-badge profile-role-${profileUser.role}`}>{profileUser.role}</span>
              {profileUser.isVerified && <span className="verified-tick" title="Verificado">&#x2714;</span>}
            </div>
            <h1>{profileUser.name}</h1>
            <p>{profileUser.email}</p>
            <div className="profile-stats">
              <span>{profileUser.isVerified ? 'Verificado' : 'Sin verificar'}</span>
              <span>{profileTracks.length} canciones</span>
              <span>{profilePlaylists.length} playlists</span>
              <span>{profileAlbums.length} albumes</span>
              <span>{isFollowing ? 'Siguiendo' : 'No sigues'}</span>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              {!isOwnProfile && session && (
                <button type="button" className={`primary-btn ${isFollowing ? 'staff-btn-warn' : ''}`} onClick={() => handleFollowToggle(profileUser.id)}>
                  {isFollowing ? 'Dejar de seguir' : 'Seguir'}
                </button>
              )}
              {isOwnProfile && (
                <>
                  <button type="button" className="primary-btn" style={{ alignSelf: 'flex-start' }} onClick={() => {
                    setProfileEdit({ name: profileUser.name, email: profileUser.email, avatarUrl: profileUser.avatarUrl || '' });
                    setProfileEditOpen(true);
                  }}>
                    Editar perfil
                  </button>
                  <button type="button" className="secondary-btn" style={{ alignSelf: 'flex-start' }} onClick={() => router.push('/settings')}>
                    Configuracion
                  </button>
                </>
              )}
              {!isOwnProfile && session && (
                <button type="button" className="secondary-btn" style={{ alignSelf: 'flex-start' }} onClick={() => openShare('profile', profileUser.id, profileUser.name)}>
                  Compartir perfil
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="profile-sections">
          <div className="profile-tracks">
            <h2>Canciones subidas</h2>
            <div className="track-list">
              {profileTracks.length === 0 && <div className="queue-empty">Este usuario aun no ha subido canciones.</div>}
              {profileTracks.map((track, index) => (
                <button key={track.id} type="button" className={`track-row ${track.id}`} onClick={() => {}}>
                  <span className="track-index">{index + 1}</span>
                  <span className="track-meta">
                    <CoverArt accent={track.accent} label={track.coverUrl || track.title.slice(0, 1)} className="track-cover" track={track} />
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
          </div>

          {isOwnProfile && (
            <div className="profile-history">
              <h2>Historial de reproduccion</h2>
              <div className="track-list">
                {history.length === 0 && <div className="queue-empty">No hay reproducciones todavia.</div>}
                {history.slice(0, 20).map((item) => {
                  const track = allTracks.find((t) => t.id === item.trackId);
                  if (!track) return null;
                  return (
                    <button key={item.id} type="button" className="track-row" onClick={() => {}}>
                      <span className="track-index">{new Date(item.playedAt).toLocaleDateString()}</span>
                      <span className="track-meta">
                        <CoverArt accent={track.accent} label={track.coverUrl || track.title.slice(0, 1)} className="track-cover" track={track} />
                        <span className="track-copy">
                          <strong>{track.title}</strong>
                          <span>{track.artist}</span>
                        </span>
                      </span>
                      <span className="track-album">{track.album}</span>
                      <span className="track-time">{track.duration ? formatTime(track.duration) : ''}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="profile-playlists">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2>Playlists</h2>
              {isOwnProfile && (
                <button type="button" className="link-btn" onClick={() => {}}>+ Nueva playlist</button>
              )}
            </div>
            <div className="profile-list">
              {profilePlaylists.length === 0 && <div className="queue-empty">No hay playlists todavia.</div>}
              {profilePlaylists.map((pl) => {
                const plTracks = pl.trackIds.map((id) => allTracks.find((t) => t.id === id)).filter(Boolean);
                return (
                  <div key={pl.id} className="profile-list-item">
                    <div>
                      <strong>{pl.name}</strong>
                      <small>{plTracks.length} canciones</small>
                    </div>
                    <div className="profile-list-actions">
                      <button type="button" className="primary-btn" onClick={() => { if (plTracks.length) {} }}>
                        Reproducir
                      </button>
                      <button type="button" className="secondary-btn" onClick={() => openShare('playlist', pl.id, pl.name)}>
                        Compartir
                      </button>
                      {isOwnProfile && <button type="button" className="staff-btn-warn" onClick={() => {}}>Borrar</button>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="profile-albums">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2>Albumes</h2>
            </div>
            <div className="profile-list">
              {profileAlbums.length === 0 && <div className="queue-empty">No hay albumes todavia.</div>}
              {profileAlbums.map((album) => {
                const albumTracks = album.trackIds.map((id) => allTracks.find((t) => t.id === id)).filter(Boolean);
                return (
                  <div key={album.id} className="profile-list-item">
                    {album.coverUrl && (
                      <div className="profile-list-cover">
                        <img src={album.coverUrl} alt={album.name} />
                      </div>
                    )}
                    <div>
                      <strong>{album.name}</strong>
                      <small>{albumTracks.length} canciones</small>
                    </div>
                    <div className="profile-list-actions">
                      <button type="button" className="primary-btn" onClick={() => { if (albumTracks.length) {} }}>
                        Reproducir
                      </button>
                      <button type="button" className="secondary-btn" onClick={() => openShare('album', album.id, album.name)}>
                        Compartir
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
