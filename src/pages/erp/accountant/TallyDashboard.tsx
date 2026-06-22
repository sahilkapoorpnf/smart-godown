import { Navigate, Link } from "react-router-dom";
import ErpPage, { StatTile, Badge, fmtINR } from "@/components/erp/ErpPage";
import CompanySwitcher from "@/components/erp/CompanySwitcher";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/warehouse/store";
import { useErp, ledgerName, vouchersForCompany, godownsForCompany, activeCompany } from "@/lib/erp/store";
import { BookOpen, FileText, Package, Receipt, Wallet, Landmark, Truck, ArrowLeftRight, ScrollText, FileMinus } from "lucide-react";

const today = new Date().toISOString().slice(0, 10);

export default function TallyDashboard() {
  const user = getCurrentUser();
  const { ledgers, arrivals } = useErp();
  const co = activeCompany();
  if (!user) return <Navigate to="/login" replace />;
  if (!co) return <Navigate to="/dashboard/erp/acc/select-company" replace />;

  const vs = vouchersForCompany(co.id);
  const gs = godownsForCompany(co.id);

  const todayPurchases = vs.filter((v) => v.kind === "purchase" && v.date === today).reduce((s, v) => s + v.grandTotal, 0);
  const todaySales = vs.filter((v) => v.kind === "sales" && v.date === today).reduce((s, v) => s + v.grandTotal, 0);
  const totalPurchases = vs.filter((v) => v.kind === "purchase").reduce((s, v) => s + v.grandTotal, 0);
  const totalSales = vs.filter((v) => v.kind === "sales").reduce((s, v) => s + v.grandTotal, 0);
  const cash = ledgers.find((l) => l.id === "l1")?.openingBalance ?? 0;
  const bank = ledgers.filter((l) => l.groupId === "ag4").reduce((s, l) => s + l.openingBalance, 0);
  const receivables = ledgers.filter((l) => l.groupId === "ag3").reduce((s, l) => s + l.openingBalance, 0);
  const payables = ledgers.filter((l) => l.groupId === "ag6").reduce((s, l) => s + l.openingBalance, 0);

  const stockValue = vs.reduce((sum, v) => {
    v.lines.forEach((ln) => {
      if (!ln.itemId) return;
      if (v.kind === "purchase") sum += ln.amount;
      if (v.kind === "sales") sum -= ln.amount;
    });
    return sum;
  }, 0);

  const pendingArrivals = arrivals.filter((a) => a.status === "approved" && !vs.some((v) => v.linkedArrivalId === a.id) && a.areaId === co.areaId).length;
  const recent = [...vs].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 10);

  return (
    <ErpPage
      allowed={["wh_accountant", "admin_accountant", "accountant", "superadmin"]}
      title={`Tally Workspace — ${co.name}`}
      description={`Financial Year ${co.fyStart.slice(0, 4)}-${co.fyEnd.slice(2, 4)} · GSTIN ${co.gstNumber} · ${user.name}`}
    >
      <CompanySwitcher />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile label="Today's Purchases" value={fmtINR(todayPurchases || totalPurchases)} sub={`${vs.filter(v => v.kind === "purchase").length} vouchers`} tone="blue" />
        <StatTile label="Today's Sales" value={fmtINR(todaySales || totalSales)} sub={`${vs.filter(v => v.kind === "sales").length} vouchers`} tone="green" />
        <StatTile label="Current Stock Value" value={fmtINR(stockValue)} sub={`${gs.length} godown(s)`} tone="amber" />
        <StatTile label="Pending Vouchers" value={pendingArrivals} sub="Approved arrivals → draft" tone="red" />
        <StatTile label="Cash Balance" value={fmtINR(cash)} sub="Cash-in-Hand" />
        <StatTile label="Bank Balance" value={fmtINR(bank)} sub={`${ledgers.filter(l => l.groupId === "ag4").length} bank accounts`} />
        <StatTile label="Receivables" value={fmtINR(receivables)} sub="Sundry Debtors" tone="green" />
        <StatTile label="Payables" value={fmtINR(payables)} sub="Sundry Creditors" tone="red" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-serif">Day Book — Recent Vouchers</CardTitle>
            <Button asChild size="sm" variant="outline"><Link to="/dashboard/erp/acc/daybook"><BookOpen className="w-4 h-4 mr-1" />Open Day Book</Link></Button>
          </CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <thead><tr className="text-xs text-muted-foreground uppercase">
                <th className="text-left py-2">Date</th><th className="text-left">Voucher No.</th><th className="text-left">Type</th><th className="text-left">Particulars</th><th className="text-right">Amount</th>
              </tr></thead>
              <tbody>
                {recent.map((v) => (
                  <tr key={v.id} className="border-t border-border">
                    <td className="py-2">{v.date}</td>
                    <td className="font-mono text-xs">{v.voucherNo}</td>
                    <td><Badge tone={v.kind === "purchase" ? "blue" : v.kind === "sales" ? "green" : "amber"}>{v.kind}</Badge></td>
                    <td className="text-xs">{ledgerName(v.partyLedgerId)}</td>
                    <td className="text-right font-mono font-semibold">{fmtINR(v.grandTotal)}</td>
                  </tr>
                ))}
                {recent.length === 0 && <tr><td colSpan={5} className="text-center text-muted-foreground py-8">No vouchers yet for this company.</td></tr>}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-lg font-serif">Gateway of Tally</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-2 gap-2">
            {[
              { i: Receipt, l: "Purchase", to: "/dashboard/erp/acc/purchase" },
              { i: FileText, l: "Sales", to: "/dashboard/erp/acc/sales" },
              { i: Wallet, l: "Payment", to: "/dashboard/erp/acc/payment" },
              { i: Landmark, l: "Receipt", to: "/dashboard/erp/acc/receipt" },
              { i: BookOpen, l: "Journal", to: "/dashboard/erp/acc/journal" },
              { i: ArrowLeftRight, l: "Contra", to: "/dashboard/erp/acc/contra" },
              { i: Truck, l: "Stock Tfr", to: "/dashboard/erp/acc/stock-transfer" },
              { i: Package, l: "Stock", to: "/dashboard/erp/acc/current-stock" },
              { i: ScrollText, l: "Day Book", to: "/dashboard/erp/acc/daybook" },
              { i: FileMinus, l: "Reports", to: "/dashboard/erp/acc/reports" },
            ].map((b) => (
              <Button key={b.to} asChild variant="outline" className="h-auto flex-col gap-1 py-3">
                <Link to={b.to}><b.i className="w-5 h-5" /><span className="text-xs">{b.l}</span></Link>
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>
    </ErpPage>
  );
}
