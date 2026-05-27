import { useEffect, useState } from "react";
import { stockEntries as seedEntries, salesInvoices as seedInv, taxConfigs as seedTax } from "./mockData";
import { DailyStockEntry, SalesInvoice, StockEntryStatus, TaxConfig } from "./types";
import { addLog, store as wh } from "../warehouse/store";

let _entries = [...seedEntries];
let _invoices = [...seedInv];
let _tax = [...seedTax];

const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());

export function useStockStore() {
  const [, set] = useState(0);
  useEffect(() => {
    const l = () => set((n) => n + 1);
    listeners.add(l);
    return () => { listeners.delete(l); };
  }, []);
  return { entries: _entries, invoices: _invoices, tax: _tax };
}

export const stockStore = {
  get entries() { return _entries; },
  get invoices() { return _invoices; },
  get tax() { return _tax; },
};

export const taxFor = (productId: string): TaxConfig =>
  _tax.find((t) => t.productId === productId) ?? { productId, cgst: 2.5, sgst: 2.5, distributionMargin: 5 };

export function upsertTax(t: TaxConfig) {
  _tax = _tax.some((x) => x.productId === t.productId)
    ? _tax.map((x) => (x.productId === t.productId ? t : x))
    : [..._tax, t];
  notify();
}

export function addStockEntry(input: Omit<DailyStockEntry, "id" | "entryCode" | "createdAt" | "status" | "totalAmount">) {
  const code = `SE-2025-${String(_entries.length + 1).padStart(4, "0")}`;
  if (_entries.some((e) => e.grNumber === input.grNumber)) throw new Error("GR Number must be unique");
  const entry: DailyStockEntry = {
    ...input,
    id: `se${Date.now()}`,
    entryCode: code,
    totalAmount: input.quantity * input.ratePerBag,
    createdAt: new Date().toISOString(),
    status: "pending",
  };
  _entries = [entry, ..._entries];
  const u = wh.users.find((x) => x.id === input.createdBy);
  if (u) addLog({ user: u.name, role: u.role, action: "Daily Stock Entry", target: code });
  notify();
  return entry;
}

export function reviewStockEntry(id: string, status: StockEntryStatus, reviewerId: string, remarks: string) {
  _entries = _entries.map((e) =>
    e.id === id ? { ...e, status, approvedBy: reviewerId, approvedAt: new Date().toISOString(), reviewRemarks: remarks } : e
  );
  const u = wh.users.find((x) => x.id === reviewerId);
  const e = _entries.find((x) => x.id === id);
  if (u && e) addLog({ user: u.name, role: u.role, action: `Stock ${status}`, target: e.entryCode });
  notify();
}

export function nextInvoiceNumber() {
  return `INV/2026-27/${String(_invoices.length + 1).padStart(4, "0")}`;
}

export function addInvoice(inv: Omit<SalesInvoice, "id" | "invoiceNumber" | "createdAt" | "financialYear">) {
  const invoice: SalesInvoice = {
    ...inv,
    id: `inv${Date.now()}`,
    invoiceNumber: nextInvoiceNumber(),
    financialYear: "2026-27",
    createdAt: new Date().toISOString(),
  };
  _invoices = [invoice, ..._invoices];
  const u = wh.users.find((x) => x.id === inv.createdBy);
  if (u) addLog({ user: u.name, role: u.role, action: "Generated Invoice", target: invoice.invoiceNumber });
  notify();
  return invoice;
}

// Role-aware visibility
export function visibleStockEntries(user: ReturnType<typeof wh.users.find> extends infer R ? R : null) {
  if (!user) return [] as DailyStockEntry[];
  switch ((user as any).role) {
    case "warehouse_staff":
      return _entries.filter((e) => e.warehouseId === (user as any).warehouseId);
    case "incharge":
      return _entries.filter((e) => e.areaId === (user as any).areaId);
    default:
      return _entries;
  }
}

export function visibleInvoices(user: any) {
  if (!user) return [] as SalesInvoice[];
  switch (user.role) {
    case "warehouse_staff": return _invoices.filter((i) => i.warehouseId === user.warehouseId);
    case "incharge": return _invoices.filter((i) => i.areaId === user.areaId);
    default: return _invoices;
  }
}

// CSV export helper
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
