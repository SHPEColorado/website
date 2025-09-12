import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sponsor | SHPE Colorado",
  description:
    "Become a SHPE Colorado sponsor. Review our sponsorship package and contact us to partner on programs that support Hispanics in STEM.",
};

// Put the PDF in /public/docs/
const PDF_SRC = "/docs/SHPE CO 2023-2024 Corporate Sponsorship - Package.pdf";
const pdfUrl = encodeURI(PDF_SRC);
// Best-effort “fit to width” for common viewers (PDF.js/Firefox, Chrome, Acrobat)
const pdfUrlFit = `${pdfUrl}#zoom=page-width&view=FitH`;

// Pre-filled email (mailto) with a short template
const email = "vpcorporaterelations@shpecolorado.org";

export default function SponsorPage() {
  return (
    <>
      {/* Intro (centered) */}
      <section className="pt-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
            Sponsors
          </h1>
          <p className="mt-3 text-slate-700">
            Interested in being a sponsor? Review our sponsorship package below.
            If you have any questions, please reach out to{" "}
            <a
              className="text-brand-blue-600 underline-offset-2 hover:underline"
              href={`mailto:${email}`}
            >
              {email}
            </a>
            .
          </p>
        </div>
      </section>

      {/* PDF (in container, not full-bleed) */}
      <section className="py-8">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-xl overflow-hidden ring-1 ring-slate-200 bg-white">
            <object
              data={pdfUrlFit}
              type="application/pdf"
              className="block w-full h-[70vh] sm:h-[80vh]"
            >
              {/* Fallback for browsers that block inline PDFs */}
              <div className="p-6 text-center">
                <p className="text-slate-700">
                  Your browser doesn’t support inline PDFs. You can{" "}
                  <a
                    href={pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-blue-600 underline-offset-2 hover:underline"
                  >
                    open the packet in a new tab
                  </a>
                  .
                </p>
              </div>
            </object>
          </div>
        </div>
      </section>

      {/* Volunteer Hour Matching */}
      <section className="border-t border-slate-200 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold text-center">
            Volunteer Hour Matching
          </h2>

          <p className="mt-3 text-slate-700 text-center max-w-3xl mx-auto">
            For every hour you invest in our chapter, your company may donate
            money to SHPE Colorado through its employee volunteer matching
            program. For example, some companies match at
            <span className="font-semibold"> $10 per volunteer hour</span>.
          </p>

          <div className="mt-6 max-w-3xl mx-auto">
            <p className="text-slate-700 text-center">
              Here’s how to make sure your time counts:
            </p>
            <ul className="mt-3 list-disc pl-6 space-y-2 text-slate-700 text-left">
              <li>
                Find your company’s volunteering platform (e.g.,{" "}
                <span className="font-medium">Benevity</span>,{" "}
                <span className="font-medium">YourCause</span>, CyberGrants,
                etc.).
              </li>
              <li>
                Track every hour you invest in SHPE Colorado: in-person
                volunteering, attending community events, or knowledge sharing.
              </li>
              <li>
                Submit your hours regularly—setting a quarterly reminder works
                well.
              </li>
              <li>
                Search for our organization as{" "}
                <span className="font-medium">
                  &ldquo;SHPE Colorado Professional&rdquo;
                </span>{" "}
                when logging your time. (If a tax ID or address is required,
                contact us and we’ll provide the details.)
              </li>
            </ul>
          </div>

          <div className="mt-6 flex justify-center gap-3">
            <a
              href={`mailto:${email}`}
              className="inline-flex items-center rounded-lg ring-1 ring-slate-300 px-4 py-2 text-slate-900 hover:bg-slate-50"
            >
              Questions? Email Us
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
