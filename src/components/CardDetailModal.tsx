import React, { useState, useEffect } from 'react';
import { MemoryCard } from '../types';
import { X, MapPin, Calendar, User, Trash2 } from 'lucide-react';

interface CardDetailModalProps {
  card: MemoryCard;
  onClose: () => void;
  onDelete?: (id: string) => void;
}

export const CardDetailModal: React.FC<CardDetailModalProps> = ({ card, onClose, onDelete }) => {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  // ESC ile kapat
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const spotifyEmbedUrl = (() => {
    if (!card.spotifyUrl) return null;
    const match = card.spotifyUrl.match(/spotify\.com\/(track|playlist|album)\/([a-zA-Z0-9]+)/);
    if (match) return `https://open.spotify.com/embed/${match[1]}/${match[2]}`;
    return null;
  })();

  const handleDeleteClick = () => {
    setShowConfirmDelete(true);
  };

  const handleConfirmDelete = () => {
    if (onDelete) {
      onDelete(card.id);
      onClose();
    }
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.88)',
        backdropFilter: 'blur(16px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 16,
        animation: 'fadeIn 0.2s ease',
      }}
    >
      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes scaleUp { from { opacity: 0; transform: scale(0.85) } to { opacity: 1; transform: scale(1) } }
      `}</style>

      {/* ─── MEKTUP KARTI DETAYI ─── */}
      {card.type === 'letter' && (
        <div
          onClick={e => e.stopPropagation()}
          style={{
            width: '100%', maxWidth: 540,
            background: '#fffef5',
            border: '1px solid #e0c890',
            borderRadius: 20,
            overflow: 'hidden',
            boxShadow: '0 40px 100px rgba(0,0,0,0.95)',
            fontFamily: "'Caveat', 'Segoe UI', cursive, sans-serif",
            animation: 'scaleUp 0.25s ease',
          }}
        >
          {/* Zarf kapağı */}
          <div style={{ background: 'linear-gradient(135deg,#f5e6c8,#e8d5a0)', padding: '20px 24px', borderBottom: '1px solid #e0c890', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#3d2b0e' }}>
                ✉️ {card.letterFrom} → {card.letterTo}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#8b6534', marginTop: 3, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Calendar size={12} /> {card.date}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'radial-gradient(circle,#c0392b,#922b21)', border: '3px solid #a93226', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', boxShadow: '0 4px 12px rgba(192,57,43,0.5)' }}>
                💌
              </div>
              <button onClick={onClose} style={{ background: 'rgba(0,0,0,0.1)', border: 'none', cursor: 'pointer', color: '#5c3d0e', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Mektup içeriği - çizgili kağıt */}
          <div style={{ padding: '20px 28px 24px' }}>
            <div style={{ marginBottom: 16, fontSize: '1.05rem', fontWeight: 700, color: '#3d2b0e' }}>
              Sevgili {card.letterTo},
            </div>
            <div style={{
              background: 'repeating-linear-gradient(transparent,transparent 27px,#d4c4a0 27px,#d4c4a0 28px)',
              padding: '4px 8px', borderRadius: 4, marginBottom: 20,
              minHeight: 120,
            }}>
              <p style={{ fontSize: '1.05rem', color: '#2d1f0a', lineHeight: '28px', margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                {card.letterContent}
              </p>
            </div>
            <div style={{ textAlign: 'right', fontSize: '1rem', color: '#5c3d0e', fontWeight: 600, marginBottom: 16 }}>
              Sevgiyle, {card.letterFrom} 💛
            </div>
            {onDelete && (
              <div style={{ borderTop: '1px dashed #d4c4a0', paddingTop: 14, display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  onClick={handleDeleteClick}
                  style={{ background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 10, padding: '8px 16px', cursor: 'pointer', color: '#b91c1c', display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', fontWeight: 700, fontFamily: 'inherit' }}
                >
                  <Trash2 size={15} /> Bu Mektubu Sil 🗑️
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── FOTOĞRAF KARTI DETAYI ─── */}
      {card.type === 'photo' && (
        <div
          onClick={e => e.stopPropagation()}
          style={{
            width: '100%', maxWidth: 560,
            background: '#ffffff',
            borderRadius: 20,
            overflow: 'hidden',
            boxShadow: '0 40px 100px rgba(0,0,0,0.95)',
            animation: 'scaleUp 0.25s ease',
          }}
        >
          {/* Büyük fotoğraf */}
          {card.imageDataUrl && (
            <img
              src={card.imageDataUrl}
              alt={card.title || 'Anı'}
              style={{ width: '100%', maxHeight: 420, objectFit: 'cover', display: 'block' }}
            />
          )}
          <div style={{ padding: '16px 20px', background: '#fff', fontFamily: "'Caveat', cursive, sans-serif" }}>
            {card.title && (
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#18181b', margin: '0 0 8px' }}>
                {card.title}
              </h2>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.8rem', color: '#71717a' }}>
                <User size={13} /> {card.authorName}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.8rem', color: '#71717a' }}>
                <Calendar size={13} /> {card.date}
              </span>
              {card.location && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.8rem', color: '#f43f5e' }}>
                  <MapPin size={13} /> {card.location}
                </span>
              )}
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
              <button onClick={onClose} style={{ flex: 1, padding: '10px', borderRadius: 10, background: '#09090b', border: 'none', color: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem' }}>Kapat ✕</button>
              {onDelete && (
                <button onClick={handleDeleteClick} style={{ padding: '10px 16px', borderRadius: 10, background: '#fee2e2', border: '1px solid #fca5a5', color: '#b91c1c', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Trash2 size={15} /> Sil 🗑️
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─── YAZI / NOT KARTI DETAYI ─── */}
      {card.type === 'text' && (
        <div
          onClick={e => e.stopPropagation()}
          style={{
            width: '100%', maxWidth: 480,
            background: '#fef9c3',
            border: '1px solid #fde047',
            borderRadius: 20,
            overflow: 'hidden',
            boxShadow: '0 40px 100px rgba(0,0,0,0.95)',
            animation: 'scaleUp 0.25s ease',
            fontFamily: "'Caveat', 'Segoe UI', cursive, sans-serif",
          }}
        >
          {/* Başlık barı */}
          <div style={{ background: '#fef08a', padding: '14px 20px', borderBottom: '1px solid #fde047', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#713f12' }}>{card.title || '📝 Not'}</div>
              <div style={{ fontSize: '0.72rem', color: '#92400e', marginTop: 2 }}>{card.authorName} · {card.date}</div>
            </div>
            <button onClick={onClose} style={{ background: 'rgba(0,0,0,0.08)', border: 'none', cursor: 'pointer', color: '#713f12', borderRadius: '50%', width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <X size={15} />
            </button>
          </div>
          {/* Çizgili yazı alanı */}
          <div style={{ padding: '16px 20px 20px' }}>
            <div style={{ background: 'repeating-linear-gradient(transparent,transparent 27px,#fbbf24aa 27px,#fbbf24aa 28px)', padding: '4px 8px', borderRadius: 4, minHeight: 120 }}>
              <p style={{ fontSize: '1.1rem', color: '#1c1917', lineHeight: '28px', margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                {card.content}
              </p>
            </div>
            <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              {card.location ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.78rem', color: '#92400e' }}>
                  <MapPin size={12} /> {card.location}
                </div>
              ) : <div />}
              {onDelete && (
                <button onClick={handleDeleteClick} style={{ background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 10, padding: '7px 14px', cursor: 'pointer', color: '#b91c1c', display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.82rem', fontWeight: 700 }}>
                  <Trash2 size={14} /> Anıyı Sil 🗑️
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─── MÜZİK KARTI DETAYI ─── */}
      {card.type === 'music' && (
        <div
          onClick={e => e.stopPropagation()}
          style={{
            width: '100%', maxWidth: 440,
            background: '#18181b',
            border: '1px solid #27272a',
            borderRadius: 20,
            overflow: 'hidden',
            boxShadow: '0 40px 100px rgba(0,0,0,0.95)',
            animation: 'scaleUp 0.25s ease',
          }}
        >
          <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #27272a' }}>
            <div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>{card.title || '🎵 Müzik'}</div>
              <div style={{ fontSize: '0.72rem', color: '#71717a', marginTop: 2 }}>{card.authorName} · {card.date}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {onDelete && (
                <button onClick={handleDeleteClick} title="Müziği Sil" style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444', color: '#f87171', borderRadius: 8, padding: '5px 10px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Trash2 size={13} /> Sil 🗑️
                </button>
              )}
              <button onClick={onClose} style={{ background: '#27272a', border: 'none', cursor: 'pointer', color: '#a1a1aa', borderRadius: '50%', width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={15} />
              </button>
            </div>
          </div>
          {spotifyEmbedUrl && (
            <iframe
              src={spotifyEmbedUrl}
              width="100%" height="200"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              allowFullScreen
              loading="lazy"
              style={{ display: 'block' }}
            />
          )}
          {!spotifyEmbedUrl && (
            <div style={{ padding: 32, textAlign: 'center', color: '#52525b' }}>Spotify embed yüklenemedi.</div>
          )}
        </div>
      )}

      {/* ─── SESLİ ANI KARTI DETAYI ─── */}
      {card.type === 'audio' && (
        <div
          onClick={e => e.stopPropagation()}
          style={{
            width: '100%', maxWidth: 440,
            background: '#18181b',
            border: '1px solid #27272a',
            borderRadius: 20,
            overflow: 'hidden',
            boxShadow: '0 40px 100px rgba(0,0,0,0.95)',
            animation: 'scaleUp 0.25s ease',
            padding: 20,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #27272a', paddingBottom: 12, marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: 6 }}>
                🎙️ Sesli Anı
              </div>
              <div style={{ fontSize: '0.72rem', color: '#71717a', marginTop: 2 }}>{card.authorName} · {card.date}</div>
            </div>
            <button onClick={onClose} style={{ background: '#27272a', border: 'none', cursor: 'pointer', color: '#a1a1aa', borderRadius: '50%', width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <X size={15} />
            </button>
          </div>
          {card.audioDataUrl && (
            <div style={{ background: '#09090b', padding: 16, borderRadius: 14, border: '1px solid #27272a', marginBottom: 16 }}>
              <audio src={card.audioDataUrl} controls style={{ width: '100%' }} />
            </div>
          )}
          {card.title && (
            <p style={{ fontSize: '0.88rem', color: '#e4e4e7', fontStyle: 'italic', margin: '0 0 16px', lineHeight: 1.5 }}>
              "{card.title}"
            </p>
          )}
          {onDelete && (
            <div style={{ borderTop: '1px solid #27272a', paddingTop: 14, display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={handleDeleteClick} style={{ background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 10, padding: '7px 14px', cursor: 'pointer', color: '#b91c1c', display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.82rem', fontWeight: 700 }}>
                <Trash2 size={14} /> Anıyı Sil 🗑️
              </button>
            </div>
          )}
        </div>
      )}

      {/* SİLME ONAY BALONCUK MODALI (EMİN MİSİN?) */}
      {showConfirmDelete && (
        <div onClick={() => setShowConfirmDelete(false)} style={{ position: 'fixed', inset: 0, zIndex: 999999, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div onClick={e => e.stopPropagation()} style={{
            width: '100%', maxWidth: 360,
            background: '#18181b',
            border: '1px solid #3f3f46',
            borderRadius: 22,
            padding: 24,
            textAlign: 'center',
            boxShadow: '0 25px 60px rgba(0,0,0,0.9), 0 0 30px rgba(244, 63, 94, 0.25)',
            animation: 'scaleUp 0.2s ease',
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 6 }}>💭</div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', margin: '0 0 6px' }}>
              Silmek İstediğinden Emin Misin? 💭
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#a1a1aa', margin: '0 0 20px', fontWeight: 500 }}>
              Bu anı kalıcı olarak silinecek.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => setShowConfirmDelete(false)}
                style={{ flex: 1, padding: '11px', borderRadius: 12, background: '#27272a', border: 'none', color: '#fff', fontWeight: 700, cursor: 'pointer' }}
              >
                Vazgeç ✕
              </button>
              <button
                onClick={handleConfirmDelete}
                style={{ flex: 1.2, padding: '11px', borderRadius: 12, background: 'linear-gradient(135deg, #e11d48, #f43f5e)', border: 'none', color: '#fff', fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 14px rgba(244,63,94,0.4)' }}
              >
                Evet, Sil 🗑️
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
