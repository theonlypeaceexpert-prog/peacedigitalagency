UPDATE public.reviews
SET status = 'approved'::public.review_status
WHERE status = 'pending'::public.review_status;

CREATE OR REPLACE FUNCTION public.get_public_reviews(_limit integer DEFAULT 6, _offset integer DEFAULT 0)
RETURNS TABLE(
  id uuid,
  name text,
  country text,
  country_code text,
  avatar_url text,
  rating smallint,
  body text,
  service text,
  price text,
  duration text,
  repeat_client boolean,
  is_sample boolean,
  created_at timestamp with time zone
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT r.id, r.name, r.country, r.country_code, r.avatar_url, r.rating, r.body,
         r.service, r.price, r.duration, r.repeat_client, r.is_sample, r.created_at
  FROM public.reviews r
  WHERE r.status <> 'rejected'::public.review_status
  ORDER BY r.created_at DESC
  LIMIT LEAST(GREATEST(COALESCE(_limit, 6), 1), 50)
  OFFSET GREATEST(COALESCE(_offset, 0), 0)
$function$;

CREATE OR REPLACE FUNCTION public.get_review_stats()
RETURNS TABLE(total bigint, average numeric, s5 bigint, s4 bigint, s3 bigint, s2 bigint, s1 bigint)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT count(*)::bigint,
         COALESCE(round(avg(rating)::numeric, 1), 0),
         count(*) FILTER (WHERE rating = 5)::bigint,
         count(*) FILTER (WHERE rating = 4)::bigint,
         count(*) FILTER (WHERE rating = 3)::bigint,
         count(*) FILTER (WHERE rating = 2)::bigint,
         count(*) FILTER (WHERE rating = 1)::bigint
  FROM public.reviews
  WHERE status <> 'rejected'::public.review_status
$function$;