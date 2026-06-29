import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Layout } from "@/components/site/Layout";
import { projects } from "@/lib/site-data";
import { ArrowUpRight, ExternalLink } from "lucide-react";

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "Portfolio — DǝǝPeaçeAɠency" },
      { name: "description", content: "Selected eCommerce projects: FunnyFuzzy, Boody, Ryderwear, Jamie Kay, Slick Gorilla and more." },
    ],
  }),
  component: Portfolio,
});

export default function Portfolio() {
  return (
    <Layout>
      <section className="mx-auto max-w-7xl px-6 py-20">
        <p className="text-sm uppercase tracking-[0.2em] text-accent font-medium">Portfolio</p>
        <h1 className="mt-4 font-display text-5xl sm:text-7xl font-bold tracking-tight max-w-4xl">
          Brands we've helped scale.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          Live previews. Real results. Tap any card to visit the production site.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((p, i) => (
            <Card key={p.name} p={p} delay={(i % 4) * 0.06} />
          ))}
        </div>
      </section>
    </Layout>
  );
}

function Card({ p, delay }: { p: typeof projects[number]; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="group rounded-3xl overflow-hidden bg-card border border-border hover:border-accent/50 transition-all hover:-translate-y-1"
    >
      <div className="aspect-[16/10] relative overflow-hidden bg-secondary/40">
        <div className="absolute inset-x-0 top-0 h-8 bg-card/90 backdrop-blur flex items-center gap-1.5 px-3 border-b border-border z-10">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
          <span className="ml-3 text-[10px] text-muted-foreground truncate">{p.url}</span>
        </div>
        <div className="absolute inset-0 pt-8 overflow-hidden">
          <iframe
            src={p.url}
            title={p.name}
            loading="lazy"
            className="w-full h-[260%] pointer-events-none animate-[scroll-preview_22s_linear_infinite] group-hover:[animation-play-state:paused]"
            style={{ transformOrigin: "top left" }}
          />
        </div>
        <style>{`@keyframes scroll-preview { 0%,10%{transform:translateY(0)} 90%,100%{transform:translateY(-60%)} }`}</style>
      </div>
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-display text-2xl font-semibold">{p.name}</h3>
            <p className="text-xs text-muted-foreground mt-1">{p.industry}</p>
          </div>
          <a
            href={p.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full bg-foreground text-background px-4 py-2 text-xs font-medium hover:opacity-90"
          >
            Visit <ExternalLink size={12} />
          </a>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {p.services.map((s) => (
            <span key={s} className="text-[11px] px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground">{s}</span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
