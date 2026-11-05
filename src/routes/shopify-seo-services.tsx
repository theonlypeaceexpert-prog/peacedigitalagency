import { createFileRoute } from "@tanstack/react-router";
import { ServiceDetail } from "@/components/site/ServiceDetail";
import { servicePages, servicePageHead } from "@/lib/service-pages";
const page = servicePages[0];
export const Route = createFileRoute("/shopify-seo-services")({ head: () => servicePageHead(page), component: () => <ServiceDetail page={page} /> });