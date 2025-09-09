"use client";

import Link from "next/link";
import { SocialIcon } from "react-social-icons";

export default function SiteFooter({}) {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 text-slate-700">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* 3-column grid: left = address, center = links, right = socials */}
        <div className="grid gap-6 md:grid-cols-[1fr_auto_1fr] md:items-center">
          {/* LEFT */}
          <div className="order-2 md:order-1 space-y-1">
            <address className="not-italic text-sm">
              P.O. Box 850, Firestone, CO 80520
            </address>
            <p className="text-sm text-slate-600">
              © 1988–2025 SHPE Colorado. All rights reserved.
            </p>
          </div>

          {/* CENTER (always centered) */}
          <nav className="order-1 md:order-2 flex justify-center items-center gap-6">
            <Link href="/sponsor" className="text-sm hover:text-slate-900">
              Sponsor
            </Link>
            <Link href="/bylaws" className="text-sm hover:text-slate-900">
              Bylaws
            </Link>
            <a
              href="https://shpe.org/membership/become-a-member/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm hover:text-slate-900"
            >
              Join
            </a>
          </nav>

          {/* RIGHT (icons) */}
          <div className="order-3 md:justify-self-end flex items-center gap-5">
            <SocialIcon
              url="https://www.facebook.com/SHPEColorado"
              network="facebook"
              fgColor="currentColor"
              bgColor="transparent"
              style={{ height: 30, width: 30 }}
              className="text-slate-600 hover:text-[#1877F2] transition-colors"
              target="_blank"
              rel="noopener noreferrer"
              label="Facebook"
            />
            <SocialIcon
              url="https://www.linkedin.com/company/shpe-colorado/"
              network="linkedin"
              fgColor="currentColor"
              bgColor="transparent"
              style={{ height: 30, width: 30 }}
              className="text-slate-600 hover:text-[#0A66C2] transition-colors"
              target="_blank"
              rel="noopener noreferrer"
              label="LinkedIn"
            />
            <SocialIcon
              url="https://www.instagram.com/shpecolorado/"
              network="instagram"
              fgColor="currentColor"
              bgColor="transparent"
              style={{ height: 30, width: 30 }}
              className="text-slate-600 hover:text-[#E4405F] transition-colors"
              target="_blank"
              rel="noopener noreferrer"
              label="Instagram"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
