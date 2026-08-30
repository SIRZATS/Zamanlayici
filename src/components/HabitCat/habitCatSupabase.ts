import { supabase } from '../../lib/supabase';
import { HabitItem, CatProfile } from './habitTypes';

export interface SupabaseSyncStatus {
  isAvailable: boolean;
  lastSyncedAt: Date | null;
  error: string | null;
}

// ─── HABIT DÖNÜŞTÜRÜCÜLER (DB <-> App) ───

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function dbRowToHabit(row: any): HabitItem {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    icon: row.icon || '🌟',
    color: row.color || '#3b82f6',
    completedDates: Array.isArray(row.completed_dates) ? row.completed_dates : [],
    completedByDates: typeof row.completed_by_dates === 'object' && row.completed_by_dates !== null ? row.completed_by_dates : {},
    targetDaysPerWeek: row.target_days_per_week ?? 7,
    createdAt: row.created_at || new Date().toISOString(),
    createdBy: row.created_by || 'Eren',
  };
}

export function habitToDbRow(habit: HabitItem) {
  return {
    id: habit.id,
    title: habit.title,
    category: habit.category,
    icon: habit.icon,
    color: habit.color,
    completed_dates: habit.completedDates,
    completed_by_dates: habit.completedByDates || {},
    created_by: habit.createdBy || 'Eren',
    created_at: habit.createdAt,
    updated_at: new Date().toISOString(),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function dbRowToProfile(row: any, currentToday: string): CatProfile {
  return {
    name: row.name || 'Pamuk Pisi',
    level: Number(row.level) || 1,
    xp: Number(row.xp) || 25,
    hunger: Number(row.hunger) ?? 70,
    happiness: Number(row.happiness) ?? 75,
    affection: Number(row.affection) ?? 85,
    energy: Number(row.energy) ?? 90,
    cleanliness: Number(row.cleanliness) ?? 70,
    currentStreak: Number(row.current_streak) ?? 1,
    bestStreak: Number(row.best_streak) ?? 1,
    lastActiveDate: row.last_active_date || currentToday,
    totalFishFed: Number(row.total_fish_fed) || 0,
    unlockedAccessories: Array.isArray(row.unlocked_accessories) ? row.unlocked_accessories : ['flower_crown'],
  };
}

export function profileToDbRow(profile: CatProfile) {
  return {
    id: 'main_profile',
    name: profile.name,
    level: profile.level,
    xp: profile.xp,
    hunger: profile.hunger,
    happiness: profile.happiness,
    affection: profile.affection,
    energy: profile.energy,
    cleanliness: profile.cleanliness,
    current_streak: profile.currentStreak,
    best_streak: profile.bestStreak,
    last_active_date: profile.lastActiveDate,
    total_fish_fed: profile.totalFishFed,
    unlocked_accessories: profile.unlockedAccessories || ['flower_crown'],
    updated_at: new Date().toISOString(),
  };
}

// ─── HABIT İŞLEMLERİ (Supabase) ───

export async function fetchHabitsFromSupabase(): Promise<HabitItem[] | null> {
  try {
    const { data, error } = await supabase
      .from('habit_items')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.warn('[Supabase HabitCat] habit_items tablosu okunamadı (yerel depolama kullanılacak):', error.message);
      return null;
    }
    return (data || []).map(dbRowToHabit);
  } catch (err) {
    console.warn('[Supabase HabitCat] fetchHabits hata:', err);
    return null;
  }
}

export async function saveHabitToSupabase(habit: HabitItem): Promise<boolean> {
  try {
    const row = habitToDbRow(habit);
    const { error } = await supabase.from('habit_items').upsert(row);
    if (error) {
      console.warn('[Supabase HabitCat] saveHabit hata:', error.message);
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export async function deleteHabitFromSupabase(habitId: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('habit_items').delete().eq('id', habitId);
    if (error) {
      console.warn('[Supabase HabitCat] deleteHabit hata:', error.message);
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

// ─── KEDİ PROFİLİ & SERİ SAYISI İŞLEMLERİ (Supabase) ───

export async function fetchProfileFromSupabase(currentToday: string): Promise<CatProfile | null> {
  try {
    const { data, error } = await supabase
      .from('habit_cat_profile')
      .select('*')
      .eq('id', 'main_profile')
      .maybeSingle();

    if (error) {
      console.warn('[Supabase HabitCat] habit_cat_profile tablosu okunamadı:', error.message);
      return null;
    }
    if (!data) return null;
    return dbRowToProfile(data, currentToday);
  } catch (err) {
    console.warn('[Supabase HabitCat] fetchProfile hata:', err);
    return null;
  }
}

export async function saveProfileToSupabase(profile: CatProfile): Promise<boolean> {
  try {
    const row = profileToDbRow(profile);
    const { error } = await supabase.from('habit_cat_profile').upsert(row);
    if (error) {
      console.warn('[Supabase HabitCat] saveProfile hata:', error.message);
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

// ─── REALTIME ABONELİK (Eren ↔ Özlem anlık canlı güncelleme) ───

export function subscribeToHabitCatChanges(
  onHabitsChange: () => void,
  onProfileChange: () => void
): () => void {
  try {
    const channel = supabase
      .channel('habit_cat_realtime_sync')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'habit_items' },
        () => {
          onHabitsChange();
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'habit_cat_profile' },
        () => {
          onProfileChange();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  } catch {
    return () => {};
  }
}
