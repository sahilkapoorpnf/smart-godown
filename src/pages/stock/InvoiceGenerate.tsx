import { useMemo, useState } from "react";
import AppShell from "@/components/warehouse/AppShell";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, Column } from "@/components/shared/DataTable";
import { FormModal } from "@/components/shared/FormModal";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Plus, Printer, Eye } from "lucide-react";
import { getCurrentUser, store as wh, areaName, warehouseName } from "@/lib/warehouse/store";
import { useFertilizerStore, productName, priceFor } from "@/lib/fertilizer/store";
import { addInvoice, taxFor, useStockStore, visibleInvoices } from "@/lib/stock/store";
import type { SalesInvoice } from "@/lib/stock/types";
import { toast } from "sonner";

export default function InvoiceGenerate() {
  const user = getCurrentUser();
  useStockStore();
  const { products } = useFertilizerStore();
  const invoices = useMemo(() => visibleInvoices(user), [user]);

  const [open, setOpen] = useState(false);
  const [view, setView] = useState<SalesInvoice | null>(null);
  const [form, setForm] = useState({
    invoiceDate: new Date().toISOString().slice(0, 10),
    customerName: "", customerGst: "", customerAddress: "", driverName: "",
    areaId: user?.areaId ?? "", warehouseId: user?.warehouseId ?? "",
    productId: "", qty: 0,
  });

  const rate = form.productId ? (priceFor(form.productId)?.sellingPrice ?? 0) : 0;
  const tax = form.productId ? taxFor(form.productId) : { cgst: 0, sgst: 0, distributionMargin: 0, productId: "" };
  const sub = form.qty * rate;
  const cgstA = +(sub * tax.cgst / 100).toFixed(2);
  const sgstA = +(sub * tax.sgst / 100).toFixed(2);
  const dm = form.qty * tax.distributionMargin;
  const raw = sub + cgstA + sgstA + dm;
  const grand = Math.round(raw);
  const round = +(grand - raw).toFixed(2);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!form.customerName || !form.productId || form.qty <= 0 || !form.areaId || !form.warehouseId) {
      toast.error("Fill required fields"); return;
    }
    const inv = addInvoice({
      invoiceDate: form.invoiceDate, customerName: form.customerName, customerGst: form.customerGst,
      customerAddress: form.customerAddress, driverName: form.driverName,
      areaId: form.areaId, warehouseId: form.warehouseId,
      lines: [{ productId: form.productId, qty: form.qty, rate, amount: sub }],
      subTotal: sub, cgstAmount: cgstA, sgstAmount: sgstA, distributionMargin: dm,
      roundOff: round, grandTotal: grand, createdBy: user.id,
    });
    toast.success(`Invoice ${inv.invoiceNumber} generated`);
    setOpen(false);
    setForm({ ...form, customerName: "", customerGst: "", customerAddress: "", driverName: "", productId: "", qty: 0 });
    setView(inv);
  };

  const print = () => {
    const node = document.getElementById("invoice-print");
    if (!node) return;
    const w = window.open("", "_blank", "width=900,height=700");
    if (!w) return;
    w.document.write(`<html><head><title>${view?.invoiceNumber}</title>
      <style>body{font-family:Georgia,serif;padding:24px;color:#111}
      table{width:100%;border-collapse:collapse;margin-top:12px}
      th,td{border:1px solid #333;padding:6px 8px;font-size:13px}
      th{background:#f3f3f3;text-align:left}
      .hdr{text-align:center;border-bottom:2px solid #000;padding-bottom:8px;margin-bottom:12px}
      .row{display:flex;justify-content:space-between;gap:24px;margin:6px 0;font-size:13px}
      .sig{margin-top:60px;display:flex;justify-content:space-between}
      </style></head><body>${node.innerHTML}</body></html>`);
    w.document.close(); w.focus(); w.print();
  };

  const areaWh = wh.warehouses.filter((w) => w.areaId === form.areaId);

  const cols: Column<SalesInvoice>[] = [
    { key: "invoiceNumber", label: "Invoice No.", sortable: true },
    { key: "invoiceDate", label: "Date", sortable: true },
    { key: "customerName", label: "Customer" },
    { key: "areaId", label: "Area", render: (i) => areaName(i.areaId) },
    { key: "warehouseId", label: "Warehouse", render: (i) => warehouseName(i.warehouseId) },
    { key: "lines", label: "Items", render: (i) => i.lines.map(l => `${productName(l.productId)} × ${l.qty}`).join(", ") },
    { key: "grandTotal", label: "Total", render: (i) => <span className="font-semibold">₹{i.grandTotal.toLocaleString()}</span> },
  ];

  return (
    <AppShell allowed={["superadmin", "accountant", "warehouse_staff"]}>
      <PageHeader title="Sales Invoice" description="Generate printable HIMFED-style government invoices." icon={FileText} />

      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-end mb-3">
            <Button onClick={() => setOpen(true)} className="bg-primary"><Plus className="w-4 h-4 mr-2" /> New Invoice</Button>
          </div>
          <DataTable
            data={invoices}
            columns={cols}
            searchKey="invoiceNumber"
            searchPlaceholder="Search invoice / customer..."
            actions={(i) => (
              <Button size="sm" variant="ghost" onClick={() => setView(i)}><Eye className="w-4 h-4" /></Button>
            )}
          />
        </CardContent>
      </Card>

      {/* Create */}
      <FormModal open={open} onOpenChange={setOpen} title="Generate Invoice" size="xl" onSubmit={submit} submitLabel="Generate & Print">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1"><Label>Invoice Date</Label><Input type="date" value={form.invoiceDate} onChange={(e) => setForm({ ...form, invoiceDate: e.target.value })} /></div>
          <div className="space-y-1"><Label>Driver / Carrier</Label><Input value={form.driverName} onChange={(e) => setForm({ ...form, driverName: e.target.value })} /></div>
          <div className="space-y-1"><Label>Customer Name *</Label><Input value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} required /></div>
          <div className="space-y-1"><Label>Party GST Number</Label><Input value={form.customerGst} onChange={(e) => setForm({ ...form, customerGst: e.target.value })} placeholder="Optional" /></div>
          <div className="space-y-1 col-span-2"><Label>Customer Address</Label><Input value={form.customerAddress} onChange={(e) => setForm({ ...form, customerAddress: e.target.value })} /></div>
          <div className="space-y-1"><Label>Area *</Label>
            <Select value={form.areaId} onValueChange={(v) => setForm({ ...form, areaId: v, warehouseId: "" })}>
              <SelectTrigger><SelectValue placeholder="Select area" /></SelectTrigger>
              <SelectContent className="bg-popover">{wh.areas.map((a) => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1"><Label>Warehouse *</Label>
            <Select value={form.warehouseId} onValueChange={(v) => setForm({ ...form, warehouseId: v })}>
              <SelectTrigger><SelectValue placeholder="Select warehouse" /></SelectTrigger>
              <SelectContent className="bg-popover">{areaWh.map((w) => <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1"><Label>Fertilizer *</Label>
            <Select value={form.productId} onValueChange={(v) => setForm({ ...form, productId: v })}>
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent className="bg-popover">{products.filter(p => p.status === "active").map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1"><Label>Quantity (bags) *</Label><Input type="number" value={form.qty || ""} onChange={(e) => setForm({ ...form, qty: +e.target.value })} /></div>

          <div className="col-span-2 p-3 rounded-lg border bg-muted/30 space-y-1 text-sm">
            <div className="flex justify-between"><span>Rate (auto)</span><span>₹{rate}</span></div>
            <div className="flex justify-between"><span>Sub Total</span><span>₹{sub.toLocaleString()}</span></div>
            <div className="flex justify-between"><span>CGST ({tax.cgst}%)</span><span>₹{cgstA}</span></div>
            <div className="flex justify-between"><span>SGST ({tax.sgst}%)</span><span>₹{sgstA}</span></div>
            <div className="flex justify-between"><span>Distribution Margin</span><span>₹{dm}</span></div>
            <div className="flex justify-between"><span>Round Off</span><span>₹{round}</span></div>
            <div className="flex justify-between text-lg font-bold pt-2 border-t mt-2"><span>Grand Total</span><span className="text-primary">₹{grand.toLocaleString()}</span></div>
          </div>
        </div>
      </FormModal>

      {/* View / Print */}
      <FormModal open={!!view} onOpenChange={(o) => !o && setView(null)} title={`Invoice ${view?.invoiceNumber ?? ""}`} size="xl">
        {view && (
          <div className="space-y-3">
            <div className="flex justify-end">
              <Button onClick={print} size="sm"><Printer className="w-4 h-4 mr-2" /> Print / Download PDF</Button>
            </div>
            <div id="invoice-print" className="bg-white text-black border-2 border-black p-6 font-serif">
              <div className="hdr text-center border-b-2 border-black pb-2 mb-3">
                <div className="text-2xl font-bold">HIMFED</div>
                <div className="text-xs">Himachal Pradesh State Cooperative Marketing & Consumers Federation Ltd.</div>
                <div className="text-sm font-semibold mt-1">TAX INVOICE</div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs mb-2">
                <div><b>Invoice No:</b> {view.invoiceNumber}</div>
                <div className="text-right"><b>Date:</b> {view.invoiceDate}</div>
                <div><b>Financial Year:</b> {view.financialYear}</div>
                <div className="text-right"><b>Warehouse:</b> {warehouseName(view.warehouseId)}, {areaName(view.areaId)}</div>
                <div className="col-span-2 border-t pt-2"><b>Name of Customer:</b> {view.customerName}</div>
                <div><b>Party GST:</b> {view.customerGst || "—"}</div>
                <div className="text-right"><b>Address:</b> {view.customerAddress || "—"}</div>
              </div>
              <table className="w-full border-collapse text-xs mt-2">
                <thead><tr className="bg-gray-100">
                  <th className="border border-black p-1">S.No</th>
                  <th className="border border-black p-1 text-left">Name of Commodity</th>
                  <th className="border border-black p-1">Qty</th>
                  <th className="border border-black p-1">Rate</th>
                  <th className="border border-black p-1">Amount</th>
                </tr></thead>
                <tbody>
                  {view.lines.map((l, i) => (
                    <tr key={i}>
                      <td className="border border-black p-1 text-center">{i + 1}</td>
                      <td className="border border-black p-1">{productName(l.productId)}</td>
                      <td className="border border-black p-1 text-center">{l.qty}</td>
                      <td className="border border-black p-1 text-right">₹{l.rate}</td>
                      <td className="border border-black p-1 text-right">₹{l.amount.toLocaleString()}</td>
                    </tr>
                  ))}
                  <tr><td colSpan={4} className="border border-black p-1 text-right font-semibold">Sub Total</td><td className="border border-black p-1 text-right">₹{view.subTotal.toLocaleString()}</td></tr>
                  <tr><td colSpan={4} className="border border-black p-1 text-right">CGST</td><td className="border border-black p-1 text-right">₹{view.cgstAmount}</td></tr>
                  <tr><td colSpan={4} className="border border-black p-1 text-right">SGST</td><td className="border border-black p-1 text-right">₹{view.sgstAmount}</td></tr>
                  <tr><td colSpan={4} className="border border-black p-1 text-right">Distribution Margin</td><td className="border border-black p-1 text-right">₹{view.distributionMargin}</td></tr>
                  <tr><td colSpan={4} className="border border-black p-1 text-right">Round Off</td><td className="border border-black p-1 text-right">₹{view.roundOff}</td></tr>
                  <tr className="bg-gray-100 font-bold"><td colSpan={4} className="border border-black p-1 text-right">GRAND TOTAL</td><td className="border border-black p-1 text-right">₹{view.grandTotal.toLocaleString()}</td></tr>
                </tbody>
              </table>
              <div className="sig mt-12 flex justify-between text-xs">
                <div className="border-t border-black pt-1 w-48 text-center">Signature of Customer / Driver</div>
                <div className="border-t border-black pt-1 w-48 text-center">Authorized Signatory</div>
              </div>
            </div>
          </div>
        )}
      </FormModal>
    </AppShell>
  );
}
