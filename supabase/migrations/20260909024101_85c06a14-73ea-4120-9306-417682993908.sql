ALTER VIEW public.review_public_feed SET (security_invoker = true);
ALTER VIEW public.review_public_stats SET (security_invoker = true);

GRANT SELECT (id, name, country, country_code, avatar_url, rating, body, service, price, duration, repeat_client, is_sample, created_at)
ON public.reviews TO anon;
GRANT SELECT (rating) ON public.reviews TO anon;

CREATE POLICY "public can read non-rejected review fields"
ON public.reviews
FOR SELECT
TO anon
USING (status <> 'rejected'::public.review_status);