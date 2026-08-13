import { motion } from "framer-motion";
import { Star, Repeat2 } from "lucide-react";
import { flagOf, initials, timeAgo, type PublicReview } from "@/lib/reviews";

export function ReviewCard({ review, index = 0 }: { review: PublicReview; index?: number }) {
  const flag = flagOf(review.country_code);
  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45, delay: Math.min(index, 5) * 0.05 }}
      className="group flex h-full flex-col rounded-3xl border border-accent/25 bg-card p-6 sm:p-7 shadow-[0_10px_30px_-24px_hsl(var(--accent)/0.6)] transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-[0_28px_60px_-32px_hsl(var(--accent)/0.55)]"
    >
      <header className="flex items-start gap-4">
        {review.avatar_url ? (
          <img
            src={review.avatar_url}
            alt=""
            loading="lazy"
            decoding="async"
            className="h-12 w-12 shrink-0 rounded-full object-cover ring-1 ring-border"
          />
        ) : (
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-secondary text-sm font-semibold text-secondary-foreground ring-1 ring-border">
            {initials(review.name)}
          </div>
        )}
        <div className="min-w-0">
          <p className="truncate font-semibold leading-tight">{review.name}</p>
          <p className="mt-0.5 flex items-center gap-1.5 text-sm text-muted-foreground">
            {flag && <span aria-hidden>{flag}</span>}
            <span className="truncate">{review.country || "—"}</span>
          </p>
        </div>
      </header>

      <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
        <span className="flex items-center gap-0.5" aria-label={`${review.rating} out of 5 stars`}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={14}
              className={i < review.rating ? "fill-accent text-accent" : "text-border"}
            />
          ))}
        </span>
        <span className="font-medium text-foreground">{review.rating.toFixed(1)}</span>
        <span aria-hidden>·</span>
        <span>{timeAgo(review.created_at)}</span>
        {review.repeat_client && (
          <>
            <span aria-hidden>·</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-accent/15 px-2 py-0.5 font-medium text-foreground">
              <Repeat2 size={12} /> Repeat client
            </span>
          </>
        )}
        {review.is_sample && (
          <span className="inline-flex items-center rounded-full border border-border px-2 py-0.5 font-medium uppercase tracking-wide">
            Sample
          </span>
        )}
      </div>

      <p className="mt-4 flex-1 text-sm leading-relaxed text-foreground/90">"{review.body}"</p>

      <dl className="mt-6 grid grid-cols-3 gap-3 border-t border-border pt-5 text-center">
        <div>
          <dd className="font-display text-lg font-bold">{review.price || "—"}</dd>
          <dt className="mt-0.5 text-[11px] uppercase tracking-wide text-muted-foreground">Price</dt>
        </div>
        <div className="border-x border-border">
          <dd className="font-display text-lg font-bold">{review.duration || "—"}</dd>
          <dt className="mt-0.5 text-[11px] uppercase tracking-wide text-muted-foreground">Duration</dt>
        </div>
        <div>
          <dd className="text-xs font-medium leading-snug">{review.service || "—"}</dd>
          <dt className="mt-0.5 text-[11px] uppercase tracking-wide text-muted-foreground">Service</dt>
        </div>
      </dl>
    </motion.article>
  );
}
