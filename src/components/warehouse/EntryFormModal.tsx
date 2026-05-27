import { useState } from "react";
import { FormModal } from "@/components/shared/FormModal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addEntry, getCurrentUser, store } from "@/lib/warehouse/store";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onCreated?: () => void;
}

export default function EntryFormModal({ open, onOpenChange, onCreated }: Props) {
  const user = getCurrentUser();
  const warehouse = store.warehouses.find((w) => w.id === user?.warehouseId);
  const area = store.areas.find((a) => a.id === user?.areaId);

  const empty = {
    depotDate: new Date().toISOString().slice(0, 10),
    grNumber: "",
    truckNumber: "",
    quantity: 0,
    unit: "Bags" as const,
    company: "",
    productName: "",
    driverName: "",
    driverMobile: "",
    supplier: "",
    remarks: "",
  };

  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !user.warehouseId || !user.areaId) {
      toast.error("Logged-in user has no warehouse assignment.");
      return;
    }
    if (!form.grNumber || !form.truckNumber || !form.quantity || !form.company || !form.productName) {
      toast.error("Fill all required fields.");
      return;
    }
    const truckRe = /^[A-Z]{2}[-\s]?\d{1,2}[-\s]?[A-Z]{1,2}[-\s]?\d{1,4}$/i;
    if (!truckRe.test(form.truckNumber.trim())) {
      toast.error("Invalid truck number format (e.g. HP-03-A-5421)");
      return;
    }
    setLoading(true);
    try {
      addEntry({
        ...form,
        warehouseId: user.warehouseId,
        areaId: user.areaId,
        createdBy: user.id,
      });
      toast.success("Entry submitted — pending Area Officer review.");
      setForm(empty);
      onOpenChange(false);
      onCreated?.();
    } catch (err: any) {
      toast.error(err.message ?? "Failed to submit entry");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title="New Warehouse Entry"
      description="Record inventory unloading at your warehouse."
      onSubmit={handleSubmit}
      submitLabel="Submit for Approval"
      isLoading={loading}
      size="xl"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2 grid grid-cols-2 gap-3 p-3 rounded-lg bg-muted/40 border border-border">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Warehouse</div>
            <div className="font-medium">{warehouse?.name ?? "—"}</div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Area</div>
            <div className="font-medium">{area?.name ?? "—"}</div>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Depot Date *</Label>
          <Input type="date" value={form.depotDate} onChange={(e) => setForm({ ...form, depotDate: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>G.R Number *</Label>
          <Input value={form.grNumber} onChange={(e) => setForm({ ...form, grNumber: e.target.value })} placeholder="GR-784667" />
        </div>
        <div className="space-y-2">
          <Label>Truck Number *</Label>
          <Input value={form.truckNumber} onChange={(e) => setForm({ ...form, truckNumber: e.target.value.toUpperCase() })} placeholder="HP-03-A-5421" />
        </div>
        <div className="space-y-2">
          <Label>Company Name *</Label>
          <Input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="NFL / IFFCO / KRIBHCO" />
        </div>
        <div className="space-y-2">
          <Label>Product Name *</Label>
          <Input value={form.productName} onChange={(e) => setForm({ ...form, productName: e.target.value })} placeholder="Urea 50Kg" />
        </div>
        <div className="space-y-2">
          <Label>Supplier</Label>
          <Input value={form.supplier} onChange={(e) => setForm({ ...form, supplier: e.target.value })} placeholder="NFL Panipat" />
        </div>
        <div className="space-y-2">
          <Label>Quantity *</Label>
          <Input type="number" min={1} value={form.quantity || ""} onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })} />
        </div>
        <div className="space-y-2">
          <Label>Unit *</Label>
          <Select value={form.unit} onValueChange={(v) => setForm({ ...form, unit: v as any })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent className="bg-popover">
              <SelectItem value="Bags">Bags</SelectItem>
              <SelectItem value="Quintal">Quintal</SelectItem>
              <SelectItem value="Kg">Kg</SelectItem>
              <SelectItem value="Ton">Ton</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Driver Name</Label>
          <Input value={form.driverName} onChange={(e) => setForm({ ...form, driverName: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Driver Mobile</Label>
          <Input value={form.driverMobile} onChange={(e) => setForm({ ...form, driverMobile: e.target.value })} placeholder="+91 9xxxx xxxxx" />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>Remarks</Label>
          <Textarea rows={3} value={form.remarks} onChange={(e) => setForm({ ...form, remarks: e.target.value })} placeholder="Condition of goods, seals, etc." />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>Upload Invoice / Challan</Label>
          <Input type="file" accept="image/*,.pdf" />
          <p className="text-xs text-muted-foreground">Max 5 MB · PDF, PNG or JPG</p>
        </div>
      </div>
    </FormModal>
  );
}
