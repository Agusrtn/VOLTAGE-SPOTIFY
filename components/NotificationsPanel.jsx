'use client';

import { useMusic } from '../context/MusicContext';
import { formatTime } from '../lib/utils';

export default function NotificationsPanel({ onClose }) {
  const { notifications, session, lang } = useMusic();
  const mine = notifications.filter((n) => n.userId === session?.id);

  return (
    <div className="notifications-panel">
      <div className="notifications-header">
        <strong>{lang === 'en' ? 'Notifications' : 'Notificaciones'}</strong>
        <button type="button" className="icon-btn subtle" onClick={onClose} aria-label="Cerrar">✕</button>
      </div>
      <div className="notifications-list">
        {mine.length === 0 && (
          <p className="queue-empty">{lang === 'en' ? 'No notifications yet.' : 'No hay notificaciones todavia.'}</p>
        )}
        {mine.map((n) => (
          <div key={n.id} className={`notification-item ${n.read ? '' : 'unread'}`}>
            <span>{n.message}</span>
            <small>{new Date(n.createdAt).toLocaleString()}</small>
          </div>
        ))}
      </div>
    </div>
  );
}
