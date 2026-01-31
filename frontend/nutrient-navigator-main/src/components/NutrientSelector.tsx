import { useState } from "react";
import { Search, Zap, Droplets, Flame, Beef, Apple, Fish, Sun, Heart } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

const nutrients = [
  { id: "protein", label: "Protein", icon: Beef, color: "text-coral" },
  { id: "fiber", label: "Fiber", icon: Apple, color: "text-primary" },
  { id: "omega3", label: "Omega-3", icon: Fish, color: "text-sage-dark" },
  { id: "vitaminD", label: "Vitamin D", icon: Sun, color: "text-accent" },
  { id: "iron", label: "Iron", icon: Zap, color: "text-coral-dark" },
  { id: "calcium", label: "Calcium", icon: Droplets, color: "text-primary" },
  { id: "vitaminC", label: "Vitamin C", icon: Flame, color: "text-accent" },
  { id: "antioxidants", label: "Antioxidants", icon: Heart, color: "text-coral" },
];

const NutrientSelector = () => {
  const [selectedNutrients, setSelectedNutrients] = useState<string[]>([]);

  const toggleNutrient = (id: string) => {
    setSelectedNutrients((prev) =>
      prev.includes(id)
        ? prev.filter((n) => n !== id)
        : [...prev, id]
    );
  };

  return (
    <section id="nutrients" className="py-20 sm:py-32 bg-background relative">
      <div className="absolute inset-0 bg-gradient-to-b from-mint/20 via-transparent to-transparent pointer-events-none" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            What Does Your Body Need?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Select the nutrients you want to focus on, and we'll suggest meals packed with exactly what you need.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Nutrient chips */}
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-10">
            {nutrients.map((nutrient, index) => {
              const Icon = nutrient.icon;
              const isSelected = selectedNutrients.includes(nutrient.id);
              
              return (
                <button
                  key={nutrient.id}
                  onClick={() => toggleNutrient(nutrient.id)}
                  className={cn(
                    "nutrient-chip flex items-center gap-2 animate-fade-up",
                    isSelected && "nutrient-chip-active"
                  )}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <Icon className={cn("w-4 h-4", isSelected ? "text-primary-foreground" : nutrient.color)} />
                  <span>{nutrient.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search/input area */}
          <div className="glass-card p-6 sm:p-8 shadow-card">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Or type a specific nutrient..."
                  className="w-full h-14 pl-12 pr-4 rounded-full bg-background border-2 border-border focus:border-primary focus:outline-none transition-colors text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <a
                href="/recipes"
                className="px-4 py-2 rounded-full bg-accent text-foreground hover:bg-secondary/80 transition-all mx-auto"
                style={{ paddingTop: '14px' }}
              >
                Get Recommendations
              </a>


            </div>

            {selectedNutrients.length > 0 && (
              <div className="mt-6 pt-6 border-t border-border">
                <p className="text-sm text-muted-foreground mb-3">Selected nutrients:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedNutrients.map((id) => {
                    const nutrient = nutrients.find((n) => n.id === id);
                    if (!nutrient) return null;
                    const Icon = nutrient.icon;
                    
                    return (
                      <span
                        key={id}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium"
                      >
                        <Icon className="w-3.5 h-3.5" />
                        {nutrient.label}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NutrientSelector;
