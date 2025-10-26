import { Grid, Calendar } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

type ViewType = "grid" | "calendar";

interface ViewToggleProps {
  view: ViewType;
  onViewChange: (view: ViewType) => void;
}

const ViewToggle = ({ view, onViewChange }: ViewToggleProps) => {
  return (
    <ToggleGroup
      type="single"
      value={view}
      onValueChange={(value) => value && onViewChange(value as ViewType)}
      className="bg-muted/50 p-1 rounded-lg"
    >
      <ToggleGroupItem
        value="grid"
        aria-label="Grid view"
        className="data-[state=on]:bg-background data-[state=on]:shadow-sm"
      >
        <Grid className="h-4 w-4" />
        <span className="ml-2 hidden sm:inline">Grid</span>
      </ToggleGroupItem>
      <ToggleGroupItem
        value="calendar"
        aria-label="Calendar view"
        className="data-[state=on]:bg-background data-[state=on]:shadow-sm"
      >
        <Calendar className="h-4 w-4" />
        <span className="ml-2 hidden sm:inline">Calendar</span>
      </ToggleGroupItem>
    </ToggleGroup>
  );
};

export default ViewToggle;
