import {
  Package, Warehouse, BarChart3, ShoppingCart, ArrowLeftRight, Truck,
  Fuel, Apple, Bell, FileText, Search, Users, CheckCircle2,
} from "lucide-react";

const modules = [
  { icon: Package, name: "Product Master", description: "Complete inventory catalog with batch & expiry tracking" },
  { icon: Warehouse, name: "Godown & Location", description: "Multi-level warehouse hierarchy across HP" },
  { icon: BarChart3, name: "Stock Management", description: "Real-time stock visibility with low-stock alerts" },
  { icon: ShoppingCart, name: "Procurement", description: "Supplier management & purchase orders" },
  { icon: ArrowLeftRight, name: "Transfers", description: "Inter-godown stock movements with approvals" },
  { icon: Truck, name: "Distribution", description: "Farmer & depot supply tracking" },
  { icon: Fuel, name: "Petrol & Diesel", description: "Fuel credit management & reconciliation" },
  { icon: Apple, name: "Apple & Crates", description: "MIS procurement & crate tracking" },
  { icon: Bell, name: "Alerts", description: "Shortage, expiry & threshold warnings" },
  { icon: FileText, name: "Reports", description: "CAG-ready audit & compliance reports" },
  { icon: Search, name: "Audit & Logs", description: "Complete trail of every action" },
  { icon: Users, name: "User Control", description: "10 role-based access levels" },
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
    <section className="py-20 md:py-28 bg-muted/40">
      <div className="container px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Package className="w-4 h-4" />
              <span>12 Core Modules</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-4">
              Complete Digital <span className="text-primary">Transformation</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Every aspect of HIMFED operations — digitized, tracked, and optimized.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-16">
            {modules.map((mod, i) => (
              <div
                key={i}
                className="group p-5 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="p-2.5 rounded-xl bg-primary/10 group-hover:bg-primary/15 transition-colors w-fit mb-3">
                  <mod.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground text-sm mb-1">{mod.name}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{mod.description}</p>
              </div>
            ))}
          </div>

          <div className="p-8 md:p-10 rounded-3xl bg-gradient-to-br from-primary to-himfed-green-light text-primary-foreground">
            <h3 className="text-2xl font-serif font-bold mb-6 text-center">Guaranteed Outcomes</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {outcomes.map((o, i) => (
                <div key={i} className="flex items-center gap-3 p-3.5 rounded-xl bg-primary-foreground/10 backdrop-blur-sm">
                  <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0" />
                  <span className="text-sm font-medium">{o}</span>
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
