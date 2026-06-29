import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Layout } from "@/components/site/Layout";
import { Mail, MessageCircle, Instagram, Music2, Clock, MapPin } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — DǝǝPeaçeAɠency" },
      { name: "description", content: "Tell us about your project. We'll send back a tailored growth plan within 24 hours." },
    ],
  }),
  component: Contact,
});

export default function Contact() {
  const [sent, setSent] = useState(false);

  return (
    <Layout>
      <section className="mx-auto max-w-7xl px-6 py-20 grid lg:grid-cols-2 gap-16">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-accent font-medium">Contact</p>
          <h1 className="mt-4 font-display text-5xl sm:text-6xl font-bold tracking-tight">
            Let's build something amazing.
          </h1>
          <p className="mt-6 text-muted-foreground max-w-md">
            Share a few details about your brand and we'll come back within 24 hours with a tailored
            growth plan and proposal.
          </p>

          <div className="mt-10 space-y-4">
            <Channel icon={<MessageCircle size={18} />} label="WhatsApp" value="+44 7828 747179" href="https://wa.me/447828747179" />
            <Channel icon={<Mail size={18} />} label="Email" value="Theonlypeaceexpert@gmail.com" href="mailto:Theonlypeaceexpert@gmail.com" />
            <Channel icon={<Instagram size={18} />} label="Instagram" value="@deepeaceagency" href="https://www.instagram.com/deepeaceagency" />
            <Channel icon={<Music2 size={18} />} label="TikTok" value="@dee.peace0" href="https://www.tiktok.com/@dee.peace0" />
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4">
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

          <div className="mt-6 aspect-[2/1] rounded-3xl glass grid place-items-center text-muted-foreground text-sm">
            Map placeholder · Worldwide
          </div>
        </div>

        <motion.form
          onSubmit={(e) => { e.preventDefault(); setSent(true); }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[2rem] border border-border bg-card p-8 sm:p-10 space-y-4 h-fit"
        >
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Name" name="name" required />
            <Field label="Email" name="email" type="email" required />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Company" name="company" />
            <Field label="Phone" name="phone" type="tel" />
          </div>
          <Select label="Project budget" name="budget" options={["< $5k", "$5k – $15k", "$15k – $50k", "$50k+"]} />
          <Select label="Service needed" name="service" options={["Shopify Build", "Performance Marketing", "AI Automation", "Full Growth Partner", "Other"]} />
          <div>
            <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Project details</label>
            <textarea
              name="details"
              rows={5}
              required
              className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-accent transition resize-none"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-full bg-foreground text-background py-4 font-medium hover:opacity-90 transition"
          >
            {sent ? "✓ Sent — we'll reply within 24h" : "Let's Build Something Amazing"}
          </button>
        </motion.form>
      </section>
    </Layout>
  );
}

function Field({ label, name, type = "text", required }: { label: string; name: string; type?: string; required?: boolean }) {
  return (
    <div>
      <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</label>
      <input
        name={name}
        type={type}
        required={required}
        className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-accent transition"
      />
    </div>
  );
}

function Select({ label, name, options }: { label: string; name: string; options: string[] }) {
  return (
    <div>
      <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</label>
      <select
        name={name}
        className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-accent transition"
      >
        <option value="">Select...</option>
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
    </div>
  );
}

function Channel({ icon, label, value, href }: { icon: React.ReactNode; label: string; value: string; href: string }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="flex items-center gap-4 p-4 rounded-2xl glass hover:bg-secondary/40 transition">
      <div className="h-10 w-10 rounded-xl bg-foreground text-background grid place-items-center">{icon}</div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-medium truncate">{value}</p>
      </div>
    </a>
  );
}
