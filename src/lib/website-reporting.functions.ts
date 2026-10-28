import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { coversWebsite, equivalentPrevious, PUBLIC_PAGE_PATHS, requireAdminRole, validateRange, WEBSITE_ORIGIN, type SearchReport, type TechnicalReport, type PageCheck, type SeoIssue } from "./website-reporting";

const rangeSchema = z.object({ start: z.string(), end: z.string() });
const reportInput = z.object({ range: rangeSchema, refresh: z.boolean().default(false), property: z.string().max(500).optional() });

const adminMiddleware = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]);

export const getReportingAccess = adminMiddleware.handler(async ({ context }) => {
  const { data, error } = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" });
  if (error) throw new Error("Could not verify administrator access.");
  requireAdminRole(data);
  return { allowed: true };
});

export const getWebsiteOverview = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth]).inputValidator((input) => reportInput.parse(input))
  .handler(async ({ data, context }) => {
    const { data: role, error: roleError } = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" });
    if (roleError) throw new Error("Could not verify administrator access.");
    requireAdminRole(role);
    const range = validateRange(data.range), previous = equivalentPrevious(range);
    const { data: settings, error } = await context.supabase.from("website_report_settings").select("ga4_property_id,search_console_site").eq("id", "website").maybeSingle();
    if (error) throw new Error("Reporting settings could not be loaded.");
    const leads: { created_at: string; source: string; status: string }[] = [];
    for (let offset = 0; ; offset += 1000) {
      const result = await context.supabase.from("ai_leads").select("created_at,source,status")
        .gte("created_at", previous.start + "T00:00:00Z").lte("created_at", range.end + "T23:59:59.999Z")
        .order("created_at", { ascending: true }).order("id", { ascending: true }).range(offset, offset + 999);
      if (result.error) throw new Error("Lead reporting could not be loaded.");
      leads.push(...(result.data ?? []));
      if ((result.data?.length ?? 0) < 1000) break;
    }
    const current = leads.filter(l => l.created_at.slice(0,10) >= range.start);
    const before = leads.filter(l => l.created_at.slice(0,10) < range.start);
    const days = new Map<string, { label: string; primary: number; secondary: number }>();
    for (let stamp = Date.parse(range.start + "T00:00:00Z"); stamp <= Date.parse(range.end + "T00:00:00Z"); stamp += 86400000) {
      const label = new Date(stamp).toISOString().slice(0,10); days.set(label, { label, primary: 0, secondary: 0 });
    }
    for (const lead of current) { const day = days.get(lead.created_at.slice(0,10)); if (day) { day.primary++; if (lead.status === "completed") day.secondary++; } }
    return {
      settings, ga4: { connected: false, reason: "The connected Google Analytics credential supports browser tracking, not private GA4 reports. Authorize a read-analytics connection to display traffic data." },
      searchConfigured: Boolean(process.env['GOOGLE_SEARCH_CONSOLE_API_KEY']),
      leads: { total: current.length, previous: before.length, contact: current.filter(l => l.source === "contact").length, ai: current.filter(l => l.source === "ai").length, completed: current.filter(l => l.status === "completed").length, trend: [...days.values()] },
      refreshedAt: new Date().toISOString(), range,
    };
  });

export const saveReportingSettings = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth])
  .inputValidator(input => z.object({ ga4PropertyId: z.string().regex(/^\d*$/).max(30) }).parse(input))
  .handler(async ({ context, data }) => {
    const role = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" });
    requireAdminRole(role.error ? false : role.data);
    const result = await context.supabase.from("website_report_settings").upsert({ id: "website", ga4_property_id: data.ga4PropertyId || null, updated_at: new Date().toISOString() });
    if (result.error) throw new Error("Could not save reporting settings.");
    return { ok: true };
  });

export const getSearchPerformance = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth])
  .inputValidator(input => reportInput.parse(input)).handler(async ({ data, context }) => {
    const role = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" });
    requireAdminRole(role.error ? false : role.data);
    const range = validateRange(data.range);
    const key = process.env['GOOGLE_SEARCH_CONSOLE_API_KEY'], workspaceKey = process.env['LOVABLE_API_KEY'];
    if (!key || !workspaceKey) return { status: "setup_required" as const, message: "Connect Google Search Console in Lovable's connector settings." };
    async function call(path: string, body?: Record<string, unknown>) {
      const response = await fetch("https://connector-gateway.lovable.dev/google_search_console" + path, {
        method: body ? "POST" : "GET", headers: { Authorization: `Bearer ${workspaceKey}`, "X-Connection-Api-Key": key ?? "", "Content-Type": "application/json" },
        body: body ? JSON.stringify(body) : undefined, signal: AbortSignal.timeout(20000),
      });
      if (!response.ok) { const message = await response.text(); throw new Error(`Google Search Console [${response.status}]: ${message.slice(0, 800)}`); }
      return response.json();
    }
    const settings = await context.supabase.from("website_report_settings").select("search_console_site").eq("id", "website").maybeSingle();
    if (settings.error) throw new Error("Reporting settings could not be loaded.");
    const selected = data.property || settings.data?.search_console_site;
    const reportKey = `gsc:${selected ?? "auto"}:${range.start}:${range.end}`;
    const cache = await context.supabase.from("website_report_snapshots").select("payload,refreshed_at").eq("report_key", reportKey).maybeSingle();
    if (cache.error) throw new Error("Report cache could not be loaded.");
    if (!data.refresh && cache.data) return { status: "ok" as const, report: cache.data.payload as unknown as SearchReport, cached: true };
    if (cache.data && Date.now() - Date.parse(cache.data.refreshed_at) < 60000) return { status: "ok" as const, report: cache.data.payload as unknown as SearchReport, cached: true };
    const sites = await call("/webmasters/v3/sites") as { siteEntry?: { siteUrl: string; permissionLevel?: string }[] };
    const matches = (sites.siteEntry ?? []).filter(site => site.permissionLevel !== "siteUnverifiedUser" && coversWebsite(site.siteUrl)).map(s => s.siteUrl);
    if (!matches.length) return { status: "setup_required" as const, message: "Your Google account has no verified property covering www.deepeaceagency.com." };
    if (!selected && matches.length > 1) return { status: "selection_required" as const, candidates: matches };
    const property = selected ?? matches[0];
    if (!property || !matches.includes(property)) throw new Error("Select a verified property covering your website.");
    const base = `/webmasters/v3/sites/${encodeURIComponent(property)}`;
    type Row = { keys?: string[]; clicks?: number; impressions?: number; ctr?: number; position?: number };
    async function query(startDate: string, endDate: string, dimensions: string[] = []): Promise<Row[]> {
      const rows: Row[] = [];
      for (let startRow = 0; startRow < 50000; startRow += 25000) {
        const response = await call(base + "/searchAnalytics/query", { startDate, endDate, dimensions, rowLimit: 25000, startRow }) as { rows?: Row[] };
        rows.push(...(response.rows ?? []));
        if ((response.rows?.length ?? 0) < 25000) break;
      }
      return rows;
    }
    const prev = equivalentPrevious(range);
    // Sequential reads stop immediately on access failures or provider quota errors.
    const totals = await query(range.start, range.end);
    const before = await query(prev.start, prev.end);
    const dates = await query(range.start, range.end, ["date"]);
    const queries = await query(range.start, range.end, ["query"]);
    const pages = await query(range.start, range.end, ["page"]);
    const sitemapData = await call(base + "/sitemaps") as { sitemap?: { path: string; errors?: string; warnings?: string; lastSubmitted?: string; lastDownloaded?: string; isPending?: boolean }[] };
    const totalsOf = (row?: Row) => ({ clicks: row?.clicks ?? 0, impressions: row?.impressions ?? 0, ctr: row?.ctr ?? 0, position: row?.position ?? 0 });
    const table = (rows: Row[]) => rows.map(r => ({ label: r.keys?.[0] ?? "Unknown", value: r.clicks ?? 0, secondary: r.impressions ?? 0, ctr: r.ctr ?? 0, position: r.position ?? 0 }));
    const report: SearchReport = { ...totalsOf(totals[0]), previous: totalsOf(before[0]), trend: dates.map(r => ({ label: r.keys?.[0] ?? "", primary: r.clicks ?? 0, secondary: r.impressions ?? 0 })), queries: table(queries), pages: table(pages), sitemaps: (sitemapData.sitemap ?? []).map(s => ({ url: s.path, errors: Number(s.errors ?? 0), warnings: Number(s.warnings ?? 0), submitted: s.lastSubmitted ?? null, downloaded: s.lastDownloaded ?? null, pending: Boolean(s.isPending) })), property, range, refreshedAt: new Date().toISOString() };
    const saved = await context.supabase.from("website_report_settings").upsert({ id: "website", search_console_site: property, updated_at: report.refreshedAt });
    if (saved.error) throw new Error("Could not save the selected property.");
    const stored = await context.supabase.from("website_report_snapshots").upsert({ report_key: reportKey, payload: JSON.parse(JSON.stringify(report)), refreshed_at: report.refreshedAt });
    if (stored.error) throw new Error("Could not store the search report.");
    return { status: "ok" as const, report, cached: false };
  });

export const runTechnicalAudit = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const role = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" });
    requireAdminRole(role.error ? false : role.data);
    const issues: SeoIssue[] = [];
    async function read(url: string) {
      const started = Date.now();
      const response = await fetch(url, { signal: AbortSignal.timeout(15000), redirect: "manual" });
      // Do not follow redirects to arbitrary hosts from server-side checks.
      if (response.status >= 300 && response.status < 400) return { status: response.status, text: "", finalUrl: new URL(response.headers.get("location") ?? url, url).href, responseMs: Date.now() - started };
      return { status: response.status, text: (await response.text()).slice(0,2000000), finalUrl: url, responseMs: Date.now() - started };
    }
    function attribute(tag: string, name: string) { return tag.match(new RegExp(`\\b${name}\\s*=\\s*["']([^"']*)["']`, "i"))?.[1] ?? ""; }
    const pages: PageCheck[] = [];
    const linkedPaths = new Set<string>();
    for (const path of PUBLIC_PAGE_PATHS) {
      const url = WEBSITE_ORIGIN + path;
      try {
        const result = await read(url);
        const tags = result.text.match(/<(?:link|meta|a)\b[^>]*>/gi) ?? [];
        const canonical = tags.filter(t => attribute(t,"rel").toLowerCase() === "canonical").map(t => attribute(t,"href"));
        const noindex = tags.some(t => /^(robots|googlebot)$/i.test(attribute(t,"name")) && /noindex/i.test(attribute(t,"content")));
        const title = result.text.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1] ?? "";
        const description = tags.some(t => attribute(t,"name") === "description" && Boolean(attribute(t,"content")));
        pages.push({ url, status: result.status, finalUrl: result.finalUrl, canonical, noindex, title, description, responseMs: result.responseMs });
        if (result.status !== 200) issues.push({ key: `http:${path}`, severity: "high", url, title: `Page returned HTTP ${result.status}`, action: "Verify page routing and deployment. Redirects were not followed by this check." });
        if (canonical.length !== 1 || canonical[0] !== url) issues.push({ key: `canonical:${path}`, severity: "high", url, title: "Missing or conflicting self-canonical", action: `Publish exactly one canonical pointing to ${url}.` });
        if (noindex) issues.push({ key: `noindex:${path}`, severity: "high", url, title: "Public page marked noindex", action: "Verify whether this restriction is intentional before removing it." });
        if (!title || !description) issues.push({ key: `metadata:${path}`, severity: "medium", url, title: "Missing title or description", action: "Add page-specific metadata." });
        for (const tag of tags.filter(t => /^<a\b/i.test(t))) {
          const href = attribute(tag,"href");
          if (!href || /^(mailto:|tel:|javascript:|#)/i.test(href)) continue;
          try { const link = new URL(href,url); if (link.origin === WEBSITE_ORIGIN && !/\.[a-z0-9]+$/i.test(link.pathname)) { linkedPaths.add(link.pathname); if (link.search || (link.pathname !== "/" && link.pathname.endsWith("/"))) issues.push({ key: `link:${link.pathname}${link.search}`, severity: "low", url, title: "Internal link uses an alternate URL", action: `Link directly to ${WEBSITE_ORIGIN}${link.pathname.replace(/\/$/, "") || "/"}.` }); } } catch { /* Ignore malformed external links. */ }
        }
      } catch { pages.push({ url, status: null, finalUrl: url, canonical: [], noindex: false, title: "", description: false, responseMs: 0, error: "Page fetch unavailable" }); issues.push({ key: `fetch:${path}`, severity: "medium", url, title: "Page could not be checked", action: "Retry the check; this does not establish a Google fetch failure." }); }
    }
    for (const path of [...linkedPaths].filter(p => !PUBLIC_PAGE_PATHS.includes(p)).slice(0,30)) {
      try { const result = await read(WEBSITE_ORIGIN + path); if (result.status >= 400) issues.push({ key: `broken:${path}`, severity: "high", url: WEBSITE_ORIGIN + path, title: "Broken internal link", action: "Correct the link target or restore the page." }); } catch { issues.push({ key: `unverified-link:${path}`, severity: "low", url: WEBSITE_ORIGIN + path, title: "Internal link could not be checked", action: "Verify this destination manually." }); }
    }
    const robots = await read(WEBSITE_ORIGIN + "/robots.txt").catch(() => null);
    const sitemap = await read(WEBSITE_ORIGIN + "/sitemap.xml").catch(() => null);
    const robotsAllowed = robots?.status === 200 ? !/User-agent:\s*\*[\s\S]*?Disallow:\s*\/\s*(?:\n|$)/i.test(robots.text) : null;
    const sitemapUrls = [...(sitemap?.text ?? "").matchAll(/<loc>\s*([^<]+)\s*<\/loc>/g)].map(m => m[1].trim());
    if (robotsAllowed === false) issues.push({ key: "robots", severity: "high", url: WEBSITE_ORIGIN + "/robots.txt", title: "Wildcard crawler block detected", action: "Confirm whether blocking all crawlers is intended." });
    if (!robots?.text.includes(`Sitemap: ${WEBSITE_ORIGIN}/sitemap.xml`)) issues.push({ key: "robots-sitemap", severity: "medium", url: WEBSITE_ORIGIN + "/robots.txt", title: "Preferred sitemap directive missing", action: "Publish the custom-domain sitemap directive." });
    if (sitemap?.status !== 200 || !sitemapUrls.length || sitemapUrls.some(u => !PUBLIC_PAGE_PATHS.some(p => WEBSITE_ORIGIN + p === u))) issues.push({ key: "sitemap", severity: "high", url: WEBSITE_ORIGIN + "/sitemap.xml", title: "Sitemap does not list preferred public URLs only", action: "Publish the canonical sitemap and exclude private pages." });
    const redirects: TechnicalReport["redirects"] = [];
    for (const url of ["http://deepeaceagency.com/", "https://deepeaceagency.com/", "http://www.deepeaceagency.com/"]) {
      try { const result = await read(url); redirects.push({ url, finalUrl: result.finalUrl, status: result.status, hops: null }); } catch { redirects.push({ url, finalUrl: "Unverified", status: null, hops: null }); }
    }
    const states = await context.supabase.from("website_seo_issue_states").select("issue_key,state");
    if (states.error) throw new Error("Could not load issue review states.");
    return { pages, issues, robotsAllowed, sitemapUrls, sitemapStatus: sitemap?.status ?? null, robotsStatus: robots?.status ?? null, redirects, checkedAt: new Date().toISOString(), states: states.data };
  });

export const updateSeoIssue = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth])
  .inputValidator(input => z.object({ key: z.string().min(1).max(1000), state: z.enum(["open", "reviewed", "resolved"]) }).parse(input))
  .handler(async ({ context, data }) => {
    const role = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" });
    requireAdminRole(role.error ? false : role.data);
    const result = await context.supabase.from("website_seo_issue_states").upsert({ issue_key: data.key, state: data.state, updated_by: context.userId, updated_at: new Date().toISOString() });
    if (result.error) throw new Error("Could not update issue review state.");
    return { ok: true };
  });