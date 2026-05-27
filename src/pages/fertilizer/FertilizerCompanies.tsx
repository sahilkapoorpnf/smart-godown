import { useState } from "react";
import AppShell from "@/components/warehouse/AppShell";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, Column } from "@/components/shared/DataTable";
import { FormModal } from "@/components/shared/FormModal";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Building2, Pencil, Trash2 } from "lucide-react";
import { useFertilizerStore, upsertCompany, deleteCompany } from "@/lib/fertilizer/store";
import { FertilizerCompany } from "@/lib/fertilizer/types";
import { toast } from "sonner";

const empty: FertilizerCompany = {
  id: "", code: "", name: "", gst: "", contactPerson: "",
  mobile: "", email: "", address: "", status: "active",
};

export default function FertilizerCompanies() {
  const { companies } = useFertilizerStore();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FertilizerCompany>(empty);

  const startAdd = () => { setForm({ ...empty, id: `fc${Date.now()}` }); setOpen(true); };
  const startEdit = (c: FertilizerCompany) => { setForm(c); setOpen(true); };

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.code) { toast.error("Code and name are required"); return; }
    upsertCompany(form);
    toast.success("Company saved");
    setOpen(false);
  };

  const columns: Column<FertilizerCompany>[] = [
    { key: "code", label: "Code", sortable: true },
    { key: "name", label: "Company Name", sortable: true },
    { key: "gst", label: "GST" },
    { key: "contactPerson", label: "Contact Person" },
    { key: "mobile", label: "Mobile" },
    { key: "email", label: "Email" },
    { key: "status", label: "Status", render: (c) => <StatusBadge status={c.status} /> },
  ];

  return (
    <AppShell allowed={["superadmin"]}>
      <PageHeader title="Fertilizer Companies" description="Manage all fertilizer supplier companies." icon={Building2} />
      <DataTable
        data={companies}
        columns={columns}
        searchPlaceholder="Search by company name..."
        searchKey="name"
        onAdd={startAdd}
        addLabel="Add Company"
        actions={(c) => (
          <div className="flex gap-1 justify-end">
            <Button size="sm" variant="ghost" onClick={() => startEdit(c)}><Pencil className="w-4 h-4" /></Button>
            <Button size="sm" variant="ghost" onClick={() => { deleteCompany(c.id); toast.success("Company deactivated"); }}>
              <Trash2 className="w-4 h-4 text-destructive" />
            </Button>
          </div>
        )}
      />

      <FormModal open={open} onOpenChange={setOpen} title={form.code ? "Edit Company" : "Add Company"} size="lg" onSubmit={save}>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1"><Label>Company Code *</Label><Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} maxLength={20} /></div>
          <div className="space-y-1"><Label>Company Name *</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} maxLength={100} /></div>
          <div className="space-y-1"><Label>GST Number</Label><Input value={form.gst} onChange={(e) => setForm({ ...form, gst: e.target.value.toUpperCase() })} maxLength={15} /></div>
          <div className="space-y-1"><Label>Contact Person</Label><Input value={form.contactPerson} onChange={(e) => setForm({ ...form, contactPerson: e.target.value })} maxLength={100} /></div>
          <div className="space-y-1"><Label>Mobile</Label><Input value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} maxLength={20} /></div>
          <div className="space-y-1"><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} maxLength={120} /></div>
          <div className="space-y-1 col-span-2"><Label>Address</Label><Textarea value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} maxLength={300} /></div>
        </div>
      </FormModal>
    </AppShell>
  );
}
