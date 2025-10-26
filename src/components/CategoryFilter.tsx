import { Badge } from "@/components/ui/badge";

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

const CategoryFilter = ({ categories, selectedCategory, onSelectCategory }: CategoryFilterProps) => {
  return (
    <div className="flex flex-wrap gap-2 justify-center py-8">
      <Badge
        variant={selectedCategory === null ? "default" : "outline"}
        className="cursor-pointer px-4 py-2 text-sm transition-all hover:scale-105"
        onClick={() => onSelectCategory(null)}
      >
        All Events
      </Badge>
      {categories.map((category) => (
        <Badge
          key={category}
          variant={selectedCategory === category ? "default" : "outline"}
          className="cursor-pointer px-4 py-2 text-sm transition-all hover:scale-105"
          onClick={() => onSelectCategory(category)}
        >
          {category}
        </Badge>
      ))}
    </div>
  );
};

export default CategoryFilter;
