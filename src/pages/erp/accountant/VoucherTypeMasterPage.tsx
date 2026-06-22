import { useErp, upsertVoucherType, deleteEntity } from "@/lib/erp/store";
import MasterCrud, { Field } from "@/components/erp/MasterCrud";
import { VoucherType } from "@/lib/erp/types";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function VoucherTypeMasterPage() {
  const { voucherTypes } = useErp();
  return (
    <MasterCrud<VoucherType>
      allowed={["wh_accountant", "admin_accountant", "accountant", "superadmin"]}
      title="Voucher Type Master"
      description="Tally voucher types — Purchase, Sales, Receipt, Payment, Journal, Contra, Stock Transfer, and custom types."
      rows={voucherTypes}
      searchKeys={["name", "prefix"]}
      empty={{ factory: () => ({ id: `vt_${Date.now()}`, name: "", prefix: "", category: "Journal", numbering: "Automatic" }) }}
      columns={[
        { key: "name", label: "Name", render: (r) => <span className="font-semibold">{r.name}</span> },
        { key: "category", label: "Category" },
        { key: "prefix", label: "Prefix", render: (r) => <span className="font-mono text-xs">{r.prefix}</span> },
        { key: "numbering", label: "Numbering" },
      ]}
      onSave={(v) => upsertVoucherType(v)}
      onDelete={(v) => { deleteEntity("voucherType", v.id); return { ok: true }; }}
      renderForm={(f, set) => (
        <>
          <Field label="Name *"><Input value={f.name} onChange={(e) => set({ ...f, name: e.target.value })} /></Field>
          <Field label="Prefix *"><Input value={f.prefix} onChange={(e) => set({ ...f, prefix: e.target.value })} /></Field>
          <Field label="Category">
            <Select value={f.category} onValueChange={(v: any) => set({ ...f, category: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {["Purchase","Sales","Payment","Receipt","Journal","Contra","Stock"].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Numbering">
            <Select value={f.numbering} onValueChange={(v: any) => set({ ...f, numbering: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="Automatic">Automatic</SelectItem><SelectItem value="Manual">Manual</SelectItem></SelectContent>
            </Select>
          </Field>
        </>
      )}
    />
  );
}
