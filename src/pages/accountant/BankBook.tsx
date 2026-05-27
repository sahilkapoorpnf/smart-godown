import LedgerShell from "@/components/accountant/LedgerShell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Landmark, Download } from "lucide-react";
import { BANK_BOOK, downloadCSV, fmt } from "@/lib/accountant/data";

export default function BankBook() {
  const totalDep = BANK_BOOK.reduce((a,b)=>a+b.deposit,0);
  const totalWd = BANK_BOOK.reduce((a,b)=>a+b.withdrawal,0);
  const closing = BANK_BOOK[BANK_BOOK.length-1]?.balance ?? 0;
  const colors: any = { NEFT: "bg-blue-100 text-blue-800 border-blue-200", RTGS: "bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200", UPI: "bg-emerald-100 text-emerald-800 border-emerald-200", Cheque: "bg-amber-100 text-amber-800 border-amber-200" };

  return (
    <LedgerShell title="Bank Book Management" description="Bank transaction tracking — NEFT, RTGS, UPI, Cheque." icon={Landmark}>
      <div className="grid grid-cols-3 gap-3">
        <Card><CardContent className="pt-4"><div className="text-xs text-muted-foreground">Total Deposits</div><div className="text-xl font-bold text-emerald-600">{fmt(totalDep)}</div></CardContent></Card>
        <Card><CardContent className="pt-4"><div className="text-xs text-muted-foreground">Total Withdrawals</div><div className="text-xl font-bold text-rose-600">{fmt(totalWd)}</div></CardContent></Card>
        <Card><CardContent className="pt-4"><div className="text-xs text-muted-foreground">Closing Balance</div><div className="text-xl font-bold text-primary">{fmt(closing)}</div></CardContent></Card>
      </div>
      <Card><CardContent className="pt-6 space-y-3">
        <div className="flex justify-end"><Button variant="outline" size="sm" onClick={()=>downloadCSV(`bankbook-${Date.now()}.csv`, BANK_BOOK)}><Download className="w-4 h-4 mr-1" />Export</Button></div>
        <div className="rounded-lg border border-border overflow-auto max-h-[60vh]">
          <Table>
            <TableHeader className="sticky top-0 bg-muted z-10"><TableRow>
              {["Date","Bank","Type","UTR Number","Deposit","Withdrawal","Balance"].map(h => <TableHead key={h} className="text-xs">{h}</TableHead>)}
            </TableRow></TableHeader>
            <TableBody>{BANK_BOOK.map(b => (
              <TableRow key={b.id} className="text-xs hover:bg-muted/30">
                <TableCell>{b.date}</TableCell>
                <TableCell className="font-medium">{b.bank}</TableCell>
                <TableCell><Badge variant="outline" className={colors[b.txnType]+" text-[10px]"}>{b.txnType}</Badge></TableCell>
                <TableCell className="font-mono">{b.utr}</TableCell>
                <TableCell className="text-emerald-600">{b.deposit ? fmt(b.deposit) : "—"}</TableCell>
                <TableCell className="text-rose-600">{b.withdrawal ? fmt(b.withdrawal) : "—"}</TableCell>
                <TableCell className="font-bold">{fmt(b.balance)}</TableCell>
              </TableRow>
            ))}</TableBody>
          </Table>
        </div>
      </CardContent></Card>
    </LedgerShell>
  );
}
