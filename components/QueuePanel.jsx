'use client';

import { useState } from 'react';
import { useMusic } from '../context/MusicContext';
import { formatTime } from '../lib/utils';
import CoverArt from './CoverArt';

export default function QueuePanel() {
  const { queueTracks, selectedTrack, playQueueTrack, reorderQueue, setQueueOpen, translate } = useMusic();
  const [dragIndex, setDragIndex] = useState(null);

  return (
    <aside className="queue-panel" aria-label="Cola de reproduccion">
      <div className="queue-header">
        <div>
          <span className="eyebrow">{translate('queue.title')}</span>
          <h3>{translate('queue.playback')}</h3>
        </div>
        <button type="button" className="icon-btn subtle" aria-label={translate('common.close')} onClick={() => setQueueOpen(false)}>✕</button>
      </div>

      <div className="queue-list">
        {queueTracks.length ? queueTracks.map((track, index) => (
          <button
            key={`${track.id}-${index}`}
            type="button"
            draggable
            className={`queue-item ${selectedTrack.id === track.id ? 'active' : ''}`}
            onClick={() => playQueueTrack(track.id)}
            onDragStart={() => setDragIndex(index)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => {
              if (dragIndex !== null && dragIndex !== index) reorderQueue(dragIndex, index);
              setDragIndex(null);
            }}
          >
            <CoverArt accent={track.accent} label={track.title.slice(0, 1)} className="queue-thumb" track={track} />
            <span className="queue-copy">
              <strong>{track.title}</strong>
              <small>{track.artist}</small>
            </span>
            <span className="queue-time">{formatTime(track.duration)}</span>
          </button>
        )) : (
          <div className="queue-empty">{translate('queue.empty')}</div>
        )}
      </div>
    </aside>
  );
}
