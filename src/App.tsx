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
