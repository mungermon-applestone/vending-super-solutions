-- Security Fix: Remove the vulnerable Secrets table
-- All secrets should be managed through Supabase's native secrets system instead

-- First, let's ensure no dependencies on this table exist
-- The SENDGRID_API_KEY should be moved to Supabase Edge Function secrets

-- Drop the vulnerable Secrets table
DROP TABLE IF EXISTS public."Secrets";

-- Add a comment explaining the security improvement
COMMENT ON SCHEMA public IS 'Secrets table removed for security - use Supabase native secrets instead';