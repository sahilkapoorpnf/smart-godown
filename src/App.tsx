import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import UserManagement from "./pages/admin/UserManagement";
import SystemConfiguration from "./pages/admin/SystemConfiguration";
import TaxUnitCategories from "./pages/admin/TaxUnitCategories";
import ModuleControl from "./pages/admin/ModuleControl";
import BackupSecurity from "./pages/admin/BackupSecurity";
import ProductMaster from "./pages/master/ProductMaster";
import StockManagement from "./pages/master/StockManagement";
import GodownMaster from "./pages/master/GodownMaster";
import NewEntry from "./pages/warehouse/NewEntry";
import EntriesPage from "./pages/warehouse/EntriesPage";
import AreaManagement from "./pages/warehouse/AreaManagement";
import WarehouseManagement from "./pages/warehouse/WarehouseManagement";
import ActivityLogs from "./pages/warehouse/ActivityLogs";
import FertilizerCompanies from "./pages/fertilizer/FertilizerCompanies";
import FertilizerProducts from "./pages/fertilizer/FertilizerProducts";
import FertilizerPricing from "./pages/fertilizer/FertilizerPricing";
import FertilizerRequests from "./pages/fertilizer/FertilizerRequests";
import PurchaseOrders from "./pages/fertilizer/PurchaseOrders";
import FertilizerInventory from "./pages/fertilizer/FertilizerInventory";
import DailyStockEntry from "./pages/stock/DailyStockEntry";
import StockListing from "./pages/stock/StockListing";
import FertilizerMaster from "./pages/stock/FertilizerMaster";
import InvoiceGenerate from "./pages/stock/InvoiceGenerate";
import SalesHistory from "./pages/stock/SalesHistory";
import StockReports from "./pages/stock/StockReports";
import SalesLedger from "./pages/sales/SalesLedger";

// ===== HIMFED Tally ERP (new) =====
import WhUserDashboard from "./pages/erp/WhUserDashboard";
import GoodsArrivalNew from "./pages/erp/GoodsArrivalNew";
import MyArrivals from "./pages/erp/MyArrivals";
import AreaOfficerPage from "./pages/erp/AreaOfficerPage";
import AdminUserManagement from "./pages/erp/AdminUserManagement";

// ===== HIMFED Tally ERP — Static Accountant Redesign =====
import {
  AuditLogsStatic,
  CompanyCreationStatic,
  CompanyInformationStatic,
  DayBookStatic,
  DocumentsStatic,
  GodownMasterStatic,
  GroupMasterStatic,
  LedgerMasterStatic,
  ReportStaticPage,
  ReportsLandingStatic,
  SelectCompanyStatic,
  StockGroupStatic,
  StockItemStatic,
  StockUnitStatic,
  TallyDashboardStatic,
  VoucherStaticPage,
  VoucherTypeMasterStatic,
} from "./pages/erp/accountant/StaticTallyPages";
import BalanceSheetPage from "./pages/erp/accountant/BalanceSheetPage";
import ProfitLossPage from "./pages/erp/accountant/ProfitLossPage";

const queryClient = new QueryClient();




const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Warehouse workflow */}
          <Route path="/dashboard/wh/new-entry" element={<NewEntry />} />
          <Route path="/dashboard/wh/my-entries" element={<EntriesPage mode="mine" />} />
          <Route path="/dashboard/wh/approvals" element={<EntriesPage mode="approvals" />} />
          <Route path="/dashboard/wh/entries" element={<EntriesPage mode="monitor" />} />
          <Route path="/dashboard/wh/areas" element={<AreaManagement />} />
          <Route path="/dashboard/wh/warehouses" element={<WarehouseManagement />} />
          <Route path="/dashboard/wh/logs" element={<ActivityLogs />} />

          {/* Fertilizer */}
          <Route path="/dashboard/fert/companies" element={<FertilizerCompanies />} />
          <Route path="/dashboard/fert/products" element={<FertilizerProducts />} />
          <Route path="/dashboard/fert/pricing" element={<FertilizerPricing />} />
          <Route path="/dashboard/fert/requests" element={<FertilizerRequests />} />
          <Route path="/dashboard/fert/purchase-orders" element={<PurchaseOrders />} />
          <Route path="/dashboard/fert/inventory" element={<FertilizerInventory />} />

          {/* Stock & Sales */}
          <Route path="/dashboard/stock/entry" element={<DailyStockEntry />} />
          <Route path="/dashboard/stock/listing" element={<StockListing />} />
          <Route path="/dashboard/stock/master" element={<FertilizerMaster />} />
          <Route path="/dashboard/stock/invoice" element={<InvoiceGenerate />} />
          <Route path="/dashboard/stock/sales" element={<SalesHistory />} />
          <Route path="/dashboard/stock/reports" element={<StockReports />} />
          <Route path="/dashboard/sales/ledger" element={<SalesLedger />} />

          {/* Legacy Accountant Panel removed: redirects into redesigned Tally ERP */}
          <Route path="/dashboard/acc/*" element={<Navigate to="/dashboard/erp/acc" replace />} />

          {/* ===== HIMFED Tally ERP (new role-gated) ===== */}
          <Route path="/dashboard/erp/wh" element={<WhUserDashboard />} />
          <Route path="/dashboard/erp/wh/new" element={<GoodsArrivalNew />} />
          <Route path="/dashboard/erp/wh/mine" element={<MyArrivals mode="mine" />} />
          <Route path="/dashboard/erp/wh/recorrect" element={<MyArrivals mode="recorrect" />} />
          <Route path="/dashboard/erp/ao/pending" element={<AreaOfficerPage mode="pending" />} />
          <Route path="/dashboard/erp/ao/approved" element={<AreaOfficerPage mode="approved" />} />
          <Route path="/dashboard/erp/acc/select-company" element={<SelectCompanyStatic />} />
          <Route path="/dashboard/erp/acc/companies" element={<CompanyCreationStatic />} />
          <Route path="/dashboard/erp/acc/company-create" element={<CompanyCreationStatic />} />
          <Route path="/dashboard/erp/acc/company-info" element={<CompanyInformationStatic />} />
          <Route path="/dashboard/erp/acc" element={<TallyDashboardStatic />} />
          <Route path="/dashboard/erp/acc/masters" element={<GroupMasterStatic />} />
          <Route path="/dashboard/erp/acc/masters/groups" element={<GroupMasterStatic />} />
          <Route path="/dashboard/erp/acc/masters/ledgers" element={<LedgerMasterStatic />} />
          <Route path="/dashboard/erp/acc/masters/voucher-types" element={<VoucherTypeMasterStatic />} />
          <Route path="/dashboard/erp/acc/inventory" element={<StockItemStatic />} />
          <Route path="/dashboard/erp/acc/inventory/groups" element={<StockGroupStatic />} />
          <Route path="/dashboard/erp/acc/inventory/items" element={<StockItemStatic />} />
          <Route path="/dashboard/erp/acc/inventory/units" element={<StockUnitStatic />} />
          <Route path="/dashboard/erp/acc/inventory/godowns" element={<GodownMasterStatic />} />
          <Route path="/dashboard/erp/acc/purchase" element={<VoucherStaticPage kind="purchase" />} />
          <Route path="/dashboard/erp/acc/sales" element={<VoucherStaticPage kind="sales" />} />
          <Route path="/dashboard/erp/acc/payment" element={<VoucherStaticPage kind="payment" />} />
          <Route path="/dashboard/erp/acc/receipt" element={<VoucherStaticPage kind="receipt" />} />
          <Route path="/dashboard/erp/acc/journal" element={<VoucherStaticPage kind="journal" />} />
          <Route path="/dashboard/erp/acc/contra" element={<VoucherStaticPage kind="contra" />} />
          <Route path="/dashboard/erp/acc/daybook" element={<DayBookStatic />} />
          <Route path="/dashboard/erp/acc/current-stock" element={<ReportStaticPage />} />
          <Route path="/dashboard/erp/acc/stock-transfer" element={<VoucherStaticPage kind="stock_transfer" />} />
          <Route path="/dashboard/erp/acc/reports" element={<ReportsLandingStatic />} />
          <Route path="/dashboard/erp/acc/reports/:report" element={<ReportStaticPage />} />
          <Route path="/dashboard/erp/acc/documents" element={<DocumentsStatic />} />
          <Route path="/dashboard/erp/acc/audit" element={<AuditLogsStatic />} />
          <Route path="/dashboard/erp/acc/balance-sheet" element={<BalanceSheetPage />} />
          <Route path="/dashboard/erp/acc/profit-loss" element={<ProfitLossPage />} />

          <Route path="/dashboard/erp/admin" element={<TallyDashboardStatic />} />
          <Route path="/dashboard/erp/admin/users" element={<AdminUserManagement />} />
          <Route path="/dashboard/erp/admin/audit" element={<AuditLogsStatic />} />
          <Route path="/dashboard/erp/admin/documents" element={<DocumentsStatic />} />


          {/* Admin */}
          <Route path="/dashboard/users" element={<UserManagement />} />
          <Route path="/dashboard/settings" element={<SystemConfiguration />} />
          <Route path="/dashboard/tax-units" element={<TaxUnitCategories />} />
          <Route path="/dashboard/modules" element={<ModuleControl />} />
          <Route path="/dashboard/backup" element={<BackupSecurity />} />
          <Route path="/dashboard/products" element={<ProductMaster />} />
          <Route path="/dashboard/stock" element={<StockManagement />} />
          <Route path="/dashboard/godowns" element={<GodownMaster />} />
          <Route path="/dashboard/*" element={<Dashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
