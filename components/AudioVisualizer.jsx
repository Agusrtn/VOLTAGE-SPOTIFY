'use client';

import { useEffect, useRef } from 'react';
import { useAudioSetup } from '../app/ClientLayout';

export default function AudioVisualizer({ isPlaying, accent = 'neon' }) {
  const canvasRef = useRef(null);
  const frameRef = useRef(null);
  const { analyserRef, ready } = useAudioSetup();

  useEffect(() => {
    if (!ready) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * (window.devicePixelRatio || 1);
      canvas.height = rect.height * (window.devicePixelRatio || 1);
      ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
    };
    resize();
    window.addEventListener('resize', resize);

    const analyser = analyserRef.current;
    const dataArray = analyser ? new Uint8Array(analyser.frequencyBinCount) : null;

    const draw = () => {
      if (!ctx || !canvas) return;
      const w = canvas.width / (window.devicePixelRatio || 1);
      const h = canvas.height / (window.devicePixelRatio || 1);
      ctx.clearRect(0, 0, w, h);

      if (isPlaying && analyser && dataArray) {
        analyser.getByteFrequencyData(dataArray);
        const bars = dataArray.length;
        const barWidth = (w / bars) - 2;
        for (let i = 0; i < bars; i++) {
          const val = dataArray[i] / 255;
          const barHeight = Math.max(4, val * h * 0.9);
          const x = i * (barWidth + 2);
          const y = h - barHeight;
          ctx.fillStyle = '#ff4d4d';
          ctx.fillRect(x, y, barWidth, barHeight);
        }
      } else {
        const bars = 12;
        const barWidth = (w / bars) - 2;
        for (let i = 0; i < bars; i++) {
          const barHeight = 6;
          const x = i * (barWidth + 2);
          const y = h - barHeight;
          ctx.fillStyle = 'rgba(255,255,255,0.2)';
          ctx.fillRect(x, y, barWidth, barHeight);
        }
      }

      frameRef.current = requestAnimationFrame(draw);
    };

    frameRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [isPlaying, accent, ready, analyserRef]);

  if (!ready) {
    return (
      <div className="np-visualizer" style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'flex-end', gap: 2, padding: 8 }}>
        {[...Array(12)].map((_, i) => (
          <div key={i} style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.2)', borderRadius: 2 }} />
        ))}
      </div>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className="np-visualizer"
      style={{ width: '100%', height: '100%', display: 'block' }}
    />
  );
}
