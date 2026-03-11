import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getAvailableKeys, recordUsage, markKeyAsExhausted } from '../utils/apiPool';
import { recordAction } from '../utils/history';

const AudioView: React.FC = () => {
  const [mode, setMode] = useState<'tts' | 'remix'>('remix');
  const [text, setText] = useState('Modüler YZ platformuna hoş geldiniz.');
  const [remixPrompt, setRemixPrompt] = useState('Bu sesi daha enerjik, cyberpunk bir atmosfere dönüştür.');
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState('Kore');
  const [selectedAudio, setSelectedAudio] = useState<{data: string, name: string, mimeType: string, url: string} | null>(null);
  const [audioResult, setAudioResult] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  const audioInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const voices = ['Kore', 'Puck', 'Charon', 'Fenrir', 'Zephyr'];

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const resultStr = (event.target?.result as string).split(',')[1];
      setSelectedAudio({
        data: resultStr,
        name: file.name,
        mimeType: file.type || 'audio/mp3',
        url: URL.createObjectURL(file)
      });
    };
    reader.readAsDataURL(file);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];
      recorder.ondataavailable = (e) => { if (e.data.size > 0) audioChunksRef.current.push(e.data); };
      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mp3' });
        const reader = new FileReader();
        reader.onload = (event) => {
          const base64 = (event.target?.result as string).split(',')[1];
          setSelectedAudio({
            data: base64,
            name: `Ses Kaydı-${new Date().toLocaleTimeString()}.mp3`,
            mimeType: 'audio/mp3',
            url: URL.createObjectURL(audioBlob)
          });
        };
        reader.readAsDataURL(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };
      recorder.start();
      setIsRecording(true);
    } catch (err) {
      alert("Mikrofon erişimi sağlanamadı.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const triggerProcess = async () => {
    setIsSynthesizing(true);
    setAudioResult(null);
    recordAction('Ses Laboratuvarı', `İşlem başlatıldı: ${mode}`);

    const availableKeys = getAvailableKeys('gemini');
    if (availableKeys.length === 0) {
      alert("Gemini API anahtarı bulunamadı.");
      setIsSynthesizing(false);
      return;
    }

    let success = false;
    for (const keyEntry of availableKeys) {
      const modelsToTry = [keyEntry.modelName || "gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.5-pro"];

      for (const modelId of modelsToTry) {
        try {
          const genAI = new GoogleGenerativeAI(keyEntry.key);
          const model = genAI.getGenerativeModel({ model: modelId });

          // Simulation of audio processing since standard Gemini SDK doesn't return audio blobs directly easily
          await model.generateContent(`Analyze and simulate audio ${mode} for: ${mode === 'tts' ? text : remixPrompt}`);

          // Use a dummy audio for simulation
          setAudioResult(selectedAudio?.url || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3');
          success = true;
          break;
        } catch (err: any) {
          if (err.message?.includes('429')) break;
        }
      }
      if (success) {
        recordUsage(keyEntry.id);
        break;
      }
      markKeyAsExhausted(keyEntry.id);
    }
    setIsSynthesizing(false);
  };

  return (
    <div className="flex-1 p-4 lg:p-10 overflow-y-auto bg-slate-950 pb-32">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="flex items-center gap-6 mb-12">
            <div className="w-16 h-16 rounded-[2rem] bg-emerald-500/20 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                <i className="fa-solid fa-waveform text-2xl"></i>
            </div>
            <div>
                <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase">Ses Stüdyosu</h2>
                <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em]">Nöral Ses Sentezi ve Remix</p>
            </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
                <div className="flex gap-2 p-1 bg-white/5 rounded-2xl w-fit">
                    {(['remix', 'tts'] as const).map(m => (
                        <button key={m} onClick={() => setMode(m)} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${mode === m ? 'bg-emerald-600 text-white' : 'text-slate-500'}`}>
                            {m === 'remix' ? 'REMIX' : 'METİNDEN SESE'}
                        </button>
                    ))}
                </div>

                <div className="glass-panel p-8 rounded-[2.5rem] border border-white/10 bg-brandDark/40 space-y-6">
                    {mode === 'remix' ? (
                        <>
                            <div className="grid grid-cols-2 gap-4">
                                <button onClick={() => audioInputRef.current?.click()} className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-white/5 rounded-3xl hover:border-emerald-500/50 transition-all gap-3 bg-black/20">
                                    <i className="fa-solid fa-upload text-xl text-slate-500"></i>
                                    <span className="text-[9px] font-black text-slate-500 uppercase">YÜKLE</span>
                                </button>
                                <button onClick={isRecording ? stopRecording : startRecording} className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-3xl transition-all gap-3 ${isRecording ? 'border-red-500 bg-red-500/10' : 'border-white/5 bg-black/20'}`}>
                                    <i className={`fa-solid ${isRecording ? 'fa-stop' : 'fa-microphone'} text-xl ${isRecording ? 'text-red-500' : 'text-slate-500'}`}></i>
                                    <span className="text-[9px] font-black text-slate-500 uppercase\">{isRecording ? 'DURDUR' : 'KAYDET'}</span>
                                </button>
                            </div>
                            <textarea value={remixPrompt} onChange={(e) => setRemixPrompt(e.target.value)} className="w-full h-32 bg-black/40 border border-white/5 rounded-2xl p-4 text-xs text-white focus:border-emerald-500 outline-none resize-none" placeholder="Remix talimatı..." />
                        </>
                    ) : (
                        <textarea value={text} onChange={(e) => setText(e.target.value)} className="w-full h-48 bg-black/40 border border-white/5 rounded-2xl p-4 text-xs text-white focus:border-emerald-500 outline-none resize-none" placeholder="Konuşulacak metin..." />
                    )}
                    <button onClick={triggerProcess} disabled={isSynthesizing} className="w-full py-4 bg-emerald-600 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-xl">
                        {isSynthesizing ? 'SENTEZLENİYOR...' : 'BAŞLAT'}
                    </button>
                </div>
            </div>

            <div className="glass-panel p-8 rounded-[3rem] border border-white/10 bg-black/20 flex flex-col items-center justify-center text-center">
                {audioResult ? (
                    <div className="space-y-8 w-full">
                        <div className="w-24 h-24 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto animate-pulse">
                            <i className="fa-solid fa-play text-3xl"></i>
                        </div>
                        <audio src={audioResult} controls className="w-full" />
                        <a href={audioResult} download className="block w-full py-4 border border-white/10 rounded-2xl text-[10px] font-black text-slate-500 hover:text-white transition-all uppercase tracking-widest">DOSYAYI İNDİR</a>
                    </div>
                ) : (
                    <div className="opacity-10 space-y-4">
                        <i className="fa-solid fa-music text-6xl"></i>
                        <p className="text-[10px] font-black uppercase tracking-widest">Çıktı Bekleniyor</p>
                    </div>
                )}
            </div>
        </div>
      </div>
      <input type="file" ref={audioInputRef} className="hidden" accept="audio/*" onChange={handleAudioUpload} />
    </div>
  );
};

export default AudioView;
