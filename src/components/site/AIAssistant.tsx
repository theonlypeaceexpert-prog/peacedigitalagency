import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Send, UserRound, Check, Loader2 } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { askAssistant, submitEscalation } from "@/lib/ai.functions";

type Msg = { role: "user" | "assistant"; content: string };

const suggestions = [
  "My Shopify store gets traffic but no sales — why?",
  "How do I improve my store's page speed?",
  "What should my Klaviyo email flows look like?",
  "How do I lower my Meta ads cost per purchase?",
];

const GREETING: Msg = {
  role: "assistant",
  content:
    "Hi, I'm Peace AI — the growth consultant for DǝǝPeaçeAɠency. Tell me what's happening with your store, ads or website and I'll help you work through it.",
};

export function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([GREETING]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [showLead, setShowLead] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const ask = useServerFn(askAssistant);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, typing, showLead]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || typing) return;
    const next: Msg[] = [...msgs, { role: "user", content: trimmed }];
    setMsgs(next);
    setInput("");
    setTyping(true);
    try {
      const res = await ask({
        data: { messages: next.filter((m) => m !== GREETING).slice(-16) },
      });
      setMsgs((m) => [
        ...m,
        {
          role: "assistant",
          content:
            res.reply ||
            res.error ||
            "I couldn't reach my brain just then — try again, or tap Talk to Peace.",
        },
      ]);
    } catch (e) {
      console.error(e);
      setMsgs((m) => [
        ...m,
        { role: "assistant", content: "Something went wrong on my side. Please try again in a moment." },
      ]);
    } finally {
      setTyping(false);
    }
  };

  return (
    <>
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1.2, type: "spring" }}
        whileHover={{ scale: 1.08 }}
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-foreground to-accent text-background shadow-[0_10px_30px_rgba(0,0,0,0.25)]"
        aria-label="Open AI assistant"
      >
        <Sparkles size={22} />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="glass fixed bottom-24 right-6 z-50 flex h-[min(600px,calc(100vh-8rem))] w-[min(390px,calc(100vw-3rem))] flex-col overflow-hidden rounded-3xl shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-border p-4">
              <div className="flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-foreground to-accent text-background">
                  <Sparkles size={16} />
                </div>
                <div>
                  <p className="text-sm font-semibold">Peace · AI Growth Consultant</p>
                  <p className="text-xs text-muted-foreground">Online · real answers, no fluff</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Close">
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {msgs.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      m.role === "user"
                        ? "bg-foreground text-background"
                        : "bg-secondary text-secondary-foreground"
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}

              {typing && (
                <div className="flex w-fit gap-1 rounded-2xl bg-secondary px-4 py-2.5">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-foreground/50" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-foreground/50 [animation-delay:0.15s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-foreground/50 [animation-delay:0.3s]" />
                </div>
              )}

              {msgs.length === 1 && (
                <div className="space-y-2 pt-2">
                  <p className="px-1 text-xs text-muted-foreground">Try asking:</p>
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => void send(s)}
                      className="block w-full rounded-xl bg-secondary/60 px-3 py-2 text-left text-xs transition hover:bg-secondary"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              {showLead && (
                <LeadForm
                  conversation={msgs}
                  onClose={() => setShowLead(false)}
                />
              )}

              <div ref={endRef} />
            </div>

            <div className="border-t border-border p-3">
              <button
                onClick={() => setShowLead((v) => !v)}
                className="mb-2 inline-flex w-full items-center justify-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4 py-2 text-xs font-semibold transition hover:bg-accent/20"
              >
                <UserRound size={14} /> Talk to Peace
              </button>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  void send(input);
                }}
                className="flex gap-2"
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask anything about growing your store..."
                  className="flex-1 rounded-full bg-secondary/60 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-accent"
                />
                <button
                  type="submit"
                  disabled={typing}
                  className="grid h-10 w-10 place-items-center rounded-full bg-foreground text-background disabled:opacity-50"
                  aria-label="Send"
                >
                  <Send size={16} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function LeadForm({ conversation, onClose }: { conversation: Msg[]; onClose: () => void }) {
  const escalate = useServerFn(submitEscalation);
  const [form, setForm] = useState({ name: "", email: "", website: "", phone: "", question: "" });
  const [hp, setHp] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const field =
    "w-full rounded-xl border border-border bg-background px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-accent";

  if (done) {
    return (
      <div className="rounded-2xl border border-accent/30 bg-accent/10 p-4 text-center">
        <div className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-accent/20 text-accent">
          <Check size={20} />
        </div>
        <p className="mt-3 text-sm font-semibold">Sent to Peace</p>
        <p className="mt-1 text-xs text-muted-foreground">
          You'll get a personal reply by email, usually within a few hours.
        </p>
        <button onClick={onClose} className="mt-3 text-xs font-semibold underline">
          Back to chat
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        if (hp) return;
        if (form.name.trim().length < 2) return setError("Please enter your name.");
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(form.email.trim())) return setError("Enter a valid email.");
        if (form.question.trim().length < 5) return setError("Tell Peace what you need help with.");
        setError(null);
        setBusy(true);
        try {
          const res = await escalate({
            data: {
              name: form.name.trim(),
              email: form.email.trim(),
              website: form.website.trim(),
              phone: form.phone.trim(),
              question: form.question.trim(),
              conversationSummary: conversation
                .map((m) => `${m.role === "user" ? "Visitor" : "AI"}: ${m.content}`)
                .join("\n")
                .slice(-5000),
              reason: "Requested personal assistance from the AI assistant",
            },
          });
          if (res.ok) setDone(true);
          else setError(res.error ?? "Could not send. Please try again.");
        } catch (err) {
          console.error(err);
          setError("Could not send. Please try again.");
        } finally {
          setBusy(false);
        }
      }}
      className="space-y-2 rounded-2xl border border-border bg-card p-4"
    >
      <p className="text-sm font-semibold">Talk to Peace</p>
      <p className="text-xs text-muted-foreground">
        Share your details and Peace will personally review your case.
      </p>
      <input className={field} placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <input className={field} type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <input className={field} placeholder="Store / website URL (optional)" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
      <input className={field} placeholder="WhatsApp / phone (optional)" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
      <textarea className={field} rows={3} placeholder="What do you need help with?" value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} />
      <input
        type="text"
        tabIndex={-1}
        aria-hidden="true"
        autoComplete="off"
        value={hp}
        onChange={(e) => setHp(e.target.value)}
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
      <div className="flex gap-2 pt-1">
        <button
          type="submit"
          disabled={busy}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background disabled:opacity-60"
        >
          {busy && <Loader2 size={12} className="animate-spin" />} Send to Peace
        </button>
        <button type="button" onClick={onClose} className="rounded-full border border-border px-4 py-2 text-xs">
          Cancel
        </button>
      </div>
    </form>
  );
}
