export type Role =
  | "superadmin"
  | "incharge"
  | "accountant"
  | "joa_it"
  | "warehouse_staff"
  // ===== HIMFED Tally ERP roles (additive) =====
  | "wh_user"
  | "area_officer"
  | "wh_accountant"
  | "admin_accountant";

export const ROLE_LABEL: Record<Role, string> = {
  superadmin: "Superadmin",
  incharge: "Incharge (Area Officer)",
  accountant: "Accountant",
  joa_it: "JOA IT",
  warehouse_staff: "Warehouse Staff",
  wh_user: "HIMFED Warehouse User",
  area_officer: "HIMFED Area Officer",
  wh_accountant: "HIMFED Warehouse Accountant",
  admin_accountant: "HIMFED Admin Accountant",
};

export interface Area {
  id: string;
  code: string;
  name: string;
  officerName: string;
  officerUserId?: string;
  contact: string;
  status: "active" | "inactive";
  createdDate: string;
}

export interface Warehouse {
  id: string;
  code: string;
  name: string;
  areaId: string;
  address: string;
  capacity: number;
  inchargeName: string;
  contact: string;
  status: "active" | "inactive" | "maintenance";
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  username: string;
  password: string;
  role: Role;
  areaId?: string;
  warehouseId?: string;
  status: "active" | "inactive";
}

export type EntryStatus = "pending" | "approved" | "rejected" | "no_action";

export interface WarehouseEntry {
  id: string;
  entryCode: string;
  depotDate: string;
  grNumber: string;
  truckNumber: string;
  quantity: number;
  unit: "Bags" | "Quintal" | "Kg" | "Ton";
  company: string;
  productName: string;
  driverName: string;
  driverMobile: string;
  supplier: string;
  warehouseId: string;
  areaId: string;
  remarks: string;
  invoiceFile?: string;
  createdBy: string;
  createdAt: string;
  status: EntryStatus;
  approvedBy?: string;
  approvedAt?: string;
  reviewRemarks?: string;
}

export interface ActivityLog {
  id: string;
  user: string;
  role: Role;
  action: string;
  target?: string;
  ip: string;
  timestamp: string;
}
