import { useState, useEffect } from "react";

interface LoadingScreenProps {
  businessName: string;
  onFinished?: () => void;
}

export default function LoadingScreen({ businessName, onFinished }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [fadeAway, setFadeAway] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((old) => {
        const increment = Math.floor(Math.random() * 15) + 5;
        const next = old + increment;
        if (next >= 100) {
          clearInterval(interval);
          return 100;
        }
        return next;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress === 100) {
      const fadeTimer = setTimeout(() => {
        setFadeAway(true);
      }, 400);

      const removeTimer = setTimeout(() => {
        setVisible(false);
        if (onFinished) onFinished();
      }, 1000);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(removeTimer);
      };
    }
  }, [progress, onFinished]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-gradient-to-br from-[#faf8f5] via-white to-[#f5f1ea] transition-all duration-500 ease-in-out ${
        fadeAway ? "opacity-0 scale-105 pointer-events-none" : "opacity-100 scale-100"
      }`}
    >
      {/* Dynamic Glowing Luxury Accent in Background */}
      <div className="absolute w-[450px] h-[450px] rounded-full bg-radial from-[#c5a059]/10 via-[#c5a059]/1 to-transparent blur-3xl animate-pulse pointer-events-none z-0" />

      {/* Premium Glass Card Container */}
      <div className="relative z-10 flex flex-col items-center bg-white/50 border border-white/90 shadow-[0_32px_64px_-16px_rgba(45,35,20,0.06)] backdrop-blur-2xl rounded-3xl px-12 py-16 max-w-sm w-full mx-4 text-center">
        
        {/* Animated Brand Emblem */}
        <div className="w-20 h-20 rounded-2xl bg-[#c5a059]/10 border border-[#c5a059]/20 shadow-inner flex items-center justify-center mb-8 relative">
          <div className="absolute inset-0 rounded-2xl bg-[#c5a059]/20 animate-ping opacity-30" />
          <svg 
            className="w-10 h-10 text-[#a07e3c] animate-pulse" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            viewBox="0 0 24 24"
          >
            <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
            <path d="M7 2v20" />
            <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Z" />
            <path d="M19 15v7" />
          </svg>
        </div>

        {/* Business Title */}
        <h1 className="text-3xl font-black tracking-widest text-[#2f2515] uppercase mb-2 font-serif select-none">
          {businessName}
        </h1>

        <p className="text-[10px] font-bold tracking-[0.4em] text-[#c5a059] uppercase mb-10 select-none">
          Gastronomy Redefined
        </p>

        {/* Custom Progress Bar */}
        <div className="w-full h-1.5 bg-[#f5f1f5]/30 border border-[#c5a059]/15 rounded-full overflow-hidden relative">
          <div 
            className="h-full bg-gradient-to-r from-[#c5a059] to-[#ebd7a7] rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Progress Percent */}
        <span className="text-[10px] font-bold font-mono tracking-widest text-[#a07e3c] mt-3 select-none">
          {progress}%
        </span>
      </div>
    </div>
  );
}
