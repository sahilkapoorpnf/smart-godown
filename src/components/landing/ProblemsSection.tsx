import { AlertTriangle, Package, FileText, Clock, Fuel, Apple, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

const problems = [
  { icon: Package, problem: "Fertilizer Shortages", impact: "Delayed distribution causes farmer distress and political pressure across districts.", color: "text-himfed-danger", bgColor: "bg-himfed-danger/10" },
  { icon: Package, problem: "Stock Mismanagement", impact: "Godowns either overstocked or critically empty — no real-time visibility.", color: "text-himfed-warning", bgColor: "bg-himfed-warning/10" },
  { icon: FileText, problem: "Manual Record-Keeping", impact: "Paper-based systems lead to errors, duplication, and zero data transparency.", color: "text-himfed-info", bgColor: "bg-himfed-info/10" },
  { icon: Clock, problem: "Delayed Farmer Payments", impact: "Procurement payments stuck in manual processes causing trust deficit.", color: "text-himfed-danger", bgColor: "bg-himfed-danger/10" },
  { icon: Fuel, problem: "Fuel Credit Misuse", impact: "₹15+ crore blocked in unreconciled petrol & diesel credits.", color: "text-himfed-warning", bgColor: "bg-himfed-warning/10" },
  { icon: Apple, problem: "Apple Procurement Chaos", impact: "MIS season overwhelms manual tracking — crate theft and confusion.", color: "text-himfed-amber", bgColor: "bg-himfed-amber/10" },
];

const ProblemsSection = () => {
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-himfed-danger/10 text-himfed-danger text-sm font-medium mb-4">
              <AlertTriangle className="w-4 h-4" />
              <span>Challenges We Solve</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-4">
              The Problems Costing <span className="text-himfed-danger">Crores</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Critical operational gaps that impact farmers, finances, and government compliance.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {problems.map((item, i) => (
              <div
                key={i}
                className="group relative p-6 rounded-2xl bg-card border border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              >
                <div className={cn("inline-flex p-3 rounded-xl mb-4", item.bgColor)}>
                  <item.icon className={cn("w-6 h-6", item.color)} />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{item.problem}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.impact}</p>
                <div className={cn("absolute bottom-0 left-0 right-0 h-0.5 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left", item.bgColor)} />
              </div>
            ))}
          </div>

          <div className="mt-14 text-center">
            <div className="inline-flex items-center gap-4 px-8 py-5 rounded-2xl bg-gradient-to-r from-primary/5 to-secondary/10 border border-primary/15">
              <div className="text-4xl font-serif font-bold text-primary">₹15+ Cr</div>
              <div className="text-left">
                <div className="text-sm font-semibold text-foreground">Potential Annual Savings</div>
                <div className="text-xs text-muted-foreground">Through complete digital transformation</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemsSection;
