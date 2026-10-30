import { createFileRoute } from "@tanstack/react-router";
import { motion, useInView, animate } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Layout } from "@/components/site/Layout";
import { benchmarks, headlineStats, resultsVideo, standards } from "@/lib/results-data";

export const Route = createFileRoute("/results")({
  head: () => ({
    meta: [
      { title: "Results & Build Standards — DǝǝPeaçeAɠency" },
      { name: "description", content: "How DǝǝPeaçeAɠency builds: performance-focused growth, Core Web Vitals standards, SEO fundamentals — plus a look at the work in action." },
      { property: "og:title", content: "Results & Build Standards — DǝǝPeaçeAɠency" },
      { property: "og:description", content: "Performance-focused growth: Core Web Vitals standards, SEO fundamentals and the work in action." },
      { property: "og:url", content: "https://www.deepeaceagency.com/results" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:image", content: resultsVideo.poster },
      { name: "twitter:image", content: resultsVideo.poster },
    ],
    links: [{ rel: "canonical", href: "https://www.deepeaceagency.com/results" }],
  }),
  component: Results,
});

export default function Results() {
  return (
    <Layout>
      <section className="mx-auto max-w-7xl px-6 py-20">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-accent">Results</p>
        <h1 className="mt-4 max-w-4xl font-display text-5xl font-bold tracking-tight sm:text-7xl">
          Performance-focused growth.
        </h1>
        <p className="mt-6 max-w-2xl text-muted-foreground">
          Every engagement is measured against the standards below — speed, structure, discoverability
          and conversion. No inflated numbers, just the way the work is built.
        </p>
      </section>

      <section className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-6 pb-16 md:grid-cols-4">
        {headlineStats.map((c, i) => (
          <Counter key={c.label} {...c} delay={i * 0.1} />
        ))}
      </section>

      <VideoSection />

      <section className="mx-auto max-w-4xl space-y-8 px-6 py-20">
        <h2 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">Delivery benchmarks.</h2>
        <div className="space-y-6">
          {benchmarks.map((b, i) => (
            <Bar key={b.label} {...b} delay={i * 0.1} />
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-6 pb-24 md:grid-cols-3">
        {standards.map((s) => (
          <div key={s.title} className="glass rounded-3xl p-8">
            <div className="font-display text-4xl font-bold text-accent">{s.value}</div>
            <p className="mt-2 font-medium">{s.title}</p>
            <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
          </div>
        ))}
      </section>
    </Layout>
  );
}

function VideoSection() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h2 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">{resultsVideo.title}</h2>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">{resultsVideo.subtitle}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative mt-10 overflow-hidden rounded-[2rem] border border-accent/20 bg-foreground/5 p-2 shadow-[0_40px_100px_-50px_hsl(var(--accent)/0.6)] sm:p-3"
      >
        <div className="pointer-events-none absolute inset-0 rounded-[2rem] ring-1 ring-inset ring-foreground/10" />
        <video
          className="aspect-video w-full rounded-[1.5rem] bg-black object-contain"
          src={resultsVideo.src}
          poster={resultsVideo.poster}
          controls
          playsInline
          preload="none"
        />
      </motion.div>
    </section>
  );
}

function Counter({
  numeric,
  suffix,
  label,
  delay,
}: {
  numeric: number;
  suffix: string;
  label: string;
  delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, numeric, {
      duration: 2,
      ease: "easeOut",
      onUpdate: (v) => setVal(v),
    });
    return () => controls.stop();
  }, [inView, numeric]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="rounded-3xl border border-border bg-card p-8"
    >
      <div className="font-display text-4xl font-bold sm:text-5xl">
        {numeric % 1 === 0 ? Math.round(val) : val.toFixed(1)}
        {suffix}
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{label}</p>
    </motion.div>
  );
}

function Bar({ label, value, delay }: { label: string; value: number; delay: number }) {
  return (
    <div>
      <div className="mb-2 flex justify-between">
        <span className="font-medium">{label}</span>
        <span className="font-mono text-accent">{value}%</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-secondary">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${Math.min(100, value)}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay, ease: "easeOut" }}
          className="h-full rounded-full bg-gradient-to-r from-foreground to-accent"
        />
      </div>
    </div>
  );
}
