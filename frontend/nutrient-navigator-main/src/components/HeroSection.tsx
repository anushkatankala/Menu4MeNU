import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
const HeroSection = () => {
  return <section className="relative min-h-screen gradient-hero overflow-hidden pt-20">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-sage/30 rounded-full blur-3xl animate-pulse-soft" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-peach/30 rounded-full blur-3xl animate-pulse-soft" style={{
      animationDelay: '1s'
    }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-mint/20 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-8 animate-fade-up" style={{
          animationDelay: '0.1s'
        }}>
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Smart Nutrition, Delicious Results</span>
          </div>

          {/* Main heading */}
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground max-w-4xl leading-tight animate-fade-up text-balance" style={{
          animationDelay: '0.2s'
        }}>
            Discover Meals That
            <span className="text-primary block mt-2">Nourish Your Body</span>
          </h1>

          {/* Subheading */}
          <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl animate-fade-up font-sans" style={{
          animationDelay: '0.3s'
        }}>
            Tell us what nutrients you need, and we'll recommend perfect meals tailored to your health goals. 
            Eating well has never been this simple.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-10 animate-fade-up" style={{
          animationDelay: '0.4s'
        }}>
            <a href="/favorites" className="px-6 py-3 rounded-full bg-accent text-foreground hover:bg-secondary/80 transition-all flex items-center gap-2">
              Find Your Meals
              <ArrowRight className="w-5 h-5" />
            </a>

            <a href="/#how-it-works">
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </a>

          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 sm:gap-16 mt-16 animate-fade-up" style={{
          animationDelay: '0.5s'
        }}>
            <div className="text-center">
              
              
            </div>
            <div className="text-center">
              
              
            </div>
            <div className="text-center">
              
              
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default HeroSection;