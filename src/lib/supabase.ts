import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://cjdjzmsbjizauubynpuh.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqZGp6bXNiaml6YXV1YnlucHVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcyMjIwMTQsImV4cCI6MjEwMjc5ODAxNH0.VV0LhgNKhUmkW8eu0a_pHtJYWpVYb8IZKE_5u70xBFM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
