import { useErp, upsertLedger, deleteEntity, groupName } from "@/lib/erp/store";
import MasterCrud, { Field } from "@/components/erp/MasterCrud";
import { Ledger } from "@/lib/erp/types";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fmtINR, Badge } from "@/components/erp/ErpPage";

export default function LedgerMasterPage() {
  const { ledgers, groups } = useErp();
  return (
    <MasterCrud<Ledger>
      allowed={["wh_accountant", "admin_accountant", "accountant", "superadmin"]}
      title="Ledger Master"
      description="All accounting ledgers — cash, bank, suppliers, customers, GST, expenses, income."
      rows={ledgers}
      searchKeys={["name", "gstin", "contact"]}
      empty={{ factory: () => ({ id: `l_${Date.now()}`, name: "", groupId: groups[0]?.id ?? "", openingBalance: 0, type: "Dr" }) }}
      columns={[
        { key: "name", label: "Ledger Name", render: (r) => <span className="font-semibold">{r.name}</span> },
        { key: "groupId", label: "Under Group", render: (r) => groupName(r.groupId) },
        { key: "type", label: "Dr/Cr", render: (r) => <Badge tone={r.type === "Dr" ? "blue" : "amber"}>{r.type}</Badge> },
        { key: "openingBalance", label: "Opening Bal.", className: "text-right font-mono", render: (r) => fmtINR(r.openingBalance) },
        { key: "gstin", label: "GSTIN", render: (r) => r.gstin ?? "—" },
      ]}
      onSave={(l) => upsertLedger(l)}
      onDelete={(l) => { deleteEntity("ledger", l.id); return { ok: true }; }}
      renderForm={(f, set) => (
        <>
          <Field label="Ledger Name *"><Input value={f.name} onChange={(e) => set({ ...f, name: e.target.value })} /></Field>
          <Field label="Under Group *">
            <Select value={f.groupId} onValueChange={(v) => set({ ...f, groupId: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{groups.map((g) => <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <Field label="Opening Balance"><Input type="number" value={f.openingBalance} onChange={(e) => set({ ...f, openingBalance: +e.target.value })} /></Field>
          <Field label="Dr / Cr">
            <Select value={f.type} onValueChange={(v: any) => set({ ...f, type: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="Dr">Debit</SelectItem><SelectItem value="Cr">Credit</SelectItem></SelectContent>
            </Select>
          </Field>
          <Field label="GSTIN"><Input value={f.gstin ?? ""} onChange={(e) => set({ ...f, gstin: e.target.value })} /></Field>
          <Field label="Contact"><Input value={f.contact ?? ""} onChange={(e) => set({ ...f, contact: e.target.value })} /></Field>
        </>
      )}
    />
  );
}
