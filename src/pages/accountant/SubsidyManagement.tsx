import LedgerShell from "@/components/accountant/LedgerShell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Wallet, Download } from "lucide-react";
import { SBadge } from "@/components/accountant/StatusBadge";
import { SUBSIDIES, downloadCSV, fmt } from "@/lib/accountant/data";

export default function SubsidyManagement() {
  const total = SUBSIDIES.reduce((a, b) => a + b.amount, 0);
  const released = SUBSIDIES.filter(s => s.status === "Released").reduce((a, b) => a + b.amount, 0);
  const pending = SUBSIDIES.filter(s => s.status !== "Released").reduce((a, b) => a + b.pending, 0);

  return (
    <LedgerShell title="Subsidy Management" description="Government subsidy accounting — released, partial & pending claims." icon={Wallet}>
      <div className="grid grid-cols-3 gap-3">
        <Card><CardContent className="pt-4"><div className="text-xs text-muted-foreground">Total Subsidy</div><div className="text-xl font-bold text-primary">{fmt(total)}</div></CardContent></Card>
        <Card><CardContent className="pt-4"><div className="text-xs text-muted-foreground">Released Subsidy</div><div className="text-xl font-bold text-emerald-600">{fmt(released)}</div></CardContent></Card>
        <Card><CardContent className="pt-4"><div className="text-xs text-muted-foreground">Pending Subsidy</div><div className="text-xl font-bold text-amber-600">{fmt(pending)}</div></CardContent></Card>
      </div>
      <Card><CardContent className="pt-6 space-y-4">
        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={() => downloadCSV(`subsidy-${Date.now()}.csv`, SUBSIDIES)}><Download className="w-4 h-4 mr-1" />Export</Button>
        </div>
        <div className="rounded-lg border border-border overflow-auto max-h-[60vh]">
          <Table>
            <TableHeader className="sticky top-0 bg-muted z-10"><TableRow>
              {["Subsidy ID","Invoice No","Party Name","Fertilizer","Bags","Subsidy Amount","Status","Release Date","Pending"].map(h => <TableHead key={h} className="text-xs whitespace-nowrap">{h}</TableHead>)}
            </TableRow></TableHeader>
            <TableBody>
              {SUBSIDIES.map(s => (
                <TableRow key={s.id} className="text-xs hover:bg-muted/30">
                  <TableCell className="font-mono">{s.id}</TableCell>
                  <TableCell className="font-mono">{s.invoiceNo}</TableCell>
                  <TableCell className="font-medium">{s.party}</TableCell>
                  <TableCell>{s.fertilizer}</TableCell>
                  <TableCell>{s.bags}</TableCell>
                  <TableCell className="font-semibold">{fmt(s.amount)}</TableCell>
                  <TableCell><SBadge s={s.status} /></TableCell>
                  <TableCell>{s.releaseDate || "—"}</TableCell>
                  <TableCell className="text-amber-600 font-semibold">{fmt(s.pending)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent></Card>
    </LedgerShell>
  );
}
