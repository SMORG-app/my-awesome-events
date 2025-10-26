import { Calendar, MapPin, Clock, Battery } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Event } from "@/hooks/useEvents";

interface EventModalProps {
  event: Event | null;
  open: boolean;
  onClose: () => void;
}

const EventModal = ({ event, open, onClose }: EventModalProps) => {
  if (!event) return null;

  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString('en-US', { 
    weekday: 'long',
    month: 'long', 
    day: 'numeric',
    year: 'numeric'
  });
  const formattedTime = eventDate.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit'
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{event.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="relative h-64 rounded-lg overflow-hidden">
            <img
              src={event.image_url || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800'}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4 flex gap-2">
              {event.energy_level && (
                <Badge className="bg-primary/90 backdrop-blur-sm flex items-center gap-1">
                  <Battery className="w-3 h-3" />
                  Energy Level {event.energy_level}
                </Badge>
              )}
              <Badge className="bg-primary/90 backdrop-blur-sm">
                {event.cost_display}
              </Badge>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-foreground">
              <Calendar className="w-5 h-5 text-primary" />
              <span className="font-medium">{formattedDate}</span>
            </div>
            <div className="flex items-center gap-3 text-foreground">
              <Clock className="w-5 h-5 text-primary" />
              <span className="font-medium">{formattedTime}</span>
            </div>
            <div className="flex items-center gap-3 text-foreground">
              <MapPin className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium">{event.venue_name || `${event.city}, ${event.state}`}</p>
                {event.address && <p className="text-sm text-muted-foreground">{event.address}</p>}
                {event.distance && (
                  <p className="text-sm text-muted-foreground">{event.distance.toFixed(1)} miles away</p>
                )}
              </div>
            </div>
          </div>

          {event.vibes.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Perfect For</h3>
              <div className="flex gap-2 flex-wrap">
                {event.vibes.map(vibe => (
                  <Badge key={vibe} variant="secondary">
                    {vibe.replace(/-/g, ' ')}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {event.description && (
            <div>
              <h3 className="text-lg font-semibold mb-2">About this event</h3>
              <p className="text-muted-foreground leading-relaxed">{event.description}</p>
            </div>
          )}

          <Button className="w-full" size="lg">
            Get Tickets
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventModal;
