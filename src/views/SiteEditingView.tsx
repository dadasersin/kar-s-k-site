import { getStorageItem } from '../utils/storage';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout, Palette, Trash2, Edit3, Save, Plus, AlertCircle, CheckCircle2, RefreshCcw } from 'lucide-react';

interface DynamicModule {
  id: string;
  label: string;
  code: string;
  icon: string;
  timestamp: number;
}

const SiteEditingView: React.FC = () => {
  const [modules, setModules] = useState<DynamicModule[]>([]);
  const [siteTitle, setSiteTitle] = useState('Ersin Güleş');
  const [siteTheme, setSiteTheme] = useState('dark');
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    const savedModules = getStorageItem('active_dynamic_modules', []);
    setModules(savedModules);

    const savedTitle = localStorage.getItem('site_title') || 'Ersin Güleş';
    setSiteTitle(savedTitle);
  }, []);

  const saveSettings = () => {
    localStorage.setItem('site_title', siteTitle);
    localStorage.setItem('active_dynamic_modules', JSON.stringify(modules));
    setMessage({ text: 'Ayarlar başarıyla kaydedildi!', type: 'success' });
    setTimeout(() => setMessage(null), 3000);
    window.dispatchEvent(new Event('storage'));
  };

  const deleteModule = (id: string) => {
    const updated = modules.filter(m => m.id !== id);
    setModules(updated);
    localStorage.setItem('active_dynamic_modules', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
  };

  const clearAllDynamic = () => {
    if (window.confirm('Tüm dinamik modülleri silmek istediğinize emin misiniz?')) {
      setModules([]);
      localStorage.setItem('active_dynamic_modules', '[]');
      window.dispatchEvent(new Event('storage'));
    }
  };

  return (
    <div className="p-4 lg:p-12 max-w-6xl mx-auto space-y-12 pb-32">
      <header className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-xl shadow-indigo-500/10">
            <Layout className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase font-sans">SİTE DÜZENLEME</h1>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Portal Mimarisini ve Modülleri Yönetin</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Basic Settings */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-panel p-8 rounded-[2.5rem] border border-white/5 bg-white/5 space-y-8">
            <div className="flex items-center gap-3">
              <Palette className="w-5 h-5 text-primary" />
              <h3 className="text-sm font-black text-white uppercase tracking-widest">Genel Görünüm</h3>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Portal Başlığı</label>
                <input
                  type="text"
                  value={siteTitle}
                  onChange={(e) => setSiteTitle(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-primary outline-none transition-all"
                  placeholder="Başlık girin..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Tema Modu</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSiteTheme('dark')}
                    className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${siteTheme === 'dark' ? 'bg-primary border-primary text-white' : 'bg-black/40 border-white/5 text-slate-500'}`}
                  >
                    Karanlık
                  </button>
                  <button
                    onClick={() => setSiteTheme('light')}
                    disabled
                    className="flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest bg-black/40 border-white/5 text-slate-700 cursor-not-allowed"
                  >
                    Aydınlık (Yakında)
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={saveSettings}
              className="w-full py-4 bg-primary text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/20 hover:brightness-110 transition-all flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" /> AYARLARI KAYDET
            </button>

            <AnimatePresence>
              {message && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`p-4 rounded-xl flex items-center gap-3 ${message.type === 'success' ? 'bg-green-500/10 border border-green-500/20 text-green-400' : 'bg-red-500/10 border border-red-500/20 text-red-400'}`}
                >
                  {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                  <span className="text-[10px] font-bold uppercase tracking-widest">{message.text}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Modules Management */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-8 rounded-[3rem] border border-white/5 bg-white/5 min-h-[500px] flex flex-col">
            <div className="flex justify-between items-center mb-10">
              <div className="flex items-center gap-3">
                <RefreshCcw className="w-5 h-5 text-emerald-500" />
                <h3 className="text-sm font-black text-white uppercase tracking-widest">Dinamik Modül Yönetimi</h3>
              </div>
              <button
                onClick={clearAllDynamic}
                className="text-[10px] font-black text-red-500/60 hover:text-red-500 uppercase tracking-widest transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-3 h-3" /> TÜMÜNÜ TEMİZLE
              </button>
            </div>

            {modules.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center opacity-20 space-y-4">
                <Layout className="w-16 h-16" />
                <p className="text-sm font-bold uppercase tracking-widest">Henüz dinamik modül eklenmemiş</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {modules.map(mod => (
                  <div key={mod.id} className="p-6 bg-black/40 border border-white/5 rounded-[2rem] hover:border-primary/30 transition-all group flex flex-col gap-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                          <i className={`fa-solid ${mod.icon || 'fa-cube'}`}></i>
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-sm uppercase truncate max-w-[120px]">{mod.label}</h4>
                          <p className="text-[8px] font-bold text-slate-600 uppercase tracking-widest">{new Date(mod.timestamp).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteModule(mod.id)}
                        className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500/40 hover:text-red-500 hover:bg-red-500/20 transition-all flex items-center justify-center"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="mt-auto flex gap-2">
                       <div className="flex-1 px-3 py-2 bg-white/5 rounded-lg text-[9px] font-black text-slate-500 uppercase tracking-widest border border-white/5">
                          ID: {mod.id.substring(0, 8)}
                       </div>
                       <button className="px-3 py-2 bg-indigo-500/10 text-indigo-400 rounded-lg text-[9px] font-black uppercase tracking-widest border border-indigo-500/20 hover:bg-indigo-500 hover:text-white transition-all">
                          DÜZENLE
                       </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SiteEditingView;
