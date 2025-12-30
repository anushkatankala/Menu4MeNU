import { useState } from "react";
import { Search } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface NutrientsProps {
  isDark: boolean;
  toggleDarkMode: () => void;
}

interface Nutrient {
  key: string;
  name: string;
  value: number;
  unit: string;
  description?: string;
}

const USDA_API_KEY = import.meta.env.VITE_USDA_API_KEY;

const NUTRIENT_KEYWORDS: Record<string, string> = {
  protein: "Essential for building and repairing muscles, skin, and tissues.",
  fat: "Provides energy, supports cell growth, and helps absorb vitamins.",
  carbohydrate: "Primary energy source for the body and brain.",
  fiber: "Improves digestion, helps control blood sugar, and supports gut health.",
  calcium: "Critical for strong bones, teeth, and muscle contraction.",
  iron: "Helps transport oxygen in the blood and prevents fatigue.",
  potassium: "Supports heart function, muscles, and fluid balance.",
  sodium: "Regulates fluid balance and nerve function (limit intake).",
  magnesium: "Supports muscle and nerve function and energy production.",
  zinc: "Supports immune system and wound healing.",
  "vitamin a": "Supports vision, immune function, and reproduction.",
  "vitamin c": "Boosts immune function and supports skin and wound healing.",
  "vitamin d": "Helps absorb calcium and supports immune health.",
  "vitamin e": "Acts as an antioxidant and protects cells from damage.",
  "vitamin k": "Essential for blood clotting and bone health.",
  thiamin: "Supports energy metabolism and nerve function.",
  riboflavin: "Important for energy production and cellular function.",
  niacin: "Supports metabolism and nervous system health.",
  folate: "Essential for DNA synthesis and cell growth.",
  cholesterol: "A fat needed for hormone production, but limit intake.",
  sugar: "Simple carbohydrates that provide quick energy.",
};

export default function Nutrients({ isDark, toggleDarkMode }: NutrientsProps) {
  const [query, setQuery] = useState("");
  const [nutrients, setNutrients] = useState<Nutrient[]>([]);
  const [calories, setCalories] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    setNutrients([]);
    setCalories(null);

    try {
      const res = await fetch(
        `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${USDA_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query, pageSize: 1 }),
        }
      );
      const data = await res.json();

      if (!data.foods || data.foods.length === 0) {
        setError("No food found with that name. Please try a different search.");
        setLoading(false);
        return;
      }

      const food = data.foods[0];

      const caloriesValue =
        food.foodNutrients.find((n: any) => {
          const name = (n.nutrientName || "").toLowerCase();
          const unit = (n.unitName || "").toLowerCase();
          return (name.includes("energy") || name.includes("calories")) && unit === "kcal";
        })?.value ?? 0;

      setCalories(caloriesValue);

      const extracted: Nutrient[] = food.foodNutrients
        .filter((n: any) => {
          const name = (n.nutrientName || "").toLowerCase();
          const unit = (n.unitName || "").toLowerCase();
          return !(name.includes("energy") && unit === "kcal");
        })
        .map((n: any) => {
          const nameLower = (n.nutrientName || "").toLowerCase();
          let description: string | undefined;
          for (const key of Object.keys(NUTRIENT_KEYWORDS)) {
            if (nameLower.includes(key)) {
              description = NUTRIENT_KEYWORDS[key];
              break;
            }
          }
          return {
            key: nameLower.replace(/\s+/g, "_"),
            name: n.nutrientName.split(",")[0],
            value: n.value ?? 0,
            unit: n.unitName,
            description,
          };
        });

      setNutrients(extracted);
    } catch (err) {
      console.error(err);
      setError("Error fetching nutrient data.");
    } finally {
      setLoading(false);
    }
  };

  return (

      <main className="min-h-screen bg-background">
        <div id="tts-content">
          <Header isDark={isDark} toggleDarkMode={toggleDarkMode} />

          {/* Hero */}
          <section className="pt-28 pb-12 sm:pt-32 sm:pb-16 gradient-hero">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4 animate-fade-up">
                Find Nutrients in Foods
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground animate-fade-up" style={{ animationDelay: "0.1s" }}>
                Search for any food to see its nutrient information
              </p>

              {/* Search */}
              <div className="mt-10 max-w-2xl mx-auto flex gap-2 animate-fade-up" style={{ animationDelay: "0.2s" }}>
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Type a food (e.g., broccoli)"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    className="pl-12 h-12 bg-card border-border rounded-full text-foreground placeholder:text-muted-foreground w-full"
                  />
                </div>
                <Button onClick={handleSearch} className="h-12 px-6 rounded-full">
                  Search
                </Button>
              </div>

              {loading && <p className="text-muted-foreground mt-2">Loading...</p>}
              {error && <p className="text-red-500 mt-2">{error}</p>}
            </div>
          </section>

          {/* Nutrients Grid */}
          <section className="py-12 sm:py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              {calories !== null && (
                <div className="group glass-card p-6 rounded-xl shadow mb-6 max-w-sm mx-auto animate-fade-up">
                  <h3 className="font-semibold text-xl mb-2">Calories</h3>
                  <p className="text-sm">Energy per 100g: {calories} kcal</p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
                {nutrients.map((n, index) => (
                  <div
                    key={`${n.key}-${index}`}
                    className="group glass-card p-6 rounded-xl shadow hover:shadow-lg transition cursor-pointer animate-fade-up"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <h3 className="font-semibold text-xl mb-2">{n.name}</h3>
                    {n.description && <p className="text-sm text-muted-foreground mb-2">{n.description}</p>}
                    <p className="text-sm">
                      <strong>Amount (per 100g):</strong> {n.value} {n.unit}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
        <Footer />
      </main>
  );
}
