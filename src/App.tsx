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

          {/* Accountant Panel */}
          <Route path="/dashboard/acc" element={<AccountantDashboard />} />
          <Route path="/dashboard/acc/sales" element={<AccSalesLedger />} />
          <Route path="/dashboard/acc/purchase" element={<PurchaseLedger />} />
          <Route path="/dashboard/acc/stock-ledger" element={<StockLedger />} />
          <Route path="/dashboard/acc/gst" element={<GstManagement />} />
          <Route path="/dashboard/acc/subsidy" element={<SubsidyManagement />} />
          <Route path="/dashboard/acc/outstanding" element={<OutstandingPayments />} />
          <Route path="/dashboard/acc/party-ledger" element={<PartyLedger />} />
          <Route path="/dashboard/acc/margin" element={<MarginManagement />} />
          <Route path="/dashboard/acc/expenses" element={<ExpenseManagement />} />
          <Route path="/dashboard/acc/cashbook" element={<CashBook />} />
          <Route path="/dashboard/acc/bankbook" element={<BankBook />} />
          <Route path="/dashboard/acc/notes" element={<CreditDebitNotes />} />
          <Route path="/dashboard/acc/returns" element={<ReturnManagement />} />
          <Route path="/dashboard/acc/stock-adjustment" element={<StockAdjustment />} />
          <Route path="/dashboard/acc/physical-verification" element={<PhysicalVerification />} />
          <Route path="/dashboard/acc/transport" element={<TransportExpense />} />
          <Route path="/dashboard/acc/reports" element={<ReportCenter />} />
          <Route path="/dashboard/acc/audit" element={<AuditLog />} />
          <Route path="/dashboard/acc/tally" element={<TallyExport />} />
          <Route path="/dashboard/acc/fy" element={<FinancialYear />} />

          {/* ===== HIMFED Tally ERP (new role-gated) ===== */}
          <Route path="/dashboard/erp/wh" element={<WhUserDashboard />} />
          <Route path="/dashboard/erp/wh/new" element={<GoodsArrivalNew />} />
          <Route path="/dashboard/erp/wh/mine" element={<MyArrivals mode="mine" />} />
          <Route path="/dashboard/erp/wh/recorrect" element={<MyArrivals mode="recorrect" />} />
          <Route path="/dashboard/erp/ao/pending" element={<AreaOfficerPage mode="pending" />} />
          <Route path="/dashboard/erp/ao/approved" element={<AreaOfficerPage mode="approved" />} />
          <Route path="/dashboard/erp/acc/select-company" element={<SelectCompany />} />
          <Route path="/dashboard/erp/acc/companies" element={<CompanyManager />} />
          <Route path="/dashboard/erp/acc/company-info" element={<CompanyInformation />} />
          <Route path="/dashboard/erp/acc" element={<TallyDashboard />} />
          <Route path="/dashboard/erp/acc/company-old" element={<CompanyGstSetup />} />
          <Route path="/dashboard/erp/acc/masters" element={<AccountingMasters />} />
          <Route path="/dashboard/erp/acc/masters/groups" element={<GroupMasterPage />} />
          <Route path="/dashboard/erp/acc/masters/ledgers" element={<LedgerMasterPage />} />
          <Route path="/dashboard/erp/acc/masters/voucher-types" element={<VoucherTypeMasterPage />} />
          <Route path="/dashboard/erp/acc/inventory" element={<InventoryMasters />} />
          <Route path="/dashboard/erp/acc/inventory/groups" element={<StockGroupPage />} />
          <Route path="/dashboard/erp/acc/inventory/items" element={<StockItemPage />} />
          <Route path="/dashboard/erp/acc/inventory/units" element={<StockUnitPage />} />
          <Route path="/dashboard/erp/acc/inventory/godowns" element={<GodownMasterCrud />} />
          <Route path="/dashboard/erp/acc/purchase" element={<VoucherEntry kind="purchase" title="Purchase Voucher" description="Auto-drafted from approved goods arrivals · also create manual entries." />} />
          <Route path="/dashboard/erp/acc/sales" element={<VoucherEntry kind="sales" title="Sales Voucher" description="Record sales, reduce stock and post to GST registers." />} />
          <Route path="/dashboard/erp/acc/payment" element={<VoucherEntry kind="payment" title="Payment Voucher" description="Supplier payments, expenses, bank & cash payments." />} />
          <Route path="/dashboard/erp/acc/receipt" element={<VoucherEntry kind="receipt" title="Receipt Voucher" description="Customer receipts, government receipts, other income." />} />
          <Route path="/dashboard/erp/acc/journal" element={<VoucherEntry kind="journal" title="Journal Voucher" description="Adjustments, ledger corrections, accounting transfers." />} />
          <Route path="/dashboard/erp/acc/contra" element={<VoucherEntry kind="contra" title="Contra Voucher" description="Cash ⇄ Bank · Bank ⇄ Bank transfers." />} />
          <Route path="/dashboard/erp/acc/daybook" element={<DayBookTally />} />
          <Route path="/dashboard/erp/acc/current-stock" element={<CurrentStock />} />
          <Route path="/dashboard/erp/acc/stock-transfer" element={<StockTransfer />} />
          <Route path="/dashboard/erp/acc/reports" element={<AccountingReports />} />
          <Route path="/dashboard/erp/acc/reports/ledger" element={<LedgerReport />} />
          <Route path="/dashboard/erp/acc/reports/trial-balance" element={<TrialBalance />} />
          <Route path="/dashboard/erp/acc/reports/cashbook" element={<CashBookReport />} />
          <Route path="/dashboard/erp/acc/reports/bankbook" element={<BankBookReport />} />
          <Route path="/dashboard/erp/acc/reports/purchase-register" element={<PurchaseRegister />} />
          <Route path="/dashboard/erp/acc/reports/sales-register" element={<SalesRegister />} />
          <Route path="/dashboard/erp/acc/reports/stock-summary" element={<StockSummary />} />
          <Route path="/dashboard/erp/acc/reports/godown-stock" element={<GodownStockReport />} />
          <Route path="/dashboard/erp/acc/reports/gst" element={<GstReportsPage />} />
          <Route path="/dashboard/erp/acc/reports/pl" element={<ProfitLoss />} />
          <Route path="/dashboard/erp/acc/reports/balance-sheet" element={<BalanceSheet />} />

          <Route path="/dashboard/erp/admin" element={<AdminAccountantDashboard />} />
          <Route path="/dashboard/erp/admin/users" element={<AdminUserManagement />} />
          <Route path="/dashboard/erp/admin/audit" element={<AuditTrail />} />
          <Route path="/dashboard/erp/admin/documents" element={<DocumentManagement />} />


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
