'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useMusic } from '../context/MusicContext';
import AuthShell from '../components/AuthShell';

export default function RootPage() {
  const router = useRouter();
  const pathname = usePathname();
  const { session, hydrated } = useMusic();

  useEffect(() => {
    if (!hydrated) return;
    if (session) {
      router.replace('/home');
    }
  }, [session, hydrated, router]);

  if (!hydrated) {
    return (
      <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#000', color: '#fff' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="brand-mark wave-mark" style={{ width: 48, height: 48, margin: '0 auto 16px', display: 'grid', placeItems: 'center', borderRadius: '50%', background: 'var(--green)', color: '#041407', position: 'relative' }}>
            <i style={{ position: 'absolute', left: 9, width: 16, height: 7, borderTop: '2px solid #061207', borderRadius: '50%', transform: 'rotate(18deg)', top: 11 }} />
          </div>
          <p>Cargando GrooveFlow...</p>
        </div>
      </div>
    );
  }

  if (session) {
    return (
      <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#000', color: '#fff' }}>
        <p>Redirigiendo...</p>
      </div>
    );
  }

  return <AuthShell />;
}
