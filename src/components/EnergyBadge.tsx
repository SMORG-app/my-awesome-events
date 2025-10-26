import { Zap } from "lucide-react";

interface EnergyBadgeProps {
  energyLevel: number | null;
}

const EnergyBadge = ({ energyLevel }: EnergyBadgeProps) => {
  if (!energyLevel) return null;

  const getEnergyDisplay = (level: number) => {
    if (level <= 2) {
      return {
        iconCount: 1,
        label: 'effortless',
        bgColor: 'bg-mint-100',
        textColor: 'text-mint-700',
        borderColor: 'border-mint-300'
      };
    } else if (level <= 4) {
      return {
        iconCount: 2,
        label: 'a little prep',
        bgColor: 'bg-salmon-100',
        textColor: 'text-salmon-700',
        borderColor: 'border-salmon-300'
      };
    } else {
      return {
        iconCount: 3,
        label: 'all-in',
        bgColor: 'bg-mauve-100',
        textColor: 'text-mauve-700',
        borderColor: 'border-mauve-300'
      };
    }
  };

  const display = getEnergyDisplay(energyLevel);

  return (
    <div className={`
      inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
      ${display.bgColor} ${display.textColor} border ${display.borderColor}
      text-sm font-medium
    `}>
      <div className="flex gap-0.5">
        {[...Array(display.iconCount)].map((_, i) => (
          <Zap key={i} className="w-3.5 h-3.5" fill="currentColor" />
        ))}
      </div>
      <span>{display.label}</span>
    </div>
  );
};

export default EnergyBadge;
