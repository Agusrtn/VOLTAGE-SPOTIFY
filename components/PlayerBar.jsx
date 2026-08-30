'use client';

import { useMusic } from '../context/MusicContext';
import { formatTime } from '../lib/utils';
import { playbackRates } from '../lib/data';
import CoverArt from './CoverArt';

export default function PlayerBar() {
  const {
    selectedTrack, isPlaying, setIsPlaying, likedTrackIds, toggleLikedTrack,
    editTrack, setEditTrack, setTrackDetailOpen, isShuffle, setIsShuffle,
    isRepeat, setIsRepeat, changeTrack, currentTime, duration, volume, setVolume,
    queueOpen, setQueueOpen, setNowPlayingOpen, lyricsOpen, setLyricsOpen,
    connectOpen, setConnectOpen, playbackRate, setPlaybackRate, activeDevice,
    setActiveDevice, skipPodcast, translate, audioRef
  } = useMusic();

  const handleProgress = (event) => {
    const nextTime = Number(event.target.value);
    if (audioRef.current) audioRef.current.currentTime = nextTime;
  };

  return (
    <aside className="player-bar">
      <div className="now-playing">
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
        <button
          type="button"
          className="icon-btn subtle"
          aria-label={translate('player.edit')}
          onClick={() => {
            setEditTrack({ id: selectedTrack.id, title: selectedTrack.title, album: selectedTrack.album, accent: selectedTrack.accent, coverUrl: selectedTrack.coverUrl || '' });
            setTrackDetailOpen(true);
          }}
        >
          <span aria-hidden="true">&#x270E;</span>
        </button>
      </div>

      <audio ref={audioRef} preload="metadata" />

      <div className="center-player">
        <div className="player-controls">
          <button type="button" className={`icon-btn subtle ${isShuffle ? 'toggle-btn active' : 'toggle-btn'}`} aria-label={translate('player.shuffle')} onClick={() => setIsShuffle((p) => !p)}>
            <span aria-hidden="true">{'\u21C4'}</span>
          </button>
          <button type="button" className="icon-btn subtle" aria-label={translate('player.prev')} onClick={() => changeTrack(-1)}>
            <span aria-hidden="true">{'\u23EE'}</span>
          </button>
          <button type="button" className="play-button" aria-label={isPlaying ? translate('player.pause') : translate('player.play')} onClick={() => setIsPlaying((p) => !p)}>
            <span aria-hidden="true">{isPlaying ? '\u275A\u275A' : '\u25B6'}</span>
          </button>
          <button type="button" className="icon-btn subtle" aria-label={translate('player.next')} onClick={() => changeTrack(1)}>
            <span aria-hidden="true">{'\u23ED'}</span>
          </button>
          <button type="button" className={`icon-btn subtle ${isRepeat ? 'toggle-btn active' : 'toggle-btn'}`} aria-label={translate('player.repeat')} onClick={() => setIsRepeat((p) => !p)}>
            <span aria-hidden="true">{'\u21BB'}</span>
          </button>
        </div>

        <div className="progress-block">
          <span>{formatTime(currentTime)}</span>
          <input type="range" min="0" max={duration || 0} value={currentTime} onChange={handleProgress} aria-label="Progreso" />
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div className="right-controls">
        {selectedTrack.isPodcast && (
          <div className="podcast-controls">
            <button type="button" className="icon-btn subtle" onClick={() => skipPodcast(-15)} aria-label="-15s">-15</button>
            <select value={playbackRate} onChange={(e) => setPlaybackRate(Number(e.target.value))} aria-label={translate('player.speed')}>
              {playbackRates.map((r) => <option key={r} value={r}>{r}x</option>)}
            </select>
            <button type="button" className="icon-btn subtle" onClick={() => skipPodcast(15)} aria-label="+15s">+15</button>
          </div>
        )}
        <button type="button" className={`icon-btn subtle ${lyricsOpen ? 'toggle-btn active' : ''}`} aria-label={translate('player.lyrics')} onClick={() => setLyricsOpen((p) => !p)}>
          <span aria-hidden="true">{'\u266A'}</span>
        </button>
        <div className="connect-wrap">
          <button type="button" className="icon-btn subtle" aria-label={translate('player.connect')} onClick={() => setConnectOpen((p) => !p)}>
            <span aria-hidden="true">{'\u25FB'}</span>
          </button>
          {connectOpen && (
            <div className="connect-panel">
              {['Este dispositivo', 'Altavoz salon', 'Movil', 'PC oficina'].map((d) => (
                <button key={d} type="button" className={activeDevice === d ? 'active' : ''} onClick={() => { setActiveDevice(d); setConnectOpen(false); }}>{d}</button>
              ))}
            </div>
          )}
        </div>
        <button type="button" className="icon-btn subtle" aria-label={translate('player.queue')} onClick={() => setQueueOpen((p) => !p)}>
          <span aria-hidden="true">{'\u2630'}</span>
        </button>
        <label className="volume-box" htmlFor="volume">
          <span aria-hidden="true">{volume === 0 ? '\u266B' : '\u25C9'}</span>
          <input id="volume" type="range" min="0" max="1" step="0.05" value={volume} onChange={(e) => setVolume(Number(e.target.value))} />
        </label>
      </div>
    </aside>
  );
}
