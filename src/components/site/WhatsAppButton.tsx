import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

export function WhatsAppButton() {
  return (
    <motion.a
      href="https://wa.me/447828747179"
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: "spring" }}
      whileHover={{ scale: 1.1 }}
      className="fixed bottom-6 left-6 z-40 grid place-items-center h-14 w-14 rounded-full bg-[#25D366] text-white shadow-[0_10px_30px_rgba(37,211,102,0.4)]"
    >
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30" />
      <MessageCircle size={24} className="relative" />
    </motion.a>
  );
}
