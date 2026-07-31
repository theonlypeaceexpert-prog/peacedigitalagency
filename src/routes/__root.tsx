import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import faviconAsset from "../assets/favicon.png.asset.json";
import { assetUrl } from "../lib/asset-url";
import logoAsset from "../assets/deepeace-logo.jpeg.asset.json";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "DǝǝPeaçeAɠency — Premium Digital Growth for eCommerce Brands" },
      { name: "description", content: "Elite digital agency specializing in Shopify, AI automation, performance marketing and conversion-led design for ambitious eCommerce brands." },
      { property: "og:title", content: "DǝǝPeaçeAɠency — Premium Digital Growth for eCommerce Brands" },
      { property: "og:description", content: "Elite digital agency specializing in Shopify, AI automation, performance marketing and conversion-led design for ambitious eCommerce brands." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:image", content: assetUrl(logoAsset.url) },
      { name: "twitter:image", content: assetUrl(logoAsset.url) },
      { name: "theme-color", content: "#F8F8F6" },
      { name: "twitter:title", content: "DǝǝPeaçeAɠency — Premium Digital Growth for eCommerce Brands" },
      { name: "twitter:description", content: "Elite digital agency specializing in Shopify, AI automation, performance marketing and conversion-led design for ambitious eCommerce brands." },
      { property: "og:site_name", content: "DǝǝPeaçeAɠency" },
    ],
    links: [
      { rel: "icon", type: "image/png", href: assetUrl(faviconAsset.url) },
      { rel: "apple-touch-icon", href: assetUrl(faviconAsset.url) },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap" },
      { rel: "stylesheet", href: appCss },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              "@id": "https://peacedigitalagency.lovable.app/#organization",
              name: "DǝǝPeaçeAɠency",
              url: "https://peacedigitalagency.lovable.app",
              logo: assetUrl(logoAsset.url),
              description: "Premium digital growth agency for ambitious eCommerce brands.",
              foundingDate: "2021",
            },
            {
              "@type": "WebSite",
              "@id": "https://peacedigitalagency.lovable.app/#website",
              url: "https://peacedigitalagency.lovable.app",
              name: "DǝǝPeaçeAɠency",
              publisher: { "@id": "https://peacedigitalagency.lovable.app/#organization" },
            },
          ],
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
