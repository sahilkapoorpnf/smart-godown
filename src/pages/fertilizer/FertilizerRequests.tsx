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
import { ClipboardList, Eye, PlusSquare } from "lucide-react";
import { useFertilizerStore, createRequest, reviewRequest, productName, companyName } from "@/lib/fertilizer/store";
import { areaName, getCurrentUser, store, warehouseName } from "@/lib/warehouse/store";
import type { DemandRequest, RequestStatus, WarehouseAllocation } from "@/lib/fertilizer/types";
import { toast } from "sonner";

const statusStyle: Record<RequestStatus, string> = {
  pending: "bg-himfed-warning/15 text-himfed-warning border-himfed-warning/30",
  under_review: "bg-primary/15 text-primary border-primary/30",
  approved: "bg-himfed-success/15 text-himfed-success border-himfed-success/30",
  partially_approved: "bg-amber-500/15 text-amber-600 border-amber-500/30",
  rejected: "bg-himfed-danger/15 text-himfed-danger border-himfed-danger/30",
};
const statusLabel: Record<RequestStatus, string> = {
  pending: "Pending", under_review: "Under Review", approved: "Approved",
  partially_approved: "Partially Approved", rejected: "Rejected",
};

export default function FertilizerRequests() {
  const user = getCurrentUser();
  const { requests, products } = useFertilizerStore();

  const [createOpen, setCreateOpen] = useState(false);
  const [review, setReview] = useState<DemandRequest | null>(null);

  const visible = useMemo(() => {
    if (!user) return [];
    if (user.role === "incharge") return requests.filter((r) => r.areaId === user.areaId);
    return requests;
  }, [user, requests]);

  // ---- Create form ----
  const [form, setForm] = useState({
    productId: "", requestedQty: 0, priority: "Medium" as DemandRequest["priority"],
    requiredDate: new Date().toISOString().slice(0, 10), remarks: "",
  });
  const submitCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.areaId) { toast.error("Only Area Officers can raise requests"); return; }
    if (!form.productId || form.requestedQty <= 0) { toast.error("Product and qty required"); return; }
    createRequest({
      areaId: user.areaId,
      productId: form.productId,
      requestedQty: form.requestedQty,
      priority: form.priority,
      requiredDate: form.requiredDate,
      remarks: form.remarks,
      createdBy: user.id,
    });
    toast.success("Request raised");
    setCreateOpen(false);
    setForm({ productId: "", requestedQty: 0, priority: "Medium", requiredDate: new Date().toISOString().slice(0, 10), remarks: "" });
  };

  // ---- Review form ----
  const [revStatus, setRevStatus] = useState<RequestStatus>("approved");
  const [approvedQty, setApprovedQty] = useState(0);
  const [revRemarks, setRevRemarks] = useState("");
  const [allocs, setAllocs] = useState<WarehouseAllocation[]>([]);

  const openReview = (r: DemandRequest) => {
    setReview(r);
    setRevStatus(r.status === "pending" || r.status === "under_review" ? "approved" : r.status);
    setApprovedQty(r.approvedQty ?? r.requestedQty);
    setRevRemarks(r.reviewRemarks ?? "");
    setAllocs(r.allocations ?? store.warehouses.filter((w) => w.areaId === r.areaId).map((w) => ({ warehouseId: w.id, quantity: 0 })));
  };

  const submitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!review || !user) return;
    const totalAlloc = allocs.reduce((s, a) => s + (a.quantity || 0), 0);
    if (revStatus !== "rejected" && totalAlloc !== approvedQty) {
      toast.error(`Allocations (${totalAlloc}) must equal approved qty (${approvedQty})`);
      return;
    }
    reviewRequest(review.id, revStatus, approvedQty, allocs, revRemarks, user.id);
    toast.success("Request reviewed");
    setReview(null);
  };

  const columns: Column<DemandRequest>[] = [
    { key: "requestCode", label: "Request ID", sortable: true },
    { key: "areaId", label: "Area", render: (r) => areaName(r.areaId) },
    { key: "productId", label: "Product", render: (r) => productName(r.productId) },
    { key: "requestedQty", label: "Requested", render: (r) => `${r.requestedQty} Bags` },
    { key: "approvedQty", label: "Approved", render: (r) => r.approvedQty ? `${r.approvedQty} Bags` : "—" },
    { key: "priority", label: "Priority" },
    { key: "requiredDate", label: "Required" },
    { key: "status", label: "Status", render: (r) => <Badge variant="outline" className={statusStyle[r.status]}>{statusLabel[r.status]}</Badge> },
  ];

  const counts = {
    total: visible.length,
    pending: visible.filter((r) => r.status === "pending" || r.status === "under_review").length,
    approved: visible.filter((r) => r.status === "approved" || r.status === "partially_approved").length,
    rejected: visible.filter((r) => r.status === "rejected").length,
  };

  return (
    <AppShell allowed={["superadmin", "incharge"]}>
      <PageHeader title="Fertilizer Demand Requests" description="Area-officer demand raised to HQ; superadmin reviews & allocates." icon={ClipboardList} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card><CardContent className="pt-4"><div className="text-xs text-muted-foreground">Total</div><div className="text-2xl font-bold">{counts.total}</div></CardContent></Card>
        <Card><CardContent className="pt-4"><div className="text-xs text-himfed-warning">Awaiting Review</div><div className="text-2xl font-bold text-himfed-warning">{counts.pending}</div></CardContent></Card>
        <Card><CardContent className="pt-4"><div className="text-xs text-himfed-success">Approved</div><div className="text-2xl font-bold text-himfed-success">{counts.approved}</div></CardContent></Card>
        <Card><CardContent className="pt-4"><div className="text-xs text-himfed-danger">Rejected</div><div className="text-2xl font-bold text-himfed-danger">{counts.rejected}</div></CardContent></Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-end mb-3">
            {user?.role === "incharge" && (
              <Button onClick={() => setCreateOpen(true)} className="bg-primary"><PlusSquare className="w-4 h-4 mr-2" /> Raise Demand</Button>
            )}
          </div>
          <DataTable
            data={visible}
            columns={columns}
            searchKey="requestCode"
            searchPlaceholder="Search request id..."
            actions={(r) => (
              <Button size="sm" variant="ghost" onClick={() => openReview(r)}>
                <Eye className="w-4 h-4 mr-1" />{user?.role === "superadmin" && (r.status === "pending" || r.status === "under_review") ? "Review" : "View"}
              </Button>
            )}
          />
        </CardContent>
      </Card>

      {/* Create */}
      <FormModal open={createOpen} onOpenChange={setCreateOpen} title="Raise Fertilizer Demand" size="lg" onSubmit={submitCreate}>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1 col-span-2">
            <Label>Product *</Label>
            <Select value={form.productId} onValueChange={(v) => setForm({ ...form, productId: v })}>
              <SelectTrigger><SelectValue placeholder="Select fertilizer" /></SelectTrigger>
              <SelectContent className="bg-popover">{products.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1"><Label>Requested Qty (Bags) *</Label><Input type="number" value={form.requestedQty} onChange={(e) => setForm({ ...form, requestedQty: +e.target.value })} /></div>
          <div className="space-y-1">
            <Label>Priority</Label>
            <Select value={form.priority} onValueChange={(v: any) => setForm({ ...form, priority: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent className="bg-popover">{["Low", "Medium", "High", "Urgent"].map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1"><Label>Required Date</Label><Input type="date" value={form.requiredDate} onChange={(e) => setForm({ ...form, requiredDate: e.target.value })} /></div>
          <div className="space-y-1 col-span-2"><Label>Remarks</Label><Textarea value={form.remarks} onChange={(e) => setForm({ ...form, remarks: e.target.value })} maxLength={500} /></div>
        </div>
      </FormModal>

      {/* Review */}
      <FormModal
        open={!!review}
        onOpenChange={(o) => !o && setReview(null)}
        title={`Review ${review?.requestCode}`}
        size="xl"
        onSubmit={user?.role === "superadmin" ? submitReview : undefined}
        showFooter={user?.role === "superadmin"}
        submitLabel="Save Decision"
      >
        {review && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div><div className="text-muted-foreground text-xs">Area</div><div className="font-medium">{areaName(review.areaId)}</div></div>
              <div><div className="text-muted-foreground text-xs">Product</div><div className="font-medium">{productName(review.productId)}</div></div>
              <div><div className="text-muted-foreground text-xs">Requested</div><div className="font-medium">{review.requestedQty} Bags</div></div>
              <div><div className="text-muted-foreground text-xs">Priority</div><div className="font-medium">{review.priority}</div></div>
              <div className="col-span-2 md:col-span-4"><div className="text-muted-foreground text-xs">Remarks</div><div>{review.remarks || "—"}</div></div>
            </div>

            {user?.role === "superadmin" ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label>Decision</Label>
                    <Select value={revStatus} onValueChange={(v: any) => setRevStatus(v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent className="bg-popover">
                        <SelectItem value="approved">Approve Full</SelectItem>
                        <SelectItem value="partially_approved">Partially Approve</SelectItem>
                        <SelectItem value="rejected">Reject</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1"><Label>Approved Qty</Label><Input type="number" value={approvedQty} onChange={(e) => setApprovedQty(+e.target.value)} disabled={revStatus === "rejected"} /></div>
                </div>

                {revStatus !== "rejected" && (
                  <div className="space-y-2 p-3 border border-border rounded-lg bg-muted/30">
                    <div className="text-sm font-semibold">Warehouse Allocation</div>
                    {allocs.map((a, i) => (
                      <div key={i} className="grid grid-cols-2 gap-3 items-center">
                        <div className="text-sm">{warehouseName(a.warehouseId)}</div>
                        <Input type="number" value={a.quantity} onChange={(e) => {
                          const v = +e.target.value;
                          setAllocs((prev) => prev.map((x, j) => j === i ? { ...x, quantity: v } : x));
                        }} />
                      </div>
                    ))}
                    <div className="text-xs text-muted-foreground pt-1">
                      Allocated: {allocs.reduce((s, a) => s + (a.quantity || 0), 0)} / {approvedQty}
                    </div>
                  </div>
                )}

                <div className="space-y-1"><Label>Review Remarks</Label><Textarea value={revRemarks} onChange={(e) => setRevRemarks(e.target.value)} maxLength={500} /></div>
              </>
            ) : (
              <div className="space-y-2 text-sm">
                <div><span className="text-muted-foreground">Status:</span> <Badge variant="outline" className={statusStyle[review.status]}>{statusLabel[review.status]}</Badge></div>
                {review.approvedQty != null && <div><span className="text-muted-foreground">Approved:</span> {review.approvedQty} Bags</div>}
                {review.allocations && review.allocations.length > 0 && (
                  <div>
                    <div className="text-muted-foreground mb-1">Allocations:</div>
                    <ul className="list-disc pl-5">{review.allocations.map((a, i) => <li key={i}>{warehouseName(a.warehouseId)}: {a.quantity}</li>)}</ul>
                  </div>
                )}
                {review.reviewRemarks && <div><span className="text-muted-foreground">Remarks:</span> {review.reviewRemarks}</div>}
              </div>
            )}
          </div>
        )}
      </FormModal>
    </AppShell>
  );
}
