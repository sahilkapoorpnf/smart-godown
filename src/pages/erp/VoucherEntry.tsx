import { useState } from "react";
import ErpPage, { fmtINR, Badge } from "@/components/erp/ErpPage";
import { DataTable } from "@/components/erp/DataTable";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useErp, ledgerName, itemName, godownName, addVoucher } from "@/lib/erp/store";
import { Voucher, VoucherKind } from "@/lib/erp/types";
import { Plus, Printer } from "lucide-react";
import { getCurrentUser } from "@/lib/warehouse/store";

interface Props {
  kind: VoucherKind;
  title: string;
  description: string;
  partyGroupHint?: string;
}

export default function VoucherEntry({ kind, title, description, partyGroupHint }: Props) {
  const user = getCurrentUser();
  const { vouchers, ledgers, stockItems, godowns } = useErp();
  const rows = vouchers.filter((v) => v.kind === kind);

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    partyLedgerId: "l4",
    itemId: stockItems[0]?.id ?? "",
    qty: 100, rate: 300,
    godownId: godowns[0]?.id ?? "",
    narration: "",
    invoiceNumber: "",
  });

  const item = stockItems.find((i) => i.id === form.itemId);
  const amount = form.qty * form.rate;
  const gst = +(amount * (item?.gstRate ?? 0) / 100).toFixed(2);
  const grand = amount + gst;

  const save = () => {
    const prefix = { purchase: "PUR", sales: "SAL", payment: "PMT", receipt: "RCT", journal: "JNL", contra: "CNT", stock_transfer: "STK" }[kind];
    const n = rows.length + 1;
    const v: Voucher = {
      id: `v_${Date.now()}`, voucherNo: `${prefix}/26-27/${String(n).padStart(4, "0")}`, kind,
      date: form.date, partyLedgerId: form.partyLedgerId, narration: form.narration,
      lines: kind === "purchase" || kind === "sales"
        ? [{ itemId: form.itemId, qty: form.qty, rate: form.rate, amount, gstRate: item?.gstRate, gstAmount: gst,
            godownFromId: kind === "sales" ? form.godownId : undefined,
            godownToId: kind === "purchase" ? form.godownId : undefined }]
        : [{ ledgerId: form.partyLedgerId, amount: form.qty * form.rate || amount }],
      total: amount, gstTotal: gst, grandTotal: kind === "payment" || kind === "receipt" ? form.qty * form.rate || amount : grand,
      invoiceNumber: form.invoiceNumber || undefined,
      createdBy: user?.id ?? "wa_una", createdAt: new Date().toISOString(),
    };
    addVoucher(v);
    toast.success(`${title} ${v.voucherNo} saved · accounts & stock updated`);
    setOpen(false);
  };

  return (
    <ErpPage allowed={["wh_accountant", "admin_accountant"]} title={title} description={description}
      actions={<Button onClick={() => setOpen(true)}><Plus className="w-4 h-4 mr-2" />New {title}</Button>}>
      <DataTable<Voucher> rows={rows} exportName={`${kind}-vouchers`} searchKeys={["voucherNo", "narration", "invoiceNumber"] as any}
        columns={[
          { key: "date", label: "Date", sortable: true },
          { key: "voucherNo", label: "Voucher No.", render: (r) => <span className="font-mono font-semibold">{r.voucherNo}</span> },
          { key: "partyLedgerId", label: kind === "sales" ? "Customer" : kind === "purchase" ? "Supplier" : "Party", render: (r) => ledgerName(r.partyLedgerId) },
          { key: "lines", label: "Item / Particulars", render: (r) =>
            r.lines[0]?.itemId ? `${itemName(r.lines[0].itemId)} (${r.lines[0].qty} × ₹${r.lines[0].rate})` : r.narration },
          { key: "invoiceNumber", label: "Inv. No.", render: (r) => <span className="font-mono text-xs">{r.invoiceNumber ?? "—"}</span> },
          { key: "gstTotal", label: "GST", className: "text-right font-mono", render: (r) => fmtINR(r.gstTotal) },
          { key: "grandTotal", label: "Grand Total", className: "text-right font-mono font-semibold", render: (r) => fmtINR(r.grandTotal) },
          { key: "linkedArrivalId", label: "Source", render: (r) => r.linkedArrivalId ? <Badge tone="green">Auto from Arrival</Badge> : <Badge>Manual</Badge> },
          { key: "actions", label: "", render: () => <Button size="sm" variant="ghost"><Printer className="w-3 h-3" /></Button> },
        ]} />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>New {title}</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <Field label="Date"><Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></Field>
            <Field label={kind === "sales" ? "Customer Ledger" : kind === "purchase" ? "Supplier Ledger" : "Party / Ledger"}>
              <Select value={form.partyLedgerId} onValueChange={(v) => setForm({ ...form, partyLedgerId: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{ledgers.map((l) => <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
            {(kind === "purchase" || kind === "sales") && <>
              <Field label="Stock Item">
                <Select value={form.itemId} onValueChange={(v) => setForm({ ...form, itemId: v, rate: stockItems.find(i => i.id === v)?.ratePerUnit ?? form.rate })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{stockItems.map((i) => <SelectItem key={i.id} value={i.id}>{i.name} · GST {i.gstRate}%</SelectItem>)}</SelectContent>
                </Select>
              </Field>
              <Field label="Godown">
                <Select value={form.godownId} onValueChange={(v) => setForm({ ...form, godownId: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{godowns.map((g) => <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>)}</SelectContent>
                </Select>
              </Field>
            </>}
            <Field label="Quantity"><Input type="number" value={form.qty} onChange={(e) => setForm({ ...form, qty: +e.target.value })} /></Field>
            <Field label={kind === "purchase" || kind === "sales" ? "Rate / Unit" : "Amount (₹)"}><Input type="number" value={form.rate} onChange={(e) => setForm({ ...form, rate: +e.target.value })} /></Field>
            {(kind === "purchase" || kind === "sales") && <Field label="Invoice Number"><Input value={form.invoiceNumber} onChange={(e) => setForm({ ...form, invoiceNumber: e.target.value })} /></Field>}
            <div className="col-span-2"><Field label="Narration"><Textarea rows={2} value={form.narration} onChange={(e) => setForm({ ...form, narration: e.target.value })} /></Field></div>
            {(kind === "purchase" || kind === "sales") && (
              <div className="col-span-2 grid grid-cols-3 gap-3 p-3 rounded-lg bg-muted/30">
                <Total label="Sub-total" value={fmtINR(amount)} />
                <Total label={`GST (${item?.gstRate ?? 0}%)`} value={fmtINR(gst)} />
                <Total label="Grand Total" value={fmtINR(grand)} accent />
              </div>
            )}
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={save}>Save Voucher</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </ErpPage>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">{label}</Label>{children}</div>;
}
function Total({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return <div><div className="text-xs text-muted-foreground">{label}</div><div className={`text-lg font-mono font-bold ${accent ? "text-himfed-green" : ""}`}>{value}</div></div>;
}
