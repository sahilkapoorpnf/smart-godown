import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Leaf,
  LayoutDashboard,
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
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Package, label: "Product Master", path: "/dashboard/products" },
  { icon: Warehouse, label: "Godown & Location", path: "/dashboard/godowns" },
  { icon: BarChart3, label: "Stock Management", path: "/dashboard/stock" },
  { icon: ShoppingCart, label: "Procurement", path: "/dashboard/procurement" },
  { icon: ArrowLeftRight, label: "Transfers", path: "/dashboard/transfers" },
  { icon: Truck, label: "Distribution", path: "/dashboard/distribution" },
  { icon: Fuel, label: "Petrol & Diesel", path: "/dashboard/fuel" },
  { icon: Apple, label: "Apple & Crates", path: "/dashboard/crates" },
  { icon: Bell, label: "Alerts", path: "/dashboard/alerts" },
  { icon: FileText, label: "Reports", path: "/dashboard/reports" },
  { icon: Search, label: "Audit & Logs", path: "/dashboard/audit" },
  { icon: Users, label: "User Control", path: "/dashboard/users" },
];

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside 
      className={cn(
        "h-screen bg-sidebar flex flex-col border-r border-sidebar-border transition-all duration-300",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="p-4 border-b border-sidebar-border">
        <Link to="/dashboard" className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-sidebar-primary">
            <Leaf className="w-5 h-5 text-sidebar-primary-foreground" />
          </div>
          {!isCollapsed && (
            <div>
              <div className="font-serif font-bold text-lg text-sidebar-foreground leading-none">HIMFED</div>
              <div className="text-[10px] text-sidebar-foreground/60 leading-none">Control System</div>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                isActive 
                  ? "bg-sidebar-primary text-sidebar-primary-foreground" 
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon className={cn("w-5 h-5 flex-shrink-0", isActive && "text-sidebar-primary-foreground")} />
              {!isCollapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="p-3 border-t border-sidebar-border space-y-1">
        <Link
          to="/dashboard/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
        >
          <Settings className="w-5 h-5" />
          {!isCollapsed && <span>Settings</span>}
        </Link>
        <Link
          to="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground/70 hover:bg-destructive/10 hover:text-destructive transition-colors"
        >
          <LogOut className="w-5 h-5" />
          {!isCollapsed && <span>Logout</span>}
        </Link>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute top-20 -right-3 p-1.5 rounded-full bg-sidebar-accent border border-sidebar-border text-sidebar-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground transition-colors"
      >
        {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
    </aside>
  );
};

export default Sidebar;
