'use client';

import { useMusic } from '../../context/MusicContext';
import AppShell from '../../components/AppShell';
import CoverArt from '../../components/CoverArt';

export default function LabelPage() {
  const {
    session, users, allTracks, playlists, albums,
    uploadForm, setUploadForm, handleUploadTrack, userTracks,
    deleteUserTrack, playTrack, selectedTrack, isPlaying, translate
  } = useMusic();

  const isLabel = session?.role === 'label';
  const isAdmin = session?.role === 'admin';
  const canUpload = isLabel || isAdmin;

  if (!canUpload) {
    return (
      <AppShell>
        <section className="tab-panel">
          <div className="section-heading hero-heading">
            <div>
              <h1>Acceso denegado</h1>
              <span>Solo las discograficas y administradores pueden acceder a este panel.</span>
            </div>
          </div>
        </section>
      </AppShell>
    );
  }

  const artists = users.filter((u) => u.role === 'artist');

  return (
    <AppShell>
      <section className="tab-panel staff-panel">
        <div className="section-heading hero-heading">
          <div>
            <h1>Discografica</h1>
            <span>Sube musica para los artistas y gestiona lanzamientos.</span>
          </div>
        </div>

        <div className="staff-layout">
          <div className="staff-section">
            <h2>Subir musica</h2>
            <form className="staff-upload-form" onSubmit={handleUploadTrack}>
              <label>
                Artista
                <select value={uploadForm.artistId} onChange={(e) => setUploadForm((p) => ({ ...p, artistId: e.target.value }))} required>
                  <option value="">Selecciona un artista</option>
                  {artists.map((u) => (
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
        </div>
      </section>
    </AppShell>
  );
}
