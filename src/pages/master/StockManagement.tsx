import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, Column } from "@/components/shared/DataTable";
import { FormModal } from "@/components/shared/FormModal";
import { DeleteConfirmDialog } from "@/components/shared/DeleteConfirmDialog";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BarChart3, Pencil, Trash2, Eye, Filter, X, AlertTriangle, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface StockEntry {
  id: string;
  productCode: string;
  productName: string;
  category: string;
  godown: string;
  godownCode: string;
  batchNumber: string;
  quantity: number;
  unit: string;
  purchasePrice: number;
  mrp: number;
  manufacturingDate: string;
  expiryDate: string | null;
  stockStatus: "in_stock" | "low_stock" | "out_of_stock" | "expired";
  minStockLevel: number;
  maxStockLevel: number;
  lastUpdated: string;
  supplier: string;
  grnNumber: string;
}

const godowns = [
  { code: "GDN-001", name: "Central Warehouse Shimla" },
  { code: "GDN-002", name: "Kullu Area Godown" },
  { code: "GDN-003", name: "Mandi Distribution Center" },
  { code: "GDN-004", name: "Kangra Regional Store" },
  { code: "GDN-005", name: "Solan Depot" },
  { code: "GDN-006", name: "Una Storage Facility" },
  { code: "GDN-007", name: "Bilaspur Godown" },
  { code: "GDN-008", name: "Hamirpur Store" },
];

const products = [
  { code: "FRT-001", name: "Urea Fertilizer 50Kg", category: "Fertilizer", unit: "Bag" },
  { code: "FRT-002", name: "DAP Fertilizer 50Kg", category: "Fertilizer", unit: "Bag" },
  { code: "SED-001", name: "Tomato Seeds (Hybrid)", category: "Seeds", unit: "Kg" },
  { code: "PST-001", name: "Chlorpyrifos 20% EC", category: "Pesticides", unit: "Litre" },
  { code: "CRT-001", name: "Apple Crate (Wooden)", category: "Apple Crates", unit: "Piece" },
  { code: "FUL-001", name: "Diesel", category: "Fuel", unit: "Litre" },
];

const mockStockData: StockEntry[] = [
  {
    id: "1",
    productCode: "FRT-001",
    productName: "Urea Fertilizer 50Kg",
    category: "Fertilizer",
    godown: "Central Warehouse Shimla",
    godownCode: "GDN-001",
    batchNumber: "UREA-2024-001",
    quantity: 2500,
    unit: "Bag",
    purchasePrice: 240.00,
    mrp: 266.50,
    manufacturingDate: "2024-01-01",
    expiryDate: null,
    stockStatus: "in_stock",
    minStockLevel: 100,
    maxStockLevel: 5000,
    lastUpdated: "2024-01-20",
    supplier: "IFFCO",
    grnNumber: "GRN-2024-0045",
  },
  {
    id: "2",
    productCode: "FRT-002",
    productName: "DAP Fertilizer 50Kg",
    category: "Fertilizer",
    godown: "Kullu Area Godown",
    godownCode: "GDN-002",
    batchNumber: "DAP-2024-015",
    quantity: 45,
    unit: "Bag",
    purchasePrice: 1200.00,
    mrp: 1350.00,
    manufacturingDate: "2024-01-15",
    expiryDate: null,
    stockStatus: "low_stock",
    minStockLevel: 50,
    maxStockLevel: 3000,
    lastUpdated: "2024-01-18",
    supplier: "NFL",
    grnNumber: "GRN-2024-0052",
  },
  {
    id: "3",
    productCode: "SED-001",
    productName: "Tomato Seeds (Hybrid)",
    category: "Seeds",
    godown: "Mandi Distribution Center",
    godownCode: "GDN-003",
    batchNumber: "TOM-2024-003",
    quantity: 150,
    unit: "Kg",
    purchasePrice: 2000.00,
    mrp: 2500.00,
    manufacturingDate: "2024-02-01",
    expiryDate: "2025-02-01",
    stockStatus: "in_stock",
    minStockLevel: 10,
    maxStockLevel: 500,
    lastUpdated: "2024-02-05",
    supplier: "Syngenta",
    grnNumber: "GRN-2024-0078",
  },
  {
    id: "4",
    productCode: "PST-001",
    productName: "Chlorpyrifos 20% EC",
    category: "Pesticides",
    godown: "Central Warehouse Shimla",
    godownCode: "GDN-001",
    batchNumber: "CHL-2023-089",
    quantity: 25,
    unit: "Litre",
    purchasePrice: 380.00,
    mrp: 450.00,
    manufacturingDate: "2023-06-15",
    expiryDate: "2024-01-15",
    stockStatus: "expired",
    minStockLevel: 20,
    maxStockLevel: 1000,
    lastUpdated: "2024-01-10",
    supplier: "Bayer",
    grnNumber: "GRN-2023-0234",
  },
  {
    id: "5",
    productCode: "CRT-001",
    productName: "Apple Crate (Wooden)",
    category: "Apple Crates",
    godown: "Kullu Area Godown",
    godownCode: "GDN-002",
    batchNumber: "CRATE-2024-001",
    quantity: 0,
    unit: "Piece",
    purchasePrice: 280.00,
    mrp: 350.00,
    manufacturingDate: "2024-01-05",
    expiryDate: null,
    stockStatus: "out_of_stock",
    minStockLevel: 500,
    maxStockLevel: 10000,
    lastUpdated: "2024-01-25",
    supplier: "Local Vendor",
    grnNumber: "GRN-2024-0012",
  },
  {
    id: "6",
    productCode: "FUL-001",
    productName: "Diesel",
    category: "Fuel",
    godown: "Kangra Regional Store",
    godownCode: "GDN-004",
    batchNumber: "DSL-2024-022",
    quantity: 15000,
    unit: "Litre",
    purchasePrice: 82.50,
    mrp: 89.50,
    manufacturingDate: "2024-01-20",
    expiryDate: null,
    stockStatus: "in_stock",
    minStockLevel: 1000,
    maxStockLevel: 50000,
    lastUpdated: "2024-01-22",
    supplier: "IOCL",
    grnNumber: "GRN-2024-0089",
  },
  {
    id: "7",
    productCode: "FRT-001",
    productName: "Urea Fertilizer 50Kg",
    category: "Fertilizer",
    godown: "Solan Depot",
    godownCode: "GDN-005",
    batchNumber: "UREA-2024-002",
    quantity: 1800,
    unit: "Bag",
    purchasePrice: 240.00,
    mrp: 266.50,
    manufacturingDate: "2024-01-10",
    expiryDate: null,
    stockStatus: "in_stock",
    minStockLevel: 100,
    maxStockLevel: 5000,
    lastUpdated: "2024-01-21",
    supplier: "IFFCO",
    grnNumber: "GRN-2024-0056",
  },
];

const StockManagement = () => {
  const [stockData, setStockData] = useState<StockEntry[]>(mockStockData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState<StockEntry | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [filterGodown, setFilterGodown] = useState<string>("");
  const [filterCategory, setFilterCategory] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");

  // Form state
  const [formData, setFormData] = useState<Partial<StockEntry>>({
    productCode: "",
    productName: "",
    category: "",
    godown: "",
    godownCode: "",
    batchNumber: "",
    quantity: 0,
    unit: "",
    purchasePrice: 0,
    mrp: 0,
    manufacturingDate: "",
    expiryDate: "",
    stockStatus: "in_stock",
    minStockLevel: 0,
    maxStockLevel: 0,
    supplier: "",
    grnNumber: "",
  });

  const getStockStatusLabel = (status: string) => {
    switch (status) {
      case "in_stock":
        return "In Stock";
      case "low_stock":
        return "Low Stock";
      case "out_of_stock":
        return "Out of Stock";
      case "expired":
        return "Expired";
      default:
        return status;
    }
  };

  const calculateStockPercentage = (quantity: number, maxLevel: number) => {
    if (maxLevel === 0) return 0;
    return Math.min((quantity / maxLevel) * 100, 100);
  };

  const columns: Column<StockEntry>[] = [
    { key: "productCode", label: "Code", sortable: true },
    { key: "productName", label: "Product", sortable: true },
    { key: "godown", label: "Godown", sortable: true },
    { key: "batchNumber", label: "Batch No." },
    {
      key: "quantity",
      label: "Quantity",
      sortable: true,
      render: (item) => (
        <div className="space-y-1">
          <span className="font-medium">{item.quantity.toLocaleString()} {item.unit}</span>
          <Progress 
            value={calculateStockPercentage(item.quantity, item.maxStockLevel)} 
            className="h-1.5"
          />
        </div>
      ),
    },
    {
      key: "purchasePrice",
      label: "Purchase ₹",
      render: (item) => <span>₹{item.purchasePrice.toFixed(2)}</span>,
    },
    {
      key: "mrp",
      label: "MRP ₹",
      render: (item) => <span>₹{item.mrp.toFixed(2)}</span>,
    },
    {
      key: "expiryDate",
      label: "Expiry",
      render: (item) => (
        <span className={item.stockStatus === "expired" ? "text-destructive font-medium" : ""}>
          {item.expiryDate || "N/A"}
        </span>
      ),
    },
    {
      key: "stockStatus",
      label: "Status",
      render: (item) => (
        <StatusBadge
          status={item.stockStatus}
          label={getStockStatusLabel(item.stockStatus)}
        />
      ),
    },
  ];

  const filteredStock = stockData.filter((stock) => {
    if (filterGodown && stock.godownCode !== filterGodown) return false;
    if (filterCategory && stock.category !== filterCategory) return false;
    if (filterStatus && stock.stockStatus !== filterStatus) return false;
    return true;
  });

  const resetFilters = () => {
    setFilterGodown("");
    setFilterCategory("");
    setFilterStatus("");
  };

  const handleAdd = () => {
    setSelectedStock(null);
    setFormData({
      productCode: "",
      productName: "",
      category: "",
      godown: "",
      godownCode: "",
      batchNumber: "",
      quantity: 0,
      unit: "",
      purchasePrice: 0,
      mrp: 0,
      manufacturingDate: "",
      expiryDate: "",
      stockStatus: "in_stock",
      minStockLevel: 0,
      maxStockLevel: 0,
      supplier: "",
      grnNumber: "",
    });
    setIsModalOpen(true);
  };

  const handleEdit = (stock: StockEntry) => {
    setSelectedStock(stock);
    setFormData(stock);
    setIsModalOpen(true);
  };

  const handleView = (stock: StockEntry) => {
    setSelectedStock(stock);
    setIsViewModalOpen(true);
  };

  const handleDelete = (stock: StockEntry) => {
    setSelectedStock(stock);
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (selectedStock) {
      setStockData(stockData.filter((s) => s.id !== selectedStock.id));
      setIsDeleteOpen(false);
      setSelectedStock(null);
    }
  };

  const handleProductChange = (productCode: string) => {
    const product = products.find((p) => p.code === productCode);
    if (product) {
      setFormData({
        ...formData,
        productCode: product.code,
        productName: product.name,
        category: product.category,
        unit: product.unit,
      });
    }
  };

  const handleGodownChange = (godownCode: string) => {
    const godown = godowns.find((g) => g.code === godownCode);
    if (godown) {
      setFormData({
        ...formData,
        godownCode: godown.code,
        godown: godown.name,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      if (selectedStock) {
        setStockData(
          stockData.map((s) =>
            s.id === selectedStock.id ? { ...s, ...formData } as StockEntry : s
          )
        );
      } else {
        const newStock: StockEntry = {
          ...formData,
          id: Date.now().toString(),
          lastUpdated: new Date().toISOString().split("T")[0],
        } as StockEntry;
        setStockData([...stockData, newStock]);
      }
      setIsLoading(false);
      setIsModalOpen(false);
    }, 500);
  };

  // Summary stats
  const totalItems = stockData.length;
  const inStockCount = stockData.filter((s) => s.stockStatus === "in_stock").length;
  const lowStockCount = stockData.filter((s) => s.stockStatus === "low_stock").length;
  const outOfStockCount = stockData.filter((s) => s.stockStatus === "out_of_stock").length;
  const expiredCount = stockData.filter((s) => s.stockStatus === "expired").length;

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <PageHeader
              title="Stock Management"
              description="Track and manage inventory across all godowns"
              icon={BarChart3}
            />

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <Card>
                <CardContent className="pt-4">
                  <div className="text-sm text-muted-foreground">Total Entries</div>
                  <div className="text-2xl font-bold">{totalItems}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 text-sm text-himfed-success">
                    <CheckCircle className="h-4 w-4" />
                    In Stock
                  </div>
                  <div className="text-2xl font-bold text-himfed-success">{inStockCount}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 text-sm text-himfed-warning">
                    <AlertTriangle className="h-4 w-4" />
                    Low Stock
                  </div>
                  <div className="text-2xl font-bold text-himfed-warning">{lowStockCount}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 text-sm text-himfed-danger">
                    <X className="h-4 w-4" />
                    Out of Stock
                  </div>
                  <div className="text-2xl font-bold text-himfed-danger">{outOfStockCount}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 text-sm text-destructive">
                    <AlertTriangle className="h-4 w-4" />
                    Expired
                  </div>
                  <div className="text-2xl font-bold text-destructive">{expiredCount}</div>
                </CardContent>
              </Card>
            </div>

            {/* Advanced Filters */}
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between mb-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    {showFilters ? "Hide Filters" : "Show Filters"}
                  </Button>
                  {(filterGodown || filterCategory || filterStatus) && (
                    <Button variant="ghost" size="sm" onClick={resetFilters}>
                      <X className="h-4 w-4 mr-2" />
                      Clear Filters
                    </Button>
                  )}
                </div>

                {showFilters && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Godown</Label>
                      <Select value={filterGodown} onValueChange={setFilterGodown}>
                        <SelectTrigger>
                          <SelectValue placeholder="All Godowns" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All Godowns</SelectItem>
                          {godowns.map((g) => (
                            <SelectItem key={g.code} value={g.code}>
                              {g.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Category</Label>
                      <Select value={filterCategory} onValueChange={setFilterCategory}>
                        <SelectTrigger>
                          <SelectValue placeholder="All Categories" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All Categories</SelectItem>
                          <SelectItem value="Fertilizer">Fertilizer</SelectItem>
                          <SelectItem value="Seeds">Seeds</SelectItem>
                          <SelectItem value="Pesticides">Pesticides</SelectItem>
                          <SelectItem value="Apple Crates">Apple Crates</SelectItem>
                          <SelectItem value="Fuel">Fuel</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Stock Status</Label>
                      <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger>
                          <SelectValue placeholder="All Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All Status</SelectItem>
                          <SelectItem value="in_stock">In Stock</SelectItem>
                          <SelectItem value="low_stock">Low Stock</SelectItem>
                          <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                          <SelectItem value="expired">Expired</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <DataTable
              data={filteredStock}
              columns={columns}
              searchPlaceholder="Search stock entries..."
              searchKey="productName"
              onAdd={handleAdd}
              addLabel="Add Stock Entry"
              actions={(item) => (
                <div className="flex gap-2 justify-end">
                  <Button variant="ghost" size="sm" onClick={() => handleView(item)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(item)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDelete(item)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            />
          </div>
        </main>
      </div>

      {/* Add/Edit Modal */}
      <FormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title={selectedStock ? "Edit Stock Entry" : "Add Stock Entry"}
        description="Enter stock details below"
        onSubmit={handleSubmit}
        submitLabel={selectedStock ? "Update" : "Create"}
        isLoading={isLoading}
        size="xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="product">Product *</Label>
            <Select
              value={formData.productCode}
              onValueChange={handleProductChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select product" />
              </SelectTrigger>
              <SelectContent>
                {products.map((p) => (
                  <SelectItem key={p.code} value={p.code}>
                    {p.code} - {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="godown">Godown *</Label>
            <Select
              value={formData.godownCode}
              onValueChange={handleGodownChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select godown" />
              </SelectTrigger>
              <SelectContent>
                {godowns.map((g) => (
                  <SelectItem key={g.code} value={g.code}>
                    {g.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="batchNumber">Batch Number *</Label>
            <Input
              id="batchNumber"
              value={formData.batchNumber}
              onChange={(e) =>
                setFormData({ ...formData, batchNumber: e.target.value })
              }
              placeholder="e.g., UREA-2024-001"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="grnNumber">GRN Number</Label>
            <Input
              id="grnNumber"
              value={formData.grnNumber}
              onChange={(e) =>
                setFormData({ ...formData, grnNumber: e.target.value })
              }
              placeholder="e.g., GRN-2024-0045"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity *</Label>
            <Input
              id="quantity"
              type="number"
              value={formData.quantity}
              onChange={(e) =>
                setFormData({ ...formData, quantity: parseInt(e.target.value) })
              }
              placeholder="0"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="unit">Unit</Label>
            <Input
              id="unit"
              value={formData.unit}
              disabled
              placeholder="Auto-filled from product"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="purchasePrice">Purchase Price (₹) *</Label>
            <Input
              id="purchasePrice"
              type="number"
              step="0.01"
              value={formData.purchasePrice}
              onChange={(e) =>
                setFormData({ ...formData, purchasePrice: parseFloat(e.target.value) })
              }
              placeholder="0.00"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mrp">MRP (₹) *</Label>
            <Input
              id="mrp"
              type="number"
              step="0.01"
              value={formData.mrp}
              onChange={(e) =>
                setFormData({ ...formData, mrp: parseFloat(e.target.value) })
              }
              placeholder="0.00"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="supplier">Supplier</Label>
            <Input
              id="supplier"
              value={formData.supplier}
              onChange={(e) =>
                setFormData({ ...formData, supplier: e.target.value })
              }
              placeholder="Enter supplier name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="manufacturingDate">Manufacturing Date</Label>
            <Input
              id="manufacturingDate"
              type="date"
              value={formData.manufacturingDate}
              onChange={(e) =>
                setFormData({ ...formData, manufacturingDate: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="expiryDate">Expiry Date</Label>
            <Input
              id="expiryDate"
              type="date"
              value={formData.expiryDate || ""}
              onChange={(e) =>
                setFormData({ ...formData, expiryDate: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="stockStatus">Stock Status</Label>
            <Select
              value={formData.stockStatus}
              onValueChange={(value: StockEntry["stockStatus"]) =>
                setFormData({ ...formData, stockStatus: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="in_stock">In Stock</SelectItem>
                <SelectItem value="low_stock">Low Stock</SelectItem>
                <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="minStockLevel">Min Stock Level</Label>
            <Input
              id="minStockLevel"
              type="number"
              value={formData.minStockLevel}
              onChange={(e) =>
                setFormData({ ...formData, minStockLevel: parseInt(e.target.value) })
              }
              placeholder="0"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="maxStockLevel">Max Stock Level</Label>
            <Input
              id="maxStockLevel"
              type="number"
              value={formData.maxStockLevel}
              onChange={(e) =>
                setFormData({ ...formData, maxStockLevel: parseInt(e.target.value) })
              }
              placeholder="0"
            />
          </div>
        </div>
      </FormModal>

      {/* View Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-serif">Stock Entry Details</DialogTitle>
          </DialogHeader>
          {selectedStock && (
            <div className="grid grid-cols-2 gap-4 py-4">
              <div>
                <Label className="text-muted-foreground">Product Code</Label>
                <p className="font-medium">{selectedStock.productCode}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Product Name</Label>
                <p className="font-medium">{selectedStock.productName}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Category</Label>
                <p className="font-medium">{selectedStock.category}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Godown</Label>
                <p className="font-medium">{selectedStock.godown}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Batch Number</Label>
                <p className="font-medium">{selectedStock.batchNumber}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">GRN Number</Label>
                <p className="font-medium">{selectedStock.grnNumber}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Quantity</Label>
                <p className="font-medium">{selectedStock.quantity.toLocaleString()} {selectedStock.unit}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Status</Label>
                <StatusBadge
                  status={selectedStock.stockStatus}
                  label={getStockStatusLabel(selectedStock.stockStatus)}
                />
              </div>
              <div>
                <Label className="text-muted-foreground">Purchase Price</Label>
                <p className="font-medium">₹{selectedStock.purchasePrice.toFixed(2)}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">MRP</Label>
                <p className="font-medium">₹{selectedStock.mrp.toFixed(2)}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Supplier</Label>
                <p className="font-medium">{selectedStock.supplier}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Manufacturing Date</Label>
                <p className="font-medium">{selectedStock.manufacturingDate}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Expiry Date</Label>
                <p className="font-medium">{selectedStock.expiryDate || "N/A"}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Last Updated</Label>
                <p className="font-medium">{selectedStock.lastUpdated}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Min Stock Level</Label>
                <p className="font-medium">{selectedStock.minStockLevel} {selectedStock.unit}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Max Stock Level</Label>
                <p className="font-medium">{selectedStock.maxStockLevel} {selectedStock.unit}</p>
              </div>
              <div className="col-span-2">
                <Label className="text-muted-foreground">Stock Level</Label>
                <div className="mt-2">
                  <Progress 
                    value={calculateStockPercentage(selectedStock.quantity, selectedStock.maxStockLevel)} 
                    className="h-3"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedStock.quantity.toLocaleString()} / {selectedStock.maxStockLevel.toLocaleString()} {selectedStock.unit} 
                    ({calculateStockPercentage(selectedStock.quantity, selectedStock.maxStockLevel).toFixed(1)}%)
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <DeleteConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onConfirm={confirmDelete}
        title="Delete Stock Entry"
        description={`Are you sure you want to delete the stock entry for "${selectedStock?.productName}" at "${selectedStock?.godown}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default StockManagement;
