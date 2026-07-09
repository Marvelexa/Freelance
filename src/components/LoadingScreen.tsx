import { useState, useEffect } from "react";

interface LoadingScreenProps {
  businessName: string;
  onFinished?: () => void;
}

export function LoadingScreen({ businessName, onFinished }: LoadingScreenProps) {
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
        background: 'linear-gradient(135deg, #09090b 0%, #151518 50%, #020202 100%)',
        opacity: fadeAway ? 0 : 1,
        transform: fadeAway ? 'scale(1.05)' : 'scale(1)',
        transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        pointerEvents: fadeAway ? 'none' : 'auto',
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes custom-shimmer {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes custom-barProgress {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(20%); }
          100% { transform: translateX(100%); }
        }
        @keyframes custom-pulse-ring {
          0%, 100% { transform: scale(0.98); opacity: 0.15; }
          50% { transform: scale(1.03); opacity: 0.35; }
        }
        .glowing-circle {
          animation: custom-pulse-ring 3s ease-in-out infinite;
        }
        .loading-shimmer-text {
          background: linear-gradient(90deg, #e2e8f0, #ffffff, #94a3b8, #ffffff, #e2e8f0);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: custom-shimmer 4s linear infinite;
        }
      `}} />

      {/* Decorative Glowing Backdrop */}
      <div 
        className="glowing-circle"
        style={{
          position: 'absolute',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0) 70%)',
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
            border: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'rgba(255, 255, 255, 0.02)',
            backdropFilter: 'blur(20px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '32px',
            boxShadow: '0 30px 60px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          }}
        >
          <svg style={{ width: '36px', height: '36px', fill: 'none', stroke: '#e2e8f0', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' }} viewBox="0 0 24 24">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>

        {/* Business Name */}
        <h1 
          className="loading-shimmer-text"
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
            color: '#94a3b8',
            fontSize: '0.7rem',
            fontWeight: 600,
            letterSpacing: '0.4em',
            textTransform: 'uppercase',
            marginTop: '16px',
            opacity: 0.6,
          }}
        >
          Loading Platform
        </p>

        {/* Loading Progress Bar */}
        <div 
          style={{
            width: '160px',
            height: '2px',
            background: 'rgba(255, 255, 255, 0.06)',
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
              background: 'linear-gradient(95deg, transparent, #e2e8f0, #94a3b8, transparent)',
              borderRadius: '999px',
              animation: 'custom-barProgress 1.6s ease-in-out infinite',
            }}
          />
        </div>
      </div>
    </div>
  );
}
