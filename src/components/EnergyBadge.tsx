interface EnergyBadgeProps {
  energyLevel: number | null;
}

const EnergyBadge = ({ energyLevel }: EnergyBadgeProps) => {
  if (!energyLevel) return null;

  const getEnergyDisplay = (level: number) => {
    if (level <= 2) {
      return {
        icon: '☀️',
        label: 'effortless',
        bgColor: 'bg-mint-100',
        textColor: 'text-mint-700',
        borderColor: 'border-mint-300'
      };
    } else if (level <= 4) {
      return {
        icon: '☀️☀️',
        label: 'a little prep',
        bgColor: 'bg-salmon-100',
        textColor: 'text-salmon-700',
        borderColor: 'border-salmon-300'
      };
    } else {
      return {
        icon: '☀️☀️☀️',
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
      <span className="text-base">{display.icon}</span>
      <span>{display.label}</span>
    </div>
  );
};

export default EnergyBadge;
