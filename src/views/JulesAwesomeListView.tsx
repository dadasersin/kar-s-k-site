import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Code, Terminal, Bug, FileText, Search, Copy, Check, ExternalLink, Library } from 'lucide-react';

interface PromptItem {
  id: string;
  category: string;
  title: string;
  prompt: string;
  tags: string[];
}

const AWESOME_PROMPTS: PromptItem[] = [
  {
    id: 'dev-1',
    category: 'Everyday Dev Tasks',
    title: 'Code Review Assistant',
    prompt: 'Review the following code for potential bugs, security vulnerabilities, and adherence to clean code principles. Suggest specific improvements.',
    tags: ['Review', 'Clean Code']
  },
  {
    id: 'dev-2',
    category: 'Everyday Dev Tasks',
    title: 'Refactoring Expert',
    prompt: 'Refactor this code to use modern design patterns (e.g., Factory, Strategy) while maintaining the same functionality. Explain why these patterns are better.',
    tags: ['Patterns', 'Refactor']
  },
  {
    id: 'debug-1',
    category: 'Debugging',
    title: 'Stack Trace Analyzer',
    prompt: 'Analyze this stack trace and suggest the most likely cause of the error. Provide a step-by-step debugging plan to verify and fix it.',
    tags: ['Error', 'Fix']
  },
  {
    id: 'debug-2',
    category: 'Debugging',
    title: 'Memory Leak Detection',
    prompt: 'Look at this heap dump/profile and identify potential memory leaks or inefficient object allocations. Suggest ways to optimize memory usage.',
    tags: ['Performance', 'Memory']
  },
  {
    id: 'doc-1',
    category: 'Documentation',
    title: 'API Doc Generator',
    prompt: 'Generate comprehensive JSDoc/TSDoc for the following functions and classes. Include parameter descriptions, return types, and usage examples.',
    tags: ['JSDoc', 'Typescript']
  },
  {
    id: 'doc-2',
    category: 'Documentation',
    title: 'README Specialist',
    prompt: 'Create a professional README.md for this repository. Include installation steps, usage guides, contribution guidelines, and a clear project description.',
    tags: ['Markdown', 'Repo']
  },
  {
    id: 'test-1',
    category: 'Testing',
    title: 'Unit Test Architect',
    prompt: 'Write comprehensive unit tests for this component using Jest and React Testing Library. Cover edge cases and mock necessary dependencies.',
    tags: ['Jest', 'RTL']
  },
  {
    id: 'test-2',
    category: 'Testing',
    title: 'E2E Flow Creator',
    prompt: 'Design a Playwright end-to-end test suite for the following user journey: [Describe Journey]. Focus on robustness and meaningful assertions.',
    tags: ['Playwright', 'E2E']
  },
  {
    id: 'ai-1',
    category: 'AI-Native Tasks',
    title: 'Prompt Engineering Consultant',
    prompt: 'Optimize the following system prompt to be more concise and effective for a coding assistant. Use delimiters and clear instructions.',
    tags: ['Prompting', 'Optimization']
  },
  {
    id: 'ai-2',
    category: 'AI-Native Tasks',
    title: 'Context Window Optimizer',
    prompt: 'Identify the most relevant parts of this large codebase/document to include in a limited context window for solving the specific task of: [Describe Task].',
    tags: ['Context', 'LLM']
  }
];

const JulesAwesomeListView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = ['All', ...new Set(AWESOME_PROMPTS.map(p => p.category))];

  const filteredPrompts = AWESOME_PROMPTS.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.prompt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="p-4 lg:p-12 max-w-7xl mx-auto space-y-12 pb-32">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-[2rem] bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-2xl shadow-indigo-600/10">
              <Library className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl lg:text-5xl font-black text-white italic tracking-tighter uppercase font-sans">Jules Awesome List</h1>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Google Labs Jules Agent için Küratörlüğü Yapılmış Promptlar</p>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
           <a href="https://github.com/google-labs-code/jules-awesome-list" target="_blank" rel="noreferrer" className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/10 transition-all flex items-center gap-2">
              <ExternalLink className="w-3 h-3" /> GITHUB REPOSU
           </a>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <div className="md:col-span-1 space-y-6">
          <div className="glass-panel p-6 rounded-[2.5rem] border border-white/5 bg-white/5 space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Prompt Ara</label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-black/40 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-sm text-white focus:border-primary outline-none transition-all placeholder:text-slate-800"
                  placeholder="Ara..."
                />
              </div>
            </div>

            <div className="space-y-3">
               <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Kategoriler</label>
               <div className="flex flex-col gap-1">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`text-left px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedCategory === cat ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-500 hover:bg-white/5 hover:text-slate-300'}`}
                    >
                      {cat}
                    </button>
                  ))}
               </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="md:col-span-3 space-y-6">
           <div className="grid grid-cols-1 gap-6">
             <AnimatePresence mode="popLayout">
               {filteredPrompts.map((item) => (
                 <motion.div
                    layout
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="glass-panel p-8 rounded-[3rem] border border-white/5 bg-white/5 hover:border-primary/30 transition-all group"
                 >
                    <div className="flex justify-between items-start mb-6">
                       <div className="space-y-2">
                          <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                                {item.category === 'Debugging' ? <Bug className="w-4 h-4" /> :
                                 item.category === 'Documentation' ? <FileText className="w-4 h-4" /> :
                                 item.category === 'Testing' ? <CheckCircle2 className="w-4 h-4" /> :
                                 item.category === 'Everyday Dev Tasks' ? <Terminal className="w-4 h-4" /> :
                                 <Sparkles className="w-4 h-4" />}
                             </div>
                             <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em]">{item.category}</span>
                          </div>
                          <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">{item.title}</h3>
                       </div>
                       <button
                          onClick={() => handleCopy(item.prompt, item.id)}
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${copiedId === item.id ? 'bg-green-500 text-white' : 'bg-white/5 text-slate-500 hover:text-white hover:bg-white/10 border border-white/10'}`}
                       >
                          {copiedId === item.id ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                       </button>
                    </div>

                    <div className="bg-black/40 rounded-3xl p-6 border border-white/5 mb-6">
                       <p className="text-slate-400 text-sm leading-relaxed italic">"{item.prompt}"</p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                       {item.tags.map(tag => (
                         <span key={tag} className="px-3 py-1 bg-white/5 rounded-lg text-[9px] font-black text-slate-600 uppercase tracking-widest group-hover:text-indigo-400 transition-colors">
                            #{tag}
                         </span>
                       ))}
                    </div>
                 </motion.div>
               ))}
             </AnimatePresence>
           </div>
        </div>
      </div>
    </div>
  );
};

export default JulesAwesomeListView;
