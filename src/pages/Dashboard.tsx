import AppShell from "@/components/warehouse/AppShell";
import StatCard from "@/components/dashboard/StatCard";
import AlertsPanel from "@/components/dashboard/AlertsPanel";
import RecentActivity from "@/components/dashboard/RecentActivity";
import StockOverview from "@/components/dashboard/StockOverview";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Warehouse,
  Package,
  Truck,
  IndianRupee,
  Users,
  Fuel,
  TrendingUp,
  AlertTriangle,
  ClipboardList,
  CheckCircle2,
  XCircle,
  Clock,
  PlusSquare,
  MapPin,
} from "lucide-react";
import { getCurrentUser, store, useStore, visibleEntries, warehouseName, areaName } from "@/lib/warehouse/store";
import { ROLE_LABEL } from "@/lib/warehouse/types";
import { EntryStatusBadge } from "@/components/warehouse/EntryStatusBadge";

const todayStr = new Date().toISOString().slice(0, 10);

const Dashboard = () => {
  useStore();
  const user = getCurrentUser();
  if (!user) return null;

  const myEntries = visibleEntries(user);
  const today = myEntries.filter((e) => e.depotDate === todayStr || e.createdAt.slice(0, 10) === todayStr);
  const pending = myEntries.filter((e) => e.status === "pending");
  const approved = myEntries.filter((e) => e.status === "approved");
  const rejected = myEntries.filter((e) => e.status === "rejected");

  const recent = [...myEntries].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 6);

  // -------- WAREHOUSE STAFF --------
  if (user.role === "warehouse_staff") {
    return (
      <AppShell>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-serif font-bold">Welcome, {user.name.split(" ")[0]}</h1>
            <p className="text-muted-foreground mt-1">
              {warehouseName(user.warehouseId)} · {areaName(user.areaId)} · {ROLE_LABEL[user.role]}
            </p>
          </div>
          <Link to="/dashboard/wh/new-entry">
            <Button size="lg" className="bg-primary">
              <PlusSquare className="w-5 h-5 mr-2" /> New Warehouse Entry
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard title="Today's Entries" value={String(today.length)} icon={ClipboardList} iconColor="text-primary" iconBg="bg-primary/10" />
          <StatCard title="Pending Review" value={String(pending.length)} icon={Clock} iconColor="text-himfed-warning" iconBg="bg-himfed-warning/10" />
          <StatCard title="Approved" value={String(approved.length)} icon={CheckCircle2} iconColor="text-himfed-success" iconBg="bg-himfed-success/10" />
          <StatCard title="Rejected" value={String(rejected.length)} icon={XCircle} iconColor="text-himfed-danger" iconBg="bg-himfed-danger/10" />
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-serif">Recent Entries</CardTitle>
            <Link to="/dashboard/wh/my-entries"><Button variant="ghost" size="sm">View All →</Button></Link>
          </CardHeader>
          <CardContent>
            {recent.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">No entries yet — submit your first.</div>
            ) : (
              <div className="divide-y divide-border">
                {recent.map((e) => (
                  <div key={e.id} className="py-3 flex flex-wrap items-center gap-3 justify-between">
                    <div>
                      <div className="font-medium">{e.entryCode} · {e.productName}</div>
                      <div className="text-xs text-muted-foreground">
                        GR {e.grNumber} · {e.quantity} {e.unit} · {new Date(e.createdAt).toLocaleString("en-IN")}
                      </div>
                    </div>
                    <EntryStatusBadge status={e.status} />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </AppShell>
    );
  }

  // -------- AREA INCHARGE --------
  if (user.role === "incharge") {
    const myArea = store.areas.find((a) => a.id === user.areaId);
    const myWh = store.warehouses.filter((w) => w.areaId === user.areaId);
    return (
      <AppShell>
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold">Area Office — {myArea?.name}</h1>
          <p className="text-muted-foreground mt-1">{ROLE_LABEL[user.role]} · {myWh.length} warehouses under your command</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard title="Warehouses" value={String(myWh.length)} icon={Warehouse} iconColor="text-primary" iconBg="bg-primary/10" />
          <StatCard title="Pending Approvals" value={String(pending.length)} change={pending.length ? "Action required" : "All clear"} changeType={pending.length ? "negative" : "positive"} icon={Clock} iconColor="text-himfed-warning" iconBg="bg-himfed-warning/10" />
          <StatCard title="Approved (Area)" value={String(approved.length)} icon={CheckCircle2} iconColor="text-himfed-success" iconBg="bg-himfed-success/10" />
          <StatCard title="Rejected (Area)" value={String(rejected.length)} icon={XCircle} iconColor="text-himfed-danger" iconBg="bg-himfed-danger/10" />
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-serif">Latest Submissions From Your Warehouses</CardTitle>
            <Link to="/dashboard/wh/approvals"><Button size="sm">Go to Approvals →</Button></Link>
          </CardHeader>
          <CardContent>
            {recent.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">No entries from your area yet.</div>
            ) : (
              <div className="divide-y divide-border">
                {recent.map((e) => (
                  <div key={e.id} className="py-3 flex flex-wrap items-center gap-3 justify-between">
                    <div>
                      <div className="font-medium">{e.entryCode} · {warehouseName(e.warehouseId)}</div>
                      <div className="text-xs text-muted-foreground">
                        {e.productName} · {e.quantity} {e.unit} · GR {e.grNumber}
                      </div>
                    </div>
                    <EntryStatusBadge status={e.status} />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </AppShell>
    );
  }

  // -------- SUPERADMIN / ACCOUNTANT / JOA_IT --------
  const totalStaff = store.users.filter((u) => u.role === "warehouse_staff").length;
  return (
    <AppShell>
      <div>
        <h1 className="text-2xl md:text-3xl font-serif font-bold">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back, {user.name} · {ROLE_LABEL[user.role]}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Areas" value={String(store.areas.length)} icon={MapPin} iconColor="text-primary" iconBg="bg-primary/10" />
        <StatCard title="Total Warehouses" value={String(store.warehouses.length)} icon={Warehouse} iconColor="text-secondary" iconBg="bg-secondary/10" />
        <StatCard title="Warehouse Staff" value={String(totalStaff)} icon={Users} iconColor="text-himfed-info" iconBg="bg-himfed-info/10" />
        <StatCard title="Pending Entries" value={String(pending.length)} change={`${today.length} today`} changeType="neutral" icon={Clock} iconColor="text-himfed-warning" iconBg="bg-himfed-warning/10" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Approved Entries" value={String(approved.length)} icon={CheckCircle2} iconColor="text-himfed-success" iconBg="bg-himfed-success/10" />
        <StatCard title="Rejected Entries" value={String(rejected.length)} icon={XCircle} iconColor="text-himfed-danger" iconBg="bg-himfed-danger/10" />
        <StatCard title="Today's Stock In" value={String(today.reduce((s, e) => s + e.quantity, 0))} change="across all units" changeType="positive" icon={TrendingUp} iconColor="text-himfed-success" iconBg="bg-himfed-success/10" />
        <StatCard title="Active Alerts" value="12" change="4 critical" changeType="negative" icon={AlertTriangle} iconColor="text-himfed-danger" iconBg="bg-himfed-danger/10" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Stock Value" value="₹45.2 Cr" change="+12% this month" changeType="positive" icon={IndianRupee} iconColor="text-himfed-success" iconBg="bg-himfed-success/10" />
        <StatCard title="Products Tracked" value="2,847" icon={Package} iconColor="text-secondary" iconBg="bg-secondary/10" />
        <StatCard title="Fuel Credit" value="₹8.2L" change="Pending recovery" changeType="negative" icon={Fuel} iconColor="text-himfed-warning" iconBg="bg-himfed-warning/10" />
        <StatCard title="Pending Transfers" value="23" change="8 require approval" changeType="neutral" icon={Truck} iconColor="text-himfed-info" iconBg="bg-himfed-info/10" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2"><StockOverview /></div>
        <div><AlertsPanel /></div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-serif">Area-wise Entry Snapshot</CardTitle>
          <Link to="/dashboard/wh/entries"><Button variant="ghost" size="sm">Open Monitor →</Button></Link>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {store.areas.map((a) => {
              const list = store.entries.filter((e) => e.areaId === a.id);
              const p = list.filter((x) => x.status === "pending").length;
              const ap = list.filter((x) => x.status === "approved").length;
              return (
                <div key={a.id} className="p-4 rounded-lg border border-border bg-card-gradient">
                  <div className="font-serif font-bold text-lg">{a.name}</div>
                  <div className="text-xs text-muted-foreground mb-3">Officer: {a.officerName}</div>
                  <div className="flex justify-between text-sm">
                    <span className="text-himfed-warning">Pending {p}</span>
                    <span className="text-himfed-success">Approved {ap}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">{list.length} total entries</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <RecentActivity />
    </AppShell>
  );
};

export default Dashboard;
