export const runtime = "nodejs";

import { NextResponse } from "next/server";
import sanitizeHtml, { defaults as sanitizeDefaults } from "sanitize-html";

type McCampaign = {
  id: string;
  send_time?: string;
  settings?: { title?: string };
  long_archive_url?: string;
};
type McContent = { html?: string | null };

export async function GET() {
  const apiKey = process.env.NEXT_PUBLIC_MAILCHIMP_API_KEY;
  const server = process.env.NEXT_PUBLIC_MAILCHIMP_SERVER;

  if (!apiKey || !server) {
    return NextResponse.json(
      {
        error: "missing_env",
        detail: "MAILCHIMP_API_KEY and MAILCHIMP_SERVER are required.",
      },
      { status: 500 }
    );
  }

  const auth = "Basic " + Buffer.from(`anystring:${apiKey}`).toString("base64");
  const base = `https://${server}.api.mailchimp.com/3.0`;

  try {
    // 1) Latest SENT campaign
    const campRes = await fetch(
      `${base}/campaigns?status=sent&sort_field=send_time&sort_dir=DESC&count=1`,
      { headers: { Authorization: auth }, cache: "no-store" }
    );
    if (!campRes.ok) {
      return NextResponse.json(
        { error: "campaign_fetch_failed", detail: await campRes.text() },
        { status: campRes.status }
      );
    }
    const campaignsJson = await campRes.json();
    const c: McCampaign | undefined = campaignsJson.campaigns?.[0];
    if (!c?.id)
      return NextResponse.json({ error: "no_campaigns" }, { status: 404 });

    // 2) Campaign HTML
    const contentRes = await fetch(`${base}/campaigns/${c.id}/content`, {
      headers: { Authorization: auth },
      cache: "no-store",
    });
    if (!contentRes.ok) {
      return NextResponse.json(
        { error: "content_fetch_failed", detail: await contentRes.text() },
        { status: contentRes.status }
      );
    }
    const content: McContent = await contentRes.json();
    let html = content.html ?? "";

    // 3) Remove tracking pixels (width or height = 1)
    html = html.replace(
      /<img[^>]*\b(width|height)\s*=\s*["']?1["']?[^>]*>/gi,
      ""
    );

    // 3.b) Robustly remove common header/footer phrases (anchors or wrapped elements)
    const killPhrases = [
      "View this email in your browser",
      "Want to change how you receive these emails?",
      "update your preferences",
      "unsubscribe from this list",
      "This email was sent to",
      "LIST:ADDRESSLINE",
      "REWARDS",
    ];
    // helper to escape phrase for regex
    const esc = (s: string) => s.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&");
    for (const phrase of killPhrases) {
      const p = esc(phrase);
      // remove anchors that include the phrase (any content between tags)
      html = html.replace(
        new RegExp(`<a\\b[^>]*>[\\s\\S]*?${p}[\\s\\S]*?<\\/a>`, "gi"),
        ""
      );
      // remove common block elements that include the phrase
      html = html.replace(
        new RegExp(
          `<(?:p|div|td|span|center|table|tr|th|header)[^>]*>[\\s\\S]*?${p}[\\s\\S]*?<\\\/(?:p|div|td|span|center|table|tr|th|header)>`,
          "gi"
        ),
        ""
      );
      // as a last resort, remove the raw phrase text
      html = html.replace(new RegExp(p, "gi"), "");
    }

    // 5) Sanitize AND normalize width/height on images/tables
    const safeHtml = sanitizeHtml(html, {
      allowedTags: (sanitizeDefaults.allowedTags ?? []).concat([
        "img",
        "h1",
        "h2",
        "h3",
        "table",
        "thead",
        "tbody",
        "tr",
        "td",
        "th",
      ]),
      allowedAttributes: {
        a: ["href", "name", "target", "rel"],
        img: ["src", "alt", "title", "style"], // strip width/height, force CSS scaling
        table: ["border", "cellpadding", "cellspacing", "style"],
        td: ["align", "valign", "colspan", "rowspan", "style"],
        th: ["align", "valign", "colspan", "rowspan", "style"],
        "*": ["style"],
      },
      allowedSchemes: ["http", "https", "mailto"],
      transformTags: {
        a: (tag, attribs) => ({
          tagName: "a",
          attribs: { ...attribs, target: "_blank", rel: "noopener noreferrer" },
        }),
        img: (tag, attribs) => {
          // force responsive behavior but allow inline layout for small icons (social buttons, etc.)
          const rest = {
            ...(attribs as Record<string, string | undefined>),
          } as Record<string, string | undefined>;
          // remove explicit width/height attributes so CSS controls sizing
          delete rest.width;
          delete rest.height;
          // normalize to string-only attributes for sanitize-html types
          const finalAttribs: Record<string, string> = {};
          for (const k of Object.keys(rest)) {
            const v = rest[k];
            if (v !== undefined) finalAttribs[k] = v;
          }
          finalAttribs.style = `${
            finalAttribs.style ?? ""
          };max-width:100%;height:auto;display:inline-block;vertical-align:middle;`;
          return { tagName: "img", attribs: finalAttribs };
        },
        table: (tag, attribs) => {
          const rest = {
            ...(attribs as Record<string, string | undefined>),
          } as Record<string, string | undefined>;
          delete rest.width;
          const finalAttribs: Record<string, string> = {};
          for (const k of Object.keys(rest)) {
            const v = rest[k];
            if (v !== undefined) finalAttribs[k] = v;
          }
          finalAttribs.style = `${
            finalAttribs.style ?? ""
          };width:100%;table-layout:fixed;`;
          return { tagName: "table", attribs: finalAttribs };
        },
        td: (tag, attribs) => {
          const rest = {
            ...(attribs as Record<string, string | undefined>),
          } as Record<string, string | undefined>;
          delete rest.width;
          const finalAttribs: Record<string, string> = {};
          for (const k of Object.keys(rest)) {
            const v = rest[k];
            if (v !== undefined) finalAttribs[k] = v;
          }
          return { tagName: "td", attribs: finalAttribs };
        },
        th: (tag, attribs) => {
          const rest = {
            ...(attribs as Record<string, string | undefined>),
          } as Record<string, string | undefined>;
          delete rest.width;
          const finalAttribs: Record<string, string> = {};
          for (const k of Object.keys(rest)) {
            const v = rest[k];
            if (v !== undefined) finalAttribs[k] = v;
          }
          return { tagName: "th", attribs: finalAttribs };
        },
      },
      disallowedTagsMode: "discard",
    });

    // ---------- POST-SANITIZE CLEANUP ----------
    // Further strip out leftover phrases, spacer rows and empty elements that
    // can produce the "View this email..." / "This email was sent to" artifacts
    // and large gaps. This operates on the sanitized HTML string.
    let cleaned = String(safeHtml);

    // Normalize non-breaking spaces
    cleaned = cleaned.replace(/&nbsp;|&#160;/g, " ");

    // Aggressively remove any remaining elements that contain kill phrases (across nested tags)
    const esc2 = (s: string) => s.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&");
    const killPhrases2 = [
      "View this email in your browser",
      "View this email",
      "Want to change how you receive these emails?",
      "update your preferences",
      "unsubscribe from this list",
      "This email was sent to",
      "LIST:ADDRESSLINE",
      "REWARDS",
    ];
    for (const phrase of killPhrases2) {
      const p = esc2(phrase);
      // Remove any tag that contains the phrase (handles nested tags/markup)
      cleaned = cleaned.replace(
        new RegExp(`<[^>]+>[\\s\\S]*?${p}[\\s\\S]*?<\\/[^>]+>`, "gi"),
        ""
      );
      // Remove stray occurrences of the phrase
      cleaned = cleaned.replace(new RegExp(p, "gi"), "");
    }

    // Remove empty table rows (common spacer rows left after removals)
    cleaned = cleaned.replace(
      /<tr[^>]*>(?:\s|&nbsp;|&#160;|<td[^>]*>\s*<\/td>)+<\/tr>/gi,
      ""
    );
    // Remove empty table cells
    cleaned = cleaned.replace(/<td[^>]*>\s*(?:&nbsp;|\s)*\s*<\/td>/gi, "");
    // Remove small spacer DIVs/P/SPANs with only inline height/width styles
    cleaned = cleaned.replace(
      /<(?:div|p|span)[^>]*style=["'][^"'>]*(?:height|width)\s*:\s*\d+px[^"'>]*["'][^>]*>\s*<\/(?:div|p|span)>/gi,
      ""
    );
    // Collapse multiple <br> into one
    cleaned = cleaned.replace(/(?:\s*<br[^>]*>\s*){3,}/gi, "<br/>");
    // Remove empty wrappers: <div>  </div> or long runs of whitespace between tags
    cleaned = cleaned.replace(/>\s{2,}</g, "><");
    // Trim
    cleaned = cleaned.trim();

    // Use cleaned HTML in response
    return NextResponse.json({
      id: c.id,
      title: c.settings?.title ?? "Newsletter",
      sentAt: c.send_time ?? null,
      archiveUrl: c.long_archive_url ?? null,
      html: cleaned,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "unexpected", detail: String(err) },
      { status: 500 }
    );
  }
}
