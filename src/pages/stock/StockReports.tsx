import { useMemo } from "react";
import AppShell from "@/components/warehouse/AppShell";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { getCurrentUser, store as wh, areaName, warehouseName } from "@/lib/warehouse/store";
import { useFertilizerStore, productName } from "@/lib/fertilizer/store";
import { useStockStore, visibleStockEntries, visibleInvoices } from "@/lib/stock/store";

const colors = ["hsl(var(--primary))", "hsl(var(--himfed-success))", "hsl(var(--himfed-warning))", "hsl(var(--himfed-danger))", "#6366f1", "#f59e0b", "#10b981"];

export default function StockReports() {
  const user = getCurrentUser();
  useStockStore();
  useFertilizerStore();
  const entries = useMemo(() => visibleStockEntries(user as any), [user]);
  const invoices = useMemo(() => visibleInvoices(user), [user]);

  const areaStock = wh.areas.map((a) => ({
    name: a.name,
    bags: entries.filter((e) => e.areaId === a.id && e.status === "approved").reduce((s, e) => s + e.quantity, 0),
  }));

  const whStock = wh.warehouses.map((w) => ({
    name: w.name.split(" ")[0],
    bags: entries.filter((e) => e.warehouseId === w.id && e.status === "approved").reduce((s, e) => s + e.quantity, 0),
  }));

  const fertSales: Record<string, number> = {};
  invoices.forEach((i) => i.lines.forEach((l) => { fertSales[l.productId] = (fertSales[l.productId] || 0) + l.amount; }));
  const pieData = Object.entries(fertSales).map(([pid, v]) => ({ name: productName(pid), value: v }));

  // monthly comparison last 6 months
  const months = Array.from({ length: 6 }, (_, i) => {
    const dt = new Date(); dt.setMonth(dt.getMonth() - (5 - i));
    return { key: `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}`, label: dt.toLocaleString("default", { month: "short" }) };
  });
  const monthly = months.map((m) => ({
    month: m.label,
    stock: entries.filter((e) => e.depotDate.startsWith(m.key) && e.status === "approved").reduce((s, e) => s + e.quantity, 0),
    sales: invoices.filter((i) => i.invoiceDate.startsWith(m.key)).reduce((s, i) => s + i.grandTotal, 0) / 1000, // in K
  }));

  const pending = entries.filter((e) => e.status === "pending").length;
  const revenue = invoices.reduce((s, i) => s + i.grandTotal, 0);

  return (
    <AppShell allowed={["superadmin", "accountant", "joa_it", "incharge"]}>
      <PageHeader title="Reports & Analytics" description="Live insights across areas, warehouses, sales and stock." icon={BarChart3} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card><CardContent className="pt-4"><div className="text-xs text-muted-foreground">Total Bags in Stock</div><div className="text-2xl font-bold text-primary">{areaStock.reduce((s, a) => s + a.bags, 0)}</div></CardContent></Card>
        <Card><CardContent className="pt-4"><div className="text-xs text-muted-foreground">Total Revenue</div><div className="text-2xl font-bold text-himfed-success">₹{revenue.toLocaleString()}</div></CardContent></Card>
        <Card><CardContent className="pt-4"><div className="text-xs text-muted-foreground">Invoices</div><div className="text-2xl font-bold">{invoices.length}</div></CardContent></Card>
        <Card><CardContent className="pt-4"><div className="text-xs text-himfed-warning">Pending Approvals</div><div className="text-2xl font-bold text-himfed-warning">{pending}</div></CardContent></Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card><CardContent className="pt-6">
          <div className="text-sm font-semibold mb-2">Area-wise Stock (bags)</div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={areaStock}><XAxis dataKey="name" fontSize={11} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="bags" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} /></BarChart>
          </ResponsiveContainer>
        </CardContent></Card>

        <Card><CardContent className="pt-6">
          <div className="text-sm font-semibold mb-2">Warehouse-wise Stock</div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={whStock}><XAxis dataKey="name" fontSize={11} /><YAxis fontSize={11} /><Tooltip /><Bar dataKey="bags" fill="hsl(var(--himfed-success))" radius={[6, 6, 0, 0]} /></BarChart>
          </ResponsiveContainer>
        </CardContent></Card>

        <Card><CardContent className="pt-6">
          <div className="text-sm font-semibold mb-2">Fertilizer-wise Sales Share</div>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={90} label={(e: any) => `${e.name}`}>
                {pieData.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent></Card>

        <Card><CardContent className="pt-6">
          <div className="text-sm font-semibold mb-2">Monthly Stock vs Sales (₹K)</div>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={monthly}>
              <XAxis dataKey="month" fontSize={11} /><YAxis fontSize={11} /><Tooltip /><Legend />
              <Line type="monotone" dataKey="stock" stroke="hsl(var(--primary))" strokeWidth={2} />
              <Line type="monotone" dataKey="sales" stroke="hsl(var(--himfed-success))" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent></Card>
      </div>
    </AppShell>
  );
}
