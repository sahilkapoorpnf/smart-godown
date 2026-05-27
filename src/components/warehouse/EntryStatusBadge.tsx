import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { EntryStatus } from "@/lib/warehouse/types";

const styles: Record<EntryStatus, string> = {
  pending: "bg-himfed-warning/15 text-himfed-warning border-himfed-warning/30",
  approved: "bg-himfed-success/15 text-himfed-success border-himfed-success/30",
  rejected: "bg-himfed-danger/15 text-himfed-danger border-himfed-danger/30",
  no_action: "bg-muted text-muted-foreground border-border",
};

const labels: Record<EntryStatus, string> = {
  pending: "Pending Review",
  approved: "Approved",
  rejected: "Rejected",
  no_action: "No Action",
};

export function EntryStatusBadge({ status }: { status: EntryStatus }) {
  return (
    <Badge variant="outline" className={cn("font-medium", styles[status])}>
      <span className={cn(
        "w-1.5 h-1.5 rounded-full mr-1.5",
        status === "pending" && "bg-himfed-warning animate-pulse",
        status === "approved" && "bg-himfed-success",
        status === "rejected" && "bg-himfed-danger",
        status === "no_action" && "bg-muted-foreground",
      )} />
      {labels[status]}
    </Badge>
  );
}
