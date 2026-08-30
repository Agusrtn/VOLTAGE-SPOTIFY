'use client';

import { useState } from 'react';
import { useMusic } from '../../context/MusicContext';
import AppShell from '../../components/AppShell';
import CoverArt from '../../components/CoverArt';

export default function StaffPage() {
  const { users, toggleUserVerified, toggleUserArtist, toggleUserLabel, translate, session, deleteUserAccount, resetUserPassword, allTracks, playlists, createAdminPlaylist, addTrackToPlaylist, removeTrackFromPlaylist, setPlaylistCover } = useMusic();
  const [resetTarget, setResetTarget] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistCover, setNewPlaylistCover] = useState('');
  const [selectedTracks, setSelectedTracks] = useState([]);
  const [expandedPlaylist, setExpandedPlaylist] = useState(null);

  const isAdmin = session?.role === 'admin';

  if (!isAdmin) {
    return (
      <AppShell>
        <section className="tab-panel">
          <div className="section-heading hero-heading">
            <div>
              <h1>Acceso denegado</h1>
              <span>Solo los administradores pueden acceder a este panel.</span>
            </div>
          </div>
        </section>
      </AppShell>
    );
  }

  const handleCreatePlaylist = async (e) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;
    await createAdminPlaylist(newPlaylistName.trim(), newPlaylistCover, selectedTracks);
    setNewPlaylistName('');
    setNewPlaylistCover('');
    setSelectedTracks([]);
  };

  const toggleTrackSelection = (trackId) => {
    setSelectedTracks((prev) => (prev.includes(trackId) ? prev.filter((id) => id !== trackId) : [...prev, trackId]));
  };

  return (
    <AppShell>
      <section className="tab-panel staff-panel">
        <div className="section-heading hero-heading">
          <div>
            <h1>Staff Panel</h1>
            <span>Gestiona cuentas, roles y playlists.</span>
          </div>
        </div>

        <div className="staff-layout">
          <div className="staff-section">
            <h2>Cuentas de usuario</h2>
            <div className="staff-table-wrap">
              <div className="staff-table-head">
                <span>Nombre</span>
                <span>Correo</span>
                <span>Rol</span>
                <span>Estado</span>
                <span>Acciones</span>
              </div>
              <div className="staff-table-body">
                {users.map((user) => (
                  <div key={user.id} className="staff-table-row">
                    <span className="staff-user-name">{user.name}</span>
                    <span className="staff-user-email">{user.email}</span>
                    <span className={`staff-role-badge staff-role-${user.role}`}>{user.role}</span>
                    <span className={user.isVerified ? 'staff-verified-yes' : 'staff-verified-no'}>
                      {user.isVerified ? 'Verificado' : 'Sin verificar'}
                    </span>
                    <div className="staff-actions">
                      <button type="button" className={`staff-btn ${user.isVerified ? 'staff-btn-warn' : 'staff-btn-primary'}`} onClick={() => toggleUserVerified(user.id)}>
                        {user.isVerified ? 'Quitar verificado' : 'Verificar'}
                      </button>
                      <button type="button" className={`staff-btn ${user.role === 'artist' ? 'staff-btn-warn' : 'staff-btn-primary'}`} onClick={() => toggleUserArtist(user.id)}>
                        {user.role === 'artist' ? 'Quitar artista' : 'Dar artista'}
                      </button>
                      <button type="button" className={`staff-btn ${user.role === 'label' ? 'staff-btn-warn' : 'staff-btn-primary'}`} onClick={() => toggleUserLabel(user.id)}>
                        {user.role === 'label' ? 'Quitar discografica' : 'Dar discografica'}
                      </button>
                      <button type="button" className="staff-btn" onClick={() => setResetTarget(user.id)}>
                        Cambiar clave
                      </button>
                      <button type="button" className="staff-btn staff-btn-warn" onClick={() => setDeleteTarget(user.id)}>
                        Borrar cuenta
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="staff-section-actions" style={{ marginTop: '12px' }}>
              <button type="button" className="staff-btn staff-btn-warn" onClick={async () => { await deleteAllTracks(); window.location.reload(); }}>
                Borrar todas las canciones
              </button>
            </div>
          </div>

          <div className="staff-section">
            <h2>Gestionar playlists</h2>
            <form className="staff-upload-form" onSubmit={handleCreatePlaylist}>
              <label>
                Nombre de playlist
                <input type="text" value={newPlaylistName} onChange={(e) => setNewPlaylistName(e.target.value)} placeholder="Nombre de la playlist" required />
              </label>
              <label>
                Portada (URL de imagen)
                <input type="text" value={newPlaylistCover} onChange={(e) => setNewPlaylistCover(e.target.value)} placeholder="https://..." />
              </label>
              <label>
                Canciones
                <div className="track-select-list">
                  {allTracks.map((track) => (
                    <label key={track.id} className="track-select-item">
                      <input type="checkbox" checked={selectedTracks.includes(track.id)} onChange={() => toggleTrackSelection(track.id)} />
                      <span>{track.title} - {track.artist}</span>
                    </label>
                  ))}
                </div>
              </label>
              <button type="submit" className="primary-btn" disabled={!newPlaylistName.trim()}>
                Crear playlist
              </button>
            </form>

            <h3 className="staff-uploaded-heading">Playlists existentes</h3>
            <div className="staff-playlist-list">
              {playlists.length === 0 && <div className="queue-empty">No hay playlists todavia.</div>}
              {playlists.map((pl) => {
                const plTracks = pl.trackIds.map((id) => allTracks.find((t) => t.id === id)).filter(Boolean);
                const isExpanded = expandedPlaylist === pl.id;
                return (
                  <div key={pl.id} className={`staff-playlist-item ${isExpanded ? 'expanded' : ''}`}>
                    <div className="staff-playlist-header" onClick={() => setExpandedPlaylist(isExpanded ? null : pl.id)}>
                      <div className="staff-playlist-info">
                        {pl.coverUrl ? (
                          <img src={pl.coverUrl} alt={pl.name} className="staff-playlist-thumb" />
                        ) : (
                          <div className="cover-art sunset staff-playlist-thumb" aria-hidden="true">
                            <span>{pl.name.slice(0, 1)}</span>
                          </div>
                        )}
                        <div>
                          <strong>{pl.name}</strong>
                          <small>{pl.trackIds.length} canciones</small>
                        </div>
                      </div>
                      <div className="staff-playlist-actions" onClick={(e) => e.stopPropagation()}>
                        <button type="button" className="staff-btn" onClick={() => { const url = prompt('URL de portada:'); if (url) setPlaylistCover(pl.id, url); }}>
                          Portada
                        </button>
                      </div>
                    </div>
                    {isExpanded && (
                      <div className="staff-playlist-tracks">
                        <div className="track-select-list">
                          {allTracks.map((track) => (
                            <label key={track.id} className="track-select-item">
                              <input type="checkbox" checked={pl.trackIds.includes(track.id)} onChange={() => pl.trackIds.includes(track.id) ? removeTrackFromPlaylist(pl.id, track.id) : addTrackToPlaylist(pl.id, track.id)} />
                              <span>{track.title} - {track.artist}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {resetTarget && (
          <div className="track-detail-overlay" onClick={() => setResetTarget(null)}>
            <div className="track-detail-modal" onClick={(e) => e.stopPropagation()}>
              <h2>Cambiar contrasena</h2>
              <div className="track-detail-body">
                <label>
                  Nueva contrasena
                  <input type="text" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Nueva contrasena" />
                </label>
              </div>
              <div className="track-detail-actions">
                <button type="button" className="secondary-btn" onClick={() => { setResetTarget(null); setNewPassword(''); }}>Cancelar</button>
                <button type="button" className="primary-btn" onClick={() => { resetUserPassword(resetTarget, newPassword); setResetTarget(null); setNewPassword(''); }}>Guardar</button>
              </div>
            </div>
          </div>
        )}

        {deleteTarget && (
          <div className="track-detail-overlay" onClick={() => setDeleteTarget(null)}>
            <div className="track-detail-modal" onClick={(e) => e.stopPropagation()}>
              <h2>Borrar cuenta</h2>
              <div className="track-detail-body">
                <p>Estas seguro de que deseas borrar esta cuenta? Esta accion no se puede deshacer.</p>
              </div>
              <div className="track-detail-actions">
                <button type="button" className="secondary-btn" onClick={() => setDeleteTarget(null)}>Cancelar</button>
                <button type="button" className="primary-btn" style={{ background: '#ff4d4d', color: '#fff' }} onClick={() => { deleteUserAccount(deleteTarget); setDeleteTarget(null); }}>Borrar</button>
              </div>
            </div>
          </div>
        )}
      </section>
    </AppShell>
  );
}
