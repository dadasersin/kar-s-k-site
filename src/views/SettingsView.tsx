import React, { useState, useEffect } from 'react';
import { getStorageItem, setStorageItem } from '../utils/storage';
import { recordAction } from '../utils/history';
import { getAllKeys, markKeyAsExhausted } from '../utils/apiPool';
import type { ApiKeyEntry, ApiProvider, SyncSettings } from '../types';

const SettingsView: React.FC = () => {
  const [apiKeys, setApiKeys] = useState<ApiKeyEntry[]>([]);
  const [provider, setProvider] = useState<ApiProvider>('gemini');
  const [modelName, setModelName] = useState('gemini-2.0-flash');
  const [isCustomModel, setIsCustomModel] = useState(false);
  const [keyLabel, setKeyLabel] = useState('');
  const [newKey, setNewKey] = useState('');
  const [customUrl, setCustomUrl] = useState('');
  const [showKey, setShowKey] = useState(false);

  const [settings, setSettings] = useState<SyncSettings>(getStorageItem('sync_settings', {
    enabled: false,
    token: '',
    repo: '',
    path: 'portal-state.json',
    customApiKeys: []
  }));

  const [supabaseSettings, setSupabaseSettings] = useState({
    url: getStorageItem('VITE_SUPABASE_URL', ''),
    anonKey: getStorageItem('VITE_SUPABASE_ANON_KEY', '')
  });

  useEffect(() => {
    setApiKeys(getAllKeys());
  }, [settings]);

  const handleGeminiModelChange = (val: string) => {
    if (val === 'custom') {
      setIsCustomModel(true);
      setModelName('');
    } else {
      setIsCustomModel(false);
      setModelName(val);
    }
  };

  const addApiKey = () => {
    if (!newKey.trim()) return;

    const entry: ApiKeyEntry = {
      id: Math.random().toString(36).substr(2, 9),
      key: newKey.trim(),
      label: keyLabel.trim() || `${provider.toUpperCase()} Key`,
      provider,
      modelName,
      baseUrl: customUrl || undefined,
      isQuotaExhausted: false,
      usageCount: 0,
      quotaLimit: provider === 'gemini' ? 1500 : 500
    };

    const updated = { ...settings, customApiKeys: [...(settings.customApiKeys || []), entry] };
    setSettings(updated);
    setStorageItem('sync_settings', updated);
    setNewKey('');
    setKeyLabel('');
    recordAction('Ayarlar', `Yeni API anahtarı eklendi: ${entry.label}`);
  };

  const removeKey = (id: string) => {
    if (id.startsWith('env-')) {
        alert("Sistem anahtarları silinemez.");
        return;
    }
    const updated = { ...settings, customApiKeys: settings.customApiKeys.filter(k => k.id !== id) };
    setSettings(updated);
    setStorageItem('sync_settings', updated);
    recordAction('Ayarlar', "API anahtarı kaldırıldı.");
  };

  const resetQuotas = () => {
     apiKeys.forEach(k => {
        if (k.id.startsWith('env-')) {
            localStorage.removeItem(`exhausted_env_${k.provider}`);
            localStorage.setItem(`usage_env_${k.provider}`, '0');
        }
     });
     const updated = {
        ...settings,
        customApiKeys: settings.customApiKeys.map(k => ({ ...k, isQuotaExhausted: false, usageCount: 0 }))
     };
     setSettings(updated);
     setStorageItem('sync_settings', updated);
     window.dispatchEvent(new Event('storage'));
     alert("Tüm kotalar sıfırlandı.");
  };

  const saveSyncSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setStorageItem('sync_settings', settings);
    recordAction('Ayarlar', "GitHub senkronizasyon ayarları güncellendi.");
    alert("Ayarlar kaydedildi.");
  };

  const saveSupabase = () => {
    setStorageItem('VITE_SUPABASE_URL', supabaseSettings.url);
    setStorageItem('VITE_SUPABASE_ANON_KEY', supabaseSettings.anonKey);
    recordAction('Ayarlar', "Supabase bağlantı bilgileri güncellendi.");
    alert("Supabase ayarları kaydedildi.");
  };

  return (
    <div className="flex-1 p-4 lg:p-12 overflow-y-auto bg-brandDark/20 pb-40">
      <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-700">
        <header className="border-b border-white/5 pb-8">
          <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase">Sistem <span className="text-primary">Ayarları</span></h2>
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-2 ml-1">Yapılandırma ve Entegrasyon Merkezi</p>
        </header>

        <section className="portal-card p-8 bg-brandDark/40">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
                <i className="fa-solid fa-key text-3xl text-primary"></i>
                <h3 className="text-lg font-bold text-white uppercase tracking-widest">API Anahtar Havuzu</h3>
            </div>
            <button onClick={resetQuotas} className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border border-white/5">KOTALARI YENİLE</button>
          </div>

          <div className="space-y-4 mb-10">
            {apiKeys.map(k => (
              <div key={k.id} className="flex items-center justify-between p-4 bg-black/40 border border-white/5 rounded-2xl group hover:border-primary/30 transition-all">
                <div className="flex items-center gap-4 overflow-hidden">
                  <div className={`w-10 h-10 rounded-xl ${k.isQuotaExhausted ? 'bg-red-500/20 text-red-400' : 'bg-primary/20 text-primary'} flex items-center justify-center shrink-0`}>
                    <i className={`fa-solid ${k.provider === 'gemini' ? 'fa-gem' : 'fa-brain'} text-sm`}></i>
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs font-black text-white uppercase truncate">{k.label}</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase truncate">{k.provider} • {k.modelName} • ****{k.key.slice(-4)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                    <div className="hidden sm:block text-right">
                        <p className="text-[9px] font-black text-slate-600 uppercase">Usage</p>
                        <p className="text-[10px] font-black text-slate-400">{k.usageCount || 0} / {k.quotaLimit || 500}</p>
                    </div>
                    {!k.id.startsWith('env-') && (
                        <button onClick={() => removeKey(k.id)} className="w-8 h-8 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"><i className="fa-solid fa-trash-can text-xs"></i></button>
                    )}
                </div>
              </div>
            ))}
          </div>

          <div className="p-6 bg-white/5 border border-white/10 rounded-3xl space-y-6">
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase px-1">Servis Sağlayıcı</label>
                  <select
                    value={provider}
                    onChange={(e) => setProvider(e.target.value as ApiProvider)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 outline-none focus:border-primary transition-all"
                  >
                    <option value="gemini">Google Gemini</option>
                    <option value="anthropic">Anthropic (Claude)</option>
                    <option value="deepseek">DeepSeek AI</option>
                    <option value="grok">xAI Grok</option>
                    <option value="openai">OpenAI</option>
                    <option value="custom">Özel (Base URL ile)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase px-1">Model Adı</label>
                  {provider === 'gemini' && !isCustomModel ? (
                    <select
                        value={modelName}
                        onChange={(e) => handleGeminiModelChange(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 outline-none focus:border-primary transition-all"
                    >
                        <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
                        <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
                        <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
                        <option value="gemini-exp-1206">Gemini Experimental 1206</option>
                        <option value="custom">Özel Model...</option>
                    </select>
                  ) : (
                    <div className="relative">
                        <input
                            type="text"
                            value={modelName}
                            onChange={(e) => setModelName(e.target.value)}
                            placeholder={provider === 'gemini' ? "örn: gemini-3.1" : "örn: claude-3-5-sonnet-latest"}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 outline-none focus:border-primary transition-all"
                        />
                        {isCustomModel && provider === 'gemini' && (
                            <button
                                onClick={() => setIsCustomModel(false)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-primary font-bold"
                            >
                                LİSTEYE DÖN
                            </button>
                        )}
                    </div>
                  )}
                </div>
             </div>

             {(provider !== 'gemini' && provider !== 'anthropic' && provider !== 'openai') && (
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
                <div className="relative">
                    <input
                      type={showKey ? "text" : "password"}
                      value={newKey}
                      onChange={(e) => setNewKey(e.target.value)}
                      placeholder="API Key"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-12 py-3 text-sm text-slate-200 outline-none focus:border-primary transition-all"
                    />
                    <button
                        onClick={() => setShowKey(!showKey)}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                    >
                        <i className={`fa-solid ${showKey ? 'fa-eye-slash' : 'fa-eye'} text-xs`}></i>
                    </button>
                </div>
             </div>

             <button onClick={addApiKey} className="w-full py-4 bg-primary hover:brightness-110 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-xl active:scale-95">
               HAVUZA EKLE
             </button>
          </div>
        </section>

        <section className="portal-card p-8 bg-brandDark/40 space-y-6">
           <div className="flex items-center gap-4">
              <i className="fa-brands fa-github text-3xl text-white"></i>
              <h3 className="text-lg font-bold text-white uppercase tracking-widest">GitHub Senkronizasyonu</h3>
           </div>
           <p className="text-xs text-slate-400 font-bold uppercase tracking-tighter">Tüm anahtar ve sohbet geçmişinizi kendi GitHub deponuzda yedekleyin.</p>

           <form onSubmit={saveSyncSettings} className="space-y-4 pt-4 border-t border-white/5">
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
           </form>
        </section>

        <section className="portal-card p-8 bg-brandDark/40 space-y-6">
           <div className="flex items-center gap-4">
              <i className="fa-solid fa-database text-3xl text-primary"></i>
              <h3 className="text-lg font-bold text-white uppercase tracking-widest">Merkezi Veritabanı (Supabase)</h3>
           </div>
           <p className="text-xs text-slate-400 font-bold uppercase tracking-tighter">Modülleri ve ayarları kalıcı olarak bulutta saklamak için bir Supabase projesi bağlayın.</p>

           <div className="space-y-4 pt-4 border-t border-white/5">
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
