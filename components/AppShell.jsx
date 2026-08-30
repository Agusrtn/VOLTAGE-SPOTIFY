'use client';

import Sidebar from './Sidebar';
import Topbar from './Topbar';
import PlayerBar from './PlayerBar';
import QueuePanel from './QueuePanel';
import NowPlayingView from './NowPlayingView';
import Modals from './Modals';
import BottomNav from './BottomNav';
import { useMusic } from '../context/MusicContext';

export default function AppShell({ children }) {
  const { settingsOpen, setSettingsOpen } = useMusic();

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="content-panel">
        <Topbar />
        {children}
      </main>
      <footer className="player-bar">
        <PlayerBar />
      </footer>
      <BottomNav />
      <QueuePanel />
      <NowPlayingView />
      {settingsOpen && (
        <div className="track-detail-overlay" onClick={() => setSettingsOpen(false)}>
          <div className="track-detail-modal settings-panel" onClick={(e) => e.stopPropagation()}>
            <h2>Configuracion</h2>
            <div className="settings-layout">
              <div className="settings-section">
                <h2>Apariencia</h2>
                <div className="settings-row">
                  <label>Tema oscuro</label>
                  <button type="button" className="toggle-switch" aria-checked="true" onClick={() => {}} />
                </div>
                <div className="settings-row">
                  <label>Idioma</label>
                  <select defaultValue="es">
                    <option value="es">Espanol</option>
                    <option value="en">English</option>
                  </select>
                </div>
              </div>
              <div className="settings-section">
                <h2>Privacidad</h2>
                <div className="settings-row">
                  <label>Perfil privado</label>
                  <button type="button" className="toggle-switch" aria-checked="false" onClick={() => {}} />
                </div>
              </div>
              <div className="settings-section">
                <h2>Audio</h2>
                <div className="settings-row">
                  <label>Reproduccion automatica</label>
                  <button type="button" className="toggle-switch" aria-checked="true" onClick={() => {}} />
                </div>
                <div className="settings-row">
                  <label>Crossfade</label>
                  <button type="button" className="toggle-switch" aria-checked="false" onClick={() => {}} />
                </div>
              </div>
            </div>
            <div className="track-detail-actions" style={{ marginTop: '10px' }}>
              <button type="button" className="secondary-btn" onClick={() => setSettingsOpen(false)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}
      <Modals />
    </div>
  );
}
