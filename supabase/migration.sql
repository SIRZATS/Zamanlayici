-- Eksik kolonları memory_cards tablosuna ekle
ALTER TABLE public.memory_cards ALTER COLUMN title DROP NOT NULL;
ALTER TABLE public.memory_cards ADD COLUMN IF NOT EXISTS content TEXT;
ALTER TABLE public.memory_cards ADD COLUMN IF NOT EXISTS spotify_url TEXT;
ALTER TABLE public.memory_cards ADD COLUMN IF NOT EXISTS letter_from TEXT;
ALTER TABLE public.memory_cards ADD COLUMN IF NOT EXISTS letter_to TEXT;
ALTER TABLE public.memory_cards ADD COLUMN IF NOT EXISTS letter_content TEXT;
ALTER TABLE public.memory_cards ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE public.memory_cards ADD COLUMN IF NOT EXISTS pin_color TEXT DEFAULT '#e85d04';
ALTER TABLE public.memory_cards ADD COLUMN IF NOT EXISTS rotation FLOAT DEFAULT 0;
