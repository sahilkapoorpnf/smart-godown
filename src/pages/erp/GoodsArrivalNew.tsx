import { useState } from "react";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import ErpPage from "@/components/erp/ErpPage";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { getCurrentUser } from "@/lib/warehouse/store";
import { useErp, createArrival, updateArrival } from "@/lib/erp/store";
import { Upload, Save } from "lucide-react";

export default function GoodsArrivalNew() {
  const user = getCurrentUser();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const editId = params.get("edit");
  const { arrivals } = useErp();
  const editing = editId ? arrivals.find((a) => a.id === editId) : undefined;

  const [form, setForm] = useState(() => ({
    depotDate: editing?.depotDate ?? new Date().toISOString().slice(0, 10),
    grNumber: editing?.grNumber ?? "",
    truckNumber: editing?.truckNumber ?? "",
    companyName: editing?.companyName ?? "NFL",
    productName: editing?.productName ?? "Urea 50Kg",
    supplierName: editing?.supplierName ?? "",
    quantity: editing?.quantity ?? 100,
    unit: editing?.unit ?? "Bags",
    rate: editing?.rate ?? 300,
    driverName: editing?.driverName ?? "",
    driverMobile: editing?.driverMobile ?? "",
    invoiceNumber: editing?.invoiceNumber ?? "",
    invoiceFile: editing?.invoiceFile ?? "",
    remarks: editing?.remarks ?? "",
  }));

  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "wh_user") return <Navigate to="/dashboard" replace />;

  const set = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.depotDate || !form.grNumber || !form.truckNumber || !form.productName) {
      toast.error("Please fill all required fields"); return;
    }
    if (editing) {
      updateArrival(editing.id, { ...form, status: "pending" });
      toast.success("Entry re-submitted for approval");
    } else {
      createArrival({
        ...form,
        warehouseId: user.warehouseId!,
        areaId: user.areaId!,
        createdBy: user.id,
      } as any);
      toast.success("Goods arrival recorded — pending Area Officer approval");
    }
    navigate("/dashboard/erp/wh/mine");
  };

  return (
    <ErpPage
      allowed={["wh_user"]}
      title={editing ? `Edit Arrival — ${editing.entryId}` : "New Goods Arrival Entry"}
      description={editing ? "Apply corrections and re-submit for approval." : "Record an incoming vehicle and goods at your warehouse."}
    >
      <form onSubmit={onSubmit}>
        <Card>
          <CardContent className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field label="Depot Date *"><Input type="date" value={form.depotDate} onChange={(e) => set("depotDate", e.target.value)} /></Field>
            <Field label="GR Number *"><Input value={form.grNumber} onChange={(e) => set("grNumber", e.target.value)} placeholder="GR-784512" /></Field>
            <Field label="Truck Number *"><Input value={form.truckNumber} onChange={(e) => set("truckNumber", e.target.value)} placeholder="HP-03-A-5421" /></Field>

            <Field label="Company Name">
              <Select value={form.companyName} onValueChange={(v) => set("companyName", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{["NFL", "IFFCO", "KRIBHCO", "Coromandel", "HIMFED", "IOCL"].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
            <Field label="Product Name *">
              <Select value={form.productName} onValueChange={(v) => set("productName", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{["Urea 50Kg", "DAP 50Kg", "NPK 12:32:16", "Potash MOP 50Kg", "Wheat Seed Certified", "Apple Crates (Wooden)", "Diesel HSD"].map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
            <Field label="Supplier Name"><Input value={form.supplierName} onChange={(e) => set("supplierName", e.target.value)} placeholder="NFL Panipat" /></Field>

            <Field label="Quantity *"><Input type="number" value={form.quantity} onChange={(e) => set("quantity", +e.target.value)} /></Field>
            <Field label="Unit">
              <Select value={form.unit} onValueChange={(v: any) => set("unit", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{["Bags", "Quintal", "Kg", "Ton", "Liter"].map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
            <Field label="Rate / Unit (₹)"><Input type="number" value={form.rate} onChange={(e) => set("rate", +e.target.value)} /></Field>

            <Field label="Driver Name"><Input value={form.driverName} onChange={(e) => set("driverName", e.target.value)} /></Field>
            <Field label="Driver Mobile"><Input value={form.driverMobile} onChange={(e) => set("driverMobile", e.target.value)} placeholder="+91 9XXXX XXXXX" /></Field>
            <Field label="Invoice Number"><Input value={form.invoiceNumber} onChange={(e) => set("invoiceNumber", e.target.value)} /></Field>

            <Field label="Invoice / Challan File">
              <div className="flex items-center gap-2">
                <Input value={form.invoiceFile} onChange={(e) => set("invoiceFile", e.target.value)} placeholder="filename.pdf" />
                <Button type="button" variant="outline" size="sm"><Upload className="w-4 h-4" /></Button>
              </div>
            </Field>
            <div className="md:col-span-2"><Field label="Remarks"><Textarea rows={2} value={form.remarks} onChange={(e) => set("remarks", e.target.value)} /></Field></div>

            {editing?.correctionRemarks && (
              <div className="md:col-span-3 p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-sm text-destructive">
                <strong>Area Officer Correction:</strong> {editing.correctionRemarks}
              </div>
            )}

            <div className="md:col-span-3 flex justify-end gap-2 pt-2 border-t border-border">
              <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
              <Button type="submit"><Save className="w-4 h-4 mr-2" />{editing ? "Re-submit Entry" : "Submit for Approval"}</Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </ErpPage>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label className="text-xs font-medium text-muted-foreground">{label}</Label>{children}</div>;
}
