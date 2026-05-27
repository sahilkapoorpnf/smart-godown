import LedgerShell from "@/components/accountant/LedgerShell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Undo2, Download } from "lucide-react";
import { RETURNS, downloadCSV, fmt } from "@/lib/accountant/data";

export default function ReturnManagement() {
  return (
    <LedgerShell title="Return Management" description="Fertilizer returns, adjustments & warehouse-wise tracking." icon={Undo2}>
      <div className="grid grid-cols-3 gap-3">
        <Card><CardContent className="pt-4"><div className="text-xs text-muted-foreground">Total Returns</div><div className="text-xl font-bold text-primary">{RETURNS.length}</div></CardContent></Card>
        <Card><CardContent className="pt-4"><div className="text-xs text-muted-foreground">Returned Bags</div><div className="text-xl font-bold text-amber-600">{RETURNS.reduce((a,b)=>a+b.bags,0)}</div></CardContent></Card>
        <Card><CardContent className="pt-4"><div className="text-xs text-muted-foreground">Total Adjustment</div><div className="text-xl font-bold text-rose-600">{fmt(RETURNS.reduce((a,b)=>a+b.adjustment,0))}</div></CardContent></Card>
      </div>
      <Card><CardContent className="pt-6 space-y-3">
        <div className="flex justify-end"><Button variant="outline" size="sm" onClick={()=>downloadCSV(`returns-${Date.now()}.csv`, RETURNS)}><Download className="w-4 h-4 mr-1" />Export</Button></div>
        <div className="rounded-lg border border-border overflow-auto max-h-[55vh]">
          <Table>
            <TableHeader className="sticky top-0 bg-muted z-10"><TableRow>
              {["Return ID","Invoice No","Fertilizer","Returned Bags","Reason","Warehouse","Adjustment","Date"].map(h => <TableHead key={h} className="text-xs">{h}</TableHead>)}
            </TableRow></TableHeader>
            <TableBody>{RETURNS.map(r => (
              <TableRow key={r.id} className="text-xs hover:bg-muted/30">
                <TableCell className="font-mono">{r.returnId}</TableCell>
                <TableCell className="font-mono">{r.invoiceNo}</TableCell>
                <TableCell>{r.fertilizer}</TableCell>
                <TableCell>{r.bags}</TableCell>
                <TableCell className="text-muted-foreground">{r.reason}</TableCell>
                <TableCell>{r.warehouse}</TableCell>
                <TableCell className="font-semibold text-rose-600">{fmt(r.adjustment)}</TableCell>
                <TableCell>{r.date}</TableCell>
              </TableRow>
            ))}</TableBody>
          </Table>
        </div>
      </CardContent></Card>
    </LedgerShell>
  );
}
