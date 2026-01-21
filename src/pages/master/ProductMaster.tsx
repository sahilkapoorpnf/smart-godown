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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Package, Pencil, Trash2, Eye, Filter, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Product {
  id: string;
  productCode: string;
  productName: string;
  category: string;
  subCategory: string;
  unit: string;
  hsnCode: string;
  gstRate: number;
  mrp: number;
  minStockLevel: number;
  maxStockLevel: number;
  reorderLevel: number;
  status: "active" | "inactive";
  expiryTracking: boolean;
  batchTracking: boolean;
  description: string;
  manufacturer: string;
  createdAt: string;
}

const categories = [
  "Fertilizer",
  "Seeds",
  "Pesticides",
  "Tools & Equipment",
  "Packaging Materials",
  "Apple Crates",
  "Fuel",
  "Others",
];

const subCategories: Record<string, string[]> = {
  Fertilizer: ["Urea", "DAP", "MOP", "NPK", "Organic", "Micronutrients"],
  Seeds: ["Vegetable", "Cereals", "Pulses", "Oilseeds", "Fodder"],
  Pesticides: ["Insecticides", "Fungicides", "Herbicides", "Rodenticides"],
  "Tools & Equipment": ["Hand Tools", "Power Tools", "Irrigation", "Sprayers"],
  "Packaging Materials": ["Bags", "Cartons", "Wrapping", "Labels"],
  "Apple Crates": ["Wooden", "Plastic", "Cardboard"],
  Fuel: ["Petrol", "Diesel"],
  Others: ["Miscellaneous"],
};

const units = ["Kg", "Litre", "Piece", "Bag", "Quintal", "MT", "Box", "Crate", "Drum"];

const gstRates = [0, 5, 12, 18, 28];

const mockProducts: Product[] = [
  {
    id: "1",
    productCode: "FRT-001",
    productName: "Urea Fertilizer 50Kg",
    category: "Fertilizer",
    subCategory: "Urea",
    unit: "Bag",
    hsnCode: "31021010",
    gstRate: 5,
    mrp: 266.50,
    minStockLevel: 100,
    maxStockLevel: 5000,
    reorderLevel: 500,
    status: "active",
    expiryTracking: false,
    batchTracking: true,
    description: "Standard urea fertilizer 50kg bag",
    manufacturer: "IFFCO",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    productCode: "FRT-002",
    productName: "DAP Fertilizer 50Kg",
    category: "Fertilizer",
    subCategory: "DAP",
    unit: "Bag",
    hsnCode: "31053000",
    gstRate: 5,
    mrp: 1350.00,
    minStockLevel: 50,
    maxStockLevel: 3000,
    reorderLevel: 300,
    status: "active",
    expiryTracking: false,
    batchTracking: true,
    description: "Di-ammonium phosphate 50kg bag",
    manufacturer: "NFL",
    createdAt: "2024-01-15",
  },
  {
    id: "3",
    productCode: "SED-001",
    productName: "Tomato Seeds (Hybrid)",
    category: "Seeds",
    subCategory: "Vegetable",
    unit: "Kg",
    hsnCode: "12099100",
    gstRate: 0,
    mrp: 2500.00,
    minStockLevel: 10,
    maxStockLevel: 500,
    reorderLevel: 50,
    status: "active",
    expiryTracking: true,
    batchTracking: true,
    description: "High yield hybrid tomato seeds",
    manufacturer: "Syngenta",
    createdAt: "2024-02-01",
  },
  {
    id: "4",
    productCode: "PST-001",
    productName: "Chlorpyrifos 20% EC",
    category: "Pesticides",
    subCategory: "Insecticides",
    unit: "Litre",
    hsnCode: "38089119",
    gstRate: 18,
    mrp: 450.00,
    minStockLevel: 20,
    maxStockLevel: 1000,
    reorderLevel: 100,
    status: "active",
    expiryTracking: true,
    batchTracking: true,
    description: "Broad spectrum insecticide",
    manufacturer: "Bayer",
    createdAt: "2024-02-10",
  },
  {
    id: "5",
    productCode: "CRT-001",
    productName: "Apple Crate (Wooden)",
    category: "Apple Crates",
    subCategory: "Wooden",
    unit: "Piece",
    hsnCode: "44152000",
    gstRate: 12,
    mrp: 350.00,
    minStockLevel: 500,
    maxStockLevel: 10000,
    reorderLevel: 2000,
    status: "active",
    expiryTracking: false,
    batchTracking: false,
    description: "Standard wooden apple crate",
    manufacturer: "Local",
    createdAt: "2024-01-20",
  },
  {
    id: "6",
    productCode: "FUL-001",
    productName: "Diesel",
    category: "Fuel",
    subCategory: "Diesel",
    unit: "Litre",
    hsnCode: "27101930",
    gstRate: 0,
    mrp: 89.50,
    minStockLevel: 1000,
    maxStockLevel: 50000,
    reorderLevel: 5000,
    status: "active",
    expiryTracking: false,
    batchTracking: true,
    description: "High speed diesel",
    manufacturer: "IOCL",
    createdAt: "2024-01-10",
  },
];

const ProductMaster = () => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [filterCategory, setFilterCategory] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterGst, setFilterGst] = useState<string>("");

  // Form state
  const [formData, setFormData] = useState<Partial<Product>>({
    productCode: "",
    productName: "",
    category: "",
    subCategory: "",
    unit: "",
    hsnCode: "",
    gstRate: 0,
    mrp: 0,
    minStockLevel: 0,
    maxStockLevel: 0,
    reorderLevel: 0,
    status: "active",
    expiryTracking: false,
    batchTracking: false,
    description: "",
    manufacturer: "",
  });

  const columns: Column<Product>[] = [
    { key: "productCode", label: "Code", sortable: true },
    { key: "productName", label: "Product Name", sortable: true },
    { key: "category", label: "Category", sortable: true },
    { key: "unit", label: "Unit" },
    { key: "hsnCode", label: "HSN Code" },
    {
      key: "gstRate",
      label: "GST %",
      render: (item) => <span>{item.gstRate}%</span>,
    },
    {
      key: "mrp",
      label: "MRP (₹)",
      sortable: true,
      render: (item) => <span>₹{item.mrp.toFixed(2)}</span>,
    },
    {
      key: "minStockLevel",
      label: "Min Stock",
      render: (item) => <span>{item.minStockLevel} {item.unit}</span>,
    },
    {
      key: "status",
      label: "Status",
      render: (item) => (
        <StatusBadge status={item.status} />
      ),
    },
  ];

  const filteredProducts = products.filter((product) => {
    if (filterCategory && product.category !== filterCategory) return false;
    if (filterStatus && product.status !== filterStatus) return false;
    if (filterGst && product.gstRate !== parseInt(filterGst)) return false;
    return true;
  });

  const resetFilters = () => {
    setFilterCategory("");
    setFilterStatus("");
    setFilterGst("");
  };

  const handleAdd = () => {
    setSelectedProduct(null);
    setFormData({
      productCode: "",
      productName: "",
      category: "",
      subCategory: "",
      unit: "",
      hsnCode: "",
      gstRate: 0,
      mrp: 0,
      minStockLevel: 0,
      maxStockLevel: 0,
      reorderLevel: 0,
      status: "active",
      expiryTracking: false,
      batchTracking: false,
      description: "",
      manufacturer: "",
    });
    setIsModalOpen(true);
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setFormData(product);
    setIsModalOpen(true);
  };

  const handleView = (product: Product) => {
    setSelectedProduct(product);
    setIsViewModalOpen(true);
  };

  const handleDelete = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (selectedProduct) {
      setProducts(products.filter((p) => p.id !== selectedProduct.id));
      setIsDeleteOpen(false);
      setSelectedProduct(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      if (selectedProduct) {
        setProducts(
          products.map((p) =>
            p.id === selectedProduct.id ? { ...p, ...formData } as Product : p
          )
        );
      } else {
        const newProduct: Product = {
          ...formData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString().split("T")[0],
        } as Product;
        setProducts([...products, newProduct]);
      }
      setIsLoading(false);
      setIsModalOpen(false);
    }, 500);
  };

  const handleCategoryChange = (value: string) => {
    setFormData({
      ...formData,
      category: value,
      subCategory: "",
    });
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <PageHeader
              title="Product Master"
              description="Manage all products including fertilizers, seeds, pesticides, and more"
              icon={Package}
            />

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
                  {(filterCategory || filterStatus || filterGst) && (
                    <Button variant="ghost" size="sm" onClick={resetFilters}>
                      <X className="h-4 w-4 mr-2" />
                      Clear Filters
                    </Button>
                  )}
                </div>

                {showFilters && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Category</Label>
                      <Select value={filterCategory} onValueChange={setFilterCategory}>
                        <SelectTrigger>
                          <SelectValue placeholder="All Categories" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All Categories</SelectItem>
                          {categories.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Status</Label>
                      <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger>
                          <SelectValue placeholder="All Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All Status</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>GST Rate</Label>
                      <Select value={filterGst} onValueChange={setFilterGst}>
                        <SelectTrigger>
                          <SelectValue placeholder="All GST Rates" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All GST Rates</SelectItem>
                          {gstRates.map((rate) => (
                            <SelectItem key={rate} value={rate.toString()}>
                              {rate}%
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <DataTable
              data={filteredProducts}
              columns={columns}
              searchPlaceholder="Search products..."
              searchKey="productName"
              onAdd={handleAdd}
              addLabel="Add Product"
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
        title={selectedProduct ? "Edit Product" : "Add New Product"}
        description="Enter product details below"
        onSubmit={handleSubmit}
        submitLabel={selectedProduct ? "Update" : "Create"}
        isLoading={isLoading}
        size="xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="productCode">Product Code *</Label>
            <Input
              id="productCode"
              value={formData.productCode}
              onChange={(e) =>
                setFormData({ ...formData, productCode: e.target.value })
              }
              placeholder="e.g., FRT-001"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="productName">Product Name *</Label>
            <Input
              id="productName"
              value={formData.productName}
              onChange={(e) =>
                setFormData({ ...formData, productName: e.target.value })
              }
              placeholder="Enter product name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select
              value={formData.category}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="subCategory">Sub Category</Label>
            <Select
              value={formData.subCategory}
              onValueChange={(value) =>
                setFormData({ ...formData, subCategory: value })
              }
              disabled={!formData.category}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select sub-category" />
              </SelectTrigger>
              <SelectContent>
                {(subCategories[formData.category || ""] || []).map((sub) => (
                  <SelectItem key={sub} value={sub}>
                    {sub}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="unit">Unit *</Label>
            <Select
              value={formData.unit}
              onValueChange={(value) => setFormData({ ...formData, unit: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                {units.map((unit) => (
                  <SelectItem key={unit} value={unit}>
                    {unit}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="manufacturer">Manufacturer</Label>
            <Input
              id="manufacturer"
              value={formData.manufacturer}
              onChange={(e) =>
                setFormData({ ...formData, manufacturer: e.target.value })
              }
              placeholder="Enter manufacturer name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hsnCode">HSN Code *</Label>
            <Input
              id="hsnCode"
              value={formData.hsnCode}
              onChange={(e) =>
                setFormData({ ...formData, hsnCode: e.target.value })
              }
              placeholder="e.g., 31021010"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gstRate">GST Rate (%) *</Label>
            <Select
              value={formData.gstRate?.toString()}
              onValueChange={(value) =>
                setFormData({ ...formData, gstRate: parseInt(value) })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select GST rate" />
              </SelectTrigger>
              <SelectContent>
                {gstRates.map((rate) => (
                  <SelectItem key={rate} value={rate.toString()}>
                    {rate}%
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
            <Label htmlFor="minStockLevel">Minimum Stock Level</Label>
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
            <Label htmlFor="maxStockLevel">Maximum Stock Level</Label>
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
          <div className="space-y-2">
            <Label htmlFor="reorderLevel">Reorder Level</Label>
            <Input
              id="reorderLevel"
              type="number"
              value={formData.reorderLevel}
              onChange={(e) =>
                setFormData({ ...formData, reorderLevel: parseInt(e.target.value) })
              }
              placeholder="0"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value: "active" | "inactive") =>
                setFormData({ ...formData, status: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-4 pt-6">
            <div className="flex items-center gap-2">
              <Switch
                id="expiryTracking"
                checked={formData.expiryTracking}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, expiryTracking: checked })
                }
              />
              <Label htmlFor="expiryTracking">Expiry Tracking</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="batchTracking"
                checked={formData.batchTracking}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, batchTracking: checked })
                }
              />
              <Label htmlFor="batchTracking">Batch Tracking</Label>
            </div>
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Enter product description"
              rows={3}
            />
          </div>
        </div>
      </FormModal>

      {/* View Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-serif">Product Details</DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <div className="grid grid-cols-2 gap-4 py-4">
              <div>
                <Label className="text-muted-foreground">Product Code</Label>
                <p className="font-medium">{selectedProduct.productCode}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Product Name</Label>
                <p className="font-medium">{selectedProduct.productName}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Category</Label>
                <p className="font-medium">{selectedProduct.category}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Sub Category</Label>
                <p className="font-medium">{selectedProduct.subCategory || "-"}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Unit</Label>
                <p className="font-medium">{selectedProduct.unit}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Manufacturer</Label>
                <p className="font-medium">{selectedProduct.manufacturer || "-"}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">HSN Code</Label>
                <p className="font-medium">{selectedProduct.hsnCode}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">GST Rate</Label>
                <p className="font-medium">{selectedProduct.gstRate}%</p>
              </div>
              <div>
                <Label className="text-muted-foreground">MRP</Label>
                <p className="font-medium">₹{selectedProduct.mrp.toFixed(2)}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Status</Label>
                <StatusBadge status={selectedProduct.status} />
              </div>
              <div>
                <Label className="text-muted-foreground">Min Stock Level</Label>
                <p className="font-medium">{selectedProduct.minStockLevel} {selectedProduct.unit}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Max Stock Level</Label>
                <p className="font-medium">{selectedProduct.maxStockLevel} {selectedProduct.unit}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Reorder Level</Label>
                <p className="font-medium">{selectedProduct.reorderLevel} {selectedProduct.unit}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Created On</Label>
                <p className="font-medium">{selectedProduct.createdAt}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Expiry Tracking</Label>
                <p className="font-medium">{selectedProduct.expiryTracking ? "Yes" : "No"}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Batch Tracking</Label>
                <p className="font-medium">{selectedProduct.batchTracking ? "Yes" : "No"}</p>
              </div>
              <div className="col-span-2">
                <Label className="text-muted-foreground">Description</Label>
                <p className="font-medium">{selectedProduct.description || "-"}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <DeleteConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onConfirm={confirmDelete}
        title="Delete Product"
        description={`Are you sure you want to delete "${selectedProduct?.productName}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default ProductMaster;
