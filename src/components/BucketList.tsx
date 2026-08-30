import React, { useState, useEffect } from 'react';
import { Plus, Check, X, Sparkles, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface BucketItem {
  id: string;
  text: string;
  done: boolean;
  color: string;
  rotation: number;
  addedBy: string;
  addedAt: string;
}

const POSTIT_COLORS = [
  '#fef08a',
  '#bbf7d0',
  '#fbcfe8',
  '#bfdbfe',
  '#ddd6fe',
  '#fed7aa',
  '#fecaca',
  '#a5f3fc',
];

function randomRotation(): number {
  return (Math.random() - 0.5) * 5;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToItem(row: any): BucketItem {
  return {
    id: row.id,
    text: row.text,
    done: row.done,
    color: row.color,
    rotation: row.rotation ?? 0,
    addedBy: row.added_by,
    addedAt: row.added_at,
  };
}

// ─── Tek Post-it Notu ─────────────────────────────────────────────
const PostItNote: React.FC<{
  item: BucketItem;
  onToggle: (id: string) => void;
  onDelete: (item: BucketItem) => void;
  canDelete: boolean;
}> = ({ item, onToggle, onDelete, canDelete }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: item.color,
        borderRadius: 4,
        padding: '20px 14px 22px 14px',
        width: 160,
        minHeight: 150,
        flexShrink: 0,
        position: 'relative',
        transform: `rotate(${item.rotation}deg) ${hovered ? 'translateY(-8px) scale(1.05)' : ''}`,
        transition: 'transform 0.22s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.22s',
        boxShadow: hovered
          ? '0 20px 48px rgba(0,0,0,0.5), 0 4px 12px rgba(0,0,0,0.3)'
          : '0 6px 20px rgba(0,0,0,0.32), 0 2px 6px rgba(0,0,0,0.2)',
        cursor: 'pointer',
        userSelect: 'none',
      }}
      onClick={() => onToggle(item.id)}
    >
      {/* Tape şeridi */}
      <div style={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)', width: 40, height: 18, background: 'rgba(255,255,255,0.5)', borderRadius: 3, border: '1px solid rgba(255,255,255,0.75)', boxShadow: '0 1px 4px rgba(0,0,0,0.12)' }} />

      {/* Sil butonu (Görünür & Kırmızı Hover) */}
      {canDelete && (
        <button
          onClick={e => {
            e.stopPropagation();
            onDelete(item);
          }}
          style={{
            position: 'absolute',
            top: 6,
            right: 6,
            background: hovered ? '#ef4444' : 'rgba(0,0,0,0.35)',
            border: 'none',
            borderRadius: '50%',
            width: 24,
            height: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#fff',
            padding: 0,
            opacity: hovered ? 1 : 0.7,
            boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
            transition: 'all 0.15s ease',
            zIndex: 10,
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = '#dc2626';
            e.currentTarget.style.transform = 'scale(1.15)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = hovered ? '#ef4444' : 'rgba(0,0,0,0.35)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
          title="Aktiviteyi Sil"
        >
          <X size={14} strokeWidth={2.5} />
        </button>
      )}

      {/* Tamamlandı */}
      {item.done && (
        <div style={{ position: 'absolute', top: 8, left: 8, background: 'rgba(0,0,0,0.2)', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Check size={12} color="#1a1a1a" />
        </div>
      )}

      {/* Metin */}
      <p style={{ margin: 0, marginTop: item.done ? 6 : 0, fontSize: '1.05rem', fontWeight: 700, color: '#1c1c1c', lineHeight: 1.4, fontFamily: "'Caveat', cursive", textDecoration: item.done ? 'line-through' : 'none', opacity: item.done ? 0.45 : 1, wordBreak: 'break-word' }}>
        {item.text}
      </p>

      {/* Ekleyen */}
      <p style={{ position: 'absolute', bottom: 7, right: 9, margin: 0, fontSize: '0.58rem', color: 'rgba(0,0,0,0.35)', fontWeight: 600 }}>
        {item.addedBy}
      </p>
    </div>
  );
};

const AddNoteCard: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ width: 160, minHeight: 150, flexShrink: 0, border: '2px dashed #3f3f46', borderRadius: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer', color: hovered ? '#a855f7' : '#52525b', borderColor: hovered ? '#a855f7' : '#3f3f46', background: hovered ? 'rgba(168,85,247,0.05)' : 'transparent', transition: 'all 0.2s', transform: hovered ? 'translateY(-4px)' : 'none' }}
    >
      <div style={{ width: 38, height: 38, borderRadius: '50%', border: '2px dashed currentColor', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Plus size={18} />
      </div>
      <span style={{ fontSize: '0.75rem', fontWeight: 700, textAlign: 'center', lineHeight: 1.3 }}>
        Aktivite<br />ekle
      </span>
    </div>
  );
};

const AddNoteModal: React.FC<{
  currentUserName: string;
  existingCount: number;
  onClose: () => void;
  onAdd: (item: BucketItem) => void;
}> = ({ currentUserName, existingCount, onClose, onAdd }) => {
  const [text, setText] = useState('');
  const colorIndex = existingCount % POSTIT_COLORS.length;
  const noteColor = POSTIT_COLORS[colorIndex];

  const handleAdd = () => {
    if (!text.trim()) return;
    onAdd({
      id: `bucket-${Date.now()}`,
      text: text.trim(),
      done: false,
      color: noteColor,
      rotation: randomRotation(),
      addedBy: currentUserName,
      addedAt: new Date().toISOString(),
    });
    onClose();
  };

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: 400, background: noteColor, borderRadius: 6, padding: '32px 28px 24px', boxShadow: '0 40px 100px rgba(0,0,0,0.75)', position: 'relative', fontFamily: 'inherit', borderTop: '10px solid rgba(255,255,255,0.45)' }}>
        <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', width: 56, height: 20, background: 'rgba(255,255,255,0.55)', borderRadius: 4, border: '1px solid rgba(255,255,255,0.8)' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
          <Sparkles size={18} color="#7c3aed" />
          <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: '#1c1c1c', fontFamily: "'Caveat', cursive" }}>
            Birlikte ne yapalım? 🌟
          </h3>
        </div>

        <textarea
          autoFocus
          placeholder="Kapadokya'ya gitmek, pasta yapmak, film maratonu..."
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAdd(); } }}
          rows={3}
          style={{ width: '100%', padding: '12px 14px', background: 'rgba(255,255,255,0.45)', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 8, color: '#1c1c1c', fontSize: '1.05rem', fontFamily: "'Caveat', cursive", fontWeight: 600, outline: 'none', resize: 'none', boxSizing: 'border-box' }}
        />

        <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
          <button onClick={onClose} style={{ flex: 1, padding: '10px', borderRadius: 8, background: 'rgba(0,0,0,0.1)', border: 'none', color: '#444', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem', fontFamily: 'inherit' }}>İptal</button>
          <button onClick={handleAdd} disabled={!text.trim()} style={{ flex: 2, padding: '10px', borderRadius: 8, background: '#7c3aed', border: 'none', color: '#fff', cursor: text.trim() ? 'pointer' : 'not-allowed', fontWeight: 700, fontSize: '0.9rem', opacity: text.trim() ? 1 : 0.5, boxShadow: '0 4px 16px rgba(124,58,237,0.4)', fontFamily: 'inherit' }}>
            📌 Yapıştır!
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Ana BucketList Bileşeni ─────────────────────────────────────
export const BucketList: React.FC<{ currentUserName: string }> = ({ currentUserName }) => {
  const [items, setItems] = useState<BucketItem[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<BucketItem | null>(null);

  const fetchItems = async () => {
    const { data, error } = await supabase
      .from('bucket_list')
      .select('*')
      .order('added_at', { ascending: true });
    if (!error && data) setItems(data.map(rowToItem));
  };

  useEffect(() => {
    fetchItems();

    const channel = supabase
      .channel('bucket_list_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bucket_list' }, () => {
        fetchItems();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const handleAdd = async (item: BucketItem) => {
    const { error } = await supabase.from('bucket_list').insert({
      id: item.id,
      text: item.text,
      done: item.done,
      color: item.color,
      rotation: item.rotation,
      added_by: item.addedBy,
      added_at: item.addedAt,
    });
    if (!error) setItems(prev => [...prev, item]);
  };

  const handleToggle = async (id: string) => {
    const item = items.find(i => i.id === id);
    if (!item) return;
    const newDone = !item.done;
    const { error } = await supabase.from('bucket_list').update({ done: newDone }).eq('id', id);
    if (!error) setItems(prev => prev.map(i => i.id === id ? { ...i, done: newDone } : i));
  };

  const confirmDeleteItem = async () => {
    if (!itemToDelete) return;
    const targetId = itemToDelete.id;

    // 1. Optimistic remove immediately
    setItems(prev => prev.filter(i => i.id !== targetId));
    setItemToDelete(null);

    // 2. Delete from Supabase
    try {
      const { error } = await supabase.from('bucket_list').delete().eq('id', targetId);
      if (error) console.error('Aktivite silme hatası:', error);
    } catch (err) {
      console.error('Silme hatası:', err);
    }
  };

  const doneCount = items.filter(i => i.done).length;

  return (
    <section style={{ marginTop: 40 }}>

      {/* Başlık */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: '1.2rem' }}>📌</span>
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', margin: 0 }}>Birlikte Yapılacaklar</h2>
            {items.length > 0 && (
              <p style={{ margin: 0, fontSize: '0.7rem', color: '#52525b', fontWeight: 600 }}>
                {doneCount}/{items.length} tamamlandı ✨
              </p>
            )}
          </div>
        </div>
        <button
          onClick={() => setShowModal(true)}
          style={{ padding: '7px 14px', borderRadius: 9999, background: '#18181b', border: '1px solid #2a2a2a', color: '#a1a1aa', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 5 }}
        >
          <Plus size={13} /> Aktivite Ekle
        </button>
      </div>

      {/* Pano */}
      <div style={{ background: 'rgba(15,15,15,0.6)', border: '1px solid #1f1f1f', borderRadius: 16, padding: '32px 24px 28px', position: 'relative', minHeight: 200, backgroundImage: 'radial-gradient(circle at 15% 60%, rgba(168,85,247,0.04) 0%, transparent 55%), radial-gradient(circle at 85% 25%, rgba(236,72,153,0.04) 0%, transparent 55%)' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: 'linear-gradient(90deg,#a855f7,#ec4899,#f43f5e,#fb923c)', borderRadius: '16px 16px 0 0' }} />

        {items.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '20px 0', textAlign: 'center' }}>
            <span style={{ fontSize: '2.5rem' }}>📋</span>
            <div>
              <p style={{ margin: 0, fontSize: '0.88rem', fontWeight: 700, color: '#52525b' }}>Henüz birlikte yapılacak bir şey yok!</p>
              <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: '#3f3f46' }}>Planlarınızı post-it olarak yapıştırın 📌</p>
            </div>
            <button onClick={() => setShowModal(true)} style={{ padding: '9px 20px', borderRadius: 9999, background: 'rgba(168,85,247,0.12)', border: '1px dashed #7c3aed', color: '#a855f7', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Plus size={14} /> İlk aktiviteyi ekle
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, paddingTop: 10 }}>
            {items.map(item => (
              <PostItNote
                key={item.id}
                item={item}
                onToggle={handleToggle}
                onDelete={(item) => setItemToDelete(item)}
                canDelete={true}
              />
            ))}
            <AddNoteCard onClick={() => setShowModal(true)} />
          </div>
        )}
      </div>

      {showModal && (
        <AddNoteModal
          currentUserName={currentUserName}
          existingCount={items.length}
          onClose={() => setShowModal(false)}
          onAdd={handleAdd}
        />
      )}

      {/* Aktivite Silme Onay Modalı */}
      {itemToDelete && (
        <div
          onClick={() => setItemToDelete(null)}
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
              maxWidth: 400,
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
              Aktiviteyi Sil
            </h3>
            <p style={{ margin: '0 0 20px', fontSize: '0.85rem', color: '#a1a1aa', lineHeight: 1.45 }}>
              <strong style={{ color: '#fff' }}>"{itemToDelete.text}"</strong> aktivitesini panodan kaldırmak istediğine emin misin?
            </p>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => setItemToDelete(null)}
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
                onClick={confirmDeleteItem}
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
    </section>
  );
};
