export const WEBSITE_ORIGIN = "https://www.deepeaceagency.com";
export const PUBLIC_PAGE_PATHS = ["/", "/about", "/services", "/portfolio", "/ugc", "/case-studies", "/results", "/reviews", "/contact"];
export type ReportRange = { start: string; end: string };
export type SeriesRow = { label: string; primary: number; secondary: number };
export type TableRow = { label: string; value: number; secondary?: number; ctr?: number; position?: number };
export type SearchReport = {
  clicks: number; impressions: number; ctr: number; position: number;
  previous: { clicks: number; impressions: number; ctr: number; position: number };
  trend: SeriesRow[]; queries: TableRow[]; pages: TableRow[];
  sitemaps: { url: string; errors: number; warnings: number; submitted: string | null; downloaded: string | null; pending: boolean }[];
  property: string; range: ReportRange; refreshedAt: string;
};
export type SeoIssue = { key: string; severity: "high" | "medium" | "low"; url: string; title: string; action: string };
export type PageCheck = { url: string; status: number | null; finalUrl: string; canonical: string[]; noindex: boolean; title: string; description: boolean; responseMs: number; error?: string };
export type TechnicalReport = { pages: PageCheck[]; issues: SeoIssue[]; robotsAllowed: boolean | null; sitemapUrls: string[]; sitemapStatus: number | null; robotsStatus: number | null; redirects: { url: string; finalUrl: string; status: number | null; hops: number | null }[]; checkedAt: string };

export function canonicalUrl(path: string) {
  const pathname = new URL(path, WEBSITE_ORIGIN).pathname;
  return WEBSITE_ORIGIN + (pathname === "/" ? "/" : pathname.replace(/\/+$/, ""));
}

export function validateRange(range: ReportRange): ReportRange {
  const pattern = /^\d{4}-\d{2}-\d{2}$/;
  if (!pattern.test(range.start) || !pattern.test(range.end)) throw new Error("Choose valid reporting dates.");
  const start = Date.parse(range.start + "T00:00:00Z"), end = Date.parse(range.end + "T00:00:00Z");
  if (!Number.isFinite(start) || !Number.isFinite(end) || new Date(start).toISOString().slice(0,10) !== range.start || new Date(end).toISOString().slice(0,10) !== range.end || end < start || end - start > 366 * 86400000 || end > Date.now()) throw new Error("Choose a past date range of no more than one year.");
  return range;
}

export function equivalentPrevious(range: ReportRange): ReportRange {
  const start = Date.parse(range.start + "T00:00:00Z"), end = Date.parse(range.end + "T00:00:00Z");
  const length = end - start + 86400000;
  return { start: new Date(start - length).toISOString().slice(0, 10), end: new Date(start - 86400000).toISOString().slice(0, 10) };
}

export function percentChange(current: number, previous: number): number | null {
  return previous === 0 ? null : (current - previous) / previous * 100;
}

export function completedLeadRate(completed: number, total: number): number | null {
  return total > 0 ? completed / total * 100 : null;
}

export function coversWebsite(site: string): boolean {
  if (site.startsWith("sc-domain:")) {
    const domain = site.slice(10).toLowerCase();
    return new URL(WEBSITE_ORIGIN).hostname === domain || new URL(WEBSITE_ORIGIN).hostname.endsWith("." + domain);
  }
  try { return (WEBSITE_ORIGIN + "/").startsWith(new URL(site).href); } catch { return false; }
}

export function requireAdminRole(allowed: boolean | null | undefined) {
  if (allowed !== true) throw new Error("Administrator access required.");
}

export function toCsv(headers: string[], rows: (string | number | null | undefined)[][]) {
  return [headers, ...rows].map(row => row.map(value => {
    let text = String(value ?? "");
    if (/^[=+@\-\t\r]/.test(text)) text = "'" + text;
    return '"' + text.replaceAll('"', '""') + '"';
  }).join(",")).join("\r\n");
}