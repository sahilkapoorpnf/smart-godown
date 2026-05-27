import { useMemo, useState } from "react";
import LedgerShell from "@/components/accountant/LedgerShell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Receipt, Download, Search } from "lucide-react";
import { AREAS, EXPENSES, WAREHOUSES, downloadCSV, fmt } from "@/lib/accountant/data";

const TYPES = ["Labour", "Diesel", "Truck Freight", "Loading", "Unloading", "Electricity", "Miscellaneous"];

export default function ExpenseManagement() {
  const [q, setQ] = useState("");
  const [type, setType] = useState("all");
  const [area, setArea] = useState("all");
  const [wh, setWh] = useState("all");
  const filtered = useMemo(() => EXPENSES.filter(e => {
    if (type !== "all" && e.type !== type) return false;
    if (area !== "all" && e.area !== area) return false;
    if (wh !== "all" && e.warehouse !== wh) return false;
    if (q && !`${e.id} ${e.remarks} ${e.approvedBy}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  }), [q, type, area, wh]);
  const total = filtered.reduce((a,b)=>a+b.amount,0);

  return (
    <LedgerShell title="Expense Management" description="Warehouse, transport & operational expense tracking." icon={Receipt}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card><CardContent className="pt-4"><div className="text-xs text-muted-foreground">Total Expenses</div><div className="text-xl font-bold text-primary">{filtered.length}</div></CardContent></Card>
        <Card><CardContent className="pt-4"><div className="text-xs text-muted-foreground">Total Amount</div><div className="text-xl font-bold text-rose-600">{fmt(total)}</div></CardContent></Card>
        <Card><CardContent className="pt-4"><div className="text-xs text-muted-foreground">This Month</div><div className="text-xl font-bold text-amber-600">{fmt(filtered.filter(e=>e.date.slice(0,7)===new Date().toISOString().slice(0,7)).reduce((a,b)=>a+b.amount,0))}</div></CardContent></Card>
        <Card><CardContent className="pt-4"><div className="text-xs text-muted-foreground">Top Type</div><div className="text-lg font-bold">{TYPES[0]}</div></CardContent></Card>
      </div>
      <Card><CardContent className="pt-6 space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search..." value={q} onChange={e=>setQ(e.target.value)} className="pl-9" />
          </div>
          <Select value={type} onValueChange={setType}><SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger><SelectContent className="bg-popover">
            <SelectItem value="all">All Types</SelectItem>{TYPES.map(t=><SelectItem key={t} value={t}>{t}</SelectItem>)}
          </SelectContent></Select>
          <Select value={area} onValueChange={setArea}><SelectTrigger><SelectValue placeholder="Area" /></SelectTrigger><SelectContent className="bg-popover">
            <SelectItem value="all">All Areas</SelectItem>{AREAS.map(a=><SelectItem key={a} value={a}>{a}</SelectItem>)}
          </SelectContent></Select>
          <Select value={wh} onValueChange={setWh}><SelectTrigger><SelectValue placeholder="WH" /></SelectTrigger><SelectContent className="bg-popover">
            <SelectItem value="all">All WH</SelectItem>{WAREHOUSES.map(w=><SelectItem key={w} value={w}>{w}</SelectItem>)}
          </SelectContent></Select>
        </div>
        <div className="flex justify-end"><Button variant="outline" size="sm" onClick={()=>downloadCSV(`expenses-${Date.now()}.csv`, filtered)}><Download className="w-4 h-4 mr-1" />Export</Button></div>
        <div className="rounded-lg border border-border overflow-auto max-h-[55vh]">
          <Table>
            <TableHeader className="sticky top-0 bg-muted z-10"><TableRow>
              {["Expense ID","Date","Type","Area","Warehouse","Amount","Approved By","Remarks"].map(h => <TableHead key={h} className="text-xs whitespace-nowrap">{h}</TableHead>)}
            </TableRow></TableHeader>
            <TableBody>{filtered.map(e => (
              <TableRow key={e.id} className="text-xs hover:bg-muted/30">
                <TableCell className="font-mono">{e.id}</TableCell>
                <TableCell>{e.date}</TableCell>
                <TableCell className="font-medium">{e.type}</TableCell>
                <TableCell>{e.area}</TableCell>
                <TableCell>{e.warehouse}</TableCell>
                <TableCell className="font-semibold text-rose-600">{fmt(e.amount)}</TableCell>
                <TableCell>{e.approvedBy}</TableCell>
                <TableCell className="text-muted-foreground">{e.remarks}</TableCell>
              </TableRow>
            ))}</TableBody>
          </Table>
        </div>
      </CardContent></Card>
    </LedgerShell>
  );
}
