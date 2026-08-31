'use client';

import Sidebar from './Sidebar';
import Topbar from './Topbar';
import PlayerBar from './PlayerBar';
import QueuePanel from './QueuePanel';
import NowPlayingView from './NowPlayingView';
import Modals from './Modals';
import BottomNav from './BottomNav';
import { useMusic } from '../context/MusicContext';
import { useMemo } from 'react';

const accentGradients = {
  lofi: 'linear-gradient(180deg, rgba(50,82,168,0.35) 0, rgba(18,18,18,0) 260px)',
  sunset: 'linear-gradient(180deg, rgba(218,77,36,0.3) 0, rgba(18,18,18,0) 260px)',
  violet: 'linear-gradient(180deg, rgba(122,75,216,0.3) 0, rgba(18,18,18,0) 260px)',
  forest: 'linear-gradient(180deg, rgba(30,215,96,0.25) 0, rgba(18,18,18,0) 260px)',
  neon: 'linear-gradient(180deg, rgba(22,210,212,0.25) 0, rgba(18,18,18,0) 260px)',
  'cat-pop': 'linear-gradient(180deg, rgba(255,77,77,0.3) 0, rgba(18,18,18,0) 260px)',
  'cat-hop': 'linear-gradient(180deg, rgba(141,103,171,0.3) 0, rgba(18,18,18,0) 260px)',
  'cat-electro': 'linear-gradient(180deg, rgba(30,50,100,0.35) 0, rgba(18,18,18,0) 260px)',
  'cat-indie': 'linear-gradient(180deg, rgba(232,17,91,0.3) 0, rgba(18,18,18,0) 260px)',
  'cat-rock': 'linear-gradient(180deg, rgba(186,93,7,0.3) 0, rgba(18,18,18,0) 260px)',
  'cat-latin': 'linear-gradient(180deg, rgba(20,138,8,0.3) 0, rgba(18,18,18,0) 260px)',
  'cat-chill': 'linear-gradient(180deg, rgba(13,115,236,0.3) 0, rgba(18,18,18,0) 260px)',
  'cat-podcast': 'linear-gradient(180deg, rgba(119,119,119,0.2) 0, rgba(18,18,18,0) 260px)'
};

export default function AppShell({ children }) {
  const { selectedTrack, setQueueOpen, setNowPlayingOpen, setLyricsOpen, setConnectOpen, setSettingsOpen, setNotificationsOpen, setTrackDetailOpen, setProfileEditOpen, setNewPlaylistOpen, setNewAlbumOpen, setShareOpen } = useMusic();

  const contentStyle = useMemo(() => {
    const gradient = accentGradients[selectedTrack?.accent] || 'linear-gradient(180deg, rgba(72,72,72,0.25) 0, rgba(18,18,18,0) 260px)';
    return { background: gradient };
  }, [selectedTrack?.accent]);

  const handleNavClick = () => {
    setQueueOpen(false);
    setNowPlayingOpen(false);
    setLyricsOpen(false);
    setConnectOpen(false);
    setSettingsOpen(false);
    setNotificationsOpen(false);
    setTrackDetailOpen(false);
    setProfileEditOpen(false);
    setNewPlaylistOpen(false);
    setNewAlbumOpen(false);
    setShareOpen(false);
  };

  return (
    <div className="app-shell">
      <Sidebar onNavClick={handleNavClick} />
      <main className="content-panel" style={contentStyle}>
        <Topbar />
        {children}
      </main>
      <footer className="player-bar">
        <PlayerBar />
      </footer>
      <BottomNav />
      <QueuePanel />
      <NowPlayingView />
      <Modals />
    </div>
  );
}
