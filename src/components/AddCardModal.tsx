import React, { useState, useRef } from 'react';
import { MemoryCard, User, CardType } from '../types';
import { X, Camera, FileText, Music, MapPin, Calendar, Volume2 } from 'lucide-react';

interface AddCardModalProps {
  tab: 'timeline' | 'eren' | 'ozlem';
  currentUser: User;
  onClose: () => void;
  onAdd: (card: MemoryCard) => void;
}

const PIN_COLORS = ['#e85d04', '#f7b731', '#20bf6b', '#4d9de0', '#7b2d8b', '#e84393'];

export const AddCardModal: React.FC<AddCardModalProps> = ({ tab, currentUser, onClose, onAdd }) => {
  const [step, setStep] = useState<'choose' | 'form'>('choose');
  const [cardType, setCardType] = useState<CardType>('photo');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [spotifyUrl, setSpotifyUrl] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [imageDataUrl, setImageDataUrl] = useState<string | undefined>();
  const [audioDataUrl, setAudioDataUrl] = useState<string | undefined>();
  const [audioFileName, setAudioFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  const handleChooseType = (type: CardType) => {
    setCardType(type);
    setStep('form');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setImageDataUrl(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAudioFileName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => setAudioDataUrl(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const formatDateToTr = (dateStr: string) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}.${parts[1]}.${parts[0]}`;
    }
    return dateStr;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCard: MemoryCard = {
      id: `card-${Date.now()}`,
      type: cardType,
      tab,
      title: title.trim() || undefined,
      content: content.trim() || undefined,
      imageDataUrl,
      audioDataUrl,
      spotifyUrl: spotifyUrl.trim() || undefined,
      date: formatDateToTr(date),
      location: location.trim() || undefined,
      authorId: currentUser.id,
      authorName: currentUser.name,
      pinColor: PIN_COLORS[Math.floor(Math.random() * PIN_COLORS.length)],
      rotation: Math.round((Math.random() * 6 - 3) * 10) / 10,
      createdAt: new Date().toISOString(),
    };
    onAdd(newCard);
    onClose();
  };

  const spotifyEmbedUrl = (() => {
    if (!spotifyUrl.trim()) return null;
    const match = spotifyUrl.match(/spotify\.com\/(track|playlist|album)\/([a-zA-Z0-9]+)/);
    if (match) return `https://open.spotify.com/embed/${match[1]}/${match[2]}`;
    return null;
  })();

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(12px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 16,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 480,
          background: '#18181b',
          border: '1px solid #27272a',
          borderRadius: 24,
          padding: 28,
          boxShadow: '0 30px 80px rgba(0,0,0,0.9)',
          position: 'relative',
          color: '#f4f4f5',
          fontFamily: 'inherit',
        }}
      >
        {/* Close */}
        <button onClick={onClose} style={{ position: 'absolute', top: 20, right: 20, background: 'transparent', border: 'none', color: '#71717a', cursor: 'pointer', padding: 4 }}>
          <X size={20} />
        </button>

        {step === 'choose' && (
          <>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', marginBottom: 6 }}>İpe ne asacaksın?</h2>
            <p style={{ fontSize: '0.8rem', color: '#71717a', marginBottom: 24 }}>Bir içerik türü seç, ipe yeni bir anı as.</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {/* Fotoğraf */}
              <button onClick={() => handleChooseType('photo')} style={typeButtonStyle('#f43f5e')}>
                <Camera size={28} style={{ color: '#f43f5e', marginBottom: 8 }} />
                <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#fff' }}>Fotoğraf</span>
                <span style={{ fontSize: '0.72rem', color: '#71717a', marginTop: 4 }}>Görsel + alt yazı</span>
              </button>

              {/* Yazı Notu */}
              <button onClick={() => handleChooseType('text')} style={typeButtonStyle('#f59e0b')}>
                <FileText size={28} style={{ color: '#f59e0b', marginBottom: 8 }} />
                <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#fff' }}>Not / Yazı</span>
                <span style={{ fontSize: '0.72rem', color: '#71717a', marginTop: 4 }}>Kısa not, günlük</span>
              </button>

              {/* Müzik */}
              <button onClick={() => handleChooseType('music')} style={typeButtonStyle('#22c55e')}>
                <Music size={28} style={{ color: '#22c55e', marginBottom: 8 }} />
                <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#fff' }}>Müzik</span>
                <span style={{ fontSize: '0.72rem', color: '#71717a', marginTop: 4 }}>Spotify şarkısı</span>
              </button>

              {/* Ses Dosyası */}
              <button onClick={() => handleChooseType('audio')} style={typeButtonStyle('#38bdf8')}>
                <Volume2 size={28} style={{ color: '#38bdf8', marginBottom: 8 }} />
                <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#fff' }}>Sesli Anı</span>
                <span style={{ fontSize: '0.72rem', color: '#71717a', marginTop: 4 }}>Ses dosyası yükle</span>
              </button>
            </div>
          </>
        )}

        {step === 'form' && (
          <>
            {/* Back header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <button onClick={() => setStep('choose')} style={{ background: '#27272a', border: 'none', color: '#a1a1aa', cursor: 'pointer', borderRadius: 8, padding: '4px 10px', fontSize: '0.78rem' }}>← Geri</button>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                {cardType === 'photo' ? '📷 Fotoğraf Kartı' : cardType === 'text' ? '📝 Not Kartı' : cardType === 'music' ? '🎵 Müzik Kartı' : '🎙️ Sesli Anı Kartı'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

              {/* PHOTO TYPE */}
              {cardType === 'photo' && (
                <>
                  <div>
                    <label style={labelStyle}>Fotoğraf Seç</label>
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      style={{
                        width: '100%', height: imageDataUrl ? 'auto' : 160,
                        border: '2px dashed #3f3f46',
                        borderRadius: 14,
                        cursor: 'pointer',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        background: '#09090b',
                        overflow: 'hidden',
                        transition: 'border-color 0.2s',
                      }}
                    >
                      {imageDataUrl ? (
                        <img src={imageDataUrl} alt="preview" style={{ width: '100%', maxHeight: 240, objectFit: 'cover', borderRadius: 12 }} />
                      ) : (
                        <>
                          <Camera size={32} style={{ color: '#3f3f46', marginBottom: 8 }} />
                          <span style={{ color: '#52525b', fontSize: '0.82rem' }}>Tıkla, fotoğraf seç</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Alt Yazı / Açıklama</label>
                    <input
                      type="text"
                      placeholder="Bu fotoğraf hakkında bir şeyler yaz..."
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      style={inputStyle}
                    />
                  </div>
                </>
              )}

              {/* TEXT TYPE */}
              {cardType === 'text' && (
                <>
                  <div>
                    <label style={labelStyle}>Başlık (opsiyonel)</label>
                    <input
                      type="text"
                      placeholder="Kartın başlığı..."
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Not / Yazı *</label>
                    <textarea
                      required
                      placeholder="Bugün nasıl hissediyorum, bir anı, düşünce..."
                      value={content}
                      onChange={e => setContent(e.target.value)}
                      rows={5}
                      style={{ ...inputStyle, resize: 'none', height: 'auto' }}
                    />
                  </div>
                </>
              )}

              {/* MUSIC TYPE */}
              {cardType === 'music' && (
                <>
                  <div>
                    <label style={labelStyle}>Spotify Linki *</label>
                    <input
                      required
                      type="url"
                      placeholder="https://open.spotify.com/track/..."
                      value={spotifyUrl}
                      onChange={e => setSpotifyUrl(e.target.value)}
                      style={inputStyle}
                    />
                  </div>
                  {spotifyEmbedUrl && (
                    <iframe
                      src={spotifyEmbedUrl}
                      width="100%" height="80"
                      frameBorder="0"
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                      loading="lazy"
                      style={{ borderRadius: 12 }}
                    />
                  )}
                  <div>
                    <label style={labelStyle}>Bu şarkı ne ifade ediyor?</label>
                    <input
                      type="text"
                      placeholder="Bunu sana düşünerek ekledim çünkü..."
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      style={inputStyle}
                    />
                  </div>
                </>
              )}

              {/* AUDIO TYPE */}
              {cardType === 'audio' && (
                <>
                  <div>
                    <label style={labelStyle}>Ses Dosyası Seç (.mp3, .wav, .m4a)</label>
                    <input ref={audioInputRef} type="file" accept="audio/*" onChange={handleAudioChange} style={{ display: 'none' }} />
                    <div
                      onClick={() => audioInputRef.current?.click()}
                      style={{
                        width: '100%',
                        border: '2px dashed #3f3f46',
                        borderRadius: 14,
                        padding: '24px 16px',
                        cursor: 'pointer',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        background: '#09090b',
                        transition: 'border-color 0.2s',
                        textAlign: 'center',
                        boxSizing: 'border-box',
                      }}
                    >
                      <Volume2 size={32} style={{ color: '#38bdf8', marginBottom: 8 }} />
                      <span style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 600 }}>
                        {audioFileName ? `Seçildi: ${audioFileName}` : 'Ses Dosyası Yüklemek İçin Tıklayın 🎙️'}
                      </span>
                      <span style={{ color: '#71717a', fontSize: '0.72rem', marginTop: 4 }}>
                        Desteklenen formatlar: MP3, WAV, M4A
                      </span>
                    </div>
                  </div>
                  {audioDataUrl && (
                    <div style={{ marginTop: 8 }}>
                      <audio src={audioDataUrl} controls style={{ width: '100%', borderRadius: 8 }} />
                    </div>
                  )}
                  <div>
                    <label style={labelStyle}>Sesli Anı Açıklaması / Başlığı</label>
                    <input
                      type="text"
                      placeholder="Ses kaydı hakkında bir açıklama yaz..."
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      style={inputStyle}
                    />
                  </div>
                </>
              )}

              {/* ORTAK: Tarih & Konum */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={labelStyle}><Calendar size={11} style={{ display: 'inline', marginRight: 4 }} />Tarih</label>
                  <input
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}><MapPin size={11} style={{ display: 'inline', marginRight: 4 }} />Konum (opsiyonel)</label>
                  <input
                    type="text"
                    placeholder="Örn: Kadıköy Sahil"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* Submit */}
              <div style={{ display: 'flex', gap: 10, paddingTop: 8, borderTop: '1px solid #27272a' }}>
                <button type="button" onClick={onClose} style={cancelBtnStyle}>İptal</button>
                <button type="submit" style={submitBtnStyle}>İpe As ✨</button>
              </div>

            </form>
          </>
        )}
      </div>
    </div>
  );
};

// ——— Stil yardımcıları ———
const typeButtonStyle = (accent: string): React.CSSProperties => ({
  background: '#09090b',
  border: `1px solid #27272a`,
  borderRadius: 16,
  padding: '18px 10px',
  display: 'flex', flexDirection: 'column', alignItems: 'center',
  cursor: 'pointer',
  transition: 'all 0.2s',
  color: '#fff',
  outline: 'none',
  boxShadow: 'none',
});

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.7rem',
  fontWeight: 700,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.08em',
  color: '#a1a1aa',
  marginBottom: 6,
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '11px 14px',
  background: 'rgba(9,9,11,0.8)',
  border: '1px solid #27272a',
  borderRadius: 10,
  color: '#ffffff',
  fontSize: '0.88rem',
  outline: 'none',
  fontFamily: 'inherit',
  boxSizing: 'border-box' as const,
};

const cancelBtnStyle: React.CSSProperties = {
  flex: 1, padding: '11px', borderRadius: 12,
  background: '#27272a', border: 'none', color: '#a1a1aa',
  cursor: 'pointer', fontWeight: 700, fontSize: '0.88rem',
};

const submitBtnStyle: React.CSSProperties = {
  flex: 2, padding: '11px', borderRadius: 12,
  background: 'linear-gradient(135deg, #f43f5e, #e11d48)',
  border: 'none', color: '#fff',
  cursor: 'pointer', fontWeight: 700, fontSize: '0.88rem',
  boxShadow: '0 6px 20px rgba(244,63,94,0.35)',
};
