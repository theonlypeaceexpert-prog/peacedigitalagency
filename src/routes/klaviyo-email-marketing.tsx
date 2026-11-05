import { createFileRoute } from "@tanstack/react-router";
import { ServiceDetail } from "@/components/site/ServiceDetail";
import { servicePages, servicePageHead } from "@/lib/service-pages";
const page = servicePages[2];
export const Route = createFileRoute("/klaviyo-email-marketing")({ head: () => servicePageHead(page), component: () => <ServiceDetail page={page} /> });