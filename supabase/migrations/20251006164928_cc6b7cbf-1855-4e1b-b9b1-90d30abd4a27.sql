-- Fix overly permissive RLS policy on translations table
-- The translate-content edge function uses the service role key, which bypasses RLS
-- So we don't need an INSERT policy - only the service role (edge function) can insert
-- This prevents direct client-side spam via the Supabase anon key

-- Drop the overly permissive INSERT policy
DROP POLICY IF EXISTS "Allow system insert access to translations" ON translations;

-- The SELECT policy remains to allow public reads of cached translations
-- No INSERT policy needed: service role bypasses RLS, client cannot insert directly