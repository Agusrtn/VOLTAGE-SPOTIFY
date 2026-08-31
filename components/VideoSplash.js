'use client';

import { useEffect, useRef, useState } from 'react';

export default function VideoSplash() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);
  const playedRef = useRef(false);

  useEffect(() => {
    if (playedRef.current) return;
    playedRef.current = true;

    const video = document.getElementById('splash-video');
    if (!video) return;

    const handleEnded = () => {
      setFading(true);
      setTimeout(() => setVisible(false), 1200);
    };

    video.addEventListener('ended', handleEnded);
    video.play().catch(() => {});

    return () => {
      video.removeEventListener('ended', handleEnded);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#000',
        display: 'grid',
        placeItems: 'center',
        opacity: fading ? 0 : 1,
        transition: 'opacity 1.2s ease',
        pointerEvents: 'none',
      }}
    >
      <video
        id="splash-video"
        src="/loading-video.mp4"
        muted
        playsInline
        preload="auto"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
        }}
      />
    </div>
  );
}
