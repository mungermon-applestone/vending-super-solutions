-- Create translations table for caching translated content
CREATE TABLE public.translations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  source_text TEXT NOT NULL,
  source_language VARCHAR(10) NOT NULL DEFAULT 'en',
  target_language VARCHAR(10) NOT NULL,
  translated_text TEXT NOT NULL,
  context TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create composite index for fast lookups
CREATE INDEX idx_translations_lookup ON public.translations (source_text, target_language);

-- Enable Row Level Security
ALTER TABLE public.translations ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (translations are public)
CREATE POLICY "Allow public read access to translations" 
ON public.translations 
FOR SELECT 
USING (true);

-- Create policy for system insert access (only edge functions can insert)
CREATE POLICY "Allow system insert access to translations" 
ON public.translations 
FOR INSERT 
WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_translations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_translations_updated_at
BEFORE UPDATE ON public.translations
FOR EACH ROW
EXECUTE FUNCTION public.update_translations_updated_at();