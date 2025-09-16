"use client";

import { useState } from "react";
import Image from "next/image";

type Props = {
  src: string;
  alt: string;
  className?: string;
};

export default function FlyerPreview({ src, alt, className }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Thumbnail (zoom on hover) */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`group mt-3 relative h-56 sm:h-60 hover:ring-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue-600 cursor-zoom-in ${className ?? ""}`}
        aria-label="Open flyer"
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(min-width:1024px) 20vw, (min-width:640px) 33vw, 90vw"
          className="
            object-contain
            transform-gpu will-change-transform
            transition-transform duration-300 ease-out
            motion-reduce:transition-none
            group-hover:scale-[1.06] group-focus:scale-[1.06]
          "
          priority={false}
        />
      </button>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 z-[100] bg-black/70 flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative w-full max-w-3xl bg-white rounded-lg shadow-xl p-3"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Limit the image box height so it fits on screen */}
            <div className="relative w-full" style={{ height: "min(85vh, 80vw)" }}>
              <Image
                src={src}
                alt={alt}
                fill
                sizes="80vw"
                className="object-contain"
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
