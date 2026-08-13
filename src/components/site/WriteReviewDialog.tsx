import { useId, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, X, Check, Loader2, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { COUNTRIES, SERVICE_OPTIONS } from "@/lib/reviews";

type Form = {
  name: string;
  email: string;
  country: string;
  service: string;
  price: string;
  duration: string;
  body: string;
  repeat: boolean;
};

const empty: Form = {
  name: "",
  email: "",
  country: "",
  service: "",
  price: "",
  duration: "",
  body: "",
  repeat: false,
};

export function WriteReviewDialog({ onSubmitted }: { onSubmitted?: () => void }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Form>(empty);
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [photo, setPhoto] = useState<File | null>(null);
  const [honeypot, setHoneypot] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const uid = useId();

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setForm((f) => ({ ...f, [k]: v }));

  const close = () => {
    setOpen(false);
    setTimeout(() => {
      setDone(false);
      setError(null);
      setForm(empty);
      setRating(5);
      setPhoto(null);
    }, 300);
  };

  const validate = () => {
    if (form.name.trim().length < 2) return "Please enter your full name.";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(form.email.trim())) return "Please enter a valid email address.";
    if (!form.country) return "Please select your country.";
    if (!form.service) return "Please select the service you used.";
    if (form.body.trim().length < 20) return "Please write at least 20 characters about your experience.";
    if (photo && photo.size > 3 * 1024 * 1024) return "Photo must be smaller than 3MB.";
    if (photo && !photo.type.startsWith("image/")) return "Photo must be an image file.";
    return null;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) return;
    const problem = validate();
    if (problem) return setError(problem);
    setError(null);
    setBusy(true);

    try {
      let avatarUrl: string | null = null;
      if (photo) {
        const ext = photo.name.split(".").pop()?.toLowerCase() || "jpg";
        const path = `${crypto.randomUUID()}.${ext}`;
        const { error: upErr } = await supabase.storage
          .from("review-avatars")
          .upload(path, photo, { cacheControl: "3600", upsert: false });
        if (!upErr) {
          avatarUrl = supabase.storage.from("review-avatars").getPublicUrl(path).data.publicUrl;
        }
      }

      const country = COUNTRIES.find((c) => c.name === form.country);
      const { error: insErr } = await supabase.from("reviews").insert({
        name: form.name.trim(),
        email: form.email.trim(),
        country: country?.name ?? form.country,
        country_code: country?.code ?? "",
        avatar_url: avatarUrl,
        rating,
        body: form.body.trim(),
        service: form.service,
        price: form.price.trim(),
        duration: form.duration.trim(),
        repeat_client: form.repeat,
        is_sample: false,
        status: "pending",
      });
      if (insErr) throw insErr;

      setDone(true);
      onSubmitted?.();
    } catch (err) {
      console.error(err);
      setError("Something went wrong submitting your review. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const field =
    "w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-accent";

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background transition hover:opacity-90"
      >
        <Star size={16} className="fill-background" /> Write a Review
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] grid place-items-center overflow-y-auto bg-foreground/40 p-4 backdrop-blur-sm"
            onClick={close}
            role="dialog"
            aria-modal="true"
            aria-label="Write a review"
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.97 }}
              onClick={(e) => e.stopPropagation()}
              className="relative my-8 w-full max-w-lg rounded-[2rem] border border-border bg-card p-6 shadow-2xl sm:p-8"
            >
              <button
                onClick={close}
                aria-label="Close"
                className="absolute right-5 top-5 text-muted-foreground transition hover:text-foreground"
              >
                <X size={20} />
              </button>

              {done ? (
                <div className="py-10 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 220, damping: 14 }}
                    className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-accent/20 text-accent"
                  >
                    <Check size={32} />
                  </motion.div>
                  <h3 className="mt-6 font-display text-2xl font-bold">Thank you!</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Your review was submitted and is now pending approval. Once it's verified it
                    will appear on this page.
                  </p>
                  <button
                    onClick={close}
                    className="mt-6 rounded-full bg-foreground px-6 py-2.5 text-sm font-semibold text-background"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <form onSubmit={submit} className="space-y-4">
                  <div>
                    <h3 className="font-display text-2xl font-bold tracking-tight">Write a review</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Reviews are moderated before they appear publicly.
                    </p>
                  </div>

                  <div>
                    <span className="mb-2 block text-sm font-medium">Your rating</span>
                    <div className="flex gap-1.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <button
                          key={i}
                          type="button"
                          aria-label={`${i + 1} star${i ? "s" : ""}`}
                          onMouseEnter={() => setHover(i + 1)}
                          onMouseLeave={() => setHover(0)}
                          onClick={() => setRating(i + 1)}
                          className="transition-transform hover:scale-110"
                        >
                          <Star
                            size={28}
                            className={i < (hover || rating) ? "fill-accent text-accent" : "text-border"}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor={`${uid}-name`} className="mb-1.5 block text-sm font-medium">Full name</label>
                      <input id={`${uid}-name`} className={field} value={form.name} onChange={(e) => set("name", e.target.value)} required />
                    </div>
                    <div>
                      <label htmlFor={`${uid}-email`} className="mb-1.5 block text-sm font-medium">Email (private)</label>
                      <input id={`${uid}-email`} type="email" className={field} value={form.email} onChange={(e) => set("email", e.target.value)} required />
                    </div>
                    <div>
                      <label htmlFor={`${uid}-country`} className="mb-1.5 block text-sm font-medium">Country</label>
                      <select id={`${uid}-country`} className={field} value={form.country} onChange={(e) => set("country", e.target.value)} required>
                        <option value="">Select country</option>
                        {COUNTRIES.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label htmlFor={`${uid}-service`} className="mb-1.5 block text-sm font-medium">Service used</label>
                      <select id={`${uid}-service`} className={field} value={form.service} onChange={(e) => set("service", e.target.value)} required>
                        <option value="">Select service</option>
                        {SERVICE_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label htmlFor={`${uid}-price`} className="mb-1.5 block text-sm font-medium">Project price (optional)</label>
                      <input id={`${uid}-price`} className={field} placeholder="$300" value={form.price} onChange={(e) => set("price", e.target.value)} />
                    </div>
                    <div>
                      <label htmlFor={`${uid}-duration`} className="mb-1.5 block text-sm font-medium">Duration (optional)</label>
                      <input id={`${uid}-duration`} className={field} placeholder="2 weeks" value={form.duration} onChange={(e) => set("duration", e.target.value)} />
                    </div>
                  </div>

                  <div>
                    <label htmlFor={`${uid}-body`} className="mb-1.5 block text-sm font-medium">Your review</label>
                    <textarea id={`${uid}-body`} rows={4} className={field} value={form.body} onChange={(e) => set("body", e.target.value)} required />
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <label className="inline-flex cursor-pointer items-center gap-2 text-sm">
                      <input type="checkbox" checked={form.repeat} onChange={(e) => set("repeat", e.target.checked)} className="h-4 w-4 rounded border-border accent-current" />
                      I'm a repeat client
                    </label>
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border px-4 py-2 text-sm transition hover:bg-secondary">
                      <Upload size={14} />
                      {photo ? photo.name.slice(0, 22) : "Add photo (optional)"}
                      <input type="file" accept="image/*" className="sr-only" onChange={(e) => setPhoto(e.target.files?.[0] ?? null)} />
                    </label>
                  </div>

                  <input
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    className="absolute left-[-9999px] h-0 w-0 opacity-0"
                  />

                  {error && <p className="text-sm text-destructive">{error}</p>}

                  <button
                    type="submit"
                    disabled={busy}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background transition hover:opacity-90 disabled:opacity-60"
                  >
                    {busy && <Loader2 size={16} className="animate-spin" />}
                    {busy ? "Submitting..." : "Submit review"}
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
