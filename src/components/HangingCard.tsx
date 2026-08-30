import React from 'react';
import { MemoryCard } from '../types';
import { MapPin, Trash2, Music, Volume2 } from 'lucide-react';

interface HangingCardProps {
  card: MemoryCard;
  onDelete?: (id: string) => void;
  canDelete: boolean;
  onClick: () => void;
}

export const HangingCard: React.FC<HangingCardProps> = ({ card, onDelete, canDelete, onClick }) => {

  const spotifyEmbedUrl = (() => {
    if (!card.spotifyUrl) return null;
    const match = card.spotifyUrl.match(/spotify\.com\/(track|playlist|album)\/([a-zA-Z0-9]+)/);
    if (match) return `https://open.spotify.com/embed/${match[1]}/${match[2]}`;
    return null;
  })();

  // ─── MEKTUP KARTI (Zarf Tasarımı) ─────────────────────────────
  if (card.type === 'letter') {
    return (
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
        {/* Mandal */}
        <div style={{ zIndex: 5, width: 14, height: 30, marginBottom: -2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ width: 12, height: 22, background: `linear-gradient(180deg,${card.pinColor}dd,${card.pinColor}88)`, borderRadius: '3px 3px 6px 6px', border: `1px solid ${card.pinColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 8, height: 1.5, background: 'rgba(0,0,0,0.3)', borderRadius: 2 }} />
          </div>
          <div style={{ width: 6, height: 8, background: card.pinColor, borderRadius: '0 0 4px 4px', marginTop: -2 }} />
        </div>

        {/* Zarf Kartı */}
        <div
          onClick={onClick}
          style={{
            width: 200,
            background: 'linear-gradient(135deg,#fffef5 60%,#fdf3e3)',
            borderRadius: 14,
            boxShadow: '0 8px 28px rgba(0,0,0,0.28)',
            overflow: 'hidden',
            transform: `rotate(${card.rotation}deg)`,
            transition: 'transform 0.25s ease, box-shadow 0.25s ease',
            border: '1px solid #e8d5b0',
            fontFamily: "'Caveat', cursive, sans-serif",
            cursor: 'pointer',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'rotate(0deg) scale(1.06) translateY(-6px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 20px 50px rgba(0,0,0,0.5)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = `rotate(${card.rotation}deg)`; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 28px rgba(0,0,0,0.28)'; }}
        >
          {/* Zarf Üst Kapak */}
          <div style={{ background: 'linear-gradient(135deg,#f5e6c8,#e8d5a0)', padding: '12px 14px 10px', borderBottom: '1px solid #e0c890', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#5c3d0e' }}>✉️ {card.letterFrom} → {card.letterTo}</div>
              <div style={{ fontSize: '0.65rem', color: '#8b6534', marginTop: 1 }}>{card.date}</div>
            </div>
            {/* Balmumu Mühür */}
            <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'radial-gradient(circle,#c0392b,#922b21)', border: '2px solid #a93226', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', flexShrink: 0 }}>
              💌
            </div>
          </div>
          {/* Mektup İçeriği Önizleme */}
          <div style={{ padding: '10px 14px 12px' }}>
            <p style={{ fontSize: '0.82rem', color: '#3d2b0e', lineHeight: 1.45, margin: 0, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden', wordBreak: 'break-word' }}>
              {card.letterContent || '…'}
            </p>
            <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.62rem', color: '#8b6534', fontStyle: 'italic' }}>Açmak için tıkla…</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        flexShrink: 0,
      }}
    >
      {/* Clothespin / Mandal */}
      <div style={{
        position: 'relative',
        zIndex: 5,
        width: 14,
        height: 30,
        marginBottom: -2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        {/* Pin body */}
        <div style={{
          width: 12,
          height: 22,
          background: `linear-gradient(180deg, ${card.pinColor}dd, ${card.pinColor}88)`,
          borderRadius: '3px 3px 6px 6px',
          border: `1px solid ${card.pinColor}`,
          boxShadow: `0 2px 6px ${card.pinColor}44`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{ width: 8, height: 1.5, background: 'rgba(0,0,0,0.3)', borderRadius: 2 }} />
        </div>
        {/* Pin tip */}
        <div style={{
          width: 6, height: 8,
          background: card.pinColor,
          borderRadius: '0 0 4px 4px',
          marginTop: -2,
        }} />
      </div>

      {/* Card Body */}
      <div
        onClick={onClick}
        style={{
          width: 200,
          background: card.type === 'text' ? '#fef9c3' : card.type === 'audio' ? '#f0f9ff' : '#ffffff',
          borderRadius: 14,
          boxShadow: '0 8px 28px rgba(0,0,0,0.28)',
          overflow: 'hidden',
          transform: `rotate(${card.rotation}deg)`,
          transition: 'transform 0.25s ease, box-shadow 0.25s ease',
          cursor: 'pointer',
          border: card.type === 'text' ? '1px solid #fde047' : card.type === 'audio' ? '1px solid #bae6fd' : '1px solid #e4e4e7',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLDivElement).style.transform = 'rotate(0deg) scale(1.06) translateY(-6px)';
          (e.currentTarget as HTMLDivElement).style.boxShadow = '0 20px 50px rgba(0,0,0,0.5)';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLDivElement).style.transform = `rotate(${card.rotation}deg)`;
          (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 28px rgba(0,0,0,0.28)';
        }}
      >

        {/* PHOTO */}
        {card.type === 'photo' && card.imageDataUrl && (
          <img
            src={card.imageDataUrl}
            alt={card.title || 'Anı'}
            style={{ width: '100%', height: 180, objectFit: 'cover', display: 'block' }}
          />
        )}

        {/* MUSIC */}
        {card.type === 'music' && spotifyEmbedUrl && (
          <iframe
            src={spotifyEmbedUrl}
            width="100%"
            height="120"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            style={{ display: 'block' }}
          />
        )}
        {card.type === 'music' && !spotifyEmbedUrl && (
          <div style={{ height: 80, background: '#18181b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Music size={28} style={{ color: '#22c55e' }} />
          </div>
        )}

        {/* AUDIO */}
        {card.type === 'audio' && card.audioDataUrl && (
          <div style={{ padding: '12px 12px 0 12px', background: '#f0f9ff' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#bae6fd', padding: '6px 10px', borderRadius: 8, marginBottom: 8 }}>
              <Volume2 size={16} style={{ color: '#0284c7', flexShrink: 0 }} />
              <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#0369a1', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Sesli Anı 🎙️</span>
            </div>
            <audio src={card.audioDataUrl} controls style={{ width: '100%', height: 32, display: 'block' }} />
          </div>
        )}

        {/* Card Caption / Content */}
        <div style={{ padding: '10px 12px 10px 12px' }}>

          {/* TEXT content */}
          {card.type === 'text' && card.content && (
            <p style={{
              fontSize: '0.82rem',
              lineHeight: 1.55,
              color: '#27272a',
              marginBottom: card.title || card.date ? 8 : 0,
              wordBreak: 'break-word',
            }}>
              {card.content}
            </p>
          )}

          {/* Title / Caption */}
          {card.title && (
            <p style={{
              fontSize: '0.78rem',
              fontWeight: 600,
              color: '#3f3f46',
              lineHeight: 1.3,
              marginBottom: 6,
              wordBreak: 'break-word',
            }}>
              {card.title}
            </p>
          )}

          {/* Date + Location + Author */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <span style={{ fontSize: '0.65rem', color: '#a1a1aa', fontWeight: 600 }}>
                {card.authorName} · {card.date}
              </span>
              {card.location && (
                <span style={{ fontSize: '0.62rem', color: '#71717a', display: 'flex', alignItems: 'center', gap: 2 }}>
                  <MapPin size={9} /> {card.location}
                </span>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
