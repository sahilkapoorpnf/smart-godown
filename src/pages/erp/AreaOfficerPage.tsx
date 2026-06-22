import { useState } from "react";
import { Navigate } from "react-router-dom";
import ErpPage, { Badge, StatTile } from "@/components/erp/ErpPage";
import { DataTable } from "@/components/erp/DataTable";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { getCurrentUser } from "@/lib/warehouse/store";
import { useErp, godownName, reviewArrival } from "@/lib/erp/store";
import { GoodsArrival } from "@/lib/erp/types";
import { CheckCircle2, XCircle } from "lucide-react";

interface Props { mode: "pending" | "approved" }

export default function AreaOfficerPage({ mode }: Props) {
  const user = getCurrentUser();
  const { arrivals } = useErp();
  const [reviewing, setReviewing] = useState<GoodsArrival | null>(null);
  const [remarks, setRemarks] = useState("");

  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "area_officer" && user.role !== "admin_accountant" && user.role !== "superadmin")
    return <Navigate to="/dashboard" replace />;

  const scope = user.role === "area_officer" ? arrivals.filter((a) => a.areaId === user.areaId) : arrivals;
  const rows = scope.filter((a) => mode === "pending" ? a.status === "pending" : a.status === "approved");
  const stats = {
    pending: scope.filter((a) => a.status === "pending").length,
    approved: scope.filter((a) => a.status === "approved").length,
    reedit: scope.filter((a) => a.status === "re_edit").length,
  };

  const decide = (status: "approved" | "re_edit") => {
    if (!reviewing) return;
    if (status === "re_edit" && !remarks.trim()) { toast.error("Correction remarks are required"); return; }
    reviewArrival(reviewing.id, status, user.id, remarks);
    toast.success(status === "approved" ? "Approved & flowed to Purchase Voucher" : "Sent back for re-edit");
    setReviewing(null); setRemarks("");
  };

  return (
    <ErpPage
      allowed={["area_officer", "admin_accountant", "superadmin"]}
      title={mode === "pending" ? "Pending Approval Requests" : "Approved Entries"}
      description={mode === "pending" ? "Review and approve goods arrivals submitted by warehouse users." : "All previously approved goods arrival entries."}
    >
      <div className="grid grid-cols-3 gap-4">
        <StatTile label="Pending" value={stats.pending} tone="amber" />
        <StatTile label="Approved" value={stats.approved} tone="green" />
        <StatTile label="Re-edit" value={stats.reedit} tone="red" />
      </div>

      <DataTable<GoodsArrival>
        rows={rows} exportName={mode === "pending" ? "pending-approvals" : "approved-entries"}
        searchKeys={["entryId", "grNumber", "truckNumber", "productName", "supplierName"]}
        columns={[
          { key: "entryId", label: "Entry ID", sortable: true, render: (r) => <span className="font-mono font-semibold">{r.entryId}</span> },
          { key: "warehouseId", label: "Godown", render: (r) => godownName(r.warehouseId) },
          { key: "depotDate", label: "Depot Date", sortable: true },
          { key: "productName", label: "Product" },
          { key: "supplierName", label: "Supplier" },
          { key: "quantity", label: "Qty", render: (r) => `${r.quantity} ${r.unit}` },
          { key: "rate", label: "Rate", render: (r) => `₹${r.rate}` },
          { key: "grNumber", label: "GR No." },
          { key: "createdAt", label: "Submitted", render: (r) => new Date(r.createdAt).toLocaleString("en-IN") },
          { key: "status", label: "Status", render: (r) =>
              r.status === "approved" ? <Badge tone="green">Approved</Badge>
              : <Badge tone="amber">Pending</Badge> },
          { key: "actions", label: "", render: (r) => mode === "pending" ? (
              <Button size="sm" onClick={() => setReviewing(r)}>Review</Button>
            ) : null },
        ]}
      />

      <Dialog open={!!reviewing} onOpenChange={(o) => !o && setReviewing(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Review {reviewing?.entryId}</DialogTitle></DialogHeader>
          {reviewing && (
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <Info label="Godown" value={godownName(reviewing.warehouseId)} />
                <Info label="Depot Date" value={reviewing.depotDate} />
                <Info label="Product" value={reviewing.productName} />
                <Info label="Company" value={reviewing.companyName} />
                <Info label="Supplier" value={reviewing.supplierName} />
                <Info label="Quantity" value={`${reviewing.quantity} ${reviewing.unit}`} />
                <Info label="Rate" value={`₹${reviewing.rate}`} />
                <Info label="GR Number" value={reviewing.grNumber} />
                <Info label="Truck" value={reviewing.truckNumber} />
                <Info label="Driver" value={`${reviewing.driverName} (${reviewing.driverMobile})`} />
                <Info label="Invoice No." value={reviewing.invoiceNumber} />
                <Info label="Invoice File" value={reviewing.invoiceFile ?? "—"} />
              </div>
              {reviewing.remarks && <div className="p-2 rounded bg-muted text-xs">{reviewing.remarks}</div>}
              <div>
                <Label className="text-xs">Review / Correction Remarks</Label>
                <Textarea rows={3} value={remarks} onChange={(e) => setRemarks(e.target.value)} placeholder="Required if sending back for re-edit" />
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button variant="destructive" onClick={() => decide("re_edit")}><XCircle className="w-4 h-4 mr-1" />Send for Re-edit</Button>
            <Button onClick={() => decide("approved")}><CheckCircle2 className="w-4 h-4 mr-1" />Approve</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ErpPage>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <div><div className="text-[10px] uppercase text-muted-foreground font-medium">{label}</div><div className="font-medium">{value}</div></div>;
}
