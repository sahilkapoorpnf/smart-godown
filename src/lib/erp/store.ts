import { useEffect, useState } from "react";
import {
  accountGroups, areaCompanies, areaToCompany, auditEntries, docFiles, erpGodowns, goodsArrivals,
  ledgers, stockGroups, stockItems, stockUnits, vouchers, voucherTypes,
} from "./mock";
import {
  AccountGroup, AreaCompany, AuditEntry, DocFile, Godown, GoodsArrival, GoodsStatus,
  Ledger, StockGroup, StockItem, StockUnit, Voucher, VoucherType,
} from "./types";
import { store as whStore, addLog } from "@/lib/warehouse/store";

let _companies = [...areaCompanies];
let _activeCompanyId: string = (typeof localStorage !== "undefined" && localStorage.getItem("himfed_active_company")) || "co_una";

let _arrivals = [...goodsArrivals];
let _vouchers = [...vouchers];
let _ledgers = [...ledgers];
let _groups = [...accountGroups];
let _vtypes = [...voucherTypes];
let _sgroups = [...stockGroups];
let _sitems = [...stockItems];
let _sunits = [...stockUnits];
let _godowns = [...erpGodowns];
let _audit = [...auditEntries];
let _docs = [...docFiles];

const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());

export function useErp() {
  const [, set] = useState(0);
  useEffect(() => {
    const l = () => set((n) => n + 1);
    listeners.add(l);
    return () => { listeners.delete(l); };
  }, []);
  return {
    arrivals: _arrivals, vouchers: _vouchers, ledgers: _ledgers,
    groups: _groups, voucherTypes: _vtypes, stockGroups: _sgroups,
    stockItems: _sitems, stockUnits: _sunits, godowns: _godowns,
    audit: _audit, docs: _docs,
  };
}

export const erp = {
  get arrivals() { return _arrivals; },
  get vouchers() { return _vouchers; },
  get ledgers() { return _ledgers; },
  get groups() { return _groups; },
  get voucherTypes() { return _vtypes; },
  get stockGroups() { return _sgroups; },
  get stockItems() { return _sitems; },
  get stockUnits() { return _sunits; },
  get godowns() { return _godowns; },
  get audit() { return _audit; },
  get docs() { return _docs; },
};

// ---------- Helpers ----------
export const godownName = (id?: string) => _godowns.find((g) => g.id === id)?.name ?? "—";
export const ledgerName = (id?: string) => _ledgers.find((l) => l.id === id)?.name ?? "—";
export const itemName   = (id?: string) => _sitems.find((s) => s.id === id)?.name ?? "—";
export const groupName  = (id?: string) => _groups.find((g) => g.id === id)?.name ?? "—";
export const unitName   = (id?: string) => _sunits.find((u) => u.id === id)?.code ?? "";
export const sGroupName = (id?: string) => _sgroups.find((g) => g.id === id)?.name ?? "—";
export const areaForGodown = (id?: string) => _godowns.find((g) => g.id === id)?.areaId;

export function pushAudit(a: Omit<AuditEntry, "id" | "at" | "ip">) {
  _audit = [{ ...a, id: `au_${Date.now()}`, at: new Date().toISOString(), ip: "192.168.1." + Math.floor(Math.random() * 250) }, ..._audit];
  notify();
}

// ---------- Mutations ----------
export function createArrival(input: Omit<GoodsArrival, "id" | "entryId" | "createdAt" | "status">) {
  const n = _arrivals.length + 1;
  const ga: GoodsArrival = {
    ...input, id: `ga_${Date.now()}`,
    entryId: `GE-26-${String(n).padStart(4, "0")}`,
    createdAt: new Date().toISOString(),
    status: "pending",
  };
  _arrivals = [ga, ..._arrivals];
  pushAudit({ user: input.driverName ? "Warehouse User" : "—", role: "wh_user", action: "Created Goods Arrival", target: ga.entryId });
  notify();
  return ga;
}

export function updateArrival(id: string, patch: Partial<GoodsArrival>) {
  _arrivals = _arrivals.map((g) => (g.id === id ? { ...g, ...patch } : g));
  notify();
}

export function reviewArrival(id: string, status: GoodsStatus, reviewerId: string, remarks: string) {
  _arrivals = _arrivals.map((g) =>
    g.id === id
      ? { ...g, status, approvedBy: reviewerId, approvedAt: new Date().toISOString(), correctionRemarks: status === "re_edit" ? remarks : g.correctionRemarks }
      : g
  );
  const ga = _arrivals.find((g) => g.id === id);
  if (ga && status === "approved") {
    // Auto-draft a Purchase Voucher
    const item = _sitems[0];
    const amount = ga.quantity * ga.rate;
    const gst = +(amount * (item?.gstRate ?? 5) / 100).toFixed(2);
    const pno = _vouchers.filter((v) => v.kind === "purchase").length + 1;
    _vouchers = [
      {
        id: `v_p_${Date.now()}`, voucherNo: `PUR/26-27/${String(pno).padStart(4, "0")}`, kind: "purchase",
        date: ga.depotDate, partyLedgerId: "l4",
        narration: `Auto-drafted from approved arrival ${ga.entryId}`,
        lines: [{ itemId: item?.id ?? "si1", qty: ga.quantity, rate: ga.rate, amount, gstRate: item?.gstRate ?? 5, gstAmount: gst, godownToId: ga.warehouseId }],
        total: amount, gstTotal: gst, grandTotal: amount + gst,
        invoiceNumber: ga.invoiceNumber, createdBy: reviewerId,
        createdAt: new Date().toISOString(), linkedArrivalId: ga.id,
      },
      ..._vouchers,
    ];
  }
  pushAudit({ user: "Area Officer", role: "area_officer", action: status === "approved" ? "Approved Arrival" : "Sent for Re-edit", target: ga?.entryId ?? id });
  notify();
}

export function addVoucher(v: Voucher) { _vouchers = [v, ..._vouchers]; notify(); }
export function upsertLedger(l: Ledger) { _ledgers = _ledgers.some((x) => x.id === l.id) ? _ledgers.map((x) => x.id === l.id ? l : x) : [..._ledgers, l]; notify(); }
export function upsertGroup(g: AccountGroup) { _groups = _groups.some((x) => x.id === g.id) ? _groups.map((x) => x.id === g.id ? g : x) : [..._groups, g]; notify(); }
export function upsertVoucherType(v: VoucherType) { _vtypes = _vtypes.some((x) => x.id === v.id) ? _vtypes.map((x) => x.id === v.id ? v : x) : [..._vtypes, v]; notify(); }
export function upsertStockGroup(g: StockGroup) { _sgroups = _sgroups.some((x) => x.id === g.id) ? _sgroups.map((x) => x.id === g.id ? g : x) : [..._sgroups, g]; notify(); }
export function upsertStockItem(s: StockItem) { _sitems = _sitems.some((x) => x.id === s.id) ? _sitems.map((x) => x.id === s.id ? s : x) : [..._sitems, s]; notify(); }
export function upsertStockUnit(u: StockUnit) { _sunits = _sunits.some((x) => x.id === u.id) ? _sunits.map((x) => x.id === u.id ? u : x) : [..._sunits, u]; notify(); }
export function upsertGodown(g: Godown) { _godowns = _godowns.some((x) => x.id === g.id) ? _godowns.map((x) => x.id === g.id ? g : x) : [..._godowns, g]; notify(); }
export function addDoc(d: DocFile) { _docs = [d, ..._docs]; notify(); }

// ---------- Stock computation ----------
export function computeStockByGodown() {
  const map: Record<string, Record<string, { inQty: number; outQty: number; inVal: number; outVal: number; rate: number; name: string }>> = {};
  _sitems.forEach((it) => {
    _godowns.forEach((g) => {
      map[g.id] = map[g.id] ?? {};
      map[g.id][it.id] = { inQty: 0, outQty: 0, inVal: 0, outVal: 0, rate: it.ratePerUnit, name: it.name };
    });
  });
  _vouchers.forEach((v) => {
    v.lines.forEach((ln) => {
      if (!ln.itemId) return;
      if (v.kind === "purchase" && ln.godownToId) {
        const row = map[ln.godownToId]?.[ln.itemId];
        if (row) { row.inQty += ln.qty ?? 0; row.inVal += ln.amount; }
      }
      if (v.kind === "sales" && ln.godownFromId) {
        const row = map[ln.godownFromId]?.[ln.itemId];
        if (row) { row.outQty += ln.qty ?? 0; row.outVal += ln.amount; }
      }
      if (v.kind === "stock_transfer" && ln.godownFromId && ln.godownToId) {
        const out = map[ln.godownFromId]?.[ln.itemId];
        const into = map[ln.godownToId]?.[ln.itemId];
        if (out) { out.outQty += ln.qty ?? 0; out.outVal += ln.amount; }
        if (into) { into.inQty += ln.qty ?? 0; into.inVal += ln.amount; }
      }
    });
  });
  return map;
}

// Re-export warehouse store helpers
export { whStore, addLog };
