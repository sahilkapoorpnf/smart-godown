import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ErpPage from "@/components/erp/ErpPage";
import CompanySwitcher from "@/components/erp/CompanySwitcher";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Field } from "@/components/erp/MasterCrud";
import { Building2, Edit3, Save, X } from "lucide-react";
import { useErp, activeCompany, upsertCompany, vouchersForCompany } from "@/lib/erp/store";
import { AreaCompany } from "@/lib/erp/types";
import { toast } from "sonner";

export default function CompanyInformation() {
  useErp();
  const co = activeCompany();
  const nav = useNavigate();
  const [editing, setEditing] = useState<AreaCompany | null>(null);

  if (!co) {
    return (
      <ErpPage allowed={["wh_accountant", "admin_accountant", "accountant", "superadmin"]} title="Company Information" description="">
        <div className="text-center py-16">
          <p className="text-muted-foreground mb-4">No active company. Please select one first.</p>
          <Button onClick={() => nav("/dashboard/erp/acc/select-company")}>Select Company</Button>
        </div>
      </ErpPage>
    );
  }

  const f = editing ?? co;
  const set = (p: Partial<AreaCompany>) => editing && setEditing({ ...editing, ...p });
  const vCount = vouchersForCompany(co.id).length;

  const save = () => {
    if (!editing) return;
    if (!editing.name.trim() || !editing.code.trim()) { toast.error("Name and Area Code are required"); return; }
    upsertCompany(editing);
    setEditing(null);
    toast.success("Company information updated");
  };

  return (
    <ErpPage
      allowed={["wh_accountant", "admin_accountant", "accountant", "superadmin"]}
      title="Company Information"
      description="View and edit the active Area Company configuration — Tally-style company profile, GST, and books."
      actions={editing ? (
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setEditing(null)}><X className="w-4 h-4 mr-2" />Cancel</Button>
          <Button onClick={save}><Save className="w-4 h-4 mr-2" />Save</Button>
        </div>
      ) : (
        <Button onClick={() => setEditing({ ...co })}><Edit3 className="w-4 h-4 mr-2" />Edit Company</Button>
      )}
    >
      <CompanySwitcher />

      <div className="grid md:grid-cols-3 gap-4 mb-4">
        <Card><CardContent className="p-4"><div className="text-xs text-muted-foreground">Company ID</div><div className="font-mono font-semibold">{co.id}</div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="text-xs text-muted-foreground">Financial Year</div><div className="font-semibold">{co.fyStart} → {co.fyEnd}</div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="text-xs text-muted-foreground">Total Vouchers</div><div className="font-semibold">{vCount}</div></CardContent></Card>
      </div>

      <Card>
        <CardContent className="p-6 space-y-6">
          <Section icon title="Basic Information">
            <Field label="Area Company Name *"><Input value={f.name} disabled={!editing} onChange={(e) => set({ name: e.target.value })} /></Field>
            <Field label="Area Code *"><Input value={f.code} disabled={!editing} onChange={(e) => set({ code: e.target.value })} /></Field>
            <Field label="Address" full><Input value={f.address} disabled={!editing} onChange={(e) => set({ address: e.target.value })} /></Field>
            <Field label="District"><Input value={f.district} disabled={!editing} onChange={(e) => set({ district: e.target.value })} /></Field>
            <Field label="State"><Input value={f.state} disabled={!editing} onChange={(e) => set({ state: e.target.value })} /></Field>
            <Field label="PIN Code"><Input value={f.pin} disabled={!editing} onChange={(e) => set({ pin: e.target.value })} /></Field>
            <Field label="Phone"><Input value={f.phone} disabled={!editing} onChange={(e) => set({ phone: e.target.value })} /></Field>
            <Field label="Email" full><Input value={f.email} disabled={!editing} onChange={(e) => set({ email: e.target.value })} /></Field>
          </Section>

          <Section title="GST Information">
            <Field label="GST Registration Type">
              <Select value={f.gstType} disabled={!editing} onValueChange={(v: any) => set({ gstType: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Regular">Regular</SelectItem>
                  <SelectItem value="Composition">Composition</SelectItem>
                  <SelectItem value="Unregistered">Unregistered</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="GST Number"><Input value={f.gstNumber} disabled={!editing} onChange={(e) => set({ gstNumber: e.target.value })} /></Field>
            <Field label="PAN Number"><Input value={f.pan} disabled={!editing} onChange={(e) => set({ pan: e.target.value })} /></Field>
            <Field label="GST Effective Date"><Input type="date" value={f.gstEffectiveDate} disabled={!editing} onChange={(e) => set({ gstEffectiveDate: e.target.value })} /></Field>
          </Section>

          <Section title="Financial Configuration">
            <Field label="Financial Year Start"><Input type="date" value={f.fyStart} disabled={!editing} onChange={(e) => set({ fyStart: e.target.value })} /></Field>
            <Field label="Financial Year End"><Input type="date" value={f.fyEnd} disabled={!editing} onChange={(e) => set({ fyEnd: e.target.value })} /></Field>
            <Field label="Books Beginning Date"><Input type="date" value={f.booksFrom} disabled={!editing} onChange={(e) => set({ booksFrom: e.target.value })} /></Field>
            <Field label="Currency"><Input value={f.currency} disabled={!editing} onChange={(e) => set({ currency: e.target.value })} /></Field>
            <Field label="Maintain Accounts">
              <div className="flex items-center gap-2 h-9"><Switch checked={f.maintainAccounts} disabled={!editing} onCheckedChange={(v) => set({ maintainAccounts: v })} /><span className="text-sm">{f.maintainAccounts ? "Yes" : "No"}</span></div>
            </Field>
            <Field label="Maintain Inventory">
              <div className="flex items-center gap-2 h-9"><Switch checked={f.maintainInventory} disabled={!editing} onCheckedChange={(v) => set({ maintainInventory: v })} /><span className="text-sm">{f.maintainInventory ? "Yes" : "No"}</span></div>
            </Field>
            <Field label="Status">
              <Select value={f.status} disabled={!editing} onValueChange={(v: any) => set({ status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </Section>
        </CardContent>
      </Card>
    </ErpPage>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode; icon?: boolean }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-himfed-green/20">
        <Building2 className="w-4 h-4 text-himfed-green" />
        <h3 className="font-serif font-bold text-himfed-green">{title}</h3>
      </div>
      <div className="grid grid-cols-2 gap-3">{children}</div>
    </div>
  );
}
