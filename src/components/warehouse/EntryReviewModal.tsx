import { useState, useEffect } from "react";
import { FormModal } from "@/components/shared/FormModal";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { reviewEntry, getCurrentUser, areaName, warehouseName, userName } from "@/lib/warehouse/store";
import { WarehouseEntry } from "@/lib/warehouse/types";
import { toast } from "sonner";
import { EntryStatusBadge } from "./EntryStatusBadge";

interface Props {
  entry: WarehouseEntry | null;
  open: boolean;
  onOpenChange: (o: boolean) => void;
  readOnly?: boolean;
}

const Field = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div>
    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
    <div className="font-medium text-sm mt-0.5">{value}</div>
  </div>
);

export default function EntryReviewModal({ entry, open, onOpenChange, readOnly }: Props) {
  const reviewer = getCurrentUser();
  const [remarks, setRemarks] = useState("");

  useEffect(() => {
    setRemarks(entry?.reviewRemarks ?? "");
  }, [entry]);

  if (!entry) return null;

  const decide = (status: "approved" | "rejected") => {
    if (!reviewer) return;
    reviewEntry(entry.id, status, reviewer.id, remarks);
    toast.success(`Entry ${status === "approved" ? "approved" : "rejected"} successfully.`);
    onOpenChange(false);
  };

  const canReview = !readOnly && reviewer && (reviewer.role === "incharge" || reviewer.role === "superadmin") && entry.status === "pending";

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title={`Entry ${entry.entryCode}`}
      description="Review unloading record and approve or reject."
      size="xl"
      showFooter={false}
    >
      <div className="space-y-5">
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/40 border border-border">
          <div>
            <div className="text-xs text-muted-foreground">Current Status</div>
            <EntryStatusBadge status={entry.status} />
          </div>
          <div className="text-right">
            <div className="text-xs text-muted-foreground">Submitted</div>
            <div className="text-sm font-medium">{new Date(entry.createdAt).toLocaleString("en-IN")}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Field label="GR Number" value={entry.grNumber} />
          <Field label="Truck Number" value={entry.truckNumber} />
          <Field label="Depot Date" value={entry.depotDate} />
          <Field label="Company" value={entry.company} />
          <Field label="Product" value={entry.productName} />
          <Field label="Quantity" value={`${entry.quantity.toLocaleString()} ${entry.unit}`} />
          <Field label="Driver" value={entry.driverName || "—"} />
          <Field label="Driver Mobile" value={entry.driverMobile || "—"} />
          <Field label="Supplier" value={entry.supplier || "—"} />
          <Field label="Warehouse" value={warehouseName(entry.warehouseId)} />
          <Field label="Area" value={areaName(entry.areaId)} />
          <Field label="Created By" value={userName(entry.createdBy)} />
        </div>

        {entry.remarks && (
          <div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Staff Remarks</div>
            <div className="p-3 rounded-md bg-muted/40 border border-border text-sm">{entry.remarks}</div>
          </div>
        )}

        {entry.approvedBy && (
          <div className="grid grid-cols-3 gap-4 p-3 rounded-lg border border-border bg-card">
            <Field label="Reviewed By" value={userName(entry.approvedBy)} />
            <Field label="Review Date" value={entry.approvedAt ? new Date(entry.approvedAt).toLocaleString("en-IN") : "—"} />
            <Field label="Review Note" value={entry.reviewRemarks || "—"} />
          </div>
        )}

        {canReview && (
          <div className="space-y-3 pt-2 border-t border-border">
            <div>
              <Label>Review Remarks</Label>
              <Textarea rows={3} value={remarks} onChange={(e) => setRemarks(e.target.value)} placeholder="Optional notes for the staff..." />
            </div>
            <div className="flex flex-col sm:flex-row gap-2 justify-end">
              <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
              <Button variant="destructive" onClick={() => decide("rejected")}>
                <X className="w-4 h-4 mr-2" /> Reject
              </Button>
              <Button className="bg-himfed-success hover:bg-himfed-success/90 text-white" onClick={() => decide("approved")}>
                <Check className="w-4 h-4 mr-2" /> Approve Entry
              </Button>
            </div>
          </div>
        )}
        {!canReview && (
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
          </div>
        )}
      </div>
    </FormModal>
  );
}
