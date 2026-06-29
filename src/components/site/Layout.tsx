import type { ReactNode } from "react";
import { Nav } from "./Nav";
import { Footer } from "./Footer";
import { WhatsAppButton } from "./WhatsAppButton";
import { AIAssistant } from "./AIAssistant";
import { motion } from "framer-motion";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <motion.main
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="pt-28"
      >
        {children}
      </motion.main>
      <Footer />
      <WhatsAppButton />
      <AIAssistant />
    </div>
  );
}
