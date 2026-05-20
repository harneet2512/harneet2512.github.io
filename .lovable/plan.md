## First pass — extract style system, apply to 4 surfaces only

Scope: tokens + 6 primitives, then Projects, BuilderContext, CommandRail, AppSidebar, and global StatusBar/PageBreadcrumb. **Home, About, Timeline, Overview, and Case pages are untouched** except where they share the new global chrome.

After this pass: stop, summarize, wait for approval before pass 2.

---

### 1. Tokens (`src/styles.css`)

Formalize what's already implied — no new color families.

```css
--surface-base:   #0C1014;   /* page bg (slightly warmer than current #080b0f) */
--surface-card:   #0F141A;   /* row / card */
--surface-inset:  #0A0E12;   /* artifact tile, code, monogram bg */
--border-hair:    rgba(255,255,255,0.06);
--border-line:    rgba(255,255,255,0.10);
--border-strong:  rgba(255,255,255,0.16);
--text-primary:   #F2EFE8;   /* warm cream, not pure white */
--text-secondary: #A8A8A3;
--text-tertiary:  #6E6E68;
--accent-sage:    #9FCBA8;
--accent-sage-dim: rgba(159,203,168,0.55);
--accent-warn:    #E0B872;   /* diff- / cautious only */
--radius-row:  8px;
--radius-tile: 6px;
--radius-chip: 4px;
```

Map to existing Tailwind theme vars (override `--background`, `--surface`, `--foreground`, `--muted-foreground`, `--subtle`, `--border`, `--border-strong`, `--accent-sage`). Spacing rhythm: 4 / 8 / 12 / 16 / 20 / 24 / 32 / 48. Type scale codified: display 52/36/22, body 15/13/12.5, eyebrow 11 uppercase tracking-[0.14em], mono 12/11/10. Numbers and measurements always mono.

**Remove existing decoration**: `.commit-grid` is kept only for the demoted footer band in BuilderContext (or removed). No glow, no gradients beyond the existing thesis radial (left alone in pass 1), no drop-shadow elevation.

---

### 2. Six primitives (`src/components/ui/primitives/`)

Each ~30–60 lines, composable, no behavior beyond presentation. Everything else in this pass composes from these.

1. **`Eyebrow.tsx`** — 11px uppercase tracking-[0.14em] text-tertiary, optional trailing 6px sage dot. Replaces ad-hoc `.label-eyebrow`.
2. **`MetaPair.tsx`** — `<dt>` eyebrow + `<dd>` 12.5px body, vertical or inline-divided variant. Fundamental k/v unit (Domains/Evidence, Focus Areas, Context).
3. **`RowCard.tsx`** — `bg-surface-card border border-border-line rounded-row` row container with a slot api: `{number, title, meta, artifact, action}` rendered in a 5-col grid (`64px | 1fr | 1fr | 260px | 100px`) at ≥1024px, stacks below.
4. **`ChipMono.tsx`** — 12px mono, `border border-border-hair rounded-chip px-2.5 py-1`, hover lifts border to `border-line`. Used wherever a `/slash-command` appears.
5. **`StatusDot.tsx`** — 6px circle, tones `sage | warn | dim`.
6. **`ArtifactTile.tsx`** — fixed 110×260 `bg-surface-inset rounded-tile border-border-hair` frame that renders one of 5 kinds via a `kind` prop. CSS-only content; no charts library.

Anti-slop test: if something on screen does not compose from these six, refactor or delete it.

---

### 3. `/projects` — case-file index

Rewrite `src/routes/projects.tsx`:

- Header: `<Eyebrow>workspace / projects</Eyebrow>` breadcrumb (rendered by global `PageBreadcrumb` if mounted; otherwise inline), H1 `Projects`, 1-line dek, thin `border-b border-border-hair`, 24px gap, right-aligned `+ New Case` ghost button.
- Body: 5 `<RowCard>` rows. Slots per row:
  - `number` — mono `01`–`05`, text-tertiary
  - `title` — 22px/600 + 13px secondary one-liner under
  - `meta` — two stacked `<MetaPair>`: DOMAINS · EVIDENCE (plain text, no chips)
  - `artifact` — `<ArtifactTile kind={slug} />`
  - `action` — `Open case →` sage link
- Remove `ArrowUpRight` decorative icon.

**Artifact tile content (visual placeholders, no fake public claims):**

| slug | kind content |
|------|--------------|
| groundtruth | Eyebrow `EVAL COVERAGE` · 14 sparkline bars (sage-dim → sage on last 3) · mono caption `coverage signal` |
| codetune | mono filename `optimize.py` (tertiary) · 3 diff lines: warn `- for i in range(n):` / sage `+ for chunk in batched(n):` / dim `+ …` |
| tracepilot | inline SVG sage path (7 points, no axes) · mono caption `latency trend` |
| executiondesk | 4 mono pills `intent · plan · execute · action` joined by hairline rules |
| robbymd | Eyebrow `DIFFERENTIAL` · mono numbered list (3 visible items, ellipsis 4th) |

No hard percentages, no `87%`, no `p95 38%↓`. Captions are signal labels only.

New files: `src/components/projects/CaseFileRow.tsx` (composes `RowCard`), `src/components/projects/artifacts/{Groundtruth,Codetune,Tracepilot,Executiondesk,Robbymd}.tsx` (or one switch in `ArtifactTile`).

---

### 4. Right panel — `BuilderContext` (replaces `BuilderSignature`)

New file `src/components/workspace/BuilderContext.tsx`; delete `BuilderSignature.tsx`. Mount in `__root.tsx` right column, width capped at 300px.

Structure:
- External strip: `<Eyebrow>BUILDER CONTEXT</Eyebrow>` left, mono `v1.0` right.
- Card (`bg-surface-card border-border-line rounded-row`):
  - 56px square monogram `HB` on `surface-inset` (no photo).
  - Identity: `Harneet Bali` (16px) / `AI Engineer + Product Builder` (12.5px secondary).
  - Positioning paragraph (3–4 lines, 13px).
  - `<MetaPair label="FOCUS AREAS">` — 5 plain rows with leading 4px sage dot. No chips, no icons.
  - `<MetaPair label="CURRENT LENS">` — single paragraph.
- Reuse existing `AsciiVignette` at the bottom of the card at `opacity-30`, 10px mono, decorative.

No fake stats, skill bars, GitHub-style heatmap, or numbers. The `commit-grid` texture is removed from this card.

---

### 5. `CommandRail` — taller, two-column, status moved out

Edit `src/components/workspace/CommandRail.tsx`:

- Height 168 → 220px.
- Header: tabs `>_ Command / Activity / Context / Ask` with sage 1px underline on active. **Remove the `⌘K to focus · online` chip** — moves to global StatusBar.
- Body grid 65% / 35%, 24px gap, only for the `Command` tab (other tabs keep current single-column treatment).
  - **Left**: 56px input row with mono sage `→` send button. Below: `<Eyebrow>Suggested commands</Eyebrow>` + 10 `<ChipMono>` in a 2×5 wrap. Use the existing `SUGGESTIONS` list.
  - **Right**: `<Eyebrow>Recent Activity</Eyebrow>` + 5 rows: `+` glyph · 12.5px text · right-aligned mono 10px timestamp. Reuse the `ACTIVITY` array, extend to 5 entries with neutral text.
- Placeholder text: `Ask about Harneet or run a command…`.

---

### 6. `AppSidebar` — sectioned with eyebrows, sage left bar

Edit `src/components/workspace/AppSidebar.tsx`:

- Each existing group header (WORKSPACE / PORTFOLIO / CASE STUDIES / EXTERNAL) rendered via `<Eyebrow>`.
- Active item: 2px sage left-edge bar + `text-primary`. Inactive: `text-secondary`. Remove any icon background fills or pills.
- Bottom dock (new): pseudo `⌘K  Command Menu` pill (visual only — focuses the rail input on click via shared ref or event) + small theme toggle icon placeholder (no behavior).

---

### 7. Global chrome — `PageBreadcrumb` + `StatusBar`

Edit `src/routes/__root.tsx`:

- Mount `<PageBreadcrumb>` at the top of the center column (above the `<Outlet />`). Derives from `useRouterState().location.pathname`, renders `workspace / <segment> / <segment>` using `<Eyebrow>` with sage dot dividers.
- Mount `<StatusBar>` (28px) pinned below `CommandRail`: left `<StatusDot tone="sage"/> Workspace ready` · center mono dim `Workspace initialized · 5 projects indexed · Command layer ready` · right mono `⌘K to focus · online`.
- Right column width set to 300px.

New files: `src/components/workspace/PageBreadcrumb.tsx`, `src/components/workspace/StatusBar.tsx`.

---

### Files touched

**New**
- `src/components/ui/primitives/{Eyebrow,MetaPair,RowCard,ChipMono,StatusDot,ArtifactTile}.tsx`
- `src/components/projects/CaseFileRow.tsx`
- `src/components/projects/artifacts/*` (5 tiny components or one switch)
- `src/components/workspace/{BuilderContext,PageBreadcrumb,StatusBar}.tsx`

**Edited**
- `src/styles.css` (token formalization + remove unused classes)
- `src/routes/projects.tsx` (rewrite to RowCard grid)
- `src/routes/__root.tsx` (mount breadcrumb + status bar, 300px right col, swap to BuilderContext)
- `src/components/workspace/CommandRail.tsx` (220px, two-column, drop status chip)
- `src/components/workspace/AppSidebar.tsx` (Eyebrow sections, sage left bar, bottom dock)

**Deleted**
- `src/components/workspace/BuilderSignature.tsx`

### Out of scope this pass

- Home (`ThesisConsole`, `CaseFiles`, `ProofStrip`, `SignalMap`), About, Timeline, Overview, Case template — untouched except they inherit the new breadcrumb/status bar and 300px right column from `__root.tsx`.
- Boot sequence (unchanged).
- Routing, data, dependencies, real metrics.

### Anti-slop checklist (run before stopping)

1. Every visible piece on the touched surfaces composes from the 6 primitives.
2. No `87%`, `38%`, or other fabricated metrics anywhere.
3. No glow, gradient (the existing thesis radial is on an untouched page), glass, drop-shadow elevation, fake 3D.
4. No decorative icons; icons only signal action.
5. Every color from the new tokens; every spacing from the rhythm; every type size from the scale.

After implementation: stop and summarize what shipped, what was deliberately left alone, and what pass 2 would cover.
