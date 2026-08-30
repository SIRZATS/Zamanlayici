-- ====================================================================
-- HABIT CAT (ALIŞKANLIK KEDİSİ & SERİ SİSTEMİ) SUPABASE TABLOLARI
-- Bu dosyayı Supabase SQL Editor'da çalıştırın.
-- ====================================================================

-- 1. HABIT ITEMS (Alışkanlık Görevleri)
CREATE TABLE IF NOT EXISTS public.habit_items (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'daily',
  icon TEXT NOT NULL DEFAULT '🌟',
  color TEXT NOT NULL DEFAULT '#3b82f6',
  completed_dates JSONB DEFAULT '[]'::jsonb,
  completed_by_dates JSONB DEFAULT '{}'::jsonb,
  created_by TEXT NOT NULL DEFAULT 'Eren',
  created_at TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 2. HABIT CAT PROFILE (Kedicik Durumu, Seri Sayısı, Seviye & Besleme)
CREATE TABLE IF NOT EXISTS public.habit_cat_profile (
  id TEXT PRIMARY KEY DEFAULT 'main_profile',
  name TEXT NOT NULL DEFAULT 'Pamuk Pisi',
  level INT NOT NULL DEFAULT 1,
  xp INT NOT NULL DEFAULT 25,
  hunger INT NOT NULL DEFAULT 70,
  happiness INT NOT NULL DEFAULT 75,
  affection INT NOT NULL DEFAULT 85,
  energy INT NOT NULL DEFAULT 90,
  cleanliness INT NOT NULL DEFAULT 70,
  current_streak INT NOT NULL DEFAULT 1,
  best_streak INT NOT NULL DEFAULT 1,
  last_active_date TEXT NOT NULL,
  total_fish_fed INT NOT NULL DEFAULT 0,
  unlocked_accessories JSONB DEFAULT '["flower_crown"]'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) - Herkese okuma ve yazma izni (2 kişilik özel app)
-- ====================================================================

ALTER TABLE public.habit_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habit_cat_profile ENABLE ROW LEVEL SECURITY;

-- habit_items politikaları
DROP POLICY IF EXISTS "Herkes okuyabilir habit_items" ON public.habit_items;
CREATE POLICY "Herkes okuyabilir habit_items" ON public.habit_items FOR SELECT USING (true);

DROP POLICY IF EXISTS "Herkes ekleyebilir habit_items" ON public.habit_items;
CREATE POLICY "Herkes ekleyebilir habit_items" ON public.habit_items FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Herkes güncelleyebilir habit_items" ON public.habit_items;
CREATE POLICY "Herkes güncelleyebilir habit_items" ON public.habit_items FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Herkes silebilir habit_items" ON public.habit_items;
CREATE POLICY "Herkes silebilir habit_items" ON public.habit_items FOR DELETE USING (true);

-- habit_cat_profile politikaları
DROP POLICY IF EXISTS "Herkes okuyabilir habit_cat_profile" ON public.habit_cat_profile;
CREATE POLICY "Herkes okuyabilir habit_cat_profile" ON public.habit_cat_profile FOR SELECT USING (true);

DROP POLICY IF EXISTS "Herkes ekleyebilir habit_cat_profile" ON public.habit_cat_profile;
CREATE POLICY "Herkes ekleyebilir habit_cat_profile" ON public.habit_cat_profile FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Herkes güncelleyebilir habit_cat_profile" ON public.habit_cat_profile;
CREATE POLICY "Herkes güncelleyebilir habit_cat_profile" ON public.habit_cat_profile FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Herkes silebilir habit_cat_profile" ON public.habit_cat_profile;
CREATE POLICY "Herkes silebilir habit_cat_profile" ON public.habit_cat_profile FOR DELETE USING (true);

-- ====================================================================
-- REALTIME (Eren veya Özlem işaretlediğinde anında canlı senkron)
-- ====================================================================
DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.habit_items;
  EXCEPTION WHEN duplicate_object THEN
    -- Zaten ekliyse hata verme
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.habit_cat_profile;
  EXCEPTION WHEN duplicate_object THEN
    -- Zaten ekliyse hata verme
  END;
END $$;
