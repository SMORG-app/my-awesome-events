import { useState } from "react";
import Hero from "@/components/Hero";
import CategoryFilter from "@/components/CategoryFilter";
import EventCard, { Event } from "@/components/EventCard";
import EventModal from "@/components/EventModal";
import { mockEvents } from "@/data/mockEvents";

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categories = ["Music", "Technology", "Sports", "Arts", "Food"];

  const filteredEvents = mockEvents.filter((event) => {
    const matchesCategory = !selectedCategory || event.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Hero onSearch={setSearchQuery} />
      
      <div className="container mx-auto px-4 py-8">
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {filteredEvents.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-muted-foreground">No events found matching your criteria.</p>
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
