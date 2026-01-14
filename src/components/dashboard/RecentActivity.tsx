import { Package, Truck, ArrowLeftRight, FileCheck, User } from "lucide-react";
import { cn } from "@/lib/utils";

const activities = [
  {
    id: 1,
    icon: Package,
    action: "Stock Received",
    description: "500 bags DAP at Shimla Godown",
    user: "Rajesh Kumar",
    role: "WM",
    time: "5 min ago",
    color: "text-himfed-success",
    bg: "bg-himfed-success/10",
  },
  {
    id: 2,
    icon: ArrowLeftRight,
    action: "Transfer Approved",
    description: "200 bags Urea from Mandi to Kullu",
    user: "HQ Admin",
    role: "HQ",
    time: "15 min ago",
    color: "text-himfed-info",
    bg: "bg-himfed-info/10",
  },
  {
    id: 3,
    icon: Truck,
    action: "Dispatch Completed",
    description: "150 bags to Farmer Cooperative",
    user: "Suresh Singh",
    role: "DO",
    time: "30 min ago",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    id: 4,
    icon: FileCheck,
    action: "GRN Generated",
    description: "PO-2024-0856 verified",
    user: "Amit Sharma",
    role: "PM",
    time: "1 hour ago",
    color: "text-secondary",
    bg: "bg-secondary/10",
  },
  {
    id: 5,
    icon: User,
    action: "New User Created",
    description: "Warehouse Staff - Solan",
    user: "System Admin",
    role: "SA",
    time: "2 hours ago",
    color: "text-muted-foreground",
    bg: "bg-muted",
  },
];

const RecentActivity = () => {
  return (
    <div className="p-6 rounded-2xl bg-card border border-border">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-foreground">Recent Activity</h3>
        <button className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div 
            key={activity.id}
            className="flex items-start gap-4 animate-fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {/* Icon */}
            <div className={cn("p-2 rounded-lg flex-shrink-0", activity.bg)}>
              <activity.icon className={cn("w-4 h-4", activity.color)} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-medium text-foreground text-sm">
                  {activity.action}
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-mono bg-muted rounded">
                  {activity.role}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 truncate">
                {activity.description}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="font-medium">{activity.user}</span> • {activity.time}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;
