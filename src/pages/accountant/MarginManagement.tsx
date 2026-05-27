import { useMemo } from "react";
import LedgerShell from "@/components/accountant/LedgerShell";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TrendingUp, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SALES, COMPANIES, byKey, downloadCSV, fmt } from "@/lib/accountant/data";

export default function MarginManagement() {
  const rows = useMemo(() => SALES.map((s, i) => ({
    id: s.id,
    fertilizer: s.fertilizer,
    company: COMPANIES[i % COMPANIES.length],
    bags: s.bags,
    marginRate: s.marginRate,
    totalMargin: s.margin,
    area: s.area,
    warehouse: s.warehouse,
  })), []);
  const total = rows.reduce((a, b) => a + b.totalMargin, 0);
  const byCompany = byKey(rows, r => r.company, r => r.totalMargin).sort((a,b)=>b.value-a.value);
  const monthlyMargin = useMemo(() => {
    const map = new Map<string, number>();
    SALES.forEach(s => { const k = s.date.slice(0,7); map.set(k, (map.get(k)||0) + s.margin); });
    return Array.from(map.entries()).sort();
  }, []);

  return (
    <LedgerShell title="Margin Management" description="HIMFED margin earnings — fertilizer, company, area & monthly breakdown." icon={TrendingUp}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card><CardContent className="pt-4"><div className="text-xs text-muted-foreground">Total Margin Earned</div><div className="text-xl font-bold text-emerald-600">{fmt(total)}</div></CardContent></Card>
        <Card><CardContent className="pt-4"><div className="text-xs text-muted-foreground">Bags Sold</div><div className="text-xl font-bold text-primary">{rows.reduce((a,b)=>a+b.bags,0).toLocaleString()}</div></CardContent></Card>
        <Card><CardContent className="pt-4"><div className="text-xs text-muted-foreground">Avg / Bag</div><div className="text-xl font-bold text-blue-600">₹{(total / rows.reduce((a,b)=>a+b.bags,0)).toFixed(2)}</div></CardContent></Card>
        <Card><CardContent className="pt-4"><div className="text-xs text-muted-foreground">Top Company</div><div className="text-lg font-bold text-fuchsia-600">{byCompany[0]?.name}</div></CardContent></Card>
      </div>
      <div className="grid lg:grid-cols-2 gap-4">
        <Card><CardContent className="pt-6">
          <h3 className="text-sm font-semibold mb-3">Company-wise Margin</h3>
          <Table><TableHeader><TableRow><TableHead>Company</TableHead><TableHead>Margin</TableHead></TableRow></TableHeader>
            <TableBody>{byCompany.map(c => <TableRow key={c.name}><TableCell className="font-medium">{c.name}</TableCell><TableCell className="font-bold text-emerald-600">{fmt(c.value)}</TableCell></TableRow>)}</TableBody>
          </Table>
        </CardContent></Card>
        <Card><CardContent className="pt-6">
          <h3 className="text-sm font-semibold mb-3">Monthly Margin Summary</h3>
          <Table><TableHeader><TableRow><TableHead>Month</TableHead><TableHead>Margin</TableHead></TableRow></TableHeader>
            <TableBody>{monthlyMargin.map(([m,v]) => <TableRow key={m}><TableCell>{m}</TableCell><TableCell className="font-bold text-primary">{fmt(v)}</TableCell></TableRow>)}</TableBody>
          </Table>
        </CardContent></Card>
      </div>
      <Card><CardContent className="pt-6 space-y-3">
        <div className="flex justify-between items-center"><h3 className="text-sm font-semibold">Detailed Margin Ledger</h3>
          <Button variant="outline" size="sm" onClick={() => downloadCSV(`margin-${Date.now()}.csv`, rows)}><Download className="w-4 h-4 mr-1" />Export</Button>
        </div>
        <div className="rounded-lg border border-border overflow-auto max-h-[50vh]">
          <Table>
            <TableHeader className="sticky top-0 bg-muted z-10"><TableRow>
              {["Fertilizer","Company","Bags Sold","Margin Rate","Total Margin","Area","Warehouse"].map(h => <TableHead key={h} className="text-xs">{h}</TableHead>)}
            </TableRow></TableHeader>
            <TableBody>{rows.map(r => (
              <TableRow key={r.id} className="text-xs">
                <TableCell>{r.fertilizer}</TableCell>
                <TableCell className="font-medium">{r.company}</TableCell>
                <TableCell>{r.bags}</TableCell>
                <TableCell>₹{r.marginRate}</TableCell>
                <TableCell className="font-semibold text-emerald-600">{fmt(r.totalMargin)}</TableCell>
                <TableCell>{r.area}</TableCell>
                <TableCell>{r.warehouse}</TableCell>
              </TableRow>
            ))}</TableBody>
          </Table>
        </div>
      </CardContent></Card>
    </LedgerShell>
  );
}
