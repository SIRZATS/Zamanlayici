import React, { useState, useEffect, useRef } from 'react';
import { Play, Square, Sparkles, Moon, Clock, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playReviveMagicSound } from './catAudio';

interface CatFocusTimerProps {
  onSessionStart: () => void;
  onSessionComplete: (durationMinutes: number) => void;
  onSessionCancel: () => void;
}

export const CatFocusTimer: React.FC<CatFocusTimerProps> = ({
  onSessionStart,
  onSessionComplete,
  onSessionCancel,
}) => {
  const [selectedMinutes, setSelectedMinutes] = useState<number>(25);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [completedCount, setCompletedCount] = useState<number>(() => {
    try {
      return parseInt(localStorage.getItem('habitcat_focus_count') || '0', 10);
    } catch {
      return 0;
    }
  });

  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isRunning) {
      setSecondsRemaining(selectedMinutes * 60);
    }
  }, [selectedMinutes, isRunning]);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = window.setInterval(() => {
        setSecondsRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsRunning(false);
            handleSuccess();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  const handleSuccess = () => {
    playReviveMagicSound();
    confetti({
      particleCount: 80,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#38bdf8', '#f472b6', '#fbbf24', '#34d399'],
    });

    const newCount = completedCount + 1;
    setCompletedCount(newCount);
    localStorage.setItem('habitcat_focus_count', newCount.toString());

    onSessionComplete(selectedMinutes);
  };

  const handleStart = () => {
    setIsRunning(true);
    onSessionStart();
  };

  const handleCancel = () => {
    if (window.confirm('Odaklanmayı durdurmak istediğine emin misin? Kedi tatlı uykusundan uyanacak.')) {
      setIsRunning(false);
      setSecondsRemaining(selectedMinutes * 60);
      onSessionCancel();
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent = Math.max(0, Math.min(100, ((selectedMinutes * 60 - secondsRemaining) / (selectedMinutes * 60)) * 100));

  return (
    <div
      style={{
        background: '#121216',
        borderRadius: 20,
        border: '1px solid #27272a',
        padding: '20px',
        maxWidth: 520,
        margin: '0 auto',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 10,
              background: 'rgba(99,102,241,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Moon size={16} color="#818cf8" />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#fff' }}>
              Forest Modu: Kedi Şekerlemesi 🌙
            </h3>
            <p style={{ margin: 0, fontSize: '0.72rem', color: '#a1a1aa' }}>
              Sen odaklanırken kedi huzurla uyur ve altın balık kazanır
            </p>
          </div>
        </div>

        {completedCount > 0 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              background: 'rgba(251,191,36,0.12)',
              padding: '4px 10px',
              borderRadius: 9999,
              border: '1px solid rgba(251,191,36,0.25)',
            }}
          >
            <Award size={13} color="#fbbf24" />
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#fbbf24' }}>
              {completedCount} Odaklanma
            </span>
          </div>
        )}
      </div>

      {/* Süre Seçenekleri (Sadece sayaç çalışmıyorken seçilebilir) */}
      {!isRunning && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
          {[15, 25, 45, 60].map(mins => (
            <button
              key={mins}
              onClick={() => setSelectedMinutes(mins)}
              style={{
                flex: 1,
                padding: '8px 0',
                borderRadius: 12,
                border: selectedMinutes === mins ? '1px solid #818cf8' : '1px solid #27272a',
                background: selectedMinutes === mins ? 'rgba(99,102,241,0.2)' : '#18181b',
                color: selectedMinutes === mins ? '#c7d2fe' : '#a1a1aa',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {mins} dk
            </button>
          ))}
        </div>
      )}

      {/* Sayaç Dairesi & İlerleme Çubuğu */}
      <div style={{ textAlign: 'center', padding: '10px 0' }}>
        <div
          style={{
            fontSize: '3rem',
            fontWeight: 800,
            fontFamily: 'monospace',
            letterSpacing: '2px',
            color: isRunning ? '#c7d2fe' : '#fff',
            textShadow: isRunning ? '0 0 20px rgba(99,102,241,0.4)' : 'none',
          }}
        >
          {formatTime(secondsRemaining)}
        </div>

        {/* İlerleme Çubuğu */}
        <div
          style={{
            width: '100%',
            height: 6,
            background: '#27272a',
            borderRadius: 9999,
            overflow: 'hidden',
            margin: '14px 0',
          }}
        >
          <div
            style={{
              width: `${progressPercent}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #6366f1, #a855f7)',
              transition: 'width 1s linear',
            }}
          />
        </div>
      </div>

      {/* Buton Kontrolleri */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 4 }}>
        {!isRunning ? (
          <button
            onClick={handleStart}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
              color: '#fff',
              border: 'none',
              borderRadius: 14,
              padding: '10px 24px',
              fontSize: '0.85rem',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(99,102,241,0.4)',
              transition: 'transform 0.15s ease',
            }}
            onMouseDown={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.96)'; }}
            onMouseUp={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; }}
          >
            <Play size={16} fill="#fff" />
            <span>Kediyle Birlikte Odaklan</span>
          </button>
        ) : (
          <button
            onClick={handleCancel}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'rgba(239,68,68,0.15)',
              color: '#f87171',
              border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: 14,
              padding: '10px 20px',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            <Square size={15} fill="#f87171" />
            <span>Odaklanmayı Sonlandır</span>
          </button>
        )}
      </div>

      <div style={{ marginTop: 14, textAlign: 'center' }}>
        <span style={{ fontSize: '0.7rem', color: '#71717a', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          <Sparkles size={11} color="#fbbf24" />
          Tamamlayınca: +30 XP ve leziz Somon Balığı 🐟
        </span>
      </div>
    </div>
  );
};
