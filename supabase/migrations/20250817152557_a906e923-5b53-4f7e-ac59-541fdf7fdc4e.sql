-- Drop the existing overly permissive policy
DROP POLICY "Allow authenticated users to read contentful config" ON public.contentful_config;

-- Create restrictive RLS policies for admin users only
CREATE POLICY "Only admins can view contentful config" 
ON public.contentful_config 
FOR SELECT 
USING (is_admin(auth.uid()));

CREATE POLICY "Only admins can insert contentful config" 
ON public.contentful_config 
FOR INSERT 
WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Only admins can update contentful config" 
ON public.contentful_config 
FOR UPDATE 
USING (is_admin(auth.uid()));

CREATE POLICY "Only admins can delete contentful config" 
ON public.contentful_config 
FOR DELETE 
USING (is_admin(auth.uid()));