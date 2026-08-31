'use client';

import { useEffect, useRef } from 'react';

export default function AudioVisualizer({ audioRef, isPlaying, accent = 'neon' }) {
  const canvasRef = useRef(null);
  const frameRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);

  useEffect(() => {
    const audio = audioRef?.current;
    const canvas = canvasRef.current;
    if (!audio || !canvas) return;

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

    let audioContext = null;
    let analyser = null;
    let source = null;
    let dataArray = null;

    const setupAudio = async () => {
      try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        source = audioContext.createMediaElementSource(audio);
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 64;
        source.connect(analyser);
        analyser.connect(audioContext.destination);
        analyserRef.current = analyser;
        sourceRef.current = source;
        dataArray = new Uint8Array(analyser.frequencyBinCount);
      } catch (e) {
        console.warn('Audio visualizer setup failed:', e);
      }
    };

    let started = false;
    const trySetup = async () => {
      if (!started && audio.src) {
        started = true;
        await setupAudio();
      }
    };

    trySetup();
    audio.addEventListener('play', trySetup);
    audio.addEventListener('loadedmetadata', trySetup);

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
      audio.removeEventListener('play', trySetup);
      audio.removeEventListener('loadedmetadata', trySetup);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      if (sourceRef.current) {
        try { sourceRef.current.disconnect(); } catch (e) { /* ignore */ }
      }
      if (audioContext && audioContext.state !== 'closed') {
        audioContext.close().catch(() => {});
      }
    };
  }, [audioRef, isPlaying, accent]);

  return (
    <canvas
      ref={canvasRef}
      className="np-visualizer"
      style={{ width: '100%', height: '100%', display: 'block' }}
    />
  );
}
