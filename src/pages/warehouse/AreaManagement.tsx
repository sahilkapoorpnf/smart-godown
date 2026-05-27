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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Pencil, Trash2 } from "lucide-react";
import { Area } from "@/lib/warehouse/types";
import { deleteArea, store, upsertArea, useStore } from "@/lib/warehouse/store";
import { toast } from "sonner";

export default function AreaManagement() {
  useStore();
  const [modal, setModal] = useState(false);
  const [del, setDel] = useState<Area | null>(null);
  const [editing, setEditing] = useState<Area | null>(null);
  const [form, setForm] = useState<Area>({
    id: "", code: "", name: "", officerName: "", contact: "", status: "active",
    createdDate: new Date().toISOString().slice(0, 10),
  });

  const officers = store.users.filter((u) => u.role === "incharge");

  const open = (a?: Area) => {
    setEditing(a ?? null);
    setForm(a ?? { id: `a${Date.now()}`, code: "", name: "", officerName: "", contact: "", status: "active", createdDate: new Date().toISOString().slice(0, 10) });
    setModal(true);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.code) { toast.error("Code and Name are required"); return; }
    upsertArea(form);
    toast.success(editing ? "Area updated" : "Area created");
    setModal(false);
  };

  const columns: Column<Area>[] = [
    { key: "code", label: "Code", sortable: true },
    { key: "name", label: "Area Name", sortable: true },
    { key: "officerName", label: "Area Officer" },
    { key: "contact", label: "Contact" },
    {
      key: "id", label: "Warehouses",
      render: (a) => <span className="font-medium">{store.warehouses.filter((w) => w.areaId === a.id).length}</span>,
    },
    {
      key: "id", label: "Entries",
      render: (a) => <span className="font-medium">{store.entries.filter((e) => e.areaId === a.id).length}</span>,
    },
    { key: "createdDate", label: "Created" },
    { key: "status", label: "Status", render: (a) => <StatusBadge status={a.status} /> },
  ];

  return (
    <AppShell allowed={["superadmin"]}>
      <PageHeader title="Area Management" description="Manage HIMFED areas and assigned Area Officers." icon={MapPin} />
      <DataTable
        data={store.areas}
        columns={columns}
        searchPlaceholder="Search areas..."
        searchKey="name"
        onAdd={() => open()}
        addLabel="Add Area"
        actions={(a) => (
          <div className="flex gap-1 justify-end">
            <Button variant="ghost" size="sm" onClick={() => open(a)}><Pencil className="w-4 h-4" /></Button>
            <Button variant="ghost" size="sm" onClick={() => setDel(a)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
          </div>
        )}
      />

      <FormModal open={modal} onOpenChange={setModal} title={editing ? "Edit Area" : "Add Area"} onSubmit={submit} size="lg">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2"><Label>Area Code *</Label><Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="ARE-SHM" /></div>
          <div className="space-y-2"><Label>Area Name *</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div className="space-y-2 col-span-2">
            <Label>Area Officer (Incharge)</Label>
            <Select value={form.officerUserId ?? ""} onValueChange={(v) => {
              const o = officers.find((u) => u.id === v);
              setForm({ ...form, officerUserId: v, officerName: o?.name ?? "", contact: o?.phone ?? form.contact });
            }}>
              <SelectTrigger><SelectValue placeholder="Choose officer" /></SelectTrigger>
              <SelectContent className="bg-popover">
                {officers.map((o) => <SelectItem key={o.id} value={o.id}>{o.name} ({o.username})</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2"><Label>Contact</Label><Input value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} /></div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as any })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent className="bg-popover"><SelectItem value="active">Active</SelectItem><SelectItem value="inactive">Inactive</SelectItem></SelectContent>
            </Select>
          </div>
        </div>
      </FormModal>

      <DeleteConfirmDialog
        open={!!del}
        onOpenChange={(o) => !o && setDel(null)}
        onConfirm={() => { if (del) { deleteArea(del.id); toast.success("Area deleted"); setDel(null); } }}
        title="Delete area?"
        description={`This will remove ${del?.name}. Warehouses under it will become unassigned.`}
      />
    </AppShell>
  );
}
