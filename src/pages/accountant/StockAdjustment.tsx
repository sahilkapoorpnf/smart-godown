import LedgerShell from "@/components/accountant/LedgerShell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Scale, Download } from "lucide-react";
import { STOCK_ADJUSTMENTS, downloadCSV } from "@/lib/accountant/data";

export default function StockAdjustment() {
  return (
    <LedgerShell title="Stock Adjustment Management" description="Track missing bags, physical verification mismatch & damaged stock." icon={Scale}>
      <div className="grid grid-cols-3 gap-3">
        <Card><CardContent className="pt-4"><div className="text-xs text-muted-foreground">Total Adjustments</div><div className="text-xl font-bold text-primary">{STOCK_ADJUSTMENTS.length}</div></CardContent></Card>
        <Card><CardContent className="pt-4"><div className="text-xs text-muted-foreground">Total Variance (Bags)</div><div className="text-xl font-bold text-rose-600">{STOCK_ADJUSTMENTS.reduce((a,b)=>a+b.variance,0)}</div></CardContent></Card>
        <Card><CardContent className="pt-4"><div className="text-xs text-muted-foreground">Items Verified</div><div className="text-xl font-bold text-emerald-600">{STOCK_ADJUSTMENTS.length}</div></CardContent></Card>
      </div>
      <Card><CardContent className="pt-6 space-y-3">
        <div className="flex justify-end"><Button variant="outline" size="sm" onClick={()=>downloadCSV(`stock-adj-${Date.now()}.csv`, STOCK_ADJUSTMENTS)}><Download className="w-4 h-4 mr-1" />Export</Button></div>
        <div className="rounded-lg border border-border overflow-auto max-h-[55vh]">
          <Table>
            <TableHeader className="sticky top-0 bg-muted z-10"><TableRow>
              {["Adjustment ID","Fertilizer","Warehouse","System Stock","Physical Stock","Variance","Approved By","Date"].map(h => <TableHead key={h} className="text-xs">{h}</TableHead>)}
            </TableRow></TableHeader>
            <TableBody>{STOCK_ADJUSTMENTS.map(a => (
              <TableRow key={a.id} className="text-xs hover:bg-muted/30">
                <TableCell className="font-mono">{a.adjId}</TableCell>
                <TableCell>{a.fertilizer}</TableCell>
                <TableCell>{a.warehouse}</TableCell>
                <TableCell>{a.systemStock}</TableCell>
                <TableCell>{a.physicalStock}</TableCell>
                <TableCell><Badge variant="outline" className={a.variance < 0 ? "bg-rose-100 text-rose-800 border-rose-200 text-[10px]" : "bg-emerald-100 text-emerald-800 border-emerald-200 text-[10px]"}>{a.variance}</Badge></TableCell>
                <TableCell>{a.approvedBy}</TableCell>
                <TableCell>{a.date}</TableCell>
              </TableRow>
            ))}</TableBody>
          </Table>
        </div>
      </CardContent></Card>
    </LedgerShell>
  );
}
