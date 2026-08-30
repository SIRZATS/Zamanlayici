import React, { useState, useRef, useEffect } from 'react';
import { CatMood } from './habitTypes';
import {
  PixelCatSprite,
  CatActionType,
  USER_CAT_ANIMATIONS,
  getCatQuote,
} from './PixelCatSprite';
import {
  playCuteMeow,
  playHappyPurr,
  playEatingCrunch,
  playWaterSplashBubble,
  playHeartBeatSound,
  playHissAngry,
  playAnimationAudio,
  playSleepySnore,
  playYawnStretch,
} from './catAudio';
import { getInactivityStage, SLEEPING_ANNOYED_QUOTES } from './inactivityStages';
import { Plus, Moon, Sun, Bath, Home } from 'lucide-react';
import confetti from 'canvas-confetti';
import { IDLE_UNLOCK_MILESTONES } from './idleMilestones';

const IDLE_CYCLE: { action: CatActionType; durationMs: number }[] = [
  { action: 'idle', durationMs: 20_000 },
  { action: 'idle2', durationMs: 30_000 },
  { action: 'licking', durationMs: 35_000 },
  { action: 'laydown', durationMs: 50_000 },
  { action: 'sleepy', durationMs: 40_000 },
  { action: 'dance', durationMs: 30_000 },
];

export const EXTRA_ANIMATIONS: {
  action: CatActionType;
  emoji: string;
  name: string;
  color: string;
  bg: string;
  title: string;
}[] = [
  { action: 'box2', emoji: '📦', name: 'BOX 2', color: '#c084fc', bg: '168,85,247', title: 'BOX 2' },
  { action: 'box3', emoji: '📦', name: 'BOX 3', color: '#a78bfa', bg: '139,92,246', title: 'BOX 3' },
  { action: 'dance', emoji: '🪩', name: 'DANCE', color: '#ec4899', bg: '236,72,153', title: 'DANCE' },
  { action: 'excited', emoji: '🎉', name: 'EXCITED', color: '#fbbf24', bg: '245,158,11', title: 'EXCITED' },
  { action: 'sleepy', emoji: '🥱', name: 'SLEEPY', color: '#a5b4fc', bg: '99,102,241', title: 'SLEEPY' },
  { action: 'sleeping', emoji: '🌙', name: 'SLEEP', color: '#818cf8', bg: '99,102,241', title: 'SLEEP' },
  { action: 'idle2', emoji: '👂', name: 'IDLE 2', color: '#38bdf8', bg: '56,189,248', title: 'IDLE 2' },
  { action: 'surprised', emoji: '🙀', name: 'SURPRISED', color: '#fdba74', bg: '251,146,60', title: 'SURPRISED' },
  { action: 'crying', emoji: '😿', name: 'CRYING', color: '#93c5fd', bg: '59,130,246', title: 'CRYING' },
  { action: 'eating', emoji: '🍗', name: 'EATING', color: '#4ade80', bg: '34,197,94', title: 'EATING' },
  { action: 'waiting', emoji: '⏳', name: 'WAITING', color: '#fcd34d', bg: '245,158,11', title: 'WAITING' },
  { action: 'dead', emoji: '💀', name: 'DEAD', color: '#cbd5e1', bg: '148,163,184', title: 'DEAD' },
  { action: 'laydown', emoji: '🛋️', name: 'LAY DOWN', color: '#e879f9', bg: '217,70,239', title: 'LAY DOWN' },
  { action: 'shy', emoji: '🙈', name: 'SHY', color: '#f472b6', bg: '236,72,153', title: 'SHY' },
  { action: 'refusing', emoji: '🙅', name: 'REFUSING', color: '#fb7185', bg: '244,63,94', title: 'REFUSING' },
  { action: 'licking', emoji: '👅', name: 'LICKING', color: '#2dd4bf', bg: '20,184,166', title: 'LICKING' },
  { action: 'despite', emoji: '😒', name: 'DESPITE', color: '#e2e8f0', bg: '100,116,139', title: 'DESPITE' },
  { action: 'bathtub', emoji: '🛁', name: 'BATHTUB', color: '#38bdf8', bg: '56,189,248', title: 'BATHTUB' },
  { action: 'sick1', emoji: '💉', name: 'SICK 1', color: '#ef4444', bg: '239,68,68', title: 'SICK 1' },
  { action: 'sick2', emoji: '🌡️', name: 'SICK 2', color: '#f59e0b', bg: '245,158,11', title: 'SICK 2' },
];

interface PixelCatRoomProps {
  mood: CatMood;
  level: number;
  catName: string;
  isSleeping: boolean;
  isFeeding: boolean;
  externalAction?: { action: CatActionType; quote?: string; duration?: number; key: number } | null;
  inactiveDays?: number;
  showBribeButton?: boolean;
  onBribe?: () => void;
  onBath?: () => void;
  onPet?: () => void;
  totalCompletedHabits?: number;
}

export const PixelCatRoom: React.FC<PixelCatRoomProps> = ({
  mood,
  level,
  catName,
  isSleeping,
  isFeeding,
  externalAction,
  inactiveDays = 0,
  showBribeButton = false,
  onBribe,
  onBath,
  onPet,
  totalCompletedHabits = 0,
}) => {
  const stage = getInactivityStage(inactiveDays);
  const [activeRoom, setActiveRoom] = useState<'bedroom' | 'bathroom'>('bedroom');
  const [selectedTubRow, setSelectedTubRow] = useState<number>(1); // 1 = Mavi küvet
  const [isNight, setIsNight] = useState(false);
  const [actionOverride, setActionOverride] = useState<CatActionType | undefined>(undefined);
  const [clickHearts, setClickHearts] = useState<{ id: number; x: number; y: number; icon?: string }[]>([]);
  const [customQuote, setCustomQuote] = useState<string | null>(null);
  const [extraAnimsCount, setExtraAnimsCount] = useState<number>(0);
  const [isUserAction, setIsUserAction] = useState(false);
  const [idleKey, setIdleKey] = useState(0);
  const lastIdleActionRef = useRef<CatActionType | null>(null);
  const directClickCountRef = useRef<number>(0);

  // 30 Saniyelik Animasyon Süresi ve Zamanlayıcı
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [remainingSecs, setRemainingSecs] = useState<number | null>(null);

  const resetToNormal = () => {
    directClickCountRef.current = 0;
    if (timerRef.current) clearTimeout(timerRef.current);
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    timerRef.current = null;
    countdownIntervalRef.current = null;
    setActionOverride(undefined);
    setRemainingSecs(null);
    setCustomQuote(null);
    setIsUserAction(false);
  };

  // Dışarıdan tetiklenen hızlı aksiyonlar (Oyna, Sev, Mama, Dinlendir)
  useEffect(() => {
    if (externalAction) {
      triggerQuickAction(externalAction.action, externalAction.duration ?? 5000);
      if (externalAction.quote) {
        setCustomQuote(externalAction.quote);
      }
    } else {
      resetToNormal();
    }
  }, [externalAction ? externalAction.key : null, externalAction]);

  // Kedi uyandırıldığında (isSleeping false olduğunda) uyku modunu derhal temizle
  useEffect(() => {
    if (!isSleeping && actionOverride === 'sleeping') {
      resetToNormal();
    }
  }, [isSleeping]);

  // Boştayken seviyeye ve tamamlanan alışkanlıklara göre açılan animasyonlar arasında dolaş
  const completedHabitsEffective = totalCompletedHabits > 0 ? totalCompletedHabits : Math.max(0, (level - 1) * 10);
  const unlockedMilestones = IDLE_UNLOCK_MILESTONES.filter(m => completedHabitsEffective >= m.habitsRequired);
  const dynamicIdleCycle = [
    { action: 'idle' as CatActionType, durationMs: 20_000 },
    { action: 'idle2' as CatActionType, durationMs: 25_000 },
    ...unlockedMilestones
      .filter(m => m.action !== 'idle' && m.action !== 'idle2')
      .map(m => ({ action: m.action, durationMs: m.durationMs })),
  ];

  const idleEligible =
    activeRoom === 'bedroom' &&
    !isSleeping &&
    !isFeeding &&
    !stage.lockCareButtons &&
    stage.day < 5;

  useEffect(() => {
    if (!idleEligible || isUserAction) return;

    const pool = dynamicIdleCycle.filter(item => item.action !== lastIdleActionRef.current);
    const pick = pool.length > 0 ? pool[Math.floor(Math.random() * pool.length)] : dynamicIdleCycle[0];
    lastIdleActionRef.current = pick.action;
    setActionOverride(pick.action);

    const timer = window.setTimeout(() => {
      setIdleKey(key => key + 1);
    }, pick.durationMs);

    return () => window.clearTimeout(timer);
  }, [idleEligible, isUserAction, idleKey, dynamicIdleCycle.length]);

  // Kediye tıklama (Gıdıklama / Sevme)
  const handleCatClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // 3 ve daha fazla gün girilmediyse sevmek yasak!
    if (stage.lockCareButtons) {
      playHissAngry();
      const newIcon = { id: Date.now() + Math.random(), x, y, icon: '😾' };
      setClickHearts(prev => [...prev.slice(-6), newIcon]);
      setTimeout(() => {
        setClickHearts(prev => prev.filter(h => h.id !== newIcon.id));
      }, 1200);

      setCustomQuote(stage.refuseMessage);
      showBubbleTemporarily(7000);
      return;
    }

    // 💤 Kedi uyurken sevilmeye çalışıldığında: Sinirlenme efekti & rahat bırak tepkisi!
    if (isSleepingState) {
      playHissAngry();

      // Kırmızı öfke pufu efekti 💢
      const newAnger = { id: Date.now() + Math.random(), x, y, icon: '💢' };
      setClickHearts(prev => [...prev.slice(-6), newAnger]);
      setTimeout(() => {
        setClickHearts(prev => prev.filter(h => h.id !== newAnger.id));
      }, 1200);

      const randomAnnoyed =
        SLEEPING_ANNOYED_QUOTES[Math.floor(Math.random() * SLEEPING_ANNOYED_QUOTES.length)];
      setCustomQuote(randomAnnoyed);
      showBubbleTemporarily(7000);
      return;
    }

    const newHeart = { id: Date.now() + Math.random(), x, y, icon: '💖' };
    setClickHearts(prev => [...prev.slice(-6), newHeart]);

    setTimeout(() => {
      setClickHearts(prev => prev.filter(h => h.id !== newHeart.id));
    }, 1200);

    directClickCountRef.current += 1;
    const currentClicks = directClickCountRef.current;

    // 😹 8. TIKLAMADA ÖZEL GIDIKLANMA REAKSİYONU! (Kullanıcı İsteği)
    if (currentClicks === 8) {
      confetti({
        particleCount: 50,
        spread: 75,
        origin: { x: (rect.left + rect.width / 2) / window.innerWidth, y: rect.top / window.innerHeight },
        colors: ['#ec4899', '#f472b6', '#38bdf8', '#fbbf24'],
      });
      playCuteMeow();
      setTimeout(() => playHappyPurr(), 300);
      triggerQuickAction('dance', 8000);
      setCustomQuote("İhihihi DUR YETER GIDIKLAMA MİYAV! 😂😻 Karnım aşırı gıdıklandı, patilerim birbirine dolandı mırrr! ✨");
      showBubbleTemporarily(8000);
      return;
    }

    // Kediye tıklandıkça yeni tatlı bir Kedice replik söylesin ve baloncuk açılsın!
    if (actionOverride) {
      setCustomQuote(getCatQuote(actionOverride));
    } else {
      setCustomQuote(getCatQuote('idle'));
    }
    showBubbleTemporarily(7000);

    playHeartBeatSound();
    if (activeRoom === 'bathroom') {
      playWaterSplashBubble();
    } else if (!isSleeping && actionOverride !== 'sleeping' && actionOverride !== 'laydown' && actionOverride !== 'dead') {
      // %25 ihtimalle sırtüstü (chilling) animasyonu oynasın, yoksa yalama
      const rand = Math.random();
      if (rand < 0.25) {
        // Sırtüstü yuvarlanma — "çok mutlu oldu!"
        triggerQuickAction('laydown', 5000);
        setCustomQuote(
          ['Göbeğimi açtım sana, güveniyorum çünkü mırrr 😻🐾',
           'Sırtüstü yuvarlandım, belly rubs lütfen miyav! 😻✨',
           'Bu kadar sevgi beni eritti mırrr 🥰🐾',
           'Karnımı kaşımayı unutma miyav! 😻💕',
          ][Math.floor(Math.random() * 4)]
        );
        showBubbleTemporarily(5000);
      } else {
        triggerQuickAction('licking', 30000);
      }
    } else {
      playHappyPurr();
    }

    if (onPet) onPet();
  };

  // 💬 Konuşma Baloncuğu Görünürlük & Otomatik Kaybolma
  const [bubbleVisible, setBubbleVisible] = useState(true);
  const bubbleTimerRef = useRef<NodeJS.Timeout | null>(null);

  const showBubbleTemporarily = (duration = 7000) => {
    setBubbleVisible(true);
    if (bubbleTimerRef.current) clearTimeout(bubbleTimerRef.current);
    bubbleTimerRef.current = setTimeout(() => {
      setBubbleVisible(false);
    }, duration);
  };

  // Sayfa ilk açıldığında 6 sn sonra baloncuk nazikçe kaybolsun
  useEffect(() => {
    showBubbleTemporarily(6000);
    return () => {
      if (bubbleTimerRef.current) clearTimeout(bubbleTimerRef.current);
    };
  }, []);

  // 🐟 Balıkla Besleme
  const handleFeedDirect = () => {
    if (activeRoom !== 'bedroom') setActiveRoom('bedroom');
    triggerQuickAction('eating', 30000);
  };

  // Hızlı Aksiyon Tetikleyici (30 saniye boyunca veya yeni tık gelene kadar aktif)
  const triggerQuickAction = (act: CatActionType, duration = 30000) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);

    setIsUserAction(true);

    // Her tıklamada o aksiyona özel yeni tatlı Kedice replik seç ve göster
    setCustomQuote(getCatQuote(act));
    showBubbleTemporarily(7000);

    // Eğer banyo seçildiyse doğrudan Banyo Odası'na geçsin!
    if (act === 'bathtub') {
      setActiveRoom('bathroom');
      setActionOverride('bathtub');
    } else {
      if (activeRoom === 'bathroom') {
        setActiveRoom('bedroom');
      }
      setActionOverride(act);
    }

    // 🎵 Her aksiyon için kendine özel ses efekti çalınsın!
    playAnimationAudio(act);

    const totalSeconds = Math.round(duration / 1000);
    setRemainingSecs(totalSeconds);

    countdownIntervalRef.current = setInterval(() => {
      setRemainingSecs(prev => {
        if (prev === null || prev <= 1) {
          if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    timerRef.current = setTimeout(() => {
      resetToNormal();
    }, duration);
  };

  // 💡 Işık Açma / Kapatma (Gece - Gündüz Modu & Kedi Tepkisi)
  const handleToggleLight = () => {
    const nextIsNight = !isNight;
    setIsNight(nextIsNight);

    if (nextIsNight) {
      // Işık KAPATILDI (Gece Modu)
      playYawnStretch();

      const isAlreadySleeping = isSleeping || actionOverride === 'sleeping';
      const isSleepy = actionOverride === 'sleepy';

      if (isAlreadySleeping) {
        const quotes = [
          'Işığı kapattın, mışıl mışıl rüyalara devam miyav... İyi geceler 🌙💤',
          'Karanlık oldu, sıcacık kıvrılıp uyumaya devam mırrr 😴🌙',
          'Mışıl mışıl uyuyorum, tatlı rüyalar miyavvv 🌙✨',
        ];
        setCustomQuote(quotes[Math.floor(Math.random() * quotes.length)]);
      } else if (isSleepy) {
        const quotes = [
          'Ooooh ışıklar söndü, tam da uykum gelmişti... Ben yatıyorum iyi geceler 🥱🌙',
          'Gözlerim kapanıyordu zaten, hemen yatağıma kıvrılıyorum mırrr 😴💤',
          'Esneyerek yatağıma geçiyorum, tatlı rüyalar miyavvv 🥱✨',
        ];
        setCustomQuote(quotes[Math.floor(Math.random() * quotes.length)]);
        triggerQuickAction('sleeping', 30000);
      } else {
        // Uykusu yoksa: "uykum yok ama yatayım madem"
        const quotes = [
          'Aaa ışıklar kapandı! Aslında hiç uykum yoktu ama... madem öyle ben de yatayım bari miyav 🥱💤',
          'Uykum yok ki ama karanlık oldu madem, gözlerimi dinlendireyim bari mırrr 🌙🐾',
          'Işığı kapattın madem, ben de kıvrılıp yatıyorum... İyi geceler miyav 🥱🌙',
          'Daha oynayacaktık ama madem öyle yatayım o zaman mırrr 😴💤',
        ];
        setCustomQuote(quotes[Math.floor(Math.random() * quotes.length)]);
        triggerQuickAction('sleeping', 30000);
      }

      showBubbleTemporarily(8000);
    } else {
      // Işık AÇILDI (Gündüz Modu)
      playCuteMeow();
      const quotes = [
        'Gözlerime ışık geldi miyav! Günaydınnn iki ayaklım ☀️🐱',
        'Işıklar açıldı! Oley oyun vakti miyavvv ☀️🎉',
        'Kocaman esnedim, güne hazırım miyav mırrr ☀️🌸',
      ];
      setCustomQuote(quotes[Math.floor(Math.random() * quotes.length)]);
      showBubbleTemporarily(7000);

      if (actionOverride === 'sleeping') {
        triggerQuickAction('sleepy', 8000);
      }
    }
  };

  const getStageTitle = (lvl: number) => {
    if (lvl <= 2) return 'Minik Yavru Pisi 🍼';
    if (lvl <= 5) return 'Meraklı Oyuncu Pisi 🧶';
    if (lvl <= 8) return 'Pofuduk Sevgi Kedisi 🌸';
    return 'Görkemli Sirius Kedisi 👑✨';
  };

  // Aktif baloncuk metni (Tatlı, Sevimli Yavru Kedi & Değişken)
  const getActiveBubbleText = () => {
    if (activeRoom === 'bathroom') {
      const bathQuotes = [
        'Foşş foşş! Köpükler burnuma kondu, pış pış banyo çok tatlı 🛁🫧',
        'Köpükten minik şapkam oldu miyav, bak pisi prense! 🛁👑',
        'Ilık su çok güzelmiş mırrr, mis gibi kokacağım 🛁🌸',
        'Köpük baloncuklarını patimle patlatıyorum miyav! 🛁🫧',
      ];
      return customQuote || bathQuotes[Math.floor(Math.random() * bathQuotes.length)];
    }
    // Aksiyon seçilmişse her zaman öncelikli olsun
    if (actionOverride) {
      return customQuote || getCatQuote(actionOverride);
    }
    // Eğer günlerce girilmediyse o günün özel durum repliğini söylesin!
    if (stage.day > 0 && !isFeeding && !isSleeping) {
      return customQuote || stage.quote;
    }
    if (isFeeding) {
      return customQuote || getCatQuote('eating');
    }
    if (isSleeping) {
      return customQuote || getCatQuote('sleeping');
    }
    if (mood === 'withered') {
      return 'Seni çok özledim... Bir görev yaparsan kucağına atlayıp mırıldarım 🥺🥀';
    }
    if (mood === 'hungry') {
      return 'Minik karnım guruldadı miyav, bana lezzetli bir tavuk verir misin? 🍗🥺';
    }
    if (mood === 'blooming') {
      return 'Mırrr mırrr! Kalbim pıt pıt atıyor, sana dünyanın en tatlı mırıltısını getirdim! 🌸💖';
    }
    return customQuote || getCatQuote('idle');
  };

  // Kedi uyuma durumunda mı?
  const isSleepingState = isSleeping || actionOverride === 'sleeping';

  // Kedi yerde uzanma durumunda mı?
  const isLyingState =
    actionOverride === 'laydown' ||
    actionOverride === 'dead' ||
    actionOverride === 'dead1' ||
    actionOverride === 'sick1' ||
    (stage.day >= 5 && !actionOverride && !isSleeping && !isFeeding);

  // Kedi mama yeme durumunda mı?
  const isEatingState = isFeeding || actionOverride === 'eating';

  // Küvet Renkleri
  const tubColors = [
    { row: 1, name: 'Mavi', color: '#38bdf8' },
    { row: 3, name: 'Pembe', color: '#f472b6' },
    { row: 0, name: 'Beyaz', color: '#f8fafc' },
    { row: 2, name: 'Yeşil', color: '#4ade80' },
    { row: 5, name: 'Mor', color: '#c084fc' },
    { row: 4, name: 'Ahşap', color: '#fbbf24' },
  ];

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: 580,
        margin: '0 auto',
        borderRadius: 24,
        overflow: 'hidden',
        border: mood === 'blooming' ? '2px solid rgba(244,114,182,0.65)' : '2px solid #3f3f46',
        boxShadow: mood === 'blooming'
          ? '0 0 45px rgba(244,114,182,0.25), 0 20px 50px rgba(0,0,0,0.85)'
          : '0 20px 50px rgba(0,0,0,0.85)',
        background: activeRoom === 'bathroom' ? '#1b2c38' : '#2b4554',
        userSelect: 'none',
        imageRendering: 'pixelated',
        transition: 'background 0.4s ease',
      }}
    >
      {/* ── 1. ODA ALANI (YATAK ODASI VEYA BANYO ODASI) ── */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '1 / 1',
          background: activeRoom === 'bathroom' ? '#1c2d38' : isNight ? '#425867' : '#adc9dc',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* İzometrik Oda Sahnesi: Odanın tavanı, köşeleri ve zemini kenarlardan kesilmeden tam görünür */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            transform: 'scale(0.88)',
            transformOrigin: 'center center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* A) ODA ARKA PLANI */}
        {activeRoom === 'bedroom' ? (
          <img
            src="/assets/cat_pixel/rooms_bg/example_room_2.png"
            alt="İzometrik Kedi Odası"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              imageRendering: 'pixelated',
              filter: isNight || isSleepingState
                ? 'brightness(0.6) contrast(1.1) hue-rotate(15deg)'
                : stage.darknessFilter !== 'none'
                ? stage.darknessFilter
                : mood === 'withered'
                ? 'grayscale(0.6) brightness(0.8)'
                : 'brightness(1.03)',
              transition: 'filter 0.5s ease',
            }}
          />
        ) : (
          /* B) BANYO ODASI ARKA PLANI */
          <div
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            <img
              src="/assets/cat_pixel/rooms_bg/bathroom_room.png"
              alt="İzometrik Banyo Odası"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                imageRendering: 'pixelated',
                filter: isNight
                  ? 'brightness(0.65) contrast(1.1)'
                  : 'brightness(1.05)',
              }}
            />

            {/* Havada Uçuşan Banyo Baloncukları */}
            <div className="bathroom-bubbles-container" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
              <span style={{ position: 'absolute', bottom: '25%', left: '42%', fontSize: '1.2rem', animation: 'bubbleFloat 3s infinite ease-in' }}>🫧</span>
              <span style={{ position: 'absolute', bottom: '30%', left: '56%', fontSize: '0.9rem', animation: 'bubbleFloat 2.6s 0.8s infinite ease-in' }}>🫧</span>
              <span style={{ position: 'absolute', bottom: '20%', left: '48%', fontSize: '1.4rem', animation: 'bubbleFloat 3.4s 1.5s infinite ease-in' }}>🫧</span>
              <span style={{ position: 'absolute', bottom: '35%', left: '38%', fontSize: '0.8rem', animation: 'bubbleFloat 2.8s 2s infinite ease-in' }}>🫧</span>
            </div>
          </div>
        )}

        {/* 🕸️ Forest İhmal / Terk Edilmişlik Örümcek Ağları (Cobwebs) */}
        {stage.webIntensity > 0 && activeRoom === 'bedroom' && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              zIndex: 28,
              transition: 'opacity 0.6s ease',
            }}
          >
            {/* Sol Üst Köşe Ağı */}
            <div
              style={{
                position: 'absolute',
                top: -4,
                left: -2,
                fontSize: `${1.4 + (stage.webIntensity / 100) * 1.5}rem`,
                opacity: Math.min(1, stage.webIntensity / 80),
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.6))',
                lineHeight: 1,
              }}
            >
              🕸️
            </div>

            {/* Sağ Üst Köşe Ağı */}
            <div
              style={{
                position: 'absolute',
                top: -4,
                right: -2,
                fontSize: `${1.4 + (stage.webIntensity / 100) * 1.5}rem`,
                opacity: Math.min(1, stage.webIntensity / 80),
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.6))',
                lineHeight: 1,
                transform: 'scaleX(-1)',
              }}
            >
              🕸️
            </div>

            {/* Sol Alt Ağı */}
            {stage.webIntensity >= 40 && (
              <div
                style={{
                  position: 'absolute',
                  bottom: 10,
                  left: 6,
                  fontSize: `${1.2 + (stage.webIntensity / 100) * 1.2}rem`,
                  opacity: Math.min(0.9, stage.webIntensity / 90),
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.6))',
                  lineHeight: 1,
                }}
              >
                🕸️
              </div>
            )}

            {/* Sağ Alt Ağı */}
            {stage.webIntensity >= 60 && (
              <div
                style={{
                  position: 'absolute',
                  bottom: 12,
                  right: 8,
                  fontSize: `${1.3 + (stage.webIntensity / 100) * 1.2}rem`,
                  opacity: Math.min(0.95, stage.webIntensity / 90),
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.6))',
                  lineHeight: 1,
                  transform: 'scaleX(-1)',
                }}
              >
                🕸️
              </div>
            )}

            {/* Ortamda Uçuşan Hüzün / Toz Emojisi */}
            {stage.ambientEmoji && (
              <div
                style={{
                  position: 'absolute',
                  top: '22%',
                  right: '20%',
                  fontSize: '1.3rem',
                  opacity: 0.65,
                  animation: 'floatUpHeart 3s infinite ease-in-out',
                }}
              >
                {stage.ambientEmoji}
              </div>
            )}
          </div>
        )}

        {/* 🌌 Sirius Yıldızı Tablosu (Duvardaki Tablo) */}
        {activeRoom === 'bedroom' && (
          <div
            onClick={e => {
              const rect = e.currentTarget.getBoundingClientRect();
              confetti({
                particleCount: 35,
                spread: 65,
                origin: { x: (rect.left + rect.width / 2) / window.innerWidth, y: rect.top / window.innerHeight },
                colors: ['#38bdf8', '#818cf8', '#fef08a', '#e0f2fe', '#c084fc'],
              });
              playHeartBeatSound();
              setCustomQuote("Miyav! Duvardaki Sirius yıldızına baktım... Tıpkı sizin gibi ışıl ışıl parıldıyor, aşkınız hiç sönmesin! 🌌⭐💖");
              showBubbleTemporarily(8000);
              triggerQuickAction('dance', 6000);
            }}
            style={{
              position: 'absolute',
              left: '36.3%',
              top: '26.0%',
              width: '7.2%',
              height: '12.0%',
              cursor: 'pointer',
              zIndex: 14,
              borderRadius: 2,
            }}
            title="🌌 Sirius Yıldızı Tablosu · Eren ve Özlem'in gökyüzündeki sonsuz rehber yıldızı (İncelemek için tıkla!)"
          >
            {/* Sirius Yıldızı Parlama Işığı */}
            <div
              style={{
                position: 'absolute',
                left: '42%',
                top: '54%',
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: 'radial-gradient(circle, #ffffff 0%, #38bdf8 65%, transparent 100%)',
                animation: 'siriusPulse 2.8s infinite ease-in-out',
                pointerEvents: 'none',
              }}
            />
          </div>
        )}

        {/* Mavi Yatağa Tıklama Alanı (Sadece Yatak Odasında) */}
        {activeRoom === 'bedroom' && (
          <div
            onClick={() => triggerQuickAction('sleeping', 30000)}
            style={{
              position: 'absolute',
              left: '40%',
              top: '43%',
              width: '22%',
              height: '16%',
              cursor: 'pointer',
              zIndex: 12,
            }}
            title="Mavi Yatak (Uyutmak için tıkla! 🛏️)"
          />
        )}

        {/* Mama Kabına Tıklama Alanı (Sadece Yatak Odasında) */}
        {activeRoom === 'bedroom' && (
          <div
            onClick={handleFeedDirect}
            style={{
              position: 'absolute',
              left: '42%',
              top: '76%',
              width: '20%',
              height: '10%',
              cursor: 'pointer',
              zIndex: 12,
            }}
            title="Mama Kabı (Beslemek için tıkla! 🍗)"
          />
        )}

        {/* ── 2. KEDİ KONUMU ── */}
        {activeRoom === 'bathroom' ? (
          /* 🛁 BANYO ODASI: KEDİ DOĞRUDAN KÖPÜKLÜ KÜVETİN İÇİNDE BELİRİR! */
          <div
            onClick={handleCatClick}
            style={{
              position: 'absolute',
              left: '50%',
              top: '55%',
              transform: 'translate(-50%, -50%)',
              cursor: 'pointer',
              zIndex: 25,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
            title="Banyo sefası! (Köpükleri patlatmak için tıkla 🫧)"
          >
            {clickHearts.map(h => (
              <div
                key={h.id}
                style={{
                  position: 'absolute',
                  left: h.x,
                  top: h.y,
                  pointerEvents: 'none',
                  transform: 'translate(-50%, -50%)',
                  animation: 'floatUpHeart 1.1s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                  zIndex: 60,
                  fontSize: '1.4rem',
                }}
              >
                🫧
              </div>
            ))}

            {bubbleVisible && (
              <div
                className="room-action-bubble bath"
                style={{ cursor: 'pointer' }}
                onClick={(e) => { e.stopPropagation(); setBubbleVisible(false); }}
                title="Kapatmak için tıkla ✕"
              >
                {getActiveBubbleText()}
              </div>
            )}

            <PixelCatSprite
              mood={mood}
              isSleeping={false}
              isPetted={false}
              isFeeding={false}
              actionOverride="bathtub"
              tubRow={selectedTubRow}
              scale={135}
            />
          </div>
        ) : isSleepingState ? (
          /* YATAK ODASI - MAVİ YATAKTA UYUYAN KEDİ */
          <div
            onClick={handleCatClick}
            style={{
              position: 'absolute',
              left: '49.5%',
              top: '49%',
              transform: 'translate(-50%, -50%)',
              cursor: 'pointer',
              zIndex: 25,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
            title="Mavi yatakta tatlı uykusunda! 🐾"
          >
            {clickHearts.map(h => (
              <div
                key={h.id}
                style={{
                  position: 'absolute',
                  left: h.x,
                  top: h.y,
                  pointerEvents: 'none',
                  transform: 'translate(-50%, -50%)',
                  animation: 'floatUpHeart 1.1s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                  zIndex: 60,
                  fontSize: '1.4rem',
                }}
              >
                {h.icon || '💖'}
              </div>
            ))}

            {bubbleVisible && (
              <div
                className="room-action-bubble sleeping"
                style={{ cursor: 'pointer' }}
                onClick={(e) => { e.stopPropagation(); setBubbleVisible(false); }}
                title="Kapatmak için tıkla ✕"
              >
                {getActiveBubbleText()}
              </div>
            )}

            <PixelCatSprite
              mood={mood}
              isSleeping={true}
              isPetted={false}
              isFeeding={false}
              actionOverride="sleeping"
              scale={78}
            />
          </div>
        ) : isLyingState ? (
          /* YATAK ODASI - YERDE UZANAN KEDİ */
          <div
            onClick={handleCatClick}
            style={{
              position: 'absolute',
              left: '60%',
              top: '64%',
              transform: 'translate(-50%, -50%)',
              cursor: 'pointer',
              zIndex: 25,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
            title="Yerde uzanıyor! 🐾"
          >
            {clickHearts.map(h => (
              <div
                key={h.id}
                style={{
                  position: 'absolute',
                  left: h.x,
                  top: h.y,
                  pointerEvents: 'none',
                  transform: 'translate(-50%, -50%)',
                  animation: 'floatUpHeart 1.1s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                  zIndex: 60,
                  fontSize: '1.4rem',
                }}
              >
                {h.icon || '💖'}
              </div>
            ))}

            {bubbleVisible && (
              <div
                className="room-action-bubble sleeping"
                style={{ cursor: 'pointer' }}
                onClick={(e) => { e.stopPropagation(); setBubbleVisible(false); }}
                title="Kapatmak için tıkla ✕"
              >
                {getActiveBubbleText()}
              </div>
            )}

            <PixelCatSprite
              mood={mood}
              isSleeping={false}
              isPetted={false}
              isFeeding={false}
              actionOverride={actionOverride || 'dead'}
              scale={88}
            />
          </div>
        ) : isEatingState ? (
          /* YATAK ODASI - ODADAKİ MAMA KABINDAN YİYEN KEDİ */
          <div
            onClick={handleCatClick}
            style={{
              position: 'absolute',
              left: '50.6%',
              top: '78.2%',
              transform: 'translate(-50%, -50%)',
              cursor: 'pointer',
              zIndex: 25,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
            title="Odadaki mama kabından afiyetle yiyor! 🐟"
          >
            {clickHearts.map(h => (
              <div
                key={h.id}
                style={{
                  position: 'absolute',
                  left: h.x,
                  top: h.y,
                  pointerEvents: 'none',
                  transform: 'translate(-50%, -50%)',
                  animation: 'floatUpHeart 1.1s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                  zIndex: 60,
                  fontSize: '1.4rem',
                }}
              >
                💖
              </div>
            ))}

            {bubbleVisible && (
              <div
                className="room-action-bubble eating"
                style={{ cursor: 'pointer' }}
                onClick={(e) => { e.stopPropagation(); setBubbleVisible(false); }}
                title="Kapatmak için tıkla ✕"
              >
                {getActiveBubbleText()}
              </div>
            )}

            <PixelCatSprite
              mood={mood}
              isSleeping={false}
              isPetted={false}
              isFeeding={true}
              actionOverride="eating"
              scale={84}
            />
          </div>
        ) : (
          /* YATAK ODASI - DİĞER CANLI DURUMLAR */
          <div
            onClick={handleCatClick}
            style={{
              position: 'absolute',
              left: '55%',
              top: '63%',
              transform: 'translate(-50%, -50%)',
              cursor: 'pointer',
              zIndex: 25,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
            title="Kediciği sevmek için tıkla! 🐾"
          >
            {clickHearts.map(h => (
              <div
                key={h.id}
                style={{
                  position: 'absolute',
                  left: h.x,
                  top: h.y,
                  pointerEvents: 'none',
                  transform: 'translate(-50%, -50%)',
                  animation: 'floatUpHeart 1.1s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                  zIndex: 60,
                  fontSize: '1.4rem',
                }}
              >
                {h.icon || '💖'}
              </div>
            ))}

            {bubbleVisible && (
              <div
                className={`room-action-bubble ${actionOverride || mood}`}
                style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}
                onClick={(e) => { e.stopPropagation(); setBubbleVisible(false); }}
                title="Kapatmak için tıkla ✕"
              >
                <div>
                  {getActiveBubbleText()}
                </div>
                {showBribeButton && onBribe && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onBribe();
                    }}
                    style={{
                      background: 'linear-gradient(180deg, #f59e0b 0%, #b45309 100%)',
                      color: '#fff',
                      border: '2px solid #fef08a',
                      borderRadius: 9999,
                      padding: '3px 10px',
                      fontSize: '0.7rem',
                      fontWeight: 900,
                      cursor: 'pointer',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.5)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      animation: 'pulse 1.5s infinite',
                    }}
                    title="Tavuk ikram ederek 4 sevgi hakkı al!"
                  >
                    <span>🍗 Rüşvet Ver</span>
                  </button>
                )}
              </div>
            )}

            <PixelCatSprite
              mood={mood}
              isSleeping={false}
              isPetted={false}
              isFeeding={false}
              actionOverride={actionOverride}
              scale={105}
            />
          </div>
        )}
        </div>

        {/* ── 3. ÜST ODA DEĞİŞTİRME & BİLGİ SEKMELERİ ── */}
        <div
          style={{
            position: 'absolute',
            top: 12,
            left: 12,
            right: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            zIndex: 40,
          }}
        >
          {/* ODA SEÇİM SEKMELERİ */}
          <div
            style={{
              background: 'rgba(15,23,42,0.85)',
              backdropFilter: 'blur(8px)',
              padding: '3px 4px',
              borderRadius: 9999,
              border: '1px solid rgba(255,255,255,0.18)',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <button
              onClick={() => {
                setActiveRoom('bedroom');
                if (actionOverride === 'bathtub') resetToNormal();
              }}
              style={{
                background: activeRoom === 'bedroom' ? '#3b82f6' : 'transparent',
                color: activeRoom === 'bedroom' ? '#fff' : '#94a3b8',
                border: 'none',
                padding: '4px 10px',
                borderRadius: 9999,
                fontSize: '0.72rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                transition: 'all 0.2s',
              }}
            >
              <Home size={12} />
              <span>Oda</span>
            </button>

            <button
              onClick={() => {
                setActiveRoom('bathroom');
                setActionOverride('bathtub');
                setRemainingSecs(30);
                if (onBath) onBath();
              }}
              style={{
                background: activeRoom === 'bathroom' ? '#0284c7' : 'transparent',
                color: activeRoom === 'bathroom' ? '#fff' : '#94a3b8',
                border: 'none',
                padding: '4px 10px',
                borderRadius: 9999,
                fontSize: '0.72rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                transition: 'all 0.2s',
              }}
            >
              <Bath size={12} />
              <span>Banyo 🫧</span>
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {stage.day > 0 && (
              <div
                style={{
                  background: `${stage.badgeColor}25`,
                  border: `1.5px solid ${stage.badgeColor}`,
                  color: stage.badgeColor,
                  fontSize: '0.68rem',
                  fontWeight: 900,
                  padding: '3px 9px',
                  borderRadius: 9999,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                }}
              >
                <span>{stage.badge}</span>
              </div>
            )}

            <button
              onClick={handleToggleLight}
              style={{
                background: 'rgba(15,23,42,0.85)',
                border: '1px solid rgba(255,255,255,0.18)',
                color: isNight ? '#fbbf24' : '#38bdf8',
                borderRadius: 9999,
                padding: '5px 10px',
                fontSize: '0.72rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
              }}
              title="Gece / Gündüz lambası"
            >
              {isNight ? <Moon size={13} /> : <Sun size={13} />}
            </button>
          </div>
        </div>

        {/* Banyo Odasında Küvet Renk Seçici Rozeti */}
        {activeRoom === 'bathroom' && (
          <div
            style={{
              position: 'absolute',
              bottom: 12,
              left: 12,
              right: 12,
              background: 'rgba(15,23,42,0.85)',
              backdropFilter: 'blur(8px)',
              padding: '6px 12px',
              borderRadius: 14,
              border: '1px solid rgba(56,189,248,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              zIndex: 35,
            }}
          >
            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#38bdf8' }}>
              🛁 Küvet Rengi:
            </span>
            <div style={{ display: 'flex', gap: 6 }}>
              {tubColors.map(tc => (
                <button
                  key={tc.row}
                  onClick={() => setSelectedTubRow(tc.row)}
                  style={{
                    background: selectedTubRow === tc.row ? tc.color : 'rgba(255,255,255,0.1)',
                    color: selectedTubRow === tc.row ? '#0f172a' : '#fff',
                    border: selectedTubRow === tc.row ? '1px solid #fff' : '1px solid rgba(255,255,255,0.2)',
                    padding: '3px 8px',
                    borderRadius: 9999,
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  {tc.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── 4. ALT PANEL & HIZLI BUTONLAR ── */}
      <div
        style={{
          background: '#131b24',
          borderTop: '1px solid #293847',
          padding: '12px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'nowrap', gap: 6 }}>
          <div
            className="cat-quick-anims-strip"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              overflowX: 'auto',
              flexWrap: 'nowrap',
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              flex: 1,
              paddingBottom: 2,
            }}
          >
            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#94a3b8', marginRight: 4, flexShrink: 0 }}>
              Hızlı Animasyonlar:
            </span>

            {/* 🛁 BANYO ODASI BUTONU (Yeni odada direkt küvette belirtsin) */}
            <button
              onClick={() => triggerQuickAction('bathtub', 30000)}
              style={{
                background: activeRoom === 'bathroom' ? 'rgba(56,189,248,0.35)' : 'rgba(56,189,248,0.15)',
                border: '1px solid rgba(56,189,248,0.5)',
                color: '#38bdf8',
                padding: '5px 11px',
                borderRadius: 9999,
                fontSize: '0.72rem',
                fontWeight: 800,
                cursor: 'pointer',
              }}
              title="Banyo Odası: Kedi direkt küvetin içinde köpük banyosu yapar"
            >
              🛁 BATHTUB
            </button>

            {/* 💉 SICK 1 (Animations - 5) */}
            <button
              onClick={() => triggerQuickAction('sick1', 30000)}
              style={{
                background: actionOverride === 'sick1' ? 'rgba(239,68,68,0.3)' : 'rgba(239,68,68,0.15)',
                border: '1px solid rgba(239,68,68,0.4)',
                color: '#fca5a5',
                padding: '5px 11px',
                borderRadius: 9999,
                fontSize: '0.72rem',
                fontWeight: 800,
                cursor: 'pointer',
              }}
              title="SICK 1: Serum bağlı kedi"
            >
              💉 SICK 1
            </button>

            {/* 🌡️ SICK 2 (Animations - 5) */}
            <button
              onClick={() => triggerQuickAction('sick2', 30000)}
              style={{
                background: actionOverride === 'sick2' ? 'rgba(245,158,11,0.3)' : 'rgba(245,158,11,0.15)',
                border: '1px solid rgba(245,158,11,0.4)',
                color: '#fcd34d',
                padding: '5px 11px',
                borderRadius: 9999,
                fontSize: '0.72rem',
                fontWeight: 800,
                cursor: 'pointer',
              }}
              title="SICK 2: Dereceyle ateş ölçen kedi"
            >
              🌡️ SICK 2
            </button>

            {/* 📦 BOX 1 (Animations - Box) */}
            <button
              onClick={() => triggerQuickAction('box1', 30000)}
              style={{
                background: actionOverride === 'box1' ? 'rgba(168,85,247,0.3)' : 'rgba(168,85,247,0.15)',
                border: '1px solid rgba(168,85,247,0.35)',
                color: '#c084fc',
                padding: '5px 11px',
                borderRadius: 9999,
                fontSize: '0.72rem',
                fontWeight: 800,
                cursor: 'pointer',
              }}
              title="BOX 1: Kutudan bakan kedi"
            >
              📦 BOX 1
            </button>


            {/* 😾 ANGRY */}
            <button
              onClick={() => triggerQuickAction('angry', 30000)}
              style={{
                background: actionOverride === 'angry' ? 'rgba(239,68,68,0.3)' : 'rgba(239,68,68,0.15)',
                border: '1px solid rgba(239,68,68,0.4)',
                color: '#f87171',
                padding: '5px 11px',
                borderRadius: 9999,
                fontSize: '0.72rem',
                fontWeight: 800,
                cursor: 'pointer',
              }}
            >
              😾 ANGRY
            </button>

            {/* 🪩 DANCE */}
            <button
              onClick={() => triggerQuickAction('dance', 30000)}
              style={{
                background: actionOverride === 'dance' ? 'rgba(236,72,153,0.3)' : 'rgba(236,72,153,0.15)',
                border: '1px solid rgba(236,72,153,0.4)',
                color: '#f472b6',
                padding: '5px 11px',
                borderRadius: 9999,
                fontSize: '0.72rem',
                fontWeight: 800,
                cursor: 'pointer',
              }}
              title="DANCE: Happy dance"
            >
              🪩 DANCE
            </button>

            {/* ➕ Ekstra Animasyonlar (5'er 5'er açılır) */}
            {EXTRA_ANIMATIONS.slice(0, extraAnimsCount).map(extra => (
              <button
                key={extra.action}
                onClick={() => triggerQuickAction(extra.action, 30000)}
                style={{
                  background: actionOverride === extra.action ? `rgba(${extra.bg},0.3)` : `rgba(${extra.bg},0.15)`,
                  border: `1px solid rgba(${extra.bg},0.4)`,
                  color: extra.color,
                  padding: '5px 11px',
                  borderRadius: 9999,
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
                title={extra.title}
              >
                {extra.emoji} {extra.name}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              setExtraAnimsCount(prev => (prev >= EXTRA_ANIMATIONS.length ? 0 : Math.min(prev + 5, EXTRA_ANIMATIONS.length)));
            }}
            aria-label={
              extraAnimsCount >= EXTRA_ANIMATIONS.length
                ? 'Collapse extra animations'
                : `Show more animations (+5) [${extraAnimsCount}/${EXTRA_ANIMATIONS.length}]`
            }
            title={
              extraAnimsCount >= EXTRA_ANIMATIONS.length
                ? 'Collapse'
                : `+5 Animations (${extraAnimsCount}/${EXTRA_ANIMATIONS.length})`
            }
            style={{
              background: extraAnimsCount > 0 ? '#334155' : '#1e293b',
              border: '1px solid #334155',
              color: '#fbbf24',
              width: 32,
              height: 32,
              padding: 0,
              borderRadius: 9999,
              fontSize: '1.15rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              lineHeight: 1,
              flexShrink: 0,
              transition: 'all 0.2s ease',
            }}
          >
            {extraAnimsCount >= EXTRA_ANIMATIONS.length ? '–' : <Plus size={16} strokeWidth={2.75} />}
          </button>
        </div>

        {/* Durum Bilgisi & 30s Geri Sayım */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 2, flexWrap: 'wrap', gap: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
              Active:{' '}
              <strong style={{ color: '#fbbf24' }}>
                {activeRoom === 'bathroom'
                  ? 'BATHTUB'
                  : actionOverride
                  ? USER_CAT_ANIMATIONS[actionOverride]?.label || actionOverride.toUpperCase()
                  : isSleeping
                  ? 'SLEEPING'
                  : 'IDLE'}
              </strong>
            </span>
            {remainingSecs !== null && isUserAction && (actionOverride || activeRoom === 'bathroom') && (
              <span
                style={{
                  background: 'rgba(56,189,248,0.18)',
                  border: '1px solid rgba(56,189,248,0.4)',
                  color: '#38bdf8',
                  padding: '2px 8px',
                  borderRadius: 9999,
                  fontSize: '0.68rem',
                  fontWeight: 800,
                }}
              >
                ⏳ {remainingSecs}s kaldı
              </span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {(isUserAction || activeRoom === 'bathroom') && (
              <button
                onClick={() => {
                  setActiveRoom('bedroom');
                  resetToNormal();
                }}
                style={{
                  background: 'rgba(239,68,68,0.15)',
                  border: '1px solid rgba(239,68,68,0.35)',
                  color: '#fca5a5',
                  padding: '2px 8px',
                  borderRadius: 9999,
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
                title="Normale dön ve odaya geç"
              >
                ✕ Normale Dön
              </button>
            )}
            <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
              Oda:{' '}
              <strong style={{ color: '#38bdf8' }}>
                {activeRoom === 'bathroom' ? 'Banyo Odası 🫧' : 'Yatak Odası 🛋️'}
              </strong>
            </span>
          </div>
        </div>
      </div>

      {/* ── CSS STİLLERİ ── */}
      <style>{`
        @keyframes playMouseSheet {
          0% { background-position: 0px 0px; }
          100% { background-position: -220px 0px; }
        }

        @keyframes mousePulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }

        @keyframes bubbleFloat {
          0% { transform: translateY(0) scale(0.8); opacity: 0; }
          20% { opacity: 0.9; }
          80% { opacity: 0.9; }
          100% { transform: translateY(-90px) scale(1.3); opacity: 0; }
        }

        .room-action-bubble {
          position: absolute;
          bottom: calc(100% + 10px);
          left: 50%;
          transform: translateX(-50%);
          padding: 8px 16px;
          border-radius: 18px;
          font-size: 0.75rem;
          font-weight: 700;
          white-space: normal;
          word-wrap: break-word;
          word-break: break-word;
          max-width: 240px;
          width: 240px;
          text-align: center;
          line-height: 1.45;
          box-shadow: 0 6px 20px rgba(0,0,0,0.7), 0 2px 8px rgba(0,0,0,0.5);
          animation: actionBubblePop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          z-index: 90;
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
          color: #f1f5f9;
          border: 1.5px solid rgba(148,163,184,0.3);
          backdrop-filter: blur(8px);
        }
        .room-action-bubble::after {
          content: '';
          position: absolute;
          bottom: -7px;
          left: 50%;
          transform: translateX(-50%);
          width: 14px;
          height: 7px;
          background: #1e293b;
          clip-path: polygon(0 0, 100% 0, 50% 100%);
        }

        .room-action-bubble.bath {
          background: #0369a1;
          color: #e0f2fe;
          border: 1.5px solid #38bdf8;
        }

        .room-action-bubble.angry {
          background: #450a0a;
          color: #fca5a5;
          border: 1.5px solid #ef4444;
        }

        .room-action-bubble.sleeping {
          background: #1e1b4b;
          color: #c7d2fe;
          border: 1.5px solid #6366f1;
        }

        .room-action-bubble.eating {
          background: #064e3b;
          color: #6ee7b7;
          border: 1.5px solid #10b981;
        }

        .room-action-bubble.dance, .room-action-bubble.blooming {
          background: #831843;
          color: #fbcfe8;
          border: 1.5px solid #f472b6;
        }

        @keyframes actionBubblePop {
          0% { transform: translateX(-50%) scale(0.6); opacity: 0; }
          100% { transform: translateX(-50%) scale(1); opacity: 1; }
        }

        @keyframes floatUpHeart {
          0% { transform: translate(-50%, -50%) scale(0.6); opacity: 1; }
          100% { transform: translate(-50%, -140px) scale(1.5); opacity: 0; }
        }

        @keyframes siriusPulse {
          0%, 100% {
            opacity: 0.4;
            transform: translate(-50%, -50%) scale(0.85);
            filter: drop-shadow(0 0 2px #60a5fa);
          }
          50% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.4);
            filter: drop-shadow(0 0 5px #38bdf8) drop-shadow(0 0 9px #818cf8);
          }
        }
      `}</style>
    </div>
  );
};
