-- Enable Row Level Security on the Secrets table
ALTER TABLE public."Secrets" ENABLE ROW LEVEL SECURITY;

-- Create RLS policies to restrict access to admin users only
CREATE POLICY "Only admins can view secrets" 
ON public."Secrets" 
FOR SELECT 
USING (is_admin(auth.uid()));

CREATE POLICY "Only admins can insert secrets" 
ON public."Secrets" 
FOR INSERT 
WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Only admins can update secrets" 
ON public."Secrets" 
FOR UPDATE 
USING (is_admin(auth.uid()));

CREATE POLICY "Only admins can delete secrets" 
ON public."Secrets" 
FOR DELETE 
USING (is_admin(auth.uid()));