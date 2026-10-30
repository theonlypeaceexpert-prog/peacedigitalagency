import { useState } from "react";
import { Download, ArrowDownUp } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { Button } from "@/components/ui/button";
import { percentChange, toCsv, type SeriesRow, type TableRow } from "@/lib/website-reporting";

export function Metric({ label, value, previous, suffix = "", note }: { label: string; value: number | null; previous?: number; suffix?: string; note?: string }) {
  const change = value !== null && previous !== undefined ? percentChange(value, previous) : null;
  return <div className="rounded-lg border border-border bg-card p-5">
    <p className="text-sm text-muted-foreground">{label}</p>
    <p className="mt-3 font-display text-3xl font-semibold tabular-nums">{value === null ? "—" : value.toLocaleString(undefined, { maximumFractionDigits: 2 })}{value !== null && suffix}</p>
    <p className="mt-3 text-xs text-muted-foreground">{note ?? (change === null ? "No comparable previous data" : `${change >= 0 ? "+" : ""}${change.toFixed(1)}% vs previous period`)}</p>
  </div>;
}

export function Trend({ title, rows, primary, secondary }: { title: string; rows: SeriesRow[]; primary: string; secondary: string }) {
  return <section className="min-w-0 border-b border-border py-8">
    <h2 className="text-lg font-semibold">{title}</h2>
    {rows.length ? <div className="mt-6 h-72 w-full"><ResponsiveContainer width="100%" height="100%"><LineChart data={rows} margin={{ left: 0, right: 18, bottom: 12 }}>
      <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false}/><XAxis dataKey="label" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} minTickGap={45}/>
      <YAxis width={42} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}/><Tooltip contentStyle={{ background: "var(--card)", borderColor: "var(--border)", color: "var(--foreground)" }}/><Legend/>
      <Line name={primary} type="monotone" dataKey="primary" stroke="var(--foreground)" strokeWidth={2} dot={false}/><Line name={secondary} type="monotone" dataKey="secondary" stroke="var(--accent)" strokeWidth={2} dot={false}/>
    </LineChart></ResponsiveContainer></div> : <p className="py-12 text-sm text-muted-foreground">No recorded data for this period.</p>}
  </section>;
}

export function ReportTable({ title, rows, primary = "Clicks", secondary = "Impressions" }: { title: string; rows: TableRow[]; primary?: string; secondary?: string }) {
  const [sort, setSort] = useState<"value" | "secondary">("value");
  const sorted = [...rows].sort((a,b) => (b[sort] ?? 0) - (a[sort] ?? 0));
  function exportRows() {
    const csv = toCsv(["Name",primary,secondary,"CTR (%)","Position"], sorted.map(r => [r.label,r.value,r.secondary,r.ctr === undefined ? null : r.ctr*100,r.position]));
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a"); a.href=url; a.download=title.toLowerCase().replaceAll(" ","-")+".csv"; a.click(); URL.revokeObjectURL(url);
  }
  return <section className="min-w-0 py-8">
    <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-lg font-semibold">{title}</h2><Button variant="outline" size="sm" disabled={!rows.length} onClick={exportRows}><Download/>CSV</Button></div>
    {!rows.length ? <p className="py-10 text-sm text-muted-foreground">No reported rows in this period. Google may omit anonymized queries.</p> : <div className="mt-5 overflow-x-auto"><table className="w-full text-left text-sm"><thead className="border-b border-border text-muted-foreground"><tr><th className="py-3 font-medium">Name</th><th><Button size="sm" variant="ghost" onClick={()=>setSort("value")}>{primary}<ArrowDownUp/></Button></th><th><Button size="sm" variant="ghost" onClick={()=>setSort("secondary")}>{secondary}<ArrowDownUp/></Button></th><th className="font-medium">CTR</th><th className="font-medium">Position</th></tr></thead><tbody>{sorted.slice(0,100).map(r=><tr key={r.label} className="border-b border-border"><td className="min-w-48 max-w-sm break-words py-3 pr-4">{r.label}</td><td className="px-3 tabular-nums">{r.value.toLocaleString()}</td><td className="px-3 tabular-nums">{r.secondary?.toLocaleString() ?? "—"}</td><td className="px-3 tabular-nums">{r.ctr === undefined ? "—" : (r.ctr*100).toFixed(2)+"%"}</td><td className="px-3 tabular-nums">{r.position?.toFixed(1) ?? "—"}</td></tr>)}</tbody></table><p className="mt-3 text-xs text-muted-foreground">Showing up to 100 rows; CSV includes all retrieved rows.</p></div>}
  </section>;
}