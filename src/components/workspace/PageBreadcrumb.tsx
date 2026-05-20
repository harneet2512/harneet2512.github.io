import { Link, useRouterState } from "@tanstack/react-router";

import { Eyebrow } from "@/components/ui/primitives/Eyebrow";
import { StatusDot } from "@/components/ui/primitives/StatusDot";

const LABELS: Record<string, string> = {
  "": "home",
  about: "about",
  timeline: "timeline",
  projects: "projects",
  overview: "overview",
  case: "case",
};

export function PageBreadcrumb() {
  const pathname = useRouterState({
    select: (router) => router.location.pathname,
  });

  const segments = pathname.split("/").filter(Boolean);

  const crumbs = [
    { label: "workspace", to: "/" },
    ...segments.map((seg, i) => ({
      label: LABELS[seg] ?? seg,
      to: "/" + segments.slice(0, i + 1).join("/"),
    })),
  ];

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-2">
      {crumbs.map((c, i) => {
        const isLast = i === crumbs.length - 1;
        return (
          <div key={i} className="flex items-center gap-2">
            {isLast ? (
              <Eyebrow>{c.label}</Eyebrow>
            ) : (
              <Link to={c.to} className="contents">
                <Eyebrow className="text-text-tertiary transition-colors hover:text-text-secondary">
                  {c.label}
                </Eyebrow>
              </Link>
            )}
            {!isLast && <StatusDot tone="sage" className="opacity-70" />}
          </div>
        );
      })}
    </nav>
  );
}
