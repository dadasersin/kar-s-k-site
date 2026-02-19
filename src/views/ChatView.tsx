
import React, { useRef, useEffect, useState } from 'react';
import type { ChatMessage } from '../types';

interface ChatViewProps {
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  onSendMessage: (text: string) => Promise<void>;
  isTyping: boolean;
  activeModelInfo: string;
}

const ChatView: React.FC<ChatViewProps> = ({ messages, setMessages, onSendMessage, isTyping, activeModelInfo }) => {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isTyping]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleVoice = (e: any) => {
      if (e.detail) onSendMessage(e.detail);
    };
    window.addEventListener('voice-chat', handleVoice);
    return () => window.removeEventListener('voice-chat', handleVoice);
  }, [onSendMessage]);

  return (
    <div className="flex-1 flex flex-col bg-slate-950 h-full overflow-hidden relative">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 glass-panel flex justify-between items-center shrink-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
            <i className="fa-solid fa-microchip text-sm text-white"></i>
          </div>
          <div>
            <h2 className="font-bold text-sm">Yapay Zeka Havuzu</h2>
            <p className="text-[8px] text-indigo-400 uppercase font-black tracking-widest">
              {activeModelInfo ? `Şu an aktif: ${activeModelInfo}` : 'Dinamik API Rotasyonu Hazır'}
            </p>
          </div>
        </div>
        <button onClick={() => { if(confirm('Tüm sohbet silinsin mi?')) { setMessages([]); localStorage.removeItem('chat_history'); } }} className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-red-500 transition-colors">
          <i className="fa-solid fa-trash-can text-sm"></i>
        </button>
      </div>

      {/* Mesaj Listesi */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth pb-32">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-slate-700 opacity-20 gap-4">
             <i className="fa-solid fa-shield-cat text-7xl"></i>
             <p className="text-xs font-black uppercase tracking-widest">DeepSeek, Grok, Gemini ve fazlası emrinizde...</p>
          </div>
        )}
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
            <div className={`max-w-[90%] md:max-w-[75%] rounded-[1.5rem] px-5 py-4 shadow-2xl ${
              m.role === 'user'
                ? 'bg-indigo-600 text-white rounded-tr-none'
                : 'bg-slate-800/60 backdrop-blur-md text-slate-100 border border-slate-700/50 rounded-tl-none'
            }`}>
              <p className="whitespace-pre-wrap text-[13px] md:text-sm leading-relaxed">{m.text}</p>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
                <span className="text-[7px] opacity-40 uppercase font-bold tracking-tighter">{m.role === 'model' ? 'AI Agent' : 'User'}</span>
                <span className="text-[8px] opacity-40 font-mono">
                  {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-slate-800/40 rounded-full px-4 py-2 border border-slate-700 flex gap-1.5 items-center">
              <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
          </div>
        )}
      </div>

      {/* Giriş Kutusu */}
      <div className="absolute bottom-0 left-0 right-0 p-4 pb-28 md:pb-8 bg-gradient-to-t from-slate-950 via-slate-950/95 to-transparent z-20">
        <form onSubmit={(e) => { e.preventDefault(); onSendMessage(input); setInput(''); }} className="max-w-4xl mx-auto relative group">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Dilediğinizi sorun..."
            className="w-full bg-slate-900/80 backdrop-blur-2xl border border-slate-800/50 rounded-2xl pl-5 pr-14 py-4 text-sm focus:border-indigo-500/50 outline-none transition-all shadow-2xl placeholder:text-slate-600 text-white"
          />
          <button
            type="submit"
            disabled={isTyping || !input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white rounded-xl flex items-center justify-center transition-all shadow-lg active:scale-90"
          >
            <i className="fa-solid fa-paper-plane text-xs"></i>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatView;
