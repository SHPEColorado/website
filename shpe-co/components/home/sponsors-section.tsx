"use client";

import Image from "next/image";
import Link from "next/link";
import {
  SPONSORS,
  SPONSOR_TIERS,
  type Sponsor,
  type SponsorTier,
} from "@/lib/sponsors";

const titleClass =
  "w-full !text-center text-2xl font-semibold tracking-tight text-slate-900";

export default function SponsorsSection() {
  const groups = groupByTier(SPONSORS);

  return (
    <>
      {/* SPONSORS (compact rows) */}
      <section className="py-10 border-t border-slate-200">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className={titleClass}>Our Sponsors</h2>
          </div>

          {SPONSOR_TIERS.map((tier) => {
            const items = groups[tier] ?? [];
            if (!items.length) return null;

            // layout & size per tier
            const config: Record<
              SponsorTier,
              { cols: 1 | 2 | 3; size: "xl" | "lg" | "md" | "sm" }
            > = {
              platinum: { cols: 1, size: "md" },
              gold: { cols: 1, size: "xl" },
              silver: { cols: 2, size: "md" },
              bronze: { cols: 2, size: "md" },
              partner: { cols: 2, size: "sm" },
            };

            const { cols, size } = config[tier];

            return (
              <TierRow
                key={tier}
                tier={tier}
                items={items}
                cols={cols}
                size={size}
                priority={tier === "platinum"}
              />
            );
          })}
        </div>
      </section>

      {/* PARTNERSHIPS */}
      {groups.partner?.length ? (
        <section className="py-8">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className={titleClass}>Our Partners</h2>
            </div>
            <TierRow
              tier="partner"
              items={groups.partner}
              cols={2}
              size="sm"
              hideBadge
            />
          </div>
        </section>
      ) : null}
    </>
  );
}

/* ---------- compact row components ---------- */

function TierRow({
  tier,
  items,
  cols,
  size,
  priority = false,
  hideBadge = false, // 👈 new
}: {
  tier: SponsorTier;
  items: Sponsor[];
  cols: 1 | 2 | 3;
  size: "xl" | "lg" | "md" | "sm";
  priority?: boolean;
  hideBadge?: boolean; // 👈 new
}) {
  const imgHeights =
    size === "xl"
      ? "h-20 sm:h-24 lg:h-28"
      : size === "lg"
      ? "h-16 sm:h-20 lg:h-24"
      : size === "md"
      ? "h-14 sm:h-16 lg:h-18"
      : "h-12 sm:h-14 lg:h-16";

  const maxW =
    size === "xl"
      ? "max-w-[min(85vw,520px)]"
      : size === "lg"
      ? "max-w-[420px]"
      : size === "md"
      ? "max-w-[320px]"
      : "max-w-[240px]";

  const sizesAttr =
    size === "xl"
      ? "(min-width:1024px) 520px, (min-width:640px) 360px, 260px"
      : "(min-width:1024px) 380px, (min-width:640px) 300px, 220px";

  const rightCols =
    cols === 1
      ? "grid-cols-1 justify-center"
      : cols === 2
      ? "grid-cols-1 sm:grid-cols-2 justify-center"
      : "grid-cols-2 sm:grid-cols-3 justify-center";

  // If we hide the badge, don't allocate the left column.
  const wrapperClass = hideBadge
    ? "mt-6"
    : "mt-6 grid grid-cols-[auto,1fr] items-center gap-x-6 gap-y-4";

  return (
    <div className={wrapperClass}>
      {!hideBadge && (
        <div className="justify-self-start">
          <TierBadge tier={tier} />
          <span className="sr-only">{ReadableTier[tier]} sponsors</span>
        </div>
      )}

      <div className={`grid ${rightCols} gap-x-10 gap-y-6`}>
        {items.map((s) => (
          <Link
            key={s.name}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            title={s.name}
            className="inline-flex items-center justify-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-400 hover:opacity-90 transition-opacity"
            aria-label={s.name}
          >
            <Image
              src={s.logo}
              alt={s.alt ?? `${s.name} logo`}
              width={640}
              height={300}
              priority={priority}
              sizes={sizesAttr}
              className={`${imgHeights} ${maxW} w-auto object-contain`}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}

/* ---------- helpers ---------- */

function groupByTier(items: Sponsor[]) {
  const out: Record<SponsorTier, Sponsor[]> = {
    platinum: [],
    gold: [],
    silver: [],
    bronze: [],
    partner: [],
  };
  for (const s of items) out[s.tier].push(s);
  return out;
}

const ReadableTier: Record<SponsorTier, string> = {
  platinum: "Platinum",
  gold: "Gold",
  silver: "Silver",
  bronze: "Bronze",
  partner: "Partner",
};

function TierBadge({ tier }: { tier: SponsorTier }) {
  const style: Record<SponsorTier, string> = {
    platinum: "bg-slate-100 text-slate-700 ring-1 ring-slate-300",
    gold: "bg-amber-300/80 text-amber-900 ring-1 ring-amber-400",
    silver: "bg-zinc-200 text-zinc-800 ring-1 ring-zinc-400",
    bronze: "bg-orange-300/80 text-amber-900 ring-1 ring-amber-400",
    partner: "bg-slate-100 text-slate-700 ring-1 ring-slate-300",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${style[tier]}`}
      aria-hidden="true"
    >
      {ReadableTier[tier]}
    </span>
  );
}
