import { useState } from "react";
import { motion } from "framer-motion";

interface Props {
  url: string;
  title: string;
}

/**
 * Realistic browser frame containing a live site preview.
 * Strategy:
 *  - Always render a high-res screenshot (thum.io, free, no key) as the base layer.
 *  - Overlay an iframe; if the site allows framing it paints over the screenshot.
 *  - If the site sends X-Frame-Options/CSP the iframe stays blank and the screenshot shows through.
 *  - Both layers auto-scroll top→bottom in a continuous loop, pausing on hover.
 *  - Loading spinner while the screenshot loads.
 */
export function SitePreview({ url, title }: Props) {
  const [loaded, setLoaded] = useState(false);
  // thum.io: tall capture (1200x2400) — preserves aspect ratio, no stretching.
  const screenshot = `https://image.thum.io/get/width/1200/crop/2400/noanimate/${url}`;

  return (
    <div className="relative w-full h-full overflow-hidden bg-secondary/40 group/preview">
      {/* Browser chrome */}
      <div className="absolute inset-x-0 top-0 h-9 bg-card/95 backdrop-blur flex items-center gap-1.5 px-3 border-b border-border z-20">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <div className="ml-3 flex-1 h-5 rounded-md bg-secondary/80 flex items-center px-2.5">
          <span className="text-[10px] text-muted-foreground truncate font-mono">{url}</span>
        </div>
      </div>

      {/* Loading shimmer */}
      {!loaded && (
        <div className="absolute inset-0 pt-9 grid place-items-center z-10">
          <div className="h-8 w-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
        </div>
      )}

      {/* Screenshot layer (fallback + base) */}
      <div className="absolute inset-0 pt-9 overflow-hidden">
        <motion.img
          src={screenshot}
          alt={`${title} homepage preview`}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setLoaded(true)}
          className="w-full block animate-[scroll-y_24s_ease-in-out_infinite] group-hover/preview:[animation-play-state:paused]"
          initial={{ opacity: 0 }}
          animate={{ opacity: loaded ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Live iframe layer — covers screenshot when site allows embedding */}
      <div className="absolute inset-0 pt-9 overflow-hidden pointer-events-none">
        <iframe
          src={url}
          title={title}
          loading="lazy"
          sandbox="allow-scripts allow-same-origin"
          referrerPolicy="no-referrer"
          className="w-full h-[240%] border-0 animate-[scroll-y_24s_ease-in-out_infinite] group-hover/preview:[animation-play-state:paused]"
          style={{ background: "transparent" }}
        />
      </div>

      <style>{`
        @keyframes scroll-y {
          0%, 8% { transform: translateY(0); }
          50% { transform: translateY(-58%); }
          92%, 100% { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
