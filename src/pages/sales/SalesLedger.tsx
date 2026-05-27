import { useMemo, useState } from "react";
import AppShell from "@/components/warehouse/AppShell";
import { PageHeader } from "@/components/shared/PageHeader";
import { FormModal } from "@/components/shared/FormModal";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  FileSpreadsheet, Plus, Printer, Eye, Pencil, Download, Search,
  IndianRupee, Receipt, Wallet, TrendingUp, BadgePercent,
} from "lucide-react";
import { getCurrentUser, areaName } from "@/lib/warehouse/store";
import {
  useSalesStore, addSalesEntry, updateSalesEntry, computeTotals,
  visibleSalesEntries, canEditFinancials, downloadCSV,
  FERTILIZER_MASTER, WAREHOUSE_CODES, setSalesStatus,
} from "@/lib/sales/store";
import type { SalesEntry } from "@/lib/sales/types";
import { store as wh } from "@/lib/warehouse/store";
import { toast } from "sonner";

const blank = () => ({
  date: new Date().toISOString().slice(0, 10),
  areaId: "a4",
  warehouseCode: "UNA Main",
  partyName: "",
  partyGst: "",
  partyMobile: "",
  fertilizer: "UREA",
  bags: 0,
  pricePerBag: 266.5,
  cgstPct: 2.5,
  sgstPct: 2.5,
  marginRate: 5,
  subsidy: 0,
});

export default function SalesLedger() {
  const user = getCurrentUser();
  useSalesStore();
  const entries = useMemo(() => visibleSalesEntries(user), [user]);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<SalesEntry | null>(null);
  const [view, setView] = useState<SalesEntry | null>(null);
  const [form, setForm] = useState(blank());

  // Filters
  const [search, setSearch] = useState("");
  const [period, setPeriod] = useState<"all" | "daily" | "monthly" | "yearly">("all");
  const [areaF, setAreaF] = useState("all");
  const [whF, setWhF] = useState("all");
  const [fertF, setFertF] = useState("all");

  const filtered = useMemo(() => {
    const today = new Date();
    return entries.filter((e) => {
      const dt = new Date(e.date);
      if (period === "daily" && dt.toDateString() !== today.toDateString()) return false;
      if (period === "monthly" && (dt.getMonth() !== today.getMonth() || dt.getFullYear() !== today.getFullYear())) return false;
      if (period === "yearly" && dt.getFullYear() !== today.getFullYear()) return false;
      if (areaF !== "all" && e.areaId !== areaF) return false;
      if (whF !== "all" && e.warehouseCode !== whF) return false;
      if (fertF !== "all" && e.fertilizer !== fertF) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!`${e.billNo} ${e.partyName} ${e.partyGst} ${e.fertilizer}`.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [entries, period, areaF, whF, fertF, search]);

  // Summary
  const summary = useMemo(() => {
    const approved = filtered.filter((e) => e.status === "approved");
    return {
      totalSales: approved.reduce((s, e) => s + e.amount, 0),
      totalGst: approved.reduce((s, e) => s + e.cgstAmount + e.sgstAmount, 0),
      totalMargin: approved.reduce((s, e) => s + e.margin, 0),
      totalSubsidy: approved.reduce((s, e) => s + e.subsidy, 0),
      netRevenue: approved.reduce((s, e) => s + e.netAmount, 0),
      count: filtered.length,
    };
  }, [filtered]);

  // live calc
  const calc = computeTotals(form);

  const openCreate = () => {
    setEditing(null);
    setForm(blank());
    setOpen(true);
  };

  const openEdit = (e: SalesEntry) => {
    setEditing(e);
    setForm({
      date: e.date, areaId: e.areaId, warehouseCode: e.warehouseCode,
      partyName: e.partyName, partyGst: e.partyGst, partyMobile: e.partyMobile,
      fertilizer: e.fertilizer, bags: e.bags, pricePerBag: e.pricePerBag,
      cgstPct: e.cgstPct, sgstPct: e.sgstPct, marginRate: e.marginRate, subsidy: e.subsidy,
    });
    setOpen(true);
  };

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!user) return;
    if (!form.partyName || form.bags <= 0) { toast.error("Party name & bags required"); return; }
    if (editing) {
      updateSalesEntry(editing.id, { ...form, ...calc });
      toast.success(`Updated ${editing.billNo}`);
    } else {
      const created = addSalesEntry({ ...form, ...calc, createdBy: user.id });
      toast.success(`Created ${created.billNo}`);
    }
    setOpen(false);
  };

  const onFertChange = (name: string) => {
    const f = FERTILIZER_MASTER.find((x) => x.name === name);
    if (!f) return;
    setForm({ ...form, fertilizer: name, pricePerBag: f.price, marginRate: f.margin });
  };

  const exportCsv = () => {
    downloadCSV(`himfed-sales-${Date.now()}.csv`,
      filtered.map((e, i) => ({
        "Sr.No": i + 1, Date: e.date, "Bill No": e.billNo, "Party Name": e.partyName, "Party GST": e.partyGst,
        Fertilizer: e.fertilizer, Bags: e.bags, Price: e.pricePerBag, Amount: e.amount,
        "CGST 2.5%": e.cgstAmount, "SGST 2.5%": e.sgstAmount, Total: e.total,
        "Margin Rate": e.marginRate, Margin: e.margin, Subsidy: e.subsidy, "Net Amount": e.netAmount,
        Warehouse: e.warehouseCode, Status: e.status,
      })));
  };

  const printLedger = () => {
    const w = window.open("", "_blank", "width=1200,height=800");
    if (!w) return;
    const rows = filtered.map((e, i) => `
      <tr><td>${i + 1}</td><td>${e.date}</td><td>${e.billNo}</td><td>${e.partyName}</td>
      <td>${e.partyGst || "-"}</td><td>${e.fertilizer}</td><td>${e.bags}</td>
      <td>₹${e.pricePerBag}</td><td>₹${e.amount.toLocaleString()}</td>
      <td>₹${e.cgstAmount}</td><td>₹${e.sgstAmount}</td><td>₹${e.total.toLocaleString()}</td>
      <td>${e.marginRate}</td><td>₹${e.margin}</td><td>₹${e.subsidy.toLocaleString()}</td>
      <td>₹${e.netAmount.toLocaleString()}</td><td>${e.warehouseCode}</td></tr>`).join("");
    w.document.write(`<html><head><title>HIMFED Sales Ledger</title>
      <style>body{font-family:Georgia,serif;padding:16px}h2{text-align:center;margin:0}
      table{width:100%;border-collapse:collapse;margin-top:12px;font-size:11px}
      th,td{border:1px solid #333;padding:4px 6px;text-align:left}
      th{background:#eee}</style></head><body>
      <h2>HIMFED — Fertilizer Sales Ledger</h2>
      <p style="text-align:center;font-size:12px">Financial Year 2026-27 — Generated ${new Date().toLocaleString()}</p>
      <table><thead><tr>
      <th>Sr</th><th>Date</th><th>Bill No</th><th>Party</th><th>GST</th><th>Fertilizer</th>
      <th>Bags</th><th>Price</th><th>Amount</th><th>CGST</th><th>SGST</th><th>Total</th>
      <th>M.Rate</th><th>Margin</th><th>Subsidy</th><th>Net</th><th>WH</th></tr></thead>
      <tbody>${rows}</tbody></table></body></html>`);
    w.document.close(); w.focus(); w.print();
  };

  const printInvoice = (e: SalesEntry) => {
    const w = window.open("", "_blank", "width=900,height=700");
    if (!w) return;
    w.document.write(`<html><head><title>${e.billNo}</title>
      <style>body{font-family:Georgia,serif;padding:24px;color:#111}
      table{width:100%;border-collapse:collapse;margin-top:12px}
      th,td{border:1px solid #333;padding:6px 8px;font-size:13px}
      th{background:#f3f3f3;text-align:left}
      .hdr{text-align:center;border-bottom:2px solid #000;padding-bottom:8px;margin-bottom:12px}
      </style></head><body>
      <div class="hdr"><div style="font-size:22px;font-weight:bold">HIMFED</div>
      <div style="font-size:11px">Himachal Pradesh State Cooperative Marketing & Consumers Federation Ltd.</div>
      <div style="font-size:13px;font-weight:bold;margin-top:4px">TAX INVOICE</div></div>
      <table><tr><td><b>Bill No:</b> ${e.billNo}</td><td><b>Date:</b> ${e.date}</td>
      <td><b>FY:</b> ${e.financialYear}</td><td><b>Warehouse:</b> ${e.warehouseCode}</td></tr>
      <tr><td colspan="2"><b>Party:</b> ${e.partyName}</td>
      <td colspan="2"><b>GST:</b> ${e.partyGst || "-"} &nbsp; <b>Mobile:</b> ${e.partyMobile || "-"}</td></tr></table>
      <table><thead><tr><th>S.No</th><th>Fertilizer</th><th>Bags</th><th>Price/Bag</th><th>Amount</th></tr></thead>
      <tbody><tr><td>1</td><td>${e.fertilizer}</td><td>${e.bags}</td><td>₹${e.pricePerBag}</td><td>₹${e.amount.toLocaleString()}</td></tr>
      <tr><td colspan="4" style="text-align:right"><b>Sub Total</b></td><td>₹${e.amount.toLocaleString()}</td></tr>
      <tr><td colspan="4" style="text-align:right">CGST ${e.cgstPct}%</td><td>₹${e.cgstAmount}</td></tr>
      <tr><td colspan="4" style="text-align:right">SGST ${e.sgstPct}%</td><td>₹${e.sgstAmount}</td></tr>
      <tr><td colspan="4" style="text-align:right">Total</td><td>₹${e.total.toLocaleString()}</td></tr>
      <tr><td colspan="4" style="text-align:right">Margin (${e.marginRate}/bag)</td><td>₹${e.margin}</td></tr>
      <tr><td colspan="4" style="text-align:right">Less: Subsidy</td><td>(₹${e.subsidy.toLocaleString()})</td></tr>
      <tr style="background:#eee;font-weight:bold"><td colspan="4" style="text-align:right">NET AMOUNT</td>
      <td>₹${e.netAmount.toLocaleString()}</td></tr></tbody></table>
      <div style="display:flex;justify-content:space-between;margin-top:60px;font-size:12px">
      <div style="border-top:1px solid #000;padding-top:4px;width:200px;text-align:center">Customer Signature</div>
      <div style="border-top:1px solid #000;padding-top:4px;width:200px;text-align:center">Authorized Signatory</div>
      </div></body></html>`);
    w.document.close(); w.focus(); w.print();
  };

  const editFin = canEditFinancials(user?.role);
  const canCreate = user?.role === "warehouse_staff" || user?.role === "superadmin" || user?.role === "accountant";
  const canApprove = user?.role === "incharge" || user?.role === "superadmin";

  const statusBadge = (s: SalesEntry["status"]) => {
    const map: any = {
      pending: "bg-amber-100 text-amber-800 border-amber-200",
      approved: "bg-emerald-100 text-emerald-800 border-emerald-200",
      rejected: "bg-rose-100 text-rose-800 border-rose-200",
    };
    return <Badge variant="outline" className={map[s]}>{s.toUpperCase()}</Badge>;
  };

  return (
    <AppShell allowed={["superadmin", "accountant", "incharge", "warehouse_staff", "joa_it"]}>
      <PageHeader
        title="Fertilizer Sales Ledger"
        description="HIMFED sales register with GST, margin, subsidy & net realisation."
        icon={FileSpreadsheet}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: "Total Sales", val: summary.totalSales, icon: IndianRupee, color: "text-primary" },
          { label: "Total GST", val: summary.totalGst, icon: BadgePercent, color: "text-blue-600" },
          { label: "Total Margin", val: summary.totalMargin, icon: TrendingUp, color: "text-emerald-600" },
          { label: "Total Subsidy", val: summary.totalSubsidy, icon: Wallet, color: "text-amber-600" },
          { label: "Net Revenue", val: summary.netRevenue, icon: Receipt, color: "text-fuchsia-600" },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                  <div className={`text-lg font-bold ${s.color}`}>₹{Math.round(s.val).toLocaleString()}</div>
                </div>
                <s.icon className={`w-6 h-6 ${s.color} opacity-60`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters + Actions */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search bill / party / GST..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Select value={period} onValueChange={(v: any) => setPeriod(v)}>
              <SelectTrigger><SelectValue placeholder="Period" /></SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="daily">Today</SelectItem>
                <SelectItem value="monthly">This Month</SelectItem>
                <SelectItem value="yearly">This Year</SelectItem>
              </SelectContent>
            </Select>
            <Select value={areaF} onValueChange={setAreaF}>
              <SelectTrigger><SelectValue placeholder="Area" /></SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="all">All Areas</SelectItem>
                {wh.areas.map((a) => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={whF} onValueChange={setWhF}>
              <SelectTrigger><SelectValue placeholder="Warehouse" /></SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="all">All Warehouses</SelectItem>
                {WAREHOUSE_CODES.map((w) => <SelectItem key={w.code} value={w.code}>{w.code}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={fertF} onValueChange={setFertF}>
              <SelectTrigger><SelectValue placeholder="Fertilizer" /></SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="all">All Fertilizers</SelectItem>
                {FERTILIZER_MASTER.map((f) => <SelectItem key={f.name} value={f.name}>{f.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-wrap gap-2 justify-end">
            <Button variant="outline" size="sm" onClick={exportCsv}><Download className="w-4 h-4 mr-2" />Export CSV</Button>
            <Button variant="outline" size="sm" onClick={printLedger}><Printer className="w-4 h-4 mr-2" />Print Ledger</Button>
            {canCreate && (
              <Button size="sm" className="bg-primary" onClick={openCreate}><Plus className="w-4 h-4 mr-2" />New Sale</Button>
            )}
          </div>

          {/* Ledger table - sticky header, horizontal scroll */}
          <div className="rounded-lg border border-border overflow-auto max-h-[60vh]">
            <Table>
              <TableHeader className="sticky top-0 bg-muted z-10">
                <TableRow>
                  {["Sr","Date","Bill No","Party","GST","Fertilizer","Bags","Price","Amount","CGST 2.5%","SGST 2.5%","Total","M.Rate","Margin","Subsidy","Net Amount","WH","Status","Actions"].map((h) => (
                    <TableHead key={h} className="whitespace-nowrap text-xs font-semibold">{h}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow><TableCell colSpan={19} className="text-center py-12 text-muted-foreground">No sales entries found</TableCell></TableRow>
                ) : filtered.map((e, i) => (
                  <TableRow key={e.id} className="text-xs hover:bg-muted/30">
                    <TableCell>{i + 1}</TableCell>
                    <TableCell className="whitespace-nowrap">{e.date}</TableCell>
                    <TableCell className="font-mono">{e.billNo}</TableCell>
                    <TableCell className="whitespace-nowrap font-medium">{e.partyName}</TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground">{e.partyGst || "—"}</TableCell>
                    <TableCell>{e.fertilizer}</TableCell>
                    <TableCell>{e.bags}</TableCell>
                    <TableCell>₹{e.pricePerBag}</TableCell>
                    <TableCell>₹{e.amount.toLocaleString()}</TableCell>
                    <TableCell>₹{e.cgstAmount}</TableCell>
                    <TableCell>₹{e.sgstAmount}</TableCell>
                    <TableCell>₹{e.total.toLocaleString()}</TableCell>
                    <TableCell>{e.marginRate}</TableCell>
                    <TableCell>₹{e.margin}</TableCell>
                    <TableCell>₹{e.subsidy.toLocaleString()}</TableCell>
                    <TableCell className="font-semibold text-primary">₹{e.netAmount.toLocaleString()}</TableCell>
                    <TableCell>{e.warehouseCode}</TableCell>
                    <TableCell>{statusBadge(e.status)}</TableCell>
                    <TableCell className="whitespace-nowrap">
                      <Button size="icon" variant="ghost" onClick={() => setView(e)}><Eye className="w-4 h-4" /></Button>
                      {(editFin || (user?.role === "warehouse_staff" && e.status === "pending")) && (
                        <Button size="icon" variant="ghost" onClick={() => openEdit(e)}><Pencil className="w-4 h-4" /></Button>
                      )}
                      {canApprove && e.status === "pending" && (
                        <>
                          <Button size="sm" variant="ghost" className="text-emerald-600" onClick={() => { setSalesStatus(e.id, "approved"); toast.success("Approved"); }}>✓</Button>
                          <Button size="sm" variant="ghost" className="text-rose-600" onClick={() => { setSalesStatus(e.id, "rejected"); toast.error("Rejected"); }}>✗</Button>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="text-xs text-muted-foreground">{filtered.length} entries</div>
        </CardContent>
      </Card>

      {/* Create / Edit modal */}
      <FormModal
        open={open}
        onOpenChange={setOpen}
        title={editing ? `Edit ${editing.billNo}` : "New Fertilizer Sale"}
        size="xl"
        onSubmit={submit}
        submitLabel={editing ? "Update" : "Create & Save"}
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1"><Label>Date</Label><Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></div>
          <div className="space-y-1"><Label>Financial Year</Label><Input value="2026-27" disabled /></div>

          <div className="space-y-1"><Label>Area</Label>
            <Select value={form.areaId} onValueChange={(v) => setForm({ ...form, areaId: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent className="bg-popover">{wh.areas.map((a) => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1"><Label>Warehouse</Label>
            <Select value={form.warehouseCode} onValueChange={(v) => setForm({ ...form, warehouseCode: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent className="bg-popover">{WAREHOUSE_CODES.map((w) => <SelectItem key={w.code} value={w.code}>{w.code}</SelectItem>)}</SelectContent>
            </Select>
          </div>

          <div className="space-y-1"><Label>Party Name *</Label><Input value={form.partyName} onChange={(e) => setForm({ ...form, partyName: e.target.value })} required /></div>
          <div className="space-y-1"><Label>Party GST</Label><Input value={form.partyGst} onChange={(e) => setForm({ ...form, partyGst: e.target.value })} /></div>
          <div className="space-y-1"><Label>Customer Mobile</Label><Input value={form.partyMobile} onChange={(e) => setForm({ ...form, partyMobile: e.target.value })} /></div>

          <div className="col-span-2 border-t pt-3 font-semibold text-sm">Item</div>
          <div className="space-y-1"><Label>Fertilizer</Label>
            <Select value={form.fertilizer} onValueChange={onFertChange}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent className="bg-popover">{FERTILIZER_MASTER.map((f) => <SelectItem key={f.name} value={f.name}>{f.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1"><Label>Bags *</Label><Input type="number" value={form.bags || ""} onChange={(e) => setForm({ ...form, bags: +e.target.value })} required /></div>
          <div className="space-y-1"><Label>Price / Bag (auto)</Label><Input type="number" value={form.pricePerBag} onChange={(e) => setForm({ ...form, pricePerBag: +e.target.value })} disabled={!editFin} /></div>
          <div className="space-y-1"><Label>Amount</Label><Input value={`₹${calc.amount.toLocaleString()}`} disabled /></div>

          <div className="col-span-2 border-t pt-3 font-semibold text-sm">GST / Margin / Subsidy {editFin ? "" : "(read-only)"}</div>
          <div className="space-y-1"><Label>CGST %</Label><Input type="number" step="0.01" value={form.cgstPct} onChange={(e) => setForm({ ...form, cgstPct: +e.target.value })} disabled={!editFin} /></div>
          <div className="space-y-1"><Label>SGST %</Label><Input type="number" step="0.01" value={form.sgstPct} onChange={(e) => setForm({ ...form, sgstPct: +e.target.value })} disabled={!editFin} /></div>
          <div className="space-y-1"><Label>Margin Rate / Bag</Label><Input type="number" value={form.marginRate} onChange={(e) => setForm({ ...form, marginRate: +e.target.value })} disabled={!editFin} /></div>
          <div className="space-y-1"><Label>Subsidy Amount (₹)</Label><Input type="number" value={form.subsidy || ""} onChange={(e) => setForm({ ...form, subsidy: +e.target.value })} disabled={!editFin} /></div>

          <div className="col-span-2 p-3 rounded-lg border bg-muted/30 space-y-1 text-sm">
            <div className="flex justify-between"><span>Amount</span><span>₹{calc.amount.toLocaleString()}</span></div>
            <div className="flex justify-between"><span>CGST</span><span>₹{calc.cgstAmount}</span></div>
            <div className="flex justify-between"><span>SGST</span><span>₹{calc.sgstAmount}</span></div>
            <div className="flex justify-between border-t pt-1"><span>Total</span><span>₹{calc.total.toLocaleString()}</span></div>
            <div className="flex justify-between"><span>+ Margin</span><span>₹{calc.margin}</span></div>
            <div className="flex justify-between"><span>− Subsidy</span><span>₹{form.subsidy.toLocaleString()}</span></div>
            <div className="flex justify-between text-lg font-bold pt-2 border-t mt-2"><span>Net Amount</span><span className="text-primary">₹{calc.netAmount.toLocaleString()}</span></div>
          </div>
        </div>
      </FormModal>

      {/* View / Print modal */}
      <FormModal open={!!view} onOpenChange={(o) => !o && setView(null)} title={`Invoice ${view?.billNo ?? ""}`} size="lg">
        {view && (
          <div className="space-y-3">
            <div className="flex justify-end gap-2">
              <Button size="sm" onClick={() => printInvoice(view)}><Printer className="w-4 h-4 mr-2" />Print Invoice</Button>
            </div>
            <div className="bg-white text-black border-2 border-black p-5 font-serif text-sm">
              <div className="text-center border-b-2 border-black pb-2 mb-3">
                <div className="text-xl font-bold">HIMFED</div>
                <div className="text-[10px]">Himachal Pradesh State Cooperative Marketing & Consumers Federation Ltd.</div>
                <div className="text-xs font-semibold mt-1">TAX INVOICE</div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                <div><b>Bill No:</b> {view.billNo}</div><div className="text-right"><b>Date:</b> {view.date}</div>
                <div><b>FY:</b> {view.financialYear}</div><div className="text-right"><b>Warehouse:</b> {view.warehouseCode}</div>
                <div className="col-span-2 border-t pt-2"><b>Party:</b> {view.partyName}</div>
                <div><b>GST:</b> {view.partyGst || "—"}</div><div className="text-right"><b>Mobile:</b> {view.partyMobile || "—"}</div>
                <div className="col-span-2"><b>Area:</b> {areaName(view.areaId)}</div>
              </div>
              <table className="w-full border-collapse text-xs mt-2">
                <thead><tr className="bg-gray-100">
                  <th className="border border-black p-1">S.No</th><th className="border border-black p-1 text-left">Fertilizer</th>
                  <th className="border border-black p-1">Bags</th><th className="border border-black p-1">Price</th>
                  <th className="border border-black p-1">Amount</th>
                </tr></thead>
                <tbody>
                  <tr><td className="border border-black p-1 text-center">1</td><td className="border border-black p-1">{view.fertilizer}</td>
                    <td className="border border-black p-1 text-center">{view.bags}</td>
                    <td className="border border-black p-1 text-right">₹{view.pricePerBag}</td>
                    <td className="border border-black p-1 text-right">₹{view.amount.toLocaleString()}</td></tr>
                  <tr><td colSpan={4} className="border border-black p-1 text-right">CGST {view.cgstPct}%</td><td className="border border-black p-1 text-right">₹{view.cgstAmount}</td></tr>
                  <tr><td colSpan={4} className="border border-black p-1 text-right">SGST {view.sgstPct}%</td><td className="border border-black p-1 text-right">₹{view.sgstAmount}</td></tr>
                  <tr><td colSpan={4} className="border border-black p-1 text-right">Total</td><td className="border border-black p-1 text-right">₹{view.total.toLocaleString()}</td></tr>
                  <tr><td colSpan={4} className="border border-black p-1 text-right">Margin ({view.marginRate}/bag)</td><td className="border border-black p-1 text-right">₹{view.margin}</td></tr>
                  <tr><td colSpan={4} className="border border-black p-1 text-right">Less: Subsidy</td><td className="border border-black p-1 text-right">(₹{view.subsidy.toLocaleString()})</td></tr>
                  <tr className="bg-gray-100 font-bold"><td colSpan={4} className="border border-black p-1 text-right">NET AMOUNT</td><td className="border border-black p-1 text-right">₹{view.netAmount.toLocaleString()}</td></tr>
                </tbody>
              </table>
              <div className="flex justify-between mt-10 text-xs">
                <div className="border-t border-black pt-1 w-40 text-center">Customer Signature</div>
                <div className="border-t border-black pt-1 w-40 text-center">Authorized Signatory</div>
              </div>
            </div>
          </div>
        )}
      </FormModal>
    </AppShell>
  );
}
