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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit, Trash2, Eye, MapPin, Building2, Filter, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Godown {
  id: string;
  godownCode: string;
  godownName: string;
  godownType: "central" | "regional" | "district" | "depot";
  areaOffice: string;
  address: string;
  district: string;
  state: string;
  pincode: string;
  managerName: string;
  contactNumber: string;
  email: string;
  capacityMT: number;
  currentUtilization: number;
  gpsLatitude: string;
  gpsLongitude: string;
  establishedDate: string;
  status: "active" | "inactive" | "maintenance";
  remarks: string;
}

const initialGodowns: Godown[] = [
  {
    id: "1",
    godownCode: "GDN-SML-001",
    godownName: "Shimla Central Warehouse",
    godownType: "central",
    areaOffice: "Shimla",
    address: "Near Bus Stand, Shimla",
    district: "Shimla",
    state: "Himachal Pradesh",
    pincode: "171001",
    managerName: "Rajesh Kumar",
    contactNumber: "9876543210",
    email: "shimla.central@himfed.hp.gov.in",
    capacityMT: 5000,
    currentUtilization: 3200,
    gpsLatitude: "31.1048",
    gpsLongitude: "77.1734",
    establishedDate: "2015-04-01",
    status: "active",
    remarks: "Main distribution center for Shimla district",
  },
  {
    id: "2",
    godownCode: "GDN-KLU-001",
    godownName: "Kullu Regional Depot",
    godownType: "regional",
    areaOffice: "Kullu",
    address: "Industrial Area, Kullu",
    district: "Kullu",
    state: "Himachal Pradesh",
    pincode: "175101",
    managerName: "Vikram Singh",
    contactNumber: "9876543211",
    email: "kullu.regional@himfed.hp.gov.in",
    capacityMT: 3000,
    currentUtilization: 2100,
    gpsLatitude: "31.9579",
    gpsLongitude: "77.1095",
    establishedDate: "2017-08-15",
    status: "active",
    remarks: "Apple procurement center",
  },
  {
    id: "3",
    godownCode: "GDN-MND-001",
    godownName: "Mandi District Warehouse",
    godownType: "district",
    areaOffice: "Mandi",
    address: "Paddal Ground, Mandi",
    district: "Mandi",
    state: "Himachal Pradesh",
    pincode: "175001",
    managerName: "Priya Sharma",
    contactNumber: "9876543212",
    email: "mandi.district@himfed.hp.gov.in",
    capacityMT: 2500,
    currentUtilization: 1800,
    gpsLatitude: "31.7088",
    gpsLongitude: "76.9320",
    establishedDate: "2016-03-20",
    status: "active",
    remarks: "Fertilizer distribution hub",
  },
  {
    id: "4",
    godownCode: "GDN-UNA-001",
    godownName: "Una Depot",
    godownType: "depot",
    areaOffice: "Una",
    address: "Amb Road, Una",
    district: "Una",
    state: "Himachal Pradesh",
    pincode: "174303",
    managerName: "Amit Verma",
    contactNumber: "9876543213",
    email: "una.depot@himfed.hp.gov.in",
    capacityMT: 1500,
    currentUtilization: 1450,
    gpsLatitude: "31.4685",
    gpsLongitude: "76.2708",
    establishedDate: "2018-11-10",
    status: "maintenance",
    remarks: "Under renovation - expected completion March 2026",
  },
  {
    id: "5",
    godownCode: "GDN-KGR-001",
    godownName: "Kangra Central Store",
    godownType: "central",
    areaOffice: "Kangra",
    address: "Dharamshala Road, Kangra",
    district: "Kangra",
    state: "Himachal Pradesh",
    pincode: "176001",
    managerName: "Sunita Devi",
    contactNumber: "9876543214",
    email: "kangra.central@himfed.hp.gov.in",
    capacityMT: 4000,
    currentUtilization: 2800,
    gpsLatitude: "32.0998",
    gpsLongitude: "76.2691",
    establishedDate: "2014-07-01",
    status: "active",
    remarks: "Largest facility in Kangra region",
  },
];

const areaOffices = ["Shimla", "Kullu", "Mandi", "Una", "Kangra", "Solan", "Hamirpur", "Bilaspur", "Chamba", "Kinnaur", "Lahaul-Spiti", "Sirmaur"];
const districts = ["Shimla", "Kullu", "Mandi", "Una", "Kangra", "Solan", "Hamirpur", "Bilaspur", "Chamba", "Kinnaur", "Lahaul-Spiti", "Sirmaur"];

const GodownMaster = () => {
  const [godowns, setGodowns] = useState<Godown[]>(initialGodowns);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedGodown, setSelectedGodown] = useState<Godown | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    godownType: "",
    areaOffice: "",
    status: "",
    district: "",
  });
  const { toast } = useToast();

  const [formData, setFormData] = useState<Partial<Godown>>({
    godownCode: "",
    godownName: "",
    godownType: "depot",
    areaOffice: "",
    address: "",
    district: "",
    state: "Himachal Pradesh",
    pincode: "",
    managerName: "",
    contactNumber: "",
    email: "",
    capacityMT: 0,
    currentUtilization: 0,
    gpsLatitude: "",
    gpsLongitude: "",
    establishedDate: "",
    status: "active",
    remarks: "",
  });

  const filteredGodowns = godowns.filter((godown) => {
    if (filters.godownType && godown.godownType !== filters.godownType) return false;
    if (filters.areaOffice && godown.areaOffice !== filters.areaOffice) return false;
    if (filters.status && godown.status !== filters.status) return false;
    if (filters.district && godown.district !== filters.district) return false;
    return true;
  });

  const resetForm = () => {
    setFormData({
      godownCode: "",
      godownName: "",
      godownType: "depot",
      areaOffice: "",
      address: "",
      district: "",
      state: "Himachal Pradesh",
      pincode: "",
      managerName: "",
      contactNumber: "",
      email: "",
      capacityMT: 0,
      currentUtilization: 0,
      gpsLatitude: "",
      gpsLongitude: "",
      establishedDate: "",
      status: "active",
      remarks: "",
    });
    setIsEditing(false);
    setSelectedGodown(null);
  };

  const handleAdd = () => {
    resetForm();
    setIsFormOpen(true);
  };

  const handleEdit = (godown: Godown) => {
    setFormData(godown);
    setSelectedGodown(godown);
    setIsEditing(true);
    setIsFormOpen(true);
  };

  const handleView = (godown: Godown) => {
    setSelectedGodown(godown);
    setIsViewOpen(true);
  };

  const handleDelete = (godown: Godown) => {
    setSelectedGodown(godown);
    setIsDeleteOpen(true);
  };

  const handleSubmit = () => {
    if (isEditing && selectedGodown) {
      setGodowns(godowns.map((g) => 
        g.id === selectedGodown.id ? { ...g, ...formData } : g
      ));
      toast({
        title: "Godown Updated",
        description: `${formData.godownName} has been updated successfully.`,
      });
    } else {
      const newGodown: Godown = {
        ...formData as Godown,
        id: Date.now().toString(),
      };
      setGodowns([...godowns, newGodown]);
      toast({
        title: "Godown Added",
        description: `${formData.godownName} has been added successfully.`,
      });
    }
    setIsFormOpen(false);
    resetForm();
  };

  const confirmDelete = () => {
    if (selectedGodown) {
      setGodowns(godowns.filter((g) => g.id !== selectedGodown.id));
      toast({
        title: "Godown Deleted",
        description: `${selectedGodown.godownName} has been deleted.`,
        variant: "destructive",
      });
    }
    setIsDeleteOpen(false);
    setSelectedGodown(null);
  };

  const clearFilters = () => {
    setFilters({
      godownType: "",
      areaOffice: "",
      status: "",
      district: "",
    });
  };

  const getUtilizationColor = (utilization: number, capacity: number) => {
    const percentage = (utilization / capacity) * 100;
    if (percentage >= 90) return "text-destructive";
    if (percentage >= 70) return "text-warning";
    return "text-success";
  };

  const getGodownTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      central: "Central Warehouse",
      regional: "Regional Depot",
      district: "District Warehouse",
      depot: "Depot",
    };
    return labels[type] || type;
  };

  const columns: Column<Godown>[] = [
    { key: "godownCode", label: "Code", sortable: true },
    { key: "godownName", label: "Godown Name", sortable: true },
    { 
      key: "godownType", 
      label: "Type",
      render: (godown) => (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
          {getGodownTypeLabel(godown.godownType)}
        </span>
      ),
    },
    { key: "areaOffice", label: "Area Office", sortable: true },
    { key: "district", label: "District", sortable: true },
    { key: "managerName", label: "Manager" },
    { 
      key: "capacityMT", 
      label: "Capacity/Utilization",
      render: (godown) => (
        <div className="text-sm">
          <span className={getUtilizationColor(godown.currentUtilization, godown.capacityMT)}>
            {godown.currentUtilization.toLocaleString()}
          </span>
          <span className="text-muted-foreground"> / {godown.capacityMT.toLocaleString()} MT</span>
          <div className="w-full bg-muted rounded-full h-1.5 mt-1">
            <div 
              className={`h-1.5 rounded-full ${
                (godown.currentUtilization / godown.capacityMT) * 100 >= 90 
                  ? 'bg-destructive' 
                  : (godown.currentUtilization / godown.capacityMT) * 100 >= 70 
                    ? 'bg-warning' 
                    : 'bg-success'
              }`}
              style={{ width: `${Math.min((godown.currentUtilization / godown.capacityMT) * 100, 100)}%` }}
            />
          </div>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (godown) => <StatusBadge status={godown.status} />,
    },
  ];

  const hasActiveFilters = Object.values(filters).some(v => v !== "");

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <TopBar />
        
        <main className="flex-1 p-6">
          <PageHeader
            title="Godown & Location Master"
            description="Manage warehouses, depots, and storage locations across Himachal Pradesh"
            icon={Building2}
          />

          {/* Advanced Filters */}
          <div className="mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="mb-2"
            >
              <Filter className="h-4 w-4 mr-2" />
              Advanced Filters
              {hasActiveFilters && (
                <span className="ml-2 px-1.5 py-0.5 text-xs bg-primary text-primary-foreground rounded-full">
                  {Object.values(filters).filter(v => v !== "").length}
                </span>
              )}
            </Button>

            {showFilters && (
              <div className="p-4 border rounded-lg bg-card space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label>Godown Type</Label>
                    <Select value={filters.godownType} onValueChange={(v) => setFilters({ ...filters, godownType: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="central">Central Warehouse</SelectItem>
                        <SelectItem value="regional">Regional Depot</SelectItem>
                        <SelectItem value="district">District Warehouse</SelectItem>
                        <SelectItem value="depot">Depot</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Area Office</Label>
                    <Select value={filters.areaOffice} onValueChange={(v) => setFilters({ ...filters, areaOffice: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Offices" />
                      </SelectTrigger>
                      <SelectContent>
                        {areaOffices.map((office) => (
                          <SelectItem key={office} value={office}>{office}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>District</Label>
                    <Select value={filters.district} onValueChange={(v) => setFilters({ ...filters, district: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Districts" />
                      </SelectTrigger>
                      <SelectContent>
                        {districts.map((district) => (
                          <SelectItem key={district} value={district}>{district}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select value={filters.status} onValueChange={(v) => setFilters({ ...filters, status: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="maintenance">Under Maintenance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {hasActiveFilters && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    <X className="h-4 w-4 mr-2" />
                    Clear Filters
                  </Button>
                )}
              </div>
            )}
          </div>

          <DataTable
            data={filteredGodowns}
            columns={columns}
            searchPlaceholder="Search godowns..."
            searchKey="godownName"
            onAdd={handleAdd}
            addLabel="Add Godown"
            actions={(godown) => (
              <div className="flex gap-2 justify-end">
                <Button variant="ghost" size="sm" onClick={() => handleView(godown)}>
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleEdit(godown)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(godown)} className="text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          />
        </main>
      </div>

      {/* Add/Edit Form Modal */}
      <FormModal
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        title={isEditing ? "Edit Godown" : "Add New Godown"}
        onSubmit={handleSubmit}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="godownCode">Godown Code *</Label>
            <Input
              id="godownCode"
              value={formData.godownCode}
              onChange={(e) => setFormData({ ...formData, godownCode: e.target.value })}
              placeholder="GDN-XXX-001"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="godownName">Godown Name *</Label>
            <Input
              id="godownName"
              value={formData.godownName}
              onChange={(e) => setFormData({ ...formData, godownName: e.target.value })}
              placeholder="Enter godown name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="godownType">Godown Type *</Label>
            <Select value={formData.godownType} onValueChange={(v: Godown["godownType"]) => setFormData({ ...formData, godownType: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="central">Central Warehouse</SelectItem>
                <SelectItem value="regional">Regional Depot</SelectItem>
                <SelectItem value="district">District Warehouse</SelectItem>
                <SelectItem value="depot">Depot</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="areaOffice">Area Office *</Label>
            <Select value={formData.areaOffice} onValueChange={(v) => setFormData({ ...formData, areaOffice: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Select area office" />
              </SelectTrigger>
              <SelectContent>
                {areaOffices.map((office) => (
                  <SelectItem key={office} value={office}>{office}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="address">Address *</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Full address"
              rows={2}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="district">District *</Label>
            <Select value={formData.district} onValueChange={(v) => setFormData({ ...formData, district: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Select district" />
              </SelectTrigger>
              <SelectContent>
                {districts.map((district) => (
                  <SelectItem key={district} value={district}>{district}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="pincode">Pincode *</Label>
            <Input
              id="pincode"
              value={formData.pincode}
              onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
              placeholder="6-digit pincode"
              maxLength={6}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="managerName">Manager Name *</Label>
            <Input
              id="managerName"
              value={formData.managerName}
              onChange={(e) => setFormData({ ...formData, managerName: e.target.value })}
              placeholder="Manager full name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contactNumber">Contact Number *</Label>
            <Input
              id="contactNumber"
              value={formData.contactNumber}
              onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
              placeholder="10-digit mobile"
              maxLength={10}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="godown@himfed.hp.gov.in"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="establishedDate">Established Date</Label>
            <Input
              id="establishedDate"
              type="date"
              value={formData.establishedDate}
              onChange={(e) => setFormData({ ...formData, establishedDate: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="capacityMT">Capacity (MT) *</Label>
            <Input
              id="capacityMT"
              type="number"
              value={formData.capacityMT}
              onChange={(e) => setFormData({ ...formData, capacityMT: Number(e.target.value) })}
              placeholder="Storage capacity in MT"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="currentUtilization">Current Utilization (MT)</Label>
            <Input
              id="currentUtilization"
              type="number"
              value={formData.currentUtilization}
              onChange={(e) => setFormData({ ...formData, currentUtilization: Number(e.target.value) })}
              placeholder="Current stock in MT"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gpsLatitude">GPS Latitude</Label>
            <Input
              id="gpsLatitude"
              value={formData.gpsLatitude}
              onChange={(e) => setFormData({ ...formData, gpsLatitude: e.target.value })}
              placeholder="e.g., 31.1048"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gpsLongitude">GPS Longitude</Label>
            <Input
              id="gpsLongitude"
              value={formData.gpsLongitude}
              onChange={(e) => setFormData({ ...formData, gpsLongitude: e.target.value })}
              placeholder="e.g., 77.1734"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status *</Label>
            <Select value={formData.status} onValueChange={(v: Godown["status"]) => setFormData({ ...formData, status: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="maintenance">Under Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="remarks">Remarks</Label>
            <Textarea
              id="remarks"
              value={formData.remarks}
              onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
              placeholder="Additional notes"
              rows={2}
            />
          </div>
        </div>
      </FormModal>

      {/* View Modal */}
      <FormModal
        open={isViewOpen}
        onOpenChange={setIsViewOpen}
        title="Godown Details"
        showFooter={false}
      >
        {selectedGodown && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-lg">
              <div className="p-3 bg-primary/10 rounded-full">
                <Building2 className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">{selectedGodown.godownName}</h3>
                <p className="text-muted-foreground">{selectedGodown.godownCode}</p>
              </div>
              <div className="ml-auto">
                <StatusBadge status={selectedGodown.status} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground">Godown Type</Label>
                <p className="font-medium">{getGodownTypeLabel(selectedGodown.godownType)}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Area Office</Label>
                <p className="font-medium">{selectedGodown.areaOffice}</p>
              </div>
              <div className="col-span-2">
                <Label className="text-muted-foreground">Address</Label>
                <p className="font-medium">{selectedGodown.address}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">District</Label>
                <p className="font-medium">{selectedGodown.district}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Pincode</Label>
                <p className="font-medium">{selectedGodown.pincode}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Manager</Label>
                <p className="font-medium">{selectedGodown.managerName}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Contact</Label>
                <p className="font-medium">{selectedGodown.contactNumber}</p>
              </div>
              <div className="col-span-2">
                <Label className="text-muted-foreground">Email</Label>
                <p className="font-medium">{selectedGodown.email || "N/A"}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Capacity</Label>
                <p className="font-medium">{selectedGodown.capacityMT.toLocaleString()} MT</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Current Utilization</Label>
                <p className={`font-medium ${getUtilizationColor(selectedGodown.currentUtilization, selectedGodown.capacityMT)}`}>
                  {selectedGodown.currentUtilization.toLocaleString()} MT ({((selectedGodown.currentUtilization / selectedGodown.capacityMT) * 100).toFixed(1)}%)
                </p>
              </div>
              {selectedGodown.gpsLatitude && selectedGodown.gpsLongitude && (
                <div className="col-span-2">
                  <Label className="text-muted-foreground">GPS Coordinates</Label>
                  <p className="font-medium flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {selectedGodown.gpsLatitude}, {selectedGodown.gpsLongitude}
                  </p>
                </div>
              )}
              <div>
                <Label className="text-muted-foreground">Established Date</Label>
                <p className="font-medium">{selectedGodown.establishedDate || "N/A"}</p>
              </div>
              {selectedGodown.remarks && (
                <div className="col-span-2">
                  <Label className="text-muted-foreground">Remarks</Label>
                  <p className="font-medium">{selectedGodown.remarks}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </FormModal>

      {/* Delete Confirmation */}
      <DeleteConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onConfirm={confirmDelete}
        itemName={selectedGodown?.godownName}
      />
    </div>
  );
};

export default GodownMaster;
