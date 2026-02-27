import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, Trash2, Download, Upload, Scissors, Sparkles, RefreshCw, Layers, CheckCircle2 } from 'lucide-react';

const TransparentPngView: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasImage, setHasImage] = useState(false);
  const [processed, setProcessed] = useState(false);

  const handleUpload = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setHasImage(true);
      setProcessed(false);
    }, 1500);
  };

  const handleRemoveBackground = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setProcessed(true);
    }, 2500);
  };

  return (
    <div className="p-4 lg:p-8 overflow-y-auto h-full pb-32 bg-brandDark text-slate-200">
      <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
               <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-[0_0_30px_rgba(244,63,94,0.4)] border border-white/20">
                  <Scissors className="w-7 h-7 text-white" />
               </div>
               <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase">Şeffaf PNG Aracı</h2>
            </div>
            <p className="text-slate-500 text-sm font-bold tracking-widest uppercase">Yapay Zeka Destekli Arka Plan Silme</p>
          </div>

          {hasImage && (
            <button
              onClick={() => { setHasImage(false); setProcessed(false); }}
              className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/5 transition-all flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" /> TEMİZLE
            </button>
          )}
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
             {!hasImage ? (
               <div
                 onClick={handleUpload}
                 className="glass-panel rounded-[40px] p-20 border-2 border-dashed border-white/10 hover:border-pink-500/50 bg-white/5 transition-all cursor-pointer text-center group flex flex-col items-center justify-center min-h-[400px]"
               >
                  <div className="w-20 h-20 rounded-3xl bg-pink-600/10 flex items-center justify-center mb-8 border border-pink-500/20 group-hover:scale-110 transition-transform">
                     <Upload className="w-8 h-8 text-pink-500" />
                  </div>
                  <h3 className="text-2xl font-black text-white uppercase italic mb-4">Görsel Yükle</h3>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Sürükleyip bırakın veya seçmek için tıklayın</p>
               </div>
             ) : (
               <div className="space-y-6">
                  <div className="glass-panel rounded-[40px] overflow-hidden bg-black/40 border border-white/5 shadow-2xl relative group min-h-[400px] flex items-center justify-center">
                     <div className={`absolute inset-0 opacity-10 ${processed ? 'bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]' : ''}`}></div>

                     <AnimatePresence mode="wait">
                        {isProcessing ? (
                          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center space-y-6 z-10">
                             <RefreshCw className="w-16 h-16 text-pink-500 animate-spin mx-auto" />
                             <p className="text-sm font-black uppercase tracking-[0.3em] text-pink-500">İşleniyor...</p>
                          </motion.div>
                        ) : (
                          <motion.div key="image" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative z-10 p-8">
                             <div className={`w-full max-w-lg aspect-square rounded-3xl bg-white/10 border border-white/10 flex items-center justify-center overflow-hidden shadow-2xl ${processed ? 'border-pink-500/30' : ''}`}>
                                <ImageIcon className={`w-32 h-32 text-white/20 ${processed ? 'animate-pulse' : ''}`} />
                                {processed && (
                                  <div className="absolute inset-0 flex items-center justify-center bg-pink-500/10 backdrop-blur-[2px]">
                                     <Sparkles className="w-20 h-20 text-pink-500" />
                                  </div>
                                )}
                             </div>
                             {processed && (
                               <div className="absolute top-12 right-12 px-4 py-2 bg-emerald-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-2">
                                  <CheckCircle2 className="w-4 h-4" /> ARKA PLAN SİLİNDİ
                               </div>
                             )}
                          </motion.div>
                        )}
                     </AnimatePresence>
                  </div>

                  <div className="flex gap-4">
                     {!processed ? (
                       <button
                         onClick={handleRemoveBackground}
                         disabled={isProcessing}
                         className="flex-1 py-5 bg-pink-600 hover:bg-pink-500 text-white rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-pink-600/20 transition-all flex items-center justify-center gap-3"
                       >
                          <Scissors className="w-5 h-5" /> ARKA PLANI KALDIR
                       </button>
                     ) : (
                       <button
                         className="flex-1 py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-emerald-600/20 transition-all flex items-center justify-center gap-3"
                       >
                          <Download className="w-5 h-5" /> ŞEFFAF PNG İNDİR
                       </button>
                     )}
                  </div>
               </div>
             )}
          </div>

          <div className="lg:col-span-4 space-y-6">
             <div className="bg-gradient-to-br from-pink-600/20 to-brandDark border border-pink-600/20 rounded-[40px] p-8 shadow-2xl">
                <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 italic border-b border-white/5 pb-2">Özellikler</h3>
                <div className="space-y-4">
                   <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-4 h-4 text-pink-500" />
                      <span className="text-[10px] font-bold text-slate-300 uppercase">HD Çıktı Kalitesi</span>
                   </div>
                   <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-4 h-4 text-pink-500" />
                      <span className="text-[10px] font-bold text-slate-300 uppercase">Saç/Tüy Detay Koruma</span>
                   </div>
                   <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-4 h-4 text-pink-500" />
                      <span className="text-[10px] font-bold text-slate-300 uppercase">Toplu İşleme</span>
                   </div>
                </div>
             </div>

             <div className="glass-panel p-8 rounded-[40px] border border-white/5 bg-white/5">
                <div className="flex items-center gap-3 mb-4">
                   <Layers className="w-5 h-5 text-pink-500" />
                   <p className="text-[10px] font-black text-white uppercase tracking-widest">Dosya Bilgisi</p>
                </div>
                <div className="space-y-2 text-[11px] text-slate-500 font-bold uppercase tracking-tighter">
                   <div className="flex justify-between"><span>Format:</span><span className="text-white">PNG</span></div>
                   <div className="flex justify-between"><span>Maksimum Boyut:</span><span className="text-white">25 MB</span></div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransparentPngView;
