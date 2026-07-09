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
        background: 'linear-gradient(135deg, #09090b 0%, #030712 60%, #000000 100%)',
        opacity: fadeAway ? 0 : 1,
        transform: fadeAway ? 'scale(1.05)' : 'scale(1)',
        transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        pointerEvents: fadeAway ? 'none' : 'auto',
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes ecom-shimmer {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes ecom-barProgress {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(20%); }
          100% { transform: translateX(100%); }
        }
        @keyframes ecom-pulse-ring {
          0%, 100% { transform: scale(0.98); opacity: 0.15; }
          50% { transform: scale(1.03); opacity: 0.35; }
        }
        .ecom-glowing-circle {
          animation: ecom-pulse-ring 3s ease-in-out infinite;
        }
        .ecom-shimmer-text {
          background: linear-gradient(90deg, #2563eb, #ffffff, #60a5fa, #ffffff, #2563eb);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: ecom-shimmer 4s linear infinite;
        }
      `}} />

      {/* Decorative Glowing Backdrop */}
      <div 
        className="ecom-glowing-circle"
        style={{
          position: 'absolute',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(37, 99, 235, 0.08) 0%, rgba(37, 99, 235, 0) 70%)',
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
            border: '1px solid rgba(37, 99, 235, 0.15)',
            background: 'rgba(37, 99, 235, 0.03)',
            backdropFilter: 'blur(20px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '32px',
            boxShadow: '0 30px 60px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
          }}
        >
          <svg style={{ width: '36px', height: '36px', fill: 'none', stroke: '#2563eb', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' }} viewBox="0 0 24 24">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
        </div>

        {/* Business Name */}
        <h1 
          className="ecom-shimmer-text"
          style={{
            fontSize: '2.5rem',
            fontWeight: 900,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            textAlign: 'center',
            margin: 0,
            padding: '0 24px',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          {businessName}
        </h1>

        <p 
          style={{
            color: '#60a5fa',
            fontSize: '0.7rem',
            fontWeight: 600,
            letterSpacing: '0.4em',
            textTransform: 'uppercase',
            marginTop: '16px',
            opacity: 0.5,
          }}
        >
          Smart Store Experience
        </p>

        {/* Loading Progress Bar */}
        <div 
          style={{
            width: '160px',
            height: '2px',
            background: 'rgba(37, 99, 235, 0.1)',
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
              background: 'linear-gradient(95deg, transparent, #ffffff, #2563eb, transparent)',
              borderRadius: '999px',
              animation: 'ecom-barProgress 1.6s ease-in-out infinite',
            }}
          />
        </div>
      </div>
    </div>
  );
}
