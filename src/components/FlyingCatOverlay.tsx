import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

function playCuteMeow() {
  // Ultra-cute kitten audio sources
  const meowUrls = [
    'https://actions.google.com/sounds/v1/animals/cat_meow.ogg',
    'https://cdn.freesound.org/previews/495/495009_10672728-lq.mp3',
    'https://cdn.freesound.org/previews/415/415209_5121236-lq.mp3',
  ];

  for (const url of meowUrls) {
    try {
      const audio = new Audio(url);
      audio.volume = 0.75;
      audio.play().catch(() => {});
    } catch { /* continue */ }
  }

  // Web Audio API synth kitten meow (high-pitched adorable chirp contour)
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioCtx) {
      const ctx = new AudioCtx();
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      const now = ctx.currentTime;

      // High-pitched cute kitten meow frequencies: 820Hz -> 1180Hz -> 680Hz
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(820, now);
      osc1.frequency.exponentialRampToValueAtTime(1180, now + 0.12);
      osc1.frequency.exponentialRampToValueAtTime(680, now + 0.38);

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(1640, now);
      osc2.frequency.exponentialRampToValueAtTime(2360, now + 0.12);
      osc2.frequency.exponentialRampToValueAtTime(1360, now + 0.38);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.25, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.40);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.42);
      osc2.stop(now + 0.42);
    }
  } catch (e) {
    console.error('Synth meow error:', e);
  }
}

export const FlyingCatOverlay: React.FC = () => {
  const [flying, setFlying] = useState(false);
  const [topPos, setTopPos] = useState(30);
  const [duration, setDuration] = useState(10);
  const [direction, setDirection] = useState<'ltr' | 'rtl'>('ltr');
  const [showMeowSpeech, setShowMeowSpeech] = useState(false);

  const triggerFlight = () => {
    // Random height between 15% and 70%
    const randomTop = Math.floor(Math.random() * 55) + 15;
    // Random duration 9s to 14s
    const randomDur = Math.floor(Math.random() * 6) + 9;
    // Random direction
    const randomDir = Math.random() > 0.5 ? 'ltr' : 'rtl';

    setTopPos(randomTop);
    setDuration(randomDur);
    setDirection(randomDir);
    setFlying(true);
    setShowMeowSpeech(false);
  };

  useEffect(() => {
    // Giriş yapınca ilk uçuş (2.5 saniye sonra)
    const initialTimer = setTimeout(() => {
      triggerFlight();
    }, 2500);

    // Sonrasında her 10 dakikada bir (10 * 60 * 1000 ms) uçsun
    const TEN_MINUTES_MS = 10 * 60 * 1000;
    const interval = setInterval(() => {
      triggerFlight();
    }, TEN_MINUTES_MS);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    // 🔊 Miyavlama sesini çal!
    playCuteMeow();

    // 🎉 Konfeti patlat
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    confetti({
      particleCount: 60,
      spread: 80,
      origin: { x, y },
      colors: ['#38bdf8', '#f43f5e', '#fb7185', '#a855f7', '#fde047'],
    });

    // 💬 Miyavv konuşma balonu göster
    setShowMeowSpeech(true);
    setTimeout(() => {
      setShowMeowSpeech(false);
    }, 2500);
  };

  if (!flying) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: `${topPos}%`,
        left: direction === 'ltr' ? '-280px' : 'auto',
        right: direction === 'rtl' ? '-280px' : 'auto',
        zIndex: 9990,
        pointerEvents: 'auto',
        cursor: 'pointer',
        animation: `${direction === 'ltr' ? 'flyRight' : 'flyLeft'} ${duration}s linear forwards`,
      }}
      onClick={handleClick}
      title="Uçan Kedi Uçak! ✈️🐱 (Miyavlatmak için tıkla!)"
    >
      <div style={{ position: 'relative', display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>

        {/* Miyavv Konuşma Balonu */}
        {showMeowSpeech && (
          <div
            style={{
              position: 'absolute',
              top: -38,
              background: '#fff',
              color: '#09090b',
              padding: '4px 12px',
              borderRadius: 9999,
              fontWeight: 800,
              fontSize: '0.85rem',
              boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
              animation: 'bounce 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
              whiteSpace: 'nowrap',
              zIndex: 10,
              fontFamily: "'Caveat', cursive, sans-serif",
            }}
          >
            Miyavvv! 🐾✈️
          </div>
        )}

        {/* Şeffaf Uçan Kedi Uçak Görseli (Ekran oranına göre duyarlı boyut) */}
        <img
          src="/flying_cat.png"
          alt="Uçan Kedi Uçak"
          style={{
            width: 'clamp(140px, 16vw, 260px)',
            height: 'auto',
            display: 'block',
            filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.65))',
            transform: direction === 'rtl' ? 'scaleX(-1)' : 'none',
            transition: 'transform 0.2s ease',
          }}
        />
      </div>

      <style>{`
        @keyframes flyRight {
          0% {
            transform: translateX(0) translateY(0) rotate(3deg);
          }
          25% {
            transform: translateX(30vw) translateY(-20px) rotate(-2deg);
          }
          50% {
            transform: translateX(60vw) translateY(15px) rotate(3deg);
          }
          75% {
            transform: translateX(90vw) translateY(-12px) rotate(-1deg);
          }
          100% {
            transform: translateX(calc(100vw + 350px)) translateY(0) rotate(0deg);
          }
        }

        @keyframes flyLeft {
          0% {
            transform: translateX(0) translateY(0) rotate(-3deg);
          }
          25% {
            transform: translateX(-30vw) translateY(20px) rotate(2deg);
          }
          50% {
            transform: translateX(-60vw) translateY(-15px) rotate(-3deg);
          }
          75% {
            transform: translateX(-90vw) translateY(12px) rotate(1deg);
          }
          100% {
            transform: translateX(calc(-100vw - 350px)) translateY(0) rotate(0deg);
          }
        }

        @keyframes bounce {
          0% { transform: scale(0.5); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};
