DO $$ BEGIN
  CREATE TYPE public.lead_status AS ENUM ('new','contacted','in_progress','completed','archived');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

ALTER TABLE public.ai_leads
  ADD COLUMN IF NOT EXISTS source text NOT NULL DEFAULT 'ai',
  ADD COLUMN IF NOT EXISTS status public.lead_status NOT NULL DEFAULT 'new',
  ADD COLUMN IF NOT EXISTS company text,
  ADD COLUMN IF NOT EXISTS service text,
  ADD COLUMN IF NOT EXISTS budget text;

DROP POLICY IF EXISTS "admins update leads" ON public.ai_leads;
CREATE POLICY "admins update leads" ON public.ai_leads
  FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

GRANT SELECT, UPDATE, DELETE ON public.ai_leads TO authenticated;
GRANT ALL ON public.ai_leads TO service_role;