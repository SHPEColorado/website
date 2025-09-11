"use client";

import { useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import type { CalendarApi } from "@fullcalendar/core";

type EventInput = {
  id: string;
  title: string;
  start: string;
  end?: string;
  allDay?: boolean;
  url?: string;
  extendedProps?: Record<string, any>;
};

export default function EventsCalendar() {
  const [events, setEvents] = useState<EventInput[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const calendarRef = useRef<FullCalendar | null>(null);
  const [isMobile, setIsMobile] = useState(false); // used only for toolbar/layout tweaks

  // Load events
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const now = new Date();
        const from = new Date(
          now.getFullYear(),
          now.getMonth() - 1,
          1
        ).toISOString();
        const to = new Date(
          now.getFullYear(),
          now.getMonth() + 13,
          1
        ).toISOString();
        const res = await fetch(`/api/events?from=${from}&to=${to}`, {
          cache: "no-store",
        });
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
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

  // Switch view based on viewport (≤640px -> listMonth, else dayGridMonth)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia("(max-width: 640px)");

    const apply = (mobile: boolean) => {
      setIsMobile(mobile);
      const api: CalendarApi | undefined = calendarRef.current?.getApi();
      if (api) api.changeView(mobile ? "listMonth" : "dayGridMonth");
    };

    apply(mql.matches); // set on mount

    const handler = (e: MediaQueryListEvent) => apply(e.matches);
    mql.addEventListener?.("change", handler);
    // Fallback for older browsers
    // @ts-ignore
    mql.addListener?.(handler);

    return () => {
      mql.removeEventListener?.("change", handler);
      // @ts-ignore
      mql.removeListener?.(handler);
    };
  }, []);

  const onEventClick = (info: any) => {
    info.jsEvent.preventDefault();
    const href = info.event.extendedProps?.ticketUrl || info.event.url;
    if (href) window.open(href, "_blank", "noopener");
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 sm:p-4">
      {error && <p className="text-sm text-red-600">{error}</p>}
      {!events ? (
        <div className="h-64 flex items-center justify-center text-slate-500">
          Loading events…
        </div>
      ) : (
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, listPlugin, interactionPlugin]}
          initialView="dayGridMonth" // desktop default; mobile switched in effect
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,listMonth", // show both; user can toggle
          }}
          buttonText={{ today: "Today", month: "Month", list: "List" }}
          events={events}
          eventClick={onEventClick}
          height="auto"
          nowIndicator
          displayEventEnd
          dayMaxEventRows={isMobile ? false : 3} // month view cap; list view ignores this
        />
      )}
    </div>
  );
}
