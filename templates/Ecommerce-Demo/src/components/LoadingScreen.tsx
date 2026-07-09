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
      const increment = Math.floor(Math.random() * 3) + 2;
      setProgress((old) => {
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
      }, 600);

      const removeTimer = setTimeout(() => {
        setVisible(false);
        if (onFinished) onFinished();
      }, 1400);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(removeTimer);
      };
    }
  }, [progress, onFinished]);

  if (!visible) return null;

  const words = businessName.split(" ");

  return (
    <div
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-white transition-[opacity,transform] duration-750 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        fadeAway ? "opacity-0 scale-[1.02] pointer-events-none" : "opacity-100 scale-100"
      }`}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes blur-reveal-ecom {
          0% {
            opacity: 0;
            filter: blur(16px);
            transform: scale(1.1);
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
          color: #0f172a;
          animation: blur-reveal-ecom 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-subtle-fade {
          animation: subtle-fade 1s ease-in-out forwards;
        }
      `}} />

      {/* Decorative Ultra-soft Radial Ambient Light */}
      <div 
        className="absolute w-[600px] h-[600px] rounded-full bg-radial from-blue-100/30 via-transparent to-transparent blur-3xl pointer-events-none z-0" 
        style={{ transform: 'translate3d(0,0,0)' }}
      />

      <div className="relative z-10 flex flex-col items-center max-w-lg w-full px-8 text-center select-none">
        
        {/* Business Title - Light Cinematic Letter-by-Letter Blur Reveal with Whole Word Wrapping */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[0.12em] uppercase font-sans mb-8 flex flex-wrap justify-center gap-y-2">
          {words.map((word, wordIndex) => (
            <span key={wordIndex} className="inline-block whitespace-nowrap">
              {word.split("").map((char, charIndex) => {
                const globalIndex = words.slice(0, wordIndex).join(" ").length + (wordIndex > 0 ? 1 : 0) + charIndex;
                return (
                  <span 
                    key={charIndex} 
                    className="animate-blur-char" 
                    style={{ animationDelay: `${globalIndex * 0.08}s` }}
                  >
                    {char}
                  </span>
                );
              })}
              {/* Spacer between words */}
              {wordIndex < words.length - 1 && <span className="inline-block">&nbsp;</span>}
            </span>
          ))}
        </h1>

        {/* Extremely thin elegant loading bar */}
        <div className="animate-subtle-fade w-48 h-[1px] bg-slate-100 rounded-full overflow-hidden relative mb-4">
          <div 
            className="h-full bg-gradient-to-r from-blue-600 to-blue-500 rounded-full transition-[width] duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Cinematic Subtitle */}
        <p className="animate-subtle-fade text-[9px] font-bold tracking-[0.4em] text-blue-500/60 uppercase">
          Smart Store Experience
        </p>
      </div>
    </div>
  );
}
