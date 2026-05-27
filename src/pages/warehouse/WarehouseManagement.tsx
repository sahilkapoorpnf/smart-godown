import { useState } from "react";
import AppShell from "@/components/warehouse/AppShell";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, Column } from "@/components/shared/DataTable";
import { FormModal } from "@/components/shared/FormModal";
import { DeleteConfirmDialog } from "@/components/shared/DeleteConfirmDialog";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Warehouse as WarehouseIcon, Pencil, Trash2 } from "lucide-react";
import { Warehouse } from "@/lib/warehouse/types";
import { areaName, deleteWarehouse, store, upsertWarehouse, useStore } from "@/lib/warehouse/store";
import { toast } from "sonner";

export default function WarehouseManagement() {
  useStore();
  const [modal, setModal] = useState(false);
  const [del, setDel] = useState<Warehouse | null>(null);
  const [editing, setEditing] = useState<Warehouse | null>(null);
  const [form, setForm] = useState<Warehouse>({
    id: "", code: "", name: "", areaId: "", address: "", capacity: 0, inchargeName: "", contact: "", status: "active",
  });

  const open = (w?: Warehouse) => {
    setEditing(w ?? null);
    setForm(w ?? { id: `w${Date.now()}`, code: "", name: "", areaId: "", address: "", capacity: 0, inchargeName: "", contact: "", status: "active" });
    setModal(true);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.code || !form.areaId) { toast.error("Code, Name and Area are required"); return; }
    upsertWarehouse(form);
    toast.success(editing ? "Warehouse updated" : "Warehouse created");
    setModal(false);
  };

  const columns: Column<Warehouse>[] = [
    { key: "code", label: "Code", sortable: true },
    { key: "name", label: "Warehouse", sortable: true },
    { key: "areaId", label: "Area", render: (w) => areaName(w.areaId) },
    { key: "address", label: "Address" },
    { key: "capacity", label: "Capacity (MT)", render: (w) => w.capacity.toLocaleString() },
    { key: "inchargeName", label: "Incharge" },
    { key: "contact", label: "Contact" },
    {
      key: "_ent", label: "Entries",
      render: (w) => <span className="font-medium">{store.entries.filter((e) => e.warehouseId === w.id).length}</span>,
    },
    { key: "status", label: "Status", render: (w) => <StatusBadge status={w.status as any} /> },
  ];

  return (
    <AppShell allowed={["superadmin"]}>
      <PageHeader title="Warehouse Management" description="Assign warehouses under areas and track staffing." icon={WarehouseIcon} />
      <DataTable
        data={store.warehouses}
        columns={columns}
        searchPlaceholder="Search warehouses..."
        searchKey="name"
        onAdd={() => open()}
        addLabel="Add Warehouse"
        actions={(w) => (
          <div className="flex gap-1 justify-end">
            <Button variant="ghost" size="sm" onClick={() => open(w)}><Pencil className="w-4 h-4" /></Button>
            <Button variant="ghost" size="sm" onClick={() => setDel(w)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
          </div>
        )}
      />

      <FormModal open={modal} onOpenChange={setModal} title={editing ? "Edit Warehouse" : "Add Warehouse"} onSubmit={submit} size="lg">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2"><Label>Code *</Label><Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="WH-SHM-01" /></div>
          <div className="space-y-2"><Label>Name *</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div className="space-y-2 col-span-2">
            <Label>Area *</Label>
            <Select value={form.areaId} onValueChange={(v) => setForm({ ...form, areaId: v })}>
              <SelectTrigger><SelectValue placeholder="Choose area" /></SelectTrigger>
              <SelectContent className="bg-popover">
                {store.areas.map((a) => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 col-span-2"><Label>Address</Label><Textarea value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
          <div className="space-y-2"><Label>Capacity (MT)</Label><Input type="number" value={form.capacity || ""} onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })} /></div>
          <div className="space-y-2"><Label>Incharge Name</Label><Input value={form.inchargeName} onChange={(e) => setForm({ ...form, inchargeName: e.target.value })} /></div>
          <div className="space-y-2"><Label>Contact</Label><Input value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} /></div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as any })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="maintenance">Under Maintenance</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </FormModal>

      <DeleteConfirmDialog
        open={!!del}
        onOpenChange={(o) => !o && setDel(null)}
        onConfirm={() => { if (del) { deleteWarehouse(del.id); toast.success("Warehouse deleted"); setDel(null); } }}
        title="Delete warehouse?"
        description={`This will remove ${del?.name}.`}
      />
    </AppShell>
  );
}
