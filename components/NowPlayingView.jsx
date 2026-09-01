'use client';

import { useRouter } from 'next/navigation';
import { useMusic } from '../context/MusicContext';
import { getLyrics } from '../lib/lyrics';
import { formatTime } from '../lib/utils';
import CoverArt from './CoverArt';
import AudioVisualizer from './AudioVisualizer';

export default function NowPlayingView() {
  const router = useRouter();
  const {
    nowPlayingOpen, setNowPlayingOpen, selectedTrack, isPlaying, setIsPlaying,
    currentTime, duration, lyricsOpen, translate, audioRef, users
  } = useMusic();

  if (!nowPlayingOpen) return null;
  const lyrics = getLyrics(selectedTrack.id);
  const progress = duration ? (currentTime / duration) * 100 : 0;
  const artistUser = users.find((u) => u.name.toLowerCase() === selectedTrack.artist.toLowerCase());
  const collaborators = selectedTrack.collaborators || [];

  return (
    <div className="np-panel">
      <div className="np-panel-inner">
        <div className="np-left">
          <button type="button" className="icon-btn subtle np-close" onClick={() => setNowPlayingOpen(false)}>✕</button>
          <CoverArt accent={selectedTrack.accent} label={selectedTrack.title.slice(0, 1)} className="np-cover" track={selectedTrack} />
          <div className="np-info">
            <h2>{selectedTrack.title}</h2>
            {artistUser ? (
              <button type="button" className="artist-link" onClick={() => router.push(`/profile/${artistUser.id}`)}>{selectedTrack.artist}</button>
            ) : (
              <p>{selectedTrack.artist}</p>
            )}
            <p className="np-meta">{selectedTrack.album || 'Sin album'} {selectedTrack.year ? `• ${selectedTrack.year}` : ''}</p>
          </div>
          {collaborators.length > 0 && (
            <div className="np-collaborators">
              <span className="np-collaborators-label">Colaboradores</span>
              <div className="np-collaborators-list">
                {collaborators.map((name) => {
                  const collabUser = users.find((u) => u.name.toLowerCase() === name.toLowerCase());
                  return (
                    <button
                      key={name}
                      type="button"
                      className="np-collaborator-chip"
                      onClick={() => collabUser && router.push(`/profile/${collabUser.id}`)}
                    >
                      {name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          <div className="progress-block np-progress">
            <span>{formatTime(currentTime)}</span>
            <input type="range" min="0" max={duration || 0} value={currentTime} onChange={(e) => { if (audioRef.current) audioRef.current.currentTime = Number(e.target.value); }} />
            <span>{formatTime(duration)}</span>
          </div>
          <button type="button" className="play-button np-play" onClick={() => setIsPlaying((p) => !p)}>
            {isPlaying ? '\u275A\u275A' : '\u25B6'}
          </button>
        </div>
        <div className="np-right">
          {selectedTrack.visualizerUrl ? (
            <video className="np-video" src={selectedTrack.visualizerUrl} autoPlay loop muted playsInline />
          ) : (
            <div className="np-video-placeholder">
              <span>Visualizador</span>
              <small>Agrega un video MP4 desde editar cancion</small>
            </div>
          )}
        </div>
      </div>
      {lyricsOpen && (
        <div className="lyrics-panel">
          <h3>{translate('player.lyrics')}</h3>
          {lyrics.map((line, i) => <p key={i}>{line}</p>)}
        </div>
      )}
    </div>
  );
}
