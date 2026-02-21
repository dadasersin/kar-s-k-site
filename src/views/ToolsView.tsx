import React, { useState } from 'react';
import { AppView } from '../types';

type Tool = {
  id: number;
  title: string;
  desc: string;
  category: string;
  color: string;
  img: string;
  targetView: AppView;
};

interface ToolsViewProps {
  onViewChange: (view: AppView | string) => void;
}

const ToolsView: React.FC<ToolsViewProps> = ({ onViewChange }) => {
  const [filter, setFilter] = useState('Hepsi');
  const tools: Tool[] = [
    {
      id: 1,
      title: "Neural Art Studio",
      desc: "Stable Diffusion tabanlı görsel üretici.",
      category: "Görsel",
      color: "bg-primary",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBjLcL_x9ZzuolUwKSx9NaPV4ofzoxeZKN7xRZo3VKZhejgtQrVRIEvLa7e3BlZrFQzjT4rN03nfR6q3oht9eQGHMBkHC6Y8eLOLEejILpSTFUla1wzly9MktfvQTKCOAHYUupu8NVazOWa79q5E5OadIVZe4tA-dNMkV8Ms3G2lF_sjZUpoj1OHbnjUvJnE8x1f3HtFwlDlJYO7ar3kgDVxZkfa3Em_ULAwKhSKEzYUGqmMr1UkdYiLnfAOyETNGy-9uZWYy-PEOy3",
      targetView: AppView.VISUALS
    },
    {
      id: 2,
      title: "Echo Voice Gen",
      desc: "Gerçekçi ses klonlama ve TTS aracı.",
      category: "Ses",
      color: "bg-indigo-500",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDu_sB1iEt3gK3al5JqBd7jOuYrz42qAOuClMv8BTAoVI6PwBpQWvvTw17cyxLAqdNTRmlFvt96B-sSGIJC7AUF5EYkol-Fc8HYChvxjhPd8dFdiUs2uie4Xkcp3FxQJe3wKFLV8Kglth0wUYnbCV-kmfhubRfvq65-amI3zdOyv6u7HcjTk6TgU2f3GX8jVbLwQnjDk-U5hs5st7k9kXwP814HT1N7vFfjf1X2JbfSm3c5HceC5cctbVfKD28Nr3Cc9daODWDSS3jt",
      targetView: AppView.AUDIO
    },
    {
      id: 3,
      title: "LogicBot v4",
      desc: "Kodlama ve matematik odaklı LLM.",
      category: "Metin",
      color: "bg-teal-500",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDsvAwOh8fOrEYp6HliL-LNHnil-3MoxTg7a3M-XoS7R1kCyxI95BLHnJwIDN0Tjbo7vKnJr8B0sEJPAV6HkfZEzRLt3I_JeuipHfl0rs-ZemcWW7LxKPRGnAifyRyNESqB8GO7lOmAkJmUBLdPToXPT7Ge0gRPv9Zqe6E6s4nwfeKclvlPRBMrX33W1veMJA-Jm70zNybQL_W7BzRshgFzUy0paStlBVV3uxWg62IiPfxVT9hu-Pp3PNKubaMj6HQjS7yohwaoJZx2",
      targetView: AppView.CHAT
    },
    {
      id: 4,
      title: "Motion Flow AI",
      desc: "Görsellerden sinematik videolar üretin.",
      category: "Video",
      color: "bg-pink-500",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBPnQmvn6XWOQr0njkvt5XY-Lhi-Ko3KBpkAYL26Q4Wu8EbaOn1zTo0L149W5tzp4Rjd3-xpbKv8M6WmnFI2SvEGaTnfird0CfWizuKVkJ_MoudOnMFUTOaAurh6bMB-JdqcuMcBQTyj2MQSW2VbySfAF1PhkvC8E5ukG-uGRrGeIPvXnntX-XEVVtEI1yCZZkl0QoBzlzdu9j39S9QyHpIUM9z5qn0a-N6Q6dsyxY78MoEFRQSUW0lXv_tLAXqRA_wukGyVWfh262j",
      targetView: AppView.VISUALS
    }
  ];

  const filteredTools = filter === 'Hepsi' ? tools : tools.filter(t => t.category === filter);

  return (
    <section className="section-transition p-8 lg:p-12 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full overflow-y-auto pb-32" id="tools">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-2">YZ Araç Kütüphanesi</h2>
            <p className="text-gray-400">Ersin Güleş tarafından küratörlüğü yapılmış özel araçlar.</p>
          </div>
          <div className="flex gap-2 bg-surface p-1 rounded-custom border border-white/5">
            {['Hepsi', 'Görsel', 'Ses', 'Metin'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 text-sm font-bold rounded-custom transition-all ${
                  filter === cat ? 'bg-primary text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTools.map((tool) => (
            <div key={tool.id} className="bg-surface border border-white/5 rounded-custom overflow-hidden group hover:border-primary/50 transition-colors">
              <div className="aspect-video bg-gray-800 relative overflow-hidden">
                <img src={tool.img} alt={tool.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <span className={`absolute top-3 left-3 px-2 py-1 ${tool.color} text-[10px] font-bold uppercase rounded-custom`}>{tool.category}</span>
              </div>
              <div className="p-5">
                <h5 className="font-bold mb-1">{tool.title}</h5>
                <p className="text-xs text-gray-400 mb-4">{tool.desc}</p>
                <button
                  onClick={() => onViewChange(tool.targetView)}
                  className="w-full py-2 bg-white/5 hover:bg-primary hover:text-white text-primary border border-primary/20 transition-colors text-xs font-bold rounded-custom uppercase"
                >
                  Başlat
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ToolsView;
