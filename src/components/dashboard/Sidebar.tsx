import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { getCurrentUser } from "@/lib/warehouse/store";
import { Role } from "@/lib/warehouse/types";
import {
  Leaf,
  LayoutDashboard,
  Package,
  Warehouse,
  BarChart3,
  TrendingUp,
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
  ClipboardList,
  CheckSquare,
  MapPin,
  Activity,
  PlusSquare,
  Receipt,
  BookOpen,
  Landmark,
  FileMinus,
  Undo2,
  Scale,
  ClipboardCheck,
  ShieldCheck,
  CalendarRange,
  PiggyBank,
  Wallet,
  AlertTriangle,
  BadgePercent,
} from "lucide-react";

type Item = { icon: any; label: string; path: string; roles?: Role[] };

const menuItems: Item[] = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },

  // ===== HIMFED TALLY ERP — Warehouse User =====
  { icon: LayoutDashboard, label: "WH User Dashboard", path: "/dashboard/erp/wh",         roles: ["wh_user"] },
  { icon: PlusSquare,      label: "New Goods Arrival", path: "/dashboard/erp/wh/new",     roles: ["wh_user"] },
  { icon: ClipboardList,   label: "My Entries",        path: "/dashboard/erp/wh/mine",    roles: ["wh_user"] },
  { icon: AlertTriangle,   label: "Re-correction",     path: "/dashboard/erp/wh/recorrect",roles: ["wh_user"] },

  // ===== HIMFED TALLY ERP — Area Officer =====
  { icon: CheckSquare,     label: "Pending Requests",  path: "/dashboard/erp/ao/pending", roles: ["area_officer", "admin_accountant"] },
  { icon: ClipboardCheck,  label: "Approved Entries",  path: "/dashboard/erp/ao/approved",roles: ["area_officer", "admin_accountant"] },

  // ===== HIMFED TALLY ERP — Warehouse Accountant (Tally) =====
  { icon: LayoutDashboard, label: "Tally Dashboard",   path: "/dashboard/erp/acc",            roles: ["wh_accountant", "admin_accountant"] },
  { icon: ShieldCheck,     label: "Company & GST",     path: "/dashboard/erp/acc/company",    roles: ["wh_accountant", "admin_accountant"] },
  { icon: BookOpen,        label: "Accounting Masters",path: "/dashboard/erp/acc/masters",    roles: ["wh_accountant", "admin_accountant"] },
  { icon: Package,         label: "Inventory Masters", path: "/dashboard/erp/acc/inventory",  roles: ["wh_accountant", "admin_accountant"] },
  { icon: Truck,           label: "Purchase Voucher",  path: "/dashboard/erp/acc/purchase",   roles: ["wh_accountant", "admin_accountant"] },
  { icon: Receipt,         label: "Sales Voucher",     path: "/dashboard/erp/acc/sales",      roles: ["wh_accountant", "admin_accountant"] },
  { icon: Wallet,          label: "Payment Voucher",   path: "/dashboard/erp/acc/payment",    roles: ["wh_accountant", "admin_accountant"] },
  { icon: Landmark,        label: "Receipt Voucher",   path: "/dashboard/erp/acc/receipt",    roles: ["wh_accountant", "admin_accountant"] },
  { icon: FileMinus,       label: "Journal Voucher",   path: "/dashboard/erp/acc/journal",    roles: ["wh_accountant", "admin_accountant"] },
  { icon: BookOpen,        label: "Day Book",          path: "/dashboard/erp/acc/daybook",    roles: ["wh_accountant", "admin_accountant"] },
  { icon: BarChart3,       label: "Current Stock",     path: "/dashboard/erp/acc/current-stock", roles: ["wh_accountant", "admin_accountant"] },
  { icon: ArrowLeftRight,  label: "Stock Transfer",    path: "/dashboard/erp/acc/stock-transfer",roles: ["wh_accountant", "admin_accountant"] },
  { icon: FileText,        label: "Accounting Reports",path: "/dashboard/erp/acc/reports",    roles: ["wh_accountant", "admin_accountant"] },

  // ===== HIMFED TALLY ERP — Admin Accountant (Super) =====
  { icon: LayoutDashboard, label: "HQ Super Dashboard",path: "/dashboard/erp/admin",          roles: ["admin_accountant"] },
  { icon: Users,           label: "ERP User Management", path: "/dashboard/erp/admin/users",  roles: ["admin_accountant"] },
  { icon: ShieldCheck,     label: "Audit Trail",       path: "/dashboard/erp/admin/audit",    roles: ["admin_accountant", "wh_accountant"] },
  { icon: FileText,        label: "Document Mgmt",     path: "/dashboard/erp/admin/documents",roles: ["admin_accountant", "wh_accountant", "area_officer"] },


  // ===== ACCOUNTANT PANEL =====
  { icon: LayoutDashboard, label: "Accountant Dashboard", path: "/dashboard/acc", roles: ["accountant", "superadmin"] },
  { icon: FileText, label: "Sales Ledger", path: "/dashboard/acc/sales", roles: ["accountant", "superadmin"] },
  { icon: Truck, label: "Purchase Ledger", path: "/dashboard/acc/purchase", roles: ["accountant", "superadmin"] },
  { icon: BarChart3, label: "Stock Ledger", path: "/dashboard/acc/stock-ledger", roles: ["accountant", "superadmin"] },
  { icon: BadgePercent, label: "GST Management", path: "/dashboard/acc/gst", roles: ["accountant", "superadmin"] },
  { icon: Wallet, label: "Subsidy Management", path: "/dashboard/acc/subsidy", roles: ["accountant", "superadmin"] },
  { icon: AlertTriangle, label: "Outstanding Payments", path: "/dashboard/acc/outstanding", roles: ["accountant", "superadmin"] },
  { icon: Users, label: "Party Ledger", path: "/dashboard/acc/party-ledger", roles: ["accountant", "superadmin"] },
  { icon: TrendingUp, label: "Margin Management", path: "/dashboard/acc/margin", roles: ["accountant", "superadmin"] },
  { icon: Receipt, label: "Expense Management", path: "/dashboard/acc/expenses", roles: ["accountant", "superadmin"] },
  { icon: BookOpen, label: "Cash Book", path: "/dashboard/acc/cashbook", roles: ["accountant", "superadmin"] },
  { icon: Landmark, label: "Bank Book", path: "/dashboard/acc/bankbook", roles: ["accountant", "superadmin"] },
  { icon: FileMinus, label: "Credit / Debit Notes", path: "/dashboard/acc/notes", roles: ["accountant", "superadmin"] },
  { icon: Undo2, label: "Return Management", path: "/dashboard/acc/returns", roles: ["accountant", "superadmin"] },
  { icon: Scale, label: "Stock Adjustment", path: "/dashboard/acc/stock-adjustment", roles: ["accountant", "superadmin"] },
  { icon: ClipboardCheck, label: "Physical Verification", path: "/dashboard/acc/physical-verification", roles: ["accountant", "superadmin"] },
  { icon: Truck, label: "Transport Expense", path: "/dashboard/acc/transport", roles: ["accountant", "superadmin"] },
  { icon: FileText, label: "Report Center", path: "/dashboard/acc/reports", roles: ["accountant", "superadmin"] },
  { icon: ShieldCheck, label: "Audit Log", path: "/dashboard/acc/audit", roles: ["accountant", "superadmin"] },
  { icon: PiggyBank, label: "Tally Export", path: "/dashboard/acc/tally", roles: ["accountant", "superadmin"] },
  { icon: CalendarRange, label: "Financial Year", path: "/dashboard/acc/fy", roles: ["accountant", "superadmin"] },

  // Warehouse Workflow
  { icon: PlusSquare, label: "New Entry", path: "/dashboard/wh/new-entry", roles: ["warehouse_staff"] },
  { icon: ClipboardList, label: "My Entries", path: "/dashboard/wh/my-entries", roles: ["warehouse_staff"] },
  { icon: CheckSquare, label: "Pending Approvals", path: "/dashboard/wh/approvals", roles: ["incharge", "superadmin"] },
  { icon: ClipboardList, label: "Entry Monitoring", path: "/dashboard/wh/entries", roles: ["superadmin", "accountant", "joa_it", "incharge"] },
  { icon: MapPin, label: "Area Management", path: "/dashboard/wh/areas", roles: ["superadmin"] },
  { icon: Warehouse, label: "Warehouse Mgmt", path: "/dashboard/wh/warehouses", roles: ["superadmin"] },
  { icon: Activity, label: "Activity Logs", path: "/dashboard/wh/logs", roles: ["superadmin", "joa_it"] },

  // Fertilizer Workflow
  { icon: ClipboardList, label: "Demand Requests", path: "/dashboard/fert/requests", roles: ["superadmin", "incharge"] },
  { icon: ShoppingCart, label: "Purchase Orders", path: "/dashboard/fert/purchase-orders", roles: ["superadmin"] },
  { icon: Package, label: "Fertilizer Products", path: "/dashboard/fert/products", roles: ["superadmin"] },
  { icon: Warehouse, label: "Fertilizer Companies", path: "/dashboard/fert/companies", roles: ["superadmin"] },
  { icon: FileText, label: "Pricing Master", path: "/dashboard/fert/pricing", roles: ["superadmin"] },
  { icon: BarChart3, label: "Fertilizer Inventory", path: "/dashboard/fert/inventory", roles: ["superadmin", "incharge", "accountant", "warehouse_staff"] },

  // Stock & Sales Management
  { icon: Truck, label: "Daily Stock Entry", path: "/dashboard/stock/entry", roles: ["warehouse_staff", "accountant", "incharge", "superadmin"] },
  { icon: ClipboardList, label: "Stock Listing", path: "/dashboard/stock/listing", roles: ["superadmin", "incharge", "accountant", "warehouse_staff", "joa_it"] },
  { icon: Package, label: "Fertilizer Master", path: "/dashboard/stock/master", roles: ["superadmin"] },
  { icon: Receipt, label: "Generate Invoice", path: "/dashboard/stock/invoice", roles: ["superadmin", "accountant", "warehouse_staff"] },
  { icon: FileText, label: "Sales History", path: "/dashboard/stock/sales", roles: ["superadmin", "accountant", "incharge", "warehouse_staff", "joa_it"] },
  { icon: BarChart3, label: "Reports & Analytics", path: "/dashboard/stock/reports", roles: ["superadmin", "accountant", "joa_it", "incharge"] },
  { icon: FileText, label: "Sales Ledger Report", path: "/dashboard/sales/ledger", roles: ["superadmin", "accountant", "incharge", "warehouse_staff", "joa_it"] },

  // Existing modules (superadmin)
  { icon: Package, label: "Product Master", path: "/dashboard/products", roles: ["superadmin"] },
  { icon: Warehouse, label: "Godown & Location", path: "/dashboard/godowns", roles: ["superadmin"] },
  { icon: BarChart3, label: "Stock Management", path: "/dashboard/stock", roles: ["superadmin", "accountant"] },
  { icon: ShoppingCart, label: "Procurement", path: "/dashboard/procurement", roles: ["superadmin"] },
  { icon: ArrowLeftRight, label: "Transfers", path: "/dashboard/transfers", roles: ["superadmin", "incharge"] },
  { icon: Truck, label: "Distribution", path: "/dashboard/distribution", roles: ["superadmin"] },
  { icon: Fuel, label: "Petrol & Diesel", path: "/dashboard/fuel", roles: ["superadmin"] },
  { icon: Apple, label: "Apple & Crates", path: "/dashboard/crates", roles: ["superadmin"] },
  { icon: Bell, label: "Alerts", path: "/dashboard/alerts" },
  { icon: FileText, label: "Reports", path: "/dashboard/reports", roles: ["superadmin", "accountant"] },
  { icon: Search, label: "Audit & Logs", path: "/dashboard/audit", roles: ["superadmin", "joa_it"] },
  { icon: Users, label: "User Control", path: "/dashboard/users", roles: ["superadmin"] },
  { icon: Settings, label: "Tax & Categories", path: "/dashboard/tax-units", roles: ["superadmin"] },
];

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const user = getCurrentUser();
  const role = user?.role;

  const visible = menuItems.filter((m) => !m.roles || (role && m.roles.includes(role)));

  return (
    <aside
      className={cn(
        "h-screen bg-sidebar flex flex-col border-r border-sidebar-border transition-all duration-300 relative",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
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

      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {visible.map((item) => {
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

      <div className="p-3 border-t border-sidebar-border space-y-1">
        <Link
          to="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground/70 hover:bg-destructive/10 hover:text-destructive transition-colors"
        >
          <LogOut className="w-5 h-5" />
          {!isCollapsed && <span>Logout</span>}
        </Link>
      </div>

      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute top-20 -right-3 p-1.5 rounded-full bg-sidebar-accent border border-sidebar-border text-sidebar-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground transition-colors z-10"
      >
        {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
    </aside>
  );
};

export default Sidebar;
