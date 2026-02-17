import { useState, useMemo } from "react";
import { Search, MapPin, Package, Filter, ChevronDown, Warehouse, TrendingUp, TrendingDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const categories = ["All", "Fertilizers", "Seeds", "Pesticides", "Equipment", "Feed"];

const districts = ["All Districts", "Shimla", "Kullu", "Mandi", "Kangra", "Solan", "Hamirpur", "Una", "Bilaspur", "Chamba", "Kinnaur", "Lahaul-Spiti", "Sirmaur"];

interface StockItem {
  product: string;
  category: string;
  district: string;
  godown: string;
  godownType: string;
  available: number;
  capacity: number;
  unit: string;
  trend: "up" | "down" | "stable";
  lastUpdated: string;
}

const stockData: StockItem[] = [
  { product: "DAP Fertilizer", category: "Fertilizers", district: "Shimla", godown: "Shimla Central Warehouse", godownType: "Central", available: 12500, capacity: 20000, unit: "bags", trend: "up", lastUpdated: "2 hrs ago" },
  { product: "Urea", category: "Fertilizers", district: "Shimla", godown: "Shimla Central Warehouse", godownType: "Central", available: 8200, capacity: 15000, unit: "bags", trend: "down", lastUpdated: "1 hr ago" },
  { product: "MOP", category: "Fertilizers", district: "Kullu", godown: "Kullu Regional Depot", godownType: "Regional", available: 4500, capacity: 8000, unit: "bags", trend: "stable", lastUpdated: "3 hrs ago" },
  { product: "NPK Complex", category: "Fertilizers", district: "Mandi", godown: "Mandi District Store", godownType: "District", available: 6800, capacity: 10000, unit: "bags", trend: "up", lastUpdated: "5 hrs ago" },
  { product: "Wheat Seeds (HD-2967)", category: "Seeds", district: "Kangra", godown: "Kangra Seed Store", godownType: "Regional", available: 2800, capacity: 5000, unit: "kg", trend: "up", lastUpdated: "4 hrs ago" },
  { product: "Rice Seeds (HPR-2612)", category: "Seeds", district: "Solan", godown: "Solan Agri Center", godownType: "District", available: 1500, capacity: 4000, unit: "kg", trend: "down", lastUpdated: "6 hrs ago" },
  { product: "Maize Seeds (Hybrid)", category: "Seeds", district: "Hamirpur", godown: "Hamirpur Depot", godownType: "Depot", available: 900, capacity: 2000, unit: "kg", trend: "stable", lastUpdated: "1 day ago" },
  { product: "Cypermethrin", category: "Pesticides", district: "Shimla", godown: "Shimla Central Warehouse", godownType: "Central", available: 1200, capacity: 3000, unit: "ltrs", trend: "down", lastUpdated: "8 hrs ago" },
  { product: "Chlorpyrifos", category: "Pesticides", district: "Kullu", godown: "Kullu Regional Depot", godownType: "Regional", available: 800, capacity: 1500, unit: "ltrs", trend: "up", lastUpdated: "12 hrs ago" },
  { product: "Imidacloprid", category: "Pesticides", district: "Mandi", godown: "Mandi District Store", godownType: "District", available: 350, capacity: 1000, unit: "ltrs", trend: "stable", lastUpdated: "1 day ago" },
  { product: "Hand Sprayer", category: "Equipment", district: "Kangra", godown: "Kangra Seed Store", godownType: "Regional", available: 150, capacity: 500, unit: "units", trend: "down", lastUpdated: "2 days ago" },
  { product: "Knapsack Sprayer", category: "Equipment", district: "Una", godown: "Una Distribution Center", godownType: "Depot", available: 75, capacity: 200, unit: "units", trend: "stable", lastUpdated: "1 day ago" },
  { product: "Cattle Feed (Standard)", category: "Feed", district: "Bilaspur", godown: "Bilaspur Feed Store", godownType: "District", available: 5000, capacity: 8000, unit: "bags", trend: "up", lastUpdated: "3 hrs ago" },
  { product: "Poultry Feed", category: "Feed", district: "Chamba", godown: "Chamba Agri Hub", godownType: "Depot", available: 2200, capacity: 4000, unit: "bags", trend: "down", lastUpdated: "6 hrs ago" },
  { product: "SSP Fertilizer", category: "Fertilizers", district: "Sirmaur", godown: "Nahan Depot", godownType: "Depot", available: 3100, capacity: 6000, unit: "bags", trend: "up", lastUpdated: "4 hrs ago" },
  { product: "Zinc Sulphate", category: "Fertilizers", district: "Kinnaur", godown: "Kinnaur Store", godownType: "District", available: 200, capacity: 1000, unit: "bags", trend: "down", lastUpdated: "2 days ago" },
];

const StockChecker = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDistrict, setSelectedDistrict] = useState("All Districts");
  const [searchQuery, setSearchQuery] = useState("");
  const [showDistrictDropdown, setShowDistrictDropdown] = useState(false);

  const filtered = useMemo(() => {
    return stockData.filter((item) => {
      const matchCat = selectedCategory === "All" || item.category === selectedCategory;
      const matchDist = selectedDistrict === "All Districts" || item.district === selectedDistrict;
      const matchSearch = !searchQuery || item.product.toLowerCase().includes(searchQuery.toLowerCase()) || item.godown.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchDist && matchSearch;
    });
  }, [selectedCategory, selectedDistrict, searchQuery]);

  const stats = useMemo(() => {
    const totalProducts = filtered.length;
    const totalAvailable = filtered.reduce((s, i) => s + i.available, 0);
    const lowStockCount = filtered.filter((i) => (i.available / i.capacity) * 100 < 30).length;
    const uniqueDistricts = new Set(filtered.map((i) => i.district)).size;
    return { totalProducts, totalAvailable, lowStockCount, uniqueDistricts };
  }, [filtered]);

  const getUtilPercent = (a: number, c: number) => Math.round((a / c) * 100);

  const getBarColor = (pct: number) => {
    if (pct < 25) return "bg-himfed-danger";
    if (pct < 50) return "bg-himfed-warning";
    return "bg-himfed-success";
  };

  return (
    <section id="stock-checker" className="py-20 bg-muted/30">
      <div className="container px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Warehouse className="w-4 h-4" />
              <span>Live Stock Availability</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-4">
              Check Stock Near <span className="text-primary">You</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              View real-time stock levels across all HIMFED godowns. Filter by product category and district to find availability near you.
            </p>
          </div>

          {/* Summary stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Products Found", value: stats.totalProducts, icon: Package },
              { label: "Total Available", value: stats.totalAvailable.toLocaleString(), icon: Warehouse },
              { label: "Low Stock Items", value: stats.lowStockCount, icon: TrendingDown },
              { label: "Districts", value: stats.uniqueDistricts, icon: MapPin },
            ].map((s, i) => (
              <div key={i} className="p-4 rounded-2xl bg-card border border-border text-center">
                <s.icon className="w-5 h-5 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="p-4 md:p-6 rounded-2xl bg-card border border-border mb-6 space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
              <Filter className="w-4 h-4 text-primary" />
              Filters
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search product or godown..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* District selector */}
              <div className="relative min-w-[200px]">
                <button
                  onClick={() => setShowDistrictDropdown(!showDistrictDropdown)}
                  className="flex items-center justify-between w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                >
                  <span className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    {selectedDistrict}
                  </span>
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </button>
                {showDistrictDropdown && (
                  <div className="absolute z-20 top-12 left-0 right-0 bg-card border border-border rounded-xl shadow-lg max-h-60 overflow-y-auto">
                    {districts.map((d) => (
                      <button
                        key={d}
                        onClick={() => { setSelectedDistrict(d); setShowDistrictDropdown(false); }}
                        className={cn(
                          "w-full text-left px-4 py-2.5 text-sm hover:bg-muted transition-colors",
                          selectedDistrict === d && "bg-primary/10 text-primary font-medium"
                        )}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Category pills */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-all",
                    selectedCategory === cat
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Results */}
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <Package className="w-12 h-12 mx-auto mb-4 opacity-40" />
              <p className="text-lg font-medium">No stock found</p>
              <p className="text-sm">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {filtered.map((item, i) => {
                const pct = getUtilPercent(item.available, item.capacity);
                return (
                  <div
                    key={i}
                    className="group p-4 md:p-5 rounded-2xl bg-card border border-border hover:border-primary/20 hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      {/* Product info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-foreground truncate">{item.product}</h4>
                          <Badge variant="outline" className="text-[10px] shrink-0">
                            {item.category}
                          </Badge>
                          {pct < 25 && (
                            <Badge variant="destructive" className="text-[10px] shrink-0">
                              Low Stock
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {item.district}
                          </span>
                          <span className="hidden md:inline">•</span>
                          <span className="hidden md:flex items-center gap-1">
                            <Warehouse className="w-3 h-3" />
                            {item.godown}
                          </span>
                          <Badge variant="secondary" className="text-[10px]">{item.godownType}</Badge>
                        </div>
                      </div>

                      {/* Stock bar + numbers */}
                      <div className="w-full md:w-64 shrink-0">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-sm font-semibold text-foreground">
                            {item.available.toLocaleString()} <span className="text-muted-foreground font-normal">/ {item.capacity.toLocaleString()} {item.unit}</span>
                          </span>
                          <span className="flex items-center gap-1 text-xs">
                            {item.trend === "up" && <TrendingUp className="w-3 h-3 text-himfed-success" />}
                            {item.trend === "down" && <TrendingDown className="w-3 h-3 text-himfed-danger" />}
                            <span className="text-muted-foreground">{pct}%</span>
                          </span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className={cn("h-full rounded-full transition-all duration-700", getBarColor(pct))}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <div className="text-[11px] text-muted-foreground mt-1 text-right">
                          Updated {item.lastUpdated}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default StockChecker;
