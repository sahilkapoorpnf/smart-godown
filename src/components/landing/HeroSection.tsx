import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Truck, Warehouse, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img src={heroBg} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
      </div>

      {/* Animated accents */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-20 -left-20 w-72 h-72 bg-secondary/15 rounded-full blur-[100px] animate-float" style={{ animationDelay: "1.5s" }} />
      </div>

      <div className="container relative z-10 px-4 pt-28 pb-20">
        <div className="max-w-5xl mx-auto text-center stagger-children">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white text-sm mb-8">
            <Shield className="w-4 h-4 text-secondary" />
            <span>Government of Himachal Pradesh Initiative</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-6 leading-[1.1]">
            HIMFED Smart
            <span className="block text-gradient">Inventory & Godown</span>
            Control System
          </h1>

          {/* Subtitle */}
          <p className="text-base md:text-xl text-white/75 max-w-3xl mx-auto mb-10 leading-relaxed">
            Comprehensive digital solution for farmer-to-godown operations.
            Real-time tracking, transparent procurement, and complete accountability
            across all HIMFED operations.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link to="/dashboard">
              <Button variant="hero" size="xl" className="w-full sm:w-auto">
                Access Dashboard
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <a href="#stock-checker">
              <Button variant="hero-outline" size="xl" className="w-full sm:w-auto">
                Check Stock Availability
              </Button>
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              { icon: Warehouse, label: "Godowns Connected", value: "150+" },
              { icon: Truck, label: "Daily Transactions", value: "5,000+" },
              { icon: BarChart3, label: "Stock Visibility", value: "100%" },
              { icon: Shield, label: "Audit Compliance", value: "CAG Ready" },
            ].map((stat, i) => (
              <div
                key={i}
                className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 p-5 text-center hover:bg-white/15 transition-all duration-300 hover:-translate-y-1"
              >
                <stat.icon className="w-7 h-7 text-secondary mx-auto mb-2" />
                <div className="text-2xl md:text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-xs md:text-sm text-white/60">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom curve */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <path
            d="M0 80L60 68C120 56 240 32 360 24C480 16 600 24 720 28C840 32 960 32 1080 36C1200 40 1320 48 1380 52L1440 56V80H0Z"
            fill="hsl(45 30% 97%)"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
