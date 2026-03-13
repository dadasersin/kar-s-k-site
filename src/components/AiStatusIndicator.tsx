import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AiStatusIndicator: React.FC = () => {
    const [usageInfo, setUsageInfo] = useState<any>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleStorage = () => {
            const info = localStorage.getItem('last_ai_usage_info');
            if (info) {
                setUsageInfo(JSON.parse(info));
                setIsVisible(true);
                const timer = setTimeout(() => setIsVisible(false), 5000);
                return () => clearTimeout(timer);
            }
        };

        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    if (!usageInfo) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="fixed bottom-24 right-6 z-[200] flex items-center gap-3 px-4 py-2 bg-brandDark/90 backdrop-blur-xl border border-primary/30 rounded-2xl shadow-2xl"
                >
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black text-white uppercase tracking-widest">{usageInfo.label}</span>
                        <span className="text-[8px] font-bold text-slate-400 uppercase">Kota: {usageInfo.usage} / {usageInfo.limit}</span>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AiStatusIndicator;
