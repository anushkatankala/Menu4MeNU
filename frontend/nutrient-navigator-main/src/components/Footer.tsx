import { Leaf, Mail, MapPin, Phone } from "lucide-react";
const Footer = () => {
  return <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <a href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <Leaf className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-display text-xl font-semibold text-foreground">Menu4MeNU</span>
            </a>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Your personal nutrition guide. Discover meals that perfectly match your health goals.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
            <div className="flex flex-col gap-4">
                <a
                  href="/recipes"
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                >
                  Recipes
                </a>
                <a
                  href="/favorites"
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                >
                  Favorites
                </a>
                <a
                  href="/nutrients"
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                >
                  Nutrients
                </a>
                <a
                  href="/#how-it-works"
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                >
                  How It Works
                </a>
              </div>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Resources</h4>
            <div className="flex flex-col gap-4">
                <a
                  href="/#footer"
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                >
                  Daily Blog
                </a>
                <a
                  href="/#footer"
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                >
                  About Us
                </a>
              </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Contact Us</h4>
            <ul className="space-y-3">
              
              <li className="flex items-center gap-2 text-muted-foreground text-sm">
                <Phone className="w-4 h-4" />
                +1 (555) 123-4567
              </li>
              <li className="flex items-start gap-2 text-muted-foreground text-sm">
                <MapPin className="w-4 h-4 mt-0.5" />
                123 Healthy Street<br />
                San Francisco, CA 94102
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;