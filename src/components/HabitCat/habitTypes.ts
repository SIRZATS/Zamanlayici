export type CatMood = 'blooming' | 'healthy' | 'hungry' | 'withered';

export type HabitCategory = 'health' | 'love' | 'mind' | 'fitness' | 'daily' | 'education';

export interface HabitItem {
  id: string;
  title: string;
  category: HabitCategory;
  icon: string;
  color: string;
  completedDates: string[]; // ISO date strings 'YYYY-MM-DD'
  completedByDates?: Record<string, string>; // 'YYYY-MM-DD': 'Eren' | 'Özlem'
  targetDaysPerWeek?: number;
  createdAt: string;
  createdBy: string;
}

export interface CatProfile {
  name: string;
  level: number; // 1 to 10+
  xp: number; // 0 to 100 per level
  hunger: number; // 0 to 100 (100 = tam tok)
  happiness: number; // 0 to 100
  affection: number; // 0 to 100 (Sevgi & İlgi Bağı / Kedi Sevme)
  energy: number; // 0 to 100 (Enerji & Dinlenme)
  cleanliness: number; // 0 to 100 (Temizlik & Banyo)
  currentStreak: number; // consecutive days
  bestStreak: number;
  lastActiveDate: string; // 'YYYY-MM-DD'
  totalFishFed: number;
  unlockedAccessories: string[];
  activeAccessory?: string;
}

export interface FocusSession {
  durationMinutes: number;
  completedAt: string;
  rewardXp: number;
}
