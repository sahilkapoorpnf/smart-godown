import {
  AccountGroup, AuditEntry, DocFile, Godown, GoodsArrival, Ledger,
  StockGroup, StockItem, StockUnit, Voucher, VoucherType,
} from "./types";

// ---------- Areas / Godowns (Una included) ----------
// Reuse warehouse store areas where possible; ERP adds its own godown master.
export const erpGodowns: Godown[] = [
  { id: "g_una1", name: "Una Main Godown",        areaId: "a_una", address: "MC Road, Una HP",            capacity: 6500, inchargeName: "Yashpal Sood"   },
  { id: "g_una2", name: "Una Haroli Depot",       areaId: "a_una", address: "Haroli, Una",                capacity: 3800, inchargeName: "Ravi Kumar"     },
  { id: "g_una3", name: "Una Amb Sub-Depot",      areaId: "a_una", address: "Amb, Una",                   capacity: 2200, inchargeName: "Priya Sharma"   },
  { id: "g_shm1", name: "Shimla Central Godown",  areaId: "a1",    address: "Sector 4, Shimla",           capacity: 5000, inchargeName: "Manoj Kumar"    },
  { id: "g_sol1", name: "Solan Main Warehouse",   areaId: "a2",    address: "Old Bus Stand, Solan",       capacity: 4000, inchargeName: "Deepak Rana"    },
  { id: "g_mnd1", name: "Mandi Regional Godown",  areaId: "a3",    address: "Sundernagar, Mandi",         capacity: 6000, inchargeName: "Ramesh Sharma"  },
  { id: "g_kng1", name: "Kangra Depot",           areaId: "a4",    address: "Dharamshala Road, Kangra",   capacity: 4500, inchargeName: "Kiran Chand"    },
];

// ---------- Accounting Masters ----------
export const accountGroups: AccountGroup[] = [
  { id: "ag1", name: "Current Assets",    nature: "Assets",      under: "Assets" },
  { id: "ag2", name: "Fixed Assets",      nature: "Assets",      under: "Assets" },
  { id: "ag3", name: "Sundry Debtors",    nature: "Assets",      under: "Current Assets" },
  { id: "ag4", name: "Bank Accounts",     nature: "Assets",      under: "Current Assets" },
  { id: "ag5", name: "Cash-in-Hand",      nature: "Assets",      under: "Current Assets" },
  { id: "ag6", name: "Sundry Creditors",  nature: "Liabilities", under: "Current Liabilities" },
  { id: "ag7", name: "Duties & Taxes",    nature: "Liabilities", under: "Current Liabilities" },
  { id: "ag8", name: "Sales Accounts",    nature: "Income",      under: "Income" },
  { id: "ag9", name: "Purchase Accounts", nature: "Expenses",    under: "Expenses" },
  { id: "ag10",name: "Direct Expenses",   nature: "Expenses",    under: "Expenses" },
  { id: "ag11",name: "Indirect Expenses", nature: "Expenses",    under: "Expenses" },
  { id: "ag12",name: "Direct Income",     nature: "Income",      under: "Income" },
  { id: "ag13",name: "Indirect Income",   nature: "Income",      under: "Income" },
];

export const ledgers: Ledger[] = [
  { id: "l1",  name: "Cash",                     groupId: "ag5", openingBalance: 250000, type: "Dr" },
  { id: "l2",  name: "HDFC Bank - Una",          groupId: "ag4", openingBalance: 1850000,type: "Dr", contact: "Una Branch" },
  { id: "l3",  name: "PNB - Shimla",             groupId: "ag4", openingBalance: 950000, type: "Dr" },
  { id: "l4",  name: "NFL Panipat",              groupId: "ag6", openingBalance: 425000, type: "Cr", gstin: "06AAACN0234N1Z2" },
  { id: "l5",  name: "IFFCO Kandla",             groupId: "ag6", openingBalance: 312000, type: "Cr", gstin: "24AAACI0123F1ZQ" },
  { id: "l6",  name: "KRIBHCO Hazira",           groupId: "ag6", openingBalance: 198000, type: "Cr", gstin: "24AAACK1234L1Z8" },
  { id: "l7",  name: "Coromandel Vizag",         groupId: "ag6", openingBalance: 156000, type: "Cr", gstin: "37AAACC4567P1ZB" },
  { id: "l8",  name: "IOCL Una Depot",           groupId: "ag6", openingBalance: 540000, type: "Cr", gstin: "02AAACI2345R1ZK" },
  { id: "l9",  name: "Lovely Seed Store - Una",  groupId: "ag3", openingBalance: 78500,  type: "Dr", gstin: "02AABCL9876Q1Z3" },
  { id: "l10", name: "Kisan Seva Kendra - Amb",  groupId: "ag3", openingBalance: 45200,  type: "Dr" },
  { id: "l11", name: "Sharma Agri Suppliers",    groupId: "ag3", openingBalance: 121000, type: "Dr" },
  { id: "l12", name: "Purchase A/c - Fertilizer",groupId: "ag9", openingBalance: 0,      type: "Dr" },
  { id: "l13", name: "Sales A/c - Fertilizer",   groupId: "ag8", openingBalance: 0,      type: "Cr" },
  { id: "l14", name: "CGST Payable",             groupId: "ag7", openingBalance: 0,      type: "Cr" },
  { id: "l15", name: "SGST Payable",             groupId: "ag7", openingBalance: 0,      type: "Cr" },
  { id: "l16", name: "IGST Payable",             groupId: "ag7", openingBalance: 0,      type: "Cr" },
  { id: "l17", name: "Transport & Freight",      groupId: "ag10",openingBalance: 0,      type: "Dr" },
  { id: "l18", name: "Loading / Unloading",      groupId: "ag10",openingBalance: 0,      type: "Dr" },
  { id: "l19", name: "Office Rent",              groupId: "ag11",openingBalance: 0,      type: "Dr" },
  { id: "l20", name: "Subsidy Received",         groupId: "ag12",openingBalance: 0,      type: "Cr" },
];

export const voucherTypes: VoucherType[] = [
  { id: "vt1", name: "Purchase",       prefix: "PUR/26-27/", category: "Purchase", numbering: "Automatic" },
  { id: "vt2", name: "Sales",          prefix: "SAL/26-27/", category: "Sales",    numbering: "Automatic" },
  { id: "vt3", name: "Payment",        prefix: "PMT/26-27/", category: "Payment",  numbering: "Automatic" },
  { id: "vt4", name: "Receipt",        prefix: "RCT/26-27/", category: "Receipt",  numbering: "Automatic" },
  { id: "vt5", name: "Journal",        prefix: "JNL/26-27/", category: "Journal",  numbering: "Automatic" },
  { id: "vt6", name: "Contra",         prefix: "CNT/26-27/", category: "Contra",   numbering: "Automatic" },
  { id: "vt7", name: "Stock Transfer", prefix: "STK/26-27/", category: "Stock",    numbering: "Automatic" },
];

export const stockGroups: StockGroup[] = [
  { id: "sg1", name: "Fertilizer",          under: "Primary" },
  { id: "sg2", name: "Food Products",       under: "Primary" },
  { id: "sg3", name: "Agriculture Products",under: "Primary" },
  { id: "sg4", name: "Consumer Goods",      under: "Primary" },
  { id: "sg5", name: "Fuel & Lubricants",   under: "Primary" },
];

export const stockUnits: StockUnit[] = [
  { id: "u_bag", code: "Bag", name: "Bag (50kg)", decimals: 0 },
  { id: "u_qtl", code: "Qtl", name: "Quintal",    decimals: 2 },
  { id: "u_kg",  code: "Kg",  name: "Kilogram",   decimals: 3 },
  { id: "u_ton", code: "Ton", name: "Tonne",      decimals: 3 },
  { id: "u_ltr", code: "Ltr", name: "Litre",      decimals: 2 },
  { id: "u_pcs", code: "Pcs", name: "Piece",      decimals: 0 },
];

export const stockItems: StockItem[] = [
  { id: "si1", name: "Urea 50Kg",              groupId: "sg1", unitId: "u_bag", hsn: "31021000", gstRate: 5,  openingQty: 1850, openingValue: 5550000, ratePerUnit: 300 },
  { id: "si2", name: "DAP 50Kg",               groupId: "sg1", unitId: "u_bag", hsn: "31053000", gstRate: 5,  openingQty: 920,  openingValue: 4140000, ratePerUnit: 1450 },
  { id: "si3", name: "NPK 12:32:16",           groupId: "sg1", unitId: "u_bag", hsn: "31052000", gstRate: 5,  openingQty: 680,  openingValue: 2380000, ratePerUnit: 1380 },
  { id: "si4", name: "Potash MOP 50Kg",        groupId: "sg1", unitId: "u_bag", hsn: "31042000", gstRate: 5,  openingQty: 540,  openingValue: 1620000, ratePerUnit: 1700 },
  { id: "si5", name: "Wheat Seed Certified",   groupId: "sg3", unitId: "u_qtl", hsn: "10019910", gstRate: 0,  openingQty: 320,  openingValue: 960000,  ratePerUnit: 3200 },
  { id: "si6", name: "Apple Crates (Wooden)",  groupId: "sg4", unitId: "u_pcs", hsn: "44152000", gstRate: 12, openingQty: 4500, openingValue: 675000,  ratePerUnit: 150 },
  { id: "si7", name: "Diesel HSD",             groupId: "sg5", unitId: "u_ltr", hsn: "27101930", gstRate: 0,  openingQty: 8500, openingValue: 765000,  ratePerUnit: 92 },
];

// ---------- Goods Arrivals: 10 entries per godown (70 total) ----------
const companies = ["NFL", "IFFCO", "KRIBHCO", "Coromandel", "HIMFED", "IOCL"];
const products  = ["Urea 50Kg", "DAP 50Kg", "NPK 12:32:16", "Potash MOP 50Kg", "Wheat Seed Certified", "Apple Crates (Wooden)", "Diesel HSD"];
const suppliers = ["NFL Panipat", "IFFCO Kandla", "KRIBHCO Hazira", "Coromandel Vizag", "IOCL Una Depot", "Pant Nagar Seeds", "Local Vendor — Kullu"];
const drivers   = ["Karam Singh", "Rakesh Yadav", "Mohan Lal", "Pankaj Kumar", "Sanjay Thakur", "Inder Sharma", "Hari Om", "Vinod Saini", "Sunil Negi", "Jagdish Rana"];

const seededRand = (seed: number) => { let s = seed; return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; }; };

const godownStaffMap: Record<string, string> = {
  g_una1: "wu_una1", g_una2: "wu_una2", g_una3: "wu_una3",
  g_shm1: "wu_shm1", g_sol1: "wu_sol1", g_mnd1: "wu_mnd1", g_kng1: "wu_kng1",
};

export const goodsArrivals: GoodsArrival[] = (() => {
  const rng = seededRand(42);
  const out: GoodsArrival[] = [];
  let counter = 1;
  erpGodowns.forEach((g) => {
    for (let i = 0; i < 10; i++) {
      const r = rng();
      const productIdx = Math.floor(rng() * products.length);
      const qty = Math.floor(50 + rng() * 450);
      const rate = [300, 1450, 1380, 1700, 3200, 150, 92][productIdx % 7];
      const status: GoodsStatusLocal = r < 0.5 ? "approved" : r < 0.8 ? "pending" : "re_edit";
      const day = 5 + i * 2;
      const dateStr = `2026-06-${String(Math.min(28, day)).padStart(2, "0")}`;
      out.push({
        id: `ga_${counter}`,
        entryId: `GE-26-${String(counter).padStart(4, "0")}`,
        depotDate: dateStr,
        grNumber: `GR-${800000 + counter}`,
        truckNumber: `HP-${String(Math.floor(1 + rng() * 80)).padStart(2, "0")}-${String.fromCharCode(65 + Math.floor(rng() * 26))}-${String(Math.floor(1000 + rng() * 8999))}`,
        companyName: companies[Math.floor(rng() * companies.length)],
        productName: products[productIdx],
        supplierName: suppliers[Math.floor(rng() * suppliers.length)],
        quantity: qty,
        unit: ["Bags", "Quintal", "Kg", "Ton", "Liter"][productIdx % 5] as any,
        rate,
        driverName: drivers[Math.floor(rng() * drivers.length)],
        driverMobile: `+91 9${Math.floor(1000000000 + rng() * 8999999999)}`.slice(0, 14),
        invoiceNumber: `INV-${g.id.toUpperCase()}-${1000 + i}`,
        invoiceFile: i % 3 === 0 ? `gr_${counter}.pdf` : undefined,
        remarks: ["All bags sealed.", "2 bags torn — noted.", "Tanker seal verified.", "OK", "Verified vs challan.", "Stored north shed."][Math.floor(rng() * 6)],
        warehouseId: g.id,
        areaId: g.areaId,
        createdBy: godownStaffMap[g.id] ?? "wu_una1",
        createdAt: `${dateStr}T${String(8 + i).padStart(2, "0")}:${String(Math.floor(rng() * 59)).padStart(2, "0")}:00`,
        status,
        approvedBy: status === "approved" ? (g.areaId === "a_una" ? "ao_una" : "ao_default") : undefined,
        approvedAt: status === "approved" ? `${dateStr}T${String(10 + i).padStart(2, "0")}:30:00` : undefined,
        correctionRemarks: status === "re_edit" ? "GR number mismatch on physical copy. Please re-submit." : undefined,
      });
      counter++;
    }
  });
  return out;
})();

type GoodsStatusLocal = "pending" | "approved" | "re_edit";

// ---------- Vouchers (auto-built from approved arrivals + manual ones) ----------
const productToItem: Record<string, string> = {
  "Urea 50Kg": "si1", "DAP 50Kg": "si2", "NPK 12:32:16": "si3", "Potash MOP 50Kg": "si4",
  "Wheat Seed Certified": "si5", "Apple Crates (Wooden)": "si6", "Diesel HSD": "si7",
};
const companyToLedger: Record<string, string> = {
  "NFL": "l4", "IFFCO": "l5", "KRIBHCO": "l6", "Coromandel": "l7", "IOCL": "l8", "HIMFED": "l11",
};

export const vouchers: Voucher[] = (() => {
  const out: Voucher[] = [];
  let pno = 1, sno = 1, payno = 1, recno = 1;
  // Purchase vouchers from approved arrivals
  goodsArrivals.filter((g) => g.status === "approved").forEach((g) => {
    const itemId = productToItem[g.productName] ?? "si1";
    const item = stockItems.find((i) => i.id === itemId)!;
    const amount = g.quantity * g.rate;
    const gst = +(amount * item.gstRate / 100).toFixed(2);
    out.push({
      id: `v_p_${pno}`,
      voucherNo: `PUR/26-27/${String(pno).padStart(4, "0")}`,
      kind: "purchase",
      date: g.depotDate,
      partyLedgerId: companyToLedger[g.companyName] ?? "l4",
      narration: `Being goods received vide GR ${g.grNumber}, Truck ${g.truckNumber}`,
      lines: [{ itemId, qty: g.quantity, rate: g.rate, amount, gstRate: item.gstRate, gstAmount: gst, godownToId: g.warehouseId }],
      total: amount, gstTotal: gst, grandTotal: amount + gst,
      invoiceNumber: g.invoiceNumber,
      createdBy: "wa_una", createdAt: g.approvedAt || g.createdAt,
      linkedArrivalId: g.id,
    });
    pno++;
  });
  // Sales vouchers
  const customers = ["l9", "l10", "l11"];
  for (let i = 0; i < 18; i++) {
    const item = stockItems[i % stockItems.length];
    const qty = 20 + (i * 7) % 180;
    const rate = Math.round(item.ratePerUnit * 1.12);
    const amount = qty * rate;
    const gst = +(amount * item.gstRate / 100).toFixed(2);
    out.push({
      id: `v_s_${sno}`, voucherNo: `SAL/26-27/${String(sno).padStart(4, "0")}`, kind: "sales",
      date: `2026-06-${String(5 + (i % 22)).padStart(2, "0")}`,
      partyLedgerId: customers[i % customers.length],
      narration: `Being goods sold against bill #${1000 + i}`,
      lines: [{ itemId: item.id, qty, rate, amount, gstRate: item.gstRate, gstAmount: gst, godownFromId: erpGodowns[i % erpGodowns.length].id }],
      total: amount, gstTotal: gst, grandTotal: amount + gst,
      invoiceNumber: `HIMFED/SAL/${2000 + i}`,
      createdBy: "wa_una", createdAt: `2026-06-${String(5 + (i % 22)).padStart(2, "0")}T14:00:00`,
    });
    sno++;
  }
  // Payment vouchers
  for (let i = 0; i < 8; i++) {
    const supplier = ["l4", "l5", "l6", "l7", "l8"][i % 5];
    const amt = 50000 + i * 18500;
    out.push({
      id: `v_pay_${payno}`, voucherNo: `PMT/26-27/${String(payno).padStart(4, "0")}`, kind: "payment",
      date: `2026-06-${String(7 + i * 2).padStart(2, "0")}`,
      partyLedgerId: supplier, narration: `Payment via NEFT to supplier`,
      lines: [{ ledgerId: supplier, amount: amt }, { ledgerId: "l2", amount: -amt }],
      total: amt, gstTotal: 0, grandTotal: amt,
      createdBy: "wa_una", createdAt: `2026-06-${String(7 + i * 2).padStart(2, "0")}T11:00:00`,
    });
    payno++;
  }
  // Receipt vouchers
  for (let i = 0; i < 8; i++) {
    const cust = ["l9", "l10", "l11"][i % 3];
    const amt = 25000 + i * 9200;
    out.push({
      id: `v_rec_${recno}`, voucherNo: `RCT/26-27/${String(recno).padStart(4, "0")}`, kind: "receipt",
      date: `2026-06-${String(8 + i * 2).padStart(2, "0")}`,
      partyLedgerId: cust, narration: `Cheque/NEFT received from customer`,
      lines: [{ ledgerId: "l2", amount: amt }, { ledgerId: cust, amount: -amt }],
      total: amt, gstTotal: 0, grandTotal: amt,
      createdBy: "wa_una", createdAt: `2026-06-${String(8 + i * 2).padStart(2, "0")}T12:00:00`,
    });
    recno++;
  }
  return out;
})();

// ---------- Audit & Documents ----------
export const auditEntries: AuditEntry[] = [
  { id: "au1", user: "Anil Chauhan",  role: "wh_user",         action: "Created Goods Arrival", target: "GE-26-0001", at: "2026-06-05T09:24:00", ip: "192.168.1.42" },
  { id: "au2", user: "Bhuvnesh Sood", role: "area_officer",    action: "Approved Arrival",      target: "GE-26-0001", at: "2026-06-05T11:10:00", ip: "192.168.1.15" },
  { id: "au3", user: "Sneha Kapoor",  role: "wh_accountant",   action: "Saved Purchase Voucher",target: "PUR/26-27/0001", at: "2026-06-05T15:20:00", ip: "192.168.1.45" },
  { id: "au4", user: "Mahesh Verma",  role: "admin_accountant",action: "Locked May 2026 Period",target: "FY 2026-27", at: "2026-06-02T10:00:00", ip: "10.0.0.5" },
  { id: "au5", user: "Anil Chauhan",  role: "wh_user",         action: "Re-submitted Arrival",  target: "GE-26-0004", before: "re_edit", after: "pending", at: "2026-06-09T09:10:00", ip: "192.168.1.42" },
  { id: "au6", user: "Bhuvnesh Sood", role: "area_officer",    action: "Sent for Re-edit",      target: "GE-26-0004", at: "2026-06-08T16:05:00", ip: "192.168.1.15" },
];

export const docFiles: DocFile[] = [
  { id: "d1", name: "GR-800001.pdf",          type: "GR Copy",         refNo: "GE-26-0001",       sizeKb: 184, uploadedBy: "Anil Chauhan",  uploadedAt: "2026-06-05T09:25:00", godownId: "g_una1" },
  { id: "d2", name: "NFL-Invoice-2245.pdf",   type: "Purchase Invoice",refNo: "PUR/26-27/0001",   sizeKb: 312, uploadedBy: "Sneha Kapoor",  uploadedAt: "2026-06-05T15:21:00", godownId: "g_una1" },
  { id: "d3", name: "Challan-IFFCO-99.pdf",   type: "Challan",         refNo: "GE-26-0002",       sizeKb: 121, uploadedBy: "Anil Chauhan",  uploadedAt: "2026-06-07T10:30:00", godownId: "g_una1" },
  { id: "d4", name: "Sales-Bill-2001.pdf",    type: "Sales Bill",      refNo: "SAL/26-27/0001",   sizeKb: 96,  uploadedBy: "Sneha Kapoor",  uploadedAt: "2026-06-06T14:05:00", godownId: "g_una1" },
  { id: "d5", name: "NEFT-Receipt-NFL.pdf",   type: "Payment Proof",   refNo: "PMT/26-27/0001",   sizeKb: 58,  uploadedBy: "Sneha Kapoor",  uploadedAt: "2026-06-09T11:02:00", godownId: "g_una1" },
  { id: "d6", name: "GR-800015.pdf",          type: "GR Copy",         refNo: "GE-26-0015",       sizeKb: 201, uploadedBy: "Pooja Devi",    uploadedAt: "2026-06-11T08:45:00", godownId: "g_una2" },
  { id: "d7", name: "GR-800032.pdf",          type: "GR Copy",         refNo: "GE-26-0032",       sizeKb: 174, uploadedBy: "Manoj Kumar",   uploadedAt: "2026-06-12T09:50:00", godownId: "g_shm1" },
];
