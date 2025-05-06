
import { createClient } from '@supabase/supabase-js';

// Replace these values with your new Supabase project URL and anon key
export const supabase = createClient(
  'https://YOUR_NEW_PROJECT_URL.supabase.co',
  'YOUR_NEW_PROJECT_ANON_KEY',
  {
    auth: {
      persistSession: true,
      storage: localStorage,
      autoRefreshToken: true,
    }
  }
);
