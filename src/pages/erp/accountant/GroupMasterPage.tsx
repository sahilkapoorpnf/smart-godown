import { useErp, upsertGroup, deleteEntity } from "@/lib/erp/store";
import MasterCrud, { Field } from "@/components/erp/MasterCrud";
import { AccountGroup } from "@/lib/erp/types";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/erp/ErpPage";

export default function GroupMasterPage() {
  const { groups } = useErp();
  return (
    <MasterCrud<AccountGroup>
      allowed={["wh_accountant", "admin_accountant", "accountant", "superadmin"]}
      title="Group Master"
      description="Tally-style account groups. Used to classify ledgers under Assets, Liabilities, Income, or Expenses."
      rows={groups}
      searchKeys={["name", "under", "nature"]}
      empty={{ factory: () => ({ id: `ag_${Date.now()}`, name: "", nature: "Assets", under: "Primary" }) }}
      columns={[
        { key: "name", label: "Group Name", render: (r) => <span className="font-semibold">{r.name}</span> },
        { key: "nature", label: "Nature", render: (r) => <Badge tone={r.nature === "Assets" ? "blue" : r.nature === "Liabilities" ? "amber" : r.nature === "Income" ? "green" : "red"}>{r.nature}</Badge> },
        { key: "under", label: "Under" },
      ]}
      onSave={(g) => upsertGroup(g)}
      onDelete={(g) => { deleteEntity("group", g.id); return { ok: true }; }}
      renderForm={(f, set) => (
        <>
          <Field label="Group Name *"><Input value={f.name} onChange={(e) => set({ ...f, name: e.target.value })} /></Field>
          <Field label="Nature *">
            <Select value={f.nature} onValueChange={(v: any) => set({ ...f, nature: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Assets">Assets</SelectItem>
                <SelectItem value="Liabilities">Liabilities</SelectItem>
                <SelectItem value="Income">Income</SelectItem>
                <SelectItem value="Expenses">Expenses</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Under" full><Input value={f.under} onChange={(e) => set({ ...f, under: e.target.value })} /></Field>
        </>
      )}
    />
  );
}
