'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'grid', 
      placeItems: 'center', 
      background: '#080808', 
      color: '#fff',
      padding: '20px'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '48px', margin: '0 0 16px 0' }}>404</h1>
        <h2 style={{ fontSize: '24px', margin: '0 0 16px 0' }}>Pagina no encontrada</h2>
        <p style={{ margin: '0 0 24px 0', color: '#b3b3b3' }}>Lo sentimos, la pagina que buscas no existe.</p>
        <Link href="/home" style={{
          display: 'inline-block',
          padding: '12px 24px',
          background: 'var(--accent, #ff4d4d)',
          color: '#fff',
          borderRadius: '4px',
          textDecoration: 'none',
          cursor: 'pointer'
        }}>
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}

