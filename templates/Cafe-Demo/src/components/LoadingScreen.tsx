import { useState, useEffect } from "react";

interface LoadingScreenProps {
  businessName: string;
  onFinished?: () => void;
}

export default function LoadingScreen({ businessName, onFinished }: LoadingScreenProps) {
  const [fadeAway, setFadeAway] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setFadeAway(true);
    }, 2000);

    const removeTimer = setTimeout(() => {
      setVisible(false);
      if (onFinished) onFinished();
    }, 2600);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, [onFinished]);

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #160f0b 0%, #0d0907 60%, #050403 100%)',
        opacity: fadeAway ? 0 : 1,
        transform: fadeAway ? 'scale(1.05)' : 'scale(1)',
        transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        pointerEvents: fadeAway ? 'none' : 'auto',
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes cafe-shimmer {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes cafe-barProgress {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(20%); }
          100% { transform: translateX(100%); }
        }
        @keyframes cafe-pulse-ring {
          0%, 100% { transform: scale(0.98); opacity: 0.15; }
          50% { transform: scale(1.03); opacity: 0.35; }
        }
        .cafe-glowing-circle {
          animation: cafe-pulse-ring 3s ease-in-out infinite;
        }
        .cafe-shimmer-text {
          background: linear-gradient(90deg, #d97706, #fef3c7, #b45309, #fef3c7, #d97706);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: cafe-shimmer 4s linear infinite;
        }
      `}} />

      {/* Decorative Glowing Backdrop */}
      <div 
        className="cafe-glowing-circle"
        style={{
          position: 'absolute',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(217, 119, 6, 0.08) 0%, rgba(217, 119, 6, 0) 70%)',
          filter: 'blur(40px)',
          zIndex: 0,
        }}
      />

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Animated Icon Ring */}
        <div 
          style={{
            width: '84px',
            height: '84px',
            borderRadius: '24px',
            border: '1px solid rgba(217, 119, 6, 0.15)',
            background: 'rgba(217, 119, 6, 0.03)',
            backdropFilter: 'blur(20px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '32px',
            boxShadow: '0 30px 60px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
          }}
        >
          <svg style={{ width: '36px', height: '36px', fill: 'none', stroke: '#d97706', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' }} viewBox="0 0 24 24">
            <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
            <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
            <line x1="6" y1="2" x2="6" y2="4" />
            <line x1="10" y1="2" x2="10" y2="4" />
            <line x1="14" y1="2" x2="14" y2="4" />
          </svg>
        </div>

        {/* Business Name */}
        <h1 
          className="cafe-shimmer-text"
          style={{
            fontSize: '2.5rem',
            fontWeight: 900,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            textAlign: 'center',
            margin: 0,
            padding: '0 24px',
            fontFamily: 'Georgia, serif',
          }}
        >
          {businessName}
        </h1>

        <p 
          style={{
            color: '#fef3c7',
            fontSize: '0.7rem',
            fontWeight: 600,
            letterSpacing: '0.4em',
            textTransform: 'uppercase',
            marginTop: '16px',
            opacity: 0.5,
          }}
        >
          Brewing Perfection
        </p>

        {/* Loading Progress Bar */}
        <div 
          style={{
            width: '160px',
            height: '2px',
            background: 'rgba(217, 119, 6, 0.1)',
            borderRadius: '999px',
            marginTop: '48px',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <div 
            style={{
              position: 'absolute',
              insetY: 0,
              left: 0,
              width: '60%',
              height: '100%',
              background: 'linear-gradient(95deg, transparent, #fef3c7, #d97706, transparent)',
              borderRadius: '999px',
              animation: 'cafe-barProgress 1.6s ease-in-out infinite',
            }}
          />
        </div>
      </div>
    </div>
  );
}
