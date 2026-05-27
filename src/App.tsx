import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import AccountantDashboard from "./pages/accountant/AccountantDashboard";
import AccSalesLedger from "./pages/accountant/SalesLedger";
import PurchaseLedger from "./pages/accountant/PurchaseLedger";
import StockLedger from "./pages/accountant/StockLedger";
import GstManagement from "./pages/accountant/GstManagement";
import SubsidyManagement from "./pages/accountant/SubsidyManagement";
import OutstandingPayments from "./pages/accountant/OutstandingPayments";
import PartyLedger from "./pages/accountant/PartyLedger";
import MarginManagement from "./pages/accountant/MarginManagement";
import ExpenseManagement from "./pages/accountant/ExpenseManagement";
import CashBook from "./pages/accountant/CashBook";
import BankBook from "./pages/accountant/BankBook";
import CreditDebitNotes from "./pages/accountant/CreditDebitNotes";
import ReturnManagement from "./pages/accountant/ReturnManagement";
import StockAdjustment from "./pages/accountant/StockAdjustment";
import PhysicalVerification from "./pages/accountant/PhysicalVerification";
import TransportExpense from "./pages/accountant/TransportExpense";
import ReportCenter from "./pages/accountant/ReportCenter";
import AuditLog from "./pages/accountant/AuditLog";
import TallyExport from "./pages/accountant/TallyExport";
import FinancialYear from "./pages/accountant/FinancialYear";

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
