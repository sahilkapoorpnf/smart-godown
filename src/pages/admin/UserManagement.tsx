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
import { Users, Edit, Trash2, Eye, Shield, Mail, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// User types from the HIMFED system
const userRoles = [
  { code: "SA", label: "Super Admin" },
  { code: "HQ", label: "HQ Admin" },
  { code: "AO", label: "Area Office Manager" },
  { code: "WM", label: "Warehouse Manager" },
  { code: "WS", label: "Warehouse Staff" },
  { code: "PM", label: "Procurement Manager" },
  { code: "DO", label: "Distribution Officer" },
  { code: "FM", label: "Fuel Manager" },
  { code: "AU", label: "Auditor" },
  { code: "FA", label: "Finance Officer" },
];

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  roleCode: string;
  location: string;
  status: "active" | "inactive";
  createdAt: string;
  lastLogin: string;
}

// Mock data
const mockUsers: User[] = [
  { id: "1", name: "Rajesh Kumar", email: "rajesh.kumar@himfed.com", phone: "+91 98765 43210", role: "Super Admin", roleCode: "SA", location: "HQ Shimla", status: "active", createdAt: "2024-01-15", lastLogin: "2024-01-14 10:30 AM" },
  { id: "2", name: "Priya Sharma", email: "priya.sharma@himfed.com", phone: "+91 87654 32109", role: "HQ Admin", roleCode: "HQ", location: "HQ Shimla", status: "active", createdAt: "2024-01-10", lastLogin: "2024-01-14 09:15 AM" },
  { id: "3", name: "Amit Verma", email: "amit.verma@himfed.com", phone: "+91 76543 21098", role: "Area Office Manager", roleCode: "AO", location: "Kullu Area", status: "active", createdAt: "2024-01-08", lastLogin: "2024-01-13 04:45 PM" },
  { id: "4", name: "Sunita Devi", email: "sunita.devi@himfed.com", phone: "+91 65432 10987", role: "Warehouse Manager", roleCode: "WM", location: "Mandi Godown", status: "active", createdAt: "2024-01-05", lastLogin: "2024-01-14 08:00 AM" },
  { id: "5", name: "Vikram Singh", email: "vikram.singh@himfed.com", phone: "+91 54321 09876", role: "Warehouse Staff", roleCode: "WS", location: "Mandi Godown", status: "inactive", createdAt: "2023-12-20", lastLogin: "2024-01-10 11:30 AM" },
  { id: "6", name: "Meena Thakur", email: "meena.thakur@himfed.com", phone: "+91 43210 98765", role: "Procurement Manager", roleCode: "PM", location: "HQ Shimla", status: "active", createdAt: "2024-01-02", lastLogin: "2024-01-14 11:00 AM" },
  { id: "7", name: "Ravi Kapoor", email: "ravi.kapoor@himfed.com", phone: "+91 32109 87654", role: "Distribution Officer", roleCode: "DO", location: "Kangra Area", status: "active", createdAt: "2023-12-15", lastLogin: "2024-01-13 02:30 PM" },
  { id: "8", name: "Anita Rana", email: "anita.rana@himfed.com", phone: "+91 21098 76543", role: "Fuel Manager", roleCode: "FM", location: "HQ Shimla", status: "active", createdAt: "2023-11-28", lastLogin: "2024-01-14 09:45 AM" },
  { id: "9", name: "Suresh Negi", email: "suresh.negi@himfed.com", phone: "+91 10987 65432", role: "Auditor", roleCode: "AU", location: "External", status: "active", createdAt: "2023-11-15", lastLogin: "2024-01-12 03:00 PM" },
  { id: "10", name: "Kavita Bhatt", email: "kavita.bhatt@himfed.com", phone: "+91 09876 54321", role: "Finance Officer", roleCode: "FA", location: "HQ Shimla", status: "active", createdAt: "2023-10-20", lastLogin: "2024-01-14 10:15 AM" },
];

const UserManagement = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    roleCode: "",
    location: "",
    status: "active" as "active" | "inactive",
  });

  const columns: Column<User>[] = [
    {
      key: "name",
      label: "Name",
      sortable: true,
      render: (user) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-sm font-semibold text-primary">
              {user.name.split(" ").map(n => n[0]).join("")}
            </span>
          </div>
          <div>
            <p className="font-medium text-foreground">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      label: "Role",
      sortable: true,
      render: (user) => (
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-primary" />
          <div>
            <p className="font-medium">{user.role}</p>
            <p className="text-xs text-muted-foreground">{user.roleCode}</p>
          </div>
        </div>
      ),
    },
    { key: "location", label: "Location", sortable: true },
    { key: "phone", label: "Phone" },
    {
      key: "status",
      label: "Status",
      render: (user) => <StatusBadge status={user.status} />,
    },
    { key: "lastLogin", label: "Last Login" },
  ];

  const handleAdd = () => {
    setSelectedUser(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      roleCode: "",
      location: "",
      status: "active",
    });
    setIsFormOpen(true);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      roleCode: user.roleCode,
      location: user.location,
      status: user.status,
    });
    setIsFormOpen(true);
  };

  const handleView = (user: User) => {
    setSelectedUser(user);
    setIsViewOpen(true);
  };

  const handleDelete = (user: User) => {
    setSelectedUser(user);
    setIsDeleteOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const role = userRoles.find(r => r.code === formData.roleCode);
    
    if (selectedUser) {
      setUsers(users.map(u => 
        u.id === selectedUser.id 
          ? { ...u, ...formData, role: role?.label || "" }
          : u
      ));
      toast({ title: "User updated successfully" });
    } else {
      const newUser: User = {
        id: String(Date.now()),
        ...formData,
        role: role?.label || "",
        createdAt: new Date().toISOString().split("T")[0],
        lastLogin: "Never",
      };
      setUsers([...users, newUser]);
      toast({ title: "User created successfully" });
    }
    setIsFormOpen(false);
  };

  const confirmDelete = () => {
    if (selectedUser) {
      setUsers(users.filter(u => u.id !== selectedUser.id));
      toast({ title: "User deleted successfully", variant: "destructive" });
    }
    setIsDeleteOpen(false);
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <PageHeader
              title="User Management"
              description="Create and manage system users and their role assignments"
              icon={Users}
            />

            <DataTable
              data={users}
              columns={columns}
              searchPlaceholder="Search users by name..."
              searchKey="name"
              onAdd={handleAdd}
              addLabel="Add User"
              actions={(user) => (
                <div className="flex items-center gap-1 justify-end">
                  <Button variant="ghost" size="sm" onClick={() => handleView(user)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(user)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(user)} className="text-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            />

            {/* Add/Edit Form Modal */}
            <FormModal
              open={isFormOpen}
              onOpenChange={setIsFormOpen}
              title={selectedUser ? "Edit User" : "Create New User"}
              description={selectedUser ? "Update user details and role assignment" : "Add a new user to the system"}
              onSubmit={handleSubmit}
              submitLabel={selectedUser ? "Update User" : "Create User"}
              size="lg"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter full name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@himfed.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 XXXXX XXXXX"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">User Role *</Label>
                  <Select
                    value={formData.roleCode}
                    onValueChange={(value) => setFormData({ ...formData, roleCode: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {userRoles.map((role) => (
                        <SelectItem key={role.code} value={role.code}>
                          {role.label} ({role.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g., HQ Shimla, Mandi Godown"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: "active" | "inactive") => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {!selectedUser && (
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong>Note:</strong> A temporary password will be generated and sent to the user's email. They will be required to change it on first login.
                  </p>
                </div>
              )}
            </FormModal>

            {/* View User Dialog */}
            <FormModal
              open={isViewOpen}
              onOpenChange={setIsViewOpen}
              title="User Details"
              onSubmit={(e) => { e.preventDefault(); setIsViewOpen(false); }}
              submitLabel="Close"
              size="lg"
            >
              {selectedUser && (
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-2xl font-bold text-primary">
                        {selectedUser.name.split(" ").map(n => n[0]).join("")}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{selectedUser.name}</h3>
                      <p className="text-muted-foreground">{selectedUser.role}</p>
                      <StatusBadge status={selectedUser.status} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="flex items-center gap-2"><Mail className="w-4 h-4" />{selectedUser.email}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="flex items-center gap-2"><Phone className="w-4 h-4" />{selectedUser.phone}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Location</p>
                      <p>{selectedUser.location}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Role Code</p>
                      <p>{selectedUser.roleCode}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Created At</p>
                      <p>{selectedUser.createdAt}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Last Login</p>
                      <p>{selectedUser.lastLogin}</p>
                    </div>
                  </div>
                </div>
              )}
            </FormModal>

            {/* Delete Confirmation */}
            <DeleteConfirmDialog
              open={isDeleteOpen}
              onOpenChange={setIsDeleteOpen}
              onConfirm={confirmDelete}
              itemName={selectedUser?.name}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserManagement;
