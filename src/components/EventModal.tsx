import { Calendar, MapPin, Clock, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Event } from "./EventCard";

interface EventModalProps {
  event: Event | null;
  open: boolean;
  onClose: () => void;
}

const EventModal = ({ event, open, onClose }: EventModalProps) => {
  if (!event) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{event.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="relative h-64 rounded-lg overflow-hidden">
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <Badge className="absolute top-4 right-4 bg-primary">
              {event.category}
            </Badge>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-foreground">
              <Calendar className="w-5 h-5 text-primary" />
              <span className="font-medium">{event.date}</span>
            </div>
            <div className="flex items-center gap-3 text-foreground">
              <Clock className="w-5 h-5 text-primary" />
              <span className="font-medium">{event.time}</span>
            </div>
            <div className="flex items-center gap-3 text-foreground">
              <MapPin className="w-5 h-5 text-primary" />
              <span className="font-medium">{event.location}</span>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">About this event</h3>
            <p className="text-muted-foreground leading-relaxed">{event.description}</p>
          </div>

          <Button className="w-full" size="lg">
            Get Tickets
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventModal;
