import { useMemo, useState } from "react";
import AppShell from "@/components/warehouse/AppShell";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, Column } from "@/components/shared/DataTable";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Receipt, Download } from "lucide-react";
import { getCurrentUser, store as wh, areaName, warehouseName } from "@/lib/warehouse/store";
import { useFertilizerStore, productName } from "@/lib/fertilizer/store";
import { useStockStore, visibleInvoices, downloadCSV } from "@/lib/stock/store";
import type { SalesInvoice } from "@/lib/stock/types";

export default function SalesHistory() {
  const user = getCurrentUser();
  useStockStore();
  const { products } = useFertilizerStore();
  const all = useMemo(() => visibleInvoices(user), [user]);

  const [f, setF] = useState({ areaId: "all", warehouseId: "all", productId: "all", period: "all", customer: "" });
  const filtered = useMemo(() => {
    const today = new Date();
    return all.filter((i) => {
      if (f.areaId !== "all" && i.areaId !== f.areaId) return false;
      if (f.warehouseId !== "all" && i.warehouseId !== f.warehouseId) return false;
      if (f.productId !== "all" && !i.lines.some((l) => l.productId === f.productId)) return false;
      if (f.customer && !i.customerName.toLowerCase().includes(f.customer.toLowerCase())) return false;
      const dt = new Date(i.invoiceDate);
      if (f.period === "daily" && dt.toISOString().slice(0, 10) !== today.toISOString().slice(0, 10)) return false;
      if (f.period === "monthly" && (dt.getMonth() !== today.getMonth() || dt.getFullYear() !== today.getFullYear())) return false;
      if (f.period === "yearly" && dt.getFullYear() !== today.getFullYear()) return false;
      return true;
    });
  }, [all, f]);

  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);
  const stats = {
    daily: all.filter((i) => i.invoiceDate === todayStr).reduce((s, i) => s + i.grandTotal, 0),
    month: all.filter((i) => { const d = new Date(i.invoiceDate); return d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear(); }).reduce((s, i) => s + i.grandTotal, 0),
    total: all.reduce((s, i) => s + i.grandTotal, 0),
    count: all.length,
  };

  const fertSales: Record<string, number> = {};
  all.forEach((i) => i.lines.forEach((l) => { fertSales[l.productId] = (fertSales[l.productId] || 0) + l.amount; }));

  const cols: Column<SalesInvoice>[] = [
    { key: "invoiceNumber", label: "Invoice No.", sortable: true },
    { key: "invoiceDate", label: "Date", sortable: true },
    { key: "customerName", label: "Customer" },
    { key: "lines", label: "Fertilizer", render: (i) => i.lines.map(l => productName(l.productId)).join(", ") },
    { key: "lines", label: "Qty", render: (i) => i.lines.reduce((s, l) => s + l.qty, 0) },
    { key: "areaId", label: "Area", render: (i) => areaName(i.areaId) },
    { key: "warehouseId", label: "Warehouse", render: (i) => warehouseName(i.warehouseId) },
    { key: "grandTotal", label: "Amount", render: (i) => <span className="font-semibold">₹{i.grandTotal.toLocaleString()}</span> },
  ];

  const areaWh = f.areaId === "all" ? wh.warehouses : wh.warehouses.filter((w) => w.areaId === f.areaId);
  const exp = () => downloadCSV("sales-history.csv", filtered.map((i) => ({
    Invoice: i.invoiceNumber, Date: i.invoiceDate, Customer: i.customerName,
    GST: i.customerGst, Area: areaName(i.areaId), Warehouse: warehouseName(i.warehouseId),
    Fertilizer: i.lines.map(l => productName(l.productId)).join("|"),
    Qty: i.lines.reduce((s, l) => s + l.qty, 0), Amount: i.grandTotal,
  })));

  return (
    <AppShell allowed={["superadmin", "accountant", "incharge", "warehouse_staff", "joa_it"]}>
      <PageHeader title="Sales History" description="All generated invoices with revenue analytics." icon={Receipt} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card><CardContent className="pt-4"><div className="text-xs text-muted-foreground">Today's Sales</div><div className="text-2xl font-bold text-primary">₹{stats.daily.toLocaleString()}</div></CardContent></Card>
        <Card><CardContent className="pt-4"><div className="text-xs text-muted-foreground">Monthly Sales</div><div className="text-2xl font-bold">₹{stats.month.toLocaleString()}</div></CardContent></Card>
        <Card><CardContent className="pt-4"><div className="text-xs text-muted-foreground">Total Revenue</div><div className="text-2xl font-bold text-himfed-success">₹{stats.total.toLocaleString()}</div></CardContent></Card>
        <Card><CardContent className="pt-4"><div className="text-xs text-muted-foreground">Invoices</div><div className="text-2xl font-bold">{stats.count}</div></CardContent></Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="text-sm font-semibold mb-2">Fertilizer-wise Sales</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {Object.entries(fertSales).map(([pid, amt]) => (
              <div key={pid} className="p-2 rounded border bg-muted/30 text-xs">
                <div className="text-muted-foreground">{productName(pid)}</div>
                <div className="text-base font-bold text-primary">₹{amt.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            <div><Label className="text-xs">Area</Label>
              <Select value={f.areaId} onValueChange={(v) => setF({ ...f, areaId: v, warehouseId: "all" })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent className="bg-popover"><SelectItem value="all">All</SelectItem>{wh.areas.map((a) => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label className="text-xs">Warehouse</Label>
              <Select value={f.warehouseId} onValueChange={(v) => setF({ ...f, warehouseId: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent className="bg-popover"><SelectItem value="all">All</SelectItem>{areaWh.map((w) => <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label className="text-xs">Fertilizer</Label>
              <Select value={f.productId} onValueChange={(v) => setF({ ...f, productId: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent className="bg-popover"><SelectItem value="all">All</SelectItem>{products.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label className="text-xs">Period</Label>
              <Select value={f.period} onValueChange={(v) => setF({ ...f, period: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent className="bg-popover"><SelectItem value="all">All</SelectItem><SelectItem value="daily">Today</SelectItem><SelectItem value="monthly">Month</SelectItem><SelectItem value="yearly">Year</SelectItem></SelectContent>
              </Select>
            </div>
            <div><Label className="text-xs">Customer</Label><Input value={f.customer} onChange={(e) => setF({ ...f, customer: e.target.value })} placeholder="Search..." /></div>
            <div className="flex items-end"><Button size="sm" onClick={exp}><Download className="w-4 h-4 mr-1" /> CSV</Button></div>
          </div>
          <DataTable data={filtered} columns={cols} searchKey="invoiceNumber" searchPlaceholder="Search invoice..." showExport={false} pageSize={15} />
        </CardContent>
      </Card>
    </AppShell>
  );
}
