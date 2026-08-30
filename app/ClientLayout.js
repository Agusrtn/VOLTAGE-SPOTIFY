'use client';

import { MusicProvider } from '../context/MusicContext';

export default function ClientLayout({ children }) {
  return (
    <MusicProvider>
      {children}
    </MusicProvider>
  );
}
