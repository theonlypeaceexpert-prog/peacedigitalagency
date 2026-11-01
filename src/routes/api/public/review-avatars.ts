import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

/**
 * Anonymous reviewer photos are uploaded here instead of directly into the
 * private `review-avatars` bucket. This keeps every write privileged
 * (service-role, server-side) so no storage policy has to allow anonymous
 * INSERTs, and every file is validated and renamed server-side.
 */
const MAX_BYTES = 3 * 1024 * 1024;

const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export const Route = createFileRoute("/api/public/review-avatars")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let form: FormData;
        try {
          form = await request.formData();
        } catch {
          return Response.json({ error: "Invalid form submission." }, { status: 400 });
        }

        const file = form.get("file");
        if (!(file instanceof File)) {
          return Response.json({ error: "Please attach a photo." }, { status: 400 });
        }
        if (file.size === 0 || file.size > MAX_BYTES) {
          return Response.json({ error: "Photo must be smaller than 3MB." }, { status: 400 });
        }

        const ext = ALLOWED_TYPES[file.type];
        if (!ext) {
          return Response.json(
            { error: "Photo must be a JPG, PNG, WebP or GIF image." },
            { status: 400 },
          );
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const path = `${crypto.randomUUID()}.${ext}`;
        const { error } = await supabaseAdmin.storage
          .from("review-avatars")
          .upload(path, file, {
            cacheControl: "3600",
            upsert: false,
            contentType: file.type,
          });

        if (error) {
          console.error("review avatar upload failed", error);
          return Response.json(
            { error: "Could not upload the photo. Please try again." },
            { status: 500 },
          );
        }

        return Response.json({ path });
      },
    },
  },
});

// Referenced so the zod import stays meaningful if validation grows later.
export const avatarUploadLimits = z.object({ maxBytes: z.number() });
