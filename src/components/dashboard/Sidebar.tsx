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
  Building2,
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
  { icon: CheckSquare,     label: "Pending Requests",  path: "/dashboard/erp/ao/pending", roles: ["area_officer"] },
  { icon: ClipboardCheck,  label: "Approved Entries",  path: "/dashboard/erp/ao/approved",roles: ["area_officer"] },

  // ===== REDESIGNED STATIC TALLY ACCOUNTANT ERP =====
  { icon: Building2,       label: "Select Company",       path: "/dashboard/erp/acc/select-company", roles: ["wh_accountant", "admin_accountant", "accountant", "superadmin"] },
  { icon: LayoutDashboard, label: "Dashboard",            path: "/dashboard/erp/acc", roles: ["wh_accountant", "admin_accountant", "accountant", "superadmin"] },
  { icon: Building2,       label: "Area Company Creation", path: "/dashboard/erp/acc/company-create", roles: ["wh_accountant", "admin_accountant", "accountant", "superadmin"] },
  { icon: Building2,       label: "Company Information",  path: "/dashboard/erp/acc/company-info", roles: ["wh_accountant", "admin_accountant", "accountant", "superadmin"] },
  { icon: BookOpen,        label: "Masters: Groups",      path: "/dashboard/erp/acc/masters/groups", roles: ["wh_accountant", "admin_accountant", "accountant", "superadmin"] },
  { icon: BookOpen,        label: "Masters: Ledgers",     path: "/dashboard/erp/acc/masters/ledgers", roles: ["wh_accountant", "admin_accountant", "accountant", "superadmin"] },
  { icon: BookOpen,        label: "Masters: Voucher Types", path: "/dashboard/erp/acc/masters/voucher-types", roles: ["wh_accountant", "admin_accountant", "accountant", "superadmin"] },
  { icon: Package,         label: "Inventory: Stock Group", path: "/dashboard/erp/acc/inventory/groups", roles: ["wh_accountant", "admin_accountant", "accountant", "superadmin"] },
  { icon: Package,         label: "Inventory: Stock Item", path: "/dashboard/erp/acc/inventory/items", roles: ["wh_accountant", "admin_accountant", "accountant", "superadmin"] },
  { icon: Package,         label: "Inventory: Stock Unit", path: "/dashboard/erp/acc/inventory/units", roles: ["wh_accountant", "admin_accountant", "accountant", "superadmin"] },
  { icon: Warehouse,       label: "Godown/Warehouse Master", path: "/dashboard/erp/acc/inventory/godowns", roles: ["wh_accountant", "admin_accountant", "accountant", "superadmin"] },
  { icon: Truck,           label: "Purchase Voucher",     path: "/dashboard/erp/acc/purchase", roles: ["wh_accountant", "admin_accountant", "accountant", "superadmin"] },
  { icon: Receipt,         label: "Sales Voucher",        path: "/dashboard/erp/acc/sales", roles: ["wh_accountant", "admin_accountant", "accountant", "superadmin"] },
  { icon: Wallet,          label: "Payment Voucher",      path: "/dashboard/erp/acc/payment", roles: ["wh_accountant", "admin_accountant", "accountant", "superadmin"] },
  { icon: Landmark,        label: "Receipt Voucher",      path: "/dashboard/erp/acc/receipt", roles: ["wh_accountant", "admin_accountant", "accountant", "superadmin"] },
  { icon: FileMinus,       label: "Journal Voucher",      path: "/dashboard/erp/acc/journal", roles: ["wh_accountant", "admin_accountant", "accountant", "superadmin"] },
  { icon: ArrowLeftRight,  label: "Contra Voucher",       path: "/dashboard/erp/acc/contra", roles: ["wh_accountant", "admin_accountant", "accountant", "superadmin"] },
  { icon: ArrowLeftRight,  label: "Stock Transfer Voucher", path: "/dashboard/erp/acc/stock-transfer", roles: ["wh_accountant", "admin_accountant", "accountant", "superadmin"] },
  { icon: BookOpen,        label: "Day Book",             path: "/dashboard/erp/acc/daybook", roles: ["wh_accountant", "admin_accountant", "accountant", "superadmin"] },
  { icon: FileText,        label: "Reports",              path: "/dashboard/erp/acc/reports", roles: ["wh_accountant", "admin_accountant", "accountant", "superadmin"] },
  { icon: FileText,        label: "Ledger Report",        path: "/dashboard/erp/acc/reports/ledger", roles: ["wh_accountant", "admin_accountant", "accountant", "superadmin"] },
  { icon: Scale,           label: "Trial Balance",        path: "/dashboard/erp/acc/reports/trial-balance", roles: ["wh_accountant", "admin_accountant", "accountant", "superadmin"] },
  { icon: BookOpen,        label: "Cash Book",            path: "/dashboard/erp/acc/reports/cashbook", roles: ["wh_accountant", "admin_accountant", "accountant", "superadmin"] },
  { icon: Landmark,        label: "Bank Book",            path: "/dashboard/erp/acc/reports/bankbook", roles: ["wh_accountant", "admin_accountant", "accountant", "superadmin"] },
  { icon: FileText,        label: "Purchase Register",    path: "/dashboard/erp/acc/reports/purchase-register", roles: ["wh_accountant", "admin_accountant", "accountant", "superadmin"] },
  { icon: FileText,        label: "Sales Register",       path: "/dashboard/erp/acc/reports/sales-register", roles: ["wh_accountant", "admin_accountant", "accountant", "superadmin"] },
  { icon: BarChart3,       label: "Stock Summary",        path: "/dashboard/erp/acc/reports/stock-summary", roles: ["wh_accountant", "admin_accountant", "accountant", "superadmin"] },
  { icon: Warehouse,       label: "Stock Register",       path: "/dashboard/erp/acc/reports/stock-register", roles: ["wh_accountant", "admin_accountant", "accountant", "superadmin"] },
  { icon: BadgePercent,    label: "GST Reports",          path: "/dashboard/erp/acc/reports/gst", roles: ["wh_accountant", "admin_accountant", "accountant", "superadmin"] },
  { icon: TrendingUp,      label: "Profit & Loss",        path: "/dashboard/erp/acc/reports/pl", roles: ["wh_accountant", "admin_accountant", "accountant", "superadmin"] },
  { icon: Scale,           label: "Balance Sheet",        path: "/dashboard/erp/acc/reports/balance-sheet", roles: ["wh_accountant", "admin_accountant", "accountant", "superadmin"] },
  { icon: FileText,        label: "Documents",            path: "/dashboard/erp/acc/documents", roles: ["wh_accountant", "admin_accountant", "accountant", "superadmin", "area_officer"] },
  { icon: ShieldCheck,     label: "Audit Logs",           path: "/dashboard/erp/acc/audit", roles: ["wh_accountant", "admin_accountant", "accountant", "superadmin"] },

  // ===== HIMFED TALLY ERP — Admin Accountant (Super) =====
  { icon: LayoutDashboard, label: "HQ Super Dashboard",path: "/dashboard/erp/admin",          roles: ["admin_accountant"] },
  { icon: Users,           label: "ERP User Management", path: "/dashboard/erp/admin/users",  roles: ["admin_accountant"] },
  { icon: ShieldCheck,     label: "Audit Trail",       path: "/dashboard/erp/admin/audit",    roles: ["admin_accountant"] },
  { icon: FileText,        label: "Document Mgmt",     path: "/dashboard/erp/admin/documents",roles: ["admin_accountant"] },

  // Warehouse Workflow
  { icon: PlusSquare, label: "New Entry", path: "/dashboard/wh/new-entry", roles: ["warehouse_staff"] },
  { icon: ClipboardList, label: "My Entries", path: "/dashboard/wh/my-entries", roles: ["warehouse_staff"] },
  { icon: CheckSquare, label: "Pending Approvals", path: "/dashboard/wh/approvals", roles: ["incharge", "superadmin"] },
  { icon: ClipboardList, label: "Entry Monitoring", path: "/dashboard/wh/entries", roles: ["superadmin", "joa_it", "incharge"] },
  { icon: MapPin, label: "Area Management", path: "/dashboard/wh/areas", roles: ["superadmin"] },
  { icon: Warehouse, label: "Warehouse Mgmt", path: "/dashboard/wh/warehouses", roles: ["superadmin"] },
  { icon: Activity, label: "Activity Logs", path: "/dashboard/wh/logs", roles: ["superadmin", "joa_it"] },

  // Fertilizer Workflow
  { icon: ClipboardList, label: "Demand Requests", path: "/dashboard/fert/requests", roles: ["superadmin", "incharge"] },
  { icon: ShoppingCart, label: "Purchase Orders", path: "/dashboard/fert/purchase-orders", roles: ["superadmin"] },
  { icon: Package, label: "Fertilizer Products", path: "/dashboard/fert/products", roles: ["superadmin"] },
  { icon: Warehouse, label: "Fertilizer Companies", path: "/dashboard/fert/companies", roles: ["superadmin"] },
  { icon: FileText, label: "Pricing Master", path: "/dashboard/fert/pricing", roles: ["superadmin"] },
  { icon: BarChart3, label: "Fertilizer Inventory", path: "/dashboard/fert/inventory", roles: ["superadmin", "incharge", "warehouse_staff"] },

  // Stock & Sales Management
  { icon: Truck, label: "Daily Stock Entry", path: "/dashboard/stock/entry", roles: ["warehouse_staff", "incharge", "superadmin"] },
  { icon: ClipboardList, label: "Stock Listing", path: "/dashboard/stock/listing", roles: ["superadmin", "incharge", "warehouse_staff", "joa_it"] },
  { icon: Package, label: "Fertilizer Master", path: "/dashboard/stock/master", roles: ["superadmin"] },
  { icon: Receipt, label: "Generate Invoice", path: "/dashboard/stock/invoice", roles: ["superadmin", "warehouse_staff"] },
  { icon: FileText, label: "Sales History", path: "/dashboard/stock/sales", roles: ["superadmin", "incharge", "warehouse_staff", "joa_it"] },
  { icon: BarChart3, label: "Reports & Analytics", path: "/dashboard/stock/reports", roles: ["superadmin", "joa_it", "incharge"] },
  { icon: FileText, label: "Sales Ledger Report", path: "/dashboard/sales/ledger", roles: ["superadmin", "incharge", "warehouse_staff", "joa_it"] },

  // Existing modules (superadmin)
  { icon: Package, label: "Product Master", path: "/dashboard/products", roles: ["superadmin"] },
  { icon: Warehouse, label: "Godown & Location", path: "/dashboard/godowns", roles: ["superadmin"] },
  { icon: BarChart3, label: "Stock Management", path: "/dashboard/stock", roles: ["superadmin"] },
  { icon: ShoppingCart, label: "Procurement", path: "/dashboard/procurement", roles: ["superadmin"] },
  { icon: ArrowLeftRight, label: "Transfers", path: "/dashboard/transfers", roles: ["superadmin", "incharge"] },
  { icon: Truck, label: "Distribution", path: "/dashboard/distribution", roles: ["superadmin"] },
  { icon: Fuel, label: "Petrol & Diesel", path: "/dashboard/fuel", roles: ["superadmin"] },
  { icon: Apple, label: "Apple & Crates", path: "/dashboard/crates", roles: ["superadmin"] },
  { icon: Bell, label: "Alerts", path: "/dashboard/alerts" },
  { icon: FileText, label: "Reports", path: "/dashboard/reports", roles: ["superadmin"] },
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
