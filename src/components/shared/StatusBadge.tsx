import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type StatusType = 
  | "active" 
  | "inactive" 
  | "pending" 
  | "enabled" 
  | "disabled" 
  | "success" 
  | "warning" 
  | "error"
  | "in_stock"
  | "low_stock"
  | "out_of_stock"
  | "expired"
  | "destructive"
  | "secondary"
  | "maintenance";

interface StatusBadgeProps {
  status: StatusType;
  label?: string;
}

const statusStyles: Record<StatusType, string> = {
  active: "bg-himfed-success/10 text-himfed-success border-himfed-success/20",
  inactive: "bg-muted text-muted-foreground border-muted",
  pending: "bg-himfed-warning/10 text-himfed-warning border-himfed-warning/20",
  enabled: "bg-himfed-success/10 text-himfed-success border-himfed-success/20",
  disabled: "bg-muted text-muted-foreground border-muted",
  success: "bg-himfed-success/10 text-himfed-success border-himfed-success/20",
  warning: "bg-himfed-warning/10 text-himfed-warning border-himfed-warning/20",
  error: "bg-himfed-danger/10 text-himfed-danger border-himfed-danger/20",
  in_stock: "bg-himfed-success/10 text-himfed-success border-himfed-success/20",
  low_stock: "bg-himfed-warning/10 text-himfed-warning border-himfed-warning/20",
  out_of_stock: "bg-himfed-danger/10 text-himfed-danger border-himfed-danger/20",
  expired: "bg-himfed-danger/10 text-himfed-danger border-himfed-danger/20",
  destructive: "bg-himfed-danger/10 text-himfed-danger border-himfed-danger/20",
  secondary: "bg-muted text-muted-foreground border-muted",
  maintenance: "bg-himfed-warning/10 text-himfed-warning border-himfed-warning/20",
};

const defaultLabels: Record<StatusType, string> = {
  active: "Active",
  inactive: "Inactive",
  pending: "Pending",
  enabled: "Enabled",
  disabled: "Disabled",
  success: "Success",
  warning: "Warning",
  error: "Error",
  in_stock: "In Stock",
  low_stock: "Low Stock",
  out_of_stock: "Out of Stock",
  expired: "Expired",
  destructive: "Error",
  secondary: "Secondary",
  maintenance: "Under Maintenance",
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
