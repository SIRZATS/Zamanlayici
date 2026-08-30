import React, { useState, useEffect } from 'react';
import { calculateRelationshipTime, RelationshipTime } from '../../lib/utils';
import { Heart, Sparkles } from 'lucide-react';

interface HeroTimerProps {
  startDateStr?: string;
}

export const HeroTimer: React.FC<HeroTimerProps> = ({ startDateStr = '2024-01-01' }) => {
  const [time, setTime] = useState<RelationshipTime>(calculateRelationshipTime(startDateStr));

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(calculateRelationshipTime(startDateStr));
    }, 1000);

    return () => clearInterval(timer);
  }, [startDateStr]);

  return (
    <div className="hero-timer-card">
      <div className="timer-label-pill">
        <Heart size={14} className="fill-rose-500 text-rose-500" />
        <span>Birlikte Geçen Zaman</span>
      </div>

      <h2 className="text-xl font-bold tracking-tight text-white mb-2 flex items-center justify-center gap-2">
        Eren & Özlem Aşk Sayacı
      </h2>

      {/* 4 Mini Widget Boxes */}
      <div className="timer-boxes-grid">
        <div className="timer-mini-box">
          <span className="timer-num-text text-white">{time.days}</span>
          <span className="timer-lbl-text">Gün</span>
        </div>

        <div className="timer-mini-box">
          <span className="timer-num-text text-rose-400">
            {String(time.hours).padStart(2, '0')}
          </span>
          <span className="timer-lbl-text">Saat</span>
        </div>

        <div className="timer-mini-box">
          <span className="timer-num-text text-purple-400">
            {String(time.minutes).padStart(2, '0')}
          </span>
          <span className="timer-lbl-text">Dakika</span>
        </div>

        <div className="timer-mini-box">
          <span className="timer-num-text text-emerald-400">
            {String(time.seconds).padStart(2, '0')}
          </span>
          <span className="timer-lbl-text">Saniye</span>
        </div>
      </div>
    </div>
  );
};
