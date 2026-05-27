import { useMemo, useState } from "react";
import LedgerShell from "@/components/accountant/LedgerShell";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Truck, Download, Printer, Search } from "lucide-react";
import { SBadge } from "@/components/accountant/StatusBadge";
import { COMPANIES, FERTILIZERS, PURCHASES, WAREHOUSES, downloadCSV, fmt, printHTML } from "@/lib/accountant/data";

export default function PurchaseLedger() {
  const [search, setSearch] = useState("");
  const [company, setCompany] = useState("all");
  const [fert, setFert] = useState("all");
  const [wh, setWh] = useState("all");

  const filtered = useMemo(() => PURCHASES.filter(p => {
    if (company !== "all" && p.company !== company) return false;
    if (fert !== "all" && p.fertilizer !== fert) return false;
    if (wh !== "all" && p.warehouse !== wh) return false;
    if (search && !`${p.id} ${p.grNo} ${p.truckNo}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }), [company, fert, wh, search]);

  const totalAmt = filtered.reduce((a, b) => a + b.amount, 0);
  const totalBags = filtered.reduce((a, b) => a + b.bags, 0);

  const exportCsv = () => downloadCSV(`purchase-ledger-${Date.now()}.csv`, filtered);
  const print = () => {
    const rows = filtered.map((p, i) => `<tr><td>${i + 1}</td><td>${p.id}</td><td>${p.date}</td><td>${p.company}</td><td>${p.fertilizer}</td><td>${p.truckNo}</td><td>${p.grNo}</td><td>${p.bags}</td><td>₹${p.rate}</td><td>₹${p.amount.toLocaleString()}</td><td>${p.warehouse}</td><td>${p.status}</td></tr>`).join("");
    printHTML("Purchase Ledger Report", `<table><thead><tr><th>Sr</th><th>ID</th><th>Date</th><th>Company</th><th>Fert</th><th>Truck</th><th>GR</th><th>Bags</th><th>Rate</th><th>Amount</th><th>WH</th><th>Status</th></tr></thead><tbody>${rows}</tbody></table>`);
  };

  return (
    <LedgerShell title="Purchase Ledger Management" description="Fertilizer purchases from NFL, IFFCO, KRIBHCO & other suppliers." icon={Truck}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card><CardContent className="pt-4"><div className="text-xs text-muted-foreground">Total Purchases</div><div className="text-xl font-bold text-primary">{filtered.length}</div></CardContent></Card>
        <Card><CardContent className="pt-4"><div className="text-xs text-muted-foreground">Total Bags</div><div className="text-xl font-bold text-emerald-600">{totalBags.toLocaleString()}</div></CardContent></Card>
        <Card><CardContent className="pt-4"><div className="text-xs text-muted-foreground">Purchase Value</div><div className="text-xl font-bold text-blue-600">{fmt(totalAmt)}</div></CardContent></Card>
        <Card><CardContent className="pt-4"><div className="text-xs text-muted-foreground">Pending Approvals</div><div className="text-xl font-bold text-amber-600">{filtered.filter(p => p.status === "pending").length}</div></CardContent></Card>
      </div>
      <Card><CardContent className="pt-6 space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search GR / truck..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={company} onValueChange={setCompany}><SelectTrigger><SelectValue placeholder="Company" /></SelectTrigger><SelectContent className="bg-popover">
            <SelectItem value="all">All Companies</SelectItem>{COMPANIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent></Select>
          <Select value={fert} onValueChange={setFert}><SelectTrigger><SelectValue placeholder="Fertilizer" /></SelectTrigger><SelectContent className="bg-popover">
            <SelectItem value="all">All Fert</SelectItem>{FERTILIZERS.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
          </SelectContent></Select>
          <Select value={wh} onValueChange={setWh}><SelectTrigger><SelectValue placeholder="Warehouse" /></SelectTrigger><SelectContent className="bg-popover">
            <SelectItem value="all">All WH</SelectItem>{WAREHOUSES.map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}
          </SelectContent></Select>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={exportCsv}><Download className="w-4 h-4 mr-1" />Export CSV</Button>
          <Button variant="outline" size="sm" onClick={print}><Printer className="w-4 h-4 mr-1" />Print</Button>
        </div>
        <div className="rounded-lg border border-border overflow-auto max-h-[60vh]">
          <Table>
            <TableHeader className="sticky top-0 bg-muted z-10"><TableRow>
              {["Purchase ID","Date","Company","Fertilizer","Truck","GR Number","Bags","Rate","Amount","Warehouse","Received By","Status"].map(h => <TableHead key={h} className="text-xs whitespace-nowrap">{h}</TableHead>)}
            </TableRow></TableHeader>
            <TableBody>
              {filtered.map(p => (
                <TableRow key={p.id} className="text-xs hover:bg-muted/30">
                  <TableCell className="font-mono">{p.id}</TableCell>
                  <TableCell>{p.date}</TableCell>
                  <TableCell className="font-medium">{p.company}</TableCell>
                  <TableCell>{p.fertilizer}</TableCell>
                  <TableCell className="font-mono">{p.truckNo}</TableCell>
                  <TableCell className="font-mono">{p.grNo}</TableCell>
                  <TableCell>{p.bags.toLocaleString()}</TableCell>
                  <TableCell>₹{p.rate}</TableCell>
                  <TableCell className="font-semibold">{fmt(p.amount)}</TableCell>
                  <TableCell>{p.warehouse}</TableCell>
                  <TableCell>{p.receivedBy}</TableCell>
                  <TableCell><SBadge s={p.status} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent></Card>
    </LedgerShell>
  );
}
