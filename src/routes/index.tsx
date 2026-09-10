import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowUpRight, Star, Sparkles, Check } from "lucide-react";
import { Layout } from "@/components/site/Layout";
import { stats, projects, services } from "@/lib/site-data";
import { PlatformLogos } from "@/components/site/PlatformLogos";
import { SitePreview } from "@/components/site/SitePreview";
import { TrustedReviews } from "@/components/site/TrustedReviews";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DǝǝPeaçeAɠency — Premium Growth for eCommerce" },
      { name: "description", content: "We design, build and scale premium eCommerce experiences with AI-powered systems and conversion-led design." },
      { property: "og:title", content: "DǝǝPeaçeAɠency — Premium Growth for eCommerce" },
      { property: "og:description", content: "We design, build and scale premium eCommerce experiences with AI-powered systems and conversion-led design." },
      { property: "og:url", content: "https://peacedigitalagency.lovable.app/" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://peacedigitalagency.lovable.app/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            { "@type": "Question", name: "What kind of brands do you work with?", acceptedAnswer: { "@type": "Answer", text: "Ambitious eCommerce brands doing $50k+/month who want a premium partner — not a freelancer, not a sweatshop agency." } },
            { "@type": "Question", name: "How fast can you start?", acceptedAnswer: { "@type": "Answer", text: "Most engagements kick off within 7 days. Strategy calls are usually available within 48h." } },
            { "@type": "Question", name: "Do you only do Shopify?", acceptedAnswer: { "@type": "Answer", text: "Shopify is our specialty, but we ship beautifully on WooCommerce, Wix, GoDaddy and custom stacks too." } },
            { "@type": "Question", name: "Where are you based?", acceptedAnswer: { "@type": "Answer", text: "Remote-first, with senior talent across the UK, EU and APAC. We work in your timezone." } },
          ],
        }),
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <Layout>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grain-bg" />
        <motion.div
          className="absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full bg-accent/30 blur-3xl animate-float-slow"
          aria-hidden
        />
        <motion.div
          className="absolute top-40 -right-32 h-[420px] w-[420px] rounded-full bg-secondary/60 blur-3xl animate-float-slow"
          aria-hidden
        />

        <div className="relative mx-auto max-w-7xl px-6 pt-16 pb-24 sm:pt-24 sm:pb-32">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-medium"
          >
            <Sparkles size={14} className="text-accent" />
            Premium Digital Growth · est. 2021
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mt-6 font-display text-5xl sm:text-7xl lg:text-[88px] leading-[0.95] font-bold tracking-tight text-balance"
          >
            We build <span className="italic font-light">high-converting</span><br />
            eCommerce experiences<br />
            that <span className="text-gradient">scale.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8 max-w-2xl text-lg text-muted-foreground"
          >
            DǝǝPeaçeAɠency is a boutique digital growth studio crafting Shopify, AI-powered systems
            and full-funnel marketing for ambitious global brands.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-10 flex flex-wrap gap-4"
          >
            <Link to="/portfolio" className="group inline-flex items-center gap-2 rounded-full bg-foreground text-background px-7 py-4 font-medium hover:opacity-90 transition">
              View Portfolio
              <ArrowUpRight size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
            </Link>
            <Link to="/contact" className="inline-flex items-center gap-2 rounded-full glass px-7 py-4 font-medium hover:bg-secondary/40 transition">
              HIRE ME
            </Link>
          </motion.div>

          {/* stats */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-px bg-border rounded-3xl overflow-hidden glass">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-card p-6 sm:p-8"
              >
                <div className="font-display text-3xl sm:text-4xl font-bold">{s.value}</div>
                <div className="mt-1 text-xs sm:text-sm text-muted-foreground">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CLIENT MARQUEE */}
      <section className="border-y border-border py-10 overflow-hidden">
        <p className="text-center text-xs uppercase tracking-[0.3em] text-muted-foreground mb-6">Trusted by premium eCommerce brands</p>
        <div className="flex overflow-hidden">
          <div className="flex gap-16 animate-marquee whitespace-nowrap">
            {[...projects, ...projects].map((p, i) => (
              <span key={i} className="font-display text-2xl font-semibold text-foreground/40 hover:text-foreground transition">
                {p.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES OVERVIEW */}
      <section className="mx-auto max-w-7xl px-6 py-32">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-accent font-medium">What we do</p>
            <h2 className="mt-3 font-display text-4xl sm:text-6xl font-bold tracking-tight max-w-2xl">
              Strategy, craft and AI — under one roof.
            </h2>
          </div>
          <Link to="/services" className="inline-flex items-center gap-2 text-sm font-medium hover:gap-3 transition-all">
            All services <ArrowUpRight size={16} />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.slice(0, 6).map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="group relative p-8 rounded-3xl bg-card border border-border hover:border-accent/50 transition-all hover:-translate-y-1"
            >
              <div className="h-12 w-12 rounded-2xl bg-secondary grid place-items-center mb-6 group-hover:bg-accent transition-colors">
                <Sparkles size={20} />
              </div>
              <h3 className="font-display text-xl font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
              <ArrowUpRight className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition" size={18} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* FEATURED WORK */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-12">
          <p className="text-sm uppercase tracking-[0.2em] text-accent font-medium">Recent work</p>
          <h2 className="mt-3 font-display text-4xl sm:text-6xl font-bold tracking-tight">Selected projects.</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {projects.slice(0, 4).map((p, i) => (
            <ProjectPreview key={p.name} project={p} delay={i * 0.1} />
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link to="/portfolio" className="inline-flex items-center gap-2 rounded-full glass px-7 py-4 font-medium hover:bg-secondary/40 transition">
            See all projects <ArrowUpRight size={16} />
          </Link>
        </div>
      </section>

      {/* PLATFORMS */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="text-center mb-14">
          <p className="text-sm uppercase tracking-[0.2em] text-accent font-medium">Stack</p>
          <h2 className="mt-3 font-display text-4xl sm:text-6xl font-bold tracking-tight">Platforms we master.</h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Certified, battle-tested expertise across every major eCommerce, ads and marketing platform.
          </p>
        </div>
        <PlatformLogos />
      </section>

      {/* TESTIMONIAL PREVIEW */}
      <section className="mx-auto max-w-5xl px-6 py-24 text-center">
        <div className="flex justify-center gap-1 mb-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={20} className="fill-accent text-accent" />
          ))}
        </div>
        <blockquote className="font-display text-2xl sm:text-4xl font-medium tracking-tight text-balance leading-tight">
          "DǝǝPeace rebuilt our Shopify from the ground up. Conversion jumped 38% in the first
          month and our brand finally feels like it's worth what we charge."
        </blockquote>
        <p className="mt-8 text-sm text-muted-foreground">— Founder, premium DTC apparel brand</p>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-6 py-24">
        <h2 className="font-display text-4xl sm:text-5xl font-bold text-center tracking-tight mb-12">Questions, answered.</h2>
        <div className="space-y-3">
          {[
            ["What kind of brands do you work with?", "Ambitious eCommerce brands doing $50k+/month who want a premium partner — not a freelancer, not a sweatshop agency."],
            ["How fast can you start?", "Most engagements kick off within 7 days. Strategy calls are usually available within 48h."],
            ["Do you only do Shopify?", "Shopify is our specialty, but we ship beautifully on WooCommerce, Wix, GoDaddy and custom stacks too."],
            ["Where are you based?", "Remote-first, with senior talent across the UK, EU and APAC. We work in your timezone."],
          ].map(([q, a]) => (
            <details key={q} className="group rounded-2xl border border-border bg-card p-6 open:bg-secondary/30 transition">
              <summary className="cursor-pointer list-none flex justify-between items-center font-medium">
                {q}
                <span className="text-2xl group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="mt-3 text-muted-foreground text-sm">{a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-foreground text-background p-12 sm:p-20 text-center">
          <div className="absolute inset-0 grain-bg opacity-30" />
          <div className="relative">
            <h2 className="font-display text-4xl sm:text-6xl font-bold tracking-tight text-balance">
              Ready to build something <span className="italic font-light text-accent">extraordinary</span>?
            </h2>
            <p className="mt-6 text-background/70 max-w-xl mx-auto">
              Tell us about your brand. We'll send back a tailored growth plan within 24 hours.
            </p>
            <Link to="/contact" className="mt-10 inline-flex items-center gap-2 rounded-full bg-background text-foreground px-8 py-4 font-medium hover:scale-105 transition">
              Start a project <ArrowUpRight size={18} />
            </Link>
            <div className="mt-10 flex flex-wrap justify-center gap-6 text-xs text-background/60">
              {["No long contracts", "Senior team", "Performance-obsessed", "Worldwide"].map((b) => (
                <span key={b} className="inline-flex items-center gap-2"><Check size={14} className="text-accent" /> {b}</span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

function ProjectPreview({ project, delay }: { project: typeof projects[number]; delay: number }) {
  return (
    <motion.a
      href={project.url}
      target="_blank"
      rel="noreferrer"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="group block rounded-3xl overflow-hidden bg-card border border-border hover:border-accent/50 transition-all hover:-translate-y-1"
    >
      <div className="aspect-[16/10] relative">
        <SitePreview url={project.url} title={project.name} />
      </div>
      <div className="p-6 flex items-center justify-between">
        <div>
          <h3 className="font-display text-xl font-semibold">{project.name}</h3>
          <p className="text-xs text-muted-foreground mt-1">{project.industry}</p>
        </div>
        <ArrowUpRight size={20} className="group-hover:rotate-45 transition-transform" />
      </div>
    </motion.a>
  );
}
