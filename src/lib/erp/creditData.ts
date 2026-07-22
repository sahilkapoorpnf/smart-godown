// ================================================================
// Department Credit & Outstanding — extended static data + helpers
// Reference date for pending-days computation
// ================================================================
import { departmentsStatic, vehiclesStatic, DepartmentRow, VehicleRow, PumpTxnRow, pumpTxnsStatic, nozzlesStatic } from "./staticTallyData";

export const TODAY = "2026-07-22";
export const CREDIT_PERIOD_DAYS = 15;

export type HealthStatus = "green" | "yellow" | "red";
export type PaymentStatus = "Paid" | "Partial" | "Pending" | "Overdue";
export type PaymentType = "Paid" | "Credit";

// -------- Extended Departments (reach 30) ------------------------
const extraDeptSeed: Array<Partial<DepartmentRow> & { name: string; alias: string; district: string }> = [
  { name: "HP Irrigation & Public Health", alias: "HP-IPH", district: "Shimla" },
  { name: "HP Tourism Development Corp", alias: "HPTDC", district: "Shimla" },
  { name: "HP Housing Board", alias: "HP-HB", district: "Shimla" },
  { name: "HP Excise & Taxation Dept", alias: "HP-ETD", district: "Shimla" },
  { name: "HP Fisheries Department", alias: "HP-Fish", district: "Bilaspur" },
  { name: "HP Sericulture Department", alias: "HP-Seri", district: "Kangra" },
  { name: "HP Animal Husbandry Dept", alias: "HP-AH", district: "Solan" },
  { name: "HP Horticulture Dept", alias: "HP-Hort", district: "Shimla" },
  { name: "HP Higher Education", alias: "HP-HED", district: "Shimla" },
  { name: "HP Elementary Education", alias: "HP-EED", district: "Shimla" },
  { name: "HP Fire Services", alias: "HP-Fire", district: "Shimla" },
  { name: "HP State Civil Supplies Corp", alias: "HPSCSC", district: "Shimla" },
  { name: "HP Vidhan Sabha Secretariat", alias: "HP-VidhanSabha", district: "Shimla" },
  { name: "HP State Pollution Control Bd", alias: "HP-PCB", district: "Shimla" },
  { name: "HP Youth Services & Sports", alias: "HP-YSS", district: "Shimla" },
  { name: "HP Language & Culture Dept", alias: "HP-LCD", district: "Shimla" },
  { name: "HP State Warehousing Corp", alias: "HPSWC", district: "Solan" },
  { name: "HP Milkfed Cooperative", alias: "HP-Milkfed", district: "Kangra" },
  { name: "HP Legal Metrology Dept", alias: "HP-LMD", district: "Shimla" },
  { name: "HP Ayurveda Department", alias: "HP-Ayush", district: "Shimla" },
];

export const departmentsExt: DepartmentRow[] = [
  ...departmentsStatic,
  ...extraDeptSeed.map((d, i) => {
    const id = `DPT-${String(11 + i).padStart(3, "0")}`;
    return {
      id,
      code: String(1380285 + i),
      name: d.name!,
      alias: d.alias!,
      under: "Sundry Debtors",
      billByBill: "Yes",
      creditPeriod: "15",
      address: `${d.name}, HP`,
      district: d.district!,
      state: "Himachal Pradesh",
      pincode: "17100" + ((i % 9) + 1),
      contactPerson: "Sr. Accounts Officer",
      phone: `+91 177 26${String(20000 + i * 37).padStart(5, "0")}`,
      email: `${d.alias!.toLowerCase().replace(/[^a-z0-9]/g, "")}@hp.gov.in`,
      provideBankDetails: (i % 2 === 0 ? "Yes" : "No") as "Yes" | "No",
      bankName: i % 2 === 0 ? "State Bank of India" : "",
      bankAccountNo: i % 2 === 0 ? String(35000000000 + i * 991) : "",
      ifsc: i % 2 === 0 ? "SBIN0000469" : "",
      panNo: `AAAG${String.fromCharCode(65 + (i % 26))}${1000 + i}K`,
      registrationType: "Government",
      gstin: i % 3 === 0 ? `02AAAG${String.fromCharCode(65 + (i % 26))}${1000 + i}K1ZR` : "",
      setAlterGst: "No",
      openingBalance: 100000 + i * 43127,
      drCr: "Dr",
      status: "Active",
    } as DepartmentRow;
  }),
];

// -------- Extended Vehicles (ensure each dept has 1-3 vehicles) --
const extraVehicles: VehicleRow[] = [];
for (let i = 11; i <= 30; i++) {
  const deptId = `DPT-${String(i).padStart(3, "0")}`;
  const dept = departmentsExt.find((d) => d.id === deptId)!;
  const nVeh = 1 + (i % 3);
  for (let v = 0; v < nVeh; v++) {
    const vid = `VEH-${String(15 + (i - 11) * 3 + v + 1).padStart(3, "0")}`;
    const fuel = v % 2 === 0 ? "HSD" : "ULP";
    const types = ["Car", "Jeep", "SUV", "Truck", "Bus", "Motorcycle", "Tractor"] as const;
    extraVehicles.push({
      id: vid,
      vehicleNumber: `HP-${String(3 + (i % 10)).padStart(2, "0")}-${String.fromCharCode(65 + (i % 26))}-${1000 + i * 11 + v}`,
      departmentId: deptId,
      departmentName: dept.name,
      vehicleType: types[(i + v) % types.length],
      fuelType: fuel,
      driverName: `Driver ${dept.alias} ${v + 1}`,
      driverPhone: `+91 9${String(4180000000 + i * 97 + v).slice(0, 9)}`,
      status: "Active",
    });
  }
}
export const vehiclesExt: VehicleRow[] = [...vehiclesStatic, ...extraVehicles];

// -------- Deterministic RNG ---------------------------------------
function mulberry32(a: number) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = a; t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(20260722);
const pick = <T,>(arr: T[]) => arr[Math.floor(rand() * arr.length)];

function daysAgo(iso: string, from = TODAY) {
  const a = new Date(iso).getTime();
  const b = new Date(from).getTime();
  return Math.floor((b - a) / 86400000);
}
function isoMinusDays(days: number, from = TODAY) {
  const d = new Date(from); d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString().slice(0, 10);
}
function isoPlusDays(iso: string, days: number) {
  const d = new Date(iso); d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

// -------- Extended Pump Transaction row (with payment fields) -----
export interface PumpTxnExt extends PumpTxnRow {
  paymentType: PaymentType;         // Paid = cash/card/upi; Credit = govt dept
  paidAmount: number;
  outstanding: number;
  dueDate: string;
  pendingDays: number;              // 0 for paid or if within same day
  paymentStatus: PaymentStatus;     // Paid | Partial | Pending | Overdue
  invoiceNo: string;                // same as billNo (alias)
}

const operators = ["Anil Chauhan", "Pooja Devi", "Rohit Kashyap", "Manoj Verma"];
const shifts = ["Morning", "Evening", "Night"] as const;

function decorate(base: PumpTxnRow): PumpTxnExt {
  const isCredit = base.mode === "Credit";
  const age = daysAgo(base.date);
  let paidAmount = 0;
  let paymentStatus: PaymentStatus = "Paid";
  if (isCredit) {
    // Distribution: 40% paid, 20% partial, 25% pending (within 15d), 15% overdue
    const r = rand();
    if (r < 0.4)      { paidAmount = base.amount; paymentStatus = "Paid"; }
    else if (r < 0.6) { paidAmount = Math.round(base.amount * (0.3 + rand() * 0.4)); paymentStatus = "Partial"; }
    else if (r < 0.85){ paidAmount = 0; paymentStatus = "Pending"; }
    else              { paidAmount = 0; paymentStatus = "Overdue"; }
  } else {
    paidAmount = base.amount;
  }
  const outstanding = Math.max(0, base.amount - paidAmount);
  const dueDate = isoPlusDays(base.date, CREDIT_PERIOD_DAYS);
  let pendingDays = 0;
  if (outstanding > 0) {
    pendingDays = age;
    if (pendingDays > CREDIT_PERIOD_DAYS) paymentStatus = "Overdue";
    else if (paymentStatus === "Overdue") paymentStatus = "Pending";
  }
  return { ...base, paymentType: isCredit ? "Credit" : "Paid", paidAmount, outstanding, dueDate, pendingDays, paymentStatus, invoiceNo: base.billNo };
}

// -------- Generate 485 additional pump transactions ---------------
const generated: PumpTxnRow[] = [];
const nozzles = nozzlesStatic;
const creditDepts = departmentsExt.filter((d) => d.status === "Active");
let billSeq = 200;
for (let i = 0; i < 485; i++) {
  const age = Math.floor(rand() * 80); // 0..80 days back
  const date = isoMinusDays(age);
  const isCredit = rand() < 0.62;
  const mode = isCredit ? "Credit" : (pick(["Cash", "Card/POS", "UPI/QR"]) as any);
  const noz = pick(nozzles);
  const qty = Math.round((10 + rand() * 90) * 100) / 100;
  const rate = noz.product === "HSD" ? 102.65 : 96.72;
  const amount = Math.round(qty * rate);
  let vehicleId = "", vehicleNumber = "", departmentId = "", departmentName = "", customerCode = "";
  if (isCredit) {
    const d = pick(creditDepts);
    const dv = vehiclesExt.filter((v) => v.departmentId === d.id);
    const veh = dv.length ? pick(dv) : pick(vehiclesExt);
    vehicleId = veh.id; vehicleNumber = veh.vehicleNumber;
    departmentId = d.id; departmentName = d.name; customerCode = d.code;
  }
  billSeq++;
  generated.push({
    id: `PT-${String(100 + i).padStart(4, "0")}`,
    date,
    billNo: `HIM-26-27-${String(billSeq).padStart(4, "0")}`,
    mode,
    nozzleId: noz.id, nozzleName: noz.nozzleName, product: noz.product,
    tankId: noz.tankId, tankName: noz.tankName, godown: noz.godown,
    openingReading: 100000 + Math.floor(rand() * 200000),
    closingReading: 0, // filled below
    qty, rate, amount,
    vehicleId, vehicleNumber, departmentId, departmentName, customerCode,
    transRef: isCredit ? "" : (mode === "Cash" ? "CASH-DRAWER" : mode === "Card/POS" ? `POS-REF-${1000000 + Math.floor(rand() * 999999)}` : `UPI-${1000000000 + Math.floor(rand() * 999999999)}`),
    operator: pick(operators), shift: pick(shifts as any),
    status: "Posted",
  });
  generated[generated.length - 1].closingReading = generated[generated.length - 1].openingReading + qty;
}

export const pumpTxnsExt: PumpTxnExt[] = [...pumpTxnsStatic, ...generated].map(decorate);

// -------- Department-level derived summary ------------------------
export interface DeptSummary {
  deptId: string;
  code: string;
  name: string;
  alias: string;
  creditPeriod: number;
  txnCount: number;
  totalBilled: number;
  totalPaid: number;
  previousOutstanding: number;   // outstanding excluding last 15 days
  currentOutstanding: number;    // outstanding within last 15 days
  totalOutstanding: number;
  oldestPendingDays: number;
  oldestPendingDate: string | null;
  lastPaymentDate: string | null;
  lastPaymentAmount: number;
  health: HealthStatus;
  overdueAmount: number;
  paymentStatus: PaymentStatus;
}

// -------- Payment history -----------------------------------------
export interface PaymentRow {
  id: string;
  departmentId: string;
  departmentName: string;
  previousOutstanding: number;
  currentOutstanding: number;
  paymentDate: string;
  paymentAmount: number;
  paymentMode: "Cash" | "Cheque" | "NEFT/RTGS" | "UPI" | "DD";
  referenceNumber: string;
  receiptNumber: string;
  receivedBy: string;
  remarks: string;
}

const receivedByPool = ["Neha Gupta (Accountant)", "Sneha Kapoor (Wh Acct)", "Rakesh Sharma", "Priya Sood"];
export const paymentHistoryStatic: PaymentRow[] = [];
let receiptSeq = 5000;
for (const d of departmentsExt) {
  const dTxns = pumpTxnsExt.filter((t) => t.departmentId === d.id && t.paidAmount > 0);
  if (!dTxns.length) continue;
  const nPay = 1 + Math.floor(rand() * 3);
  let running = d.openingBalance;
  for (let i = 0; i < nPay; i++) {
    const age = Math.floor(rand() * 60);
    const amount = Math.round((5000 + rand() * 50000) / 100) * 100;
    receiptSeq++;
    const prev = running;
    running = Math.max(0, running - amount);
    paymentHistoryStatic.push({
      id: `PAY-${String(receiptSeq).padStart(5, "0")}`,
      departmentId: d.id,
      departmentName: d.name,
      previousOutstanding: prev,
      currentOutstanding: running,
      paymentDate: isoMinusDays(age),
      paymentAmount: amount,
      paymentMode: pick(["Cheque", "NEFT/RTGS", "UPI", "DD", "Cash"] as any),
      referenceNumber: `REF${Math.floor(1000000 + rand() * 9000000)}`,
      receiptNumber: `RCPT-26-27-${String(receiptSeq).padStart(4, "0")}`,
      receivedBy: pick(receivedByPool),
      remarks: pick(["Against pending bills", "Q1 clearance", "Part payment", "Full settlement", "Advance"]),
    });
  }
}
paymentHistoryStatic.sort((a, b) => b.paymentDate.localeCompare(a.paymentDate));

// -------- Helpers -------------------------------------------------
export function getDeptSummary(deptId: string): DeptSummary {
  const d = departmentsExt.find((x) => x.id === deptId)!;
  const txns = pumpTxnsExt.filter((t) => t.departmentId === deptId);
  const pays = paymentHistoryStatic.filter((p) => p.departmentId === deptId);
  const totalBilled = txns.reduce((s, t) => s + t.amount, 0);
  const totalPaid = txns.reduce((s, t) => s + t.paidAmount, 0);
  const totalOutstanding = txns.reduce((s, t) => s + t.outstanding, 0);
  const pending = txns.filter((t) => t.outstanding > 0);
  const oldest = pending.reduce<PumpTxnExt | null>((a, b) => (!a || b.pendingDays > a.pendingDays ? b : a), null);
  const currentOutstanding = pending.filter((t) => t.pendingDays <= CREDIT_PERIOD_DAYS).reduce((s, t) => s + t.outstanding, 0);
  const previousOutstanding = totalOutstanding - currentOutstanding;
  const overdueAmount = pending.filter((t) => t.pendingDays > CREDIT_PERIOD_DAYS).reduce((s, t) => s + t.outstanding, 0);
  const lastPay = pays[0] ?? null;
  let health: HealthStatus = "green";
  let paymentStatus: PaymentStatus = "Paid";
  if (totalOutstanding > 0) {
    if (oldest && oldest.pendingDays > CREDIT_PERIOD_DAYS) { health = "red"; paymentStatus = "Overdue"; }
    else { health = "yellow"; paymentStatus = "Pending"; }
  }
  return {
    deptId, code: d.code, name: d.name, alias: d.alias,
    creditPeriod: Number(d.creditPeriod) || CREDIT_PERIOD_DAYS,
    txnCount: txns.length, totalBilled, totalPaid,
    previousOutstanding, currentOutstanding, totalOutstanding, overdueAmount,
    oldestPendingDays: oldest?.pendingDays ?? 0,
    oldestPendingDate: oldest?.date ?? null,
    lastPaymentDate: lastPay?.paymentDate ?? null,
    lastPaymentAmount: lastPay?.paymentAmount ?? 0,
    health, paymentStatus,
  };
}

export function getAllDeptSummaries(): DeptSummary[] {
  return departmentsExt.map((d) => getDeptSummary(d.id));
}

export function getDeptHealthCounts() {
  const s = getAllDeptSummaries();
  return {
    green: s.filter((x) => x.health === "green").length,
    yellow: s.filter((x) => x.health === "yellow").length,
    red: s.filter((x) => x.health === "red").length,
    totalOutstanding: s.reduce((a, x) => a + x.totalOutstanding, 0),
    overdueAmount: s.reduce((a, x) => a + x.overdueAmount, 0),
    total: s.length,
  };
}

export const healthTone = (h: HealthStatus) => h === "green" ? "emerald" : h === "yellow" ? "amber" : "rose";
export const healthLabel = (h: HealthStatus) => h === "green" ? "Healthy" : h === "yellow" ? "Within Credit Period" : "Overdue";
