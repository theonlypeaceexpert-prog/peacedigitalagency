
CREATE TYPE public.app_role AS ENUM ('admin','moderator','user');
CREATE TYPE public.review_status AS ENUM ('pending','approved','rejected');

CREATE TABLE public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "users read own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "admins manage roles" ON public.user_roles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.reviews (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  country text not null default '',
  country_code text not null default '',
  avatar_url text,
  rating smallint not null,
  body text not null,
  service text not null default '',
  price text not null default '',
  duration text not null default '',
  repeat_client boolean not null default false,
  is_sample boolean not null default false,
  status public.review_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  CONSTRAINT reviews_rating_range CHECK (rating >= 1 AND rating <= 5),
  CONSTRAINT reviews_name_len CHECK (char_length(name) BETWEEN 2 AND 80),
  CONSTRAINT reviews_body_len CHECK (char_length(body) BETWEEN 10 AND 2000)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reviews TO authenticated;
GRANT INSERT ON public.reviews TO anon;
GRANT ALL ON public.reviews TO service_role;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone can submit a pending review" ON public.reviews FOR INSERT TO anon, authenticated
  WITH CHECK (status = 'pending' AND is_sample = false);
CREATE POLICY "admins read reviews" ON public.reviews FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admins update reviews" ON public.reviews FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admins delete reviews" ON public.reviews FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));

CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;
CREATE TRIGGER reviews_updated_at BEFORE UPDATE ON public.reviews FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE FUNCTION public.get_public_reviews(_limit int DEFAULT 6, _offset int DEFAULT 0)
RETURNS TABLE (
  id uuid, name text, country text, country_code text, avatar_url text,
  rating smallint, body text, service text, price text, duration text,
  repeat_client boolean, is_sample boolean, created_at timestamptz
) LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT r.id, r.name, r.country, r.country_code, r.avatar_url, r.rating, r.body,
         r.service, r.price, r.duration, r.repeat_client, r.is_sample, r.created_at
  FROM public.reviews r
  WHERE r.status = 'approved'
  ORDER BY r.created_at DESC
  LIMIT LEAST(GREATEST(COALESCE(_limit,6),1),50) OFFSET GREATEST(COALESCE(_offset,0),0)
$$;
GRANT EXECUTE ON FUNCTION public.get_public_reviews(int,int) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.get_review_stats()
RETURNS TABLE (total bigint, average numeric, s5 bigint, s4 bigint, s3 bigint, s2 bigint, s1 bigint)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT count(*)::bigint,
         COALESCE(round(avg(rating)::numeric,1),0),
         count(*) FILTER (WHERE rating = 5)::bigint,
         count(*) FILTER (WHERE rating = 4)::bigint,
         count(*) FILTER (WHERE rating = 3)::bigint,
         count(*) FILTER (WHERE rating = 2)::bigint,
         count(*) FILTER (WHERE rating = 1)::bigint
  FROM public.reviews WHERE status = 'approved'
$$;
GRANT EXECUTE ON FUNCTION public.get_review_stats() TO anon, authenticated;

CREATE TABLE public.ai_leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  website text,
  phone text,
  question text not null,
  conversation_summary text,
  reason text,
  created_at timestamptz not null default now()
);
GRANT SELECT, UPDATE, DELETE ON public.ai_leads TO authenticated;
GRANT ALL ON public.ai_leads TO service_role;
ALTER TABLE public.ai_leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admins read leads" ON public.ai_leads FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admins delete leads" ON public.ai_leads FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));

CREATE POLICY "read review avatars" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'review-avatars');
CREATE POLICY "upload review avatars" ON storage.objects FOR INSERT TO anon, authenticated WITH CHECK (bucket_id = 'review-avatars');

INSERT INTO public.reviews (name, country, country_code, rating, body, service, price, duration, repeat_client, is_sample, status) VALUES
('Sample Client', 'Netherlands', 'NL', 5, 'Peace completely transformed the structure and user experience of our store. The new layout feels much more professional, and the recommendations were practical rather than just theoretical.', 'Shopify Store Optimization', '$350', '3 weeks', false, true, 'approved'),
('Sample Client', 'United Kingdom', 'GB', 5, 'We came in with a slow store and several technical issues. The problems were clearly explained and fixed without making the process complicated. Communication throughout the project was excellent.', 'Website Performance Optimization', '$220', '10 days', false, true, 'approved'),
('Sample Client', 'United States', 'US', 5, 'The SEO work gave our product pages much better structure and clarity. I particularly appreciated the detailed explanations and the fact that everything was focused on long-term growth.', 'SEO & Product Optimization', '$300', '4 weeks', true, true, 'approved'),
('Sample Client', 'Germany', 'DE', 5, 'The Facebook and Instagram campaign structure was much more organized than what we had before. We finally had a clearer understanding of what was working and what needed to change.', 'Facebook & Instagram Ads', '$260', '4 weeks', false, true, 'approved'),
('Sample Client', 'Australia', 'AU', 5, 'Great experience from start to finish. The website improvements made the store feel more trustworthy and much easier to navigate on mobile.', 'eCommerce Website Design', '$280', '2 weeks', true, true, 'approved');
