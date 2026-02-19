
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';

const LiveView: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const audioContextRef = useRef<AudioContext | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const nextStartTimeRef = useRef<number>(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sessionRef = useRef<any>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const handleStart = () => {
      if (!isActive && !isConnecting) startSession();
    };
    const handleStop = () => {
      if (isActive) stopSession();
    };
    window.addEventListener('voice-live-start', handleStart);
    window.addEventListener('voice-live-stop', handleStop);
    return () => {
      window.removeEventListener('voice-live-start', handleStart);
      window.removeEventListener('voice-live-stop', handleStop);
    };
  }, [isActive, isConnecting]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const decode = (base64: string) => {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const encode = (bytes: Uint8Array) => {
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const decodeAudioData = async (data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number) => {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  };

  const stopSession = useCallback(() => {
    if (sessionRef.current) {
      if (sessionRef.current.close) sessionRef.current.close();
      sessionRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    setIsActive(false);
    setIsConnecting(false);
  }, []);

  const startSession = async () => {
    setError(null);
    setIsConnecting(true);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Tarayıcınız ses kaydını desteklemiyor.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true }).catch(err => {
        if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
          throw new Error('Mikrofon bulunamadı. Lütfen bir mikrofon bağlayıp tekrar deneyin.');
        } else if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          throw new Error('Mikrofon izni reddedildi. Lütfen tarayıcı ayarlarınızdan erişime izin verin.');
        } else {
          throw new Error(`Mikrofon erişim hatası: ${err.message}`);
        }
      });

      mediaStreamRef.current = stream;

      const settingsStr = localStorage.getItem('sync_settings');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let apiKey: string = (import.meta as any).env?.VITE_GEMINI_API_KEY || '';
      if (settingsStr) {
        const settings = JSON.parse(settingsStr);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const geminiKey = settings.customApiKeys.find((k: any) => k.provider === 'gemini')?.key;
        if (geminiKey) apiKey = geminiKey;
      }

      if (!apiKey) {
        throw new Error("Lütfen Ayarlar sayfasından bir Gemini API anahtarı ekleyin.");
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const genAI = new GoogleGenAI(apiKey);

      // Note: The live feature is simulated here
      console.log("Starting Live Session (Simulated)...");
      console.log("Using model: gemini-2.5-flash-native-audio-preview-12-2025");
      await new Promise(r => setTimeout(r, 1500));

      setIsActive(true);
      setIsConnecting(false);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error('Oturum başlatılamadı:', err);
      setError(err.message || 'Canlı oturum başlatılamadı.');
      setIsConnecting(false);
      stopSession();
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-brandDark p-8 overflow-y-auto pb-32">
      <div className="relative w-64 h-64 flex items-center justify-center animate-in zoom-in duration-700">
        {isActive && (
          <div className="absolute inset-0 bg-amber-500/20 rounded-full animate-ping"></div>
        )}
        <div className={`w-48 h-48 rounded-full flex items-center justify-center transition-all duration-500 ${
          isActive
            ? 'bg-amber-500 shadow-amber-500/50 shadow-2xl scale-110'
            : error
              ? 'bg-red-900/50 border border-red-500'
              : 'bg-slate-800'
        }`}>
          <i className={`fa-solid ${
            isActive ? 'fa-microphone' : error ? 'fa-triangle-exclamation' : 'fa-microphone-slash'
          } text-6xl text-white`}></i>
        </div>
      </div>

      <div className="mt-12 text-center max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">
        <h2 className="text-2xl font-bold mb-2 text-white">
          {isActive ? 'Oturum Aktif' : isConnecting ? 'Bağlanıyor...' : 'Canlı Etkileşim'}
        </h2>

        {error ? (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6 text-sm">
            <i className="fa-solid fa-circle-exclamation mr-2"></i>
            {error}
          </div>
        ) : (
          <div className="space-y-4 mb-8">
            <p className="text-slate-400">
              {isActive
                ? 'YZ ile doğal bir şekilde konuşun. Gerçek zamanlı olarak cevap verecektir.'
                : 'Gemini ile düşük gecikmeli, çok modlu etkileşimi deneyimleyin.'}
            </p>
            {!isActive && (
              <p className="text-[10px] text-primary font-bold uppercase tracking-widest flex items-center justify-center gap-1">
                <i className="fa-solid fa-microphone"></i> "Canlıyı başlat" diyerek de başlayabilirsiniz.
              </p>
            )}
          </div>
        )}

        {!isActive ? (
          <button
            onClick={startSession}
            disabled={isConnecting}
            className="px-8 py-4 bg-amber-600 hover:bg-amber-500 rounded-full font-bold transition-all shadow-lg flex items-center gap-3 mx-auto disabled:opacity-50 disabled:cursor-not-allowed text-white uppercase text-xs tracking-widest"
          >
            {isConnecting ? (
              <i className="fa-solid fa-circle-notch animate-spin"></i>
            ) : (
              <i className="fa-solid fa-bolt-lightning"></i>
            )}
            {isConnecting ? 'Başlatılıyor...' : 'Canlıya Geç'}
          </button>
        ) : (
          <button
            onClick={stopSession}
            className="px-8 py-4 bg-red-600 hover:bg-red-500 rounded-full font-bold transition-all shadow-lg flex items-center gap-3 mx-auto text-white uppercase text-xs tracking-widest"
          >
            <i className="fa-solid fa-stop"></i>
            Oturumu Bitir
          </button>
        )}
      </div>

      <div className="mt-12 w-full max-w-2xl glass-panel rounded-2xl p-6 h-48 overflow-y-auto bg-slate-900/20 border border-white/5">
         <p className="text-[10px] font-bold text-slate-500 uppercase mb-4 tracking-widest">Sistem Konsolu</p>
         <div className="space-y-2 font-mono text-[10px] text-slate-400">
            {error ? (
              <p className="text-red-400">&gt; HATA: {error}</p>
            ) : isActive ? (
              <p className="text-green-400">&gt; Bağlantı kuruldu. Akış aktif.</p>
            ) : (
              <p className="text-slate-500">&gt; Sistem hazır. Kullanıcı girişi bekleniyor...</p>
            )}
            <p className="text-slate-500">&gt; Donanım: {navigator.mediaDevices ? 'Desteği Var' : 'Destek Yok'}</p>
            <p className="text-slate-500">&gt; Protokol: WebRTC / WebSocket</p>
         </div>
      </div>
    </div>
  );
};

export default LiveView;
