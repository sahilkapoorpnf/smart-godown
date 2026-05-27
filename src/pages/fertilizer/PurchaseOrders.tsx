import { useState } from "react";
import AppShell from "@/components/warehouse/AppShell";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, Column } from "@/components/shared/DataTable";
import { FormModal } from "@/components/shared/FormModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShoppingCart, Eye, Pencil } from "lucide-react";
import { useFertilizerStore, upsertPO, nextPONumber, companyName, productName } from "@/lib/fertilizer/store";
import { areaName, getCurrentUser, store, warehouseName } from "@/lib/warehouse/store";
import type { POStatus, PurchaseOrder, WarehouseAllocation } from "@/lib/fertilizer/types";
import { toast } from "sonner";

const poStyle: Record<POStatus, string> = {
  draft: "bg-muted text-muted-foreground border-border",
  sent: "bg-primary/15 text-primary border-primary/30",
  in_transit: "bg-himfed-warning/15 text-himfed-warning border-himfed-warning/30",
  delivered: "bg-himfed-success/15 text-himfed-success border-himfed-success/30",
  closed: "bg-muted text-foreground border-border",
};
const poLabel: Record<POStatus, string> = {
  draft: "Draft", sent: "Sent", in_transit: "In Transit", delivered: "Delivered", closed: "Closed",
};

const emptyPO = (): PurchaseOrder => ({
  id: "", poNumber: "", companyId: "", productId: "", areaId: "",
  quantity: 0, allocations: [], deliveryInstructions: "",
  expectedDelivery: new Date().toISOString().slice(0, 10),
  status: "draft", createdAt: new Date().toISOString(), createdBy: "u1",
});

export default function PurchaseOrders() {
  const user = getCurrentUser();
  const { purchaseOrders, companies, products } = useFertilizerStore();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<PurchaseOrder>(emptyPO());

  const startAdd = () => { setForm({ ...emptyPO(), id: `po${Date.now()}`, poNumber: nextPONumber() }); setOpen(true); };
  const startEdit = (po: PurchaseOrder) => { setForm(po); setOpen(true); };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.companyId || !form.productId || !form.areaId || form.quantity <= 0) {
      toast.error("Fill company, product, area and quantity"); return;
    }
    upsertPO({ ...form, createdBy: user?.id || "u1" });
    toast.success("Purchase order saved");
    setOpen(false);
  };

  const setAllocsFromArea = (areaId: string) => {
    const whs = store.warehouses.filter((w) => w.areaId === areaId);
    setForm((f) => ({ ...f, areaId, allocations: whs.map((w) => ({ warehouseId: w.id, quantity: 0 })) }));
  };

  const columns: Column<PurchaseOrder>[] = [
    { key: "poNumber", label: "PO No.", sortable: true },
    { key: "companyId", label: "Company", render: (p) => companyName(p.companyId) },
    { key: "productId", label: "Product", render: (p) => productName(p.productId) },
    { key: "areaId", label: "Area", render: (p) => areaName(p.areaId) },
    { key: "quantity", label: "Qty", render: (p) => `${p.quantity} Bags` },
    { key: "expectedDelivery", label: "Expected" },
    { key: "status", label: "Status", render: (p) => <Badge variant="outline" className={poStyle[p.status]}>{poLabel[p.status]}</Badge> },
  ];

  return (
    <AppShell allowed={["superadmin"]}>
      <PageHeader title="Purchase Orders" description="Create POs to fertilizer companies and track dispatch." icon={ShoppingCart} />
      <DataTable
        data={purchaseOrders}
        columns={columns}
        searchKey="poNumber"
        searchPlaceholder="Search PO number..."
        onAdd={startAdd}
        addLabel="Create PO"
        actions={(p) => (
          <div className="flex gap-1 justify-end">
            <Button size="sm" variant="ghost" onClick={() => startEdit(p)}><Pencil className="w-4 h-4" /></Button>
            <Button size="sm" variant="ghost" onClick={() => startEdit(p)}><Eye className="w-4 h-4" /></Button>
          </div>
        )}
      />

      <FormModal open={open} onOpenChange={setOpen} title={form.poNumber || "New PO"} size="xl" onSubmit={submit}>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1"><Label>PO Number</Label><Input value={form.poNumber} onChange={(e) => setForm({ ...form, poNumber: e.target.value })} /></div>
          <div className="space-y-1">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v: any) => setForm({ ...form, status: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent className="bg-popover">
                {(["draft", "sent", "in_transit", "delivered", "closed"] as POStatus[]).map((s) => <SelectItem key={s} value={s}>{poLabel[s]}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label>Company *</Label>
            <Select value={form.companyId} onValueChange={(v) => setForm({ ...form, companyId: v })}>
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent className="bg-popover">{companies.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label>Product *</Label>
            <Select value={form.productId} onValueChange={(v) => setForm({ ...form, productId: v })}>
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent className="bg-popover">{products.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label>Area *</Label>
            <Select value={form.areaId} onValueChange={setAllocsFromArea}>
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent className="bg-popover">{store.areas.map((a) => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1"><Label>Total Quantity (Bags)</Label><Input type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: +e.target.value })} /></div>
          <div className="space-y-1"><Label>Expected Delivery</Label><Input type="date" value={form.expectedDelivery} onChange={(e) => setForm({ ...form, expectedDelivery: e.target.value })} /></div>
          <div className="space-y-1 col-span-2"><Label>Delivery Instructions</Label><Textarea value={form.deliveryInstructions} onChange={(e) => setForm({ ...form, deliveryInstructions: e.target.value })} maxLength={500} /></div>

          {form.allocations.length > 0 && (
            <div className="col-span-2 space-y-2 p-3 border border-border rounded-lg bg-muted/30">
              <div className="text-sm font-semibold">Warehouse Allocations</div>
              {form.allocations.map((a, i) => (
                <div key={i} className="grid grid-cols-2 gap-3 items-center">
                  <div className="text-sm">{warehouseName(a.warehouseId)}</div>
                  <Input type="number" value={a.quantity} onChange={(e) => {
                    const v = +e.target.value;
                    setForm((f) => ({ ...f, allocations: f.allocations.map((x, j) => j === i ? { ...x, quantity: v } : x) }));
                  }} />
                </div>
              ))}
              <div className="text-xs text-muted-foreground">
                Allocated: {form.allocations.reduce((s, a) => s + (a.quantity || 0), 0)} / {form.quantity}
              </div>
            </div>
          )}
        </div>
      </FormModal>
    </AppShell>
  );
}
