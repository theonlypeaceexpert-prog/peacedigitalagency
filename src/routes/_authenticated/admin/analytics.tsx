import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Activity, BarChart3, Search, ShieldCheck, Settings, RefreshCw, LogOut, ArrowUpRight, Loader2, Globe, LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Metric, ReportTable, Trend } from "@/components/admin/ReportViews";
import { getReportingAccess, getWebsiteOverview, getSearchPerformance, runTechnicalAudit, saveReportingSettings, updateSeoIssue } from "@/lib/website-reporting.functions";
import { completedLeadRate, type ReportRange } from "@/lib/website-reporting";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin/analytics")({
  head: () => ({ meta: [
    { title: "Private Website Analytics — DeePeace Agency" },
    { name: "description", content: "Administrator-only website reporting, Search Console performance and technical SEO checks for DeePeace Agency." },
    { name: "robots", content: "noindex, nofollow" },
    { property: "og:title", content: "Private Website Analytics — DeePeace Agency" },
    { property: "og:description", content: "Private reporting for authorized DeePeace Agency administrators." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
  ] }),
  component: AnalyticsDashboard,
});

const views = [
  { id: "overview", label: "Overview", icon: Activity },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "search", label: "SEO Performance", icon: Search },
  { id: "technical", label: "Technical SEO", icon: ShieldCheck },
  { id: "settings", label: "Settings", icon: Settings },
] as const;

function initialRange(days = 28): ReportRange {
  const end = new Date(); end.setUTCDate(end.getUTCDate()-2);
  const start = new Date(end); start.setUTCDate(start.getUTCDate()-days+1);
  return { start: start.toISOString().slice(0,10), end: end.toISOString().slice(0,10) };
}

function AnalyticsDashboard() {
  const navigate = useNavigate(), queryClient = useQueryClient();
  const accessFn = useServerFn(getReportingAccess), overviewFn = useServerFn(getWebsiteOverview), searchFn = useServerFn(getSearchPerformance), auditFn = useServerFn(runTechnicalAudit), saveFn = useServerFn(saveReportingSettings), issueFn = useServerFn(updateSeoIssue);
  const [view, setView] = useState<(typeof views)[number]["id"]>("overview");
  const [range, setRange] = useState<ReportRange>(()=>initialRange());
  const [property, setProperty] = useState<string | undefined>();
  const [propertyId, setPropertyId] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const access = useQuery({ queryKey: ["website-admin-access"], queryFn: () => accessFn(), retry: false });
  const enabled = access.data?.allowed === true;
  const overview = useQuery({ queryKey: ["website-overview",range], queryFn: ()=>overviewFn({ data: { range, refresh: false } }), enabled, retry: false });
  const search = useQuery({ queryKey: ["website-search",range,property], queryFn: ()=>searchFn({ data: { range, refresh: false, property } }), enabled: enabled && (view === "search" || view === "overview"), retry: false, staleTime: 86400000 });
  const audit = useQuery({ queryKey: ["website-technical"], queryFn: ()=>auditFn(), enabled: false, retry: false });
  const report = search.data?.status === "ok" ? search.data.report : null;
  const leads = overview.data?.leads;
  async function signOut() { await queryClient.cancelQueries(); queryClient.clear(); await supabase.auth.signOut(); await navigate({ to: "/auth", replace: true }); }
  async function refresh() {
    setBusy(true); setNotice("");
    try {
      if (view === "technical") await audit.refetch();
      else { await overview.refetch(); if (view === "search" || view === "overview") { const data = await searchFn({ data: { range, refresh: true, property } }); queryClient.setQueryData(["website-search",range,property], data); } }
      setNotice("Reports refreshed.");
    } catch(e) { setNotice(e instanceof Error ? e.message : "Refresh failed. Try again."); }
    finally { setBusy(false); }
  }
  const shell = "min-h-screen bg-background text-foreground";
  if (access.isPending) return <div className={`${shell} grid place-items-center`}><Loader2 className="animate-spin" aria-label="Verifying administrator access"/></div>;
  if (!enabled) return <div className={`${shell} grid place-items-center px-6`}><div className="max-w-md text-center"><LockKeyhole className="mx-auto h-10 w-10 text-muted-foreground"/><h1 className="mt-5 text-2xl font-semibold">Administrator access required</h1><p className="mt-3 text-sm text-muted-foreground">{access.error instanceof Error ? access.error.message : "This account is not authorized to view private reports."}</p><Button className="mt-6" onClick={signOut}><LogOut/>Sign out</Button></div></div>;

  return <div className={shell}>
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-border bg-card px-5 py-5 lg:px-8">
      <div><p className="font-display text-lg font-bold">DeePeace Agency<span className="ml-3 text-xs font-normal text-muted-foreground">PRIVATE WORKSPACE</span></p><p className="mt-1 text-xs text-muted-foreground">www.deepeaceagency.com</p></div>
      <div className="flex items-center gap-2"><Button asChild variant="ghost" size="sm"><Link to="/admin">Moderation<ArrowUpRight/></Link></Button><Button variant="outline" size="sm" onClick={signOut}><LogOut/>Sign out</Button></div>
    </header>
    <div className="lg:grid lg:grid-cols-[228px_minmax(0,1fr)]">
      <aside className="border-b border-border px-3 py-5 lg:min-h-[calc(100vh-90px)] lg:border-b-0 lg:border-r lg:px-5 lg:py-8">
        <nav aria-label="Reports" className="flex gap-1 overflow-x-auto lg:flex-col">{views.map(v=><Button key={v.id} variant={view === v.id ? "secondary" : "ghost"} onClick={()=>{setView(v.id);setNotice("");}} className="justify-start"><v.icon/>{v.label}</Button>)}</nav>
        <div className="mt-10 hidden border-t border-border pt-6 text-xs text-muted-foreground lg:block"><ShieldCheck className="mb-2 h-5 w-5"/>Authorized administrators only.<br/>Aggregated reports, no visitor profiles.</div>
      </aside>
      <main className="min-w-0 px-5 py-8 lg:px-10">
        <div className="flex flex-wrap items-start justify-between gap-5"><div><p className="text-xs font-medium uppercase text-muted-foreground">Website intelligence</p><h1 className="mt-2 text-3xl font-semibold">{views.find(v=>v.id===view)?.label}</h1><p className="mt-2 text-sm text-muted-foreground">{view === "search" ? "Google Search Console · organic search" : view === "technical" ? "Live website checks · not Google indexing verification" : "Your website's performance, clearly measured."}</p></div>
          <div className="flex flex-wrap items-center gap-2"><select aria-label="Reporting period" className="h-9 rounded-md border border-input bg-card px-3 text-sm" defaultValue="28" onChange={e=>{if(e.target.value!=="custom")setRange(initialRange(Number(e.target.value)));}}><option value="7">Last 7 days</option><option value="28">Last 28 days</option><option value="90">Last 3 months</option><option value="custom">Custom dates</option></select><Button variant="outline" size="icon" title="Refresh reports" aria-label="Refresh reports" disabled={busy} onClick={refresh}><RefreshCw className={busy?"animate-spin":""}/></Button></div>
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-3 text-xs text-muted-foreground"><label>From <input type="date" aria-label="Start date" value={range.start} onChange={e=>setRange(r=>({...r,start:e.target.value}))} className="ml-2 rounded-md border border-input bg-card p-2 text-foreground"/></label><label>To <input type="date" aria-label="End date" value={range.end} onChange={e=>setRange(r=>({...r,end:e.target.value}))} className="ml-2 rounded-md border border-input bg-card p-2 text-foreground"/></label><span>Search reports allow two days for Google's processing.</span></div>
        {notice && <p role="status" className="mt-5 border-l-2 border-accent bg-secondary/40 p-3 text-sm">{notice}</p>}
        {overview.error && <p role="alert" className="mt-5 text-sm text-destructive">{overview.error.message}</p>}

        {view === "overview" && <>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><Metric label="Lead submissions" value={leads?.total ?? null} previous={leads?.previous}/><Metric label="Contact form submissions" value={leads?.contact ?? null} note="Successfully saved contact inquiries"/><Metric label="Completed leads" value={leads?.completed ?? null} note="Current status of leads submitted in this period"/><Metric label="Completed lead share" value={leads?completedLeadRate(leads.completed,leads.total):null} suffix="%" note="Completed leads ÷ submitted leads; not visitor conversion rate"/></div>
          <div className="mt-8 border-y border-border py-6"><div className="flex items-center gap-2"><Globe className="h-5 w-5"/><h2 className="font-semibold">Google Analytics 4</h2></div><p className="mt-2 text-sm text-muted-foreground">Traffic reports unavailable. A browser tracking credential does not authorize private GA4 reports.</p><Button variant="link" onClick={()=>setView("settings")} className="mt-2 px-0">Review connection setup<ArrowUpRight/></Button></div>
          {leads && <Trend title="Lead submissions over time" rows={leads.trend} primary="Submissions" secondary="Currently completed"/>}
          <h2 className="mt-8 text-lg font-semibold">Google Search Console</h2><div className="mt-4 grid gap-4 sm:grid-cols-2"><Metric label="Google Search clicks" value={report?.clicks ?? null} previous={report?.previous.clicks}/><Metric label="Google Search impressions" value={report?.impressions ?? null} previous={report?.previous.impressions}/></div>
          {search.error && <p role="alert" className="mt-4 text-sm text-destructive">{search.error.message}</p>}
          <Button variant="link" className="mt-4 px-0" onClick={()=>setView("search")}>View SEO performance<ArrowUpRight/></Button>
        </>}
        {view === "analytics" && <section className="mt-8 border-t border-border py-10"><BarChart3 className="h-10 w-10 text-muted-foreground"/><h2 className="mt-5 text-2xl font-semibold">Connect GA4 reporting</h2><p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">Visitors, users, sessions, engagement, acquisition, landing pages, devices and geography require an authorized Google Analytics read connection. The linked credential is for browser tracking only. No traffic or conversion values are being substituted.</p><Button className="mt-6" onClick={()=>setView("settings")}>Connection settings<ArrowUpRight/></Button><p className="mt-5 text-xs text-muted-foreground">Visitor conversion rate will remain unavailable until sessions and a matching tracked conversion goal are available.</p></section>}
        {view === "search" && <>
          {search.isPending && <p className="mt-10 flex items-center gap-2 text-sm"><Loader2 className="h-4 w-4 animate-spin"/>Loading search reports…</p>}
          {search.error && <p role="alert" className="mt-8 text-sm text-destructive">{search.error.message}</p>}
          {search.data?.status === "setup_required" && <p className="mt-8 text-sm text-muted-foreground">{search.data.message}</p>}
          {search.data?.status === "selection_required" && <label className="mt-8 block text-sm">Select your verified Search Console property<select aria-label="Search Console property" defaultValue="" className="mt-3 block max-w-full rounded-md border border-input bg-card p-3" onChange={e=>setProperty(e.target.value)}><option value="" disabled>Choose a property</option>{search.data.candidates.map(p=><option key={p} value={p}>{p}</option>)}</select></label>}
          {report && <><p className="mt-6 break-words text-xs text-muted-foreground">{report.property} · Refreshed {new Date(report.refreshedAt).toLocaleString()} · {search.data?.status === "ok" && search.data.cached ? "Saved snapshot" : "Live API report"}</p><div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><Metric label="Search clicks" value={report.clicks} previous={report.previous.clicks}/><Metric label="Search impressions" value={report.impressions} previous={report.previous.impressions}/><Metric label="Average CTR" value={report.ctr*100} suffix="%" previous={report.previous.ctr*100}/><Metric label="Average position" value={report.position} note="Lower is better · impression-weighted average"/></div><Trend title="Search visibility over time" rows={report.trend} primary="Clicks" secondary="Impressions"/><ReportTable title="Search queries" rows={report.queries}/><ReportTable title="Pages appearing in Search" rows={report.pages}/><ReportTable title="Queries with impressions and low CTR" rows={report.queries.filter(r=>(r.secondary??0)>=20 && (r.ctr??0)<0.02)}/><p className="text-xs text-muted-foreground">Low CTR report: at least 20 impressions and below 2% CTR. Search Console is not a complete query inventory.</p><h2 className="mt-10 text-lg font-semibold">Submitted sitemaps</h2>{report.sitemaps.length ? report.sitemaps.map(s=><div key={s.url} className="mt-4 border-b border-border py-4 text-sm"><p className="break-all">{s.url}</p><p className="mt-2 text-muted-foreground">Errors: {s.errors} · Warnings: {s.warnings} · {s.pending ? "Pending" : "Processed"}</p><p className="mt-1 text-xs text-muted-foreground">Submitted: {s.submitted??"Unavailable"} · Downloaded: {s.downloaded??"Unavailable"}</p></div>) : <p className="mt-3 text-sm text-muted-foreground">Google returned no submitted sitemaps for this property.</p>}<p className="mt-6 text-xs text-muted-foreground">Full indexing reports and live URL tests require Search Console. Sitemap counts do not establish page indexing.</p></>}
          <Button asChild variant="outline" className="mt-6"><a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer">Open Google Search Console<ArrowUpRight/></a></Button>
        </>}
        {view === "technical" && <>
          <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-y border-border py-6"><p className="text-sm text-muted-foreground">Checks rendered public HTML, canonical URLs, links, robots and sitemap.</p><Button disabled={audit.isFetching} onClick={()=>void audit.refetch()}>{audit.isFetching?<Loader2 className="animate-spin"/>:<ShieldCheck/>}Run website checks</Button></div>
          {audit.error && <p role="alert" className="mt-5 text-sm text-destructive">{audit.error.message}</p>}
          {audit.data && <><p className="mt-5 text-xs text-muted-foreground">Checked {new Date(audit.data.checkedAt).toLocaleString()} · Against the published website, not the editor preview.</p><div className="mt-5 grid gap-4 sm:grid-cols-3"><Metric label="Public pages checked" value={audit.data.pages.length} note="Direct website fetches"/><Metric label="Issues observed" value={audit.data.issues.length} note="Review state is not a Google verdict"/><Metric label="Sitemap URLs" value={audit.data.sitemapUrls.length} note={`Sitemap HTTP ${audit.data.sitemapStatus??"unavailable"}`}/></div>
          <h2 className="mt-10 text-lg font-semibold">Prioritized issues</h2>{audit.data.issues.length===0 && <p className="mt-4 text-sm text-muted-foreground">No issues detected by these checks. Google indexing and Core Web Vitals remain separate, unverified signals.</p>}{[...audit.data.issues].sort((a,b)=>({high:0,medium:1,low:2}[a.severity]-{high:0,medium:1,low:2}[b.severity])).map(issue=><div key={issue.key} className="border-b border-border py-5"><div className="flex flex-wrap items-center justify-between gap-3"><p className="font-semibold"><span className={issue.severity==="high"?"mr-2 text-xs uppercase text-destructive":"mr-2 text-xs uppercase text-muted-foreground"}>{issue.severity}</span>{issue.title}</p><select aria-label={`Review state: ${issue.title}`} defaultValue={audit.data.states.find(s=>s.issue_key===issue.key)?.state??"open"} className="rounded-md border border-input bg-card p-2 text-xs" onChange={async e=>{try{await issueFn({data:{key:issue.key,state:e.target.value as "open"|"reviewed"|"resolved"}});setNotice("Review state saved. This does not change Google's indexing verdict.");}catch(err){setNotice(err instanceof Error?err.message:"Could not save review state.");}}}><option value="open">Open</option><option value="reviewed">Reviewed</option><option value="resolved">Resolved by admin</option></select></div><p className="mt-2 break-all text-xs text-muted-foreground">{issue.url}</p><p className="mt-2 text-sm">{issue.action}</p></div>)}
          <h2 className="mt-10 text-lg font-semibold">Page checks</h2><div className="mt-4 overflow-x-auto"><table className="w-full text-left text-xs"><thead className="border-b border-border"><tr><th className="py-3">Page</th><th>HTTP</th><th>Canonical</th><th>Index directive</th><th>Fetch time</th></tr></thead><tbody>{audit.data.pages.map(p=><tr key={p.url} className="border-b border-border"><td className="py-3 pr-3">{p.url.replace("https://www.deepeaceagency.com","")}</td><td className="px-2">{p.status??"Unavailable"}</td><td className="min-w-60 max-w-lg break-all px-2">{p.canonical.join(" · ")||"Not found"}</td><td className="px-2">{p.noindex?"noindex":"No noindex observed"}</td><td className="px-2">{p.responseMs?p.responseMs+"ms":"—"}</td></tr>)}</tbody></table></div><h2 className="mt-8 font-semibold">Host redirects</h2>{audit.data.redirects.map(r=><p key={r.url} className="mt-3 break-all text-xs text-muted-foreground">{r.url} → {r.finalUrl} · HTTP {r.status??"unverified"}</p>)}</>}
          <div className="mt-8 border-t border-border py-6 text-sm text-muted-foreground"><h2 className="font-semibold text-foreground">Checks not verified here</h2><p className="mt-2">Google indexing, field Core Web Vitals, exhaustive redirect chains, external links and full mobile usability. Fetch time is not LCP or a Lighthouse score.</p></div>
        </>}
        {view === "settings" && <section className="mt-8 max-w-3xl space-y-8">
          <div className="border-t border-border pt-6"><h2 className="text-lg font-semibold">Google Analytics 4</h2><p className="mt-2 text-sm text-muted-foreground">Reporting not connected. In Lovable's connectors, Google Analytics must use “Read analytics insights” rather than “Browser tracking”. If the read option is unavailable in this workspace, GA4 reports cannot yet be enabled through this connection.</p><label className="mt-5 block text-sm font-medium" htmlFor="ga4-property">GA4 property ID</label><input id="ga4-property" inputMode="numeric" placeholder={overview.data?.settings?.ga4_property_id??"Numeric property ID"} value={propertyId} onChange={e=>setPropertyId(e.target.value)} className="mt-2 w-full max-w-sm rounded-md border border-input bg-card p-3"/><Button className="mt-3 block" onClick={async()=>{try{await saveFn({data:{ga4PropertyId:propertyId}});setNotice("Property ID saved. Read access is still required before reports can load.");await overview.refetch();}catch(e){setNotice(e instanceof Error?e.message:"Settings could not be saved.");}}}>Save property</Button><Button asChild variant="link" className="mt-3 px-0"><a href="https://analytics.google.com/analytics/web/" target="_blank" rel="noopener noreferrer">Open Google Analytics<ArrowUpRight/></a></Button></div>
          <div className="border-t border-border pt-6"><h2 className="text-lg font-semibold">Google Search Console</h2><p className="mt-2 text-sm text-muted-foreground">{overview.data?.searchConfigured?"Connection credential configured; access is verified when reports refresh.":"No connection credential configured."}</p><p className="mt-3 break-all text-sm">Selected property: {overview.data?.settings?.search_console_site??"Not selected yet"}</p><Button variant="outline" className="mt-4" onClick={()=>{setProperty(undefined);setView("search");}}>View search reports</Button><p className="mt-4 text-xs text-muted-foreground">Google authorization and disconnect are managed in Lovable's connector settings. Only authorized administrators can read these reports.</p></div>
          <div className="border-t border-border pt-6"><h2 className="text-lg font-semibold">Report definitions</h2><p className="mt-3 text-sm text-muted-foreground">Leads count successfully saved inquiries by submission date. “Completed” uses each lead's current status, not a historic completion timestamp. Search reports are saved snapshots, with manual refresh and a one-minute minimum refresh interval. No daily schedule has been configured.</p></div>
        </section>}
      </main>
    </div>
  </div>;
}