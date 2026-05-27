import { useMemo, useState } from "react";
import AppShell from "@/components/warehouse/AppShell";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, Column } from "@/components/shared/DataTable";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart3, Download } from "lucide-react";
import { getCurrentUser, store as wh, areaName, warehouseName, userName } from "@/lib/warehouse/store";
import { useFertilizerStore, companyName, productName } from "@/lib/fertilizer/store";
import { useStockStore, visibleStockEntries, downloadCSV } from "@/lib/stock/store";
import type { DailyStockEntry } from "@/lib/stock/types";

const badge: Record<string, string> = {
  pending: "bg-himfed-warning/15 text-himfed-warning border-himfed-warning/30",
  approved: "bg-himfed-success/15 text-himfed-success border-himfed-success/30",
  rejected: "bg-himfed-danger/15 text-himfed-danger border-himfed-danger/30",
};

export default function StockListing() {
  const user = getCurrentUser();
  useStockStore();
  const { products, companies } = useFertilizerStore();

  const all = useMemo(() => visibleStockEntries(user as any), [user]);

  const [filters, setFilters] = useState({
    areaId: "all", warehouseId: "all", companyId: "all", productId: "all",
    status: "all", period: "all", from: "", to: "",
  });

  const filtered = useMemo(() => {
    const today = new Date();
    return all.filter((e) => {
      if (filters.areaId !== "all" && e.areaId !== filters.areaId) return false;
      if (filters.warehouseId !== "all" && e.warehouseId !== filters.warehouseId) return false;
      if (filters.companyId !== "all" && e.companyId !== filters.companyId) return false;
      if (filters.productId !== "all" && e.productId !== filters.productId) return false;
      if (filters.status !== "all" && e.status !== filters.status) return false;
      const dt = new Date(e.depotDate);
      if (filters.period === "daily" && dt.toISOString().slice(0, 10) !== today.toISOString().slice(0, 10)) return false;
      if (filters.period === "monthly" && (dt.getMonth() !== today.getMonth() || dt.getFullYear() !== today.getFullYear())) return false;
      if (filters.period === "yearly" && dt.getFullYear() !== today.getFullYear()) return false;
      if (filters.from && e.depotDate < filters.from) return false;
      if (filters.to && e.depotDate > filters.to) return false;
      return true;
    });
  }, [all, filters]);

  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);
  const summary = {
    today: all.filter((e) => e.depotDate === todayStr && e.status === "approved").reduce((s, e) => s + e.quantity, 0),
    month: all.filter((e) => { const d = new Date(e.depotDate); return d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear() && e.status === "approved"; }).reduce((s, e) => s + e.quantity, 0),
    year: all.filter((e) => { const d = new Date(e.depotDate); return d.getFullYear() === today.getFullYear() && e.status === "approved"; }).reduce((s, e) => s + e.quantity, 0),
    pending: all.filter((e) => e.status === "pending").length,
    approved: all.filter((e) => e.status === "approved").length,
  };

  const areaWh = filters.areaId === "all" ? wh.warehouses : wh.warehouses.filter((w) => w.areaId === filters.areaId);

  const cols: Column<DailyStockEntry>[] = [
    { key: "entryCode", label: "Entry ID", sortable: true },
    { key: "areaId", label: "Area", render: (e) => areaName(e.areaId) },
    { key: "warehouseId", label: "Warehouse", render: (e) => warehouseName(e.warehouseId) },
    { key: "depotDate", label: "Date", sortable: true },
    { key: "grNumber", label: "GR No." },
    { key: "truckNumber", label: "Truck" },
    { key: "companyId", label: "Company", render: (e) => companyName(e.companyId) },
    { key: "productId", label: "Fertilizer", render: (e) => productName(e.productId) },
    { key: "quantity", label: "Qty", render: (e) => `${e.quantity}` },
    { key: "ratePerBag", label: "Rate", render: (e) => `₹${e.ratePerBag}` },
    { key: "totalAmount", label: "Amount", render: (e) => `₹${e.totalAmount.toLocaleString()}` },
    { key: "status", label: "Status", render: (e) => <Badge variant="outline" className={badge[e.status]}>{e.status.toUpperCase()}</Badge> },
    { key: "createdBy", label: "Created By", render: (e) => userName(e.createdBy) },
    { key: "approvedBy", label: "Approved By", render: (e) => e.approvedBy ? userName(e.approvedBy) : "—" },
    { key: "approvedAt", label: "Approved Date", render: (e) => e.approvedAt ? e.approvedAt.slice(0, 10) : "—" },
  ];

  const exportCsv = () => {
    downloadCSV("stock-listing.csv", filtered.map((e) => ({
      EntryID: e.entryCode, Area: areaName(e.areaId), Warehouse: warehouseName(e.warehouseId),
      Date: e.depotDate, GR: e.grNumber, Truck: e.truckNumber,
      Company: companyName(e.companyId), Fertilizer: productName(e.productId),
      Qty: e.quantity, Rate: e.ratePerBag, Amount: e.totalAmount,
      Status: e.status, CreatedBy: userName(e.createdBy),
      ApprovedBy: e.approvedBy ? userName(e.approvedBy) : "",
      ApprovedDate: e.approvedAt?.slice(0, 10) ?? "",
    })));
  };

  return (
    <AppShell allowed={["superadmin", "incharge", "accountant", "warehouse_staff", "joa_it"]}>
      <PageHeader title="Stock Listing & Analytics" description="Advanced filter, search, sort and export of all stock receipts." icon={BarChart3} />

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Card><CardContent className="pt-4"><div className="text-xs text-muted-foreground">Today (bags)</div><div className="text-2xl font-bold text-primary">{summary.today}</div></CardContent></Card>
        <Card><CardContent className="pt-4"><div className="text-xs text-muted-foreground">This Month</div><div className="text-2xl font-bold">{summary.month}</div></CardContent></Card>
        <Card><CardContent className="pt-4"><div className="text-xs text-muted-foreground">This Year</div><div className="text-2xl font-bold">{summary.year}</div></CardContent></Card>
        <Card><CardContent className="pt-4"><div className="text-xs text-himfed-warning">Pending</div><div className="text-2xl font-bold text-himfed-warning">{summary.pending}</div></CardContent></Card>
        <Card><CardContent className="pt-4"><div className="text-xs text-himfed-success">Approved</div><div className="text-2xl font-bold text-himfed-success">{summary.approved}</div></CardContent></Card>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            <div><Label className="text-xs">Area</Label>
              <Select value={filters.areaId} onValueChange={(v) => setFilters({ ...filters, areaId: v, warehouseId: "all" })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent className="bg-popover"><SelectItem value="all">All Areas</SelectItem>{wh.areas.map((a) => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label className="text-xs">Warehouse</Label>
              <Select value={filters.warehouseId} onValueChange={(v) => setFilters({ ...filters, warehouseId: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent className="bg-popover"><SelectItem value="all">All</SelectItem>{areaWh.map((w) => <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label className="text-xs">Company</Label>
              <Select value={filters.companyId} onValueChange={(v) => setFilters({ ...filters, companyId: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent className="bg-popover"><SelectItem value="all">All</SelectItem>{companies.map((c) => <SelectItem key={c.id} value={c.id}>{c.code}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label className="text-xs">Fertilizer</Label>
              <Select value={filters.productId} onValueChange={(v) => setFilters({ ...filters, productId: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent className="bg-popover"><SelectItem value="all">All</SelectItem>{products.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label className="text-xs">Status</Label>
              <Select value={filters.status} onValueChange={(v) => setFilters({ ...filters, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent className="bg-popover">
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label className="text-xs">Period</Label>
              <Select value={filters.period} onValueChange={(v) => setFilters({ ...filters, period: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent className="bg-popover">
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="daily">Today</SelectItem>
                  <SelectItem value="monthly">This Month</SelectItem>
                  <SelectItem value="yearly">This Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label className="text-xs">From</Label><Input type="date" value={filters.from} onChange={(e) => setFilters({ ...filters, from: e.target.value })} /></div>
            <div><Label className="text-xs">To</Label><Input type="date" value={filters.to} onChange={(e) => setFilters({ ...filters, to: e.target.value })} /></div>
            <div className="flex items-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setFilters({ areaId: "all", warehouseId: "all", companyId: "all", productId: "all", status: "all", period: "all", from: "", to: "" })}>Reset</Button>
              <Button size="sm" onClick={exportCsv}><Download className="w-4 h-4 mr-1" /> CSV</Button>
            </div>
          </div>

          <DataTable data={filtered} columns={cols} searchKey="grNumber" searchPlaceholder="Search GR no..." showExport={false} pageSize={15} />
        </CardContent>
      </Card>
    </AppShell>
  );
}
