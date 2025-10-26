import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { calculateDistance } from './useLocation';
import type { EventFilters } from '@/components/FilterPanel';
import type { UserLocation } from './useLocation';

export interface Event {
  id: string;
  title: string;
  description: string | null;
  date: string;
  end_date: string | null;
  venue_name: string | null;
  address: string | null;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  cost: number;
  cost_display: string;
  image_url: string | null;
  energy_level: number | null;
  event_types: string[];
  vibes: string[];
  distance?: number;
}

export const useEvents = (location: UserLocation, filters: EventFilters) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);

      let query = supabase
        .from('events')
        .select('*')
        .gte('date', new Date().toISOString())
        .order('date', { ascending: true });

      // Apply price range filter
      query = query
        .gte('cost', filters.priceRange[0])
        .lte('cost', filters.priceRange[1]);

      if (filters.energyLevels.length > 0) {
        query = query.in('energy_level', filters.energyLevels);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching events:', error);
        setEvents([]);
        setLoading(false);
        return;
      }

      // Client-side filtering for distance, interests, and vibes
      let filteredEvents = data || [];

      // Calculate distance and filter
      filteredEvents = filteredEvents
        .map(event => ({
          ...event,
          distance: calculateDistance(
            location.latitude,
            location.longitude,
            event.latitude,
            event.longitude
          )
        }))
        .filter(event => event.distance! <= filters.distance);

      // Filter by interests (event_types)
      if (filters.interests.length > 0) {
        filteredEvents = filteredEvents.filter(event =>
          event.event_types?.some(type => filters.interests.includes(type))
        );
      }

      // Filter by vibes
      if (filters.vibes.length > 0) {
        filteredEvents = filteredEvents.filter(event =>
          event.vibes?.some(vibe => filters.vibes.includes(vibe))
        );
      }

      setEvents(filteredEvents);
      setLoading(false);
    };

    if (location.status !== 'detecting') {
      fetchEvents();
    }
  }, [location, filters]);

  return { events, loading };
};
