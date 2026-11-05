import { createFileRoute } from "@tanstack/react-router";
import { ServiceDetail } from "@/components/site/ServiceDetail";
import { servicePages, servicePageHead } from "@/lib/service-pages";
const page = servicePages[1];
export const Route = createFileRoute("/shopify-web-design")({ head: () => servicePageHead(page), component: () => <ServiceDetail page={page} /> });