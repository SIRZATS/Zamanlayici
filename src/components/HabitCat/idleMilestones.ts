import { CatActionType } from './PixelCatSprite';

export interface IdleUnlockMilestone {
  level: number;
  habitsRequired: number;
  action: CatActionType;
  name: string;
  emoji: string;
  quote: string;
  durationMs: number;
}

// Tamamen orijinal sevimli açık renk kedi animasyonları (Siyah kedi çıkarıldı)
export const IDLE_UNLOCK_MILESTONES: IdleUnlockMilestone[] = [
  {
    level: 1,
    habitsRequired: 0,
    action: 'idle',
    name: 'Tatlı Bekleme',
    emoji: '🐾',
    quote: 'Odada usulca durup seni izliyorum miyav ✨',
    durationMs: 20_000,
  },
  {
    level: 2,
    habitsRequired: 10,
    action: 'licking',
    name: 'Pati Temizleme (Licking)',
    emoji: '👅',
    quote: '10 alışkanlık tamamlandı! Artık durduğum yerde patilerimi yalayarak temizleniyorum mırrr 🧼✨',
    durationMs: 30_000,
  },
  {
    level: 3,
    habitsRequired: 20,
    action: 'dance',
    name: 'Sevinç Dansı (Dance)',
    emoji: '🪩',
    quote: '20 alışkanlık tamamlandı! Artık durduğum yerde kendi kendime zafer dansı yapıyorum miyav 🪩🕺',
    durationMs: 28_000,
  },
  {
    level: 4,
    habitsRequired: 30,
    action: 'laydown',
    name: 'Mindere Uzanma (Lay Down)',
    emoji: '🛌',
    quote: '30 alışkanlık tamamlandı! Artık durduğum yerde mindere serilip kestiriyorum mırrr 🌸',
    durationMs: 35_000,
  },
  {
    level: 5,
    habitsRequired: 40,
    action: 'sleepy',
    name: 'Tatlı Esneme (Sleepy)',
    emoji: '🥱',
    quote: '40 alışkanlık tamamlandı! Artık durduğum yerde tatlı tatlı esneyip geriniyorum miyav 🥱💤',
    durationMs: 30_000,
  },
  {
    level: 6,
    habitsRequired: 50,
    action: 'excited',
    name: 'Heyecanlı Kuyruk (Excited)',
    emoji: '✨',
    quote: '50 alışkanlık tamamlandı! Artık durduğum yerde heyecanla pırpır edip kıpırdanıyorum miyav 💖🎉',
    durationMs: 28_000,
  },
  {
    level: 7,
    habitsRequired: 60,
    action: 'surprised',
    name: 'Meraklı Bakışlar (Surprised)',
    emoji: '👀',
    quote: '60 alışkanlık tamamlandı! Artık durduğum yerde merakla etrafı kolaçan ediyorum miyav 😲🔍',
    durationMs: 25_000,
  },
  {
    level: 8,
    habitsRequired: 70,
    action: 'box1',
    name: 'Kutuda Saklanma (Box Peek)',
    emoji: '📦',
    quote: '70 alışkanlık tamamlandı! Artık durduğum yerde kutunun içine girip sana bakıyorum miyav 📦😻',
    durationMs: 35_000,
  },
  {
    level: 9,
    habitsRequired: 80,
    action: 'box2',
    name: 'Kutuya Kıvrılma (Box In)',
    emoji: '📦',
    quote: '80 alışkanlık tamamlandı! Artık kutunun içine tatlıca kıvrılıp keyif çatıyorum miyav 📦✨',
    durationMs: 30_000,
  },
  {
    level: 10,
    habitsRequired: 90,
    action: 'shy',
    name: 'Utangaç Bakış (Shy)',
    emoji: '🙈',
    quote: '90 alışkanlık tamamlandı! Artık durduğum yerde Eren gibi yanaklarımı saklayıp utanıyorum miyav 🙈🥰',
    durationMs: 30_000,
  },
  {
    level: 11,
    habitsRequired: 100,
    action: 'box3',
    name: 'Kutudan Kuyruk Sallama (Box Tail)',
    emoji: '📡',
    quote: '100 ALIŞKANLIK! Kutunun içinden neşeyle kuyruğumu sallıyorum miyav 🏆🐾✨',
    durationMs: 28_000,
  },
  {
    level: 12,
    habitsRequired: 110,
    action: 'waiting',
    name: 'Kapıda Bekleme (Waiting)',
    emoji: '🚪',
    quote: '110 ALIŞKANLIK! Kapının önünde oturup sevinçle seni bekliyorum miyav 🚪😻',
    durationMs: 30_000,
  },
];

/**
 * Tamamlanan toplam alışkanlık sayısına göre seviye ve XP hesaplar
 */
export function getLevelAndXpFromCompletedCount(totalCompleted: number): {
  level: number;
  xp: number;
  unlockedMilestones: IdleUnlockMilestone[];
  nextMilestone: IdleUnlockMilestone | null;
  habitsUntilNextMilestone: number;
} {
  const level = 1 + Math.floor(totalCompleted / 10);
  const xp = (totalCompleted % 10) * 10; // 0..90%
  const unlockedMilestones = IDLE_UNLOCK_MILESTONES.filter(m => totalCompleted >= m.habitsRequired);
  const nextMilestone = IDLE_UNLOCK_MILESTONES.find(m => totalCompleted < m.habitsRequired) || null;
  const habitsUntilNextMilestone = nextMilestone ? nextMilestone.habitsRequired - totalCompleted : 0;

  return {
    level,
    xp,
    unlockedMilestones,
    nextMilestone,
    habitsUntilNextMilestone,
  };
}
