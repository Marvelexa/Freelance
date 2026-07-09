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
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-black transition-[opacity,transform] duration-750 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        fadeAway ? "opacity-0 scale-[1.03] pointer-events-none" : "opacity-100 scale-100"
      }`}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes blur-reveal {
          0% {
            opacity: 0;
            filter: blur(16px);
            transform: scale(1.12);
          }
          100% {
            opacity: 1;
            filter: blur(0px);
            transform: scale(1);
          }
        }
        @keyframes subtle-fade {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        .animate-blur-char {
          display: inline-block;
          opacity: 0;
          animation: blur-reveal 1.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-subtle-fade {
          animation: subtle-fade 1.2s ease-in-out forwards;
        }
      `}} />

      {/* Decorative Subtle Dark Radial Ambient Light */}
      <div 
        className="absolute w-[500px] h-[500px] rounded-full bg-radial from-[#c5a059]/5 via-transparent to-transparent blur-3xl pointer-events-none z-0" 
        style={{ transform: 'translate3d(0,0,0)' }}
      />

      <div className="relative z-10 flex flex-col items-center max-w-lg w-full px-8 text-center select-none">
        
        {/* Business Title - Cinematic Letter-by-Letter Blur Reveal */}
        <h1 className="text-[2.85rem] font-bold tracking-[0.1em] text-white uppercase font-serif mb-8">
          {businessName.split("").map((char, index) => (
            <span 
              key={index} 
              className="animate-blur-char" 
              style={{ animationDelay: `${index * 0.12}s` }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </h1>

        {/* Extremely thin elegant loading bar */}
        <div className="animate-subtle-fade w-48 h-[1px] bg-zinc-900 rounded-full overflow-hidden relative mb-4">
          <div 
            className="h-full bg-white rounded-full transition-[width] duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Cinematic Subtitle */}
        <p className="animate-subtle-fade text-[9px] font-medium tracking-[0.4em] text-zinc-500 uppercase">
          FINE DINING & GASTRONOMY
        </p>
      </div>
    </div>
  );
}
