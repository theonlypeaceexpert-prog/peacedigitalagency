import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Lock } from "lucide-react";
import { Layout } from "@/components/site/Layout";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Admin Sign In — DǝǝPeaçeAɠency" },
      { name: "description", content: "Private sign-in for DǝǝPeaçeAɠency review moderation." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Admin Sign In — DǝǝPeaçeAɠency" },
      { property: "og:description", content: "Private sign-in for DǝǝPeaçeAɠency review moderation." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void supabase.auth.getSession().then(({ data }) => {
      if (data.session) void navigate({ to: "/admin" });
    });
  }, [navigate]);

  const field =
    "w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-accent";

  return (
    <Layout>
      <section className="mx-auto flex max-w-md flex-col px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[2rem] border border-border bg-card p-8"
        >
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-secondary">
            <Lock size={20} />
          </div>
          <h1 className="mt-6 font-display text-3xl font-bold tracking-tight">Admin sign in</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Private area for moderating reviews and viewing leads.
          </p>

          <form
            className="mt-6 space-y-3"
            onSubmit={async (e) => {
              e.preventDefault();
              setBusy(true);
              setError(null);
              const { error: err } = await supabase.auth.signInWithPassword({ email, password });
              setBusy(false);
              if (err) setError(err.message);
              else void navigate({ to: "/admin" });
            }}
          >
            <div>
              <label htmlFor="admin-email" className="mb-1.5 block text-sm font-medium">Email</label>
              <input id="admin-email" type="email" className={field} value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <label htmlFor="admin-password" className="mb-1.5 block text-sm font-medium">Password</label>
              <input id="admin-password" type="password" className={field} value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <button
              type="submit"
              disabled={busy}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background disabled:opacity-60"
            >
              {busy && <Loader2 size={16} className="animate-spin" />} Sign in
            </button>
          </form>
        </motion.div>
      </section>
    </Layout>
  );
}
