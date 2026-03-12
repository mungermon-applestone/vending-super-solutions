
-- Create public storage bucket for doc-builder screenshots
INSERT INTO storage.buckets (id, name, public)
VALUES ('doc-builder-screenshots', 'doc-builder-screenshots', true);

-- Allow anyone to read from the bucket (public)
CREATE POLICY "Public read access for doc-builder-screenshots"
ON storage.objects FOR SELECT
USING (bucket_id = 'doc-builder-screenshots');

-- Allow authenticated users to upload to the bucket
CREATE POLICY "Authenticated users can upload to doc-builder-screenshots"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'doc-builder-screenshots');

-- Allow authenticated users to delete their uploads
CREATE POLICY "Authenticated users can delete from doc-builder-screenshots"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'doc-builder-screenshots');
