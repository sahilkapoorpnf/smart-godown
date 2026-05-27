import { useMemo, useState } from "react";
import LedgerShell from "@/components/accountant/LedgerShell";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BadgePercent, Download, Search, Printer } from "lucide-react";
import { SALES, PURCHASES, downloadCSV, fmt, printHTML } from "@/lib/accountant/data";

export default function GstManagement() {
  const [q, setQ] = useState("");
  const sales = useMemo(() => SALES.filter(s => !q || `${s.invoiceNo} ${s.party} ${s.partyGst}`.toLowerCase().includes(q.toLowerCase())), [q]);
  const purchases = PURCHASES;

  const cgst = sales.reduce((a, b) => a + b.cgst, 0);
  const sgst = sales.reduce((a, b) => a + b.sgst, 0);
  const total = cgst + sgst;

  return (
    <LedgerShell title="GST Management" description="CGST / SGST registers — sales and purchase GST tracking with export utilities." icon={BadgePercent}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card><CardContent className="pt-4"><div className="text-xs text-muted-foreground">Total CGST Collected</div><div className="text-xl font-bold text-blue-600">{fmt(cgst)}</div></CardContent></Card>
        <Card><CardContent className="pt-4"><div className="text-xs text-muted-foreground">Total SGST Collected</div><div className="text-xl font-bold text-fuchsia-600">{fmt(sgst)}</div></CardContent></Card>
        <Card><CardContent className="pt-4"><div className="text-xs text-muted-foreground">Total GST</div><div className="text-xl font-bold text-primary">{fmt(total)}</div></CardContent></Card>
        <Card><CardContent className="pt-4"><div className="text-xs text-muted-foreground">GST Invoices</div><div className="text-xl font-bold text-emerald-600">{sales.length}</div></CardContent></Card>
      </div>
      <Card><CardContent className="pt-6 space-y-4">
        <div className="flex gap-2 items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search invoice / GST / party..." value={q} onChange={e => setQ(e.target.value)} className="pl-9" />
          </div>
          <Button variant="outline" size="sm" onClick={() => downloadCSV(`gst-register-${Date.now()}.csv`, sales)}><Download className="w-4 h-4 mr-1" />Export CSV</Button>
          <Button variant="outline" size="sm" onClick={() => {
            const rows = sales.map(s => `<tr><td>${s.invoiceNo}</td><td>${s.partyGst}</td><td>${s.party}</td><td>₹${s.amount.toLocaleString()}</td><td>₹${s.cgst}</td><td>₹${s.sgst}</td><td>₹${(s.cgst+s.sgst).toFixed(2)}</td></tr>`).join("");
            printHTML("GST Sales Register", `<table><thead><tr><th>Invoice</th><th>GST No</th><th>Party</th><th>Taxable</th><th>CGST</th><th>SGST</th><th>Total GST</th></tr></thead><tbody>${rows}</tbody></table>`);
          }}><Printer className="w-4 h-4 mr-1" />Print PDF</Button>
        </div>
        <Tabs defaultValue="sales">
          <TabsList><TabsTrigger value="sales">GST Sales Register</TabsTrigger><TabsTrigger value="purchase">GST Purchase Register</TabsTrigger></TabsList>
          <TabsContent value="sales">
            <div className="rounded-lg border border-border overflow-auto max-h-[55vh]">
              <Table>
                <TableHeader className="sticky top-0 bg-muted z-10"><TableRow>
                  {["Invoice No","GST No","Party","Taxable Amount","CGST","SGST","Total GST"].map(h => <TableHead key={h} className="text-xs whitespace-nowrap">{h}</TableHead>)}
                </TableRow></TableHeader>
                <TableBody>
                  {sales.map(s => (
                    <TableRow key={s.id} className="text-xs hover:bg-muted/30">
                      <TableCell className="font-mono">{s.invoiceNo}</TableCell>
                      <TableCell className="text-muted-foreground">{s.partyGst}</TableCell>
                      <TableCell className="font-medium">{s.party}</TableCell>
                      <TableCell>{fmt(s.amount)}</TableCell>
                      <TableCell>₹{s.cgst}</TableCell>
                      <TableCell>₹{s.sgst}</TableCell>
                      <TableCell className="font-semibold text-primary">₹{(s.cgst+s.sgst).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          <TabsContent value="purchase">
            <div className="rounded-lg border border-border overflow-auto max-h-[55vh]">
              <Table>
                <TableHeader className="sticky top-0 bg-muted z-10"><TableRow>
                  {["GR Number","Company","Fertilizer","Bags","Rate","Amount","Est. GST 5%"].map(h => <TableHead key={h} className="text-xs whitespace-nowrap">{h}</TableHead>)}
                </TableRow></TableHeader>
                <TableBody>
                  {purchases.map(p => (
                    <TableRow key={p.id} className="text-xs hover:bg-muted/30">
                      <TableCell className="font-mono">{p.grNo}</TableCell>
                      <TableCell className="font-medium">{p.company}</TableCell>
                      <TableCell>{p.fertilizer}</TableCell>
                      <TableCell>{p.bags}</TableCell>
                      <TableCell>₹{p.rate}</TableCell>
                      <TableCell>{fmt(p.amount)}</TableCell>
                      <TableCell className="font-semibold">{fmt(p.amount * 0.05)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent></Card>
    </LedgerShell>
  );
}
