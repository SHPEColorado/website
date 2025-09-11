import Link from "next/link";

export default function SubscribeButtons({
  align = "center",
}: { align?: "left" | "center" | "right" }) {
  const id = process.env.GCAL_ID;
  if (!id) return null;

  const encId = encodeURIComponent(id);
  const name  = encodeURIComponent("SHPE Colorado Events");

  // Links
  const webcal = `webcal://calendar.google.com/calendar/ical/${encId}/public/basic.ics`;
  const ics    = `https://calendar.google.com/calendar/ical/${encId}/public/basic.ics`;
  const outlookPersonal = `https://outlook.live.com/calendar/0/addfromweb?url=${encodeURIComponent(ics)}&name=${name}`;
  const outlookWork     = `https://outlook.office.com/calendar/0/addfromweb?url=${encodeURIComponent(ics)}&name=${name}`;
  const google          = `https://calendar.google.com/calendar/u/0/r?cid=${encId}`;

  const wrap =
    align === "right"
      ? "justify-end"
      : align === "left"
      ? "justify-start"
      : "justify-center";

  const btn = "inline-flex items-center rounded-lg ring-1 ring-slate-300 px-3 py-1.5 text-sm font-semibold hover:bg-slate-50";
  const primary = "bg-brand-blue-600 text-black ring-0";

  return (
    <div className={`flex flex-wrap gap-2 ${wrap}`}>
      {/* Google first for Android/Google users */}
      <a href={google} target="_blank" rel="noopener noreferrer" className={`${btn} ${primary}`}>
        Subscribe in Google
      </a>
      <a href={webcal} className={btn}>Add to Apple Calendar</a>
      <a href={outlookPersonal} target="_blank" rel="noopener noreferrer" className={btn}>
        Add to Outlook.com
      </a>
      <a href={outlookWork} target="_blank" rel="noopener noreferrer" className={btn}>
        Add to Outlook 365
      </a>
      <a href={ics} className={btn}>ICS feed</a>
    </div>
  );
}
