import { useState, useEffect, useCallback } from 'react';

export interface UserLocation {
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  status: 'detecting' | 'detected' | 'default' | 'ip-fallback';
  message?: string;
}

const DEFAULT_LOCATION: UserLocation = {
  city: 'Seattle',
  state: 'WA',
  latitude: 47.6062,
  longitude: -122.3321,
  status: 'default'
};

const STORAGE_KEY = 'smorgLocation';

// IP-based geolocation fallback
const getLocationFromIP = async (): Promise<Partial<UserLocation> | null> => {
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    
    if (data.city && data.region) {
      return {
        city: data.city,
        state: data.region_code || data.region,
        latitude: data.latitude || DEFAULT_LOCATION.latitude,
        longitude: data.longitude || DEFAULT_LOCATION.longitude,
        status: 'ip-fallback' as const,
        message: 'Approximate location set. You can edit it.'
      };
    }
  } catch (error) {
    console.error('IP geolocation error:', error);
  }
  return null;
};

export const useLocation = () => {
  const [location, setLocation] = useState<UserLocation>(() => {
    // Check localStorage first
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return DEFAULT_LOCATION;
      }
    }
    return { ...DEFAULT_LOCATION, status: 'detecting', message: 'detecting location…' };
  });

  const detectLocation = useCallback(async () => {
    setLocation(prev => ({ ...prev, status: 'detecting', message: 'detecting location…' }));

    if (!navigator.geolocation) {
      // Try IP fallback
      const ipLocation = await getLocationFromIP();
      if (ipLocation) {
        const newLocation = { ...DEFAULT_LOCATION, ...ipLocation };
        setLocation(newLocation);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newLocation));
      } else {
        const defaultWithMessage = { 
          ...DEFAULT_LOCATION, 
          message: 'Set your location for better results.' 
        };
        setLocation(defaultWithMessage);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultWithMessage));
      }
      return;
    }

    const timeoutId = setTimeout(async () => {
      // Timeout - try IP fallback
      const ipLocation = await getLocationFromIP();
      if (ipLocation) {
        const newLocation = { ...DEFAULT_LOCATION, ...ipLocation };
        setLocation(newLocation);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newLocation));
      } else {
        const defaultWithMessage = { 
          ...DEFAULT_LOCATION, 
          message: 'Set your location for better results.' 
        };
        setLocation(defaultWithMessage);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultWithMessage));
      }
    }, 3000);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        clearTimeout(timeoutId);
        const { latitude, longitude } = position.coords;
        
        try {
          // Reverse geocode using Nominatim (free, no API key needed)
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await response.json();
          
          const newLocation: UserLocation = {
            city: data.address?.city || data.address?.town || 'Seattle',
            state: data.address?.state || 'WA',
            latitude,
            longitude,
            status: 'detected'
          };
          
          setLocation(newLocation);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(newLocation));
        } catch (error) {
          console.error('Geocoding error:', error);
          const newLocation: UserLocation = {
            ...DEFAULT_LOCATION,
            latitude,
            longitude,
            status: 'detected'
          };
          setLocation(newLocation);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(newLocation));
        }
      },
      async (error) => {
        clearTimeout(timeoutId);
        console.error('Geolocation error:', error);
        
        // Try IP fallback
        const ipLocation = await getLocationFromIP();
        if (ipLocation) {
          const newLocation = { ...DEFAULT_LOCATION, ...ipLocation };
          setLocation(newLocation);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(newLocation));
        } else {
          const defaultWithMessage = { 
            ...DEFAULT_LOCATION, 
            message: 'Set your location for better results.' 
          };
          setLocation(defaultWithMessage);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultWithMessage));
        }
      },
      {
        timeout: 3000,
        enableHighAccuracy: false
      }
    );
  }, []);

  const updateLocation = useCallback((newLocation: UserLocation) => {
    setLocation(newLocation);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newLocation));
  }, []);

  const resetLocation = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    detectLocation();
  }, [detectLocation]);

  useEffect(() => {
    // Only detect if no stored location
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      detectLocation();
    }
  }, [detectLocation]);

  return { location, detectLocation, updateLocation, resetLocation };
};

// Calculate distance between two coordinates in miles using Haversine formula
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};
