'use client';

import { getCoverUrl } from '../lib/utils';

export default function CoverArt({ accent, label, className = '', track = null, onClick }) {
  const cover = track ? getCoverUrl(track) : null;
  const isUrl = typeof label === 'string' && /^https?:\/\//.test(label);
  const src = cover || (isUrl ? label : null);

  const content = src ? (
    <img src={src} alt="" />
  ) : (
    <span>{label}</span>
  );

  return (
    <div className={`cover-art ${accent || ''} ${className}`} aria-hidden="true" onClick={onClick} style={onClick ? { cursor: 'pointer' } : undefined}>
      {content}
    </div>
  );
}
