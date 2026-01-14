import { Package, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

const stockData = [
  { 
    name: "DAP Fertilizer", 
    current: 12500, 
    capacity: 20000, 
    unit: "bags",
    trend: "up",
    change: "+5%"
  },
  { 
    name: "Urea", 
    current: 8200, 
    capacity: 15000, 
    unit: "bags",
    trend: "down",
    change: "-12%"
  },
  { 
    name: "MOP", 
    current: 4500, 
    capacity: 8000, 
    unit: "bags",
    trend: "stable",
    change: "0%"
  },
  { 
    name: "Seeds (Mixed)", 
    current: 2800, 
    capacity: 5000, 
    unit: "kg",
    trend: "up",
    change: "+8%"
  },
  { 
    name: "Pesticides", 
    current: 1200, 
    capacity: 3000, 
    unit: "ltrs",
    trend: "down",
    change: "-3%"
  },
];

const StockOverview = () => {
  const getPercentage = (current: number, capacity: number) => {
    return Math.round((current / capacity) * 100);
  };

  const getStatusColor = (percentage: number) => {
    if (percentage < 30) return "bg-himfed-danger";
    if (percentage < 60) return "bg-himfed-warning";
    return "bg-himfed-success";
  };

  const getTrendIcon = (trend: string) => {
    if (trend === "up") return <TrendingUp className="w-3 h-3 text-himfed-success" />;
    if (trend === "down") return <TrendingDown className="w-3 h-3 text-himfed-danger" />;
    return <Minus className="w-3 h-3 text-muted-foreground" />;
  };

  return (
    <div className="p-6 rounded-2xl bg-card border border-border">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Package className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Stock Overview</h3>
        </div>
        <button className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
          View Details
        </button>
      </div>

      <div className="space-y-5">
        {stockData.map((item) => {
          const percentage = getPercentage(item.current, item.capacity);
          return (
            <div key={item.name} className="group">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">
                    {item.name}
                  </span>
                  <div className="flex items-center gap-1">
                    {getTrendIcon(item.trend)}
                    <span className={cn(
                      "text-xs",
                      item.trend === "up" && "text-himfed-success",
                      item.trend === "down" && "text-himfed-danger",
                      item.trend === "stable" && "text-muted-foreground"
                    )}>
                      {item.change}
                    </span>
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">
                  {item.current.toLocaleString()} / {item.capacity.toLocaleString()} {item.unit}
                </span>
              </div>
              
              {/* Progress bar */}
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
                    getStatusColor(percentage)
                  )}
                  style={{ width: `${percentage}%` }}
                />
              </div>
              
              <div className="flex justify-between mt-1">
                <span className="text-xs text-muted-foreground">{percentage}% utilized</span>
                {percentage < 30 && (
                  <span className="text-xs font-medium text-himfed-danger">Low Stock!</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StockOverview;
