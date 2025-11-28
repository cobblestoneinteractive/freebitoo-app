import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://kfnzorkzzxtsqkdjfzag.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFub24iLCJpYXQiOjE3NjQyODE4MjUsImV4cCI6MjA3OTg1NzgyNX0.NL1LrT6_j6Il6ZV-U8eYmoQ5Z3eKSLxWolgrLEn70GM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);