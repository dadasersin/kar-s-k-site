import React, { useState } from 'react';
import { executeAiRequest } from '../utils/apiPool';
import { recordAction } from '../utils/history';

const LiveAiDeveloperView: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState('');
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (msg: string) => setLogs(prev => [...prev.slice(-10), `[${new Date().toLocaleTimeString()}] ${msg}`]);

  const handleDevelop = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setLogs([]);
    addLog("Otonom geliştirme süreci başlatıldı...");
    recordAction('Live AI Developer', `Yeni modül geliştiriliyor: ${prompt}`);

    try {
        addLog("Nöral ağlar taranıyor...");
        const response = await executeAiRequest(`Sen bir React ve Tailwind uzmanısın. Şu isteğe uygun tek bir HTML/JS dosyası yaz: ${prompt}. Kodun başına/sonuna markdown koyma.`);

        addLog("Kod sentezlendi.");
        setCode(response.text);
        addLog("Derleme başarılı.");
    } catch (e: any) {
        addLog(`HATA: ${e.message}`);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-brandDark p-4 lg:p-10 pb-32">
      <header className="mb-10">
        <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase">Live AI <span className="text-primary">Developer</span></h2>
        <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-2">Gerçek zamanlı otonom kod sentezi</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">
        <div className="lg:col-span-5 space-y-6">
            <div className="glass-panel p-8 rounded-[2.5rem] bg-white/5 border border-white/10">
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Hangi özelliği veya sayfayı inşa etmemi istersin? (Örn: Modern bir hava durumu kartı)"
                    className="w-full h-48 bg-black/40 border border-white/5 rounded-3xl p-6 text-sm text-white outline-none focus:border-primary transition-all resize-none mb-6"
                />
                <button
                    onClick={handleDevelop}
                    disabled={loading}
                    className="w-full py-5 bg-primary text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl transition-all hover:scale-[1.02]"
                >
                    {loading ? 'SENTEZLENİYOR...' : 'GELİŞTİRMEYİ BAŞLAT'}
                </button>
            </div>

            <div className="glass-panel p-6 rounded-[2rem] bg-black/40 border border-white/5 font-mono text-[10px] text-primary/80 h-64 overflow-y-auto">
                <p className="text-slate-500 mb-2 border-b border-white/5 pb-2 uppercase tracking-widest">Terminal Çıktısı</p>
                {logs.map((log, i) => <div key={i} className="mb-1">{log}</div>)}
                {loading && <div className="animate-pulse">_</div>}
            </div>
        </div>

        <div className="lg:col-span-7">
            <div className="glass-panel h-full rounded-[3rem] border border-white/10 bg-white/5 overflow-hidden flex flex-col shadow-2xl">
                <div className="flex items-center justify-between px-8 py-4 bg-white/5 border-b border-white/5">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Önizleme Matrisi</span>
                    <div className="flex gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-500/20"></div>
                        <div className="w-2 h-2 rounded-full bg-yellow-500/20"></div>
                        <div className="w-2 h-2 rounded-full bg-green-500/20"></div>
                    </div>
                </div>
                <div className="flex-1 bg-brandDark relative overflow-hidden">
                    {code ? (
                        <iframe srcDoc={code} className="w-full h-full border-none" title="Live Preview" />
                    ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center opacity-10">
                            <i className="fa-solid fa-code text-7xl mb-6"></i>
                            <p className="text-xs font-black uppercase tracking-[0.5em]">Kod Sentezi Bekleniyor</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default LiveAiDeveloperView;
