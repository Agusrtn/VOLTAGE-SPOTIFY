'use client';

import { useState } from 'react';
import { useMusic } from '../../context/MusicContext';
import AppShell from '../../components/AppShell';
import CoverArt from '../../components/CoverArt';
import { formatTime } from '../../lib/utils';

export default function StaffPage() {
  const { users, toggleUserVerified, toggleUserArtist, toggleUserLabel, translate, session, deleteUserAccount, resetUserPassword, allTracks, playlists, createAdminPlaylist, addTrackToPlaylist, removeTrackFromPlaylist, setPlaylistCover, history, stats, router } = useMusic();
  const [resetTarget, setResetTarget] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistCover, setNewPlaylistCover] = useState('');
  const [selectedTracks, setSelectedTracks] = useState([]);
  const [expandedPlaylist, setExpandedPlaylist] = useState(null);
  const [userSearch, setUserSearch] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  const isStaff = session?.role === 'admin' || session?.role === 'label';

  if (!isStaff) {
    return (
      <AppShell>
        <section className="tab-panel">
          <div className="section-heading hero-heading">
            <div>
              <h1>Acceso denegado</h1>
              <span>Solo los administradores y discograficas pueden acceder a este panel.</span>
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
            <h1>Panel</h1>
            <span>Gestiona la plataforma.</span>
          </div>
        </div>

        <div className="staff-layout">
          {session?.role === 'admin' && (
            <div className="staff-section">
              <h2>Estadisticas</h2>
              <div className="stats-grid">
                <div className="stat-card">
                  <span className="stat-value">{stats.plays}</span>
                  <span className="stat-label">Reproducciones</span>
                </div>
                <div className="stat-card">
                  <span className="stat-value">{stats.topArtist}</span>
                  <span className="stat-label">Artista top</span>
                </div>
              </div>
              <section className="shelf" style={{ marginTop: '18px' }}>
                <div className="section-heading">
                  <div>
                    <h2>Top canciones</h2>
                    <span>Las mas escuchadas</span>
                  </div>
                </div>
                <div className="track-list">
                  {(allTracks || []).slice(0, 5).map((track, index) => (
                    <div key={track.id} className="track-row">
                      <span className="track-index">{index + 1}</span>
                      <span className="track-meta">
                        <CoverArt accent={track.accent || 'neon'} label={track.title.slice(0, 1)} className="track-cover" track={track} />
                        <span className="track-copy">
                          <strong>{track.title}</strong>
                          <span>{track.artist}</span>
                        </span>
                      </span>
                      <span className="track-album">{track.album}</span>
                      <span className="track-time">{track.duration ? formatTime(track.duration) : ''}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {session?.role === 'admin' && (
            <div className="staff-section">
              <h2>Usuarios en linea</h2>
              <div className="online-users-grid">
                {users.filter((u) => u.id !== session?.id).map((user) => (
                  <div key={user.id} className="online-user-card" style={{
                    padding: '12px',
                    background: 'var(--surface-soft)',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }} onClick={() => router.push(`/profile/${user.id}`)}>
                    <div style={{ fontSize: '24px', marginBottom: '8px' }}>
                      {user.avatarUrl ? <img src={user.avatarUrl} alt={user.name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} /> : <span style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--accent)', borderRadius: '50%' }}>{user.name?.slice(0, 2).toUpperCase()}</span>}
                    </div>
                    <strong>{user.name}</strong>
                    <span style={{ display: 'block', fontSize: '0.85rem', color: 'var(--muted)' }}>{user.role}</span>
                    {user.isVerified && <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--accent)' }}>✓ Verificado</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {session?.role === 'admin' && (
            <div className="staff-section">
              <h2>Cuentas de usuario</h2>
              <div style={{ marginBottom: '16px', display: 'flex', gap: '12px' }}>
                <input
                  type="text"
                  placeholder="Buscar usuario..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid rgba(255,255,255,0.12)',
                    background: 'var(--surface)',
                    color: 'var(--text)',
                    fontFamily: 'inherit'
                  }}
                />
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid rgba(255,255,255,0.12)',
                    background: 'var(--surface)',
                    color: 'var(--text)',
                    fontFamily: 'inherit'
                  }}
                >
                  <option value="all">Todos</option>
                  <option value="user">Usuario</option>
                  <option value="artist">Artista</option>
                  <option value="label">Discografica</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="staff-table-wrap">
                <div className="staff-table-head">
                  <span>Nombre</span>
                  <span>Correo</span>
                  <span>Rol</span>
                  <span>Estado</span>
                  <span>Acciones</span>
                </div>
                <div className="staff-table-body">
                  {users
                    .filter((user) => {
                      const matchesSearch =
                        user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
                        user.email.toLowerCase().includes(userSearch.toLowerCase());
                      const matchesFilter = filterRole === 'all' || user.role === filterRole;
                      return matchesSearch && matchesFilter;
                    })
                    .sort((a, b) => {
                      // Usuarios logeados primero
                      if (a.id === session?.id) return -1;
                      if (b.id === session?.id) return 1;
                      return 0;
                    })
                    .map((user) => (
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
          )}

          {(session?.role === 'admin' || session?.role === 'label') && (
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
                    {(allTracks || []).map((track) => (
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
                            {(allTracks || []).map((track) => (
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
          )}
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

