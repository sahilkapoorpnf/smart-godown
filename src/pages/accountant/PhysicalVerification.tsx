import LedgerShell from "@/components/accountant/LedgerShell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ClipboardCheck } from "lucide-react";
import { STOCK_ADJUSTMENTS, WAREHOUSES } from "@/lib/accountant/data";
import { toast } from "sonner";

export default function PhysicalVerification() {
  return (
    <LedgerShell title="Physical Stock Verification" description="Physical stock counting, variance reports & approval workflow." icon={ClipboardCheck}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {WAREHOUSES.map(w => {
          const items = STOCK_ADJUSTMENTS.filter(s => s.warehouse === w);
          const variance = items.reduce((a,b)=>a+Math.abs(b.variance),0);
          return (
            <Card key={w}><CardContent className="pt-4">
              <div className="text-xs text-muted-foreground">{w}</div>
              <div className="text-lg font-bold">{items.length} items</div>
              <div className="text-xs text-rose-600">Variance: {variance} bags</div>
              <Button size="sm" variant="outline" className="mt-2 w-full" onClick={()=>toast.success(`Verification initiated for ${w}`)}>Start Verification</Button>
            </CardContent></Card>
          );
        })}
      </div>
      <Card><CardContent className="pt-6">
        <h3 className="text-sm font-semibold mb-3">Variance Report</h3>
        <div className="rounded-lg border border-border overflow-auto max-h-[55vh]">
          <Table>
            <TableHeader className="sticky top-0 bg-muted z-10"><TableRow>
              {["Warehouse","Fertilizer","System","Physical","Variance","Status","Approved By","Date"].map(h => <TableHead key={h} className="text-xs">{h}</TableHead>)}
            </TableRow></TableHeader>
            <TableBody>{STOCK_ADJUSTMENTS.map(a => (
              <TableRow key={a.id} className="text-xs">
                <TableCell className="font-medium">{a.warehouse}</TableCell>
                <TableCell>{a.fertilizer}</TableCell>
                <TableCell>{a.systemStock}</TableCell>
                <TableCell>{a.physicalStock}</TableCell>
                <TableCell className={a.variance < 0 ? "text-rose-600 font-bold" : "text-emerald-600 font-bold"}>{a.variance}</TableCell>
                <TableCell><Badge variant="outline" className={a.variance === 0 ? "bg-emerald-100 text-emerald-800 border-emerald-200 text-[10px]" : "bg-amber-100 text-amber-800 border-amber-200 text-[10px]"}>{a.variance === 0 ? "MATCHED" : "VARIANCE"}</Badge></TableCell>
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
