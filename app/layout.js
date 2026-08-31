import ClientLayout from './ClientLayout';
import VideoSplash from '../components/VideoSplash';
import './globals.css';

export const metadata = {
  title: 'VOLTAGE MUSIC',
  description: 'Una experiencia musical moderna.',
  manifest: '/manifest.json',
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
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
        <VideoSplash />
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
