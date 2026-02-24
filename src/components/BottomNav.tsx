import React from 'react';
import { AppView } from '../types';

interface BottomNavProps {
  activeView: AppView;
  onViewChange: (view: AppView) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeView, onViewChange }) => {
  const navItems = [
    { id: AppView.HOME, label: 'ANA SAYFA', icon: 'fa-house' },
    { id: AppView.CHAT, label: 'SOHBET', icon: 'fa-comments' },
    { id: AppView.TOOLS, label: 'ARAÇLAR', icon: 'fa-screwdriver-wrench' },
    { id: AppView.LIVE_TV, label: 'TV', icon: 'fa-tv' },
    { id: AppView.DASHBOARD, label: 'PANEL', icon: 'fa-chart-pie' },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-20 bg-brandDark/90 backdrop-blur-xl border-t border-white/5 flex items-center justify-around px-2 pb-safe z-[100]">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => onViewChange(item.id)}
          className={`flex flex-col items-center justify-center gap-1 min-w-[64px] transition-all duration-300 ${
            activeView === item.id ? 'text-primary' : 'text-slate-500'
          }`}
        >
          <div className={`relative ${activeView === item.id ? 'scale-110' : ''}`}>
             <i className={`fa-solid ${item.icon} text-xl`}></i>
             {activeView === item.id && (
               <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full"></span>
             )}
          </div>
          <span className="text-[10px] font-black tracking-tighter uppercase">{item.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default BottomNav;
