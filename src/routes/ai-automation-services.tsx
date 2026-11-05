import { createFileRoute } from "@tanstack/react-router";
import { ServiceDetail } from "@/components/site/ServiceDetail";
import { servicePages, servicePageHead } from "@/lib/service-pages";
const page = servicePages[3];
export const Route = createFileRoute("/ai-automation-services")({ head: () => servicePageHead(page), component: () => <ServiceDetail page={page} /> });