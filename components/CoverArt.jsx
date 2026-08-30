'use client';

import { getCoverUrl } from '../lib/utils';

export default function CoverArt({ accent, label, className = '', track = null }) {
  const cover = track ? getCoverUrl(track) : null;
  const isUrl = typeof label === 'string' && /^https?:\/\//.test(label);
  const src = cover || (isUrl ? label : null);

  if (src) {
    return (
      <div className={`cover-art ${accent || ''} ${className}`} aria-hidden="true">
        <img src={src} alt="" />
      </div>
    );
  }

  return (
    <div className={`cover-art ${accent} ${className}`} aria-hidden="true">
      <span>{label}</span>
    </div>
  );
}
