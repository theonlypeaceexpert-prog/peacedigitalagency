import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Layout } from "@/components/site/Layout";
import { Star, Quote } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/reviews")({
  head: () => ({
    meta: [
      { title: "Reviews & Testimonials — DǝǝPeaçeAɠency" },
      { name: "description", content: "What founders and CMOs say about working with DǝǝPeaçeAɠency." },
      { property: "og:title", content: "Reviews & Testimonials — DǝǝPeaçeAɠency" },
      { property: "og:description", content: "What founders and CMOs say about working with DǝǝPeaçeAɠency." },
      { property: "og:url", content: "https://peacedigitalagency.lovable.app/reviews" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://peacedigitalagency.lovable.app/reviews" }],
  }),
  component: Reviews,
});

const reviews = [
  { name: "Sarah L.", role: "Founder · DTC Apparel", quote: "They rebuilt our Shopify from the ground up. Conversion jumped 38% in the first month.", rating: 5 },
  { name: "Marcus T.", role: "CMO · Beauty Brand", quote: "The team operates like an in-house growth squad. Our ROAS doubled within 60 days.", rating: 5 },
  { name: "Hana K.", role: "Head of Ecom · Lifestyle", quote: "Premium craft, premium results. Easily the best agency we've partnered with in 5 years.", rating: 5 },
  { name: "Daniel R.", role: "Founder · Grooming", quote: "AI workflows alone save us 30 hours a week. The Shopify redesign is the cherry on top.", rating: 5 },
  { name: "Priya M.", role: "Marketing Director · Kids' Brand", quote: "Their Klaviyo flows now drive 41% of total revenue. Game-changing partnership.", rating: 5 },
];

export default function Reviews() {
  const [i, setI] = useState(0);
  const r = reviews[i];

  return (
    <Layout>
      <section className="mx-auto max-w-7xl px-6 py-20">
        <p className="text-sm uppercase tracking-[0.2em] text-accent font-medium">Reviews</p>
        <h1 className="mt-4 font-display text-5xl sm:text-7xl font-bold tracking-tight max-w-4xl">
          Loved by founders. Trusted by growth teams.
        </h1>
      </section>


      <section className="mx-auto max-w-7xl px-6 pb-4">
        <RatingSummary />
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-20">
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[2rem] glass p-10 sm:p-16 text-center relative"
        >
          <Quote className="absolute top-8 left-8 text-accent/30" size={48} />
          <div className="flex justify-center gap-1 mb-6">
            {Array.from({ length: r.rating }).map((_, k) => (
              <Star key={k} size={18} className="fill-accent text-accent" />
            ))}
          </div>
          <blockquote className="font-display text-2xl sm:text-3xl font-medium tracking-tight text-balance leading-tight">
            "{r.quote}"
          </blockquote>
          <p className="mt-8 font-semibold">{r.name}</p>
          <p className="text-sm text-muted-foreground">{r.role}</p>
        </motion.div>

        <div className="flex justify-center gap-2 mt-6">
          {reviews.map((_, k) => (
            <button
              key={k}
              onClick={() => setI(k)}
              aria-label={`Review ${k + 1}`}
              className={`h-2 rounded-full transition-all ${k === i ? "w-8 bg-foreground" : "w-2 bg-border"}`}
            />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24 grid md:grid-cols-3 gap-4">
        {reviews.slice(0, 3).map((r, k) => (
          <motion.div
            key={k}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: k * 0.08 }}
            className="rounded-3xl border border-border bg-card p-8"
          >
            <div className="flex gap-1 mb-3">
              {Array.from({ length: 5 }).map((_, j) => <Star key={j} size={14} className="fill-accent text-accent" />)}
            </div>
            <p className="text-sm">{r.quote}</p>
            <p className="mt-6 text-xs font-semibold">{r.name} — <span className="text-muted-foreground font-normal">{r.role}</span></p>
          </motion.div>
        ))}
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight mb-8">Video stories.</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {[1, 2].map((n) => (
            <div key={n} className="aspect-video rounded-3xl glass grid place-items-center">
              <div className="h-16 w-16 rounded-full bg-foreground text-background grid place-items-center">
                <div className="w-0 h-0 border-l-[12px] border-l-background border-y-[8px] border-y-transparent translate-x-0.5" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}

const distribution = [
  { stars: 5, count: 968 },
  { stars: 4, count: 44 },
  { stars: 3, count: 8 },
  { stars: 2, count: 3 },
  { stars: 1, count: 1 },
];

function RatingSummary() {
  const total = distribution.reduce((a, d) => a + d.count, 0);
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6 }}
      className="rounded-[2rem] border border-accent/20 bg-accent/5 backdrop-blur-xl shadow-[0_24px_60px_-30px_hsl(var(--accent)/0.45)] p-8 sm:p-12 grid gap-10 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)] md:gap-16 items-center"
    >
      <div className="text-center md:text-left">
        <p className="font-display text-7xl sm:text-8xl font-bold tracking-tight leading-none">4.9</p>
        <div className="mt-4 flex justify-center md:justify-start gap-1.5">
          {Array.from({ length: 5 }).map((_, k) => (
            <motion.span
              key={k}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 + k * 0.07, type: "spring", stiffness: 260 }}
            >
              <Star size={24} className="fill-accent text-accent" />
            </motion.span>
          ))}
        </div>
        <p className="mt-5 text-lg font-semibold">{total.toLocaleString()} reviews</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Verified feedback from founders &amp; growth teams worldwide.
        </p>
      </div>

      <div className="space-y-3.5">
        {distribution.map((d, i) => {
          const pct = (d.count / total) * 100;
          return (
            <div key={d.stars} className="flex items-center gap-3 sm:gap-4">
              <span className="flex items-center gap-1 w-14 sm:w-16 shrink-0 text-sm font-medium tabular-nums">
                {d.stars} <Star size={13} className="fill-accent text-accent" />
              </span>
              <div className="h-2.5 flex-1 rounded-full bg-foreground/10 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${pct}%` }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 1.1, delay: 0.15 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full rounded-full bg-accent"
                />
              </div>
              <span className="w-12 text-right text-sm text-muted-foreground tabular-nums">
                {d.count}
              </span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
