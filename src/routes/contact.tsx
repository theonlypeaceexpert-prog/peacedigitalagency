import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Layout } from "@/components/site/Layout";
import { Mail, MessageCircle, Instagram, Music2, Linkedin, Clock, MapPin, Check, Loader2 } from "lucide-react";
import { useId, useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { submitContact } from "@/lib/ai.functions";
import { AGENCY_EMAILS } from "@/lib/contact-emails";
import { EmailChannels } from "@/components/site/EmailChannels";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — DǝǝPeaçeAɠency" },
      { name: "description", content: "Tell us about your project. We'll send back a tailored growth plan within 24 hours." },
      { property: "og:title", content: "Contact — DǝǝPeaçeAɠency" },
      { property: "og:description", content: "Tell us about your project. We'll send back a tailored growth plan within 24 hours." },
      { property: "og:url", content: "https://www.deepeaceagency.com/contact" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://www.deepeaceagency.com/contact" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ProfessionalService",
          name: "DǝǝPeaçeAɠency",
          url: "https://www.deepeaceagency.com",
          description: "Premium digital growth agency for eCommerce brands — Shopify, AI automation, performance marketing.",
          areaServed: "Worldwide",
          contactPoint: {
            "@type": "ContactPoint",
            email: AGENCY_EMAILS.projects,
            contactType: "sales",
            availableLanguage: ["English"],
          },
        }),
      },
    ],
  }),
  component: Contact,
});

const schema = z.object({
  name: z.string().trim().min(2, "Name is too short").max(80),
  email: z.string().trim().email("Invalid email").max(160),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  company: z.string().trim().max(120).optional().or(z.literal("")),
  budget: z.string().min(1, "Please select a budget"),
  service: z.string().min(1, "Please select a service"),
  details: z.string().trim().min(20, "Tell us a little more (20+ chars)").max(4000),
  website: z.string().max(0).optional(), // honeypot — must stay empty
});

export default function Contact() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [errorMsg, setErrorMsg] = useState("");
  const send = useServerFn(submitContact);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const raw = Object.fromEntries(fd.entries()) as Record<string, string>;

    const parsed = schema.safeParse(raw);
    if (!parsed.success) {
      const flat: Record<string, string> = {};
      for (const issue of parsed.error.issues) flat[String(issue.path[0])] = issue.message;
      setErrors(flat);
      return;
    }
    setErrors({});
    setStatus("sending");

    try {
      const res = await send({ data: parsed.data });
      if (!res.ok) {
        setStatus("error");
        setErrorMsg(res.error ?? "Something went wrong");
        return;
      }
      setStatus("sent");
      form.reset();
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  return (
    <Layout>
      <section className="mx-auto max-w-7xl px-6 py-20 grid lg:grid-cols-2 gap-16">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-accent font-medium">Contact</p>
          <h1 className="mt-4 font-display text-5xl sm:text-6xl font-bold tracking-tight text-balance">
            Let's build something <span className="italic font-light text-gradient">amazing.</span>
          </h1>
          <p className="mt-6 text-muted-foreground max-w-md">
            Share a few details about your brand and we'll come back within 24 hours with a tailored
            growth plan and proposal.
          </p>

          <div className="mt-10 space-y-3">
            <Channel icon={<MessageCircle size={18} />} label="WhatsApp" value="+234 704 785 8283" href="https://wa.me/2347047858283" />
            <Channel icon={<Mail size={18} />} label="New projects" value={AGENCY_EMAILS.projects} href={`mailto:${AGENCY_EMAILS.projects}`} />
            <Channel icon={<Linkedin size={18} />} label="LinkedIn" value="DǝǝPeaçeAɠency" href="https://www.linkedin.com/in/deepeace-agency-988556426" />
            <Channel icon={<Instagram size={18} />} label="Instagram" value="@deepeaceagency" href="https://www.instagram.com/deepeaceagency" />
            <Channel icon={<Music2 size={18} />} label="TikTok" value="@dee.peace0" href="https://www.tiktok.com/@dee.peace0" />
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="rounded-2xl p-5 glass">
              <Clock size={16} className="text-accent" />
              <p className="mt-2 text-xs text-muted-foreground">Business hours</p>
              <p className="text-sm font-medium">Mon–Fri · 9am–7pm GMT</p>
            </div>
            <div className="rounded-2xl p-5 glass">
              <MapPin size={16} className="text-accent" />
              <p className="mt-2 text-xs text-muted-foreground">Based</p>
              <p className="text-sm font-medium">Worldwide · Remote</p>
            </div>
          </div>
        </div>

        <div className="relative">
          <AnimatePresence mode="wait">
            {status === "sent" ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="rounded-[2rem] border border-border bg-card p-12 text-center min-h-[500px] flex flex-col items-center justify-center"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 14 }}
                  className="h-20 w-20 rounded-full bg-accent grid place-items-center mb-6"
                >
                  <Check size={40} className="text-accent-foreground" strokeWidth={3} />
                </motion.div>
                <motion.h2
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                  className="font-display text-3xl font-bold"
                >
                  Message Sent Successfully
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
                  className="mt-3 text-muted-foreground max-w-sm"
                >
                  Thank you for reaching out to DǝǝPeaçeAɠency. Your message has been received and I'll get back to you as soon as possible.
                </motion.p>
                <motion.button
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                  onClick={() => setStatus("idle")}
                  className="mt-8 text-sm font-medium underline underline-offset-4 hover:text-accent"
                >
                  Send another message
                </motion.button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={onSubmit}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="rounded-[2rem] border border-border bg-card p-8 sm:p-10 space-y-4"
                noValidate
              >
                {/* Honeypot */}
                <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Name" name="name" required error={errors.name} />
                  <Field label="Email" name="email" type="email" required error={errors.email} />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Company" name="company" error={errors.company} />
                  <Field label="Phone" name="phone" type="tel" error={errors.phone} />
                </div>
                <Select label="Project budget" name="budget" options={["< $5k", "$5k – $15k", "$15k – $50k", "$50k+"]} error={errors.budget} />
                <Select label="Service needed" name="service" options={["Shopify Build", "Performance Marketing", "AI Automation", "Full Growth Partner", "SEO / GEO", "Other"]} error={errors.service} />
                <Textarea label="Project details" name="details" error={errors.details} />


                {status === "error" && (
                   <p className="text-sm text-destructive">{errorMsg} Please try again or email {AGENCY_EMAILS.projects} directly.</p>
                )}

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="w-full rounded-full bg-foreground text-background py-4 font-medium hover:opacity-90 transition disabled:opacity-60 inline-flex items-center justify-center gap-2"
                >
                  {status === "sending" ? (<><Loader2 size={16} className="animate-spin" /> Sending…</>) : "Let's Build Something Amazing"}
                </button>
                <p className="text-[11px] text-muted-foreground text-center">
                  Protected by spam filtering. Your details are only used to reply to your inquiry.
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </section>
      <EmailChannels />
    </Layout>
  );
}

function Field({ label, name, type = "text", required, error }: { label: string; name: string; type?: string; required?: boolean; error?: string }) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        maxLength={type === "email" ? 160 : 120}
        className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-accent transition"
        aria-invalid={!!error}
      />
      {error && <p className="mt-1.5 text-xs text-destructive">{error}</p>}
    </div>
  );
}

function Select({ label, name, options, error }: { label: string; name: string; options: string[]; error?: string }) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</label>
      <select
        id={id}
        name={name}
        defaultValue=""
        className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-accent transition"
        aria-invalid={!!error}
      >
        <option value="" disabled>Select...</option>
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
      {error && <p className="mt-1.5 text-xs text-destructive">{error}</p>}
    </div>
  );
}

function Textarea({ label, name, error }: { label: string; name: string; error?: string }) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</label>
      <textarea
        id={id}
        name={name}
        rows={5}
        required
        minLength={20}
        maxLength={4000}
        className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-accent transition resize-none"
        aria-invalid={!!error}
      />
      {error && <p className="mt-1.5 text-xs text-destructive">{error}</p>}
    </div>
  );
}

function Channel({ icon, label, value, href }: { icon: React.ReactNode; label: string; value: string; href: string }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="flex items-center gap-4 p-4 rounded-2xl glass hover:bg-secondary/40 transition">
      <div className="h-10 w-10 rounded-xl bg-foreground text-background grid place-items-center shrink-0">{icon}</div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-medium truncate">{value}</p>
      </div>
    </a>
  );
}
