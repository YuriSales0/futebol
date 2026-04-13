-- Create storage bucket for player videos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'videos',
  'videos',
  false,
  524288000, -- 500MB
  ARRAY['video/mp4', 'video/quicktime', 'video/webm', 'video/x-msvideo']
);

-- Storage RLS policies
CREATE POLICY "Players can upload to their own folder"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'videos'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Players can read their own videos"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'videos'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Players can delete their own videos"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'videos'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Create storage bucket for avatars
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/webp']
);

CREATE POLICY "Anyone can view avatars"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Players can upload their own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Players can update their own avatar"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
