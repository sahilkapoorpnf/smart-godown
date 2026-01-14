import { AlertTriangle, Package, Clock, Fuel, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

const alerts = [
  {
    id: 1,
    type: "critical",
    icon: Package,
    title: "DAP Fertilizer Stock Low",
    description: "Shimla Godown - Only 15 bags remaining",
    time: "10 min ago",
  },
  {
    id: 2,
    type: "warning",
    icon: Clock,
    title: "Expiry Alert",
    description: "50 units of Urea expiring in 7 days - Kullu",
    time: "1 hour ago",
  },
  {
    id: 3,
    type: "critical",
    icon: Fuel,
    title: "Petrol Credit Overdue",
    description: "Transport Dept - ₹2.5L pending since 45 days",
    time: "2 hours ago",
  },
  {
    id: 4,
    type: "warning",
    icon: TrendingDown,
    title: "Stock Mismatch Detected",
    description: "Mandi Godown - 12 units discrepancy",
    time: "3 hours ago",
  },
];

const AlertsPanel = () => {
  return (
    <div className="p-6 rounded-2xl bg-card border border-border">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-himfed-warning" />
          <h3 className="font-semibold text-foreground">Active Alerts</h3>
        </div>
        <span className="px-2 py-1 text-xs font-semibold bg-himfed-danger/10 text-himfed-danger rounded-full">
          {alerts.length} New
        </span>
      </div>

      <div className="space-y-4">
        {alerts.map((alert) => (
          <div 
            key={alert.id}
            className={cn(
              "p-4 rounded-xl border transition-all duration-200 hover:-translate-x-1 cursor-pointer",
              alert.type === "critical" 
                ? "bg-himfed-danger/5 border-himfed-danger/20 hover:border-himfed-danger/40"
                : "bg-himfed-warning/5 border-himfed-warning/20 hover:border-himfed-warning/40"
            )}
          >
            <div className="flex items-start gap-3">
              <div className={cn(
                "p-2 rounded-lg",
                alert.type === "critical" ? "bg-himfed-danger/10" : "bg-himfed-warning/10"
              )}>
                <alert.icon className={cn(
                  "w-4 h-4",
                  alert.type === "critical" ? "text-himfed-danger" : "text-himfed-warning"
                )} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-foreground text-sm truncate">
                  {alert.title}
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5 truncate">
                  {alert.description}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  {alert.time}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-4 py-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
        View All Alerts
      </button>
    </div>
  );
};

export default AlertsPanel;
