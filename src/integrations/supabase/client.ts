
import { createClient } from '@supabase/supabase-js';

// Replace these values with your new Supabase project URL and anon key
export const supabase = createClient(
  'https://rwvlvooojegpebognnzn.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3dmx2b29vamVncGVib2dubnpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1Njg1ODcsImV4cCI6MjA2MjE0NDU4N30.a_sN-wS6z6EwaFxNdDwprjAyWamti8TPs3ODIps_4ZY',
  {
    auth: {
      persistSession: true,
      storage: localStorage,
      autoRefreshToken: true,
    }
  }
);
