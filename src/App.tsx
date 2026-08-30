import React, { useState, useEffect, useRef } from 'react';
import { User, MemoryCard } from './types';
import { LoginScreen, ALLOWED_ACCOUNTS } from './components/LoginScreen';
import { Clothesline } from './components/Clothesline';
import { AddCardModal } from './components/AddCardModal';
import { CatOverlay } from './components/CatOverlay';
import { DailySong } from './components/DailySong';
import { BucketList } from './components/BucketList';
import { LetterSection } from './components/LetterSection';
import { ProfileModal } from './components/ProfileModal';
import { FlyingCatOverlay } from './components/FlyingCatOverlay';
import { FlightRadarSection } from './components/FlightRadarSection';
import { HabitCatSection } from './components/HabitCat/HabitCatSection';
import { SiriusStar } from './components/SiriusStar';
import { Sparkles, Heart, LogOut, Plus, Mail, Plane, Cat } from 'lucide-react';
import confetti from 'canvas-confetti';
import { supabase } from './lib/supabase';

type TabType = 'timeline' | 'letters' | 'flightradar' | 'habitcat';

// Supabase satırını MemoryCard'a çevir
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToCard(row: any): MemoryCard {
  return {
    id: row.id,
    type: row.type,
    tab: row.tab,
    title: row.title ?? undefined,
    content: row.content ?? undefined,
    imageDataUrl: row.type === 'audio' ? undefined : (row.image_url ?? undefined),
    audioDataUrl: row.type === 'audio' ? (row.image_url ?? undefined) : undefined,
    spotifyUrl: row.spotify_url ?? undefined,
    letterFrom: row.letter_from ?? undefined,
    letterTo: row.letter_to ?? undefined,
    letterContent: row.letter_content ?? undefined,
    date: row.date ?? '',
    location: row.location ?? undefined,
    authorId: row.added_by,
    authorName: row.added_by_name,
    pinColor: row.pin_color ?? '#e85d04',
    rotation: row.rotation ?? 0,
    createdAt: row.created_at,
  };
}

export const App: React.FC = () => {
  // ─── Kullanıcılar ───────────────────────────────────────────────
  const users: User[] = ALLOWED_ACCOUNTS.map(acc => ({
    id: acc.username,
    name: acc.name,
    username: acc.username,
    avatar: acc.avatar,
  }));
  void users; // suppress unused warning

  // ─── Auth ────────────────────────────────────────────────────────
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try { return JSON.parse(sessionStorage.getItem('anihane_user') || 'null'); }
    catch { return null; }
  });
  const [showCat, setShowCat] = useState(false);

  // ─── Profil Fotoğrafları ─────────────────────────────────────────
  const [avatars, setAvatars] = useState<{ eren: string; ozlem: string }>(() => {
    try {
      const saved = localStorage.getItem('anihane_avatars');
      if (saved) return JSON.parse(saved);
    } catch { /* ignore */ }
    return { eren: '/eren_avatar.jpg', ozlem: '/ozlem_avatar.jpg' };
  });

  const [selectedProfileModal, setSelectedProfileModal] = useState<{ username: 'eren' | 'ozlem'; name: string } | null>(null);

  useEffect(() => {
    try { localStorage.setItem('anihane_avatars', JSON.stringify(avatars)); } catch {}
  }, [avatars]);

  const handleUpdateAvatar = (username: string, newUrl: string) => {
    const key = username.toLowerCase().includes('özlem') || username.toLowerCase().includes('ozlem') ? 'ozlem' : 'eren';
    setAvatars(prev => {
      const updated = { ...prev, [key]: newUrl };
      try { localStorage.setItem('anihane_avatars', JSON.stringify(updated)); } catch {}
      return updated;
    });

    if (currentUser) {
      const isMe = currentUser.username.toLowerCase().includes(key);
      if (isMe) {
        const updatedUser = { ...currentUser, avatar: newUrl };
        setCurrentUser(updatedUser);
        sessionStorage.setItem('anihane_user', JSON.stringify(updatedUser));
      }
    }
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    sessionStorage.setItem('anihane_user', JSON.stringify(user));
    if (user.username.toLowerCase().startsWith('özlem') || user.username.toLowerCase() === 'ozlem') {
      setShowCat(true);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem('anihane_user');
  };

  // ─── Kartlar (Supabase) ──────────────────────────────────────────
  const [cards, setCards] = useState<MemoryCard[]>([]);

  const fetchCards = async () => {
    const { data, error } = await supabase
      .from('memory_cards')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setCards(data.map(rowToCard));
  };

  useEffect(() => {
    fetchCards();

    // Realtime — diğer kullanıcının değişikliklerini anlık al
    const channel = supabase
      .channel('memory_cards_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'memory_cards' }, () => {
        fetchCards();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const handleAddCard = async (card: MemoryCard) => {
    let imageUrl = card.imageDataUrl ?? '';
    let audioUrl = card.audioDataUrl ?? '';

    // Fotoğraf varsa Supabase Storage'a yükle
    if (card.imageDataUrl && card.imageDataUrl.startsWith('data:')) {
      try {
        const blob = await fetch(card.imageDataUrl).then(r => r.blob());
        const ext = blob.type.split('/')[1] || 'jpg';
        const fileName = `${card.id}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from('anihane')
          .upload(fileName, blob, { contentType: blob.type, upsert: true });

        if (!uploadError) {
          const { data: urlData } = supabase.storage
            .from('anihane')
            .getPublicUrl(fileName);
          imageUrl = urlData.publicUrl;
        }
      } catch (err) {
        console.warn('Fotoğraf yüklenemedi, base64 olarak saklanıyor:', err);
      }
    }

    // Ses dosyası varsa Supabase Storage'a yükle
    if (card.audioDataUrl && card.audioDataUrl.startsWith('data:')) {
      try {
        const blob = await fetch(card.audioDataUrl).then(r => r.blob());
        const ext = blob.type.split('/')[1]?.split(';')[0] || 'mp3';
        const fileName = `${card.id}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from('anihane')
          .upload(fileName, blob, { contentType: blob.type, upsert: true });

        if (!uploadError) {
          const { data: urlData } = supabase.storage
            .from('anihane')
            .getPublicUrl(fileName);
          audioUrl = urlData.publicUrl;
        }
      } catch (err) {
        console.warn('Ses dosyası yüklenemedi, base64 olarak saklanıyor:', err);
      }
    }

    const { error } = await supabase.from('memory_cards').insert({
      id: card.id,
      type: card.type,
      tab: card.tab,
      title: card.title ?? null,
      content: card.content ?? null,
      image_url: card.type === 'audio' ? (audioUrl || null) : (imageUrl || null),
      spotify_url: card.spotifyUrl ?? null,
      letter_from: card.letterFrom ?? null,
      letter_to: card.letterTo ?? null,
      letter_content: card.letterContent ?? null,
      date: card.date,
      location: card.location ?? null,
      added_by: card.authorId,
      added_by_name: card.authorName,
      pin_color: card.pinColor,
      rotation: card.rotation,
    });

    if (!error) {
      setCards(prev => [
        { 
          ...card, 
          imageDataUrl: card.type === 'audio' ? undefined : imageUrl,
          audioDataUrl: card.type === 'audio' ? audioUrl : undefined 
        }, 
        ...prev
      ]);
    } else {
      console.error('Kart eklenemedi:', error);
      alert('Kart eklenirken hata: ' + error.message);
    }
  };

  const handleDeleteCard = async (id: string) => {
    setCards(prev => prev.filter(c => c.id !== id));
    try {
      await supabase.from('memory_cards').delete().eq('id', id);
    } catch (err) {
      console.error('Anı silme hatası:', err);
    }
  };

  // ─── Tab & Modal ─────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<TabType>('timeline');
  const [showAddModal, setShowAddModal] = useState(false);

  const partnerName = currentUser
    ? (currentUser.username === 'eren' ? 'Özlem' : 'Eren')
    : '';

  const [pokeRotation, setPokeRotation] = useState<number>(0);
  const [showPokeCat, setShowPokeCat] = useState<boolean>(false);
  const pokeTimerRef = useRef<NodeJS.Timeout | null>(null);

  const DEFAULT_QUOTE = "Uğruna verdiğin emeğe değecek, seni asla pişman etmeyecek insan için çabala; sev, sevilmeyi bekle ve ne olursa olsun onu asla yalnız bırakma...";
  const [quote, setQuote] = useState<string>(() => {
    return localStorage.getItem('anihane_custom_quote') || DEFAULT_QUOTE;
  });
  const [showEditQuoteModal, setShowEditQuoteModal] = useState<boolean>(false);
  const [editedQuoteText, setEditedQuoteText] = useState<string>('');

  const handleSaveQuote = () => {
    if (editedQuoteText.trim()) {
      setQuote(editedQuoteText.trim());
      localStorage.setItem('anihane_custom_quote', editedQuoteText.trim());
    }
    setShowEditQuoteModal(false);
  };

  const triggerPoke = () => {
    confetti({ particleCount: 70, spread: 80, origin: { y: 0.15 }, colors: ['#f43f5e','#fb7185','#fda4af','#e11d48'] });
    setShowPokeCat(true);
    setPokeRotation(prev => (prev + 45));

    // Play angry cat sound!
    try {
      const audio = new Audio('/angry_cat.mp3');
      audio.volume = 0.5;
      audio.play().catch(err => console.log('Ses çalınamadı:', err));
    } catch (e) {
      console.error(e);
    }

    if (pokeTimerRef.current) {
      clearTimeout(pokeTimerRef.current);
    }

    pokeTimerRef.current = setTimeout(() => {
      setShowPokeCat(false);
    }, 2000);
  };

  const filteredCards = cards.filter(c => c.tab === activeTab);

  // ─── Login ────────────────────────────────────────────────────────
  if (!currentUser) return <LoginScreen onLogin={handleLogin} />;

  // ─── Tab tanımları ────────────────────────────────────────────────
  const tabs: { key: TabType; label: string; icon: React.ReactNode; color: string }[] = [
    { key: 'timeline',    label: 'Anı İpliğimiz',     icon: <Heart size={13} fill="#f43f5e" color="#f43f5e" />, color: '#f43f5e' },
    { key: 'letters',     label: 'Mektup Köşesi 💌',  icon: <Mail size={13} />,                             color: '#c0392b' },
    { key: 'flightradar', label: 'Özlem\'i İzle ✈️',    icon: <Plane size={13} />,                            color: '#0284c7' },
    { key: 'habitcat',    label: 'Alışkanlık Kedisi 🐾', icon: <Cat size={13} />,                               color: '#f59e0b' },
  ];

  const activeColor = tabs.find(t => t.key === activeTab)?.color || '#f43f5e';

  return (
    <div style={{ minHeight: '100vh', background: '#09090b', color: '#f4f4f5', fontFamily: 'var(--font-sans, system-ui, sans-serif)' }}>

      {/* ─── HEADER ─── */}
      <header style={{ position: 'sticky', top: 0, zIndex: 40, background: 'rgba(9,9,11,0.94)', backdropFilter: 'blur(16px)', borderBottom: '1px solid #27272a', padding: '8px 16px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, minHeight: 56, flexWrap: 'wrap' }}>

          {/* Logo & Profil Fotoğrafları */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: -6 }}>
              {/* Özlem Profil Fotoğrafı */}
              <div
                onClick={() => setSelectedProfileModal({ username: 'ozlem', name: 'Özlem' })}
                style={{ position: 'relative', cursor: 'pointer' }}
                title="Özlem'in profil resmi (Tıkla & Büyüt/Değiştir)"
              >
                <img
                  src={avatars.ozlem}
                  alt="Özlem"
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2px solid #a855f7',
                    boxShadow: '0 0 12px rgba(168, 85, 247, 0.4)',
                    transition: 'transform 0.2s',
                  }}
                />
                <span style={{ position: 'absolute', bottom: -2, right: -2, fontSize: '0.65rem' }}>💜</span>
              </div>

              {/* Eren Profil Fotoğrafı */}
              <div
                onClick={() => setSelectedProfileModal({ username: 'eren', name: 'Eren' })}
                style={{ position: 'relative', cursor: 'pointer', marginLeft: 4 }}
                title="Eren'in profil resmi (Tıkla & Büyüt/Değiştir)"
              >
                <img
                  src={avatars.eren}
                  alt="Eren"
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2px solid #3b82f6',
                    boxShadow: '0 0 12px rgba(59, 130, 246, 0.4)',
                    transition: 'transform 0.2s',
                  }}
                />
                <span style={{ position: 'absolute', bottom: -2, right: -2, fontSize: '0.65rem' }}>💙</span>
              </div>
            </div>

            <div onClick={() => setActiveTab('timeline')} style={{ cursor: 'pointer' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', lineHeight: 1, display: 'flex', alignItems: 'center', gap: 6 }}>
                AnıHane <SiriusStar size={20} />
              </div>
              <div style={{ fontSize: '0.68rem', color: '#38bdf8', fontWeight: 600, marginTop: 3, display: 'flex', alignItems: 'center', gap: 4 }}>
                Sirius 🌌 Eren ve Özlem'in Hikayesi
              </div>
            </div>
          </div>

          {/* Tab bar */}
          <nav className="no-scrollbar" style={{ display: 'flex', alignItems: 'center', background: '#18181b', padding: '4px', borderRadius: 9999, border: '1px solid #27272a', gap: 3, maxWidth: '100%', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  padding: '6px 12px', borderRadius: 9999, border: 'none',
                  background: activeTab === tab.key ? tab.color : 'transparent',
                  color: activeTab === tab.key ? '#fff' : '#a1a1aa',
                  fontSize: '0.75rem', fontWeight: activeTab === tab.key ? 700 : 500,
                  cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s',
                  boxShadow: activeTab === tab.key ? `0 3px 10px ${tab.color}55` : 'none',
                }}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </nav>

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {/* Dürt Butonu ve Dönen Kedi Görseli */}
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <button onClick={triggerPoke} style={headerActionBtn}>
                <Heart size={12} style={{ fill: '#f43f5e', color: '#f43f5e' }} />
                Dürt 💌
              </button>

              {showPokeCat && (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    triggerPoke();
                  }}
                  title="Kediyi Döndür! 🐾"
                  style={{
                    position: 'absolute',
                    top: 44,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    pointerEvents: 'auto',
                    cursor: 'pointer',
                    zIndex: 9999,
                    animation: 'fadeIn 0.2s ease',
                  }}
                >
                  <img
                    src="/poke_cat.png"
                    alt="Dürt Kedi"
                    style={{
                      width: 'min(150px, 22vw)',
                      height: 'min(150px, 22vw)',
                      objectFit: 'contain',
                      transform: `rotate(${pokeRotation}deg)`,
                      transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                      filter: 'drop-shadow(0 10px 24px rgba(0,0,0,0.9))',
                    }}
                  />

                  <div style={{
                    background: 'linear-gradient(135deg, #e11d48, #f43f5e)',
                    color: '#fff',
                    fontWeight: 800,
                    fontSize: '0.78rem',
                    padding: '3px 12px',
                    borderRadius: 9999,
                    boxShadow: '0 4px 16px rgba(244,63,94,0.6)',
                    whiteSpace: 'nowrap',
                    marginTop: 6,
                    border: '1px solid rgba(255,255,255,0.2)',
                  }}>
                    {pokeRotation % 360}° Miyav! 🐾
                  </div>
                </div>
              )}
            </div>

            <button onClick={() => setShowAddModal(true)} style={{ ...headerPrimaryBtn, background: activeColor, boxShadow: `0 4px 14px ${activeColor}55`, display: (activeTab === 'letters' || activeTab === 'flightradar') ? 'none' : 'inline-flex' }}>
              <Plus size={14} /> Yeni Anı
            </button>
            <button onClick={handleLogout} title="Çıkış" style={headerActionBtn}>
              <LogOut size={13} />
            </button>
          </div>
        </div>
      </header>

      {/* ─── MAIN ─── */}
      <main style={{ maxWidth: 1000, margin: '0 auto', padding: '24px 12px' }}>

        {/* ── ANI İPLİĞİMİZ ── */}
        {activeTab === 'timeline' && (
          <>
            <div style={{ marginBottom: 14 }}>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', marginBottom: 6 }}>🧵 Anı İpliğimiz</h1>
              <div
                onClick={() => {
                  setEditedQuoteText(quote);
                  setShowEditQuoteModal(true);
                }}
                title="Sözü değiştirmek için tıkla ✍️"
                style={{
                  fontSize: '0.88rem',
                  color: '#fda4af',
                  fontStyle: 'italic',
                  fontWeight: 600,
                  marginTop: 4,
                  marginBottom: 6,
                  lineHeight: 1.6,
                  background: 'linear-gradient(135deg, rgba(131,24,67,0.35), rgba(76,5,25,0.25))',
                  borderLeft: '3px solid #f43f5e',
                  padding: '10px 16px',
                  borderRadius: '0 10px 10px 0',
                  letterSpacing: '0.2px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 10,
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = 'linear-gradient(135deg, rgba(131,24,67,0.6), rgba(76,5,25,0.45))'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'linear-gradient(135deg, rgba(131,24,67,0.35), rgba(76,5,25,0.25))'; }}
              >
                <span>"{quote}"</span>
                <span style={{ fontSize: '0.72rem', color: '#fb7185', fontStyle: 'normal', fontWeight: 700, whiteSpace: 'nowrap', opacity: 0.85, background: 'rgba(244,63,94,0.15)', padding: '3px 8px', borderRadius: 6, border: '1px solid rgba(244,63,94,0.3)' }}>✍️ Tıkla &amp; Düzenle</span>
              </div>
            </div>
            <Clothesline cards={filteredCards} currentUser={currentUser} onOpenAdd={() => setShowAddModal(true)} onDelete={handleDeleteCard} emptyLabel="Henüz hiç anı yok — + kartına tıklayarak ilk anını ip'e as! 📌" />
            <DailySong currentUserName={currentUser.name} />
            <BucketList currentUserName={currentUser.name} />
          </>
        )}

        {/* ── MEKTUP KÖŞESİ ── */}
        {activeTab === 'letters' && (
          <LetterSection currentUserName={currentUser.name} />
        )}

        {/* ── FLIGHT RADAR 24 ── */}
        {activeTab === 'flightradar' && (
          <FlightRadarSection />
        )}

        {/* ── ALIŞKANLIK KEDİSİ ── */}
        {activeTab === 'habitcat' && (
          <HabitCatSection currentUserName={currentUser.name} />
        )}

      </main>

      {/* Footer */}
      <footer style={{ padding: '24px 20px', borderTop: '1px solid #18181b', textAlign: 'center', marginTop: 32 }}>
        <p style={{ color: '#ffffff', fontSize: '0.85rem', fontWeight: 600, margin: 0, opacity: 0.95, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          AnıHane <SiriusStar size={16} /> Sirius Yıldızı · Eren ve Özlem'in Hikayesi
        </p>
      </footer>

      {/* ─── MODALS ─── */}
      {showAddModal && activeTab !== 'letters' && activeTab !== 'flightradar' && activeTab !== 'habitcat' && (
        <AddCardModal tab='timeline' currentUser={currentUser} onClose={() => setShowAddModal(false)} onAdd={handleAddCard} />
      )}
      {showCat && <CatOverlay onClose={() => setShowCat(false)} />}

      {/* SÖZ DÜZENLEME MODALI */}
      {showEditQuoteModal && (
        <div onClick={() => setShowEditQuoteModal(false)} style={{ position: 'fixed', inset: 0, zIndex: 99999, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: 460, background: '#18181b', border: '1px solid #3f3f46', borderRadius: 22, padding: 24, boxShadow: '0 25px 60px rgba(0,0,0,0.9)', animation: 'scaleUp 0.2s ease' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
              ✍️ Günün Sözünü Düzenle
            </h3>
            <textarea
              value={editedQuoteText}
              onChange={e => setEditedQuoteText(e.target.value)}
              rows={4}
              placeholder="Yeni güzel sözünü buraya yaz..."
              style={{
                width: '100%',
                background: '#09090b',
                border: '1px solid #3f3f46',
                borderRadius: 12,
                padding: '12px 14px',
                color: '#fff',
                fontSize: '0.9rem',
                fontStyle: 'italic',
                lineHeight: 1.5,
                resize: 'vertical',
                outline: 'none',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
              }}
            />
            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              <button
                onClick={() => setShowEditQuoteModal(false)}
                style={{ flex: 1, padding: '11px', borderRadius: 12, background: '#27272a', border: 'none', color: '#fff', fontWeight: 700, cursor: 'pointer' }}
              >
                Vazgeç ✕
              </button>

              <button
                onClick={handleSaveQuote}
                style={{ flex: 1.2, padding: '11px', borderRadius: 12, background: 'linear-gradient(135deg, #e11d48, #f43f5e)', border: 'none', color: '#fff', fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 14px rgba(244,63,94,0.4)' }}
              >
                Kaydet 💾
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedProfileModal && (
        <ProfileModal
          username={selectedProfileModal.username}
          name={selectedProfileModal.name}
          currentAvatar={avatars[selectedProfileModal.username]}
          isOwner={true}
          onClose={() => setSelectedProfileModal(null)}
          onUpdateAvatar={handleUpdateAvatar}
        />
      )}

      <FlyingCatOverlay />
    </div>
  );
};

// ─── Header buton stilleri ──────────────────────────────────────
const headerActionBtn: React.CSSProperties = {
  padding: '7px 14px', borderRadius: 9999, border: '1px solid #27272a',
  background: '#18181b', color: '#fda4af', cursor: 'pointer',
  fontSize: '0.78rem', fontWeight: 700,
  display: 'inline-flex', alignItems: 'center', gap: 5,
};

const headerPrimaryBtn: React.CSSProperties = {
  padding: '7px 16px', borderRadius: 9999, border: 'none',
  background: '#f43f5e', color: '#fff', cursor: 'pointer',
  fontSize: '0.78rem', fontWeight: 700,
  display: 'inline-flex', alignItems: 'center', gap: 5,
};

export default App;
