'use client';

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

  return (
    <div className="now-playing-overlay" onClick={() => setNowPlayingOpen(false)}>
      <div className="now-playing-view" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="icon-btn subtle np-close" onClick={() => setNowPlayingOpen(false)}>✕</button>
        <div className="np-body">
          <div className="np-left">
            <AudioVisualizer isPlaying={isPlaying} accent={selectedTrack.accent} />
            <CoverArt accent={selectedTrack.accent} label={selectedTrack.title.slice(0, 1)} className="np-cover" track={selectedTrack} />
            <h2>{selectedTrack.title}</h2>
            {artistUser ? (
              <button type="button" className="artist-link" onClick={() => router.push(`/profile/${artistUser.id}`)}>{selectedTrack.artist}</button>
            ) : (
              <p>{selectedTrack.artist}</p>
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
    </div>
  );
}
