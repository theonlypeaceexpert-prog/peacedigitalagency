import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { AI_SYSTEM_PROMPT } from "@/lib/agency-knowledge";

const chatSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(2000),
      }),
    )
    .min(1)
    .max(24),
});

export const askAssistant = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => chatSchema.parse(data))
  .handler(async ({ data }) => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) {
      return { reply: "", error: "The assistant is temporarily unavailable." };
    }

    try {
      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3.6-flash",
          messages: [{ role: "system", content: AI_SYSTEM_PROMPT }, ...data.messages],
        }),
      });

      if (res.status === 429) {
        return { reply: "", error: "Too many requests right now — please try again in a moment." };
      }
      if (res.status === 402) {
        return { reply: "", error: "The assistant is temporarily unavailable." };
      }
      if (!res.ok) {
        console.error("AI gateway error", res.status, await res.text());
        return { reply: "", error: "The assistant hit an error. Please try again." };
      }

      const json = (await res.json()) as {
        choices?: { message?: { content?: string } }[];
      };
      const reply = json.choices?.[0]?.message?.content?.trim() ?? "";
      if (!reply) return { reply: "", error: "The assistant hit an error. Please try again." };
      return { reply, error: null as string | null };
    } catch (error) {
      console.error(error);
      return { reply: "", error: "The assistant is unreachable right now." };
    }
  });

const leadSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(160),
  website: z.string().trim().max(200).optional().or(z.literal("")),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  question: z.string().trim().min(5).max(2000),
  conversationSummary: z.string().trim().max(6000).optional().or(z.literal("")),
  reason: z.string().trim().max(200).optional().or(z.literal("")),
  company: z.string().max(0).optional(), // honeypot
});

export const submitEscalation = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => leadSchema.parse(data))
  .handler(async ({ data }) => {
    if (data.company) return { ok: true };

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("ai_leads").insert({
      name: data.name,
      email: data.email,
      website: data.website || null,
      phone: data.phone || null,
      question: data.question,
      conversation_summary: data.conversationSummary || null,
      reason: data.reason || "Requested personal assistance",
      source: "ai",
      status: "new",
    });
    if (error) {
      console.error(error);
      return { ok: false, error: "Could not save your request. Please try again." };
    }

    // Notify Peace by email (best-effort; the lead is already stored).
    try {
      await fetch("https://formsubmit.co/ajax/contact@deepeaceagency.com", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          _subject: `New AI assistant lead — ${data.name}`,
          _template: "table",
          Name: data.name,
          Email: data.email,
          Website: data.website || "—",
          "Phone / WhatsApp": data.phone || "—",
          Question: data.question,
          "Escalation reason": data.reason || "Requested personal assistance",
          "Conversation summary": data.conversationSummary || "—",
          "Date / time (UTC)": new Date().toISOString(),
        }),
      });
    } catch (mailError) {
      console.error("lead email notification failed", mailError);
    }

    return { ok: true, error: null as string | null };
  });

const contactSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(160),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  company: z.string().trim().max(120).optional().or(z.literal("")),
  service: z.string().trim().min(1).max(120),
  budget: z.string().trim().min(1).max(60),
  details: z.string().trim().min(20).max(4000),
  website: z.string().max(0).optional(), // honeypot
});

export const submitContact = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => contactSchema.parse(data))
  .handler(async ({ data }) => {
    if (data.website) return { ok: true, error: null as string | null };

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("ai_leads").insert({
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      company: data.company || null,
      service: data.service,
      budget: data.budget,
      question: data.details,
      reason: "Contact page inquiry",
      source: "contact",
      status: "new",
    });
    if (error) {
      console.error(error);
      return { ok: false, error: "We could not save your message. Please try again." };
    }

    try {
      const res = await fetch("https://formsubmit.co/ajax/contact@deepeaceagency.com", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          _subject: `New DǝǝPeaçeAɠency Inquiry — ${data.name}`,
          _template: "table",
          Name: data.name,
          Email: data.email,
          Phone: data.phone || "—",
          Company: data.company || "—",
          Service: data.service,
          Budget: data.budget,
          "Project Details": data.details,
          "Date / time (UTC)": new Date().toISOString(),
        }),
      });
      if (!res.ok) {
        console.error("contact email failed", res.status, await res.text());
        return {
          ok: false,
          error: "Your message was saved but the email notification failed. Please retry or email contact@deepeaceagency.com directly.",
        };
      }
    } catch (mailError) {
      console.error("contact email failed", mailError);
      return {
        ok: false,
        error: "The email service is unreachable right now. Please retry in a moment.",
      };
    }

    return { ok: true, error: null as string | null };
  });
