'use client';

'use client';

import { useMusic } from '../../context/MusicContext';
import AppShell from '../../components/AppShell';
import CoverArt from '../../components/CoverArt';

export default function StaffPage() {
  const { users, toggleUserVerified, toggleUserArtist, toggleUserLabel, translate, session, handleUploadTrack, uploadForm, setUploadForm, userTracks, deleteUserTrack, playTrack, selectedTrack, isPlaying } = useMusic();

  const canUpload = session && (session.role === 'admin' || session.role === 'label');

  return (
    <AppShell>
      <section className="tab-panel staff-panel">
        <div className="section-heading hero-heading">
          <div>
            <h1>Staff Panel</h1>
            <span>Gestiona cuentas y sube musica.</span>
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
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {canUpload && (
            <div className="staff-section">
              <h2>Subir musica</h2>
              <form className="staff-upload-form" onSubmit={handleUploadTrack}>
                <label>
                  Artista
                  <select value={uploadForm.artistId} onChange={(e) => setUploadForm((p) => ({ ...p, artistId: e.target.value }))} required>
                    <option value="">Selecciona un artista</option>
                    {users.filter((u) => u.role === 'artist').map((u) => (
                      <option key={u.id} value={u.id}>{u.name}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Titulo
                  <input type="text" value={uploadForm.title} onChange={(e) => setUploadForm((p) => ({ ...p, title: e.target.value }))} placeholder="Nombre de la cancion" required />
                </label>
                <label>
                  Album
                  <input type="text" value={uploadForm.album} onChange={(e) => setUploadForm((p) => ({ ...p, album: e.target.value }))} placeholder="Nombre del album" />
                </label>
                <label>
                  Genero
                  <select value={uploadForm.genre} onChange={(e) => setUploadForm((p) => ({ ...p, genre: e.target.value }))}>
                    <option value="">Selecciona genero</option>
                    {['Pop', 'Indie', 'Rock', 'Latin', 'Hip-Hop', 'Electronica', 'R&B', 'Jazz', 'Classical', 'Metal', 'Folk', 'Reggae', 'Blues', 'Country', 'Other'].map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Mood / Contexto
                  <select value={uploadForm.mood} onChange={(e) => setUploadForm((p) => ({ ...p, mood: e.target.value }))}>
                    <option value="">Selecciona mood</option>
                    {['Focus', 'Night drive', 'Workout', 'Chill', 'Study', 'Party', 'Romance', 'Travel', 'Gaming', 'Sleep'].map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Portada (URL de imagen)
                  <input type="text" value={uploadForm.coverUrl} onChange={(e) => setUploadForm((p) => ({ ...p, coverUrl: e.target.value }))} placeholder="https://..." />
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={uploadForm.isPodcast} onChange={(e) => setUploadForm((p) => ({ ...p, isPodcast: e.target.checked }))} />
                  <span>Es podcast / audio hablado</span>
                </label>
                <label>
                  Archivo de audio
                  <input type="file" accept="audio/*" onChange={(e) => setUploadForm((p) => ({ ...p, file: e.target.files?.[0] || null }))} required />
                </label>
                <button type="submit" className="primary-btn" disabled={!uploadForm.artistId || !uploadForm.title || !uploadForm.file}>
                  Subir cancion
                </button>
              </form>

              <h3 className="staff-uploaded-heading">Canciones subidas</h3>
              <div className="track-list staff-track-list">
                {userTracks.length === 0 && <div className="queue-empty">No hay canciones subidas todavia.</div>}
                {userTracks.map((track) => (
                  <div key={track.id} className={`track-row staff-track-row ${selectedTrack.id === track.id && isPlaying ? 'selected' : ''}`}>
                    <span className="track-index">{selectedTrack.id === track.id && isPlaying ? '\u25B6' : track.id}</span>
                    <span className="track-meta">
                      <CoverArt accent={track.accent || 'neon'} label={track.coverUrl || track.title.slice(0, 1)} className="track-cover" track={track} />
                      <span className="track-copy">
                        <strong>{track.title}</strong>
                        <span>{track.artist}</span>
                      </span>
                    </span>
                    <span className="track-album">{track.album}</span>
                    <span className="track-time">{track.duration ? track.duration : ''}</span>
                    <button type="button" className="icon-btn subtle" aria-label="Reproducir" onClick={() => playTrack(track.id)}>
                      <span aria-hidden="true">{selectedTrack.id === track.id && isPlaying ? '\u275A\u275A' : '\u25B6'}</span>
                    </button>
                    <button type="button" className="icon-btn subtle staff-delete-btn" aria-label="Eliminar" onClick={() => deleteUserTrack(track.id)}>
                      <span aria-hidden="true">&#x2715;</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </AppShell>
  );
}
