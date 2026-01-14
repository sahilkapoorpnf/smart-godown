import { useState } from "react";
import { 
  Shield, 
  Building2, 
  MapPin, 
  Warehouse, 
  User, 
  ShoppingCart, 
  Truck, 
  Fuel, 
  Search, 
  Wallet,
  ChevronRight
} from "lucide-react";

const roles = [
  {
    code: "SA",
    name: "Super Admin",
    icon: Shield,
    description: "System owner (IT cell / vendor)",
    permissions: ["Create users & roles", "System configuration", "Backup & security", "Enable/disable modules"],
    color: "from-purple-500 to-indigo-600",
  },
  {
    code: "HQ",
    name: "HQ Admin",
    icon: Building2,
    description: "HIMFED Head Office",
    permissions: ["View all godown stock", "Approve transfers", "View procurement", "State-level reports"],
    color: "from-primary to-himfed-green-light",
  },
  {
    code: "AO",
    name: "Area Office Manager",
    icon: MapPin,
    description: "Regional controllers",
    permissions: ["Area godown stock", "Transfer requests", "Monitor shortages", "Local reports"],
    color: "from-blue-500 to-cyan-600",
  },
  {
    code: "WM",
    name: "Warehouse Manager",
    icon: Warehouse,
    description: "Physical stock owner",
    permissions: ["Receive stock (scan)", "Dispatch stock", "Damage tracking", "Daily closing stock"],
    color: "from-secondary to-himfed-gold",
  },
  {
    code: "WS",
    name: "Warehouse Staff",
    icon: User,
    description: "Daily operations",
    permissions: ["Barcode scanning", "Loading/unloading", "View assigned tasks", "Report damage"],
    color: "from-orange-500 to-amber-600",
  },
  {
    code: "PM",
    name: "Procurement Manager",
    icon: ShoppingCart,
    description: "Buying from suppliers",
    permissions: ["Supplier master", "Purchase orders", "GRN management", "Rate contracts"],
    color: "from-teal-500 to-emerald-600",
  },
  {
    code: "DO",
    name: "Distribution Officer",
    icon: Truck,
    description: "Sending to depots/farmers",
    permissions: ["Depot orders", "Farmer supply", "Delivery challans", "Transport slips"],
    color: "from-rose-500 to-pink-600",
  },
  {
    code: "FM",
    name: "Fuel Manager",
    icon: Fuel,
    description: "Petrol & diesel",
    permissions: ["Petrol stock", "Vehicle-wise issue", "Department billing", "Credit tracking"],
    color: "from-red-500 to-orange-600",
  },
  {
    code: "AU",
    name: "Auditor",
    icon: Search,
    description: "Govt, CAG, Vigilance",
    permissions: ["Read-only stock", "Movement logs", "Payment history", "Download audit files"],
    color: "from-slate-500 to-gray-600",
  },
  {
    code: "FA",
    name: "Finance Officer",
    icon: Wallet,
    description: "Payments & billing",
    permissions: ["Supplier bills", "Farmer payments", "Credit recovery", "Govt billing"],
    color: "from-green-500 to-emerald-600",
  },
];

const RolesSection = () => {
  const [activeRole, setActiveRole] = useState(roles[1]);

  return (
    <section className="py-20 bg-background">
      <div className="container px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-16 stagger-children">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/20 text-secondary-foreground text-sm mb-4">
              <User className="w-4 h-4" />
              <span>10 User Roles</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-4">
              Role-Based
              <span className="text-secondary"> Access Control</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Each user sees only what they need. Complete permission control 
              ensures data integrity and prevents unauthorized access.
            </p>
          </div>

          <div className="grid lg:grid-cols-5 gap-8">
            {/* Role list */}
            <div className="lg:col-span-2 space-y-2">
              {roles.map((role) => (
                <button
                  key={role.code}
                  onClick={() => setActiveRole(role)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all duration-300 ${
                    activeRole.code === role.code
                      ? 'bg-primary text-primary-foreground shadow-lg'
                      : 'bg-card hover:bg-muted border border-border'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${
                    activeRole.code === role.code 
                      ? 'bg-primary-foreground/20' 
                      : 'bg-muted'
                  }`}>
                    <role.icon className={`w-5 h-5 ${
                      activeRole.code === role.code ? '' : 'text-primary'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-mono px-2 py-0.5 rounded ${
                        activeRole.code === role.code
                          ? 'bg-primary-foreground/20'
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {role.code}
                      </span>
                      <span className="font-semibold truncate">{role.name}</span>
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 flex-shrink-0 transition-transform ${
                    activeRole.code === role.code ? 'translate-x-1' : ''
                  }`} />
                </button>
              ))}
            </div>

            {/* Active role details */}
            <div className="lg:col-span-3">
              <div className={`h-full p-8 rounded-3xl bg-gradient-to-br ${activeRole.color} text-white`}>
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-4 rounded-2xl bg-white/20 backdrop-blur-sm">
                    <activeRole.icon className="w-8 h-8" />
                  </div>
                  <div>
                    <div className="text-sm font-mono opacity-80 mb-1">{activeRole.code}</div>
                    <h3 className="text-2xl font-serif font-bold">{activeRole.name}</h3>
                    <p className="text-white/80 mt-1">{activeRole.description}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-semibold uppercase tracking-wider opacity-80">
                    Key Permissions
                  </h4>
                  <div className="grid gap-2">
                    {activeRole.permissions.map((permission, index) => (
                      <div 
                        key={index}
                        className="flex items-center gap-3 p-3 rounded-xl bg-white/10 backdrop-blur-sm"
                      >
                        <div className="w-2 h-2 rounded-full bg-white" />
                        <span className="text-sm">{permission}</span>
                      </div>
                    ))}
                  </div>
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
