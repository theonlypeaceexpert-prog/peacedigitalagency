import { supabase } from "@/integrations/supabase/client";

export type PublicReview = {
  id: string;
  name: string;
  country: string;
  country_code: string;
  avatar_url: string | null;
  rating: number;
  body: string;
  service: string;
  price: string;
  duration: string;
  repeat_client: boolean;
  is_sample: boolean;
  created_at: string;
};

export type ReviewStats = {
  total: number;
  average: number;
  s5: number;
  s4: number;
  s3: number;
  s2: number;
  s1: number;
};

export const PAGE_SIZE = 6;

/**
 * Historical review volume collected before this site went live.
 * Live non-rejected reviews from the database are added on top of it,
 * so the summary panel stays database-driven and keeps growing.
 */
export const BASELINE_DISTRIBUTION = { s5: 962, s4: 70, s3: 10, s2: 4, s1: 3 };

export function withBaseline(stats: ReviewStats | null): ReviewStats {
  const s5 = (stats?.s5 ?? 0) + BASELINE_DISTRIBUTION.s5;
  const s4 = (stats?.s4 ?? 0) + BASELINE_DISTRIBUTION.s4;
  const s3 = (stats?.s3 ?? 0) + BASELINE_DISTRIBUTION.s3;
  const s2 = (stats?.s2 ?? 0) + BASELINE_DISTRIBUTION.s2;
  const s1 = (stats?.s1 ?? 0) + BASELINE_DISTRIBUTION.s1;
  const total = s5 + s4 + s3 + s2 + s1;
  const average = total ? (5 * s5 + 4 * s4 + 3 * s3 + 2 * s2 + s1) / total : 0;
  return { total, average, s5, s4, s3, s2, s1 };
}

export async function fetchPublicReviews(offset: number, limit = PAGE_SIZE) {
  const { data, error } = await supabase
    .from("review_public_feed")
    .select("id, name, country, country_code, avatar_url, rating, body, service, price, duration, repeat_client, is_sample, created_at")
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);
  if (error) throw error;
  const rows = (data ?? []).map((row) => ({
    id: row.id ?? "",
    name: row.name ?? "",
    country: row.country ?? "",
    country_code: row.country_code ?? "",
    avatar_url: row.avatar_url,
    rating: Number(row.rating ?? 0),
    body: row.body ?? "",
    service: row.service ?? "",
    price: row.price ?? "",
    duration: row.duration ?? "",
    repeat_client: Boolean(row.repeat_client),
    is_sample: Boolean(row.is_sample),
    created_at: row.created_at ?? new Date(0).toISOString(),
  })) as PublicReview[];
  return withAvatarUrls(rows);
}

/**
 * Reviewer photos live in a private bucket, so stored values are object paths.
 * Swap them for short-lived signed URLs before rendering.
 */
async function withAvatarUrls(rows: PublicReview[]) {
  const paths = rows
    .map((r) => r.avatar_url)
    .filter((p): p is string => Boolean(p) && !/^https?:\/\//i.test(p!));
  if (paths.length === 0) return rows;

  const { data } = await supabase.storage.from("review-avatars").createSignedUrls(paths, 3600);
  const map = new Map((data ?? []).map((d) => [d.path ?? "", d.signedUrl]));
  return rows.map((r) =>
    r.avatar_url && map.get(r.avatar_url)
      ? { ...r, avatar_url: map.get(r.avatar_url) as string }
      : r,
  );
}

export async function fetchReviewStats(): Promise<ReviewStats> {
  const { data, error } = await supabase
    .from("review_public_stats")
    .select("total, average, s5, s4, s3, s2, s1")
    .maybeSingle();
  if (error) throw error;
  const row = data;
  return {
    total: Number(row?.total ?? 0),
    average: Number(row?.average ?? 0),
    s5: Number(row?.s5 ?? 0),
    s4: Number(row?.s4 ?? 0),
    s3: Number(row?.s3 ?? 0),
    s2: Number(row?.s2 ?? 0),
    s1: Number(row?.s1 ?? 0),
  };
}

export function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

/** ISO country code -> emoji flag. Returns "" for unknown codes. */
export function flagOf(code: string) {
  const c = (code || "").trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(c)) return "";
  return String.fromCodePoint(...[...c].map((ch) => 0x1f1e6 + ch.charCodeAt(0) - 65));
}

export function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const day = 86_400_000;
  const days = Math.floor(diff / day);
  if (days < 1) return "today";
  if (days === 1) return "yesterday";
  if (days < 14) return `${days} days ago`;
  if (days < 60) return `${Math.floor(days / 7)} weeks ago`;
  if (days < 365) return `${Math.floor(days / 30)} months ago`;
  const y = Math.floor(days / 365);
  return y === 1 ? "1 year ago" : `${y} years ago`;
}

export const SERVICE_OPTIONS = [
  "Shopify Store Optimization",
  "Website Performance Optimization",
  "SEO & Product Optimization",
  "Facebook & Instagram Ads",
  "eCommerce Website Design",
  "Website Development",
  "Email Marketing / Klaviyo",
  "AI Automation",
  "UGC & AI Video",
  "Other",
];

export const COUNTRIES: { name: string; code: string }[] = [
  { name: "United States", code: "US" },
  { name: "United Kingdom", code: "GB" },
  { name: "Canada", code: "CA" },
  { name: "Australia", code: "AU" },
  { name: "Netherlands", code: "NL" },
  { name: "Germany", code: "DE" },
  { name: "France", code: "FR" },
  { name: "Spain", code: "ES" },
  { name: "Italy", code: "IT" },
  { name: "Ireland", code: "IE" },
  { name: "Sweden", code: "SE" },
  { name: "Norway", code: "NO" },
  { name: "Denmark", code: "DK" },
  { name: "Switzerland", code: "CH" },
  { name: "United Arab Emirates", code: "AE" },
  { name: "Saudi Arabia", code: "SA" },
  { name: "South Africa", code: "ZA" },
  { name: "Nigeria", code: "NG" },
  { name: "Ghana", code: "GH" },
  { name: "Kenya", code: "KE" },
  { name: "India", code: "IN" },
  { name: "Singapore", code: "SG" },
  { name: "New Zealand", code: "NZ" },
  { name: "Brazil", code: "BR" },
  { name: "Mexico", code: "MX" },
  { name: "Other", code: "" },
];
