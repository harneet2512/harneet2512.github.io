/**
 * Reverse-IP intelligence for visit tracking.
 *
 * Turns a visitor IP into a network owner (ASN/org) and a coarse classification:
 * is this traffic coming from a *company/university* network (high signal — the
 * org name IS the employer) or from a consumer ISP / mobile carrier / VPN (an
 * individual we can't, and shouldn't, name)?
 *
 * Source: ip-api.com free tier — no key, HTTP only, 45 req/min. That ceiling is
 * far above a portfolio's traffic, and we cache per-IP so repeat views from the
 * same visitor cost one lookup. This is company-level only: it never identifies
 * a person, and it deliberately can't.
 */

export type ConnType = "company" | "institution" | "individual" | "hosting" | "mobile" | "unknown";

export type IpIntel = {
  country: string;
  region: string;
  city: string;
  isp: string;
  org: string;
  asn: string; // e.g. "AS15169"
  asname: string; // e.g. "GOOGLE"
  /** Best human label for the network owner. */
  label: string;
  connType: ConnType;
  /** True when connType is company or institution — the "who's scouting me" hits. */
  isOrg: boolean;
};

const EMPTY: IpIntel = {
  country: "",
  region: "",
  city: "",
  isp: "",
  org: "",
  asn: "",
  asname: "",
  label: "",
  connType: "unknown",
  isOrg: false,
};

// Substrings (lowercased) that mark a network as a consumer ISP / mobile carrier
// rather than an employer. If the org/isp/asname matches one of these, the
// visitor is an individual on home or cellular internet — not a company hit.
const CONSUMER_ISP = [
  "comcast",
  "xfinity",
  "spectrum",
  "charter",
  "cox communications",
  "centurylink",
  "frontier",
  "optimum",
  "altice",
  "mediacom",
  "windstream",
  "verizon",
  "at&t",
  "att services",
  "t-mobile",
  "tmobile",
  "sprint",
  "us cellular",
  "google fiber",
  "starlink",
  "hughesnet",
  "viasat",
  "wide open west",
  "wow!",
  // UK / EU
  "virgin media",
  "bt ",
  "british telecom",
  "sky uk",
  "sky broadband",
  "talktalk",
  "plusnet",
  "vodafone",
  "orange",
  "telefonica",
  "movistar",
  "deutsche telekom",
  "telekom",
  "o2",
  "free sas",
  "bouygues",
  "telia",
  "telenor",
  "kpn",
  "ziggo",
  // India
  "jio",
  "reliance jio",
  "bharti airtel",
  "airtel",
  "bsnl",
  "vodafone idea",
  "act fibernet",
  "hathway",
  "atria convergence",
  "you broadband",
  "tata play",
  "excitel",
  "gtpl",
  // Canada / AU / other
  "rogers",
  "bell canada",
  "telus",
  "shaw",
  "videotron",
  "telstra",
  "optus",
  "tpg",
  "aussie broadband",
  "spark new zealand",
  "vodafone nz",
  // generic residential markers
  "broadband",
  "fibernet",
  "cable",
  "dsl",
  "fios",
  "telecom",
];

const INSTITUTION = [
  "university",
  "univ ",
  "college",
  "institute of technology",
  "school",
  "education",
  "polytechnic",
  "académie",
  "universidad",
  "università",
];

function isConsumer(...fields: string[]): boolean {
  const hay = fields.join(" ").toLowerCase();
  return CONSUMER_ISP.some((needle) => hay.includes(needle));
}

function isInstitution(...fields: string[]): boolean {
  const hay = fields.join(" ").toLowerCase();
  return INSTITUTION.some((needle) => hay.includes(needle));
}

function isPrivateOrUnknown(ip: string): boolean {
  if (!ip || ip === "unknown") return true;
  if (ip === "::1" || ip.startsWith("127.") || ip.startsWith("10.")) return true;
  if (ip.startsWith("192.168.") || ip.startsWith("169.254.")) return true;
  // 172.16.0.0 – 172.31.255.255
  const m = ip.match(/^172\.(\d+)\./);
  if (m && Number(m[1]) >= 16 && Number(m[1]) <= 31) return true;
  if (ip.startsWith("fc") || ip.startsWith("fd") || ip.startsWith("fe80")) return true;
  return false;
}

// Per-IP cache so repeat views from one visitor don't re-hit ip-api. Bounded so
// the serverless instance's memory can't grow without limit.
const cache = new Map<string, { intel: IpIntel; ts: number }>();
const CACHE_TTL = 6 * 3600_000; // 6h
const CACHE_MAX = 2000;

type ApiResponse = {
  status?: string;
  country?: string;
  regionName?: string;
  city?: string;
  isp?: string;
  org?: string;
  as?: string;
  asname?: string;
  mobile?: boolean;
  proxy?: boolean;
  hosting?: boolean;
};

export async function lookupIp(ip: string): Promise<IpIntel> {
  if (isPrivateOrUnknown(ip)) return EMPTY;

  const hit = cache.get(ip);
  if (hit && Date.now() - hit.ts < CACHE_TTL) return hit.intel;

  const fields = "status,country,regionName,city,isp,org,as,asname,mobile,proxy,hosting";
  let data: ApiResponse;
  try {
    const res = await fetch(`http://ip-api.com/json/${encodeURIComponent(ip)}?fields=${fields}`, {
      signal: AbortSignal.timeout(2500),
    });
    if (!res.ok) return EMPTY;
    data = (await res.json()) as ApiResponse;
  } catch {
    return EMPTY;
  }
  if (data.status !== "success") return EMPTY;

  const isp = data.isp ?? "";
  const org = data.org ?? "";
  const asname = data.asname ?? "";
  const asn = (data.as ?? "").split(" ")[0]; // "AS15169 Google LLC" -> "AS15169"

  let connType: ConnType;
  if (data.hosting)
    connType = "hosting"; // datacenter / cloud / VPN exit
  else if (data.mobile) connType = "mobile";
  else if (isInstitution(org, isp, asname)) connType = "institution";
  else if (data.proxy) connType = "hosting";
  else if (isConsumer(isp, org, asname)) connType = "individual";
  else connType = "company"; // not consumer, not mobile/hosting -> likely an employer network

  // Best label: prefer the org name, fall back to ASN owner, then ISP.
  const label = (org || asname || isp || "").trim();

  const intel: IpIntel = {
    country: data.country ?? "",
    region: data.regionName ?? "",
    city: data.city ?? "",
    isp,
    org,
    asn,
    asname,
    label,
    connType,
    isOrg: connType === "company" || connType === "institution",
  };

  if (cache.size >= CACHE_MAX) cache.clear();
  cache.set(ip, { intel, ts: Date.now() });
  return intel;
}
