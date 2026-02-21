import React, { useState, useEffect, useRef } from 'react';
import {
  Smartphone,
  Code2,
  Play,
  Settings,
  FolderTree,
  Search,
  Bug,
  Terminal,
  Cpu,
  Wifi,
  Battery,
  Monitor,
  Layout,
  Layers,
  Zap,
  Github
} from 'lucide-react';
import { motion } from 'framer-motion';

const AndroidStudioView: React.FC = () => {
  const [isBuilding, setIsBuilding] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [code, setCode] = useState(`package com.ersin.portal

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.ersin.portal.databinding.ActivityMainBinding

class MainActivity : AppCompatActivity() {
    private lateinit var binding: ActivityMainBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        binding.statusText.text = "Portal Android Aktif!"

        binding.actionButton.setOnClickListener {
            // AI Entegrasyonu Başlatıldı
            showToast("İşlem Başarılı")
        }
    }
}`);

  const logEndRef = useRef<HTMLDivElement>(null);

  const addLog = (msg: string) => {
    const time = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${time}] ${msg}`].slice(-20));
  };

  const handleRun = () => {
    setIsBuilding(true);
    addLog("Gradle build started...");
    addLog(":app:preBuild UP-TO-DATE");
    addLog(":app:compileDebugKotlin...");

    setTimeout(() => {
      setIsBuilding(false);
      setIsRunning(true);
      addLog("Build Successful in 2.4s");
      addLog("Installing APK to Emulator-5554...");
      addLog("Launching MainActivity...");
    }, 2500);
  };

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="h-full flex flex-col bg-[#1e1f22] text-[#bcbec4] font-sans select-none overflow-hidden">
      {/* Top Menu Bar */}
      <div className="h-10 bg-[#2b2d30] border-b border-[#393b40] flex items-center px-4 justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-[#3574f0]" />
            <span className="text-[11px] font-medium">Android Studio Portal</span>
          </div>
          <div className="flex gap-4 text-[11px] opacity-70">
            <span>File</span>
            <span>Edit</span>
            <span>View</span>
            <span>Navigate</span>
            <span>Code</span>
            <span>Refactor</span>
            <span>Build</span>
            <span>Run</span>
            <span>Tools</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-2 bg-[#393b40] px-3 py-1 rounded text-[11px]">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              Pixel 7 Pro (API 34)
           </div>
           <button
             onClick={handleRun}
             disabled={isBuilding}
             className={`w-8 h-8 rounded flex items-center justify-center transition-colors ${isBuilding ? 'bg-gray-700' : 'bg-[#3574f0] hover:bg-[#467ff2]'}`}
           >
             {isBuilding ? <Cpu className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 text-white" />}
           </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side Rail */}
        <div className="w-10 bg-[#2b2d30] border-r border-[#393b40] flex flex-col items-center py-4 gap-6">
           <FolderTree className="w-5 h-5 text-primary" />
           <Search className="w-5 h-5 opacity-40" />
           <Bug className="w-5 h-5 opacity-40" />
           <Github className="w-5 h-5 opacity-40 cursor-pointer hover:opacity-100 transition-opacity" onClick={() => window.open('https://github.com/topics/android-studio', '_blank')} />
        </div>

        {/* Project Explorer */}
        <div className="w-64 bg-[#1e1f22] border-r border-[#393b40] flex flex-col">
           <div className="p-3 text-[10px] font-bold uppercase tracking-widest border-b border-[#393b40] flex justify-between items-center">
              Project Explorer
              <Settings className="w-3 h-3 opacity-40" />
           </div>
           <div className="flex-1 overflow-y-auto p-2 text-[12px] space-y-1">
              <div className="flex items-center gap-2 px-2 py-1 bg-[#2b2d30] rounded cursor-pointer">
                 <Layout className="w-3 h-3 text-primary" /> app
              </div>
              <div className="ml-4 space-y-1">
                 <div className="flex items-center gap-2 px-2 py-1 opacity-60">
                    <Layers className="w-3 h-3" /> manifests
                 </div>
                 <div className="flex items-center gap-2 px-2 py-1 text-[#3574f0]">
                    <Code2 className="w-3 h-3" /> java / kotlin
                 </div>
                 <div className="ml-4">
                    <div className="flex items-center gap-2 px-2 py-1 bg-[#3574f0]/10 text-white rounded">
                       <Smartphone className="w-3 h-3" /> MainActivity.kt
                    </div>
                 </div>
                 <div className="flex items-center gap-2 px-2 py-1 opacity-60">
                    <Layout className="w-3 h-3" /> res / layout
                 </div>
                 <div className="flex items-center gap-2 px-2 py-1 opacity-60">
                    <Zap className="w-3 h-3 text-amber-500" /> Gradle Scripts
                 </div>
              </div>
           </div>
        </div>

        {/* Code Editor */}
        <div className="flex-1 flex flex-col bg-[#1e1f22]">
           <div className="h-9 bg-[#2b2d30] border-b border-[#393b40] flex items-center px-4 gap-1">
              <div className="bg-[#1e1f22] border-x border-t border-[#393b40] px-4 h-full flex items-center gap-2 text-[11px] text-white">
                 <Code2 className="w-3 h-3 text-[#3574f0]" /> MainActivity.kt
              </div>
           </div>
           <div className="flex-1 p-6 font-mono text-sm overflow-y-auto relative">
              <div className="absolute left-0 top-0 w-12 h-full bg-[#1e1f22] border-r border-[#393b40] flex flex-col items-center pt-6 text-[10px] opacity-30 select-none">
                 {Array.from({length: 30}).map((_, i) => <div key={i} className="h-5 leading-5">{i + 1}</div>)}
              </div>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-full bg-transparent border-none outline-none resize-none pl-10 text-[#bcbec4] spellcheck-false"
                style={{ lineHeight: '1.25rem' }}
              />
           </div>
        </div>

        {/* Emulator Sidebar */}
        <div className="w-80 bg-[#2b2d30] border-l border-[#393b40] flex flex-col">
           <div className="p-3 text-[10px] font-bold uppercase tracking-widest border-b border-[#393b40] flex justify-between items-center">
              Running Devices
              <Monitor className="w-3 h-3 opacity-40" />
           </div>
           <div className="flex-1 flex items-center justify-center p-4">
              {/* Phone Frame */}
              <div className="w-[260px] h-[520px] bg-[#050505] rounded-[40px] border-[6px] border-[#1e1f22] shadow-2xl relative overflow-hidden flex flex-col">
                 {/* Notch */}
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-[#1e1f22] rounded-b-2xl z-20"></div>

                 {/* Content */}
                 <div className="flex-1 relative bg-brandDark">
                    {!isRunning ? (
                      <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-4">
                         <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                            <Smartphone className="w-8 h-8 text-gray-700" />
                         </div>
                         <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Device Offline</p>
                      </div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="h-full flex flex-col"
                      >
                         {/* Status Bar */}
                         <div className="h-10 px-6 flex justify-between items-center text-[10px] font-bold text-white pt-2">
                            <span>12:45</span>
                            <div className="flex gap-1">
                               <Wifi className="w-3 h-3" />
                               <Battery className="w-3 h-3" />
                            </div>
                         </div>

                         {/* App UI */}
                         <div className="flex-1 p-6 space-y-6">
                            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/40">
                               <Smartphone className="w-6 h-6 text-white" />
                            </div>
                            <div className="space-y-2">
                               <h1 className="text-xl font-black text-white italic tracking-tighter uppercase">Android Portal</h1>
                               <div className="w-12 h-1 bg-primary rounded-full"></div>
                            </div>

                            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-[11px] text-slate-300">
                               Portal Android Sistemi Başarıyla Başlatıldı.
                            </div>

                            <button className="w-full py-4 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-xl shadow-primary/20">
                               İşlem Yap
                            </button>
                         </div>
                      </motion.div>
                    )}
                 </div>

                 {/* Navigation Bar */}
                 <div className="h-12 bg-black/40 backdrop-blur-xl border-t border-white/5 flex items-center justify-center gap-12">
                    <div className="w-2 h-2 rounded-full bg-white/20"></div>
                    <div className="w-10 h-1 bg-white/40 rounded-full"></div>
                    <div className="w-2 h-2 rounded-full bg-white/20"></div>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Bottom Tool Window (Logcat/Terminal) */}
      <div className="h-48 bg-[#2b2d30] border-t border-[#393b40] flex flex-col">
         <div className="h-9 border-b border-[#393b40] flex items-center px-4 gap-6">
            <div className="flex items-center gap-2 text-[10px] font-bold text-white uppercase tracking-widest border-b-2 border-[#3574f0] h-full px-2">
               <Terminal className="w-3 h-3" /> Logcat
            </div>
            <div className="text-[10px] font-bold opacity-40 uppercase tracking-widest">Terminal</div>
            <div className="text-[10px] font-bold opacity-40 uppercase tracking-widest">Build</div>
            <div className="text-[10px] font-bold opacity-40 uppercase tracking-widest">App Inspection</div>
         </div>
         <div className="flex-1 p-3 font-mono text-[11px] overflow-y-auto space-y-1 bg-[#1e1f22]">
            {logs.length === 0 && <div className="text-gray-600 opacity-50 italic">Cihaz bekleniyor...</div>}
            {logs.map((log, i) => (
              <div key={i} className="flex gap-4 group">
                 <span className="text-[#4e5157] min-w-[80px]">{log.split(']')[0]}]</span>
                 <span className={`${log.includes('Error') ? 'text-red-400' : log.includes('Success') ? 'text-green-400' : 'text-[#bcbec4]'}`}>
                    {log.split(']')[1]}
                 </span>
              </div>
            ))}
            <div ref={logEndRef} />
         </div>
      </div>
    </div>
  );
};

export default AndroidStudioView;
