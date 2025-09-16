"use client";

import { useState } from "react";
import Image from "next/image";

type Props = { src: string; alt: string; className?: string };

export default function FlyerPreview({ src, alt, className }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`group mt-3 relative h-56 sm:h-60 overflow-hidden focus:outline-none focus:ring-2 focus:ring-brand-blue-600 ${
          className ?? ""
        }`}
        aria-label="Open flyer"
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-contain transition-transform duration-200 ease-out group-hover:scale-[1.03]"
          sizes="(min-width:1280px) 280px, (min-width:1024px) 240px, (min-width:640px) 320px, 92vw"
          quality={60}
          priority={false}
        />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] bg-black/70 flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative w-full max-w-3xl bg-white rounded-lg shadow-xl p-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="relative w-full"
              style={{ height: "min(85vh, 80vw)" }}
            >
              <Image
                src={src}
                alt={alt}
                fill
                className="object-contain"
                sizes="80vw"
                quality={70}
              />
            </div>

            <div className="mt-3 flex items-center justify-between gap-3">
              <a
                href={src}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex rounded-md ring-1 ring-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-900 hover:bg-slate-50"
              >
                Open in new tab
              </a>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex rounded-md bg-brand-blue-600 px-3 py-1.5 text-black text-sm font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
