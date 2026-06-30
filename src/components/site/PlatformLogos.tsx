import { motion } from "framer-motion";

// Official brand logos via Simple Icons CDN (SVG, official trademarks).
const platforms = [
  { name: "Shopify", slug: "shopify", color: "95BF47" },
  { name: "WooCommerce", slug: "woocommerce", color: "96588A" },
  { name: "Wix", slug: "wix", color: "0C6EFC" },
  { name: "GoDaddy", slug: "godaddy", color: "1BDBDB" },
  { name: "Google", slug: "google", color: "4285F4" },
  { name: "Facebook", slug: "facebook", color: "1877F2" },
  { name: "Instagram", slug: "instagram", color: "E4405F" },
  { name: "TikTok", slug: "tiktok", color: "000000" },
  { name: "Pinterest", slug: "pinterest", color: "BD081C" },
  { name: "Klaviyo", slug: "klaviyo", color: "1A1A1A" },
  { name: "Hostinger", slug: "hostinger", color: "673DE6" },
  { name: "Mailchimp", slug: "mailchimp", color: "FFE01B" },
];

export function PlatformLogos() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
      {platforms.map((p, i) => (
        <motion.div
          key={p.slug}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ delay: i * 0.05, duration: 0.5 }}
          whileHover={{ y: -6 }}
          className="group relative"
        >
          {/* Soft glow */}
          <div
            className="absolute -inset-1 rounded-3xl opacity-0 group-hover:opacity-60 blur-xl transition-opacity duration-500"
            style={{ background: `#${p.color}` }}
            aria-hidden
          />

          <div
            className="relative glass rounded-3xl p-6 sm:p-7 flex flex-col items-center justify-center gap-3 aspect-square border border-border/50 hover:border-accent/40 transition-all duration-500 animate-float-platform"
            style={{ animationDelay: `${i * 0.15}s` }}
          >
            <div className="h-12 w-12 sm:h-14 sm:w-14 grid place-items-center transition-transform duration-500 group-hover:scale-110">
              <img
                src={`https://cdn.simpleicons.org/${p.slug}/${p.color}`}
                alt={`${p.name} logo`}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-contain"
              />
            </div>
            <p className="text-xs sm:text-sm font-medium tracking-tight text-center">
              {p.name}
            </p>
          </div>
        </motion.div>
      ))}

      <style>{`
        @keyframes float-platform {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .animate-float-platform {
          animation: float-platform 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
