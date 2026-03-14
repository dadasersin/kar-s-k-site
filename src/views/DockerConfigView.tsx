import React, { useState } from 'react';
import { executeAiRequest } from '../utils/apiPool';
import { recordAction } from '../utils/history';

interface AnalysisResult {
  explanation: string;
  solution: string;
  files: { name: string; language: string; content: string }[];
}

const DockerConfigView: React.FC = () => {
  const [errorInput, setErrorInput] = useState('');
  const [contextInput, setContextInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleAnalyze = async () => {
    if (!errorInput.trim()) return;
    setLoading(true);
    setResult(null);
    setErrorMessage('');
    recordAction('Docker AI', `Build hatası analiz ediliyor: ${contextInput || 'Genel'}`);

    const prompt = `
      Aşağıdaki Docker build hatasını analiz et ve çözüm üret.
      JSON formatında şu yapıda yanıt ver:
      {
        "explanation": "Hatanın nedeninin açıklaması",
        "solution": "Nasıl çözüleceği",
        "files": [{"name": "dosya_adı", "language": "dil", "content": "içerik"}]
      }

      HATA: ${errorInput}
      BAĞLAM: ${contextInput}
    `;

    try {
      const response = await executeAiRequest(prompt, { provider: 'gemini' });
      // Extract JSON from response
      const jsonStr = response.text.match(/\{[\s\S]*\}/)?.[0] || response.text;
      const data = JSON.parse(jsonStr);
      setResult(data);
    } catch (err: any) {
      setErrorMessage("Analiz başarısız oldu: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 lg:p-8 h-full overflow-y-auto bg-brandDark pb-32">
      <div className="max-w-[1400px] mx-auto space-y-8">
        <header className="flex items-center gap-6 p-6 glass-panel rounded-[2rem] border border-white/10">
            <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center">
              <i className="fa-solid fa-microchip text-3xl text-white"></i>
            </div>
            <div>
              <h1 className="text-2xl font-black text-white italic uppercase tracking-tighter">DockerConfig AI</h1>
              <p className="text-[10px] uppercase tracking-widest text-primary font-black">Cloud Build Engine & DevOps Intelligence</p>
            </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          <div className="xl:col-span-5 space-y-6">
            <div className="glass-panel p-8 rounded-[2.5rem] bg-white/5 border border-white/10">
                <textarea
                    value={errorInput}
                    onChange={(e) => setErrorInput(e.target.value)}
                    placeholder="Build loglarını buraya yapıştırın..."
                    className="w-full h-72 bg-black/40 border border-white/5 rounded-2xl p-5 text-indigo-400 font-mono text-xs outline-none mb-6"
                />
                <input
                    type="text"
                    value={contextInput}
                    onChange={(e) => setContextInput(e.target.value)}
                    placeholder="Bağlam (Örn: Render deployment)"
                    className="w-full bg-black/40 border border-white/5 rounded-xl px-5 py-4 text-slate-300 text-xs outline-none mb-6"
                />
                <button onClick={handleAnalyze} disabled={loading} className="w-full py-5 bg-primary text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl transition-all hover:scale-[1.02]">
                  {loading ? 'ANALİZ EDİLİYOR...' : 'TEŞHİS ET VE DÜZELT'}
                </button>
                {errorMessage && <p className="mt-4 text-[10px] text-red-500 font-black text-center uppercase tracking-widest">{errorMessage}</p>}
            </div>
          </div>

          <div className="xl:col-span-7">
            {result && (
              <div className="space-y-6 animate-in slide-in-from-right-10">
                <div className="glass-panel p-8 rounded-[2.5rem] border border-white/10 bg-white/5">
                   <h3 className="text-xs font-black text-primary uppercase tracking-widest mb-4">Gözlem</h3>
                   <p className="text-slate-300 text-sm leading-relaxed mb-8">{result.explanation}</p>
                   <h3 className="text-xs font-black text-primary uppercase tracking-widest mb-4">Çözüm</h3>
                   <p className="text-slate-300 text-sm leading-relaxed italic">{result.solution}</p>
                </div>
                {result.files.map((f, i) => (
                    <div key={i} className="bg-black/40 border border-white/5 rounded-3xl overflow-hidden">
                        <div className="px-6 py-3 bg-white/5 border-b border-white/5 text-[10px] font-mono text-primary flex justify-between items-center">
                            <span>{f.name}</span>
                            <span className="opacity-30">{f.language}</span>
                        </div>
                        <pre className="p-6 text-[11px] font-mono text-slate-400 overflow-x-auto"><code>{f.content}</code></pre>
                    </div>
                ))}
              </div>
            )}
            {!result && !loading && (
                 <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-slate-700 opacity-20 italic">
                    <i className="fa-solid fa-terminal text-6xl mb-4"></i>
                    <p className="uppercase tracking-[0.3em] text-[10px] font-black">Analiz sonucu burada görüntülenecek</p>
                 </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DockerConfigView;
