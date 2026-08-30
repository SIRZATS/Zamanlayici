import React, { useRef, useState } from 'react';
import { MemoryCard, User } from '../types';
import { HangingCard } from './HangingCard';
import { CardDetailModal } from './CardDetailModal';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';

interface ClotheslineProps {
  cards: MemoryCard[];
  currentUser: User;
  onOpenAdd: () => void;
  onDelete: (id: string) => void;
  emptyLabel?: string;
}

export const Clothesline: React.FC<ClotheslineProps> = ({
  cards,
  currentUser,
  onOpenAdd,
  onDelete,
  emptyLabel = 'Henüz hiç anı asılmamış. İlk anını sen as! 📌',
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedCard, setSelectedCard] = useState<MemoryCard | null>(null);

  const scrollBy = (dir: number) => {
    scrollRef.current?.scrollBy({ left: dir * 260, behavior: 'smooth' });
  };

  return (
    <div style={{ position: 'relative', marginBottom: 40 }}>

      {/* Arrow buttons */}
      {cards.length > 0 && (
        <>
          <button
            onClick={() => scrollBy(-1)}
            style={arrowBtnStyle}
            title="Sola"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => scrollBy(1)}
            style={{ ...arrowBtnStyle, right: 0, left: 'auto' }}
            title="Sağa"
          >
            <ChevronRight size={18} />
          </button>
        </>
      )}

      {/* ROPE + CARDS CONTAINER */}
      <div style={{ position: 'relative', paddingTop: 32, paddingBottom: 24 }}>

        {/* 🧵 Clothesline Rope — SVG drawn rope */}
        <svg
          style={{ position: 'absolute', top: 18, left: 0, right: 0, width: '100%', height: 20, pointerEvents: 'none', zIndex: 2 }}
          viewBox="0 0 1000 20"
          preserveAspectRatio="none"
        >
          {/* Main rope */}
          <path
            d="M0,10 Q250,4 500,10 Q750,16 1000,10"
            stroke="#b45309"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            opacity="0.75"
          />
          {/* Rope twist texture */}
          <path
            d="M0,10 Q250,4 500,10 Q750,16 1000,10"
            stroke="#92400e"
            strokeWidth="1"
            strokeDasharray="6 4"
            fill="none"
            opacity="0.45"
          />
          {/* Left & Right wall hooks */}
          <circle cx="10" cy="10" r="5" fill="#6b7280" stroke="#4b5563" strokeWidth="1.5" />
          <circle cx="990" cy="10" r="5" fill="#6b7280" stroke="#4b5563" strokeWidth="1.5" />
        </svg>

        {/* HORIZONTAL SCROLL AREA */}
        <div
          ref={scrollRef}
          style={{
            display: 'flex',
            flexDirection: 'row',
            overflowX: 'auto',
            gap: 28,
            paddingLeft: 28,
            paddingRight: 28,
            paddingTop: 24,
            paddingBottom: 12,
            scrollbarWidth: 'thin',
            scrollbarColor: '#3f3f46 transparent',
            alignItems: 'flex-start',
          }}
        >

          {/* ➕ "Yeni Anı As" Tetikleyici Kartı */}
          <div
            style={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              flexShrink: 0,
            }}
          >
            {/* Add pin */}
            <div style={{ zIndex: 5, width: 14, height: 30, marginBottom: -2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: 12, height: 22, background: 'linear-gradient(180deg,#71717a,#52525b)', borderRadius: '3px 3px 6px 6px', border: '1px solid #52525b' }}>
                <div style={{ width: 8, height: 1.5, background: 'rgba(0,0,0,0.3)', borderRadius: 2, margin: '9px auto 0' }} />
              </div>
              <div style={{ width: 6, height: 8, background: '#52525b', borderRadius: '0 0 4px 4px', marginTop: -2 }} />
            </div>

            {/* Add card placeholder */}
            <button
              onClick={onOpenAdd}
              style={{
                width: 200,
                height: 220,
                background: 'transparent',
                border: '2px dashed #3f3f46',
                borderRadius: 14,
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                color: '#52525b',
                transition: 'all 0.2s ease',
                padding: 0,
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = '#f43f5e';
                (e.currentTarget as HTMLButtonElement).style.color = '#f43f5e';
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(244,63,94,0.04)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = '#3f3f46';
                (e.currentTarget as HTMLButtonElement).style.color = '#52525b';
                (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
              }}
            >
              <div style={{
                width: 44, height: 44, borderRadius: '50%',
                border: '2px dashed currentColor',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Plus size={22} />
              </div>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, lineHeight: 1.3, textAlign: 'center', maxWidth: 140 }}>
                İpe yeni bir anı as
              </span>
            </button>
          </div>

          {/* DOLU KARTLAR */}
          {cards.map(card => (
            <HangingCard
              key={card.id}
              card={card}
              onDelete={onDelete}
              canDelete={true}
              onClick={() => setSelectedCard(card)}
            />
          ))}

          {/* Boş durum mesajı */}
          {cards.length === 0 && (
            <div style={{
              alignSelf: 'center',
              padding: '12px 24px',
              color: '#3f3f46',
              fontSize: '0.82rem',
              fontStyle: 'italic',
              flexShrink: 0,
            }}>
              {emptyLabel}
            </div>
          )}

        </div>
      </div>

      {/* Kart Detay Modalı */}
      {selectedCard && (
        <CardDetailModal
          card={selectedCard}
          onClose={() => setSelectedCard(null)}
          onDelete={id => {
            onDelete(id);
            setSelectedCard(null);
          }}
        />
      )}
    </div>
  );
};

const arrowBtnStyle: React.CSSProperties = {
  position: 'absolute',
  top: '50%',
  left: 0,
  transform: 'translateY(-50%)',
  zIndex: 10,
  background: '#18181b',
  border: '1px solid #27272a',
  color: '#a1a1aa',
  borderRadius: '50%',
  width: 36, height: 36,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  cursor: 'pointer',
  boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
};
