import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Clock, Users, Flame, Filter, ChevronDown, Heart } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getAllFoods, Food as ApiFood } from "@/services/api";

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

// Mock recipes as fallback (keep the original mock data as backup)
const mockRecipes: Recipe[] = [
  { id: 1, title: "Grilled Salmon with Quinoa", description: "Omega-3 rich salmon paired with protein-packed quinoa and seasonal vegetables.", image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop", prepTime: "25 min", servings: 2, calories: 450, nutrients: ["Protein", "Omega-3", "Iron"], category: "Dinner", url: "https://mollyshomeguide.com/delicious-grilled-salmon-with-quinoa-and-steamed-veggies-47026/" },
  { id: 2, title: "Spinach & Berry Smoothie Bowl", description: "Antioxidant-packed breakfast bowl with fresh berries and iron-rich spinach.", image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400&h=300&fit=crop", prepTime: "10 min", servings: 1, calories: 320, nutrients: ["Vitamin C", "Iron", "Fiber"], category: "Breakfast", url: "https://cookingwithcallie.com/berry-smoothie-bowl-a-delicious-nutritious-start-to-your-day/"},
  { id: 3, title: "Mediterranean Chickpea Salad", description: "Fiber-rich chickpeas with fresh vegetables and olive oil dressing.", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop", prepTime: "15 min", servings: 4, calories: 280, nutrients: ["Fiber", "Protein", "Vitamin A"], category: "Lunch",  url: "https://www.delish.com/cooking/recipe-ideas/a19885314/mediterranean-chickpea-salad-recipe/"},
];

const categories = ["All", "Breakfast", "Lunch", "Dinner", "Snack"];

interface RecipesProps {
  isDark: boolean;
  toggleDarkMode: () => void;
  favorites: number[];
  setFavorites: React.Dispatch<React.SetStateAction<number[]>>;
}

const Recipes = ({ isDark, toggleDarkMode, favorites, setFavorites }: RecipesProps) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useApiData, setUseApiData] = useState(true); // Toggle to switch between API and mock data

  // Fetch recipes from API on component mount
  useEffect(() => {
    const fetchRecipes = async () => {
      if (!useApiData) {
        // Use mock data
        setRecipes(mockRecipes);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        
        const foods = await getAllFoods();
        
        // Transform API Food data to Recipe format
        const transformedRecipes: Recipe[] = foods.map((food: ApiFood, index: number) => ({
          id: food.id,
          title: food.name,
          description: food.recommendations.join(". ") || "Delicious and nutritious meal",
          image: `https://images.unsplash.com/photo-${1467003909585 + index}?w=400&h=300&fit=crop`, // Placeholder images
          prepTime: "25 min", // Default value, you can enhance your DB to include this
          servings: 2, // Default value
          calories: 400, // Default value
          nutrients: [food.mainNutrition, ...(food.tags || [])].filter(Boolean),
          category: food.tags && food.tags.length > 0 ? 
            (food.tags.includes("breakfast") ? "Breakfast" :
             food.tags.includes("lunch") ? "Lunch" :
             food.tags.includes("dinner") ? "Dinner" :
             food.tags.includes("snack") ? "Snack" : "Dinner") : "Dinner",
          url: `/recipe/${food.id}` // Internal route instead of external URL
        }));

        setRecipes(transformedRecipes);
      } catch (err) {
        console.error("Failed to fetch recipes:", err);
        setError("Failed to load recipes from the server. Using mock data instead.");
        setRecipes(mockRecipes); // Fallback to mock data
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipes();
  }, [useApiData]);

  const filteredRecipes = recipes.filter((recipe) => {
    const matchesSearch =
      recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.nutrients.some((n) => n.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "All" || recipe.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleRecipeClick = (recipeId: number) => {
    navigate(`/recipe/${recipeId}`);
  };

  return (
    <main className="min-h-screen bg-background">
      <div id="tts-content">
        <Header isDark={isDark} toggleDarkMode={toggleDarkMode} />

        {/* Hero Section */}
        <section className="pt-28 pb-12 sm:pt-32 sm:pb-16 gradient-hero">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4 animate-fade-up">
                Our Recipe Collection
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground animate-fade-up" style={{ animationDelay: "0.1s" }}>
                Discover nutritious and delicious meals tailored to your dietary needs
              </p>
              
              {/* Data Source Toggle (for debugging/demo) */}
              <div className="mt-4 flex items-center justify-center gap-2">
                <span className="text-sm text-muted-foreground">Data source:</span>
                <button
                  onClick={() => setUseApiData(!useApiData)}
                  className="text-sm px-3 py-1 rounded-full bg-primary/10 text-primary hover:bg-primary/20"
                >
                  {useApiData ? "API" : "Mock Data"}
                </button>
              </div>
            </div>

            {/* Error Message */}
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
                    placeholder="Search recipes or nutrients..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-12 bg-card border-border rounded-full text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="h-12 px-6 rounded-full gap-2">
                  <Filter className="w-4 h-4" />
                  Filter
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
                <p className="text-muted-foreground text-lg">Loading recipes...</p>
              </div>
            </div>
          </section>
        )}

        {/* Recipes Grid */}
        {!isLoading && (
          <section className="py-12 sm:py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-8">
                <p className="text-muted-foreground">
                  Showing <span className="font-semibold text-foreground">{filteredRecipes.length}</span> recipes
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredRecipes.map((recipe, index) => (
                  <article
                    key={recipe.id}
                    className="group glass-card overflow-hidden hover:shadow-card transition-all duration-300 animate-fade-up cursor-pointer"
                    style={{ animationDelay: `${index * 0.05}s` }}
                    onClick={() => handleRecipeClick(recipe.id)}
                  >
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={recipe.image}
                        alt={recipe.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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
                          e.stopPropagation(); // Prevent card click
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
                        {recipe.nutrients.slice(0, 3).map((nutrient) => (
                          <span key={nutrient} className="text-xs px-2 py-1 rounded-full bg-mint text-forest font-medium">
                            {nutrient}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground pt-4 border-t border-border">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4" />
                          {recipe.prepTime}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Users className="w-4 h-4" />
                          {recipe.servings}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Flame className="w-4 h-4" />
                          {recipe.calories} cal
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {filteredRecipes.length === 0 && (
                <div className="text-center py-16">
                  <p className="text-muted-foreground text-lg">No recipes found matching your criteria.</p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("All");
                    }}
                  >
                    Clear filters
                  </Button>
                </div>
              )}
            </div>
          </section>
        )}
      </div>
      <Footer />
    </main>
  );
};

export default Recipes;