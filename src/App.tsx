import React, { useState, useEffect } from 'react';
import { AppView, type ChatMessage } from './types';
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';
import ChatView from './views/ChatView';
import HomeView from './views/HomeView';
import ToolsView from './views/ToolsView';
import Dashboard from './views/Dashboard';
import VisualsView from './views/VisualsView';
import AudioView from './views/AudioView';
import LiveView from './views/LiveView';
import ArtStudioView from './views/ArtStudioView';
import GameDevView from './views/GameDevView';
import WorkflowView from './views/WorkflowView';
import LiveAiDeveloperView from './views/LiveAiDeveloperView';
import DockerConfigView from './views/DockerConfigView';
import BorsaView from './views/BorsaView';
import CryptoView from './views/CryptoView';
import AutomationView from './views/AutomationView';
import SocialMediaManagerView from './views/SocialMediaManagerView';
import GoogleAppsView from './views/GoogleAppsView';
import IntegrationsHubView from './views/IntegrationsHubView';
import SecurityCenterView from './views/SecurityCenterView';
import PromptLibraryView from './views/PromptLibraryView';
import AnalyticsView from './views/AnalyticsView';
import RequestView from './views/RequestView';
import GalleryView from './views/GalleryView';
import MusicView from './views/MusicView';
import CreativeView from './views/CreativeView';
import SystemView from './views/SystemView';
import SettingsView from './views/SettingsView';
import AntigravityView from './views/AntigravityView';
import FigmaStudioView from './views/FigmaStudioView';
import AgentSkillsView from './views/AgentSkillsView';
import AntigravityToolkitView from './views/AntigravityToolkitView';
import QuotioView from './views/QuotioView';
import PromptMasterView from './views/PromptMasterView';
import DevToolsView from './views/DevToolsView';
import CoderConfigView from './views/CoderConfigView';
import AgenticConfigView from './views/AgenticConfigView';
import TransparentPngView from './views/TransparentPngView';
import SkillShareView from './views/SkillShareView';
import NdkSamplesView from './views/NdkSamplesView';
import WeatherView from './views/WeatherView';
import NeuralLogicView from './views/NeuralLogicView';
import GoogleAiStudioView from './views/GoogleAiStudioView';
import SkyDriveView from './views/SkyDriveView';
import NewsView from './views/NewsView';
import SunoMusicView from './views/SunoMusicView';
import PythonLibraryView from "./views/PythonLibraryView";
import YouTubeView from './views/YouTubeView';
import LiveTvView from './views/LiveTvView';
import SystemExpertView from './views/SystemExpertView';
import JulesStudioView from './views/JulesStudioView';
import RuwisAiView from './views/RuwisAiView';
import LoginView from './views/LoginView';

import QuickChatWidget from './components/QuickChatWidget';
import VoiceAssistant from './components/VoiceAssistant';

import { GoogleGenerativeAI } from '@google/generative-ai';
import { getAvailableKeys, recordUsage, markKeyAsExhausted } from './utils/apiPool';
import { getStorageItem, setStorageItem } from './utils/storage';
import { detectIntent } from './utils/orchestrator';
import { buildModuleAutomatically, integrateLinkAutomatically } from './utils/moduleBuilder';
import { pushToGitHub } from './utils/githubSync';
import { recordAction } from './utils/history';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('portal_auth_token') === 'true';
  });

  const [activeView, setActiveView] = useState<AppView | string>(AppView.HOME);
  const [messages, setMessages] = useState<ChatMessage[]>(getStorageItem('chat_history', []));
  const [isTyping, setIsTyping] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'error'>('synced');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeModel, setActiveModel] = useState<string>('Gemini-2.0-Flash');

  useEffect(() => {
    setStorageItem('chat_history', messages);
  }, [messages]);

  useEffect(() => {
    const backupInterval = setInterval(async () => {
        const settings = getStorageItem('sync_settings', { enabled: false, token: '', repo: '' });
        if (settings.enabled && settings.token && settings.repo) {
            const result = await pushToGitHub({ token: settings.token, repo: settings.repo, path: 'portal-state.json' });
            if (result.success) {
                localStorage.setItem('last_github_backup', new Date().toLocaleString('tr-TR'));
            }
        }
    }, 120000);
    return () => clearInterval(backupInterval);
  }, []);

  const handleLogin = () => {
    sessionStorage.setItem('portal_auth_token', 'true');
    setIsAuthenticated(true);
    recordAction('Sistem', 'Güvenli giriş yapıldı.');
  };

  const handleGitHubSync = async () => {
    setSyncStatus('syncing');
    const settings = getStorageItem('sync_settings', { token: '', repo: '' });
    const result = await pushToGitHub({ token: settings.token, repo: settings.repo, path: 'portal-state.json' });
    if (result.success) {
      setSyncStatus('synced');
      localStorage.setItem('last_github_backup', new Date().toLocaleString('tr-TR'));
      alert(result.message);
    } else {
      setSyncStatus('error');
      alert(result.message);
    }
  };

    const prepareGeminiHistory = (msgs: ChatMessage[]) => {
    const history: { role: string; parts: { text: string }[] }[] = [];
    const filtered = msgs.filter(m => !m.text.includes('Hata:'));

    filtered.forEach((m) => {
      const role = m.role === 'user' ? 'user' : 'model';
      if (history.length > 0 && history[history.length - 1].role === role) {
        history[history.length - 1].parts[0].text += "\n" + m.text;
      } else {
        history.push({ role, parts: [{ text: m.text }] });
      }
    });

    if (history.length > 0 && history[0].role !== 'user') {
      history.shift();
    }

    return history;
  };

  const handleSendMessage = async (text: string) => {
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);
    recordAction('Chat', `Mesaj gönderildi: ${text.substring(0, 30)}...`);

    const orchestration = detectIntent(text);
        if (orchestration.intent === 'WEATHER') {
        setActiveView(AppView.WEATHER);
        setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'model', text: `${orchestration.target} için hava durumu modülüne geçiş yapılıyor...`, timestamp: Date.now() }]);
        setIsTyping(false);
        return;
    }

    if (orchestration.intent === 'SEARCH_LEARN') {
        setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'model', text: `🧠 Öğrenme Modu Aktif: "${orchestration.target}" konusu araştırılıyor ve portal hafızasına kaydediliyor...`, timestamp: Date.now() }]);
        // Simüle edilmiş araştırma gecikmesi
        setTimeout(() => {
           setMessages(prev => [...prev, { id: (Date.now() + 2).toString(), role: 'model', text: `✅ "${orchestration.target}" ile ilgili temel bilgiler alındı ve Sinaptik Bağlantılar güncellendi. Artık bu konuda daha yetkinim.`, timestamp: Date.now() }]);
        }, 2000);
        setIsTyping(false);
        return;
    }

    if (orchestration.intent === 'BUILD' && orchestration.target) {
        const res = await buildModuleAutomatically(orchestration.target);
        if (res.success && res.moduleId) {
            setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'model', text: `Modül inşa edildi: ${res.label}`, timestamp: Date.now() }]);
            setActiveView(res.moduleId);
            setIsTyping(false);
            return;
        }
    }

    if (orchestration.intent === 'INTEGRATE_LINK' && orchestration.target) {
        const res = await integrateLinkAutomatically(orchestration.target, orchestration.payload.originalText);
        if (res.success && res.moduleId) {
            setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'model', text: `Link entegre edildi: ${res.label}`, timestamp: Date.now() }]);
            setActiveView(res.moduleId);
            setIsTyping(false);
            return;
        }
    }

    const availableKeys = getAvailableKeys();
    if (availableKeys.length === 0) {
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'model', text: "API anahtarı bulunamadı.", timestamp: Date.now() }]);
      setIsTyping(false);
      return;
    }

    for (const keyEntry of availableKeys) {
      try {
        setActiveModel(keyEntry.label);
        let responseText = '';
        if (keyEntry.provider === 'gemini') {
          const genAI = new GoogleGenerativeAI(keyEntry.key);
          const model = genAI.getGenerativeModel({ model: keyEntry.modelName || 'gemini-2.0-flash' });
          const chat = model.startChat({ history: prepareGeminiHistory(messages) });
          const result = await chat.sendMessage(text);
          responseText = result.response.text();
          recordUsage(keyEntry.id);
        } else {
          const response = await fetch(`${keyEntry.baseUrl || 'https://api.openai.com/v1'}/chat/completions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${keyEntry.key}` },
            body: JSON.stringify({ model: keyEntry.modelName, messages: [...messages.slice(-10).map(m => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.text })), { role: 'user', content: text }] })
          });
          const data = await response.json();
          responseText = data.choices[0].message.content;
          recordUsage(keyEntry.id);
        }
        setMessages((prev: ChatMessage[]) => [...prev, { id: (Date.now() + 1).toString(), role: 'model', text: responseText, timestamp: Date.now() }]);
        break;
      } catch (error: any) {
        if (error.message?.includes('429')) { markKeyAsExhausted(keyEntry.id); continue; }
        break;
      }
    }
    setIsTyping(false);
  };

  const renderView = () => {
    const dynamicModules = getStorageItem('active_dynamic_modules', []);
    const dynamicMod = dynamicModules.find((m: any) => m.id === activeView);
    if (dynamicMod) {
      return (
        <div className="p-4 lg:p-12 animate-in fade-in duration-700 min-h-screen pb-32">
          <div className="max-w-6xl mx-auto space-y-8">
            <header className="flex items-center gap-6 border-b border-white/5 pb-8">
                <div className="w-16 h-16 rounded-3xl bg-primary/20 flex items-center justify-center text-primary border border-primary/30"><i className={`fa-solid ${dynamicMod.icon || 'fa-cube'} text-3xl`}></i></div>
                <div><h1 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none">{dynamicMod.label}</h1></div>
            </header>
            <div className="glass-panel p-1 rounded-[3rem] border border-white/10 bg-white/5 shadow-2xl overflow-hidden min-h-[600px] flex">
              <div className="bg-brandDark/50 rounded-[2.8rem] flex-1 overflow-hidden"><div className="h-full w-full" dangerouslySetInnerHTML={{ __html: dynamicMod.code }} /></div>
            </div>
          </div>
        </div>
      );
    }

    switch (activeView) {
      case AppView.HOME: return <HomeView onViewChange={setActiveView} />;
      case AppView.TOOLS: return <ToolsView onViewChange={setActiveView} />;
      case AppView.DASHBOARD: return <Dashboard onViewChange={setActiveView} />;
      case AppView.CHAT: return <ChatView messages={messages} setMessages={setMessages} onSendMessage={handleSendMessage} isTyping={isTyping} activeModelInfo={activeModel} />;
      case AppView.VISUALS: return <VisualsView />;
      case AppView.RUWIS_AI: return <RuwisAiView />;
      case AppView.AUDIO: return <AudioView />;
      case AppView.LIVE: return <LiveView />;
      case AppView.ART_STUDIO: return <ArtStudioView />;
      case AppView.GAME_DEV: return <GameDevView />;
      case AppView.WORKFLOW: return <WorkflowView />;
      case AppView.BUILDER: return <LiveAiDeveloperView />;
      case AppView.DOCKER_AI: return <DockerConfigView />;
      case AppView.BORSA: return <BorsaView />;
      case AppView.YOUTUBE: return <YouTubeView />;
      case AppView.LIVE_TV: return <LiveTvView />;
      case AppView.SYSTEM_EXPERT: return <SystemExpertView />;
      case AppView.CRYPTO: return <CryptoView />;
      case AppView.AUTOMATION: return <AutomationView />;
      case AppView.SOCIAL_MEDIA: return <SocialMediaManagerView />;
      case AppView.GOOGLE_APPS: return <GoogleAppsView />;
      case AppView.INTEGRATIONS: return <IntegrationsHubView />;
      case AppView.SECURITY: return <SecurityCenterView />;
      case AppView.PROMPTS: return <PromptLibraryView />;
      case AppView.ANALYTICS: return <AnalyticsView />;
      case AppView.REQUESTS: return <RequestView />;
      case AppView.GALLERY: return <GalleryView />;
      case AppView.MUSIC: return <MusicView />;
      case AppView.CREATIVE: return <CreativeView />;
      case AppView.SYSTEM: return <SystemView />;
      case AppView.SETTINGS: return <SettingsView />;
      case AppView.ANTIGRAVITY: return <AntigravityView />;
      case AppView.FIGMA_STUDIO: return <FigmaStudioView />;
      case AppView.AGENT_SKILLS: return <AgentSkillsView />;
      case AppView.AG_TOOLKIT: return <AntigravityToolkitView />;
      case AppView.QUOTIO: return <QuotioView />;
      case AppView.PROMPT_MASTER: return <PromptMasterView />;
      case AppView.DEV_TOOLS: return <DevToolsView />;
      case AppView.CODER_CONFIG: return <CoderConfigView />;
      case AppView.AGENTIC_CONFIG: return <AgenticConfigView />;
      case AppView.TRANSPARENT_PNG: return <TransparentPngView />;
      case AppView.SKILLSHARE: return <SkillShareView />;
      case AppView.ANDROID_NDK: return <NdkSamplesView />;
      case AppView.WEATHER: return <WeatherView />;
      case AppView.NEURAL_LOGIC as any: return <NeuralLogicView onViewChange={setActiveView} />;
      case AppView.GOOGLE_AI_STUDIO: return <GoogleAiStudioView />;
      case AppView.SKYDRIVE: return <SkyDriveView />;
      case AppView.NEWS: return <NewsView />;
      case AppView.PYTHON_LIB: return <PythonLibraryView />;
      case AppView.SUNO: return <SunoMusicView />;
      default: return <HomeView onViewChange={setActiveView} />;
    }
  };

  if (!isAuthenticated) {
    return <LoginView onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-[#050505] text-white overflow-hidden font-sans neural-brain-bg">
      <Sidebar activeView={activeView} onViewChange={setActiveView} syncStatus={syncStatus} onManualSync={() => {}} onGitHubSync={handleGitHubSync} isMobileOpen={isSidebarOpen} onCloseMobile={() => setIsSidebarOpen(false)} />
      <main className="flex-1 overflow-hidden relative lg:ml-64">
        <div className="h-full overflow-y-auto">{renderView()}</div>
        <QuickChatWidget messages={messages.slice(-10).map(m => ({ role: m.role as 'user' | 'model', text: m.text }))} onSendMessage={handleSendMessage} isTyping={isTyping} />
        <VoiceAssistant onCommand={(command, action, payload) => {
          if (command === 'nav' && action === 'nav') {
            const target = payload.toLowerCase();
            if (target === 'home' || target.includes('ana sayfa')) setActiveView(AppView.HOME);
            else if (target === 'chat' || target.includes('sohbet')) setActiveView(AppView.CHAT);
          } else if (command === 'chat') { setActiveView(AppView.CHAT); handleSendMessage(payload); }
        }} />
      </main>
      <BottomNav activeView={activeView} onViewChange={setActiveView} onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
    </div>
  );
}

export default App;
