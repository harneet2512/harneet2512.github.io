import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import appCss from "../styles.css?url";
import { initAnalytics, trackPageview } from "@/lib/analytics";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/workspace/AppSidebar";
import { BuilderContext } from "@/components/workspace/BuilderContext";
import { BootSequence } from "@/components/workspace/BootSequence";
import { CommandLayer } from "@/components/workspace/CommandLayer";
import { PageBreadcrumb } from "@/components/workspace/PageBreadcrumb";
import { StatusBar } from "@/components/workspace/StatusBar";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-mono text-[11px] uppercase tracking-[0.14em] text-subtle">
          404 · not found
        </h1>
        <h2 className="mt-3 text-xl font-medium text-foreground">This file doesn&apos;t exist.</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The route you&apos;re looking for isn&apos;t in this workspace.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-row border border-border bg-surface px-4 py-2 text-sm text-foreground transition-colors hover:border-border-strong"
          >
            Return home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-medium text-foreground">Something didn&apos;t load.</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="rounded-row border border-border bg-surface px-4 py-2 text-sm text-foreground hover:border-border-strong"
          >
            Try again
          </button>
          <a
            href="/"
            className="rounded-row border border-border bg-surface px-4 py-2 text-sm text-foreground hover:border-border-strong"
          >
            Home
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
      { title: "Harneet Bali" },
      {
        name: "description",
        content:
          "Harneet Bali — AI Engineer + Product Manager. Building AI workflows that survive real users, real constraints, and real metrics.",
      },
      { property: "og:title", content: "Harneet Bali — AI Engineer + Product Manager" },
      {
        property: "og:description",
        content:
          "Founder-grade AI workbench portfolio. Healthcare AI, agentic tooling, eval infrastructure.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&family=JetBrains+Mono:wght@400;500;700&family=Newsreader:ital,opsz,wght@0,6..72,500;0,6..72,600;1,6..72,500&display=swap",
      },
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body className="bg-background text-foreground antialiased">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

const EASE = [0.22, 1, 0.36, 1] as const;

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const [booted, setBooted] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const isDashboard = pathname === "/dashboard";

  // Product analytics: wire autocapture/lifecycle once, then fire a pageview on
  // every route change. Skipped for the private dashboard so it doesn't self-log.
  useEffect(() => {
    initAnalytics();
  }, []);
  useEffect(() => {
    if (isDashboard) return;
    trackPageview(pathname);
  }, [pathname, isDashboard]);

  // Safety net: never let the boot screen hang. Reveal the site after 4.5s
  // even if the boot animation's own timers somehow don't fire.
  useEffect(() => {
    if (booted || isDashboard) return;
    const t = setTimeout(() => setBooted(true), 4500);
    return () => clearTimeout(t);
  }, [booted, isDashboard]);

  return (
    <QueryClientProvider client={queryClient}>
      {!booted && !isDashboard && <BootSequence onDone={() => setBooted(true)} />}
      {(booted || isDashboard) && (pathname === "/" || isDashboard) && <Outlet />}
      <AnimatePresence>
        {booted && pathname !== "/" && !isDashboard && (
          <SidebarProvider>
            <div className="flex h-screen w-full">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, ease: EASE, delay: 0 }}
              >
                <AppSidebar />
              </motion.div>

              <div className="flex min-w-0 flex-1">
                <div className="flex min-w-0 flex-1 flex-col">
                  <motion.main
                    className="min-h-0 flex-1 overflow-auto"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: EASE, delay: 0.08 }}
                  >
                    <div className="mx-auto flex max-w-[1040px] flex-col gap-8 px-6 pb-8 pt-9 md:px-12 md:pb-10 md:pt-12">
                      <PageBreadcrumb />
                      <motion.div
                        key={pathname}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, ease: EASE }}
                      >
                        <Outlet />
                      </motion.div>
                    </div>
                  </motion.main>

                  <motion.div
                    className="h-[34%] min-h-[220px] shrink-0 md:h-[35%] md:min-h-[260px]"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: EASE, delay: 0.16 }}
                  >
                    <CommandLayer />
                  </motion.div>
                  <StatusBar />
                </div>

                <motion.div
                  className="hidden h-full w-[300px] shrink-0 border-l border-border-hair lg:block"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, ease: EASE, delay: 0.12 }}
                >
                  <BuilderContext />
                </motion.div>
              </div>
            </div>
          </SidebarProvider>
        )}
      </AnimatePresence>
    </QueryClientProvider>
  );
}
