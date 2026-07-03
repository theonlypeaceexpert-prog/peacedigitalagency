import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Layout } from "@/components/site/Layout";
import { UgcGallery } from "@/components/site/UgcGallery";

export const Route = createFileRoute("/ugc")({
  head: () => ({
    meta: [
      { title: "UGC & Video Portfolio — DǝǝPeaçeAɠency" },
      { name: "description", content: "Scroll-stopping UGC, AI commercials and product videos crafted for premium eCommerce brands." },
      { property: "og:title", content: "UGC & Video Portfolio — DǝǝPeaçeAɠency" },
      { property: "og:description", content: "Scroll-stopping UGC, AI commercials and product videos crafted for premium eCommerce brands." },
      { property: "og:url", content: "https://peacedigitalagency.lovable.app/ugc" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://peacedigitalagency.lovable.app/ugc" }],
  }),
  component: UgcRoute,
});

function UgcRoute() {
  return (
    <Layout>
      <section className="mx-auto max-w-7xl px-6 py-20">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm uppercase tracking-[0.2em] text-accent font-medium"
        >
          Video Portfolio
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-4 font-display text-5xl sm:text-7xl font-bold tracking-tight max-w-4xl text-balance"
        >
          UGC, AI commercials & <span className="italic font-light text-gradient">product films.</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="mt-6 max-w-2xl text-lg text-muted-foreground"
        >
          Hover to preview. Tap play for sound. Toggle <em>Reorder</em> to curate your own edit — your arrangement is saved locally.
        </motion.p>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <UgcGallery />
      </section>
    </Layout>
  );
}
