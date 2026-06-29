import { createFileRoute } from "@tanstack/react-router";
import { motion, useInView, animate } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Layout } from "@/components/site/Layout";

export const Route = createFileRoute("/results")({
  head: () => ({
    meta: [
      { title: "Results — DǝǝPeaçeAɠency" },
      { name: "description", content: "Real metrics from real eCommerce brands: revenue lift, ROAS, conversion rate, Core Web Vitals." },
    ],
  }),
  component: Results,
});

const counters = [
  { n: 100, suffix: "+", label: "Projects delivered" },
  { n: 98, suffix: "%", label: "Client satisfaction" },
  { n: 50, suffix: "M+", label: "Revenue influenced ($)" },
  { n: 4.2, suffix: "×", label: "Average ROAS" },
];

const bars = [
  { label: "Avg conversion rate lift", value: 78 },
  { label: "Avg page-speed improvement", value: 64 },
  { label: "Avg SEO traffic growth (12mo)", value: 142, cap: 150 },
  { label: "Avg email revenue share", value: 38 },
];

export default function Results() {
  return (
    <Layout>
      <section className="mx-auto max-w-7xl px-6 py-20">
        <p className="text-sm uppercase tracking-[0.2em] text-accent font-medium">Results</p>
        <h1 className="mt-4 font-display text-5xl sm:text-7xl font-bold tracking-tight max-w-4xl">
          Numbers that move the needle.
        </h1>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16 grid grid-cols-2 md:grid-cols-4 gap-4">
        {counters.map((c, i) => (
          <Counter key={c.label} {...c} delay={i * 0.1} />
        ))}
      </section>

      <section className="mx-auto max-w-4xl px-6 py-20 space-y-8">
        <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight">Performance benchmarks.</h2>
        <div className="space-y-6">
          {bars.map((b, i) => (
            <Bar key={b.label} {...b} delay={i * 0.1} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 grid md:grid-cols-3 gap-4">
        {[
          ["98", "Lighthouse Performance", "Average across recent Shopify builds"],
          ["1.1s", "LCP", "Average Largest Contentful Paint"],
          ["+34%", "AOV", "Through PDP + bundling work"],
        ].map(([v, t, d]) => (
          <div key={t} className="rounded-3xl p-8 glass">
            <div className="font-display text-5xl font-bold text-accent">{v}</div>
            <p className="mt-2 font-medium">{t}</p>
            <p className="text-sm text-muted-foreground mt-1">{d}</p>
          </div>
        ))}
      </section>
    </Layout>
  );
}

function Counter({ n, suffix, label, delay }: { n: number; suffix: string; label: string; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, n, {
      duration: 2,
      ease: "easeOut",
      onUpdate: (v) => setVal(v),
    });
    return () => controls.stop();
  }, [inView, n]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="rounded-3xl border border-border bg-card p-8"
    >
      <div className="font-display text-4xl sm:text-5xl font-bold">
        {n % 1 === 0 ? Math.round(val) : val.toFixed(1)}{suffix}
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{label}</p>
    </motion.div>
  );
}

function Bar({ label, value, cap = 100, delay }: { label: string; value: number; cap?: number; delay: number }) {
  return (
    <div>
      <div className="flex justify-between mb-2">
        <span className="font-medium">{label}</span>
        <span className="font-mono text-accent">+{value}%</span>
      </div>
      <div className="h-3 rounded-full bg-secondary overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${Math.min(100, (value / cap) * 100)}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay, ease: "easeOut" }}
          className="h-full rounded-full bg-gradient-to-r from-foreground to-accent"
        />
      </div>
    </div>
  );
}
