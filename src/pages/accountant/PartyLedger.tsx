import { useMemo, useState } from "react";
import LedgerShell from "@/components/accountant/LedgerShell";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Download, Printer } from "lucide-react";
import { DEALERS, partyLedger, downloadCSV, fmt, printHTML } from "@/lib/accountant/data";

export default function PartyLedger() {
  const [party, setParty] = useState(DEALERS[0].name);
  const rows = useMemo(() => partyLedger(party), [party]);
  const dealer = DEALERS.find(d => d.name === party)!;
  const closing = rows[rows.length - 1]?.balance ?? 0;
  const totalDebit = rows.reduce((a,b)=>a+b.debit,0);
  const totalCredit = rows.reduce((a,b)=>a+b.credit,0);

  return (
    <LedgerShell title="Dealer / Party Ledger" description="Tally-style party ledger — debit, credit, balance & invoice history." icon={Users}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card><CardContent className="pt-4"><div className="text-xs text-muted-foreground">Total Dealers</div><div className="text-xl font-bold text-primary">{DEALERS.length}</div></CardContent></Card>
        <Card><CardContent className="pt-4"><div className="text-xs text-muted-foreground">Credit Limit</div><div className="text-xl font-bold text-blue-600">{fmt(dealer.creditLimit)}</div></CardContent></Card>
        <Card><CardContent className="pt-4"><div className="text-xs text-muted-foreground">Outstanding Balance</div><div className="text-xl font-bold text-amber-600">{fmt(closing)}</div></CardContent></Card>
        <Card><CardContent className="pt-4"><div className="text-xs text-muted-foreground">Total Debit / Credit</div><div className="text-sm font-bold"><span className="text-rose-600">{fmt(totalDebit)}</span> / <span className="text-emerald-600">{fmt(totalCredit)}</span></div></CardContent></Card>
      </div>
      <Card><CardContent className="pt-6 space-y-4">
        <div className="flex justify-between gap-2 items-center">
          <Select value={party} onValueChange={setParty}><SelectTrigger className="w-72"><SelectValue /></SelectTrigger><SelectContent className="bg-popover max-h-80">
            {DEALERS.map(d => <SelectItem key={d.id} value={d.name}>{d.name}</SelectItem>)}
          </SelectContent></Select>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => downloadCSV(`${party}-ledger-${Date.now()}.csv`, rows)}><Download className="w-4 h-4 mr-1" />Export</Button>
            <Button variant="outline" size="sm" onClick={() => {
              const body = rows.map(r => `<tr><td>${r.date}</td><td>${r.voucher}</td><td>${r.invoiceNo}</td><td>₹${r.debit.toLocaleString()}</td><td>₹${r.credit.toLocaleString()}</td><td>₹${r.balance.toLocaleString()}</td></tr>`).join("");
              printHTML(`Party Ledger — ${party}`, `<h3>${party} (${dealer.gst})</h3><table><thead><tr><th>Date</th><th>Voucher</th><th>Invoice</th><th>Debit</th><th>Credit</th><th>Balance</th></tr></thead><tbody>${body}</tbody></table>`);
            }}><Printer className="w-4 h-4 mr-1" />Print</Button>
          </div>
        </div>
        <div className="rounded-lg border border-border overflow-auto max-h-[55vh]">
          <Table>
            <TableHeader className="sticky top-0 bg-muted z-10"><TableRow>
              {["Date","Voucher Type","Invoice No","Debit","Credit","Balance"].map(h => <TableHead key={h} className="text-xs whitespace-nowrap">{h}</TableHead>)}
            </TableRow></TableHeader>
            <TableBody>
              {rows.map((r,i) => (
                <TableRow key={i} className="text-xs hover:bg-muted/30">
                  <TableCell>{r.date}</TableCell>
                  <TableCell className="font-medium">{r.voucher}</TableCell>
                  <TableCell className="font-mono">{r.invoiceNo}</TableCell>
                  <TableCell className="text-rose-600">{r.debit ? fmt(r.debit) : "—"}</TableCell>
                  <TableCell className="text-emerald-600">{r.credit ? fmt(r.credit) : "—"}</TableCell>
                  <TableCell className="font-bold">{fmt(r.balance)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent></Card>
    </LedgerShell>
  );
}
