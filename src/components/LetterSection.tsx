import React, { useState, useEffect } from 'react';
import { Mail, Plus, Send, X, Trash2, Lock, KeyRound, Unlock } from 'lucide-react';
import confetti from 'canvas-confetti';
import { supabase } from '../lib/supabase';

export interface Letter {
  id: string;
  fromName: string;
  toName: string;
  content: string;
  date: string;
  createdAt: string;
  isLocked?: boolean;
  passcode?: string;
}

function formatDateTR(iso: string): string {
  if (!iso) return '';
  const months = ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToLetter(row: any): Letter {
  let content = row.content || '';
  let isLocked = false;
  let passcode = '';

  // DB column or content header check for fallback
  if (row.passcode) {
    isLocked = true;
    passcode = row.passcode;
  } else if (content.startsWith('[LOCKED:')) {
    const match = content.match(/^\[LOCKED:(.*?)\]\n?/);
    if (match) {
      isLocked = true;
      passcode = match[1];
      content = content.replace(/^\[LOCKED:(.*?)\]\n?/, '');
    }
  }

  return {
    id: row.id,
    fromName: row.author,
    toName: row.for_tab === 'eren' ? 'Eren' : 'Özlem',
    content,
    date: row.date || formatDateTR(row.created_at),
    createdAt: row.created_at,
    isLocked,
    passcode,
  };
}

// ─── Zarf Kartı ──────────────────────────────────────────────────
const EnvelopeCard: React.FC<{
  letter: Letter;
  currentUserName: string;
  onDelete: (id: string) => void;
}> = ({ letter, currentUserName, onDelete }) => {
  const [open, setOpen] = useState(false);
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [enteredPass, setEnteredPass] = useState('');
  const [unlockError, setUnlockError] = useState('');

  const isOzlem = letter.fromName.toLowerCase().includes('özlem') || letter.fromName.toLowerCase().includes('ozlem');

  const theme = isOzlem
    ? {
        bg: 'linear-gradient(145deg, #064e3b, #022c22)',
        border: '1px solid #059669',
        flapBg: 'linear-gradient(135deg, #047857, #065f46)',
        flapBorder: '#10b981',
        sealFrom: '#34d399',
        sealTo: '#059669',
        sealBorder: 'rgba(167, 243, 208, 0.4)',
        titleColor: '#ecfdf5',
        dateColor: '#a7f3d0',
        previewColor: '#d1fae5',
        subtextColor: '#6ee7b7',
        openHeaderBg: 'linear-gradient(135deg, #064e3b, #047857)',
        openHeaderTitle: '#ecfdf5',
        openHeaderDate: '#a7f3d0',
        openHeaderIcon: '#a7f3d0',
      }
    : {
        bg: 'linear-gradient(145deg, #0a1338, #030717)',
        border: '1px solid #182e7a',
        flapBg: 'linear-gradient(135deg, #12225c, #0a1338)',
        flapBorder: '#233fa3',
        sealFrom: '#486ee8',
        sealTo: '#101d52',
        sealBorder: 'rgba(123, 148, 255, 0.5)',
        titleColor: '#e8eeff',
        dateColor: '#a8baef',
        previewColor: '#c5d3fa',
        subtextColor: '#7b94ff',
        openHeaderBg: 'linear-gradient(135deg, #04091f, #12225c)',
        openHeaderTitle: '#e8eeff',
        openHeaderDate: '#a8baef',
        openHeaderIcon: '#a8baef',
      };

  const handleEnvelopeClick = () => {
    if (letter.isLocked) {
      setShowUnlockModal(true);
      setUnlockError('');
      setEnteredPass('');
    } else {
      setOpen(true);
    }
  };

  const handleVerifyPasscode = () => {
    if (enteredPass.trim() === letter.passcode?.trim()) {
      setShowUnlockModal(false);
      setOpen(true);
      confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
    } else {
      setUnlockError('❌ Yanlış Şifre! Lütfen tekrar dene.');
    }
  };

  const handleConfirmDelete = () => {
    setShowConfirmDelete(false);
    setOpen(false);
    setShowUnlockModal(false);
    onDelete(letter.id);
  };

  if (open) {
    return (
      <>
        <div
          style={{
            gridColumn: '1 / -1',
            background: '#fffef5',
            border: '1px solid #e0c890',
            borderRadius: 20,
            overflow: 'hidden',
            boxShadow: '0 16px 48px rgba(0,0,0,0.6)',
            fontFamily: "'Caveat', 'Segoe UI', cursive, sans-serif",
            animation: 'fadeIn 0.25s ease',
          }}
        >
          {/* Açık zarf başlığı */}
          <div style={{ background: theme.openHeaderBg, padding: '18px 24px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: theme.openHeaderTitle, display: 'flex', alignItems: 'center', gap: 6 }}>
                {letter.isLocked ? <Unlock size={18} style={{ color: '#facc15' }} /> : '✉️'} {letter.fromName} → {letter.toName}
                {letter.isLocked && <span style={{ fontSize: '0.7rem', background: 'rgba(250, 204, 21, 0.2)', color: '#facc15', border: '1px solid rgba(250, 204, 21, 0.4)', padding: '2px 8px', borderRadius: 9999, fontWeight: 700 }}>Şifreli Mektup</span>}
              </div>
              <div style={{ fontSize: '0.75rem', color: theme.openHeaderDate, marginTop: 2 }}>{letter.date}</div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button
                onClick={() => setShowConfirmDelete(true)}
                style={{
                  background: 'rgba(239, 68, 68, 0.2)',
                  border: '1px solid #ef4444',
                  color: '#f87171',
                  padding: '6px 12px',
                  borderRadius: 10,
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                }}
              >
                <Trash2 size={14} /> Mektubu Sil 🗑️
              </button>

              <button onClick={() => setOpen(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: theme.openHeaderIcon, padding: 4 }}>
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Mektup içeriği */}
          <div style={{ padding: '24px 28px' }}>
            <div style={{ marginBottom: 16, fontSize: '1.05rem', fontWeight: 700, color: '#3d2b0e' }}>
              Sevgili {letter.toName},
            </div>
            <div style={{
              background: 'repeating-linear-gradient(transparent, transparent 27px, #d4c4a0 27px, #d4c4a0 28px)',
              minHeight: 140, padding: '4px 8px', borderRadius: 4, marginBottom: 16,
            }}>
              <p style={{ fontSize: '1.05rem', color: '#2d1f0a', lineHeight: '28px', margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                {letter.content}
              </p>
            </div>
            <div style={{ textAlign: 'right', marginBottom: 16 }}>
              <span style={{ fontSize: '1rem', color: '#5c3d0e', fontWeight: 600 }}>
                Sevgiyle, {letter.fromName} 💛
              </span>
            </div>
            <div style={{ borderTop: '1px dashed #d4c4a0', paddingTop: 14, display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowConfirmDelete(true)}
                style={{
                  background: '#fee2e2',
                  border: '1px solid #fca5a5',
                  borderRadius: 10,
                  padding: '8px 16px',
                  cursor: 'pointer',
                  color: '#b91c1c',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  fontFamily: 'inherit',
                  boxShadow: '0 2px 8px rgba(185, 28, 28, 0.15)',
                }}
              >
                <Trash2 size={15} /> Bu Mektubu Sil 🗑️
              </button>
            </div>
          </div>
        </div>

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
                Mektubu Silmek İstediğinden Emin Misin? 💭
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#a1a1aa', margin: '0 0 20px', fontWeight: 500 }}>
                Bu mektup kalıcı olarak silinecek.
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
      </>
    );
  }

  return (
    <>
      <div
        onClick={handleEnvelopeClick}
        style={{
          background: theme.bg,
          border: letter.isLocked ? '1px solid #facc15' : theme.border,
          borderRadius: 16,
          overflow: 'hidden',
          cursor: 'pointer',
          boxShadow: letter.isLocked ? '0 4px 20px rgba(250, 204, 21, 0.25)' : '0 4px 16px rgba(0,0,0,0.4)',
          transition: 'all 0.22s cubic-bezier(0.34,1.56,0.64,1)',
          fontFamily: "'Caveat', 'Segoe UI', cursive, sans-serif",
          position: 'relative',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-6px) scale(1.03)';
          (e.currentTarget as HTMLDivElement).style.boxShadow = letter.isLocked ? '0 16px 40px rgba(250, 204, 21, 0.4)' : '0 16px 40px rgba(0,0,0,0.6)';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLDivElement).style.transform = '';
          (e.currentTarget as HTMLDivElement).style.boxShadow = letter.isLocked ? '0 4px 20px rgba(250, 204, 21, 0.25)' : '0 4px 16px rgba(0,0,0,0.4)';
        }}
      >
        {/* Zarf Kapağı */}
        <div style={{
          width: '100%',
          height: 70,
          position: 'relative',
          overflow: 'hidden',
          background: theme.flapBg,
          borderBottom: `1px solid ${theme.flapBorder}`,
        }}>
          {/* Mühür */}
          <div style={{
            position: 'absolute',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 38, height: 38,
            borderRadius: '50%',
            background: letter.isLocked ? 'radial-gradient(circle, #facc15, #ca8a04)' : `radial-gradient(circle, ${theme.sealFrom}, ${theme.sealTo})`,
            border: letter.isLocked ? '2px solid #fef08a' : `2px solid ${theme.sealBorder}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.1rem',
            boxShadow: letter.isLocked ? '0 3px 12px rgba(250, 204, 21, 0.6)' : `0 3px 12px ${theme.sealFrom}aa`,
            zIndex: 1,
            color: letter.isLocked ? '#000' : 'inherit',
          }}>
            {letter.isLocked ? <Lock size={18} /> : '💌'}
          </div>
        </div>

        {/* Zarf Gövde */}
        <div style={{ padding: '12px 16px 14px' }}>
          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: theme.titleColor, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>{letter.fromName} → {letter.toName}</span>
            {letter.isLocked && <Lock size={14} style={{ color: '#facc15' }} />}
          </div>
          <div style={{ fontSize: '0.72rem', color: theme.dateColor, marginTop: 3, marginBottom: 8 }}>
            {letter.date}
          </div>

          {letter.isLocked ? (
            <div style={{
              fontSize: '0.82rem', color: '#facc15',
              background: 'rgba(250, 204, 21, 0.1)',
              padding: '6px 8px', borderRadius: 8,
              border: '1px dashed rgba(250, 204, 21, 0.3)',
              lineHeight: 1.3, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6,
            }}>
              🔒 Gizli Şifreli Mektup
            </div>
          ) : (
            <div style={{
              fontSize: '0.85rem', color: theme.previewColor,
              overflow: 'hidden', display: '-webkit-box',
              WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const,
              lineHeight: 1.45, fontStyle: 'italic',
              opacity: 0.9,
            }}>
              "{letter.content.slice(0, 80)}{letter.content.length > 80 ? '...' : ''}"
            </div>
          )}

          <div style={{ marginTop: 10, fontSize: '0.7rem', color: letter.isLocked ? '#facc15' : theme.subtextColor, fontWeight: 700, letterSpacing: '0.04em' }}>
            {letter.isLocked ? 'Şifreyi gir ve aç 🗝️' : 'Açmak için tıkla ✦'}
          </div>
        </div>
      </div>

      {/* ŞİFRE GİRİŞ MODALI */}
      {showUnlockModal && (
        <div onClick={() => setShowUnlockModal(false)} style={{ position: 'fixed', inset: 0, zIndex: 99999, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div onClick={e => e.stopPropagation()} style={{
            width: '100%', maxWidth: 400,
            background: '#121215',
            border: '1px solid #facc15',
            borderRadius: 22,
            padding: 24,
            boxShadow: '0 25px 60px rgba(0,0,0,0.9), 0 0 30px rgba(250, 204, 21, 0.3)',
            textAlign: 'center',
          }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(250, 204, 21, 0.15)', border: '2px solid #facc15', color: '#facc15', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
              <KeyRound size={28} />
            </div>

            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', margin: '0 0 6px' }}>
              🔒 Bu Mektup Şifreli!
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#a1a1aa', margin: '0 0 18px', fontWeight: 500 }}>
              {letter.fromName} bu mektuba gizli bir şifre koydu. Okumak için şifreyi gir:
            </p>

            <form onSubmit={e => { e.preventDefault(); handleVerifyPasscode(); }}>
              <input
                type="password"
                autoFocus
                placeholder="Gizli Şifre (Örn: 1402)..."
                value={enteredPass}
                onChange={e => { setEnteredPass(e.target.value); setUnlockError(''); }}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: 12,
                  background: '#18181b',
                  border: '1px solid #3f3f46',
                  color: '#fff',
                  fontSize: '1rem',
                  fontWeight: 700,
                  textAlign: 'center',
                  outline: 'none',
                  boxSizing: 'border-box',
                  marginBottom: 12,
                  letterSpacing: '0.1em',
                }}
              />

              {unlockError && (
                <div style={{ color: '#f87171', fontSize: '0.8rem', fontWeight: 700, marginBottom: 12 }}>
                  {unlockError}
                </div>
              )}

              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  type="button"
                  onClick={() => setShowUnlockModal(false)}
                  style={{ flex: 1, padding: '12px', borderRadius: 12, background: '#27272a', border: 'none', color: '#a1a1aa', fontWeight: 700, cursor: 'pointer' }}
                >
                  İptal
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowUnlockModal(false);
                    onDelete(letter.id);
                  }}
                  style={{ padding: '12px 14px', borderRadius: 12, background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444', color: '#f87171', fontWeight: 700, cursor: 'pointer' }}
                >
                  Sil 🗑️
                </button>
                <button
                  type="submit"
                  style={{ flex: 1.5, padding: '12px', borderRadius: 12, background: 'linear-gradient(135deg, #eab308, #facc15)', border: 'none', color: '#000', fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 14px rgba(250, 204, 21, 0.4)' }}
                >
                  Kilidi Aç 🗝️
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

// ─── Mektup Yazma Modalı ─────────────────────────────────────────
const WriteLetterModal: React.FC<{
  currentUserName: string;
  onClose: () => void;
  onSend: (letter: Letter) => void;
}> = ({ currentUserName, onClose, onSend }) => {
  const [content, setContent] = useState('');
  const [isLocked, setIsLocked] = useState(false);
  const [passcode, setPasscode] = useState('');
  const otherPerson = currentUserName.toLowerCase() === 'eren' ? 'Özlem' : 'Eren';

  const handleSend = () => {
    if (!content.trim()) return;
    if (isLocked && !passcode.trim()) {
      alert('Lütfen kilitli mektup için bir şifre belirle!');
      return;
    }

    onSend({
      id: `letter-${Date.now()}`,
      fromName: currentUserName,
      toName: otherPerson,
      content: content.trim(),
      date: formatDateTR(new Date().toISOString()),
      createdAt: new Date().toISOString(),
      isLocked,
      passcode: passcode.trim(),
    });
    onClose();
  };

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.87)', backdropFilter: 'blur(14px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: '100%', maxWidth: 520,
        background: '#fffef5',
        border: '1px solid #e0c890',
        borderRadius: 20,
        overflow: 'hidden',
        boxShadow: '0 40px 100px rgba(0,0,0,0.9)',
        fontFamily: "'Caveat', 'Segoe UI', cursive, sans-serif",
      }}>
        <div style={{ background: 'linear-gradient(135deg, #f5e6c8, #e8d5a0)', padding: '20px 24px', borderBottom: '1px solid #e0c890', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#3d2b0e' }}>
              ✉️ {otherPerson}'a Mektup Yaz
            </h3>
            <p style={{ margin: '4px 0 0', fontSize: '0.78rem', color: '#8b6534' }}>
              {currentUserName} → {otherPerson} · {formatDateTR(new Date().toISOString())}
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#8b6534', padding: 4 }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '20px 24px' }}>
          <div style={{ marginBottom: 8, fontSize: '1.05rem', color: '#3d2b0e', fontWeight: 600 }}>
            Sevgili {otherPerson},
          </div>
          <div style={{
            background: 'repeating-linear-gradient(transparent, transparent 27px, #d4c4a0 27px, #d4c4a0 28px)',
            borderRadius: 4, padding: '4px 8px', marginBottom: 16,
          }}>
            <textarea
              autoFocus
              placeholder="Mektubunu buraya yaz..."
              value={content}
              onChange={e => setContent(e.target.value)}
              rows={6}
              style={{
                width: '100%', background: 'transparent', border: 'none', outline: 'none',
                resize: 'none', fontSize: '1.05rem', color: '#2d1f0a',
                lineHeight: '28px', fontFamily: 'inherit', boxSizing: 'border-box',
              }}
            />
          </div>

          {/* ŞİFRELİ MEKTUP SEÇENEĞİ */}
          <div style={{
            background: 'rgba(250, 204, 21, 0.12)',
            border: '1px solid #e0c890',
            borderRadius: 14,
            padding: 12,
            marginBottom: 16,
          }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.9rem', color: '#3d2b0e', fontWeight: 700 }}>
              <input
                type="checkbox"
                checked={isLocked}
                onChange={e => setIsLocked(e.target.checked)}
                style={{ width: 18, height: 18, accentColor: '#ca8a04', cursor: 'pointer' }}
              />
              <Lock size={16} style={{ color: '#ca8a04' }} /> 🔒 Şifreli Mektup Olsun (Kilitli)
            </label>

            {isLocked && (
              <div style={{ marginTop: 10 }}>
                <input
                  type="text"
                  placeholder="Gizli Mektup Şifresi Girin (Örn: 1402, ozlem)..."
                  value={passcode}
                  onChange={e => setPasscode(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 10,
                    background: '#fff',
                    border: '1px solid #ca8a04',
                    color: '#2d1f0a',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    outline: 'none',
                    boxSizing: 'border-box',
                    fontFamily: 'sans-serif',
                  }}
                />
              </div>
            )}
          </div>

          <div style={{ textAlign: 'right', marginBottom: 16, fontSize: '0.95rem', color: '#5c3d0e' }}>
            Sevgiyle, {currentUserName} 💛
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={onClose} style={{ flex: 1, padding: '11px', borderRadius: 10, background: 'transparent', border: '1px solid #e0c890', color: '#8b6534', cursor: 'pointer', fontWeight: 700, fontSize: '0.9rem', fontFamily: 'inherit' }}>
              İptal
            </button>
            <button
              onClick={handleSend}
              disabled={!content.trim() || (isLocked && !passcode.trim())}
              style={{ flex: 2, padding: '11px', borderRadius: 10, background: content.trim() ? 'linear-gradient(135deg,#c0392b,#922b21)' : '#ccc', border: 'none', color: '#fff', cursor: content.trim() ? 'pointer' : 'not-allowed', fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontFamily: 'inherit', boxShadow: content.trim() ? '0 4px 16px rgba(192,57,43,0.35)' : 'none' }}
            >
              <Send size={14} /> Mektubu Gönder
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Ana Bileşen ─────────────────────────────────────────────────
interface LetterSectionProps {
  currentUserName: string;
}

export const LetterSection: React.FC<LetterSectionProps> = ({ currentUserName }) => {
  const [letters, setLetters] = useState<Letter[]>([]);
  const [showModal, setShowModal] = useState(false);

  const fetchLetters = async () => {
    const { data, error } = await supabase
      .from('letters')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setLetters(data.map(rowToLetter));
  };

  useEffect(() => {
    fetchLetters();
    const channel = supabase
      .channel('letters_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'letters' }, () => {
        fetchLetters();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const handleSend = async (letter: Letter) => {
    const forTab = letter.toName.toLowerCase() === 'eren' ? 'eren' : 'ozlem';

    let finalContent = letter.content;
    if (letter.isLocked && letter.passcode) {
      finalContent = `[LOCKED:${letter.passcode}]\n${letter.content}`;
    }

    // First attempt full payload
    let res = await supabase.from('letters').insert({
      id: letter.id,
      for_tab: forTab,
      content: finalContent,
      author: letter.fromName,
      passcode: letter.passcode || null,
      is_locked: letter.isLocked || false,
    }).select();

    // Fallback if schema does not have passcode column yet
    if (res.error) {
      console.warn('Full schema insert failed, retrying basic schema:', res.error.message);
      res = await supabase.from('letters').insert({
        id: letter.id,
        for_tab: forTab,
        content: finalContent,
        author: letter.fromName,
      }).select();
    }

    if (res.data && res.data[0]) {
      const created = rowToLetter(res.data[0]);
      setLetters(prev => [created, ...prev.filter(l => l.id !== created.id)]);
    } else {
      // Optimistic UI update so letter appears immediately as locked card
      setLetters(prev => [letter, ...prev]);
    }
  };

  const handleDelete = async (id: string) => {
    // Tıklandığı an engelsiz anında ekrandan uçur
    setLetters(prev => prev.filter(l => l.id !== id));
    try {
      await supabase.from('letters').delete().eq('id', id);
    } catch (err) {
      console.error('Supabase mektup silme hatası:', err);
    }
  };

  return (
    <section>
      {/* Başlık */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Mail size={20} style={{ color: '#c0392b' }} />
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', margin: 0 }}>Mektup Köşesi 💌</h2>
            {letters.length > 0 && (
              <p style={{ margin: 0, fontSize: '0.7rem', color: '#52525b', fontWeight: 600 }}>
                {letters.length} mektup
              </p>
            )}
          </div>
        </div>
        <button
          onClick={() => setShowModal(true)}
          style={{
            padding: '8px 18px', borderRadius: 9999,
            background: 'linear-gradient(135deg, #f5e6c8, #e8d5a0)',
            border: '1px solid #d4b87a', color: '#5c3d0e',
            cursor: 'pointer', fontSize: '0.78rem', fontWeight: 700,
            display: 'flex', alignItems: 'center', gap: 6,
            fontFamily: "'Caveat', cursive, sans-serif",
            boxShadow: '0 4px 12px rgba(192,57,43,0.2)',
          }}
        >
          <Plus size={14} /> Mektup Yaz
        </button>
      </div>

      {/* Zarflar Grid */}
      {letters.length === 0 ? (
        <div style={{
          border: '2px dashed #27272a', borderRadius: 20,
          padding: '56px 24px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
          textAlign: 'center',
          background: 'radial-gradient(circle at 50% 60%, rgba(192,57,43,0.04), transparent 70%)',
        }}>
          <span style={{ fontSize: '3rem' }}>📭</span>
          <p style={{ color: '#52525b', fontSize: '0.9rem', margin: 0, fontWeight: 700 }}>Henüz hiç mektup yok</p>
          <p style={{ color: '#3f3f46', fontSize: '0.78rem', margin: 0 }}>
            İlk mektubu yaz, burada güzel zarflar biriksin ✦
          </p>
          <button
            onClick={() => setShowModal(true)}
            style={{ marginTop: 8, padding: '9px 22px', borderRadius: 9999, background: 'linear-gradient(135deg,#f5e6c8,#e8d5a0)', border: '1px solid #d4b87a', color: '#5c3d0e', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6, fontFamily: "'Caveat', cursive" }}
          >
            <Plus size={14} /> İlk mektubu yaz
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: 14,
        }}>
          {letters.map(letter => (
            <EnvelopeCard
              key={letter.id}
              letter={letter}
              currentUserName={currentUserName}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {showModal && (
        <WriteLetterModal
          currentUserName={currentUserName}
          onClose={() => setShowModal(false)}
          onSend={handleSend}
        />
      )}
    </section>
  );
};
