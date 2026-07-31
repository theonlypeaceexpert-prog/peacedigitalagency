/**
 * Lovable-hosted media (logos, videos, favicon) lives on the Lovable asset CDN
 * under a root-relative `/__l5e/...` path. That path only resolves on Lovable
 * hosting — on any other host (Vercel, custom deploys) it 404s and images/videos
 * break. Resolving every asset against the canonical origin keeps media working
 * everywhere. The CDN sends `access-control-allow-origin: *`.
 */
const ASSET_ORIGIN = "https://peacedigitalagency.lovable.app";

export function assetUrl(url: string): string {
  if (!url) return url;
  if (/^https?:\/\//i.test(url) || url.startsWith("data:")) return url;
  return `${ASSET_ORIGIN}${url.startsWith("/") ? "" : "/"}${url}`;
}
