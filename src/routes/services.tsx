import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Layout } from "@/components/site/Layout";
import { services } from "@/lib/site-data";
import { ArrowUpRight } from "lucide-react";
import { servicePages } from "@/lib/service-pages";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "eCommerce Services: Shopify, SEO & AI — DeePeace Agency" },
      { name: "description", content: "Explore Shopify web design, eCommerce SEO services, Klaviyo email marketing, AI automation and UGC video ads. Find the right scope for your store with DeePeace Agency." },
      { property: "og:title", content: "eCommerce Services: Shopify, SEO & AI — DeePeace Agency" },
      { property: "og:description", content: "Shopify web design, eCommerce SEO services, Klaviyo email marketing, AI automation and UGC video ads for your store." },
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
          eCommerce services.<br />Built around your store.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          Shopify design and development, eCommerce SEO, email marketing and AI automation.
          Explore the work involved in each service, then share your priorities for a tailored project scope.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="mb-14 grid gap-6 md:grid-cols-2">
          {servicePages.map(page => <article key={page.path} className="border-t border-border py-6">
            <p className="text-sm text-muted-foreground">{page.label}</p>
            <h2 className="mt-2 font-display text-2xl font-semibold">{page.title}</h2>
            <p className="mt-3 text-muted-foreground">{page.intro}</p>
            <Button asChild variant="link" className="mt-4 px-0"><Link to={page.path}>Explore this service<ArrowUpRight /></Link></Button>
          </article>)}
        </div>
        <h2 className="mb-6 font-display text-2xl font-semibold">The complete service range</h2>
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
        <div className="mt-12 border-t border-border pt-8">
          <h2 className="text-2xl font-semibold">Plan your eCommerce marketing budget</h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">A practical guide to margins, acquisition costs and choosing between store improvements, ads, SEO, email and automation.</p>
          <Button asChild variant="link" className="mt-4 px-0"><Link to="/blog/ecommerce-marketing-budget">Read the budget guide <ArrowUpRight /></Link></Button>
        </div>
      </section>
    </Layout>
  );
}
