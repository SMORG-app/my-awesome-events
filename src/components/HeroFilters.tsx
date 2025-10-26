import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { X, Info } from "lucide-react";

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
    icon: '☀️',
    label: 'effortless',
    description: 'minimal effort, just show up',
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
    icon: '☀️☀️',
    label: 'a little prep',
    description: 'some planning, moderate energy',
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
    icon: '☀️☀️☀️',
    label: 'all-in',
    description: 'full commitment, high energy',
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
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <span>☀️</span>
          What energy commitment do you want to make?
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
                        flex-shrink-0 snap-start px-6 py-4 rounded-xl border-2 transition-all min-w-[160px]
                        ${isSelected
                          ? `${commitment.selectedBg} ${commitment.selectedText} ${commitment.selectedBorder} scale-105 shadow-lg` 
                          : `${commitment.bgColor} ${commitment.textColor} ${commitment.borderColor} ${commitment.hoverBg} opacity-90 hover:opacity-100`}
                      `}
                    >
                      <div className="text-2xl mb-1">{commitment.icon}</div>
                      <div className="font-semibold text-lg flex items-center justify-center gap-1">
                        {commitment.label}
                        <Info className="w-3 h-3 opacity-50" />
                      </div>
                      <div className="text-xs opacity-90 mt-1">{commitment.description}</div>
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
