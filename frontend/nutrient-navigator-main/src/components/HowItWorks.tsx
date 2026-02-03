import { MousePointerClick, Sparkles, Utensils } from "lucide-react";

const steps = [
  {
    icon: MousePointerClick,
    title: "Select Nutrients",
    description: "Choose the vitamins, minerals, or macros you want to focus on from our comprehensive list.",
  },
  {
    icon: Sparkles,
    title: "Algorithmic Matching",
    description: "Our smart algorithm analyzes thousands of meals to find the perfect nutrient-rich options for you.",
  },
  {
    icon: Utensils,
    title: "Enjoy Your Meals",
    description: "Get optimized meal recommendations with recipes, nutrition facts, and preparation tips.",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 sm:py-32 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-sage/20 rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-peach/20 rounded-full blur-3xl translate-y-1/2" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        <div className="text-center mb-16">
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Finding the right meals for your nutritional needs is as easy as 1-2-3.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            
            return (
              <div
                key={index}
                className="relative group animate-fade-up"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-[60%] w-full h-0.5 bg-gradient-to-r from-primary/50 to-transparent" />
                )}
                
                <div className="glass-card p-8 text-center h-full group-hover:shadow-card transition-shadow duration-300">
                  {/* Step number */}
                  <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-accent text-accent-foreground text-sm font-bold flex items-center justify-center shadow-soft">
                    {index + 1}
                  </div>
                  
                  {/* Icon */}
                  <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  
                  <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
