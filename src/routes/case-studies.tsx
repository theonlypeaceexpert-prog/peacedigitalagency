import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Layout } from "@/components/site/Layout";
import { ArrowUpRight, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/case-studies")({
  head: () => ({
    meta: [
      { title: "Case Studies — DǝǝPeaçeAɠency" },
      { name: "description", content: "Deep dives into how we scaled premium eCommerce brands through design, development and AI-powered systems." },
      { property: "og:title", content: "Case Studies — DǝǝPeaçeAɠency" },
      { property: "og:description", content: "Deep dives into how we scaled premium eCommerce brands through design, development and AI-powered systems." },
      { property: "og:url", content: "https://peacedigitalagency.lovable.app/case-studies" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://peacedigitalagency.lovable.app/case-studies" }],
  }),
  component: CaseStudies,
});

const cases = [
  {
    brand: "FunnyFuzzy",
    headline: "From hobby store to 7-figure Shopify brand in 9 months",
    metric: "+312%",
    label: "Revenue lift",
    industry: "Pet Lifestyle",
  },
  {
    brand: "Ryderwear",
    headline: "Re-platforming a global apparel brand to Shopify Plus",
    metric: "1.2s",
    label: "Avg load time",
    industry: "Performance Apparel",
  },
  {
    brand: "Slick Gorilla",
    headline: "Scaling Meta Ads to 6.4× ROAS for a UK grooming brand",
    metric: "6.4×",
    label: "ROAS",
    industry: "Men's Grooming",
  },
];

const sections = [
  ["Challenge", "Stagnant traffic, low CVR, fragmented tech stack."],
  ["Research", "Heatmap audits, user interviews, competitor teardown."],
  ["Strategy", "Re-architect funnel around hero PDP & email flows."],
  ["Design", "Editorial-grade UI with premium motion language."],
  ["Development", "Headless Shopify build with sub-second TTFB."],
  ["Optimization", "Weekly CRO sprints, AI-personalized merchandising."],
  ["Results", "+312% revenue, 4.1× ROAS, +38% AOV."],
  ["Lessons", "Premium design unlocks premium prices."],
];

export default function CaseStudies() {
  return (
    <Layout>
      <section className="mx-auto max-w-7xl px-6 py-20">
        <p className="text-sm uppercase tracking-[0.2em] text-accent font-medium">Case Studies</p>
        <h1 className="mt-4 font-display text-5xl sm:text-7xl font-bold tracking-tight max-w-4xl">
          Stories of measurable, premium growth.
        </h1>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16 space-y-6">
        {cases.map((c, i) => (
          <motion.div
            key={c.brand}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="group rounded-[2rem] border border-border bg-card overflow-hidden grid md:grid-cols-[1fr_auto] hover:border-accent/50 transition"
          >
            <div className="p-10 sm:p-14">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{c.industry}</p>
              <h2 className="mt-3 font-display text-3xl sm:text-4xl font-bold tracking-tight text-balance">{c.headline}</h2>
              <p className="mt-2 text-accent font-medium">{c.brand}</p>
              <Link to="/contact" className="mt-8 inline-flex items-center gap-2 text-sm font-medium">
                Discuss a similar project <ArrowUpRight size={14} />
              </Link>
            </div>
            <div className="bg-foreground text-background p-10 sm:p-14 flex flex-col justify-center min-w-[200px]">
              <TrendingUp size={20} className="text-accent" />
              <div className="mt-3 font-display text-5xl sm:text-6xl font-bold">{c.metric}</div>
              <p className="text-background/70 text-sm mt-1">{c.label}</p>
            </div>
          </motion.div>
        ))}
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight mb-12">Our process — every case study, every time.</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {sections.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl p-6 glass"
            >
              <div className="text-xs font-mono text-accent">0{i + 1}</div>
              <h3 className="mt-2 font-display text-lg font-semibold">{t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{d}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </Layout>
  );
}
