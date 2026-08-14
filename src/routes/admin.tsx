import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { Check, Loader2, LogOut, Trash2, X } from "lucide-react";
import { Layout } from "@/components/site/Layout";
import { supabase } from "@/integrations/supabase/client";
import { flagOf, timeAgo } from "@/lib/reviews";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Review Moderation — DǝǝPeaçeAɠency" },
      { name: "description", content: "Private moderation dashboard for client reviews and AI assistant leads." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Review Moderation — DǝǝPeaçeAɠency" },
      { property: "og:description", content: "Private moderation dashboard for client reviews and AI assistant leads." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: AdminPage,
});

type Row = {
  id: string;
  name: string;
  email: string | null;
  country: string;
  country_code: string;
  rating: number;
  body: string;
  service: string;
  price: string;
  duration: string;
  repeat_client: boolean;
  status: "pending" | "approved" | "rejected";
  created_at: string;
};

type Lead = {
  id: string;
  name: string;
  email: string;
  website: string | null;
  phone: string | null;
  question: string;
  created_at: string;
};

function AdminPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [rows, setRows] = useState<Row[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [tab, setTab] = useState<"pending" | "approved" | "rejected" | "leads">("pending");
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    const [{ data: reviewData }, { data: leadData }] = await Promise.all([
      supabase.from("reviews").select("*").order("created_at", { ascending: false }),
      supabase.from("ai_leads").select("*").order("created_at", { ascending: false }),
    ]);
    setRows((reviewData ?? []) as Row[]);
    setLeads((leadData ?? []) as Lead[]);
  }, []);

  useEffect(() => {
    let active = true;
    void (async () => {
      const { data } = await supabase.auth.getUser();
      if (!active) return;
      if (!data.user) {
        void navigate({ to: "/auth" });
        return;
      }
      const { data: admin } = await supabase.rpc("has_role", {
        _user_id: data.user.id,
        _role: "admin",
      });
      if (!active) return;
      setIsAdmin(Boolean(admin));
      if (admin) await load();
      setReady(true);
    })();
    return () => {
      active = false;
    };
  }, [navigate, load]);

  const setStatus = async (id: string, status: Row["status"]) => {
    setBusyId(id);
    await supabase.from("reviews").update({ status }).eq("id", id);
    await load();
    setBusyId(null);
  };

  const remove = async (id: string) => {
    setBusyId(id);
    await supabase.from("reviews").delete().eq("id", id);
    await load();
    setBusyId(null);
  };

  if (!ready) {
    return (
      <Layout>
        <div className="grid min-h-[50vh] place-items-center">
          <Loader2 className="animate-spin text-muted-foreground" />
        </div>
      </Layout>
    );
  }

  if (!isAdmin) {
    return (
      <Layout>
        <section className="mx-auto max-w-2xl px-6 py-24 text-center">
          <h1 className="font-display text-3xl font-bold">No admin access</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            This account isn't an approved moderator.
          </p>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              void navigate({ to: "/auth" });
            }}
            className="mt-6 rounded-full border border-border px-6 py-2.5 text-sm font-semibold"
          >
            Sign out
          </button>
        </section>
      </Layout>
    );
  }

  const filtered = tab === "leads" ? [] : rows.filter((r) => r.status === tab);
  const counts = {
    pending: rows.filter((r) => r.status === "pending").length,
    approved: rows.filter((r) => r.status === "approved").length,
    rejected: rows.filter((r) => r.status === "rejected").length,
    leads: leads.length,
  };

  return (
    <Layout>
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="font-display text-4xl font-bold tracking-tight">Moderation</h1>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              void navigate({ to: "/auth" });
            }}
            className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2 text-sm font-semibold"
          >
            <LogOut size={14} /> Sign out
          </button>
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          {(["pending", "approved", "rejected", "leads"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-full px-5 py-2 text-sm font-medium capitalize transition ${
                tab === t ? "bg-foreground text-background" : "border border-border hover:bg-secondary"
              }`}
            >
              {t} ({counts[t]})
            </button>
          ))}
        </div>

        <div className="mt-8 space-y-4">
          {tab === "leads"
            ? leads.map((l) => (
                <div key={l.id} className="rounded-3xl border border-border bg-card p-6">
                  <div className="flex flex-wrap justify-between gap-2">
                    <p className="font-semibold">{l.name}</p>
                    <p className="text-xs text-muted-foreground">{timeAgo(l.created_at)}</p>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {l.email}
                    {l.phone ? ` · ${l.phone}` : ""}
                    {l.website ? ` · ${l.website}` : ""}
                  </p>
                  <p className="mt-3 whitespace-pre-wrap text-sm">{l.question}</p>
                </div>
              ))
            : filtered.map((r) => (
                <div key={r.id} className="rounded-3xl border border-border bg-card p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">
                        {flagOf(r.country_code)} {r.name}{" "}
                        <span className="text-sm font-normal text-muted-foreground">
                          · {r.rating}★ · {r.service || "—"}
                        </span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {r.email ?? "no email"} · {timeAgo(r.created_at)}
                        {r.repeat_client ? " · repeat client" : ""}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {r.status !== "approved" && (
                        <button
                          onClick={() => void setStatus(r.id, "approved")}
                          disabled={busyId === r.id}
                          className="inline-flex items-center gap-1 rounded-full bg-foreground px-4 py-1.5 text-xs font-semibold text-background disabled:opacity-50"
                        >
                          <Check size={13} /> Approve
                        </button>
                      )}
                      {r.status !== "rejected" && (
                        <button
                          onClick={() => void setStatus(r.id, "rejected")}
                          disabled={busyId === r.id}
                          className="inline-flex items-center gap-1 rounded-full border border-border px-4 py-1.5 text-xs font-semibold disabled:opacity-50"
                        >
                          <X size={13} /> Reject
                        </button>
                      )}
                      <button
                        onClick={() => void remove(r.id)}
                        disabled={busyId === r.id}
                        className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-destructive disabled:opacity-50"
                        aria-label="Delete review"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                  <p className="mt-3 text-sm">{r.body}</p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {r.price || "—"} · {r.duration || "—"}
                  </p>
                </div>
              ))}

          {tab !== "leads" && filtered.length === 0 && (
            <p className="rounded-3xl border border-border bg-card p-8 text-sm text-muted-foreground">
              Nothing here yet.
            </p>
          )}
          {tab === "leads" && leads.length === 0 && (
            <p className="rounded-3xl border border-border bg-card p-8 text-sm text-muted-foreground">
              No leads yet.
            </p>
          )}
        </div>
      </section>
    </Layout>
  );
}
