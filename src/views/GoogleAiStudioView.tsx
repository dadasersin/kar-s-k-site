import React from 'react';

const GoogleAiStudioView: React.FC = () => {
  return (
    <div className="h-full w-full bg-[#050505] flex flex-col overflow-hidden">
      <div className="flex-1 relative">
        <iframe
          src="https://aistudio.google.com/apps/b6a2f6ba-220b-4cb7-9120-f130847064d7?showPreview=true&showAssistant=true"
          className="absolute inset-0 w-full h-full border-none"
          title="Google AI Studio"
          allow="autoplay; camera; microphone; clipboard-read; clipboard-write; display-capture"
        />
      </div>
    </div>
  );
};

export default GoogleAiStudioView;
