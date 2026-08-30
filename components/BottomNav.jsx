'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useMusic } from '../context/MusicContext';
import { navRoutes } from '../lib/data';

export default function BottomNav() {
  const pathname = usePathname();
  const { translate } = useMusic();

  const isActive = (path) => pathname === path || pathname.startsWith(`${path}/`);

  return (
    <nav className="bottom-nav" aria-label="Navegacion movil">
      {navRoutes.map((item) => (
        <Link key={item.path} href={item.path} className={`bottom-nav-item ${isActive(item.path) ? 'active' : ''}`}>
          <span aria-hidden="true">{item.icon}</span>
          {translate(item.labelKey)}
        </Link>
      ))}
    </nav>
  );
}
