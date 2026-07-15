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
  { id: "ITM-009", name: "Diesel HSD", group: "Fuel", unit: "LTR", hsn: "27101930", gstRate: 0, openingQty: 8500, openingValue: 765000, defaultGodown: "Kangra Depot", status: "Active" },
  { id: "ITM-010", name: "Apple Crates Wooden", group: "Consumer Products", unit: "PCS", hsn: "44152000", gstRate: 12, openingQty: 4500, openingValue: 675000, defaultGodown: "Mandi Regional Godown", status: "Active" },
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