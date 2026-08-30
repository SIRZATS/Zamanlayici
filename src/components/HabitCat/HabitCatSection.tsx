import React, { useState, useEffect, useRef } from 'react';
import { HabitItem, CatProfile, CatMood, HabitCategory } from './habitTypes';
import { CatVisual } from './CatVisual';
import { CatFocusTimer } from './CatFocusTimer';
import { CatActionType } from './PixelCatSprite';
import { getInactivityStage, INACTIVITY_STAGES, SLEEPING_ANNOYED_QUOTES } from './inactivityStages';
import {
  playCuteMeow,
  playHappyPurr,
  playEatingCrunch,
  playReviveMagicSound,
  playQuestCompleteSound,
  playDanceJingle,
  playSleepySnore,
  playHeartBeatSound,
  playHissAngry,
  playYawnStretch,
  playWaterSplashBubble,
} from './catAudio';
import {
  Plus,
  Check,
  Flame,
  Fish,
  Heart,
  Sparkles,
  Edit2,
  Trash2,
  Calendar,
  AlertCircle,
  HelpCircle,
  Moon,
  ChevronDown,
  ChevronUp,
  Cloud,
  CloudOff,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  fetchHabitsFromSupabase,
  saveHabitToSupabase,
  deleteHabitFromSupabase,
  fetchProfileFromSupabase,
  saveProfileToSupabase,
  subscribeToHabitCatChanges,
} from './habitCatSupabase';
import {
  IDLE_UNLOCK_MILESTONES,
  getLevelAndXpFromCompletedCount,
  IdleUnlockMilestone,
} from './idleMilestones';

interface HabitCatSectionProps {
  currentUserName: string;
}

const DEFAULT_HABITS: HabitItem[] = [
  {
    id: 'habit-1',
    title: 'Günde en az 2 litre su iç 💧',
    category: 'health',
    icon: '💧',
    color: '#0284c7',
    completedDates: [],
    createdAt: new Date().toISOString(),
    createdBy: 'Özlem',
  },
  {
    id: 'habit-2',
    title: 'Birbirimize sevgi dolu bir mesaj gönder 💌',
    category: 'love',
    icon: '💌',
    color: '#f43f5e',
    completedDates: [],
    createdAt: new Date().toISOString(),
    createdBy: 'Eren',
  },
  {
    id: 'habit-3',
    title: '15-20 dakika kitap oku 📖',
    category: 'mind',
    icon: '📖',
    color: '#a855f7',
    completedDates: [],
    createdAt: new Date().toISOString(),
    createdBy: 'Özlem',
  },
  {
    id: 'habit-4',
    title: 'Açık havada kısa bir yürüyüş yap 🌿',
    category: 'fitness',
    icon: '🚶‍♀️',
    color: '#10b981',
    completedDates: [],
    createdAt: new Date().toISOString(),
    createdBy: 'Eren',
  },
  {
    id: 'habit-5',
    title: 'Günün en güzel anını hatırla ve gülümse ✨',
    category: 'daily',
    icon: '✨',
    color: '#f59e0b',
    completedDates: [],
    createdAt: new Date().toISOString(),
    createdBy: 'Eren',
  },
];

const PRESET_IDEAS = [
  { title: 'Eğitim 🎓', icon: '🎓', category: 'education', color: '#3b82f6' },
  { title: 'Eğitim: 20 dk ders veya yeni konu çalış', icon: '🎓', category: 'education', color: '#2563eb' },
  { title: 'Sabah güne 1 bardak ılık su ile başla', icon: '☀️', category: 'health', color: '#f59e0b' },
  { title: 'Yatmadan önce ekranı bırak ve dinlen', icon: '🌙', category: 'daily', color: '#6366f1' },
  { title: 'Birbirimizin fotoğrafına kalpli not bırak', icon: '📸', category: 'love', color: '#ec4899' },
  { title: '10 dakika esneme & yoga yap', icon: '🧘‍♀️', category: 'fitness', color: '#10b981' },
  { title: 'Günün şarkısını dinle', icon: '🎵', category: 'mind', color: '#8b5cf6' },
];

function getDiffDays(dateStr1: string, dateStr2: string): number {
  try {
    const [y1, m1, d1] = dateStr1.split('-').map(Number);
    const [y2, m2, d2] = dateStr2.split('-').map(Number);
    const utc1 = Date.UTC(y1, m1 - 1, d1);
    const utc2 = Date.UTC(y2, m2 - 1, d2);
    return Math.round((utc2 - utc1) / (1000 * 60 * 60 * 24));
  } catch {
    return 0;
  }
}

function getTodayString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// 🐾 Eren için Mavi Kedi Patisi İkonu
export const BluePawIcon: React.FC<{ size?: number }> = ({ size = 15 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}
  >
    <ellipse cx="12" cy="15.8" rx="5.2" ry="4.2" fill="#3b82f6" />
    <circle cx="6.2" cy="10.2" r="2.2" fill="#60a5fa" />
    <circle cx="10" cy="6.2" r="2.2" fill="#60a5fa" />
    <circle cx="14" cy="6.2" r="2.2" fill="#60a5fa" />
    <circle cx="17.8" cy="10.2" r="2.2" fill="#60a5fa" />
  </svg>
);

// 🐱 Özlem için Sevimli Pembe Kedi İkonu
export const PinkCatIcon: React.FC<{ size?: number }> = ({ size = 15 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}
  >
    <polygon points="5,11 3,3 11,6" fill="#f472b6" stroke="#ec4899" strokeWidth="0.8" />
    <polygon points="19,11 21,3 13,6" fill="#f472b6" stroke="#ec4899" strokeWidth="0.8" />
    <polygon points="6,9 5,5 9,7" fill="#fce7f3" />
    <polygon points="18,9 19,5 15,7" fill="#fce7f3" />
    <circle cx="12" cy="13" r="7.4" fill="#f472b6" />
    <ellipse cx="9.4" cy="12.4" rx="1.1" ry="1.4" fill="#831843" />
    <ellipse cx="14.6" cy="12.4" rx="1.1" ry="1.4" fill="#831843" />
    <circle cx="9.1" cy="11.8" r="0.45" fill="#ffffff" />
    <circle cx="14.3" cy="11.8" r="0.45" fill="#ffffff" />
    <polygon points="12,14.6 11.2,13.8 12.8,13.8" fill="#be185d" />
    <path d="M10.8 15.6 Q12 16.5 13.2 15.6" stroke="#be185d" strokeWidth="0.8" strokeLinecap="round" fill="none" />
    <line x1="5.2" y1="13.2" x2="2.5" y2="12.6" stroke="#fbcfe8" strokeWidth="0.8" strokeLinecap="round" />
    <line x1="5.2" y1="14.8" x2="2.5" y2="15.2" stroke="#fbcfe8" strokeWidth="0.8" strokeLinecap="round" />
    <line x1="18.8" y1="13.2" x2="21.5" y2="12.6" stroke="#fbcfe8" strokeWidth="0.8" strokeLinecap="round" />
    <line x1="18.8" y1="14.8" x2="21.5" y2="15.2" stroke="#fbcfe8" strokeWidth="0.8" strokeLinecap="round" />
  </svg>
);

export const getCompletedIcon = (userName?: string, size = 15) => {
  const isOzlem = userName && (userName.toLowerCase().includes('özlem') || userName.toLowerCase().includes('ozlem'));
  return isOzlem ? <PinkCatIcon size={size} /> : <BluePawIcon size={size} />;
};

const CATEGORY_STYLES: Record<string, { bg: string; border: string; borderBottom: string; text: string; badgeBg: string; badgeBorder: string; badgeText: string; label: string; icon: string }> = {
  education: {
    bg: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
    border: '#60a5fa',
    borderBottom: '#3b82f6',
    text: '#1d4ed8',
    badgeBg: '#dbeafe',
    badgeBorder: '#bfdbfe',
    badgeText: '#2563eb',
    label: 'Eğitim',
    icon: '🎓',
  },
  health: {
    bg: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
    border: '#7dd3fc',
    borderBottom: '#38bdf8',
    text: '#0369a1',
    badgeBg: '#e0f2fe',
    badgeBorder: '#bae6fd',
    badgeText: '#0284c7',
    label: 'Sağlık',
    icon: '💧',
  },
  love: {
    bg: 'linear-gradient(135deg, #fff1f2 0%, #fce7f3 100%)',
    border: '#f472b6',
    borderBottom: '#ec4899',
    text: '#be185d',
    badgeBg: '#fce7f3',
    badgeBorder: '#fbcfe8',
    badgeText: '#db2777',
    label: 'Sevgi',
    icon: '💌',
  },
  mind: {
    bg: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)',
    border: '#c084fc',
    borderBottom: '#a855f7',
    text: '#6b21a8',
    badgeBg: '#f3e8ff',
    badgeBorder: '#e9d5ff',
    badgeText: '#9333ea',
    label: 'Zihin & Okuma',
    icon: '📖',
  },
  fitness: {
    bg: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
    border: '#86efac',
    borderBottom: '#4ade80',
    text: '#15803d',
    badgeBg: '#dcfce7',
    badgeBorder: '#bbf7d0',
    badgeText: '#16a34a',
    label: 'Hareket & Spor',
    icon: '🚶‍♀️',
  },
  daily: {
    bg: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
    border: '#fcd34d',
    borderBottom: '#f59e0b',
    text: '#b45309',
    badgeBg: '#fef3c7',
    badgeBorder: '#fde68a',
    badgeText: '#d97706',
    label: 'Günlük Rutin',
    icon: '☀️',
  },
};

const DEFAULT_CATEGORY_STYLE = CATEGORY_STYLES.daily;

const CATEGORY_TABS = [
  { key: 'all', label: 'Tüm Alışkanlıklar ✨', activeBg: 'linear-gradient(180deg, #fef3c7 0%, #fde68a 100%)', activeBorder: '#b45309', activeText: '#78350f', shadow: '#92400e' },
  { key: 'education', label: 'Eğitim 🎓', activeBg: 'linear-gradient(180deg, #dbeafe 0%, #bfdbfe 100%)', activeBorder: '#2563eb', activeText: '#1d4ed8', shadow: '#1e40af' },
  { key: 'health', label: 'Sağlık 💧', activeBg: 'linear-gradient(180deg, #e0f2fe 0%, #bae6fd 100%)', activeBorder: '#0284c7', activeText: '#0369a1', shadow: '#075985' },
  { key: 'love', label: 'Sevgi 💌', activeBg: 'linear-gradient(180deg, #fce7f3 0%, #fbcfe8 100%)', activeBorder: '#db2777', activeText: '#9d174d', shadow: '#831843' },
  { key: 'mind', label: 'Zihin & Okuma 📖', activeBg: 'linear-gradient(180deg, #f3e8ff 0%, #e9d5ff 100%)', activeBorder: '#9333ea', activeText: '#6b21a8', shadow: '#581c87' },
  { key: 'fitness', label: 'Hareket & Spor 🚶‍♀️', activeBg: 'linear-gradient(180deg, #dcfce7 0%, #bbf7d0 100%)', activeBorder: '#16a34a', activeText: '#15803d', shadow: '#166534' },
  { key: 'daily', label: 'Günlük Rutin ☀️', activeBg: 'linear-gradient(180deg, #ffedd5 0%, #fed7aa 100%)', activeBorder: '#ea580c', activeText: '#9a3412', shadow: '#7c2d12' },
];

const CELEBRATION_ANIMATIONS: { action: CatActionType; quote: string }[] = [
  { action: 'dance', quote: 'Görevi bitirdin miyav! Senin için zafer dansı yapıyorum mırrr 🪩🎉' },
  { action: 'excited', quote: 'Patilerim sevinçten havalara uçtu! Harikasın miyav 🐾✨' },
  { action: 'eating', quote: 'Ayy bana nefis bir tavuk geldi! Kıtır kıtır afiyetle yiyorum 🍗😋' },
  { action: 'surprised', quote: 'Vaaay! Bir görevi daha tamamladın, sana hayranım miyav! 😲🌸' },
  { action: 'box1', quote: 'Kutunun içinden sana alkış tutuyorum miyav, harikasın! 📦🎉' },
  { action: 'licking', quote: 'Görev bitti! Patilerimi özenle temizleyip kutluyorum mırrr 👅💖' },
  { action: 'box2', quote: 'Kutunun içine kıvrılıp senin başarına pati çakıyorum mırrr 📦✨' },
  { action: 'shy', quote: 'Böyle güzel görevler yapınca seninle gurur duyup utanıyorum miyav 🙈🥰' },
];

export const HabitCatSection: React.FC<HabitCatSectionProps> = ({ currentUserName }) => {
  const today = getTodayString();

  // ─── Kedicik Profili ───
  const [profile, setProfile] = useState<CatProfile>(() => {
    try {
      const saved = localStorage.getItem('habitcat_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          affection: parsed.affection ?? 85,
          energy: parsed.energy ?? 90,
          cleanliness: parsed.cleanliness ?? 70,
        };
      }
    } catch { /* empty */ }

    return {
      name: 'Pamuk Pisi',
      level: 1,
      xp: 25,
      hunger: 70,
      happiness: 75,
      affection: 85,
      energy: 90,
      cleanliness: 70,
      currentStreak: 1,
      bestStreak: 1,
      lastActiveDate: today,
      totalFishFed: 0,
      unlockedAccessories: ['flower_crown'],
    };
  });

  // ─── Alışkanlıklar ───
  const [habits, setHabits] = useState<HabitItem[]>(() => {
    try {
      const saved = localStorage.getItem('habitcat_habits');
      if (saved) return JSON.parse(saved);
    } catch { /* empty */ }
    return DEFAULT_HABITS;
  });

  // ─── Görsel Durumlar ───
  const [isSleeping, setIsSleeping] = useState(false);
  const [isFeeding, setIsFeeding] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditName, setShowEditName] = useState(false);
  const [nameInput, setNameInput] = useState(profile.name);
  const [showFocusTimer, setShowFocusTimer] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'all' | HabitCategory>('all');
  const [reviveBanner, setReviveBanner] = useState(false);
  const [externalAction, setExternalAction] = useState<{ action: CatActionType; quote?: string; duration?: number; key: number } | null>(null);
  const [consecutivePetCount, setConsecutivePetCount] = useState<number>(0);
  const [consecutiveFeedCount, setConsecutiveFeedCount] = useState<number>(0);
  const [consecutivePlayCount, setConsecutivePlayCount] = useState<number>(0);
  const bribePatienceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [simulatedInactiveDays, setSimulatedInactiveDays] = useState<number | null>(null);
  const [calendarHabitId, setCalendarHabitId] = useState<string | null>(null);
  const [unlockedMilestoneBanner, setUnlockedMilestoneBanner] = useState<IdleUnlockMilestone | null>(null);

  // ─── Tamamlanan Alışkanlık Sayısı ve Seviye / XP / Durma Animasyonu Hesaplama ───
  const totalCompletedHabits = habits.reduce(
    (acc, h) => acc + (h.completedDates ? h.completedDates.length : 0),
    0
  );

  const {
    level: habitLevel,
    xp: habitXp,
    unlockedMilestones,
    nextMilestone,
    habitsUntilNextMilestone,
  } = getLevelAndXpFromCompletedCount(totalCompletedHabits);

  // Seviye ve XP'yi alışkanlık tamamlanma sayısına göre senkronize tut
  useEffect(() => {
    setProfile(prev => {
      if (prev.level === habitLevel && prev.xp === habitXp) return prev;
      return {
        ...prev,
        level: habitLevel,
        xp: habitXp,
      };
    });
  }, [habitLevel, habitXp]);

  // 💤 1 Dakikalık Otomatik Uyanma Zamanlayıcısı
  const sleepTimerRef = useRef<NodeJS.Timeout | null>(null);

  const startSleepTimer = () => {
    if (sleepTimerRef.current) clearTimeout(sleepTimerRef.current);
    sleepTimerRef.current = setTimeout(() => {
      // 1 dakika doldu: Kedi kendiliğinden tatlı tatlı uyansın!
      setIsSleeping(false);
      playYawnStretch();
      setTimeout(() => playHappyPurr(), 400);
      setExternalAction({
        action: 'idle',
        quote: "Ooooh kocaman esnedim miyav! 🥱 Mışıl mışıl uyudum, enerjim depolandı mırrr 🌸✨",
        duration: 8000,
        key: Date.now(),
      });
      setProfile(prev => ({
        ...prev,
        energy: 100,
        happiness: Math.min(100, prev.happiness + 15),
      }));
    }, 60000); // 1 dakika (60.000 ms)
  };

  useEffect(() => {
    return () => {
      if (sleepTimerRef.current) clearTimeout(sleepTimerRef.current);
    };
  }, []);

  // 🐟 Rüşvet Sistemi (Eren'den çok sevilince rüşvet isteme ve Eren'e söyleme mantığı)
  const [showBribeButton, setShowBribeButton] = useState<boolean>(false);
  const [hasBribedThisSession, setHasBribedThisSession] = useState<boolean>(false);
  const [bribePetsRemaining, setBribePetsRemaining] = useState<number>(0);
  const [bribeCooldownSecs, setBribeCooldownSecs] = useState<number>(0);

  // 😾 Rüşvet Almadığında Kızma (Kullanıcı İsteği)
  const triggerBribeAnger = () => {
    setShowBribeButton(false);
    playHissAngry();
    setExternalAction({
      action: 'angry',
      quote: "Tısss! Hani nerede benim rüşvet tavuğum?! Rüşvetimi vermedin, Eren'e hemen yetiştiriyorum küstüm! 😾💢",
      duration: 8000,
      key: Date.now(),
    });
    setTimeout(() => setExternalAction(null), 8000);
  };

  // ⏳ Rüşvet butonu çıktıktan sonra 15 saniye içinde rüşvet verilmezse kedi otomatik kızar!
  useEffect(() => {
    if (showBribeButton) {
      if (bribePatienceTimerRef.current) clearTimeout(bribePatienceTimerRef.current);
      bribePatienceTimerRef.current = setTimeout(() => {
        triggerBribeAnger();
      }, 15000);
    }
    return () => {
      if (bribePatienceTimerRef.current) clearTimeout(bribePatienceTimerRef.current);
    };
  }, [showBribeButton]);

  // ⏳ Rüşvet Sonrası 1 Dakikalık Ceza/Bekleme Zamanlayıcısı
  useEffect(() => {
    if (bribeCooldownSecs <= 0) return;
    const timer = setInterval(() => {
      setBribeCooldownSecs(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          // 1 dakika bitti: Barışma ve affetme!
          setHasBribedThisSession(false);
          setConsecutivePetCount(0);
          setBribePetsRemaining(0);
          playCuteMeow();
          setExternalAction({
            action: 'idle',
            quote: "Öfkem geçti miyav... Eren'e de söylemedim zaten şaka yapmıştım! Şimdi beni tekrar sevebilirsin 🌸💖",
            duration: 8000,
            key: Date.now(),
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [bribeCooldownSecs]);

  // Gerçek veya simüle edilmiş girilmeme günü (Forest Mantığı)
  const actualInactiveDays = (() => {
    if (simulatedInactiveDays !== null) return simulatedInactiveDays;
    const lastDate = profile.lastActiveDate;
    if (!lastDate || lastDate === today) return 0;
    return Math.max(0, getDiffDays(lastDate, today));
  })();

  const currentStage = getInactivityStage(actualInactiveDays);

  // Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<HabitCategory>('health');
  const [newIcon, setNewIcon] = useState('🌟');
  const [newColor, setNewColor] = useState('#3b82f6');
  const [newCreatedBy, setNewCreatedBy] = useState<string>(currentUserName || 'Eren');

  // ─── Gün Kontrolü & Siteye Giriş Serisi (Gün bazlı Login Streak) ───
  useEffect(() => {
    const lastDate = profile.lastActiveDate;

    if (!lastDate) {
      setProfile(prev => ({
        ...prev,
        currentStreak: Math.max(1, prev.currentStreak || 1),
        bestStreak: Math.max(1, prev.bestStreak || 1),
        lastActiveDate: today,
      }));
      return;
    }

    if (lastDate !== today) {
      const diffDays = getDiffDays(lastDate, today);

      if (diffDays === 1) {
        // Dün girilmiş, bugün de girildi: Ardışık giriş serisi 1 arttı! 🔥
        const nextStreak = (profile.currentStreak || 0) + 1;
        setProfile(prev => ({
          ...prev,
          hunger: Math.max(25, prev.hunger - 20),
          happiness: Math.max(30, prev.happiness - 20),
          currentStreak: nextStreak,
          bestStreak: Math.max(prev.bestStreak || 0, nextStreak),
          lastActiveDate: today,
        }));
      } else if (diffDays >= 2) {
        // Araya gün girdi (örn. bir gün gelinmedi): Seri sıfırlanır, bugünkü girişle yeniden 1 olur!
        setProfile(prev => ({
          ...prev,
          hunger: Math.max(10, prev.hunger - 40),
          happiness: Math.max(10, prev.happiness - 45),
          currentStreak: 1,
          bestStreak: Math.max(prev.bestStreak || 1, 1),
          lastActiveDate: today,
        }));
      }
    }
  }, [today]);

  // ─── Supabase İlk Yükleme & Realtime Canlı Senkronizasyon ───
  const [supabaseConnected, setSupabaseConnected] = useState<boolean | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadFromSupabase() {
      try {
        const [remoteHabits, remoteProfile] = await Promise.all([
          fetchHabitsFromSupabase(),
          fetchProfileFromSupabase(today),
        ]);

        if (!isMounted) return;

        if (remoteHabits !== null) {
          setSupabaseConnected(true);
          if (remoteHabits.length > 0) {
            setHabits(remoteHabits);
          } else {
            // Supabase boşsa mevcut hazır görevleri Supabase'e ekle
            habits.forEach(h => saveHabitToSupabase(h));
          }
        } else {
          setSupabaseConnected(false);
        }

        if (remoteProfile !== null) {
          setSupabaseConnected(true);
          // Gün farkı kontrolü (günlerce girilmemişse sıfırlanma)
          const lastDate = remoteProfile.lastActiveDate;
          let updated = { ...remoteProfile };
          if (lastDate && lastDate !== today) {
            const diffDays = getDiffDays(lastDate, today);
            if (diffDays === 1) {
              // Dün girilmiş, bugün de girildi: Seri 1 gün artar
              const nextStreak = (remoteProfile.currentStreak || 0) + 1;
              updated = {
                ...updated,
                currentStreak: nextStreak,
                bestStreak: Math.max(remoteProfile.bestStreak || 0, nextStreak),
                lastActiveDate: today,
              };
            } else if (diffDays >= 2) {
              // Girilmedi: Seri sıfırlanır, bugünkü girişle 1 olur!
              updated = {
                ...updated,
                hunger: Math.max(10, remoteProfile.hunger - 40),
                happiness: Math.max(10, remoteProfile.happiness - 45),
                currentStreak: 1,
                lastActiveDate: today,
              };
            }
            saveProfileToSupabase(updated);
          }
          setProfile(updated);
        }
      } catch (err) {
        console.warn('Supabase yükleme uyarısı:', err);
        if (isMounted) setSupabaseConnected(false);
      }
    }

    loadFromSupabase();

    // Supabase Realtime aboneliği (Eren ↔ Özlem anlık canlı senkron)
    const unsubscribe = subscribeToHabitCatChanges(
      async () => {
        const freshHabits = await fetchHabitsFromSupabase();
        if (isMounted && freshHabits && freshHabits.length > 0) {
          setHabits(freshHabits);
        }
      },
      async () => {
        const freshProfile = await fetchProfileFromSupabase(today);
        if (isMounted && freshProfile) {
          setProfile(freshProfile);
        }
      }
    );

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [today]);

  // Profile ve Habits'i kaydet (localStorage & Supabase)
  useEffect(() => {
    localStorage.setItem('habitcat_profile', JSON.stringify(profile));
    saveProfileToSupabase(profile);
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('habitcat_habits', JSON.stringify(habits));
  }, [habits]);

  // ─── Forest Mantığı Kedi Modu Belirleme ───
  // Bugün kaç alışkanlık tamamlandı?
  const completedTodayCount = habits.filter(h => h.completedDates.includes(today)).length;
  const allHabitsDone = habits.length > 0 && completedTodayCount === habits.length;

  let currentMood: CatMood = 'healthy';
  if (profile.hunger < 25 || profile.happiness < 25) {
    currentMood = 'withered';
  } else if (profile.hunger < 45 || (completedTodayCount === 0 && habits.length > 0)) {
    currentMood = 'hungry';
  } else if (allHabitsDone || completedTodayCount >= 3 || profile.happiness >= 85) {
    currentMood = 'blooming';
  }

  // ─── Alışkanlığı Tamamla / Geri Al ───
  const handleToggleHabit = (habitId: string) => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;

    const isAlreadyCompleted = habit.completedDates.includes(today);

    if (!isAlreadyCompleted) {
      // ✅ TAMAMLANDI: Forest Canlanma & Besleme
      const wasWithered = currentMood === 'withered';

      const updatedHabit: HabitItem = {
        ...habit,
        completedDates: [...habit.completedDates, today],
        completedByDates: {
          ...(habit.completedByDates || {}),
          [today]: currentUserName || 'Eren',
        },
      };

      setHabits(prev =>
        prev.map(h => (h.id === habitId ? updatedHabit : h))
      );
      saveHabitToSupabase(updatedHabit);

      // Kediye tavuk ver & besle
      setIsFeeding(true);
      setTimeout(() => setIsFeeding(false), 1800);

      // Yeni toplam tamamlanan alışkanlık sayısı & 10'lu Seviye Barajı
      const prevTotal = totalCompletedHabits;
      const newTotal = prevTotal + 1;
      const prevMilestoneBar = Math.floor(prevTotal / 10);
      const newMilestoneBar = Math.floor(newTotal / 10);
      const isMilestoneReached = newMilestoneBar > prevMilestoneBar;

      const newLevel = 1 + newMilestoneBar;
      const newXp = (newTotal % 10) * 10;

      setProfile(prev => ({
        ...prev,
        level: newLevel,
        xp: newXp,
        hunger: Math.min(100, prev.hunger + 25),
        happiness: Math.min(100, prev.happiness + 20),
        totalFishFed: prev.totalFishFed + 1,
        lastActiveDate: today,
      }));

      if (isMilestoneReached) {
        // 🎉 HER 10 ALIŞKANLIKTA BİR YENİ ANİMASYON AÇILIR & BÜYÜK KONFETİ PATLATILIR!
        const newlyUnlocked = IDLE_UNLOCK_MILESTONES.find(m => m.habitsRequired === newMilestoneBar * 10);

        // Çift dalga coşkulu konfeti patlaması!
        confetti({
          particleCount: 140,
          spread: 100,
          origin: { y: 0.5 },
          colors: ['#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'],
        });
        setTimeout(() => {
          confetti({
            particleCount: 80,
            angle: 60,
            spread: 60,
            origin: { x: 0.05, y: 0.65 },
          });
          confetti({
            particleCount: 80,
            angle: 120,
            spread: 60,
            origin: { x: 0.95, y: 0.65 },
          });
        }, 300);

        playReviveMagicSound();
        playQuestCompleteSound();

        if (newlyUnlocked) {
          setUnlockedMilestoneBanner(newlyUnlocked);
          setTimeout(() => setUnlockedMilestoneBanner(null), 10000);

          // Kedi durduğu yerde kazandığı bu yeni hareketi hemen sergilesin!
          setExternalAction({
            action: newlyUnlocked.action,
            quote: newlyUnlocked.quote,
            duration: 8000,
            key: Date.now(),
          });
          setTimeout(() => {
            setExternalAction(null);
          }, 8000);
        }
      } else if (wasWithered) {
        // Kurumuş kedi şifalandı!
        playReviveMagicSound();
        setReviveBanner(true);
        setTimeout(() => setReviveBanner(false), 4500);
        setExternalAction({
          action: 'dance',
          quote: 'Yeniden canlandım miyav! Senin sevgin ve başardığın görev beni iyileştirdi 🌸✨',
          duration: 10000,
          key: Date.now(),
        });
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.55 },
          colors: ['#f472b6', '#38bdf8', '#fbbf24', '#34d399'],
        });
      } else {
        playQuestCompleteSound();
        const randomCeleb = CELEBRATION_ANIMATIONS[Math.floor(Math.random() * CELEBRATION_ANIMATIONS.length)];
        setExternalAction({
          action: randomCeleb.action,
          quote: randomCeleb.quote,
          duration: 5000,
          key: Date.now(),
        });
        setTimeout(() => {
          setExternalAction(null);
        }, 5000);
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.55 },
          colors: ['#f472b6', '#38bdf8', '#fbbf24', '#34d399'],
        });
      }
    } else {
      // Geri al: Herhangi bir kutlama veya dış aksiyonu derhal iptal et
      setExternalAction(null);
      const nextCompletedBy = { ...(habit.completedByDates || {}) };
      delete nextCompletedBy[today];
      const revertedHabit: HabitItem = {
        ...habit,
        completedDates: habit.completedDates.filter(d => d !== today),
        completedByDates: nextCompletedBy,
      };

      setHabits(prev =>
        prev.map(h => (h.id === habitId ? revertedHabit : h))
      );
      saveHabitToSupabase(revertedHabit);

      const revertedTotal = Math.max(0, totalCompletedHabits - 1);
      const revertedLevel = 1 + Math.floor(revertedTotal / 10);
      const revertedXp = (revertedTotal % 10) * 10;

      setProfile(prev => ({
        ...prev,
        level: revertedLevel,
        xp: revertedXp,
        hunger: Math.max(0, prev.hunger - 15),
        happiness: Math.max(0, prev.happiness - 15),
      }));
    }
  };

  // Yeni Alışkanlık Ekle
  const handleAddHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newHabit: HabitItem = {
      id: `habit-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      icon: newIcon || '🌟',
      color: newColor,
      completedDates: [],
      createdAt: new Date().toISOString(),
      createdBy: newCreatedBy || currentUserName || 'Eren',
    };

    setHabits(prev => [...prev, newHabit]);
    saveHabitToSupabase(newHabit);
    setNewTitle('');
    setShowAddModal(false);
  };

  // Alışkanlık Sil
  const handleDeleteHabit = (id: string) => {
    setHabits(prev => prev.filter(h => h.id !== id));
    deleteHabitFromSupabase(id);
  };

  // Alışkanlık İsmini Düzenle
  const handleEditHabitTitle = (id: string) => {
    const target = habits.find(h => h.id === id);
    if (!target) return;
    const updated = window.prompt('Alışkanlık ismini düzenle:', target.title);
    if (updated !== null && updated.trim()) {
      const updatedHabit: HabitItem = { ...target, title: updated.trim() };
      setHabits(prev =>
        prev.map(h => (h.id === id ? updatedHabit : h))
      );
      saveHabitToSupabase(updatedHabit);
    }
  };

  // Görevi Yazan Kişiyi Değiştir (Eren -> Özlem -> Eren & Özlem)
  const handleToggleHabitAuthor = (id: string) => {
    const target = habits.find(h => h.id === id);
    if (!target) return;
    const current = target.createdBy || 'Eren';
    let next = 'Eren';
    if (current === 'Eren') next = 'Özlem';
    else if (current === 'Özlem') next = 'Eren & Özlem';
    else next = 'Eren';
    const updatedHabit: HabitItem = { ...target, createdBy: next };
    setHabits(prev =>
      prev.map(h => (h.id === id ? updatedHabit : h))
    );
    saveHabitToSupabase(updatedHabit);
  };

  // Kedi İsmi Kaydet
  const handleSaveName = () => {
    if (nameInput.trim()) {
      setProfile(prev => ({ ...prev, name: nameInput.trim() }));
    }
    setShowEditName(false);
  };

  // 🍗 Kediye Rüşvet Ver (4 Sevgi Hakkı Kazan!)
  const handleGiveBribe = () => {
    if (bribePatienceTimerRef.current) clearTimeout(bribePatienceTimerRef.current);
    setShowBribeButton(false);
    setHasBribedThisSession(true);
    setBribePetsRemaining(4);
    setConsecutivePetCount(0);
    playEatingCrunch();
    setTimeout(() => playDanceJingle(), 300);
    confetti({
      particleCount: 45,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#fbbf24', '#fde68a', '#ec4899'],
    });
    setExternalAction({
      action: 'excited',
      quote: "Aferin! Rüşvetimi aldım miyav, Eren'e tek kelime etmeyeceğim aramızda büyük bir sır! 🤫🍗✨",
      duration: 8000,
      key: Date.now(),
    });
    setTimeout(() => setExternalAction(null), 8000);
    setProfile(prev => ({
      ...prev,
      totalFishFed: (prev.totalFishFed || 0) + 1,
      happiness: Math.min(100, prev.happiness + 15),
      hunger: Math.min(100, prev.hunger + 15),
    }));
  };

  // Kediye doğrudan sevgi / okşama ödülü
  const handleQuickPet = (e?: React.MouseEvent) => {
    // 😾 Forest Kuralı: 3+ gün girilmediyse sevmek kesinlikle yasak!
    if (currentStage.lockCareButtons) {
      if (e) {
        const rect = e.currentTarget.getBoundingClientRect();
        confetti({
          particleCount: 20,
          spread: 40,
          origin: { x: (rect.left + rect.width / 2) / window.innerWidth, y: rect.top / window.innerHeight },
          colors: ['#ef4444', '#f87171', '#991b1b'],
        });
      }
      playHissAngry();
      setExternalAction({
        action: 'refusing',
        quote: currentStage.refuseMessage,
        duration: 9000,
        key: Date.now(),
      });
      return;
    }

    // 💤 Kedi uyurken sevilmeye çalışılırsa sinirlenir!
    if (isSleeping) {
      if (e) {
        const rect = e.currentTarget.getBoundingClientRect();
        confetti({
          particleCount: 20,
          spread: 40,
          origin: { x: (rect.left + rect.width / 2) / window.innerWidth, y: rect.top / window.innerHeight },
          colors: ['#ef4444', '#f87171', '#7f1d1d'],
        });
      }
      playHissAngry();
      const randomAnnoyed =
        SLEEPING_ANNOYED_QUOTES[Math.floor(Math.random() * SLEEPING_ANNOYED_QUOTES.length)];
      setExternalAction({
        action: 'angry',
        quote: randomAnnoyed,
        duration: 7000,
        key: Date.now(),
      });
      return;
    }

    // 😾 1 Dakikalık Rüşvet Cezası devam ediyorsa:
    if (bribeCooldownSecs > 0) {
      if (e) {
        const rect = e.currentTarget.getBoundingClientRect();
        confetti({
          particleCount: 20,
          spread: 40,
          origin: { x: (rect.left + rect.width / 2) / window.innerWidth, y: rect.top / window.innerHeight },
          colors: ['#ef4444', '#f87171', '#991b1b'],
        });
      }
      playHissAngry();
      setExternalAction({
        action: 'refusing',
        quote: `Rüşvet verdiğini Eren'e söyleyeceğim miyav! Bir daha rüşvet yok, 1 dakika bekle! 😾📢 (${bribeCooldownSecs} sn)`,
        duration: 7000,
        key: Date.now(),
      });
      return;
    }

    // 🐟 Eğer rüşvetle kazanılmış sevgi hakları varsa:
    if (bribePetsRemaining > 0) {
      const remainingAfterThis = bribePetsRemaining - 1;
      setBribePetsRemaining(remainingAfterThis);

      if (remainingAfterThis === 0) {
        // 4. sevgi tamamlandı: ŞİMDİ ERENE SÖYLEYECEĞİM DE VE 1 DK KİLİTLE!
        if (e) {
          const rect = e.currentTarget.getBoundingClientRect();
          confetti({
            particleCount: 25,
            spread: 45,
            origin: { x: (rect.left + rect.width / 2) / window.innerWidth, y: rect.top / window.innerHeight },
            colors: ['#ef4444', '#f87171', '#b91c1c'],
          });
        }
        playHissAngry();
        setBribeCooldownSecs(60); // 1 dakika bekleme başlar!
        setShowBribeButton(false);
        setExternalAction({
          action: 'refusing',
          quote: "Rüşvet verdiğini Eren'e söyleyeceğim miyav! Bir daha rüşvet kabul etmiyorum, sevmek de bitti! 😾📢",
          duration: 9000,
          key: Date.now(),
        });
        return;
      }

      // Rüşvet sevgileri (kalan: 3, 2, 1):
      if (e) {
        const rect = e.currentTarget.getBoundingClientRect();
        confetti({
          particleCount: 25,
          spread: 50,
          origin: { x: (rect.left + rect.width / 2) / window.innerWidth, y: rect.top / window.innerHeight },
          colors: ['#ec4899', '#f59e0b', '#38bdf8'],
        });
      }
      playHeartBeatSound();
      setTimeout(() => playHappyPurr(), 100);

      const bribeLoveQuotes = [
        `Balık hatrına mırıldanıyorum miyav... (${remainingAfterThis} sevgi hakkın kaldı) 🤫🐟`,
        `Gıdıklanıyorum mırrr! Eren görmeden sev bari (${remainingAfterThis} sevgi hakkın kaldı) 🤫✨`,
        `Son sevgiler miyav, patilerim pamuk oldu (${remainingAfterThis} sevgi hakkın kaldı) 🌸🐾`,
      ];
      setExternalAction({
        action: 'licking',
        quote: bribeLoveQuotes[(4 - remainingAfterThis) % bribeLoveQuotes.length],
        duration: 8000,
        key: Date.now(),
      });

      setProfile(prev => ({
        ...prev,
        affection: Math.min(100, (prev.affection ?? 85) + 8),
        happiness: Math.min(100, prev.happiness + 5),
      }));
      return;
    }

    const nextPet = consecutivePetCount + 1;
    setConsecutivePetCount(nextPet);

    // 😹 8 KERE SEVİNCE GIDIKLANMA ANİMASYONU! (Kullanıcı İsteği)
    if (nextPet === 8) {
      if (e) {
        const rect = e.currentTarget.getBoundingClientRect();
        confetti({
          particleCount: 50,
          spread: 75,
          origin: { x: (rect.left + rect.width / 2) / window.innerWidth, y: rect.top / window.innerHeight },
          colors: ['#ec4899', '#f472b6', '#38bdf8', '#fbbf24'],
        });
      }
      playCuteMeow();
      setTimeout(() => playHappyPurr(), 300);
      setExternalAction({
        action: 'dance',
        quote: "İhihihi DUR YETER GIDIKLAMA MİYAV! 😂😻 Karnım aşırı gıdıklandı, patilerim birbirine dolandı mırrr! ✨",
        duration: 8000,
        key: Date.now(),
      });
      setTimeout(() => setExternalAction(null), 8000);
      return;
    }

    // 😾 8'den fazla sevilince Eren kıskançlığı ve rüşvet talebi:
    if (nextPet > 8) {
      if (e) {
        const rect = e.currentTarget.getBoundingClientRect();
        confetti({
          particleCount: 25,
          spread: 45,
          origin: { x: (rect.left + rect.width / 2) / window.innerWidth, y: rect.top / window.innerHeight },
          colors: ['#ef4444', '#f87171', '#b91c1c'],
        });
      }
      playHissAngry();
      setExternalAction({
        action: 'shy',
        quote: "Git beni Eren'den çok sevme, istemiyorum! Eren gibi utandım miyav 🙈💢",
        duration: 8000,
        key: Date.now(),
      });
      setTimeout(() => setExternalAction(null), 8000);

      // 🍗 Rüşvet butonu daha önce rüşvet verilmediyse çıksın!
      if (!hasBribedThisSession && bribeCooldownSecs <= 0) {
        setShowBribeButton(true);
      }
      return;
    }

    // 😸 4, 5, 6, 7. Sevmeler: Kıkırdama & Gıdıklanma Başlangıcı
    if (nextPet >= 4) {
      if (e) {
        const rect = e.currentTarget.getBoundingClientRect();
        confetti({
          particleCount: 30,
          spread: 55,
          origin: { x: (rect.left + rect.width / 2) / window.innerWidth, y: rect.top / window.innerHeight },
          colors: ['#ec4899', '#f472b6', '#fda4af', '#f43f5e'],
        });
      }
      playCuteMeow();
      const tickleQuotes = [
        "İhihi gıdıklanıyorum miyav! Patilerim pırpır ediyor mırrr 😻🌸",
        "Ayy yapma göbüşüm çok gıdıklanıyor ihihi 😹✨",
        "Patilerimle yüzümü kapattım, çok tatlı gıdıklandım miyav 🙈💕",
        "Dur birazcık, kıkırdamaktan miyavlayamıyorum mırrr! 😻💖",
      ];
      setExternalAction({
        action: 'licking',
        quote: tickleQuotes[(nextPet - 4) % tickleQuotes.length],
        duration: 7000,
        key: Date.now(),
      });
      setTimeout(() => setExternalAction(null), 7000);
      return;
    }

    // Normal Sevgi & Okşama (1, 2, 3. sevmeler)
    if (e) {
      const rect = e.currentTarget.getBoundingClientRect();
      confetti({
        particleCount: 30,
        spread: 55,
        origin: { x: (rect.left + rect.width / 2) / window.innerWidth, y: rect.top / window.innerHeight },
        colors: ['#ec4899', '#f472b6', '#fda4af', '#f43f5e'],
      });
    }
    playHeartBeatSound();
    setTimeout(() => playHappyPurr(), 100);

    const petQuotes = [
      "Mırrr... Başımı okşaman dünyadaki en tatlı şey 🌸💖",
      "Gıdıklanıyorum miyav, patilerim pamuk gibi oldu 🐾✨",
      "Mırıldanarak kucağına kıvrılıyorum pisi dostum 😻",
    ];
    setExternalAction({
      action: 'licking',
      quote: petQuotes[(nextPet - 1) % petQuotes.length],
      duration: 10000,
      key: Date.now(),
    });

    setProfile(prev => {
      const newXp = prev.xp + 4;
      const willLevelUp = newXp >= 100;
      return {
        ...prev,
        affection: Math.min(100, (prev.affection ?? 85) + 10),
        happiness: Math.min(100, prev.happiness + 6),
        xp: willLevelUp ? newXp % 100 : newXp,
        level: willLevelUp ? prev.level + 1 : prev.level,
      };
    });
  };

  // 🍗 Kediye doğrudan mama verme (Çok Doydum Animasyonu Desteği)
  const handleQuickFeed = (e?: React.MouseEvent) => {
    // 😾 Eğer kedi rüşvet beklerken mama verilirse: "Rüşvetimi vermedin" diye kızar!
    if (showBribeButton) {
      triggerBribeAnger();
      return;
    }

    const nextFeed = consecutiveFeedCount + 1;
    setConsecutiveFeedCount(nextFeed);

    // Kedi zaten %100 tok ise: Başını çevirip patisiyle iter (refusing)!
    if (profile.hunger >= 100) {
      playHissAngry();
      setExternalAction({
        action: 'refusing',
        quote: "Daha fazla yiyemem miyav! Göbüşüm patlayacak, bir lokma bile sığmaz! 🍗🙅",
        duration: 7000,
        key: Date.now(),
      });
      setTimeout(() => setExternalAction(null), 7000);
      return;
    }

    // 🍗 ÇOK YEMEK YEDİĞİNDE: Açlık >= 85 iken veya üst üste 2. beslemede "ÇOK DOYDUM" (laydown) animasyonu!
    if (profile.hunger >= 85 || nextFeed >= 2) {
      if (e) {
        const rect = e.currentTarget.getBoundingClientRect();
        confetti({
          particleCount: 35,
          spread: 60,
          origin: { x: (rect.left + rect.width / 2) / window.innerWidth, y: rect.top / window.innerHeight },
          colors: ['#f59e0b', '#fbbf24', '#34d399', '#fde68a'],
        });
      }
      playEatingCrunch();
      setIsFeeding(true);
      setTimeout(() => {
        setIsFeeding(false);
        playYawnStretch();
      }, 1500);

      setExternalAction({
        action: 'laydown',
        quote: "Offf göbüşüm davul gibi oldu miyav! Çok doydum, pufuduk göbüşümü kaldıramıyorum mırrr 🍗🤰💤",
        duration: 8000,
        key: Date.now(),
      });
      setTimeout(() => setExternalAction(null), 8000);

      setProfile(prev => ({
        ...prev,
        hunger: 100, // Tam tok
        happiness: Math.min(100, prev.happiness + 15),
        totalFishFed: (prev.totalFishFed || 0) + 1,
      }));
      return;
    }

    // Normal besleme
    if (e) {
      const rect = e.currentTarget.getBoundingClientRect();
      confetti({
        particleCount: 25,
        spread: 50,
        origin: { x: (rect.left + rect.width / 2) / window.innerWidth, y: rect.top / window.innerHeight },
        colors: ['#f59e0b', '#fbbf24', '#fde68a'],
      });
    }
    playEatingCrunch();
    setIsFeeding(true);
    setTimeout(() => setIsFeeding(false), 2500);
    setExternalAction({
      action: 'eating',
      quote: "Ham hum ham! Kıtır kıtır tavuk çok lezzetliymiş miyav, teşekkür ederim! 🍗😋",
      duration: 7000,
      key: Date.now(),
    });
    setTimeout(() => setExternalAction(null), 7000);
    setProfile(prev => {
      const newXp = prev.xp + 5;
      const willLevelUp = newXp >= 100;
      return {
        ...prev,
        hunger: Math.min(100, prev.hunger + 20),
        totalFishFed: (prev.totalFishFed || 0) + 1,
        xp: willLevelUp ? newXp % 100 : newXp,
        level: willLevelUp ? prev.level + 1 : prev.level,
      };
    });
  };

  // 🧼 Kediyi Yıkama / Banyo Yaptırma (Temizlik Göstergesi Dolsun)
  const handleQuickBath = (e?: React.MouseEvent) => {
    // 😾 Eğer kedi rüşvet beklerken banyo yaptırılmaya çalışılırsa kızar!
    if (showBribeButton) {
      triggerBribeAnger();
      return;
    }

    if (currentStage.lockCareButtons) {
      playHissAngry();
      setExternalAction({
        action: 'refusing',
        quote: "Şu an banyo yapmak istemiyorum, önce beni sevip gönlümü almalısın miyav! 😾💢",
        duration: 8000,
        key: Date.now(),
      });
      setTimeout(() => setExternalAction(null), 8000);
      return;
    }

    if (isSleeping) {
      playHissAngry();
      setExternalAction({
        action: 'angry',
        quote: "Uyurken üstüme su mu döküyorsun miyav?! Bırak uyuyayım şurada! 😾💤",
        duration: 7000,
        key: Date.now(),
      });
      setTimeout(() => setExternalAction(null), 7000);
      return;
    }

    if (e) {
      const rect = e.currentTarget.getBoundingClientRect();
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { x: (rect.left + rect.width / 2) / window.innerWidth, y: rect.top / window.innerHeight },
        colors: ['#38bdf8', '#bae6fd', '#e0f2fe', '#818cf8'],
      });
    }

    playWaterSplashBubble();

    const bathQuotes = [
      "Mırrr misler gibi koktum! Köpüklerle tertemiz oldum miyav, pisi prenses oldum 🛁👑✨",
      "Köpükten minik şapkam oldu bak! Tertemiz oldum miyav, mis gibi lavanta kokuyorum 🛁🌸",
      "Foşur foşur yıkandım mırrr! Tüm tozlarım gitti, tertemiz bir pisi oldum miyav! 🫧👑",
    ];
    const randomQuote = bathQuotes[Math.floor(Math.random() * bathQuotes.length)];

    setExternalAction({
      action: 'bathtub',
      quote: randomQuote,
      duration: 12000,
      key: Date.now(),
    });
    setTimeout(() => setExternalAction(null), 12000);

    setProfile(prev => {
      const newXp = prev.xp + 6;
      const willLevelUp = newXp >= 100;
      return {
        ...prev,
        cleanliness: 100, // Gösterge dolsun!
        happiness: Math.min(100, prev.happiness + 10),
        xp: willLevelUp ? newXp % 100 : newXp,
        level: willLevelUp ? prev.level + 1 : prev.level,
      };
    });
  };

  // 🧶 Kediyle oyun oynama (Kutuya Saklanma Reaksiyonu Desteği)
  const handleQuickPlay = (e?: React.MouseEvent) => {
    // 😾 Eğer kedi rüşvet beklerken oyun oynatılmaya çalışılırsa kızar!
    if (showBribeButton) {
      triggerBribeAnger();
      return;
    }

    // 😾 Forest Kuralı: 3+ gün girilmediyse oyun oynamaz, küs veya hasta!
    if (currentStage.lockCareButtons) {
      if (e) {
        const rect = e.currentTarget.getBoundingClientRect();
        confetti({
          particleCount: 20,
          spread: 40,
          origin: { x: (rect.left + rect.width / 2) / window.innerWidth, y: rect.top / window.innerHeight },
          colors: ['#ef4444', '#f87171', '#991b1b'],
        });
      }
      playHissAngry();
      setExternalAction({
        action: 'refusing',
        quote: currentStage.refuseMessage,
        duration: 9000,
        key: Date.now(),
      });
      setTimeout(() => setExternalAction(null), 9000);
      return;
    }

    const nextPlay = consecutivePlayCount + 1;
    setConsecutivePlayCount(nextPlay);

    // 📦 2. ve 3. OYUNDA KUTUYA SAKLANMA ANİMASYONU!
    if (nextPlay === 2) {
      playBoxRustle();
      setExternalAction({
        action: 'box1',
        quote: "Ce-ee! Kutumun içine saklandım, beni yakalayamazsın ki miyav! 📦👀",
        duration: 8000,
        key: Date.now(),
      });
      setTimeout(() => setExternalAction(null), 8000);
      return;
    } else if (nextPlay >= 3) {
      playBoxRustle();
      setExternalAction({
        action: 'box3',
        quote: "Kutunun içindeyim ama kuyruğum dışarıda sallanıyor miyav! 📦🐾",
        duration: 8000,
        key: Date.now(),
      });
      setTimeout(() => setExternalAction(null), 8000);
      return;
    }

    const currentEnergy = profile.energy ?? 90;

    // Eğer enerji çok düşükse (<= 25):
    if (currentEnergy <= 25) {
      playSleepySnore();
      setIsSleeping(true);
      startSleepTimer();
      setExternalAction({
        action: 'sleeping',
        quote: "Pofuduk patilerim çok yoruldu miyav... Gözlerim kapanıyor, 1 dakika uyuyacağım... 🥱💤",
        duration: 60000,
        key: Date.now(),
      });
      return;
    }

    if (e) {
      const rect = e.currentTarget.getBoundingClientRect();
      confetti({
        particleCount: 30,
        spread: 60,
        origin: { x: (rect.left + rect.width / 2) / window.innerWidth, y: rect.top / window.innerHeight },
        colors: ['#38bdf8', '#818cf8', '#ec4899', '#34d399'],
      });
    }
    playDanceJingle();

    const playQuotes = [
      "Yumakla oynamak harika miyav! Patiler havaya 🧶✨",
      "Zıplıyorum, yakalıyorum! Ne kadar oyuncuyum mırrr 🪩🐾",
      "Yaşasın oyun saati! Çok eğleniyorum miyav 🌸",
    ];
    setExternalAction({
      action: 'dance',
      quote: playQuotes[Math.floor(Math.random() * playQuotes.length)],
      duration: 8000,
      key: Date.now(),
    });
    setTimeout(() => setExternalAction(null), 8000);

    setProfile(prev => {
      const newEnergy = Math.max(0, (prev.energy ?? 90) - 25);
      const newXp = prev.xp + 5;
      const willLevelUp = newXp >= 100;

      // Eğer bu oyunla enerjisi tükendiyse 2.5 sn sonra uykuya geçsin!
      if (newEnergy <= 20) {
        setIsSleeping(true);
        startSleepTimer();
        setTimeout(() => {
          setExternalAction({
            action: 'sleeping',
            quote: "Pofuduk patilerim çok yoruldu miyav... Gözlerim kapanıyor, 1 dakika uyuyacağım... 🥱💤",
            duration: 60000,
            key: Date.now(),
          });
        }, 2500);
      }

      return {
        ...prev,
        happiness: Math.min(100, prev.happiness + 12),
        energy: newEnergy,
        xp: willLevelUp ? newXp % 100 : newXp,
        level: willLevelUp ? prev.level + 1 : prev.level,
      };
    });
  };

  // Kediyi dinlendirme / uyutma veya zorla uyandırma
  const handleQuickRest = () => {
    // 😾 Eğer kedi rüşvet beklerken uyutulmaya/uyandırılmaya çalışılırsa kızar!
    if (showBribeButton) {
      triggerBribeAnger();
      return;
    }

    if (isSleeping) {
      // 😾 Kedi uyurken ZORLA UYANDIRILDI:
      // Kullanıcı isteği: "uyandır butonu tam çalışmıyor eğer kişi ona tıklarsa kedinin mutluluk sevinci düşsün"
      if (sleepTimerRef.current) clearTimeout(sleepTimerRef.current);
      setIsSleeping(false);
      playHissAngry();

      const wakeAngryQuotes = [
        "Neden beni zorla uyandırdın miyav? Çok tatlı uyuyordum, modum düştü... 😾💤",
        "Daha 1 dakikam bile dolmamıştı mırrr! Uykumu böldüğün için kalbim kırıldı 😾💔",
        "Offf başım sersem gibi oldu miyav... Bıraksaydın da kendim uyansaydım! 🥱💢",
        "Uykumu alamadım miyav, patilerim uyuşuk kaldı... Çok kızgınım! 😾⚡",
      ];
      const randomQuote = wakeAngryQuotes[Math.floor(Math.random() * wakeAngryQuotes.length)];

      setExternalAction({
        action: 'angry',
        quote: randomQuote,
        duration: 8000,
        key: Date.now(),
      });

      setProfile(prev => ({
        ...prev,
        happiness: Math.max(10, prev.happiness - 20),
        affection: Math.max(10, (prev.affection ?? 85) - 10),
      }));
      return;
    }

    // 😴 Normal Uykuya Yatırma:
    playSleepySnore();
    setConsecutivePetCount(0); // Dinlenince sevgi sayacı sıfırlansın
    setIsSleeping(true);
    startSleepTimer();

    setExternalAction({
      action: 'sleeping',
      quote: "Mışıl mışıl uyuyorum... 1 dakika sonra kendiliğimden dinç uyanacağım miyav 💤⭐",
      duration: 60000,
      key: Date.now(),
    });

    setProfile(prev => ({
      ...prev,
      energy: Math.min(100, (prev.energy ?? 90) + 15),
    }));
  };

  const handleDirectPet = () => {
    handleQuickPet();
  };

  const filteredHabits = selectedCategory === 'all'
    ? habits
    : habits.filter(h => h.category === selectedCategory);

  return (
    <div style={{ maxWidth: 1050, margin: '0 auto', padding: '16px 12px 60px' }}>

      {/* ─── YENİDEN CANLANMA BANNER'I (FOREST ŞİFASI) ─── */}
      {reviveBanner && (
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(244,114,182,0.9), rgba(168,85,247,0.9))',
            color: '#fff',
            padding: '12px 20px',
            borderRadius: 16,
            marginBottom: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 10px 30px rgba(244,114,182,0.4)',
            animation: 'speechBounce 0.4s ease',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: '1.4rem' }}>✨🌸</span>
            <div>
              <p style={{ margin: 0, fontWeight: 800, fontSize: '0.92rem' }}>
                Kedicik Canlandı & Çiçek Açtı!
              </p>
              <p style={{ margin: 0, fontSize: '0.75rem', opacity: 0.9 }}>
                Alışkanlığını tamamlayarak onu mutlu ettin, tüyleri yeniden parıldıyor!
              </p>
            </div>
          </div>
          <button
            onClick={() => setReviveBanner(false)}
            style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', fontWeight: 800 }}
          >
            ✕
          </button>
        </div>
      )}

      {/* ─── YENİ ANİMASYON KİLİDİ AÇILDI KUTLAMA BANNER'I ─── */}
      {unlockedMilestoneBanner && (
        <div
          style={{
            position: 'fixed',
            top: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10001,
            background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)',
            border: '2px solid #a855f7',
            borderRadius: 20,
            padding: '16px 24px',
            boxShadow: '0 20px 50px rgba(168,85,247,0.45), 0 0 30px rgba(236,72,153,0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            maxWidth: 540,
            width: '90%',
            animation: 'bounce 0.5s ease',
          }}
        >
          <div style={{ fontSize: '2.5rem', lineHeight: 1 }}>{unlockedMilestoneBanner.emoji}</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 900, background: '#a855f7', color: '#fff', padding: '2px 8px', borderRadius: 999 }}>
                Lv. {unlockedMilestoneBanner.level} KAZANILDI! 🎉
              </span>
              <span style={{ fontSize: '0.75rem', color: '#c7d2fe', fontWeight: 700 }}>
                {unlockedMilestoneBanner.habitsRequired} Alışkanlık Başarısı!
              </span>
            </div>
            <h4 style={{ margin: '4px 0 2px', color: '#fff', fontSize: '1.05rem', fontWeight: 900 }}>
              Durduğu Yerde Yeni Animasyon: {unlockedMilestoneBanner.name} ✨
            </h4>
            <p style={{ margin: 0, color: '#e0e7ff', fontSize: '0.8rem', fontStyle: 'italic' }}>
              &ldquo;{unlockedMilestoneBanner.quote}&rdquo;
            </p>
          </div>
          <button
            onClick={() => setUnlockedMilestoneBanner(null)}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              borderRadius: 8,
              color: '#c7d2fe',
              cursor: 'pointer',
              padding: '6px 10px',
              fontSize: '0.9rem',
            }}
          >
            ✕
          </button>
        </div>
      )}

      {/* ─── ÜST BAŞLIK VE KONTROL PANELİ ─── */}
      <div
        className="habit-header-panel"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
          marginBottom: 20,
          background: 'linear-gradient(180deg, rgba(24,24,27,0.8) 0%, rgba(9,9,11,0.6) 100%)',
          padding: '16px 20px',
          borderRadius: 20,
          border: '1px solid #27272a',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              background: 'linear-gradient(135deg, #f59e0b, #ec4899)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(245,158,11,0.3)',
              fontSize: '1.5rem',
            }}
          >
            🐾
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>
                Alışkanlık Kedisi
              </h1>
              {/* İsim Düzenle */}
              <button
                onClick={() => setShowEditName(true)}
                title="Kedicik ismini değiştir"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: 'none',
                  color: '#a1a1aa',
                  padding: '3px 8px',
                  borderRadius: 8,
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <span>{profile.name}</span>
                <Edit2 size={11} />
              </button>
            </div>
            <p style={{ margin: '2px 0 0', fontSize: '0.74rem', color: '#a1a1aa' }}>
              Alışkanlık yaptıkça çiçek açar, ihmal edilirse acıkıp solar ✨
            </p>
          </div>
        </div>

        {/* İstatistik Rozetleri */}
        <div className="habit-stats-badges" style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          {/* Seri Rozeti */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: 'rgba(249,115,22,0.12)',
              border: '1px solid rgba(249,115,22,0.3)',
              padding: '6px 12px',
              borderRadius: 9999,
            }}
          >
            <Flame size={15} color="#f97316" />
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#fb923c' }}>
              {profile.currentStreak} Gün Seri
            </span>
          </div>

          {/* Seviye & XP */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: 'rgba(56,189,248,0.12)',
              border: '1px solid rgba(56,189,248,0.3)',
              padding: '6px 12px',
              borderRadius: 9999,
              cursor: 'pointer',
            }}
            title={
              nextMilestone
                ? `Sonraki yeni durma animasyonuna (${nextMilestone.name}) ${habitsUntilNextMilestone} alışkanlık kaldı! Toplam tamamlanan: ${totalCompletedHabits}`
                : `Tüm durma animasyonları açıldı! Toplam tamamlanan: ${totalCompletedHabits}`
            }
          >
            <Sparkles size={14} color="#38bdf8" />
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#38bdf8' }}>
              Lv. {profile.level} ({profile.xp}% XP)
            </span>
          </div>

          {/* Supabase Bulut Senkronizasyon Rozeti */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              background:
                supabaseConnected === true
                  ? 'rgba(16,185,129,0.12)'
                  : supabaseConnected === false
                  ? 'rgba(245,158,11,0.12)'
                  : 'rgba(255,255,255,0.05)',
              border: `1px solid ${
                supabaseConnected === true
                  ? 'rgba(16,185,129,0.3)'
                  : supabaseConnected === false
                  ? 'rgba(245,158,11,0.3)'
                  : 'rgba(255,255,255,0.1)'
              }`,
              padding: '6px 11px',
              borderRadius: 9999,
            }}
            title={
              supabaseConnected === true
                ? 'Supabase veritabanına bağlı! Alışkanlıklar ve seri bulutta güvenle saklanıyor.'
                : 'Yerel mod aktif (localStorage). Supabase SQL tablosu hazır olduğunda anında canlı buluta bağlanır.'
            }
          >
            {supabaseConnected === true ? (
              <Cloud size={14} color="#10b981" />
            ) : (
              <CloudOff size={14} color="#f59e0b" />
            )}
            <span
              style={{
                fontSize: '0.74rem',
                fontWeight: 800,
                color:
                  supabaseConnected === true
                    ? '#34d399'
                    : supabaseConnected === false
                    ? '#fbbf24'
                    : '#a1a1aa',
              }}
            >
              {supabaseConnected === true
                ? 'Bulut Canlı'
                : supabaseConnected === false
                ? 'Yerel Depolama'
                : 'Bağlanıyor...'}
            </span>
          </div>

          {/* Forest Modu Aç/Kapat Butonu */}
          <button
            onClick={() => setShowFocusTimer(!showFocusTimer)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: showFocusTimer ? 'rgba(99,102,241,0.25)' : '#18181b',
              border: showFocusTimer ? '1px solid #818cf8' : '1px solid #27272a',
              color: showFocusTimer ? '#c7d2fe' : '#a1a1aa',
              padding: '6px 12px',
              borderRadius: 9999,
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            <Moon size={14} color="#818cf8" />
            <span>Kediyle Odaklan</span>
            {showFocusTimer ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>
        </div>
      </div>

      {/* ─── KEDİ SAHNESİ VE DURUM METRİKLERİ ─── */}
      <div
        className="habit-hero-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
          gap: 20,
          marginBottom: 28,
          width: '100%',
          maxWidth: '100%',
        }}
      >
        {/* Kedi Görsel Modellemesi */}
        <div style={{ position: 'relative' }}>
          <CatVisual
            mood={currentMood}
            level={profile.level}
            catName={profile.name}
            isSleeping={isSleeping}
            isFeeding={isFeeding}
            externalAction={externalAction}
            inactiveDays={actualInactiveDays}
            showBribeButton={showBribeButton}
            onBribe={handleGiveBribe}
            onBath={handleQuickBath}
            onPet={handleDirectPet}
            totalCompletedHabits={totalCompletedHabits}
          />

          {/* 🐾 Kedi Ziyareti Durumu & Gün Göstergesi (Ziyaret edilmedikçe altta açık ve belirgin) */}
          <div
            style={{
              marginTop: 10,
              background: actualInactiveDays > 0 
                ? 'linear-gradient(180deg, #2b1d24 0%, #1c1419 100%)'
                : 'linear-gradient(180deg, #27202b 0%, #1c1822 100%)',
              border: `1.5px solid ${currentStage.badgeColor}50`,
              borderRadius: 16,
              padding: '10px 14px',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              boxShadow: actualInactiveDays > 0
                ? `0 4px 20px ${currentStage.badgeColor}25`
                : '0 4px 16px rgba(0,0,0,0.35)',
            }}
          >
            {/* Üst Satır: Kedi Ziyareti Başlığı, Rozet ve Gün Uyarısı */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.76rem', fontWeight: 800, color: '#fef08a' }}>
                  🐾 Kedi Ziyareti:
                </span>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 900,
                    color: currentStage.badgeColor,
                    background: `${currentStage.badgeColor}22`,
                    border: `1px solid ${currentStage.badgeColor}60`,
                    padding: '3px 8px',
                    borderRadius: 9999,
                  }}
                >
                  {currentStage.badge}
                </span>
                {currentStage.lockCareButtons && (
                  <span style={{ fontSize: '0.7rem', color: '#f87171', fontWeight: 800, background: 'rgba(239,68,68,0.15)', padding: '2px 7px', borderRadius: 6, border: '1px solid rgba(239,68,68,0.3)' }}>
                    🔒 Sevmek Yasak
                  </span>
                )}
              </div>

              {actualInactiveDays > 0 && (
                <div style={{ fontSize: '0.72rem', color: '#f87171', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span>⚠️ {actualInactiveDays} Gündür Yoksun!</span>
                </div>
              )}
            </div>

            {/* Ziyaret edilmedikçe altta açık olan kedi sitemi & replik alanı */}
            {actualInactiveDays > 0 && (
              <div
                style={{
                  background: 'rgba(0, 0, 0, 0.45)',
                  border: `1px solid ${currentStage.badgeColor}40`,
                  borderRadius: 10,
                  padding: '8px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: '0.76rem',
                  color: '#fef08a',
                }}
              >
                <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>😿</span>
                <div style={{ flex: 1, lineHeight: 1.35, fontWeight: 700 }}>
                  "{currentStage.quote}"
                </div>
              </div>
            )}

            {/* Gün Seçici / Test Butonları */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap', paddingTop: 2, borderTop: '1px solid rgba(255, 255, 255, 0.07)' }}>
              <span style={{ fontSize: '0.67rem', color: '#a1a1aa', marginRight: 2, fontWeight: 700 }}>
                Ziyaret Testi:
              </span>
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(day => {
                const isSelected = actualInactiveDays === day;
                return (
                  <button
                    key={day}
                    onClick={() => {
                      setSimulatedInactiveDays(day);
                      const st = INACTIVITY_STAGES[day];
                      if (st && st.day > 0) {
                        setExternalAction({
                          action: st.action,
                          quote: st.quote,
                          duration: 10000,
                          key: Date.now(),
                        });
                      } else {
                        setExternalAction(null);
                      }
                    }}
                    style={{
                      background: isSelected ? '#f59e0b' : 'rgba(255, 255, 255, 0.08)',
                      color: isSelected ? '#451a03' : '#cbd5e1',
                      border: isSelected ? '1.5px solid #fbbf24' : '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: 6,
                      padding: '3px 6px',
                      fontSize: '0.66rem',
                      fontWeight: 900,
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                    title={`${day} Gün: ${INACTIVITY_STAGES[day]?.name}`}
                  >
                    {day === 0 ? 'Bugün' : `${day}G`}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sağ Panel: Kedi İhtiyaçları & Forest Durum Kartı (CatUI & BONUSPastelUI Stili) */}
        <div
          className="cat-vitality-card"
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: 14,
            background: 'linear-gradient(180deg, rgba(26, 24, 34, 0.95) 0%, rgba(18, 17, 24, 0.98) 100%)',
            borderRadius: 24,
            padding: '24px 22px 20px',
            border: '2px solid rgba(244, 114, 182, 0.3)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.1)',
            width: '100%',
            maxWidth: '100%',
            boxSizing: 'border-box',
            overflow: 'hidden',
          }}
        >
          {/* Üst kenarda mışıl mışıl uyuyan sevimli kedi (CatUI ui_sleeping_cat_edge) */}
          <div
            style={{
              position: 'absolute',
              top: -19,
              right: 28,
              zIndex: 10,
              pointerEvents: 'none',
            }}
            title="Mışıl mışıl uyuyan pisi 🐾"
          >
            <img
              src="/assets/cat_pixel/ui/ui_sleeping_cat_edge.png"
              alt="Sleeping Cat"
              style={{
                width: 60,
                height: 24,
                imageRendering: 'pixelated',
                filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.6))',
              }}
            />
          </div>

          <div>
            {/* Panel Başlığı & Kedi Canlılık Rozeti */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <span
                style={{
                  fontSize: '0.9rem',
                  fontWeight: 900,
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  letterSpacing: '0.02em',
                }}
              >
                <img
                  src="/assets/cat_pixel/ui/ui_paw_circle.png"
                  alt="Paw"
                  style={{ width: 22, height: 22, imageRendering: 'pixelated' }}
                />
                Kedi Canlılık Durumu
              </span>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  padding: '4px 10px',
                  borderRadius: 8,
                  background:
                    currentMood === 'blooming'
                      ? 'rgba(244,114,182,0.2)'
                      : currentMood === 'withered'
                      ? 'rgba(113,113,122,0.25)'
                      : 'rgba(56,189,248,0.2)',
                  color:
                    currentMood === 'blooming'
                      ? '#f472b6'
                      : currentMood === 'withered'
                      ? '#d4d4d8'
                      : '#38bdf8',
                  border: `2px solid ${
                    currentMood === 'blooming'
                      ? '#f472b6'
                      : currentMood === 'withered'
                      ? '#71717a'
                      : '#38bdf8'
                  }`,
                  boxShadow: '0 2px 0 rgba(0,0,0,0.3)',
                }}
              >
                {currentMood === 'blooming' && '🌸 Çiçek Açtı'}
                {currentMood === 'healthy' && '🌿 Canlı & Neşeli'}
                {currentMood === 'hungry' && '🍂 Acıktı (Mama Bekliyor)'}
                {currentMood === 'withered' && '🥀 Solgun (İlgi Bekliyor)'}
              </span>
            </div>

            {/* ─── KEDİ CANLILIK DURUMU HUD (CAT THEME USER INTERFACE) ─── */}
            <div
              className="cat-vitality-hud"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                background: 'linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%)',
                border: '3px solid #78350f',
                borderRadius: 20,
                padding: '16px 16px 14px',
                boxShadow: '0 6px 0 #451a03, 0 12px 24px rgba(0,0,0,0.5)',
                position: 'relative',
                width: '100%',
                maxWidth: '100%',
                boxSizing: 'border-box',
                minWidth: 0,
                overflow: 'hidden',
              }}
            >
              {/* Üst Kısım: Avatar & 4 Canlılık Çubuğu */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', minWidth: 0 }}>
                {/* Sol: Kedi Kulaklı Avatar Çerçevesi */}
                <div
                  onClick={() => setShowEditName(true)}
                  style={{
                    position: 'relative',
                    width: 78,
                    minHeight: 88,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#ffedd5',
                    border: '2px solid #78350f',
                    borderRadius: 12,
                    boxShadow: '0 3px 0 #9a3412, inset 0 2px 0 #fff',
                    cursor: 'pointer',
                    flexShrink: 0,
                    transition: 'transform 0.15s ease',
                    padding: '8px 4px 6px',
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                  title="Kedi ismini değiştirmek için tıkla 🐾"
                >
                  {/* Sol Kedi Kulağı */}
                  <div
                    style={{
                      position: 'absolute',
                      top: -9,
                      left: 10,
                      width: 0,
                      height: 0,
                      borderLeft: '7px solid transparent',
                      borderRight: '7px solid transparent',
                      borderBottom: '9px solid #78350f',
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        top: 2,
                        left: -5,
                        width: 0,
                        height: 0,
                        borderLeft: '5px solid transparent',
                        borderRight: '5px solid transparent',
                        borderBottom: '7px solid #fed7aa',
                      }}
                    />
                  </div>

                  {/* Sağ Kedi Kulağı */}
                  <div
                    style={{
                      position: 'absolute',
                      top: -9,
                      right: 10,
                      width: 0,
                      height: 0,
                      borderLeft: '7px solid transparent',
                      borderRight: '7px solid transparent',
                      borderBottom: '9px solid #78350f',
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        top: 2,
                        left: -5,
                        width: 0,
                        height: 0,
                        borderLeft: '5px solid transparent',
                        borderRight: '5px solid transparent',
                        borderBottom: '7px solid #fed7aa',
                      }}
                    />
                  </div>

                  {/* Kedi Yüzü */}
                  <img
                    src="/assets/cat_pixel/ui/ui_cat_face_icon.png"
                    alt="Cat Face"
                    style={{
                      width: 36,
                      height: 36,
                      imageRendering: 'pixelated',
                      marginBottom: 2,
                      filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.15))',
                    }}
                  />

                  {/* Kedi İsmi */}
                  <span
                    style={{
                      fontSize: '0.65rem',
                      fontWeight: 900,
                      color: '#78350f',
                      textAlign: 'center',
                      lineHeight: 1.1,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: 68,
                    }}
                  >
                    {profile.name || 'Pisi'} ✎
                  </span>

                  {/* Seviye Rozeti */}
                  <span
                    style={{
                      marginTop: 3,
                      background: '#f59e0b',
                      color: '#78350f',
                      border: '1px solid #b45309',
                      borderRadius: 4,
                      fontSize: '0.55rem',
                      fontWeight: 900,
                      padding: '0 4px',
                    }}
                  >
                    Lv.{profile.level}
                  </span>
                </div>

                {/* Sağ: İlerleme Çubukları (4 Canlılık Çubuğu) */}
                <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {/* 1. Tokluk Barı (Kırmızı / HP) */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.68rem', fontWeight: 800, marginBottom: 2 }}>
                      <span style={{ color: '#991b1b', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <span>🐟</span> Tokluk Derecesi
                      </span>
                      <span style={{ color: '#b91c1c', fontWeight: 900, fontSize: '0.72rem' }}>%{profile.hunger}</span>
                    </div>
                    <div
                      style={{
                        position: 'relative',
                        width: '100%',
                        height: 12,
                        background: '#450a0a',
                        border: '1.5px solid #7f1d1d',
                        borderRadius: 4,
                        padding: 1,
                        boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.8), 0 1px 0 rgba(255,255,255,0.6)',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: `${profile.hunger}%`,
                          height: '100%',
                          background: 'linear-gradient(180deg, #ef4444 0%, #b91c1c 100%)',
                          borderRadius: 2,
                          transition: 'width 0.4s ease',
                          boxShadow: '0 0 5px rgba(239, 68, 68, 0.7)',
                        }}
                      />
                    </div>
                  </div>

                  {/* 2. Mutluluk Barı (Cam Göbeği / MP) */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.68rem', fontWeight: 800, marginBottom: 2 }}>
                      <span style={{ color: '#0e7490', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <span>✨</span> Mutluluk Seviyesi
                      </span>
                      <span style={{ color: '#0891b2', fontWeight: 900, fontSize: '0.72rem' }}>%{profile.happiness}</span>
                    </div>
                    <div
                      style={{
                        position: 'relative',
                        width: '100%',
                        height: 12,
                        background: '#083344',
                        border: '1.5px solid #164e63',
                        borderRadius: 4,
                        padding: 1,
                        boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.8), 0 1px 0 rgba(255,255,255,0.6)',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: `${profile.happiness}%`,
                          height: '100%',
                          background: 'linear-gradient(180deg, #22d3ee 0%, #0891b2 100%)',
                          borderRadius: 2,
                          transition: 'width 0.4s ease',
                          boxShadow: '0 0 5px rgba(34, 211, 238, 0.7)',
                        }}
                      />
                    </div>
                  </div>

                  {/* 3. Sevgi & Okşama Bağı (Şeker Pembe) */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.68rem', fontWeight: 800, marginBottom: 2 }}>
                      <span style={{ color: '#9d174d', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <span>🐾</span> Sevgi & Okşama Bağı
                      </span>
                      <span style={{ color: '#db2777', fontWeight: 900, fontSize: '0.72rem' }}>%{profile.affection ?? 85}</span>
                    </div>
                    <div
                      style={{
                        position: 'relative',
                        width: '100%',
                        height: 12,
                        background: '#500724',
                        border: '1.5px solid #831843',
                        borderRadius: 4,
                        padding: 1,
                        boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.8), 0 1px 0 rgba(255,255,255,0.6)',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: `${profile.affection ?? 85}%`,
                          height: '100%',
                          background: 'linear-gradient(180deg, #f472b6 0%, #db2777 100%)',
                          borderRadius: 2,
                          transition: 'width 0.4s ease',
                          boxShadow: '0 0 5px rgba(244, 114, 182, 0.7)',
                        }}
                      />
                    </div>
                  </div>

                  {/* 4. Enerji & Zindelik Barı (Zümrüt Yeşili) */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.68rem', fontWeight: 800, marginBottom: 2 }}>
                      <span style={{ color: '#065f46', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <span>⚡</span> Enerji & Zindelik
                      </span>
                      <span style={{ color: '#059669', fontWeight: 900, fontSize: '0.72rem' }}>%{profile.energy ?? 90}</span>
                    </div>
                    <div
                      style={{
                        position: 'relative',
                        width: '100%',
                        height: 12,
                        background: '#022c22',
                        border: '1.5px solid #064e3b',
                        borderRadius: 4,
                        padding: 1,
                        boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.8), 0 1px 0 rgba(255,255,255,0.6)',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: `${profile.energy ?? 90}%`,
                          height: '100%',
                          background: 'linear-gradient(180deg, #34d399 0%, #059669 100%)',
                          borderRadius: 2,
                          transition: 'width 0.4s ease',
                          boxShadow: '0 0 5px rgba(52, 211, 153, 0.7)',
                        }}
                      />
                    </div>
                  </div>

                  {/* 5. Temizlik & Hijyen Barı (Köpük Mavisi) */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.68rem', fontWeight: 800, marginBottom: 2 }}>
                      <span style={{ color: '#0369a1', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <span>🧼</span> Temizlik & Hijyen
                      </span>
                      <span style={{ color: '#0284c7', fontWeight: 900, fontSize: '0.72rem' }}>%{profile.cleanliness ?? 70}</span>
                    </div>
                    <div
                      style={{
                        position: 'relative',
                        width: '100%',
                        height: 12,
                        background: '#082f49',
                        border: '1.5px solid #075985',
                        borderRadius: 4,
                        padding: 1,
                        boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.8), 0 1px 0 rgba(255,255,255,0.6)',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: `${profile.cleanliness ?? 70}%`,
                          height: '100%',
                          background: 'linear-gradient(180deg, #38bdf8 0%, #0284c7 100%)',
                          borderRadius: 2,
                          transition: 'width 0.4s ease',
                          boxShadow: '0 0 5px rgba(56, 189, 248, 0.7)',
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Alt Kısım 1: Seviye & Altın XP Kutusu */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: '#fef3c7',
                  border: '2px solid #b45309',
                  borderRadius: 6,
                  padding: '4px 10px',
                  boxShadow: '0 2px 0 #78350f, inset 0 1px 0 rgba(255,255,255,0.9)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <img
                    src="/assets/cat_pixel/ui/ui_pixel_coin.png"
                    alt="Coin"
                    style={{ width: 13, height: 13, imageRendering: 'pixelated' }}
                  />
                  <span style={{ fontSize: '0.74rem', fontWeight: 900, color: '#78350f' }}>
                    Seviye {profile.level}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div
                    style={{
                      width: 90,
                      height: 8,
                      background: '#fde68a',
                      borderRadius: 99,
                      border: '1px solid #d97706',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: `${profile.xp}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, #f59e0b, #eab308)',
                        borderRadius: 99,
                      }}
                    />
                  </div>
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#92400e' }}>
                    {profile.xp} / 100 XP
                  </span>
                </div>
              </div>

              {/* Alt Kısım 2: Hızlı Kedi Bakım & Sevme Butonları (Tamagotchi Aksiyonları) */}
              {/* 🐟 Rüşvet Verme Butonu (Eren'den Çok Sevme İtirazı Geldiğinde) */}
              {showBribeButton && (
                <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'center' }}>
                  <button
                    type="button"
                    onClick={handleGiveBribe}
                    style={{
                      width: '100%',
                      background: 'linear-gradient(180deg, #f59e0b 0%, #b45309 100%)',
                      color: '#fff',
                      border: '2px solid #fef08a',
                      borderRadius: 12,
                      padding: '8px 12px',
                      fontSize: '0.78rem',
                      fontWeight: 900,
                      cursor: 'pointer',
                      boxShadow: '0 3px 0 #78350f, 0 4px 14px rgba(245, 158, 11, 0.6)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                      animation: 'pulse 1.5s infinite',
                    }}
                  >
                    <span>🍗 Rüşvet Ver (4 Kez Daha Sevme Hakkı Al!)</span>
                  </button>
                </div>
              )}

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(5, 1fr)',
                  gap: 5,
                  marginTop: 2,
                }}
              >
                {/* 🐾 Sev & Okşa */}
                <button
                  type="button"
                  onClick={handleQuickPet}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 3,
                    padding: '7px 3px',
                    background: currentStage.lockCareButtons || bribeCooldownSecs > 0
                      ? 'linear-gradient(180deg, #fee2e2 0%, #fecaca 100%)'
                      : bribePetsRemaining > 0
                      ? 'linear-gradient(180deg, #fef3c7 0%, #fde68a 100%)'
                      : 'linear-gradient(180deg, #fdf2f8 0%, #fbcfe8 100%)',
                    border: currentStage.lockCareButtons || bribeCooldownSecs > 0
                      ? '2px dashed #ef4444'
                      : bribePetsRemaining > 0
                      ? '2px solid #d97706'
                      : '2px solid #db2777',
                    borderRadius: 8,
                    boxShadow: currentStage.lockCareButtons || bribeCooldownSecs > 0
                      ? '0 2px 0 #b91c1c'
                      : bribePetsRemaining > 0
                      ? '0 2px 0 #92400e'
                      : '0 2px 0 #9d174d',
                    cursor: 'pointer',
                    opacity: currentStage.lockCareButtons || bribeCooldownSecs > 0 ? 0.88 : 1,
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                  title={
                    currentStage.lockCareButtons
                      ? currentStage.refuseMessage
                      : bribeCooldownSecs > 0
                      ? `Rüşvet cezası: ${bribeCooldownSecs} sn sonra sevebilirsin!`
                      : bribePetsRemaining > 0
                      ? `Rüşvet balığı aktif! Kalan hak: ${bribePetsRemaining}`
                      : "Kediyi sev & okşa! Sevgi ve mutluluk artar 🐾"
                  }
                >
                  <span style={{ fontSize: '1rem', lineHeight: 1 }}>
                    {currentStage.lockCareButtons ? '🔒' : bribeCooldownSecs > 0 ? '📢' : bribePetsRemaining > 0 ? '🤫' : '🐾'}
                  </span>
                  <span
                    style={{
                      fontSize: '0.6rem',
                      fontWeight: 900,
                      color: currentStage.lockCareButtons || bribeCooldownSecs > 0 ? '#991b1b' : bribePetsRemaining > 0 ? '#92400e' : '#9d174d',
                    }}
                  >
                    {currentStage.lockCareButtons
                      ? 'Kilitli'
                      : bribeCooldownSecs > 0
                      ? `${bribeCooldownSecs}s`
                      : bribePetsRemaining > 0
                      ? `Sev (${bribePetsRemaining})`
                      : 'Sev & Okşa'}
                  </span>
                </button>

                {/* 🐟 Mama Ver */}
                <button
                  type="button"
                  onClick={handleQuickFeed}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 3,
                    padding: '7px 3px',
                    background: 'linear-gradient(180deg, #fffbeb 0%, #fde68a 100%)',
                    border: '2px solid #d97706',
                    borderRadius: 8,
                    boxShadow: '0 2px 0 #92400e',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                  title="Leziz tavuk ver! Tokluk ve XP artar 🍗"
                >
                  <span style={{ fontSize: '1rem', lineHeight: 1 }}>🍗</span>
                  <span style={{ fontSize: '0.6rem', fontWeight: 900, color: '#92400e' }}>Tavuk</span>
                </button>

                {/* 🧼 Banyo Yaptır */}
                <button
                  type="button"
                  onClick={handleQuickBath}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 3,
                    padding: '7px 3px',
                    background: currentStage.lockCareButtons
                      ? 'linear-gradient(180deg, #fee2e2 0%, #fecaca 100%)'
                      : 'linear-gradient(180deg, #f0f9ff 0%, #bae6fd 100%)',
                    border: currentStage.lockCareButtons ? '2px dashed #ef4444' : '2px solid #0284c7',
                    borderRadius: 8,
                    boxShadow: currentStage.lockCareButtons ? '0 2px 0 #b91c1c' : '0 2px 0 #0369a1',
                    cursor: 'pointer',
                    opacity: currentStage.lockCareButtons ? 0.9 : 1,
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                  title={currentStage.lockCareButtons ? currentStage.refuseMessage : "Köpüklü ılık banyo yaptır! Temizlik %100 dolar 🧼🫧"}
                >
                  <span style={{ fontSize: '1rem', lineHeight: 1 }}>{currentStage.lockCareButtons ? '🔒' : '🧼'}</span>
                  <span style={{ fontSize: '0.6rem', fontWeight: 900, color: currentStage.lockCareButtons ? '#991b1b' : '#0369a1' }}>
                    {currentStage.lockCareButtons ? 'Kilitli' : 'Banyo'}
                  </span>
                </button>

                {/* 🧶 Oyun Oyna */}
                <button
                  type="button"
                  onClick={handleQuickPlay}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 3,
                    padding: '7px 3px',
                    background: currentStage.lockCareButtons
                      ? 'linear-gradient(180deg, #fee2e2 0%, #fecaca 100%)'
                      : 'linear-gradient(180deg, #ecfeff 0%, #a5f3fc 100%)',
                    border: currentStage.lockCareButtons ? '2px dashed #ef4444' : '2px solid #0891b2',
                    borderRadius: 8,
                    boxShadow: currentStage.lockCareButtons ? '0 2px 0 #b91c1c' : '0 2px 0 #0e7490',
                    cursor: 'pointer',
                    opacity: currentStage.lockCareButtons ? 0.9 : 1,
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                  title={currentStage.lockCareButtons ? currentStage.refuseMessage : "İp yumağıyla oyna! Mutluluk fırlar 🧶"}
                >
                  <span style={{ fontSize: '1rem', lineHeight: 1 }}>{currentStage.lockCareButtons ? '🔒' : '🧶'}</span>
                  <span style={{ fontSize: '0.6rem', fontWeight: 900, color: currentStage.lockCareButtons ? '#991b1b' : '#0e7490' }}>
                    {currentStage.lockCareButtons ? 'Kilitli' : 'Oyna'}
                  </span>
                </button>

                {/* 💤 Dinlendir */}
                <button
                  type="button"
                  onClick={handleQuickRest}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 3,
                    padding: '7px 3px',
                    background: isSleeping
                      ? 'linear-gradient(180deg, #ede9fe 0%, #ddd6fe 100%)'
                      : 'linear-gradient(180deg, #f5f3ff 0%, #e0e7ff 100%)',
                    border: '2px solid #7c3aed',
                    borderRadius: 8,
                    boxShadow: '0 2px 0 #5b21b6',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                  title={isSleeping ? 'Kediyi uyandır ⏰' : 'Kediyi dinlendir & uyut 💤'}
                >
                  <span style={{ fontSize: '1rem', lineHeight: 1 }}>{isSleeping ? '⏰' : '💤'}</span>
                  <span style={{ fontSize: '0.6rem', fontWeight: 900, color: '#5b21b6' }}>
                    {isSleeping ? 'Uyandır' : 'Dinlendir'}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Günlük Özet Çubuğu & Piksel Buton (BONUSPastelUI Stili) */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 4 }}>
            <span style={{ fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ color: '#fbbf24' }}>🎯</span>
              Bugün: <strong style={{ color: '#fff', fontSize: '0.85rem' }}>{completedTodayCount} / {habits.length}</strong> tamamlandı
            </span>
            <button
              onClick={() => setShowAddModal(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                background: 'linear-gradient(180deg, #f59e0b 0%, #d97706 100%)',
                color: '#fff',
                border: '2px solid #fde68a',
                padding: '8px 16px',
                borderRadius: 12,
                fontSize: '0.78rem',
                fontWeight: 900,
                cursor: 'pointer',
                boxShadow: '0 3px 0 #92400e, 0 6px 14px rgba(245,158,11,0.35)',
                textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 4px 0 #92400e, 0 8px 18px rgba(245,158,11,0.45)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 3px 0 #92400e, 0 6px 14px rgba(245,158,11,0.35)';
              }}
            >
              <Plus size={15} strokeWidth={3} />
              <span>Yeni Alışkanlık</span>
            </button>
          </div>
        </div>
      </div>

      {/* ─── FOREST ODAKLANMA SAYACI MODÜLÜ (AÇILIR/KAPANIR) ─── */}
      {showFocusTimer && (
        <div style={{ marginBottom: 28 }}>
          <CatFocusTimer
            onSessionStart={() => setIsSleeping(true)}
            onSessionComplete={(mins) => {
              setIsSleeping(false);
              setProfile(prev => ({
                ...prev,
                xp: Math.min(100, prev.xp + 30),
                hunger: 100,
                happiness: 100,
                totalFishFed: prev.totalFishFed + 2,
              }));
            }}
            onSessionCancel={() => setIsSleeping(false)}
          />
        </div>
      )}

      {/* ─── GÜNLÜK ALIŞKANLIKLAR LİSTESİ (CatUI & BONUSPastelUI Görev Kartları) ─── */}
      <div style={{ marginTop: 16 }}>
        {/* Kategori Filtreleri (BONUSPastelUI Pastel Pill Çipleri) */}
        <div
          className="habit-category-tabs no-scrollbar"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            overflowX: 'auto',
            WebkitOverflowScrolling: 'touch',
            paddingBottom: 10,
            marginBottom: 20,
          }}
        >
          {CATEGORY_TABS.map(tab => {
            const isSelected = selectedCategory === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setSelectedCategory(tab.key as any)}
                style={{
                  padding: '9px 18px',
                  borderRadius: 14,
                  border: isSelected
                    ? `2px solid ${tab.activeBorder}`
                    : '2px solid rgba(255, 255, 255, 0.12)',
                  background: isSelected
                    ? tab.activeBg
                    : 'rgba(255, 255, 255, 0.05)',
                  color: isSelected ? tab.activeText : '#cbd5e1',
                  fontSize: '0.8rem',
                  fontWeight: 900,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  boxShadow: isSelected
                    ? `0 4px 0 ${tab.shadow}, 0 6px 16px rgba(0,0,0,0.3)`
                    : '0 2px 4px rgba(0,0,0,0.2)',
                  transition: 'all 0.15s ease',
                  transform: isSelected ? 'translateY(-2px)' : 'translateY(0)',
                }}
                onMouseEnter={e => {
                  if (!isSelected) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
                    e.currentTarget.style.color = '#fff';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }
                }}
                onMouseLeave={e => {
                  if (!isSelected) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                    e.currentTarget.style.color = '#cbd5e1';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Kartlar Izgarası (Pastel Parşömen & CatUI Kartları) */}
        <div
          className="habit-cards-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))',
            gap: 20,
          }}
        >
          {filteredHabits.map(habit => {
            const isDoneToday = habit.completedDates.includes(today);
            const totalDoneDays = habit.completedDates.length;
            const style = CATEGORY_STYLES[habit.category] || DEFAULT_CATEGORY_STYLE;

            return (
              <div
                key={habit.id}
                style={{
                  position: 'relative',
                  background: isDoneToday
                    ? 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)'
                    : 'linear-gradient(135deg, #fffdf8 0%, #fef8ee 100%)',
                  borderRadius: 20,
                  padding: '22px 18px 16px',
                  border: isDoneToday
                    ? '2.5px solid #34d399'
                    : `2.5px solid ${style.border}`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                  boxShadow: isDoneToday
                    ? '0 5px 0 #10b981, 0 12px 24px rgba(16, 185, 129, 0.2)'
                    : `0 5px 0 ${style.borderBottom}, 0 10px 24px rgba(0,0,0,0.18)`,
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {/* Üstte Sevimli Kategori Washi-Tape / Rozeti */}
                <div
                  style={{
                    position: 'absolute',
                    top: -10,
                    left: 18,
                    background: isDoneToday ? '#d1fae5' : style.badgeBg,
                    border: isDoneToday ? '1.5px solid #10b981' : `1.5px solid ${style.badgeBorder}`,
                    color: isDoneToday ? '#065f46' : style.badgeText,
                    borderRadius: 8,
                    padding: '2px 9px',
                    fontSize: '0.66rem',
                    fontWeight: 900,
                    boxShadow: '0 2px 5px rgba(0,0,0,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  <span>{style.icon}</span>
                  <span>{style.label}</span>
                  {isDoneToday && <span style={{ color: '#059669', marginLeft: 2 }}>✓ Yapıldı</span>}
                </div>

                {/* Kart Gövdesi: İkon + Başlık + Streak */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 4 }}>
                  {/* Sol: Büyük 3D İkon Kutusu */}
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 14,
                      background: isDoneToday
                        ? '#a7f3d0'
                        : style.badgeBg,
                      border: isDoneToday
                        ? '2px solid #059669'
                        : `2px solid ${style.border}`,
                      boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.4rem',
                      flexShrink: 0,
                    }}
                  >
                    {habit.icon}
                  </div>

                  {/* Orta: Başlık & Toplam Gün Bilgisi */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4
                      style={{
                        margin: 0,
                        fontSize: '0.92rem',
                        fontWeight: 900,
                        color: isDoneToday ? '#065f46' : '#451a03',
                        textDecoration: isDoneToday ? 'line-through' : 'none',
                        lineHeight: 1.35,
                        wordBreak: 'break-word',
                      }}
                    >
                      {habit.title}
                    </h4>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6, marginTop: 5, flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <span style={{ fontSize: '0.75rem' }}>🐾</span>
                        <span
                          style={{
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            color: isDoneToday ? '#047857' : '#92400e',
                          }}
                        >
                          Toplam <strong>{totalDoneDays} gün</strong> yapıldı
                        </span>
                      </div>

                      {/* Kimin yazdığı etiketi (Eren / Özlem / Eren & Özlem) */}
                      {(() => {
                        const author = (!habit.createdBy || habit.createdBy === 'Sistem') ? 'Eren & Özlem' : habit.createdBy;
                        const isBoth = author.includes('&') || author.toLowerCase().includes('ikimiz');
                        const isOzlem = !isBoth && (author.toLowerCase().includes('özlem') || author.toLowerCase().includes('ozlem'));
                        const isEren = !isBoth && author.toLowerCase().includes('eren');
                        return (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleHabitAuthor(habit.id);
                            }}
                            style={{
                              fontSize: '0.68rem',
                              fontWeight: 800,
                              padding: '2px 8px',
                              borderRadius: 9999,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 3,
                              cursor: 'pointer',
                              border: `1px solid ${
                                isBoth
                                  ? 'rgba(168,85,247,0.45)'
                                  : isOzlem
                                  ? 'rgba(236,72,153,0.35)'
                                  : 'rgba(59,130,246,0.35)'
                              }`,
                              background: isBoth
                                ? 'linear-gradient(135deg, rgba(236,72,153,0.15) 0%, rgba(59,130,246,0.15) 100%)'
                                : isOzlem
                                ? 'rgba(236,72,153,0.12)'
                                : 'rgba(59,130,246,0.12)',
                              color: isBoth
                                ? '#9333ea'
                                : isOzlem
                                ? '#be185d'
                                : '#1d4ed8',
                              transition: 'all 0.15s ease',
                            }}
                            title={`Ekleyen: ${author} (Değiştirmek için tıkla)`}
                          >
                            <span>{isBoth ? '💑' : isOzlem ? '👧🏻' : '👦🏻'}</span>
                            <span>{author}</span>
                          </button>
                        );
                      })()}
                    </div>

                    {/* 🐾 Mavi Pati (Eren) / 🐱 Pembe Kedi (Özlem) / ❌ Günlük Geçmiş Serisi */}
                    {(() => {
                      const days: { date: string; done: boolean; doneBy?: string; isFuture: boolean }[] = [];
                      for (let i = 19; i >= 0; i--) {
                        const d = new Date();
                        d.setDate(d.getDate() - i);
                        const ds = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
                        if (ds >= habit.createdAt.slice(0,10)) {
                          days.push({
                            date: ds,
                            done: habit.completedDates.includes(ds),
                            doneBy: habit.completedByDates?.[ds] || (habit.completedDates.includes(ds) ? currentUserName : undefined),
                            isFuture: ds > today,
                          });
                        }
                      }
                      if (days.length === 0) return null;
                      return (
                        <button
                          onClick={(e) => { e.stopPropagation(); setCalendarHabitId(habit.id); }}
                          style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 3,
                            marginTop: 6,
                            background: isDoneToday ? 'rgba(16,185,129,0.08)' : 'rgba(245,158,11,0.08)',
                            border: isDoneToday ? '1px dashed rgba(16,185,129,0.25)' : '1px dashed rgba(245,158,11,0.25)',
                            borderRadius: 10,
                            padding: '5px 8px',
                            cursor: 'pointer',
                            alignItems: 'center',
                            width: '100%',
                            transition: 'background 0.2s',
                          }}
                          title="Takvimi görüntülemek için tıkla 📅 (Mavi Pati: Eren, Pembe Kedi: Özlem)"
                        >
                          {days.map(d => (
                            <span
                              key={d.date}
                              style={{ display: 'inline-flex', alignItems: 'center', fontSize: '0.78rem', lineHeight: 1, opacity: d.isFuture ? 0.2 : 1 }}
                              title={`${d.date}${d.done ? ` - ${d.doneBy || 'Yapıldı'}` : ' - Yapılmadı'}`}
                            >
                              {d.isFuture ? '·' : d.done ? getCompletedIcon(d.doneBy, 13) : '❌'}
                            </span>
                          ))}
                        </button>
                      );
                    })()}
                  </div>
                </div>

                {/* Kart Alt Çizgisi & Butonlar */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: 8,
                    borderTop: isDoneToday
                      ? '1px dashed rgba(5, 150, 105, 0.25)'
                      : '1px dashed rgba(180, 83, 9, 0.2)',
                  }}
                >
                  {/* Sol: Alışkanlığı Düzenle & Sil Butonları */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <button
                      onClick={() => handleEditHabitTitle(habit.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 3,
                        background: 'transparent',
                        border: 'none',
                        color: '#a1a1aa',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        padding: '4px 6px',
                        borderRadius: 6,
                        transition: 'all 0.15s ease',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.color = '#3b82f6';
                        e.currentTarget.style.background = '#dbeafe';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.color = '#a1a1aa';
                        e.currentTarget.style.background = 'transparent';
                      }}
                      title="Alışkanlık ismini kendi isteğine göre düzenle ✏️"
                    >
                      <Edit2 size={12} />
                      <span>Düzenle</span>
                    </button>

                    <button
                      onClick={() => handleDeleteHabit(habit.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 3,
                        background: 'transparent',
                        border: 'none',
                        color: '#a1a1aa',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        padding: '4px 6px',
                        borderRadius: 6,
                        transition: 'all 0.15s ease',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.color = '#ef4444';
                        e.currentTarget.style.background = '#fee2e2';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.color = '#a1a1aa';
                        e.currentTarget.style.background = 'transparent';
                      }}
                      title="Alışkanlığı sil"
                    >
                      <Trash2 size={12} />
                      <span>Sil</span>
                    </button>
                  </div>

                  {/* Sağ: Sevimli CatUI Balık & Tamamlama Butonu */}
                  {(() => {
                    const doneByUser = habit.completedByDates?.[today] || currentUserName;
                    const isOzlemDone = doneByUser && (doneByUser.toLowerCase().includes('özlem') || doneByUser.toLowerCase().includes('ozlem'));
                    return (
                      <button
                        onClick={() => handleToggleHabit(habit.id)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                          padding: '8px 16px',
                          borderRadius: 12,
                          border: isDoneToday
                            ? isOzlemDone
                              ? '2px solid #db2777'
                              : '2px solid #2563eb'
                            : '2px solid #b45309',
                          background: isDoneToday
                            ? isOzlemDone
                              ? 'linear-gradient(180deg, #ec4899 0%, #db2777 100%)'
                              : 'linear-gradient(180deg, #3b82f6 0%, #2563eb 100%)'
                            : 'linear-gradient(180deg, #fef3c7 0%, #fde68a 100%)',
                          color: isDoneToday ? '#fff' : '#78350f',
                          fontSize: '0.78rem',
                          fontWeight: 900,
                          cursor: 'pointer',
                          boxShadow: isDoneToday
                            ? isOzlemDone
                              ? '0 3px 0 #be185d, 0 6px 14px rgba(236,72,153,0.35)'
                              : '0 3px 0 #1d4ed8, 0 6px 14px rgba(59,130,246,0.35)'
                            : '0 3px 0 #92400e, 0 6px 12px rgba(245,158,11,0.25)',
                          transition: 'all 0.15s ease',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.04)')}
                        onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                        title={
                          isDoneToday
                            ? `Tamamlandı (${isOzlemDone ? 'Özlem 🐱' : 'Eren 🐾'})! Geri almak için tıkla`
                            : 'Kediye tavuk ver & görevi tamamla! 🍗'
                        }
                      >
                        {isDoneToday ? (
                          <>
                            {isOzlemDone ? <PinkCatIcon size={18} /> : <BluePawIcon size={18} />}
                            <span>{isOzlemDone ? 'Özlem Yaptı! 🐱' : 'Eren Yaptı! 🐾'}</span>
                          </>
                        ) : (
                          <>
                            <span style={{ fontSize: '1.05rem', lineHeight: 1 }}>🍗</span>
                            <span>Tavuk Ver & Bitir</span>
                          </>
                        )}
                      </button>
                    );
                  })()}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── PATİ TAKVİM MODALI ─── */}
      {calendarHabitId && (() => {
        const calHabit = habits.find(h => h.id === calendarHabitId);
        if (!calHabit) return null;
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        const monthName = now.toLocaleString('tr-TR', { month: 'long', year: 'numeric' });
        const firstDay = new Date(year, month, 1).getDay();
        const startOffset = (firstDay + 6) % 7;
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const calDays: { day: number | null; dateStr: string | null }[] = [];
        for (let i = 0; i < startOffset; i++) calDays.push({ day: null, dateStr: null });
        for (let d = 1; d <= daysInMonth; d++) {
          const ds = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
          calDays.push({ day: d, dateStr: ds });
        }
        const dayLabels = ['Pt','Sa','Ça','Pe','Cu','Ct','Pz'];
        const thisMonthDone = calHabit.completedDates.filter(d => d.startsWith(`${year}-${String(month+1).padStart(2,'0')}`)).length;
        return (
          <div
            onClick={() => setCalendarHabitId(null)}
            style={{ position: 'fixed', inset: 0, zIndex: 10000, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
          >
            <div onClick={e => e.stopPropagation()} style={{ background: 'linear-gradient(145deg, #1e2235 0%, #14172b 100%)', borderRadius: 24, padding: '28px 24px', width: '100%', maxWidth: 380, border: '1.5px solid rgba(255,255,255,0.1)', boxShadow: '0 25px 60px rgba(0,0,0,0.6)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
                <div>
                  <div style={{ fontSize: '1.5rem', marginBottom: 2 }}>{calHabit.icon}</div>
                  <h3 style={{ margin: 0, color: '#f1f5f9', fontSize: '1rem', fontWeight: 900 }}>{calHabit.title}</h3>
                  <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.75rem', marginTop: 4 }}>📅 {monthName} &nbsp;·&nbsp; 🐾 {thisMonthDone} gün yapıldı</p>
                </div>
                <button onClick={() => setCalendarHabitId(null)} style={{ background: 'rgba(255,255,255,0.07)', border: 'none', borderRadius: 10, color: '#94a3b8', fontSize: '1.1rem', cursor: 'pointer', padding: '6px 10px' }}>✕</button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 6 }}>
                {dayLabels.map(l => <div key={l} style={{ textAlign: 'center', fontSize: '0.65rem', color: '#64748b', fontWeight: 800 }}>{l}</div>)}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
                {calDays.map((cd, i) => {
                  if (!cd.day || !cd.dateStr) return <div key={i} />;
                  const done = calHabit.completedDates.includes(cd.dateStr);
                  const doneByUser = calHabit.completedByDates?.[cd.dateStr] || currentUserName;
                  const isToday = cd.dateStr === today;
                  const isFuture = cd.dateStr > today;
                  const beforeCreation = cd.dateStr < calHabit.createdAt.slice(0,10);
                  return (
                    <div key={cd.dateStr} style={{ textAlign: 'center', padding: '5px 2px', borderRadius: 10, background: done ? 'rgba(16,185,129,0.15)' : isFuture || beforeCreation ? 'transparent' : 'rgba(239,68,68,0.1)', border: isToday ? '1.5px solid #fbbf24' : '1.5px solid transparent', opacity: beforeCreation ? 0.2 : 1 }}>
                      <div style={{ fontSize: '0.9rem', lineHeight: 1.2, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 20 }}>
                        {beforeCreation || isFuture ? '' : done ? getCompletedIcon(doneByUser, 16) : '❌'}
                      </div>
                      <div style={{ fontSize: '0.62rem', color: isToday ? '#fbbf24' : '#64748b', fontWeight: isToday ? 900 : 600 }}>{cd.day}</div>
                    </div>
                  );
                })}
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.72rem', color: '#60a5fa', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <BluePawIcon size={13} /> Eren
                </span>
                <span style={{ fontSize: '0.72rem', color: '#f472b6', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <PinkCatIcon size={13} /> Özlem
                </span>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>❌ Yapılmadı</span>
                <span style={{ fontSize: '0.72rem', color: '#fbbf24' }}>□ Bugün</span>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ─── YENİ ALIŞKANLIK EKLEME MODALI ─── */}
      {showAddModal && (
        <div
          onClick={() => setShowAddModal(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: 460,
              background: 'linear-gradient(180deg, #1c1a26 0%, #13121a 100%)',
              borderRadius: 24,
              border: '2px solid rgba(251, 191, 36, 0.45)',
              padding: '26px 24px',
              boxShadow: '0 25px 60px rgba(0,0,0,0.85), 0 0 24px rgba(245,158,11,0.15)',
            }}
          >
            {/* Modal üstünde sevimli uyuyan kedi (CatUI) */}
            <div
              style={{
                position: 'absolute',
                top: -20,
                right: 32,
                pointerEvents: 'none',
              }}
            >
              <img
                src="/assets/cat_pixel/ui/ui_sleeping_cat_edge.png"
                alt="Sleeping Cat"
                style={{ width: 62, height: 25, imageRendering: 'pixelated', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.8))' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <img
                src="/assets/cat_pixel/ui/ui_paw_circle.png"
                alt="Paw"
                style={{ width: 28, height: 28, imageRendering: 'pixelated' }}
              />
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 900, color: '#fff' }}>
                Yeni Alışkanlık Ekle
              </h3>
            </div>

            {/* Hazır Öneriler */}
            <div style={{ marginBottom: 16 }}>
              <p style={{ margin: '0 0 8px', fontSize: '0.72rem', color: '#a1a1aa', fontWeight: 700 }}>
                Hızlı Fikirler:
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {PRESET_IDEAS.map((idea, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setNewTitle(idea.title);
                      setNewIcon(idea.icon);
                      setNewCategory(idea.category as HabitCategory);
                      setNewColor(idea.color);
                    }}
                    style={{
                      background: '#27272a',
                      border: '1px solid #3f3f46',
                      color: '#e4e4e7',
                      padding: '4px 10px',
                      borderRadius: 9999,
                      fontSize: '0.72rem',
                      cursor: 'pointer',
                    }}
                  >
                    {idea.icon} {idea.title}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleAddHabit}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, color: '#a1a1aa', marginBottom: 6 }}>
                  <span>Alışkanlık İsmi</span>
                  <span style={{ fontSize: '0.68rem', color: '#fbbf24', fontWeight: 600 }}>
                    ✍️ Kendi istediğin ismi dilediğince yazabilirsin
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="Örn: Eğitim, Kitap Oku, Yabancı Dil Çalış..."
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  autoFocus
                  style={{
                    width: '100%',
                    background: '#09090b',
                    border: '1px solid #3f3f46',
                    borderRadius: 12,
                    padding: '10px 14px',
                    color: '#fff',
                    fontSize: '0.85rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 18 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#a1a1aa', marginBottom: 6 }}>
                    Kategori
                  </label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as HabitCategory)}
                    style={{
                      width: '100%',
                      background: '#09090b',
                      border: '1px solid #3f3f46',
                      borderRadius: 12,
                      padding: '10px',
                      color: '#fff',
                      fontSize: '0.8rem',
                    }}
                  >
                    <option value="education">Eğitim 🎓</option>
                    <option value="health">Sağlık 💧</option>
                    <option value="love">Sevgi 💌</option>
                    <option value="mind">Zihin & Okuma 📖</option>
                    <option value="fitness">Spor 🚶‍♀️</option>
                    <option value="daily">Günlük Rutin ☀️</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#a1a1aa', marginBottom: 6 }}>
                    İkon / Emoji
                  </label>
                  <input
                    type="text"
                    value={newIcon}
                    onChange={e => setNewIcon(e.target.value)}
                    style={{
                      width: '100%',
                      background: '#09090b',
                      border: '1px solid #3f3f46',
                      borderRadius: 12,
                      padding: '10px',
                      color: '#fff',
                      fontSize: '1rem',
                      textAlign: 'center',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              {/* Görevi Yazan Kişi (Eren / Özlem) */}
              <div style={{ marginBottom: 18 }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#a1a1aa', marginBottom: 6 }}>
                  Görevi Kim Yazıyor?
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.3fr', gap: 8 }}>
                  <button
                    type="button"
                    onClick={() => setNewCreatedBy('Eren')}
                    style={{
                      padding: '9px 8px',
                      borderRadius: 12,
                      border: newCreatedBy === 'Eren' ? '2px solid #3b82f6' : '1px solid #3f3f46',
                      background: newCreatedBy === 'Eren' ? 'rgba(59,130,246,0.18)' : '#18181b',
                      color: newCreatedBy === 'Eren' ? '#60a5fa' : '#a1a1aa',
                      fontWeight: 800,
                      fontSize: '0.78rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 4,
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <span>👦🏻</span>
                    <span>Eren</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewCreatedBy('Özlem')}
                    style={{
                      padding: '9px 8px',
                      borderRadius: 12,
                      border: newCreatedBy === 'Özlem' ? '2px solid #ec4899' : '1px solid #3f3f46',
                      background: newCreatedBy === 'Özlem' ? 'rgba(236,72,153,0.18)' : '#18181b',
                      color: newCreatedBy === 'Özlem' ? '#f472b6' : '#a1a1aa',
                      fontWeight: 800,
                      fontSize: '0.78rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 4,
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <span>👧🏻</span>
                    <span>Özlem</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewCreatedBy('Eren & Özlem')}
                    style={{
                      padding: '9px 8px',
                      borderRadius: 12,
                      border: newCreatedBy === 'Eren & Özlem' ? '2px solid #a855f7' : '1px solid #3f3f46',
                      background: newCreatedBy === 'Eren & Özlem' ? 'rgba(168,85,247,0.22)' : '#18181b',
                      color: newCreatedBy === 'Eren & Özlem' ? '#c084fc' : '#a1a1aa',
                      fontWeight: 800,
                      fontSize: '0.78rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 4,
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <span>💑</span>
                    <span>Eren & Özlem</span>
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{
                    background: '#27272a',
                    border: 'none',
                    color: '#a1a1aa',
                    padding: '9px 18px',
                    borderRadius: 12,
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  disabled={!newTitle.trim()}
                  style={{
                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                    border: 'none',
                    color: '#fff',
                    padding: '9px 20px',
                    borderRadius: 12,
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    opacity: !newTitle.trim() ? 0.5 : 1,
                  }}
                >
                  Ekle 🐾
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── KEDİ İSMİ DÜZENLEME MODALI ─── */}
      {showEditName && (
        <div
          onClick={() => setShowEditName(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(10px)',
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
              maxWidth: 360,
              background: '#18181b',
              borderRadius: 20,
              border: '1px solid #3f3f46',
              padding: '22px',
              boxShadow: '0 25px 60px rgba(0,0,0,0.8)',
            }}
          >
            <h3 style={{ margin: '0 0 12px', fontSize: '1rem', fontWeight: 800, color: '#fff' }}>
              🐱 Kediciğin İsmi
            </h3>
            <input
              type="text"
              value={nameInput}
              onChange={e => setNameInput(e.target.value)}
              placeholder="Örn: Pamuk, Prenses, Sirius..."
              style={{
                width: '100%',
                background: '#09090b',
                border: '1px solid #3f3f46',
                borderRadius: 12,
                padding: '10px 12px',
                color: '#fff',
                fontSize: '0.9rem',
                marginBottom: 16,
                boxSizing: 'border-box',
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button
                onClick={() => setShowEditName(false)}
                style={{
                  background: '#27272a',
                  border: 'none',
                  color: '#a1a1aa',
                  padding: '8px 16px',
                  borderRadius: 10,
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                İptal
              </button>
              <button
                onClick={handleSaveName}
                style={{
                  background: '#f59e0b',
                  border: 'none',
                  color: '#fff',
                  padding: '8px 18px',
                  borderRadius: 10,
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
