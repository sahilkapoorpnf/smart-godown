import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";
import StatCard from "@/components/dashboard/StatCard";
import AlertsPanel from "@/components/dashboard/AlertsPanel";
import RecentActivity from "@/components/dashboard/RecentActivity";
import StockOverview from "@/components/dashboard/StockOverview";
import { 
  Warehouse, 
  Package, 
  Truck, 
  IndianRupee, 
  Users, 
  Fuel,
  TrendingUp,
  AlertTriangle
} from "lucide-react";

const Dashboard = () => {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Page header */}
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-serif font-bold text-foreground">
                Dashboard Overview
              </h1>
              <p className="text-muted-foreground mt-1">
                Welcome back! Here's what's happening across HIMFED operations today.
              </p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Total Godowns"
                value="156"
                change="+3 this month"
                changeType="positive"
                icon={Warehouse}
                iconColor="text-primary"
                iconBg="bg-primary/10"
              />
              <StatCard
                title="Total Stock Value"
                value="₹45.2 Cr"
                change="+12% from last month"
                changeType="positive"
                icon={IndianRupee}
                iconColor="text-himfed-success"
                iconBg="bg-himfed-success/10"
              />
              <StatCard
                title="Pending Transfers"
                value="23"
                change="8 require approval"
                changeType="neutral"
                icon={Truck}
                iconColor="text-himfed-info"
                iconBg="bg-himfed-info/10"
              />
              <StatCard
                title="Active Alerts"
                value="12"
                change="4 critical"
                changeType="negative"
                icon={AlertTriangle}
                iconColor="text-himfed-danger"
                iconBg="bg-himfed-danger/10"
              />
            </div>

            {/* Secondary stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Products Tracked"
                value="2,847"
                icon={Package}
                iconColor="text-secondary"
                iconBg="bg-secondary/10"
              />
              <StatCard
                title="Active Users"
                value="342"
                icon={Users}
                iconColor="text-primary"
                iconBg="bg-primary/10"
              />
              <StatCard
                title="Fuel Credit"
                value="₹8.2L"
                change="Pending recovery"
                changeType="negative"
                icon={Fuel}
                iconColor="text-himfed-warning"
                iconBg="bg-himfed-warning/10"
              />
              <StatCard
                title="Today's Transactions"
                value="847"
                change="+23% from yesterday"
                changeType="positive"
                icon={TrendingUp}
                iconColor="text-himfed-success"
                iconBg="bg-himfed-success/10"
              />
            </div>

            {/* Main content grid */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Stock overview - takes 2 columns */}
              <div className="lg:col-span-2">
                <StockOverview />
              </div>
              
              {/* Alerts panel */}
              <div>
                <AlertsPanel />
              </div>
            </div>

            {/* Recent activity - full width */}
            <RecentActivity />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
