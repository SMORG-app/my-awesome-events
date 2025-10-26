import { Calendar, MapPin, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  category: string;
  image: string;
  description: string;
}

interface EventCardProps {
  event: Event;
  onClick: () => void;
}

const EventCard = ({ event, onClick }: EventCardProps) => {
  return (
    <Card 
      className="overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group"
      onClick={onClick}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <Badge className="absolute top-4 right-4 bg-primary/90 backdrop-blur-sm">
          {event.category}
        </Badge>
      </div>
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold mb-3 line-clamp-2">{event.title}</h3>
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{event.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventCard;
