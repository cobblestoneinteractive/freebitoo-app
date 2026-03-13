import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://kfnzorkzzxtsqkdjfzag.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtmbnpvcmt6enh0c3FrZGpmemFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyODE4MjUsImV4cCI6MjA3OTg1NzgyNX0.NL1LrT6_j6Il6ZV-U8eYmoQ5Z3eKSLxWolgrLEn70GM'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})
