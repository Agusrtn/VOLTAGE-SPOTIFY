'use client';

import Sidebar from './Sidebar';
import Topbar from './Topbar';
import PlayerBar from './PlayerBar';
import QueuePanel from './QueuePanel';
import NowPlayingView from './NowPlayingView';
import Modals from './Modals';
import BottomNav from './BottomNav';
import CoverDetailModal from './CoverDetailModal';
import { useMusic } from '../context/MusicContext';

export default function AppShell({ children }) {
  const { setQueueOpen, setNowPlayingOpen, setLyricsOpen, setConnectOpen, setSettingsOpen, setNotificationsOpen, setTrackDetailOpen, setProfileEditOpen, setNewPlaylistOpen, setNewAlbumOpen, setShareOpen, setCoverDetailOpen } = useMusic();

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
    setCoverDetailOpen(false);
  };

  return (
    <div className="app-shell">
      <Sidebar onNavClick={handleNavClick} />
      <main className="content-panel">
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
      <CoverDetailModal />
    </div>
  );
}
