import LedgerShell from "@/components/accountant/LedgerShell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BookOpen, Printer, Download } from "lucide-react";
import { CASH_BOOK, downloadCSV, fmt, printHTML } from "@/lib/accountant/data";

export default function CashBook() {
  const totalDr = CASH_BOOK.reduce((a,b)=>a+b.debit,0);
  const totalCr = CASH_BOOK.reduce((a,b)=>a+b.credit,0);
  const closing = CASH_BOOK[CASH_BOOK.length-1]?.balance ?? 0;

  return (
    <LedgerShell title="Cash Book Management" description="Tally-style cash book with daily closing balance." icon={BookOpen}>
      <div className="grid grid-cols-3 gap-3">
        <Card><CardContent className="pt-4"><div className="text-xs text-muted-foreground">Total Debit (Receipts)</div><div className="text-xl font-bold text-emerald-600">{fmt(totalDr)}</div></CardContent></Card>
        <Card><CardContent className="pt-4"><div className="text-xs text-muted-foreground">Total Credit (Payments)</div><div className="text-xl font-bold text-rose-600">{fmt(totalCr)}</div></CardContent></Card>
        <Card><CardContent className="pt-4"><div className="text-xs text-muted-foreground">Closing Balance</div><div className="text-xl font-bold text-primary">{fmt(closing)}</div></CardContent></Card>
      </div>
      <Card><CardContent className="pt-6 space-y-3">
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={()=>downloadCSV(`cashbook-${Date.now()}.csv`, CASH_BOOK)}><Download className="w-4 h-4 mr-1" />Export</Button>
          <Button variant="outline" size="sm" onClick={()=>{
            const rows = CASH_BOOK.map(c => `<tr><td>${c.date}</td><td>${c.voucher}</td><td>${c.particulars}</td><td>₹${c.debit.toLocaleString()}</td><td>₹${c.credit.toLocaleString()}</td><td>₹${c.balance.toLocaleString()}</td></tr>`).join("");
            printHTML("Cash Book", `<table><thead><tr><th>Date</th><th>Voucher</th><th>Particulars</th><th>Debit</th><th>Credit</th><th>Balance</th></tr></thead><tbody>${rows}</tbody></table>`);
          }}><Printer className="w-4 h-4 mr-1" />Print</Button>
        </div>
        <div className="rounded-lg border border-border overflow-auto max-h-[60vh]">
          <Table>
            <TableHeader className="sticky top-0 bg-muted z-10"><TableRow>
              {["Date","Voucher","Particulars","Debit","Credit","Balance"].map(h => <TableHead key={h} className="text-xs">{h}</TableHead>)}
            </TableRow></TableHeader>
            <TableBody>{CASH_BOOK.map(c => (
              <TableRow key={c.id} className="text-xs hover:bg-muted/30">
                <TableCell>{c.date}</TableCell>
                <TableCell className="font-mono">{c.voucher}</TableCell>
                <TableCell className="font-medium">{c.particulars}</TableCell>
                <TableCell className="text-emerald-600">{c.debit ? fmt(c.debit) : "—"}</TableCell>
                <TableCell className="text-rose-600">{c.credit ? fmt(c.credit) : "—"}</TableCell>
                <TableCell className="font-bold">{fmt(c.balance)}</TableCell>
              </TableRow>
            ))}</TableBody>
          </Table>
        </div>
      </CardContent></Card>
    </LedgerShell>
  );
}
