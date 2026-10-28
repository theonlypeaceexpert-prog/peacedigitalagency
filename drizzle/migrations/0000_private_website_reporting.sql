GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
CREATE TABLE public.website_report_settings (
 id text PRIMARY KEY DEFAULT 'website' CHECK (id = 'website'),
 ga4_property_id text,
 search_console_site text,
 updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.website_report_settings TO authenticated;
GRANT ALL ON public.website_report_settings TO service_role;
ALTER TABLE public.website_report_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admins manage reporting settings" ON public.website_report_settings FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TABLE public.website_report_snapshots (
 report_key text PRIMARY KEY,
 payload jsonb NOT NULL,
 refreshed_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.website_report_snapshots TO authenticated;
GRANT ALL ON public.website_report_snapshots TO service_role;
ALTER TABLE public.website_report_snapshots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admins manage report snapshots" ON public.website_report_snapshots FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TABLE public.website_seo_issue_states (
 issue_key text PRIMARY KEY,
 state text NOT NULL CHECK (state IN ('open','reviewed','resolved')),
 updated_by uuid NOT NULL,
 updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.website_seo_issue_states TO authenticated;
GRANT ALL ON public.website_seo_issue_states TO service_role;
ALTER TABLE public.website_seo_issue_states ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admins manage SEO issue states" ON public.website_seo_issue_states FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));