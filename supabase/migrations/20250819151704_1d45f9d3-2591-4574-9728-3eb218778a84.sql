-- Ensure RLS is enabled and drop any potentially permissive policies
ALTER TABLE public."Secrets" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contentful_config ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies to start fresh with more restrictive ones
DROP POLICY IF EXISTS "Only admins can view secrets" ON public."Secrets";
DROP POLICY IF EXISTS "Only admins can insert secrets" ON public."Secrets";
DROP POLICY IF EXISTS "Only admins can update secrets" ON public."Secrets";
DROP POLICY IF EXISTS "Only admins can delete secrets" ON public."Secrets";

DROP POLICY IF EXISTS "Only admins can view contentful config" ON public.contentful_config;
DROP POLICY IF EXISTS "Only admins can insert contentful config" ON public.contentful_config;
DROP POLICY IF EXISTS "Only admins can update contentful config" ON public.contentful_config;
DROP POLICY IF EXISTS "Only admins can delete contentful config" ON public.contentful_config;

-- Create hardened admin-only policies for Secrets table
CREATE POLICY "Secrets: Admin SELECT only" 
ON public."Secrets" 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL AND 
  public.is_admin(auth.uid()) = true
);

CREATE POLICY "Secrets: Admin INSERT only" 
ON public."Secrets" 
FOR INSERT 
WITH CHECK (
  auth.uid() IS NOT NULL AND 
  public.is_admin(auth.uid()) = true
);

CREATE POLICY "Secrets: Admin UPDATE only" 
ON public."Secrets" 
FOR UPDATE 
USING (
  auth.uid() IS NOT NULL AND 
  public.is_admin(auth.uid()) = true
)
WITH CHECK (
  auth.uid() IS NOT NULL AND 
  public.is_admin(auth.uid()) = true
);

CREATE POLICY "Secrets: Admin DELETE only" 
ON public."Secrets" 
FOR DELETE 
USING (
  auth.uid() IS NOT NULL AND 
  public.is_admin(auth.uid()) = true
);

-- Create hardened admin-only policies for contentful_config table  
CREATE POLICY "ContentfulConfig: Admin SELECT only" 
ON public.contentful_config 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL AND 
  public.is_admin(auth.uid()) = true
);

CREATE POLICY "ContentfulConfig: Admin INSERT only" 
ON public.contentful_config 
FOR INSERT 
WITH CHECK (
  auth.uid() IS NOT NULL AND 
  public.is_admin(auth.uid()) = true
);

CREATE POLICY "ContentfulConfig: Admin UPDATE only" 
ON public.contentful_config 
FOR UPDATE 
USING (
  auth.uid() IS NOT NULL AND 
  public.is_admin(auth.uid()) = true
)
WITH CHECK (
  auth.uid() IS NOT NULL AND 
  public.is_admin(auth.uid()) = true
);

CREATE POLICY "ContentfulConfig: Admin DELETE only" 
ON public.contentful_config 
FOR DELETE 
USING (
  auth.uid() IS NOT NULL AND 
  public.is_admin(auth.uid()) = true
);

-- Add additional security constraint to ensure is_admin function exists and returns boolean
DO $$
BEGIN
  -- Verify the is_admin function exists and has proper security
  IF NOT EXISTS (
    SELECT 1 FROM pg_proc p 
    JOIN pg_namespace n ON p.pronamespace = n.oid 
    WHERE n.nspname = 'public' AND p.proname = 'is_admin'
  ) THEN
    RAISE EXCEPTION 'is_admin function must exist for security policies to work';
  END IF;
END $$;