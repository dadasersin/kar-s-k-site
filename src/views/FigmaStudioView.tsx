import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout, PenTool, Figma, Cpu, MessageSquare, Box, Download, Link2, AlertCircle, RefreshCw, Layers, Sparkles } from 'lucide-react';

const FigmaStudioView: React.FC = () => {
  const [figmaUrl, setFigmaUrl] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState<'design' | 'layers' | 'ai'>('design');

  const layers = [
    { id: '1', name: 'Üst Bilgi Taşıyıcı', type: 'ÇERÇEVE', visibility: true },
    { id: '2', name: 'Logo Varlığı', type: 'BİLEŞEN', visibility: true },
    { id: '3', name: 'Kahraman Bölümü', type: 'ÖRNEK', visibility: true },
    { id: '4', name: 'Ana Buton', type: 'BİLEŞEN', visibility: true },
    { id: '5', name: 'Alt Bilgi Metni', type: 'METİN', visibility: true },
  ];

  const handleConnect = () => {
    if (!figmaUrl.trim()) return;
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnecting(false);
      setIsConnected(true);
    }, 2000);
  };

  const runAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      alert("Tasarım Analizi Tamamlandı! YZ önerileri 'YZ Asistanı' sekmesine eklendi.");
    }, 3000);
  };

  return (
    <div className="p-4 lg:p-8 overflow-y-auto h-full pb-32 bg-brandDark text-slate-200">
      <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
               <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center shadow-[0_0_30px_rgba(236,72,153,0.4)] border border-white/20">
                  <Figma className="w-7 h-7 text-white" />
               </div>
               <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase">Figma AI Stüdyo</h2>
            </div>
            <p className="text-slate-500 text-sm font-bold tracking-widest uppercase">MCP Protokolü & Akıllı Tasarım Entegrasyonu</p>
          </div>

          <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 backdrop-blur-md">
             {(['design', 'layers', 'ai'] as const).map(tab => (
               <button
                 key={tab}
                 onClick={() => setActiveTab(tab)}
                 className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === tab ? 'bg-pink-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
               >
                  {tab === 'design' && <Layout className="w-3 h-3" />}
                  {tab === 'layers' && <Layers className="w-3 h-3" />}
                  {tab === 'ai' && <Sparkles className="w-3 h-3" />}
                  {tab === 'design' ? 'TASARIM' : tab === 'layers' ? 'KATMANLAR' : 'YZ ASİSTANI'}
               </button>
             ))}
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Area */}
          <div className="lg:col-span-8 space-y-6">
            {!isConnected ? (
              <div className="glass-panel rounded-[40px] p-12 text-center flex flex-col items-center justify-center min-h-[500px] border border-white/5 bg-white/5 shadow-2xl">
                 <div className="w-24 h-24 rounded-[2rem] bg-pink-600/10 flex items-center justify-center mb-8 border border-pink-500/20">
                    <Link2 className="w-10 h-10 text-pink-500" />
                 </div>
                 <h3 className="text-2xl font-black text-white uppercase italic mb-4">Tasarıma Bağlanın</h3>
                 <p className="text-slate-500 text-sm max-w-md mb-10 font-bold uppercase tracking-widest leading-relaxed">
                   Figma dosya linkinizi buraya yapıştırarak MCP protokolü üzerinden YZ destekli tasarım sürecini başlatın.
                 </p>
                 <div className="w-full max-w-lg flex gap-3">
                    <input
                      type="text"
                      value={figmaUrl}
                      onChange={(e) => setFigmaUrl(e.target.value)}
                      placeholder="https://www.figma.com/file/..."
                      className="flex-1 bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-xs text-white outline-none focus:border-pink-500 transition-all"
                    />
                    <button
                      onClick={handleConnect}
                      disabled={isConnecting || !figmaUrl.trim()}
                      className="px-10 py-4 bg-pink-600 hover:bg-pink-500 text-white font-black uppercase tracking-widest rounded-2xl shadow-xl transition-all disabled:opacity-50 text-[10px]"
                    >
                      {isConnecting ? 'BAĞLANIYOR...' : 'BAĞLAN'}
                    </button>
                 </div>
              </div>
            ) : (
              <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
                <div className="glass-panel rounded-[40px] overflow-hidden bg-black/40 border border-white/5 shadow-2xl min-h-[500px] relative flex flex-col">
                   <div className="px-8 py-4 bg-white/5 border-b border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
                         <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Canlı Senkronizasyon Aktif</span>
                      </div>
                      <div className="flex gap-2">
                         <button className="p-2 hover:bg-white/10 rounded-lg text-slate-500 transition-colors"><Download className="w-4 h-4" /></button>
                         <button className="p-2 hover:bg-white/10 rounded-lg text-slate-500 transition-colors"><RefreshCw className="w-4 h-4" /></button>
                      </div>
                   </div>

                   <div className="flex-1 flex items-center justify-center p-12">
                      {activeTab === 'design' ? (
                        <div className="text-center space-y-6 opacity-30 group">
                           <Layout className="w-32 h-32 text-slate-400 mx-auto group-hover:scale-110 transition-transform duration-700" />
                           <p className="text-sm font-black uppercase tracking-[0.3em]">Tasarım Önizlemesi Hazırlanıyor</p>
                        </div>
                      ) : activeTab === 'layers' ? (
                        <div className="w-full space-y-3">
                           {layers.map(layer => (
                             <div key={layer.id} className="p-5 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-between hover:border-pink-500/30 transition-all">
                                <div className="flex items-center gap-4">
                                   <div className="w-10 h-10 rounded-xl bg-black/40 flex items-center justify-center text-pink-500">
                                      <Box className="w-5 h-5" />
                                   </div>
                                   <div>
                                      <p className="text-xs font-bold text-white">{layer.name}</p>
                                      <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">{layer.type}</p>
                                   </div>
                                </div>
                                <div className="flex gap-2">
                                   <button className="text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-white px-3 py-1 bg-white/5 rounded-lg">Düzenle</button>
                                </div>
                             </div>
                           ))}
                        </div>
                      ) : (
                        <div className="w-full space-y-6">
                           <div className="p-8 bg-pink-600/5 border border-pink-500/20 rounded-[2.5rem] flex items-center gap-8">
                              <Sparkles className="w-12 h-12 text-pink-500 shrink-0" />
                              <div>
                                 <h4 className="text-lg font-black text-white italic uppercase mb-2">YZ Tasarım Önerileri</h4>
                                 <p className="text-xs text-slate-400 leading-relaxed font-bold">MCP protokolü üzerinden tasarımınızı analiz ettim. İşte ilk bulgularım:</p>
                              </div>
                           </div>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="p-6 bg-white/5 border border-white/5 rounded-3xl space-y-3">
                                 <div className="flex items-center gap-2 text-emerald-400">
                                    <CheckCircle className="w-4 h-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Erişilebilirlik</span>
                                 </div>
                                 <p className="text-[11px] text-slate-400 leading-relaxed italic">"Renk kontrastı WCAG standartlarına tam uyum sağlıyor. Okunabilirlik yüksek."</p>
                              </div>
                              <div className="p-6 bg-white/5 border border-white/5 rounded-3xl space-y-3">
                                 <div className="flex items-center gap-2 text-amber-400">
                                    <AlertCircle className="w-4 h-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Hiyerarşi</span>
                                 </div>
                                 <p className="text-[11px] text-slate-400 leading-relaxed italic">"Ana buton (CTA) daha vurgulu hale getirilebilir. Boyutu %15 artırmayı öneririm."</p>
                              </div>
                           </div>
                        </div>
                      )}
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] flex items-center gap-6 group hover:bg-pink-600/5 transition-all cursor-pointer" onClick={runAnalysis}>
                      <div className="w-14 h-14 rounded-2xl bg-pink-600/20 flex items-center justify-center shrink-0">
                         {isAnalyzing ? <RefreshCw className="w-6 h-6 text-pink-500 animate-spin" /> : <Cpu className="w-6 h-6 text-pink-500" />}
                      </div>
                      <div>
                         <h5 className="text-white font-black text-sm uppercase italic">Akıllı Analiz</h5>
                         <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">YZ ile tasarım hatalarını ayıkla</p>
                      </div>
                   </div>
                   <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] flex items-center gap-6 group hover:bg-blue-600/5 transition-all cursor-pointer">
                      <div className="w-14 h-14 rounded-2xl bg-blue-600/20 flex items-center justify-center shrink-0">
                         <PenTool className="w-6 h-6 text-blue-500" />
                      </div>
                      <div>
                         <h5 className="text-white font-black text-sm uppercase italic">Kod Çıktısı</h5>
                         <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Tasarımı React & Tailwind koduna çevir</p>
                      </div>
                   </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
             <div className="bg-gradient-to-br from-pink-600/20 to-brandDark border border-pink-600/20 rounded-[40px] p-8 shadow-2xl">
                <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 italic border-b border-white/5 pb-2">Entegrasyon Durumu</h3>
                <div className="space-y-6">
                   <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">MCP Protokolü</span>
                      <span className={`text-[10px] font-black uppercase tracking-widest ${isConnected ? 'text-emerald-500' : 'text-slate-600'}`}>
                        {isConnected ? 'Çevrimiçi' : 'Bekleniyor'}
                      </span>
                   </div>
                   <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Figma API</span>
                      <span className={`text-[10px] font-black uppercase tracking-widest ${isConnected ? 'text-emerald-500' : 'text-slate-600'}`}>
                        {isConnected ? 'Bağlı' : 'Bağlı Değil'}
                      </span>
                   </div>
                </div>

                <div className="mt-10 p-6 bg-pink-500/5 rounded-3xl border border-pink-500/20">
                   <div className="flex items-center gap-3 mb-3">
                      <MessageSquare className="w-4 h-4 text-pink-500" />
                      <p className="text-[10px] font-black text-white uppercase tracking-widest">Sohbet Entegrasyonu</p>
                   </div>
                   <p className="text-[11px] text-slate-500 italic leading-relaxed">
                     "Artık AI Sohbet ekranından figma dosyalarınız hakkında soru sorabilir ve değişiklik talep edebilirsiniz."
                   </p>
                </div>
             </div>

             <div className="glass-panel p-8 rounded-[40px] border border-white/5 bg-white/5">
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Hızlı Araçlar</h4>
                <div className="space-y-3">
                   <button className="w-full py-4 bg-white/5 hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border border-white/5 flex items-center justify-center gap-2">
                      <Download className="w-4 h-4" /> VARLIKLARI İNDİR
                   </button>
                   <button className="w-full py-4 bg-white/5 hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border border-white/5 flex items-center justify-center gap-2">
                      <RefreshCw className="w-4 h-4" /> TÜMÜNÜ YENİLE
                   </button>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CheckCircle = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default FigmaStudioView;
