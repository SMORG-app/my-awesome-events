import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Event } from "@/hooks/useEvents";
import EventCard from "./EventCard";
import { format, isSameDay, startOfDay } from "date-fns";
import { cn } from "@/lib/utils";

interface CalendarViewProps {
  events: Event[];
  onEventClick: (event: Event) => void;
}

const CalendarView = ({ events, onEventClick }: CalendarViewProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Get events for selected date
  const eventsForSelectedDate = events.filter((event) =>
    selectedDate ? isSameDay(new Date(event.date), selectedDate) : false
  );

  // Get dates that have events
  const eventDates = events.map((event) => startOfDay(new Date(event.date)));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6 pb-12">
      <div className="flex justify-center">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className={cn("rounded-lg border bg-card p-3 shadow-sm pointer-events-auto")}
          modifiers={{
            hasEvent: eventDates,
          }}
          modifiersClassNames={{
            hasEvent: "bg-primary/10 font-bold text-primary",
          }}
        />
      </div>

      <div className="space-y-4">
        {selectedDate && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">
              Events on {format(selectedDate, "MMMM d, yyyy")}
            </h3>
            {eventsForSelectedDate.length === 0 ? (
              <p className="text-muted-foreground">No events on this date</p>
            ) : (
              <p className="text-sm text-muted-foreground mb-4">
                {eventsForSelectedDate.length} event{eventsForSelectedDate.length !== 1 ? "s" : ""} found
              </p>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {eventsForSelectedDate.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onClick={() => onEventClick(event)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
