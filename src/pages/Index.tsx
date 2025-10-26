import { useState, useEffect } from "react";
import Hero from "@/components/Hero";
import EventCard from "@/components/EventCard";
import EventModal from "@/components/EventModal";
import FilterPanel, { EventFilters } from "@/components/FilterPanel";
import ViewToggle from "@/components/ViewToggle";
import CalendarView from "@/components/CalendarView";
import LocationBadge from "@/components/LocationBadge";
import { useLocation } from "@/hooks/useLocation";
import { useEvents, Event } from "@/hooks/useEvents";
import { useDismissedEvents } from "@/hooks/useDismissedEvents";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Eye } from "lucide-react";

type ViewType = "grid" | "calendar";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [view, setView] = useState<ViewType>(() => {
    const saved = localStorage.getItem("smorgView");
    return (saved as ViewType) || "grid";
  });
  const [filters, setFilters] = useState<EventFilters>({
    distance: 25,
    priceRange: [0, 1000],
    interests: [],
    energyLevels: [],
    vibes: []
  });

  useEffect(() => {
    localStorage.setItem("smorgView", view);
  }, [view]);

  const { location, detectLocation, updateLocation, resetLocation } = useLocation();
  const { events, loading } = useEvents(location, filters);
  const { dismissedEvents, dismissEvent, undoDismiss, clearAllDismissed } = useDismissedEvents();
  const { toast } = useToast();

  // Calculate available price range from events
  const availablePriceRange: [number, number] = events.length > 0
    ? [
        Math.min(...events.map(e => e.cost)),
        Math.max(...events.map(e => e.cost))
      ]
    : [0, 0];

  // Update price range when events change
  useEffect(() => {
    if (events.length > 0 && availablePriceRange[0] !== availablePriceRange[1]) {
      const [newMin, newMax] = availablePriceRange;
      setFilters(prev => ({
        ...prev,
        priceRange: [
          Math.max(newMin, Math.min(prev.priceRange[0], newMax)),
          Math.min(newMax, Math.max(prev.priceRange[1], newMin))
        ]
      }));
    }
  }, [events.length]);

  // Filter by search query and dismissed events
  const filteredEvents = events.filter((event) => {
    // Filter out dismissed events
    if (dismissedEvents.includes(event.id)) return false;
    
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

  const handleDismissEvent = (eventId: string) => {
    dismissEvent(eventId);
    toast({
      title: "Event hidden",
      description: "This event won't be shown again",
      action: (
        <Button
          variant="outline"
          size="sm"
          onClick={() => undoDismiss(eventId)}
        >
          Undo
        </Button>
      ),
      duration: 5000,
    });
  };

  const isPriceFiltered = availablePriceRange[0] !== availablePriceRange[1] && 
    (filters.priceRange[0] !== availablePriceRange[0] || filters.priceRange[1] !== availablePriceRange[1]);
  const hasActiveFilters = 
    isPriceFiltered ||
    filters.interests.length > 0 ||
    filters.energyLevels.length > 0 ||
    filters.vibes.length > 0;

  return (
    <div className="min-h-screen bg-background">
      <Hero 
        onSearch={setSearchQuery}
        selectedEnergy={filters.energyLevels}
        selectedVibes={filters.vibes}
        onEnergyChange={(levels) => {
          // Check if all levels in the group are selected
          const allSelected = levels.every(level => filters.energyLevels.includes(level));
          
          let newLevels;
          if (allSelected) {
            // Remove these levels
            newLevels = filters.energyLevels.filter(l => !levels.includes(l));
          } else {
            // Add these levels (remove any that are already there to avoid duplicates)
            newLevels = [...filters.energyLevels.filter(l => !levels.includes(l)), ...levels];
          }
          setFilters({ ...filters, energyLevels: newLevels });
        }}
        onVibeChange={(vibeId) => {
          const newVibes = filters.vibes.includes(vibeId)
            ? filters.vibes.filter(v => v !== vibeId)
            : [...filters.vibes, vibeId];
          setFilters({ ...filters, vibes: newVibes });
        }}
        onClearEnergyVibe={() => {
          setFilters({ ...filters, energyLevels: [], vibes: [] });
        }}
      />
      
      <div className="container mx-auto px-4 py-6">
        {/* Header with location and filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex flex-wrap items-center gap-2">
            {location.city && (
              <LocationBadge
                location={location}
                onLocationChange={updateLocation}
                onDetectLocation={detectLocation}
                onResetLocation={resetLocation}
              />
            )}
            <Badge variant="secondary" className="text-sm">
              {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''} found
            </Badge>
            {(filters.energyLevels.length > 0 || filters.vibes.length > 0 || filters.interests.length > 0) && (
              <Badge variant="default" className="text-sm">
                ⚡ {filters.energyLevels.length + filters.vibes.length + filters.interests.length} active {filters.energyLevels.length + filters.vibes.length + filters.interests.length === 1 ? 'filter' : 'filters'}
              </Badge>
            )}
            {dismissedEvents.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllDismissed}
                className="text-sm gap-2"
              >
                <Eye className="w-4 h-4" />
                Show {dismissedEvents.length} hidden
              </Button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <ViewToggle view={view} onViewChange={setView} />
            <FilterPanel 
              filters={filters} 
              onFiltersChange={setFilters}
              availablePriceRange={availablePriceRange}
              location={{ city: location.city, state: location.state }}
              onLocationChange={(city, state) => {
                updateLocation({
                  ...location,
                  city,
                  state,
                  status: 'detected'
                });
              }}
            />
          </div>
        </div>

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
        ) : view === "calendar" ? (
          <CalendarView
            events={filteredEvents}
            onEventClick={handleEventClick}
            onDismiss={handleDismissEvent}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
            {filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onClick={() => handleEventClick(event)}
                onDismiss={handleDismissEvent}
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

      {/* Footer Section */}
      <footer className="border-t border-border mt-16 py-8 bg-card/30">
        <div className="container mx-auto px-4 max-w-[600px] text-center">
          <h2 className="text-xl font-canela lowercase mb-4 text-foreground">
            About Smorg
          </h2>
          <p className="text-sm font-inter text-foreground/80 leading-relaxed mb-3">
            Smorg is a local discovery platform that helps you find experiences that match your vibe and energy level. Whether you want something calm, creative, or high energy, Smorg curates events that fit how you actually feel, not just what&apos;s trending.
          </p>
          <p className="text-sm font-inter text-foreground/80 leading-relaxed">
            The name comes from &quot;smorgasbord,&quot; a Swedish word for a spread of different tastes — we just made it digital (and skipped the meatballs).
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
