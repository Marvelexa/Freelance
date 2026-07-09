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
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-gradient-to-br from-neutral-950 via-stone-900 to-black transition-all duration-500 ease-in-out ${
        fadeAway ? "opacity-0 scale-105 pointer-events-none" : "opacity-100 scale-100"
      }`}
    >
      {/* Dynamic Glowing Accent in Background */}
      <div className="absolute w-[450px] h-[450px] rounded-full bg-radial from-amber-950/40 via-amber-900/5 to-transparent blur-3xl animate-pulse pointer-events-none z-0" />

      {/* Premium Glass Card Container */}
      <div className="relative z-10 flex flex-col items-center bg-stone-900/30 border border-stone-800/40 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] backdrop-blur-2xl rounded-3xl px-12 py-16 max-w-sm w-full mx-4 text-center">
        
        {/* Animated Brand Emblem */}
        <div className="w-20 h-20 rounded-2xl bg-amber-500/10 border border-amber-500/20 shadow-inner flex items-center justify-center mb-8 relative">
          <div className="absolute inset-0 rounded-2xl bg-amber-500/20 animate-ping opacity-30" />
          <svg 
            className="w-10 h-10 text-amber-500 animate-pulse" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            viewBox="0 0 24 24"
          >
            <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
            <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
            <line x1="6" y1="2" x2="6" y2="4" />
            <line x1="10" y1="2" x2="10" y2="4" />
            <line x1="14" y1="2" x2="14" y2="4" />
          </svg>
        </div>

        {/* Business Title */}
        <h1 
          className="text-3xl font-black tracking-widest text-stone-100 uppercase mb-2 font-serif select-none"
          style={{
            background: "linear-gradient(90deg, #d97706, #fef3c7, #b45309, #fef3c7, #d97706)",
            backgroundSize: "200% auto",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}
        >
          {businessName}
        </h1>

        <p className="text-[10px] font-bold tracking-[0.4em] text-stone-400 uppercase mb-10 select-none">
          Brewing Perfection
        </p>

        {/* Custom Progress Bar */}
        <div className="w-full h-1.5 bg-stone-900 border border-stone-800 rounded-full overflow-hidden relative">
          <div 
            className="h-full bg-gradient-to-r from-amber-600 to-amber-500 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Progress Percent */}
        <span className="text-[10px] font-bold font-mono tracking-widest text-stone-500 mt-3 select-none">
          {progress}%
        </span>
      </div>
    </div>
  );
}
