import { Calendar, MapPin, Clock, X, Ticket } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ShareButton from "./ShareButton";
import EnergyBadge from "./EnergyBadge";
import { useState } from "react";

export interface Event {
  id: string;
  title: string;
  date: string;
  venue_name: string | null;
  city: string;
  state: string;
  cost_display: string;
  image_url: string | null;
  energy_level: number | null;
  vibes: string[];
  distance?: number;
}

interface EventCardProps {
  event: Event;
  onClick: () => void;
  onDismiss?: (eventId: string) => void;
}

const EventCard = ({ event, onClick, onDismiss }: EventCardProps) => {
  const [isDismissing, setIsDismissing] = useState(false);

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDismissing(true);
    setTimeout(() => {
      onDismiss?.(event.id);
    }, 300);
  };

  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  });
  const formattedTime = eventDate.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit'
  });

  return (
    <Card 
      className={`
        overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group relative
        ${isDismissing ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}
      `}
      onClick={onClick}
    >
      {/* Dismiss Button */}
      {onDismiss && (
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDismiss}
          className="absolute top-2 right-2 z-20 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white opacity-0 group-hover:opacity-100 transition-opacity"
          title="Not interested"
        >
          <X className="w-4 h-4" />
        </Button>
      )}
      <div className="relative h-48 overflow-hidden">
        <img
          src={event.image_url || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800'}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <ShareButton 
          eventId={event.id} 
          eventTitle={event.title}
          eventDate={event.date}
        />
        <div className="absolute top-4 left-4">
          <div 
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-inter font-medium text-sm"
            style={{
              backgroundColor: '#E8E2D8',
              color: '#2A2A2A',
              border: '1px solid rgba(0,0,0,0.1)',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
            }}
          >
            <Ticket className="w-3.5 h-3.5" style={{ color: '#B2AFA8' }} />
            <span>{event.cost_display}</span>
          </div>
        </div>
      </div>
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold mb-3 line-clamp-2">{event.title}</h3>
        
        {/* Energy Badge */}
        <div className="mb-3">
          <EnergyBadge energyLevel={event.energy_level} />
        </div>

        <div className="space-y-2 text-sm text-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{formattedTime}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span className="line-clamp-1">
              {event.venue_name || `${event.city}, ${event.state}`}
              {event.distance && ` • ${event.distance.toFixed(1)} mi`}
            </span>
          </div>
        </div>
        {event.vibes.length > 0 && (
          <div className="mt-3 flex gap-1 flex-wrap">
            {event.vibes.slice(0, 2).map(vibe => (
              <Badge key={vibe} variant="outline" className="text-xs">
                {vibe.replace(/-/g, ' ')}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EventCard;
