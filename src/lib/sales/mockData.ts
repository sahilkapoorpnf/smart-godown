import { SalesEntry } from "./types";

const parties = [
  { name: "Lovely Seed Store", gst: "02ABCDE1234F1Z5", mobile: "+91 98050 10001" },
  { name: "Kisan Seva Kendra", gst: "02FGHIJ5678K1Z9", mobile: "+91 98050 10002" },
  { name: "Pandit Seed Store", gst: "02KLMNO9012P1Z3", mobile: "+91 98050 10003" },
  { name: "Swastik Seed & Pesticide", gst: "02PQRST3456U1Z7", mobile: "+91 98050 10004" },
  { name: "Tilak Raj", gst: "", mobile: "+91 98050 10005" },
];

const fertilizers = [
  { name: "UREA", price: 266.5, margin: 5, subsidyPerBag: 1750 },
  { name: "NPK 16:16", price: 1470, margin: 8, subsidyPerBag: 800 },
  { name: "NPK 12:32", price: 1700, margin: 10, subsidyPerBag: 950 },
];

const warehouses = [
  { code: "UNA Main", areaId: "a4" },
  { code: "Amb", areaId: "a4" },
  { code: "Haroli", areaId: "a4" },
  { code: "Bangana", areaId: "a4" },
];

const d = (n: number) => {
  const dt = new Date();
  dt.setDate(dt.getDate() - n);
  return dt.toISOString().slice(0, 10);
};

export const salesEntries: SalesEntry[] = Array.from({ length: 50 }, (_, i) => {
  const p = parties[i % parties.length];
  const f = fertilizers[i % fertilizers.length];
  const wh = warehouses[i % warehouses.length];
  const bags = 5 + (i * 7) % 60;
  const amount = +(bags * f.price).toFixed(2);
  const cgstPct = 2.5;
  const sgstPct = 2.5;
  const cgstAmount = +(amount * cgstPct / 100).toFixed(2);
  const sgstAmount = +(amount * sgstPct / 100).toFixed(2);
  const total = +(amount + cgstAmount + sgstAmount).toFixed(2);
  const marginRate = f.margin;
  const margin = +(bags * marginRate).toFixed(2);
  const subsidy = +(bags * f.subsidyPerBag).toFixed(2);
  const netAmount = +(total + margin - subsidy).toFixed(2);
  const status: any = i % 9 === 0 ? "pending" : i % 17 === 0 ? "rejected" : "approved";
  return {
    id: `sl${i + 1}`,
    billNo: `HMF/2026-27/${String(i + 1).padStart(4, "0")}`,
    financialYear: "2026-27",
    date: d(i % 28),
    areaId: wh.areaId,
    warehouseCode: wh.code,
    partyName: p.name,
    partyGst: p.gst,
    partyMobile: p.mobile,
    fertilizer: f.name,
    bags,
    pricePerBag: f.price,
    amount,
    cgstPct,
    sgstPct,
    cgstAmount,
    sgstAmount,
    total,
    marginRate,
    margin,
    subsidy,
    netAmount,
    status,
    createdBy: ["u6", "u7", "u8", "u9", "u10"][i % 5],
    createdAt: new Date().toISOString(),
  };
});

export const FERTILIZER_MASTER = fertilizers;
export const WAREHOUSE_CODES = warehouses;
export const PARTY_LIST = parties;
