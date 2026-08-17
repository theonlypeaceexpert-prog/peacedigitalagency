import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { Star, Loader2 } from "lucide-react";
import { Layout } from "@/components/site/Layout";
import { ReviewCard } from "@/components/site/ReviewCard";
import { WriteReviewDialog } from "@/components/site/WriteReviewDialog";
import { FeaturedClientReview } from "@/components/site/FeaturedClientReview";
import {
  PAGE_SIZE,
  fetchPublicReviews,
  fetchReviewStats,
  type PublicReview,
  type ReviewStats,
} from "@/lib/reviews";

export const Route = createFileRoute("/reviews")({
  head: () => ({
    meta: [
      { title: "Reviews & Testimonials — DǝǝPeaçeAɠency" },
      { name: "description", content: "Verified client reviews for DǝǝPeaçeAɠency: ratings, services, project duration and outcomes. Share your own experience." },
      { property: "og:title", content: "Reviews & Testimonials — DǝǝPeaçeAɠency" },
      { property: "og:description", content: "Verified client reviews for DǝǝPeaçeAɠency: ratings, services, project duration and outcomes." },
      { property: "og:url", content: "https://peacedigitalagency.lovable.app/reviews" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://peacedigitalagency.lovable.app/reviews" }],
  }),
  component: Reviews,
});

export default function Reviews() {
  const [reviews, setReviews] = useState<PublicReview[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [end, setEnd] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [rows, s] = await Promise.all([fetchPublicReviews(0), fetchReviewStats()]);
      setReviews(rows);
      setStats(s);
      setEnd(rows.length < PAGE_SIZE);
    } catch (e) {
      console.error(e);
      setError("Reviews could not be loaded right now.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const loadMore = async () => {
    setLoadingMore(true);
    try {
      const rows = await fetchPublicReviews(reviews.length);
      setReviews((r) => [...r, ...rows]);
      if (rows.length < PAGE_SIZE) setEnd(true);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <Layout>
      <section className="mx-auto max-w-7xl px-6 py-20">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-accent">Reviews</p>
        <h1 className="mt-4 max-w-4xl font-display text-5xl font-bold tracking-tight sm:text-7xl">
          Loved by founders. Trusted by growth teams.
        </h1>
        <p className="mt-6 max-w-2xl text-muted-foreground">
          Every review is submitted by a client and manually approved before it appears here.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-10">
        <RatingSummary stats={stats} loading={loading} />
      </section>

      <FeaturedClientReview />

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">What clients say.</h2>
          <WriteReviewDialog />
        </div>

        {loading ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-72 animate-pulse rounded-3xl border border-border bg-secondary/40" />
            ))}
          </div>
        ) : error ? (
          <p className="rounded-3xl border border-border bg-card p-8 text-sm text-muted-foreground">{error}</p>
        ) : reviews.length === 0 ? (
          <p className="rounded-3xl border border-border bg-card p-8 text-sm text-muted-foreground">
            No approved reviews yet — be the first to share your experience.
          </p>
        ) : (
          <>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {reviews.map((r, i) => (
                <ReviewCard key={r.id} review={r} index={i} />
              ))}
            </div>
            {!end && (
              <div className="mt-10 flex justify-center">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="inline-flex items-center gap-2 rounded-full border border-border px-8 py-3 text-sm font-semibold transition hover:bg-secondary disabled:opacity-60"
                >
                  {loadingMore && <Loader2 size={16} className="animate-spin" />}
                  {loadingMore ? "Loading..." : "Load more reviews"}
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </Layout>
  );
}

function RatingSummary({ stats, loading }: { stats: ReviewStats | null; loading: boolean }) {
  const total = stats?.total ?? 0;
  const dist = [
    { stars: 5, count: stats?.s5 ?? 0 },
    { stars: 4, count: stats?.s4 ?? 0 },
    { stars: 3, count: stats?.s3 ?? 0 },
    { stars: 2, count: stats?.s2 ?? 0 },
    { stars: 1, count: stats?.s1 ?? 0 },
  ];
  const avg = stats?.average ?? 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6 }}
      className="grid items-center gap-10 rounded-[2rem] border border-accent/20 bg-accent/5 p-8 shadow-[0_24px_60px_-30px_hsl(var(--accent)/0.45)] backdrop-blur-xl sm:p-12 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)] md:gap-16"
    >
      <div className="text-center md:text-left">
        <p className="font-display text-7xl font-bold leading-none tracking-tight sm:text-8xl">
          {loading ? "—" : avg.toFixed(1)}
        </p>
        <div className="mt-4 flex justify-center gap-1.5 md:justify-start">
          {Array.from({ length: 5 }).map((_, k) => (
            <motion.span
              key={k}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 + k * 0.07, type: "spring", stiffness: 260 }}
            >
              <Star
                size={24}
                className={k < Math.round(avg) ? "fill-accent text-accent" : "text-border"}
              />
            </motion.span>
          ))}
        </div>
        <p className="mt-5 text-lg font-semibold">
          {loading ? "Loading reviews…" : `${total.toLocaleString()} review${total === 1 ? "" : "s"}`}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Approved feedback from founders &amp; growth teams worldwide.
        </p>
      </div>

      <div className="space-y-3.5">
        {dist.map((d, i) => {
          const pct = total ? (d.count / total) * 100 : 0;
          return (
            <div key={d.stars} className="flex items-center gap-3 sm:gap-4">
              <span className="flex w-14 shrink-0 items-center gap-1 text-sm font-medium tabular-nums sm:w-16">
                {d.stars} <Star size={13} className="fill-accent text-accent" />
              </span>
              <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-foreground/10">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 1.1, delay: 0.15 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full rounded-full bg-accent"
                />
              </div>
              <span className="w-12 text-right text-sm tabular-nums text-muted-foreground">{d.count}</span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
