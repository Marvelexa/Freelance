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
        background: 'linear-gradient(135deg, #0c0a09 0%, #030303 60%, #000000 100%)',
        opacity: fadeAway ? 0 : 1,
        transform: fadeAway ? 'scale(1.05)' : 'scale(1)',
        transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        pointerEvents: fadeAway ? 'none' : 'auto',
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes rest-shimmer {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes rest-barProgress {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(20%); }
          100% { transform: translateX(100%); }
        }
        @keyframes rest-pulse-ring {
          0%, 100% { transform: scale(0.98); opacity: 0.15; }
          50% { transform: scale(1.03); opacity: 0.35; }
        }
        .rest-glowing-circle {
          animation: rest-pulse-ring 3s ease-in-out infinite;
        }
        .rest-shimmer-text {
          background: linear-gradient(90deg, #C5A059, #ffffff, #9A7B3E, #ffffff, #C5A059);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: rest-shimmer 4s linear infinite;
        }
      `}} />

      {/* Decorative Glowing Backdrop */}
      <div 
        className="rest-glowing-circle"
        style={{
          position: 'absolute',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(197, 160, 89, 0.08) 0%, rgba(197, 160, 89, 0) 70%)',
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
            border: '1px solid rgba(197, 160, 89, 0.15)',
            background: 'rgba(197, 160, 89, 0.03)',
            backdropFilter: 'blur(20px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '32px',
            boxShadow: '0 30px 60px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
          }}
        >
          <svg style={{ width: '36px', height: '36px', fill: 'none', stroke: '#C5A059', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' }} viewBox="0 0 24 24">
            <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
            <path d="M7 2v20" />
            <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Z" />
            <path d="M19 15v7" />
          </svg>
        </div>

        {/* Business Name */}
        <h1 
          className="rest-shimmer-text"
          style={{
            fontSize: '2.5rem',
            fontWeight: 900,
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            textAlign: 'center',
            margin: 0,
            padding: '0 24px',
            fontFamily: 'Playfair Display, Georgia, serif',
          }}
        >
          {businessName}
        </h1>

        <p 
          style={{
            color: '#C5A059',
            fontSize: '0.7rem',
            fontWeight: 600,
            letterSpacing: '0.4em',
            textTransform: 'uppercase',
            marginTop: '16px',
            opacity: 0.5,
          }}
        >
          Gastronomy Redefined
        </p>

        {/* Loading Progress Bar */}
        <div 
          style={{
            width: '160px',
            height: '2px',
            background: 'rgba(197, 160, 89, 0.1)',
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
              background: 'linear-gradient(95deg, transparent, #ffffff, #C5A059, transparent)',
              borderRadius: '999px',
              animation: 'rest-barProgress 1.6s ease-in-out infinite',
            }}
          />
        </div>
      </div>
    </div>
  );
}
