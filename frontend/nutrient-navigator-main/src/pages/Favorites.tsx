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

interface FavouritesProps {
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
  url: string;
}

const categories = ["All", "Breakfast", "Lunch", "Dinner", "Snack"];

export default function Favourites({ isDark, toggleDarkMode, favorites, setFavorites }: FavouritesProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch recipes with cached images like in recipes.tsx
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
              category: food.tags && food.tags.length > 0
                ? food.tags.includes("breakfast") ? "Breakfast"
                : food.tags.includes("lunch") ? "Lunch"
                : food.tags.includes("dinner") ? "Dinner"
                : food.tags.includes("snack") ? "Snack"
                : "Dinner"
                : "Dinner",
              url: `/recipe/${food.id}`,
            };
          })
        );

        setRecipes(transformedRecipes);
      } catch (err) {
        console.error("Failed to fetch recipes:", err);
        setError("Failed to load favorites from the server.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  // Filter only favorites + search + category
  const filteredFavorites = recipes
    .filter((recipe) => favorites.includes(recipe.id))
    .filter((recipe) => {
      const matchesSearch =
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.nutrients.some((n) => n.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === "All" || recipe.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

  const handleRecipeClick = (recipeId: number) => navigate(`/recipe/${recipeId}`);

  return (
    <main className="min-h-screen bg-background">
      <div id="tts-content">
        <Header isDark={isDark} toggleDarkMode={toggleDarkMode} />

        {/* Hero */}
        <section className="pt-28 pb-12 sm:pt-32 sm:pb-16 gradient-hero">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4 animate-fade-up">
              Your Favorite Meals
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground animate-fade-up" style={{ animationDelay: "0.1s" }}>
              Quickly access all the meals you've marked as favorites
            </p>

            {error && (
              <div className="mt-4 max-w-2xl mx-auto p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <p className="text-sm text-yellow-600 dark:text-yellow-400 text-center">{error}</p>
              </div>
            )}

            {/* Search & Filter */}
            <div className="mt-10 max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: "0.2s" }}>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search favorites..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-12 bg-card border-border rounded-full text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="h-12 px-6 rounded-full gap-2">
                  <Filter className="w-4 h-4" /> Filter
                  <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? "rotate-180" : ""}`} />
                </Button>
              </div>

              {showFilters && (
                <div className="mt-4 flex flex-wrap gap-2 justify-center animate-fade-in">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                        selectedCategory === category
                          ? "bg-primary text-primary-foreground shadow-soft"
                          : "bg-card border border-border text-foreground hover:border-primary"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Loading State */}
        {isLoading && (
          <section className="py-12 sm:py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <p className="text-muted-foreground text-lg">Loading favorites...</p>
              </div>
            </div>
          </section>
        )}

        {/* Favorites Grid */}
        {!isLoading && (
          <section className="py-12 sm:py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              {filteredFavorites.length > 0 && (
                <div className="mb-8">
                  <p className="text-muted-foreground">
                    You have <span className="font-semibold text-foreground">{filteredFavorites.length}</span> favorite {filteredFavorites.length === 1 ? 'recipe' : 'recipes'}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredFavorites.map((recipe, index) => (
                  <article
                    key={recipe.id}
                    className="group glass-card overflow-hidden hover:shadow-card transition-all duration-300 animate-fade-up cursor-pointer"
                    style={{ animationDelay: `${index * 0.05}s` }}
                    onClick={() => handleRecipeClick(recipe.id)}
                  >
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden bg-accent">
                      <img
                        src={recipe.image}
                        alt={recipe.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = `https://images.unsplash.com/photo-${1467003909585 + index}?w=400&h=300&fit=crop`;
                        }}
                      />
                      <Badge className="absolute top-3 left-3 bg-background/90 text-foreground backdrop-blur-sm">
                        {recipe.category}
                      </Badge>

                      {/* Heart icon */}
                      <Heart
                        className="w-6 h-6 absolute top-3 right-3 cursor-pointer transition-colors"
                        stroke={favorites.includes(recipe.id) ? "pink" : "white"}
                        fill={favorites.includes(recipe.id) ? "pink" : "none"}
                        onClick={(e) => {
                          e.stopPropagation();
                          
                          if (favorites.includes(recipe.id)) {
                            setFavorites(favorites.filter((id) => id !== recipe.id));
                          } else {
                            setFavorites([...favorites, recipe.id]);
                          }
                        }}
                      />
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h3 className="font-display text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-1">
                        {recipe.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{recipe.description}</p>
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {recipe.nutrients.slice(0, 3).map((nutrient, idx) => (
                          <span key={`${nutrient}-${idx}`} className="text-xs px-2 py-1 rounded-full bg-mint text-forest font-medium">
                            {nutrient}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground pt-4 border-t border-border">
                        <div className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{recipe.prepTime}</div>
                        <div className="flex items-center gap-1.5"><Users className="w-4 h-4" />{recipe.servings}</div>
                        <div className="flex items-center gap-1.5"><Flame className="w-4 h-4" />{recipe.calories} cal</div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {filteredFavorites.length === 0 && !isLoading && (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">💔</div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">No favorites yet</h3>
                  <p className="text-muted-foreground mb-6">
                    {favorites.length === 0
                      ? "Start adding recipes to your favorites by clicking the heart icon!"
                      : "No favorite recipes match your search criteria."}
                  </p>
                </div>
              )}
            </div>
          </section>
        )}
      </div>
      <Footer />
    </main>
  );
}
