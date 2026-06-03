import { useChat } from "@ai-sdk/react";
import { apiUrl } from "@/lib/api";
import { createFileRoute } from "@tanstack/react-router";
import { DefaultChatTransport } from "ai";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
  type ReactNode,
} from "react";

import {
  workbench,
  type TimelineEntry,
  type WorkbenchProject,
  type WorkbenchProjectId,
  type WorkbenchSidequest,
} from "@/data/workbench";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import githubStats from "@/data/github-stats.json";

const GITHUB_STATS = githubStats as unknown as {
  total: number;
  repos: number;
  streak: number;
  weeks: number[][];
  days?: [number, string][][];
  recent?: { repo: string; msg: string; ago: string }[];
  release?: { repo: string; tag: string; ago: string };
};

function track(event: string, meta?: Record<string, string>) {
  fetch(apiUrl("/api/track"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      event,
      meta,
      screen: `${window.screen.width}x${window.screen.height}`,
      lang: navigator.language,
      tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
    }),
  }).catch(() => {});
}
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Harneet Bali" },
      {
        name: "description",
        content:
          "Harneet Bali builds AI systems: MCP tooling, agentic workflows, and evaluation infrastructure. CMU MISM '25. Explore the projects, timeline, and proof of work.",
      },
      { property: "og:title", content: "Harneet Bali" },
      {
        property: "og:description",
        content:
          "AI systems, MCP tooling, and evaluation infrastructure. Projects, proof, and timeline.",
      },
    ],
  }),
  component: FeltHome,
});

type Tab = (typeof workbench.nav)[number]["id"];
type WindowId =
  | "main"
  | "about"
  | "now"
  | "chat"
  | `project-${WorkbenchProjectId}`
  | `timeline-${number}`
  | `sidequest-${number}`;

type FeltWindowState = {
  id: WindowId;
  title: string;
  badge: string;
  kind: "base" | "project" | "timeline";
  className?: string;
  hidden?: boolean;
  minimized?: boolean;
  z: number;
  left?: number;
  top?: number;
  width?: number;
  height?: number;
  maximized?: boolean;
  restore?: Pick<FeltWindowState, "left" | "top" | "width" | "height" | "maximized">;
};

type DragState = {
  id: WindowId;
  startX: number;
  startY: number;
  left: number;
  top: number;
  width: number;
};

const titles: Record<Tab, { title: ReactNode; crumb: string; count: number }> = {
  projects: {
    title: (
      <>
        Six things <em>I shipped.</em>
      </>
    ),
    crumb: "projects",
    count: 5,
  },
  skills: {
    title: (
      <>
        The <em>toolbox.</em>
      </>
    ),
    crumb: "skills",
    count: workbench.skills.length,
  },
  timeline: {
    title: (
      <>
        How I <em>got here.</em>
      </>
    ),
    crumb: "timeline",
    count: workbench.timeline.length,
  },
  sidequest: {
    title: (
      <>
        The <em>receipts.</em>
      </>
    ),
    crumb: "receipts",
    count: workbench.sidequest.length,
  },
};

const BASE_WINDOWS: FeltWindowState[] = [
  {
    id: "main",
    title: "~/main.exe",
    badge: "5",
    kind: "base",
    className: "win-main",
    z: 30,
  },
  {
    id: "about",
    title: "~/about.txt",
    badge: "read-only",
    kind: "base",
    className: "win-about",
    z: 20,
  },
  {
    id: "now",
    title: "~/now.log",
    badge: "live",
    kind: "base",
    className: "win-now",
    z: 18,
  },
  {
    id: "chat",
    title: "harneet@workbench:~",
    badge: "live",
    kind: "base",
    className: "win-chat",
    z: 25,
  },
];

function FeltHome() {
  const deskRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dragRef = useRef<DragState | null>(null);
  const zRef = useRef(50);

  const [active, setActive] = useState<Tab>("projects");
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    if (typeof window === "undefined") return "dark";
    return localStorage.getItem("hb-felt-theme") === "light" ? "light" : "dark";
  });
  const [clock, setClock] = useState("--:--");
  const [factoid, setFactoid] = useState(0);
  const [showNotes, setShowNotes] = useState(true);
  const [draggingId, setDraggingId] = useState<WindowId | null>(null);
  const [windows, setWindows] = useState<FeltWindowState[]>(BASE_WINDOWS);
  const [ctx, setCtx] = useState<{ x: number; y: number; id: WindowId } | null>(null);
  const [wallMsg, setWallMsg] = useState("");
  const [wallSent, setWallSent] = useState(false);
  const [wallNudge, setWallNudge] = useState(false);

  const transport = useMemo(() => new DefaultChatTransport({ api: apiUrl("/api/chat") }), []);
  const { messages, sendMessage, status, error } = useChat({ transport });
  const [chatInput, setChatInput] = useState("");
  const chatBusy = status === "submitted" || status === "streaming";

  const visibleWindows = windows.filter((win) => !win.hidden);
  const dockedWindows = windows.filter((win) => win.minimized);
  const closedWindows = windows.filter(
    (win) => win.hidden && !win.minimized && win.kind === "base",
  );
  const allBaseClosed = windows.filter((w) => w.kind === "base").every((w) => w.hidden);
  const visibleBaseCount = windows.filter((w) => w.kind === "base" && !w.hidden).length;
  const showWallInline = visibleBaseCount <= 2;
  const wallOrder = (() => {
    if (!showWallInline) return 10;
    const orderMap: Record<string, number> = { about: 1, main: 2, now: 3, chat: 4 };
    const visibleOrders = windows
      .filter((w) => w.kind === "base" && !w.hidden)
      .map((w) => orderMap[w.id] ?? 5)
      .sort((a, b) => a - b);
    if (visibleOrders.length >= 2) return visibleOrders[0] + 0.5;
    return 10;
  })();
  const currentTitle = titles[active];

  useEffect(() => {
    document.documentElement.dataset.theme = theme === "light" ? "light" : "";
    localStorage.setItem("hb-felt-theme", theme);
  }, [theme]);

  useEffect(() => {
    track("page_view", { path: "/" });
    const nudgeTimer = setTimeout(() => setWallNudge(true), 45_000);
    return () => clearTimeout(nudgeTimer);
  }, []);

  useEffect(() => {
    const tick = () => {
      // Visitor's own local time, in their locale's format (12/24h + AM/PM).
      setClock(
        new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      );
    };
    tick();
    const clockId = window.setInterval(tick, 10_000);
    const factoidId = window.setInterval(
      () => setFactoid((index) => (index + 1) % workbench.factoids.length),
      9_500,
    );
    return () => {
      window.clearInterval(clockId);
      window.clearInterval(factoidId);
    };
  }, []);

  const focusWindow = useCallback((id: WindowId) => {
    zRef.current += 1;
    setWindows((items) =>
      items.map((item) =>
        item.id === id ? { ...item, hidden: false, minimized: false, z: zRef.current } : item,
      ),
    );
  }, []);

  const closeWindow = useCallback((id: WindowId) => {
    const mobile = typeof window !== "undefined" && window.matchMedia("(max-width: 1024px)").matches;
    setWindows((items) => {
      if (mobile) {
        const target = items.find((w) => w.id === id);
        if (target?.kind === "base") {
          const visibleBase = items.filter((w) => w.kind === "base" && !w.hidden);
          if (visibleBase.length <= 2) {
            toast("keep at least two windows open.", { description: "close something else first." });
            return items;
          }
        }
      }
      return items.map((item) => (item.id === id ? { ...item, hidden: true, minimized: false, maximized: false, restore: undefined } : item));
    });
  }, []);

  const minimizeWindow = useCallback((id: WindowId) => {
    setWindows((items) =>
      items.map((item) => (item.id === id ? { ...item, hidden: true, minimized: true } : item)),
    );
  }, []);

  const resetWindows = useCallback(() => {
    zRef.current = 50;
    setWindows(BASE_WINDOWS);
    setCtx(null);
  }, []);

  const toggleMax = useCallback(
    (id: WindowId) => {
      const mobile = typeof window !== "undefined" && window.matchMedia("(max-width: 1024px)").matches;
      focusWindow(id);
      const desk = deskRef.current?.getBoundingClientRect();
      if (!desk) return;
      setWindows((items) =>
        items.map((item) => {
          if (item.id !== id) return item;
          if (item.maximized) {
            return { ...item, ...(item.restore ?? {}), restore: undefined, maximized: false };
          }
          const rect = document.querySelector(`[data-window-id="${id}"]`)?.getBoundingClientRect();
          return {
            ...item,
            restore: {
              left: item.left ?? (rect ? rect.left - desk.left : undefined),
              top: item.top ?? (rect ? rect.top - desk.top : undefined),
              width: item.width ?? rect?.width,
              height: item.height ?? rect?.height,
              maximized: item.maximized,
            },
            maximized: true,
          };
        }),
      );
    },
    [focusWindow],
  );

  const isMobile =
    typeof window !== "undefined" && window.matchMedia("(max-width: 1024px)").matches;
  const MAX_DETAIL_WINDOWS = 3;

  function closeAllDetails() {
    setWindows((items) => items.filter((item) => item.kind === "base"));
  }

  function spawnProject(id: WorkbenchProjectId) {
    const project = workbench.projects.find((item) => item.id === id);
    if (!project) return;
    track("project_click", { project: id });
    const winId = `project-${id}` as const;
    const existing = windows.find((item) => item.id === winId);
    if (existing) {
      focusWindow(winId);
      return;
    }
    const openDetails = windows.filter((w) => w.kind !== "base" && !w.hidden).length;
    if (openDetails >= MAX_DETAIL_WINDOWS) {
      toast("easy there, 3 windows is the limit.", { description: "close one to open another." });
      return;
    }
    zRef.current += 1;
    const count = windows.filter((item) => item.kind !== "base").length + 1;
    if (isMobile) {
      closeAllDetails();
      setWindows((items) => [
        ...items.filter((item) => item.kind === "base"),
        {
          id: winId,
          title: `~/projects/${id}.md`,
          badge: project.year,
          kind: "project",
          className: "win-detail",
          z: zRef.current,
        },
      ]);
    } else {
      const desk = deskRef.current?.getBoundingClientRect();
      const deskStyle = deskRef.current ? getComputedStyle(deskRef.current) : null;
      const padTop = deskStyle ? parseFloat(deskStyle.paddingTop) || 0 : 0;
      const padBot = deskStyle ? parseFloat(deskStyle.paddingBottom) || 0 : 0;
      const w = 520,
        h = 560;
      const usableH = desk ? desk.height - padTop - padBot : h;
      const cx = desk ? Math.round((desk.width - w) / 2) : 110;
      const cy = desk ? padTop + Math.round((usableH - h) / 2) : 112;
      const stagger = openDetails * 24;
      setWindows((items) => [
        ...items,
        {
          id: winId,
          title: `~/projects/${id}.md`,
          badge: project.year,
          kind: "project",
          className: count % 2 === 0 ? "win-detail alt" : "win-detail",
          left: cx + stagger,
          top: cy + stagger,
          width: w,
          height: h,
          z: zRef.current,
        },
      ]);
    }
  }

  function spawnTimeline(index: number) {
    const item = workbench.timeline[index];
    if (!item) return;
    const winId = `timeline-${index}` as const;
    const existing = windows.find((win) => win.id === winId);
    if (existing) {
      focusWindow(winId);
      return;
    }
    const openDetails = windows.filter((w) => w.kind !== "base" && !w.hidden).length;
    if (openDetails >= MAX_DETAIL_WINDOWS) {
      toast("easy there, 3 windows is the limit.", { description: "close one to open another." });
      return;
    }
    zRef.current += 1;
    const count = windows.filter((win) => win.kind !== "base").length + 1;
    if (isMobile) {
      closeAllDetails();
      setWindows((items) => [
        ...items.filter((item) => item.kind === "base"),
        {
          id: winId,
          title: `~/timeline/${item.when.replace(/[\s-]+/g, "_").toLowerCase()}.md`,
          badge: index === 0 ? "now" : "past",
          kind: "timeline",
          className: "win-detail",
          z: zRef.current,
        },
      ]);
    } else {
      const desk = deskRef.current?.getBoundingClientRect();
      const deskStyle = deskRef.current ? getComputedStyle(deskRef.current) : null;
      const padTop = deskStyle ? parseFloat(deskStyle.paddingTop) || 0 : 0;
      const padBot = deskStyle ? parseFloat(deskStyle.paddingBottom) || 0 : 0;
      const w = 500,
        h = 420;
      const usableH = desk ? desk.height - padTop - padBot : h;
      const cx = desk ? Math.round((desk.width - w) / 2) : 140;
      const cy = desk ? padTop + Math.round((usableH - h) / 2) : 132;
      const stagger = openDetails * 24;
      setWindows((items) => [
        ...items,
        {
          id: winId,
          title: `~/timeline/${item.when.replace(/[\s-]+/g, "_").toLowerCase()}.md`,
          badge: index === 0 ? "now" : "past",
          kind: "timeline",
          className: count % 2 === 0 ? "win-detail alt" : "win-detail",
          left: cx + stagger,
          top: cy + stagger,
          width: w,
          height: h,
          z: zRef.current,
        },
      ]);
    }
  }

  function spawnSidequest(index: number) {
    const item = workbench.sidequest[index];
    if (!item?.details) return;
    const winId = `sidequest-${index}` as const;
    const existing = windows.find((win) => win.id === winId);
    if (existing) {
      focusWindow(winId);
      return;
    }
    const openDetails = windows.filter((w) => w.kind !== "base" && !w.hidden).length;
    if (openDetails >= MAX_DETAIL_WINDOWS) {
      toast("easy there, 3 windows is the limit.", { description: "close one to open another." });
      return;
    }
    zRef.current += 1;
    if (isMobile) {
      closeAllDetails();
      setWindows((items) => [
        ...items.filter((i) => i.kind === "base"),
        {
          id: winId,
          title: `~/receipts/${item.name.replace(/[\s·]+/g, "_").toLowerCase()}.md`,
          badge: item.year,
          kind: "timeline",
          className: "win-detail",
          z: zRef.current,
        },
      ]);
    } else {
      const desk = deskRef.current?.getBoundingClientRect();
      const deskStyle = deskRef.current ? getComputedStyle(deskRef.current) : null;
      const padTop = deskStyle ? parseFloat(deskStyle.paddingTop) || 0 : 0;
      const padBot = deskStyle ? parseFloat(deskStyle.paddingBottom) || 0 : 0;
      const w = 500, h = 420;
      const usableH = desk ? desk.height - padTop - padBot : h;
      const cx = desk ? Math.round((desk.width - w) / 2) : 140;
      const cy = desk ? padTop + Math.round((usableH - h) / 2) : 132;
      const stagger = openDetails * 24;
      setWindows((items) => [
        ...items,
        {
          id: winId,
          title: `~/receipts/${item.name.replace(/[\s·]+/g, "_").toLowerCase()}.md`,
          badge: item.year,
          kind: "timeline",
          className: "win-detail",
          left: cx + stagger,
          top: cy + stagger,
          width: w,
          height: h,
          z: zRef.current,
        },
      ]);
    }
  }

  function submitChat(text = chatInput) {
    const value = text.trim();
    if (!value || chatBusy) return;
    track("terminal_query", { query: value.slice(0, 80) });
    focusWindow("chat");
    sendMessage({ text: value });
    setChatInput("");
  }

  function startDrag(id: WindowId, event: PointerEvent<HTMLDivElement>) {
    const target = event.target as HTMLElement;
    if (target.closest(".lights")) return;
    const desk = deskRef.current?.getBoundingClientRect();
    const rect = (
      event.currentTarget.closest(".win") as HTMLElement | null
    )?.getBoundingClientRect();
    if (!desk || !rect) return;
    focusWindow(id);
    setDraggingId(id);
    dragRef.current = {
      id,
      startX: event.clientX,
      startY: event.clientY,
      left: rect.left - desk.left,
      top: rect.top - desk.top,
      width: rect.width,
    };
    setWindows((items) =>
      items.map((item) =>
        item.id === id
          ? {
              ...item,
              left: rect.left - desk.left,
              top: rect.top - desk.top,
              width: item.width ?? rect.width,
              height: item.height ?? rect.height,
              maximized: false,
            }
          : item,
      ),
    );
  }

  useEffect(() => {
    const move = (event: PointerEvent | globalThis.PointerEvent) => {
      const drag = dragRef.current;
      const desk = deskRef.current?.getBoundingClientRect();
      if (!drag || !desk) return;
      const nextLeft = Math.max(
        -drag.width + 80,
        Math.min(drag.left + event.clientX - drag.startX, desk.width - 60),
      );
      const nextTop = Math.max(
        0,
        Math.min(drag.top + event.clientY - drag.startY, desk.height - 32),
      );
      setWindows((items) =>
        items.map((item) =>
          item.id === drag.id ? { ...item, left: nextLeft, top: nextTop } : item,
        ),
      );
    };
    const up = () => {
      dragRef.current = null;
      setDraggingId(null);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, []);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement)
        return;
      const map: Record<string, Tab> = {
        "1": "projects",
        "2": "skills",
        "3": "timeline",
        "4": "sidequest",
      };
      if (map[event.key]) {
        setActive(map[event.key]);
        focusWindow("main");
      }
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        focusWindow("chat");
        requestAnimationFrame(() => inputRef.current?.focus());
      }
      if (event.key === "Tab") {
        event.preventDefault();
        const sorted = [...visibleWindows].sort((a, b) => a.z - b.z);
        const current = sorted[sorted.length - 1];
        const index = current ? sorted.findIndex((item) => item.id === current.id) : -1;
        const next = sorted[(index + 1) % sorted.length];
        if (next) focusWindow(next.id);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [focusWindow, visibleWindows]);

  return (
    <div className="felt-os">
      <Toaster position="bottom-center" />
      <header className="topbar">
        <button className="signature" type="button" onClick={() => focusWindow("main")}>
          <span className="avatar-tiny" aria-hidden="true">
            <span className="mono">HB</span>
          </span>
          {workbench.identity.displayName}
        </button>

        <nav className="nav" aria-label="Workbench sections">
          {workbench.nav.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setActive(item.id);
                focusWindow("main");
              }}
              className={cn(active === item.id && "active")}
            >
              {item.label}
              <kbd>{index + 1}</kbd>
            </button>
          ))}
        </nav>

        <div className="top-right">
          <span className="pill">
            <span className="gd" />
            {workbench.identity.status}
          </span>
          <button
            type="button"
            className="btn-top"
            onClick={() => setTheme((value) => (value === "light" ? "dark" : "light"))}
          >
            {theme === "light" ? "[ dark ]" : "[ light ]"}
          </button>
          <span className="clock">{clock}</span>
        </div>
      </header>

      <main ref={deskRef} className="desk" onClick={() => setCtx(null)}>
        {showNotes && (
          <>
            <div className="felt-note note-one">
              tab - cycles
              <br />
              1-4 - nav
              <br />
              cmd-k - chat
            </div>
            <div className="felt-note note-two">
              right-click any
              <br />
              window - reset
            </div>
          </>
        )}
        <div
          className={cn("desk-wall", showWallInline && "wall-inline")}
          style={{ order: wallOrder }}
          onClick={(e) => e.stopPropagation()}
        >
          {wallNudge && !wallSent && !wallMsg && (
            <div className="wall-whisper">he reads every one of these</div>
          )}
          {wallSent ? (
            <div className="wall-done">
              <span className="wall-check">sent.</span>
              <span className="wall-sub">it landed. thanks for stopping by.</span>
              <button
                type="button"
                className="wall-reset"
                onClick={() => {
                  setWallSent(false);
                  setWallMsg("");
                }}
              >
                send another
              </button>
            </div>
          ) : (
            <>
              <div className="wall-label">leave a note.</div>
              <div className="wall-sub">
                it goes straight to me, or{" "}
                <a href={workbench.identity.linkedin} target="_blank" rel="noopener noreferrer">
                  connect on linkedin
                </a>
                .
              </div>
              <textarea
                className="wall-input"
                placeholder="write something..."
                value={wallMsg}
                onChange={(e) => setWallMsg(e.target.value)}
                rows={3}
              />
              <button
                type="button"
                className="wall-send"
                disabled={!wallMsg.trim()}
                onClick={() => {
                  if (!wallMsg.trim()) return;
                  fetch(apiUrl("/api/wall"), {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ message: wallMsg.trim() }),
                  })
                    .then(() => setWallSent(true))
                    .catch(() => setWallSent(true));
                }}
              >
                send →
              </button>
            </>
          )}
        </div>

        {windows.map((win) => {
          const style: CSSProperties = {
            zIndex: win.z,
            left: win.left,
            top: win.top,
            width: win.width,
            height: win.height,
          };
          return (
            <FeltWindow
              key={win.id}
              win={win}
              active={active}
              focused={win.z === Math.max(...visibleWindows.map((item) => item.z), 0)}
              dragging={draggingId === win.id}
              style={style}
              startDrag={startDrag}
              focusWindow={focusWindow}
              closeWindow={closeWindow}
              minimizeWindow={minimizeWindow}
              toggleMax={toggleMax}
              setContext={setCtx}
            >
              {renderWindowBody({
                win,
                active,
                setActive,
                spawnProject,
                spawnTimeline,
                spawnSidequest,
                factoid,
                setFactoid,
                chat: { messages, error, chatBusy, chatInput, setChatInput, submitChat, inputRef },
              })}
            </FeltWindow>
          );
        })}
      </main>

      <MinBar windows={dockedWindows} restore={focusWindow} />
      <CloseBar windows={closedWindows} restore={focusWindow} />

      {ctx && (
        <ContextMenu
          ctx={ctx}
          focusWindow={focusWindow}
          closeWindow={closeWindow}
          minimizeWindow={minimizeWindow}
          toggleMax={toggleMax}
          resetWindows={resetWindows}
          toggleNotes={() => setShowNotes((value) => !value)}
          onClose={() => setCtx(null)}
        />
      )}
    </div>
  );
}

function FeltWindow({
  win,
  active,
  focused,
  dragging,
  style,
  children,
  startDrag,
  focusWindow,
  closeWindow,
  minimizeWindow,
  toggleMax,
  setContext,
}: {
  win: FeltWindowState;
  active: Tab;
  focused: boolean;
  dragging: boolean;
  style: CSSProperties;
  children: ReactNode;
  startDrag: (id: WindowId, event: PointerEvent<HTMLDivElement>) => void;
  focusWindow: (id: WindowId) => void;
  closeWindow: (id: WindowId) => void;
  minimizeWindow: (id: WindowId) => void;
  toggleMax: (id: WindowId) => void;
  setContext: (value: { x: number; y: number; id: WindowId } | null) => void;
}) {
  const title = win.id === "main" ? `~/main.exe / ${titles[active].crumb}` : win.title;
  const badge = win.id === "main" ? String(titles[active].count) : win.badge;

  return (
    <section
      data-window-id={win.id}
      className={cn(
        "win",
        win.className,
        focused && "focused",
        dragging && "dragging",
        win.hidden && "hidden",
        win.maximized && "maximized",
      )}
      style={style}
      onPointerDown={(e) => {
        if (win.maximized && e.target === e.currentTarget) {
          toggleMax(win.id);
          return;
        }
        focusWindow(win.id);
      }}
      onContextMenu={(event) => {
        event.preventDefault();
        setContext({ x: event.clientX, y: event.clientY, id: win.id });
        focusWindow(win.id);
      }}
    >
      {win.kind !== "base" && (
        <div className="win-scrim" onClick={() => closeWindow(win.id)} />
      )}
      <div className="titlebar" onPointerDown={(event) => startDrag(win.id, event)}>
        <div className="lights">
          <button
            type="button"
            className="r"
            aria-label="Close"
            onClick={() => {
              const mobile = typeof window !== "undefined" && window.matchMedia("(max-width: 1024px)").matches;
              if (mobile && win.maximized) {
                toggleMax(win.id);
                return;
              }
              closeWindow(win.id);
            }}
          />
          <button
            type="button"
            className="a"
            aria-label="Minimize"
            onClick={() => {
              const mobile = window.matchMedia("(max-width: 1024px)").matches;
              if (mobile) return;
              minimizeWindow(win.id);
            }}
          />
          <button
            type="button"
            className="g"
            aria-label="Maximize"
            onClick={() => toggleMax(win.id)}
          />
        </div>
        <div className="title">{title}</div>
        <div className="badge">{badge}</div>
        <button
          type="button"
          className="mob-close"
          onClick={() => {
            if (win.maximized) {
              toggleMax(win.id);
            } else {
              closeWindow(win.id);
            }
          }}
          aria-label="Close"
        >
          {win.maximized ? "← back" : "← close"}
        </button>
      </div>
      <div className={cn("body", win.id === "chat" && "chat-body")}>{children}</div>
    </section>
  );
}

function renderWindowBody({
  win,
  active,
  setActive,
  spawnProject,
  spawnTimeline,
  spawnSidequest,
  factoid,
  setFactoid,
  chat,
}: {
  win: FeltWindowState;
  active: Tab;
  setActive: (tab: Tab) => void;
  spawnProject: (id: WorkbenchProjectId) => void;
  spawnTimeline: (index: number) => void;
  spawnSidequest: (index: number) => void;
  factoid: number;
  setFactoid: (fn: (index: number) => number) => void;
  chat: ChatProps;
}) {
  if (win.id === "main")
    return (
      <MainExe
        active={active}
        setActive={setActive}
        spawnProject={spawnProject}
        spawnTimeline={spawnTimeline}
        spawnSidequest={spawnSidequest}
      />
    );
  if (win.id === "about") return <AboutWindow />;
  if (win.id === "now") return <NowWindow factoid={factoid} setFactoid={setFactoid} />;
  if (win.id === "chat") return <ChatWindow {...chat} />;
  if (win.id.startsWith("project-")) {
    const project = workbench.projects.find((item) => `project-${item.id}` === win.id);
    return project ? <ProjectDetail project={project} /> : null;
  }
  if (win.id.startsWith("timeline-")) {
    const index = Number(win.id.replace("timeline-", ""));
    const entry = workbench.timeline[index];
    return entry ? <TimelineDetail entry={entry} /> : null;
  }
  if (win.id.startsWith("sidequest-")) {
    const index = Number(win.id.replace("sidequest-", ""));
    const sq = workbench.sidequest[index];
    if (!sq?.details) return null;
    return (
      <>
        <h3>{sq.name}</h3>
        <div className="role-line"><b>{sq.year}</b></div>
        <p className="italic-note">{sq.blurb}</p>
        <DetailSection title="role">{sq.details.role}</DetailSection>
        <DetailSection title="did">{sq.details.did}</DetailSection>
        <DetailSection title="learned">{sq.details.learned}</DetailSection>
        {sq.link && (
          <div className="footnote">
            <a href={sq.link} target="_blank" rel="noopener noreferrer">open repo →</a>
          </div>
        )}
      </>
    );
  }
  return null;
}

function MainExe({
  active,
  spawnProject,
  spawnTimeline,
  spawnSidequest,
}: {
  active: Tab;
  setActive: (tab: Tab) => void;
  spawnProject: (id: WorkbenchProjectId) => void;
  spawnTimeline: (index: number) => void;
  spawnSidequest: (index: number) => void;
}) {
  return (
    <>
      <h2>{titles[active].title}</h2>
      <div className="sub">
        workbench / <span>{titles[active].crumb}</span>
        <span className="hand">click any row to open it.</span>
      </div>
      <div className="main-body">
        {active === "projects" && <ProjectsView spawnProject={spawnProject} />}
        {active === "skills" && <SkillsView />}
        {active === "timeline" && <TimelineView spawnTimeline={spawnTimeline} />}
        {active === "sidequest" && <SidequestView spawnSidequest={spawnSidequest} />}
      </div>
    </>
  );
}

function ProjectsView({ spawnProject }: { spawnProject: (id: WorkbenchProjectId) => void }) {
  return (
    <div className="pj-list">
      {workbench.projects.map((project, index) => (
        <button
          type="button"
          key={project.id}
          className="pj-row"
          onClick={() => spawnProject(project.id)}
        >
          <span className="num">{String(index + 1).padStart(2, "0")}</span>
          <span className="nm">{project.name}</span>
          <span className="bl">{project.blurb}</span>
          <span className="tg">{project.tag}</span>
          <span className="ar">→</span>
        </button>
      ))}
    </div>
  );
}

function SkillsView() {
  const laneRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [spots, setSpots] = useState(() => workbench.skills.map(() => 0));
  const [paused, setPaused] = useState(() => workbench.skills.map(() => false));
  const [pinned, setPinned] = useState(() => workbench.skills.map(() => false));

  const centerSpot = useCallback((lane: HTMLDivElement | null) => {
    if (!lane) return;
    const strip = lane.querySelector<HTMLElement>(".lane-strip");
    const spot = lane.querySelector<HTMLElement>(".word.spot");
    if (!strip || !spot) return;
    const stripRect = strip.getBoundingClientRect();
    const spotRect = spot.getBoundingClientRect();
    const spotCenterInStrip = spotRect.left + spotRect.width / 2 - stripRect.left;
    const stripCenter = stripRect.width / 2;
    const delta = stripCenter - spotCenterInStrip;
    strip.style.transform = `translate(calc(-50% + ${delta}px), -50%)`;
  }, []);

  useEffect(() => {
    const centerAll = () => laneRefs.current.forEach(centerSpot);
    const frame = requestAnimationFrame(centerAll);
    const timeout = window.setTimeout(centerAll, 320);
    window.addEventListener("resize", centerAll);
    document.fonts?.ready.then(centerAll).catch(() => undefined);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(timeout);
      window.removeEventListener("resize", centerAll);
    };
  }, [centerSpot, spots]);

  useEffect(() => {
    const timers = workbench.skills.map((group, groupIndex) =>
      window.setInterval(
        () => {
          setSpots((values) => {
            if (paused[groupIndex] || pinned[groupIndex]) return values;
            const next = [...values];
            next[groupIndex] = (next[groupIndex] + 1) % group.items.length;
            return next;
          });
        },
        2000 + groupIndex * 90,
      ),
    );
    return () => timers.forEach(window.clearInterval);
  }, [paused, pinned]);

  const total = workbench.skills.reduce((sum, group) => sum + group.items.length, 0);

  return (
    <div className="lanes" id="lanes">
      {workbench.skills.map((skill, groupIndex) => (
        <div
          className={cn("lane", (paused[groupIndex] || pinned[groupIndex]) && "paused")}
          data-grp={groupIndex}
          data-i={spots[groupIndex]}
          key={skill.group}
          ref={(node) => {
            laneRefs.current[groupIndex] = node;
          }}
          onMouseEnter={() =>
            setPaused((values) => values.map((value, index) => index === groupIndex || value))
          }
          onMouseLeave={() =>
            setPaused((values) =>
              values.map((value, index) => (index === groupIndex ? false : value)),
            )
          }
        >
          <div className="code">
            {skill.code}
            <small>{skill.group}</small>
          </div>
          <div className="lane-view">
            <div className="lane-strip">
              {skill.items.map((item, itemIndex) => (
                <button
                  type="button"
                  key={item}
                  className={cn("word", spots[groupIndex] === itemIndex && "spot")}
                  data-i={itemIndex}
                  data-grp={groupIndex}
                  onClick={() => {
                    setPinned((values) =>
                      values.map((value, index) => (index === groupIndex ? true : value)),
                    );
                    setSpots((values) =>
                      values.map((value, index) => (index === groupIndex ? itemIndex : value)),
                    );
                  }}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <span className="tick" />
        </div>
      ))}
      <div className="lanes-foot">
        <span>
          4 lanes / <b>{total}</b> entries
        </span>
        <span className="hand">things I reach for when the problem is real.</span>
      </div>
    </div>
  );
}

function SidequestView({ spawnSidequest }: { spawnSidequest: (index: number) => void }) {
  return (
    <div className="polaroid-board">
      {(workbench.sidequest as unknown as WorkbenchSidequest[]).map((item, index) => {
        const hasDetails = !!item.details;
        const inner = (
          <article
            className={cn("polaroid", item.tape === "red" ? "tape-red" : "tape-amber", hasDetails && "clickable")}
            key={item.name}
            style={{ "--tilt": `${[-2.2, 1.4, -0.8, 2][index % 4]}deg` } as CSSProperties}
          >
            <div className="tape" />
            <div className={cn("photo", `photo-${item.treatment}`)}>
              {item.icon ? (
                <SidequestIcon icon={item.icon} />
              ) : (
                <SidequestArt treatment={item.treatment} />
              )}
            </div>
            <div className="yr">{item.year}</div>
            <div className="nm">{item.name}</div>
            <div className="bl">{item.blurb}</div>
          </article>
        );
        if (hasDetails) {
          return (
            <button
              key={item.name}
              type="button"
              onClick={() => spawnSidequest(index)}
              style={{ all: "unset", cursor: "pointer", display: "contents" }}
            >
              {inner}
            </button>
          );
        }
        if (item.link) {
          return (
            <a
              key={item.name}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              {inner}
            </a>
          );
        }
        return inner;
      })}
    </div>
  );
}

function SidequestIcon({
  icon,
}: {
  icon: NonNullable<(typeof workbench.sidequest)[number]["icon"]>;
}) {
  if (icon === "ieee") {
    return (
      <svg
        viewBox="0 0 64 64"
        width="54"
        height="54"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="8" y="12" width="48" height="40" rx="4" fill="#0d3b66" />
        <rect x="12" y="18" width="40" height="28" rx="2" fill="#1a5276" />
        <text
          x="32"
          y="30"
          textAnchor="middle"
          fontFamily="monospace"
          fontSize="8"
          fontWeight="bold"
          fill="#ffd166"
        >
          IEEE
        </text>
        <line x1="16" y1="35" x2="48" y2="35" stroke="#ffd166" strokeWidth="0.5" opacity="0.5" />
        <text x="32" y="42" textAnchor="middle" fontFamily="monospace" fontSize="5" fill="#a8d0e6">
          PUBLISHED
        </text>
      </svg>
    );
  }
  if (icon === "cmu") {
    return (
      <svg
        viewBox="0 0 64 64"
        width="54"
        height="54"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="8" y="16" width="48" height="36" rx="3" fill="#990000" />
        <polygon points="32,10 22,22 42,22" fill="#cc0000" />
        <rect x="14" y="24" width="36" height="24" rx="2" fill="#7a0000" />
        <text
          x="32"
          y="34"
          textAnchor="middle"
          fontFamily="monospace"
          fontSize="7"
          fontWeight="bold"
          fill="#ffffff"
        >
          CMU
        </text>
        <text
          x="32"
          y="43"
          textAnchor="middle"
          fontFamily="monospace"
          fontSize="4.5"
          fill="#ffcccb"
        >
          TEACHING ASST
        </text>
      </svg>
    );
  }
  if (icon === "research") {
    return (
      <svg
        viewBox="0 0 64 64"
        width="54"
        height="54"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="32" cy="28" r="14" fill="#1a1a2e" stroke="#e94560" strokeWidth="1.5" />
        <circle
          cx="32"
          cy="28"
          r="8"
          fill="none"
          stroke="#e94560"
          strokeWidth="1"
          strokeDasharray="2 2"
        />
        <circle cx="32" cy="28" r="3" fill="#e94560" />
        <line x1="32" y1="42" x2="32" y2="52" stroke="#e94560" strokeWidth="1.5" />
        <line x1="24" y1="52" x2="40" y2="52" stroke="#e94560" strokeWidth="1.5" />
        <text
          x="32"
          y="60"
          textAnchor="middle"
          fontFamily="monospace"
          fontSize="4.5"
          fill="#e94560"
        >
          2 YR RESEARCH
        </text>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 64 64" width="54" height="54" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="8" width="48" height="48" rx="4" fill="#1b1b1b" />
      <rect
        x="8"
        y="8"
        width="48"
        height="48"
        rx="4"
        fill="none"
        stroke="#4a4a4a"
        strokeWidth="1"
      />
      {[0, 1, 2, 3, 4, 5, 6, 7].map((r) =>
        [0, 1, 2, 3, 4, 5, 6, 7].map((c) => (
          <rect
            key={`${r}-${c}`}
            x={12 + c * 5}
            y={12 + r * 5}
            width="4.5"
            height="4.5"
            rx="0.5"
            fill={(r + c) % 2 === 0 ? "#b58863" : "#f0d9b5"}
            opacity="0.9"
          />
        )),
      )}
      <text
        x="32"
        y="60"
        textAnchor="middle"
        fontFamily="monospace"
        fontSize="5"
        fontWeight="bold"
        fill="#b58863"
      >
        hsb_2512
      </text>
    </svg>
  );
}

function SidequestArt({ treatment }: { treatment: "log" | "letter" | "recipe" | "redact" }) {
  if (treatment === "log") {
    return (
      <pre>{`> open notes
> isolate claim
> ship proof
status: useful`}</pre>
    );
  }
  if (treatment === "letter") {
    return (
      <div className="letter">
        dear future reviewer,
        <br />
        the interesting bit is the tradeoff.
      </div>
    );
  }
  if (treatment === "recipe") {
    return (
      <div className="recipe">
        2 parts workflow
        <br />
        1 part evidence
        <br />
        salt until honest
      </div>
    );
  }
  return (
    <div className="redact">
      <span />
      <span />
      <span className="short" />
      <b>NOT A DASHBOARD</b>
    </div>
  );
}

function TimelineView({ spawnTimeline }: { spawnTimeline: (index: number) => void }) {
  const ordered = [...workbench.timeline].reverse();
  const count = ordered.length;
  return (
    <div className="metro">
      <div className="metro-stations">
        {ordered.map((entry, orderedIndex) => {
          const originalIndex = workbench.timeline.length - 1 - orderedIndex;
          const isNow = originalIndex === 0;
          const above = orderedIndex % 2 === 0;
          return (
            <button
              type="button"
              key={`${entry.when}-${entry.what}`}
              className={cn("station", above ? "above" : "below", isNow && "now")}
              data-pct={((orderedIndex + 0.5) / count) * 100}
              style={{ "--station-left": `${((orderedIndex + 0.5) / count) * 100}%` } as React.CSSProperties}
              onClick={() => spawnTimeline(originalIndex)}
            >
              <span className="metro-dot" />
              <span className="metro-content">
                <span className="yr">{entry.when.match(/\d{4}/)?.[0] ?? entry.when}</span>
                <BrandBadge entry={entry} />
                <span className="role">{entry.what}</span>
                <span className="where">{entry.where}</span>
                {isNow && <span className="you-are-here">you are here</span>}
              </span>
            </button>
          );
        })}
      </div>
      <div className="metro-help">
        a career as a <span>subway line</span> · click any station
      </div>
    </div>
  );
}

function BrandBadge({ entry }: { entry: TimelineEntry }) {
  const brand = entry.brand;
  if (brand.kind === "school") {
    return (
      <span className="brand brand-school">
        <span className="mono">{brand.mono}</span>
      </span>
    );
  }
  if (brand.kind === "company") {
    return (
      <span className="brand brand-company">
        <span className="mono">{brand.mono ?? brand.label}</span>
      </span>
    );
  }
  if (brand.kind === "role") {
    const abbr = brand.role
      .split(/\s+/)
      .map((word) => word[0])
      .join("")
      .slice(0, 3);
    return (
      <span className="brand brand-role">
        <span className="mono">{abbr}</span>
      </span>
    );
  }
  return (
    <span className="brand brand-self">
      <span className="hand">{brand.label}</span>
    </span>
  );
}

function AboutWindow() {
  return (
    <>
      <div className="about-hero">
        <img src="/Linkedin__.jpeg" alt="Harneet Bali" loading="eager" decoding="async" />
        <div className="who">
          Harneet <em>Bali</em>.
        </div>
      </div>
      <div className="role-line">
        AI eng who PMs <span className="role-sep">·</span> CMU MISM &apos;25
      </div>
      <p>{workbench.about.short}</p>
      <p>{workbench.about.long}</p>
      <div className="about-links">
        <a href={`mailto:${workbench.identity.email}`} title="Email">
          <svg
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="M22 4L12 13 2 4" />
          </svg>
        </a>
        <a
          href={workbench.identity.github}
          target="_blank"
          rel="noopener noreferrer"
          title="GitHub"
        >
          <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z" />
          </svg>
        </a>
        <a
          href={workbench.identity.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          title="LinkedIn"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
        </a>
        <a href="/Harneet-Bali-Resume.pdf" target="_blank" rel="noopener noreferrer" title="Resume">
          <svg
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
        </a>
      </div>
    </>
  );
}

function NowWindow({
  factoid,
  setFactoid,
}: {
  factoid: number;
  setFactoid: (fn: (index: number) => number) => void;
}) {
  return (
    <>
      <LiveLog />
      <button
        type="button"
        className="factoid"
        onClick={() => setFactoid((index) => (index + 1) % workbench.factoids.length)}
      >
        {workbench.factoids[factoid]}
      </button>
      <div className="cite">tap to flip</div>
    </>
  );
}

type LogLine = { kind: "git" | "life"; text: string; meta: string };

// Hand-written, stays fixed. The git lines come live from github-stats.json.
const LIFE_LINES: LogLine[] = [
  { kind: "life", text: "coffee #2, the one that actually works", meta: "now" },
  { kind: "life", text: "Anthropic hackathon, 500 picked from 20K", meta: "shipped" },
  { kind: "life", text: "chess.com elo holding at 1200, barely", meta: "today" },
  { kind: "life", text: "rewriting this portfolio instead of sleeping", meta: "late" },
  { kind: "life", text: "spotify: same lofi playlist, 47th hour", meta: "vibes" },
  { kind: "life", text: "CMU diploma: pending. builds: shipping.", meta: "dec 25" },
];

const GIT_LINES: LogLine[] = (GITHUB_STATS.recent ?? []).map((c) => ({
  kind: "git",
  text: `${c.repo} → ${c.msg}`,
  meta: c.ago,
}));

// Interleave live git commits with the static life lines.
const LOG_LINES: LogLine[] = (() => {
  const out: LogLine[] = [];
  const max = Math.max(GIT_LINES.length, LIFE_LINES.length);
  for (let i = 0; i < max; i++) {
    if (GIT_LINES[i]) out.push(GIT_LINES[i]);
    if (LIFE_LINES[i]) out.push(LIFE_LINES[i]);
  }
  return out.length ? out : LIFE_LINES;
})();

// Defensively window the calendar to its active range so the strip never
// renders padded with empty leading/trailing columns, whatever the data holds.
const { weeks: CONTRIB_WEEKS, days: CONTRIB_DAYS } = (() => {
  const rawWeeks = GITHUB_STATS.weeks;
  const rawDays = GITHUB_STATS.days;
  const sum = (w: number[]) => w.reduce((a, b) => a + b, 0);
  let first = rawWeeks.findIndex((w) => sum(w) > 0);
  if (first < 0) first = 0;
  let last = rawWeeks.length - 1;
  while (last > first && sum(rawWeeks[last]) === 0) last--;
  return {
    weeks: rawWeeks.slice(first, last + 1),
    days: rawDays?.slice(first, last + 1),
  };
})();
const CONTRIB_MAX = Math.max(...CONTRIB_WEEKS.flat(), 1);

// GitHub-style discrete intensity buckets (0-4).
function contribLevel(count: number): 0 | 1 | 2 | 3 | 4 {
  if (count === 0) return 0;
  const r = count / CONTRIB_MAX;
  if (r <= 0.1) return 1;
  if (r <= 0.3) return 2;
  if (r <= 0.6) return 3;
  return 4;
}

function contribTooltip(count: number, col: number, row: number): string {
  const date = CONTRIB_DAYS?.[col]?.[row]?.[1];
  const when = date
    ? new Date(date + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })
    : "";
  if (count === 0) return when ? `no commits · ${when}` : "no commits";
  const c = `${count} commit${count === 1 ? "" : "s"}`;
  return when ? `${c} · ${when}` : c;
}

function LiveLog() {
  const [lines, setLines] = useState<typeof LOG_LINES>(() => LOG_LINES.slice(0, 2));
  const idxRef = useRef(2);

  useEffect(() => {
    const id = window.setInterval(() => {
      const next = LOG_LINES[idxRef.current % LOG_LINES.length];
      idxRef.current += 1;
      setLines((prev) => [next, ...prev.slice(0, 1)]);
    }, 4000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="live-log">
      <div className="monitor-top">
        <div className="monitor-counts">
          <span className="count-big">{GITHUB_STATS.total.toLocaleString()}</span> commits ·{" "}
          <span className="count-hi">{GITHUB_STATS.repos}</span> active repos
          {GITHUB_STATS.release && (
            <span className="count-release">
              {" · "}
              <span className="count-hi">{GITHUB_STATS.release.repo}</span>{" "}
              {GITHUB_STATS.release.tag}
            </span>
          )}
        </div>
        <a
          href={workbench.identity.github}
          target="_blank"
          rel="noopener noreferrer"
          className="gh-link"
          title="GitHub"
        >
          <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z" />
          </svg>
        </a>
      </div>
      <div
        className="contrib-grid"
        style={{ gridTemplateColumns: `repeat(${CONTRIB_WEEKS.length}, 1fr)` }}
      >
        {CONTRIB_WEEKS.map((week, col) => (
          <div className="contrib-col" key={col}>
            {week.map((count, row) => (
              <span
                key={`${col}-${row}`}
                className="contrib-cell"
                data-level={contribLevel(count)}
                title={contribTooltip(count, col, row)}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="monitor-recent">
        {lines.map((line, i) => (
          <div
            key={`${idxRef.current}-${i}`}
            className={cn("log-line", i === 0 && "log-new", line.kind === "life" && "log-life")}
          >
            <span className="log-text">{line.text}</span>
            <span className="log-meta">{line.meta}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProjectDetail({ project }: { project: WorkbenchProject }) {
  const [proofOpen, setProofOpen] = useState(false);
  return (
    <>
      <h3>{project.name}</h3>
      <div className="status-line">● {project.details.status}</div>
      <div className="role-line">
        <b>stack -</b> {project.details.stack}
      </div>
      {project.proof && (
        <div className="proof-badge">
          <button type="button" className="proof-trigger" onClick={() => setProofOpen(!proofOpen)}>
            <span className="proof-dot" />
            {project.proof.label}
            <span className="proof-arrow">{proofOpen ? "×" : "↗"}</span>
          </button>
          {proofOpen && (
            <div className="proof-image">
              <img src={project.proof.image} alt={project.proof.label} />
            </div>
          )}
        </div>
      )}
      {project.demo && <ProjectDemo demo={project.demo} />}
      <DetailSection title="problem">{project.details.problem}</DetailSection>
      <section>
        <h4>approach</h4>
        <ul>
          {project.details.approach.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
      <DetailSection title="shipped">{project.details.shipped}</DetailSection>
      {project.stats && (
        <div className="stat-row">
          {project.stats.map((stat) => (
            <div className="stat" key={stat.l}>
              <div className="n">{stat.n}</div>
              <div className="l">{stat.l}</div>
            </div>
          ))}
        </div>
      )}
      {project.details.wrong && (
        <DetailSection title="what went wrong">{project.details.wrong}</DetailSection>
      )}
      {project.details.link && <div className="footnote">more - /case/{project.details.link}</div>}
    </>
  );
}

function ProjectDemo({ demo }: { demo: NonNullable<WorkbenchProject["demo"]> }) {
  return (
    <figure className="project-demo">
      <div className="project-demo-frame">
        {demo.kind === "video" ? (
          <video
            controls
            muted
            playsInline
            preload="metadata"
            src={demo.src}
            aria-label={demo.alt}
          />
        ) : (
          <img src={demo.src} alt={demo.alt} loading="lazy" decoding="async" />
        )}
      </div>
      <figcaption>
        <span>{demo.label}</span>
        <a href={demo.repo} target="_blank" rel="noreferrer">
          open repo
        </a>
      </figcaption>
    </figure>
  );
}

function TimelineDetail({ entry }: { entry: TimelineEntry }) {
  return (
    <>
      <h3>{entry.what}</h3>
      <div className="role-line">
        <b>{entry.when}</b> / {entry.where}
      </div>
      <p className="italic-note">{entry.note}</p>
      <DetailSection title="role">{entry.details.role}</DetailSection>
      <DetailSection title="did">{entry.details.did}</DetailSection>
      <DetailSection title="learned">{entry.details.learned}</DetailSection>
      {entry.details.why && <DetailSection title="why">{entry.details.why}</DetailSection>}
    </>
  );
}

function DetailSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h4>{title}</h4>
      <p>{children}</p>
    </section>
  );
}

function InfoRow({ k, v }: { k: string; v: ReactNode }) {
  return (
    <div className="row">
      <span className="k">{k}</span>
      <span className="v">{v}</span>
    </div>
  );
}

type ChatProps = {
  messages: ReturnType<typeof useChat>["messages"];
  error: ReturnType<typeof useChat>["error"];
  chatBusy: boolean;
  chatInput: string;
  setChatInput: (value: string) => void;
  submitChat: (value?: string) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
};

const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 3 * 60 * 60 * 1000;
const RATE_KEY = "cose_msg_log";

function getRateState(): { count: number; remaining: number; locked: boolean } {
  try {
    const raw = localStorage.getItem(RATE_KEY);
    if (raw) {
      const data = JSON.parse(raw) as { ts: number[] };
      const now = Date.now();
      const valid = data.ts.filter((t: number) => now - t < RATE_WINDOW_MS);
      return {
        count: valid.length,
        remaining: RATE_LIMIT - valid.length,
        locked: valid.length >= RATE_LIMIT,
      };
    }
  } catch {
    /* ignore */
  }
  return { count: 0, remaining: RATE_LIMIT, locked: false };
}

function recordMessage() {
  try {
    const raw = localStorage.getItem(RATE_KEY);
    const now = Date.now();
    const data = raw ? (JSON.parse(raw) as { ts: number[] }) : { ts: [] };
    data.ts = [...data.ts.filter((t: number) => now - t < RATE_WINDOW_MS), now];
    localStorage.setItem(RATE_KEY, JSON.stringify(data));
  } catch {
    /* ignore */
  }
}

function ChatWindow({
  messages,
  error,
  chatBusy,
  chatInput,
  setChatInput,
  submitChat,
  inputRef,
}: ChatProps) {
  const [rate, setRate] = useState(getRateState);
  const [sysLines, setSysLines] = useState<{ id: string; kind: "sys" | "err"; text: string }[]>([]);
  const [activeModel, setActiveModel] = useState("");
  const sysIdRef = useRef(0);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logRef.current?.scrollTo(0, logRef.current.scrollHeight);
  }, [messages, chatBusy, sysLines]);

  useEffect(() => {
    fetch(apiUrl("/api/chat/model")).then((r) => r.json()).then((d: { model?: string }) => {
      if (d.model) setActiveModel(d.model);
    }).catch(() => {});
  }, [messages.length]);

  const pushSys = (text: string, kind: "sys" | "err" = "sys") => {
    sysIdRef.current += 1;
    setSysLines((prev) => [...prev, { id: `s${sysIdRef.current}`, kind, text }]);
  };

  const handleSubmit = (text?: string) => {
    const value = (text ?? chatInput).trim();

    // Real-call slash commands (not sent to the LLM).
    if (value.startsWith("/send") || value.startsWith("/contact") || value.startsWith("/msg")) {
      const msg = value.replace(/^\/(send|contact|msg)\s*/i, "").trim();
      setChatInput("");
      if (!msg) {
        pushSys("usage: /send <your message> — goes straight to Harneet", "err");
        return;
      }
      pushSys(`sending to Harneet: "${msg}"`);
      fetch(apiUrl("/api/wall"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: `[terminal] ${msg}` }),
      })
        .then((r) =>
          pushSys(r.ok ? "delivered. he'll see it." : "couldn't send — try the about panel links."),
        )
        .catch(() => pushSys("couldn't send — try the about panel links.", "err"));
      return;
    }

    if (value === "/help" || value === "/commands") {
      setChatInput("");
      pushSys("prebuilt: /hire /first30 /opinion /teardown /stack /wontdo · real: /send <message>");
      return;
    }

    // Prebuilt prompts expand to their question; everything else goes to the LLM.
    const prebuilt = workbench.quickPrompts.find((p) => p.label === value);
    const toSend = prebuilt ? prebuilt.q : text;

    const state = getRateState();
    if (state.locked) {
      setRate(state);
      return;
    }
    recordMessage();
    setRate(getRateState());
    submitChat(toSend);
  };

  return (
    <>
      <div className="cli-log" ref={logRef}>
        {messages.length === 0 && sysLines.length === 0 && (
          <div className="cli-empty">
            <span>ask me anything, try &quot;why should I hire you?&quot;</span>
            <div className="cli-hints">
              {["/hire", "/first30", "/teardown"].map((cmd) => (
                <button key={cmd} type="button" onClick={() => handleSubmit(cmd)}>
                  {cmd}
                </button>
              ))}
              <button
                type="button"
                className="cli-hint-send"
                onClick={() => {
                  setChatInput("/send ");
                  inputRef.current?.focus();
                }}
              >
                /send a message
              </button>
            </div>
          </div>
        )}
        {messages.map((message) => {
          const text = message.parts
            .map((part) => (part.type === "text" ? part.text : ""))
            .join("");
          return message.role === "user" ? (
            <div key={message.id} className="cli-line cli-in">
              <span className="cli-prompt">❯</span>
              {text}
            </div>
          ) : (
            <div key={message.id} className="cli-line cli-out">
              <RichText text={text} />
            </div>
          );
        })}
        {sysLines.map((line) => (
          <div
            key={line.id}
            className={cn("cli-line", line.kind === "err" ? "cli-err" : "cli-sys-msg")}
          >
            {line.text}
          </div>
        ))}
        {chatBusy && <div className="cli-line cli-blink">▊</div>}
        {error && <div className="cli-line cli-err">connection dropped, retry.</div>}
        {messages.filter((m) => m.role === "user").length === 3 && !chatBusy && (
          <div className="cli-line cli-whisper">
            psst — there's a notepad behind these windows. close one, leave something real.
          </div>
        )}
      </div>
      <form
        className="cli-input"
        onSubmit={(event) => {
          event.preventDefault();
          handleSubmit();
        }}
      >
        <span className="cli-ps1">❯</span>
        <input
          ref={inputRef}
          type="text"
          value={chatInput}
          onChange={(event) => setChatInput(event.target.value)}
          placeholder={
            rate.locked ? "rate limit, try again later" : "ask anything, or /send a message"
          }
          disabled={chatBusy || rate.locked}
        />
        {chatBusy && <span className="cli-typing" />}
        <span className="cli-rate">{rate.remaining}/{RATE_LIMIT}</span>
      </form>
      {activeModel && (
        <div className="cli-model">
          model: {activeModel} · routing: auto · reasoning: off
        </div>
      )}
      {rate.locked && (
        <div className="cli-nudge">
          session limit hit. close a window, leave a note instead.
        </div>
      )}
    </>
  );
}

function RichText({ text }: { text: string }) {
  if (!text) return null;
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return (
    <p>
      {parts.map((part, index) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={index}>{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith("*") && part.endsWith("*")) {
          return <em key={index}>{part.slice(1, -1)}</em>;
        }
        return <span key={index}>{part}</span>;
      })}
    </p>
  );
}

function MinBar({
  windows,
  restore,
}: {
  windows: FeltWindowState[];
  restore: (id: WindowId) => void;
}) {
  return (
    <div className="min-bar">
      <span className="bar-lbl">minimized:</span>
      {windows.length === 0 ? (
        <span className="bar-empty">nothing tucked away.</span>
      ) : (
        windows.map((win) => (
          <button key={win.id} type="button" className="bar-chip" onClick={() => restore(win.id)}>
            {win.title}
          </button>
        ))
      )}
    </div>
  );
}

function CloseBar({
  windows,
  restore,
}: {
  windows: FeltWindowState[];
  restore: (id: WindowId) => void;
}) {
  if (windows.length === 0) return null;
  return (
    <div className="close-bar">
      {windows.map((win) => (
        <button key={win.id} type="button" className="dock-icon" onClick={() => restore(win.id)}>
          <DockSvg id={win.id} />
          <span className="dock-tooltip">{win.title}</span>
        </button>
      ))}
    </div>
  );
}

function DockSvg({ id }: { id: WindowId }) {
  const s = "currentColor";
  if (id === "main")
    return (
      <svg
        viewBox="0 0 24 24"
        width="20"
        height="20"
        fill="none"
        stroke={s}
        strokeWidth="1.5"
        strokeLinecap="round"
      >
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <path d="M3 9h18M9 9v12" />
      </svg>
    );
  if (id === "about")
    return (
      <svg
        viewBox="0 0 24 24"
        width="20"
        height="20"
        fill="none"
        stroke={s}
        strokeWidth="1.5"
        strokeLinecap="round"
      >
        <circle cx="12" cy="8" r="4" />
        <path d="M6 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
      </svg>
    );
  if (id === "now")
    return (
      <svg
        viewBox="0 0 24 24"
        width="20"
        height="20"
        fill="none"
        stroke={s}
        strokeWidth="1.5"
        strokeLinecap="round"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 3" />
      </svg>
    );
  if (id === "chat")
    return (
      <svg
        viewBox="0 0 24 24"
        width="20"
        height="20"
        fill="none"
        stroke={s}
        strokeWidth="1.5"
        strokeLinecap="round"
      >
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M7 8h4M7 12h10M7 16h7" />
        <path d="M17 8l2 0" strokeDasharray="1 2" />
      </svg>
    );
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke={s}
      strokeWidth="1.5"
      strokeLinecap="round"
    >
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M4 10h16" />
    </svg>
  );
}

function ContextMenu({
  ctx,
  focusWindow,
  closeWindow,
  minimizeWindow,
  toggleMax,
  resetWindows,
  toggleNotes,
  onClose,
}: {
  ctx: { x: number; y: number; id: WindowId };
  focusWindow: (id: WindowId) => void;
  closeWindow: (id: WindowId) => void;
  minimizeWindow: (id: WindowId) => void;
  toggleMax: (id: WindowId) => void;
  resetWindows: () => void;
  toggleNotes: () => void;
  onClose: () => void;
}) {
  const run = (fn: () => void) => {
    fn();
    onClose();
  };
  return (
    <div
      className="ctx show"
      style={{ left: ctx.x, top: ctx.y }}
      onClick={(event) => event.stopPropagation()}
    >
      <button type="button" className="ctx-item" onClick={() => run(() => focusWindow(ctx.id))}>
        Bring to front <kbd>click</kbd>
      </button>
      <button type="button" className="ctx-item" onClick={() => run(() => toggleMax(ctx.id))}>
        Zoom ¾ <kbd>green</kbd>
      </button>
      <button type="button" className="ctx-item" onClick={() => run(() => minimizeWindow(ctx.id))}>
        Minimize to dock <kbd>yellow</kbd>
      </button>
      <button type="button" className="ctx-item" onClick={() => run(() => closeWindow(ctx.id))}>
        Close window <kbd>red</kbd>
      </button>
      <div className="ctx-sep" />
      <button type="button" className="ctx-item" onClick={() => run(resetWindows)}>
        Reset all windows
      </button>
      <button type="button" className="ctx-item" onClick={() => run(toggleNotes)}>
        Toggle felt notes
      </button>
    </div>
  );
}
