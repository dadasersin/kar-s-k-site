import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';
import VoiceAssistant from './components/VoiceAssistant';
import { AppView } from './types';
import type { ChatMessage } from './types';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getAvailableKeys, markKeyAsExhausted } from './utils/apiPool';

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
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    const availableKeys = getAvailableKeys();
    if (availableKeys.length === 0) {
      setMessages(prev => [...prev, {
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

        setMessages(prev => [...prev, modelMsg]);
        success = true;
        break;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.error(`API Hatası [${keyEntry.label}]:`, error);
        if (error.message?.includes('429') || error.message?.toLowerCase().includes('quota')) {
          markKeyAsExhausted(keyEntry.id);
          continue;
        } else {
          setMessages(prev => [...prev, {
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
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "Üzgünüm, şu anda tüm API servisleri kota aşımı veya teknik bir hata nedeniyle kullanılamıyor.",
        timestamp: Date.now()
      }]);
    }

    setIsTyping(false);
  };

  const renderView = () => {
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
      <main className="flex-1 overflow-hidden relative lg:ml-64">
        <div className="h-full overflow-y-auto">
          {renderView()}
        </div>
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
          } else if (command === 'chat') {
            setActiveView(AppView.CHAT);
            handleSendMessage(payload);
          }
        }} />
      </main>
      <BottomNav activeView={activeView} onViewChange={setActiveView} />
    </div>
  );
}

export default App;
