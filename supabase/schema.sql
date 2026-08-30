-- ====================================================================
-- ANIHANE - TAM SUPABASE SCHEMA
-- Supabase SQL Editor'da bu dosyayı çalıştır
-- ====================================================================

-- 1. MEMORY CARDS (Anı Kartları)
CREATE TABLE IF NOT EXISTS public.memory_cards (
  id TEXT PRIMARY KEY,
  tab TEXT NOT NULL CHECK (tab IN ('timeline', 'eren', 'ozlem')),
  type TEXT NOT NULL DEFAULT 'photo',
  title TEXT NOT NULL,
  note TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  date TEXT DEFAULT '',
  added_by TEXT NOT NULL,
  added_by_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 2. DAILY SONGS (Günün Şarkısı)
CREATE TABLE IF NOT EXISTS public.daily_songs (
  id TEXT PRIMARY KEY,
  url TEXT NOT NULL,
  video_id TEXT NOT NULL,
  title TEXT NOT NULL,
  added_date TEXT NOT NULL,
  added_by TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 3. BUCKET LIST (Birlikte Yapılacaklar)
CREATE TABLE IF NOT EXISTS public.bucket_list (
  id TEXT PRIMARY KEY,
  text TEXT NOT NULL,
  done BOOLEAN DEFAULT false NOT NULL,
  color TEXT NOT NULL,
  rotation FLOAT DEFAULT 0,
  added_by TEXT NOT NULL,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 4. LETTERS (Mektuplar - opsiyonel)
CREATE TABLE IF NOT EXISTS public.letters (
  id TEXT PRIMARY KEY,
  for_tab TEXT NOT NULL CHECK (for_tab IN ('eren', 'ozlem')),
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- ====================================================================
-- ROW LEVEL SECURITY - Herkese okuma, herkese yazma (2 kişilik özel app)
-- ====================================================================

ALTER TABLE public.memory_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bucket_list ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.letters ENABLE ROW LEVEL SECURITY;

-- memory_cards politikaları
CREATE POLICY "Herkes okuyabilir" ON public.memory_cards FOR SELECT USING (true);
CREATE POLICY "Herkes ekleyebilir" ON public.memory_cards FOR INSERT WITH CHECK (true);
CREATE POLICY "Herkes silebilir" ON public.memory_cards FOR DELETE USING (true);

-- daily_songs politikaları
CREATE POLICY "Herkes okuyabilir" ON public.daily_songs FOR SELECT USING (true);
CREATE POLICY "Herkes ekleyebilir" ON public.daily_songs FOR INSERT WITH CHECK (true);
CREATE POLICY "Herkes silebilir" ON public.daily_songs FOR DELETE USING (true);

-- bucket_list politikaları
CREATE POLICY "Herkes okuyabilir" ON public.bucket_list FOR SELECT USING (true);
CREATE POLICY "Herkes ekleyebilir" ON public.bucket_list FOR INSERT WITH CHECK (true);
CREATE POLICY "Herkes güncelleyebilir" ON public.bucket_list FOR UPDATE USING (true);
CREATE POLICY "Herkes silebilir" ON public.bucket_list FOR DELETE USING (true);

-- letters politikaları
CREATE POLICY "Herkes okuyabilir" ON public.letters FOR SELECT USING (true);
CREATE POLICY "Herkes ekleyebilir" ON public.letters FOR INSERT WITH CHECK (true);
CREATE POLICY "Herkes silebilir" ON public.letters FOR DELETE USING (true);

-- ====================================================================
-- 5. HABIT ITEMS & HABIT CAT PROFILE (Alışkanlıklar & Kedicik Serisi)
-- ====================================================================

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

ALTER TABLE public.habit_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habit_cat_profile ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Herkes okuyabilir habit_items" ON public.habit_items FOR SELECT USING (true);
CREATE POLICY "Herkes ekleyebilir habit_items" ON public.habit_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Herkes güncelleyebilir habit_items" ON public.habit_items FOR UPDATE USING (true);
CREATE POLICY "Herkes silebilir habit_items" ON public.habit_items FOR DELETE USING (true);

CREATE POLICY "Herkes okuyabilir habit_cat_profile" ON public.habit_cat_profile FOR SELECT USING (true);
CREATE POLICY "Herkes ekleyebilir habit_cat_profile" ON public.habit_cat_profile FOR INSERT WITH CHECK (true);
CREATE POLICY "Herkes güncelleyebilir habit_cat_profile" ON public.habit_cat_profile FOR UPDATE USING (true);
CREATE POLICY "Herkes silebilir habit_cat_profile" ON public.habit_cat_profile FOR DELETE USING (true);
