
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  'https://eyxlqcavscrthjkonght.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5eGxxY2F2c2NydGhqa29uZ2h0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4MDI3MjEsImV4cCI6MjA1OTM3ODcyMX0.yg5kCaG6KvCqC-MvoKxTduEXPW6ZJrrn7PUcS_RMOBw',
  {
    auth: {
      persistSession: true,
      storage: localStorage,
      autoRefreshToken: true,
    }
  }
);
