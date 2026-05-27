export type SalesStatus = "pending" | "approved" | "rejected";

export interface SalesEntry {
  id: string;
  billNo: string;
  financialYear: string;
  date: string;            // yyyy-mm-dd
  areaId: string;
  warehouseCode: string;   // UNA Main / Amb / Haroli / Bangana
  partyName: string;
  partyGst: string;
  partyMobile: string;
  fertilizer: string;      // UREA / NPK 16:16 / NPK 12:32
  bags: number;
  pricePerBag: number;
  amount: number;          // bags * price
  cgstPct: number;
  sgstPct: number;
  cgstAmount: number;
  sgstAmount: number;
  total: number;           // amount + cgst + sgst
  marginRate: number;      // per bag
  margin: number;          // bags * marginRate
  subsidy: number;
  netAmount: number;       // total + margin - subsidy
  status: SalesStatus;
  createdBy: string;
  createdAt: string;
}
