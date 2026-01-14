import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, Column } from "@/components/shared/DataTable";
import { FormModal } from "@/components/shared/FormModal";
import { DeleteConfirmDialog } from "@/components/shared/DeleteConfirmDialog";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calculator, Ruler, Tags, Edit, Trash2, Percent } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Types
interface TaxRate {
  id: string;
  name: string;
  code: string;
  percentage: number;
  type: "GST" | "IGST" | "SGST" | "CGST" | "Cess";
  status: "active" | "inactive";
  description: string;
}

interface Unit {
  id: string;
  name: string;
  symbol: string;
  type: "Weight" | "Volume" | "Quantity" | "Length" | "Area";
  baseUnit: string;
  conversionFactor: number;
  status: "active" | "inactive";
}

interface Category {
  id: string;
  name: string;
  code: string;
  parent: string;
  description: string;
  productCount: number;
  status: "active" | "inactive";
}

// Mock data
const mockTaxRates: TaxRate[] = [
  { id: "1", name: "GST 5%", code: "GST5", percentage: 5, type: "GST", status: "active", description: "5% GST for essential goods" },
  { id: "2", name: "GST 12%", code: "GST12", percentage: 12, type: "GST", status: "active", description: "12% GST for processed foods" },
  { id: "3", name: "GST 18%", code: "GST18", percentage: 18, type: "GST", status: "active", description: "18% GST standard rate" },
  { id: "4", name: "GST 28%", code: "GST28", percentage: 28, type: "GST", status: "active", description: "28% GST luxury goods" },
  { id: "5", name: "Nil GST", code: "GST0", percentage: 0, type: "GST", status: "active", description: "Exempt from GST" },
  { id: "6", name: "CGST 9%", code: "CGST9", percentage: 9, type: "CGST", status: "active", description: "Central GST component" },
  { id: "7", name: "SGST 9%", code: "SGST9", percentage: 9, type: "SGST", status: "active", description: "State GST component" },
];

const mockUnits: Unit[] = [
  { id: "1", name: "Kilogram", symbol: "kg", type: "Weight", baseUnit: "Gram", conversionFactor: 1000, status: "active" },
  { id: "2", name: "Gram", symbol: "g", type: "Weight", baseUnit: "Gram", conversionFactor: 1, status: "active" },
  { id: "3", name: "Quintal", symbol: "qtl", type: "Weight", baseUnit: "Gram", conversionFactor: 100000, status: "active" },
  { id: "4", name: "Metric Ton", symbol: "MT", type: "Weight", baseUnit: "Gram", conversionFactor: 1000000, status: "active" },
  { id: "5", name: "Litre", symbol: "L", type: "Volume", baseUnit: "Millilitre", conversionFactor: 1000, status: "active" },
  { id: "6", name: "Millilitre", symbol: "ml", type: "Volume", baseUnit: "Millilitre", conversionFactor: 1, status: "active" },
  { id: "7", name: "Piece", symbol: "pcs", type: "Quantity", baseUnit: "Piece", conversionFactor: 1, status: "active" },
  { id: "8", name: "Dozen", symbol: "dz", type: "Quantity", baseUnit: "Piece", conversionFactor: 12, status: "active" },
  { id: "9", name: "Box", symbol: "box", type: "Quantity", baseUnit: "Piece", conversionFactor: 1, status: "active" },
  { id: "10", name: "Bag", symbol: "bag", type: "Quantity", baseUnit: "Piece", conversionFactor: 1, status: "active" },
];

const mockCategories: Category[] = [
  { id: "1", name: "Fertilizers", code: "FERT", parent: "-", description: "All types of fertilizers", productCount: 45, status: "active" },
  { id: "2", name: "Urea", code: "FERT-UREA", parent: "Fertilizers", description: "Urea based fertilizers", productCount: 12, status: "active" },
  { id: "3", name: "DAP", code: "FERT-DAP", parent: "Fertilizers", description: "Di-ammonium Phosphate", productCount: 8, status: "active" },
  { id: "4", name: "Seeds", code: "SEED", parent: "-", description: "Agricultural seeds", productCount: 156, status: "active" },
  { id: "5", name: "Vegetable Seeds", code: "SEED-VEG", parent: "Seeds", description: "Vegetable category seeds", productCount: 78, status: "active" },
  { id: "6", name: "Pesticides", code: "PEST", parent: "-", description: "Pest control products", productCount: 34, status: "active" },
  { id: "7", name: "Insecticides", code: "PEST-INS", parent: "Pesticides", description: "Insect control chemicals", productCount: 18, status: "active" },
  { id: "8", name: "Fuel", code: "FUEL", parent: "-", description: "Petrol and Diesel", productCount: 2, status: "active" },
  { id: "9", name: "Packaging", code: "PACK", parent: "-", description: "Packaging materials", productCount: 15, status: "active" },
  { id: "10", name: "Apple Crates", code: "PACK-CRATE", parent: "Packaging", description: "Apple storage crates", productCount: 5, status: "active" },
];

const TaxUnitCategories = () => {
  const { toast } = useToast();
  
  // Tax state
  const [taxes, setTaxes] = useState<TaxRate[]>(mockTaxRates);
  const [taxFormOpen, setTaxFormOpen] = useState(false);
  const [taxDeleteOpen, setTaxDeleteOpen] = useState(false);
  const [selectedTax, setSelectedTax] = useState<TaxRate | null>(null);
  const [taxForm, setTaxForm] = useState({ name: "", code: "", percentage: "", type: "GST" as TaxRate["type"], status: "active" as const, description: "" });

  // Unit state
  const [units, setUnits] = useState<Unit[]>(mockUnits);
  const [unitFormOpen, setUnitFormOpen] = useState(false);
  const [unitDeleteOpen, setUnitDeleteOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [unitForm, setUnitForm] = useState({ name: "", symbol: "", type: "Weight" as Unit["type"], baseUnit: "", conversionFactor: "", status: "active" as const });

  // Category state
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [categoryFormOpen, setCategoryFormOpen] = useState(false);
  const [categoryDeleteOpen, setCategoryDeleteOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [categoryForm, setCategoryForm] = useState({ name: "", code: "", parent: "-", description: "", status: "active" as const });

  // Tax columns
  const taxColumns: Column<TaxRate>[] = [
    { key: "name", label: "Tax Name", sortable: true },
    { key: "code", label: "Code", sortable: true },
    { key: "type", label: "Type", sortable: true },
    { key: "percentage", label: "Rate", render: (item) => <span className="font-semibold text-primary">{item.percentage}%</span> },
    { key: "description", label: "Description", className: "max-w-[200px] truncate" },
    { key: "status", label: "Status", render: (item) => <StatusBadge status={item.status} /> },
  ];

  // Unit columns
  const unitColumns: Column<Unit>[] = [
    { key: "name", label: "Unit Name", sortable: true },
    { key: "symbol", label: "Symbol", render: (item) => <code className="px-2 py-1 bg-muted rounded text-sm">{item.symbol}</code> },
    { key: "type", label: "Type", sortable: true },
    { key: "baseUnit", label: "Base Unit" },
    { key: "conversionFactor", label: "Conversion", render: (item) => `1 ${item.symbol} = ${item.conversionFactor} ${item.baseUnit.toLowerCase()}` },
    { key: "status", label: "Status", render: (item) => <StatusBadge status={item.status} /> },
  ];

  // Category columns
  const categoryColumns: Column<Category>[] = [
    { key: "name", label: "Category Name", sortable: true },
    { key: "code", label: "Code", render: (item) => <code className="px-2 py-1 bg-muted rounded text-sm">{item.code}</code> },
    { key: "parent", label: "Parent Category", sortable: true },
    { key: "description", label: "Description", className: "max-w-[200px] truncate" },
    { key: "productCount", label: "Products", render: (item) => <span className="font-semibold">{item.productCount}</span> },
    { key: "status", label: "Status", render: (item) => <StatusBadge status={item.status} /> },
  ];

  // Tax handlers
  const handleAddTax = () => { setSelectedTax(null); setTaxForm({ name: "", code: "", percentage: "", type: "GST", status: "active", description: "" }); setTaxFormOpen(true); };
  const handleEditTax = (tax: TaxRate) => { setSelectedTax(tax); setTaxForm({ name: tax.name, code: tax.code, percentage: String(tax.percentage), type: tax.type, status: "active", description: tax.description }); setTaxFormOpen(true); };
  const handleDeleteTax = (tax: TaxRate) => { setSelectedTax(tax); setTaxDeleteOpen(true); };
  const handleSubmitTax = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTax) {
      setTaxes(taxes.map(t => t.id === selectedTax.id ? { ...t, ...taxForm, percentage: Number(taxForm.percentage) } : t));
      toast({ title: "Tax rate updated successfully" });
    } else {
      setTaxes([...taxes, { ...taxForm, id: String(Date.now()), percentage: Number(taxForm.percentage) }]);
      toast({ title: "Tax rate created successfully" });
    }
    setTaxFormOpen(false);
  };
  const confirmDeleteTax = () => { if (selectedTax) { setTaxes(taxes.filter(t => t.id !== selectedTax.id)); toast({ title: "Tax rate deleted", variant: "destructive" }); } setTaxDeleteOpen(false); };

  // Unit handlers
  const handleAddUnit = () => { setSelectedUnit(null); setUnitForm({ name: "", symbol: "", type: "Weight", baseUnit: "", conversionFactor: "", status: "active" }); setUnitFormOpen(true); };
  const handleEditUnit = (unit: Unit) => { setSelectedUnit(unit); setUnitForm({ name: unit.name, symbol: unit.symbol, type: unit.type, baseUnit: unit.baseUnit, conversionFactor: String(unit.conversionFactor), status: "active" }); setUnitFormOpen(true); };
  const handleDeleteUnit = (unit: Unit) => { setSelectedUnit(unit); setUnitDeleteOpen(true); };
  const handleSubmitUnit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUnit) {
      setUnits(units.map(u => u.id === selectedUnit.id ? { ...u, ...unitForm, conversionFactor: Number(unitForm.conversionFactor) } : u));
      toast({ title: "Unit updated successfully" });
    } else {
      setUnits([...units, { ...unitForm, id: String(Date.now()), conversionFactor: Number(unitForm.conversionFactor) }]);
      toast({ title: "Unit created successfully" });
    }
    setUnitFormOpen(false);
  };
  const confirmDeleteUnit = () => { if (selectedUnit) { setUnits(units.filter(u => u.id !== selectedUnit.id)); toast({ title: "Unit deleted", variant: "destructive" }); } setUnitDeleteOpen(false); };

  // Category handlers
  const handleAddCategory = () => { setSelectedCategory(null); setCategoryForm({ name: "", code: "", parent: "-", description: "", status: "active" }); setCategoryFormOpen(true); };
  const handleEditCategory = (cat: Category) => { setSelectedCategory(cat); setCategoryForm({ name: cat.name, code: cat.code, parent: cat.parent, description: cat.description, status: "active" }); setCategoryFormOpen(true); };
  const handleDeleteCategory = (cat: Category) => { setSelectedCategory(cat); setCategoryDeleteOpen(true); };
  const handleSubmitCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCategory) {
      setCategories(categories.map(c => c.id === selectedCategory.id ? { ...c, ...categoryForm } : c));
      toast({ title: "Category updated successfully" });
    } else {
      setCategories([...categories, { ...categoryForm, id: String(Date.now()), productCount: 0 }]);
      toast({ title: "Category created successfully" });
    }
    setCategoryFormOpen(false);
  };
  const confirmDeleteCategory = () => { if (selectedCategory) { setCategories(categories.filter(c => c.id !== selectedCategory.id)); toast({ title: "Category deleted", variant: "destructive" }); } setCategoryDeleteOpen(false); };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <PageHeader
              title="Tax, Units & Categories"
              description="Manage tax rates, measurement units, and product categories"
              icon={Calculator}
            />

            <Tabs defaultValue="taxes" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="taxes" className="flex items-center gap-2">
                  <Percent className="w-4 h-4" />
                  Tax Rates
                </TabsTrigger>
                <TabsTrigger value="units" className="flex items-center gap-2">
                  <Ruler className="w-4 h-4" />
                  Units
                </TabsTrigger>
                <TabsTrigger value="categories" className="flex items-center gap-2">
                  <Tags className="w-4 h-4" />
                  Categories
                </TabsTrigger>
              </TabsList>

              {/* Tax Rates Tab */}
              <TabsContent value="taxes">
                <DataTable
                  data={taxes}
                  columns={taxColumns}
                  searchPlaceholder="Search tax rates..."
                  searchKey="name"
                  onAdd={handleAddTax}
                  addLabel="Add Tax Rate"
                  actions={(item) => (
                    <div className="flex items-center gap-1 justify-end">
                      <Button variant="ghost" size="sm" onClick={() => handleEditTax(item)}><Edit className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteTax(item)} className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  )}
                />
              </TabsContent>

              {/* Units Tab */}
              <TabsContent value="units">
                <DataTable
                  data={units}
                  columns={unitColumns}
                  searchPlaceholder="Search units..."
                  searchKey="name"
                  onAdd={handleAddUnit}
                  addLabel="Add Unit"
                  actions={(item) => (
                    <div className="flex items-center gap-1 justify-end">
                      <Button variant="ghost" size="sm" onClick={() => handleEditUnit(item)}><Edit className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteUnit(item)} className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  )}
                />
              </TabsContent>

              {/* Categories Tab */}
              <TabsContent value="categories">
                <DataTable
                  data={categories}
                  columns={categoryColumns}
                  searchPlaceholder="Search categories..."
                  searchKey="name"
                  onAdd={handleAddCategory}
                  addLabel="Add Category"
                  actions={(item) => (
                    <div className="flex items-center gap-1 justify-end">
                      <Button variant="ghost" size="sm" onClick={() => handleEditCategory(item)}><Edit className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteCategory(item)} className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  )}
                />
              </TabsContent>
            </Tabs>

            {/* Tax Form Modal */}
            <FormModal open={taxFormOpen} onOpenChange={setTaxFormOpen} title={selectedTax ? "Edit Tax Rate" : "Add Tax Rate"} onSubmit={handleSubmitTax} size="md">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Tax Name *</Label><Input value={taxForm.name} onChange={(e) => setTaxForm({ ...taxForm, name: e.target.value })} required /></div>
                <div className="space-y-2"><Label>Code *</Label><Input value={taxForm.code} onChange={(e) => setTaxForm({ ...taxForm, code: e.target.value })} required /></div>
                <div className="space-y-2"><Label>Type *</Label>
                  <Select value={taxForm.type} onValueChange={(v: TaxRate["type"]) => setTaxForm({ ...taxForm, type: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GST">GST</SelectItem>
                      <SelectItem value="CGST">CGST</SelectItem>
                      <SelectItem value="SGST">SGST</SelectItem>
                      <SelectItem value="IGST">IGST</SelectItem>
                      <SelectItem value="Cess">Cess</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2"><Label>Percentage *</Label><Input type="number" step="0.01" value={taxForm.percentage} onChange={(e) => setTaxForm({ ...taxForm, percentage: e.target.value })} required /></div>
              </div>
              <div className="space-y-2"><Label>Description</Label><Textarea value={taxForm.description} onChange={(e) => setTaxForm({ ...taxForm, description: e.target.value })} /></div>
            </FormModal>

            {/* Unit Form Modal */}
            <FormModal open={unitFormOpen} onOpenChange={setUnitFormOpen} title={selectedUnit ? "Edit Unit" : "Add Unit"} onSubmit={handleSubmitUnit} size="md">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Unit Name *</Label><Input value={unitForm.name} onChange={(e) => setUnitForm({ ...unitForm, name: e.target.value })} required /></div>
                <div className="space-y-2"><Label>Symbol *</Label><Input value={unitForm.symbol} onChange={(e) => setUnitForm({ ...unitForm, symbol: e.target.value })} required /></div>
                <div className="space-y-2"><Label>Type *</Label>
                  <Select value={unitForm.type} onValueChange={(v: Unit["type"]) => setUnitForm({ ...unitForm, type: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Weight">Weight</SelectItem>
                      <SelectItem value="Volume">Volume</SelectItem>
                      <SelectItem value="Quantity">Quantity</SelectItem>
                      <SelectItem value="Length">Length</SelectItem>
                      <SelectItem value="Area">Area</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2"><Label>Base Unit *</Label><Input value={unitForm.baseUnit} onChange={(e) => setUnitForm({ ...unitForm, baseUnit: e.target.value })} required /></div>
                <div className="col-span-2 space-y-2"><Label>Conversion Factor *</Label><Input type="number" value={unitForm.conversionFactor} onChange={(e) => setUnitForm({ ...unitForm, conversionFactor: e.target.value })} required /></div>
              </div>
            </FormModal>

            {/* Category Form Modal */}
            <FormModal open={categoryFormOpen} onOpenChange={setCategoryFormOpen} title={selectedCategory ? "Edit Category" : "Add Category"} onSubmit={handleSubmitCategory} size="md">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Category Name *</Label><Input value={categoryForm.name} onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })} required /></div>
                <div className="space-y-2"><Label>Code *</Label><Input value={categoryForm.code} onChange={(e) => setCategoryForm({ ...categoryForm, code: e.target.value })} required /></div>
                <div className="col-span-2 space-y-2"><Label>Parent Category</Label>
                  <Select value={categoryForm.parent} onValueChange={(v) => setCategoryForm({ ...categoryForm, parent: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="-">None (Top Level)</SelectItem>
                      {categories.filter(c => c.parent === "-").map(c => (
                        <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2"><Label>Description</Label><Textarea value={categoryForm.description} onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })} /></div>
            </FormModal>

            {/* Delete Dialogs */}
            <DeleteConfirmDialog open={taxDeleteOpen} onOpenChange={setTaxDeleteOpen} onConfirm={confirmDeleteTax} itemName={selectedTax?.name} />
            <DeleteConfirmDialog open={unitDeleteOpen} onOpenChange={setUnitDeleteOpen} onConfirm={confirmDeleteUnit} itemName={selectedUnit?.name} />
            <DeleteConfirmDialog open={categoryDeleteOpen} onOpenChange={setCategoryDeleteOpen} onConfirm={confirmDeleteCategory} itemName={selectedCategory?.name} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default TaxUnitCategories;
