import { useErp, upsertStockGroup, upsertStockItem, upsertStockUnit, upsertGodown, deleteEntity, sGroupName, unitName } from "@/lib/erp/store";
import MasterCrud, { Field } from "@/components/erp/MasterCrud";
import { StockGroup, StockItem, StockUnit, Godown } from "@/lib/erp/types";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fmtINR } from "@/components/erp/ErpPage";

export function StockGroupPage() {
  const { stockGroups } = useErp();
  return (
    <MasterCrud<StockGroup>
      title="Stock Groups"
      description="Categorise inventory — Fertilizer, Food, Agriculture, Consumer, Fuel."
      rows={stockGroups} searchKeys={["name", "under"]}
      empty={{ factory: () => ({ id: `sg_${Date.now()}`, name: "", under: "Primary" }) }}
      columns={[
        { key: "name", label: "Stock Group" }, { key: "under", label: "Under" },
      ]}
      onSave={(g) => upsertStockGroup(g)}
      onDelete={(g) => { deleteEntity("stockGroup", g.id); return { ok: true }; }}
      renderForm={(f, set) => (
        <>
          <Field label="Name *"><Input value={f.name} onChange={(e) => set({ ...f, name: e.target.value })} /></Field>
          <Field label="Under"><Input value={f.under} onChange={(e) => set({ ...f, under: e.target.value })} /></Field>
        </>
      )}
    />
  );
}

export function StockItemPage() {
  const { stockItems, stockGroups, stockUnits } = useErp();
  return (
    <MasterCrud<StockItem>
      title="Stock Items"
      description="Inventory items with HSN, GST rate, and opening balances."
      rows={stockItems} searchKeys={["name", "hsn"]}
      empty={{ factory: () => ({ id: `si_${Date.now()}`, name: "", groupId: stockGroups[0]?.id ?? "", unitId: stockUnits[0]?.id ?? "", hsn: "", gstRate: 5, openingQty: 0, openingValue: 0, ratePerUnit: 0 }) }}
      columns={[
        { key: "name", label: "Item Name", render: (r) => <span className="font-semibold">{r.name}</span> },
        { key: "groupId", label: "Stock Group", render: (r) => sGroupName(r.groupId) },
        { key: "hsn", label: "HSN", render: (r) => <span className="font-mono text-xs">{r.hsn}</span> },
        { key: "gstRate", label: "GST %", render: (r) => `${r.gstRate}%` },
        { key: "unitId", label: "Unit", render: (r) => unitName(r.unitId) },
        { key: "openingQty", label: "Opening Qty", className: "text-right" },
        { key: "ratePerUnit", label: "Rate", className: "text-right font-mono", render: (r) => fmtINR(r.ratePerUnit) },
      ]}
      onSave={(i) => upsertStockItem(i)}
      onDelete={(i) => { deleteEntity("stockItem", i.id); return { ok: true }; }}
      renderForm={(f, set) => (
        <>
          <Field label="Item Name *"><Input value={f.name} onChange={(e) => set({ ...f, name: e.target.value })} /></Field>
          <Field label="Stock Group">
            <Select value={f.groupId} onValueChange={(v) => set({ ...f, groupId: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{stockGroups.map(g => <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <Field label="Unit">
            <Select value={f.unitId} onValueChange={(v) => set({ ...f, unitId: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{stockUnits.map(u => <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <Field label="HSN / SAC"><Input value={f.hsn} onChange={(e) => set({ ...f, hsn: e.target.value })} /></Field>
          <Field label="GST Rate %"><Input type="number" value={f.gstRate} onChange={(e) => set({ ...f, gstRate: +e.target.value })} /></Field>
          <Field label="Rate / Unit"><Input type="number" value={f.ratePerUnit} onChange={(e) => set({ ...f, ratePerUnit: +e.target.value })} /></Field>
          <Field label="Opening Qty"><Input type="number" value={f.openingQty} onChange={(e) => set({ ...f, openingQty: +e.target.value })} /></Field>
          <Field label="Opening Value"><Input type="number" value={f.openingValue} onChange={(e) => set({ ...f, openingValue: +e.target.value })} /></Field>
        </>
      )}
    />
  );
}

export function StockUnitPage() {
  const { stockUnits } = useErp();
  return (
    <MasterCrud<StockUnit>
      title="Stock Units"
      description="Units of measurement — Kg, Bag, Quintal, Litre, Piece."
      rows={stockUnits} searchKeys={["code", "name"]}
      empty={{ factory: () => ({ id: `u_${Date.now()}`, code: "", name: "", decimals: 0 }) }}
      columns={[
        { key: "code", label: "Code", render: (r) => <span className="font-mono font-bold">{r.code}</span> },
        { key: "name", label: "Name" },
        { key: "decimals", label: "Decimals" },
      ]}
      onSave={(u) => upsertStockUnit(u)}
      onDelete={(u) => { deleteEntity("stockUnit", u.id); return { ok: true }; }}
      renderForm={(f, set) => (
        <>
          <Field label="Code *"><Input value={f.code} onChange={(e) => set({ ...f, code: e.target.value })} /></Field>
          <Field label="Name *"><Input value={f.name} onChange={(e) => set({ ...f, name: e.target.value })} /></Field>
          <Field label="Decimals"><Input type="number" value={f.decimals} onChange={(e) => set({ ...f, decimals: +e.target.value })} /></Field>
        </>
      )}
    />
  );
}

export function GodownMasterPage() {
  const { godowns, companies } = useErp();
  return (
    <MasterCrud<Godown>
      title="Godown / Warehouse Master"
      description="Physical warehouses (godowns) under each Area Company. Stock is tracked per godown."
      rows={godowns} searchKeys={["name", "address", "inchargeName"]}
      empty={{ factory: () => ({ id: `g_${Date.now()}`, name: "", areaId: companies[0]?.areaId ?? "", address: "", capacity: 1000, inchargeName: "" }) }}
      columns={[
        { key: "name", label: "Godown", render: (r) => <span className="font-semibold">{r.name}</span> },
        { key: "areaId", label: "Area Company", render: (r) => companies.find(c => c.areaId === r.areaId)?.name ?? r.areaId },
        { key: "address", label: "Address" },
        { key: "capacity", label: "Capacity", className: "text-right", render: (r) => `${r.capacity} MT` },
        { key: "inchargeName", label: "Incharge" },
      ]}
      onSave={(g) => upsertGodown(g)}
      onDelete={(g) => { deleteEntity("godown", g.id); return { ok: true }; }}
      renderForm={(f, set) => (
        <>
          <Field label="Godown Name *"><Input value={f.name} onChange={(e) => set({ ...f, name: e.target.value })} /></Field>
          <Field label="Area Company *">
            <Select value={f.areaId} onValueChange={(v) => set({ ...f, areaId: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{companies.map(c => <SelectItem key={c.id} value={c.areaId}>{c.name}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <Field label="Address" full><Input value={f.address} onChange={(e) => set({ ...f, address: e.target.value })} /></Field>
          <Field label="Capacity (MT)"><Input type="number" value={f.capacity} onChange={(e) => set({ ...f, capacity: +e.target.value })} /></Field>
          <Field label="Incharge Name"><Input value={f.inchargeName} onChange={(e) => set({ ...f, inchargeName: e.target.value })} /></Field>
        </>
      )}
    />
  );
}
