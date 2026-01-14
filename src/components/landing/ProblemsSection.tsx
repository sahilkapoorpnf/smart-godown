import { AlertTriangle, Package, FileText, Clock, Fuel, Apple, Eye } from "lucide-react";

const problems = [
  {
    icon: Package,
    problem: "Fertilizer Shortages",
    impact: "Farmers angry, political pressure",
    color: "text-himfed-danger",
    bgColor: "bg-himfed-danger/10",
  },
  {
    icon: Package,
    problem: "Stock Mismanagement",
    impact: "Godowns empty or overstocked",
    color: "text-himfed-warning",
    bgColor: "bg-himfed-warning/10",
  },
  {
    icon: FileText,
    problem: "Manual Records",
    impact: "No real-time visibility",
    color: "text-himfed-info",
    bgColor: "bg-himfed-info/10",
  },
  {
    icon: Clock,
    problem: "Delayed Farmer Payments",
    impact: "Protests, trust loss",
    color: "text-himfed-danger",
    bgColor: "bg-himfed-danger/10",
  },
  {
    icon: Fuel,
    problem: "Petrol Pump Credit Misuse",
    impact: "₹15+ crore blocked",
    color: "text-himfed-warning",
    bgColor: "bg-himfed-warning/10",
  },
  {
    icon: Apple,
    problem: "Apple Procurement Confusion",
    impact: "Chaos during MIS season",
    color: "text-himfed-amber",
    bgColor: "bg-himfed-amber/10",
  },
  {
    icon: Eye,
    problem: "No Digital Tracking",
    impact: "Corruption & leakage risk",
    color: "text-himfed-danger",
    bgColor: "bg-himfed-danger/10",
  },
];

const ProblemsSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-16 stagger-children">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-himfed-danger/10 text-himfed-danger text-sm mb-4">
              <AlertTriangle className="w-4 h-4" />
              <span>Challenges We Solve</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-4">
              The Problems That Cost
              <span className="text-himfed-danger"> Crores</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From public data and field research, these are the critical issues 
              affecting HIMFED's operations and farmer welfare.
            </p>
          </div>

          {/* Problems grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {problems.map((item, index) => (
              <div 
                key={index}
                className="group relative p-6 rounded-2xl bg-card border border-border shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
              >
                {/* Icon */}
                <div className={`inline-flex p-3 rounded-xl ${item.bgColor} mb-4`}>
                  <item.icon className={`w-6 h-6 ${item.color}`} />
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold text-foreground mb-2">
                  {item.problem}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {item.impact}
                </p>

                {/* Hover accent line */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 ${item.bgColor} rounded-b-2xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`} />
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-r from-primary/5 to-secondary/10 border border-primary/20">
              <div className="text-4xl font-serif font-bold text-primary">₹15+ Cr</div>
              <div className="text-left">
                <div className="text-sm font-semibold text-foreground">Potential Savings</div>
                <div className="text-xs text-muted-foreground">Through digital transformation</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemsSection;
