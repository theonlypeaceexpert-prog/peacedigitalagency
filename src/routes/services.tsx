import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Layout } from "@/components/site/Layout";
import { services } from "@/lib/site-data";
import { ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — DǝǝPeaçeAɠency" },
      { name: "description", content: "Shopify development, AI automation, SEO/GEO, performance marketing, UGC and AI commercial video — all under one roof." },
      { property: "og:title", content: "Services — DǝǝPeaçeAɠency" },
      { property: "og:description", content: "Shopify development, AI automation, SEO/GEO, performance marketing, UGC and AI commercial video — all under one roof." },
      { property: "og:url", content: "https://www.deepeaceagency.com/services" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://www.deepeaceagency.com/services" }],
  }),
  component: Services,
});

export default function Services() {
  return (
    <Layout>
      <section className="mx-auto max-w-7xl px-6 py-20">
        <p className="text-sm uppercase tracking-[0.2em] text-accent font-medium">Services</p>
        <h1 className="mt-4 font-display text-5xl sm:text-7xl font-bold tracking-tight max-w-4xl">
          A complete growth stack. Beautifully executed.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          From the first wireframe to the last conversion experiment — we are the full-funnel
          partner premium eCommerce brands rely on.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 6) * 0.05 }}
              className="group relative rounded-3xl border border-border bg-card p-8 hover:border-accent/50 hover:-translate-y-1 transition-all"
            >
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-secondary to-accent/40 mb-5" />
              <h3 className="font-display text-xl font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
              <Link to="/contact" className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-foreground/80 hover:text-accent">
                Get a quote <ArrowUpRight size={14} />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </Layout>
  );
}
