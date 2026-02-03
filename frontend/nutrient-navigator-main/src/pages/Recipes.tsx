import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Clock, Users, Flame, Filter, ChevronDown, Heart } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getAllFoods, Food as ApiFood } from "@/services/api";
import { getCachedRecipeImage } from "@/services/imageService";
import { supabase } from "@/lib/supabase";

interface RecipesProps {
  isDark: boolean;
  toggleDarkMode: () => void;
  favorites: number[];
  setFavorites: React.Dispatch<React.SetStateAction<number[]>>;
}

interface Recipe {
  id: number;
  title: string;
  description: string;
  image: string;
  prepTime: string;
  servings: number;
  calories: number;
  nutrients: string[];
  category: string;
}

const categories = ["All", "Breakfast", "Lunch", "Dinner", "Snack"];
const prepTimeOptions = [
  { label: "All", max: null },
  { label: "≤ 15 min", max: 15 },
  { label: "≤ 30 min", max: 30 },
  { label: "≤ 45 min", max: 45 },
  { label: "≤ 60 min", max: 60 },
];

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export default function Recipes({ isDark, toggleDarkMode, favorites, setFavorites }: RecipesProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPrepTime, setSelectedPrepTime] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const getPrepMinutes = (prepTime: string): number => {
    const match = prepTime.match(/\d+/);
    return match ? parseInt(match[0], 10) : Infinity;
  };

  // Fetch logged-in user
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error) console.error(error);
      setUserId(session?.user?.id || null);
    };
    fetchUser();
  }, []);

  // Fetch recipes and favorites
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const foods = await getAllFoods();

        const transformedRecipes: Recipe[] = await Promise.all(
          foods.map(async (food: ApiFood, index: number) => {
            const imageUrl = await getCachedRecipeImage(food.name, index);
            return {
              id: food.id,
              title: food.name,
              description: food.recommendations?.join(". ") || "Delicious and nutritious meal",
              image: imageUrl,
              prepTime: "25 min",
              servings: 2,
              calories: 400,
              nutrients: [food.mainNutrition, ...(food.tags || [])].filter(Boolean),
              category: food.tags?.includes("breakfast")
                ? "Breakfast"
                : food.tags?.includes("lunch")
                ? "Lunch"
                : food.tags?.includes("snack")
                ? "Snack"
                : "Dinner",
            };
          })
        );

        setRecipes(transformedRecipes);

        // Fetch favorites from backend if logged in
        if (userId) {
          const res = await fetch(`${API_BASE_URL}/api/users/${userId}/favorites`);
          if (res.ok) {
            const favIds: number[] = await res.json();
            setFavorites(favIds);
          } else {
            console.error("Failed to load favorites");
          }
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load recipes.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipes();
  }, [userId, setFavorites]);

  // Toggle favorite
  const handleFavoriteToggle = async (recipeId: number) => {
    if (!userId) {
      setFavorites(prev =>
        prev.includes(recipeId) ? prev.filter(id => id !== recipeId) : [...prev, recipeId]
      );
      return;
    }

    const method = favorites.includes(recipeId) ? "DELETE" : "POST";
    const res = await fetch(`${API_BASE_URL}/api/users/${userId}/favorites/${recipeId}`, { method });

    if (res.ok) {
      setFavorites(prev =>
        prev.includes(recipeId) ? prev.filter(id => id !== recipeId) : [...prev, recipeId]
      );
    } else {
      console.error("Failed to toggle favorite");
    }
  };

  // Filtered recipes
  const filteredRecipes = recipes.filter((recipe) => {
    const matchesSearch =
      recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.nutrients.some((n) => n.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "All" || recipe.category === selectedCategory;
    const prepMinutes = getPrepMinutes(recipe.prepTime);
    const matchesPrepTime = selectedPrepTime === null || prepMinutes <= selectedPrepTime;
    return matchesSearch && matchesCategory && matchesPrepTime;
  });

  return (
    <main className="min-h-screen bg-background">
      <div id="tts-content">
        <Header isDark={isDark} toggleDarkMode={toggleDarkMode} />

        {/* Hero */}
        <section className="pt-28 pb-12 gradient-hero">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold mb-4">Recipes</h1>
            <p className="text-muted-foreground">Browse meals and filter by prep time</p>

            {/* Search + Filter */}
            <div className="mt-8 max-w-2xl mx-auto">
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search recipes or nutrients..."
                    className="pl-12 h-12 rounded-full"
                  />
                </div>
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="h-12 rounded-full gap-2"
                >
                  <Filter className="w-4 h-4" />
                  Filters
                  <ChevronDown className={`w-4 h-4 ${showFilters ? "rotate-180" : ""}`} />
                </Button>
              </div>

              {showFilters && (
                <div className="mt-4 space-y-4">
                  {/* Category */}
                  <div className="flex flex-wrap gap-2 justify-center">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-4 py-2 rounded-full ${
                          selectedCategory === cat ? "bg-primary text-primary-foreground" : "border"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Prep time */}
                  <div className="flex flex-wrap gap-2 justify-center">
                    {prepTimeOptions.map((opt) => (
                      <button
                        key={opt.label}
                        onClick={() => setSelectedPrepTime(opt.max)}
                        className={`px-4 py-2 rounded-full ${
                          selectedPrepTime === opt.max ? "bg-secondary text-secondary-foreground" : "border"
                        }`}
                      >
                        <Clock className="inline w-4 h-4 mr-1" />
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Loading */}
        {isLoading && <div className="text-center py-20">Loading recipes...</div>}

        {/* Grid */}
        {!isLoading && (
          <section className="py-12">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredRecipes.map((recipe) => (
                  <article
                    key={recipe.id}
                    className="glass-card cursor-pointer"
                    onClick={() => navigate(`/recipe/${recipe.id}`)}
                  >
                    <div className="relative h-48">
                      <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover" />
                      <Badge className="absolute top-3 left-3">{recipe.category}</Badge>
                      <Heart
                        className="absolute top-3 right-3 w-6 h-6"
                        stroke={favorites.includes(recipe.id) ? "pink" : "white"}
                        fill={favorites.includes(recipe.id) ? "pink" : "none"}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFavoriteToggle(recipe.id);
                        }}
                      />
                    </div>

                    <div className="p-4">
                      <h3 className="font-semibold">{recipe.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{recipe.description}</p>
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        <span>
                          <Clock className="inline w-4 h-4 mr-1" />
                          {recipe.prepTime}
                        </span>
                        <span>
                          <Users className="inline w-4 h-4 mr-1" />
                          {recipe.servings}
                        </span>
                        <span>
                          <Flame className="inline w-4 h-4 mr-1" />
                          {recipe.calories}
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {filteredRecipes.length === 0 && (
                <div className="text-center py-16">No recipes match your filters.</div>
              )}
            </div>
          </section>
        )}
      </div>
      <Footer />
    </main>
  );
}
