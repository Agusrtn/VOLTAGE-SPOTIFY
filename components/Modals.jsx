'use client';

import { useMusic } from '../context/MusicContext';
import { readFileAsDataUrl } from '../lib/utils';

export default function Modals() {
  const {
    trackDetailOpen, setTrackDetailOpen, editTrack, setEditTrack, saveTrackEdit,
    profileEditOpen, setProfileEditOpen, profileEdit, setProfileEdit, saveProfile, handleAvatarUpload,
    newPlaylistOpen, setNewPlaylistOpen, newPlaylistName, setNewPlaylistName, newPlaylistTrackIds, setNewPlaylistTrackIds, allTracks, createPlaylist,
    newAlbumOpen, setNewAlbumOpen, newAlbum, setNewAlbum, selectedTrackIdsForAlbum, setSelectedTrackIdsForAlbum, users, createAlbum,
    settingsOpen, setSettingsOpen, settings, setSettings,
    shareOpen, setShareOpen, shareData, setShareData,
    session, logout, translate
  } = useMusic();

  return (
    <>
      {trackDetailOpen && (
        <div className="track-detail-overlay" onClick={() => setTrackDetailOpen(false)}>
          <div className="track-detail-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Editar cancion</h2>
            <div className="track-detail-body">
              <label>
                Titulo
                <input type="text" value={editTrack.title} onChange={(e) => setEditTrack((p) => ({ ...p, title: e.target.value }))} />
              </label>
              <label>
                Album
                <input type="text" value={editTrack.album} onChange={(e) => setEditTrack((p) => ({ ...p, album: e.target.value }))} />
              </label>
              <label>
                Genero
                <select value={editTrack.genre} onChange={(e) => setEditTrack((p) => ({ ...p, genre: e.target.value }))}>
                  <option value="">Selecciona genero</option>
                  {['Pop', 'Indie', 'Rock', 'Latin', 'Hip-Hop', 'Electronica', 'R&B', 'Jazz', 'Classical', 'Metal', 'Folk', 'Reggae', 'Blues', 'Country', 'Other'].map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </label>
              <label>
                Mood / Contexto
                <select value={editTrack.mood} onChange={(e) => setEditTrack((p) => ({ ...p, mood: e.target.value }))}>
                  <option value="">Selecciona mood</option>
                  {['Focus', 'Night drive', 'Workout', 'Chill', 'Study', 'Party', 'Romance', 'Travel', 'Gaming', 'Sleep'].map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </label>
              <label>
                Portada (URL de imagen)
                <input type="text" value={editTrack.coverUrl} onChange={(e) => setEditTrack((p) => ({ ...p, coverUrl: e.target.value }))} placeholder="https://..." />
              </label>
              <label>
                Visualizador (URL de video MP4)
                <input type="text" value={editTrack.visualizerUrl} onChange={(e) => setEditTrack((p) => ({ ...p, visualizerUrl: e.target.value }))} placeholder="https://...video.mp4" />
              </label>
              <label>
                Colaboradores (nombres separados por comas)
                <input type="text" value={editTrack.collaborators || ''} onChange={(e) => setEditTrack((p) => ({ ...p, collaborators: e.target.value }))} placeholder="Nombre1, Nombre2" />
              </label>
              <label>
                Letra / Descripcion
                <textarea value={editTrack.lyrics || ''} onChange={(e) => setEditTrack((p) => ({ ...p, lyrics: e.target.value }))} placeholder="Escribe la letra o descripcion aqui..." rows={4} style={{ minHeight: 90, padding: '10px 12px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.12)', background: '#121212', color: 'var(--text)', font: 'inherit' }} />
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input type="checkbox" checked={editTrack.isPodcast} onChange={(e) => setEditTrack((p) => ({ ...p, isPodcast: e.target.checked }))} />
                <span>Marcar como podcast / audio hablado</span>
              </label>
              <label>
                Icono
                <div className="accent-options">
                  {['lofi', 'sunset', 'violet', 'forest', 'neon', 'cat-pop', 'cat-hop', 'cat-electro', 'cat-indie', 'cat-rock', 'cat-latin', 'cat-chill', 'cat-podcast'].map((accent) => (
                    <button key={accent} type="button" className={`accent-swatch ${accent} ${editTrack.accent === accent ? 'active' : ''}`} onClick={() => setEditTrack((p) => ({ ...p, accent }))} aria-label={accent} />
                  ))}
                </div>
              </label>
              {editTrack.coverUrl && <img src={editTrack.coverUrl} alt="portada" className="detail-preview-img" />}
            </div>
            <div className="track-detail-actions">
              <button type="button" className="secondary-btn" onClick={() => setTrackDetailOpen(false)}>Cancelar</button>
              <button type="button" className="primary-btn" onClick={saveTrackEdit}>Guardar</button>
            </div>
          </div>
        </div>
      )}

      {profileEditOpen && (
        <div className="track-detail-overlay" onClick={() => setProfileEditOpen(false)}>
          <div className="track-detail-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Editar perfil</h2>
            <div className="track-detail-body">
              <label>
                Nombre
                <input type="text" value={profileEdit.name} onChange={(e) => setProfileEdit((p) => ({ ...p, name: e.target.value }))} />
              </label>
              <label>
                Correo
                <input type="email" value={profileEdit.email} onChange={(e) => setProfileEdit((p) => ({ ...p, email: e.target.value }))} />
              </label>
              <label>
                Foto de perfil
                <input type="file" accept="image/png, image/jpeg, image/jpg" onChange={handleAvatarUpload} />
                {profileEdit.avatarUrl && <img src={profileEdit.avatarUrl} alt="avatar" className="detail-preview-img" />}
              </label>
            </div>
            <div className="track-detail-actions">
              <button type="button" className="secondary-btn" onClick={() => setProfileEditOpen(false)}>Cancelar</button>
              <button type="button" className="primary-btn" onClick={saveProfile}>Guardar</button>
            </div>
          </div>
        </div>
      )}

      {newPlaylistOpen && (
        <div className="track-detail-overlay" onClick={() => setNewPlaylistOpen(false)}>
          <div className="track-detail-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Nueva playlist</h2>
            <div className="track-detail-body">
              <label>
                Nombre
                <input type="text" value={newPlaylistName} onChange={(e) => setNewPlaylistName(e.target.value)} placeholder="Mi playlist" />
              </label>
              <label>
                Canciones
                <div className="track-select-list">
                  {allTracks.map((track) => (
                    <label key={track.id} className="track-select-item">
                      <input type="checkbox" checked={newPlaylistTrackIds.includes(track.id)} onChange={(e) => {
                        setNewPlaylistTrackIds((prev) => e.target.checked ? [...prev, track.id] : prev.filter((id) => id !== track.id));
                      }} />
                      <span>{track.title} - {track.artist}</span>
                    </label>
                  ))}
                </div>
              </label>
            </div>
            <div className="track-detail-actions">
              <button type="button" className="secondary-btn" onClick={() => setNewPlaylistOpen(false)}>Cancelar</button>
              <button type="button" className="primary-btn" onClick={createPlaylist} disabled={!newPlaylistName.trim()}>Crear</button>
            </div>
          </div>
        </div>
      )}

      {newAlbumOpen && (
        <div className="track-detail-overlay" onClick={() => setNewAlbumOpen(false)}>
          <div className="track-detail-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Nuevo album</h2>
            <div className="track-detail-body">
              <label>
                Nombre
                <input type="text" value={newAlbum.name} onChange={(e) => setNewAlbum((p) => ({ ...p, name: e.target.value }))} placeholder="Nombre del album" />
              </label>
              <label>
                Artista
                <select value={newAlbum.artistId} onChange={(e) => setNewAlbum((p) => ({ ...p, artistId: e.target.value }))}>
                  <option value="">Selecciona artista</option>
                  {users.filter((u) => u.role === 'artist').map((u) => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
              </label>
              <label>
                Portada (URL de imagen)
                <input type="text" value={newAlbum.coverUrl} onChange={(e) => setNewAlbum((p) => ({ ...p, coverUrl: e.target.value }))} placeholder="https://..." />
                {newAlbum.coverUrl && <img src={newAlbum.coverUrl} alt="portada album" className="detail-preview-img" />}
              </label>
              <label>
                Canciones
                <div className="track-select-list">
                  {allTracks.map((track) => (
                    <label key={track.id} className="track-select-item">
                      <input type="checkbox" checked={selectedTrackIdsForAlbum.includes(track.id)} onChange={(e) => {
                        setSelectedTrackIdsForAlbum((prev) => e.target.checked ? [...prev, track.id] : prev.filter((id) => id !== track.id));
                      }} />
                      <span>{track.title} - {track.artist}</span>
                    </label>
                  ))}
                </div>
              </label>
            </div>
            <div className="track-detail-actions">
              <button type="button" className="secondary-btn" onClick={() => setNewAlbumOpen(false)}>Cancelar</button>
              <button type="button" className="primary-btn" onClick={createAlbum} disabled={!newAlbum.name.trim() || !newAlbum.artistId}>Crear album</button>
            </div>
          </div>
        </div>
      )}

      {settingsOpen && (
        <div className="track-detail-overlay" onClick={() => setSettingsOpen(false)}>
          <div className="track-detail-modal settings-panel" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ margin: 0 }}>Configuracion</h2>
              <button type="button" className="icon-btn subtle np-close" onClick={() => setSettingsOpen(false)}>✕</button>
            </div>
            <div className="settings-layout">
              <div className="settings-section">
                <h2>Apariencia</h2>
                <div className="settings-row">
                  <label>Tema oscuro</label>
                  <button type="button" className="toggle-switch" aria-checked={settings.theme === 'dark'} onClick={() => setSettings((p) => ({ ...p, theme: p.theme === 'dark' ? 'light' : 'dark' }))} />
                </div>
                <div className="settings-row">
                  <label>Idioma</label>
                  <select value={settings.language} onChange={(e) => setSettings((p) => ({ ...p, language: e.target.value }))} style={{ minHeight: '36px', padding: '8px', borderRadius: '4px', background: 'var(--surface)', color: 'var(--text)', border: '1px solid rgba(255,255,255,0.12)', fontFamily: 'inherit' }}>
                    <option value="es">Espanol</option>
                    <option value="en">English</option>
                  </select>
                </div>
              </div>
              <div className="settings-section">
                <h2>Privacidad</h2>
                <div className="settings-row">
                  <label>Perfil privado</label>
                  <button type="button" className="toggle-switch" aria-checked={settings.privateProfile} onClick={() => setSettings((p) => ({ ...p, privateProfile: !p.privateProfile }))} />
                </div>
              </div>
              <div className="settings-section">
                <h2>Audio</h2>
                <div className="settings-row">
                  <label>Reproduccion automatica</label>
                  <button type="button" className="toggle-switch" aria-checked={settings.autoplay} onClick={() => setSettings((p) => ({ ...p, autoplay: !p.autoplay }))} />
                </div>
                <div className="settings-row">
                  <label>Crossfade</label>
                  <button type="button" className="toggle-switch" aria-checked={settings.crossfade} onClick={() => setSettings((p) => ({ ...p, crossfade: !p.crossfade }))} />
                </div>
              </div>
              <div className="settings-section">
                <h2>Cuenta</h2>
                <div className="settings-row">
                  <label>Cambiar contrasena</label>
                  <input type="password" placeholder="Nueva contrasena" id="new-password" style={{ minHeight: '36px', padding: '8px 12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.12)', background: '#121212', color: 'var(--text)' }} />
                </div>
                <div className="settings-row">
                  <label>Confirmar contrasena</label>
                  <input type="password" placeholder="Confirmar" id="confirm-password" style={{ minHeight: '36px', padding: '8px 12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.12)', background: '#121212', color: 'var(--text)' }} />
                </div>
                <div className="settings-row">
                  <button type="button" className="primary-btn" onClick={() => {
                    const newPass = document.getElementById('new-password')?.value;
                    const confirmPass = document.getElementById('confirm-password')?.value;
                    if (!newPass || newPass.length < 4) { alert('La contrasena debe tener al menos 4 caracteres.'); return; }
                    if (newPass !== confirmPass) { alert('Las contrasenas no coinciden.'); return; }
                    setSettings((p) => ({ ...p }));
                    alert('Contrasena actualizada.');
                    document.getElementById('new-password').value = '';
                    document.getElementById('confirm-password').value = '';
                  }}>Guardar contrasena</button>
                </div>
                <div className="settings-row" style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.12)' }}>
                  <button type="button" className="staff-btn-warn" style={{ width: '100%' }} onClick={() => {
                    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
                      logout();
                      setSettingsOpen(false);
                    }
                  }}>Cerrar sesion</button>
                </div>
              </div>
            </div>
            <div className="track-detail-actions" style={{ marginTop: '10px' }}>
              <button type="button" className="secondary-btn" onClick={() => setSettingsOpen(false)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}

      {shareOpen && (
        <div className="track-detail-overlay" onClick={() => setShareOpen(false)}>
          <div className="track-detail-modal share-panel" onClick={(e) => e.stopPropagation()}>
            <h2>Compartir {shareData.type === 'playlist' ? 'playlist' : shareData.type === 'album' ? 'album' : 'perfil'}</h2>
            <div className="share-layout">
              <div className="share-row">
                <input readOnly value={`${shareData.type.toUpperCase()}-${shareData.id}`} />
                <button type="button" onClick={() => { navigator.clipboard?.writeText(`${shareData.type.toUpperCase()}-${shareData.id}`); alert('Codigo copiado'); }}>Copiar</button>
              </div>
            </div>
            <div className="track-detail-actions" style={{ marginTop: '10px' }}>
              <button type="button" className="secondary-btn" onClick={() => setShareOpen(false)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
