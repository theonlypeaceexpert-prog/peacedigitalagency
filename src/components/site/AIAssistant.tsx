import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Send } from "lucide-react";

type Msg = { role: "user" | "ai"; text: string };

const KB: { q: RegExp; a: string }[] = [
  { q: /service|offer|do you do/i, a: "We offer Website & Shopify development, SEO/GEO, AI automation, UGC & AI video, and full-stack marketing (Meta, TikTok, Pinterest, Klaviyo, Mailchimp). Visit our Services page for the full list." },
  { q: /shopify|project|portfolio|work/i, a: "We've delivered premium Shopify experiences for FunnyFuzzy, Boody, Ryderwear, Jamie Kay, Slick Gorilla and more. Check the Portfolio page for live previews." },
  { q: /platform|tech|stack/i, a: "We specialize in Shopify, WooCommerce, Wix, GoDaddy, plus Klaviyo, Mailchimp, Meta, TikTok, Pinterest and Google ecosystems." },
  { q: /contact|reach|email|whatsapp|phone/i, a: "Email Theonlypeaceexpert@gmail.com or WhatsApp +44 7828 747179. The Contact page has a full project brief form." },
  { q: /different|why|unique|special/i, a: "We blend AI-powered automation with premium creative & conversion engineering — every build is bespoke, performance-first, and tuned to scale revenue, not just look pretty." },
  { q: /price|cost|budget/i, a: "Projects are scoped to your goals. Share your budget in the Contact form and we'll propose a phased roadmap within 24h." },
];

const suggestions = [
  "What services do you offer?",
  "Show me Shopify projects.",
  "What platforms do you work with?",
  "How can I contact you?",
  "What makes your agency different?",
];

function answer(q: string) {
  const hit = KB.find((k) => k.q.test(q));
  return hit?.a ?? "Great question — drop us a message via the Contact page or WhatsApp and a strategist will reply within a few hours.";
}

export function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "ai", text: "Hi, I'm Peace — DǝǝPeaçeAɠency's AI strategist. Ask me anything." },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, typing]);

  const send = (text: string) => {
    if (!text.trim()) return;
    setMsgs((m) => [...m, { role: "user", text }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setMsgs((m) => [...m, { role: "ai", text: answer(text) }]);
      setTyping(false);
    }, 700);
  };

  return (
    <>
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1.2, type: "spring" }}
        whileHover={{ scale: 1.08 }}
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 grid place-items-center h-14 w-14 rounded-full bg-gradient-to-br from-foreground to-accent text-background shadow-[0_10px_30px_rgba(0,0,0,0.25)]"
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
            className="fixed bottom-24 right-6 z-50 w-[min(380px,calc(100vw-3rem))] h-[560px] glass rounded-3xl shadow-2xl flex flex-col overflow-hidden"
          >
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-foreground to-accent grid place-items-center text-background">
                  <Sparkles size={16} />
                </div>
                <div>
                  <p className="font-semibold text-sm">Peace · AI Strategist</p>
                  <p className="text-xs text-muted-foreground">Online · replies instantly</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Close"><X size={18} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {msgs.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                    m.role === "user" ? "bg-foreground text-background" : "bg-secondary text-secondary-foreground"
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {typing && (
                <div className="flex gap-1 px-4 py-2.5 bg-secondary rounded-2xl w-fit">
                  <span className="h-1.5 w-1.5 rounded-full bg-foreground/50 animate-bounce" />
                  <span className="h-1.5 w-1.5 rounded-full bg-foreground/50 animate-bounce [animation-delay:0.15s]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-foreground/50 animate-bounce [animation-delay:0.3s]" />
                </div>
              )}
              {msgs.length === 1 && (
                <div className="pt-2 space-y-2">
                  <p className="text-xs text-muted-foreground px-1">Try asking:</p>
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="block w-full text-left text-xs px-3 py-2 rounded-xl bg-secondary/60 hover:bg-secondary transition"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
              <div ref={endRef} />
            </div>

            <form
              onSubmit={(e) => { e.preventDefault(); send(input); }}
              className="p-3 border-t border-border flex gap-2"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything..."
                className="flex-1 rounded-full bg-secondary/60 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-accent"
              />
              <button type="submit" className="h-10 w-10 grid place-items-center rounded-full bg-foreground text-background" aria-label="Send">
                <Send size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
