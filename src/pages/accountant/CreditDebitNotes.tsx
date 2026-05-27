import LedgerShell from "@/components/accountant/LedgerShell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileMinus, Download } from "lucide-react";
import { SBadge } from "@/components/accountant/StatusBadge";
import { CDN_NOTES, downloadCSV, fmt } from "@/lib/accountant/data";

export default function CreditDebitNotes() {
  const credit = CDN_NOTES.filter(c => c.type === "Credit").reduce((a,b)=>a+b.amount,0);
  const debit = CDN_NOTES.filter(c => c.type === "Debit").reduce((a,b)=>a+b.amount,0);
  return (
    <LedgerShell title="Credit / Debit Note Management" description="Track damaged bags, returns, quantity mismatch adjustments." icon={FileMinus}>
      <div className="grid grid-cols-3 gap-3">
        <Card><CardContent className="pt-4"><div className="text-xs text-muted-foreground">Total Notes</div><div className="text-xl font-bold text-primary">{CDN_NOTES.length}</div></CardContent></Card>
        <Card><CardContent className="pt-4"><div className="text-xs text-muted-foreground">Total Credit Notes</div><div className="text-xl font-bold text-emerald-600">{fmt(credit)}</div></CardContent></Card>
        <Card><CardContent className="pt-4"><div className="text-xs text-muted-foreground">Total Debit Notes</div><div className="text-xl font-bold text-rose-600">{fmt(debit)}</div></CardContent></Card>
      </div>
      <Card><CardContent className="pt-6 space-y-3">
        <div className="flex justify-end"><Button variant="outline" size="sm" onClick={()=>downloadCSV(`notes-${Date.now()}.csv`, CDN_NOTES)}><Download className="w-4 h-4 mr-1" />Export</Button></div>
        <div className="rounded-lg border border-border overflow-auto max-h-[55vh]">
          <Table>
            <TableHeader className="sticky top-0 bg-muted z-10"><TableRow>
              {["Note Number","Type","Party","Fertilizer","Amount","Reason","Date"].map(h => <TableHead key={h} className="text-xs">{h}</TableHead>)}
            </TableRow></TableHeader>
            <TableBody>{CDN_NOTES.map(c => (
              <TableRow key={c.id} className="text-xs hover:bg-muted/30">
                <TableCell className="font-mono">{c.noteNo}</TableCell>
                <TableCell><SBadge s={c.type} /></TableCell>
                <TableCell className="font-medium">{c.party}</TableCell>
                <TableCell>{c.fertilizer}</TableCell>
                <TableCell className="font-semibold">{fmt(c.amount)}</TableCell>
                <TableCell className="text-muted-foreground">{c.reason}</TableCell>
                <TableCell>{c.date}</TableCell>
              </TableRow>
            ))}</TableBody>
          </Table>
        </div>
      </CardContent></Card>
    </LedgerShell>
  );
}
