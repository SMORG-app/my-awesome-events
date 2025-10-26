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
  return (
    <section className="relative overflow-hidden bg-background py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-6">
          {/* Option 1: Wordmark with Gradient O */}
          <div className="mb-6">
            <h1 className="text-5xl md:text-6xl font-canela font-normal uppercase flex justify-center items-center" style={{ letterSpacing: '0.08em', color: '#6C3C65' }}>
              <span>SM</span>
              <span 
                className="inline-block"
                style={{
                  background: 'linear-gradient(180deg, #CDE2D0 0%, #F4B6A0 50%, #6C3C65 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                O
              </span>
              <span>RG</span>
            </h1>
          </div>

          {/* Option 3: Circular Symbol + Wordmark */}
          <div className="mb-6 flex justify-center items-center gap-3">
            {/* Gradient Circle Symbol */}
            <div 
              className="w-8 h-8 md:w-10 md:h-10 rounded-full"
              style={{
                background: 'linear-gradient(135deg, #CDE2D0 0%, #F4B6A0 50%, #6C3C65 100%)'
              }}
            />
            {/* Wordmark */}
            <h2 
              className="text-3xl md:text-4xl font-inter font-medium uppercase"
              style={{ letterSpacing: '0.08em', color: '#2A2A2A' }}
            >
              SMORG
            </h2>
          </div>

          <h2 className="mb-4 text-3xl md:text-4xl font-bold text-foreground">
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
