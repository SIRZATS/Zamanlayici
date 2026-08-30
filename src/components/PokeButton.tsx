import React, { useState, useEffect } from 'react';
import { User } from '../types';
import confetti from 'canvas-confetti';
import { Heart, Sparkles, AlertCircle } from 'lucide-react';

interface PokeButtonProps {
  currentUser: User;
  partnerUser: User;
}

export const PokeButton: React.FC<PokeButtonProps> = ({ currentUser, partnerUser }) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Trigger Poke / Heart action
  const handlePoke = (type: 'poke' | 'heart') => {
    // Trigger local confetti celebration
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.7 },
      colors: type === 'heart' ? ['#f43f5e', '#ec4899', '#fda4af'] : ['#38bdf8', '#0284c7', '#38bdf8'],
    });

    const msg =
      type === 'heart'
        ? `${partnerUser.name}'e sevgi dolu bir kalp gönderdin! 💖`
        : `${partnerUser.name}'e sevimli bir dürtme yolladın! 🐾`;

    setToastMessage(msg);

    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  return (
    <div className="relative inline-flex items-center gap-3">
      <button onClick={() => handlePoke('poke')} className="poke-btn-sky">
        <span>{partnerUser.name}'i Dürt 🐾</span>
      </button>

      <button onClick={() => handlePoke('heart')} className="poke-btn-rose">
        <Heart size={15} className="fill-current text-rose-300" />
        <span>Kalp Gönder 💖</span>
      </button>

      {/* Toast Alert Popup */}
      {toastMessage && (
        <div className="absolute top-full left-0 mt-3 z-50 bg-slate-900 border border-slate-700 text-slate-100 text-xs font-bold px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2 animate-bounce">
          <Sparkles size={16} className="text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
