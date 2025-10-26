import { useState } from "react";
import Hero from "@/components/Hero";
import EventCard from "@/components/EventCard";
import EventModal from "@/components/EventModal";
import FilterPanel, { EventFilters } from "@/components/FilterPanel";
import { useLocation } from "@/hooks/useLocation";
import { useEvents, Event } from "@/hooks/useEvents";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState<EventFilters>({
    distance: 25,
    maxPrice: null,
    interests: [],
    energyLevels: [],
    vibes: []
  });

  const location = useLocation();
  const { events, loading } = useEvents(location, filters);

  // Filter by search query
  const filteredEvents = events.filter((event) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      event.title.toLowerCase().includes(query) ||
      event.city.toLowerCase().includes(query) ||
      event.venue_name?.toLowerCase().includes(query)
    );
  });

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const hasActiveFilters = 
    filters.maxPrice !== null ||
    filters.interests.length > 0 ||
    filters.energyLevels.length > 0 ||
    filters.vibes.length > 0;

  return (
    <div className="min-h-screen bg-background">
      <Hero onSearch={setSearchQuery} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold">
              {hasActiveFilters ? 'My Events' : 'Events Near You'}
            </h2>
            {location.status === 'detecting' ? (
              <Badge variant="outline">Detecting location...</Badge>
            ) : (
              <Badge variant="outline">
                📍 {location.city}, {location.state}
              </Badge>
            )}
          </div>
          <FilterPanel filters={filters} onFiltersChange={setFilters} />
        </div>

        {hasActiveFilters && (
          <p className="text-muted-foreground mb-4">
            Found {filteredEvents.length} events matching your preferences
          </p>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-muted-foreground mb-4">
              No events found matching your criteria.
            </p>
            {hasActiveFilters && (
              <p className="text-sm text-muted-foreground">
                Try adjusting your filters to see more events
              </p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
            {filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onClick={() => handleEventClick(event)}
              />
            ))}
          </div>
        )}
      </div>

      <EventModal
        event={selectedEvent}
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default Index;
