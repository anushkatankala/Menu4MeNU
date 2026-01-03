import { ArrowRight } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-20 sm:py-32 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-sage/20 to-peach/20" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6 animate-fade-up">
            Ready to Transform
            <span className="text-primary block">Your Nutrition?</span>
          </h2>

          <p
            className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-fade-up"
            style={{ animationDelay: "0.1s" }}
          >
            Join thousands of health-conscious food lovers who have discovered the perfect balance of taste and nutrition.
          </p>

          {/* Centered Button */}
          <div className="animate-fade-up" style={{ animationDelay: "0.2s" }}>
            <a
              href="/recipes"
              className="inline-flex px-6 py-3 rounded-full bg-accent text-foreground hover:bg-secondary/80 transition-all items-center gap-2"
            >
              Start Your Journey
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
