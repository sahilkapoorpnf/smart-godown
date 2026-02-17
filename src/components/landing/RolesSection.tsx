import { useState } from "react";
import {
  Shield, Building2, MapPin, Warehouse, User, ShoppingCart,
  Truck, Fuel, Search, Wallet, ChevronRight,
} from "lucide-react";

const roles = [
  { code: "SA", name: "Super Admin", icon: Shield, description: "System owner (IT cell / vendor)", permissions: ["Create users & roles", "System configuration", "Backup & security", "Enable/disable modules"], color: "from-purple-600 to-indigo-700" },
  { code: "HQ", name: "HQ Admin", icon: Building2, description: "HIMFED Head Office", permissions: ["View all godown stock", "Approve transfers", "View procurement", "State-level reports"], color: "from-primary to-himfed-green-light" },
  { code: "AO", name: "Area Office Mgr", icon: MapPin, description: "Regional controllers", permissions: ["Area godown stock", "Transfer requests", "Monitor shortages", "Local reports"], color: "from-blue-600 to-cyan-600" },
  { code: "WM", name: "Warehouse Mgr", icon: Warehouse, description: "Physical stock owner", permissions: ["Receive stock (scan)", "Dispatch stock", "Damage tracking", "Daily closing stock"], color: "from-secondary to-himfed-gold" },
  { code: "WS", name: "Warehouse Staff", icon: User, description: "Daily operations", permissions: ["Barcode scanning", "Loading/unloading", "View assigned tasks", "Report damage"], color: "from-orange-500 to-amber-600" },
  { code: "PM", name: "Procurement Mgr", icon: ShoppingCart, description: "Buying from suppliers", permissions: ["Supplier master", "Purchase orders", "GRN management", "Rate contracts"], color: "from-teal-600 to-emerald-600" },
  { code: "DO", name: "Distribution Officer", icon: Truck, description: "Sending to depots/farmers", permissions: ["Depot orders", "Farmer supply", "Delivery challans", "Transport slips"], color: "from-rose-500 to-pink-600" },
  { code: "FM", name: "Fuel Manager", icon: Fuel, description: "Petrol & diesel", permissions: ["Petrol stock", "Vehicle-wise issue", "Department billing", "Credit tracking"], color: "from-red-500 to-orange-600" },
  { code: "AU", name: "Auditor", icon: Search, description: "Govt, CAG, Vigilance", permissions: ["Read-only stock", "Movement logs", "Payment history", "Download audit files"], color: "from-slate-500 to-gray-600" },
  { code: "FA", name: "Finance Officer", icon: Wallet, description: "Payments & billing", permissions: ["Supplier bills", "Farmer payments", "Credit recovery", "Govt billing"], color: "from-green-600 to-emerald-600" },
];

const RolesSection = () => {
  const [active, setActive] = useState(roles[1]);

  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/20 text-secondary-foreground text-sm font-medium mb-4">
              <User className="w-4 h-4" />
              <span>10 User Roles</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-4">
              Role-Based <span className="text-secondary">Access Control</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Each user sees only what they need. Complete permission control ensures data integrity.
            </p>
          </div>

          <div className="grid lg:grid-cols-5 gap-6">
            <div className="lg:col-span-2 space-y-1.5 max-h-[600px] overflow-y-auto pr-1">
              {roles.map((role) => (
                <button
                  key={role.code}
                  onClick={() => setActive(role)}
                  className={`w-full flex items-center gap-3 p-3.5 rounded-xl text-left transition-all duration-200 ${
                    active.code === role.code
                      ? "bg-primary text-primary-foreground shadow-lg"
                      : "bg-card hover:bg-muted border border-border"
                  }`}
                >
                  <div className={`p-2 rounded-lg ${active.code === role.code ? "bg-primary-foreground/20" : "bg-muted"}`}>
                    <role.icon className={`w-4 h-4 ${active.code === role.code ? "" : "text-primary"}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${active.code === role.code ? "bg-primary-foreground/20" : "bg-muted text-muted-foreground"}`}>
                        {role.code}
                      </span>
                      <span className="font-semibold text-sm truncate">{role.name}</span>
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${active.code === role.code ? "translate-x-0.5" : ""}`} />
                </button>
              ))}
            </div>

            <div className="lg:col-span-3">
              <div className={`h-full p-8 rounded-3xl bg-gradient-to-br ${active.color} text-white`}>
                <div className="flex items-start gap-4 mb-8">
                  <div className="p-4 rounded-2xl bg-white/20 backdrop-blur-sm">
                    <active.icon className="w-8 h-8" />
                  </div>
                  <div>
                    <div className="text-sm font-mono opacity-70 mb-1">{active.code}</div>
                    <h3 className="text-2xl font-serif font-bold">{active.name}</h3>
                    <p className="text-white/80 mt-1">{active.description}</p>
                  </div>
                </div>
                <h4 className="text-xs font-semibold uppercase tracking-widest opacity-60 mb-3">Key Permissions</h4>
                <div className="grid gap-2">
                  {active.permissions.map((p, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/10 backdrop-blur-sm">
                      <div className="w-2 h-2 rounded-full bg-white" />
                      <span className="text-sm">{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RolesSection;
