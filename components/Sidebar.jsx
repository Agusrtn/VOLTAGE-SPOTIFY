'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMusic } from '../context/MusicContext';
import { navRoutes } from '../lib/data';
import CoverArt from './CoverArt';

export default function Sidebar() {
  const pathname = usePathname();
  const {
    session, translate, userPlaylists, setNewPlaylistOpen, router
  } = useMusic();

  const isActive = (path) => pathname === path || pathname.startsWith(`${path}/`);

  return (
    <aside className="sidebar">
      <section className="sidebar-card nav-card">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true"><img src="/logo.png" alt="VOLTAGE MUSIC" /></span>
          <span>VOLTAGE MUSIC</span>
        </div>

        <nav className="nav-menu" aria-label="Navegacion principal">
          {navRoutes.map((item) => (
            <Link key={item.path} href={item.path} className={`nav-item ${isActive(item.path) ? 'active' : ''}`}>
              <span aria-hidden="true">{item.icon}</span>
              {translate(item.labelKey)}
            </Link>
          ))}
          {(session?.role === 'admin' || session?.role === 'label') && (
            <Link href="/label" className={`nav-item ${isActive('/label') ? 'active' : ''}`}>
              <span aria-hidden="true">&#x266B;</span>
              Discografica
            </Link>
          )}
          {session?.role === 'admin' && (
            <Link href="/staff" className={`nav-item ${isActive('/staff') ? 'active' : ''}`}>
              <span aria-hidden="true">&#x2699;</span>
              {translate('nav.staff')}
            </Link>
          )}
          {session && (
            <Link href={`/profile/${session.id}`} className={`nav-item ${pathname.startsWith(`/profile/${session.id}`) ? 'active' : ''}`}>
              <span aria-hidden="true">&#x1F464;</span>
              {translate('nav.profile')}
            </Link>
          )}
        </nav>
      </section>

      <section className="sidebar-card library-card">
        <div className="library-title">
          <span>{'\u25A4'}</span>
          <strong>{translate('library.yourLibrary')}</strong>
          <button type="button" aria-label={translate('library.createBtn')} onClick={() => setNewPlaylistOpen(true)}>+</button>
        </div>

        {userPlaylists.length <= 1 && (
          <div className="sidebar-prompt">
            <strong>{translate('library.createFirst')}</strong>
            <span>{translate('library.createHint')}</span>
            <button type="button" onClick={() => setNewPlaylistOpen(true)}>{translate('library.createBtn')}</button>
          </div>
        )}

        <div className="mini-list">
          {userPlaylists.map((pl) => (
            <Link
              key={pl.id}
              href={pl.isLikes ? '/playlist/likes' : `/playlist/${pl.id}`}
              className="mini-item"
            >
              <CoverArt accent={pl.isLikes ? 'cat-pop' : 'sunset'} label={pl.name.slice(0, 1)} className="mini-cover" />
              <span>{pl.name}</span>
            </Link>
          ))}
        </div>
      </section>
    </aside>
  );
}
