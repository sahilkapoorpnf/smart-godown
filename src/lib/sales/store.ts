import { useEffect, useState } from "react";
import { salesEntries as seed, FERTILIZER_MASTER, WAREHOUSE_CODES, PARTY_LIST } from "./mockData";
import { SalesEntry, SalesStatus } from "./types";

let _entries = [...seed];
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());

export function useSalesStore() {
  const [, set] = useState(0);
  useEffect(() => {
    const l = () => set((n) => n + 1);
    listeners.add(l);
    return () => { listeners.delete(l); };
  }, []);
  return { entries: _entries };
}

export function nextBillNo() {
  return `HMF/2026-27/${String(_entries.length + 1).padStart(4, "0")}`;
}

export function computeTotals(input: {
  bags: number; pricePerBag: number; cgstPct: number; sgstPct: number;
  marginRate: number; subsidy: number;
}) {
  const amount = +(input.bags * input.pricePerBag).toFixed(2);
  const cgstAmount = +(amount * input.cgstPct / 100).toFixed(2);
  const sgstAmount = +(amount * input.sgstPct / 100).toFixed(2);
  const total = +(amount + cgstAmount + sgstAmount).toFixed(2);
  const margin = +(input.bags * input.marginRate).toFixed(2);
  const netAmount = +(total + margin - input.subsidy).toFixed(2);
  return { amount, cgstAmount, sgstAmount, total, margin, netAmount };
}

export function addSalesEntry(e: Omit<SalesEntry, "id" | "billNo" | "createdAt" | "status" | "financialYear">) {
  const entry: SalesEntry = {
    ...e,
    id: `sl${Date.now()}`,
    billNo: nextBillNo(),
    financialYear: "2026-27",
    createdAt: new Date().toISOString(),
    status: "pending",
  };
  _entries = [entry, ..._entries];
  notify();
  return entry;
}

export function updateSalesEntry(id: string, patch: Partial<SalesEntry>) {
  _entries = _entries.map((e) => (e.id === id ? { ...e, ...patch } : e));
  notify();
}

export function setSalesStatus(id: string, status: SalesStatus) {
  _entries = _entries.map((e) => (e.id === id ? { ...e, status } : e));
  notify();
}

export function deleteSalesEntry(id: string) {
  _entries = _entries.filter((e) => e.id !== id);
  notify();
}

export function visibleSalesEntries(user: any): SalesEntry[] {
  if (!user) return [];
  switch (user.role) {
    case "warehouse_staff":
      // staff sees only their warehouse — map u6..u10 → assigned wh code
      const map: any = { u6: "UNA Main", u7: "Amb", u8: "Haroli", u9: "Bangana", u10: "UNA Main" };
      const wc = map[user.id];
      return _entries.filter((e) => e.warehouseCode === wc || e.createdBy === user.id);
    case "incharge":
      return _entries.filter((e) => e.areaId === user.areaId);
    default:
      return _entries;
  }
}

export function canEditFinancials(role?: string) {
  return role === "superadmin" || role === "accountant";
}

export function downloadCSV(filename: string, rows: Record<string, any>[]) {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const csv = [headers.join(","), ...rows.map((r) => headers.map((h) => `"${String(r[h] ?? "").replace(/"/g, '""')}"`).join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
}

export { FERTILIZER_MASTER, WAREHOUSE_CODES, PARTY_LIST };
