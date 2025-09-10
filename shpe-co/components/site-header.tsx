"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

type NavItem = { label: string; href: string; external?: boolean };

const NAV: NavItem[] = [
  { label: "About Us", href: "/about" },
  { label: "Events", href: "/events" },
  { label: "Gallery", href: "/gallery" },
  { label: "News", href: "/news" },
  { label: "Job Board", href: "/jobs" },
  { label: "Sponsor", href: "/sponsor" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) => href !== "/" && pathname?.startsWith(href);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/75 border-b border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left: SHPE lockup */}
          <Link
            href="/"
            className="flex items-center gap-3"
            aria-label="SHPE Colorado home"
          >
            <Image
              src="/brand/shpe-co-lockup-horizontal-dark.svg"
              alt="SHPE | Colorado Professional"
              width={180}
              height={44}
              priority
            />
            {/* Divider + Chapter text */}
            <span
              className="hidden md:block h-8 w-px bg-slate-300"
              aria-hidden
            />
            <span className="hidden md:block text-slate-800 tracking-wide">
              Colorado
            </span>
          </Link>

          {/* Right: Nav (desktop) */}
          <nav className="hidden md:flex items-center gap-6">
            {NAV.map((item) =>
              item.external ? (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-slate-700 hover:text-slate-900"
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`text-sm font-medium hover:text-slate-900 ${
                    isActive(item.href) ? "text-slate-900" : "text-slate-700"
                  }`}
                >
                  {item.label}
                </Link>
              )
            )}
            {/* Emphasis for Join */}
            <a
              href="https://shpe.org/membership/become-a-member/"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 inline-flex items-center rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-900 hover:bg-slate-50"
            >
              Join
            </a>
          </nav>

          {/* Mobile toggle */}
          <button
            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle navigation"
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden border-t border-slate-200 bg-white">
          <nav className="mx-auto max-w-7xl px-4 py-3 space-y-1">
            {NAV.map((item) =>
              item.external ? (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-md px-3 py-2 text-slate-700 hover:bg-slate-50"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`block rounded-md px-3 py-2 hover:bg-slate-50 ${
                    isActive(item.href) ? "text-slate-900" : "text-slate-700"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              )
            )}
            <a
              href="https://www.shpe.org/membership"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 block rounded-md border border-slate-300 px-3 py-2 text-slate-900"
              onClick={() => setOpen(false)}
            >
              Join
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
