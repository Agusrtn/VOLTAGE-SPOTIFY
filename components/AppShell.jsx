'use client';

import Sidebar from './Sidebar';
import Topbar from './Topbar';
import PlayerBar from './PlayerBar';
import QueuePanel from './QueuePanel';
import NowPlayingView from './NowPlayingView';
import Modals from './Modals';
import BottomNav from './BottomNav';

export default function AppShell({ children }) {
  return (
    <div className="app-shell">
      <Sidebar />
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
    </div>
  );
}
