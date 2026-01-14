import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Zap, HeartHandshake } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-60 h-60 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      <div className="container px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="p-10 md:p-16 rounded-3xl bg-gradient-to-br from-primary via-himfed-green-light to-primary text-primary-foreground text-center relative overflow-hidden shadow-glow">
            {/* Animated shimmer */}
            <div className="absolute inset-0 animate-shimmer opacity-20 pointer-events-none" />

            {/* Content */}
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 text-sm mb-6 backdrop-blur-sm">
                <Zap className="w-4 h-4 text-secondary" />
                <span>Ready for Deployment</span>
              </div>

              <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6">
                Transform HIMFED
                <span className="block text-secondary">Operations Today</span>
              </h2>

              <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto mb-10">
                Join the digital revolution. Our system is designed specifically for 
                HIMFED's unique requirements, ensuring complete compliance with 
                government standards and CAG audit requirements.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                <Button variant="hero" size="xl" className="w-full sm:w-auto">
                  Schedule Demo
                  <ArrowRight className="w-5 h-5" />
                </Button>
                <Button variant="hero-outline" size="xl" className="w-full sm:w-auto">
                  Contact Us
                </Button>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap items-center justify-center gap-6 pt-8 border-t border-primary-foreground/20">
                <div className="flex items-center gap-2 text-sm text-primary-foreground/80">
                  <Shield className="w-5 h-5" />
                  <span>Govt. Compliant</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-primary-foreground/80">
                  <HeartHandshake className="w-5 h-5" />
                  <span>24/7 Support</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-primary-foreground/80">
                  <Zap className="w-5 h-5" />
                  <span>Quick Deployment</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
