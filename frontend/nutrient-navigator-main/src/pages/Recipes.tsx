import { useState, useEffect } from "react";
import { Search, Clock, Users, Flame, Filter, ChevronDown, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getAllRecipes } from "@/services/api";
import RecipeCard from "@/components/RecipeCard";


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

interface RecipesProps {
  isDark: boolean;
  toggleDarkMode: () => void;
  favorites: number[];
  setFavorites: React.Dispatch<React.SetStateAction<number[]>>;
}

const Recipes = ({ isDark, toggleDarkMode, favorites, setFavorites }: RecipesProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        const data = await getAllRecipes();
        console.log("Fetched recipes:", data); // Debug log to check API response
        setRecipes(data);
      } catch (err) {
        console.error("Error fetching recipes:", err); // Debug log for errors
        setError("Failed to fetch recipes. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  useEffect(() => {
    // Load favorites from localStorage on component mount
    const storedFavorites = localStorage.getItem("favorites");
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  useEffect(() => {
    // Reload favorites from localStorage when navigating back to this page
    const storedFavorites = localStorage.getItem("favorites");
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  useEffect(() => {
    // Save favorites to localStorage whenever they change
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const handleToggleFavorite = (id: number) => {
    if (favorites.includes(id)) {
      const updatedFavorites = favorites.filter((favId) => favId !== id);
      setFavorites(updatedFavorites);
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    } else {
      const updatedFavorites = [...favorites, id];
      setFavorites(updatedFavorites);
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    }
  };

  if (loading) {
    return <div>Loading recipes...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  console.log("Full API response:", recipes); // Log the full API response for debugging

  // Filter recipes by category and search query
  const filteredRecipes = recipes.filter((recipe) => {
    const matchesCategory =
      selectedCategory === "All" || recipe.category?.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = searchQuery
      ? recipe.title?.toLowerCase().includes(searchQuery.toLowerCase())
      : true; // Match all if searchQuery is empty
    return matchesCategory && matchesSearch;
  });

  console.log("Filtered recipes after applying filters:", filteredRecipes); // Log filtered recipes for debugging

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
            </div>

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

        {/* Recipes Grid */}
        <section className="py-12 sm:py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <p className="text-muted-foreground">
                Showing <span className="font-semibold text-foreground">{filteredRecipes.length}</span> recipes
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredRecipes.map((recipe, index) => (
                <Link to={`/recipes/${recipe.id}`} key={recipe.id}>
                  <RecipeCard
                    recipe={recipe}
                    isFavorite={favorites.includes(recipe.id)}
                    onToggleFavorite={handleToggleFavorite}
                  />
                </Link>
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
      </div>
      <Footer />
    </main>
  );
};

export default Recipes;
