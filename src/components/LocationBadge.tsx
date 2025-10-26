import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { MapPin, X, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { UserLocation } from "@/hooks/useLocation";

interface LocationBadgeProps {
  location: UserLocation;
  onLocationChange: (location: UserLocation) => void;
  onDetectLocation: () => void;
  onResetLocation: () => void;
}

const LocationBadge = ({ 
  location, 
  onLocationChange, 
  onDetectLocation,
  onResetLocation 
}: LocationBadgeProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setInputValue(`${location.city}, ${location.state}`);
    }
  }, [isOpen, location]);

  useEffect(() => {
    if (location.message && location.status !== 'detecting') {
      setShowMessage(true);
      const timer = setTimeout(() => setShowMessage(false), 5000);
      return () => clearTimeout(timer);
    } else if (location.message && location.status === 'detecting') {
      setShowMessage(true);
    } else {
      setShowMessage(false);
    }
  }, [location.message, location.status]);

  const handleLocationSubmit = async () => {
    if (!inputValue.trim()) return;
    
    setIsLoading(true);
    
    try {
      // Try to geocode the input
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(inputValue)}&format=json&limit=1&countrycodes=us`
      );
      const data = await response.json();
      
      if (data && data[0]) {
        const result = data[0];
        const address = result.address || {};
        
        onLocationChange({
          city: address.city || address.town || result.display_name.split(',')[0],
          state: address.state || 'Unknown',
          latitude: parseFloat(result.lat),
          longitude: parseFloat(result.lon),
          status: 'detected'
        });
        
        setIsOpen(false);
      } else {
        // If geocoding fails, try to parse as "City, State"
        const parts = inputValue.split(',').map(p => p.trim());
        if (parts.length >= 2) {
          onLocationChange({
            ...location,
            city: parts[0],
            state: parts[1],
            status: 'detected'
          });
          setIsOpen(false);
        }
      }
    } catch (error) {
      console.error('Location lookup error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLocationSubmit();
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Badge 
            variant="outline" 
            className="text-sm cursor-pointer hover:bg-accent transition-colors"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                setIsOpen(true);
              }
            }}
          >
            <MapPin className="w-3 h-3 mr-1" />
            {location.city}, {location.state}
          </Badge>
        </PopoverTrigger>
        <PopoverContent 
          className="w-80" 
          align="start"
          onOpenAutoFocus={(e) => {
            e.preventDefault();
            setTimeout(() => {
              const el = document.getElementById('location-input') as HTMLInputElement | null;
              el?.focus();
              el?.select();
            }, 0);
          }}
          onInteractOutside={(e) => {
            // Keep popover open while editing; user can close via X or clicking badge again
            e.preventDefault();
          }}
        >
          <div className="space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="space-y-2">
              <label 
                htmlFor="location-input" 
                className="text-sm font-medium"
                style={{ fontFamily: 'Inter', fontSize: '15px', color: '#2A2A2A' }}
              >
                Set location
              </label>
              <Input
                id="location-input"
                placeholder="City, State or ZIP"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onClick={(e) => e.stopPropagation()}
                onFocus={(e) => e.stopPropagation()}
                disabled={isLoading}
                autoFocus
              />
            </div>
            
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleLocationSubmit}
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? 'Updating...' : 'Update'}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  onDetectLocation();
                  setIsOpen(false);
                }}
                disabled={isLoading}
              >
                <Navigation className="w-4 h-4 mr-1" />
                Use my location
              </Button>
            </div>

            <div className="flex justify-between items-center pt-2 border-t">
              <button
                onClick={() => {
                  onResetLocation();
                  setIsOpen(false);
                }}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                disabled={isLoading}
              >
                Reset location
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      
      {showMessage && location.message && location.status === 'detecting' && (
        <span 
          className="text-xs animate-pulse"
          style={{ fontFamily: 'Inter', color: '#6C3C65' }}
        >
          {location.message}
        </span>
      )}
      
      {showMessage && location.message && location.status !== 'detecting' && (
        <span 
          className="text-xs"
          style={{ fontFamily: 'Inter', color: '#2A2A2A', opacity: 0.7 }}
        >
          {location.message}
        </span>
      )}
    </div>
  );
};

export default LocationBadge;
