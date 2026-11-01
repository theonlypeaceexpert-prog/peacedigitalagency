-- Review avatars are uploaded and signed server-side with the privileged client
-- (via /api/public/review-avatars and the getReviewAvatarUrls server function),
-- so no anonymous client access to the private bucket is needed anymore.

DROP POLICY IF EXISTS "read review avatars" ON storage.objects;
DROP POLICY IF EXISTS "upload review avatars" ON storage.objects;
DROP POLICY IF EXISTS "public can read review avatars" ON storage.objects;
DROP POLICY IF EXISTS "anyone can upload a review avatar" ON storage.objects;
