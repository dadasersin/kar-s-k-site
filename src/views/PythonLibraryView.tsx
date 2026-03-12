import React, { useState } from 'react';
import { getAllPythonDocs } from '../utils/pythonKnowledge';
import { Terminal, Code2, BookOpen, Search, Copy, Check } from 'lucide-react';

const PythonLibraryView: React.FC = () => {
  const [snippets] = useState(getAllPythonDocs());
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = snippets.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopy = (code: string, name: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(name);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="p-4 lg:p-10 h-full overflow-y-auto bg-brandDark pb-32">
      <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-8">
          <div>
            <div className="flex items-center gap-4 mb-2">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20">
                    <Code2 className="text-white w-7 h-7" />
                </div>
                <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">Python Kütüphanesi</h2>
            </div>
            <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Yerel Otomasyon & Analiz Scriptleri (Off-Chain)</p>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
                type="text"
                placeholder="Script ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-xs font-bold uppercase tracking-widest outline-none focus:border-blue-500 transition-all text-white"
            />
          </div>
        </header>

        <div className="grid grid-cols-1 gap-6">
          {filtered.length === 0 ? (
            <div className="py-20 text-center opacity-20">
                <Terminal className="w-16 h-16 mx-auto mb-4" />
                <p className="font-black uppercase tracking-[0.3em]">Script bulunamadı</p>
            </div>
          ) : (
            filtered.map(snippet => (
              <div key={snippet.name} className="glass-panel p-8 rounded-[2.5rem] border border-white/10 bg-white/5 hover:border-blue-500/30 transition-all group">
                <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                            <BookOpen className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white uppercase tracking-tight">{snippet.name}</h3>
                            <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest bg-blue-500/10 px-2 py-0.5 rounded">{snippet.category}</span>
                        </div>
                    </div>
                    <button
                        onClick={() => handleCopy(snippet.code, snippet.name)}
                        className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-black uppercase text-slate-400 transition-all border border-white/5"
                    >
                        {copiedId === snippet.name ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                        {copiedId === snippet.name ? 'KOPYALANDI' : 'KODU KOPYALA'}
                    </button>
                </div>

                <p className="text-sm text-slate-400 mb-6 leading-relaxed font-bold">{snippet.description}</p>

                <div className="bg-black/40 rounded-3xl p-6 border border-white/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-3 opacity-10">
                        <Code2 className="w-20 h-20" />
                    </div>
                    <pre className="text-[11px] font-mono text-blue-400/90 overflow-x-auto custom-scrollbar relative z-10">
                        <code>{snippet.code}</code>
                    </pre>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="bg-blue-600/5 border border-blue-600/10 rounded-[2rem] p-8 flex items-start gap-6">
            <div className="w-12 h-12 rounded-full bg-blue-600/20 flex items-center justify-center shrink-0">
                <Terminal className="text-blue-500 w-6 h-6" />
            </div>
            <div>
                <h4 className="text-white font-bold mb-1 uppercase tracking-tight italic text-sm">Yapay Zeka Entegrasyonu</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-bold uppercase tracking-tighter">
                    "Live AI Developer" ve "Sohbet" modülleri buradaki scriptleri referans alarak kod yazar.
                    Yeni özellikler talep ettiğinizde, sistem önce bu kütüphaneden uygun parçaları arar ve birleştirir.
                    Bu işlem API kotanızı optimize eder ve daha tutarlı kod çıktıları üretir.
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PythonLibraryView;
