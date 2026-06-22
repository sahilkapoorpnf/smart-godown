import { useMemo, useState } from "react";
import ErpPage, { fmtINR, Badge } from "@/components/erp/ErpPage";
import CompanySwitcher from "@/components/erp/CompanySwitcher";
import { DataTable } from "@/components/erp/DataTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Printer } from "lucide-react";
import {
  useErp, vouchersForCompany, godownsForCompany, activeCompany,
  ledgerName, itemName, godownName, groupName,
} from "@/lib/erp/store";
import { Navigate } from "react-router-dom";

const allowed: any = ["wh_accountant", "admin_accountant", "accountant", "superadmin"];

function useCompanyData() {
  const { ledgers, groups, stockItems } = useErp();
  const co = activeCompany();
  const vs = co ? vouchersForCompany(co.id) : [];
  const gs = co ? godownsForCompany(co.id) : [];
  return { co, vs, gs, ledgers, groups, stockItems };
}

const printPage = () => window.print();

// ---------- DAY BOOK ----------
export function DayBookTally() {
  const { co, vs } = useCompanyData();
  const [from, setFrom] = useState(""); const [to, setTo] = useState(""); const [kind, setKind] = useState("all");
  if (!co) return <Navigate to="/dashboard/erp/acc/select-company" replace />;
  const rows = vs.filter(v => (kind === "all" || v.kind === kind) && (!from || v.date >= from) && (!to || v.date <= to))
    .sort((a, b) => b.date.localeCompare(a.date));
  let bal = 0;
  return (
    <ErpPage allowed={allowed} title="Day Book" description={`All vouchers chronologically · ${co.name}`}
      actions={<Button variant="outline" onClick={printPage}><Printer className="w-4 h-4 mr-2" />Print</Button>}>
      <CompanySwitcher />
      <DataTable rows={rows} exportName="day-book" searchKeys={["voucherNo", "narration"] as any}
        filters={
          <div className="flex flex-wrap gap-2 items-center">
            <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="w-40 h-9" />
            <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="w-40 h-9" />
            <Select value={kind} onValueChange={setKind}>
              <SelectTrigger className="w-40 h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {["purchase","sales","payment","receipt","journal","contra","stock_transfer"].map(k => <SelectItem key={k} value={k}>{k}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        }
        columns={[
          { key: "date", label: "Date" },
          { key: "voucherNo", label: "Voucher No.", render: r => <span className="font-mono text-xs">{r.voucherNo}</span> },
          { key: "kind", label: "Type", render: r => <Badge tone={r.kind === "purchase" ? "blue" : r.kind === "sales" ? "green" : "amber"}>{r.kind}</Badge> },
          { key: "partyLedgerId", label: "Particulars", render: r => ledgerName(r.partyLedgerId) },
          { key: "narration", label: "Narration", render: r => <span className="text-xs">{r.narration}</span> },
          { key: "debit", label: "Debit", className: "text-right font-mono", render: r => r.kind === "purchase" || r.kind === "payment" ? fmtINR(r.grandTotal) : "—" },
          { key: "credit", label: "Credit", className: "text-right font-mono", render: r => r.kind === "sales" || r.kind === "receipt" ? fmtINR(r.grandTotal) : "—" },
        ]} />
    </ErpPage>
  );
}

// ---------- LEDGER REPORT ----------
export function LedgerReport() {
  const { co, vs, ledgers } = useCompanyData();
  const [lid, setLid] = useState(ledgers[0]?.id ?? "");
  if (!co) return <Navigate to="/dashboard/erp/acc/select-company" replace />;
  const led = ledgers.find(l => l.id === lid);
  const entries = vs.filter(v => v.partyLedgerId === lid || v.lines.some(ln => ln.ledgerId === lid));
  let bal = led?.openingBalance ?? 0;
  const rows = entries.map(v => {
    const dr = v.kind === "sales" || v.kind === "receipt" ? v.grandTotal : 0;
    const cr = v.kind === "purchase" || v.kind === "payment" ? v.grandTotal : 0;
    bal += dr - cr;
    return { id: v.id, date: v.date, voucherNo: v.voucherNo, particulars: v.narration, dr, cr, bal };
  });
  return (
    <ErpPage allowed={allowed} title="Ledger Report" description={`Party/Ledger statement · ${co.name}`}>
      <CompanySwitcher />
      <div className="flex gap-2">
        <Select value={lid} onValueChange={setLid}>
          <SelectTrigger className="w-80 h-9"><SelectValue /></SelectTrigger>
          <SelectContent>{ledgers.map(l => <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>)}</SelectContent>
        </Select>
        <Button variant="outline" onClick={printPage}><Printer className="w-4 h-4 mr-2" />Print</Button>
      </div>
      <Card><CardHeader><CardTitle className="font-serif">{led?.name}</CardTitle></CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead><tr className="text-xs uppercase text-muted-foreground border-b"><th className="text-left py-2">Date</th><th className="text-left">Voucher</th><th className="text-left">Particulars</th><th className="text-right">Dr</th><th className="text-right">Cr</th><th className="text-right">Balance</th></tr></thead>
            <tbody>
              <tr className="border-b font-semibold bg-muted/30"><td className="py-2" colSpan={3}>Opening Balance ({led?.type})</td><td colSpan={2}></td><td className="text-right font-mono">{fmtINR(led?.openingBalance ?? 0)}</td></tr>
              {rows.map(r => (
                <tr key={r.id} className="border-b">
                  <td className="py-1.5">{r.date}</td><td className="font-mono text-xs">{r.voucherNo}</td><td className="text-xs">{r.particulars}</td>
                  <td className="text-right font-mono">{r.dr ? fmtINR(r.dr) : "—"}</td>
                  <td className="text-right font-mono">{r.cr ? fmtINR(r.cr) : "—"}</td>
                  <td className="text-right font-mono">{fmtINR(r.bal)}</td>
                </tr>
              ))}
              <tr className="font-bold bg-himfed-green/10"><td className="py-2" colSpan={5}>Closing Balance</td><td className="text-right font-mono">{fmtINR(bal)}</td></tr>
            </tbody>
          </table>
        </CardContent>
      </Card>
    </ErpPage>
  );
}

// ---------- TRIAL BALANCE ----------
export function TrialBalance() {
  const { co, vs, ledgers, groups } = useCompanyData();
  if (!co) return <Navigate to="/dashboard/erp/acc/select-company" replace />;
  const rows = ledgers.map(l => {
    let dr = l.type === "Dr" ? l.openingBalance : 0;
    let cr = l.type === "Cr" ? l.openingBalance : 0;
    vs.forEach(v => {
      if (v.partyLedgerId === l.id) {
        if (v.kind === "sales" || v.kind === "receipt") dr += v.grandTotal;
        if (v.kind === "purchase" || v.kind === "payment") cr += v.grandTotal;
      }
    });
    const net = dr - cr;
    return { id: l.id, name: l.name, group: groupName(l.groupId), dr: net > 0 ? net : 0, cr: net < 0 ? -net : 0 };
  });
  const totDr = rows.reduce((s, r) => s + r.dr, 0);
  const totCr = rows.reduce((s, r) => s + r.cr, 0);
  return (
    <ErpPage allowed={allowed} title="Trial Balance" description={`As on ${new Date().toLocaleDateString("en-IN")} · ${co.name}`}
      actions={<Button variant="outline" onClick={printPage}><Printer className="w-4 h-4 mr-2" />Print</Button>}>
      <CompanySwitcher />
      <Card><CardContent className="p-4">
        <table className="w-full text-sm">
          <thead><tr className="border-b font-semibold text-xs uppercase text-muted-foreground"><th className="text-left py-2">Particulars</th><th className="text-left">Group</th><th className="text-right">Debit</th><th className="text-right">Credit</th></tr></thead>
          <tbody>
            {rows.map(r => (<tr key={r.id} className="border-b"><td className="py-1.5">{r.name}</td><td className="text-xs text-muted-foreground">{r.group}</td><td className="text-right font-mono">{r.dr ? fmtINR(r.dr) : "—"}</td><td className="text-right font-mono">{r.cr ? fmtINR(r.cr) : "—"}</td></tr>))}
            <tr className="font-bold bg-himfed-green/10"><td className="py-2" colSpan={2}>Grand Total</td><td className="text-right font-mono">{fmtINR(totDr)}</td><td className="text-right font-mono">{fmtINR(totCr)}</td></tr>
          </tbody>
        </table>
      </CardContent></Card>
    </ErpPage>
  );
}

// ---------- CASH BOOK / BANK BOOK ----------
function cashBookFor(vs: any[], ledgerIds: string[], opening: number) {
  const rows: any[] = []; let bal = opening;
  vs.filter(v => v.lines.some((l: any) => ledgerIds.includes(l.ledgerId)) || (v.kind === "receipt" && ledgerIds.includes("l1")) || (v.kind === "payment" && ledgerIds.includes("l1")))
    .sort((a, b) => a.date.localeCompare(b.date))
    .forEach(v => {
      const dr = v.kind === "receipt" ? v.grandTotal : 0;
      const cr = v.kind === "payment" ? v.grandTotal : 0;
      bal += dr - cr;
      rows.push({ id: v.id, date: v.date, voucher: v.voucherNo, particulars: ledgerName(v.partyLedgerId), dr, cr, bal });
    });
  return { rows, closing: bal };
}

export function CashBookReport() {
  const { co, vs, ledgers } = useCompanyData();
  if (!co) return <Navigate to="/dashboard/erp/acc/select-company" replace />;
  const opening = ledgers.find(l => l.id === "l1")?.openingBalance ?? 0;
  const { rows, closing } = cashBookFor(vs, ["l1"], opening);
  return (
    <ErpPage allowed={allowed} title="Cash Book" description={`All cash transactions · ${co.name}`}>
      <CompanySwitcher />
      <Card><CardContent className="p-4"><BookTable opening={opening} rows={rows} closing={closing} /></CardContent></Card>
    </ErpPage>
  );
}

export function BankBookReport() {
  const { co, vs, ledgers } = useCompanyData();
  if (!co) return <Navigate to="/dashboard/erp/acc/select-company" replace />;
  const bankIds = ledgers.filter(l => l.groupId === "ag4").map(l => l.id);
  const opening = ledgers.filter(l => l.groupId === "ag4").reduce((s, l) => s + l.openingBalance, 0);
  const { rows, closing } = cashBookFor(vs, bankIds, opening);
  return (
    <ErpPage allowed={allowed} title="Bank Book" description={`All bank transactions · ${co.name}`}>
      <CompanySwitcher />
      <Card><CardContent className="p-4"><BookTable opening={opening} rows={rows} closing={closing} /></CardContent></Card>
    </ErpPage>
  );
}

function BookTable({ opening, rows, closing }: any) {
  return (
    <table className="w-full text-sm">
      <thead><tr className="border-b text-xs uppercase text-muted-foreground"><th className="text-left py-2">Date</th><th className="text-left">Voucher</th><th className="text-left">Particulars</th><th className="text-right">Receipt</th><th className="text-right">Payment</th><th className="text-right">Balance</th></tr></thead>
      <tbody>
        <tr className="bg-muted/30 font-semibold"><td className="py-2" colSpan={5}>Opening Balance</td><td className="text-right font-mono">{fmtINR(opening)}</td></tr>
        {rows.map((r: any) => (<tr key={r.id} className="border-b"><td className="py-1.5">{r.date}</td><td className="font-mono text-xs">{r.voucher}</td><td className="text-xs">{r.particulars}</td><td className="text-right font-mono">{r.dr ? fmtINR(r.dr) : "—"}</td><td className="text-right font-mono">{r.cr ? fmtINR(r.cr) : "—"}</td><td className="text-right font-mono">{fmtINR(r.bal)}</td></tr>))}
        <tr className="font-bold bg-himfed-green/10"><td className="py-2" colSpan={5}>Closing Balance</td><td className="text-right font-mono">{fmtINR(closing)}</td></tr>
      </tbody>
    </table>
  );
}

// ---------- PURCHASE / SALES REGISTER ----------
function Register({ kind, title }: { kind: "purchase" | "sales"; title: string }) {
  const { co, vs } = useCompanyData();
  if (!co) return <Navigate to="/dashboard/erp/acc/select-company" replace />;
  const rows = vs.filter(v => v.kind === kind);
  return (
    <ErpPage allowed={allowed} title={title} description={`${rows.length} ${kind} entries · ${co.name}`}
      actions={<Button variant="outline" onClick={printPage}><Printer className="w-4 h-4 mr-2" />Print</Button>}>
      <CompanySwitcher />
      <DataTable rows={rows} exportName={`${kind}-register`} searchKeys={["voucherNo", "invoiceNumber"] as any}
        columns={[
          { key: "date", label: "Date", sortable: true },
          { key: "voucherNo", label: "Voucher No.", render: r => <span className="font-mono text-xs">{r.voucherNo}</span> },
          { key: "invoiceNumber", label: "Invoice", render: r => <span className="font-mono text-xs">{r.invoiceNumber ?? "—"}</span> },
          { key: "partyLedgerId", label: kind === "purchase" ? "Supplier" : "Customer", render: r => ledgerName(r.partyLedgerId) },
          { key: "item", label: "Item", render: r => r.lines[0]?.itemId ? `${itemName(r.lines[0].itemId)} × ${r.lines[0].qty}` : "—" },
          { key: "godown", label: "Godown", render: r => godownName(r.lines[0]?.godownFromId ?? r.lines[0]?.godownToId) },
          { key: "total", label: "Sub-total", className: "text-right font-mono", render: r => fmtINR(r.total) },
          { key: "gstTotal", label: "GST", className: "text-right font-mono", render: r => fmtINR(r.gstTotal) },
          { key: "grandTotal", label: "Grand Total", className: "text-right font-mono font-bold", render: r => fmtINR(r.grandTotal) },
        ]} />
    </ErpPage>
  );
}
export const PurchaseRegister = () => <Register kind="purchase" title="Purchase Register" />;
export const SalesRegister = () => <Register kind="sales" title="Sales Register" />;

// ---------- STOCK SUMMARY ----------
export function StockSummary() {
  const { co, vs, gs, stockItems } = useCompanyData();
  if (!co) return <Navigate to="/dashboard/erp/acc/select-company" replace />;

  const summary = stockItems.map(it => {
    let inQty = it.openingQty, outQty = 0, inVal = it.openingValue, outVal = 0;
    vs.forEach(v => v.lines.forEach(ln => {
      if (ln.itemId !== it.id) return;
      const inGodown = gs.some(g => g.id === (ln.godownFromId ?? ln.godownToId));
      if (!inGodown) return;
      if (v.kind === "purchase" && ln.godownToId) { inQty += ln.qty ?? 0; inVal += ln.amount; }
      if (v.kind === "sales" && ln.godownFromId) { outQty += ln.qty ?? 0; outVal += ln.amount; }
      if (v.kind === "stock_transfer") {
        const fromIn = gs.some(g => g.id === ln.godownFromId);
        const toIn = gs.some(g => g.id === ln.godownToId);
        if (fromIn) { outQty += ln.qty ?? 0; outVal += ln.amount; }
        if (toIn) { inQty += ln.qty ?? 0; inVal += ln.amount; }
      }
    }));
    const closingQty = inQty - outQty;
    const value = closingQty * it.ratePerUnit;
    return { id: it.id, name: it.name, hsn: it.hsn, openingQty: it.openingQty, inQty, outQty, closingQty, rate: it.ratePerUnit, value };
  });
  return (
    <ErpPage allowed={allowed} title="Stock Summary" description={`Item-wise position · ${co.name}`}>
      <CompanySwitcher />
      <DataTable rows={summary} exportName="stock-summary" searchKeys={["name", "hsn"] as any}
        columns={[
          { key: "name", label: "Item", render: r => <span className="font-semibold">{r.name}</span> },
          { key: "hsn", label: "HSN" },
          { key: "openingQty", label: "Opening", className: "text-right" },
          { key: "inQty", label: "Inward", className: "text-right text-himfed-success" },
          { key: "outQty", label: "Outward", className: "text-right text-himfed-danger" },
          { key: "closingQty", label: "Closing", className: "text-right font-bold" },
          { key: "rate", label: "Rate", className: "text-right font-mono", render: r => fmtINR(r.rate) },
          { key: "value", label: "Stock Value", className: "text-right font-mono font-bold", render: r => fmtINR(r.value) },
        ]} />
    </ErpPage>
  );
}

// ---------- GODOWN STOCK ----------
export function GodownStockReport() {
  const { co, vs, gs, stockItems } = useCompanyData();
  if (!co) return <Navigate to="/dashboard/erp/acc/select-company" replace />;
  const rows: any[] = [];
  gs.forEach(g => {
    stockItems.forEach(it => {
      let inQty = 0, outQty = 0;
      vs.forEach(v => v.lines.forEach(ln => {
        if (ln.itemId !== it.id) return;
        if (v.kind === "purchase" && ln.godownToId === g.id) inQty += ln.qty ?? 0;
        if (v.kind === "sales" && ln.godownFromId === g.id) outQty += ln.qty ?? 0;
        if (v.kind === "stock_transfer") {
          if (ln.godownFromId === g.id) outQty += ln.qty ?? 0;
          if (ln.godownToId === g.id) inQty += ln.qty ?? 0;
        }
      }));
      const closing = inQty - outQty;
      if (closing !== 0) rows.push({ id: `${g.id}_${it.id}`, godown: g.name, item: it.name, inQty, outQty, closing, value: closing * it.ratePerUnit });
    });
  });
  return (
    <ErpPage allowed={allowed} title="Godown-wise Stock" description={`Warehouse positions · ${co.name}`}>
      <CompanySwitcher />
      <DataTable rows={rows} exportName="godown-stock" searchKeys={["godown", "item"] as any}
        columns={[
          { key: "godown", label: "Warehouse", render: r => <span className="font-semibold">{r.godown}</span> },
          { key: "item", label: "Item" },
          { key: "inQty", label: "In", className: "text-right" },
          { key: "outQty", label: "Out", className: "text-right" },
          { key: "closing", label: "Balance", className: "text-right font-bold" },
          { key: "value", label: "Value", className: "text-right font-mono", render: r => fmtINR(r.value) },
        ]} />
    </ErpPage>
  );
}

// ---------- GST REPORTS ----------
export function GstReportsPage() {
  const { co, vs } = useCompanyData();
  if (!co) return <Navigate to="/dashboard/erp/acc/select-company" replace />;
  const purchase = vs.filter(v => v.kind === "purchase");
  const sales = vs.filter(v => v.kind === "sales");
  const purchaseGst = purchase.reduce((s, v) => s + v.gstTotal, 0);
  const salesGst = sales.reduce((s, v) => s + v.gstTotal, 0);
  const liability = salesGst - purchaseGst;

  const hsnRows: Record<string, any> = {};
  [...purchase, ...sales].forEach(v => {
    v.lines.forEach(ln => {
      if (!ln.itemId) return;
      const key = `${ln.itemId}_${ln.gstRate ?? 0}`;
      hsnRows[key] = hsnRows[key] ?? { id: key, item: itemName(ln.itemId), gstRate: ln.gstRate ?? 0, taxable: 0, cgst: 0, sgst: 0, total: 0 };
      hsnRows[key].taxable += ln.amount;
      hsnRows[key].cgst += (ln.gstAmount ?? 0) / 2;
      hsnRows[key].sgst += (ln.gstAmount ?? 0) / 2;
      hsnRows[key].total += (ln.gstAmount ?? 0);
    });
  });
  return (
    <ErpPage allowed={allowed} title="GST Reports" description={`GST Purchase, Sales & HSN summary · ${co.name}`}>
      <CompanySwitcher />
      <div className="grid grid-cols-3 gap-3">
        <Card><CardContent className="p-4"><div className="text-xs text-muted-foreground">Input GST (Purchases)</div><div className="text-2xl font-bold font-mono text-himfed-info">{fmtINR(purchaseGst)}</div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="text-xs text-muted-foreground">Output GST (Sales)</div><div className="text-2xl font-bold font-mono text-himfed-success">{fmtINR(salesGst)}</div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="text-xs text-muted-foreground">Net GST Liability</div><div className={`text-2xl font-bold font-mono ${liability >= 0 ? "text-destructive" : "text-himfed-success"}`}>{fmtINR(Math.abs(liability))}</div></CardContent></Card>
      </div>
      <DataTable rows={Object.values(hsnRows)} exportName="gst-hsn-summary" searchKeys={["item"] as any}
        columns={[
          { key: "item", label: "Item" },
          { key: "gstRate", label: "Rate", render: r => `${r.gstRate}%` },
          { key: "taxable", label: "Taxable Value", className: "text-right font-mono", render: r => fmtINR(r.taxable) },
          { key: "cgst", label: "CGST", className: "text-right font-mono", render: r => fmtINR(r.cgst) },
          { key: "sgst", label: "SGST", className: "text-right font-mono", render: r => fmtINR(r.sgst) },
          { key: "total", label: "Total GST", className: "text-right font-mono font-bold", render: r => fmtINR(r.total) },
        ]} />
    </ErpPage>
  );
}

// ---------- PROFIT & LOSS ----------
export function ProfitLoss() {
  const { co, vs, ledgers, groups, stockItems } = useCompanyData();
  if (!co) return <Navigate to="/dashboard/erp/acc/select-company" replace />;
  const openingStock = stockItems.reduce((s, i) => s + i.openingValue, 0);
  const purchases = vs.filter(v => v.kind === "purchase").reduce((s, v) => s + v.total, 0);
  const sales = vs.filter(v => v.kind === "sales").reduce((s, v) => s + v.total, 0);
  const directExp = ledgers.filter(l => l.groupId === "ag10").reduce((s, l) => s + l.openingBalance, 0);
  const indirectExp = ledgers.filter(l => l.groupId === "ag11").reduce((s, l) => s + l.openingBalance, 0);
  const indirectInc = ledgers.filter(l => l.groupId === "ag12" || l.groupId === "ag13").reduce((s, l) => s + l.openingBalance, 0);
  const closingStock = openingStock + purchases - vs.filter(v => v.kind === "sales").reduce((s, v) => s + v.lines.reduce((x, ln) => x + (ln.amount * 0.85), 0), 0);
  const gross = sales + closingStock - openingStock - purchases - directExp;
  const net = gross - indirectExp + indirectInc;
  return (
    <ErpPage allowed={allowed} title="Profit & Loss Account" description={`FY ${co.fyStart.slice(0, 4)}-${co.fyEnd.slice(2, 4)} · ${co.name}`}
      actions={<Button variant="outline" onClick={printPage}><Printer className="w-4 h-4 mr-2" />Print</Button>}>
      <CompanySwitcher />
      <Card><CardContent className="p-4">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="font-serif font-bold text-lg mb-3 border-b pb-2">Particulars (Dr)</div>
            <Row label="Opening Stock" value={openingStock} />
            <Row label="To Purchases" value={purchases} />
            <Row label="To Direct Expenses" value={directExp} />
            {gross > 0 && <Row label="To Gross Profit c/d" value={gross} bold />}
            <div className="border-t mt-2 pt-2"><Row label="Total" value={openingStock + purchases + directExp + (gross > 0 ? gross : 0)} bold /></div>
            <div className="mt-4">
              <Row label="To Indirect Expenses" value={indirectExp} />
              {net > 0 && <Row label="To Net Profit" value={net} bold />}
            </div>
          </div>
          <div>
            <div className="font-serif font-bold text-lg mb-3 border-b pb-2">Particulars (Cr)</div>
            <Row label="By Sales" value={sales} />
            <Row label="By Closing Stock" value={closingStock} />
            {gross < 0 && <Row label="By Gross Loss c/d" value={-gross} bold />}
            <div className="border-t mt-2 pt-2"><Row label="Total" value={sales + closingStock + (gross < 0 ? -gross : 0)} bold /></div>
            <div className="mt-4">
              <Row label="By Gross Profit b/d" value={gross > 0 ? gross : 0} />
              <Row label="By Indirect Income" value={indirectInc} />
            </div>
          </div>
        </div>
        <div className={`mt-6 p-4 rounded-lg ${net >= 0 ? "bg-himfed-green/10" : "bg-destructive/10"}`}>
          <div className="text-sm text-muted-foreground">{net >= 0 ? "Net Profit" : "Net Loss"} for the year</div>
          <div className="text-3xl font-bold font-mono">{fmtINR(Math.abs(net))}</div>
        </div>
      </CardContent></Card>
    </ErpPage>
  );
}

// ---------- BALANCE SHEET ----------
export function BalanceSheet() {
  const { co, ledgers, stockItems, vs } = useCompanyData();
  if (!co) return <Navigate to="/dashboard/erp/acc/select-company" replace />;
  const cash = ledgers.find(l => l.id === "l1")?.openingBalance ?? 0;
  const bank = ledgers.filter(l => l.groupId === "ag4").reduce((s, l) => s + l.openingBalance, 0);
  const receivables = ledgers.filter(l => l.groupId === "ag3").reduce((s, l) => s + l.openingBalance, 0);
  const inventory = stockItems.reduce((s, i) => s + i.openingValue, 0) +
    vs.filter(v => v.kind === "purchase").reduce((s, v) => s + v.total, 0) -
    vs.filter(v => v.kind === "sales").reduce((s, v) => s + v.lines.reduce((x, ln) => x + ln.amount * 0.85, 0), 0);
  const payables = ledgers.filter(l => l.groupId === "ag6").reduce((s, l) => s + l.openingBalance, 0);
  const gstPayable = ledgers.filter(l => l.groupId === "ag7").reduce((s, l) => s + l.openingBalance, 0);
  const totalAssets = cash + bank + receivables + inventory;
  const totalLiab = payables + gstPayable;
  const capital = totalAssets - totalLiab;

  return (
    <ErpPage allowed={allowed} title="Balance Sheet" description={`As on ${new Date().toLocaleDateString("en-IN")} · ${co.name}`}
      actions={<Button variant="outline" onClick={printPage}><Printer className="w-4 h-4 mr-2" />Print</Button>}>
      <CompanySwitcher />
      <Card><CardContent className="p-4">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="font-serif font-bold text-lg mb-3 border-b pb-2">Liabilities</div>
            <Row label="Capital A/c" value={capital} />
            <Row label="Sundry Creditors" value={payables} />
            <Row label="Duties & Taxes (GST)" value={gstPayable} />
            <div className="border-t-2 border-himfed-green mt-2 pt-2"><Row label="Total" value={capital + payables + gstPayable} bold /></div>
          </div>
          <div>
            <div className="font-serif font-bold text-lg mb-3 border-b pb-2">Assets</div>
            <Row label="Cash-in-Hand" value={cash} />
            <Row label="Bank Accounts" value={bank} />
            <Row label="Sundry Debtors" value={receivables} />
            <Row label="Closing Stock" value={inventory} />
            <div className="border-t-2 border-himfed-green mt-2 pt-2"><Row label="Total" value={totalAssets} bold /></div>
          </div>
        </div>
      </CardContent></Card>
    </ErpPage>
  );
}

function Row({ label, value, bold }: { label: string; value: number; bold?: boolean }) {
  return (
    <div className={`flex justify-between py-1.5 ${bold ? "font-bold" : ""}`}>
      <span>{label}</span><span className="font-mono">{fmtINR(value)}</span>
    </div>
  );
}
