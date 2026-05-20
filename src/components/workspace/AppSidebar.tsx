import { Link, useRouterState } from "@tanstack/react-router";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Eyebrow } from "@/components/ui/primitives/Eyebrow";

type Item = { title: string; url: string; external?: boolean };

const WORKSPACE: Item[] = [
  { title: "Home", url: "/" },
  { title: "Overview", url: "/overview" },
];

const PORTFOLIO: Item[] = [
  { title: "About", url: "/about" },
  { title: "Timeline", url: "/timeline" },
  { title: "Projects", url: "/projects" },
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
    const active = !item.external && pathname === item.url;
    const inner = (
      <div
        className={`relative flex h-7 items-center rounded-[5px] pl-3 pr-2 transition-all duration-200 ${
          active
            ? "bg-surface-card"
            : "hover:bg-surface-card/50"
        }`}
      >
        <span
          aria-hidden
          className={`absolute left-0 top-1 bottom-1 w-[2px] rounded-full transition-all duration-200 ${
            active ? "bg-sage" : "bg-transparent"
          }`}
        />
        <span
          className={`truncate text-[13px] transition-colors duration-200 ${
            active
              ? "text-foreground"
              : "text-text-secondary hover:text-foreground"
          }`}
        >
          {item.title}
        </span>
      </div>
    );

    return (
      <SidebarMenuItem key={item.title} className="list-none">
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
    <SidebarGroup className="px-3 py-3">
      <SidebarGroupLabel asChild className="mb-1 px-3 h-auto">
        <Eyebrow as="div">{label}</Eyebrow>
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu className="gap-0.5">{items.map(renderItem)}</SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarContent className="bg-surface-inset">
        {/* Workspace identity */}
        <div className="flex items-center gap-2.5 px-4 pb-3 pt-5">
          <div className="flex h-7 w-7 items-center justify-center rounded-[6px] bg-surface-card text-[11px] font-semibold text-foreground">
            HB
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-[12.5px] font-medium text-foreground">Harneet Bali</span>
            <span className="text-[10.5px] text-text-tertiary">Workspace</span>
          </div>
        </div>
        <div className="mx-4 h-px bg-border-hair/50" />

        {renderGroup("Workspace", WORKSPACE)}
        {renderGroup("Portfolio", PORTFOLIO)}
        {renderGroup("Case studies", CASES)}
        {renderGroup("External", EXTERNAL)}
      </SidebarContent>
    </Sidebar>
  );
}
