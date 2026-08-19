/**
 * Official DeePeace Agency business inboxes.
 * Each address has a distinct purpose — never swap them.
 */
export const AGENCY_EMAILS = {
  general: "info@deepeaceagency.com",
  projects: "contact@deepeaceagency.com",
  support: "support@deepeaceagency.com",
} as const;

export type EmailChannel = {
  key: "general" | "projects" | "support";
  label: string;
  email: string;
  description: string;
  cta: string;
  primary?: boolean;
};

export const EMAIL_CHANNELS: EmailChannel[] = [
  {
    key: "general",
    label: "General Enquiries",
    email: AGENCY_EMAILS.general,
    description:
      "Have a general question about Deepeace Agency, our services, partnerships, or how we can help your business? Get in touch with our team.",
    cta: "Email Us",
  },
  {
    key: "projects",
    label: "Start a Project",
    email: AGENCY_EMAILS.projects,
    description:
      "Ready to improve your online presence or grow your eCommerce business? Contact us about your next website, Shopify, SEO, marketing, automation, or digital growth project.",
    cta: "HIRE ME",
    primary: true,
  },
  {
    key: "support",
    label: "Client Support",
    email: AGENCY_EMAILS.support,
    description:
      "Already working with Deepeace Agency? Contact our support team for project assistance, technical issues, updates, revisions, maintenance, and ongoing support.",
    cta: "Contact Support",
  },
];
