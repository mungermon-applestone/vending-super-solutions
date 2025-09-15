-- Security Hardening: Add explicit deny-all policies and revoke privileges
-- This will satisfy the security scanner's requirements for admin-only tables

-- Add explicit deny-all policies for admin_users table
CREATE POLICY "Explicit deny all for non-admins on admin_users INSERT" 
ON public.admin_users 
FOR INSERT 
TO anon, authenticated 
WITH CHECK (false);

CREATE POLICY "Explicit deny all for non-admins on admin_users UPDATE" 
ON public.admin_users 
FOR UPDATE 
TO anon, authenticated 
USING (false);

CREATE POLICY "Explicit deny all for non-admins on admin_users DELETE" 
ON public.admin_users 
FOR DELETE 
TO anon, authenticated 
USING (false);

-- Add explicit deny-all policies for contentful_config table
CREATE POLICY "Explicit deny all for non-admins on contentful_config SELECT" 
ON public.contentful_config 
FOR SELECT 
TO anon, authenticated 
USING (false);

-- Revoke default privileges on admin tables
REVOKE ALL ON public.admin_users FROM anon, authenticated;
REVOKE ALL ON public.contentful_config FROM anon, authenticated;

-- Grant only necessary privileges back (none needed for anon/authenticated since admins use service role)
-- The is_admin() function will continue to work via security definer privilege escalation

-- Add security comments
COMMENT ON TABLE public.admin_users IS 'Admin-only table with explicit deny-all policies for security scanner compliance';
COMMENT ON TABLE public.contentful_config IS 'Admin-only table with explicit deny-all policies for security scanner compliance';