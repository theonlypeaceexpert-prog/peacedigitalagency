import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface Props {
  url: string;
  title: string;
  /** seconds per full scroll cycle */
  duration?: number;
}

/**
 * Realistic desktop browser mockup with a full-page screenshot that
 * auto-scrolls top→bottom in a continuous loop and pauses on hover.
 *
 * Uses WordPress mShots (free, no key, full-page capture) with a Microlink
 * fallback so cards never stay blank.
 */
export function SitePreview({ url, title, duration = 22 }: Props) {
  const [loaded, setLoaded] = useState(false);
  const [srcIndex, setSrcIndex] = useState(0);
  const [scrollDistance, setScrollDistance] = useState(0);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);

  const encoded = encodeURIComponent(url);
  // Ordered fallbacks — all return a full-page PNG/JPG at ~1200px wide.
  const sources = [
    `https://s.wordpress.com/mshots/v1/${encoded}?w=1200&h=3000`,
    `https://api.microlink.io/?url=${encoded}&screenshot=true&meta=false&embed=screenshot.url&screenshot.fullPage=true&viewport.width=1280`,
    `https://image.thum.io/get/width/1200/png/noanimate/${url}`,
  ];

  // Recompute scroll distance whenever the image finishes loading or the
  // frame resizes, so the animation always ends exactly at the image bottom.
  useEffect(() => {
    if (!loaded) return;
    const calc = () => {
      const frame = frameRef.current;
      const img = imgRef.current;
      if (!frame || !img) return;
      const frameH = frame.clientHeight - 36; // subtract chrome height
      const imgH = img.clientHeight;
      setScrollDistance(Math.max(0, imgH - frameH));
    };
    calc();
    const ro = new ResizeObserver(calc);
    if (frameRef.current) ro.observe(frameRef.current);
    if (imgRef.current) ro.observe(imgRef.current);
    return () => ro.disconnect();
  }, [loaded]);

  return (
    <div
      ref={frameRef}
      className="relative w-full h-full overflow-hidden bg-secondary/40 group/preview"
    >
      {/* Browser chrome */}
      <div className="absolute inset-x-0 top-0 h-9 bg-card/95 backdrop-blur flex items-center gap-1.5 px-3 border-b border-border z-20">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <div className="ml-3 flex-1 h-5 rounded-md bg-secondary/80 flex items-center px-2.5">
          <span className="text-[10px] text-muted-foreground truncate font-mono">
            {url.replace(/^https?:\/\//, "")}
          </span>
        </div>
      </div>

      {/* Loading spinner */}
      {!loaded && (
        <div className="absolute inset-0 pt-9 grid place-items-center z-10">
          <div className="h-8 w-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
        </div>
      )}

      {/* Screenshot layer — auto-scrolls when loaded */}
      <div className="absolute inset-0 pt-9 overflow-hidden">
        <motion.img
          ref={imgRef}
          key={srcIndex}
          src={sources[srcIndex]}
          alt={`${title} homepage`}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => {
            if (srcIndex < sources.length - 1) {
              setSrcIndex((i) => i + 1);
              setLoaded(false);
            } else {
              setLoaded(true);
            }
          }}
          className="w-full block will-change-transform"
          initial={{ opacity: 0 }}
          animate={
            loaded && scrollDistance > 0
              ? {
                  opacity: 1,
                  y: [0, -scrollDistance, -scrollDistance, 0, 0],
                }
              : { opacity: loaded ? 1 : 0, y: 0 }
          }
          transition={
            loaded && scrollDistance > 0
              ? {
                  opacity: { duration: 0.6 },
                  y: {
                    duration,
                    times: [0, 0.45, 0.55, 0.95, 1],
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatDelay: 0.4,
                  },
                }
              : { duration: 0.5 }
          }
          style={{
            animationPlayState: "running",
          }}
        />
      </div>

      {/* Hover pause overlay */}
      <style>{`
        .group\\/preview:hover img { animation-play-state: paused; }
      `}</style>
      <PauseOnHover targetRef={frameRef} />
    </div>
  );
}

/**
 * Pauses the Framer Motion animation while the pointer is over the card,
 * by toggling a data attribute the parent watches. We use a small child
 * component so we can hook into pointer events without re-rendering the img.
 */
function PauseOnHover({ targetRef }: { targetRef: React.RefObject<HTMLDivElement | null> }) {
  useEffect(() => {
    const el = targetRef.current;
    if (!el) return;
    const img = el.querySelector("img");
    if (!img) return;
    const onEnter = () => ((img as HTMLElement).style.animationPlayState = "paused");
    const onLeave = () => ((img as HTMLElement).style.animationPlayState = "running");
    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [targetRef]);
  return null;
}
