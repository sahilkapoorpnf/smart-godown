import { useErp, upsertCompany, deleteCompany } from "@/lib/erp/store";
import MasterCrud, { Field } from "@/components/erp/MasterCrud";
import { AreaCompany } from "@/lib/erp/types";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/erp/ErpPage";

export default function CompanyManager() {
  const { companies } = useErp();
  return (
    <MasterCrud<AreaCompany>
      allowed={["admin_accountant", "superadmin"]}
      title="Area Companies"
      description="Create and maintain HIMFED Area Companies. Each company maintains its own Tally books, GST, and inventory."
      rows={companies}
      searchKeys={["name", "code", "district", "gstNumber"]}
      empty={{ factory: () => ({
        id: `co_${Date.now()}`, name: "", code: "", areaId: "a_una", address: "", district: "", state: "Himachal Pradesh",
        pin: "", phone: "", email: "", gstType: "Regular", gstNumber: "", pan: "",
        gstEffectiveDate: "2017-07-01", fyStart: "2026-04-01", fyEnd: "2027-03-31", booksFrom: "2026-04-01",
        currency: "INR", maintainAccounts: true, maintainInventory: true, status: "active", createdAt: new Date().toISOString(),
      }) }}
      columns={[
        { key: "code", label: "Code", render: (r) => <span className="font-mono font-bold">{r.code}</span> },
        { key: "name", label: "Company Name", render: (r) => <span className="font-semibold">{r.name}</span> },
        { key: "gstNumber", label: "GSTIN", render: (r) => <span className="font-mono text-xs">{r.gstNumber}</span> },
        { key: "district", label: "District" },
        { key: "fyStart", label: "Financial Year", render: (r) => `${r.fyStart.slice(0,4)}-${r.fyEnd.slice(2,4)}` },
        { key: "status", label: "Status", render: (r) => <Badge tone={r.status === "active" ? "green" : "red"}>{r.status}</Badge> },
      ]}
      onSave={(r) => upsertCompany(r)}
      onDelete={(r) => deleteCompany(r.id)}
      renderForm={(f, set) => (
        <>
          <Field label="Company Name *"><Input value={f.name} onChange={(e) => set({ ...f, name: e.target.value })} /></Field>
          <Field label="Area Code *"><Input value={f.code} onChange={(e) => set({ ...f, code: e.target.value })} /></Field>
          <Field label="Address" full><Input value={f.address} onChange={(e) => set({ ...f, address: e.target.value })} /></Field>
          <Field label="District"><Input value={f.district} onChange={(e) => set({ ...f, district: e.target.value })} /></Field>
          <Field label="State"><Input value={f.state} onChange={(e) => set({ ...f, state: e.target.value })} /></Field>
          <Field label="PIN"><Input value={f.pin} onChange={(e) => set({ ...f, pin: e.target.value })} /></Field>
          <Field label="Phone"><Input value={f.phone} onChange={(e) => set({ ...f, phone: e.target.value })} /></Field>
          <Field label="Email"><Input value={f.email} onChange={(e) => set({ ...f, email: e.target.value })} /></Field>
          <Field label="GST Type">
            <Select value={f.gstType} onValueChange={(v: any) => set({ ...f, gstType: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Regular">Regular</SelectItem>
                <SelectItem value="Composition">Composition</SelectItem>
                <SelectItem value="Unregistered">Unregistered</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="GST Number"><Input value={f.gstNumber} onChange={(e) => set({ ...f, gstNumber: e.target.value })} /></Field>
          <Field label="PAN"><Input value={f.pan} onChange={(e) => set({ ...f, pan: e.target.value })} /></Field>
          <Field label="GST Effective Date"><Input type="date" value={f.gstEffectiveDate} onChange={(e) => set({ ...f, gstEffectiveDate: e.target.value })} /></Field>
          <Field label="Financial Year Start"><Input type="date" value={f.fyStart} onChange={(e) => set({ ...f, fyStart: e.target.value })} /></Field>
          <Field label="Financial Year End"><Input type="date" value={f.fyEnd} onChange={(e) => set({ ...f, fyEnd: e.target.value })} /></Field>
          <Field label="Books Beginning"><Input type="date" value={f.booksFrom} onChange={(e) => set({ ...f, booksFrom: e.target.value })} /></Field>
          <Field label="Currency"><Input value={f.currency} onChange={(e) => set({ ...f, currency: e.target.value })} /></Field>
          <Field label="Maintain Accounts">
            <div className="flex items-center gap-2 h-9"><Switch checked={f.maintainAccounts} onCheckedChange={(v) => set({ ...f, maintainAccounts: v })} /><span className="text-sm">{f.maintainAccounts ? "Yes" : "No"}</span></div>
          </Field>
          <Field label="Maintain Inventory">
            <div className="flex items-center gap-2 h-9"><Switch checked={f.maintainInventory} onCheckedChange={(v) => set({ ...f, maintainInventory: v })} /><span className="text-sm">{f.maintainInventory ? "Yes" : "No"}</span></div>
          </Field>
          <Field label="Status">
            <Select value={f.status} onValueChange={(v: any) => set({ ...f, status: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </>
      )}
    />
  );
}
