import React from 'react';
import { CatMood } from './habitTypes';

interface AnimatedCatProps {
  mood: CatMood;
  isSleeping: boolean;
  isPetted: boolean;
  isFeeding: boolean;
  level: number;
}

export const AnimatedCat: React.FC<AnimatedCatProps> = ({
  mood,
  isSleeping,
  isPetted,
  isFeeding,
  level,
}) => {
  // Renk paleti
  const furColor = mood === 'withered' ? '#94a3b8' : mood === 'blooming' ? '#fed7aa' : '#fbbf24';
  const furShadow = mood === 'withered' ? '#64748b' : mood === 'blooming' ? '#f97316' : '#d97706';
  const furLight = mood === 'withered' ? '#cbd5e1' : '#fff7ed';
  const blushColor = mood === 'blooming' ? 'rgba(244,114,182,0.85)' : mood === 'withered' ? 'transparent' : 'rgba(251,113,133,0.5)';

  return (
    <div
      className={`animated-cat-container ${mood} ${isSleeping ? 'sleeping' : 'awake'} ${isPetted ? 'petted' : ''} ${isFeeding ? 'feeding' : ''}`}
      style={{
        position: 'relative',
        width: 170,
        height: 180,
        margin: '0 auto',
        pointerEvents: 'none',
      }}
    >
      <svg
        viewBox="0 0 160 170"
        width="100%"
        height="100%"
        className="cat-character-svg"
        style={{ overflow: 'visible' }}
      >
        <defs>
          {/* Kürk Gölgelendirme Gradyanı */}
          <linearGradient id="catFurGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={furLight} />
            <stop offset="50%" stopColor={furColor} />
            <stop offset="100%" stopColor={furShadow} />
          </linearGradient>

          {/* Göbek Gradyanı */}
          <linearGradient id="catBelly" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#fef3c7" />
          </linearGradient>

          {/* Göz Parlaması */}
          <radialGradient id="eyeGleam" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#1e293b" />
          </radialGradient>
        </defs>

        {/* ── 1. KUYRUK (Canlı Sallanan) ── */}
        <path
          className="cartoon-cat-tail"
          d="M125 125 C155 120 165 90 148 70 C138 58 126 66 132 78 C140 94 135 110 110 120 Z"
          fill="url(#catFurGrad)"
          stroke={furShadow}
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* ── 2. GÖVDE & POPİ (Nefes Alma) ── */}
        <g className="cartoon-cat-body">
          {/* Arka Patiler */}
          <ellipse cx="48" cy="148" rx="16" ry="12" fill="url(#catFurGrad)" stroke={furShadow} strokeWidth="2" />
          <ellipse cx="112" cy="148" rx="16" ry="12" fill="url(#catFurGrad)" stroke={furShadow} strokeWidth="2" />

          {/* Yuvarlak Pofuduk Gövde */}
          <ellipse cx="80" cy="120" rx="42" ry="36" fill="url(#catFurGrad)" stroke={furShadow} strokeWidth="2.5" />

          {/* Sevimli Beyaz Göbek */}
          <ellipse cx="80" cy="124" rx="26" ry="24" fill="url(#catBelly)" />

          {/* Ön Patiler (Pofuduk küçük patişkolar) */}
          <g className="front-paws">
            <ellipse cx="64" cy="142" rx="11" ry="8" fill={furLight} stroke={furShadow} strokeWidth="2" />
            <ellipse cx="96" cy="142" rx="11" ry="8" fill={furLight} stroke={furShadow} strokeWidth="2" />
            {/* Pati Yastıkları (Toe beans) */}
            <circle cx="64" cy="142" r="3" fill="#fda4af" />
            <circle cx="96" cy="142" r="3" fill="#fda4af" />
          </g>

          {/* Boyunda Çıngıraklı Kurdele Papyon */}
          {!isSleeping && (
            <g className="cat-collar">
              <path d="M60 94 Q80 99 100 94" stroke="#e11d48" strokeWidth="4" strokeLinecap="round" />
              <circle cx="80" cy="98" r="4.5" fill="#facc15" stroke="#ca8a04" strokeWidth="1" />
              <circle cx="80" cy="98" r="1.5" fill="#713f12" />
            </g>
          )}
        </g>

        {/* ── 3. KAFA VE KULAKLAR (CANLI MİMİKLER) ── */}
        <g className="cartoon-cat-head">
          {/* Sol Kulak */}
          <g className="ear-left">
            <path
              d="M48 68 L36 28 C34 22 43 19 48 24 L72 54 Z"
              fill="url(#catFurGrad)"
              stroke={furShadow}
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            {/* Pembe Kulak İçi */}
            <path d="M46 60 L41 33 L62 50 Z" fill="#fda4af" opacity="0.9" />
          </g>

          {/* Sağ Kulak */}
          <g className="ear-right">
            <path
              d="M112 68 L124 28 C126 22 117 19 112 24 L88 54 Z"
              fill="url(#catFurGrad)"
              stroke={furShadow}
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            {/* Pembe Kulak İçi */}
            <path d="M114 60 L119 33 L98 50 Z" fill="#fda4af" opacity="0.9" />
          </g>

          {/* Tombul Kafa Yuvarlağı */}
          <ellipse cx="80" cy="68" rx="42" ry="34" fill="url(#catFurGrad)" stroke={furShadow} strokeWidth="2.5" />

          {/* Pofuduk Yanak Tüyleri */}
          <path d="M39 68 L26 73 L40 79 Z" fill={furColor} stroke={furShadow} strokeWidth="1.5" />
          <path d="M121 68 L134 73 L120 79 Z" fill={furColor} stroke={furShadow} strokeWidth="1.5" />

          {/* Yanak Allıkları (Blush) */}
          <ellipse cx="52" cy="74" rx="7" ry="4" fill={blushColor} />
          <ellipse cx="108" cy="74" rx="7" ry="4" fill={blushColor} />

          {/* ── GÖZLER (İnteraktif Çizgi Film Bakışları) ── */}
          {isSleeping ? (
            // 😴 Uyku Modu (Kapalı mutlu yay gözler)
            <g stroke="#334155" strokeWidth="2.8" strokeLinecap="round" fill="none">
              <path d="M54 66 Q64 74 72 66" />
              <path d="M88 66 Q96 74 106 66" />
            </g>
          ) : mood === 'blooming' ? (
            // 🌸 Çiçek Açtı (Süper mutlu kısık anime gözleri ^_^)
            <g stroke="#be185d" strokeWidth="3.2" strokeLinecap="round" fill="none">
              <path d="M54 68 Q63 58 72 68" />
              <path d="M88 68 Q97 58 106 68" />
            </g>
          ) : mood === 'withered' ? (
            // 🥀 Solgun / Hüzünlü Gözler (>_<)
            <g>
              <path d="M52 64 L70 70 M52 70 L70 64" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M90 64 L108 70 M90 70 L108 64" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
            </g>
          ) : mood === 'hungry' ? (
            // 🥺 Aç & Pırıl Pırıl Islak Yavru Kedi Gözleri
            <g className="cat-eyes-hungry">
              <circle cx="62" cy="66" r="9" fill="#0f172a" />
              <circle cx="98" cy="66" r="9" fill="#0f172a" />
              {/* Işık Yansımaları */}
              <circle cx="60" cy="63" r="3.5" fill="#ffffff" />
              <circle cx="96" cy="63" r="3.5" fill="#ffffff" />
              <circle cx="65" cy="69" r="1.8" fill="#ffffff" />
              <circle cx="101" cy="69" r="1.8" fill="#ffffff" />
              {/* Minik pırıltı */}
              <circle cx="63" cy="61" r="1.2" fill="#7dd3fc" />
              <circle cx="99" cy="61" r="1.2" fill="#7dd3fc" />
            </g>
          ) : (
            // ✨ Canlı, Kırpan Neşeli Anime Gözleri
            <g className="cat-eyes-blinking">
              <ellipse cx="62" cy="66" rx="7.5" ry="9" fill="#0f172a" />
              <ellipse cx="98" cy="66" rx="7.5" ry="9" fill="#0f172a" />
              {/* Yıldızlı Işık Yansımaları */}
              <circle cx="60" cy="63" r="3.2" fill="#ffffff" />
              <circle cx="96" cy="63" r="3.2" fill="#ffffff" />
              <circle cx="65" cy="69" r="1.8" fill="#ffffff" />
              <circle cx="101" cy="69" r="1.8" fill="#ffffff" />
            </g>
          )}

          {/* Minik Pembe Burun */}
          <polygon points="80,73 76,69 84,69" fill="#f43f5e" />

          {/* Tatlı Çizgi Film Kedicik Ağzı (:3) */}
          <path
            d={mood === 'withered' ? "M75 79 Q80 75 85 79" : "M74 76 Q80 81 80 77 Q80 81 86 76"}
            stroke="#1e293b"
            strokeWidth="2.2"
            strokeLinecap="round"
            fill="none"
          />

          {/* Sevimli Bıyıklar */}
          <g stroke="#64748b" strokeWidth="1.6" strokeLinecap="round" opacity="0.85">
            <line x1="38" y1="71" x2="52" y2="73" />
            <line x1="36" y1="78" x2="51" y2="77" />
            <line x1="108" y1="73" x2="122" y2="71" />
            <line x1="109" y1="77" x2="124" y2="78" />
          </g>

          {/* ── ÇİÇEK AÇAN MOD AKSESUARI: ÇİÇEK TACI (Blooming Crown) ── */}
          {mood === 'blooming' && (
            <g className="animated-flower-crown" transform="translate(0, -6)">
              {/* Yeşil sarmaşık dalı */}
              <path d="M46 36 Q80 28 114 36" stroke="#22c55e" strokeWidth="3" fill="none" strokeLinecap="round" />
              {/* Çiçek 1 */}
              <circle cx="56" cy="34" r="5" fill="#f43f5e" />
              <circle cx="56" cy="34" r="2" fill="#fef08a" />
              {/* Çiçek 2 (Ortadaki Papatya) */}
              <circle cx="80" cy="30" r="7" fill="#f472b6" />
              <circle cx="80" cy="30" r="3" fill="#fde047" />
              {/* Çiçek 3 */}
              <circle cx="104" cy="34" r="5" fill="#a855f7" />
              <circle cx="104" cy="34" r="2" fill="#fef08a" />
            </g>
          )}

          {/* ── UYKU ŞAPKASI (Focus Sleeping Mode) ── */}
          {isSleeping && (
            <g className="cat-nightcap" transform="translate(10, -14)">
              <path d="M60 40 Q85 10 110 32 L95 50 Q75 36 60 40 Z" fill="#6366f1" stroke="#4338ca" strokeWidth="1.5" />
              <circle cx="112" cy="33" r="5" fill="#fef08a" />
              <polygon points="80,24 82,28 86,28 83,31 84,35 80,33 76,35 77,31 74,28 78,28" fill="#fef08a" />
            </g>
          )}

          {/* ── SİRİUS CELESTIAL YILDIZ KRALI (Level >= 8) ── */}
          {level >= 8 && (
            <g transform="translate(0, -18)">
              <polygon
                points="80,18 84,28 94,30 87,37 89,47 80,42 71,47 73,37 66,30 76,28"
                fill="#38bdf8"
                stroke="#0284c7"
                strokeWidth="1"
              />
            </g>
          )}
        </g>
      </svg>

      {/* ── BALONCUKLAR: UYKU ZZZ VEYA AÇLIK BALIĞI ── */}
      {isSleeping && (
        <div className="zzz-cloud">
          <span className="z1">z</span>
          <span className="z2">Z</span>
          <span className="z3">Z</span>
        </div>
      )}

      {mood === 'hungry' && !isSleeping && (
        <div className="thought-bubble-fish">
          <span className="thought-dot d1" />
          <span className="thought-dot d2" />
          <div className="thought-content">
            🐟?
          </div>
        </div>
      )}

      <style>{`
        /* Kedi Canlı Nefes ve Sallanma Animasyonu */
        .animated-cat-container {
          animation: catAliveBreath 3.2s ease-in-out infinite;
          transform-origin: 80px 140px;
          transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .animated-cat-container.petted {
          animation: catHappyHop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes catAliveBreath {
          0%, 100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-4px) scale(1.02);
          }
        }

        @keyframes catHappyHop {
          0% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-16px) scale(1.08) rotate(3deg); }
          100% { transform: translateY(0) scale(1); }
        }

        /* Kuyruk Sallanması */
        .cartoon-cat-tail {
          transform-origin: 125px 125px;
          animation: tailAliveWag 3s ease-in-out infinite;
        }

        @keyframes tailAliveWag {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(14deg); }
          75% { transform: rotate(-8deg); }
        }

        /* Kulak Seğirmesi */
        .ear-left {
          transform-origin: 48px 58px;
          animation: twitchEarL 5s ease-in-out infinite;
        }
        .ear-right {
          transform-origin: 112px 58px;
          animation: twitchEarR 5s ease-in-out 0.4s infinite;
        }

        @keyframes twitchEarL {
          0%, 90%, 100% { transform: rotate(0deg); }
          93% { transform: rotate(-8deg); }
          96% { transform: rotate(3deg); }
        }

        @keyframes twitchEarR {
          0%, 90%, 100% { transform: rotate(0deg); }
          93% { transform: rotate(8deg); }
          96% { transform: rotate(-3deg); }
        }

        /* Göz Kırpma */
        .cat-eyes-blinking {
          transform-origin: 80px 66px;
          animation: eyeBlinkAlive 4.5s infinite;
        }

        @keyframes eyeBlinkAlive {
          0%, 94%, 98%, 100% { transform: scaleY(1); }
          96% { transform: scaleY(0.08); }
        }

        /* Uyku ZZZ */
        .zzz-cloud {
          position: absolute;
          top: -24px;
          right: 10px;
          display: flex;
          gap: 3px;
          font-family: 'Caveat', cursive, sans-serif;
          font-weight: 800;
          color: #c7d2fe;
        }
        .z1 { font-size: 0.9rem; animation: floatZ 2s infinite 0.2s; }
        .z2 { font-size: 1.2rem; animation: floatZ 2s infinite 0.6s; }
        .z3 { font-size: 1.5rem; animation: floatZ 2s infinite 1s; }

        @keyframes floatZ {
          0% { transform: translateY(0) scale(0.6); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(-20px) translateX(10px) scale(1.2); opacity: 0; }
        }

        /* Açlık Düşünce Balonu */
        .thought-bubble-fish {
          position: absolute;
          top: -30px;
          right: 4px;
          display: flex;
          flex-direction: column;
          align-items: center;
          animation: floatThought 3s ease-in-out infinite;
        }
        .thought-content {
          background: #fff;
          color: #0f172a;
          border-radius: 9999px;
          padding: 4px 10px;
          font-size: 0.9rem;
          font-weight: 800;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          border: 2px solid #fdba74;
        }
        .thought-dot {
          background: #fff;
          border-radius: 50%;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        }
        .d1 { width: 5px; height: 5px; margin-bottom: 2px; }
        .d2 { width: 8px; height: 8px; margin-bottom: 2px; }

        @keyframes floatThought {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
      `}</style>
    </div>
  );
};
