import React, { useState } from 'react';
import { CatMood } from './habitTypes';
import { playCuteMeow, playHappyPurr, playEatingCrunch } from './catAudio';
import { Sparkles, Heart, Moon, Sun, Flame } from 'lucide-react';

interface CozyCatRoomProps {
  mood: CatMood;
  level: number;
  catName: string;
  isSleeping: boolean;
  isFeeding: boolean;
  onPet?: () => void;
}

export const CozyCatRoom: React.FC<CozyCatRoomProps> = ({
  mood,
  level,
  catName,
  isSleeping,
  isFeeding,
  onPet,
}) => {
  const [isNight, setIsNight] = useState(false);
  const [clickHearts, setClickHearts] = useState<{ id: number; x: number; y: number }[]>([]);
  const [isJumping, setIsJumping] = useState(false);
  const [yarnKicked, setYarnKicked] = useState(false);

  // Kediye tıklama (Petting)
  const handleCatClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newHeart = { id: Date.now() + Math.random(), x, y };
    setClickHearts(prev => [...prev.slice(-6), newHeart]);

    setTimeout(() => {
      setClickHearts(prev => prev.filter(h => h.id !== newHeart.id));
    }, 1200);

    setIsJumping(true);
    setTimeout(() => setIsJumping(false), 450);

    if (mood === 'withered' || mood === 'hungry') {
      playCuteMeow();
    } else {
      playHappyPurr();
    }

    if (onPet) onPet();
  };

  const handleYarnClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setYarnKicked(true);
    playCuteMeow();
    setTimeout(() => setYarnKicked(false), 800);
  };

  const getStageTitle = (lvl: number) => {
    if (lvl <= 2) return 'Minik Yavru Pisi 🍼';
    if (lvl <= 5) return 'Meraklı Oyuncu Pisi 🧶';
    if (lvl <= 8) return 'Pofuduk Sevgi Kedisi 🌸';
    return 'Görkemli Sirius Kedisi 👑✨';
  };

  // State-based anime sticker image
  const getCatStickerSrc = () => {
    if (isSleeping) return '/images/cat_anime/sleeping.jpg';
    if (mood === 'blooming') return '/images/cat_anime/blooming.jpg';
    if (mood === 'hungry') return '/images/cat_anime/hungry.jpg';
    if (mood === 'withered') return '/images/cat_anime/withered.jpg';
    return '/images/cat_anime/healthy.jpg';
  };

  const catImage = getCatStickerSrc();

  return (
    <div
      className={`anime-cat-room-container ${isNight || isSleeping ? 'night-ambient' : 'day-ambient'} ${mood}`}
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: 620,
        height: 440,
        margin: '0 auto',
        borderRadius: 28,
        overflow: 'hidden',
        border: mood === 'blooming'
          ? '2px solid rgba(244,114,182,0.6)'
          : mood === 'withered'
          ? '1px solid #3f3f46'
          : '1px solid #27272a',
        boxShadow: mood === 'blooming'
          ? '0 0 50px rgba(244,114,182,0.3), 0 25px 60px rgba(0,0,0,0.85)'
          : '0 25px 60px rgba(0,0,0,0.85)',
        userSelect: 'none',
      }}
    >
      {/* ── 1. GHIBLI ANİME ODA ARKA PLANI ── */}
      <img
        src="/images/cat_anime/room_bg.jpg"
        alt="Ghibli Anime Cat Room"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          filter: isNight || isSleeping
            ? 'brightness(0.55) contrast(1.15) hue-rotate(15deg)'
            : mood === 'withered'
            ? 'grayscale(0.5) brightness(0.8)'
            : 'brightness(1.02)',
          transition: 'filter 0.6s ease',
        }}
      />

      {/* Gece / Ambiyans Karartma Katmanı */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: isNight || isSleeping
            ? 'radial-gradient(circle at 75% 65%, rgba(251,191,36,0.15) 0%, rgba(15,23,42,0.65) 80%)'
            : mood === 'blooming'
            ? 'radial-gradient(circle at 50% 50%, rgba(244,114,182,0.12) 0%, transparent 70%)'
            : 'transparent',
          pointerEvents: 'none',
          transition: 'background 0.6s ease',
        }}
      />

      {/* ── 2. DİNAMİK EFEKTLER (ÇİÇEK, YAPRAK, IŞIK PARILTILARI) ── */}
      {mood === 'blooming' && (
        <div className="blooming-particles-field">
          <span className="bloom-flake f1">🌸</span>
          <span className="bloom-flake f2">✨</span>
          <span className="bloom-flake f3">🌸</span>
          <span className="bloom-flake f4">🦋</span>
          <span className="bloom-flake f5">💖</span>
          <span className="bloom-flake f6">🌸</span>
        </div>
      )}

      {mood === 'withered' && (
        <div className="withered-particles-field">
          <span className="wither-leaf wl1">🍂</span>
          <span className="wither-leaf wl2">🥀</span>
          <span className="wither-leaf wl3">🍂</span>
        </div>
      )}

      {/* ── 3. ÜST BİLGİ & GECE/GÜNDÜZ TOGGLE KONTROLÜ ── */}
      <div
        style={{
          position: 'absolute',
          top: 14,
          left: 16,
          right: 16,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 30,
        }}
      >
        {/* Kedi İsmi & Rozet */}
        <div
          style={{
            background: 'rgba(9,9,11,0.8)',
            backdropFilter: 'blur(10px)',
            padding: '5px 14px',
            borderRadius: 9999,
            border: '1px solid rgba(255,255,255,0.15)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
          }}
        >
          <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#fff' }}>
            {catName}
          </span>
          <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#71717a' }} />
          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: mood === 'blooming' ? '#f472b6' : '#38bdf8' }}>
            {getStageTitle(level)}
          </span>
        </div>

        {/* Sağ Üst: Gece/Gündüz Lambası Butonu & Durum Rozeti */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={() => setIsNight(!isNight)}
            style={{
              background: 'rgba(9,9,11,0.8)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: isNight ? '#fbbf24' : '#38bdf8',
              borderRadius: 9999,
              padding: '5px 10px',
              fontSize: '0.72rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
            }}
            title="Oda ışığını gece/gündüz yap"
          >
            {isNight ? <Moon size={13} /> : <Sun size={13} />}
            <span>{isNight ? 'Gece' : 'Gündüz'}</span>
          </button>

          <div
            className={`room-mood-badge ${mood}`}
            style={{
              padding: '4px 12px',
              borderRadius: 9999,
              fontSize: '0.72rem',
              fontWeight: 800,
              backdropFilter: 'blur(8px)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
            }}
          >
            {mood === 'blooming' && '🌸 Çiçek Açtı'}
            {mood === 'healthy' && '🌿 Mutlu & Neşeli'}
            {mood === 'hungry' && '🍂 Acıktı'}
            {mood === 'withered' && '🥀 Soldu'}
          </div>
        </div>
      </div>

      {/* ── 4. MERKEZ HALI ÜZERİNDEKİ ANİMASYONLU KEDİCİK ── */}
      <div
        onClick={handleCatClick}
        className={`cat-center-stage ${isJumping ? 'jumping' : ''}`}
        style={{
          position: 'absolute',
          bottom: 25,
          left: '46%',
          transform: 'translateX(-50%)',
          cursor: 'pointer',
          zIndex: 25,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
        title="Kediciği sevmek için tıkla! 🐾"
      >
        {/* Tıklama Kalpleri */}
        {clickHearts.map(h => (
          <div
            key={h.id}
            style={{
              position: 'absolute',
              left: h.x,
              top: h.y,
              pointerEvents: 'none',
              transform: 'translate(-50%, -50%)',
              animation: 'floatUpHeart 1.1s cubic-bezier(0.16, 1, 0.3, 1) forwards',
              zIndex: 60,
              fontSize: '1.5rem',
            }}
          >
            💖
          </div>
        ))}

        {/* Sevimli Konuşma Balonu */}
        {mood === 'withered' && (
          <div className="anime-bubble withered">
            Beni unuttun mu? 🥺 Bir görev yap, hemen canlanayım!
          </div>
        )}
        {mood === 'hungry' && !isSleeping && (
          <div className="anime-bubble hungry">
            Miyav... Karnım gurulduyor mama nerede? 🐟
          </div>
        )}
        {mood === 'blooming' && !isSleeping && (
          <div className="anime-bubble blooming">
            Mırrr! Bugün seninle çiçek açtık! 🌸💖
          </div>
        )}
        {isSleeping && (
          <div className="anime-bubble sleeping">
            Mışıl mışıl uyuyor... Zzz 🌙
          </div>
        )}

        {/* Kedi Karakter Görseli (Multiply blend mode ile halıya organik oturur) */}
        <div
          style={{
            position: 'relative',
            width: isSleeping ? 230 : 210,
            height: isSleeping ? 210 : 210,
            animation: 'catBreathing 3.5s ease-in-out infinite',
            filter: 'drop-shadow(0 12px 16px rgba(0,0,0,0.45))',
          }}
        >
          <img
            src={catImage}
            alt={catName}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              mixBlendMode: 'multiply',
              display: 'block',
              transition: 'transform 0.25s ease',
            }}
          />

          {/* Mama Fırlatma Efekti */}
          {isFeeding && (
            <div
              style={{
                position: 'absolute',
                top: '40%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                fontSize: '3rem',
                animation: 'feedFly 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
                zIndex: 50,
              }}
            >
              🐟✨
            </div>
          )}
        </div>
      </div>

      {/* ── 5. İNTERAKTİF HALI DETAYLARI: YÜN YUMAĞI VE OYUNCAK FARE ── */}
      <div
        onClick={handleYarnClick}
        className={`interactive-rug-toy ${yarnKicked ? 'kicked' : ''}`}
        style={{
          position: 'absolute',
          bottom: 30,
          left: '32%',
          cursor: 'pointer',
          fontSize: '1.4rem',
          zIndex: 26,
          filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.5))',
        }}
        title="Yün yumağını tekmelesin! 🧶"
      >
        🧶
      </div>

      {/* ── 6. ALT ETKİLEŞİM İPUCU ── */}
      <div
        style={{
          position: 'absolute',
          bottom: 10,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          gap: 10,
          pointerEvents: 'none',
          zIndex: 30,
        }}
      >
        <span
          style={{
            background: 'rgba(9,9,11,0.7)',
            backdropFilter: 'blur(8px)',
            color: '#e4e4e7',
            fontSize: '0.7rem',
            fontWeight: 700,
            padding: '3px 12px',
            borderRadius: 9999,
            border: '1px solid rgba(255,255,255,0.1)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
          }}
        >
          <Sparkles size={11} color="#f59e0b" />
          Kediye dokun & sev 🐾
        </span>
        <span
          style={{
            background: 'rgba(9,9,11,0.7)',
            backdropFilter: 'blur(8px)',
            color: '#e4e4e7',
            fontSize: '0.7rem',
            fontWeight: 700,
            padding: '3px 12px',
            borderRadius: 9999,
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          🧶 Yumağa dokun
        </span>
      </div>

      {/* ── 7. ANİMASYON STİLLERİ ── */}
      <style>{`
        @keyframes catBreathing {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-4px) scale(1.015); }
        }

        .cat-center-stage.jumping {
          animation: catJumpJoy 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes catJumpJoy {
          0% { transform: translateX(-50%) scale(1); }
          50% { transform: translateX(-50%) translateY(-20px) scale(1.08) rotate(3deg); }
          100% { transform: translateX(-50%) scale(1); }
        }

        .interactive-rug-toy.kicked {
          animation: yarnRollAnim 0.75s ease;
        }

        @keyframes yarnRollAnim {
          0% { transform: translateX(0) rotate(0deg); }
          50% { transform: translateX(35px) rotate(220deg); }
          100% { transform: translateX(0) rotate(360deg); }
        }

        @keyframes feedFly {
          0% { transform: translate(-50%, -100px) scale(0.4); opacity: 0; }
          40% { transform: translate(-50%, -40px) scale(1.3); opacity: 1; }
          100% { transform: translate(-50%, 0) scale(1); opacity: 0; }
        }

        @keyframes floatUpHeart {
          0% { transform: translate(-50%, -50%) scale(0.6); opacity: 1; }
          100% { transform: translate(-50%, -150px) scale(1.5); opacity: 0; }
        }

        /* Konuşma Balonları */
        .anime-bubble {
          position: absolute;
          top: -36px;
          left: 50%;
          transform: translateX(-50%);
          padding: 6px 14px;
          border-radius: 9999px;
          font-size: 0.76rem;
          font-weight: 800;
          white-space: nowrap;
          box-shadow: 0 4px 15px rgba(0,0,0,0.5);
          animation: bubbleHop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
          z-index: 40;
        }
        .anime-bubble.blooming {
          background: #fdf2f8;
          color: #be185d;
          border: 1.5px solid #f472b6;
        }
        .anime-bubble.hungry {
          background: #fff7ed;
          color: #c2410c;
          border: 1.5px solid #fb923c;
        }
        .anime-bubble.withered {
          background: #27272a;
          color: #e4e4e7;
          border: 1.5px solid #52525b;
        }
        .anime-bubble.sleeping {
          background: #1e1b4b;
          color: #c7d2fe;
          border: 1.5px solid #6366f1;
        }

        @keyframes bubbleHop {
          0% { transform: translateX(-50%) scale(0.6); opacity: 0; }
          100% { transform: translateX(-50%) scale(1); opacity: 1; }
        }

        /* Çiçek Yaprakları */
        .blooming-particles-field {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 20;
        }
        .bloom-flake {
          position: absolute;
          animation: floatBloomParticle 6s ease-in-out infinite;
          opacity: 0.85;
        }
        .f1 { top: 20%; left: 15%; font-size: 1.2rem; animation-delay: 0s; }
        .f2 { top: 35%; left: 25%; font-size: 1rem; animation-delay: 1.5s; }
        .f3 { top: 25%; right: 20%; font-size: 1.3rem; animation-delay: 0.8s; }
        .f4 { top: 45%; right: 15%; font-size: 1.1rem; animation-delay: 2.2s; }
        .f5 { top: 60%; left: 18%; font-size: 1rem; animation-delay: 1.2s; }
        .f6 { top: 55%; right: 25%; font-size: 1.2rem; animation-delay: 3s; }

        @keyframes floatBloomParticle {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.4; }
          50% { transform: translateY(-18px) rotate(18deg); opacity: 0.95; }
        }

        /* Withered Kuru Yapraklar */
        .withered-particles-field {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 20;
        }
        .wither-leaf {
          position: absolute;
          font-size: 1.2rem;
          opacity: 0.45;
          animation: floatWitherLeaf 7s ease-in-out infinite;
        }
        .wl1 { top: 25%; left: 20%; animation-delay: 0s; }
        .wl2 { top: 55%; left: 28%; animation-delay: 2s; }
        .wl3 { top: 35%; right: 22%; animation-delay: 3.5s; }

        @keyframes floatWitherLeaf {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(12px); }
        }

        /* Durum Rozetleri */
        .room-mood-badge.blooming {
          background: rgba(244,114,182,0.3);
          color: #fbcfe8;
          border: 1px solid rgba(244,114,182,0.5);
        }
        .room-mood-badge.healthy {
          background: rgba(56,189,248,0.3);
          color: #bae6fd;
          border: 1px solid rgba(56,189,248,0.5);
        }
        .room-mood-badge.hungry {
          background: rgba(251,146,60,0.3);
          color: #fed7aa;
          border: 1px solid rgba(251,146,60,0.5);
        }
        .room-mood-badge.withered {
          background: rgba(148,163,184,0.3);
          color: #cbd5e1;
          border: 1px solid rgba(148,163,184,0.5);
        }
      `}</style>
    </div>
  );
};
