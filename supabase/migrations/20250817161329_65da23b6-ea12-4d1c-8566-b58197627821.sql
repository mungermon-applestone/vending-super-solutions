-- Remove sensitive tokens from contentful_config table for security
-- The delivery_token and management_token will now be stored as server-side secrets only

-- First, let's add the missing secrets that should be server-side only
-- These will be added through the secrets interface

-- Remove the sensitive token columns from the contentful_config table
-- Keep only the public/non-sensitive configuration
ALTER TABLE public.contentful_config 
DROP COLUMN IF EXISTS delivery_token,
DROP COLUMN IF EXISTS management_token;

-- The contentful_config table now only contains:
-- - space_id (public identifier, safe to store)
-- - environment_id (public identifier, safe to store)
-- This eliminates the security risk while maintaining the needed public configuration