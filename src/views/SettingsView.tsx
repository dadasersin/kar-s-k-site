import React, { useState, useEffect } from 'react';
import type { ApiKeyEntry, ApiProvider, SyncSettings } from '../types';
import { getAllKeys } from '../utils/apiPool';
import { getStorageItem } from '../utils/storage';

const SettingsView: React.FC = () => {
  const [settings, setSettings] = useState<SyncSettings>({
    enabled: false,
    token: '',
    repo: '',
    customApiKeys: []
  });

  const [provider, setProvider] = useState<ApiProvider>('gemini');
  const [modelName, setModelName] = useState('gemini-2.0-flash');
  const [newKey, setNewKey] = useState('');
  const [keyLabel, setKeyLabel] = useState('');
  const [customUrl, setCustomUrl] = useState('');
  const [apiKeys, setApiKeys] = useState<ApiKeyEntry[]>([]);

  const [supabaseSettings, setSupabaseSettings] = useState({
    url: localStorage.getItem('VITE_SUPABASE_URL') || '',
    anonKey: localStorage.getItem('VITE_SUPABASE_ANON_KEY') || ''
  });

  useEffect(() => {
    const saved = getStorageItem('sync_settings', { enabled: false, token: '', repo: '', customApiKeys: [] });
    setSettings(saved);
    setApiKeys(getAllKeys());
  }, []);

  const handleProviderChange = (p: ApiProvider) => {
    setProvider(p);
    if (p === 'gemini') setModelName('gemini-2.0-flash');
    else if (p === 'deepseek') setModelName('deepseek-chat');
    else if (p === 'grok') setModelName('grok-beta');
    else if (p === 'openai') setModelName('gpt-4o-mini');
  };

  const saveSyncSettings = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('sync_settings', JSON.stringify(settings));
    alert('GitHub senkronizasyon ayarları kaydedildi.');
  };

  const saveSupabase = () => {
    localStorage.setItem('VITE_SUPABASE_URL', supabaseSettings.url);
    localStorage.setItem('VITE_SUPABASE_ANON_KEY', supabaseSettings.anonKey);
    alert('Supabase bağlantı bilgileri kaydedildi.');
  };

  const addApiKey = () => {
    if (!newKey.trim()) return;
    const entry: ApiKeyEntry = {
      id: Date.now().toString(),
      key: newKey.trim(),
      label: keyLabel.trim() || `${provider.toUpperCase()} - ${modelName}`,
      provider: provider,
      modelName: modelName,
      baseUrl: customUrl,
      isQuotaExhausted: false,
      usageCount: 0,
      quotaLimit: provider === 'gemini' ? 1500 : 500
    };
    const updated = { ...settings, customApiKeys: [...settings.customApiKeys, entry] };
    setSettings(updated);
    localStorage.setItem('sync_settings', JSON.stringify(updated));
    setNewKey('');
    setKeyLabel('');
    setApiKeys(getAllKeys());
  };

  const removeKey = (id: string) => {
    if (id.startsWith('env-')) {
        alert("Sistem (Environment) anahtarları silinemez.");
        return;
    }
    const updated = { ...settings, customApiKeys: settings.customApiKeys.filter(k => k.id !== id) };
    setSettings(updated);
    localStorage.setItem('sync_settings', JSON.stringify(updated));
    setApiKeys(getAllKeys());
  };

  const onSyncNow = async () => {
    alert("GitHub senkronizasyonu başlatıldı...");
  };

  return (
    <div className="flex-1 p-4 lg:p-10 overflow-y-auto bg-slate-950 pb-32">
      <div className="max-w-4xl mx-auto space-y-12">
        <header>
          <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-tight">Ayarlar ve API Yönetimi</h2>
          <p className="text-xs text-gray-500 font-black uppercase tracking-widest mt-2">Portal çekirdek yapılandırması</p>
        </header>

        <section className="glass-panel p-8 rounded-[2.5rem] border border-slate-800 shadow-xl space-y-6">
          <div className="flex items-center gap-4">
             <i className="fa-solid fa-key text-3xl text-primary"></i>
             <h3 className="text-lg font-bold text-white">API Havuzu</h3>
          </div>

          <div className="space-y-4">
            {apiKeys.length === 0 ? (
              <p className="text-slate-600 italic text-sm">Henüz bir anahtar eklenmemiş.</p>
            ) : (
              apiKeys.map(k => (
                <div key={k.id} className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${k.isQuotaExhausted ? 'bg-red-500/5 border-red-500/20' : 'bg-slate-900 border-slate-800'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${k.isQuotaExhausted ? 'bg-slate-800' : 'bg-primary/20 text-primary'}`}>
                      <i className={`fa-solid ${k.provider === 'gemini' ? 'fa-gem' : 'fa-brain'} text-sm`}></i>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-100">{k.label}</p>
                      <p className="text-[9px] text-slate-500 uppercase tracking-widest font-black">
                        {k.provider} • {k.modelName} • {k.usageCount || 0}/{k.quotaLimit || 500}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {k.isQuotaExhausted && <span className="text-[8px] font-black text-red-500 uppercase px-2 py-1 bg-red-500/10 rounded-full border border-red-500/20">KOTA DOLU</span>}
                    <button onClick={() => removeKey(k.id)} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 hover:text-red-500 transition-colors">
                      <i className="fa-solid fa-trash-can"></i>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="pt-6 border-t border-slate-800 space-y-4">
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase px-1">Servis Sağlayıcı</label>
                  <select
                    value={provider}
                    onChange={(e) => handleProviderChange(e.target.value as ApiProvider)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 outline-none focus:border-primary transition-all"
                  >
                    <option value="gemini">Google Gemini</option>
                    <option value="deepseek">DeepSeek AI</option>
                    <option value="grok">xAI Grok</option>
                    <option value="openai">OpenAI</option>
                    <option value="custom">Özel (Base URL ile)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase px-1">Model Adı</label>
                  {provider === 'gemini' ? (
                    <select
                        value={modelName}
                        onChange={(e) => setModelName(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 outline-none focus:border-primary transition-all"
                    >
                        <option value="gemini-2.0-flash">Gemini 2.0 Flash (Hızlı)</option>
                        <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
                        <option value="gemini-1.5-pro">Gemini 1.5 Pro (Zeki)</option>
                        <option value="gemini-1.0-pro">Gemini 1.0 Pro</option>
                    </select>
                  ) : (
                    <input
                        type="text"
                        value={modelName}
                        onChange={(e) => setModelName(e.target.value)}
                        placeholder="örn: deepseek-chat"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 outline-none focus:border-primary transition-all"
                    />
                  )}
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

             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

        <section className="glass-panel p-8 rounded-[2.5rem] border border-slate-800 shadow-xl space-y-6">
           <div className="flex items-center gap-4">
              <i className="fa-brands fa-github text-3xl text-white"></i>
              <h3 className="text-lg font-bold text-white">GitHub Senkronizasyonu</h3>
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

              <button type="submit" className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                AYARLARI KAYDET
              </button>

              <button type="button" onClick={onSyncNow} className="w-full py-3 border border-primary/30 text-primary rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary/10 transition-all">
                ŞİMDİ SENKRONİZE ET
              </button>
           </form>
        </section>

        <section className="glass-panel p-8 rounded-[2.5rem] border border-slate-800 shadow-xl space-y-6">
           <div className="flex items-center gap-4">
              <i className="fa-solid fa-database text-3xl text-primary"></i>
              <h3 className="text-lg font-bold text-white">Merkezi Veritabanı (Supabase)</h3>
           </div>
           <p className="text-xs text-slate-400">Modülleri ve ayarları kalıcı olarak bulutta saklamak için bir Supabase projesi bağlayın.</p>

           <div className="space-y-4 pt-4 border-t border-slate-800">
              <div className="space-y-2">
                 <label className="text-[10px] font-bold text-slate-500 uppercase">Supabase URL</label>
                 <input
                   type="text"
                   value={supabaseSettings.url}
                   onChange={(e) => setSupabaseSettings({...supabaseSettings, url: e.target.value})}
                   placeholder="https://xyz.supabase.co"
                   className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-primary transition-all"
                 />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-bold text-slate-500 uppercase">Anon Key</label>
                 <input
                   type="password"
                   value={supabaseSettings.anonKey}
                   onChange={(e) => setSupabaseSettings({...supabaseSettings, anonKey: e.target.value})}
                   placeholder="eyJhbGci..."
                   className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-primary transition-all"
                 />
              </div>
              <button onClick={saveSupabase} className="w-full py-3 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl">
                 VERİTABANI BAĞLANTISINI KAYDET
              </button>
           </div>
        </section>
      </div>
    </div>
  );
};

export default SettingsView;
