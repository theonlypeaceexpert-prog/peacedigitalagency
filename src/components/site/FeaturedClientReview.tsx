import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BadgeCheck, X, ZoomIn } from "lucide-react";
import shot1 from "@/assets/laksha-review-1.png.asset.json";
import shot2 from "@/assets/laksha-review-2.png.asset.json";
import { assetUrl } from "@/lib/asset-url";

const SHOTS = [
  { src: assetUrl(shot1.url), alt: "Email message from client Laksha thanking DǝǝPeaçeAɠency for help with her shop" },
  { src: assetUrl(shot2.url), alt: "Second email message from client Laksha thanking DǝǝPeaçeAɠency" },
];

export function FeaturedClientReview() {
  const [lightbox, setLightbox] = useState<string | null>(null);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setLightbox(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox]);

  return (
    <section className="mx-auto max-w-7xl px-6 pb-16">
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Featured Client Review</h2>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-semibold">
          <BadgeCheck size={14} className="text-accent" /> Verified Client Review
        </span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
        className="rounded-[2rem] border border-accent/20 bg-card p-6 shadow-[0_24px_60px_-34px_hsl(var(--accent)/0.5)] sm:p-9"
      >
        <dl className="mb-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-border bg-secondary/30 p-4">
            <dt className="text-[11px] uppercase tracking-wide text-muted-foreground">Client</dt>
            <dd className="mt-1 font-semibold">Lakisha</dd>
          </div>
          <div className="rounded-2xl border border-border bg-secondary/30 p-4">
            <dt className="text-[11px] uppercase tracking-wide text-muted-foreground">Initial project</dt>
            <dd className="mt-1 font-semibold">Google Merchant Center (GMC)</dd>
          </div>
        </dl>

        <div className="grid gap-5 lg:grid-cols-2">
          {SHOTS.map((s) => (
            <button
              key={s.src}
              type="button"
              onClick={() => setLightbox(s.src)}
              className="group relative block w-full overflow-hidden rounded-2xl border border-border bg-background shadow-[0_10px_30px_-24px_rgba(0,0,0,0.6)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_50px_-30px_rgba(0,0,0,0.5)]"
              aria-label="Open client review screenshot larger"
            >
              <img
                src={s.src}
                alt={s.alt}
                loading="lazy"
                decoding="async"
                className="h-auto w-full object-contain"
              />
              <span className="pointer-events-none absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-foreground/85 px-2.5 py-1 text-[11px] font-medium text-background opacity-0 transition group-hover:opacity-100">
                <ZoomIn size={12} /> Enlarge
              </span>
            </button>
          ))}
        </div>

        <p className="mt-5 text-xs text-muted-foreground">
          Screenshots are shown exactly as received — unedited client messages.
        </p>
      </motion.div>

      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
            className="fixed inset-0 z-[70] grid place-items-center bg-foreground/70 p-4 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
          >
            <button
              onClick={() => setLightbox(null)}
              aria-label="Close"
              className="absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-full bg-background text-foreground"
            >
              <X size={18} />
            </button>
            <motion.img
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              src={lightbox}
              alt="Client review screenshot"
              onClick={(e) => e.stopPropagation()}
              className="max-h-[85vh] w-auto max-w-full rounded-2xl bg-background object-contain shadow-2xl"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
