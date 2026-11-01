import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

/**
 * Reviewer photos live in the private `review-avatars` bucket and stored
 * values are object paths. Signed URLs are created server-side with the
 * privileged client, and only for paths that belong to a non-rejected
 * review — so no storage policy has to allow anonymous reads.
 */
const pathSchema = z.string().regex(/^[0-9a-fA-F-]{36}\.[A-Za-z0-9]{2,5}$/);

const inputSchema = z.object({
  paths: z.array(pathSchema).min(1).max(60),
});

export const getReviewAvatarUrls = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => inputSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: rows, error } = await supabaseAdmin
      .from("reviews")
      .select("avatar_url")
      .in("avatar_url", data.paths)
      .neq("status", "rejected");

    if (error) {
      console.error("avatar lookup failed", error);
      return { urls: {} as Record<string, string> };
    }

    const allowed = Array.from(
      new Set(rows.map((r) => r.avatar_url).filter((p): p is string => Boolean(p))),
    );
    if (allowed.length === 0) return { urls: {} as Record<string, string> };

    const { data: signed, error: signError } = await supabaseAdmin.storage
      .from("review-avatars")
      .createSignedUrls(allowed, 3600);

    if (signError || !signed) {
      console.error("avatar signing failed", signError);
      return { urls: {} as Record<string, string> };
    }

    const urls: Record<string, string> = {};
    for (const item of signed) {
      if (item.path && item.signedUrl) urls[item.path] = item.signedUrl;
    }
    return { urls };
  });
