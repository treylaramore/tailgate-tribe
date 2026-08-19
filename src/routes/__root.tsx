import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { Toaster } from "sonner";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { NotFoundPage } from "@/components/site-chrome";
import { AuthProvider } from "@/lib/auth/provider";
import { SiteProvider } from "@/lib/site-provider";
import appCss from "../styles.css?url";

const APP_NAME = "Tailgate Tribe";
const host = import.meta.env.VITE_PUBLIC_HOSTNAME;
const ogImage = host ? `https://${host}/og.jpg` : undefined;
const xBanner = host
  ? `https://og.grok.me/v1/banner.png?host=${encodeURIComponent(host)}&title=${encodeURIComponent(APP_NAME)}`
  : undefined;

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: APP_NAME },
      {
        name: "description",
        content:
          "Gameday fellowship for Seminole fans. Family-friendly tailgate at every FSU home football game — east of Lot 8, look for the inflatable tent.",
      },
      { name: "apple-mobile-web-app-title", content: APP_NAME },
      { name: "theme-color", content: "#7A2032" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:title", content: APP_NAME },
      { property: "og:type", content: "website" },
      { property: "og:description", content: "Find your people. Skip the stress. Tailgate with the Tribe." },
      ...(ogImage
        ? [
            { property: "og:image", content: ogImage },
            { property: "og:image:width", content: "1200" },
            { property: "og:image:height", content: "630" },
          ]
        : []),
      ...(xBanner
        ? [
            { property: "x:game:image", content: xBanner },
            { property: "x:game:image:width", content: "1200" },
            { property: "x:game:image:height", content: "264" },
          ]
        : []),
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
    ],
  }),
  notFoundComponent: NotFoundPage,
  component: () => (
    <html lang="en" className="antialiased" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <PreviewHostBridge />
        <AuthProvider>
          <SiteProvider>
            <Outlet />
            <Toaster theme="dark" position="bottom-center" />
          </SiteProvider>
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  ),
});
