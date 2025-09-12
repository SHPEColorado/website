import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bylaws | SHPE Colorado",
  description:
    "Review the SHPE Colorado Professional Chapter bylaws.",
};

// Put the PDF in /public/docs/
const PDF_SRC = "/docs/SHPE_CO_2024_Bylaws.pdf";
const pdfUrl = encodeURI(PDF_SRC);
// Best-effort hint to fit horizontally in viewers that support it
const pdfUrlFit = `${pdfUrl}#zoom=page-width&view=FitH`;

export default function BylawsPage() {
  return (
    <>
      {/* Intro (centered) */}
      <section className="pt-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">Bylaws</h1>
          <p className="mt-3 text-slate-700">
            Review the SHPE Colorado Professional Chapter bylaws below.
          </p>
        </div>
      </section>

      {/* PDF (in container, not full-bleed) */}
      <section className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-xl overflow-hidden ring-1 ring-slate-200 bg-white">
            <object
              data={pdfUrlFit}
              type="application/pdf"
              className="block w-full h-[70vh] sm:h-[80vh]"
            >
              {/* Fallback if inline PDFs are blocked */}
              <div className="p-6 text-center">
                <p className="text-slate-700">
                  Your browser doesn’t support inline PDFs. You can{" "}
                  <a
                    href={pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-blue-600 underline-offset-2 hover:underline"
                  >
                    open the bylaws in a new tab
                  </a>
                  .
                </p>
              </div>
            </object>
          </div>
        </div>
      </section>
    </>
  );
}
