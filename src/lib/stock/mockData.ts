import { DailyStockEntry, SalesInvoice, TaxConfig } from "./types";

// Default tax config per product (overridable)
export const taxConfigs: TaxConfig[] = [
  { productId: "fp1", cgst: 2.5, sgst: 2.5, distributionMargin: 5 },
  { productId: "fp2", cgst: 2.5, sgst: 2.5, distributionMargin: 5 },
  { productId: "fp3", cgst: 2.5, sgst: 2.5, distributionMargin: 8 },
  { productId: "fp4", cgst: 2.5, sgst: 2.5, distributionMargin: 8 },
  { productId: "fp5", cgst: 2.5, sgst: 2.5, distributionMargin: 5 },
  { productId: "fp6", cgst: 2.5, sgst: 2.5, distributionMargin: 10 },
  { productId: "fp7", cgst: 2.5, sgst: 2.5, distributionMargin: 6 },
];

const today = new Date();
const d = (n: number) => {
  const dt = new Date(today);
  dt.setDate(dt.getDate() - n);
  return dt.toISOString().slice(0, 10);
};
const ts = (n: number, h = 10) => {
  const dt = new Date(today);
  dt.setDate(dt.getDate() - n);
  dt.setHours(h, 15, 0, 0);
  return dt.toISOString();
};

// 50+ realistic stock entries
const seedEntries: Omit<DailyStockEntry, "id" | "entryCode" | "totalAmount" | "createdAt">[] = [
  // Today
  { areaId: "a1", warehouseId: "w1", depotDate: d(0), grNumber: "GR-900101", truckNumber: "HP-03-A-5421", companyId: "fc1", productId: "fp1", quantity: 240, ratePerBag: 266.5, driverName: "Karam Singh", remarks: "Sealed.", createdBy: "u6", status: "approved", approvedBy: "u2", approvedAt: ts(0, 12), reviewRemarks: "Verified." },
  { areaId: "a1", warehouseId: "w1", depotDate: d(0), grNumber: "GR-900102", truckNumber: "HP-13-B-1124", companyId: "fc2", productId: "fp3", quantity: 180, ratePerBag: 1350, driverName: "Rakesh Yadav", remarks: "2 torn bags.", createdBy: "u6", status: "pending" },
  { areaId: "a2", warehouseId: "w3", depotDate: d(0), grNumber: "GR-900103", truckNumber: "HP-21-C-7890", companyId: "fc3", productId: "fp4", quantity: 320, ratePerBag: 1470, driverName: "Mohan Lal", remarks: "OK", createdBy: "u8", status: "approved", approvedBy: "u3", approvedAt: ts(0, 14), reviewRemarks: "OK" },
  { areaId: "a3", warehouseId: "w5", depotDate: d(0), grNumber: "GR-900104", truckNumber: "HP-05-D-2233", companyId: "fc1", productId: "fp2", quantity: 200, ratePerBag: 266.5, driverName: "Pankaj Kumar", remarks: "Seed shed.", createdBy: "u9", status: "pending" },
  { areaId: "a4", warehouseId: "w6", depotDate: d(0), grNumber: "GR-900105", truckNumber: "HP-37-E-4451", companyId: "fc6", productId: "fp6", quantity: 150, ratePerBag: 1700, driverName: "Sanjay Thakur", remarks: "Verified.", createdBy: "u10", status: "approved", approvedBy: "u5", approvedAt: ts(0, 16), reviewRemarks: "OK" },
  // -1 day
  { areaId: "a1", warehouseId: "w2", depotDate: d(1), grNumber: "GR-900106", truckNumber: "HP-03-F-9988", companyId: "fc1", productId: "fp1", quantity: 400, ratePerBag: 266.5, driverName: "Inder Sharma", remarks: "North shed.", createdBy: "u7", status: "approved", approvedBy: "u2", approvedAt: ts(1, 11), reviewRemarks: "OK" },
  { areaId: "a2", warehouseId: "w3", depotDate: d(1), grNumber: "GR-900107", truckNumber: "HP-13-H-7766", companyId: "fc6", productId: "fp6", quantity: 220, ratePerBag: 1700, driverName: "Vinod Saini", remarks: "No damage.", createdBy: "u8", status: "approved", approvedBy: "u3", approvedAt: ts(1, 13), reviewRemarks: "OK" },
  { areaId: "a3", warehouseId: "w5", depotDate: d(1), grNumber: "GR-900108", truckNumber: "HP-11-G-3322", companyId: "fc5", productId: "fp7", quantity: 130, ratePerBag: 970, driverName: "Hari Om", remarks: "OK", createdBy: "u9", status: "rejected", approvedBy: "u4", approvedAt: ts(1, 15), reviewRemarks: "GR mismatch — resubmit." },
  { areaId: "a4", warehouseId: "w6", depotDate: d(1), grNumber: "GR-900109", truckNumber: "HP-37-J-1212", companyId: "fc2", productId: "fp3", quantity: 90, ratePerBag: 1350, driverName: "Manish Rana", remarks: "Topup.", createdBy: "u10", status: "approved", approvedBy: "u5", approvedAt: ts(1, 17), reviewRemarks: "OK" },
  // -2..-15 days, spread
  ...Array.from({ length: 42 }, (_, i) => {
    const day = 2 + i % 14;
    const areas = ["a1", "a2", "a3", "a4"];
    const wh = { a1: ["w1", "w2"], a2: ["w3", "w4"], a3: ["w5"], a4: ["w6"] } as const;
    const staff: any = { w1: "u6", w2: "u7", w3: "u8", w4: "u8", w5: "u9", w6: "u10" };
    const off: any = { a1: "u2", a2: "u3", a3: "u4", a4: "u5" };
    const products = [
      { id: "fp1", c: "fc1", r: 266.5 },
      { id: "fp3", c: "fc2", r: 1350 },
      { id: "fp4", c: "fc3", r: 1470 },
      { id: "fp6", c: "fc6", r: 1700 },
      { id: "fp7", c: "fc5", r: 970 },
    ];
    const a = areas[i % 4];
    const w = wh[a as keyof typeof wh][i % wh[a as keyof typeof wh].length];
    const p = products[i % products.length];
    const status: any = i % 5 === 0 ? "pending" : i % 7 === 0 ? "rejected" : "approved";
    return {
      areaId: a, warehouseId: w, depotDate: d(day),
      grNumber: `GR-9002${String(10 + i).padStart(2, "0")}`,
      truckNumber: `HP-${String(10 + i % 70).padStart(2, "0")}-X-${1000 + i}`,
      companyId: p.c, productId: p.id, quantity: 60 + (i * 13) % 400,
      ratePerBag: p.r, driverName: ["Karam Singh", "Vinod", "Hari", "Mohan", "Sanjay"][i % 5],
      remarks: ["Verified", "Unloaded", "OK", "Sealed"][i % 4],
      createdBy: staff[w], status,
      ...(status !== "pending" ? { approvedBy: off[a], approvedAt: ts(day, 12), reviewRemarks: status === "approved" ? "OK" : "Mismatch" } : {}),
    } as Omit<DailyStockEntry, "id" | "entryCode" | "totalAmount" | "createdAt">;
  }),
];

export const stockEntries: DailyStockEntry[] = seedEntries.map((s, i) => ({
  ...s,
  id: `se${i + 1}`,
  entryCode: `SE-2025-${String(i + 1).padStart(4, "0")}`,
  totalAmount: s.quantity * s.ratePerBag,
  createdAt: ts(0, 9),
}));

// 30+ sales invoices
const customers = [
  { name: "Ram Krishan", gst: "06ABCDE1234F1Z5", addr: "Village Theog, Shimla" },
  { name: "Suresh Kumar", gst: "06FGHIJ5678K1Z9", addr: "Solan Mandi" },
  { name: "Anita Devi", gst: "", addr: "Kullu Bypass" },
  { name: "Mohan Singh", gst: "06KLMNO9012P1Z3", addr: "Kangra Bazaar" },
  { name: "Coop Society Mandi", gst: "06PQRST3456U1Z7", addr: "Sundernagar" },
  { name: "Bharat Krishi Kendra", gst: "06VWXYZ7890A1Z1", addr: "Dharamshala" },
];

export const salesInvoices: SalesInvoice[] = Array.from({ length: 32 }, (_, i) => {
  const day = i % 20;
  const a = ["a1", "a2", "a3", "a4"][i % 4];
  const wh = { a1: "w1", a2: "w3", a3: "w5", a4: "w6" } as any;
  const products = [
    { id: "fp1", r: 266.5, dm: 5 },
    { id: "fp3", r: 1350, dm: 8 },
    { id: "fp4", r: 1470, dm: 8 },
    { id: "fp6", r: 1700, dm: 10 },
  ];
  const p = products[i % products.length];
  const qty = 5 + (i * 3) % 40;
  const sub = qty * p.r;
  const cgst = +(sub * 0.025).toFixed(2);
  const sgst = +(sub * 0.025).toFixed(2);
  const dm = qty * p.dm;
  const raw = sub + cgst + sgst + dm;
  const grand = Math.round(raw);
  const c = customers[i % customers.length];
  return {
    id: `inv${i + 1}`,
    invoiceNumber: `INV/2026-27/${String(i + 1).padStart(4, "0")}`,
    financialYear: "2026-27",
    invoiceDate: d(day),
    customerName: c.name,
    customerGst: c.gst,
    customerAddress: c.addr,
    driverName: ["Driver A", "Driver B", "Driver C"][i % 3],
    areaId: a,
    warehouseId: wh[a],
    lines: [{ productId: p.id, qty, rate: p.r, amount: sub }],
    subTotal: sub,
    cgstAmount: cgst,
    sgstAmount: sgst,
    distributionMargin: dm,
    roundOff: +(grand - raw).toFixed(2),
    grandTotal: grand,
    createdBy: ["u6", "u8", "u9", "u10", "u11"][i % 5],
    createdAt: ts(day, 11),
  };
});
