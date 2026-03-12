import React, { useState } from 'react';
import { Shield, Lock, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoginViewProps {
  onLogin: () => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleKeyPress = (num: string) => {
    if (passcode.length < 4) {
      setPasscode(prev => prev + num);
      setError(false);
    }
  };

  const clear = () => setPasscode('');

  const submit = async () => {
    if (passcode === '0000') {
      setLoading(true);
      setTimeout(() => {
        onLogin();
      }, 1500);
    } else {
      setError(true);
      setPasscode('');
      // Haptic feedback simulation
      if (navigator.vibrate) navigator.vibrate(200);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-[#050505] flex items-center justify-center p-6 font-sans overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(13,89,242,0.1),transparent_70%)]"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-12">
            <div className="w-20 h-20 bg-primary/10 rounded-[2.5rem] flex items-center justify-center text-primary mx-auto mb-6 border border-primary/20 shadow-[0_0_40px_rgba(13,89,242,0.3)] animate-pulse">
                <Shield className="w-10 h-10" />
            </div>
            <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-2">NEXUS PROTECTION</h1>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em]">Güvenli Erişim Protokolü v4.0</p>
        </div>

        <div className="glass-panel p-10 rounded-[3.5rem] border border-white/10 bg-brandDark/40 backdrop-blur-3xl shadow-2xl relative overflow-hidden">
            {loading ? (
                <div className="py-20 text-center space-y-6">
                    <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto"></div>
                    <p className="text-xs font-black text-primary uppercase tracking-widest animate-pulse">Nöral Bağlantı Kuruluyor...</p>
                </div>
            ) : (
                <div className="space-y-8">
                    {/* Passcode Display */}
                    <div className="flex justify-center gap-4">
                        {[0, 1, 2, 3].map((i) => (
                            <motion.div
                                key={i}
                                animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
                                className={`w-12 h-16 rounded-2xl border-2 flex items-center justify-center transition-all duration-300 ${
                                    passcode.length > i
                                    ? 'bg-primary border-primary shadow-[0_0_20px_rgba(13,89,242,0.5)]'
                                    : error
                                        ? 'border-red-500 bg-red-500/10'
                                        : 'border-white/10 bg-white/5'
                                }`}
                            >
                                {passcode.length > i && <div className="w-3 h-3 bg-white rounded-full"></div>}
                            </motion.div>
                        ))}
                    </div>

                    {/* Numeric Keypad */}
                    <div className="grid grid-cols-3 gap-4">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
                            <button
                                key={n}
                                onClick={() => handleKeyPress(n.toString())}
                                className="w-full aspect-square rounded-2xl bg-white/5 border border-white/5 hover:bg-primary/20 hover:border-primary/40 text-xl font-bold text-white transition-all active:scale-95"
                            >
                                {n}
                            </button>
                        ))}
                        <button onClick={clear} className="w-full aspect-square rounded-2xl bg-white/5 border border-white/5 text-slate-500 text-xs font-black uppercase hover:text-white transition-all">SİL</button>
                        <button onClick={() => handleKeyPress('0')} className="w-full aspect-square rounded-2xl bg-white/5 border border-white/5 text-xl font-bold text-white hover:bg-primary/20 transition-all">0</button>
                        <button
                            onClick={submit}
                            disabled={passcode.length < 4}
                            className={`w-full aspect-square rounded-2xl border font-black text-[10px] uppercase transition-all ${
                                passcode.length === 4
                                ? 'bg-primary border-primary text-white shadow-lg'
                                : 'bg-white/5 border-white/5 text-slate-700'
                            }`}
                        >
                            GİRİŞ
                        </button>
                    </div>

                    <div className="pt-4 text-center">
                        <p className={`text-[9px] font-black uppercase tracking-widest ${error ? 'text-red-500' : 'text-slate-600'}`}>
                            {error ? 'HATALI GİRİŞ TESPİT EDİLDİ' : 'YETKİLİ PERSONEL ONAYI GEREKLİ'}
                        </p>
                    </div>
                </div>
            )}
        </div>

        <div className="mt-12 flex items-center justify-center gap-6 opacity-30">
            <div className="flex items-center gap-2">
                <Lock className="w-3 h-3" />
                <span className="text-[8px] font-black uppercase tracking-widest text-white">256-Bit Encrypted</span>
            </div>
            <div className="w-1 h-1 bg-slate-700 rounded-full"></div>
            <div className="flex items-center gap-2">
                <Cpu className="w-3 h-3" />
                <span className="text-[8px] font-black uppercase tracking-widest text-white">Neural Key Auth</span>
            </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginView;
