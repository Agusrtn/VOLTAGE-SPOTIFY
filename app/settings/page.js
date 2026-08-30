'use client';

import { useMusic } from '../../context/MusicContext';
import AppShell from '../../components/AppShell';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const router = useRouter();
  const { settings, setSettings, session, users, setUsers, translate } = useMusic();

  return (
    <AppShell>
      <section className="tab-panel">
        <div className="section-heading hero-heading">
          <div>
            <h1>Configuracion</h1>
            <span>Ajusta tu experiencia.</span>
          </div>
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
              <select value={settings.language} onChange={(e) => setSettings((p) => ({ ...p, language: e.target.value }))}>
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
        </div>
      </section>
    </AppShell>
  );
}
