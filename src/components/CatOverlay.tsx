import React, { useEffect } from 'react';
import { Sparkles, Heart, X } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CatOverlayProps {
  onClose: () => void;
}

export const CatOverlay: React.FC<CatOverlayProps> = ({ onClose }) => {
  useEffect(() => {
    // Trigger festive heart & star confetti when cat appears!
    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.5 },
      colors: ['#A855F7', '#EC4899', '#38BDF8', '#F59E0B'],
    });

    // Auto-close after 4 seconds
    const timer = setTimeout(() => {
      onClose();
    }, 4000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative bg-[#0d1633] border-2 border-purple-500/50 rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center shadow-[0_0_50px_rgba(168,85,247,0.4)] animate-scaleUp overflow-hidden">
        
        {/* Glowing Top Orbs */}
        <div className="absolute -top-10 -left-10 w-36 h-36 bg-purple-500/30 blur-2xl rounded-full pointer-events-none"></div>
        <div className="absolute -bottom-10 -right-10 w-36 h-36 bg-pink-500/30 blur-2xl rounded-full pointer-events-none"></div>

        {/* Close X button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-all z-10"
        >
          <X size={18} />
        </button>

        {/* Welcome Header */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-purple-400 animate-spin" />
          <h2 className="font-serif text-2xl font-bold text-white tracking-wide">
            Hoş Geldin Özlem!
          </h2>
          <Heart className="w-5 h-5 text-pink-400 fill-pink-400 animate-bounce" />
        </div>
        <p className="text-xs text-purple-200 font-semibold mb-4">
          Prenses kediciğin seni karşılamaya geldi ✨
        </p>

        {/* Cute Cat Image Frame */}
        <div className="relative mx-auto w-56 h-56 rounded-2xl overflow-hidden border-4 border-purple-400/60 shadow-xl mb-4 group">
          <img
            src="/images/ozlem_cat.jpg"
            alt="Özlem'in Kediciği"
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-purple-950/40 via-transparent to-transparent"></div>
        </div>

        {/* Cute Footer Tag */}
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-purple-950/80 border border-purple-700/80 text-xs font-bold text-purple-300">
          <span>🐾 Keyifli Anılar Dileriz 💜</span>
        </div>

      </div>
    </div>
  );
};
