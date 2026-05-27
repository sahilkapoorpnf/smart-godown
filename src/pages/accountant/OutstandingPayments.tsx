import { useMemo, useState } from "react";
import LedgerShell from "@/components/accountant/LedgerShell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertTriangle, Download } from "lucide-react";
import { SBadge } from "@/components/accountant/StatusBadge";
import { SALES, downloadCSV, fmt } from "@/lib/accountant/data";

export default function OutstandingPayments() {
  const [filter, setFilter] = useState("all");
  const outstanding = useMemo(() => SALES.filter(s => s.pending > 0 && (filter === "all" || s.paymentStatus === filter)), [filter]);
  const total = outstanding.reduce((a, b) => a + b.pending, 0);
  const overdue = SALES.filter(s => s.paymentStatus === "overdue").reduce((a, b) => a + b.pending, 0);
  const dueDate = (date: string) => {
    const d = new Date(date); d.setDate(d.getDate() + 30); return d.toISOString().slice(0, 10);
  };

  return (
    <LedgerShell title="Outstanding Payment Management" description="Track pending dealer payments, overdue invoices & credit limits." icon={AlertTriangle}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card><CardContent className="pt-4"><div className="text-xs text-muted-foreground">Outstanding Invoices</div><div className="text-xl font-bold text-primary">{outstanding.length}</div></CardContent></Card>
        <Card><CardContent className="pt-4"><div className="text-xs text-muted-foreground">Total Outstanding</div><div className="text-xl font-bold text-amber-600">{fmt(total)}</div></CardContent></Card>
        <Card><CardContent className="pt-4"><div className="text-xs text-muted-foreground">Overdue Amount</div><div className="text-xl font-bold text-rose-600">{fmt(overdue)}</div></CardContent></Card>
        <Card><CardContent className="pt-4"><div className="text-xs text-muted-foreground">Avg Collection Days</div><div className="text-xl font-bold text-blue-600">23 days</div></CardContent></Card>
      </div>
      <Card><CardContent className="pt-6 space-y-4">
        <div className="flex justify-between items-center">
          <Select value={filter} onValueChange={setFilter}><SelectTrigger className="w-44"><SelectValue /></SelectTrigger><SelectContent className="bg-popover">
            <SelectItem value="all">All Statuses</SelectItem><SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="partial">Partial</SelectItem><SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
          </SelectContent></Select>
          <Button variant="outline" size="sm" onClick={() => downloadCSV(`outstanding-${Date.now()}.csv`, outstanding)}><Download className="w-4 h-4 mr-1" />Export</Button>
        </div>
        <div className="rounded-lg border border-border overflow-auto max-h-[60vh]">
          <Table>
            <TableHeader className="sticky top-0 bg-muted z-10"><TableRow>
              {["Party Name","Invoice No","Total","Paid","Pending","Due Date","Status"].map(h => <TableHead key={h} className="text-xs whitespace-nowrap">{h}</TableHead>)}
            </TableRow></TableHeader>
            <TableBody>
              {outstanding.map(s => (
                <TableRow key={s.id} className="text-xs hover:bg-muted/30">
                  <TableCell className="font-medium">{s.party}</TableCell>
                  <TableCell className="font-mono">{s.invoiceNo}</TableCell>
                  <TableCell>{fmt(s.total)}</TableCell>
                  <TableCell className="text-emerald-600">{fmt(s.paid)}</TableCell>
                  <TableCell className="font-semibold text-amber-600">{fmt(s.pending)}</TableCell>
                  <TableCell>{dueDate(s.date)}</TableCell>
                  <TableCell><SBadge s={s.paymentStatus} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent></Card>
    </LedgerShell>
  );
}
