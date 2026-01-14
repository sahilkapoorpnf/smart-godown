import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FormModal } from "@/components/shared/FormModal";
import {
  LayoutGrid,
  Package,
  Warehouse,
  BarChart3,
  ShoppingCart,
  ArrowLeftRight,
  Truck,
  Fuel,
  Apple,
  Bell,
  FileText,
  Search,
  Users,
  Settings,
  Edit,
  Eye,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Module {
  id: string;
  name: string;
  code: string;
  description: string;
  icon: React.ElementType;
  isEnabled: boolean;
  isCore: boolean;
  lastModified: string;
  modifiedBy: string;
  permissions: string[];
}

const initialModules: Module[] = [
  { id: "1", name: "Product Master", code: "PROD", description: "Manage product catalog, SKUs, pricing, and inventory items", icon: Package, isEnabled: true, isCore: true, lastModified: "2024-01-10", modifiedBy: "System", permissions: ["View", "Create", "Edit", "Delete", "Export"] },
  { id: "2", name: "Godown & Location", code: "GODOWN", description: "Manage warehouses, godowns, and storage locations", icon: Warehouse, isEnabled: true, isCore: true, lastModified: "2024-01-10", modifiedBy: "System", permissions: ["View", "Create", "Edit", "Delete", "Map View"] },
  { id: "3", name: "Stock Management", code: "STOCK", description: "Real-time stock tracking, verification, and adjustments", icon: BarChart3, isEnabled: true, isCore: true, lastModified: "2024-01-10", modifiedBy: "System", permissions: ["View", "Adjust", "Verify", "Report"] },
  { id: "4", name: "Procurement", code: "PROC", description: "Purchase orders, supplier management, and GRN processing", icon: ShoppingCart, isEnabled: true, isCore: false, lastModified: "2024-01-08", modifiedBy: "Rajesh Kumar", permissions: ["View", "Create PO", "Approve PO", "GRN", "Supplier Mgmt"] },
  { id: "5", name: "Transfers", code: "TRANS", description: "Inter-godown and inter-area stock transfers", icon: ArrowLeftRight, isEnabled: true, isCore: false, lastModified: "2024-01-08", modifiedBy: "Rajesh Kumar", permissions: ["View", "Request", "Approve", "Track"] },
  { id: "6", name: "Distribution", code: "DIST", description: "Stock distribution to depots, farmers, and retail points", icon: Truck, isEnabled: true, isCore: false, lastModified: "2024-01-05", modifiedBy: "Priya Sharma", permissions: ["View", "Create Challan", "Dispatch", "Delivery"] },
  { id: "7", name: "Petrol & Diesel", code: "FUEL", description: "Fuel inventory, vehicle-wise issuance, and billing", icon: Fuel, isEnabled: true, isCore: false, lastModified: "2024-01-03", modifiedBy: "Rajesh Kumar", permissions: ["View", "Issue", "Track", "Billing", "Credit Recovery"] },
  { id: "8", name: "Apple & Crates", code: "CRATE", description: "Apple crate inventory, farmer issuance, and returns", icon: Apple, isEnabled: true, isCore: false, lastModified: "2024-01-02", modifiedBy: "Priya Sharma", permissions: ["View", "Issue", "Return", "Damage Report"] },
  { id: "9", name: "Alerts", code: "ALERT", description: "System alerts, notifications, and automated triggers", icon: Bell, isEnabled: true, isCore: true, lastModified: "2024-01-10", modifiedBy: "System", permissions: ["View", "Configure", "Acknowledge"] },
  { id: "10", name: "Reports", code: "REPORT", description: "Generate and export system reports and analytics", icon: FileText, isEnabled: true, isCore: true, lastModified: "2024-01-10", modifiedBy: "System", permissions: ["View", "Generate", "Export", "Schedule"] },
  { id: "11", name: "Audit & Logs", code: "AUDIT", description: "System audit trail, user activity logs, and compliance", icon: Search, isEnabled: true, isCore: true, lastModified: "2024-01-10", modifiedBy: "System", permissions: ["View", "Export", "Archive"] },
  { id: "12", name: "User Control", code: "USER", description: "User management, roles, and access control", icon: Users, isEnabled: true, isCore: true, lastModified: "2024-01-10", modifiedBy: "System", permissions: ["View", "Create", "Edit", "Deactivate", "Role Assign"] },
];

const ModuleControl = () => {
  const { toast } = useToast();
  const [modules, setModules] = useState<Module[]>(initialModules);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [editForm, setEditForm] = useState({ name: "", description: "" });

  const handleToggle = (moduleId: string) => {
    const module = modules.find(m => m.id === moduleId);
    if (module?.isCore) {
      toast({ title: "Core module cannot be disabled", description: "This is a core system module required for operation.", variant: "destructive" });
      return;
    }
    
    setModules(modules.map(m => 
      m.id === moduleId 
        ? { ...m, isEnabled: !m.isEnabled, lastModified: new Date().toISOString().split("T")[0], modifiedBy: "Super Admin" }
        : m
    ));
    
    const updated = modules.find(m => m.id === moduleId);
    toast({ title: `${updated?.name} ${updated?.isEnabled ? "disabled" : "enabled"}` });
  };

  const handleView = (module: Module) => {
    setSelectedModule(module);
    setIsViewOpen(true);
  };

  const handleEdit = (module: Module) => {
    setSelectedModule(module);
    setEditForm({ name: module.name, description: module.description });
    setIsEditOpen(true);
  };

  const handleSubmitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedModule) {
      setModules(modules.map(m =>
        m.id === selectedModule.id
          ? { ...m, ...editForm, lastModified: new Date().toISOString().split("T")[0], modifiedBy: "Super Admin" }
          : m
      ));
      toast({ title: "Module settings updated" });
    }
    setIsEditOpen(false);
  };

  const enabledCount = modules.filter(m => m.isEnabled).length;
  const coreCount = modules.filter(m => m.isCore).length;

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <PageHeader
              title="Module Control"
              description="Enable or disable system modules and configure their settings"
              icon={LayoutGrid}
            />

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Modules</p>
                      <p className="text-3xl font-bold">{modules.length}</p>
                    </div>
                    <LayoutGrid className="w-10 h-10 text-primary/20" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Enabled</p>
                      <p className="text-3xl font-bold text-himfed-success">{enabledCount}</p>
                    </div>
                    <CheckCircle2 className="w-10 h-10 text-himfed-success/20" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Core (Protected)</p>
                      <p className="text-3xl font-bold text-primary">{coreCount}</p>
                    </div>
                    <Settings className="w-10 h-10 text-primary/20" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Module Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {modules.map((module) => (
                <Card key={module.id} className={`transition-all ${!module.isEnabled && "opacity-60"}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${module.isEnabled ? "bg-primary/10" : "bg-muted"}`}>
                          <module.icon className={`w-5 h-5 ${module.isEnabled ? "text-primary" : "text-muted-foreground"}`} />
                        </div>
                        <div>
                          <CardTitle className="text-base flex items-center gap-2">
                            {module.name}
                            {module.isCore && (
                              <Badge variant="secondary" className="text-[10px]">Core</Badge>
                            )}
                          </CardTitle>
                          <p className="text-xs text-muted-foreground">{module.code}</p>
                        </div>
                      </div>
                      <Switch
                        checked={module.isEnabled}
                        onCheckedChange={() => handleToggle(module.id)}
                        disabled={module.isCore}
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="text-xs mb-4 line-clamp-2">
                      {module.description}
                    </CardDescription>
                    
                    <div className="flex flex-wrap gap-1 mb-4">
                      {module.permissions.slice(0, 3).map((perm) => (
                        <Badge key={perm} variant="outline" className="text-[10px]">
                          {perm}
                        </Badge>
                      ))}
                      {module.permissions.length > 3 && (
                        <Badge variant="outline" className="text-[10px]">
                          +{module.permissions.length - 3}
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground border-t pt-3">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {module.lastModified}
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => handleView(module)}>
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => handleEdit(module)}>
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* View Module Modal */}
            <FormModal
              open={isViewOpen}
              onOpenChange={setIsViewOpen}
              title="Module Details"
              onSubmit={(e) => { e.preventDefault(); setIsViewOpen(false); }}
              submitLabel="Close"
              size="lg"
            >
              {selectedModule && (
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="p-4 rounded-xl bg-primary/10">
                      <selectedModule.icon className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold flex items-center gap-2">
                        {selectedModule.name}
                        {selectedModule.isCore && <Badge>Core Module</Badge>}
                      </h3>
                      <p className="text-muted-foreground">Code: {selectedModule.code}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Description</h4>
                    <p className="text-muted-foreground">{selectedModule.description}</p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Permissions</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedModule.permissions.map((perm) => (
                        <Badge key={perm} variant="secondary">{perm}</Badge>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <div className="flex items-center gap-2 mt-1">
                        {selectedModule.isEnabled ? (
                          <><CheckCircle2 className="w-4 h-4 text-himfed-success" /><span className="text-himfed-success font-medium">Enabled</span></>
                        ) : (
                          <><XCircle className="w-4 h-4 text-muted-foreground" /><span className="text-muted-foreground font-medium">Disabled</span></>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Last Modified</p>
                      <p className="mt-1">{selectedModule.lastModified} by {selectedModule.modifiedBy}</p>
                    </div>
                  </div>
                </div>
              )}
            </FormModal>

            {/* Edit Module Modal */}
            <FormModal
              open={isEditOpen}
              onOpenChange={setIsEditOpen}
              title="Edit Module Settings"
              onSubmit={handleSubmitEdit}
              size="md"
            >
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Module Name</Label>
                  <Input
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    rows={3}
                  />
                </div>
              </div>
            </FormModal>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ModuleControl;
