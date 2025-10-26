import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface HeroProps {
  onSearch: (query: string) => void;
}

const Hero = ({ onSearch }: HeroProps) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 to-background py-20 px-4">
      <div className="container mx-auto max-w-4xl text-center">
        <div className="mb-8 flex justify-center">
          <div className="inline-flex items-center gap-3 rounded-xl border-2 border-primary/20 bg-card px-8 py-4 shadow-lg">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-blue-500" />
            <span className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
              VibeScout
            </span>
          </div>
        </div>
        <h1 className="mb-6 text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
          Discover Events That Match Your Interests
        </h1>
        <p className="mb-8 text-xl text-muted-foreground">
          Stop browsing countless websites. Find all the events you care about in one place.
        </p>
        <div className="relative mx-auto max-w-2xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search events, artists, venues..."
            className="h-14 pl-12 text-lg border-2 focus-visible:ring-primary"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
