import { useState } from "react";
import ErpPage, { fmtINR } from "@/components/erp/ErpPage";
import { DataTable } from "@/components/erp/DataTable";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeftRight, Plus } from "lucide-react";
import { useErp, godownName, itemName, addVoucher } from "@/lib/erp/store";

export default function StockTransfer() {
  const { vouchers, godowns, stockItems } = useErp();
  const rows = vouchers.filter((v) => v.kind === "stock_transfer");

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ date: new Date().toISOString().slice(0, 10), itemId: stockItems[0]?.id ?? "", from: godowns[0]?.id, to: godowns[1]?.id, qty: 50, rate: stockItems[0]?.ratePerUnit ?? 300, narration: "Inter-depot transfer" });

  const save = () => {
    const amount = form.qty * form.rate;
    const n = rows.length + 1;
    addVoucher({
      id: `v_st_${Date.now()}`, voucherNo: `STK/26-27/${String(n).padStart(4, "0")}`, kind: "stock_transfer",
      date: form.date, narration: form.narration,
      lines: [{ itemId: form.itemId, qty: form.qty, rate: form.rate, amount, godownFromId: form.from!, godownToId: form.to! }],
      total: amount, gstTotal: 0, grandTotal: amount,
      createdBy: "wa_una", createdAt: new Date().toISOString(),
    });
    toast.success("Stock transfer recorded — both godowns updated");
    setOpen(false);
  };

  return (
    <ErpPage allowed={["wh_accountant", "admin_accountant"]} title="Stock Transfer Between Depots" description="Move inventory between HIMFED godowns / depots."
      actions={<Button onClick={() => setOpen(true)}><Plus className="w-4 h-4 mr-2" />New Transfer</Button>}>
      <DataTable rows={rows} exportName="stock-transfers" searchKeys={["voucherNo", "narration"] as any}
        columns={[
          { key: "date", label: "Date", sortable: true },
          { key: "voucherNo", label: "Voucher", render: (r) => <span className="font-mono font-semibold">{r.voucherNo}</span> },
          { key: "from", label: "From → To", render: (r) => <span className="text-xs">{godownName(r.lines[0]?.godownFromId)} <ArrowLeftRight className="inline w-3 h-3 mx-1" /> {godownName(r.lines[0]?.godownToId)}</span> },
          { key: "item", label: "Item", render: (r) => itemName(r.lines[0]?.itemId) },
          { key: "qty", label: "Qty", className: "text-right", render: (r) => r.lines[0]?.qty },
          { key: "rate", label: "Rate", className: "text-right font-mono", render: (r) => fmtINR(r.lines[0]?.rate ?? 0) },
          { key: "amount", label: "Value", className: "text-right font-mono font-semibold", render: (r) => fmtINR(r.grandTotal) },
        ]} />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>New Stock Transfer</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <Field label="Date"><Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></Field>
            <Field label="Item">
              <Select value={form.itemId} onValueChange={(v) => setForm({ ...form, itemId: v, rate: stockItems.find(i => i.id === v)?.ratePerUnit ?? form.rate })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{stockItems.map((i) => <SelectItem key={i.id} value={i.id}>{i.name}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
            <Field label="From Depot">
              <Select value={form.from} onValueChange={(v) => setForm({ ...form, from: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{godowns.map((g) => <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
            <Field label="To Depot">
              <Select value={form.to} onValueChange={(v) => setForm({ ...form, to: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{godowns.map((g) => <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
            <Field label="Quantity"><Input type="number" value={form.qty} onChange={(e) => setForm({ ...form, qty: +e.target.value })} /></Field>
            <Field label="Rate"><Input type="number" value={form.rate} onChange={(e) => setForm({ ...form, rate: +e.target.value })} /></Field>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={save}>Save Transfer</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </ErpPage>
  );
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">{label}</Label>{children}</div>;
}
