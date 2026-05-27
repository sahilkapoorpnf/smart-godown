import { useMemo, useState } from "react";
import AppShell from "@/components/warehouse/AppShell";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, Column } from "@/components/shared/DataTable";
import { FormModal } from "@/components/shared/FormModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Truck, Plus, CheckCircle2, XCircle, Eye } from "lucide-react";
import { getCurrentUser, store as wh, areaName, warehouseName, userName } from "@/lib/warehouse/store";
import { useFertilizerStore, companyName, productName, priceFor } from "@/lib/fertilizer/store";
import { addStockEntry, reviewStockEntry, useStockStore, visibleStockEntries } from "@/lib/stock/store";
import type { DailyStockEntry, StockEntryStatus } from "@/lib/stock/types";
import { toast } from "sonner";

const badge: Record<StockEntryStatus, string> = {
  pending: "bg-himfed-warning/15 text-himfed-warning border-himfed-warning/30",
  approved: "bg-himfed-success/15 text-himfed-success border-himfed-success/30",
  rejected: "bg-himfed-danger/15 text-himfed-danger border-himfed-danger/30",
};

export default function DailyStockEntry() {
  const user = getCurrentUser();
  useStockStore();
  const { products, companies } = useFertilizerStore();
  const [open, setOpen] = useState(false);
  const [review, setReview] = useState<DailyStockEntry | null>(null);
  const [revStatus, setRevStatus] = useState<StockEntryStatus>("approved");
  const [revRemarks, setRevRemarks] = useState("");

  const entries = useMemo(() => visibleStockEntries(user as any), [user]);

  const [form, setForm] = useState({
    areaId: user?.areaId ?? "",
    warehouseId: user?.warehouseId ?? "",
    depotDate: new Date().toISOString().slice(0, 10),
    grNumber: "",
    truckNumber: "",
    companyId: "",
    productId: "",
    quantity: 0,
    ratePerBag: 0,
    driverName: "",
    remarks: "",
  });

  const areaWarehouses = wh.warehouses.filter((w) => w.areaId === form.areaId);

  const onPickProduct = (pid: string) => {
    const pr = priceFor(pid);
    setForm({ ...form, productId: pid, ratePerBag: pr?.sellingPrice ?? 0 });
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!form.areaId || !form.warehouseId || !form.productId || !form.companyId || form.quantity <= 0) {
      toast.error("Fill all required fields"); return;
    }
    try {
      addStockEntry({ ...form, createdBy: user.id });
      toast.success("Stock entry submitted — pending review");
      setOpen(false);
      setForm({ ...form, grNumber: "", truckNumber: "", quantity: 0, remarks: "" });
    } catch (err: any) { toast.error(err.message); }
  };

  const submitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!review || !user) return;
    reviewStockEntry(review.id, revStatus, user.id, revRemarks);
    toast.success(`Entry ${revStatus}`);
    setReview(null); setRevRemarks("");
  };

  const today = new Date().toISOString().slice(0, 10);
  const counts = {
    today: entries.filter((e) => e.depotDate === today).reduce((s, e) => s + e.quantity, 0),
    pending: entries.filter((e) => e.status === "pending").length,
    approved: entries.filter((e) => e.status === "approved").length,
    rejected: entries.filter((e) => e.status === "rejected").length,
  };

  const canCreate = user?.role === "warehouse_staff" || user?.role === "superadmin";
  const canApprove = user?.role === "incharge" || user?.role === "superadmin";

  const columns: Column<DailyStockEntry>[] = [
    { key: "entryCode", label: "Entry ID", sortable: true },
    { key: "depotDate", label: "Date", sortable: true },
    { key: "areaId", label: "Area", render: (e) => areaName(e.areaId) },
    { key: "warehouseId", label: "Warehouse", render: (e) => warehouseName(e.warehouseId) },
    { key: "grNumber", label: "GR No." },
    { key: "truckNumber", label: "Truck" },
    { key: "companyId", label: "Company", render: (e) => companyName(e.companyId) },
    { key: "productId", label: "Fertilizer", render: (e) => productName(e.productId) },
    { key: "quantity", label: "Qty", render: (e) => `${e.quantity} bags` },
    { key: "totalAmount", label: "Amount", render: (e) => `₹${e.totalAmount.toLocaleString()}` },
    { key: "status", label: "Status", render: (e) => <Badge variant="outline" className={badge[e.status]}>{e.status.toUpperCase()}</Badge> },
  ];

  return (
    <AppShell allowed={["warehouse_staff", "accountant", "incharge", "superadmin"]}>
      <PageHeader title="Daily Stock Entry" description="Record incoming fertilizer stock & approve receipts." icon={Truck} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card><CardContent className="pt-4"><div className="text-xs text-muted-foreground">Today's Bags</div><div className="text-2xl font-bold text-primary">{counts.today}</div></CardContent></Card>
        <Card><CardContent className="pt-4"><div className="text-xs text-himfed-warning">Pending</div><div className="text-2xl font-bold text-himfed-warning">{counts.pending}</div></CardContent></Card>
        <Card><CardContent className="pt-4"><div className="text-xs text-himfed-success">Approved</div><div className="text-2xl font-bold text-himfed-success">{counts.approved}</div></CardContent></Card>
        <Card><CardContent className="pt-4"><div className="text-xs text-himfed-danger">Rejected</div><div className="text-2xl font-bold text-himfed-danger">{counts.rejected}</div></CardContent></Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-end mb-3">
            {canCreate && (
              <Button onClick={() => setOpen(true)} className="bg-primary"><Plus className="w-4 h-4 mr-2" /> New Entry</Button>
            )}
          </div>
          <DataTable
            data={entries}
            columns={columns}
            searchKey="entryCode"
            searchPlaceholder="Search entry / GR no..."
            actions={(e) => (
              <div className="flex gap-1 justify-end">
                <Button size="sm" variant="ghost" onClick={() => { setReview(e); setRevStatus(e.status === "pending" ? "approved" : e.status); setRevRemarks(e.reviewRemarks ?? ""); }}>
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            )}
          />
        </CardContent>
      </Card>

      {/* New entry modal */}
      <FormModal open={open} onOpenChange={setOpen} title="New Stock Entry" size="xl" onSubmit={submit} submitLabel="Submit Entry">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1"><Label>Area *</Label>
            <Select value={form.areaId} onValueChange={(v) => setForm({ ...form, areaId: v, warehouseId: "" })} disabled={user?.role === "warehouse_staff" || user?.role === "incharge"}>
              <SelectTrigger><SelectValue placeholder="Select area" /></SelectTrigger>
              <SelectContent className="bg-popover">{wh.areas.map((a) => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1"><Label>Warehouse *</Label>
            <Select value={form.warehouseId} onValueChange={(v) => setForm({ ...form, warehouseId: v })} disabled={user?.role === "warehouse_staff"}>
              <SelectTrigger><SelectValue placeholder="Select warehouse" /></SelectTrigger>
              <SelectContent className="bg-popover">{areaWarehouses.map((w) => <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1"><Label>Depot Date *</Label><Input type="date" value={form.depotDate} onChange={(e) => setForm({ ...form, depotDate: e.target.value })} /></div>
          <div className="space-y-1"><Label>GR Number *</Label><Input value={form.grNumber} onChange={(e) => setForm({ ...form, grNumber: e.target.value })} placeholder="GR-XXXXXX" required /></div>
          <div className="space-y-1"><Label>Truck Number *</Label><Input value={form.truckNumber} onChange={(e) => setForm({ ...form, truckNumber: e.target.value })} placeholder="HP-03-A-1234" required /></div>
          <div className="space-y-1"><Label>Driver Name</Label><Input value={form.driverName} onChange={(e) => setForm({ ...form, driverName: e.target.value })} /></div>
          <div className="space-y-1"><Label>Company *</Label>
            <Select value={form.companyId} onValueChange={(v) => setForm({ ...form, companyId: v })}>
              <SelectTrigger><SelectValue placeholder="Select company" /></SelectTrigger>
              <SelectContent className="bg-popover">{companies.filter(c => c.status === "active").map((c) => <SelectItem key={c.id} value={c.id}>{c.code} — {c.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1"><Label>Fertilizer *</Label>
            <Select value={form.productId} onValueChange={onPickProduct}>
              <SelectTrigger><SelectValue placeholder="Select fertilizer" /></SelectTrigger>
              <SelectContent className="bg-popover">{products.filter(p => p.status === "active").map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1"><Label>Quantity (bags) *</Label><Input type="number" value={form.quantity || ""} onChange={(e) => setForm({ ...form, quantity: +e.target.value })} required /></div>
          <div className="space-y-1"><Label>Rate / Bag (₹)</Label><Input type="number" step="0.01" value={form.ratePerBag || ""} onChange={(e) => setForm({ ...form, ratePerBag: +e.target.value })} /></div>
          <div className="col-span-2 p-3 rounded-lg bg-primary/5 border border-primary/20">
            <div className="text-xs text-muted-foreground">Total Amount</div>
            <div className="text-2xl font-bold text-primary">₹{(form.quantity * form.ratePerBag).toLocaleString()}</div>
          </div>
          <div className="space-y-1 col-span-2"><Label>Remarks</Label><Textarea value={form.remarks} onChange={(e) => setForm({ ...form, remarks: e.target.value })} maxLength={500} /></div>
        </div>
      </FormModal>

      {/* Review */}
      <FormModal
        open={!!review}
        onOpenChange={(o) => !o && setReview(null)}
        title={`Stock Entry ${review?.entryCode}`}
        size="lg"
        onSubmit={canApprove && review?.status === "pending" ? submitReview : undefined}
        showFooter={canApprove && review?.status === "pending"}
        submitLabel="Save Decision"
      >
        {review && (
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div><div className="text-xs text-muted-foreground">Area</div><div className="font-medium">{areaName(review.areaId)}</div></div>
              <div><div className="text-xs text-muted-foreground">Warehouse</div><div className="font-medium">{warehouseName(review.warehouseId)}</div></div>
              <div><div className="text-xs text-muted-foreground">Depot Date</div><div className="font-medium">{review.depotDate}</div></div>
              <div><div className="text-xs text-muted-foreground">GR No.</div><div className="font-medium">{review.grNumber}</div></div>
              <div><div className="text-xs text-muted-foreground">Truck</div><div className="font-medium">{review.truckNumber}</div></div>
              <div><div className="text-xs text-muted-foreground">Driver</div><div className="font-medium">{review.driverName || "—"}</div></div>
              <div><div className="text-xs text-muted-foreground">Company</div><div className="font-medium">{companyName(review.companyId)}</div></div>
              <div><div className="text-xs text-muted-foreground">Fertilizer</div><div className="font-medium">{productName(review.productId)}</div></div>
              <div><div className="text-xs text-muted-foreground">Quantity</div><div className="font-medium">{review.quantity} bags</div></div>
              <div><div className="text-xs text-muted-foreground">Rate / Bag</div><div className="font-medium">₹{review.ratePerBag}</div></div>
              <div className="col-span-2"><div className="text-xs text-muted-foreground">Total</div><div className="font-bold text-primary text-lg">₹{review.totalAmount.toLocaleString()}</div></div>
              <div className="col-span-3"><div className="text-xs text-muted-foreground">Remarks</div><div>{review.remarks || "—"}</div></div>
              <div><div className="text-xs text-muted-foreground">Created By</div><div className="font-medium">{userName(review.createdBy)}</div></div>
              <div><div className="text-xs text-muted-foreground">Status</div><div><Badge variant="outline" className={badge[review.status]}>{review.status.toUpperCase()}</Badge></div></div>
              {review.approvedBy && (<><div><div className="text-xs text-muted-foreground">Approved By</div><div className="font-medium">{userName(review.approvedBy)}</div></div><div><div className="text-xs text-muted-foreground">Approved At</div><div className="font-medium">{review.approvedAt?.slice(0, 16).replace("T", " ")}</div></div></>)}
              {review.reviewRemarks && <div className="col-span-3"><div className="text-xs text-muted-foreground">Review Remarks</div><div>{review.reviewRemarks}</div></div>}
            </div>

            {canApprove && review.status === "pending" && (
              <div className="space-y-3 p-3 border border-border rounded-lg bg-muted/30">
                <div className="flex gap-2">
                  <Button type="button" size="sm" variant={revStatus === "approved" ? "default" : "outline"} className={revStatus === "approved" ? "bg-himfed-success hover:bg-himfed-success/90" : ""} onClick={() => setRevStatus("approved")}><CheckCircle2 className="w-4 h-4 mr-1" /> Approve</Button>
                  <Button type="button" size="sm" variant={revStatus === "rejected" ? "default" : "outline"} className={revStatus === "rejected" ? "bg-himfed-danger hover:bg-himfed-danger/90" : ""} onClick={() => setRevStatus("rejected")}><XCircle className="w-4 h-4 mr-1" /> Reject</Button>
                </div>
                <div className="space-y-1"><Label>Review Remarks</Label><Textarea value={revRemarks} onChange={(e) => setRevRemarks(e.target.value)} placeholder="Add a note..." /></div>
              </div>
            )}
          </div>
        )}
      </FormModal>
    </AppShell>
  );
}
