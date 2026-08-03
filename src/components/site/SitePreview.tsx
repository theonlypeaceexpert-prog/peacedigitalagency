import { useEffect, useRef, useState } from "react";

interface Props {
  url: string;
  title: string;
  /** local pre-captured full-page screenshot, e.g. "/screenshots/boody.jpg" */
  shot?: string;
  /** seconds per full scroll cycle */
  duration?: number;
  /** load eagerly (first cards) */
  priority?: boolean;
}

/**
 * Realistic desktop browser mockup showing a full-page homepage screenshot
 * that auto-scrolls top → bottom in a continuous loop and pauses on hover.
 *
 * Primary source is a locally-hosted pre-captured screenshot (never breaks,
 * works on any host). Microlink is used only as a fallback.
 */
export function SitePreview({ url, title, shot, duration = 22, priority = false }: Props) {
  const [loaded, setLoaded] = useState(false);
  const [srcIndex, setSrcIndex] = useState(0);
  const [distance, setDistance] = useState(0);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);

  const encoded = encodeURIComponent(url);
  const sources = [
    ...(shot ? [shot] : []),
    `https://api.microlink.io/?url=${encoded}&screenshot=true&meta=false&embed=screenshot.url&screenshot.fullPage=true&viewport.width=1280`,
    `https://image.thum.io/get/width/1200/fullpage/noanimate/${url}`,
  ];

  useEffect(() => {
    if (!loaded) return;
    const calc = () => {
      const frame = frameRef.current;
      const img = imgRef.current;
      if (!frame || !img) return;
      const visibleH = frame.clientHeight - 36;
      const imgH = img.clientHeight;
      setDistance(Math.max(0, imgH - visibleH));
    };
    calc();
    const ro = new ResizeObserver(calc);
    if (frameRef.current) ro.observe(frameRef.current);
    if (imgRef.current) ro.observe(imgRef.current);
    return () => ro.disconnect();
  }, [loaded, srcIndex]);

  const animName = `scroll-${Math.round(duration)}-${Math.round(distance)}`;

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

      {!loaded && (
        <div className="absolute inset-0 pt-9 grid place-items-center z-10">
          <div className="h-8 w-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
        </div>
      )}

      <div className="absolute inset-0 pt-9 overflow-hidden">
        <img
          ref={imgRef}
          key={srcIndex}
          src={sources[srcIndex]}
          alt={`${title} homepage screenshot`}
          loading={priority ? "eager" : "lazy"}
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
          className="w-full block will-change-transform group-hover/preview:[animation-play-state:paused]"
          style={{
            opacity: loaded ? 1 : 0,
            transition: "opacity 0.6s ease",
            animation:
              loaded && distance > 0
                ? `${animName} ${duration}s cubic-bezier(0.45,0,0.55,1) infinite`
                : undefined,
          }}
        />
      </div>

      {distance > 0 && (
        <style>{`
          @keyframes ${animName} {
            0%, 6%   { transform: translate3d(0,0,0); }
            50%      { transform: translate3d(0,-${distance}px,0); }
            94%, 100%{ transform: translate3d(0,0,0); }
          }
        `}</style>
      )}
    </div>
  );
}
