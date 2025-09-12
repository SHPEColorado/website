"use client";

import { useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import type { CalendarApi, EventClickArg } from "@fullcalendar/core";

type EventInput = {
  id: string;
  title: string;
  start: string;
  end?: string;
  allDay?: boolean;
  url?: string;
  extendedProps?: Record<string, unknown>;
};

export default function EventsCalendar() {
  const [events, setEvents] = useState<EventInput[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const calendarRef = useRef<FullCalendar | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const now = new Date();
        const from = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
        const to = new Date(now.getFullYear(), now.getMonth() + 13, 1).toISOString();
        const res = await fetch(`/api/events?from=${from}&to=${to}`, { cache: "no-store" });
        if (!res.ok) throw new Error(await res.text());
        const data: EventInput[] = await res.json();
        if (active) setEvents(data);
      } catch (e) {
        console.error(e);
        if (active) setError("Failed to load events.");
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  // Media query handling without ts-ignore
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia("(max-width: 640px)");

    const apply = (mobile: boolean) => {
      setIsMobile(mobile);
      const api: CalendarApi | undefined = calendarRef.current?.getApi();
      api?.changeView(mobile ? "listMonth" : "dayGridMonth");
    };

    apply(mql.matches);

    const handler = (e: MediaQueryListEvent) => apply(e.matches);

    if (typeof mql.addEventListener === "function") {
      mql.addEventListener("change", handler);
      return () => mql.removeEventListener("change", handler);
    }
    // Legacy Safari
    type LegacyMql = MediaQueryList & {
      addListener: (cb: (e: MediaQueryListEvent) => void) => void;
      removeListener: (cb: (e: MediaQueryListEvent) => void) => void;
    };
    if (typeof (mql as Partial<LegacyMql>).addListener === "function") {
      const legacy = mql as LegacyMql;
      legacy.addListener(handler);
      return () => legacy.removeListener(handler);
    }
    return;
  }, []);

  const onEventClick = (info: EventClickArg) => {
    info.jsEvent.preventDefault();
    const href =
      (info.event.extendedProps as { ticketUrl?: string } | undefined)?.ticketUrl ||
      info.event.url;
    if (href) window.open(href, "_blank", "noopener");
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 sm:p-4">
      {error && <p className="text-sm text-red-600">{error}</p>}
      {!events ? (
        <div className="h-64 flex items-center justify-center text-slate-500">Loading events…</div>
      ) : (
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, listPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{ left: "prev,next today", center: "title", right: "dayGridMonth,listMonth" }}
          buttonText={{ today: "Today", month: "Month", list: "List" }}
          events={events}
          eventClick={onEventClick}
          height="auto"
          nowIndicator
          displayEventEnd
          dayMaxEventRows={isMobile ? false : 3}
        />
      )}
    </div>
  );
}
