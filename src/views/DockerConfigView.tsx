import React, { useState } from 'react';
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { getAvailableKeys, markKeyAsExhausted } from '../utils/apiPool';
import type { AnalysisResult } from "../types";

const DockerConfigView: React.FC = () => {
  const [errorInput, setErrorInput] = useState<string>(
    `==> Cloning from https://github.com/dadasersin/n8n-denemesi
error: failed to solve: failed to read dockerfile: open Dockerfile: no such file or directory`
  );
  const [contextInput, setContextInput] = useState<string>('Cloud platform (Render/Railway) deployment for n8n-denemesi');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!errorInput.trim()) return;

    setLoading(true);
    setResult(null);
    setErrorMessage(null);

    const availableKeys = getAvailableKeys('gemini');

    if (availableKeys.length === 0) {
      setErrorMessage("Lütfen Ayarlar sayfasından bir Gemini API anahtarı ekleyin.");
      setLoading(false);
      return;
    }

    let success = false;
    for (const keyEntry of availableKeys) {
      try {
        const genAI = new GoogleGenerativeAI(keyEntry.key);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });

        const prompt = `
        Analyze the following Docker build error and provide a detailed explanation, a solution, and the necessary configuration files (Dockerfile, docker-compose.yml, etc.).
        User Context: ${contextInput}
        Error Message: ${errorInput}
        LANGUAGE: Respond with 'explanation' and 'solution' in TURKISH.
        Response Format (JSON):
        - explanation: (String)
        - solution: (String)
        - files: Array of { name: string, language: string, content: string }
      `;

      // Use JSON mode if possible or parse text
      const response = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
           responseMimeType: "application/json",
           responseSchema: {
             type: SchemaType.OBJECT,
             properties: {
               explanation: { type: SchemaType.STRING },
               solution: { type: SchemaType.STRING },
               files: {
                 type: SchemaType.ARRAY,
                 items: {
                   type: SchemaType.OBJECT,
                   properties: {
                     name: { type: SchemaType.STRING },
                     language: { type: SchemaType.STRING },
                     content: { type: SchemaType.STRING }
                   },
                   required: ["name", "language", "content"]
                 }
               }
             },
             required: ["explanation", "solution", "files"]
           }
        }
      });

        const data = JSON.parse(response.response.text());
        setResult(data);
        success = true;
        break;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.error(`Analysis error [${keyEntry.label}]:`, err);
        if (err.message?.includes('429') || err.message?.toLowerCase().includes('quota')) {
          markKeyAsExhausted(keyEntry.id);
          continue;
        } else {
          setErrorMessage(err.message || 'Analiz başarısız oldu.');
          break;
        }
      }
    }

    if (!success && availableKeys.length > 0 && !errorMessage) {
      setErrorMessage("Tüm API anahtarlarının kotası dolmuş veya bağlantı hatası oluştu.");
    }
    setLoading(false);
  };

  return (
    <div className="p-4 lg:p-8 h-full overflow-y-auto bg-brandDark pb-32">
      <div className="max-w-[1400px] mx-auto space-y-8 animate-in fade-in duration-700">
        <header className="flex items-center gap-6 p-6 glass-panel rounded-[2rem] border border-white/10">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/20">
              <i className="fa-solid fa-microchip text-3xl text-white"></i>
            </div>
            <div>
              <h1 className="text-2xl font-black text-white italic uppercase tracking-tighter">DockerConfig AI</h1>
              <p className="text-[10px] uppercase tracking-widest text-primary font-black">Cloud Build Engine & DevOps Intelligence</p>
            </div>
            <div className="ml-auto hidden md:flex items-center gap-2 text-[10px] text-slate-500 bg-slate-900/50 px-4 py-2 rounded-full border border-white/5 font-black uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Sistem Aktif: Gemini 1.5 Flash
            </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* Input Section */}
          <div className="xl:col-span-5 space-y-6">
            <div className="glass-panel p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
               <h2 className="text-xs font-black text-slate-400 mb-8 uppercase tracking-[0.2em] flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(13,89,242,0.6)]"></div>
                Cloud Build Logları
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-wider px-1">Terminal Trace</label>
                  <textarea
                    value={errorInput}
                    onChange={(e) => setErrorInput(e.target.value)}
                    placeholder="Build loglarını buraya yapıştırın..."
                    className="w-full h-72 bg-black/40 border border-white/5 rounded-2xl p-5 text-primary focus:border-primary/40 transition-all font-mono text-xs leading-relaxed outline-none scrollbar-hide"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-wider px-1">Ortam Bağlamı</label>
                  <input
                    type="text"
                    value={contextInput}
                    onChange={(e) => setContextInput(e.target.value)}
                    placeholder="Örn: Render Web Service, n8n Deployment..."
                    className="w-full bg-black/40 border border-white/5 rounded-xl px-5 py-4 text-slate-300 focus:border-primary/40 transition-all text-xs outline-none"
                  />
                </div>

                <button
                  onClick={handleAnalyze}
                  disabled={loading}
                  className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-4 transition-all transform active:scale-[0.97] shadow-2xl ${
                    loading ? 'bg-gray-800 text-slate-500' : 'bg-primary hover:brightness-110 text-white'
                  }`}
                >
                  {loading ? <i className="fa-solid fa-spinner animate-spin"></i> : <i className="fa-solid fa-wand-magic-sparkles"></i>}
                  TEŞHİS ET VE DÜZELT
                </button>
              </div>
            </div>

            <div className="p-6 bg-primary/5 border border-primary/10 rounded-2xl">
                <p className="text-[10px] text-slate-400 leading-relaxed font-bold uppercase tracking-tight">
                   <i className="fa-solid fa-circle-info text-primary mr-2"></i>
                   Hata loglarını analiz ederek otomatik Dockerfile ve yapılandırma önerileri sunar. n8n ve Node.js projeleri için optimize edilmiştir.
                </p>
            </div>
          </div>

          {/* Results Section */}
          <div className="xl:col-span-7">
            {!result && !loading && !errorMessage && (
              <div className="h-full border-2 border-dashed border-white/5 rounded-[2.5rem] flex flex-col items-center justify-center p-12 text-center opacity-20">
                <i className="fa-solid fa-terminal text-6xl mb-6 text-white"></i>
                <h3 className="text-xl font-bold text-white uppercase tracking-widest">Veri Bekleniyor</h3>
                <p className="text-slate-400 mt-4 max-w-sm text-sm">AI destekli hata analizi için sol tarafa build loglarını ekleyin.</p>
              </div>
            )}

            {errorMessage && (
              <div className="p-10 bg-red-900/10 border border-red-500/20 rounded-[2.5rem] text-red-400 animate-in fade-in">
                <div className="flex items-start gap-5">
                  <i className="fa-solid fa-triangle-exclamation text-3xl"></i>
                  <div>
                    <h3 className="font-black text-xl uppercase tracking-wider">Hata Oluştu</h3>
                    <p className="mt-2 text-slate-400 leading-relaxed">{errorMessage}</p>
                    <button onClick={handleAnalyze} className="mt-8 px-8 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition-all shadow-lg">Yeniden Dene</button>
                  </div>
                </div>
              </div>
            )}

            {result && (
              <div className="space-y-6 animate-in slide-in-from-right-10 duration-700">
                <div className="glass-panel rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10">
                  <div className="p-8 lg:p-10 border-b border-white/5 bg-white/5">
                    <div className="flex items-center justify-between mb-8">
                      <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] flex items-center gap-3">
                         <div className="w-2 h-2 rounded-full bg-primary shadow-lg"></div>
                         Analiz Sonucu
                      </span>
                      <span className="text-[8px] font-black text-emerald-500 bg-emerald-500/10 px-4 py-1.5 rounded-full border border-emerald-500/20 uppercase tracking-widest">Çözüldü</span>
                    </div>

                    <div className="space-y-8">
                       <div>
                          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Gözlem</h3>
                          <p className="text-slate-300 text-sm leading-relaxed bg-black/20 p-6 rounded-2xl border border-white/5">{result.explanation}</p>
                       </div>
                       <div>
                          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Çözüm Yolu</h3>
                          <p className="text-slate-300 text-sm leading-relaxed bg-primary/5 p-6 rounded-2xl border border-primary/10 italic">{result.solution}</p>
                       </div>
                    </div>
                  </div>

                  <div className="p-8 lg:p-10 bg-black/40">
                     <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-3">
                        <i className="fa-solid fa-code text-primary"></i> Yapılandırma Dosyaları
                     </h3>
                     <div className="space-y-6">
                        {result.files.map((file, idx) => (
                           <div key={idx} className="space-y-2">
                              <div className="flex justify-between items-center px-4 py-2 bg-slate-900 border border-white/5 rounded-t-xl">
                                 <span className="text-[10px] font-mono text-primary">{file.name}</span>
                                 <button
                                   onClick={() => { navigator.clipboard.writeText(file.content); alert(`${file.name} kopyalandı.`); }}
                                   className="text-[9px] font-black text-slate-500 hover:text-white transition-colors"
                                 >KOPYALA</button>
                              </div>
                              <pre className="bg-black p-5 rounded-b-xl border-x border-b border-white/5 overflow-x-auto text-[11px] font-mono text-slate-400 custom-scrollbar">
                                 <code>{file.content}</code>
                              </pre>
                           </div>
                        ))}
                     </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DockerConfigView;
