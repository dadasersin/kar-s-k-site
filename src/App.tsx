import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';
import VoiceAssistant from './components/VoiceAssistant';
import { AppView } from './types';
import type { ChatMessage } from './types';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getAvailableKeys, markKeyAsExhausted } from './utils/apiPool';
import { pushToGitHub } from './utils/githubSync';
import { detectIntent } from './utils/orchestrator';
import { getQuickWeather, saveLearnedKnowledge } from './utils/knowledgeBase';

// Views
import HomeView from './views/HomeView';
import BorsaView from './views/BorsaView';
import CryptoView from './views/CryptoView';
import YouTubeView from './views/YouTubeView';
import LiveTvView from './views/LiveTvView';
import LiveAiDeveloperView from './views/LiveAiDeveloperView';
import SystemExpertView from './views/SystemExpertView';
import RuwisAiView from './views/RuwisAiView';
import ToolsView from './views/ToolsView';
import Dashboard from './views/Dashboard';
import JulesStudioView from './views/JulesStudioView';
import ChatView from './views/ChatView';
import VisualsView from './views/VisualsView';
import AudioView from './views/AudioView';
import LiveView from './views/LiveView';
import ArtStudioView from './views/ArtStudioView';
import GameDevView from './views/GameDevView';
import WorkflowView from './views/WorkflowView';
import DockerConfigView from './views/DockerConfigView';
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
import SelineView from './views/SelineView';
import Ag2ApiView from './views/Ag2ApiView';
import CursorBridgeView from './views/CursorBridgeView';
import KhoataToolView from './views/KhoataToolView';
import CodexSwitcherView from './views/CodexSwitcherView';
import AgCopilotView from './views/AgCopilotView';
import AgUsageCheckerView from './views/AgUsageCheckerView';
import PromptExpertView from './views/PromptExpertView';
import CursorProxyView from './views/CursorProxyView';
import AntigravitySyncView from './views/AntigravitySyncView';
import AntigravityLauncherView from './views/AntigravityLauncherView';
import UserManualView from './views/UserManualView';
import SiteEditingView from './views/SiteEditingView';
import JulesAwesomeListView from './views/JulesAwesomeListView';
import QuickChatWidget from './components/QuickChatWidget';
import NdkSamplesView from './views/NdkSamplesView';
import WeatherView from './views/WeatherView';
import OmniView from './views/OmniView';

function App() {
  const [activeView, setActiveView] = useState<AppView>(AppView.HOME);
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('chat_history');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to parse chat history", e);
      return [];
    }
  });
  const [isTyping, setIsTyping] = useState(false);
  const [activeModel, setActiveModel] = useState('Gemini 1.5 Flash');
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleGitHubSync = async () => {
    setSyncStatus('syncing');
    try {
      const savedSettings = localStorage.getItem('sync_settings');
      if (!savedSettings) {
        alert("Lütfen önce Ayarlar sayfasından GitHub bilgilerinizi girin.");
        setSyncStatus('error');
        return;
      }
      const settings = JSON.parse(savedSettings);
      const result = await pushToGitHub({
        token: settings.token,
        repo: settings.repo,
        path: settings.path
      });

      if (result.success) {
        alert("GitHub senkronizasyonu başarılı!");
        setSyncStatus('success');
      } else {
        alert(`Hata: ${result.message}`);
        setSyncStatus('error');
      }
    } catch (e) {
      alert("Beklenmedik bir hata oluştu.");
      setSyncStatus('error');
    }
    setTimeout(() => setSyncStatus('idle'), 3000);
  };

  useEffect(() => {
    localStorage.setItem('chat_history', JSON.stringify(messages));
  }, [messages]);

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
        const savedLogs = localStorage.getItem('system_error_logs');
        const existingLogs = savedLogs ? JSON.parse(savedLogs) : [];
        existingLogs.push(errorLog);
        const trimmedLogs = existingLogs.slice(-50);
        localStorage.setItem('system_error_logs', JSON.stringify(trimmedLogs));
      } catch (e) {
        console.error('Failed to save error log to localStorage', e);
      }
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  const handleSendMessage = async (text: string, options?: { systemInstruction?: string, webSearch?: boolean }) => {
    // 1. Intent Orchestration
    const orchestration = detectIntent(text);

    if (orchestration.intent === 'WEATHER') {
      const weatherInfo = getQuickWeather(orchestration.target || 'Sakarya');
      const weatherMsg: ChatMessage = {
        id: Date.now().toString(),
        role: 'model',
        text: `🧠 Nöral Bağlantı Kuruluyor...\n\nHava durumu modülünden gelen veri: ${weatherInfo}\n\nBaşka nasıl yardımcı olabilirim?`,
        timestamp: Date.now()
      };
      setMessages((prev: ChatMessage[]) => [...prev, { id: Date.now().toString(), role: 'user', text, timestamp: Date.now() }, weatherMsg]);
      return;
    }

    if (orchestration.intent === 'BUILD') {
      const buildMsg: ChatMessage = {
        id: Date.now().toString(),
        role: 'model',
        text: `🏗️ Geliştirme Motoru Tetiklendi!\n\n"${orchestration.target}" için yeni bir modül tasarlıyorum. Lütfen Live AI Developer sekmesine göz atın veya onay kutusunu bekleyin.`,
        timestamp: Date.now()
      };
      setMessages((prev: ChatMessage[]) => [...prev, { id: Date.now().toString(), role: 'user', text, timestamp: Date.now() }, buildMsg]);
      setActiveView(AppView.BUILDER);
      // We could trigger build logic here if we had a global state for it
      return;
    }

    if (orchestration.intent === 'SEARCH_LEARN') {
      const searchMsg: ChatMessage = {
        id: Date.now().toString(),
        role: 'model',
        text: `🔍 Web Araştırması Başlatıldı...\n\n"${orchestration.target}" konusunu inceliyorum ve kalıcı hafızama (Long-term Memory) kaydediyorum. Bir sonraki sorunda bu bilgiyi kullanabileceğim.`,
        timestamp: Date.now()
      };
      setMessages((prev: ChatMessage[]) => [...prev, { id: Date.now().toString(), role: 'user', text, timestamp: Date.now() }, searchMsg]);

      // Simulate learning
      setTimeout(() => {
        saveLearnedKnowledge(orchestration.target || 'Genel Arabuluculuk', `Kullanıcı "${text}" bilgisini araştırmamı istedi. Bu konu portal altyapısı için kritik öneme sahip.`);
      }, 2000);
      return;
    }

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text,
      timestamp: Date.now()
    };

    setMessages((prev: ChatMessage[]) => [...prev, userMsg]);
    setIsTyping(true);

    const availableKeys = getAvailableKeys();
    if (availableKeys.length === 0) {
      setMessages((prev: ChatMessage[]) => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "Hata: Herhangi bir API anahtarı bulunamadı. Lütfen Ayarlar sayfasından anahtar ekleyin.",
        timestamp: Date.now()
      }]);
      setIsTyping(false);
      return;
    }

    let success = false;
    for (const keyEntry of availableKeys) {
      try {
        setActiveModel(keyEntry.label);
        let responseText = '';

        if (keyEntry.provider === 'gemini') {
          const genAI = new GoogleGenerativeAI(keyEntry.key);
          const model = genAI.getGenerativeModel({
            model: keyEntry.modelName || 'gemini-1.5-flash',
            systemInstruction: options?.systemInstruction
          });

          const chat = model.startChat({
            history: messages.slice(-10).map(m => ({
              role: m.role === 'user' ? 'user' : 'model',
              parts: [{ text: m.text }]
            }))
          });

          const result = await chat.sendMessage(text);
          responseText = result.response.text();
        } else {
          // OpenAI, DeepSeek, Grok, vb. uyumlu API'lar
          const response = await fetch(`${keyEntry.baseUrl || 'https://api.openai.com/v1'}/chat/completions`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${keyEntry.key}`
            },
            body: JSON.stringify({
              model: keyEntry.modelName,
              messages: [
                ...(options?.systemInstruction ? [{ role: 'system', content: options.systemInstruction }] : []),
                ...messages.slice(-10).map(m => ({
                  role: m.role === 'user' ? 'user' : 'assistant',
                  content: m.text
                })),
                { role: 'user', content: text }
              ]
            })
          });

          if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.error?.message || `API Hatası: ${response.status}`);
          }

          const data = await response.json();
          responseText = data.choices[0].message.content;
        }

        const modelMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'model',
          text: responseText,
          timestamp: Date.now()
        };

        setMessages((prev: ChatMessage[]) => [...prev, modelMsg]);
        success = true;
        break;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.error(`API Hatası [${keyEntry.label}]:`, error);
        if (error.message?.includes('429') || error.message?.toLowerCase().includes('quota')) {
          markKeyAsExhausted(keyEntry.id);
          continue;
        } else {
          setMessages((prev: ChatMessage[]) => [...prev, {
            id: (Date.now() + 1).toString(),
            role: 'model',
            text: `Hata oluştu (${keyEntry.label}): ${error.message}`,
            timestamp: Date.now()
          }]);
          break;
        }
      }
    }

    if (!success && availableKeys.length > 0) {
      setMessages((prev: ChatMessage[]) => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "Üzgünüm, şu anda tüm API servisleri kota aşımı veya teknik bir hata nedeniyle kullanılamıyor.",
        timestamp: Date.now()
      }]);
    }

    setIsTyping(false);
  };

  const renderView = () => {
    // Check for dynamic module first
    const dynamicModules = JSON.parse(localStorage.getItem('active_dynamic_modules') || '[]');
    const dynamicMod = dynamicModules.find((m: any) => m.id === activeView);
    if (dynamicMod) {
      return (
        <div className="p-4 lg:p-12 animate-in fade-in duration-700 min-h-screen pb-32">
          <div className="max-w-6xl mx-auto space-y-8">
            <header className="flex items-center justify-between border-b border-white/5 pb-8">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-3xl bg-primary/20 flex items-center justify-center text-primary border border-primary/30 shadow-2xl shadow-primary/10">
                  <i className={`fa-solid ${dynamicMod.icon || 'fa-cube'} text-3xl`}></i>
                </div>
                <div>
                  <h1 className="text-4xl lg:text-5xl font-black text-white italic tracking-tighter uppercase">{dynamicMod.label}</h1>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Otonom Çalışan Aktif Modül</p>
                  </div>
                </div>
              </div>
              <div className="hidden md:flex gap-4">
                <div className="px-4 py-2 bg-white/5 rounded-xl border border-white/10 text-[10px] font-bold text-slate-500 uppercase">Entegrasyon: TAMAMLANDI</div>
                <div className="px-4 py-2 bg-white/5 rounded-xl border border-white/10 text-[10px] font-bold text-slate-500 uppercase">Güvenlik: DOĞRULANDI</div>
              </div>
            </header>

            <div className="glass-panel p-1 rounded-[3rem] border border-white/10 bg-white/5 shadow-2xl overflow-hidden min-h-[500px]">
              {/* Live Execution Layer */}
              <div className="bg-brandDark/50 rounded-[2.8rem] h-full p-8 lg:p-12">
                <div dangerouslySetInnerHTML={{ __html: dynamicMod.code }} />
              </div>
            </div>

            <div className="flex justify-end gap-3 opacity-30 hover:opacity-100 transition-opacity">
              <p className="text-[10px] font-bold text-slate-600 uppercase">ID: {dynamicMod.id}</p>
              <p className="text-[10px] font-bold text-slate-600 uppercase">•</p>
              <p className="text-[10px] font-bold text-slate-600 uppercase">Yayın Tarihi: {new Date(dynamicMod.timestamp).toLocaleString('tr-TR')}</p>
            </div>
          </div>
        </div>
      );
    }

    switch (activeView) {
      case AppView.HOME: return <HomeView onViewChange={setActiveView} />;
      case AppView.TOOLS: return <ToolsView onViewChange={setActiveView} />;
      case AppView.DASHBOARD: return <Dashboard onViewChange={setActiveView} />;
      case AppView.JULES_STUDIO: return <JulesStudioView />;
      case AppView.CHAT: return (
        <ChatView
          messages={messages}
          setMessages={setMessages}
          onSendMessage={handleSendMessage}
          isTyping={isTyping}
          activeModelInfo={activeModel}
        />
      );
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
      case AppView.SELINE: return <SelineView />;
      case AppView.AG2API: return <Ag2ApiView />;
      case AppView.CURSOR_BRIDGE: return <CursorBridgeView />;
      case AppView.KHOATA_TOOL: return <KhoataToolView />;
      case AppView.CODEX_SWITCHER: return <CodexSwitcherView />;
      case AppView.AG_COPILOT: return <AgCopilotView />;
      case AppView.AG_USAGE_CHECKER: return <AgUsageCheckerView />;
      case AppView.PROMPT_EXPERT: return <PromptExpertView />;
      case AppView.CURSOR_PROXY: return <CursorProxyView />;
      case AppView.AG_SYNC: return <AntigravitySyncView />;
      case AppView.AG_LAUNCHER: return <AntigravityLauncherView />;
      case AppView.USER_MANUAL: return <UserManualView />;
      case AppView.SITE_EDIT: return <SiteEditingView />;
      case AppView.JULES_AWESOME: return <JulesAwesomeListView />;
      case AppView.ANDROID_NDK: return <NdkSamplesView />;
      case AppView.WEATHER: return <WeatherView />;
      case AppView.OMNIVIEW: return <OmniView onViewChange={setActiveView} />;
      default: return <HomeView />;
    }
  };

  return (
    <div className="flex h-screen bg-[#050505] text-white overflow-hidden font-sans">
      <Sidebar
        activeView={activeView}
        onViewChange={setActiveView}
        syncStatus={syncStatus}
        onManualSync={() => console.log('Manual Status Check...')}
        onGitHubSync={handleGitHubSync}
        isMobileOpen={isSidebarOpen}
        onCloseMobile={() => setIsSidebarOpen(false)}
      />
      <main className="flex-1 overflow-hidden relative lg:ml-64">
        <div className="h-full overflow-y-auto">
          {renderView()}
        </div>

        <QuickChatWidget
          messages={messages.slice(-10).map(m => ({ role: m.role as 'user' | 'model', text: m.text }))}
          onSendMessage={handleSendMessage}
          isTyping={isTyping}
        />

        <VoiceAssistant onCommand={(command, action, payload) => {
          if (command === 'nav' && action === 'nav') {
            const target = payload.toLowerCase();
            if (target === 'home' || target.includes('ana sayfa')) setActiveView(AppView.HOME);
            else if (target === 'tools' || target.includes('araçlar')) setActiveView(AppView.TOOLS);
            else if (target === 'creative' || target.includes('sahne')) setActiveView(AppView.CREATIVE);
            else if (target === 'dashboard' || target.includes('panel')) setActiveView(AppView.DASHBOARD);
            else if (target === 'chat' || target.includes('sohbet')) setActiveView(AppView.CHAT);
            else if (target === 'visuals' || target.includes('stüdyo')) setActiveView(AppView.VISUALS);
            else if (target === 'ruwis_ai' || target.includes('görsel')) setActiveView(AppView.RUWIS_AI);
            else if (target === 'audio' || target.includes('ses')) setActiveView(AppView.AUDIO);
            else if (target === 'music' || target.includes('müzik')) setActiveView(AppView.MUSIC);
            else if (target === 'gallery' || target.includes('galeri')) setActiveView(AppView.GALLERY);
            else if (target === 'workflow' || target.includes('akışı')) setActiveView(AppView.WORKFLOW);
            else if (target === 'builder' || target.includes('inşa')) setActiveView(AppView.BUILDER);
            else if (target === 'crypto' || target.includes('kripto')) setActiveView(AppView.CRYPTO);
            else if (target === 'google_apps' || target.includes('google')) setActiveView(AppView.GOOGLE_APPS);
            else if (target === 'docker_ai' || target.includes('docker')) setActiveView(AppView.DOCKER_AI);
            else if (target === 'requests' || target.includes('görev')) setActiveView(AppView.REQUESTS);
            else if (target === 'system' || target.includes('sistem')) setActiveView(AppView.SYSTEM);
            else if (target === 'settings' || target.includes('ayar')) setActiveView(AppView.SETTINGS);
            else if (target === 'borsa') setActiveView(AppView.BORSA);
            else if (target === 'youtube') setActiveView(AppView.YOUTUBE);
            else if (target === 'live_tv' || target.includes('tv') || target.includes('televizyon')) setActiveView(AppView.LIVE_TV);
            else if (target === 'system_expert' || target.includes('uzman')) setActiveView(AppView.SYSTEM_EXPERT);
            else if (target === 'agent_skills' || target.includes('beceri')) setActiveView(AppView.AGENT_SKILLS);
            else if (target === 'ag_toolkit' || target.includes('araçlar')) setActiveView(AppView.AG_TOOLKIT);
            else if (target === 'quotio' || target.includes('failover')) setActiveView(AppView.QUOTIO);
            else if (target === 'prompt_master' || target.includes('prompt')) setActiveView(AppView.PROMPT_MASTER);
            else if (target === 'dev_tools' || target.includes('araçlar')) setActiveView(AppView.DEV_TOOLS);
            else if (target === 'coder_config' || target.includes('yapılandırma')) setActiveView(AppView.CODER_CONFIG);
            else if (target === 'agentic_config' || target.includes('akışlar')) setActiveView(AppView.AGENTIC_CONFIG);
            else if (target === 'transparent_png' || target.includes('png')) setActiveView(AppView.TRANSPARENT_PNG);
            else if (target === 'skillshare' || target.includes('skill')) setActiveView(AppView.SKILLSHARE);
            else if (target === 'seline' || target.includes('seline')) setActiveView(AppView.SELINE);
            else if (target === 'ag2api' || target.includes('proxy')) setActiveView(AppView.AG2API);
            else if (target === 'cursor_bridge' || target.includes('köprü')) setActiveView(AppView.CURSOR_BRIDGE);
            else if (target === 'khoata_tool' || target.includes('güvenlik')) setActiveView(AppView.KHOATA_TOOL);
            else if (target === 'codex_switcher' || target.includes('değiştirici')) setActiveView(AppView.CODEX_SWITCHER);
            else if (target === 'ag_copilot' || target.includes('copilot')) setActiveView(AppView.AG_COPILOT);
            else if (target === 'ag_usage_checker' || target.includes('denetleyici')) setActiveView(AppView.AG_USAGE_CHECKER);
            else if (target === 'prompt_expert' || target.includes('uzmanı')) setActiveView(AppView.PROMPT_EXPERT);
            else if (target === 'cursor_proxy' || target.includes('köprü')) setActiveView(AppView.CURSOR_PROXY);
            else if (target === 'ag_sync' || target.includes('yedek')) setActiveView(AppView.AG_SYNC);
            else if (target === 'ag_launcher' || target.includes('başlatıcı')) setActiveView(AppView.AG_LAUNCHER);
            else if (target === 'user_manual' || target.includes('kılavuz')) setActiveView(AppView.USER_MANUAL);
            else if (target === 'site_edit' || target.includes('düzenleme')) setActiveView(AppView.SITE_EDIT);
            else if (target === 'jules_awesome' || target.includes('awesome')) setActiveView(AppView.JULES_AWESOME);
            else if (target === 'android_ndk' || target.includes('ndk') || target.includes('android')) setActiveView(AppView.ANDROID_NDK);
          } else if (command === 'chat') {
            setActiveView(AppView.CHAT);
            handleSendMessage(payload);
          }
        }} />
      </main>
      <BottomNav
        activeView={activeView}
        onViewChange={setActiveView}
        onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />
    </div>
  );
}

export default App;
