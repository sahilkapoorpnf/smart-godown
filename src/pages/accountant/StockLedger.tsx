import { useMemo, useState } from "react";
import LedgerShell from "@/components/accountant/LedgerShell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Download, AlertTriangle } from "lucide-react";
import { AREAS, FERTILIZERS, STOCK_LEDGER, WAREHOUSES, downloadCSV } from "@/lib/accountant/data";

export default function StockLedger() {
  const [area, setArea] = useState("all");
  const [wh, setWh] = useState("all");
  const [fert, setFert] = useState("all");

  const filtered = useMemo(() => STOCK_LEDGER.filter(r => {
    if (area !== "all" && r.area !== area) return false;
    if (wh !== "all" && r.warehouse !== wh) return false;
    if (fert !== "all" && r.fertilizer !== fert) return false;
    return true;
  }), [area, wh, fert]);

  const lowStock = filtered.filter(r => r.date === STOCK_LEDGER[0].date && r.closing < 300);
  const deadStock = filtered.filter(r => r.date === STOCK_LEDGER[0].date && r.sold === 0 && r.closing > 0);

  return (
    <LedgerShell title="Stock Ledger Management" description="Daily stock accounting — opening, incoming, sold, transfer, damaged, closing." icon={BarChart3}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card><CardContent className="pt-4"><div className="text-xs text-muted-foreground">Ledger Rows</div><div className="text-xl font-bold text-primary">{filtered.length}</div></CardContent></Card>
        <Card><CardContent className="pt-4"><div className="text-xs text-muted-foreground">Today Closing (Bags)</div><div className="text-xl font-bold text-emerald-600">{filtered.filter(r => r.date === STOCK_LEDGER[0].date).reduce((a,b)=>a+b.closing,0).toLocaleString()}</div></CardContent></Card>
        <Card><CardContent className="pt-4 flex items-center justify-between"><div><div className="text-xs text-muted-foreground">Low Stock Alerts</div><div className="text-xl font-bold text-rose-600">{lowStock.length}</div></div><AlertTriangle className="w-6 h-6 text-rose-500" /></CardContent></Card>
        <Card><CardContent className="pt-4"><div className="text-xs text-muted-foreground">Dead Stock Items</div><div className="text-xl font-bold text-amber-600">{deadStock.length}</div></CardContent></Card>
      </div>
      <Card><CardContent className="pt-6 space-y-4">
        <div className="flex flex-wrap gap-2 items-center justify-between">
          <div className="flex gap-2">
            <Select value={area} onValueChange={setArea}><SelectTrigger className="w-40"><SelectValue placeholder="Area" /></SelectTrigger><SelectContent className="bg-popover">
              <SelectItem value="all">All Areas</SelectItem>{AREAS.map(a=><SelectItem key={a} value={a}>{a}</SelectItem>)}
            </SelectContent></Select>
            <Select value={wh} onValueChange={setWh}><SelectTrigger className="w-40"><SelectValue placeholder="WH" /></SelectTrigger><SelectContent className="bg-popover">
              <SelectItem value="all">All WH</SelectItem>{WAREHOUSES.map(w=><SelectItem key={w} value={w}>{w}</SelectItem>)}
            </SelectContent></Select>
            <Select value={fert} onValueChange={setFert}><SelectTrigger className="w-40"><SelectValue placeholder="Fert" /></SelectTrigger><SelectContent className="bg-popover">
              <SelectItem value="all">All Fert</SelectItem>{FERTILIZERS.map(f=><SelectItem key={f} value={f}>{f}</SelectItem>)}
            </SelectContent></Select>
          </div>
          <Button variant="outline" size="sm" onClick={()=>downloadCSV(`stock-ledger-${Date.now()}.csv`, filtered)}><Download className="w-4 h-4 mr-1" />Export</Button>
        </div>
        <div className="rounded-lg border border-border overflow-auto max-h-[60vh]">
          <Table>
            <TableHeader className="sticky top-0 bg-muted z-10"><TableRow>
              {["Date","Area","Warehouse","Fertilizer","Opening","Incoming","Sold","Transfer","Damaged","Closing","Alert"].map(h => <TableHead key={h} className="text-xs whitespace-nowrap">{h}</TableHead>)}
            </TableRow></TableHeader>
            <TableBody>
              {filtered.slice(0, 200).map(r => (
                <TableRow key={r.id} className="text-xs hover:bg-muted/30">
                  <TableCell>{r.date}</TableCell>
                  <TableCell>{r.area}</TableCell>
                  <TableCell>{r.warehouse}</TableCell>
                  <TableCell>{r.fertilizer}</TableCell>
                  <TableCell>{r.opening}</TableCell>
                  <TableCell className="text-emerald-600">+{r.incoming}</TableCell>
                  <TableCell className="text-blue-600">-{r.sold}</TableCell>
                  <TableCell className="text-amber-600">-{r.transfer}</TableCell>
                  <TableCell className="text-rose-600">-{r.damaged}</TableCell>
                  <TableCell className="font-bold">{r.closing}</TableCell>
                  <TableCell>{r.closing < 300 ? <Badge variant="outline" className="bg-rose-100 text-rose-800 border-rose-200 text-[10px]">LOW</Badge> : r.sold === 0 ? <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200 text-[10px]">DEAD</Badge> : <span className="text-emerald-600">OK</span>}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="text-xs text-muted-foreground">Showing first 200 of {filtered.length} ledger rows</div>
      </CardContent></Card>
    </LedgerShell>
  );
}
