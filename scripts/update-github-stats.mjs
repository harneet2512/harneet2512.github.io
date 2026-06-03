// Regenerates src/data/github-stats.json from the GitHub API.
// Run by GitHub Actions on a 6h cron. Needs GITHUB_TOKEN in env.
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const USER = "harneet2512";
const REPOS = ["groundtruth", "RobbyMD", "memcontext", "Codetune", "TracePilot", "drift-engine"];
const WEEKS_SHOWN = 18; // recent active window (keeps the strip dense, not a sparse year)
const token = process.env.GITHUB_TOKEN;

if (!token) {
  console.error("GITHUB_TOKEN missing");
  process.exit(1);
}

const gh = async (url) => {
  const r = await fetch(url, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json" },
  });
  if (!r.ok) throw new Error(`${url} -> ${r.status}`);
  return r.json();
};

function relTime(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3_600_000);
  if (h < 1) return "just now";
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return `${Math.floor(d / 7)}w ago`;
}

// 1. Contribution calendar via GraphQL
const calRes = await fetch("https://api.github.com/graphql", {
  method: "POST",
  headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
  body: JSON.stringify({
    query: `query { user(login:"${USER}"){ contributionsCollection { contributionCalendar { totalContributions weeks { contributionDays { contributionCount date } } } } } }`,
  }),
});
const calJson = await calRes.json();
const cal = calJson?.data?.user?.contributionsCollection?.contributionCalendar;
if (!cal) {
  console.error("no calendar", JSON.stringify(calJson).slice(0, 300));
  process.exit(1);
}

const allWeeks = cal.weeks.map((w) => w.contributionDays.map((d) => d.contributionCount));
const total = cal.totalContributions;

// Window the calendar to the ACTIVE range: trim both leading and trailing
// all-zero weeks so the strip isn't padded with empty columns on either end.
const weekSum = (w) => w.reduce((a, b) => a + b, 0);
let firstActive = allWeeks.findIndex((w) => weekSum(w) > 0);
let lastActive = allWeeks.length - 1;
while (lastActive > 0 && weekSum(allWeeks[lastActive]) === 0) lastActive--;
if (firstActive < 0) firstActive = 0;
// Cap to the most recent WEEKS_SHOWN within the active range.
const startIdx = Math.max(firstActive, lastActive - WEEKS_SHOWN + 1);
const endIdx = lastActive + 1;
const weeks = allWeeks.slice(startIdx, endIdx);

// Per-day [count, date] pairs for tooltips, same window as `weeks`.
const allDays = cal.weeks.map((w) =>
  w.contributionDays.map((d) => [d.contributionCount, d.date]),
);
const days2 = allDays.slice(startIdx, endIdx);

// Guard: never overwrite the heatmap with an empty window (date/window glitch).
if (weeks.flat().reduce((a, b) => a + b, 0) === 0) {
  console.error("refusing to write: window is all zero (likely a date glitch)");
  process.exit(0);
}

// streak: consecutive days ending most-recent with > 0
const days = cal.weeks.flatMap((w) => w.contributionDays.map((d) => d.contributionCount));
let streak = 0;
for (let i = days.length - 1; i >= 0; i--) {
  if (days[i] > 0) streak++;
  else if (i < days.length - 1) break; // allow today (last) to be 0
}

// 2. Recent commits across project repos
const commits = [];
for (const repo of REPOS) {
  try {
    const list = await gh(`https://api.github.com/repos/${USER}/${repo}/commits?per_page=10`);
    // pick the most recent non-merge commit with a meaningful message
    const c = list.find(
      (x) => x?.commit && !x.commit.message.startsWith("Merge ") && x.commit.message.trim().length > 3,
    );
    if (c?.commit) {
      let msg = c.commit.message.split("\n")[0].trim();
      if (msg.length > 52) msg = msg.slice(0, 49) + "...";
      commits.push({
        repo: repo.toLowerCase(),
        msg,
        date: c.commit.committer?.date ?? c.commit.author?.date,
      });
    }
  } catch (e) {
    console.warn(`skip ${repo}: ${e.message}`);
  }
}
commits.sort((a, b) => new Date(b.date) - new Date(a.date));
const recent = commits.slice(0, 4).map((c) => ({ repo: c.repo, msg: c.msg, ago: relTime(c.date) }));

// 3. active repo count (repos pushed to in the window)
const repos = commits.filter((c) => Date.now() - new Date(c.date).getTime() < 30 * 86_400_000).length || REPOS.length;

// 4. Latest release/tag across repos
let release;
for (const repo of REPOS) {
  try {
    const rels = await gh(`https://api.github.com/repos/${USER}/${repo}/releases?per_page=1`);
    const r = rels?.[0];
    if (r?.published_at) {
      const cand = { repo: repo.toLowerCase(), tag: r.tag_name || r.name, date: r.published_at };
      if (!release || new Date(cand.date) > new Date(release.date)) release = cand;
      continue;
    }
  } catch {
    /* no releases, fall back to tags */
  }
  try {
    const tags = await gh(`https://api.github.com/repos/${USER}/${repo}/tags?per_page=1`);
    const t = tags?.[0];
    if (t?.name && !release) {
      release = { repo: repo.toLowerCase(), tag: t.name, date: null };
    }
  } catch {
    /* skip */
  }
}
const latestRelease = release
  ? { repo: release.repo, tag: release.tag, ago: release.date ? relTime(release.date) : "tagged" }
  : undefined;

const out = {
  total,
  repos,
  streak,
  weeks,
  days: days2,
  recent: recent.length ? recent : undefined,
  release: latestRelease,
  generatedAt: new Date().toISOString(),
};

const target = join(dirname(fileURLToPath(import.meta.url)), "..", "src", "data", "github-stats.json");
writeFileSync(target, JSON.stringify(out, null, 2) + "\n");
console.log(
  `updated: ${total} contributions, ${streak}d streak, ${recent.length} commits, release: ${latestRelease ? `${latestRelease.repo} ${latestRelease.tag}` : "none"}`,
);
