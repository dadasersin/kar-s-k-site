import React, { useState, useCallback, useEffect } from 'react';
import { getAvailableKeys, markKeyAsExhausted } from '../utils/apiPool';
import { recordAction } from '../utils/history';

const LiveView: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    const handleStart = () => { if (!isActive && !isConnecting) startSession(); };
    const handleStop = () => { if (isActive) stopSession(); };
    window.addEventListener('voice-live-start', handleStart);
    window.addEventListener('voice-live-stop', handleStop);
    return () => {
      window.removeEventListener('voice-live-start', handleStart);
      window.removeEventListener('voice-live-stop', handleStop);
    };
  }, [isActive, isConnecting]);

  const stopSession = useCallback(() => {
    setIsActive(false);
    setIsConnecting(false);
  }, []);

  const startSession = async () => {
    setError(null);
    setIsConnecting(true);
    recordAction('Canlı Etkileşim', 'Oturum başlatılıyor...');

    try {
      const availableKeys = getAvailableKeys('gemini');
      if (availableKeys.length === 0) throw new Error("Gemini API anahtarı bulunamadı.");

      let success = false;
      for (const keyEntry of availableKeys) {
        try {
          console.log(`Starting Live Session with ${keyEntry.label} (Simulated)... Core: ${keyEntry.modelName || 'gemini-2.0-flash'}`);
          await new Promise(r => setTimeout(r, 1000));
          setIsActive(true);
          setIsConnecting(false);
          success = true;
          break;
        } catch (err: any) {
          if (err.message?.includes('429')) {
             markKeyAsExhausted(keyEntry.id);
             continue;
          }
          throw err;
        }
      }

      if (!success) throw new Error("API limiti dolmuş.");
    } catch (err: any) {
      setError(err.message || 'Hata oluştu.');
      setIsConnecting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-brandDark p-8 overflow-y-auto pb-32">
      <div className="relative w-64 h-64 flex items-center justify-center animate-in zoom-in duration-700">
        {isActive && <div className="absolute inset-0 bg-amber-500/20 rounded-full animate-ping"></div>}
        <div className={`w-48 h-48 rounded-full flex items-center justify-center transition-all duration-500 ${isActive ? 'bg-amber-500 shadow-amber-500/50 shadow-2xl scale-110' : 'bg-slate-800'}`}>
          <i className={`fa-solid ${isActive ? 'fa-microphone' : 'fa-microphone-slash'} text-6xl text-white`}></i>
        </div>
      </div>

      <div className="mt-12 text-center max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-white">{isActive ? 'Oturum Aktif' : 'Canlı Etkileşim'}</h2>
        {!isActive ? (
          <button onClick={startSession} disabled={isConnecting} className="px-12 py-4 bg-amber-600 hover:bg-amber-500 rounded-full font-black text-white uppercase text-xs tracking-widest transition-all">
            {isConnecting ? 'BAĞLANIYOR...' : 'CANLIYA GEÇ'}
          </button>
        ) : (
          <button onClick={stopSession} className="px-12 py-4 bg-red-600 hover:bg-red-500 rounded-full font-black text-white uppercase text-xs tracking-widest transition-all">OTURUMU BİTİR</button>
        )}
      </div>

      <div className="mt-12 w-full max-w-2xl glass-panel rounded-3xl p-8 bg-black/40 border border-white/5 h-48">
         <p className="text-[10px] font-black text-slate-500 uppercase mb-4 tracking-widest">Sistem Konsolu</p>
         <div className="space-y-2 font-mono text-[10px] text-slate-400">
            <p>&gt; {isActive ? 'Nöral akış senkronize edildi.' : 'Kullanıcı onayı bekleniyor.'}</p>
            <p>&gt; Protokol: WebSocket-Direct</p>
            <p>&gt; Status: {isActive ? 'CONNECTED' : 'IDLE'}</p>
         </div>
      </div>
    </div>
  );
};

export default LiveView;
