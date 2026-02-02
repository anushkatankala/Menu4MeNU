import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Clock, 
  Users, 
  Flame, 
  Heart, 
  ChefHat, 
  Lightbulb,
  Printer,
  Share2,
  BookmarkPlus,
  CheckCircle2
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getFoodById, Food as ApiFood } from "@/services/api";

interface RecipeDetailProps {
  isDark: boolean;
  toggleDarkMode: () => void;
  favorites: number[];
  setFavorites: React.Dispatch<React.SetStateAction<number[]>>;
}

const RecipeDetail = ({ isDark, toggleDarkMode, favorites, setFavorites }: RecipeDetailProps) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [recipe, setRecipe] = useState<ApiFood | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  useEffect(() => {
    const fetchRecipe = async () => {
      if (!id) {
        setError("No recipe ID provided");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const data = await getFoodById(parseInt(id));
        setRecipe(data);
      } catch (err) {
        console.error("Failed to fetch recipe:", err);
        setError("Failed to load recipe details. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  const toggleFavorite = () => {
    if (!recipe) return;
    
    if (favorites.includes(recipe.id)) {
      setFavorites(favorites.filter((favId) => favId !== recipe.id));
    } else {
      setFavorites([...favorites, recipe.id]);
    }
  };

  const toggleStep = (stepIndex: number) => {
    if (completedSteps.includes(stepIndex)) {
      setCompletedSteps(completedSteps.filter(i => i !== stepIndex));
    } else {
      setCompletedSteps([...completedSteps, stepIndex]);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: recipe?.name,
          text: `Check out this recipe: ${recipe?.name}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const isFavorited = recipe ? favorites.includes(recipe.id) : false;

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background">
        <div id="tts-content">
          <Header isDark={isDark} toggleDarkMode={toggleDarkMode} />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="text-muted-foreground text-lg mt-4">Loading recipe...</p>
            </div>
          </div>
          <Footer />
        </div>
      </main>
    );
  }

  if (error || !recipe) {
    return (
      <main className="min-h-screen bg-background">
        <div id="tts-content">
          <Header isDark={isDark} toggleDarkMode={toggleDarkMode} />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
            <div className="text-center max-w-md mx-auto">
              <div className="text-6xl mb-4">😕</div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Recipe Not Found</h2>
              <p className="text-muted-foreground mb-6">{error || "We couldn't find this recipe."}</p>
              <Button onClick={() => navigate("/recipes")} className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Recipes
              </Button>
            </div>
          </div>
          <Footer />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div id="tts-content">
        <Header isDark={isDark} toggleDarkMode={toggleDarkMode} />

        {/* Breadcrumb & Actions */}
        <section className="pt-28 pb-4 sm:pt-32 border-b border-border">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <button 
                  onClick={() => navigate("/")}
                  className="hover:text-primary transition-colors"
                >
                  Home
                </button>
                <span>/</span>
                <button 
                  onClick={() => navigate("/recipes")}
                  className="hover:text-primary transition-colors"
                >
                  Recipes
                </button>
                <span>/</span>
                <span className="text-foreground font-medium line-clamp-1">{recipe.name}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handlePrint}
                  className="gap-2"
                >
                  <Printer className="w-4 h-4" />
                  <span className="hidden sm:inline">Print</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleShare}
                  className="gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Share</span>
                </Button>
                <Button 
                  variant={isFavorited ? "default" : "outline"}
                  size="sm" 
                  onClick={toggleFavorite}
                  className="gap-2"
                >
                  <Heart 
                    className="w-4 h-4" 
                    fill={isFavorited ? "currentColor" : "none"}
                  />
                  <span className="hidden sm:inline">{isFavorited ? "Saved" : "Save"}</span>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Recipe Header */}
        <section className="py-8 sm:py-12 bg-gradient-to-b from-accent/30 to-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              {/* Title */}
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4 animate-fade-up">
                {recipe.name}
              </h1>

              {/* Description (from recommendations) */}
              {recipe.recommendations && recipe.recommendations.length > 0 && (
                <p className="text-lg sm:text-xl text-muted-foreground mb-6 animate-fade-up" style={{ animationDelay: "0.1s" }}>
                  {recipe.recommendations[0]}
                </p>
              )}

              {/* Tags */}
              <div className="flex flex-wrap items-center justify-center gap-2 mb-8 animate-fade-up" style={{ animationDelay: "0.2s" }}>
                <Badge className="bg-primary text-primary-foreground text-sm px-4 py-1.5">
                  {recipe.mainNutrition}
                </Badge>
                {recipe.tags.map((tag) => (
                  <Badge 
                    key={tag} 
                    variant="outline"
                    className="text-sm px-4 py-1.5"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Quick Stats */}
              <div className="inline-flex flex-wrap items-center gap-6 p-6 rounded-2xl bg-card border border-border shadow-soft animate-fade-up" style={{ animationDelay: "0.3s" }}>
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-muted-foreground">Prep Time</p>
                    <p className="font-semibold text-foreground">25 min</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-muted-foreground">Servings</p>
                    <p className="font-semibold text-foreground">2 servings</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Flame className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-muted-foreground">Calories</p>
                    <p className="font-semibold text-foreground">400 cal</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Hero Image */}
        <section className="py-0">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <div className="relative h-[300px] sm:h-[400px] lg:h-[500px] rounded-2xl overflow-hidden shadow-card animate-fade-up">
                <img
                  src={`https://images.unsplash.com/photo-${1467003909585 + recipe.id}?w=1200&h=800&fit=crop`}
                  alt={recipe.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12 sm:py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left Column - Ingredients & Nutrition */}
                <div className="lg:col-span-1 space-y-6">
                  
                  {/* Ingredients Card */}
                  <div className="glass-card p-6 sticky top-24">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <ChefHat className="w-6 h-6 text-primary" />
                      </div>
                      <h2 className="font-display text-2xl font-bold text-foreground">
                        Ingredients
                      </h2>
                    </div>
                    
                    {recipe.ingredients && recipe.ingredients.length > 0 ? (
                      <ul className="space-y-3">
                        {recipe.ingredients.map((ingredient, index) => (
                          <li
                            key={index}
                            className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors group"
                          >
                            <div className="w-5 h-5 rounded-full border-2 border-primary flex-shrink-0 mt-0.5 group-hover:bg-primary/10 transition-colors" />
                            <span className="text-foreground">{ingredient}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted-foreground italic">No ingredients listed</p>
                    )}

                    {/* Nutrition Highlight */}
                    <div className="mt-6 pt-6 border-t border-border">
                      <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                        <Flame className="w-4 h-4 text-primary" />
                        Main Nutrition
                      </h3>
                      <div className="p-4 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                        <p className="text-2xl font-bold text-primary">{recipe.mainNutrition}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Instructions & Tips */}
                <div className="lg:col-span-2 space-y-8">
                  
                  {/* Instructions */}
                  <div className="glass-card p-6 sm:p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <BookmarkPlus className="w-6 h-6 text-primary" />
                      </div>
                      <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
                        Instructions
                      </h2>
                    </div>

                    {recipe.recipes && recipe.recipes.length > 0 ? (
                      <ol className="space-y-6">
                        {recipe.recipes.map((step, index) => (
                          <li 
                            key={index} 
                            className="flex gap-4 group"
                          >
                            <button
                              onClick={() => toggleStep(index)}
                              className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                                completedSteps.includes(index)
                                  ? "bg-primary text-primary-foreground scale-110"
                                  : "bg-accent text-muted-foreground group-hover:bg-primary/20"
                              }`}
                            >
                              {completedSteps.includes(index) ? (
                                <CheckCircle2 className="w-5 h-5" />
                              ) : (
                                index + 1
                              )}
                            </button>
                            <div className="flex-1 pt-1.5">
                              <p className={`text-foreground leading-relaxed transition-all ${
                                completedSteps.includes(index) ? "line-through opacity-60" : ""
                              }`}>
                                {step}
                              </p>
                            </div>
                          </li>
                        ))}
                      </ol>
                    ) : (
                      <p className="text-muted-foreground italic">No instructions available</p>
                    )}
                  </div>

                  {/* Tips & Recommendations */}
                  {recipe.recommendations && recipe.recommendations.length > 1 && (
                    <div className="glass-card p-6 sm:p-8">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Lightbulb className="w-6 h-6 text-primary" />
                        </div>
                        <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
                          Tips & Recommendations
                        </h2>
                      </div>

                      <div className="space-y-4">
                        {recipe.recommendations.slice(1).map((tip, index) => (
                          <div
                            key={index}
                            className="p-4 rounded-lg bg-gradient-to-r from-accent/50 to-accent/30 border-l-4 border-primary"
                          >
                            <p className="text-foreground leading-relaxed">{tip}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Additional Tags/Categories */}
                  {recipe.tags && recipe.tags.length > 0 && (
                    <div className="glass-card p-6">
                      <h3 className="font-semibold text-foreground mb-4">Recipe Categories</h3>
                      <div className="flex flex-wrap gap-2">
                        {recipe.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-4 py-2 rounded-full bg-mint text-forest font-medium text-sm hover:bg-mint/80 transition-colors cursor-pointer"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Back to Recipes Button */}
              <div className="mt-12 text-center">
                <Button 
                  onClick={() => navigate("/recipes")} 
                  variant="outline"
                  size="lg"
                  className="gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to All Recipes
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
};

export default RecipeDetail;