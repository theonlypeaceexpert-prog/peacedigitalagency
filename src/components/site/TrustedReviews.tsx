import { motion } from "framer-motion";
import { Star, ArrowUpRight, ExternalLink } from "lucide-react";

type PlatformCard = {
  name: string;
  logo: string;
  logoAlt: string;
  logoColor: string;
  description: string;
  cta: string;
  url: string;
  accent: string;
};

const cards: PlatformCard[] = [
  {
    name: "Trustpilot",
    logo: "https://cdn.simpleicons.org/trustpilot/00B67A",
    logoAlt: "Trustpilot logo",
    logoColor: "#00B67A",
    description:
      "Read genuine, independently verified client feedback on our Trustpilot profile — submitted by founders and growth teams we've worked with worldwide.",
    cta: "View on Trustpilot",
    url: "https://www.trustpilot.com/review/deepeaceagency.com",
    accent: "#00B67A",
  },
  {
    name: "Google",
    logo: "https://cdn.simpleicons.org/google/4285F4",
    logoAlt: "Google logo",
    logoColor: "#4285F4",
    description:
      "Explore our Google Business Profile to see real client reviews, business details and verified feedback from across the DǝǝPeaçeAɠency client community.",
    cta: "View on Google",
    url: "https://share.google/Gc3flLJhLurFq0OLS",
    accent: "#4285F4",
  },
];

function ReviewPlatformCard({ card, index }: { card: PlatformCard; index: number }) {
  return (
    <motion.a
      href={card.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -8 }}
      className="group relative flex flex-col overflow-hidden rounded-[2rem] border border-border bg-card p-8 sm:p-10 shadow-[0_10px_40px_-20px_rgba(0,0,0,0.12)] transition-shadow duration-500 hover:shadow-[0_24px_60px_-24px_rgba(0,0,0,0.18)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      aria-label={`${card.cta} — opens in a new tab`}
    >
      {/* light-blue accent wash */}
      <div
        className="pointer-events-none absolute -top-24 -right-24 h-56 w-56 rounded-full blur-3xl opacity-30 transition-opacity duration-500 group-hover:opacity-60"
        style={{ background: card.accent }}
        aria-hidden
      />

      <div className="relative flex items-center justify-between gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary/70 p-3 transition-transform duration-500 group-hover:scale-105">
          <img
            src={card.logo}
            alt={card.logoAlt}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-contain"
          />
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/60 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: card.accent }}
            aria-hidden
          />
          Verified
        </span>
      </div>

      {/* decorative five-star motif (platform branding, not a claimed rating) */}
      <div className="relative mt-7 flex items-center gap-1.5" aria-hidden>
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, scale: 0.4 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 + i * 0.06, type: "spring", stiffness: 240 }}
          >
            <Star
              size={22}
              className="fill-current"
              style={{ color: card.accent }}
            />
          </motion.span>
        ))}
      </div>

      <h3 className="relative mt-5 font-display text-2xl font-bold tracking-tight">
        {card.name} Reviews
      </h3>

      <p className="relative mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
        {card.description}
      </p>

      <div className="relative mt-8 flex items-center justify-between">
        <span className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background transition-all duration-300 group-hover:gap-3 group-hover:bg-accent group-hover:text-accent-foreground">
          {card.cta}
          <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
        <ExternalLink size={16} className="text-muted-foreground/60" aria-hidden />
      </div>
    </motion.a>
  );
}

export function TrustedReviews() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-3xl text-center"
      >
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-accent">
          Trusted Reviews
        </p>
        <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-balance sm:text-5xl">
          Trusted by Clients. Backed by Real Reviews.
        </h2>
        <p className="mt-5 text-muted-foreground text-balance">
          Explore genuine client feedback and connect with DǝǝPeaçeAɠency across
          trusted review platforms.
        </p>
      </motion.div>

      <div className="mt-14 grid gap-6 md:grid-cols-2 lg:gap-8">
        {cards.map((c, i) => (
          <ReviewPlatformCard key={c.name} card={c} index={i} />
        ))}
      </div>
    </section>
  );
}

/**
 * Compact "Verified Reviews" button block used on the Reviews page.
 * Two buttons linking to the live Trustpilot and Google profiles.
 */
export function VerifiedReviewsButtons() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-[2rem] border border-accent/20 bg-accent/5 p-8 shadow-[0_24px_60px_-30px_hsl(var(--accent)/0.35)] backdrop-blur-xl sm:p-12"
      >
        <div className="pointer-events-none absolute -top-20 -right-20 h-52 w-52 rounded-full bg-accent/20 blur-3xl" aria-hidden />
        <div className="relative flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-accent">
              Verified Reviews
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              See us on trusted review platforms.
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Independent, verified client feedback — no fabricated ratings, just
              the real public profiles.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <a
              href="https://www.trustpilot.com/review/deepeaceagency.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-full bg-foreground px-7 py-3.5 text-sm font-semibold text-background transition-all duration-300 hover:gap-3 hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <img
                src="https://cdn.simpleicons.org/trustpilot/ffffff"
                alt=""
                loading="lazy"
                decoding="async"
                className="h-4 w-4 object-contain"
                aria-hidden
              />
              Trustpilot Reviews
              <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            <a
              href="https://share.google/Gc3flLJhLurFq0OLS"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-full glass px-7 py-3.5 text-sm font-semibold transition-all duration-300 hover:gap-3 hover:bg-secondary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <img
                src="https://cdn.simpleicons.org/google/4285F4"
                alt=""
                loading="lazy"
                decoding="async"
                className="h-4 w-4 object-contain"
                aria-hidden
              />
              Google Reviews
              <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
