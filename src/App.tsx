import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import HomeView from './views/HomeView';
import BorsaView from './views/BorsaView';
import CryptoView from './views/CryptoView';
import YouTubeView from './views/YouTubeView';
import LiveTvView from './views/LiveTvView';
import LiveAiDeveloperView from './views/LiveAiDeveloperView';
import SystemExpertView from './views/SystemExpertView';
import RuwisAiView from './views/RuwisAiView';
import VoiceAssistant from './components/VoiceAssistant';
import { AppView } from './types';

function App() {
  const [activeView, setActiveView] = useState<AppView>(AppView.HOME);

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      const errorLog = {
        id: Date.now().toString(),
        timestamp: new Date().toLocaleTimeString('tr-TR'),
        type: 'error',
        message: event.message,
        source: event.filename
      };

      try {
        const existingLogs = JSON.parse(localStorage.getItem('system_error_logs') || '[]');
        existingLogs.push(errorLog);
        const trimmedLogs = existingLogs.slice(-50);
        localStorage.setItem('system_error_logs', JSON.stringify(trimmedLogs));
      } catch (e) {
        console.error('Failed to save error log to localStorage', e);
        localStorage.setItem('system_error_logs', JSON.stringify([errorLog]));
      }
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  const renderView = () => {
    switch (activeView) {
      case AppView.HOME: return <HomeView />;
      case AppView.BORSA: return <BorsaView />;
      case AppView.CRYPTO: return <CryptoView />;
      case AppView.YOUTUBE: return <YouTubeView />;
      case AppView.LIVE_TV: return <LiveTvView />;
      case AppView.BUILDER: return <LiveAiDeveloperView />;
      case AppView.SYSTEM_EXPERT: return <SystemExpertView />;
      case AppView.RUWIS_AI: return <RuwisAiView />;
      default: return <HomeView />;
    }
  };

  return (
    <div className="flex h-screen bg-[#050505] text-white overflow-hidden font-sans">
      <Sidebar
        activeView={activeView}
        onViewChange={setActiveView}
        syncStatus="idle"
        onManualSync={() => console.log('Syncing...')}
      />
      <main className="flex-1 overflow-hidden relative ml-20 lg:ml-64">
        <div className="h-full overflow-y-auto">
          {renderView()}
        </div>
        <VoiceAssistant onCommand={(cmd) => {
          if (cmd.includes('ana sayfa')) setActiveView(AppView.HOME);
          if (cmd.includes('borsa')) setActiveView(AppView.BORSA);
          if (cmd.includes('kripto')) setActiveView(AppView.CRYPTO);
          if (cmd.includes('televizyon') || cmd.includes('tv')) setActiveView(AppView.LIVE_TV);
          if (cmd.includes('uzman') || cmd.includes('onarı')) setActiveView(AppView.SYSTEM_EXPERT);
        }} />
      </main>
    </div>
  );
}

export default App;
