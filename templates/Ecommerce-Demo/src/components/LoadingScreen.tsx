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
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 transition-all duration-500 ease-in-out ${
        fadeAway ? "opacity-0 scale-105 pointer-events-none" : "opacity-100 scale-100"
      }`}
    >
      {/* Dynamic Glowing Accent in Background */}
      <div className="absolute w-[450px] h-[450px] rounded-full bg-radial from-blue-100/40 via-blue-50/5 to-transparent blur-3xl animate-pulse pointer-events-none z-0" />

      {/* Premium Glass Card Container */}
      <div className="relative z-10 flex flex-col items-center bg-white/40 border border-white/80 shadow-[0_32px_64px_-16px_rgba(15,23,42,0.08)] backdrop-blur-2xl rounded-3xl px-12 py-16 max-w-sm w-full mx-4 text-center">
        
        {/* Animated Brand Emblem */}
        <div className="w-20 h-20 rounded-2xl bg-blue-500/10 border border-blue-500/20 shadow-inner flex items-center justify-center mb-8 relative">
          <div className="absolute inset-0 rounded-2xl bg-blue-500/20 animate-ping opacity-30" />
          <svg 
            className="w-10 h-10 text-blue-600 animate-pulse" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            viewBox="0 0 24 24"
          >
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
        </div>

        {/* Business Title */}
        <h1 className="text-3xl font-black tracking-widest text-zinc-950 uppercase mb-2 font-sans select-none">
          {businessName}
        </h1>

        <p className="text-[10px] font-bold tracking-[0.4em] text-zinc-400 uppercase mb-10 select-none">
          Smart Store Experience
        </p>

        {/* Custom Progress Bar */}
        <div className="w-full h-1.5 bg-zinc-100 border border-zinc-200/30 rounded-full overflow-hidden relative">
          <div 
            className="h-full bg-gradient-to-r from-blue-600 to-blue-500 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Progress Percent */}
        <span className="text-[10px] font-bold font-mono tracking-widest text-zinc-500 mt-3 select-none">
          {progress}%
        </span>
      </div>
    </div>
  );
}
