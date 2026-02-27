import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Copy, Check, Search, Terminal, Sparkles, Brain, Code, Monitor, Smartphone, Globe, MessageSquare, Shield, Layers, FileCode } from 'lucide-react';

interface Prompt {
  id: string;
  name: string;
  tool: string;
  category: 'Editor' | 'Assistant' | 'Model' | 'Platform';
  text: string;
  tags: string[];
}

const EXPERT_PROMPTS_DATA: Prompt[] = [
  {
    id: 'windsurf-agent',
    name: 'Windsurf Akıllı Ajan',
    tool: 'Windsurf',
    category: 'Editor',
    text: 'Sen Windsurf IDE içerisindeki birincil ajansın. Mevcut bağlamı (context) mükemmel bir şekilde analiz edip, kullanıcının niyetini önceden tahmin edersin. Çok dosyalı refaktör işlemlerini güvenle yaparsın.',
    tags: ['NextGen', 'Context-Aware', 'Refactor']
  },
  {
    id: 'trae-ai',
    name: 'Trae AI Geliştirici',
    tool: 'Trae',
    category: 'Editor',
    text: 'Sen ByteDance tarafından geliştirilen Trae IDE asistanısın. Swift ve Kotlin dahil olmak üzere mobil ve web dillerinde uzmansın. Performans odaklı çözümler sunarsın.',
    tags: ['Mobile', 'Performance', 'ByteDance']
  },
  {
    id: 'lovalbe-fullstack',
    name: 'Lovable Mimarı',
    tool: 'Lovable',
    category: 'Platform',
    text: 'Sen Lovable (GPT Engineer) platformunun beynisin. Sadece doğal dil komutlarıyla tam ölçekli uygulamalar inşa edersin. UI/UX prensiplerine her zaman sadık kalırsın.',
    tags: ['NoCode-to-Code', 'Rapid', 'FullStack']
  },
  {
    id: 'manus-research',
    name: 'Manus Araştırma Ajanı',
    tool: 'Manus',
    category: 'Assistant',
    text: 'Sen Manus Agent platformu için optimize edilmiş bir araştırma ve yürütme uzmanısın. İnternet üzerindeki verileri toplar, sentezler ve eyleme dökülebilir raporlar hazırlarsın.',
    tags: ['Research', 'Browser-Use', 'Autonomous']
  },
  {
    id: 'roocode-mcp',
    name: 'RooCode MCP Operatörü',
    tool: 'RooCode',
    category: 'Assistant',
    text: 'Sen RooCode (Cline fork) sisteminin MCP orkestratörüsün. Harici araçları (Postgres, GitHub, Filesystem) kullanarak geliştirme ortamını genişletirsin.',
    tags: ['Cline', 'MCP', 'Tools']
  },
  {
    id: 'gemini-cli-system',
    name: 'Gemini CLI Sistem Komutu',
    tool: 'Gemini CLI',
    category: 'Assistant',
    text: 'Sen terminal tabanlı bir Gemini arayüzüsün. Kullanıcının komut satırı deneyimini YZ ile güçlendirir, shell komutlarını açıklar ve dosya manipülasyonlarını otonom yaparsın.',
    tags: ['Terminal', 'Go', 'CLI']
  }
];

const PromptExpertView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Hepsi');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = ['Hepsi', 'Editor', 'Assistant', 'Platform'];

  const filteredPrompts = EXPERT_PROMPTS_DATA.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.tool.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.text.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Hepsi' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const copyPrompt = (prompt: Prompt) => {
    navigator.clipboard.writeText(prompt.text);
    setCopiedId(prompt.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto min-h-screen pb-32 bg-brandDark text-slate-200">
      <header className="mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-500 rounded-2xl flex items-center justify-center text-white border border-white/20 shadow-lg shadow-violet-500/20">
            <Sparkles className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-white font-sans uppercase italic">
              Prompt <span className="text-violet-500">Uzmanı</span>
            </h1>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Gelişmiş AI Araçları Sistem Promptları Arşivi</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end bg-white/5 p-8 rounded-[2.5rem] border border-white/5">
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Kütüphanede Ara</label>
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-violet-500 transition-colors w-5 h-5" />
              <input
                type="text"
                placeholder="Araç veya platform yazın..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-slate-200 focus:border-violet-500 outline-none transition-all placeholder:text-slate-700 font-medium"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                  selectedCategory === cat
                    ? 'bg-violet-600 border-violet-500 text-white shadow-lg shadow-violet-600/30'
                    : 'bg-black/40 border-white/10 text-slate-500 hover:border-white/20 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence>
          {filteredPrompts.map((prompt) => (
            <motion.div
              layout
              key={prompt.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-panel rounded-[32px] p-8 border border-white/5 bg-white/5 hover:border-violet-500/30 transition-all group flex flex-col h-full shadow-xl"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-black/40 rounded-2xl flex items-center justify-center text-violet-500 group-hover:scale-110 transition-transform shadow-inner border border-white/5">
                    {prompt.category === 'Editor' && <FileCode className="w-6 h-6" />}
                    {prompt.category === 'Assistant' && <MessageSquare className="w-6 h-6" />}
                    {prompt.category === 'Platform' && <Globe className="w-6 h-6" />}
                  </div>
                  <div>
                    <h3 className="font-black text-lg text-white italic uppercase tracking-tight">{prompt.name}</h3>
                    <p className="text-[10px] text-violet-500 font-black uppercase tracking-widest">{prompt.tool}</p>
                  </div>
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1 bg-white/5 text-slate-500 rounded-full border border-white/5">
                  {prompt.category}
                </span>
              </div>

              <div className="flex-grow mb-8 relative">
                <div className="p-6 bg-black/40 border border-white/5 rounded-2xl text-sm text-slate-400 leading-relaxed font-mono italic">
                  "{prompt.text}"
                </div>
              </div>

              <div className="mt-auto pt-6 border-t border-white/5 flex flex-col gap-6">
                <div className="flex flex-wrap gap-2">
                  {prompt.tags.map(tag => (
                    <span key={tag} className="text-[9px] font-black text-slate-500 bg-white/5 px-2 py-1 rounded uppercase tracking-tighter">
                      #{tag}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => copyPrompt(prompt)}
                  className={`w-full py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 border ${
                    copiedId === prompt.id
                      ? 'bg-emerald-600/20 border-emerald-500 text-emerald-500'
                      : 'bg-white/5 border-white/10 text-white hover:bg-violet-600 hover:border-violet-500 shadow-lg'
                  }`}
                >
                  {copiedId === prompt.id ? (
                    <>
                      <Check className="w-4 h-4" /> KOPYALANDI!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" /> SİSTEM PROMPTINI KOPYALA
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PromptExpertView;
