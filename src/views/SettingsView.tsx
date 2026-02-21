import { getAllKeys } from '../utils/apiPool';
import React, { useState, useEffect } from 'react';
import type { ApiProvider, ApiKeyEntry, SyncSettings } from '../types';
import { isSupabaseConfigured } from '../utils/supabase';

interface SettingsViewProps {
  onSyncNow: () => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ onSyncNow }) => {
  const [settings, setSettings] = useState<SyncSettings>({
    enabled: false,
    token: '',
    repo: '',
    path: 'ersin-portal-state.json',
    customApiKeys: []
  });

  const [supabaseUrl, setSupabaseUrl] = useState(localStorage.getItem('VITE_SUPABASE_URL') || '');
  const [supabaseKey, setSupabaseKey] = useState(localStorage.getItem('VITE_SUPABASE_ANON_KEY') || '');

  const [newKey, setNewKey] = useState('');
  const [keyLabel, setKeyLabel] = useState('');
  const [provider, setProvider] = useState<ApiProvider>('gemini');
  const [modelName, setModelName] = useState('gemini-1.5-flash');
  const [customUrl, setCustomUrl] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('sync_settings');
    if (saved) {
      try {
        setSettings(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse settings", e);
      }
    }
  }, []);

  const systemKeys = getAllKeys().filter(k => k.id.startsWith('VITE_'));

  const addApiKey = () => {
    if (!newKey || !keyLabel) return;
    const entry: ApiKeyEntry = {
      id: Date.now().toString(),
      key: newKey,
      label: keyLabel,
      provider,
      modelName,
      baseUrl: provider === 'custom' ? customUrl : undefined,
      isQuotaExhausted: false,
      usageCount: 0
    };
    const updated = { ...settings, customApiKeys: [...settings.customApiKeys, entry] };
    setSettings(updated);
    localStorage.setItem('sync_settings', JSON.stringify(updated));
    setNewKey('');
    setKeyLabel('');
  };

  const saveSupabaseConfig = () => {
    localStorage.setItem('VITE_SUPABASE_URL', supabaseUrl);
    localStorage.setItem('VITE_SUPABASE_ANON_KEY', supabaseKey);
    alert('DB Ayarları kaydedildi. Değişikliklerin uygulanması için sayfa yenilenecek.');
    window.location.reload();
  };

  const removeKey = (id: string) => {
    const updated = { ...settings, customApiKeys: settings.customApiKeys.filter(k => k.id !== id) };
    setSettings(updated);
    localStorage.setItem('sync_settings', JSON.stringify(updated));
  };

  const handleProviderChange = (p: ApiProvider) => {
    setProvider(p);
    if (p === 'gemini') setModelName('gemini-1.5-flash');
    else if (p === 'openai') setModelName('gpt-4o');
    else if (p === 'deepseek') setModelName('deepseek-chat');
    else if (p === 'grok') setModelName('grok-1');
  };

  const saveSyncSettings = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('sync_settings', JSON.stringify(settings));
    alert('Ayarlar kaydedildi.');
  };

  const resetQuotas = () => {
    const updated = {
      ...settings,
      customApiKeys: settings.customApiKeys.map(k => ({ ...k, isQuotaExhausted: false }))
    };
    setSettings(updated);
    localStorage.setItem('sync_settings', JSON.stringify(updated));
    alert('Tüm kotalar sıfırlandı.');
  };

  const isSupabaseActive = isSupabaseConfigured();

  return (
    <div className="p-4 lg:p-8 overflow-y-auto h-full pb-32 bg-brandDark">
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
        <header>
          <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Sistem Ayarları</h2>
          <p className="text-slate-500 text-sm mt-1 uppercase font-bold tracking-widest">Çekirdek Yapılandırma ve Güvenlik</p>
        </header>

        <section className="glass-panel p-8 rounded-[40px] border border-blue-500/10 shadow-2xl space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold flex items-center gap-2 text-white">
              <i className="fa-solid fa-database text-blue-500"></i>
              Supabase Bağlantısı
            </h3>
            <div className={`px-3 py-1 rounded-full text-[10px] font-black ${isSupabaseActive ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
              {isSupabaseActive ? 'BAĞLANDI' : 'YAPILANDIRILMAMIŞ'}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
             <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase px-1">Supabase URL</label>
                <input
                  type="text"
                  value={supabaseUrl}
                  onChange={(e) => setSupabaseUrl(e.target.value)}
                  placeholder="https://xyz.supabase.co"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 outline-none focus:border-blue-500 transition-all"
                />
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase px-1">Anon Key</label>
                <input
                  type="password"
                  value={supabaseKey}
                  onChange={(e) => setSupabaseKey(e.target.value)}
                  placeholder="eyJhbGci..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 outline-none focus:border-blue-500 transition-all"
                />
             </div>
             <button
               onClick={saveSupabaseConfig}
               className="py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
             >
               VERİTABANI AYARLARINI KAYDET
             </button>
          </div>

          <p className="text-[10px] text-slate-500 leading-relaxed pt-2 border-t border-white/5">
            Render dashboard üzerinden **Environment** sekmesine giderek **VITE_SUPABASE_URL** ve **VITE_SUPABASE_ANON_KEY** değişkenlerini kalıcı olarak ekleyebilirsiniz. [Detaylı Rehber için Tıklayın](https://render.com/docs/environment-variables)
          </p>
        </section>

        <section className="glass-panel p-8 rounded-[40px] border border-slate-800 shadow-2xl space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold flex items-center gap-2 text-white">
              <i className="fa-solid fa-key text-amber-500"></i>
              API Anahtarları
            </h3>
            <button onClick={resetQuotas} className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-blue-400 transition-colors">Kotaları Yenile</button>
          </div>

          {systemKeys.length > 0 && (
            <div className="mb-8 p-6 bg-primary/5 border border-primary/20 rounded-[32px]">
              <h3 className="text-xs font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2 italic">
                <i className="fa-solid fa-server text-primary"></i>
                Sistem Anahtarları (Render)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {systemKeys.map(k => (
                  <div key={k.id} className="flex items-center justify-between p-4 bg-black/40 border border-white/5 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                        <i className={`fa-solid ${k.provider === "gemini" ? "fa-gem" : "fa-brain"} text-sm`}></i>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white uppercase">{k.label}</p>
                        <p className="text-[9px] text-slate-500 uppercase font-black">{k.modelName}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-primary italic">{k.usageCount || 0}</p>
                      <p className="text-[8px] text-slate-600 uppercase font-bold">İstek</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4">
            {settings.customApiKeys.map(k => (
              <div key={k.id} className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${k.isQuotaExhausted ? 'bg-red-500/5 border-red-500/20' : 'bg-slate-900 border-slate-800'}`}>
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${k.isQuotaExhausted ? 'bg-slate-800' : 'bg-primary/20 text-primary'}`}>
                    <i className={`fa-solid ${k.provider === 'gemini' ? 'fa-gem' : 'fa-brain'} text-sm`}></i>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-100">{k.label}</p>
                    <p className="text-[9px] text-slate-500 uppercase tracking-widest font-black">{k.provider} • {k.modelName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right px-4 mr-2 border-r border-white/5">
                    <p className="text-xs font-black text-white italic">{k.usageCount || 0}</p>
                    <p className="text-[8px] text-slate-500 uppercase font-bold">İstek</p>
                  </div>
                  {k.isQuotaExhausted && <span className="text-[8px] font-black text-red-500 uppercase px-2 py-1 bg-red-500/10 rounded-full border border-red-500/20">KOTA DOLU</span>}
                  <button onClick={() => removeKey(k.id)} className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-600 hover:text-red-500 hover:bg-red-500/10 transition-all">
                    <i className="fa-solid fa-trash-can"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-6 border-t border-slate-800 space-y-4">
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase px-1">Servis Sağlayıcı</label>
                  <select
                    value={provider}
                    onChange={(e) => handleProviderChange(e.target.value as ApiProvider)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 outline-none focus:border-primary transition-all"
                  >
                    <option value="gemini">Google Gemini</option>
                    <option value="openai">OpenAI</option>
                    <option value="deepseek">DeepSeek AI</option>
                    <option value="grok">xAI Grok</option>
                    <option value="custom">Özel (Base URL ile)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase px-1">Model Adı</label>
                  <input
                    type="text"
                    value={modelName}
                    onChange={(e) => setModelName(e.target.value)}
                    placeholder="örn: deepseek-chat"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 outline-none focus:border-primary transition-all"
                  />
                </div>
             </div>

             {provider !== 'gemini' && (
               <div className="space-y-2">
                 <label className="text-[10px] font-bold text-slate-500 uppercase px-1">API Base URL</label>
                 <input
                   type="text"
                   value={customUrl}
                   onChange={(e) => setCustomUrl(e.target.value)}
                   placeholder="https://api.deepseek.com/v1"
                   className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 outline-none focus:border-primary transition-all"
                 />
               </div>
             )}

             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  value={keyLabel}
                  onChange={(e) => setKeyLabel(e.target.value)}
                  placeholder="Etiket (örn: Gemini Anahtarı)"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 outline-none focus:border-primary transition-all"
                />
                <input
                  type="password"
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                  placeholder="API Key"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 outline-none focus:border-primary transition-all"
                />
             </div>

             <button onClick={addApiKey} className="w-full py-4 bg-primary hover:brightness-110 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-xl active:scale-95">
               HAVUZA EKLE
             </button>
          </div>
        </section>

        <section className="glass-panel p-8 rounded-[40px] border border-slate-800 shadow-xl space-y-6">
           <div className="flex items-center gap-4">
              <i className="fa-brands fa-github text-3xl text-white"></i>
              <h3 className="text-lg font-bold text-white">Bulut Senkronizasyonu</h3>
           </div>
           <p className="text-xs text-slate-400">Tüm anahtar ve sohbet geçmişinizi kendi GitHub deponuzda yedekleyin.</p>

           <form onSubmit={saveSyncSettings} className="space-y-4 pt-4 border-t border-slate-800">
              <div className="flex items-center gap-3 mb-4">
                <input
                  type="checkbox"
                  checked={settings.enabled}
                  onChange={(e) => setSettings({...settings, enabled: e.target.checked})}
                  className="w-5 h-5 accent-primary"
                />
                <label className="text-sm font-bold text-slate-300">GitHub Senkronizasyonunu Etkinleştir</label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">GitHub Token</label>
                  <input
                    type="password"
                    value={settings.token}
                    onChange={(e) => setSettings({...settings, token: e.target.value})}
                    placeholder="ghp_..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-primary transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Repo (Kullanıcı/Repo)</label>
                  <input
                    type="text"
                    value={settings.repo}
                    onChange={(e) => setSettings({...settings, repo: e.target.value})}
                    placeholder="dadasersin/backup-repo"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-primary transition-all"
                  />
                </div>
              </div>

              <button type="submit" className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
                AYARLARI KAYDET
              </button>

              <button type="button" onClick={onSyncNow} className="w-full py-4 border border-primary/30 text-primary rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary/10 transition-all">
                ŞİMDİ SENKRONİZE ET
              </button>
           </form>
        </section>
      </div>
    </div>
  );
};

export default SettingsView;
