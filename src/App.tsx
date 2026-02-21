import React, { useState, useEffect, useCallback, useRef } from 'react';
import Navigation from './components/Sidebar';
import HomeView from './views/HomeView';
import ToolsView from './views/ToolsView';
import CreativeView from './views/CreativeView';
import Dashboard from './views/Dashboard';
import ChatView from './views/ChatView';
import VisualsView from './views/VisualsView';
import AudioView from './views/AudioView';
import LiveView from './views/LiveView';
import MusicView from './views/MusicView';
import GalleryView from './views/GalleryView';
import BuilderView from './views/BuilderView';
import WorkflowView from './views/WorkflowView';
import CryptoView from './views/CryptoView';
import RequestView from './views/RequestView';
import SystemView from './views/SystemView';
import AutomationView from './views/AutomationView';
import PromptLibraryView from './views/PromptLibraryView';
import AnalyticsView from './views/AnalyticsView';
import GoogleAppsView from './views/GoogleAppsView';
import DockerConfigView from './views/DockerConfigView';
import SettingsView from './views/SettingsView';
import JulesStudioView from './views/JulesStudioView';
import ArtStudioView from './views/ArtStudioView';
import GameDevView from './views/GameDevView';
import SecurityCenterView from './views/SecurityCenterView';
import IntegrationsHubView from './views/IntegrationsHubView';
import SocialMediaManagerView from './views/SocialMediaManagerView';
import BorsaView from './views/BorsaView';
import AndroidStudioView from './views/AndroidStudioView';
import LiveEditorView from './views/LiveEditorView';
import VoiceAssistant from './components/VoiceAssistant';
import { AppView } from './types';
import type { SyncSettings, ChatMessage } from './types';
import { callAI } from './utils/ai';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<AppView | string>(AppView.HOME);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [dynamicModules, setDynamicModules] = useState<Record<string, unknown>>([]);

  // Global Chat State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [activeModelInfo, setActiveModelInfo] = useState<string>('');

  const chatEndRef = useRef<HTMLDivElement>(null);

  const loadDynamicModules = useCallback(() => {
    const modules = JSON.parse(localStorage.getItem('dynamic_modules') || '[]');
    setDynamicModules(modules);
  }, []);

  // Load state on mount
  useEffect(() => {
    const saved = localStorage.getItem('chat_history');
    if (saved) setChatMessages(JSON.parse(saved));

    loadDynamicModules();
    window.addEventListener('dynamic-module-added', loadDynamicModules);
    return () => window.removeEventListener('dynamic-module-added', loadDynamicModules);
  }, [loadDynamicModules]);

  // Save chat history and scroll
  useEffect(() => {
    localStorage.setItem('chat_history', JSON.stringify(chatMessages));
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isChatOpen]);

  const handleSendMessage = async (text: string, options?: { systemInstruction?: string, webSearch?: boolean }) => {
    if (!text.trim() || isTyping) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text, timestamp: Date.now() };
    setChatMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const result = await callAI(text, {
        systemInstruction: options?.systemInstruction,
        history: chatMessages
      });

      setActiveModelInfo(`${result.provider.toUpperCase()} (${result.model})`);
      const aiMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'model', text: result.text, timestamp: Date.now() };
      setChatMessages(prev => [...prev, aiMsg]);
    } catch (error: unknown) {
      setChatMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: `Hata: ${error.message}`, timestamp: Date.now() }]);
    }

    setIsTyping(false);
    setActiveModelInfo('');
  };

  const performGitHubSync = useCallback(async () => {
    const settingsStr = localStorage.getItem('sync_settings');
    if (!settingsStr) return;

    const settings: SyncSettings = JSON.parse(settingsStr);
    if (!settings.enabled || !settings.token || !settings.repo) return;

    setSyncStatus('syncing');
    try {
      const dataToSync = {
        chat: JSON.parse(localStorage.getItem('chat_history') || '[]'),
        visuals: JSON.parse(localStorage.getItem('visual_assets') || '[]'),
        timestamp: new Date().toISOString(),
        version: "1.0.0",
        lastAction: activeView
      };

      const jsonString = JSON.stringify(dataToSync, null, 2);
      const uint8Array = new TextEncoder().encode(jsonString);
      let binaryString = "";
      for (let i = 0; i < uint8Array.byteLength; i++) {
        binaryString += String.fromCharCode(uint8Array[i]);
      }
      const content = btoa(binaryString);

      const apiUrl = `https://api.github.com/repos/${settings.repo}/contents/${settings.path || 'backup.json'}`;
      const getFile = await fetch(apiUrl, { headers: { 'Authorization': `token ${settings.token}` } });

      let sha = '';
      if (getFile.ok) {
        const fileData = await getFile.json();
        sha = fileData.sha;
      }

      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: { 'Authorization': `token ${settings.token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: `Auto-sync: ${new Date().toLocaleString()}`, content, sha: sha || undefined })
      });

      if (!response.ok) throw new Error('GitHub API Hatası');
      setSyncStatus('success');
      setTimeout(() => setSyncStatus('idle'), 3000);
    } catch (err) {
      console.error('Sync failed:', err);
      setSyncStatus('error');
      setTimeout(() => setSyncStatus('idle'), 5000);
    }
  }, [activeView]);

  useEffect(() => {
    const interval = setInterval(() => { performGitHubSync(); }, 120000);
    return () => clearInterval(interval);
  }, [performGitHubSync]);

  const handleVoiceCommand = (command: string, action: string, payload: string) => {
    switch (action) {
      case 'chat':
        setActiveView(AppView.CHAT);
        setTimeout(() => window.dispatchEvent(new CustomEvent('voice-chat', { detail: payload })), 100);
        break;
      case 'visuals':
        setActiveView(AppView.VISUALS);
        setTimeout(() => window.dispatchEvent(new CustomEvent('voice-visuals', { detail: { prompt: payload, mode: command.startsWith('video') ? 'video' : 'image' } })), 100);
        break;
      case 'audio-tts':
      case 'audio-remix':
      case 'audio':
        setActiveView(AppView.AUDIO);
        setTimeout(() => window.dispatchEvent(new CustomEvent('voice-audio', { detail: { prompt: payload, mode: action === 'audio-remix' ? 'remix' : 'tts' } })), 100);
        break;
      case 'live-start':
        setActiveView(AppView.LIVE);
        setTimeout(() => window.dispatchEvent(new CustomEvent('voice-live-start')), 100);
        break;
      case 'live-stop':
        setActiveView(AppView.LIVE);
        setTimeout(() => window.dispatchEvent(new CustomEvent('voice-live-stop')), 100);
        break;
      case 'nav': {
        const p = payload.toLowerCase();
        // Turkish keyword mapping
        if (p.includes('ana sayfa')) setActiveView(AppView.HOME);
        else if (p.includes('araçlar')) setActiveView(AppView.TOOLS);
        else if (p.includes('kontrol') || p.includes('panel')) setActiveView(AppView.DASHBOARD);
        else if (p.includes('sohbet')) setActiveView(AppView.CHAT);
        else if (p.includes('görsel') || p.includes('resim')) setActiveView(AppView.VISUALS);
        else if (p.includes('ses') || p.includes('müzik')) setActiveView(AppView.AUDIO);
        else if (p.includes('canlı')) setActiveView(AppView.LIVE);
        else if (p.includes('sanat')) setActiveView(AppView.ART_STUDIO);
        else if (p.includes('oyun')) setActiveView(AppView.GAME_DEV);
        else if (p.includes('workflow') || p.includes('akış')) setActiveView(AppView.WORKFLOW);
        else if (p.includes('inşa')) setActiveView(AppView.BUILDER);
        else if (p.includes('docker')) setActiveView(AppView.DOCKER_AI);
        else if (p.includes('borsa')) setActiveView(AppView.BORSA);
        else if (p.includes('geliştirici')) setActiveView(AppView.LIVE_EDITOR);
        else if (p.includes('kripto')) setActiveView(AppView.CRYPTO);
        else if (p.includes('otomasyon')) setActiveView(AppView.AUTOMATION);
        else if (p.includes('sosyal')) setActiveView(AppView.SOCIAL_MEDIA);
        else if (p.includes('google')) setActiveView(AppView.GOOGLE_APPS);
        else if (p.includes('entegrasyon')) setActiveView(AppView.INTEGRATIONS);
        else if (p.includes('güvenlik')) setActiveView(AppView.SECURITY);
        else if (p.includes('prompt')) setActiveView(AppView.PROMPTS);
        else if (p.includes('analitik')) setActiveView(AppView.ANALYTICS);
        else if (p.includes('görev')) setActiveView(AppView.REQUESTS);
        else if (p.includes('galeri')) setActiveView(AppView.GALLERY);
        else if (p.includes('sahne') || p.includes('3d')) setActiveView(AppView.CREATIVE);
        else if (p.includes('sistem')) setActiveView(AppView.SYSTEM);
        else if (p.includes('ayarlar')) setActiveView(AppView.SETTINGS);
        else {
          const targetView = Object.values(AppView).find(v => p.includes(v.toLowerCase()));
          if (targetView) setActiveView(targetView as AppView);
        }
        break;
      }
    }
  };

  const startVoiceRecognition = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'tr-TR';
      recognition.onstart = () => setIsListening(true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        handleSendMessage(transcript);
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognition.start();
    } else {
      alert("Tarayıcınız ses tanımayı desteklemiyor.");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-[100dvh] w-full bg-brandDark overflow-hidden text-gray-100 font-sans selection:bg-primary/30">
      <Navigation
        activeView={activeView}
        onViewChange={setActiveView}
        syncStatus={syncStatus}
        onManualSync={performGitHubSync}
      />
      <main className="flex-1 flex flex-col relative overflow-hidden h-full ml-0 lg:ml-64 transition-all duration-300">
        {activeView === AppView.HOME && <HomeView onViewChange={setActiveView} />}
        {activeView === AppView.TOOLS && <ToolsView onViewChange={setActiveView} />}
        {activeView === AppView.CREATIVE && <CreativeView />}
        {activeView === AppView.DASHBOARD && <Dashboard onViewChange={setActiveView} />}
        {activeView === AppView.CHAT && <ChatView messages={chatMessages} setMessages={setChatMessages} onSendMessage={handleSendMessage} isTyping={isTyping} activeModelInfo={activeModelInfo} />}
        {activeView === AppView.VISUALS && <VisualsView />}
        {activeView === AppView.AUDIO && <AudioView />}
        {activeView === AppView.LIVE && <LiveView />}
        {activeView === AppView.MUSIC && <MusicView />}
        {activeView === AppView.GALLERY && <GalleryView />}
        {activeView === AppView.BUILDER && <BuilderView />}
        {activeView === AppView.WORKFLOW && <WorkflowView />}
        {activeView === AppView.CRYPTO && <CryptoView />}
        {activeView === AppView.REQUESTS && <RequestView />}
        {activeView === AppView.SYSTEM && <SystemView />}
        {activeView === AppView.AUTOMATION && <AutomationView />}
        {activeView === AppView.PROMPTS && <PromptLibraryView />}
        {activeView === AppView.ANALYTICS && <AnalyticsView />}
        {activeView === AppView.GOOGLE_APPS && <GoogleAppsView />}
        {activeView === AppView.DOCKER_AI && <DockerConfigView />}
        {activeView === AppView.SETTINGS && <SettingsView onSyncNow={performGitHubSync} />}
        {activeView === AppView.LIVE_EDITOR && <LiveEditorView />}
        {activeView === AppView.JULES_STUDIO && <JulesStudioView />}
        {activeView === AppView.ART_STUDIO && <ArtStudioView />}
        {activeView === AppView.GAME_DEV && <GameDevView />}
        {activeView === AppView.SECURITY && <SecurityCenterView />}
        {activeView === AppView.INTEGRATIONS && <IntegrationsHubView />}
        {activeView === AppView.SOCIAL_MEDIA && <SocialMediaManagerView />}
        {activeView === AppView.BORSA && <BorsaView />}
        {activeView === AppView.ANDROID && <AndroidStudioView />}

        {dynamicModules.map((mod) => activeView === mod.id && (
          <div key={mod.id} className="p-8 bg-brandDark h-full overflow-y-auto">
            <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
              <header className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">{mod.name}</h1>
                  <p className="text-slate-500 text-sm font-bold tracking-widest uppercase">AI Üretimi Modül</p>
                </div>
                <button
                  onClick={() => {
                    const filtered = dynamicModules.filter(m => m.id !== mod.id);
                    localStorage.setItem('dynamic_modules', JSON.stringify(filtered));
                    loadDynamicModules();
                    setActiveView(AppView.HOME);
                  }}
                  className="px-4 py-2 bg-red-500/10 text-red-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500/20 transition-all border border-red-500/20"
                >
                  MODÜLÜ KALDIR
                </button>
              </header>
              <div className="glass-panel p-10 rounded-[40px] border border-primary/20 bg-primary/5 shadow-2xl">
                 <p className="text-white font-bold mb-8 italic">{mod.description}</p>
                 <div className="bg-black/40 rounded-3xl p-8 border border-white/5 font-mono text-[11px] text-primary/80 overflow-auto max-h-[500px]">
                    <pre className="whitespace-pre-wrap">{mod.code}</pre>
                 </div>
                 <div className="mt-8 p-6 bg-yellow-500/10 border border-yellow-500/20 rounded-3xl">
                    <p className="text-[10px] text-yellow-500 font-bold uppercase tracking-widest text-center mb-4">
                       Simülasyon Modu: Gerçek zamanlı çalışma için portalın ana kaynak koduna derlenmesi gerekmektedir.
                    </p>
                    <button
                      onClick={() => navigator.clipboard.writeText(mod.code)}
                      className="w-full py-3 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border border-yellow-500/20"
                    >
                       KODU KOPYALA VE JULES'E GÖNDER
                    </button>
                 </div>
              </div>
            </div>
          </div>
        ))}
      </main>

      <VoiceAssistant onCommand={handleVoiceCommand} />

      {/* Global Quick Chat Widget */}
      <div className="fixed bottom-20 right-6 lg:bottom-6 lg:right-6 w-80 z-[60]" id="quick-chat">
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className={`ml-auto flex items-center justify-center w-14 h-14 rounded-full shadow-2xl transition-all duration-300 ${
            isChatOpen ? 'bg-surface text-primary rotate-90 border border-white/10' : 'bg-primary text-white hover:scale-110'
          }`}
        >
          {isChatOpen ? <i className="fa-solid fa-xmark text-xl"></i> : <i className="fa-solid fa-comment-dots text-xl"></i>}
        </button>

        {isChatOpen && (
          <div className="absolute bottom-20 right-0 w-80 bg-surface border border-white/10 rounded-custom shadow-2xl flex flex-col overflow-hidden max-h-[500px] animate-in slide-in-from-bottom-8 fade-in duration-300">
            <div className="p-4 bg-primary/10 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-bold text-xs uppercase tracking-wider">Hızlı Sohbet</span>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="text-gray-500 hover:text-white transition-colors">
                <i className="fa-solid fa-xmark text-sm"></i>
              </button>
            </div>

            <div className="flex-1 p-4 space-y-4 overflow-y-auto min-h-[300px] scrollbar-hide bg-brandDark/30">
              {chatMessages.map((msg) => (
                <div key={msg.id} className={`flex flex-col gap-1 ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-in slide-in-from-bottom-2`}>
                   <span className={`text-[9px] font-bold uppercase ${msg.role === 'user' ? 'text-gray-500 mr-1' : 'text-primary ml-1'}`}>
                    {msg.role === 'user' ? 'Sen' : 'Asistan'}
                  </span>
                  <div className={`p-3 rounded-xl text-xs max-w-[90%] shadow-sm ${
                    msg.role === 'user' ? 'bg-primary text-white rounded-tr-none' : 'bg-white/5 text-gray-200 border border-white/5 rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/5 rounded-full px-3 py-1 border border-white/5 flex gap-1 items-center">
                    <div className="w-1 h-1 bg-primary rounded-full animate-bounce"></div>
                    <div className="w-1 h-1 bg-primary rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-1 h-1 bg-primary rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {isListening && (
              <div className="px-4 py-2 flex items-center justify-center gap-1 bg-primary/5 border-t border-white/5">
                <span className="text-[9px] text-primary font-bold uppercase mr-2 animate-pulse font-mono">Dinleniyor...</span>
                <div className="flex items-center gap-0.5 h-3">
                  <div className="w-0.5 bg-primary animate-music-bar-1"></div>
                  <div className="w-0.5 bg-primary animate-music-bar-2"></div>
                  <div className="w-0.5 bg-primary animate-music-bar-3"></div>
                </div>
              </div>
            )}

            <form onSubmit={(e) => {
                e.preventDefault();
                const input = (e.currentTarget.elements.namedItem('chatInput') as HTMLInputElement);
                handleSendMessage(input.value);
                input.value = '';
              }} className="p-4 border-t border-white/5 bg-surface">
              <div className="flex gap-2">
                <input
                  name="chatInput"
                  autoComplete="off"
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs focus:border-primary outline-none transition-all placeholder:text-gray-600 text-white"
                  placeholder="Komut yazın..."
                  type="text"
                />
                <button type="button" onClick={startVoiceRecognition} className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all ${isListening ? 'bg-primary/20 text-primary' : 'bg-white/5 text-gray-500 hover:text-primary'}`}>
                   <i className="fa-solid fa-microphone text-xs"></i>
                </button>
                <button type="submit" className="w-10 h-10 flex items-center justify-center bg-primary text-white rounded-xl transition-all active:scale-90">
                   <i className="fa-solid fa-paper-plane text-xs"></i>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
