import ClientLayout from './ClientLayout';
import './globals.css';

export const metadata = {
  title: 'GrooveFlow',
  description: 'Una experiencia musical moderna inspirada en Spotify.',
  manifest: '/manifest.json',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
