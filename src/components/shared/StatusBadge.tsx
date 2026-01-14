import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "active" | "inactive" | "pending" | "enabled" | "disabled" | "success" | "warning" | "error";
  label?: string;
}

const statusStyles = {
  active: "bg-himfed-success/10 text-himfed-success border-himfed-success/20",
  inactive: "bg-muted text-muted-foreground border-muted",
  pending: "bg-himfed-warning/10 text-himfed-warning border-himfed-warning/20",
  enabled: "bg-himfed-success/10 text-himfed-success border-himfed-success/20",
  disabled: "bg-muted text-muted-foreground border-muted",
  success: "bg-himfed-success/10 text-himfed-success border-himfed-success/20",
  warning: "bg-himfed-warning/10 text-himfed-warning border-himfed-warning/20",
  error: "bg-himfed-danger/10 text-himfed-danger border-himfed-danger/20",
};

const defaultLabels = {
  active: "Active",
  inactive: "Inactive",
  pending: "Pending",
  enabled: "Enabled",
  disabled: "Disabled",
  success: "Success",
  warning: "Warning",
  error: "Error",
};

export function StatusBadge({ status, label }: StatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn("font-medium", statusStyles[status])}
    >
      {label || defaultLabels[status]}
    </Badge>
  );
}
