export type Status = "Active" | "Inactive" | "Pending" | "Approved";

export type AreaCompanyStatic = {
  id: string;
  name: string;
  code: string;
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
  status: Status;
  createdDate: string;
};

export type MasterRow = Record<string, string | number | boolean> & { id: string; status?: Status };
export type VoucherKind = "purchase" | "sales" | "payment" | "receipt" | "journal" | "contra" | "stock_transfer";

export type VoucherRow = {
  id: string;
  voucherNo: string;
  kind: VoucherKind;
  date: string;
  party: string;
  ledger: string;
  invoiceNo: string;
  item: string;
  godown: string;
  qty: number;
  rate: number;
  gst: number;
  debit: number;
  credit: number;
  total: number;
  status: Status;
  narration: string;
};

export const areaCompaniesStatic: AreaCompanyStatic[] = [
  { id: "CO-UNA", name: "UNA Area", code: "UNA", address: "HIMFED Area Office, MC Road", district: "Una", state: "Himachal Pradesh", pin: "174303", phone: "+91 1975 223344", email: "una@himfed.in", gstType: "Regular", gstNumber: "02AAACH1234R1Z9", pan: "AAACH1234R", gstEffectiveDate: "2017-07-01", fyStart: "2026-04-01", fyEnd: "2027-03-31", booksFrom: "2026-04-01", currency: "INR", maintainAccounts: true, maintainInventory: true, status: "Active", createdDate: "2026-04-01" },
  { id: "CO-SHM", name: "SHIMLA Area", code: "SHM", address: "Sector 4, New Shimla", district: "Shimla", state: "Himachal Pradesh", pin: "171009", phone: "+91 177 2622345", email: "shimla@himfed.in", gstType: "Regular", gstNumber: "02AAACH5678X1Z3", pan: "AAACH5678X", gstEffectiveDate: "2017-07-01", fyStart: "2026-04-01", fyEnd: "2027-03-31", booksFrom: "2026-04-01", currency: "INR", maintainAccounts: true, maintainInventory: true, status: "Active", createdDate: "2026-04-01" },
  { id: "CO-SOL", name: "SOLAN Area", code: "SOL", address: "Old Bus Stand, Saproon", district: "Solan", state: "Himachal Pradesh", pin: "173212", phone: "+91 1792 223655", email: "solan@himfed.in", gstType: "Regular", gstNumber: "02AAACH9090S1Z1", pan: "AAACH9090S", gstEffectiveDate: "2017-07-01", fyStart: "2026-04-01", fyEnd: "2027-03-31", booksFrom: "2026-04-01", currency: "INR", maintainAccounts: true, maintainInventory: true, status: "Active", createdDate: "2026-04-02" },
  { id: "CO-MND", name: "MANDI Area", code: "MND", address: "Sundernagar Road", district: "Mandi", state: "Himachal Pradesh", pin: "175019", phone: "+91 1907 266102", email: "mandi@himfed.in", gstType: "Regular", gstNumber: "02AAACH3030M1ZA", pan: "AAACH3030M", gstEffectiveDate: "2017-07-01", fyStart: "2026-04-01", fyEnd: "2027-03-31", booksFrom: "2026-04-01", currency: "INR", maintainAccounts: true, maintainInventory: true, status: "Active", createdDate: "2026-04-02" },
  { id: "CO-KNG", name: "KANGRA Area", code: "KNG", address: "Dharamshala Road", district: "Kangra", state: "Himachal Pradesh", pin: "176001", phone: "+91 1892 223400", email: "kangra@himfed.in", gstType: "Regular", gstNumber: "02AAACH4040K1Z7", pan: "AAACH4040K", gstEffectiveDate: "2017-07-01", fyStart: "2026-04-01", fyEnd: "2027-03-31", booksFrom: "2026-04-01", currency: "INR", maintainAccounts: true, maintainInventory: true, status: "Active", createdDate: "2026-04-03" },
  { id: "CO-HMR", name: "HAMIRPUR Area", code: "HMR", address: "Bhota Chowk", district: "Hamirpur", state: "Himachal Pradesh", pin: "177001", phone: "+91 1972 224488", email: "hamirpur@himfed.in", gstType: "Regular", gstNumber: "02AAACH5050H1ZE", pan: "AAACH5050H", gstEffectiveDate: "2017-07-01", fyStart: "2026-04-01", fyEnd: "2027-03-31", booksFrom: "2026-04-01", currency: "INR", maintainAccounts: true, maintainInventory: true, status: "Active", createdDate: "2026-04-03" },
  { id: "CO-BLP", name: "BILASPUR Area", code: "BLP", address: "Near Bus Stand", district: "Bilaspur", state: "Himachal Pradesh", pin: "174001", phone: "+91 1978 222760", email: "bilaspur@himfed.in", gstType: "Regular", gstNumber: "02AAACH6060B1ZC", pan: "AAACH6060B", gstEffectiveDate: "2017-07-01", fyStart: "2026-04-01", fyEnd: "2027-03-31", booksFrom: "2026-04-01", currency: "INR", maintainAccounts: true, maintainInventory: true, status: "Active", createdDate: "2026-04-04" },
  { id: "CO-CHM", name: "CHAMBA Area", code: "CHM", address: "Sultanpur Depot Road", district: "Chamba", state: "Himachal Pradesh", pin: "176310", phone: "+91 1899 225170", email: "chamba@himfed.in", gstType: "Regular", gstNumber: "02AAACH7070C1ZB", pan: "AAACH7070C", gstEffectiveDate: "2017-07-01", fyStart: "2026-04-01", fyEnd: "2027-03-31", booksFrom: "2026-04-01", currency: "INR", maintainAccounts: true, maintainInventory: true, status: "Active", createdDate: "2026-04-04" },
  { id: "CO-KLU", name: "KULLU Area", code: "KLU", address: "Bhuntar Road", district: "Kullu", state: "Himachal Pradesh", pin: "175101", phone: "+91 1902 222410", email: "kullu@himfed.in", gstType: "Regular", gstNumber: "02AAACH8080K1ZF", pan: "AAACH8080K", gstEffectiveDate: "2017-07-01", fyStart: "2026-04-01", fyEnd: "2027-03-31", booksFrom: "2026-04-01", currency: "INR", maintainAccounts: true, maintainInventory: true, status: "Active", createdDate: "2026-04-05" },
  { id: "CO-SRM", name: "SIRMAUR Area", code: "SRM", address: "Nahan Industrial Area", district: "Sirmaur", state: "Himachal Pradesh", pin: "173001", phone: "+91 1702 222311", email: "sirmaur@himfed.in", gstType: "Composition", gstNumber: "02AAACH9091S1Z8", pan: "AAACH9091S", gstEffectiveDate: "2017-07-01", fyStart: "2026-04-01", fyEnd: "2027-03-31", booksFrom: "2026-04-01", currency: "INR", maintainAccounts: true, maintainInventory: true, status: "Inactive", createdDate: "2026-04-05" },
];

export const groupMasters: MasterRow[] = [
  { id: "GRP-001", name: "Assets", under: "Primary", nature: "Assets", status: "Active" },
  { id: "GRP-002", name: "Current Assets", under: "Assets", nature: "Assets", status: "Active" },
  { id: "GRP-003", name: "Fixed Assets", under: "Assets", nature: "Assets", status: "Active" },
  { id: "GRP-004", name: "Liabilities", under: "Primary", nature: "Liabilities", status: "Active" },
  { id: "GRP-005", name: "Current Liabilities", under: "Liabilities", nature: "Liabilities", status: "Active" },
  { id: "GRP-006", name: "Loans", under: "Liabilities", nature: "Liabilities", status: "Active" },
  { id: "GRP-007", name: "Income", under: "Primary", nature: "Income", status: "Active" },
  { id: "GRP-008", name: "Sales", under: "Income", nature: "Income", status: "Active" },
  { id: "GRP-009", name: "Purchase", under: "Expenses", nature: "Expenses", status: "Active" },
  { id: "GRP-010", name: "Indirect Expenses", under: "Expenses", nature: "Expenses", status: "Active" },
];

export const ledgerMasters: MasterRow[] = [
  { id: "LED-001", name: "Cash Account", under: "Cash-in-Hand", openingBalance: 250000, drCr: "Dr", gstApplicable: false, gstin: "", address: "UNA Area Cash Counter", contact: "+91 94180 30001", status: "Active" },
  { id: "LED-002", name: "HDFC Bank UNA", under: "Bank Accounts", openingBalance: 1850000, drCr: "Dr", gstApplicable: false, gstin: "", address: "Una Branch", contact: "+91 1975 220001", status: "Active" },
  { id: "LED-003", name: "Purchase Account", under: "Purchase", openingBalance: 0, drCr: "Dr", gstApplicable: true, gstin: "", address: "", contact: "", status: "Active" },
  { id: "LED-004", name: "Sales Account", under: "Sales", openingBalance: 0, drCr: "Cr", gstApplicable: true, gstin: "", address: "", contact: "", status: "Active" },
  { id: "LED-005", name: "NFL Panipat", under: "Sundry Creditors", openingBalance: 425000, drCr: "Cr", gstApplicable: true, gstin: "06AAACN0234N1Z2", address: "Panipat, Haryana", contact: "+91 98111 22001", status: "Active" },
  { id: "LED-006", name: "IFFCO Kandla", under: "Sundry Creditors", openingBalance: 312000, drCr: "Cr", gstApplicable: true, gstin: "24AAACI0123F1ZQ", address: "Kandla, Gujarat", contact: "+91 98222 22002", status: "Active" },
  { id: "LED-007", name: "Kisan Seva Kendra Amb", under: "Sundry Debtors", openingBalance: 45200, drCr: "Dr", gstApplicable: true, gstin: "02AABCK4444A1Z1", address: "Amb, Una", contact: "+91 98160 44332", status: "Active" },
  { id: "LED-008", name: "Lovely Seed Store UNA", under: "Sundry Debtors", openingBalance: 78500, drCr: "Dr", gstApplicable: true, gstin: "02AABCL9876Q1Z3", address: "Main Bazar Una", contact: "+91 98160 55566", status: "Active" },
  { id: "LED-009", name: "Transport & Freight", under: "Direct Expenses", openingBalance: 0, drCr: "Dr", gstApplicable: false, gstin: "", address: "", contact: "", status: "Active" },
  { id: "LED-010", name: "CGST Payable", under: "Duties & Taxes", openingBalance: 0, drCr: "Cr", gstApplicable: true, gstin: "", address: "", contact: "", status: "Active" },
];

export const voucherTypeMasters: MasterRow[] = [
  { id: "VT-001", name: "Purchase Voucher", prefix: "PUR/26-27/", category: "Purchase", numbering: "Automatic", status: "Active" },
  { id: "VT-002", name: "Sales Voucher", prefix: "SAL/26-27/", category: "Sales", numbering: "Automatic", status: "Active" },
  { id: "VT-003", name: "Payment Voucher", prefix: "PMT/26-27/", category: "Payment", numbering: "Automatic", status: "Active" },
  { id: "VT-004", name: "Receipt Voucher", prefix: "RCT/26-27/", category: "Receipt", numbering: "Automatic", status: "Active" },
  { id: "VT-005", name: "Journal Voucher", prefix: "JNL/26-27/", category: "Journal", numbering: "Automatic", status: "Active" },
  { id: "VT-006", name: "Contra Voucher", prefix: "CNT/26-27/", category: "Contra", numbering: "Automatic", status: "Active" },
  { id: "VT-007", name: "Stock Transfer Voucher", prefix: "STK/26-27/", category: "Stock", numbering: "Automatic", status: "Active" },
  { id: "VT-008", name: "Debit Note", prefix: "DBN/26-27/", category: "Adjustment", numbering: "Automatic", status: "Active" },
  { id: "VT-009", name: "Credit Note", prefix: "CRN/26-27/", category: "Adjustment", numbering: "Automatic", status: "Active" },
  { id: "VT-010", name: "Memorandum", prefix: "MEM/26-27/", category: "Memo", numbering: "Manual", status: "Inactive" },
];

export const stockGroupsStatic: MasterRow[] = [
  { id: "SG-001", name: "Agriculture Products", under: "Primary", status: "Active" },
  { id: "SG-002", name: "Wheat", under: "Agriculture Products", status: "Active" },
  { id: "SG-003", name: "Rice", under: "Agriculture Products", status: "Active" },
  { id: "SG-004", name: "Fertilizer", under: "Primary", status: "Active" },
  { id: "SG-005", name: "Urea", under: "Fertilizer", status: "Active" },
  { id: "SG-006", name: "DAP", under: "Fertilizer", status: "Active" },
  { id: "SG-007", name: "Consumer Products", under: "Primary", status: "Active" },
  { id: "SG-008", name: "Sugar", under: "Consumer Products", status: "Active" },
  { id: "SG-009", name: "Oil", under: "Consumer Products", status: "Active" },
  { id: "SG-010", name: "FUEL", under: "Primary", status: "Active" },
  { id: "SG-011", name: "Lubricants", under: "Primary", status: "Active" },
];

export const stockUnitsStatic: MasterRow[] = [
  { id: "UNT-001", code: "KG", name: "Kilogram", decimals: 3, status: "Active" },
  { id: "UNT-002", code: "QTL", name: "Quintal", decimals: 2, status: "Active" },
  { id: "UNT-003", code: "BAG", name: "Bag", decimals: 0, status: "Active" },
  { id: "UNT-004", code: "PCS", name: "Piece", decimals: 0, status: "Active" },
  { id: "UNT-005", code: "LTR", name: "Litre", decimals: 2, status: "Active" },
  { id: "UNT-006", code: "MT", name: "Metric Ton", decimals: 3, status: "Active" },
  { id: "UNT-007", code: "BOX", name: "Box", decimals: 0, status: "Active" },
  { id: "UNT-008", code: "DRM", name: "Drum", decimals: 0, status: "Active" },
  { id: "UNT-009", code: "PKT", name: "Packet", decimals: 0, status: "Active" },
  { id: "UNT-010", code: "CRT", name: "Crate", decimals: 0, status: "Active" },
];

export const godownMastersStatic: MasterRow[] = [
  { id: "GOD-001", name: "UNA Warehouse", code: "UNA-WH", area: "UNA Area", address: "MC Road, Una", officer: "Bhuvnesh Sood", user: "Anil Chauhan", capacity: 6500, utilization: 76, status: "Active" },
  { id: "GOD-002", name: "AMB Warehouse", code: "AMB-WH", area: "UNA Area", address: "Amb, Una", officer: "Bhuvnesh Sood", user: "Pooja Devi", capacity: 4200, utilization: 93, status: "Active" },
  { id: "GOD-003", name: "HAROLI Warehouse", code: "HAR-WH", area: "UNA Area", address: "Haroli, Una", officer: "Bhuvnesh Sood", user: "Rohit Kashyap", capacity: 3800, utilization: 68, status: "Active" },
  { id: "GOD-004", name: "BANGANA Warehouse", code: "BAN-WH", area: "UNA Area", address: "Bangana, Una", officer: "Bhuvnesh Sood", user: "Meena Rana", capacity: 2400, utilization: 58, status: "Active" },
  { id: "GOD-005", name: "Shimla Central Godown", code: "SHM-WH", area: "SHIMLA Area", address: "Sector 4, Shimla", officer: "Rajeev Bansal", user: "Manoj Kumar", capacity: 5000, utilization: 81, status: "Active" },
  { id: "GOD-006", name: "Theog Depot", code: "THE-WH", area: "SHIMLA Area", address: "Theog, Shimla", officer: "Rajeev Bansal", user: "Suresh Negi", capacity: 2500, utilization: 64, status: "Active" },
  { id: "GOD-007", name: "Solan Main Warehouse", code: "SOL-WH", area: "SOLAN Area", address: "Saproon, Solan", officer: "Anita Sharma", user: "Deepak Rana", capacity: 4000, utilization: 71, status: "Active" },
  { id: "GOD-008", name: "Mandi Regional Godown", code: "MND-WH", area: "MANDI Area", address: "Sundernagar", officer: "Vikram Thakur", user: "Ramesh Sharma", capacity: 6000, utilization: 89, status: "Active" },
  { id: "GOD-009", name: "Kangra Depot", code: "KNG-WH", area: "KANGRA Area", address: "Dharamshala Road", officer: "Sunita Devi", user: "Kiran Chand", capacity: 4500, utilization: 92, status: "Active" },
  { id: "GOD-010", name: "Hamirpur Depot", code: "HMR-WH", area: "HAMIRPUR Area", address: "Bhota Chowk", officer: "Pradeep Kumar", user: "Neeraj Sood", capacity: 3500, utilization: 47, status: "Inactive" },
];

export const stockItemsStatic: MasterRow[] = [
  { id: "ITM-001", name: "Urea 50Kg", group: "Urea", unit: "BAG", hsn: "31021000", gstRate: 5, openingQty: 1850, openingValue: 5550000, defaultGodown: "UNA Warehouse", status: "Active" },
  { id: "ITM-002", name: "DAP 50Kg", group: "DAP", unit: "BAG", hsn: "31053000", gstRate: 5, openingQty: 920, openingValue: 4140000, defaultGodown: "AMB Warehouse", status: "Active" },
  { id: "ITM-003", name: "NPK 12:32:16", group: "Fertilizer", unit: "BAG", hsn: "31052000", gstRate: 5, openingQty: 680, openingValue: 2380000, defaultGodown: "HAROLI Warehouse", status: "Active" },
  { id: "ITM-004", name: "Potash MOP 50Kg", group: "Fertilizer", unit: "BAG", hsn: "31042000", gstRate: 5, openingQty: 540, openingValue: 1620000, defaultGodown: "BANGANA Warehouse", status: "Active" },
  { id: "ITM-005", name: "Wheat Seed Certified", group: "Wheat", unit: "QTL", hsn: "10019910", gstRate: 0, openingQty: 320, openingValue: 960000, defaultGodown: "UNA Warehouse", status: "Active" },
  { id: "ITM-006", name: "Rice Seed Grade A", group: "Rice", unit: "QTL", hsn: "10061090", gstRate: 0, openingQty: 260, openingValue: 780000, defaultGodown: "AMB Warehouse", status: "Active" },
  { id: "ITM-007", name: "Sugar 50Kg", group: "Sugar", unit: "BAG", hsn: "17019990", gstRate: 5, openingQty: 700, openingValue: 1750000, defaultGodown: "Shimla Central Godown", status: "Active" },
  { id: "ITM-008", name: "Mustard Oil 15L", group: "Oil", unit: "TIN", hsn: "15149120", gstRate: 5, openingQty: 420, openingValue: 840000, defaultGodown: "Solan Main Warehouse", status: "Active" },
  { id: "ITM-009", name: "HSD", group: "FUEL", unit: "LTR", hsn: "27101930", gstRate: 0, openingQty: 8500, openingValue: 765000, defaultGodown: "UNA Warehouse", status: "Active" },
  { id: "ITM-010", name: "Apple Crates Wooden", group: "Consumer Products", unit: "PCS", hsn: "44152000", gstRate: 12, openingQty: 4500, openingValue: 675000, defaultGodown: "Mandi Regional Godown", status: "Active" },
  { id: "ITM-011", name: "ULP", group: "FUEL", unit: "LTR", hsn: "27101290", gstRate: 0, openingQty: 6200, openingValue: 620000, defaultGodown: "UNA Warehouse", status: "Active" },
  { id: "ITM-012", name: "Servo Cool Ready", group: "Lubricants", unit: "LTR", hsn: "27101980", gstRate: 18, openingQty: 340, openingValue: 68000, defaultGodown: "UNA Warehouse", status: "Active" },
  { id: "ITM-013", name: "Nino Urea", group: "Urea", unit: "BAG", hsn: "31021000", gstRate: 5, openingQty: 1200, openingValue: 3600000, defaultGodown: "AMB Warehouse", status: "Active" },
];

// ===== Tank Master — every tank is linked to a fuel product (HSD / ULP) and a godown =====
export interface TankRow {
  id: string;
  tankCode: string;
  tankName: string;
  productId: string;   // -> stockItemsStatic.id (ITM-009 HSD, ITM-011 ULP)
  product: "HSD" | "ULP";
  godown: string;      // -> godownMastersStatic.name
  area: string;
  capacityLtr: number;
  currentStockLtr: number;
  dipReading: number;  // in cm
  lastCalibratedOn: string;
  status: "Active" | "Inactive";
  [key: string]: string | number;
}

export const tanksStatic: TankRow[] = [
  { id: "TNK-001", tankCode: "UNA-HSD-T1", tankName: "HSD TANK 01", productId: "ITM-009", product: "HSD", godown: "UNA Warehouse",     area: "UNA Area", capacityLtr: 20000, currentStockLtr: 15400, dipReading: 168, lastCalibratedOn: "2026-01-15", status: "Active" },
  { id: "TNK-002", tankCode: "UNA-HSD-T2", tankName: "HSD TANK 02", productId: "ITM-009", product: "HSD", godown: "UNA Warehouse",     area: "UNA Area", capacityLtr: 20000, currentStockLtr:  8600, dipReading:  95, lastCalibratedOn: "2026-01-15", status: "Active" },
  { id: "TNK-003", tankCode: "UNA-ULP-T1", tankName: "ULP TANK 01", productId: "ITM-011", product: "ULP", godown: "UNA Warehouse",     area: "UNA Area", capacityLtr: 15000, currentStockLtr: 11250, dipReading: 172, lastCalibratedOn: "2026-01-15", status: "Active" },
  { id: "TNK-004", tankCode: "UNA-ULP-T2", tankName: "ULP TANK 02", productId: "ITM-011", product: "ULP", godown: "UNA Warehouse",     area: "UNA Area", capacityLtr: 15000, currentStockLtr:  4800, dipReading:  74, lastCalibratedOn: "2026-01-15", status: "Active" },
  { id: "TNK-005", tankCode: "AMB-HSD-T1", tankName: "HSD TANK 01", productId: "ITM-009", product: "HSD", godown: "AMB Warehouse",     area: "UNA Area", capacityLtr: 12000, currentStockLtr:  9800, dipReading: 178, lastCalibratedOn: "2026-02-04", status: "Active" },
  { id: "TNK-006", tankCode: "AMB-ULP-T1", tankName: "ULP TANK 01", productId: "ITM-011", product: "ULP", godown: "AMB Warehouse",     area: "UNA Area", capacityLtr: 10000, currentStockLtr:  6400, dipReading: 132, lastCalibratedOn: "2026-02-04", status: "Active" },
  { id: "TNK-007", tankCode: "HAR-HSD-T1", tankName: "HSD TANK 01", productId: "ITM-009", product: "HSD", godown: "HAROLI Warehouse",  area: "UNA Area", capacityLtr: 10000, currentStockLtr:  7200, dipReading: 156, lastCalibratedOn: "2025-12-20", status: "Active" },
  { id: "TNK-008", tankCode: "HAR-ULP-T1", tankName: "ULP TANK 01", productId: "ITM-011", product: "ULP", godown: "HAROLI Warehouse",  area: "UNA Area", capacityLtr:  8000, currentStockLtr:  3100, dipReading:  82, lastCalibratedOn: "2025-12-20", status: "Active" },
  { id: "TNK-009", tankCode: "BAN-HSD-T1", tankName: "HSD TANK 01", productId: "ITM-009", product: "HSD", godown: "BANGANA Warehouse", area: "UNA Area", capacityLtr:  8000, currentStockLtr:  5200, dipReading: 148, lastCalibratedOn: "2025-11-11", status: "Active" },
  { id: "TNK-010", tankCode: "BAN-ULP-T1", tankName: "ULP TANK 01", productId: "ITM-011", product: "ULP", godown: "BANGANA Warehouse", area: "UNA Area", capacityLtr:  6000, currentStockLtr:  1800, dipReading:  62, lastCalibratedOn: "2025-11-11", status: "Inactive" },
  { id: "TNK-011", tankCode: "SHM-HSD-T1", tankName: "HSD TANK 01", productId: "ITM-009", product: "HSD", godown: "Shimla Central Godown", area: "SHIMLA Area", capacityLtr: 15000, currentStockLtr: 12000, dipReading: 184, lastCalibratedOn: "2026-02-18", status: "Active" },
  { id: "TNK-012", tankCode: "SHM-ULP-T1", tankName: "ULP TANK 01", productId: "ITM-011", product: "ULP", godown: "Shimla Central Godown", area: "SHIMLA Area", capacityLtr: 12000, currentStockLtr:  7500, dipReading: 148, lastCalibratedOn: "2026-02-18", status: "Active" },
];

const parties = ["NFL Panipat", "IFFCO Kandla", "KRIBHCO Hazira", "Kisan Seva Kendra Amb", "Lovely Seed Store UNA", "HIMFED HQ", "IOCL Una Depot", "Transport Union Una", "HP Cooperative Bank", "Cash Account"];
const items = stockItemsStatic.map((i) => String(i.name));
const godowns = godownMastersStatic.map((g) => String(g.name));

export const vouchersStatic: VoucherRow[] = (["purchase", "sales", "payment", "receipt", "journal", "contra", "stock_transfer"] as VoucherKind[]).flatMap((kind) => {
  const prefix: Record<VoucherKind, string> = { purchase: "PUR", sales: "SAL", payment: "PMT", receipt: "RCT", journal: "JNL", contra: "CNT", stock_transfer: "STK" };
  return Array.from({ length: 10 }, (_, i) => {
    const base = (i + 1) * 27500;
    const isDebit = ["purchase", "payment", "journal", "stock_transfer"].includes(kind);
    const item = items[i % items.length];
    const gst = kind === "purchase" || kind === "sales" ? Math.round(base * 0.05) : 0;
    return {
      id: `${prefix[kind]}-${String(i + 1).padStart(3, "0")}`,
      voucherNo: `${prefix[kind]}/26-27/${String(i + 1).padStart(4, "0")}`,
      kind,
      date: `2026-06-${String(3 + i * 2).padStart(2, "0")}`,
      party: parties[i % parties.length],
      ledger: kind === "sales" ? "Sales Account" : kind === "purchase" ? "Purchase Account" : parties[(i + 4) % parties.length],
      invoiceNo: `${prefix[kind]}-INV-${2100 + i}`,
      item,
      godown: godowns[i % godowns.length],
      qty: 25 + i * 15,
      rate: 300 + i * 85,
      gst,
      debit: isDebit ? base + gst : 0,
      credit: isDebit ? 0 : base + gst,
      total: base + gst,
      status: i % 7 === 0 ? "Pending" : "Approved",
      narration: kind === "stock_transfer" ? `Transfer ${item} from ${godowns[i % godowns.length]} to ${godowns[(i + 1) % godowns.length]}` : `Static ${kind.replace("_", " ")} entry for ${parties[i % parties.length]}`,
    };
  });
});

export const documentsStatic: MasterRow[] = Array.from({ length: 10 }, (_, i) => ({
  id: `DOC-${String(i + 1).padStart(3, "0")}`,
  name: ["Purchase Bill", "Sales Bill", "GST Return", "Challan", "Stock Transfer Note"][i % 5] + ` ${2100 + i}.pdf`,
  type: ["Purchase Bills", "Sales Bills", "GST Documents", "Challans", "Stock Transfer Documents"][i % 5],
  refNo: `REF-${8600 + i}`,
  company: areaCompaniesStatic[i % areaCompaniesStatic.length].name,
  warehouse: godowns[i % godowns.length],
  uploadedBy: ["Sneha Kapoor", "Mahesh Verma", "Anil Chauhan", "Bhuvnesh Sood"][i % 4],
  uploadedAt: `2026-06-${String(5 + i).padStart(2, "0")} 11:${String(10 + i).padStart(2, "0")}`,
  status: "Active",
}));

export const auditLogsStatic: MasterRow[] = Array.from({ length: 10 }, (_, i) => ({
  id: `AUD-${String(i + 1).padStart(3, "0")}`,
  userName: ["Sneha Kapoor", "Mahesh Verma", "Anil Chauhan", "Bhuvnesh Sood", "Pooja Devi"][i % 5],
  role: ["Warehouse Accountant", "Admin Accountant", "Warehouse User", "Area Officer"][i % 4],
  company: areaCompaniesStatic[i % areaCompaniesStatic.length].name,
  warehouse: godowns[i % godowns.length],
  action: ["Created Voucher", "Edited Ledger", "Approved Goods Entry", "Uploaded Document", "Viewed Balance Sheet"][i % 5],
  oldValue: i % 2 ? "Pending" : "—",
  newValue: i % 2 ? "Approved" : "Saved",
  dateTime: `2026-06-${String(6 + i).padStart(2, "0")} ${String(9 + i).padStart(2, "0")}:15`,
  status: "Active",
}));

export const reportRowsStatic: MasterRow[] = stockItemsStatic.map((item, i) => ({
  id: `RPT-${String(i + 1).padStart(3, "0")}`,
  particular: String(item.name),
  ledger: ledgerMasters[i % ledgerMasters.length].name,
  godown: godownMastersStatic[i % godownMastersStatic.length].name,
  opening: Number(item.openingValue),
  debit: vouchersStatic[i].debit,
  credit: vouchersStatic[i + 10].credit,
  closing: Number(item.openingValue) + vouchersStatic[i].debit - vouchersStatic[i + 10].credit,
  gst: vouchersStatic[i].gst,
  status: "Active",
}));

export const dashboardStats = {
  totalPurchaseToday: vouchersStatic.filter((v) => v.kind === "purchase").reduce((s, v) => s + v.total, 0),
  totalSalesToday: vouchersStatic.filter((v) => v.kind === "sales").reduce((s, v) => s + v.total, 0),
  currentStockValue: stockItemsStatic.reduce((s, i) => s + Number(i.openingValue), 0),
  cashBalance: 250000,
  bankBalance: 1850000,
  receivables: 123700,
  payables: 737000,
  pendingVouchers: vouchersStatic.filter((v) => v.status === "Pending").length,
  pendingApprovals: 14,
};

export const fmtStaticINR = (n: number) => "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 0 });

// ===== Department Master — Himachal Pradesh Govt Departments (Sundry Debtors) =====
export interface DepartmentRow {
  id: string;
  code: string;
  name: string;
  alias: string;
  under: string;                     // Ledger group (e.g. Sundry Debtors)
  billByBill: "Yes" | "No";
  creditPeriod: string;              // days
  address: string;
  district: string;
  state: string;
  pincode: string;
  contactPerson: string;
  phone: string;
  email: string;
  provideBankDetails: "Yes" | "No";
  bankName: string;
  bankAccountNo: string;
  ifsc: string;
  panNo: string;
  registrationType: "Regular" | "Composition" | "Unregistered" | "Government";
  gstin: string;
  setAlterGst: "Yes" | "No";
  openingBalance: number;
  drCr: "Dr" | "Cr";
  status: "Active" | "Inactive";
  [key: string]: string | number;
}

export const departmentsStatic: DepartmentRow[] = [
  { id: "DPT-001", code: "1380275", name: "Director General of Police", alias: "DGP HP",
    under: "Sundry Debtors", billByBill: "Yes", creditPeriod: "30",
    address: "Police Headquarters, Chotta Shimla", district: "Shimla", state: "Himachal Pradesh", pincode: "171002",
    contactPerson: "Sr. Accounts Officer", phone: "+91 177 2621904", email: "dgp-hp@nic.in",
    provideBankDetails: "Yes", bankName: "State Bank of India", bankAccountNo: "35201118842", ifsc: "SBIN0000469",
    panNo: "AAAGD0451K", registrationType: "Government", gstin: "02AAAGD0451K1ZR", setAlterGst: "No",
    openingBalance: 1250000, drCr: "Dr", status: "Active" },
  { id: "DPT-002", code: "1380276", name: "Under Secretary to GAD", alias: "US-GAD",
    under: "Sundry Debtors", billByBill: "Yes", creditPeriod: "45",
    address: "Armsdale Building, HP Secretariat", district: "Shimla", state: "Himachal Pradesh", pincode: "171002",
    contactPerson: "Section Officer (Accounts)", phone: "+91 177 2621127", email: "us-gad-hp@nic.in",
    provideBankDetails: "No", bankName: "", bankAccountNo: "", ifsc: "",
    panNo: "AAAGH0102G", registrationType: "Government", gstin: "", setAlterGst: "No",
    openingBalance: 645000, drCr: "Dr", status: "Active" },
  { id: "DPT-003", code: "1380277", name: "Department of Agriculture, HP", alias: "Agri-HP",
    under: "Sundry Debtors", billByBill: "Yes", creditPeriod: "30",
    address: "Krishi Bhawan, Boileauganj", district: "Shimla", state: "Himachal Pradesh", pincode: "171005",
    contactPerson: "Director of Agriculture", phone: "+91 177 2830612", email: "director-agri-hp@nic.in",
    provideBankDetails: "Yes", bankName: "Punjab National Bank", bankAccountNo: "0421000103550012", ifsc: "PUNB0042100",
    panNo: "AAAGA1908B", registrationType: "Government", gstin: "02AAAGA1908B1ZP", setAlterGst: "Yes",
    openingBalance: 2340000, drCr: "Dr", status: "Active" },
  { id: "DPT-004", code: "1380278", name: "HP Public Works Department", alias: "HPPWD",
    under: "Sundry Debtors", billByBill: "Yes", creditPeriod: "60",
    address: "Nirman Bhawan, Chhota Shimla", district: "Shimla", state: "Himachal Pradesh", pincode: "171002",
    contactPerson: "Executive Engineer (Accts)", phone: "+91 177 2622013", email: "eepwd-hp@nic.in",
    provideBankDetails: "Yes", bankName: "UCO Bank", bankAccountNo: "12340210004488", ifsc: "UCBA0001234",
    panNo: "AAAGP4432N", registrationType: "Government", gstin: "02AAAGP4432N1ZK", setAlterGst: "Yes",
    openingBalance: 4187500, drCr: "Dr", status: "Active" },
  { id: "DPT-005", code: "1380279", name: "HP Forest Department", alias: "HP-Forest",
    under: "Sundry Debtors", billByBill: "Yes", creditPeriod: "45",
    address: "Talland, Bharari Road", district: "Shimla", state: "Himachal Pradesh", pincode: "171002",
    contactPerson: "PCCF (HoFF)", phone: "+91 177 2626861", email: "pccf-hp@nic.in",
    provideBankDetails: "No", bankName: "", bankAccountNo: "", ifsc: "",
    panNo: "AAAGF7712M", registrationType: "Government", gstin: "02AAAGF7712M1ZC", setAlterGst: "No",
    openingBalance: 985000, drCr: "Dr", status: "Active" },
  { id: "DPT-006", code: "1380280", name: "HP State Electricity Board Ltd", alias: "HPSEBL",
    under: "Sundry Debtors", billByBill: "Yes", creditPeriod: "30",
    address: "Vidyut Bhawan, Kumar House", district: "Shimla", state: "Himachal Pradesh", pincode: "171004",
    contactPerson: "CFO / Sr. AO", phone: "+91 177 2652003", email: "cfo-hpsebl@nic.in",
    provideBankDetails: "Yes", bankName: "HDFC Bank", bankAccountNo: "50200012348899", ifsc: "HDFC0000234",
    panNo: "AABCH1122E", registrationType: "Regular", gstin: "02AABCH1122E1Z6", setAlterGst: "Yes",
    openingBalance: 3260000, drCr: "Dr", status: "Active" },
  { id: "DPT-007", code: "1380281", name: "HP Health & Family Welfare Dept", alias: "HP-Health",
    under: "Sundry Debtors", billByBill: "Yes", creditPeriod: "45",
    address: "Directorate of Health Services, SDA Complex", district: "Shimla", state: "Himachal Pradesh", pincode: "171009",
    contactPerson: "Director Health Services", phone: "+91 177 2620221", email: "dhs-hp@nic.in",
    provideBankDetails: "Yes", bankName: "Canara Bank", bankAccountNo: "1121101002234", ifsc: "CNRB0001121",
    panNo: "AAAGH5560P", registrationType: "Government", gstin: "", setAlterGst: "No",
    openingBalance: 512000, drCr: "Dr", status: "Active" },
  { id: "DPT-008", code: "1380282", name: "HP Rural Development Dept", alias: "HP-RDD",
    under: "Sundry Debtors", billByBill: "Yes", creditPeriod: "30",
    address: "Armsdale, HP Secretariat", district: "Shimla", state: "Himachal Pradesh", pincode: "171002",
    contactPerson: "Director RD", phone: "+91 177 2621309", email: "rd-hp@nic.in",
    provideBankDetails: "No", bankName: "", bankAccountNo: "", ifsc: "",
    panNo: "AAAGR9081Q", registrationType: "Government", gstin: "", setAlterGst: "No",
    openingBalance: 278000, drCr: "Dr", status: "Active" },
  { id: "DPT-009", code: "1380283", name: "HP Home Guards & Civil Defence", alias: "HP-HomeGuard",
    under: "Sundry Debtors", billByBill: "Yes", creditPeriod: "30",
    address: "Chhota Shimla", district: "Shimla", state: "Himachal Pradesh", pincode: "171002",
    contactPerson: "Commandant General", phone: "+91 177 2624440", email: "hg-hp@nic.in",
    provideBankDetails: "No", bankName: "", bankAccountNo: "", ifsc: "",
    panNo: "AAAGH2201F", registrationType: "Government", gstin: "", setAlterGst: "No",
    openingBalance: 156000, drCr: "Dr", status: "Active" },
  { id: "DPT-010", code: "1380284", name: "HP Transport Department", alias: "HP-Transport",
    under: "Sundry Debtors", billByBill: "Yes", creditPeriod: "45",
    address: "Parivahan Bhawan, Kasumpti", district: "Shimla", state: "Himachal Pradesh", pincode: "171009",
    contactPerson: "Director Transport", phone: "+91 177 2620033", email: "director-transport-hp@nic.in",
    provideBankDetails: "Yes", bankName: "Bank of Baroda", bankAccountNo: "12040100019988", ifsc: "BARB0SHIMLA",
    panNo: "AAAGT7788R", registrationType: "Government", gstin: "02AAAGT7788R1ZH", setAlterGst: "Yes",
    openingBalance: 820000, drCr: "Dr", status: "Inactive" },
];

// ===== Vehicle Master — Govt vehicles that refuel at HIMFED Petrol Pumps, mapped to Department =====
export interface VehicleRow {
  id: string;
  vehicleNumber: string;              // e.g. HP-03-A-1234
  departmentId: string;               // FK -> DepartmentRow.id
  departmentName: string;             // denormalized for display
  vehicleType: "Car" | "Jeep" | "SUV" | "Truck" | "Bus" | "Motorcycle" | "Tractor";
  fuelType: "HSD" | "ULP";
  driverName: string;
  driverPhone: string;
  status: "Active" | "Inactive";
  [key: string]: string | number;
}

export const vehiclesStatic: VehicleRow[] = [
  { id: "VEH-001", vehicleNumber: "HP-03-A-1234", departmentId: "DPT-001", departmentName: "Director General of Police", vehicleType: "SUV",        fuelType: "HSD", driverName: "Constable Ramesh Kumar",  driverPhone: "+91 94180 11223", status: "Active" },
  { id: "VEH-002", vehicleNumber: "HP-03-B-5678", departmentId: "DPT-001", departmentName: "Director General of Police", vehicleType: "Jeep",       fuelType: "HSD", driverName: "HC Suresh Thakur",         driverPhone: "+91 94180 33445", status: "Active" },
  { id: "VEH-003", vehicleNumber: "HP-02-C-2211", departmentId: "DPT-002", departmentName: "Under Secretary to GAD",     vehicleType: "Car",        fuelType: "ULP", driverName: "Rajinder Singh",           driverPhone: "+91 98160 55667", status: "Active" },
  { id: "VEH-004", vehicleNumber: "HP-01-D-9090", departmentId: "DPT-003", departmentName: "Department of Agriculture, HP", vehicleType: "Tractor", fuelType: "HSD", driverName: "Mohan Lal",                driverPhone: "+91 94590 22110", status: "Active" },
  { id: "VEH-005", vehicleNumber: "HP-11-E-4321", departmentId: "DPT-004", departmentName: "HP Public Works Department",  vehicleType: "Truck",      fuelType: "HSD", driverName: "Devinder Sharma",          driverPhone: "+91 98170 88221", status: "Active" },
  { id: "VEH-006", vehicleNumber: "HP-11-F-6543", departmentId: "DPT-004", departmentName: "HP Public Works Department",  vehicleType: "Jeep",       fuelType: "HSD", driverName: "Karam Chand",              driverPhone: "+91 94180 77665", status: "Active" },
  { id: "VEH-007", vehicleNumber: "HP-05-G-1122", departmentId: "DPT-005", departmentName: "HP Forest Department",        vehicleType: "SUV",        fuelType: "HSD", driverName: "Ranger Vijay Kumar",       driverPhone: "+91 94180 44556", status: "Active" },
  { id: "VEH-008", vehicleNumber: "HP-03-H-7788", departmentId: "DPT-006", departmentName: "HP State Electricity Board Ltd", vehicleType: "Truck",   fuelType: "HSD", driverName: "Lineman Prakash",          driverPhone: "+91 98160 99001", status: "Active" },
  { id: "VEH-009", vehicleNumber: "HP-03-I-3344", departmentId: "DPT-007", departmentName: "HP Health & Family Welfare Dept", vehicleType: "Bus",    fuelType: "HSD", driverName: "Ambulance Drv. Anil",      driverPhone: "+91 94590 66778", status: "Active" },
  { id: "VEH-010", vehicleNumber: "HP-08-J-5566", departmentId: "DPT-008", departmentName: "HP Rural Development Dept",   vehicleType: "Jeep",       fuelType: "ULP", driverName: "Sanjay Kumar",             driverPhone: "+91 98170 33221", status: "Active" },
  { id: "VEH-011", vehicleNumber: "HP-03-K-2200", departmentId: "DPT-009", departmentName: "HP Home Guards & Civil Defence", vehicleType: "Truck",   fuelType: "HSD", driverName: "HG Balbir Singh",          driverPhone: "+91 94180 12345", status: "Active" },
  { id: "VEH-012", vehicleNumber: "HP-03-L-8899", departmentId: "DPT-010", departmentName: "HP Transport Department",     vehicleType: "Bus",        fuelType: "HSD", driverName: "HRTC Drv. Naresh",         driverPhone: "+91 94590 88112", status: "Inactive" },
  { id: "VEH-013", vehicleNumber: "HP-03-M-4400", departmentId: "DPT-001", departmentName: "Director General of Police", vehicleType: "Motorcycle", fuelType: "ULP", driverName: "SI Amit Kumar",            driverPhone: "+91 98160 77883", status: "Active" },
  { id: "VEH-014", vehicleNumber: "HP-11-N-6611", departmentId: "DPT-004", departmentName: "HP Public Works Department",  vehicleType: "Truck",      fuelType: "HSD", driverName: "Om Prakash",               driverPhone: "+91 94180 55443", status: "Active" },
  { id: "VEH-015", vehicleNumber: "HP-05-O-9922", departmentId: "DPT-005", departmentName: "HP Forest Department",        vehicleType: "Motorcycle", fuelType: "ULP", driverName: "Forest Grd. Mehar",        driverPhone: "+91 98170 11224", status: "Active" },
];

// ===== Nozzle Master — each nozzle mapped to a Tank + Product (HSD / ULP) =====
export interface NozzleRow {
  id: string;
  nozzleName: string;                 // e.g. ULP-1, HSD-2
  product: "HSD" | "ULP";
  tankId: string;                     // FK -> TankRow.id
  tankName: string;                   // denormalized (tankCode · tankName)
  godown: string;
  lastReading: number;                // totalizer reading in Ltr
  status: "Active" | "Inactive";
  [key: string]: string | number;
}

export const nozzlesStatic: NozzleRow[] = [
  { id: "NZ-001", nozzleName: "ULP-1", product: "ULP", tankId: "TNK-003", tankName: "UNA-ULP-T1 · ULP TANK 01", godown: "UNA Warehouse",     lastReading: 184520, status: "Active" },
  { id: "NZ-002", nozzleName: "ULP-2", product: "ULP", tankId: "TNK-003", tankName: "UNA-ULP-T1 · ULP TANK 01", godown: "UNA Warehouse",     lastReading: 172340, status: "Active" },
  { id: "NZ-003", nozzleName: "ULP-3", product: "ULP", tankId: "TNK-004", tankName: "UNA-ULP-T2 · ULP TANK 02", godown: "UNA Warehouse",     lastReading:  96210, status: "Active" },
  { id: "NZ-004", nozzleName: "HSD-1", product: "HSD", tankId: "TNK-001", tankName: "UNA-HSD-T1 · HSD TANK 01", godown: "UNA Warehouse",     lastReading: 268400, status: "Active" },
  { id: "NZ-005", nozzleName: "HSD-2", product: "HSD", tankId: "TNK-001", tankName: "UNA-HSD-T1 · HSD TANK 01", godown: "UNA Warehouse",     lastReading: 254120, status: "Active" },
  { id: "NZ-006", nozzleName: "HSD-3", product: "HSD", tankId: "TNK-002", tankName: "UNA-HSD-T2 · HSD TANK 02", godown: "UNA Warehouse",     lastReading: 148900, status: "Active" },
  { id: "NZ-007", nozzleName: "HSD-1", product: "HSD", tankId: "TNK-005", tankName: "AMB-HSD-T1 · HSD TANK 01", godown: "AMB Warehouse",     lastReading:  91240, status: "Active" },
  { id: "NZ-008", nozzleName: "ULP-1", product: "ULP", tankId: "TNK-006", tankName: "AMB-ULP-T1 · ULP TANK 01", godown: "AMB Warehouse",     lastReading:  76310, status: "Active" },
  { id: "NZ-009", nozzleName: "HSD-1", product: "HSD", tankId: "TNK-007", tankName: "HAR-HSD-T1 · HSD TANK 01", godown: "HAROLI Warehouse",  lastReading:  58420, status: "Active" },
  { id: "NZ-010", nozzleName: "ULP-1", product: "ULP", tankId: "TNK-008", tankName: "HAR-ULP-T1 · ULP TANK 01", godown: "HAROLI Warehouse",  lastReading:  41220, status: "Active" },
  { id: "NZ-011", nozzleName: "HSD-1", product: "HSD", tankId: "TNK-009", tankName: "BAN-HSD-T1 · HSD TANK 01", godown: "BANGANA Warehouse", lastReading:  36510, status: "Active" },
  { id: "NZ-012", nozzleName: "ULP-1", product: "ULP", tankId: "TNK-010", tankName: "BAN-ULP-T1 · ULP TANK 01", godown: "BANGANA Warehouse", lastReading:  22140, status: "Inactive" },
  { id: "NZ-013", nozzleName: "HSD-1", product: "HSD", tankId: "TNK-011", tankName: "SHM-HSD-T1 · HSD TANK 01", godown: "Shimla Central Godown", lastReading: 118220, status: "Active" },
  { id: "NZ-014", nozzleName: "HSD-2", product: "HSD", tankId: "TNK-011", tankName: "SHM-HSD-T1 · HSD TANK 01", godown: "Shimla Central Godown", lastReading: 109840, status: "Active" },
  { id: "NZ-015", nozzleName: "ULP-1", product: "ULP", tankId: "TNK-012", tankName: "SHM-ULP-T1 · ULP TANK 01", godown: "Shimla Central Godown", lastReading:  84610, status: "Active" },
];
