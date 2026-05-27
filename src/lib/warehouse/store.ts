import { useEffect, useState } from "react";
import { activityLogs as seedLogs, areas as seedAreas, entries as seedEntries, users as seedUsers, warehouses as seedWarehouses } from "./mockData";
import { ActivityLog, Area, EntryStatus, Role, User, Warehouse, WarehouseEntry } from "./types";

// In-memory store (resets on full reload — fine for demo).
// Current user is persisted in sessionStorage so route guards work.
let _areas = [...seedAreas];
let _warehouses = [...seedWarehouses];
let _users = [...seedUsers];
let _entries = [...seedEntries];
let _logs = [...seedLogs];

const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());

export function useStore() {
  const [, set] = useState(0);
  useEffect(() => {
    const l = () => set((n) => n + 1);
    listeners.add(l);
    return () => { listeners.delete(l); };
  }, []);
  return {
    areas: _areas,
    warehouses: _warehouses,
    users: _users,
    entries: _entries,
    logs: _logs,
  };
}

export const store = {
  get areas() { return _areas; },
  get warehouses() { return _warehouses; },
  get users() { return _users; },
  get entries() { return _entries; },
  get logs() { return _logs; },
};

// ---------- Auth ----------
const SESSION_KEY = "himfed_current_user";

export function getCurrentUser(): User | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const id = JSON.parse(raw) as string;
    return _users.find((u) => u.id === id) ?? null;
  } catch { return null; }
}

export function login(username: string, password: string): User | null {
  const u = _users.find((x) => x.username === username && x.password === password && x.status === "active");
  if (u) {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(u.id));
    addLog({ user: u.name, role: u.role, action: "Login" });
  }
  return u ?? null;
}

export function loginAs(userId: string): User | null {
  const u = _users.find((x) => x.id === userId);
  if (u) {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(u.id));
    addLog({ user: u.name, role: u.role, action: "Login" });
  }
  return u ?? null;
}

export function logout() {
  const u = getCurrentUser();
  if (u) addLog({ user: u.name, role: u.role, action: "Logout" });
  sessionStorage.removeItem(SESSION_KEY);
}

// ---------- Helpers ----------
export const areaName = (id?: string) => _areas.find((a) => a.id === id)?.name ?? "—";
export const warehouseName = (id?: string) => _warehouses.find((w) => w.id === id)?.name ?? "—";
export const userName = (id?: string) => _users.find((u) => u.id === id)?.name ?? "—";

// ---------- Mutations ----------
export function addLog(input: Omit<ActivityLog, "id" | "ip" | "timestamp">) {
  _logs = [
    { id: `l${Date.now()}`, ip: "192.168.1." + Math.floor(Math.random() * 250), timestamp: new Date().toISOString(), ...input },
    ..._logs,
  ];
  notify();
}

export function addEntry(input: Omit<WarehouseEntry, "id" | "entryCode" | "createdAt" | "status">) {
  const code = `ENT-2025-${String(_entries.length + 1).padStart(4, "0")}`;
  const entry: WarehouseEntry = {
    ...input,
    id: `e${Date.now()}`,
    entryCode: code,
    createdAt: new Date().toISOString(),
    status: "pending",
  };
  if (_entries.some((e) => e.grNumber === entry.grNumber)) {
    throw new Error("GR Number must be unique");
  }
  _entries = [entry, ..._entries];
  const u = _users.find((x) => x.id === input.createdBy);
  if (u) addLog({ user: u.name, role: u.role, action: "Created Entry", target: code });
  notify();
  return entry;
}

export function reviewEntry(entryId: string, status: EntryStatus, reviewerId: string, remarks: string) {
  _entries = _entries.map((e) =>
    e.id === entryId
      ? { ...e, status, approvedBy: reviewerId, approvedAt: new Date().toISOString(), reviewRemarks: remarks }
      : e
  );
  const u = _users.find((x) => x.id === reviewerId);
  const e = _entries.find((x) => x.id === entryId);
  if (u && e) addLog({ user: u.name, role: u.role, action: status === "approved" ? "Approved Entry" : "Rejected Entry", target: e.entryCode });
  notify();
}

// Area CRUD
export function upsertArea(a: Area) {
  _areas = _areas.some((x) => x.id === a.id) ? _areas.map((x) => (x.id === a.id ? a : x)) : [..._areas, a];
  notify();
}
export function deleteArea(id: string) { _areas = _areas.filter((a) => a.id !== id); notify(); }

// Warehouse CRUD
export function upsertWarehouse(w: Warehouse) {
  _warehouses = _warehouses.some((x) => x.id === w.id) ? _warehouses.map((x) => (x.id === w.id ? w : x)) : [..._warehouses, w];
  notify();
}
export function deleteWarehouse(id: string) { _warehouses = _warehouses.filter((w) => w.id !== id); notify(); }

// User CRUD
export function upsertUser(u: User) {
  _users = _users.some((x) => x.id === u.id) ? _users.map((x) => (x.id === u.id ? u : x)) : [..._users, u];
  notify();
}
export function deleteUser(id: string) { _users = _users.filter((u) => u.id !== id); notify(); }

// Role-aware entry visibility
export function visibleEntries(user: User | null): WarehouseEntry[] {
  if (!user) return [];
  switch (user.role) {
    case "warehouse_staff":
      return _entries.filter((e) => e.createdBy === user.id);
    case "incharge":
      return _entries.filter((e) => e.areaId === user.areaId);
    case "superadmin":
    case "accountant":
    case "joa_it":
    default:
      return _entries;
  }
}

export function canRoleAccess(role: Role | undefined, allowed: Role[]): boolean {
  return !!role && allowed.includes(role);
}
