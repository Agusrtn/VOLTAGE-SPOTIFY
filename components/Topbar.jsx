'use client';

import { useRouter } from 'next/navigation';
import { useMusic } from '../context/MusicContext';
import NotificationsPanel from './NotificationsPanel';

export default function Topbar() {
  const router = useRouter();
  const {
    search, setSearch, session, settings, setSettings, logout,
    notifications, setNotifications, notificationsOpen, setNotificationsOpen,
    installApp, translate
  } = useMusic();

  const unread = notifications.filter((n) => !n.read && n.userId === session?.id).length;

  return (
    <header className="topbar">
      <div className="history-buttons">
        <button type="button" className="icon-btn" aria-label={translate('common.back')} onClick={() => router.back()}>
          <span aria-hidden="true">{'\u2039'}</span>
        </button>
        <button type="button" className="icon-btn" aria-label={translate('common.forward')} onClick={() => router.push('/search')}>
          <span aria-hidden="true">{'\u203A'}</span>
        </button>
      </div>

      <label className="search-box">
        <span aria-hidden="true">{'\u2315'}</span>
        <input
          aria-label={translate('search.placeholder')}
          placeholder={translate('search.placeholder')}
          value={search}
          onFocus={() => router.push('/search')}
          onChange={(event) => setSearch(event.target.value)}
        />
      </label>

      <div className="top-actions">
        {session && (
          <>
            <div className="notifications-wrap">
              <button
                type="button"
                className="icon-btn subtle"
                aria-label={translate('common.notifications')}
                onClick={() => setNotificationsOpen((p) => !p)}
                style={{ position: 'relative' }}
              >
                <span aria-hidden="true">&#x1F514;</span>
                {unread > 0 && <span className="notification-badge">{unread}</span>}
              </button>
              {notificationsOpen && (
                <NotificationsPanel
                  onClose={() => {
                    setNotifications((prev) => prev.map((n) => (n.userId === session?.id ? { ...n, read: true } : n)));
                    setNotificationsOpen(false);
                  }}
                />
              )}
            </div>
            <button
              type="button"
              className="icon-btn subtle"
              aria-label={translate('common.theme')}
              onClick={() => setSettings((prev) => ({ ...prev, theme: prev.theme === 'dark' ? 'light' : 'dark' }))}
            >
              <span aria-hidden="true">{settings.theme === 'dark' ? '\u2600\uFE0F' : '\u{1F319}'}</span>
            </button>
            <button type="button" className="install-btn" onClick={installApp}>{translate('common.install')}</button>
            <button type="button" className="secondary-btn" onClick={logout}>{translate('common.logout')}</button>
            <button type="button" className="user-pill" aria-label="Usuario activo" onClick={() => router.push(`/profile/${session.id}`)}>
              {session.name?.slice(0, 2).toUpperCase() || 'US'}
            </button>
          </>
        )}
      </div>
    </header>
  );
}
