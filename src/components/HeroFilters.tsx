import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { X, ChevronDown, ChevronUp } from "lucide-react";

interface HeroFiltersProps {
  selectedEnergy: number[];
  selectedVibes: string[];
  onEnergyChange: (level: number) => void;
  onVibeChange: (vibeId: string) => void;
  onClearAll: () => void;
}

const ENERGY_LEVELS = [
  { level: 1, emoji: '😴', label: 'Chill', desc: 'Relaxed, sitting' },
  { level: 2, emoji: '🚶', label: 'Easy', desc: 'Light activity' },
  { level: 3, emoji: '🏃', label: 'Moderate', desc: 'Participating' },
  { level: 4, emoji: '💪', label: 'Active', desc: 'High energy' },
  { level: 5, emoji: '🔥', label: 'Intense', desc: 'Maximum effort' }
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
  const [isOpen, setIsOpen] = useState(false);
  const hasSelections = selectedEnergy.length > 0 || selectedVibes.length > 0;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
      <div className="flex items-center justify-center mb-4">
        <CollapsibleTrigger asChild>
          <Button 
            variant="outline" 
            className="gap-2 px-6 py-3 text-base"
          >
            {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            {isOpen ? "Hide Filters" : "Show Filters"}
            {hasSelections && (
              <Badge variant="default" className="ml-2">
                {selectedEnergy.length + selectedVibes.length}
              </Badge>
            )}
          </Button>
        </CollapsibleTrigger>
      </div>
      
      <CollapsibleContent className="space-y-8">
      {/* Energy Commitment Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <span>⚡</span>
          How much energy do you have today?
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {ENERGY_LEVELS.map(energy => (
            <button
              key={energy.level}
              onClick={() => onEnergyChange(energy.level)}
              className={`
                px-4 py-3 rounded-xl border-2 transition-all text-center
                ${selectedEnergy.includes(energy.level)
                  ? 'bg-primary text-primary-foreground border-primary scale-105 shadow-lg'
                  : 'bg-card border-border hover:border-primary/50 hover:bg-accent'}
              `}
            >
              <div className="text-2xl mb-1">{energy.emoji}</div>
              <div className="font-semibold text-sm">{energy.label}</div>
              <div className="text-xs opacity-70">{energy.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Vibe Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <span>✨</span>
          What's your vibe?
        </h2>
        <div className="flex flex-wrap gap-3">
          {VIBES.map(vibe => (
            <Badge
              key={vibe.id}
              variant={selectedVibes.includes(vibe.id) ? "default" : "outline"}
              className="cursor-pointer px-4 py-2 text-base transition-all hover:scale-105"
              onClick={() => onVibeChange(vibe.id)}
            >
              <span className="mr-2">{vibe.emoji}</span>
              <span>{vibe.label}</span>
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
            >
              <X className="w-4 h-4" />
              Clear Energy & Vibe Selections
            </Button>
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
};

export default HeroFilters;
