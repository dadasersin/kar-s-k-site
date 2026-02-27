import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Mic, Sparkles, User, Bot } from 'lucide-react';

interface QuickChatWidgetProps {
  onSendMessage: (text: string) => void;
  messages: { role: 'user' | 'model'; text: string }[];
  isTyping: boolean;
}

const QuickChatWidget: React.FC<QuickChatWidgetProps> = ({ onSendMessage, messages, isTyping }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  const handleSend = () => {
    if (inputText.trim()) {
      onSendMessage(inputText);
      setInputText('');
    }
  };

  const toggleVoice = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Tarayıcınız ses tanımayı desteklemiyor.");
      return;
    }

    if (isVoiceActive) {
      setIsVoiceActive(false);
    } else {
      const recognition = new SpeechRecognition();
      recognition.lang = 'tr-TR';
      recognition.onstart = () => setIsVoiceActive(true);
      recognition.onend = () => setIsVoiceActive(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsVoiceActive(false);
      };
      recognition.start();
    }
  };

  return (
    <div className="fixed bottom-24 lg:bottom-6 right-6 z-[100] flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-80 lg:w-96 bg-slate-900 border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-4 duration-300 ring-1 ring-white/5">
          {/* Header */}
          <div className="p-4 bg-primary/10 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
              <span className="font-black text-[10px] uppercase tracking-widest text-white italic">Hızlı Sohbet</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 space-y-4 overflow-y-auto max-h-[400px] min-h-[300px] custom-scrollbar-hidden">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-20 space-y-2 mt-10">
                <Sparkles className="w-8 h-8 text-primary" />
                <p className="text-[10px] font-bold uppercase tracking-widest">Sana nasıl yardımcı olabilirim?</p>
              </div>
            ) : (
              messages.map((msg, i) => (
                <div key={i} className={`flex flex-col gap-1 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <span className={`text-[8px] font-black uppercase tracking-widest px-2 ${msg.role === 'user' ? 'text-slate-500' : 'text-primary'}`}>
                    {msg.role === 'user' ? 'Sen' : 'Asistan'}
                  </span>
                  <div className={`p-3 rounded-2xl text-xs max-w-[85%] ${
                    msg.role === 'user'
                      ? 'bg-primary text-white rounded-tr-none shadow-lg shadow-primary/10'
                      : 'bg-white/5 text-slate-200 border border-white/5 rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))
            )}
            {isTyping && (
              <div className="flex flex-col gap-1 items-start">
                <span className="text-[8px] font-black uppercase tracking-widest px-2 text-primary">Asistan</span>
                <div className="bg-white/5 p-3 rounded-2xl rounded-tl-none border border-white/5 flex gap-1">
                  <div className="w-1 h-1 bg-primary rounded-full animate-bounce"></div>
                  <div className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Voice Indicator */}
          {isVoiceActive && (
            <div className="px-4 py-2 flex items-center justify-center gap-2 bg-primary/5 border-t border-white/5 animate-pulse">
              <span className="text-[8px] text-primary font-black uppercase tracking-widest">Dinleniyor...</span>
              <div className="flex items-center gap-0.5 h-3">
                <div className="w-0.5 h-2 bg-primary animate-bounce"></div>
                <div className="w-0.5 h-3 bg-primary animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-0.5 h-1 bg-primary animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-white/5 bg-white/5">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Komut yazın..."
                className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:border-primary outline-none transition-all placeholder:text-slate-700"
              />
              <button
                onClick={toggleVoice}
                className={`p-2 rounded-xl transition-all border ${isVoiceActive ? 'bg-primary/20 border-primary text-primary' : 'bg-white/5 border-white/10 text-slate-500 hover:text-primary hover:border-primary/50'}`}
              >
                <Mic className="w-4 h-4" />
              </button>
              <button
                onClick={handleSend}
                className="p-2 bg-primary text-white rounded-xl hover:brightness-110 transition-all shadow-lg shadow-primary/20"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-primary text-white rounded-full shadow-[0_4px_20px_rgba(13,89,242,0.4)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all group relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
        {isOpen ? <X className="w-6 h-6 relative z-10" /> : <MessageSquare className="w-6 h-6 relative z-10" />}
      </button>
    </div>
  );
};

export default QuickChatWidget;
