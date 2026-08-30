import React from 'react';

interface SiriusStarProps {
  size?: number;
  glow?: boolean;
  style?: React.CSSProperties;
}

export const SiriusStar: React.FC<SiriusStarProps> = ({ size = 20, glow = true, style }) => {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        verticalAlign: 'middle',
        position: 'relative',
        lineHeight: 1,
        ...style,
      }}
      title="Sirius Yıldızı 🌌"
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          filter: glow ? 'drop-shadow(0 0 8px rgba(56, 189, 248, 0.95)) drop-shadow(0 0 16px rgba(14, 165, 233, 0.7))' : 'none',
          animation: 'siriusPulse 3s infinite ease-in-out',
        }}
      >
        <style>{`
          @keyframes siriusPulse {
            0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.95; }
            50% { transform: scale(1.15) rotate(12deg); opacity: 1; filter: drop-shadow(0 0 12px rgba(125, 211, 252, 1)) drop-shadow(0 0 22px rgba(56, 189, 248, 0.9)); }
          }
        `}</style>
        {/* Core star diamond rays */}
        <path
          d="M12 0L14.2 9.8L24 12L14.2 14.2L12 24L9.8 14.2L0 12L9.8 9.8L12 0Z"
          fill="url(#siriusGradient)"
        />
        {/* Secondary diagonal star rays */}
        <path
          d="M12 4.5L13.2 10.8L19.5 12L13.2 13.2L12 19.5L10.8 13.2L4.5 12L10.8 10.8L12 4.5Z"
          fill="#ffffff"
          opacity="0.85"
        />
        <defs>
          <radialGradient id="siriusGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="35%" stopColor="#7dd3fc" />
            <stop offset="70%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#0284c7" />
          </radialGradient>
        </defs>
      </svg>
    </span>
  );
};
