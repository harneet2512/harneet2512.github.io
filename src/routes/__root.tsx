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
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import appCss from "../styles.css?url";
import { SidebarProvider } from "@/components/ui/sidebar";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { AppSidebar } from "@/components/workspace/AppSidebar";
import { BuilderContext } from "@/components/workspace/BuilderContext";
import { BootSequence } from "@/components/workspace/BootSequence";
import { CommandLayer } from "@/components/workspace/CommandLayer";
import { PageBreadcrumb } from "@/components/workspace/PageBreadcrumb";

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
            className="inline-flex items-center justify-center rounded-md border border-border bg-surface px-4 py-2 text-sm text-foreground transition-colors hover:border-border-strong"
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
            className="rounded-md border border-border bg-surface px-4 py-2 text-sm text-foreground hover:border-border-strong"
          >
            Try again
          </button>
          <a
            href="/"
            className="rounded-md border border-border bg-surface px-4 py-2 text-sm text-foreground hover:border-border-strong"
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
      { title: "Harneet Bali — AI Engineer + Product Builder" },
      {
        name: "description",
        content:
          "Harneet Bali — AI Engineer + Product Builder. Building AI workflows that survive real users, real constraints, and real metrics.",
      },
      { property: "og:title", content: "Harneet Bali — AI Workbench" },
      {
        property: "og:description",
        content:
          "Founder-grade AI workbench portfolio. Healthcare AI, agentic tooling, eval infrastructure.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
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

  return (
    <QueryClientProvider client={queryClient}>
      {!booted && <BootSequence onDone={() => setBooted(true)} />}
      <AnimatePresence>
        {booted && (
          <SidebarProvider>
            <div className="flex h-screen w-full">
              {/* Sidebar — slides in from left */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, ease: EASE, delay: 0 }}
              >
                <AppSidebar />
              </motion.div>

              <ResizablePanelGroup direction="horizontal" className="flex-1">
                <ResizablePanel defaultSize={78} minSize={50}>
                  <ResizablePanelGroup direction="vertical">
                    <ResizablePanel defaultSize={60} minSize={30}>
                      {/* Main content — fades up */}
                      <motion.main
                        className="h-full overflow-auto"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: EASE, delay: 0.08 }}
                      >
                        <div className="mx-auto flex max-w-[1000px] flex-col gap-8 px-8 py-10 md:px-14 md:py-14">
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
                    </ResizablePanel>
                    <ResizableHandle className="bg-transparent transition-colors hover:bg-sage/15" />
                    <ResizablePanel defaultSize={40} minSize={20}>
                      {/* Command layer — slides up from bottom */}
                      <motion.div
                        className="h-full"
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: EASE, delay: 0.16 }}
                      >
                        <CommandLayer />
                      </motion.div>
                    </ResizablePanel>
                  </ResizablePanelGroup>
                </ResizablePanel>
                <ResizableHandle className="hidden bg-transparent transition-colors hover:bg-sage/15 lg:flex" />
                <ResizablePanel
                  defaultSize={22}
                  minSize={15}
                  maxSize={35}
                  className="hidden lg:block"
                >
                  {/* Builder signature — slides in from right */}
                  <motion.div
                    className="h-full"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, ease: EASE, delay: 0.12 }}
                  >
                    <BuilderContext />
                  </motion.div>
                </ResizablePanel>
              </ResizablePanelGroup>
            </div>
          </SidebarProvider>
        )}
      </AnimatePresence>
    </QueryClientProvider>
  );
}
