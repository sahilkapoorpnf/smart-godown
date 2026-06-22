// HIMFED Tally-based ERP — new role types & entities (additive, no breaking changes)

export type ErpRole =
  | "wh_user"            // HIMFED Warehouse User
  | "area_officer"       // HIMFED Area Officer
  | "wh_accountant"      // HIMFED Warehouse Accountant (Tally dashboard)
  | "admin_accountant";  // HIMFED Admin Accountant (Super Accountant)

export const ERP_ROLE_LABEL: Record<ErpRole, string> = {
  wh_user: "Warehouse User",
  area_officer: "Area Officer",
  wh_accountant: "Warehouse Accountant",
  admin_accountant: "Admin Accountant",
};

export interface AreaCompany {
  id: string;
  name: string;
  code: string;
  areaId: string;          // links to existing warehouse area
  address: string;
  district: string;
  state: string;
  pin: string;
  phone: string;
  email: string;
  gstType: "Regular" | "Composition" | "Unregistered";
  gstNumber: string;
  pan: string;
  gstEffectiveDate: string;
  fyStart: string;
  fyEnd: string;
  booksFrom: string;
  currency: string;
  maintainAccounts: boolean;
  maintainInventory: boolean;
  status: "active" | "inactive";
  assignedAccountants?: string[]; // user ids
  createdAt: string;
}

export type GoodsStatus = "pending" | "approved" | "re_edit";

export interface GoodsArrival {
  id: string;
  entryId: string;
  depotDate: string;
  grNumber: string;
  truckNumber: string;
  companyName: string;
  productName: string;
  supplierName: string;
  quantity: number;
  unit: "Bags" | "Quintal" | "Kg" | "Ton" | "Liter";
  rate: number;
  driverName: string;
  driverMobile: string;
  invoiceNumber: string;
  invoiceFile?: string;
  remarks: string;
  warehouseId: string;
  areaId: string;
  createdBy: string;
  createdAt: string;
  status: GoodsStatus;
  approvedBy?: string;
  approvedAt?: string;
  correctionRemarks?: string;
}

export interface AccountGroup {
  id: string;
  name: string;
  nature: "Assets" | "Liabilities" | "Income" | "Expenses";
  under: string;
}

export interface Ledger {
  id: string;
  name: string;
  groupId: string;
  openingBalance: number;
  type: "Dr" | "Cr";
  gstin?: string;
  contact?: string;
}

export interface VoucherType {
  id: string;
  name: string;
  prefix: string;
  category: "Purchase" | "Sales" | "Payment" | "Receipt" | "Journal" | "Contra" | "Stock";
  numbering: "Automatic" | "Manual";
}

export interface StockGroup { id: string; name: string; under: string; }
export interface StockUnit { id: string; code: string; name: string; decimals: number; }

export interface StockItem {
  id: string;
  name: string;
  groupId: string;
  unitId: string;
  hsn: string;
  gstRate: number;
  openingQty: number;
  openingValue: number;
  ratePerUnit: number;
}

export interface Godown {
  id: string;
  name: string;
  areaId: string;
  address: string;
  capacity: number;
  inchargeName: string;
}

export type VoucherKind = "purchase" | "sales" | "payment" | "receipt" | "journal" | "contra" | "stock_transfer";

export interface VoucherLine {
  itemId?: string;
  ledgerId?: string;
  qty?: number;
  rate?: number;
  amount: number;
  gstRate?: number;
  gstAmount?: number;
  godownFromId?: string;
  godownToId?: string;
}

export interface Voucher {
  id: string;
  voucherNo: string;
  kind: VoucherKind;
  date: string;
  partyLedgerId?: string;     // supplier / customer / bank / cash
  narration: string;
  lines: VoucherLine[];
  total: number;
  gstTotal: number;
  grandTotal: number;
  invoiceNumber?: string;
  attachment?: string;
  createdBy: string;
  createdAt: string;
  linkedArrivalId?: string;    // for auto-drafted purchase from approved arrival
}

export interface AuditEntry {
  id: string;
  user: string;
  role: ErpRole | string;
  action: string;
  target: string;
  before?: string;
  after?: string;
  at: string;
  ip: string;
}

export interface DocFile {
  id: string;
  name: string;
  type: "GR Copy" | "Challan" | "Purchase Invoice" | "Sales Bill" | "Payment Proof";
  refNo: string;
  sizeKb: number;
  uploadedBy: string;
  uploadedAt: string;
  godownId?: string;
}
