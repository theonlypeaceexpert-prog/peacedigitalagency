import { motion } from "framer-motion";
import { Mail, MailCheck, LifeBuoy, ArrowUpRight } from "lucide-react";
import { EMAIL_CHANNELS } from "@/lib/contact-emails";

const icons = {
  general: Mail,
  projects: MailCheck,
  support: LifeBuoy,
} as const;

export function EmailChannels() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight">Let's Work Together</h2>
      <p className="mt-4 max-w-xl text-muted-foreground">
        Have a project in mind? Choose the most appropriate way to reach Deepeace Agency.
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {EMAIL_CHANNELS.map((c, i) => {
          const Icon = icons[c.key];
          return (
            <motion.a
              key={c.key}
              href={`mailto:${c.email}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -6 }}
              className={`group flex flex-col rounded-3xl border p-8 shadow-sm transition-shadow hover:shadow-xl ${
                c.primary
                  ? "border-accent/50 bg-accent/10 ring-1 ring-accent/30 lg:scale-[1.02]"
                  : "border-border bg-card"
              }`}
            >
              <div
                className={`grid h-11 w-11 place-items-center rounded-2xl transition-transform group-hover:scale-110 ${
                  c.primary ? "bg-accent text-accent-foreground" : "bg-foreground text-background"
                }`}
              >
                <Icon size={19} />
              </div>
              <h3 className="mt-5 font-display text-xl font-semibold">{c.label}</h3>
              <p className="mt-2 break-all text-sm font-medium text-accent">{c.email}</p>
              <p className="mt-3 flex-1 text-sm text-muted-foreground">{c.description}</p>
              <span
                className={`mt-6 inline-flex w-fit items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                  c.primary
                    ? "bg-foreground text-background group-hover:opacity-90"
                    : "border border-border group-hover:bg-secondary/60"
                }`}
              >
                {c.cta} <ArrowUpRight size={14} />
              </span>
            </motion.a>
          );
        })}
      </div>
    </section>
  );
}
