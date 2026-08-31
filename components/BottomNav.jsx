'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useMusic } from '../context/MusicContext';
import { navRoutes } from '../lib/data';

export default function BottomNav() {
  const pathname = usePathname();
  const { translate, session } = useMusic();

  const isActive = (path) => pathname === path || pathname.startsWith(`${path}/`);

  const items = [
    ...navRoutes,
    ...(session?.role === 'admin' || session?.role === 'label' ? [{ path: '/staff', labelKey: 'nav.staff', icon: '\u2699' }] : []),
    ...(session?.role === 'label' ? [{ path: '/label', labelKey: 'nav.label', icon: '\u{1F3F7}' }] : [])
  ];

  return (
    <nav className="bottom-nav" aria-label="Navegacion movil">
      {items.map((item) => (
        <Link key={item.path} href={item.path} className={`bottom-nav-item ${isActive(item.path) ? 'active' : ''}`}>
          <span aria-hidden="true">{item.icon}</span>
          {translate(item.labelKey)}
        </Link>
      ))}
    </nav>
  );
}
