-- Create events table with location-based features
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  
  -- Location fields
  venue_name TEXT,
  address TEXT,
  city TEXT NOT NULL DEFAULT 'Seattle',
  state TEXT NOT NULL DEFAULT 'WA',
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  
  -- Event details
  cost DECIMAL(10, 2) DEFAULT 0,
  cost_display TEXT DEFAULT 'Free',
  image_url TEXT,
  source_url TEXT,
  
  -- VibeScout specific fields
  energy_level INTEGER CHECK (energy_level >= 1 AND energy_level <= 5),
  event_types TEXT[] DEFAULT '{}',
  vibes TEXT[] DEFAULT '{}',
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Public read access for events (no auth required)
CREATE POLICY "Events are viewable by everyone"
  ON public.events
  FOR SELECT
  USING (true);

-- Create indexes for common queries
CREATE INDEX idx_events_location ON public.events (latitude, longitude);
CREATE INDEX idx_events_date ON public.events (date);
CREATE INDEX idx_events_city_state ON public.events (city, state);
CREATE INDEX idx_events_energy_level ON public.events (energy_level);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create saved_events table for authenticated users
CREATE TABLE public.saved_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  saved_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, event_id)
);

-- Enable RLS for saved events
ALTER TABLE public.saved_events ENABLE ROW LEVEL SECURITY;

-- Users can view their own saved events
CREATE POLICY "Users can view their own saved events"
  ON public.saved_events
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can save events
CREATE POLICY "Users can save events"
  ON public.saved_events
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can unsave events
CREATE POLICY "Users can delete their saved events"
  ON public.saved_events
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create user preferences table
CREATE TABLE public.user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  default_city TEXT DEFAULT 'Seattle',
  default_state TEXT DEFAULT 'WA',
  default_latitude DOUBLE PRECISION DEFAULT 47.6062,
  default_longitude DOUBLE PRECISION DEFAULT -122.3321,
  default_radius_miles INTEGER DEFAULT 25,
  preferred_energy_levels INTEGER[] DEFAULT '{}',
  preferred_event_types TEXT[] DEFAULT '{}',
  preferred_vibes TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for preferences
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own preferences"
  ON public.user_preferences
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences"
  ON public.user_preferences
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences"
  ON public.user_preferences
  FOR UPDATE
  USING (auth.uid() = user_id);