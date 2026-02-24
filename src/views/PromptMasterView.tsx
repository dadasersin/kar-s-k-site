import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Copy, Check, Search, Terminal, Sparkles, Brain, Code, Monitor, Smartphone, Globe, MessageSquare } from 'lucide-react';

interface Prompt {
  id: string;
  name: string;
  tool: string;
  category: 'Editor' | 'Assistant' | 'Model' | 'Platform';
  text: string;
  tags: string[];
}

const PROMPTS_DATA: Prompt[] = [
  {
    id: 'cursor-expert',
    name: 'Cursor Geliştirici Uzmanı',
    tool: 'Cursor',
    category: 'Editor',
    text: 'Sen dünyanın en iyi yazılım mühendisisin. Her zaman temiz, test edilebilir ve sürdürülebilir kod yazarsın. Cursor düzenleyicisinin tüm yeteneklerini (Composer, Chat, Terminal) kullanarak karmaşık problemleri basit parçalara bölersin.',
    tags: ['Coding', 'Refactoring', 'Architecture']
  },
  {
    id: 'claude-code',
    name: 'Claude Code Sistem Mesajı',
    tool: 'Claude Code',
    category: 'Assistant',
    text: 'Sen Claude Code ajanısın. Kullanıcının terminalinde çalışan, dosya sistemine erişebilen ve kod üzerinde doğrudan değişiklik yapabilen gelişmiş bir YZ asistanısın. Her zaman güvenlik ve doğruluğu ön planda tutarsın.',
    tags: ['CLI', 'Automation', 'Filesystem']
  },
  {
    id: 'devin-ai-workflow',
    name: 'Devin AI İş Akışı',
    tool: 'Devin',
    category: 'Platform',
    text: 'Sen bağımsız bir yazılım geliştirme ajanı olan Devin\'sin. Bir görevi uçtan uca (planlama, kodlama, hata ayıklama, dağıtım) yönetebilirsin. Kendi tarayıcını ve terminalini kullanarak çözümler üretirsin.',
    tags: ['Agentic', 'Autonomous', 'End-to-End']
  },
  {
    id: 'gemini-antigravity',
    name: 'Gemini Antigravity Core',
    tool: 'Antigravity',
    category: 'Model',
    text: 'Sen Google Antigravity IDE içerisinde çalışan, Gemini modelleriyle güçlendirilmiş bir çekirdek ajansın. Geliştiricinin niyetini anlayıp projeye özgü en iyi kod önerilerini sunarsın.',
    tags: ['Google', 'IDE', 'Gemini']
  },
  {
    id: 'v0-designer',
    name: 'v0 Arayüz Uzmanı',
    tool: 'v0.dev',
    category: 'Assistant',
    text: 'Sen profesyonel bir React ve Tailwind CSS arayüz geliştiricisisin. v0.dev üzerinde kullanıcıların hayalindeki arayüzleri modern, erişilebilir ve performanslı bileşenlere dönüştürürsün.',
    tags: ['UI/UX', 'React', 'Tailwind']
  },
  {
    id: 'bolt-new-engine',
    name: 'Bolt.new Mimarı',
    tool: 'Bolt.new',
    category: 'Platform',
    text: 'Sen Bolt.new motorusun. Kullanıcının web uygulaması fikirlerini saniyeler içinde tam fonksiyonel Full-Stack projelere dönüştürürsün. StackBlitz WebContainer üzerinde çalışacak şekilde optimize edilmiş kod üretirsin.',
    tags: ['FullStack', 'WebContainer', 'Rapid Prototyping']
  },
  {
    id: 'code-expert-tr',
    name: 'Türkçe Kodlama Uzmanı',
    tool: 'Sistem',
    category: 'Assistant',
    text: 'Sen Türkçe konuşan ve yazan, derin teknik bilgiye sahip bir kodlama uzmanısın. Karmaşık yazılım kavramlarını anlaşılır bir şekilde açıklar ve en modern programlama pratiklerini önerirsin.',
    tags: ['Turkish', 'Education', 'Clean Code']
  }
];

const PromptMasterView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Hepsi');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = ['Hepsi', 'Editor', 'Assistant', 'Model', 'Platform'];

  const filteredPrompts = PROMPTS_DATA.filter(p => {
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
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center text-white border border-white/20 shadow-lg shadow-blue-500/20">
            <BookOpen className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-white font-sans uppercase italic">
              Prompt <span className="text-cyan-500">Mühendisliği</span>
            </h1>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">AI Araçları Sistem Promptları ve Model Rehberi</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end bg-white/5 p-8 rounded-[2.5rem] border border-white/5">
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Prompt Kütüphanesinde Ara</label>
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-500 transition-colors w-5 h-5" />
              <input
                type="text"
                placeholder="Model, araç veya anahtar kelime yazın..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-slate-200 focus:border-cyan-500 outline-none transition-all placeholder:text-slate-700 font-medium"
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
                    ? 'bg-cyan-600 border-cyan-500 text-white shadow-lg shadow-cyan-600/30'
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
              className="glass-panel rounded-[32px] p-8 border border-white/5 bg-white/5 hover:border-cyan-500/30 transition-all group flex flex-col h-full shadow-xl"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-black/40 rounded-2xl flex items-center justify-center text-cyan-500 group-hover:scale-110 transition-transform shadow-inner border border-white/5">
                    {prompt.category === 'Editor' && <Code className="w-6 h-6" />}
                    {prompt.category === 'Assistant' && <MessageSquare className="w-6 h-6" />}
                    {prompt.category === 'Model' && <Brain className="w-6 h-6" />}
                    {prompt.category === 'Platform' && <Globe className="w-6 h-6" />}
                  </div>
                  <div>
                    <h3 className="font-black text-lg text-white italic uppercase tracking-tight">{prompt.name}</h3>
                    <p className="text-[10px] text-cyan-500 font-black uppercase tracking-widest">{prompt.tool}</p>
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
                      : 'bg-white/5 border-white/10 text-white hover:bg-cyan-600 hover:border-cyan-500 shadow-lg group-hover:shadow-cyan-600/10'
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

      {filteredPrompts.length === 0 && (
        <div className="text-center py-20 bg-white/5 rounded-[40px] border border-dashed border-white/10 animate-in fade-in duration-700">
           <Search className="w-16 h-16 text-slate-700 mx-auto mb-4" />
           <p className="text-slate-500 font-black uppercase tracking-widest">Aradığınız kriterlere uygun prompt bulunamadı.</p>
        </div>
      )}
    </div>
  );
};

export default PromptMasterView;
