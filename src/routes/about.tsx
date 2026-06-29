import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Layout } from "@/components/site/Layout";
import { ArrowUpRight, Check } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — DǝǝPeaçeAɠency" },
      { name: "description", content: "Boutique digital growth studio crafting premium Shopify experiences and AI-powered systems for ambitious global brands." },
    ],
  }),
  component: About,
});

const values = [
  { t: "Craft over volume", d: "We take fewer clients so every project gets senior attention." },
  { t: "Performance is non-negotiable", d: "Speed, conversion, ROAS — measured weekly, optimized relentlessly." },
  { t: "AI-augmented, human-led", d: "We blend bleeding-edge AI with strategists who actually understand brand." },
  { t: "Transparent partnership", d: "Shared dashboards, weekly reports, no smoke and mirrors." },
];

const timeline = [
  ["2021", "Founded as a Shopify-first studio"],
  ["2022", "Scaled first client past $1M/month"],
  ["2023", "Launched in-house AI automation practice"],
  ["2024", "100+ projects shipped across 14 countries"],
  ["2025", "Expanded into AI commercial video & GEO"],
];

export default function About() {
  return (
    <Layout>
      <section className="mx-auto max-w-7xl px-6 py-20">
        <p className="text-sm uppercase tracking-[0.2em] text-accent font-medium">About</p>
        <h1 className="mt-4 font-display text-5xl sm:text-7xl font-bold tracking-tight text-balance max-w-4xl">
          A boutique studio for brands that refuse to look ordinary.
        </h1>
        <p className="mt-8 text-lg text-muted-foreground max-w-2xl">
          DǝǝPeaçeAɠency was born from one belief: the brands winning the next decade will be the
          ones obsessed with craft, speed and intelligent systems. We are their partner.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 grid md:grid-cols-2 gap-6">
        {[
          { t: "Mission", d: "Help premium eCommerce brands scale revenue through superior digital craft and AI automation." },
          { t: "Vision", d: "A world where every ambitious founder has agency-level talent on demand, powered by AI." },
        ].map((b) => (
          <div key={b.t} className="rounded-3xl border border-border bg-card p-10">
            <h3 className="text-sm uppercase tracking-[0.2em] text-accent font-medium">{b.t}</h3>
            <p className="mt-4 font-display text-2xl sm:text-3xl tracking-tight">{b.d}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight mb-10">Core values.</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {values.map((v, i) => (
            <motion.div
              key={v.t}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-3xl p-8 glass"
            >
              <h3 className="font-display text-xl font-semibold flex items-center gap-3">
                <Check className="text-accent" size={20} />{v.t}
              </h3>
              <p className="mt-3 text-muted-foreground text-sm">{v.d}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-24">
        <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight mb-12">Our journey.</h2>
        <div className="space-y-3">
          {timeline.map(([y, e]) => (
            <div key={y} className="grid grid-cols-[80px_1fr] gap-6 items-baseline border-b border-border pb-4">
              <div className="font-display text-2xl font-bold text-accent">{y}</div>
              <div className="text-foreground/80">{e}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="rounded-[2.5rem] bg-foreground text-background p-12 sm:p-16 text-center">
          <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight">Let's work together.</h2>
          <Link to="/contact" className="mt-8 inline-flex items-center gap-2 rounded-full bg-background text-foreground px-7 py-4 font-medium">
            Start a project <ArrowUpRight size={16} />
          </Link>
        </div>
      </section>
    </Layout>
  );
}
