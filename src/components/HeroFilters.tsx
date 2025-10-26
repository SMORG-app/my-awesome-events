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
    tooltip: 'Minimal planning, low cost, nearby, easy to bail or attend spontaneously.'
  },
  { 
    level: 2, 
    label: 'A Little Prep',
    tooltip: 'Requires light planning — tickets, transport, maybe a friend or outfit change.'
  },
  { 
    level: 3, 
    label: 'All-In',
    tooltip: 'More planning, cost, or social energy; multi-hour, dress-up, travel or parking involved.'
  }
];

const VIBES = [
  { id: 'date-night', emoji: '💕', label: 'Date Night' },
  { id: 'family-kids', emoji: '👨‍👩‍👧‍👦', label: 'Family Time' },
  { id: 'friends-night', emoji: '🎉', label: 'Friends Night' },
  { id: 'solo-adventure', emoji: '👤', label: 'Solo Adventure' },
  { id: 'learning-new', emoji: '🎓', label: 'Learn & Grow' },
  { id: 'relaxing-wellness', emoji: '🧘', label: 'Wellness' },
  { id: 'seasonal-holiday', emoji: '🎄', label: 'Seasonal' },
  { id: 'creative-artsy', emoji: '🎨', label: 'Creative' }
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
    <div className="space-y-6">
      {/* Energy Commitment Section */}
      <div>
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <span>⚡</span>
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
                      ${selectedEnergy.includes(energy.level)
                        ? 'bg-primary text-primary-foreground border-primary scale-105 shadow-lg'
                        : 'bg-card border-border hover:border-primary/50 hover:bg-accent'}
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
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <span>✨</span>
          What's your vibe?
        </h2>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
          {VIBES.map(vibe => (
            <Badge
              key={vibe.id}
              variant={selectedVibes.includes(vibe.id) ? "default" : "outline"}
              className="cursor-pointer flex-shrink-0 snap-start px-4 py-2 text-base transition-all hover:scale-105"
              onClick={() => onVibeChange(vibe.id)}
            >
              <span className="mr-2">{vibe.emoji}</span>
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
