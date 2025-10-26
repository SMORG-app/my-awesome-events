import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export interface EventFilters {
  distance: number;
  maxPrice: number | null;
  interests: string[];
  energyLevels: number[];
  vibes: string[];
}

interface FilterPanelProps {
  filters: EventFilters;
  onFiltersChange: (filters: EventFilters) => void;
}

const INTERESTS = [
  'Music & Concerts',
  'Sports',
  'Arts & Theater',
  'Food & Drink',
  'Outdoor & Adventure',
  'Classes & Learning',
  'Tech & Business',
  'Health & Wellness'
];

const FilterPanel = ({ filters, onFiltersChange }: FilterPanelProps) => {
  const hasActiveFilters = 
    filters.maxPrice !== null ||
    filters.interests.length > 0;

  const toggleInterest = (interest: string) => {
    const newInterests = filters.interests.includes(interest)
      ? filters.interests.filter(i => i !== interest)
      : [...filters.interests, interest];
    onFiltersChange({ ...filters, interests: newInterests });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      distance: 25,
      maxPrice: null,
      interests: [],
      energyLevels: [],
      vibes: []
    });
  };

  const FilterContent = () => (
    <div className="space-y-8 py-4">
      {/* Distance Filter */}
      <div>
        <h3 className="font-semibold mb-3">Distance: {filters.distance} miles</h3>
        <Slider
          value={[filters.distance]}
          onValueChange={([value]) => onFiltersChange({ ...filters, distance: value })}
          min={1}
          max={100}
          step={1}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>1 mi</span>
          <span>100 mi</span>
        </div>
      </div>

      {/* Price Filter */}
      <div>
        <h3 className="font-semibold mb-3">Max Price</h3>
        <div className="flex gap-2 flex-wrap">
          <Badge
            variant={filters.maxPrice === 0 ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => onFiltersChange({ ...filters, maxPrice: filters.maxPrice === 0 ? null : 0 })}
          >
            Free
          </Badge>
          {[25, 50, 100].map(price => (
            <Badge
              key={price}
              variant={filters.maxPrice === price ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => onFiltersChange({ ...filters, maxPrice: filters.maxPrice === price ? null : price })}
            >
              Under ${price}
            </Badge>
          ))}
        </div>
      </div>

      {/* Interest Topics */}
      <div>
        <h3 className="font-semibold mb-3">Interests</h3>
        <div className="flex gap-2 flex-wrap">
          {INTERESTS.map(interest => (
            <Badge
              key={interest}
              variant={filters.interests.includes(interest) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => toggleInterest(interest)}
            >
              {interest}
            </Badge>
          ))}
        </div>
      </div>

      {hasActiveFilters && (
        <Button
          variant="outline"
          onClick={clearAllFilters}
          className="w-full"
        >
          <X className="w-4 h-4 mr-2" />
          Clear All Filters
        </Button>
      )}
    </div>
  );

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="relative">
          Filters
          {hasActiveFilters && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground rounded-full text-xs flex items-center justify-center">
              {filters.interests.length}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Filter Events</SheetTitle>
        </SheetHeader>
        <FilterContent />
      </SheetContent>
    </Sheet>
  );
};

export default FilterPanel;
