'use client';

import { useRef, useState } from 'react';
import { useMusic } from '../context/MusicContext';
import { formatTime } from '../lib/utils';
import CoverArt from './CoverArt';

export default function PlayerBar() {
  const {
    selectedTrack, isPlaying, setIsPlaying, likedTrackIds, toggleLikedTrack,
    isShuffle, setIsShuffle, isRepeat, setIsRepeat, changeTrack, currentTime, duration,
    volume, setVolume, queueOpen, setQueueOpen, setNowPlayingOpen, lyricsOpen, setLyricsOpen,
    connectOpen, setConnectOpen, translate, audioRef
  } = useMusic();

  const prevVolumeRef = useRef(volume);
  const [isMuted, setIsMuted] = useState(false);

  const handleProgress = (event) => {
    const nextTime = Number(event.target.value);
    if (audioRef.current) audioRef.current.currentTime = nextTime;
  };

  const progress = duration ? Math.min(100, Math.max(0, (currentTime / duration) * 100)) : 0;

  const toggleMute = () => {
    if (isMuted) {
      const restore = prevVolumeRef.current || 0.5;
      setVolume(restore);
      setIsMuted(false);
    } else {
      prevVolumeRef.current = volume;
      setVolume(0);
      setIsMuted(true);
    }
  };

  return (
    <footer className="player-bar">
      <div className="player-left">
        <button type="button" className="now-playing-btn" onClick={() => setNowPlayingOpen(true)}>
          <CoverArt accent={selectedTrack.accent} label={selectedTrack.title.slice(0, 1)} className="player-thumb" track={selectedTrack} />
          <div className="player-info">
            <h3>{selectedTrack.title}</h3>
            <p>{selectedTrack.artist}</p>
          </div>
        </button>
        <button
          type="button"
          className={`icon-btn subtle ${likedTrackIds.includes(selectedTrack.id) ? 'favorite-btn active' : 'favorite-btn'}`}
          aria-label={likedTrackIds.includes(selectedTrack.id) ? translate('player.unlike') : translate('player.like')}
          onClick={() => toggleLikedTrack(selectedTrack.id)}
        >
          <span aria-hidden="true">{likedTrackIds.includes(selectedTrack.id) ? '\u2665' : '\u2661'}</span>
        </button>
      </div>

      <div className="player-center">
        <div className="player-controls">
          <button type="button" className={`ctrl-btn ${isShuffle ? 'active' : ''}`} aria-label={translate('player.shuffle')} onClick={() => setIsShuffle((p) => !p)}>
            <span aria-hidden="true">{'\u21C4'}</span>
          </button>
          <button type="button" className="ctrl-btn" aria-label={translate('player.prev')} onClick={() => changeTrack(-1)}>
            <span aria-hidden="true">{'\u23EE'}</span>
          </button>
          <button type="button" className="play-btn" aria-label={isPlaying ? translate('player.pause') : translate('player.play')} onClick={() => setIsPlaying((p) => !p)}>
            <span aria-hidden="true">{isPlaying ? '\u275A\u275A' : '\u25B6'}</span>
          </button>
          <button type="button" className="ctrl-btn" aria-label={translate('player.next')} onClick={() => changeTrack(1)}>
            <span aria-hidden="true">{'\u23ED'}</span>
          </button>
          <button type="button" className={`ctrl-btn ${isRepeat ? 'active' : ''}`} aria-label={translate('player.repeat')} onClick={() => setIsRepeat((p) => !p)}>
            <span aria-hidden="true">{'\u21BB'}</span>
          </button>
        </div>

        <div className="progress-row">
          <span>{formatTime(currentTime)}</span>
          <div 
            className="progress-track" 
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
              if (audioRef.current && duration) audioRef.current.currentTime = pct * duration;
            }}
          >
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div className="player-right">
        <button type="button" className={`ctrl-btn ${lyricsOpen ? 'active' : ''}`} aria-label={translate('player.lyrics')} onClick={() => setLyricsOpen((p) => !p)}>
          <span aria-hidden="true">{'\u266A'}</span>
        </button>
        <div className="connect-wrap">
          <button type="button" className="ctrl-btn" aria-label={translate('player.connect')} onClick={() => setConnectOpen((p) => !p)}>
            <span aria-hidden="true">{'\u25FB'}</span>
          </button>
          {connectOpen && (
            <div className="connect-panel">
              {['Este dispositivo', 'Altavoz salon', 'Movil', 'PC oficina'].map((d) => (
                <button key={d} type="button" className="" onClick={() => { }}>
                  {d}
                </button>
              ))}
            </div>
          )}
        </div>
        <button type="button" className="ctrl-btn" aria-label={translate('player.queue')} onClick={() => setQueueOpen((p) => !p)}>
          <span aria-hidden="true">{'\u2630'}</span>
        </button>
        <button type="button" className="ctrl-btn" aria-label={isMuted ? 'Activar sonido' : 'Silenciar'} onClick={toggleMute}>
          <span aria-hidden="true">{isMuted ? '\u2715' : (volume === 0 ? '\u266B' : '\u25C9')}</span>
        </button>
        <div className="volume-wrap">
          <input 
            id="volume" 
            type="range" 
            min="0" 
            max="1" 
            step="0.05" 
            value={isMuted ? 0 : volume} 
            onChange={(e) => { setVolume(Number(e.target.value)); if (Number(e.target.value) > 0) setIsMuted(false); }} 
            aria-label={translate('player.volume')}
          />
        </div>
      </div>
    </footer>
  );
}
