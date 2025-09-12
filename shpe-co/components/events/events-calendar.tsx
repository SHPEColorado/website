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

  // Decide initial view on the client
  const [initialView, setInitialView] = useState<"dayGridMonth" | "listMonth">(
    "dayGridMonth"
  );
  const [hydrated, setHydrated] = useState(false);

  // Set initial view once we’re on the client
  useEffect(() => {
    setHydrated(true);
    if (typeof window !== "undefined") {
      const isMobile = window.matchMedia("(max-width: 640px)").matches;
      setInitialView(isMobile ? "listMonth" : "dayGridMonth");
    }
  }, []);

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

  // Live-switch view when crossing the breakpoint
  useEffect(() => {
    if (typeof window === "undefined") return;

    const mql = window.matchMedia("(max-width: 640px)");

    const apply = (matches: boolean) => {
      const api: CalendarApi | undefined = calendarRef.current?.getApi();
      if (api) api.changeView(matches ? "listMonth" : "dayGridMonth");
    };

    // apply on mount and set listener
    apply(mql.matches);

    const handler = (e: MediaQueryListEvent) => apply(e.matches);

    if (mql.addEventListener) mql.addEventListener("change", handler);
    else
      (
        mql as unknown as { addListener: (cb: typeof handler) => void }
      ).addListener(handler);

    return () => {
      if (mql.removeEventListener) mql.removeEventListener("change", handler);
      else
        (
          mql as unknown as { removeListener: (cb: typeof handler) => void }
        ).removeListener(handler);
    };
  }, []);

  const onEventClick = (info: EventClickArg) => {
    info.jsEvent.preventDefault();
    const props = info.event.extendedProps as
      | { ticketUrl?: string }
      | undefined;
    const href = props?.ticketUrl || info.event.url;
    if (href) window.open(href, "_blank", "noopener");
  };

  if (!hydrated) {
    // avoid server/client mismatch and show a small skeleton
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-3 sm:p-4 h-64 flex items-center justify-center text-slate-500">
        Loading events…
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 sm:p-4">
      {error && <p className="text-sm text-red-600">{error}</p>}
      <FullCalendar
        key={initialView} // re-init when initialView is set on client
        ref={calendarRef}
        plugins={[dayGridPlugin, listPlugin, interactionPlugin]}
        initialView={initialView}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,listMonth",
        }}
        buttonText={{ today: "Today", month: "Month", list: "List" }}
        events={events ?? []}
        eventClick={onEventClick}
        height="auto"
        nowIndicator
        displayEventEnd
        dayMaxEventRows={initialView === "dayGridMonth" ? 3 : false}
      />
    </div>
  );
}
