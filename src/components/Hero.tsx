import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import HeroFilters from "./HeroFilters";

interface HeroProps {
  onSearch: (query: string) => void;
  selectedEnergy: number[];
  selectedVibes: string[];
  onEnergyChange: (level: number) => void;
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
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 to-background py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="mb-6 flex justify-center">
            <div className="inline-flex items-center gap-3 rounded-xl border-2 border-primary/20 bg-card px-8 py-4 shadow-lg">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-blue-500" />
              <span className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
                Smorg
              </span>
            </div>
          </div>
          <h1 className="mb-4 text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
            Find Your Perfect Event
          </h1>
          <p className="mb-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            Match events to your energy level and vibe
          </p>
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
