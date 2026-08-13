import videoAsset from "@/assets/results-showcase.mp4.asset.json";
import posterAsset from "@/assets/results-poster.jpg.asset.json";
import { assetUrl } from "@/lib/asset-url";
import { projects } from "@/lib/site-data";

/**
 * SINGLE SOURCE OF TRUTH for every number shown on the Results page and the
 * home-page stat strip. Edit values here only.
 * Only use figures that can be substantiated from real project work.
 */

export const headlineStats = [
  { numeric: projects.length, suffix: "+", label: "eCommerce growth projects" },
  { numeric: 20, suffix: "+", label: "Specialist services delivered" },
  { numeric: 12, suffix: "", label: "Platforms & channels mastered" },
  { numeric: 100, suffix: "%", label: "Performance-focused delivery" },
];

/** Short strip used on the home page. */
export const stats = [
  { value: `${projects.length}+`, label: "Growth Projects" },
  { value: "20+", label: "Services Delivered" },
  { value: "Performance-Focused", label: "Growth Approach" },
  { value: "12", label: "Platforms Mastered" },
];

/**
 * Benchmarks describe the build standard we hold every project to.
 * They are delivery standards, not client revenue claims.
 */
export const benchmarks = [
  { label: "Core Web Vitals pass rate on new builds", value: 100 },
  { label: "Mobile-first responsive coverage", value: 100 },
  { label: "Projects shipped with SEO fundamentals in place", value: 100 },
  { label: "Projects shipped with email/automation foundations", value: 80 },
];

export const standards = [
  { value: "90+", title: "Lighthouse target", desc: "Performance budget every build is held to" },
  { value: "< 2.5s", title: "LCP target", desc: "Largest Contentful Paint goal on mobile" },
  { value: "Mobile-first", title: "Design standard", desc: "Every layout is designed for phones first" },
];

export const resultsVideo = {
  src: assetUrl(videoAsset.url),
  poster: assetUrl(posterAsset.url),
  title: "See The Work In Action",
  subtitle:
    "See how strategy, design, optimization and marketing come together to create measurable digital growth.",
};
