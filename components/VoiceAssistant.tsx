
import React, { useState, useEffect, useRef } from 'react';

interface VoiceAssistantProps {
  onCommand: (command: string, action: string, payload: string) => void;
}

const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ onCommand }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'tr-TR';

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognitionRef.current.onresult = (event: any) => {
        const command = event.results[0][0].transcript.toLowerCase().trim();
        setTranscript(command);
        processCommand(command);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const processCommand = (text: string) => {
    // Sohbet Komutu
    if (text.startsWith('sohbet') || text.startsWith('mesaj')) {
      const payload = text.replace(/^(sohbet|mesaj|mesaj gönder)\s*(mesajı|gönder)?\s*/i, '');
      onCommand('chat', 'chat', payload);
    }
    // Görsel Komutu
    else if (text.startsWith('görsel') || text.startsWith('resim')) {
      const payload = text.replace(/^(görsel|resim)\s*(üret|yap|oluştur)?\s*/i, '');
      onCommand('visuals', 'visuals', payload);
    }
    // Video Komutu
    else if (text.startsWith('video')) {
      const payload = text.replace(/^video\s*(üret|yap|oluştur)?\s*/i, '');
      onCommand('visuals', 'visuals', payload);
    }
    // Ses Remix Komutu
    else if (text.includes('remix') || text.startsWith('sesi değiştir')) {
      const payload = text.replace(/^(remix|ses remix|sesi değiştir|audio remix)\s*(yap|et|le)?\s*/i, '');
      onCommand('audio', 'audio-remix', payload);
    }
    // Metinden Sese / TTS Komutu
    else if (text.startsWith('ses') || text.startsWith('tts') || text.includes('metinden sese') || text.includes('text to speech')) {
      const payload = text.replace(/^(ses|seslendir|tts|metinden sese|text to speech)\s*(yap|oku)?\s*/i, '');
      onCommand('audio', 'audio-tts', payload);
    }
    // Canlı Komutu
    else if (text.includes('canlı') && (text.includes('başlat') || text.includes('aç'))) {
      onCommand('live', 'live-start', '');
    }
    else if (text.includes('canlı') && (text.includes('durdur') || text.includes('kapat') || text.includes('bitir'))) {
      onCommand('live', 'live-stop', '');
    }
    // Gezinme Komutları
    else if (text.includes('ana sayfa')) onCommand('nav', 'nav', 'home');
    else if (text.includes('araçlar')) onCommand('nav', 'nav', 'tools');
    else if (text.includes('sahne')) onCommand('nav', 'nav', 'creative');
    else if (text.includes('panel')) onCommand('nav', 'nav', 'dashboard');
    else if (text.includes('sohbet')) onCommand('nav', 'nav', 'chat');
    else if (text.includes('stüdyo')) onCommand('nav', 'nav', 'visuals');
    else if (text.includes('müzik')) onCommand('nav', 'nav', 'music');
    else if (text.includes('galeri')) onCommand('nav', 'nav', 'gallery');
    else if (text.includes('workflow') || text.includes('akışı')) onCommand('nav', 'nav', 'workflow');
    else if (text.includes('inşa')) onCommand('nav', 'nav', 'builder');
    else if (text.includes('kripto')) onCommand('nav', 'nav', 'crypto');
    else if (text.includes('google')) onCommand('nav', 'nav', 'google_apps');
    else if (text.includes('docker')) onCommand('nav', 'nav', 'docker_ai');
    else if (text.includes('görev')) onCommand('nav', 'nav', 'requests');
    else if (text.includes('sistem')) onCommand('nav', 'nav', 'system');
    else if (text.includes('ayar')) onCommand('nav', 'nav', 'settings');
    // Genel Gezinme
    else if (text.includes('aç') || text.includes('git')) {
      onCommand('nav', 'nav', text);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setTranscript('');
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  if (!recognitionRef.current) return null;

  return (
    <div className="fixed bottom-20 right-24 lg:bottom-8 lg:right-24 z-[100] flex flex-col items-end gap-3">
      {transcript && (
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 px-4 py-2 rounded-2xl text-xs text-primary font-medium animate-in slide-in-from-bottom-2 fade-in">
          "{transcript}"
        </div>
      )}
      <button
        onClick={toggleListening}
        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl ${
          isListening
            ? 'bg-red-500 scale-110 shadow-red-500/40'
            : 'bg-primary hover:brightness-110 shadow-primary/40'
        }`}
      >
        <div className={`absolute inset-0 rounded-full bg-current opacity-20 ${isListening ? 'animate-ping' : ''}`}></div>
        <i className={`fa-solid ${isListening ? 'fa-stop' : 'fa-microphone'} text-lg text-white`}></i>
      </button>
    </div>
  );
};

export default VoiceAssistant;
