
import React, { useState, useEffect } from 'react';
import type { SyncSettings, ApiKeyEntry, ApiProvider } from '../types';

interface SettingsProps {
  onSyncNow: () => void;
}

const SettingsView: React.FC<SettingsProps> = ({ onSyncNow }) => {
  const [settings, setSettings] = useState<SyncSettings>({
    enabled: false,
    token: '',
    repo: '',
    path: 'moduler-ai-backup.json',
    customApiKeys: []
  });

  const [newKey, setNewKey] = useState('');
  const [keyLabel, setKeyLabel] = useState('');
  const [provider, setProvider] = useState<ApiProvider>('gemini');
  const [modelName, setModelName] = useState('gemini-3-flash-preview');
  const [customUrl, setCustomUrl] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('sync_settings');
    if (saved) {
      const parsed = JSON.parse(saved);
      setSettings(prev => ({ ...prev, ...parsed }));
    }
  }, []);

  const handleProviderChange = (p: ApiProvider) => {
    setProvider(p);
    if (p === 'gemini') {
      setModelName('gemini-3-flash-preview');
      setCustomUrl('');
    } else if (p === 'deepseek') {
      setModelName('deepseek-chat');
      setCustomUrl('https://api.deepseek.com/v1');
    } else if (p === 'grok') {
      setModelName('grok-2-latest');
      setCustomUrl('https://api.x.ai/v1');
    } else if (p === 'openai') {
      setModelName('gpt-4o-mini');
      setCustomUrl('https://api.openai.com/v1');
    }
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
      isQuotaExhausted: false
    };
    const updated = { ...settings, customApiKeys: [...settings.customApiKeys, entry] };
    setSettings(updated);
    localStorage.setItem('sync_settings', JSON.stringify(updated));
    setNewKey('');
    setKeyLabel('');
  };

  const removeKey = (id: string) => {
    const updated = { ...settings, customApiKeys: settings.customApiKeys.filter(k => k.id !== id) };
    setSettings(updated);
    localStorage.setItem('sync_settings', JSON.stringify(updated));
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

  const saveSyncSettings = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('sync_settings', JSON.stringify(settings));
    alert('Senkronizasyon ayarları kaydedildi.');
  };

  return (
    <div className="flex-1 p-4 md:p-8 overflow-y-auto bg-brandDark pb-32">
      <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <header>
          <h1 className="text-3xl font-black mb-2 flex items-center gap-3 text-white">
             <i className="fa-solid fa-sliders text-primary"></i>
             Sistem Yapılandırması
          </h1>
          <p className="text-slate-400 text-sm">API havuzunu yönetin ve verilerinizi GitHub ile senkronize edin.</p>
        </header>

        <section className="glass-panel p-6 rounded-[2.5rem] border border-slate-800 shadow-2xl space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold flex items-center gap-2 text-white">
              <i className="fa-solid fa-key text-amber-500"></i>
              Aktif Anahtarlar
            </h3>
            <button onClick={resetQuotas} className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-blue-400 transition-colors">Kotaları Yenile</button>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {settings.customApiKeys.length === 0 ? (
              <div className="text-center py-10 border-2 border-dashed border-slate-800 rounded-3xl opacity-30">
                <i className="fa-solid fa-vault text-3xl mb-3 text-white"></i>
                <p className="text-xs uppercase font-bold tracking-widest text-white">Henüz bir anahtar eklemediniz</p>
              </div>
            ) : (
              settings.customApiKeys.map(k => (
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
                    {k.isQuotaExhausted && <span className="text-[8px] font-black text-red-500 uppercase px-2 py-1 bg-red-500/10 rounded-full border border-red-500/20">KOTA DOLU</span>}
                    <button onClick={() => removeKey(k.id)} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 hover:text-red-500 transition-colors">
                      <i className="fa-solid fa-trash-can"></i>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* YENİ ANAHTAR EKLEME FORMU */}
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

              <button type="submit" className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                AYARLARI KAYDET
              </button>

              <button type="button" onClick={onSyncNow} className="w-full py-3 border border-primary/30 text-primary rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary/10 transition-all">
                ŞİMDİ SENKRONİZE ET
              </button>
           </form>
        </section>
      </div>
    </div>
  );
};

export default SettingsView;
