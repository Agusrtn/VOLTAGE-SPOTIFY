'use client';

import { MusicProvider, useMusic } from '../context/MusicContext';
import { createContext, useContext, useEffect, useRef, useState } from 'react';

const AudioSetupContext = createContext(null);

function PersistentAudio() {
  const { audioRef } = useMusic();
  return <audio ref={audioRef} preload="metadata" />;
}

function PersistentAudioSetup({ children }) {
  const { audioRef } = useMusic();
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const audio = audioRef?.current;
    if (!audio) return;

    let cancelled = false;

    const setup = async () => {
      if (audioContextRef.current) return;
      try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const source = audioContext.createMediaElementSource(audio);
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 64;
        source.connect(analyser);
        analyser.connect(audioContext.destination);
        audioContextRef.current = audioContext;
        analyserRef.current = analyser;
        sourceRef.current = source;
        if (!cancelled) setReady(true);
      } catch (e) {
        console.warn('Audio visualizer setup failed:', e);
      }
    };

    const trySetup = () => {
      if (!audioContextRef.current && audio.src) {
        setup();
      }
    };

    trySetup();
    audio.addEventListener('play', trySetup);
    audio.addEventListener('loadedmetadata', trySetup);

    return () => {
      cancelled = true;
      audio.removeEventListener('play', trySetup);
      audio.removeEventListener('loadedmetadata', trySetup);
    };
  }, [audioRef]);

  return (
    <AudioSetupContext.Provider value={{ analyserRef, audioContextRef, sourceRef, ready }}>
      {children}
    </AudioSetupContext.Provider>
  );
}

export function useAudioSetup() {
  return useContext(AudioSetupContext);
}

export default function ClientLayout({ children }) {
  return (
    <MusicProvider>
      <PersistentAudioSetup>
        <PersistentAudio />
        {children}
      </PersistentAudioSetup>
    </MusicProvider>
  );
}
