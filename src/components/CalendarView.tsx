import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Event } from "@/hooks/useEvents";
import EventCard from "./EventCard";
import { format, isSameDay, startOfDay } from "date-fns";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";

interface CalendarViewProps {
  events: Event[];
  onEventClick: (event: Event) => void;
  onDismiss?: (eventId: string) => void;
}

const CalendarView = ({ events, onEventClick, onDismiss }: CalendarViewProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  // Get events for selected date, sorted by start time
  const eventsForSelectedDate = events
    .filter((event) =>
      selectedDate ? isSameDay(new Date(event.date), selectedDate) : false
    )
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Get dates that have events
  const eventDates = events.map((event) => startOfDay(new Date(event.date)));

  const handleEventSelect = (event: Event) => {
    setSelectedEvent(event);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6 pb-12">
      <div className="flex justify-center">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => {
            setSelectedDate(date);
            setSelectedEvent(null);
          }}
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

        {selectedEvent ? (
          <div className="space-y-4">
            <button
              onClick={() => setSelectedEvent(null)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Back to list
            </button>
            <EventCard
              event={selectedEvent}
              onClick={() => onEventClick(selectedEvent)}
              onDismiss={onDismiss}
            />
          </div>
        ) : (
          <div className="space-y-2">
            {eventsForSelectedDate.map((event) => (
              <button
                key={event.id}
                onClick={() => handleEventSelect(event)}
                className="w-full text-left p-4 rounded-lg border bg-card hover:bg-accent transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">{event.title}</h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{format(new Date(event.date), "h:mm a")}</span>
                    </div>
                    {event.venue_name && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {event.venue_name}
                      </p>
                    )}
                  </div>
                  <div className="text-sm font-medium text-primary">
                    {event.cost_display}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarView;
