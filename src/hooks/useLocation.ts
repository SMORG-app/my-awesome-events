import { useState, useEffect } from 'react';

export interface UserLocation {
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  status: 'detecting' | 'detected' | 'default';
}

const DEFAULT_LOCATION: UserLocation = {
  city: 'Seattle',
  state: 'WA',
  latitude: 47.6062,
  longitude: -122.3321,
  status: 'default'
};

export const useLocation = () => {
  const [location, setLocation] = useState<UserLocation>(DEFAULT_LOCATION);

  useEffect(() => {
    setLocation(prev => ({ ...prev, status: 'detecting' }));

    if (!navigator.geolocation) {
      setLocation(prev => ({ ...prev, status: 'default' }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Reverse geocode using Nominatim (free, no API key needed)
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await response.json();
          
          setLocation({
            city: data.address?.city || data.address?.town || 'Seattle',
            state: data.address?.state || 'WA',
            latitude,
            longitude,
            status: 'detected'
          });
        } catch (error) {
          console.error('Geocoding error:', error);
          setLocation({
            ...DEFAULT_LOCATION,
            latitude,
            longitude,
            status: 'detected'
          });
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        setLocation(prev => ({ ...prev, status: 'default' }));
      }
    );
  }, []);

  return location;
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
