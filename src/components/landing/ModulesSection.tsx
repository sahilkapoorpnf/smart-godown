import { 
  Package, 
  Warehouse, 
  BarChart3, 
  ShoppingCart, 
  ArrowLeftRight, 
  Truck, 
  Fuel, 
  Apple, 
  Bell, 
  FileText, 
  Search, 
  Users,
  CheckCircle2
} from "lucide-react";

const modules = [
  { icon: Package, name: "Product Master", description: "Complete inventory catalog" },
  { icon: Warehouse, name: "Godown & Location", description: "Multi-level warehouse hierarchy" },
  { icon: BarChart3, name: "Stock Management", description: "Real-time stock visibility" },
  { icon: ShoppingCart, name: "Procurement", description: "Supplier & purchase orders" },
  { icon: ArrowLeftRight, name: "Transfers", description: "Inter-godown movements" },
  { icon: Truck, name: "Distribution", description: "Farmer & depot supply" },
  { icon: Fuel, name: "Petrol & Diesel", description: "Fuel credit management" },
  { icon: Apple, name: "Apple & Crates", description: "MIS procurement tracking" },
  { icon: Bell, name: "Alerts", description: "Shortage & expiry warnings" },
  { icon: FileText, name: "Reports", description: "CAG-ready audit reports" },
  { icon: Search, name: "Audit & Logs", description: "Complete trail of actions" },
  { icon: Users, name: "User Control", description: "Role-based access" },
];

const outcomes = [
  "No fertilizer shortage",
  "No crate theft",
  "No petrol misuse",
  "No expired stock",
  "No fake reporting",
  "Full government compliance",
];

const ModulesSection = () => {
  return (
    <section className="py-20 bg-muted/50">
      <div className="container px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-16 stagger-children">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm mb-4">
              <Package className="w-4 h-4" />
              <span>12 Core Modules</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-4">
              Complete Digital
              <span className="text-primary"> Transformation</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Every aspect of HIMFED operations digitized, tracked, and optimized 
              for maximum efficiency and transparency.
            </p>
          </div>

          {/* Modules grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-16">
            {modules.map((module, index) => (
              <div 
                key={index}
                className="group p-5 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <module.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-sm mb-1">
                      {module.name}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {module.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Outcomes */}
          <div className="p-8 rounded-3xl bg-gradient-to-br from-primary to-himfed-green-light text-primary-foreground">
            <h3 className="text-2xl font-serif font-bold mb-6 text-center">
              Guaranteed Outcomes
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {outcomes.map((outcome, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-xl bg-primary-foreground/10 backdrop-blur-sm"
                >
                  <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0" />
                  <span className="text-sm font-medium">{outcome}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ModulesSection;
