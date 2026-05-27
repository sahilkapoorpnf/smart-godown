import { useState } from "react";
import AppShell from "@/components/warehouse/AppShell";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, Column } from "@/components/shared/DataTable";
import { FormModal } from "@/components/shared/FormModal";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IndianRupee, Pencil, Trash2 } from "lucide-react";
import { useFertilizerStore, upsertPricing, deletePricing, companyName, productName } from "@/lib/fertilizer/store";
import type { FertilizerPricing } from "@/lib/fertilizer/types";
import { toast } from "sonner";

const empty: FertilizerPricing = {
  id: "", productId: "", companyId: "", mrp: 0, purchasePrice: 0, sellingPrice: 0, subsidy: 0,
  effectiveDate: new Date().toISOString().slice(0, 10), status: "active",
};

const fmt = (n: number) => `₹ ${n.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

export default function FertilizerPricing() {
  const { pricing, products, companies } = useFertilizerStore();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FertilizerPricing>(empty);

  const startAdd = () => { setForm({ ...empty, id: `pr${Date.now()}` }); setOpen(true); };
  const startEdit = (p: FertilizerPricing) => { setForm(p); setOpen(true); };

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.productId || !form.companyId) { toast.error("Product and company required"); return; }
    upsertPricing(form);
    toast.success("Pricing saved");
    setOpen(false);
  };

  const columns: Column<FertilizerPricing>[] = [
    { key: "productId", label: "Product", render: (p) => productName(p.productId) },
    { key: "companyId", label: "Company", render: (p) => companyName(p.companyId) },
    { key: "mrp", label: "MRP", render: (p) => fmt(p.mrp) },
    { key: "purchasePrice", label: "Purchase", render: (p) => fmt(p.purchasePrice) },
    { key: "sellingPrice", label: "Selling", render: (p) => fmt(p.sellingPrice) },
    { key: "subsidy", label: "Subsidy", render: (p) => fmt(p.subsidy) },
    { key: "effectiveDate", label: "Effective" },
    { key: "status", label: "Status", render: (p) => <StatusBadge status={p.status} /> },
  ];

  return (
    <AppShell allowed={["superadmin"]}>
      <PageHeader title="Fertilizer Pricing Master" description="Superadmin-only pricing control feeding inventory valuation." icon={IndianRupee} />
      <DataTable
        data={pricing}
        columns={columns}
        searchKey="productId"
        searchPlaceholder="Search by product..."
        onAdd={startAdd}
        addLabel="Add Pricing"
        actions={(p) => (
          <div className="flex gap-1 justify-end">
            <Button size="sm" variant="ghost" onClick={() => startEdit(p)}><Pencil className="w-4 h-4" /></Button>
            <Button size="sm" variant="ghost" onClick={() => { deletePricing(p.id); toast.success("Deactivated"); }}><Trash2 className="w-4 h-4 text-destructive" /></Button>
          </div>
        )}
      />

      <FormModal open={open} onOpenChange={setOpen} title={form.id && pricing.some((p) => p.id === form.id) ? "Edit Pricing" : "Add Pricing"} size="lg" onSubmit={save}>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label>Product *</Label>
            <Select value={form.productId} onValueChange={(v) => { const pr = products.find((p) => p.id === v); setForm({ ...form, productId: v, companyId: pr?.companyId || form.companyId }); }}>
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent className="bg-popover">{products.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label>Company *</Label>
            <Select value={form.companyId} onValueChange={(v) => setForm({ ...form, companyId: v })}>
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent className="bg-popover">{companies.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1"><Label>MRP / Bag</Label><Input type="number" value={form.mrp} onChange={(e) => setForm({ ...form, mrp: +e.target.value })} /></div>
          <div className="space-y-1"><Label>Purchase Price</Label><Input type="number" value={form.purchasePrice} onChange={(e) => setForm({ ...form, purchasePrice: +e.target.value })} /></div>
          <div className="space-y-1"><Label>Selling Price</Label><Input type="number" value={form.sellingPrice} onChange={(e) => setForm({ ...form, sellingPrice: +e.target.value })} /></div>
          <div className="space-y-1"><Label>Subsidy</Label><Input type="number" value={form.subsidy} onChange={(e) => setForm({ ...form, subsidy: +e.target.value })} /></div>
          <div className="space-y-1"><Label>Effective Date</Label><Input type="date" value={form.effectiveDate} onChange={(e) => setForm({ ...form, effectiveDate: e.target.value })} /></div>
          <div className="space-y-1">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v: any) => setForm({ ...form, status: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </FormModal>
    </AppShell>
  );
}
