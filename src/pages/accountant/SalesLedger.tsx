import { useMemo, useState } from "react";
import LedgerShell from "@/components/accountant/LedgerShell";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileSpreadsheet, Download, Printer, Search } from "lucide-react";
import { SBadge } from "@/components/accountant/StatusBadge";
import {
  AREAS, FERTILIZERS, WAREHOUSES, SALES, downloadCSV, fmt, printHTML, PARTIES,
} from "@/lib/accountant/data";

export default function SalesLedger() {
  const [search, setSearch] = useState("");
  const [period, setPeriod] = useState("all");
  const [area, setArea] = useState("all");
  const [wh, setWh] = useState("all");
  const [fert, setFert] = useState("all");
  const [party, setParty] = useState("all");
  const [payment, setPayment] = useState("all");
  const [page, setPage] = useState(1);
  const PER = 15;

  const filtered = useMemo(() => {
    const today = new Date();
    return SALES.filter((e) => {
      const dt = new Date(e.date);
      if (period === "daily" && dt.toDateString() !== today.toDateString()) return false;
      if (period === "monthly" && (dt.getMonth() !== today.getMonth() || dt.getFullYear() !== today.getFullYear())) return false;
      if (period === "yearly" && dt.getFullYear() !== today.getFullYear()) return false;
      if (area !== "all" && e.area !== area) return false;
      if (wh !== "all" && e.warehouse !== wh) return false;
      if (fert !== "all" && e.fertilizer !== fert) return false;
      if (party !== "all" && e.party !== party) return false;
      if (payment !== "all" && e.paymentStatus !== payment) return false;
      if (search && !`${e.invoiceNo} ${e.party} ${e.partyGst} ${e.fertilizer}`.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [period, area, wh, fert, party, payment, search]);

  const pageData = filtered.slice((page - 1) * PER, page * PER);
  const pages = Math.ceil(filtered.length / PER) || 1;

  const exportCsv = () =>
    downloadCSV(`sales-ledger-${Date.now()}.csv`,
      filtered.map((e, i) => ({
        "Sr.No": i + 1, "Invoice No": e.invoiceNo, FY: e.fy, Date: e.date, Area: e.area, Warehouse: e.warehouse,
        Party: e.party, GST: e.partyGst, Fertilizer: e.fertilizer, Bags: e.bags, Rate: e.rate, Amount: e.amount,
        CGST: e.cgst, SGST: e.sgst, Total: e.total, "Margin Rate": e.marginRate, Margin: e.margin,
        Subsidy: e.subsidy, "Net Amount": e.netAmount, Payment: e.paymentStatus, "Created By": e.createdBy, "Approved By": e.approvedBy,
      })));

  const printReport = () => {
    const rows = filtered.map((e, i) => `<tr><td>${i + 1}</td><td>${e.invoiceNo}</td><td>${e.date}</td><td>${e.party}</td><td>${e.fertilizer}</td><td>${e.bags}</td><td>₹${e.rate}</td><td>₹${e.total.toLocaleString()}</td><td>₹${e.margin}</td><td>₹${e.subsidy.toLocaleString()}</td><td>₹${e.netAmount.toLocaleString()}</td><td>${e.paymentStatus}</td></tr>`).join("");
    printHTML("Sales Ledger Report", `<table><thead><tr><th>Sr</th><th>Invoice</th><th>Date</th><th>Party</th><th>Fert</th><th>Bags</th><th>Rate</th><th>Total</th><th>Margin</th><th>Subsidy</th><th>Net</th><th>Pay</th></tr></thead><tbody>${rows}</tbody></table>`);
  };

  return (
    <LedgerShell title="Sales Ledger Management" description="Complete fertilizer sales ledger with GST, margin, subsidy & payment tracking." icon={FileSpreadsheet}>
      <Card><CardContent className="pt-6 space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-7 gap-2">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search invoice/party/GST..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={period} onValueChange={setPeriod}><SelectTrigger><SelectValue placeholder="Period" /></SelectTrigger><SelectContent className="bg-popover">
            <SelectItem value="all">All Time</SelectItem><SelectItem value="daily">Daily</SelectItem><SelectItem value="monthly">Monthly</SelectItem><SelectItem value="yearly">Yearly</SelectItem>
          </SelectContent></Select>
          <Select value={area} onValueChange={setArea}><SelectTrigger><SelectValue placeholder="Area" /></SelectTrigger><SelectContent className="bg-popover">
            <SelectItem value="all">All Areas</SelectItem>{AREAS.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}
          </SelectContent></Select>
          <Select value={wh} onValueChange={setWh}><SelectTrigger><SelectValue placeholder="Warehouse" /></SelectTrigger><SelectContent className="bg-popover">
            <SelectItem value="all">All WH</SelectItem>{WAREHOUSES.map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}
          </SelectContent></Select>
          <Select value={fert} onValueChange={setFert}><SelectTrigger><SelectValue placeholder="Fertilizer" /></SelectTrigger><SelectContent className="bg-popover">
            <SelectItem value="all">All Fert</SelectItem>{FERTILIZERS.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
          </SelectContent></Select>
          <Select value={payment} onValueChange={setPayment}><SelectTrigger><SelectValue placeholder="Payment" /></SelectTrigger><SelectContent className="bg-popover">
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="paid">Paid</SelectItem><SelectItem value="partial">Partial</SelectItem>
            <SelectItem value="pending">Pending</SelectItem><SelectItem value="overdue">Overdue</SelectItem>
          </SelectContent></Select>
        </div>
        <div className="flex flex-wrap gap-2 justify-between items-center">
          <Select value={party} onValueChange={setParty}><SelectTrigger className="w-60"><SelectValue placeholder="Party" /></SelectTrigger><SelectContent className="bg-popover max-h-80">
            <SelectItem value="all">All Parties</SelectItem>{PARTIES.map(p => <SelectItem key={p.name} value={p.name}>{p.name}</SelectItem>)}
          </SelectContent></Select>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={exportCsv}><Download className="w-4 h-4 mr-1" />CSV / Excel</Button>
            <Button variant="outline" size="sm" onClick={printReport}><Printer className="w-4 h-4 mr-1" />Print / PDF</Button>
          </div>
        </div>

        <div className="rounded-lg border border-border overflow-auto max-h-[60vh]">
          <Table>
            <TableHeader className="sticky top-0 bg-muted z-10">
              <TableRow>
                {["Sr","Invoice","FY","Date","Area","WH","Party","GST","Fert","Bags","Rate","Amount","CGST","SGST","Total","M.Rate","Margin","Subsidy","Net","Pay","Created","Approved"].map(h => <TableHead key={h} className="text-xs whitespace-nowrap">{h}</TableHead>)}
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageData.length === 0 ? <TableRow><TableCell colSpan={22} className="text-center py-10 text-muted-foreground">No records found</TableCell></TableRow>
              : pageData.map((e, i) => (
                <TableRow key={e.id} className="text-xs hover:bg-muted/30">
                  <TableCell>{(page - 1) * PER + i + 1}</TableCell>
                  <TableCell className="font-mono">{e.invoiceNo}</TableCell>
                  <TableCell>{e.fy}</TableCell>
                  <TableCell className="whitespace-nowrap">{e.date}</TableCell>
                  <TableCell>{e.area}</TableCell>
                  <TableCell>{e.warehouse}</TableCell>
                  <TableCell className="whitespace-nowrap font-medium">{e.party}</TableCell>
                  <TableCell className="text-muted-foreground">{e.partyGst}</TableCell>
                  <TableCell>{e.fertilizer}</TableCell>
                  <TableCell>{e.bags}</TableCell>
                  <TableCell>₹{e.rate}</TableCell>
                  <TableCell>{fmt(e.amount)}</TableCell>
                  <TableCell>₹{e.cgst}</TableCell>
                  <TableCell>₹{e.sgst}</TableCell>
                  <TableCell>{fmt(e.total)}</TableCell>
                  <TableCell>{e.marginRate}</TableCell>
                  <TableCell>₹{e.margin}</TableCell>
                  <TableCell>{fmt(e.subsidy)}</TableCell>
                  <TableCell className="font-semibold text-primary">{fmt(e.netAmount)}</TableCell>
                  <TableCell><SBadge s={e.paymentStatus} /></TableCell>
                  <TableCell>{e.createdBy}</TableCell>
                  <TableCell>{e.approvedBy}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-between items-center text-xs text-muted-foreground">
          <span>{filtered.length} records</span>
          <div className="flex gap-1 items-center">
            <Button size="sm" variant="outline" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Prev</Button>
            <span className="px-2">Page {page} / {pages}</span>
            <Button size="sm" variant="outline" disabled={page === pages} onClick={() => setPage(p => p + 1)}>Next</Button>
          </div>
        </div>
      </CardContent></Card>
    </LedgerShell>
  );
}
