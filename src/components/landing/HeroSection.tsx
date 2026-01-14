import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Truck, Warehouse, BarChart3 } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-hero-gradient">
      {/* Decorative grain texture overlay */}
      <div className="absolute inset-0 grain-texture pointer-events-none" />
      
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-secondary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute top-1/2 -left-20 w-60 h-60 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-20 right-1/4 w-40 h-40 bg-primary-foreground/5 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <div className="container relative z-10 px-4 py-20">
        <div className="max-w-5xl mx-auto text-center stagger-children">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 text-primary-foreground text-sm mb-8">
            <Shield className="w-4 h-4" />
            <span>Government of Himachal Pradesh Initiative</span>
          </div>

          {/* Main heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-primary-foreground mb-6 leading-tight">
            HIMFED Smart
            <span className="block text-gradient">Inventory & Godown</span>
            Control System
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-primary-foreground/80 max-w-3xl mx-auto mb-10 leading-relaxed">
            Bitdecentro's comprehensive digital solution for farmer-to-godown operations. 
            Real-time tracking, transparent procurement, and complete accountability 
            across all HIMFED operations.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button variant="hero" size="xl" className="w-full sm:w-auto">
              Access Dashboard
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button variant="hero-outline" size="xl" className="w-full sm:w-auto">
              View Demo
            </Button>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { icon: Warehouse, label: "Godowns Connected", value: "150+" },
              { icon: Truck, label: "Daily Transactions", value: "5,000+" },
              { icon: BarChart3, label: "Stock Visibility", value: "100%" },
              { icon: Shield, label: "Audit Compliance", value: "CAG Ready" },
            ].map((stat, index) => (
              <div 
                key={index}
                className="glass-effect rounded-xl p-4 text-center hover:bg-primary-foreground/15 transition-all duration-300 hover:-translate-y-1"
              >
                <stat.icon className="w-8 h-8 text-secondary mx-auto mb-2" />
                <div className="text-2xl md:text-3xl font-bold text-primary-foreground">{stat.value}</div>
                <div className="text-xs md:text-sm text-primary-foreground/70">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom wave decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <path 
            d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" 
            fill="hsl(45 30% 97%)"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
