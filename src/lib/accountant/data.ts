// HIMFED Accountant Module — centralized dummy data & helpers
// All data is static / in-memory for demo purposes.

export const AREAS = ["UNA", "SHIMLA", "SOLAN", "MANDI", "KANGRA"];
export const WAREHOUSES = ["Una Main", "Amb", "Haroli", "Dhalli", "Theog", "Rampur"];
export const FERTILIZERS = ["UREA", "DAP", "NPK 12:32", "NPK 16:16", "POTASH"];
export const COMPANIES = ["NFL", "IFFCO", "KRIBHCO", "Chambal Fertilizers", "Tata Chemicals"];
export const FINANCIAL_YEARS = ["2024-25", "2025-26", "2026-27"];

const FERT_RATES: Record<string, { price: number; margin: number; subsidy: number }> = {
  UREA: { price: 266.5, margin: 5, subsidy: 1750 },
  DAP: { price: 1350, margin: 7, subsidy: 1200 },
  "NPK 12:32": { price: 1700, margin: 10, subsidy: 950 },
  "NPK 16:16": { price: 1470, margin: 8, subsidy: 800 },
  POTASH: { price: 1700, margin: 9, subsidy: 600 },
};

const PARTIES = [
  { name: "Lovely Seed Store", gst: "02ABCDE1234F1Z5", credit: 200000 },
  { name: "Kisan Seva Kendra", gst: "02FGHIJ5678K1Z9", credit: 150000 },
  { name: "Pandit Seed Store", gst: "02KLMNO9012P1Z3", credit: 100000 },
  { name: "Swastik Pesticide", gst: "02PQRST3456U1Z7", credit: 250000 },
  { name: "Tilak Raj Trader", gst: "02UVWXY7890Z1A4", credit: 80000 },
  { name: "Himalaya Agro Center", gst: "02BCDEF1234G2H5", credit: 300000 },
  { name: "Sharma Krishi Bhandar", gst: "02HIJKL5678M2N9", credit: 175000 },
  { name: "Verma Seed House", gst: "02NOPQR9012S2T3", credit: 120000 },
  { name: "Devi Pesticide Mart", gst: "02TUVWX3456Y2Z7", credit: 90000 },
  { name: "Rana Agro Solutions", gst: "02ABCDE6789F3G2", credit: 400000 },
  { name: "Bharat Kisan Store", gst: "02HIJKL0123M3N6", credit: 110000 },
  { name: "Mahesh Krishi Kendra", gst: "02NOPQR4567S3T0", credit: 95000 },
  { name: "Singh Fertilizer Mart", gst: "02TUVWX8901Y3Z4", credit: 220000 },
  { name: "Choudhary Trading Co.", gst: "02ABCDE2345F4G9", credit: 180000 },
  { name: "Kumar Krishi Sewa", gst: "02HIJKL6789M4N3", credit: 70000 },
  { name: "Negi Brothers", gst: "02NOPQR0123S4T7", credit: 260000 },
  { name: "Thakur Agro House", gst: "02TUVWX4567Y4Z1", credit: 130000 },
  { name: "Anand Krishi Mart", gst: "02ABCDE8901F5G6", credit: 60000 },
  { name: "Patel Fertilizer", gst: "02HIJKL2345M5N0", credit: 145000 },
  { name: "Gupta Trading", gst: "02NOPQR6789S5T4", credit: 200000 },
  { name: "Sood Seeds Co.", gst: "02TUVWX0123Y5Z8", credit: 105000 },
  { name: "Jaswal Agencies", gst: "02ABCDE4567F6G3", credit: 165000 },
  { name: "Kapoor Krishi", gst: "02HIJKL8901M6N7", credit: 85000 },
  { name: "Bhandari Bandhu", gst: "02NOPQR2345S6T1", credit: 195000 },
  { name: "Chauhan Seed Mart", gst: "02TUVWX6789Y6Z5", credit: 75000 },
];

const dayOffset = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
};

const r = (seed: number) => {
  // deterministic pseudo-random based on seed
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

// ---------- TYPES ----------
export type Status = "approved" | "pending" | "rejected";
export type PaymentStatus = "paid" | "partial" | "overdue" | "pending";
export type SubsidyStatus = "Released" | "Pending" | "Partial";

export interface SalesRecord {
  id: string;
  invoiceNo: string;
  fy: string;
  date: string;
  area: string;
  warehouse: string;
  party: string;
  partyGst: string;
  fertilizer: string;
  bags: number;
  rate: number;
  amount: number;
  cgst: number;
  sgst: number;
  total: number;
  marginRate: number;
  margin: number;
  subsidy: number;
  netAmount: number;
  paymentStatus: PaymentStatus;
  paid: number;
  pending: number;
  createdBy: string;
  approvedBy: string;
}

export interface PurchaseRecord {
  id: string;
  date: string;
  company: string;
  fertilizer: string;
  truckNo: string;
  grNo: string;
  bags: number;
  rate: number;
  amount: number;
  warehouse: string;
  receivedBy: string;
  status: Status;
}

export interface StockLedgerRow {
  id: string;
  date: string;
  area: string;
  warehouse: string;
  fertilizer: string;
  opening: number;
  incoming: number;
  sold: number;
  transfer: number;
  damaged: number;
  closing: number;
}

export interface SubsidyRecord {
  id: string;
  invoiceNo: string;
  party: string;
  fertilizer: string;
  bags: number;
  amount: number;
  status: SubsidyStatus;
  releaseDate?: string;
  pending: number;
}

export interface DealerLedgerRow {
  date: string;
  voucher: string;
  invoiceNo: string;
  debit: number;
  credit: number;
  balance: number;
}

export interface ExpenseRecord {
  id: string;
  date: string;
  type: string;
  area: string;
  warehouse: string;
  amount: number;
  approvedBy: string;
  remarks: string;
}

export interface CashBookEntry {
  id: string;
  date: string;
  voucher: string;
  particulars: string;
  debit: number;
  credit: number;
  balance: number;
}

export interface BankEntry {
  id: string;
  date: string;
  bank: string;
  txnType: "NEFT" | "RTGS" | "UPI" | "Cheque";
  utr: string;
  deposit: number;
  withdrawal: number;
  balance: number;
}

export interface CreditDebitNote {
  id: string;
  noteNo: string;
  type: "Credit" | "Debit";
  party: string;
  fertilizer: string;
  amount: number;
  reason: string;
  date: string;
}

export interface ReturnRecord {
  id: string;
  returnId: string;
  invoiceNo: string;
  fertilizer: string;
  bags: number;
  reason: string;
  warehouse: string;
  adjustment: number;
  date: string;
}

export interface StockAdjustment {
  id: string;
  adjId: string;
  fertilizer: string;
  warehouse: string;
  systemStock: number;
  physicalStock: number;
  variance: number;
  approvedBy: string;
  date: string;
}

export interface TransportExpense {
  id: string;
  truckNo: string;
  driver: string;
  route: string;
  freight: number;
  diesel: number;
  dispatchDate: string;
}

export interface AuditEntry {
  id: string;
  user: string;
  action: string;
  module: string;
  datetime: string;
  ip: string;
}

// ---------- GENERATORS ----------
export const SALES: SalesRecord[] = Array.from({ length: 50 }, (_, i) => {
  const p = PARTIES[i % PARTIES.length];
  const fert = FERTILIZERS[i % FERTILIZERS.length];
  const fr = FERT_RATES[fert];
  const bags = 10 + Math.floor(r(i + 1) * 80);
  const amount = +(bags * fr.price).toFixed(2);
  const cgst = +(amount * 0.025).toFixed(2);
  const sgst = +(amount * 0.025).toFixed(2);
  const total = +(amount + cgst + sgst).toFixed(2);
  const margin = +(bags * fr.margin).toFixed(2);
  const subsidy = +(bags * fr.subsidy).toFixed(2);
  const netAmount = +(total + margin - subsidy).toFixed(2);
  const pStatus: PaymentStatus =
    i % 11 === 0 ? "overdue" : i % 7 === 0 ? "partial" : i % 5 === 0 ? "pending" : "paid";
  const paid = pStatus === "paid" ? total : pStatus === "partial" ? +(total * 0.4).toFixed(2) : 0;
  return {
    id: `S${i + 1}`,
    invoiceNo: `HMF/2026-27/${String(i + 1).padStart(4, "0")}`,
    fy: "2026-27",
    date: dayOffset(i % 60),
    area: AREAS[i % AREAS.length],
    warehouse: WAREHOUSES[i % WAREHOUSES.length],
    party: p.name,
    partyGst: p.gst,
    fertilizer: fert,
    bags,
    rate: fr.price,
    amount,
    cgst,
    sgst,
    total,
    marginRate: fr.margin,
    margin,
    subsidy,
    netAmount,
    paymentStatus: pStatus,
    paid,
    pending: +(total - paid).toFixed(2),
    createdBy: ["Suresh K.", "Ramesh L.", "Naveen P.", "Anita S."][i % 4],
    approvedBy: ["A.K. Sharma", "R.K. Verma", "M.L. Thakur"][i % 3],
  };
});

export const PURCHASES: PurchaseRecord[] = Array.from({ length: 30 }, (_, i) => {
  const fert = FERTILIZERS[i % FERTILIZERS.length];
  const fr = FERT_RATES[fert];
  const bags = 200 + Math.floor(r(i + 100) * 600);
  const rate = +(fr.price * 0.85).toFixed(2);
  return {
    id: `P${i + 1}`,
    date: dayOffset(i * 2),
    company: COMPANIES[i % COMPANIES.length],
    fertilizer: fert,
    truckNo: `HP-${10 + (i % 90)}-${String(1000 + i).slice(-4)}`,
    grNo: `GR-2026-${String(i + 1).padStart(5, "0")}`,
    bags,
    rate,
    amount: +(bags * rate).toFixed(2),
    warehouse: WAREHOUSES[i % WAREHOUSES.length],
    receivedBy: ["Suresh K.", "Ramesh L.", "Naveen P."][i % 3],
    status: i % 8 === 0 ? "pending" : i % 13 === 0 ? "rejected" : "approved",
  };
});

export const STOCK_LEDGER: StockLedgerRow[] = (() => {
  const rows: StockLedgerRow[] = [];
  let id = 1;
  for (let d = 0; d < 14; d++) {
    for (const wh of WAREHOUSES) {
      for (const fert of FERTILIZERS) {
        const opening = 500 + Math.floor(r(id) * 1500);
        const incoming = Math.floor(r(id + 7) * 400);
        const sold = Math.floor(r(id + 13) * 350);
        const transfer = Math.floor(r(id + 19) * 50);
        const damaged = Math.floor(r(id + 23) * 10);
        rows.push({
          id: `SL${id++}`,
          date: dayOffset(d),
          area: AREAS[WAREHOUSES.indexOf(wh) % AREAS.length],
          warehouse: wh,
          fertilizer: fert,
          opening,
          incoming,
          sold,
          transfer,
          damaged,
          closing: opening + incoming - sold - transfer - damaged,
        });
      }
    }
  }
  return rows;
})();

export const SUBSIDIES: SubsidyRecord[] = Array.from({ length: 20 }, (_, i) => {
  const s = SALES[i];
  const status: SubsidyStatus = i % 5 === 0 ? "Pending" : i % 7 === 0 ? "Partial" : "Released";
  const pending = status === "Released" ? 0 : status === "Partial" ? +(s.subsidy * 0.4).toFixed(2) : s.subsidy;
  return {
    id: `SUB${i + 1}`,
    invoiceNo: s.invoiceNo,
    party: s.party,
    fertilizer: s.fertilizer,
    bags: s.bags,
    amount: s.subsidy,
    status,
    releaseDate: status === "Released" ? dayOffset(i + 2) : undefined,
    pending,
  };
});

export const EXPENSES: ExpenseRecord[] = (() => {
  const types = ["Labour", "Diesel", "Truck Freight", "Loading", "Unloading", "Electricity", "Miscellaneous"];
  return Array.from({ length: 40 }, (_, i) => ({
    id: `EX${i + 1}`,
    date: dayOffset(i),
    type: types[i % types.length],
    area: AREAS[i % AREAS.length],
    warehouse: WAREHOUSES[i % WAREHOUSES.length],
    amount: 500 + Math.floor(r(i + 30) * 12000),
    approvedBy: ["A.K. Sharma", "R.K. Verma"][i % 2],
    remarks: ["Verified", "Approved with note", "Routine"][i % 3],
  }));
})();

export const DEALERS = PARTIES.map((p, i) => ({
  id: `D${i + 1}`,
  name: p.name,
  gst: p.gst,
  creditLimit: p.credit,
  outstanding: Math.floor(r(i + 200) * p.credit),
  contact: `+91 98050 ${10000 + i}`,
  area: AREAS[i % AREAS.length],
}));

export function partyLedger(party: string): DealerLedgerRow[] {
  const list = SALES.filter((s) => s.party === party);
  let bal = 0;
  const rows: DealerLedgerRow[] = [{ date: dayOffset(90), voucher: "Opening", invoiceNo: "—", debit: 0, credit: 0, balance: 0 }];
  list
    .sort((a, b) => a.date.localeCompare(b.date))
    .forEach((s) => {
      bal += s.total;
      rows.push({ date: s.date, voucher: "Sales", invoiceNo: s.invoiceNo, debit: s.total, credit: 0, balance: bal });
      if (s.paid > 0) {
        bal -= s.paid;
        rows.push({ date: s.date, voucher: "Receipt", invoiceNo: s.invoiceNo, debit: 0, credit: s.paid, balance: bal });
      }
    });
  return rows;
}

export const CASH_BOOK: CashBookEntry[] = (() => {
  let bal = 250000;
  return Array.from({ length: 30 }, (_, i) => {
    const isCredit = i % 3 === 0;
    const amt = 1000 + Math.floor(r(i + 50) * 20000);
    const debit = isCredit ? 0 : amt;
    const credit = isCredit ? amt : 0;
    bal += debit - credit;
    return {
      id: `CB${i + 1}`,
      date: dayOffset(29 - i),
      voucher: `V${String(i + 1).padStart(4, "0")}`,
      particulars: isCredit
        ? ["Cash Sale", "Receipt from Dealer", "Subsidy Receipt"][i % 3]
        : ["Labour Payment", "Diesel Expense", "Freight Paid", "Office Expense"][i % 4],
      debit,
      credit,
      balance: bal,
    };
  });
})();

export const BANK_BOOK: BankEntry[] = (() => {
  const banks = ["SBI - 0345", "PNB - 7762", "HDFC - 1198", "Canara - 5523"];
  const types: BankEntry["txnType"][] = ["NEFT", "RTGS", "UPI", "Cheque"];
  let bal = 1200000;
  return Array.from({ length: 30 }, (_, i) => {
    const isDeposit = i % 2 === 0;
    const amt = 5000 + Math.floor(r(i + 80) * 80000);
    const deposit = isDeposit ? amt : 0;
    const withdrawal = isDeposit ? 0 : amt;
    bal += deposit - withdrawal;
    return {
      id: `BK${i + 1}`,
      date: dayOffset(29 - i),
      bank: banks[i % banks.length],
      txnType: types[i % types.length],
      utr: `UTR${1000000 + i * 137}`,
      deposit,
      withdrawal,
      balance: bal,
    };
  });
})();

export const CDN_NOTES: CreditDebitNote[] = Array.from({ length: 15 }, (_, i) => ({
  id: `CDN${i + 1}`,
  noteNo: `${i % 2 === 0 ? "CN" : "DN"}/2026-27/${String(i + 1).padStart(3, "0")}`,
  type: i % 2 === 0 ? "Credit" : "Debit",
  party: PARTIES[i % PARTIES.length].name,
  fertilizer: FERTILIZERS[i % FERTILIZERS.length],
  amount: 1000 + Math.floor(r(i + 11) * 25000),
  reason: ["Damaged bags", "Quantity mismatch", "Quality return", "Rate adjustment"][i % 4],
  date: dayOffset(i * 2),
}));

export const RETURNS: ReturnRecord[] = Array.from({ length: 12 }, (_, i) => {
  const s = SALES[i + 5];
  const bags = 1 + Math.floor(r(i + 19) * 8);
  return {
    id: `RT${i + 1}`,
    returnId: `RET/2026-27/${String(i + 1).padStart(3, "0")}`,
    invoiceNo: s.invoiceNo,
    fertilizer: s.fertilizer,
    bags,
    reason: ["Wet bag", "Torn bag", "Wrong product", "Quality issue"][i % 4],
    warehouse: s.warehouse,
    adjustment: +(bags * s.rate).toFixed(2),
    date: dayOffset(i),
  };
});

export const STOCK_ADJUSTMENTS: StockAdjustment[] = Array.from({ length: 15 }, (_, i) => {
  const system = 500 + Math.floor(r(i + 31) * 800);
  const physical = system - Math.floor(r(i + 43) * 20);
  return {
    id: `SA${i + 1}`,
    adjId: `ADJ/2026-27/${String(i + 1).padStart(3, "0")}`,
    fertilizer: FERTILIZERS[i % FERTILIZERS.length],
    warehouse: WAREHOUSES[i % WAREHOUSES.length],
    systemStock: system,
    physicalStock: physical,
    variance: physical - system,
    approvedBy: ["A.K. Sharma", "R.K. Verma"][i % 2],
    date: dayOffset(i * 3),
  };
});

export const TRANSPORT: TransportExpense[] = Array.from({ length: 20 }, (_, i) => ({
  id: `TR${i + 1}`,
  truckNo: `HP-${10 + (i % 90)}-${String(2000 + i).slice(-4)}`,
  driver: ["Ramu Singh", "Mohan Lal", "Hari Prakash", "Suresh Yadav", "Karan Verma"][i % 5],
  route: [
    "Una → Amb",
    "Shimla → Theog",
    "Mandi → Rampur",
    "Solan → Dhalli",
    "Kangra → Una",
  ][i % 5],
  freight: 3000 + Math.floor(r(i + 60) * 12000),
  diesel: 2500 + Math.floor(r(i + 70) * 8000),
  dispatchDate: dayOffset(i),
}));

export const AUDIT_LOGS: AuditEntry[] = Array.from({ length: 60 }, (_, i) => ({
  id: `AL${i + 1}`,
  user: ["acc@himfed", "A.K. Sharma", "R.K. Verma", "M.L. Thakur"][i % 4],
  action: ["Entry Created", "Entry Edited", "Entry Approved", "Entry Rejected", "Export CSV", "Export PDF", "Voucher Created"][i % 7],
  module: ["Sales Ledger", "Purchase", "GST", "Subsidy", "Cash Book", "Bank Book", "Expenses"][i % 7],
  datetime: new Date(Date.now() - i * 3600 * 1000 * 2).toLocaleString("en-IN"),
  ip: `192.168.1.${10 + (i % 245)}`,
}));

// ---------- Helpers ----------
export const fmt = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;
export const fmt2 = (n: number) => `₹${n.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

export function downloadCSV(filename: string, rows: Record<string, any>[]) {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const csv = [
    headers.join(","),
    ...rows.map((r) =>
      headers.map((h) => `"${String(r[h] ?? "").replace(/"/g, '""')}"`).join(",")
    ),
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
}

export function printHTML(title: string, body: string) {
  const w = window.open("", "_blank", "width=1200,height=800");
  if (!w) return;
  w.document.write(`<html><head><title>${title}</title>
  <style>
    body{font-family:Georgia,serif;padding:18px;color:#111}
    h2{text-align:center;margin:0}
    .sub{text-align:center;font-size:12px;margin:4px 0 12px}
    table{width:100%;border-collapse:collapse;font-size:11px;margin-top:8px}
    th,td{border:1px solid #444;padding:4px 6px;text-align:left}
    th{background:#eaeaea}
    tfoot td{font-weight:bold;background:#f5f5f5}
  </style></head><body>
  <h2>HIMFED — ${title}</h2>
  <div class="sub">Himachal Pradesh State Cooperative Marketing &amp; Consumers Federation Ltd. · Generated ${new Date().toLocaleString()}</div>
  ${body}
  </body></html>`);
  w.document.close();
  w.focus();
  w.print();
}

// Aggregates for dashboard
export function dashboardMetrics() {
  const today = new Date().toISOString().slice(0, 10);
  const month = new Date().toISOString().slice(0, 7);
  const sToday = SALES.filter((s) => s.date === today).reduce((a, b) => a + b.total, 0);
  const sMonth = SALES.filter((s) => s.date.startsWith(month)).reduce((a, b) => a + b.total, 0);
  const gst = SALES.reduce((a, b) => a + b.cgst + b.sgst, 0);
  const pendingSubsidy = SUBSIDIES.filter((s) => s.status !== "Released").reduce((a, b) => a + b.pending, 0);
  const outstanding = SALES.reduce((a, b) => a + b.pending, 0);
  const stockValue = STOCK_LEDGER
    .filter((r) => r.date === STOCK_LEDGER[0].date)
    .reduce((a, b) => a + b.closing * (FERT_RATES[b.fertilizer]?.price || 500), 0);
  const pendingApprovals =
    SALES.filter((s) => s.paymentStatus === "pending").length +
    PURCHASES.filter((p) => p.status === "pending").length;
  const margin = SALES.reduce((a, b) => a + b.margin, 0);
  return { sToday, sMonth, gst, pendingSubsidy, outstanding, stockValue, pendingApprovals, margin };
}

export function monthlySalesChart() {
  const map = new Map<string, number>();
  SALES.forEach((s) => {
    const k = s.date.slice(0, 7);
    map.set(k, (map.get(k) || 0) + s.total);
  });
  return Array.from(map.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([month, value]) => ({ month, value: Math.round(value) }));
}

export function byKey<T>(arr: T[], keyFn: (x: T) => string, valFn: (x: T) => number) {
  const m = new Map<string, number>();
  arr.forEach((x) => m.set(keyFn(x), (m.get(keyFn(x)) || 0) + valFn(x)));
  return Array.from(m.entries()).map(([name, value]) => ({ name, value: Math.round(value) }));
}

export { FERT_RATES, PARTIES };
