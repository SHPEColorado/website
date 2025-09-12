export const dynamic = "force-dynamic";

import Image from "next/image";

export const revalidate = 600; // ISR for static builds

type GImage = {
  id: string;
  name: string;
  pageUrl: string;
  viewUrl: string;
  width?: number | null;
  height?: number | null;
};

export default async function GalleryPage() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/gallery`,
    {
      next: { revalidate: 600 },
    }
  );
  const images: GImage[] = res.ok ? await res.json() : [];

  return (
    <section className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-center">
          Gallery
        </h1>
        <p className="mt-2 text-slate-600 text-center">
          Photos from SHPE Colorado events and community moments.
        </p>

        {/* Masonry */}
        <div className="mt-8 columns-1 sm:columns-2 lg:columns-3 gap-4 [column-fill:_balance]">
          {images.map((img) => (
            <a
              key={img.id}
              href={img.pageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group mb-4 block break-inside-avoid"
              title={img.name}
            >
              <Image
                src={img.viewUrl}
                alt={img.name}
                width={img.width ?? 1600}
                height={img.height ?? 900}
                sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                className="w-full h-auto rounded-lg border border-slate-200 bg-slate-50
                           transition-transform group-hover:scale-[1.01]"
              />
            </a>
          ))}
        </div>

        {!images.length && (
          <p className="mt-6 text-slate-500">
            No photos yet. Add images to your Drive folder to populate this
            page.
          </p>
        )}
      </div>
    </section>
  );
}
