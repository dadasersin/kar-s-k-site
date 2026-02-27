import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Shield, ShieldCheck, Database, FolderSync, Share2, Globe, Lock, Cpu, Eye, User, RefreshCw, Send, Image as ImageIcon } from 'lucide-react';

const SelineView: React.FC = () => {
  const [messages, setMessages] = useState([
    { id: '1', role: 'model', text: 'Merhaba! Ben Seline. Gizlilik odaklı ve yerel verilerinize hakim YZ asistanınızım. Size bugün nasıl yardımcı olabilirim?' }
  ]);
  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (!inputText.trim()) return;
    setMessages([...messages, { id: Date.now().toString(), role: 'user', text: inputText }]);
    setInputText('');
    setTimeout(() => {
      setMessages(prev => [...prev, { id: (Date.now()+1).toString(), role: 'model', text: 'Analiz ediliyor... Verileriniz yerel vektör veritabanında taranıyor ve güvenli bir cevap hazırlanıyor.' }]);
    }, 1000);
  };

  return (
    <div className="p-4 lg:p-8 overflow-y-auto h-full pb-32 bg-brandDark text-slate-200">
      <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700 h-full flex flex-col">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-8 shrink-0">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
               <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center shadow-[0_0_30px_rgba(139,92,246,0.4)] border border-white/20">
                  <Shield className="w-7 h-7 text-white" />
               </div>
               <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase">Seline Asistan</h2>
            </div>
            <p className="text-slate-500 text-sm font-bold tracking-widest uppercase">Gizlilik Odaklı Yerel Bilgi Motoru</p>
          </div>

          <div className="flex items-center gap-4 bg-emerald-500/10 border border-emerald-500/20 px-6 py-3 rounded-2xl">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
             <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">GÜVENLİ YEREL BAĞLANTI</span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-grow overflow-hidden">
          <div className="lg:col-span-8 flex flex-col gap-6 overflow-hidden">
             <div className="glass-panel rounded-[40px] flex-grow overflow-hidden bg-black/40 border border-white/5 shadow-2xl flex flex-col">
                <div className="px-8 py-4 bg-white/5 border-b border-white/5 flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <Eye className="w-4 h-4 text-violet-400" />
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Vektör DB Aktif</span>
                   </div>
                   <button className="text-[9px] font-black text-slate-500 uppercase hover:text-white transition-colors">Geçmişi Temizle</button>
                </div>

                <div className="flex-grow overflow-y-auto p-8 space-y-6 custom-scrollbar-hidden">
                   {messages.map(m => (
                     <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-6 rounded-[2rem] text-sm leading-relaxed ${m.role === 'user' ? 'bg-violet-600 text-white rounded-tr-none shadow-xl' : 'bg-white/5 text-slate-300 rounded-tl-none border border-white/10'}`}>
                           {m.text}
                        </div>
                     </div>
                   ))}
                </div>

                <div className="p-6 bg-white/5 border-t border-white/5">
                   <div className="relative group">
                      <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Gizli mesajınızı yazın..."
                        className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-6 pr-16 text-sm text-white outline-none focus:border-violet-500 transition-all"
                      />
                      <button
                        onClick={handleSend}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-violet-600 hover:bg-violet-500 text-white rounded-xl flex items-center justify-center transition-all shadow-lg"
                      >
                         <Send className="w-4 h-4" />
                      </button>
                   </div>
                </div>
             </div>
          </div>

          <div className="lg:col-span-4 space-y-6 overflow-y-auto custom-scrollbar-hidden">
             <div className="bg-gradient-to-br from-violet-600/20 to-brandDark border border-violet-600/20 rounded-[40px] p-8 shadow-2xl">
                <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 italic border-b border-white/5 pb-2">Kanallar</h3>
                <div className="space-y-4">
                   {[
                     { name: 'WhatsApp', icon: <MessageSquare className="w-4 h-4" />, status: 'Bağlı' },
                     { name: 'Telegram', icon: <Send className="w-4 h-4" />, status: 'Beklemede' },
                     { name: 'Slack', icon: <Share2 className="w-4 h-4" />, status: 'Bağlı değil' },
                   ].map(c => (
                     <div key={c.name} className="flex justify-between items-center p-3 bg-black/40 border border-white/5 rounded-xl">
                        <div className="flex items-center gap-3">
                           <div className="text-violet-400">{c.icon}</div>
                           <span className="text-xs font-bold text-white">{c.name}</span>
                        </div>
                        <span className={`text-[9px] font-black uppercase ${c.status === 'Bağlı' ? 'text-emerald-500' : 'text-slate-600'}`}>{c.status}</span>
                     </div>
                   ))}
                </div>
             </div>

             <div className="glass-panel p-8 rounded-[40px] border border-white/5 bg-white/5 space-y-6">
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sistem Yetenekleri</h4>
                <div className="grid grid-cols-2 gap-3">
                   <div className="p-4 bg-black/40 border border-white/5 rounded-2xl text-center space-y-2 group hover:border-violet-500/50 transition-all">
                      <FolderSync className="w-5 h-5 text-violet-400 mx-auto" />
                      <p className="text-[9px] font-black uppercase text-slate-500">Klasör Senk</p>
                   </div>
                   <div className="p-4 bg-black/40 border border-white/5 rounded-2xl text-center space-y-2 group hover:border-violet-500/50 transition-all">
                      <Database className="w-5 h-5 text-violet-400 mx-auto" />
                      <p className="text-[9px] font-black uppercase text-slate-500">Vektör DB</p>
                   </div>
                   <div className="p-4 bg-black/40 border border-white/5 rounded-2xl text-center space-y-2 group hover:border-violet-500/50 transition-all">
                      <ImageIcon className="w-5 h-5 text-violet-400 mx-auto" />
                      <p className="text-[9px] font-black uppercase text-slate-500">Görsel Düzen</p>
                   </div>
                   <div className="p-4 bg-black/40 border border-white/5 rounded-2xl text-center space-y-2 group hover:border-violet-500/50 transition-all">
                      <Cpu className="w-5 h-5 text-violet-400 mx-auto" />
                      <p className="text-[9px] font-black uppercase text-slate-500">Düşünce Zinciri</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelineView;
