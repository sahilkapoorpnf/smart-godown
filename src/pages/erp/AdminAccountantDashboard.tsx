import { Navigate, Link } from "react-router-dom";
import ErpPage, { StatTile, fmtINR, Badge } from "@/components/erp/ErpPage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getCurrentUser, store as whStore } from "@/lib/warehouse/store";
import { useErp, computeStockByGodown, godownName } from "@/lib/erp/store";
import { Users, ShieldCheck, FileText, LayoutDashboard } from "lucide-react";

export default function AdminAccountantDashboard() {
  const user = getCurrentUser();
  const { vouchers, ledgers, godowns, stockItems, arrivals } = useErp();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "admin_accountant") return <Navigate to="/dashboard" replace />;

  const totalSales = vouchers.filter((v) => v.kind === "sales").reduce((s, v) => s + v.total, 0);
  const totalPurchases = vouchers.filter((v) => v.kind === "purchase").reduce((s, v) => s + v.total, 0);
  const totalExpenses = 433000;
  const totalIncome = totalSales + 125000;
  const gross = totalSales - totalPurchases;
  const net = gross - totalExpenses;
  const receivables = ledgers.filter((l) => l.groupId === "ag3").reduce((s, l) => s + l.openingBalance, 0);
  const payables = ledgers.filter((l) => l.groupId === "ag6").reduce((s, l) => s + l.openingBalance, 0);

  const stockMap = computeStockByGodown();
  const godownTotals = godowns.map((g) => {
    let val = 0;
    Object.entries(stockMap[g.id] ?? {}).forEach(([iid, r]) => { val += r.inQty * (stockItems.find(i => i.id === iid)?.ratePerUnit ?? 0); });
    return { ...g, value: val };
  }).sort((a, b) => b.value - a.value);

  const totalStockValue = godownTotals.reduce((s, g) => s + g.value, 0);
  const fast = [...stockItems].sort((a, b) => b.openingQty - a.openingQty).slice(0, 3);
  const slow = [...stockItems].sort((a, b) => a.openingQty - b.openingQty).slice(0, 3);
  const lowStock = stockItems.filter((it) => it.openingQty < 600);

  return (
    <ErpPage allowed={["admin_accountant"]} title="Super Accountant — HQ Dashboard"
      description="Centralised view of every area, every godown, every account."
      actions={<>
        <Button asChild variant="outline"><Link to="/dashboard/erp/admin/users"><Users className="w-4 h-4 mr-2" />Users</Link></Button>
        <Button asChild variant="outline"><Link to="/dashboard/erp/admin/audit"><ShieldCheck className="w-4 h-4 mr-2" />Audit Trail</Link></Button>
        <Button asChild><Link to="/dashboard/erp/acc/daybook"><LayoutDashboard className="w-4 h-4 mr-2" />Open Tally</Link></Button>
      </>}>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile label="Total Purchases" value={fmtINR(totalPurchases)} sub="FY 2026-27" tone="blue" />
        <StatTile label="Total Sales" value={fmtINR(totalSales)} sub={`${vouchers.filter(v=>v.kind==="sales").length} invoices`} tone="green" />
        <StatTile label="Gross Profit" value={fmtINR(gross)} sub="Sales – Purchase" tone="amber" />
        <StatTile label="Net Profit" value={fmtINR(net)} sub="After expenses" tone={net >= 0 ? "green" : "red"} />
        <StatTile label="Total Stock Value" value={fmtINR(totalStockValue)} sub={`${godowns.length} godowns`} />
        <StatTile label="Receivables" value={fmtINR(receivables)} sub="Sundry debtors" tone="green" />
        <StatTile label="Payables" value={fmtINR(payables)} sub="Sundry creditors" tone="red" />
        <StatTile label="Pending Arrivals" value={arrivals.filter((a) => a.status === "pending").length} sub="Awaiting approval" tone="amber" />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-lg font-serif">Area / Godown-wise Stock Value</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {godownTotals.map((g) => {
              const pct = totalStockValue ? Math.round((g.value / totalStockValue) * 100) : 0;
              return (
                <div key={g.id}>
                  <div className="flex justify-between text-sm"><span>{g.name}</span><span className="font-mono font-semibold">{fmtINR(g.value)}</span></div>
                  <div className="h-2 bg-muted rounded-full mt-1"><div className="h-2 bg-himfed-green rounded-full" style={{ width: `${pct}%` }} /></div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-lg font-serif">Fast / Slow Moving Items</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <div className="text-xs uppercase text-himfed-green font-semibold mb-2">Fast Moving</div>
                {fast.map((i) => <div key={i.id} className="py-1">{i.name} <span className="text-muted-foreground">· {i.openingQty}</span></div>)}
              </div>
              <div>
                <div className="text-xs uppercase text-destructive font-semibold mb-2">Slow Moving</div>
                {slow.map((i) => <div key={i.id} className="py-1">{i.name} <span className="text-muted-foreground">· {i.openingQty}</span></div>)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-lg font-serif">Low Stock Alerts</CardTitle></CardHeader>
            <CardContent className="space-y-1.5">
              {lowStock.length === 0 ? <div className="text-sm text-muted-foreground">All items above threshold.</div>
                : lowStock.map((i) => (
                  <div key={i.id} className="flex justify-between text-sm">
                    <span>{i.name}</span>
                    <Badge tone={i.openingQty < 300 ? "red" : "amber"}>{i.openingQty} units</Badge>
                  </div>
                ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </ErpPage>
  );
}
