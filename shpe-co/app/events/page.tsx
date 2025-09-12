import type { Metadata } from "next";
import EventsCalendar from "@/components/events/events-calendar";
import SubscribeButtons from "@/components/events/subscribe-buttons";

export const metadata: Metadata = {
  title: "Events | SHPE Colorado",
  description: "Upcoming events for SHPE Colorado — view details and get tickets.",
};

export default function EventsPage() {
  return (
    <section className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-center">Events</h1>
        <p className="mt-2 text-slate-600 text-center">
          See upcoming events and tap any item to get tickets on Eventbrite.
        </p>

        <div className="mt-6">
          <EventsCalendar />
        </div>

        {/* Subscribe row */}
        <div className="mt-4 sm:mt-6">
          <SubscribeButtons align="center" />
        </div>
      </div>
    </section>
  );
}
