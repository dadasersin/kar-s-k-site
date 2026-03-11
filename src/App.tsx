import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';
import QuickChatWidget from './components/QuickChatWidget';
import VoiceAssistant from './components/VoiceAssistant';
import { AppView } from './types';
import type { ChatMessage } from './types';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getAvailableKeys, getAllKeys, recordUsage, markKeyAsExhausted } from './utils/apiPool';
import { pushToGitHub } from './utils/githubSync';
import { detectIntent } from './utils/orchestrator';
import { getStorageItem } from './utils/storage';
import { saveLearnedKnowledge, getQuickWeather } from './utils/knowledgeBase';
import { buildModuleAutomatically, integrateLinkAutomatically } from './utils/moduleBuilder';
import NewsView from './views/NewsView';

import OmniView from './views/OmniView';

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
import NdkSamplesView from './views/NdkSamplesView';
import WeatherView from './views/WeatherView';
import NeuralLogicView from './views/NeuralLogicView';
import GoogleAiStudioView from './views/GoogleAiStudioView';
import SkyDriveView from './views/SkyDriveView';
import { createReasoningChain, updateNodeStatus, completeChain } from './utils/neuralLogic';

const prepareGeminiHistory = (msgs: ChatMessage[]) => {
  const filtered = msgs.filter(m => {
    const t = m.text.toLowerCase();
    const isError = t.startsWith("hata:") ||
      t.startsWith("hata oluştu") ||
      t.startsWith("üzgünüm,") ||
      t.includes("[googlegenerativeai error]") ||
      t.includes("api hatası") ||
      t.includes("kota aşımı");
    return !isError;
  });

  const history: { role: "user" | "model"; parts: { text: string }[] }[] = [];

  for (const m of filtered) {
    const role = m.role === "user" ? "user" : "model";
    if (history.length === 0) {
      if (role === "user") {
        history.push({ role, parts: [{ text: m.text }] });
      }
    } else {
      const prev = history[history.length - 1];
      if (prev.role === role) {
        prev.parts[0].text += "\n\n" + m.text;
      } else {
        history.push({ role, parts: [{ text: m.text }] });
      }
    }
  }

  if (history.length > 0 && history[history.length - 1].role === "user") {
    history.push({ role: "model", parts: [{ text: "Anladım, devam edebiliriz." }] });
  }

  return history;
};

function App() {
  const [activeView, setActiveView] = useState<AppView | string>(AppView.HOME);
  const [messages, setMessages] = useState<ChatMessage[]>(getStorageItem('chat_history', []));
  const [isTyping, setIsTyping] = useState(false);
  const [activeModel, setActiveModel] = useState<string>('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');

  const handleGitHubSync = async () => {
    const settings = getStorageItem('sync_settings', null);
    if (!settings || !settings.token || !settings.repo) {
      alert("Lütfen Ayarlar sayfasından GitHub bilgilerinizi yapılandırın.");
      setActiveView(AppView.SETTINGS);
      return;
    }

    setSyncStatus('syncing');
    try {
      const stateToSync = {
        chat_history: getStorageItem('chat_history', []),
        active_dynamic_modules: getStorageItem('active_dynamic_modules', []),
        prompt_library: getStorageItem('prompt_library', []),
        bist_favorites: getStorageItem('bist_favorites', []),
        crypto_watchlist: getStorageItem('crypto_watchlist', []),
        binance_config: getStorageItem('binance_config', {}),
        sync_settings: settings
      };

      const result = await pushToGitHub(
        settings.token,
        settings.repo,
        settings.path || 'nexus_backup.json',
        stateToSync,
        'Portal State Sync: ' + new Date().toLocaleString('tr-TR')
      );

      if (result.success) setSyncStatus('success');
      else setSyncStatus('error');
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
        const existingLogs = getStorageItem('system_error_logs', []);
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
    let learningMode = false;
    let customInstruction = options?.systemInstruction || "";

    const orchestration = detectIntent(text);

    if (text.toLowerCase().includes('site başlığını') && text.toLowerCase().includes('yap')) {
      const match = text.match(/site başlığını ["'‘“](.+)["'”’] (yap|olarak değiştir|güncelle)/i) ||
        text.match(/site başlığını (.+) (yap|olarak değiştir|güncelle)/i);
      if (match && match[1]) {
        localStorage.setItem('site_title', match[1]);
        const adminMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'model',
          text: `✅ Nexus Admin: Site başlığı başarıyla "${match[1]}" olarak güncellendi.`,
          timestamp: Date.now()
        };
        setMessages((prev: ChatMessage[]) => [...prev, { id: Date.now().toString(), role: 'user', text, timestamp: Date.now() }, adminMsg]);
        return;
      }
    }

    if (orchestration.intent === "BUILD") {
      const userMsg: ChatMessage = { id: Date.now().toString(), role: "user", text, timestamp: Date.now() };
      const buildingMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: "model", text: `🛠️ "${orchestration.target}" için otonom geliştirme süreci başlatıldı. Kaynaklar taranıyor ve kod sentezleniyor...`, timestamp: Date.now() + 1 };
      setMessages((prev: ChatMessage[]) => [...prev, userMsg, buildingMsg]);
      setIsTyping(true);
      const result = await buildModuleAutomatically(orchestration.target || text);
      if (result.success) {
        const successMsg: ChatMessage = { id: (Date.now() + 2).toString(), role: "model", text: `✅ İşlem Tamamlandı! "${result.label}" modülü başarıyla inşa edildi ve portala entegre edildi. Seni şimdi yeni sayfaya yönlendiriyorum.`, timestamp: Date.now() + 2 };
        setMessages((prev: ChatMessage[]) => [...prev, successMsg]);
        setTimeout(() => setActiveView(result.moduleId as any), 2500);
      } else {
        const errorMsg: ChatMessage = { id: (Date.now() + 2).toString(), role: "model", text: `❌ Hata: Modül oluşturulurken bir sorun oluştu: ${result.error}`, timestamp: Date.now() + 2 };
        setMessages((prev: ChatMessage[]) => [...prev, errorMsg]);
      }
      setIsTyping(false);
      return;
    }

    if (orchestration.intent === "INTEGRATE_LINK") {
      const userMsg: ChatMessage = { id: Date.now().toString(), role: "user", text, timestamp: Date.now() };
      const integratingMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: "model", text: `🔗 "${orchestration.target}" linki portalın yeni bir modülüne entegre ediliyor. Lütfen bekleyin...`, timestamp: Date.now() + 1 };
      setMessages((prev: ChatMessage[]) => [...prev, userMsg, integratingMsg]);
      setIsTyping(true);
      const result = await integrateLinkAutomatically(orchestration.target || "", orchestration.payload?.originalText || "");
      if (result.success) {
        const successMsg: ChatMessage = { id: (Date.now() + 2).toString(), role: "model", text: `✅ Bağlantı başarıyla entegre edildi! "${result.label}" modülü aktif. Seni şimdi oraya yönlendiriyorum.`, timestamp: Date.now() + 2 };
        setMessages((prev: ChatMessage[]) => [...prev, successMsg]);
        setTimeout(() => setActiveView(result.moduleId as any), 2000);
      } else {
        const errorMsg: ChatMessage = { id: (Date.now() + 2).toString(), role: "model", text: `❌ Entegrasyon hatası: ${result.error}`, timestamp: Date.now() + 2 };
        setMessages((prev: ChatMessage[]) => [...prev, errorMsg]);
      }
      setIsTyping(false);
      return;
    }

    if (orchestration.intent === 'WEATHER') {
      const weatherInfo = getQuickWeather(orchestration.target || 'Sakarya');
      const modelMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: `${orchestration.target} için güncel hava durumu: ${weatherInfo}. Başka bir bölgeyi merak ediyor musun?`,
        timestamp: Date.now()
      };
      setMessages((prev: ChatMessage[]) => [...prev, { id: Date.now().toString(), role: 'user', text, timestamp: Date.now() }, modelMsg]);
      setIsTyping(false);
      return;
    }

    if (orchestration.intent === 'NEWS') {
      const modelMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'model',
          text: 'Harika! Güncel haberleri takip edebileceğin Haber Merkezi modülüne seni yönlendiriyorum.',
          timestamp: Date.now()
      };
      setMessages((prev: ChatMessage[]) => [...prev, { id: Date.now().toString(), role: 'user', text, timestamp: Date.now() }, modelMsg]);
      setTimeout(() => setActiveView(AppView.NEWS), 1000);
      setIsTyping(false);
      return;
    }

    if (orchestration.intent === 'SEARCH_LEARN') {
      learningMode = true;
      customInstruction += "\n\nKRİTİK: Kullanıcı bu bilgiyi ÖĞRENMEMİ ve HAFIZAMA KAYDETMEMİ istiyor. Lütfen konu hakkında detaylı, ansiklopedik ve gelecekte kullanılabilecek bir özet hazırlayın. Yanıtınızın başına 'ÖĞRENİLEN BİLGİ:' ifadesini ekleyin.";

      const searchInitiatedMsg: ChatMessage = {
        id: Date.now().toString(),
        role: 'model',
        text: `🔍 Web Araştırması ve Nöral Öğrenme Başlatıldı...\n\n"${orchestration.target}" konusunu derinlemesine inceliyorum. Bilgileri analiz edip kalıcı hafızama kaydedeceğim.`,
        timestamp: Date.now()
      };
      setMessages((prev: ChatMessage[]) => [...prev, { id: Date.now().toString(), role: 'user', text, timestamp: Date.now() }, searchInitiatedMsg]);
    } else {
      const userMsg: ChatMessage = {
        id: Date.now().toString(),
        role: 'user',
        text,
        timestamp: Date.now()
      };
      setMessages((prev: ChatMessage[]) => [...prev, userMsg]);
    }

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
            model: keyEntry.modelName || 'gemini-2.0-flash',
            systemInstruction: customInstruction
          });

          const chat = model.startChat({
            history: prepareGeminiHistory(messages)
          });

          const result = await chat.sendMessage(text);
          responseText = result.response.text();
          recordUsage(keyEntry.id);
        } else {
          const response = await fetch(`${keyEntry.baseUrl || 'https://api.openai.com/v1'}/chat/completions`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${keyEntry.key}`
            },
            body: JSON.stringify({
              model: keyEntry.modelName,
              messages: [
                ...(customInstruction ? [{ role: 'system', content: customInstruction }] : []),
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
          recordUsage(keyEntry.id);
        }

        const modelMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'model',
          text: responseText,
          timestamp: Date.now()
        };

        setMessages((prev: ChatMessage[]) => [...prev, modelMsg]);

        if (learningMode) {
          const cleanTopic = orchestration.target || 'Yeni Araştırma';
          const cleanInfo = responseText.replace('ÖĞRENİLEN BİLGİ:', '').trim();
          saveLearnedKnowledge(cleanTopic, cleanInfo);
        }
        success = true;
        break;
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

    setIsTyping(false);
  };

  const renderView = () => {
    const dynamicModules = getStorageItem('active_dynamic_modules', []);
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
                  <h1 className="text-4xl lg:text-5xl font-black text-white italic tracking-tighter uppercase leading-none text-glow">{dynamicMod.label}</h1>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Otonom Entegre Modül</p>
                  </div>
                </div>
              </div>
            </header>

            <div className="glass-panel p-1 rounded-[3rem] border border-white/10 bg-white/5 shadow-2xl overflow-hidden min-h-[600px] flex">
              <div className="bg-brandDark/50 rounded-[2.8rem] flex-1 overflow-hidden">
                <div className="h-full w-full" dangerouslySetInnerHTML={{ __html: dynamicMod.code }} />
              </div>
            </div>
          </div>
        </div>
      );
    }

    switch (activeView) {
      case AppView.OMNIVIEW: return <OmniView onViewChange={setActiveView} />;
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
      case AppView.ANDROID_NDK: return <NdkSamplesView />;
      case AppView.WEATHER: return <WeatherView />;
      case AppView.NEURAL_LOGIC as any: return <NeuralLogicView onViewChange={setActiveView} />;
      case AppView.GOOGLE_AI_STUDIO: return <GoogleAiStudioView />;
      case AppView.SKYDRIVE: return <SkyDriveView />;
      case AppView.NEWS: return <NewsView />;
      default: return <HomeView onViewChange={setActiveView} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#050505] text-white overflow-hidden font-sans neural-brain-bg">
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
            else if (target === 'chat' || target.includes('sohbet')) setActiveView(AppView.CHAT);
            else if (target.includes('haber')) setActiveView(AppView.NEWS);
            else if (target.includes('kripto')) setActiveView(AppView.CRYPTO);
            else if (target.includes('borsa')) setActiveView(AppView.BORSA);
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
