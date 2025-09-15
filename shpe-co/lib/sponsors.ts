export type SponsorTier = "platinum" | "gold" | "silver" | "bronze" | "partner";

export type Sponsor = {
  name: string;
  url: string;
  logo: string; // /sponsors/filename.svg|png (under /public)
  tier: SponsorTier;
  alt?: string;
};

export const SPONSOR_TIERS: SponsorTier[] = [
  "platinum",
  "gold",
  "silver",
  "bronze",
];

export const TIER_ORDER: SponsorTier[] = [
  "platinum",
  "gold",
  "silver",
  "bronze",
  "partner",
];

export const SPONSORS: Sponsor[] = [
  {
    name: "EATON",
    url: "https://www.eaton.com/us/en-us.html",
    logo: "/sponsors/eaton.png",
    tier: "platinum",
    alt: "Eaton",
  },
  {
    name: "JVA Consulting Engineers",
    url: "https://www.jvajva.com/",
    logo: "/sponsors/jva.webp",
    tier: "bronze",
    alt: "JVA Consulting Engineers",
  },
  {
    name: "Xcel Energy",
    url: "https://www.xcelenergy.com/",
    logo: "/sponsors/xcel.png",
    tier: "bronze",
    alt: "Xcel Energy",
  },

  // Partnerships (use tier "partner")
  {
    name: "AIAA Rocky Mountain",
    url: "https://www.aiaa-rm.org/",
    logo: "/sponsors/aiaa.png",
    tier: "partner",
  },
  {
    name: "SHHRP",
    url: "https://shhrp.net/",
    logo: "/sponsors/shhrp.png",
    tier: "partner",
  },
];
