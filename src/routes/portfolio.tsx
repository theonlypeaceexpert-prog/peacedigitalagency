import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Layout } from "@/components/site/Layout";
import { projects } from "@/lib/site-data";
import { ExternalLink } from "lucide-react";
import { SitePreview } from "@/components/site/SitePreview";

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "Portfolio — DǝǝPeaçeAɠency" },
      { name: "description", content: "Live previews of premium eCommerce brands we've designed, built and scaled — Shopify, WooCommerce and custom stacks." },
      { property: "og:title", content: "Portfolio — DǝǝPeaçeAɠency" },
      { property: "og:url", content: "/portfolio" },
    ],
    links: [{ rel: "canonical", href: "/portfolio" }],
  }),
  component: Portfolio,
});

export default function Portfolio() {
  return (
    <Layout>
      <section className="mx-auto max-w-7xl px-6 py-20">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm uppercase tracking-[0.2em] text-accent font-medium"
        >
          Portfolio
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-4 font-display text-5xl sm:text-7xl font-bold tracking-tight max-w-4xl text-balance"
        >
          Brands we've helped <span className="italic font-light text-gradient">scale.</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="mt-6 max-w-2xl text-lg text-muted-foreground"
        >
          Live homepage previews — auto-scrolling. Hover to pause. Click any card to visit the production site.
        </motion.p>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {projects.map((p, i) => (
            <Card key={p.name} p={p} delay={(i % 4) * 0.08} />
          ))}
        </div>
      </section>
    </Layout>
  );
}

function Card({ p, delay }: { p: typeof projects[number]; delay: number }) {
  return (
    <motion.a
      href={p.url}
      target="_blank"
      rel="noreferrer"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ delay, duration: 0.6 }}
      className="group block rounded-3xl overflow-hidden bg-card border border-border hover:border-accent/50 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_30px_80px_-20px_rgba(0,0,0,0.15)]"
    >
      <div className="aspect-[16/10] relative">
        <SitePreview url={p.url} title={p.name} />
      </div>
      <div className="p-6 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="font-display text-2xl font-semibold tracking-tight">{p.name}</h3>
            <p className="text-xs text-muted-foreground mt-1">{p.industry}</p>
          </div>
          <span
            className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-foreground text-background px-4 py-2 text-xs font-medium group-hover:bg-accent group-hover:text-accent-foreground transition-colors"
            onClick={(e) => { e.stopPropagation(); window.open(p.url, "_blank", "noopener,noreferrer"); }}
          >
            Visit Website <ExternalLink size={12} />
          </span>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {p.services.map((s) => (
            <span key={s} className="text-[11px] px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground">
              {s}
            </span>
          ))}
        </div>
      </div>
    </motion.a>
  );
}
