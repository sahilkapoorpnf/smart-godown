import ErpPage, { fmtINR, Badge } from "@/components/erp/ErpPage";
import { DataTable } from "@/components/erp/DataTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useErp, ledgerName, groupName } from "@/lib/erp/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AccountingReports() {
  const { vouchers, ledgers, groups } = useErp();

  // Trial Balance
  const balances: Record<string, { dr: number; cr: number }> = {};
  ledgers.forEach((l) => { balances[l.id] = { dr: l.type === "Dr" ? l.openingBalance : 0, cr: l.type === "Cr" ? l.openingBalance : 0 }; });
  vouchers.forEach((v) => {
    if (v.partyLedgerId && balances[v.partyLedgerId]) {
      if (v.kind === "purchase" || v.kind === "receipt") balances[v.partyLedgerId].cr += v.grandTotal;
      if (v.kind === "sales" || v.kind === "payment") balances[v.partyLedgerId].dr += v.grandTotal;
    }
  });
  const tbRows = ledgers.map((l) => ({ id: l.id, ledger: l.name, group: groupName(l.groupId), dr: balances[l.id].dr, cr: balances[l.id].cr }));
  const totDr = tbRows.reduce((s, r) => s + r.dr, 0);
  const totCr = tbRows.reduce((s, r) => s + r.cr, 0);

  // P&L
  const sales = vouchers.filter((v) => v.kind === "sales").reduce((s, v) => s + v.total, 0);
  const purchases = vouchers.filter((v) => v.kind === "purchase").reduce((s, v) => s + v.total, 0);
  const directExp = 245000; const indirectExp = 188000;
  const grossProfit = sales - purchases;
  const netProfit = grossProfit - directExp - indirectExp;

  // GST Register
  const gstRows = vouchers.filter((v) => v.gstTotal > 0).map((v) => ({
    id: v.id, date: v.date, voucherNo: v.voucherNo, kind: v.kind, party: ledgerName(v.partyLedgerId),
    taxable: v.total, gst: v.gstTotal, total: v.grandTotal, invoice: v.invoiceNumber ?? "—",
  }));

  return (
    <ErpPage allowed={["wh_accountant", "admin_accountant"]} title="Accounting & Financial Reports" description="Trial Balance · P&L · Balance Sheet · GST Registers">
      <Tabs defaultValue="trial">
        <TabsList>
          <TabsTrigger value="trial">Trial Balance</TabsTrigger>
          <TabsTrigger value="pnl">Profit & Loss</TabsTrigger>
          <TabsTrigger value="bs">Balance Sheet</TabsTrigger>
          <TabsTrigger value="gst">GST Registers</TabsTrigger>
        </TabsList>

        <TabsContent value="trial" className="mt-4 space-y-3">
          <DataTable rows={tbRows} exportName="trial-balance" searchKeys={["ledger", "group"] as any}
            columns={[
              { key: "ledger", label: "Ledger", sortable: true, render: (r) => <span className="font-semibold">{r.ledger}</span> },
              { key: "group", label: "Group" },
              { key: "dr", label: "Debit", className: "text-right font-mono", render: (r) => r.dr ? fmtINR(r.dr) : "" },
              { key: "cr", label: "Credit", className: "text-right font-mono", render: (r) => r.cr ? fmtINR(r.cr) : "" },
            ]}
            toolbar={<div className="text-xs"><span className="font-semibold">Totals:</span> Dr {fmtINR(totDr)} · Cr {fmtINR(totCr)}</div>}
          />
        </TabsContent>

        <TabsContent value="pnl" className="mt-4">
          <Card><CardHeader><CardTitle className="font-serif">Profit & Loss Account — FY 2026-27</CardTitle></CardHeader>
            <CardContent>
              <table className="w-full text-sm">
                <tbody>
                  <Row label="Sales (Revenue)" value={sales} tone="green" />
                  <Row label="(–) Purchase / COGS" value={-purchases} />
                  <Row label="Gross Profit" value={grossProfit} bold />
                  <Row label="(–) Direct Expenses" value={-directExp} />
                  <Row label="(–) Indirect Expenses" value={-indirectExp} />
                  <Row label="Net Profit" value={netProfit} bold tone={netProfit >= 0 ? "green" : "red"} />
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bs" className="mt-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card><CardHeader><CardTitle className="font-serif">Liabilities</CardTitle></CardHeader>
              <CardContent>
                <table className="w-full text-sm"><tbody>
                  <Row label="Capital Account" value={5000000} />
                  <Row label="Sundry Creditors" value={ledgers.filter((l) => l.groupId === "ag6").reduce((s, l) => s + l.openingBalance, 0)} />
                  <Row label="Duties & Taxes" value={vouchers.reduce((s, v) => s + v.gstTotal, 0)} />
                  <Row label="Net Profit" value={netProfit} />
                  <Row label="Total" value={5000000 + ledgers.filter((l) => l.groupId === "ag6").reduce((s, l) => s + l.openingBalance, 0) + vouchers.reduce((s, v) => s + v.gstTotal, 0) + netProfit} bold />
                </tbody></table>
              </CardContent>
            </Card>
            <Card><CardHeader><CardTitle className="font-serif">Assets</CardTitle></CardHeader>
              <CardContent>
                <table className="w-full text-sm"><tbody>
                  <Row label="Fixed Assets" value={3200000} />
                  <Row label="Closing Stock" value={ledgers.find((l) => l.id === "l1")?.openingBalance ?? 0} />
                  <Row label="Sundry Debtors" value={ledgers.filter((l) => l.groupId === "ag3").reduce((s, l) => s + l.openingBalance, 0)} />
                  <Row label="Bank Balances" value={ledgers.filter((l) => l.groupId === "ag4").reduce((s, l) => s + l.openingBalance, 0)} />
                  <Row label="Cash-in-Hand" value={ledgers.find((l) => l.id === "l1")?.openingBalance ?? 0} />
                </tbody></table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="gst" className="mt-4">
          <DataTable rows={gstRows} exportName="gst-register" searchKeys={["voucherNo", "party", "invoice"] as any}
            columns={[
              { key: "date", label: "Date", sortable: true },
              { key: "voucherNo", label: "Voucher No.", render: (r) => <span className="font-mono">{r.voucherNo}</span> },
              { key: "kind", label: "Type", render: (r) => <Badge tone={r.kind === "purchase" ? "blue" : "green"}>{r.kind}</Badge> },
              { key: "party", label: "Party" },
              { key: "invoice", label: "Inv. No." },
              { key: "taxable", label: "Taxable", className: "text-right font-mono", render: (r) => fmtINR(r.taxable) },
              { key: "gst", label: "GST", className: "text-right font-mono", render: (r) => fmtINR(r.gst) },
              { key: "total", label: "Total", className: "text-right font-mono font-semibold", render: (r) => fmtINR(r.total) },
            ]} />
        </TabsContent>
      </Tabs>
    </ErpPage>
  );
}

function Row({ label, value, bold, tone }: { label: string; value: number; bold?: boolean; tone?: "green" | "red" }) {
  return (
    <tr className={bold ? "border-t border-border" : ""}>
      <td className={`py-2 ${bold ? "font-bold" : ""}`}>{label}</td>
      <td className={`py-2 text-right font-mono ${bold ? "font-bold text-base" : ""} ${tone === "green" ? "text-himfed-green" : tone === "red" ? "text-destructive" : ""}`}>
        {fmtINR(value)}
      </td>
    </tr>
  );
}
