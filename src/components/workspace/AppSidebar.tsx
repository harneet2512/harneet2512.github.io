import { Link, useRouterState } from "@tanstack/react-router";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Eyebrow } from "@/components/ui/primitives/Eyebrow";

type Item = {
  title: string;
  url: string;
  external?: boolean;
  active?: (pathname: string) => boolean;
};

const WORKSPACE: Item[] = [
  { title: "Home", url: "/" },
  { title: "Favorites", url: "/projects" },
];

const PORTFOLIO: Item[] = [
  { title: "Overview", url: "/overview" },
  { title: "Operating Thesis", url: "/" },
  { title: "Case Files", url: "/projects", active: (pathname) => pathname.startsWith("/case/") },
  { title: "Proof of Work", url: "/about" },
  { title: "Projects", url: "/projects" },
  { title: "Timeline", url: "/timeline" },
];

const CASES: Item[] = [
  { title: "GroundTruth", url: "/case/groundtruth" },
  { title: "CodeTune", url: "/case/codetune" },
  { title: "TracePilot", url: "/case/tracepilot" },
  { title: "ExecutionDesk AI", url: "/case/executiondesk" },
  { title: "RobbyMD", url: "/case/robbymd" },
];

const EXTERNAL: Item[] = [
  { title: "GitHub", url: "https://github.com/harneet2512", external: true },
  { title: "LinkedIn", url: "https://www.linkedin.com/in/harneetbali/", external: true },
  { title: "Resume", url: "#", external: true },
];

export function AppSidebar() {
  const pathname = useRouterState({
    select: (router) => router.location.pathname,
  });

  const renderItem = (item: Item) => {
    const active = !item.external && (item.active ? item.active(pathname) : pathname === item.url);
    const inner = (
      <div className="relative flex h-7 items-center pl-4 pr-2">
        <span
          aria-hidden
          className={`absolute left-0 top-1 bottom-1 w-[2px] rounded-full transition-colors duration-200 ${
            active ? "bg-sage" : "bg-transparent"
          }`}
        />
        <span
          className={`truncate text-[13px] transition-colors duration-200 ${
            active ? "text-foreground" : "text-text-secondary hover:text-foreground"
          }`}
        >
          {item.title}
        </span>
      </div>
    );

    return (
      <SidebarMenuItem key={`${item.title}-${item.url}`} className="list-none">
        {item.external ? (
          <a href={item.url} target="_blank" rel="noreferrer" className="block">
            {inner}
          </a>
        ) : (
          <Link to={item.url} className="block">
            {inner}
          </Link>
        )}
      </SidebarMenuItem>
    );
  };

  const renderGroup = (label: string, items: Item[]) => (
    <SidebarGroup className="px-4 py-3">
      <SidebarGroupLabel asChild className="mb-1 h-auto px-0">
        <Eyebrow as="div">{label}</Eyebrow>
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu className="gap-0.5">{items.map(renderItem)}</SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar collapsible="icon" className="border-r border-border-hair">
      <SidebarContent className="bg-surface-inset">
        <div className="flex items-center gap-2.5 px-5 pb-4 pt-5">
          <div className="flex h-7 w-7 items-center justify-center rounded-row border border-border-hair bg-surface-card text-[11px] font-semibold text-foreground">
            HB
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-[12.5px] font-medium text-foreground">Harneet Bali</span>
            <span className="text-[10.5px] text-text-tertiary">AI Workbench</span>
          </div>
        </div>
        <div className="mx-5 h-px bg-border-hair" />

        {renderGroup("Workspace", WORKSPACE)}
        {renderGroup("Portfolio", PORTFOLIO)}
        {renderGroup("Case Studies", CASES)}
        {renderGroup("External", EXTERNAL)}
      </SidebarContent>
      <SidebarFooter className="border-t border-border-hair bg-surface-inset px-5 py-4">
        <button
          type="button"
          onClick={() => {
            window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }));
          }}
          className="flex h-8 items-center justify-between rounded-chip border border-border-hair px-2.5 font-mono text-[11px] text-text-tertiary transition-colors hover:border-border-line hover:text-text-secondary"
        >
          <span>Command Menu</span>
          <span>⌘K</span>
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}
