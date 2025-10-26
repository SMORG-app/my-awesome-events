import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { X, Info } from "lucide-react";

interface HeroFiltersProps {
  selectedEnergy: number[];
  selectedVibes: string[];
  onEnergyChange: (level: number) => void;
  onVibeChange: (vibeId: string) => void;
  onClearAll: () => void;
}

const ENERGY_LEVELS = [
  { 
    level: 1, 
    label: 'Effortless',
    tooltip: 'Minimal planning, low cost, nearby, easy to bail or attend spontaneously.',
    color: 'bg-[#CDE2D0] border-[#CDE2D0] hover:bg-[#CDE2D0]/80'
  },
  { 
    level: 2, 
    label: 'A Little Prep',
    tooltip: 'Requires light planning — tickets, transport, maybe a friend or outfit change.',
    color: 'bg-[#F4B6A0] border-[#F4B6A0] hover:bg-[#F4B6A0]/80'
  },
  { 
    level: 3, 
    label: 'All-In',
    tooltip: 'More planning, cost, or social energy; multi-hour, dress-up, travel or parking involved.',
    color: 'bg-[#6C3C65] border-[#6C3C65] text-white hover:bg-[#6C3C65]/80'
  }
];

const VIBES = [
  { id: 'family-friendly', label: 'family-friendly' },
  { id: 'date-night', label: 'date night' },
  { id: 'solo-time', label: 'solo time' },
  { id: 'friends-outing', label: 'friends outing' },
  { id: 'work-networking', label: 'work / networking' },
  { id: 'chill-low-key', label: 'chill / low-key' },
  { id: 'high-energy-party', label: 'high energy / party' },
  { id: 'thoughtful-intellectual', label: 'thoughtful / intellectual' },
  { id: 'rejuvenating-wellness', label: 'rejuvenating / wellness' },
  { id: 'intimate-niche', label: 'intimate / niche' },
  { id: 'dog-friendly', label: 'dog-friendly' },
  { id: 'spiritual-mindful', label: 'spiritual / mindful' }
];

const HeroFilters = ({ 
  selectedEnergy, 
  selectedVibes, 
  onEnergyChange, 
  onVibeChange,
  onClearAll 
}: HeroFiltersProps) => {
  const hasSelections = selectedEnergy.length > 0 || selectedVibes.length > 0;

  return (
    <div className="space-y-4">
      {/* Energy Commitment Section */}
      <div>
        <h2 className="text-lg font-semibold mb-3">
          How much energy do you have today?
        </h2>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
          <TooltipProvider>
            {ENERGY_LEVELS.map(energy => (
              <Tooltip key={energy.level}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => onEnergyChange(energy.level)}
                    className={`
                      flex-shrink-0 snap-start px-6 py-3 rounded-xl border-2 transition-all text-center min-w-[140px] relative
                      ${energy.color}
                      ${selectedEnergy.includes(energy.level)
                        ? 'scale-105 shadow-lg ring-2 ring-offset-2 ring-foreground'
                        : 'opacity-80 hover:opacity-100'}
                    `}
                  >
                    <div className="font-semibold flex items-center justify-center gap-1">
                      {energy.label}
                      <Info className="w-3 h-3 opacity-50" />
                    </div>
                  </button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>{energy.tooltip}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
        </div>
      </div>

      {/* Vibe Section */}
      <div>
        <h2 className="text-lg font-semibold mb-3">
          what's your vibe?
        </h2>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
          {VIBES.map(vibe => (
            <Badge
              key={vibe.id}
              variant={selectedVibes.includes(vibe.id) ? "default" : "outline"}
              className="cursor-pointer flex-shrink-0 snap-start px-4 py-2 text-base transition-all hover:scale-105"
              onClick={() => onVibeChange(vibe.id)}
            >
              <span className="whitespace-nowrap">{vibe.label}</span>
            </Badge>
          ))}
        </div>
      </div>

      {/* Clear Button */}
      {hasSelections && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={onClearAll}
            className="gap-2"
            size="sm"
          >
            <X className="w-4 h-4" />
            Clear Selections
          </Button>
        </div>
      )}
    </div>
  );
};

export default HeroFilters;
