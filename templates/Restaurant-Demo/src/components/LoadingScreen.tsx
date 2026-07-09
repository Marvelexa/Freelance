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
        const increment = Math.floor(Math.random() * 12) + 6;
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
      }, 500);

      const removeTimer = setTimeout(() => {
        setVisible(false);
        if (onFinished) onFinished();
      }, 1200);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(removeTimer);
      };
    }
  }, [progress, onFinished]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-white transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        fadeAway ? "opacity-0 scale-[1.02] pointer-events-none" : "opacity-100 scale-100"
      }`}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes subtle-fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(16px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-emblem {
          animation: subtle-fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-title {
          animation: subtle-fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.15s forwards;
          opacity: 0;
        }
        .animate-tagline {
          animation: subtle-fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards;
          opacity: 0;
        }
        .animate-loader {
          animation: subtle-fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.45s forwards;
          opacity: 0;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-emblem, .animate-title, .animate-tagline, .animate-loader {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}} />

      {/* Decorative Ultra-soft Radial Ambient Light */}
      <div 
        className="absolute w-[600px] h-[600px] rounded-full bg-radial from-[#c5a059]/5 via-transparent to-transparent blur-3xl pointer-events-none z-0" 
        style={{ transform: 'translate3d(0,0,0)' }}
      />

      <div className="relative z-10 flex flex-col items-center max-w-lg w-full px-8 text-center select-none">
        
        {/* Sleek Floating Icon */}
        <div className="animate-emblem mb-8 relative flex items-center justify-center">
          <div className="absolute inset-0 w-16 h-16 rounded-full bg-[#c5a059]/[0.02] border border-[#c5a059]/[0.04] animate-pulse" />
          <div className="relative w-16 h-16 rounded-full bg-white border border-[#c5a059]/20 shadow-[0_8px_16px_rgba(0,0,0,0.02)] flex items-center justify-center">
            <svg 
              className="w-7 h-7 text-[#a07e3c]" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
              <path d="M7 2v20" />
              <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Z" />
              <path d="M19 15v7" />
            </svg>
          </div>
        </div>

        {/* Business Title - Clean, elegant typography */}
        <h1 className="animate-title text-[2.75rem] font-bold tracking-tight text-[#2f2515] uppercase font-serif mb-3 text-wrap-balance">
          {businessName}
        </h1>

        <p className="animate-tagline text-[11px] font-semibold tracking-[0.5em] text-[#c5a059] uppercase mb-12">
          Gastronomy Redefined
        </p>

        {/* Progress Bar Area */}
        <div className="animate-loader w-full flex flex-col items-center">
          {/* Extremely thin elegant loading bar */}
          <div className="w-48 h-[2px] bg-slate-100 rounded-full overflow-hidden relative">
            <div 
              className="h-full bg-gradient-to-r from-[#c5a059] to-[#ebd7a7] rounded-full transition-[width] duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          <span className="text-[10px] font-bold font-mono tracking-widest text-[#a07e3c] mt-4">
            {progress}%
          </span>
          
          <span className="text-[10px] font-bold tracking-[0.2em] text-[#c5a059]/65 uppercase mt-2">
            Loading…
          </span>
        </div>
      </div>
    </div>
  );
}
