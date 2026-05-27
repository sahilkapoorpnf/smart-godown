import LedgerShell from "@/components/accountant/LedgerShell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Truck, Download } from "lucide-react";
import { TRANSPORT, downloadCSV, fmt } from "@/lib/accountant/data";

export default function TransportExpense() {
  const totalFr = TRANSPORT.reduce((a,b)=>a+b.freight,0);
  const totalDsl = TRANSPORT.reduce((a,b)=>a+b.diesel,0);
  return (
    <LedgerShell title="Transport Expense Management" description="Track truck freight, driver expenses & route-wise costs." icon={Truck}>
      <div className="grid grid-cols-3 gap-3">
        <Card><CardContent className="pt-4"><div className="text-xs text-muted-foreground">Total Trips</div><div className="text-xl font-bold text-primary">{TRANSPORT.length}</div></CardContent></Card>
        <Card><CardContent className="pt-4"><div className="text-xs text-muted-foreground">Total Freight</div><div className="text-xl font-bold text-rose-600">{fmt(totalFr)}</div></CardContent></Card>
        <Card><CardContent className="pt-4"><div className="text-xs text-muted-foreground">Diesel Spend</div><div className="text-xl font-bold text-amber-600">{fmt(totalDsl)}</div></CardContent></Card>
      </div>
      <Card><CardContent className="pt-6 space-y-3">
        <div className="flex justify-end"><Button variant="outline" size="sm" onClick={()=>downloadCSV(`transport-${Date.now()}.csv`, TRANSPORT)}><Download className="w-4 h-4 mr-1" />Export</Button></div>
        <div className="rounded-lg border border-border overflow-auto max-h-[60vh]">
          <Table>
            <TableHeader className="sticky top-0 bg-muted z-10"><TableRow>
              {["Truck No","Driver","Route","Freight","Diesel","Total","Dispatch Date"].map(h => <TableHead key={h} className="text-xs">{h}</TableHead>)}
            </TableRow></TableHeader>
            <TableBody>{TRANSPORT.map(t => (
              <TableRow key={t.id} className="text-xs hover:bg-muted/30">
                <TableCell className="font-mono">{t.truckNo}</TableCell>
                <TableCell className="font-medium">{t.driver}</TableCell>
                <TableCell>{t.route}</TableCell>
                <TableCell>{fmt(t.freight)}</TableCell>
                <TableCell>{fmt(t.diesel)}</TableCell>
                <TableCell className="font-bold text-primary">{fmt(t.freight + t.diesel)}</TableCell>
                <TableCell>{t.dispatchDate}</TableCell>
              </TableRow>
            ))}</TableBody>
          </Table>
        </div>
      </CardContent></Card>
    </LedgerShell>
  );
}
