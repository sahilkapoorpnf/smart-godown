import { useEffect, useState } from "react";
import {
  companies as seedCompanies,
  products as seedProducts,
  pricing as seedPricing,
  requests as seedRequests,
  purchaseOrders as seedPOs,
  fertilizerStock as seedStock,
} from "./mockData";
import {
  DemandRequest,
  FertilizerCompany,
  FertilizerPricing,
  FertilizerProduct,
  FertilizerStock,
  PurchaseOrder,
  RequestStatus,
  WarehouseAllocation,
} from "./types";
import { addLog } from "../warehouse/store";

let _companies = [...seedCompanies];
let _products = [...seedProducts];
let _pricing = [...seedPricing];
let _requests = [...seedRequests];
let _pos = [...seedPOs];
let _stock = [...seedStock];

const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());

export function useFertilizerStore() {
  const [, set] = useState(0);
  useEffect(() => {
    const l = () => set((n) => n + 1);
    listeners.add(l);
    return () => { listeners.delete(l); };
  }, []);
  return {
    companies: _companies,
    products: _products,
    pricing: _pricing,
    requests: _requests,
    purchaseOrders: _pos,
    stock: _stock,
  };
}

export const fStore = {
  get companies() { return _companies; },
  get products() { return _products; },
  get pricing() { return _pricing; },
  get requests() { return _requests; },
  get purchaseOrders() { return _pos; },
  get stock() { return _stock; },
};

// Lookups
export const companyName = (id?: string) => _companies.find((c) => c.id === id)?.name ?? "—";
export const companyCode = (id?: string) => _companies.find((c) => c.id === id)?.code ?? "—";
export const productName = (id?: string) => _products.find((p) => p.id === id)?.name ?? "—";
export const productUnit = (id?: string) => _products.find((p) => p.id === id)?.unit ?? "Bag";
export const priceFor = (productId: string) => _pricing.find((p) => p.productId === productId && p.status === "active");

// Company CRUD
export function upsertCompany(c: FertilizerCompany) {
  _companies = _companies.some((x) => x.id === c.id) ? _companies.map((x) => (x.id === c.id ? c : x)) : [..._companies, c];
  addLog({ user: "System Administrator", role: "superadmin", action: "Saved Company", target: c.code });
  notify();
}
export function deleteCompany(id: string) {
  _companies = _companies.map((c) => (c.id === id ? { ...c, status: "inactive" } : c));
  notify();
}

// Product CRUD
export function upsertProduct(p: FertilizerProduct) {
  _products = _products.some((x) => x.id === p.id) ? _products.map((x) => (x.id === p.id ? p : x)) : [..._products, p];
  notify();
}
export function deleteProduct(id: string) {
  _products = _products.map((p) => (p.id === id ? { ...p, status: "inactive" } : p));
  notify();
}

// Pricing CRUD
export function upsertPricing(p: FertilizerPricing) {
  _pricing = _pricing.some((x) => x.id === p.id) ? _pricing.map((x) => (x.id === p.id ? p : x)) : [..._pricing, p];
  addLog({ user: "System Administrator", role: "superadmin", action: "Updated Pricing", target: productName(p.productId) });
  notify();
}
export function deletePricing(id: string) {
  _pricing = _pricing.map((p) => (p.id === id ? { ...p, status: "inactive" } : p));
  notify();
}

// Demand Request
export function createRequest(input: Omit<DemandRequest, "id" | "requestCode" | "createdAt" | "status">) {
  const code = `REQ-2025-${String(_requests.length + 1).padStart(4, "0")}`;
  const r: DemandRequest = {
    ...input,
    id: `dr${Date.now()}`,
    requestCode: code,
    createdAt: new Date().toISOString(),
    status: "pending",
  };
  _requests = [r, ..._requests];
  addLog({ user: "Area Officer", role: "incharge", action: "Raised Demand Request", target: code });
  notify();
  return r;
}

export function reviewRequest(id: string, status: RequestStatus, approvedQty: number, allocations: WarehouseAllocation[], remarks: string, reviewerId: string) {
  let forwardedPONumber: string | undefined;
  const target = _requests.find((x) => x.id === id);

  // Auto-generate PO to the chosen supplier when approved/partially-approved
  if (target && target.companyId && status !== "rejected" && approvedQty > 0) {
    forwardedPONumber = nextPONumber();
    const newPO: PurchaseOrder = {
      id: `po${Date.now()}`,
      poNumber: forwardedPONumber,
      companyId: target.companyId,
      productId: target.productId,
      areaId: target.areaId,
      quantity: approvedQty,
      allocations,
      deliveryInstructions: `Auto-generated from request ${target.requestCode}. ${remarks || ""}`.trim(),
      expectedDelivery: target.requiredDate,
      status: "sent",
      requestId: target.id,
      createdAt: new Date().toISOString(),
      createdBy: reviewerId,
    };
    _pos = [newPO, ..._pos];
    addLog({ user: "System Administrator", role: "superadmin", action: "Forwarded PO to Supplier", target: `${forwardedPONumber} → ${companyName(target.companyId)}` });
  }

  _requests = _requests.map((r) =>
    r.id === id ? { ...r, status, approvedQty, allocations, reviewRemarks: remarks, reviewedBy: reviewerId, reviewedAt: new Date().toISOString(), forwardedPONumber: forwardedPONumber ?? r.forwardedPONumber } : r
  );
  const r = _requests.find((x) => x.id === id);
  addLog({ user: "System Administrator", role: "superadmin", action: `Request ${status}`, target: r?.requestCode });
  notify();
}


// Purchase Orders
export function upsertPO(po: PurchaseOrder) {
  _pos = _pos.some((x) => x.id === po.id) ? _pos.map((x) => (x.id === po.id ? po : x)) : [po, ..._pos];
  addLog({ user: "System Administrator", role: "superadmin", action: "Saved Purchase Order", target: po.poNumber });
  notify();
}
export function nextPONumber() {
  return `PO-2025-${String(_pos.length + 1).padStart(4, "0")}`;
}

// Inventory aggregations
export function inventoryByWarehouse() {
  const map = new Map<string, number>();
  _stock.forEach((s) => map.set(s.warehouseId, (map.get(s.warehouseId) || 0) + s.quantity));
  return map;
}
export function inventoryByArea(warehouseAreaMap: Record<string, string>) {
  const map = new Map<string, number>();
  _stock.forEach((s) => {
    const a = warehouseAreaMap[s.warehouseId];
    if (a) map.set(a, (map.get(a) || 0) + s.quantity);
  });
  return map;
}
export function inventoryValue(): number {
  return _stock.reduce((sum, s) => {
    const p = priceFor(s.productId);
    return sum + (p ? p.purchasePrice * s.quantity : 0);
  }, 0);
}
export function subsidyTotal(): number {
  return _stock.reduce((sum, s) => {
    const p = priceFor(s.productId);
    return sum + (p ? p.subsidy * s.quantity : 0);
  }, 0);
}
