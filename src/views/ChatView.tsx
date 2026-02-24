import React, { useRef, useEffect, useState } from 'react';
import type { ChatMessage, Persona } from '../types';

interface ChatViewProps {
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  onSendMessage: (text: string, options?: { systemInstruction?: string, webSearch?: boolean }) => Promise<void>;
  isTyping: boolean;
  activeModelInfo: string;
}

const ChatView: React.FC<ChatViewProps> = ({ messages, setMessages, onSendMessage, isTyping, activeModelInfo }) => {
  const [input, setInput] = useState('');
  const [isWebSearch, setIsWebSearch] = useState(false);
  const [activePersona, setActivePersona] = useState<Persona | null>(null);
  const [isPersonaMenuOpen, setIsPersonaMenuOpen] = useState(false);
  const [uploadedDocText, setUploadedDocText] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const personas: Persona[] = [
    { id: '1', name: 'Mimar', role: 'Yazılım Mimarı', icon: 'fa-microchip', instructions: 'Sen deneyimli bir yazılım mimarısın. Teknik, ölçeklenebilir ve temiz kod odaklı yanıtlar ver.' },
    { id: '2', name: 'Yazar', role: 'Yaratıcı Yazarlık', icon: 'fa-pen-fancy', instructions: 'Sen bir edebiyatçısın. Yanıtlarında edebi bir dil kullan, betimlemelere önem ver.' },
    { id: '3', name: 'Analist', role: 'Veri Analisti', icon: 'fa-chart-pie', instructions: 'Sen bir veri bilimcisin. Mantıklı, veriye dayalı ve rasyonel cevaplar ver.' },
    { id: '4', name: 'Developer', role: 'Live AI Developer', icon: 'fa-code-branch', instructions: 'Sen Ersin Güleşin Live AI Developer asistanısın. Siteye yeni özellikler ekleme, kod yazma ve optimizasyon konularında uzmanlaşmışsın. Senden bir şey eklemen istendiğinde, bunu sandbox üzerinde geliştirdiğini ve tuvalde (Canvas) görebileceğini belirterek yanıt ver.' },
    { id: '5', name: 'Asistan', role: 'Genel Yardımcı', icon: 'fa-robot', instructions: 'Sen Ersin Güleşin özel asistanısın. Her konuda yardımcı olmaya hazır ve saygılı bir dil kullan.' }
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isTyping]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      setUploadedDocText(text);
      alert('Döküman analiz için yüklendi.');
    };
    reader.readAsText(file);
  };

  const handleTriggerSend = () => {
    if (!input.trim()) return;

    let finalPrompt = input;
    if (uploadedDocText) {
      finalPrompt = `Döküman İçeriği:\n${uploadedDocText}\n\nSoru: ${input}`;
    }

    onSendMessage(finalPrompt, {
      systemInstruction: activePersona?.instructions,
      webSearch: isWebSearch
    });

    setInput('');
    // Optionally clear doc after use or keep it
    // setUploadedDocText(null);
  };

  return (
    <div className="flex-1 flex flex-col bg-brandDark h-full overflow-hidden relative">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 glass-panel flex justify-between items-center shrink-0 z-20">
        <div className="flex items-center gap-4">
          <div className="relative">
             <button
               onClick={() => setIsPersonaMenuOpen(!isPersonaMenuOpen)}
               className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${activePersona ? 'bg-primary text-white shadow-[0_0_15px_rgba(13,89,242,0.4)]' : 'bg-slate-800 text-slate-500 hover:text-white'}`}
             >
                <i className={`fa-solid ${activePersona ? activePersona.icon : 'fa-user-gear'} text-sm`}></i>
             </button>
             {isPersonaMenuOpen && (
               <div className="absolute top-12 left-0 w-64 glass-panel border border-white/10 rounded-2xl p-2 shadow-2xl z-[100] animate-in slide-in-from-top-2">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest p-2 border-b border-white/5 mb-2">Persona Seçimi</p>
                  {personas.map(p => (
                    <button
                      key={p.id}
                      onClick={() => { setActivePersona(p); setIsPersonaMenuOpen(false); }}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${activePersona?.id === p.id ? 'bg-primary/20 text-primary' : 'text-slate-400 hover:bg-white/5'}`}
                    >
                       <i className={`fa-solid ${p.icon} w-4`}></i>
                       <div className="text-left">
                          <p className="text-[10px] font-bold">{p.name}</p>
                          <p className="text-[8px] opacity-50 font-black uppercase tracking-tighter">{p.role}</p>
                       </div>
                    </button>
                  ))}
                  <button onClick={() => { setActivePersona(null); setIsPersonaMenuOpen(false); }} className="w-full mt-2 p-2 text-[9px] font-black text-red-500 uppercase hover:bg-red-500/10 rounded-xl transition-all">Sıfırla</button>
               </div>
             )}
          </div>
          <div>
            <h2 className="font-bold text-sm text-white">{activePersona ? activePersona.name : 'Standart Model'}</h2>
            <p className="text-[8px] text-primary uppercase font-black tracking-widest animate-pulse">
              {activeModelInfo || 'Dinamik API Aktif'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
            <button
              onClick={() => setIsWebSearch(!isWebSearch)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${isWebSearch ? 'border-primary/50 bg-primary/10 text-primary' : 'border-white/5 text-slate-500'}`}
            >
               <i className="fa-solid fa-globe text-[10px]"></i>
               <span className="text-[9px] font-black uppercase tracking-widest">{isWebSearch ? 'Web Araştırma Aktif' : 'Web Kapalı'}</span>
            </button>
            <button onClick={() => { if(confirm('Tüm sohbet geçmişi silinsin mi?')) { setMessages([]); localStorage.removeItem('chat_history'); } }} className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-red-500 transition-colors">
              <i className="fa-solid fa-trash-can text-xs"></i>
            </button>
        </div>
      </div>

      {/* Mesaj Listesi */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-hide pb-32">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-slate-700 opacity-20 gap-4">
             <i className="fa-solid fa-shield-cat text-7xl"></i>
             <p className="text-xs font-black uppercase tracking-widest">Portal hazır. Dilediğinizi sorabilirsiniz.</p>
          </div>
        )}
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
            <div className={`max-w-[90%] md:max-w-[75%] rounded-[1.5rem] px-5 py-4 shadow-2xl ${
              m.role === 'user'
                ? 'bg-primary text-white rounded-tr-none border border-primary/50'
                : 'bg-white/5 backdrop-blur-md text-slate-100 border border-white/5 rounded-tl-none'
            }`}>
              <p className="whitespace-pre-wrap text-[13px] leading-relaxed">{m.text}</p>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
                <span className="text-[7px] opacity-40 uppercase font-black tracking-tighter">{m.role === 'model' ? 'YZ ASİSTANI' : 'YETKİLİ KULLANICI'}</span>
                <span className="text-[8px] opacity-40 font-mono">
                  {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white/5 rounded-full px-4 py-2 border border-white/5 flex gap-1.5 items-center">
              <div className="w-1 h-1 bg-primary rounded-full animate-bounce"></div>
              <div className="w-1 h-1 bg-primary rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-1 h-1 bg-primary rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
          </div>
        )}
      </div>

      {/* Giriş Kutusu */}
      <div className="absolute bottom-0 left-0 right-0 p-4 pb-28 lg:pb-8 bg-gradient-to-t from-brandDark via-brandDark/95 to-transparent z-20">
        <div className="max-w-4xl mx-auto space-y-3">
          {uploadedDocText && (
            <div className="flex items-center justify-between bg-primary/10 border border-primary/20 rounded-xl px-4 py-2 animate-in slide-in-from-bottom-2">
               <div className="flex items-center gap-3">
                  <i className="fa-solid fa-file-lines text-primary"></i>
                  <span className="text-[10px] font-bold text-primary uppercase">Döküman Yüklendi (Analize Hazır)</span>
               </div>
               <button onClick={() => setUploadedDocText(null)} className="text-primary hover:text-red-500 transition-colors">
                  <i className="fa-solid fa-xmark"></i>
               </button>
            </div>
          )}

          <form onSubmit={(e) => { e.preventDefault(); handleTriggerSend(); }} className="relative group">
            <div className="absolute left-2 top-1/2 -translate-y-1/2 flex gap-1">
               <button
                 type="button"
                 onClick={() => fileInputRef.current?.click()}
                 className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all ${uploadedDocText ? 'bg-primary text-white' : 'text-slate-500 hover:bg-white/5 hover:text-primary'}`}
               >
                  <i className="fa-solid fa-paperclip text-xs"></i>
               </button>
               <input type="file" ref={fileInputRef} className="hidden" accept=".txt,.md,.pdf" onChange={handleFileUpload} />
            </div>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Dilediğinizi sorun veya döküman yükleyin..."
              className="w-full bg-slate-900/80 backdrop-blur-2xl border border-white/5 rounded-2xl pl-14 pr-14 py-4 text-sm focus:border-primary/50 outline-none transition-all shadow-2xl placeholder:text-gray-700 text-white"
            />

            <button
              type="submit"
              disabled={isTyping || !input.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-primary hover:brightness-110 disabled:bg-slate-800 text-white rounded-xl flex items-center justify-center transition-all shadow-lg active:scale-90"
            >
              <i className="fa-solid fa-paper-plane text-xs"></i>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatView;
