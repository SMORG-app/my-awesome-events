import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import HeroFilters from "./HeroFilters";

interface HeroProps {
  onSearch: (query: string) => void;
  selectedEnergy: number[];
  selectedVibes: string[];
  onEnergyChange: (levels: number[]) => void;
  onVibeChange: (vibeId: string) => void;
  onClearEnergyVibe: () => void;
}

const Hero = ({ 
  onSearch, 
  selectedEnergy, 
  selectedVibes,
  onEnergyChange, 
  onVibeChange,
  onClearEnergyVibe 
}: HeroProps) => {
  // Determine O color based on energy commitment
  const getOColor = () => {
    if (selectedEnergy.length === 0) {
      // Default gradient when no selection
      return {
        background: 'linear-gradient(180deg, #CDE2D0 0%, #F4B6A0 50%, #6C3C65 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
      };
    }
    
    // Check which commitment level is selected
    const hasLowEnergy = selectedEnergy.some(level => [1, 2].includes(level));
    const hasMediumEnergy = selectedEnergy.some(level => [3, 4].includes(level));
    const hasHighEnergy = selectedEnergy.some(level => [5, 6].includes(level));
    
    if (hasLowEnergy) {
      return { color: '#CDE2D0' }; // Sage Mist
    } else if (hasMediumEnergy) {
      return { color: '#F4B6A0' }; // Coral Peach
    } else if (hasHighEnergy) {
      return { color: '#6C3C65' }; // Plum Wine
    }
    
    // Fallback to gradient
    return {
      background: 'linear-gradient(180deg, #CDE2D0 0%, #F4B6A0 50%, #6C3C65 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    };
  };

  return (
    <section className="relative overflow-hidden bg-background py-6 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-5">
          {/* Logo */}
          <div className="mb-4">
            <h1 className="text-5xl md:text-6xl font-canela font-normal uppercase flex justify-center items-center" style={{ letterSpacing: '0.08em', color: '#6C3C65' }}>
              <span>SM</span>
              <span 
                className="inline-block"
                style={{
                  ...getOColor(),
                  transition: 'all 0.3s ease-in-out'
                }}
              >
                O
              </span>
              <span>RG</span>
            </h1>
          </div>

          <h2 className="mb-3 text-3xl md:text-4xl font-bold text-foreground">
            pick your vibe. match your energy commitment.
          </h2>
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              type="text"
              placeholder="Search events..."
              className="pl-12 py-6 text-lg"
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Energy & Vibe Filters */}
        <HeroFilters
          selectedEnergy={selectedEnergy}
          selectedVibes={selectedVibes}
          onEnergyChange={onEnergyChange}
          onVibeChange={onVibeChange}
          onClearAll={onClearEnergyVibe}
        />
      </div>
    </section>
  );
};

export default Hero;
