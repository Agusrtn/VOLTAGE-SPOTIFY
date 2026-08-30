export const lyricsByTrackId = {
  1: [
    'City lights are calling out my name',
    'Midnight echo in the pouring rain',
    'Every street remembers who we were',
    'Neon rivers blur the lines we blur'
  ],
  2: [
    'Golden skyline burning through the haze',
    'We were chasing every golden phase',
    'Hold the moment till the colors fade',
    'Sunset club is where we always stayed'
  ],
  3: [
    'Cloudline drifting over open sea',
    'Soft signals whisper back to me',
    'Every breath is lighter than before',
    'Leave your worries waiting at the door'
  ],
  4: [
    'Sugar rush is running through my veins',
    'Heartbeat racing faster than the trains',
    'Turn it up and let the bass collide',
    'After hours we come alive inside'
  ],
  5: [
    'Velvet road beneath a low sun sky',
    'Pages open while the world goes by',
    'Quiet thoughts in every passing mile',
    'Study mode with headphones and a smile'
  ],
  6: [
    'Welcome back to Morning Brief today',
    'Top stories in a quick and easy way',
    'Tap to skip ahead or slow it down',
    'Your daily podcast in this quiet town'
  ]
};

export const getLyrics = (trackId) => lyricsByTrackId[trackId] || [
  'Letra no disponible para esta cancion.',
  'Disfruta la musica mientras tanto.'
];
