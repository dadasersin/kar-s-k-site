import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code, Book, Github, ExternalLink, Search, Loader2, Folder, FileCode, ChevronRight } from 'lucide-react';

interface RepoContent {
  name: string;
  path: string;
  type: 'dir' | 'file';
  download_url: string | null;
  html_url: string;
}

const NdkSamplesView: React.FC = () => {
  const [samples, setSamples] = useState<RepoContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPath, setCurrentPath] = useState('');

  const fetchRepoContent = async (path: string = '') => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://api.github.com/repos/android/ndk-samples/contents/${path}`);
      if (!response.ok) throw new Error('GitHub API hatası. Kota dolmuş olabilir.');
      const data = await response.json();
      setSamples(Array.isArray(data) ? data : []);
      setCurrentPath(path);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRepoContent();
  }, []);

  const filteredSamples = samples.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 lg:p-12 max-w-7xl mx-auto space-y-8 pb-32">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <div className="w-12 h-12 rounded-2xl bg-green-500/20 border border-green-500/30 flex items-center justify-center text-green-400 shadow-xl shadow-green-500/10">
                <Github className="w-7 h-7" />
             </div>
             <div>
                <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase font-sans">Android NDK Explorer</h1>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">android/ndk-samples Repository Entegrasyonu</p>
             </div>
          </div>
        </div>

        <div className="relative group w-full md:w-80">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-primary transition-colors" />
           <input
             type="text"
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
             placeholder="Örneklerde ara..."
             className="w-full bg-surface/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white focus:border-primary outline-none transition-all"
           />
        </div>
      </header>

      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
         <button onClick={() => fetchRepoContent('')} className="hover:text-primary transition-colors">ROOT</button>
         {currentPath.split('/').filter(Boolean).map((part, i, arr) => (
           <React.Fragment key={i}>
             <ChevronRight className="w-3 h-3" />
             <button
               onClick={() => fetchRepoContent(arr.slice(0, i + 1).join('/'))}
               className="hover:text-primary transition-colors"
             >
               {part}
             </button>
           </React.Fragment>
         ))}
      </div>

      <div className="glass-panel p-1 rounded-[2.5rem] border border-white/5 bg-white/5 overflow-hidden min-h-[500px]">
         <div className="bg-brandDark/40 p-6 lg:p-8 rounded-[2.4rem] h-full">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-64 space-y-4">
                 <Loader2 className="w-10 h-10 text-primary animate-spin" />
                 <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">Veriler Çekiliyor...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center h-64 text-center space-y-4">
                 <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20">
                    <ExternalLink className="w-8 h-8" />
                 </div>
                 <div>
                    <h3 className="text-lg font-black text-white uppercase italic mb-1">Bağlantı Hatası</h3>
                    <p className="text-sm text-slate-500 max-w-xs mx-auto">{error}</p>
                 </div>
                 <button onClick={() => fetchRepoContent(currentPath)} className="px-6 py-2 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-lg">Tekrar Dene</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                 {filteredSamples.map((item) => (
                   <motion.div
                     key={item.path}
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     className="group p-5 bg-black/40 border border-white/5 rounded-2xl hover:border-primary/50 transition-all cursor-pointer flex flex-col gap-4"
                     onClick={() => item.type === 'dir' ? fetchRepoContent(item.path) : window.open(item.html_url, '_blank')}
                   >
                      <div className="flex items-center justify-between">
                         <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.type === 'dir' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-green-500/10 text-green-400'}`}>
                            {item.type === 'dir' ? <Folder className="w-5 h-5" /> : <FileCode className="w-5 h-5" />}
                         </div>
                         <ExternalLink className="w-4 h-4 text-slate-700 group-hover:text-primary transition-colors" />
                      </div>
                      <div>
                         <h4 className="font-bold text-white text-sm group-hover:text-primary transition-colors truncate">{item.name}</h4>
                         <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mt-1">{item.type === 'dir' ? 'Klasör' : 'Dosya'}</p>
                      </div>
                   </motion.div>
                 ))}
                 {filteredSamples.length === 0 && (
                   <div className="col-span-full py-20 text-center opacity-20">
                      <p className="text-sm font-bold uppercase tracking-[0.3em]">Sonuç bulunamadı</p>
                   </div>
                 )}
              </div>
            )}
         </div>
      </div>

      <div className="bg-primary/5 border border-primary/10 p-6 rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-6">
         <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
               <Book className="w-6 h-6" />
            </div>
            <div>
               <h4 className="text-sm font-black text-white uppercase italic">Öğrenme Kaynağı</h4>
               <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Bu örnekler C++ ve Android JNI entegrasyonu için referans niteliğindedir.</p>
            </div>
         </div>
         <button
           onClick={() => window.open('https://developer.android.com/ndk/samples', '_blank')}
           className="px-8 py-3 bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl shadow-lg shadow-primary/20 hover:brightness-110 transition-all"
         >
            DOKÜMANTASYONU AÇ
         </button>
      </div>
    </div>
  );
};

export default NdkSamplesView;
