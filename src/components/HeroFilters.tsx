import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { X, Zap, Info } from "lucide-react";

interface HeroFiltersProps {
  selectedEnergy: number[];
  selectedVibes: string[];
  onEnergyChange: (levels: number[]) => void;
  onVibeChange: (vibeId: string) => void;
  onClearAll: () => void;
}

const ENERGY_COMMITMENTS = [
  {
    id: 'effortless',
    levels: [1, 2],
    iconCount: 1,
    label: 'effortless',
    tooltip: 'Minimal planning, low cost, nearby, easy to bail or attend spontaneously.',
    bgColor: 'bg-mint-500',
    borderColor: 'border-mint-500',
    textColor: 'text-mint-700',
    hoverBg: 'hover:bg-mint-500/80',
    selectedBg: 'bg-mint-500',
    selectedText: 'text-white',
    selectedBorder: 'border-mint-700'
  },
  {
    id: 'little-prep',
    levels: [3, 4],
    iconCount: 2,
    label: 'a little prep',
    tooltip: 'Requires light planning — tickets, transport, maybe a friend or outfit change.',
    bgColor: 'bg-salmon-500',
    borderColor: 'border-salmon-500',
    textColor: 'text-salmon-700',
    hoverBg: 'hover:bg-salmon-500/80',
    selectedBg: 'bg-salmon-500',
    selectedText: 'text-white',
    selectedBorder: 'border-salmon-700'
  },
  {
    id: 'all-in',
    levels: [5, 6],
    iconCount: 3,
    label: 'all-in',
    tooltip: 'More planning, cost, or social energy; multi-hour, dress-up, travel or parking involved.',
    bgColor: 'bg-mauve-500',
    borderColor: 'border-mauve-500',
    textColor: 'text-white',
    hoverBg: 'hover:bg-mauve-500/80',
    selectedBg: 'bg-mauve-500',
    selectedText: 'text-white',
    selectedBorder: 'border-mauve-700'
  }
];

const VIBES = [
  { id: 'family', label: 'family' },
  { id: 'date-night', label: 'date night' },
  { id: 'solo', label: 'solo' },
  { id: 'friends', label: 'friends' },
  { id: 'work', label: 'work' }
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
          what energy commitment do you want to make?
        </h2>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
          <TooltipProvider>
            {ENERGY_COMMITMENTS.map(commitment => {
              const isSelected = commitment.levels.some(level => selectedEnergy.includes(level));
              
              return (
                <Tooltip key={commitment.id}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => onEnergyChange(commitment.levels)}
                      className={`
                        flex-shrink-0 snap-start px-4 py-3 rounded-xl border-2 transition-all min-w-[140px]
                        ${isSelected
                          ? `${commitment.selectedBg} ${commitment.selectedText} ${commitment.selectedBorder} scale-105 shadow-lg` 
                          : `${commitment.bgColor} ${commitment.textColor} ${commitment.borderColor} ${commitment.hoverBg} opacity-90 hover:opacity-100`}
                      `}
                    >
                      <div className="flex gap-0.5 mb-1 justify-center">
                        {[...Array(commitment.iconCount)].map((_, i) => (
                          <Zap key={i} className="w-3.5 h-3.5" fill="currentColor" />
                        ))}
                      </div>
                      <div className="font-semibold text-base flex items-center justify-center gap-1">
                        {commitment.label}
                        <Info className="w-3 h-3 opacity-50" />
                      </div>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>{commitment.tooltip}</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </TooltipProvider>
        </div>
      </div>

      {/* Vibe Section */}
      <div>
        <h2 className="text-lg font-semibold mb-3">
          what's your vibe?
        </h2>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {VIBES.map(vibe => {
            const isSelected = selectedVibes.includes(vibe.id);
            const hasAnySelection = selectedVibes.length > 0;
            
            return (
              <button
                key={vibe.id}
                onClick={() => onVibeChange(vibe.id)}
                style={{
                  backgroundColor: isSelected ? '#6C3C65' : '#E8E2D8',
                  color: isSelected ? '#FCFBF9' : '#2A2A2A',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                  opacity: hasAnySelection && !isSelected ? 0.7 : 1
                }}
                className="cursor-pointer flex-shrink-0 px-3 py-1.5 rounded-full font-medium text-[15px] transition-all duration-200 ease-in-out hover:scale-105 whitespace-nowrap"
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.backgroundColor = '#F4B6A0';
                    e.currentTarget.style.color = '#FCFBF9';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.backgroundColor = '#E8E2D8';
                    e.currentTarget.style.color = '#2A2A2A';
                  }
                }}
              >
                {vibe.label}
              </button>
            );
          })}
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
