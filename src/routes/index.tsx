import { useChat } from "@ai-sdk/react";
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
} from "@/data/workbench";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Harneet Bali - Felt Workbench" },
      {
        name: "description",
        content:
          "Harneet Bali's AI workbench: projects, proof, timeline, and operating thesis in a Felt OS interface.",
      },
      { property: "og:title", content: "Harneet Bali - Felt Workbench" },
      {
        property: "og:description",
        content: "Projects, proof, timeline, and operating thesis in a Felt OS interface.",
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
  | `timeline-${number}`;

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
        Five things <em>I shipped.</em>
      </>
    ),
    crumb: "projects",
    count: 5,
  },
  skills: {
    title: (
      <>
        What I actually <em>do well.</em>
      </>
    ),
    crumb: "skills",
    count: workbench.skills.length,
  },
  timeline: {
    title: (
      <>
        A rough <em>resume.</em>
      </>
    ),
    crumb: "timeline",
    count: workbench.timeline.length,
  },
  sidequest: {
    title: (
      <>
        The <em>side quests.</em>
      </>
    ),
    crumb: "sidequest",
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
    title: "harneet@workbench:~ - ask anything",
    badge: "live",
    kind: "base",
    className: "win-chat",
    z: 25,
  },
];

function FeltHome() {
  const deskRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
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

  const transport = useMemo(() => new DefaultChatTransport({ api: "/api/chat" }), []);
  const { messages, sendMessage, status, error } = useChat({ transport });
  const [chatInput, setChatInput] = useState("");
  const chatBusy = status === "submitted" || status === "streaming";

  const visibleWindows = windows.filter((win) => !win.hidden);
  const dockedWindows = windows.filter((win) => win.minimized);
  const currentTitle = titles[active];

  useEffect(() => {
    document.documentElement.dataset.theme = theme === "light" ? "light" : "";
    localStorage.setItem("hb-felt-theme", theme);
  }, [theme]);

  useEffect(() => {
    const tick = () => {
      setClock(new Date().toTimeString().slice(0, 5));
    };
    tick();
    const clockId = window.setInterval(tick, 30_000);
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
    setWindows((items) =>
      items.map((item) => (item.id === id ? { ...item, hidden: true, minimized: false } : item)),
    );
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
      focusWindow(id);
      const desk = deskRef.current?.getBoundingClientRect();
      if (!desk) return;
      setWindows((items) =>
        items.map((item) => {
          if (item.id !== id) return item;
          if (item.maximized && item.restore) {
            return { ...item, ...item.restore, restore: undefined, maximized: false };
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
            left: 8,
            top: 14,
            width: Math.max(320, desk.width - 16),
            height: Math.max(260, desk.height - 76),
            maximized: true,
          };
        }),
      );
    },
    [focusWindow],
  );

  function spawnProject(id: WorkbenchProjectId) {
    const project = workbench.projects.find((item) => item.id === id);
    if (!project) return;
    const winId = `project-${id}` as const;
    const existing = windows.find((item) => item.id === winId);
    if (existing) {
      focusWindow(winId);
      return;
    }
    const count = windows.filter((item) => item.kind !== "base").length + 1;
    zRef.current += 1;
    setWindows((items) => [
      ...items,
      {
        id: winId,
        title: `~/projects/${id}.md`,
        badge: project.year,
        kind: "project",
        className: count % 2 === 0 ? "win-detail alt" : "win-detail",
        left: 110 + count * 26,
        top: 112 + count * 24,
        width: 520,
        height: 560,
        z: zRef.current,
      },
    ]);
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
    const count = windows.filter((win) => win.kind !== "base").length + 1;
    zRef.current += 1;
    setWindows((items) => [
      ...items,
      {
        id: winId,
        title: `~/timeline/${item.when.replace(/[\s-]+/g, "_").toLowerCase()}.md`,
        badge: index === 0 ? "now" : "past",
        kind: "timeline",
        className: count % 2 === 0 ? "win-detail alt" : "win-detail",
        left: 140 + count * 24,
        top: 132 + count * 22,
        width: 500,
        height: 420,
        z: zRef.current,
      },
    ]);
  }

  function submitChat(text = chatInput) {
    const value = text.trim();
    if (!value || chatBusy) return;
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
      <header className="topbar">
        <button className="signature" type="button" onClick={() => focusWindow("main")}>
          <span className="avatar-tiny" aria-hidden="true">
            <span className="mono">HB</span>
          </span>
          {workbench.identity.displayName}
          <span className="scribble">?</span>
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
                factoid,
                setFactoid,
                chat: { messages, error, chatBusy, chatInput, setChatInput, submitChat, inputRef },
              })}
            </FeltWindow>
          );
        })}
      </main>

      <Dock windows={dockedWindows} restore={focusWindow} />

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
  const title = win.id === "main" ? `~/main.exe � ${titles[active].crumb}` : win.title;
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
      )}
      style={style}
      onPointerDown={() => focusWindow(win.id)}
      onContextMenu={(event) => {
        event.preventDefault();
        setContext({ x: event.clientX, y: event.clientY, id: win.id });
        focusWindow(win.id);
      }}
    >
      <div className="titlebar" onPointerDown={(event) => startDrag(win.id, event)}>
        <div className="lights">
          <button
            type="button"
            className="r"
            aria-label="Close"
            onClick={() => closeWindow(win.id)}
          />
          <button
            type="button"
            className="a"
            aria-label="Minimize"
            onClick={() => minimizeWindow(win.id)}
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
  factoid,
  setFactoid,
  chat,
}: {
  win: FeltWindowState;
  active: Tab;
  setActive: (tab: Tab) => void;
  spawnProject: (id: WorkbenchProjectId) => void;
  spawnTimeline: (index: number) => void;
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
  return null;
}

function MainExe({
  active,
  spawnProject,
  spawnTimeline,
}: {
  active: Tab;
  setActive: (tab: Tab) => void;
  spawnProject: (id: WorkbenchProjectId) => void;
  spawnTimeline: (index: number) => void;
}) {
  return (
    <>
      <h2>{titles[active].title}</h2>
      <div className="sub">
        workbench / <span>{titles[active].crumb}</span>
        <span className="hand">? click any row, opens a window.</span>
      </div>
      <div className="main-body">
        {active === "projects" && <ProjectsView spawnProject={spawnProject} />}
        {active === "skills" && <SkillsView />}
        {active === "timeline" && <TimelineView spawnTimeline={spawnTimeline} />}
        {active === "sidequest" && <SidequestView />}
      </div>
    </>
  );
}

function ProjectsView({ spawnProject }: { spawnProject: (id: WorkbenchProjectId) => void }) {
  const featured = workbench.projects.find((project) => project.featured) ?? workbench.projects[0];
  const projects = [
    featured,
    ...workbench.projects.filter((project) => project.id !== featured.id),
  ];
  return (
    <div>
      {projects.map((project, index) => (
        <button
          type="button"
          key={project.id}
          className={cn("pj-row", project.featured && "feat")}
          onClick={() => spawnProject(project.id)}
        >
          <span className="num">{String(index + 1).padStart(2, "0")}</span>
          <span className="nm">{project.name}</span>
          <span className="bl">{project.blurb}</span>
          <span className="tg">{project.tag}</span>
          <span className="ar">?</span>
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
        3000 + groupIndex * 120,
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
          4 lanes � <b>{total}</b> entries � spotlight walks every 3s
        </span>
        <span className="hand">no stars, no years - just what I actually do.</span>
      </div>
    </div>
  );
}

function SidequestView() {
  return (
    <div className="polaroid-board">
      {workbench.sidequest.map((item, index) => (
        <article
          className={cn("polaroid", item.tape === "red" ? "tape-red" : "tape-amber")}
          key={item.name}
          style={{ "--tilt": `${[-2.2, 1.4, -0.8, 2][index % 4]}deg` } as CSSProperties}
        >
          <div className="tape" />
          <div className={cn("photo", `photo-${item.treatment}`)}>
            <SidequestArt treatment={item.treatment} />
          </div>
          <div className="yr">{item.year}</div>
          <div className="nm">{item.name}</div>
          <div className="bl">{item.blurb}</div>
        </article>
      ))}
    </div>
  );
}

function SidequestArt({
  treatment,
}: {
  treatment: (typeof workbench.sidequest)[number]["treatment"];
}) {
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
              style={{ left: `${((orderedIndex + 0.5) / count) * 100}%` }}
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
        a career as a <span>subway line</span> - click any station...
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
        <span className="nda-tape">NDA</span>
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
      <div className="who">
        Harneet <em>Bali</em>.
      </div>
      <div className="role-line">
        <b>{workbench.identity.role}</b> � product builder � {workbench.identity.location} �{" "}
        {workbench.identity.pronoun}
      </div>
      <p>{workbench.about.short}</p>
      <p>{workbench.about.long}</p>
      <div className="rows">
        <InfoRow
          k="email"
          v={<a href={`mailto:${workbench.identity.email}`}>{workbench.identity.email}</a>}
        />
        <InfoRow k="status" v={<b>{workbench.identity.status}</b>} />
        <InfoRow
          k="links"
          v={
            <>
              <a href={workbench.identity.github}>github</a> �{" "}
              <a href={workbench.identity.linkedin}>linkedin</a>
            </>
          }
        />
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
      <div className="rows">
        <InfoRow k="writing" v="case files that survive inspection" />
        <InfoRow k="building" v="Felt OS portfolio shell" />
        <InfoRow k="reading" v="workflow failures, not launch posts" />
        <InfoRow k="last commit" v="rebuilt the desk, kept the paper cuts" />
      </div>
      <button
        type="button"
        className="factoid"
        onClick={() => setFactoid((index) => (index + 1) % workbench.factoids.length)}
      >
        {workbench.factoids[factoid]}
      </button>
      <div className="cite">notebook 7 � tap to flip</div>
    </>
  );
}

function ProjectDetail({ project }: { project: WorkbenchProject }) {
  return (
    <>
      <h3>{project.name}</h3>
      <div className="status-line">? {project.details.status}</div>
      <div className="role-line">
        <b>role -</b> {project.details.role}
      </div>
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

function TimelineDetail({ entry }: { entry: TimelineEntry }) {
  return (
    <>
      <h3>{entry.what}</h3>
      <div className="role-line">
        <b>{entry.when}</b> � {entry.where}
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
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
};

function ChatWindow({
  messages,
  error,
  chatBusy,
  chatInput,
  setChatInput,
  submitChat,
  inputRef,
}: ChatProps) {
  return (
    <>
      <div className="chat-log">
        <div className="msg a">
          <div className="who-line">HARNEET - now</div>
          <div className="txt">
            <p>
              Start with a prompt. Ask for a case file, a hiring argument, a tradeoff, or a teardown
              of one project.
            </p>
          </div>
        </div>
        {messages.map((message) => {
          const text = message.parts
            .map((part) => (part.type === "text" ? part.text : ""))
            .join("");
          return (
            <div key={message.id} className={cn("msg", message.role === "user" ? "q" : "a")}>
              <div className="who-line">
                {message.role === "user" ? "VISITOR" : "HARNEET"} - now
              </div>
              <div className="txt">
                <RichText text={text} />
              </div>
            </div>
          );
        })}
        {chatBusy && (
          <div className="msg a">
            <div className="who-line">HARNEET - now</div>
            <div className="txt">
              <p>thinking...</p>
            </div>
          </div>
        )}
        {error && (
          <div className="msg a error">
            <div className="who-line">SYSTEM - now</div>
            <div className="txt">
              <p>connection error - check the API key or try again.</p>
            </div>
          </div>
        )}
      </div>
      <div className="chat-quick">
        <span className="lbl">try:</span>
        {workbench.quickPrompts.map((prompt) => (
          <button key={prompt.label} type="button" onClick={() => submitChat(prompt.q)}>
            {prompt.label}
          </button>
        ))}
      </div>
      <form
        className="chat-input"
        onSubmit={(event) => {
          event.preventDefault();
          submitChat();
        }}
      >
        <textarea
          ref={inputRef}
          value={chatInput}
          onChange={(event) => setChatInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              submitChat();
            }
          }}
          placeholder="start here - write a prompt, ask for proof, or make me defend a tradeoff..."
          disabled={chatBusy}
        />
        <button type="submit" disabled={chatBusy || !chatInput.trim()}>
          RUN
        </button>
      </form>
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

function Dock({
  windows,
  restore,
}: {
  windows: FeltWindowState[];
  restore: (id: WindowId) => void;
}) {
  return (
    <div className="dock">
      <span className="lbl">? minimized:</span>
      {windows.length === 0 ? (
        <span className="dock-empty">- nothing tucked away.</span>
      ) : (
        windows.map((win) => (
          <button key={win.id} type="button" className="dock-chip" onClick={() => restore(win.id)}>
            <span className="ico">?</span>
            {win.title}
          </button>
        ))
      )}
    </div>
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
        Maximize <kbd>green</kbd>
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
