import React, { useState, useEffect } from 'react';
import { Plus, Play, Music2, Trash2, Calendar } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface DailySongEntry {
  id: string;
  url: string;
  videoId: string;
  title: string;
  addedDate: string;
  addedBy: string;
}

function extractVideoId(url: string): string | null {
  const patterns = [
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

function formatDateTR(isoDate: string): string {
  const months = ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];
  const d = new Date(isoDate);
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToEntry(row: any): DailySongEntry {
  return {
    id: row.id,
    url: row.url,
    videoId: row.video_id,
    title: row.title,
    addedDate: row.added_date,
    addedBy: row.added_by,
  };
}

// ─── Tek Video Kartı ─────────────────────────────────────────────
const SongCard: React.FC<{
  entry: DailySongEntry;
  onDelete: (entry: DailySongEntry) => void;
  canDelete: boolean;
}> = ({ entry, onDelete, canDelete }) => {
  const [playing, setPlaying] = useState(false);

  const thumbnailUrl = `https://img.youtube.com/vi/${entry.videoId}/hqdefault.jpg`;
  const embedUrl = `https://www.youtube.com/embed/${entry.videoId}?autoplay=1&rel=0&modestbranding=1`;

  return (
    <div style={{
      background: '#0f0f0f',
      borderRadius: 16,
      overflow: 'hidden',
      border: '1px solid #1a1a1a',
      boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
      width: 320,
      flexShrink: 0,
    }}>
      {/* Video Alanı */}
      <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', background: '#000', cursor: 'pointer' }}
        onClick={() => setPlaying(true)}
      >
        {playing ? (
          <iframe
            src={embedUrl}
            width="100%"
            height="100%"
            style={{ display: 'block', border: 'none' }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <>
            <img
              src={thumbnailUrl}
              alt={entry.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              onError={e => { (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${entry.videoId}/mqdefault.jpg`; }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.25)' }} />
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 62, height: 44, background: '#ff0000', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(255,0,0,0.5)' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
              </div>
            </div>
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.85))', padding: '16px 12px 8px', display: 'flex', alignItems: 'center', gap: 6 }}>
              <svg width="16" height="11" viewBox="0 0 16 11" fill="none">
                <path d="M15.68 1.72C15.5 1.06 14.98.54 14.32.36 13.08 0 8 0 8 0S2.92 0 1.68.36C1.02.54.5 1.06.32 1.72 0 2.96 0 5.5 0 5.5s0 2.54.32 3.78c.18.66.7 1.18 1.36 1.36C2.92 11 8 11 8 11s5.08 0 6.32-.36c.66-.18 1.18-.7 1.36-1.36C16 8.04 16 5.5 16 5.5s0-2.54-.32-3.78z" fill="#FF0000"/>
                <path d="M6.4 7.86L10.56 5.5 6.4 3.14v4.72z" fill="white"/>
              </svg>
              <span style={{ color: '#fff', fontSize: '0.7rem', fontWeight: 600, opacity: 0.9 }}>İzlemek için YouTube</span>
            </div>
          </>
        )}
      </div>

      {/* Kart Alt Bilgisi */}
      <div style={{ padding: '12px 14px' }}>
        <p style={{ color: '#e5e5e5', fontSize: '0.88rem', fontWeight: 700, lineHeight: 1.35, margin: 0, marginBottom: 8, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden' }}>
          {entry.title || 'Günün Şarkısı'}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#6b6b6b', fontSize: '0.72rem' }}>
            <Calendar size={11} />
            <span>{entry.addedDate}</span>
            <span style={{ color: '#3f3f3f' }}>·</span>
            <span>{entry.addedBy}</span>
          </div>
          {canDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(entry);
              }}
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                borderRadius: 8,
                cursor: 'pointer',
                color: '#f87171',
                padding: '4px 8px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                fontSize: '0.72rem',
                fontWeight: 700,
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.25)';
                e.currentTarget.style.borderColor = '#ef4444';
                e.currentTarget.style.color = '#ef4444';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.25)';
                e.currentTarget.style.color = '#f87171';
              }}
              title="Bu şarkıyı sil"
            >
              <Trash2 size={12} />
              <span>Sil</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const AddSongCard: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <div style={{ width: 320, flexShrink: 0, aspectRatio: '16/9', border: '2px dashed #27272a', borderRadius: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, cursor: 'pointer', color: '#3f3f46', transition: 'all 0.2s', background: 'transparent', padding: 0, alignSelf: 'center' }}
    onClick={onClick}
    onMouseEnter={e => { const el = e.currentTarget; el.style.borderColor = '#ff0000'; el.style.color = '#ff4444'; el.style.background = 'rgba(255,0,0,0.04)'; }}
    onMouseLeave={e => { const el = e.currentTarget; el.style.borderColor = '#27272a'; el.style.color = '#3f3f46'; el.style.background = 'transparent'; }}
  >
    <div style={{ width: 44, height: 44, borderRadius: '50%', border: '2px dashed currentColor', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Plus size={20} />
    </div>
    <span style={{ fontSize: '0.78rem', fontWeight: 700 }}>Günün şarkısını ekle</span>
  </div>
);

const AddSongModal: React.FC<{
  currentUserName: string;
  onClose: () => void;
  onAdd: (entry: DailySongEntry) => void;
}> = ({ currentUserName, onClose, onAdd }) => {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');

  const videoId = extractVideoId(url);
  const thumbnailPreview = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null;

  const handleAdd = () => {
    if (!url.trim()) { setError('YouTube linki gir.'); return; }
    if (!videoId) { setError('Geçerli bir YouTube linki değil.'); return; }
    if (!title.trim()) { setError('Şarkı başlığı gir.'); return; }

    onAdd({
      id: `song-${Date.now()}`,
      url,
      videoId,
      title: title.trim(),
      addedDate: formatDateTR(new Date().toISOString()),
      addedBy: currentUserName,
    });
    onClose();
  };

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: 460, background: '#0f0f0f', border: '1px solid #1f1f1f', borderRadius: 20, padding: 26, boxShadow: '0 32px 80px rgba(0,0,0,0.95)', color: '#e5e5e5', fontFamily: 'inherit', position: 'relative' }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <div style={{ width: 34, height: 34, borderRadius: 8, background: '#ff0000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Play size={16} color="#fff" fill="#fff" />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#fff' }}>Günün Şarkısını Ekle</h3>
            <p style={{ margin: 0, fontSize: '0.7rem', color: '#6b6b6b' }}>YouTube linki yapıştır, başlık yaz</p>
          </div>
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={labelSt}>YouTube Linki</label>
          <input autoFocus type="url" placeholder="https://www.youtube.com/watch?v=..." value={url} onChange={e => { setUrl(e.target.value); setError(''); }} style={inputSt} />
        </div>

        {thumbnailPreview && (
          <div style={{ marginBottom: 12, borderRadius: 10, overflow: 'hidden', border: '1px solid #1f1f1f', aspectRatio: '16/9', background: '#000' }}>
            <img src={thumbnailPreview} alt="önizleme" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          </div>
        )}

        <div style={{ marginBottom: 16 }}>
          <label style={labelSt}>Şarkı Adı / Başlık</label>
          <input type="text" placeholder="Örn: korean bakery feels [chill lofi beats]" value={title} onChange={e => setTitle(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAdd()} style={inputSt} />
        </div>

        {error && <p style={{ color: '#ff4444', fontSize: '0.78rem', marginBottom: 12 }}>{error}</p>}

        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={onClose} style={{ flex: 1, padding: '11px', borderRadius: 10, background: '#1a1a1a', border: '1px solid #2a2a2a', color: '#6b6b6b', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem' }}>İptal</button>
          <button onClick={handleAdd} style={{ flex: 2, padding: '11px', borderRadius: 10, background: '#ff0000', border: 'none', color: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem', boxShadow: '0 4px 16px rgba(255,0,0,0.35)' }}>Ekle ▶</button>
        </div>
      </div>
    </div>
  );
};

// ─── Ana DailySong Bileşeni ──────────────────────────────────────
export const DailySong: React.FC<{ currentUserName: string }> = ({ currentUserName }) => {
  const [songs, setSongs] = useState<DailySongEntry[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [songToDelete, setSongToDelete] = useState<DailySongEntry | null>(null);

  const fetchSongs = async () => {
    const { data, error } = await supabase
      .from('daily_songs')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setSongs(data.map(rowToEntry));
  };

  useEffect(() => {
    fetchSongs();

    const channel = supabase
      .channel('daily_songs_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'daily_songs' }, () => {
        fetchSongs();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const handleAdd = async (entry: DailySongEntry) => {
    const { error } = await supabase.from('daily_songs').insert({
      id: entry.id,
      url: entry.url,
      video_id: entry.videoId,
      title: entry.title,
      added_date: entry.addedDate,
      added_by: entry.addedBy,
    });
    if (!error) setSongs(prev => [entry, ...prev]);
  };

  const confirmDeleteSong = async () => {
    if (!songToDelete) return;
    const target = songToDelete;
    // 1. Optimistic remove immediately from UI
    setSongs(prev => prev.filter(s => s.id !== target.id));
    setSongToDelete(null);

    // 2. Delete from Supabase
    try {
      const { error } = await supabase.from('daily_songs').delete().eq('id', target.id);
      if (error) {
        console.warn('ID ile silinemedi, video_id deneniyor:', error);
        await supabase.from('daily_songs').delete().eq('video_id', target.videoId);
      }
    } catch (err) {
      console.error('Şarkı silme hatası:', err);
    }
  };

  return (
    <section style={{ marginTop: 32 }}>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Music2 size={18} style={{ color: '#ff4444' }} />
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', margin: 0 }}>Günün Şarkısı</h2>
        </div>
        <button onClick={() => setShowModal(true)} style={{ padding: '7px 14px', borderRadius: 9999, background: '#1a1a1a', border: '1px solid #2a2a2a', color: '#a1a1aa', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 5 }}>
          <Plus size={13} /> Şarkı Ekle
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'row', gap: 20, overflowX: 'auto', paddingBottom: 12, scrollbarWidth: 'thin', scrollbarColor: '#2a2a2a transparent' }}>
        {songs.length === 0 ? (
          <AddSongCard onClick={() => setShowModal(true)} />
        ) : (
          <>
            {songs.map(s => (
              <SongCard
                key={s.id}
                entry={s}
                onDelete={(entry) => setSongToDelete(entry)}
                canDelete={true}
              />
            ))}
            <AddSongCard onClick={() => setShowModal(true)} />
          </>
        )}
      </div>

      {/* Şarkı Silme Onay Modalı */}
      {songToDelete && (
        <div
          onClick={() => setSongToDelete(null)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: 420,
              background: '#121216',
              border: '1px solid #27272a',
              borderRadius: 20,
              padding: 24,
              boxShadow: '0 25px 60px rgba(0,0,0,0.9)',
              color: '#fff',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: 'rgba(239, 68, 68, 0.15)',
                color: '#ef4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                border: '1px solid rgba(239, 68, 68, 0.3)',
              }}
            >
              <Trash2 size={24} />
            </div>

            <h3 style={{ margin: '0 0 8px', fontSize: '1.1rem', fontWeight: 800 }}>
              Şarkıyı Sil
            </h3>
            <p style={{ margin: '0 0 20px', fontSize: '0.85rem', color: '#a1a1aa', lineHeight: 1.45 }}>
              <strong style={{ color: '#fff' }}>"{songToDelete.title}"</strong> adlı şarkıyı Günün Şarkısı listesinden kaldırmak istediğine emin misin?
            </p>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => setSongToDelete(null)}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  borderRadius: 12,
                  background: '#1f1f23',
                  border: '1px solid #2e2e33',
                  color: '#d4d4d8',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                }}
              >
                Vazgeç
              </button>
              <button
                onClick={confirmDeleteSong}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  borderRadius: 12,
                  background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                  border: 'none',
                  color: '#fff',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(239, 68, 68, 0.4)',
                }}
              >
                Evet, Sil
              </button>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <AddSongModal
          currentUserName={currentUserName}
          onClose={() => setShowModal(false)}
          onAdd={handleAdd}
        />
      )}
    </section>
  );
};

const labelSt: React.CSSProperties = {
  display: 'block', fontSize: '0.68rem', fontWeight: 700,
  textTransform: 'uppercase', letterSpacing: '0.08em',
  color: '#6b6b6b', marginBottom: 6,
};

const inputSt: React.CSSProperties = {
  width: '100%', padding: '10px 14px',
  background: '#1a1a1a', border: '1px solid #2a2a2a',
  borderRadius: 10, color: '#e5e5e5', fontSize: '0.88rem',
  outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
};
