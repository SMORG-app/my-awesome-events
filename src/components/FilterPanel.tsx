import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
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
  priceRange: [number, number];
  interests: string[];
  energyLevels: number[];
  vibes: string[];
}

interface FilterPanelProps {
  filters: EventFilters;
  onFiltersChange: (filters: EventFilters) => void;
  availablePriceRange: [number, number];
  location: { city: string; state: string };
  onLocationChange: (city: string, state: string) => void;
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

const FilterPanel = ({ filters, onFiltersChange, availablePriceRange, location, onLocationChange }: FilterPanelProps) => {
  const [minPrice, maxPrice] = availablePriceRange;
  const [locationInput, setLocationInput] = useState(`${location.city}, ${location.state}`);
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const isPriceFiltered = filters.priceRange[0] !== minPrice || filters.priceRange[1] !== maxPrice;
  const hasActiveFilters = isPriceFiltered || filters.interests.length > 0;

  const toggleInterest = (interestId: string) => {
    const newInterests = filters.interests.includes(interestId)
      ? filters.interests.filter(i => i !== interestId)
      : [...filters.interests, interestId];
    onFiltersChange({ ...filters, interests: newInterests });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      distance: 25,
      priceRange: availablePriceRange,
      interests: [],
      energyLevels: [],
      vibes: []
    });
  };

  const handleLocationSubmit = () => {
    const parts = locationInput.split(',').map(p => p.trim());
    if (parts.length >= 2) {
      onLocationChange(parts[0], parts[1]);
      setIsEditingLocation(false);
    }
  };

  const FilterContent = () => (
    <div className="space-y-8 py-4">
      {/* Location Filter */}
      <div>
        <h3 className="font-semibold mb-3" style={{ color: '#2A2A2A', fontFamily: 'Inter', fontWeight: 500, fontSize: '15px' }}>
          location
        </h3>
        <div className="flex gap-2">
          <Input
            placeholder="City, State"
            value={locationInput}
            onChange={(e) => {
              setLocationInput(e.target.value);
              setIsEditingLocation(true);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleLocationSubmit();
              }
            }}
            onFocus={() => setIsEditingLocation(true)}
            onBlur={() => {
              // Don't reset on blur, only on successful submit
            }}
            style={{ fontFamily: 'Inter', fontSize: '14px' }}
          />
          <Button
            size="sm"
            onClick={handleLocationSubmit}
            variant="outline"
            onMouseDown={(e) => e.preventDefault()} // Prevent input blur when clicking button
          >
            Update
          </Button>
        </div>
      </div>

      {/* Distance Filter */}
      <div>
        <h3 className="font-semibold mb-3" style={{ color: '#2A2A2A', fontFamily: 'Inter', fontWeight: 500, fontSize: '15px' }}>
          distance from location: {filters.distance} miles
        </h3>
        <Slider
          value={[filters.distance]}
          onValueChange={([value]) => onFiltersChange({ ...filters, distance: value })}
          min={1}
          max={100}
          step={1}
          className="w-full"
        />
        <div className="flex justify-between text-xs mt-1" style={{ color: '#2A2A2A', fontFamily: 'Inter', fontWeight: 500, fontSize: '13px' }}>
          <span>1 mi</span>
          <span>100 mi</span>
        </div>
      </div>

      {/* Price Range Filter */}
      <div>
        <div className="mb-3">
          <h3 className="font-semibold" style={{ color: '#2A2A2A', fontFamily: 'Inter', fontWeight: 500, fontSize: '15px' }}>
            price range
          </h3>
          {minPrice === maxPrice && minPrice === 0 ? (
            <p className="text-sm mt-1" style={{ color: '#2A2A2A', fontFamily: 'Inter' }}>
              All events are free
            </p>
          ) : (
            <p className="text-sm mt-1" style={{ color: '#6C3C65', fontFamily: 'Inter', fontWeight: 500 }}>
              ${filters.priceRange[0]} – ${filters.priceRange[1]}
            </p>
          )}
        </div>
        {!(minPrice === maxPrice && minPrice === 0) && (
          <>
            <Slider
              value={filters.priceRange}
              onValueChange={(value) => onFiltersChange({ ...filters, priceRange: value as [number, number] })}
              min={minPrice}
              max={maxPrice}
              step={5}
              className="w-full"
              disabled={minPrice === maxPrice}
            />
            <div className="flex justify-between text-xs mt-1" style={{ color: '#2A2A2A', fontFamily: 'Inter', fontWeight: 500, fontSize: '13px' }}>
              <span>${minPrice}</span>
              <span>${maxPrice}</span>
            </div>
          </>
        )}
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
              {(isPriceFiltered ? 1 : 0) + filters.interests.length}
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
