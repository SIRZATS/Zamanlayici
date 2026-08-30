import React, { useState, useEffect } from 'react';
import { calculateRelationshipTime, RelationshipTime } from '../../lib/utils';
import { Heart, Sparkles } from 'lucide-react';

interface RelationshipCounterProps {
  startDateStr?: string;
}

export const RelationshipCounter: React.FC<RelationshipCounterProps> = ({ startDateStr = '2024-01-01' }) => {
  const [time, setTime] = useState<RelationshipTime>(calculateRelationshipTime(startDateStr));

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(calculateRelationshipTime(startDateStr));
    }, 1000);

    return () => clearInterval(timer);
  }, [startDateStr]);

  return (
    <div className="relationship-counter-card">
      <div className="flex items-center justify-center gap-2 text-xs font-bold text-rose-400 mb-2">
        <Heart className="w-4 h-4 fill-rose-500 text-rose-500 animate-ping" />
        <span>Birlikte Geçen Süre</span>
      </div>

      <h3 className="font-serif text-xl md:text-2xl font-bold text-white mb-2 flex items-center justify-center gap-2">
        <Sparkles className="w-5 h-5 text-sky-400" />
        Eren & Özlem Aşk Sayacı
        <Sparkles className="w-5 h-5 text-sky-400" />
      </h3>

      <div className="timer-grid">
        <div className="timer-box">
          <span className="timer-val text-sky-400">
            {time.days}
          </span>
          <span className="timer-lbl">Gün</span>
        </div>

        <div className="timer-box">
          <span className="timer-val text-purple-400">
            {String(time.hours).padStart(2, '0')}
          </span>
          <span className="timer-lbl">Saat</span>
        </div>

        <div className="timer-box">
          <span className="timer-val text-pink-400">
            {String(time.minutes).padStart(2, '0')}
          </span>
          <span className="timer-lbl">Dakika</span>
        </div>

        <div className="timer-box">
          <span className="timer-val text-emerald-400">
            {String(time.seconds).padStart(2, '0')}
          </span>
          <span className="timer-lbl">Saniye</span>
        </div>
      </div>
    </div>
  );
};
