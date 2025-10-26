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
  { id: 'networking', label: 'networking' },
  { id: 'chill', label: 'chill' },
  { id: 'party', label: 'party' },
  { id: 'music-concerts', label: 'music & concerts' },
  { id: 'sports', label: 'sports' },
  { id: 'arts-theater', label: 'arts & theater' },
  { id: 'food-drink', label: 'food & drink' },
  { id: 'outdoor-adventure', label: 'outdoor & adventure' },
  { id: 'classes-learning', label: 'classes & learning' },
  { id: 'tech-business', label: 'tech & business' },
  { id: 'health-wellness', label: 'health & wellness' },
  { id: 'dog-friendly', label: 'dog-friendly' },
  { id: 'spiritual', label: 'spiritual' },
  { id: 'mindful', label: 'mindful' },
  { id: 'active', label: 'active' },
  { id: 'cultural', label: 'cultural' },
  { id: 'creative', label: 'creative' },
  { id: 'crafting', label: 'crafting' }
];

const FilterPanel = ({ filters, onFiltersChange }: FilterPanelProps) => {
  const hasActiveFilters = 
    filters.maxPrice !== null ||
    filters.interests.length > 0;

  const toggleInterest = (interestId: string) => {
    const newInterests = filters.interests.includes(interestId)
      ? filters.interests.filter(i => i !== interestId)
      : [...filters.interests, interestId];
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
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">interests</h3>
          {filters.interests.length > 0 && (
            <span className="text-sm text-muted-foreground">
              {filters.interests.length} selected
            </span>
          )}
        </div>
        <div className="flex gap-3 flex-wrap max-h-[300px] overflow-y-auto">
          {INTERESTS.map(interest => {
            const isSelected = filters.interests.includes(interest.id);
            const hasAnySelection = filters.interests.length > 0;
            
            return (
              <button
                key={interest.id}
                onClick={() => toggleInterest(interest.id)}
                style={{
                  backgroundColor: isSelected ? '#6C3C65' : '#E8E2D8',
                  color: isSelected ? '#FCFBF9' : '#2A2A2A',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                  opacity: hasAnySelection && !isSelected ? 0.7 : 1
                }}
                className="cursor-pointer px-3 py-1.5 rounded-full font-medium text-[15px] transition-all duration-200 ease-in-out hover:scale-105 whitespace-nowrap"
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.backgroundColor = '#F4B6A0';
                    e.currentTarget.style.color = '#FCFBF9';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.backgroundColor = '#E8E2D8';
                    e.currentTarget.style.color = '#2A2A2A';
                  }
                }}
              >
                {interest.label}
              </button>
            );
          })}
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
              {(filters.maxPrice !== null ? 1 : 0) + filters.interests.length}
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
