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
import { Package, Pencil, Trash2 } from "lucide-react";
import { useFertilizerStore, upsertProduct, deleteProduct, companyName } from "@/lib/fertilizer/store";
import { FertilizerProduct } from "@/lib/fertilizer/types";
import { toast } from "sonner";

const empty: FertilizerProduct = {
  id: "", code: "", name: "", companyId: "", unit: "Bag", category: "Nitrogenous", status: "active",
};

export default function FertilizerProducts() {
  const { products, companies } = useFertilizerStore();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FertilizerProduct>(empty);

  const startAdd = () => { setForm({ ...empty, id: `fp${Date.now()}` }); setOpen(true); };
  const startEdit = (p: FertilizerProduct) => { setForm(p); setOpen(true); };

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.code || !form.name || !form.companyId) { toast.error("Code, name and company required"); return; }
    upsertProduct(form);
    toast.success("Product saved");
    setOpen(false);
  };

  const columns: Column<FertilizerProduct>[] = [
    { key: "code", label: "Code", sortable: true },
    { key: "name", label: "Product", sortable: true },
    { key: "companyId", label: "Company", render: (p) => companyName(p.companyId) },
    { key: "category", label: "Category" },
    { key: "unit", label: "Unit" },
    { key: "status", label: "Status", render: (p) => <StatusBadge status={p.status} /> },
  ];

  return (
    <AppShell allowed={["superadmin"]}>
      <PageHeader title="Fertilizer Product Master" description="Catalogue of all fertilizer SKUs across companies." icon={Package} />
      <DataTable
        data={products}
        columns={columns}
        searchKey="name"
        searchPlaceholder="Search product..."
        onAdd={startAdd}
        addLabel="Add Product"
        actions={(p) => (
          <div className="flex gap-1 justify-end">
            <Button size="sm" variant="ghost" onClick={() => startEdit(p)}><Pencil className="w-4 h-4" /></Button>
            <Button size="sm" variant="ghost" onClick={() => { deleteProduct(p.id); toast.success("Deactivated"); }}><Trash2 className="w-4 h-4 text-destructive" /></Button>
          </div>
        )}
      />

      <FormModal open={open} onOpenChange={setOpen} title={form.code ? "Edit Product" : "Add Product"} size="lg" onSubmit={save}>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1"><Label>Product Code *</Label><Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} maxLength={30} /></div>
          <div className="space-y-1"><Label>Product Name *</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} maxLength={100} /></div>
          <div className="space-y-1">
            <Label>Company *</Label>
            <Select value={form.companyId} onValueChange={(v) => setForm({ ...form, companyId: v })}>
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent className="bg-popover">
                {companies.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label>Unit</Label>
            <Select value={form.unit} onValueChange={(v: any) => setForm({ ...form, unit: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent className="bg-popover">
                {["Bag", "Quintal", "Kg", "Ton"].map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label>Category</Label>
            <Select value={form.category} onValueChange={(v: any) => setForm({ ...form, category: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent className="bg-popover">
                {["Nitrogenous", "Phosphatic", "Potassic", "Complex", "Organic"].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
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
