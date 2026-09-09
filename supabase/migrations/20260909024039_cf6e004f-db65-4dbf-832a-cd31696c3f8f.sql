CREATE OR REPLACE VIEW public.review_public_feed AS
  SELECT r.id, r.name, r.country, r.country_code, r.avatar_url, r.rating, r.body,
         r.service, r.price, r.duration, r.repeat_client, r.is_sample, r.created_at
  FROM public.reviews r
  WHERE r.status <> 'rejected'::public.review_status;

GRANT SELECT ON public.review_public_feed TO anon, authenticated;

CREATE OR REPLACE VIEW public.review_public_stats AS
  SELECT count(*)::bigint AS total,
         COALESCE(round(avg(r.rating)::numeric, 1), 0) AS average,
         count(*) FILTER (WHERE r.rating = 5)::bigint AS s5,
         count(*) FILTER (WHERE r.rating = 4)::bigint AS s4,
         count(*) FILTER (WHERE r.rating = 3)::bigint AS s3,
         count(*) FILTER (WHERE r.rating = 2)::bigint AS s2,
         count(*) FILTER (WHERE r.rating = 1)::bigint AS s1
  FROM public.reviews r
  WHERE r.status <> 'rejected'::public.review_status;

GRANT SELECT ON public.review_public_stats TO anon, authenticated;

REVOKE ALL ON FUNCTION public.get_public_reviews(integer, integer) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.get_review_stats() FROM PUBLIC, anon, authenticated;