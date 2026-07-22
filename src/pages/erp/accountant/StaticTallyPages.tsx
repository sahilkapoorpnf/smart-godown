import { ReactNode, useMemo, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import ErpPage, { Badge, StatTile } from "@/components/erp/ErpPage";
import { DataTable } from "@/components/erp/DataTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import {
  areaCompaniesStatic, auditLogsStatic, dashboardStats, documentsStatic, fmtStaticINR,
  godownMastersStatic, groupMasters, ledgerMasters, reportRowsStatic, stockGroupsStatic,
  stockItemsStatic, stockUnitsStatic, voucherTypeMasters, vouchersStatic, tanksStatic, departmentsStatic, vehiclesStatic, nozzlesStatic, pumpTxnsStatic,
  AreaCompanyStatic, MasterRow, VoucherKind, VoucherRow, TankRow, DepartmentRow, VehicleRow, NozzleRow, PumpTxnRow,
} from "@/lib/erp/staticTallyData";
import {
  ArrowLeftRight, BadgeIndianRupee, Banknote, BookOpen, Building2, Download,
  FileCheck2, FileText, Landmark, Package, Plus, Printer, Receipt, Search,
  ShieldCheck, Truck, Upload, Wallet, ShieldAlert, Clock, CheckCircle2, AlertTriangle,
} from "lucide-react";
import { getDeptSummary, getDeptHealthCounts, healthLabel, HealthStatus, CREDIT_PERIOD_DAYS } from "@/lib/erp/creditData";
import { getCurrentUser } from "@/lib/warehouse/store";

const allowed = ["wh_accountant", "admin_accountant", "accountant", "superadmin"] as any;

// ===== Role-based scoping (Warehouse Accountant = UNA only; Accountant/Neha = all areas) =====
const UNA_GODOWNS = new Set(["UNA Warehouse", "AMB Warehouse", "HAROLI Warehouse", "BANGANA Warehouse"]);
const UNA_COMPANY_NAMES = new Set(["UNA Area"]);
const isUnaScoped = () => getCurrentUser()?.role === "wh_accountant";
const scopeLabel = () => isUnaScoped() ? "Active Company: UNA Area (Warehouse Accountant)" : "All Area Companies — Super Accountant View";
const scopedVouchers = () => isUnaScoped() ? vouchersStatic.filter((v) => UNA_GODOWNS.has(v.godown)) : vouchersStatic;
const scopedGodowns = () => isUnaScoped() ? godownMastersStatic.filter((g: any) => String(g.area) === "UNA Area") : godownMastersStatic;
const scopedCompanies = () => isUnaScoped() ? areaCompaniesStatic.filter((c) => c.code === "UNA") : areaCompaniesStatic;
const scopedDocuments = () => isUnaScoped() ? documentsStatic.filter((d: any) => UNA_GODOWNS.has(d.warehouse) || UNA_COMPANY_NAMES.has(d.company)) : documentsStatic;
const scopedAuditLogs = () => isUnaScoped() ? auditLogsStatic.filter((a: any) => UNA_GODOWNS.has(a.warehouse) || UNA_COMPANY_NAMES.has(a.company)) : auditLogsStatic;
const scopedReportRows = () => {
  if (!isUnaScoped()) return reportRowsStatic;
  return reportRowsStatic.filter((r: any) => UNA_GODOWNS.has(r.godown));
};
const scopedDashboardStats = () => {
  if (!isUnaScoped()) return dashboardStats;
  const v = scopedVouchers();
  return {
    ...dashboardStats,
    totalPurchaseToday: v.filter((x) => x.kind === "purchase").reduce((s, x) => s + x.total, 0),
    totalSalesToday: v.filter((x) => x.kind === "sales").reduce((s, x) => s + x.total, 0),
    pendingVouchers: v.filter((x) => x.status === "Pending").length,
  };
};

const moduleCards = [
  { label: "Company Information", to: "/dashboard/erp/acc/company-info", icon: Building2 },
  { label: "Group Master", to: "/dashboard/erp/acc/masters/groups", icon: BookOpen },
  { label: "Ledger Master", to: "/dashboard/erp/acc/masters/ledgers", icon: FileText },
  { label: "Voucher Types", to: "/dashboard/erp/acc/masters/voucher-types", icon: Receipt },
  { label: "Stock Items", to: "/dashboard/erp/acc/inventory/items", icon: Package },
  { label: "Godowns", to: "/dashboard/erp/acc/inventory/godowns", icon: Truck },
  { label: "Purchase", to: "/dashboard/erp/acc/purchase", icon: BadgeIndianRupee },
  { label: "Sales", to: "/dashboard/erp/acc/sales", icon: Receipt },
  { label: "Day Book", to: "/dashboard/erp/acc/daybook", icon: BookOpen },
  { label: "Reports", to: "/dashboard/erp/acc/reports", icon: FileCheck2 },
];

const voucherTitle: Record<VoucherKind, string> = {
  purchase: "Purchase Voucher",
  sales: "Sales Voucher",
  payment: "Payment Voucher",
  receipt: "Receipt Voucher",
  journal: "Journal Voucher",
  contra: "Contra Voucher",
  stock_transfer: "Stock Transfer Voucher",
};

const reportTitle: Record<string, string> = {
  ledger: "Ledger Report",
  "trial-balance": "Trial Balance",
  cashbook: "Cash Book",
  bankbook: "Bank Book",
  "purchase-register": "Purchase Register",
  "sales-register": "Sales Register",
  "stock-summary": "Stock Summary",
  "warehouse-wise-stock": "Warehouse-wise Stock",
  "stock-register": "Stock Register",
  "stock-movement": "Stock Movement Register",
  "item-wise-stock": "Item-wise Stock Report",
  "godown-wise-stock": "Godown-wise Stock Report",
  gst: "GST Reports",
  "gst-purchase": "GST Purchase Register",
  "gst-sales": "GST Sales Register",
  "hsn-summary": "HSN/SAC Summary",
  "tax-liability": "Tax Liability Report",
  pl: "Profit & Loss Account",
  "balance-sheet": "Balance Sheet",
};

function TallyPage({ title, description, actions, children }: { title: string; description?: string; actions?: ReactNode; children: ReactNode }) {
  return (
    <ErpPage allowed={allowed} title={title} description={description} actions={actions}>
      <div className="rounded-lg border border-himfed-green/20 bg-himfed-green/5 p-3 text-sm flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 font-medium"><Building2 className="w-4 h-4 text-himfed-green" /> {scopeLabel()}</div>
        <div className="flex gap-2">
          <Button asChild size="sm" variant="outline"><Link to="/dashboard/erp/acc/select-company">Select Company</Link></Button>
          <Button asChild size="sm" variant="outline"><Link to="/dashboard/erp/acc/company-create">Create Company</Link></Button>
        </div>
      </div>
      {children}
    </ErpPage>
  );
}

function Field({ label, value, type = "text" }: { label: string; value: string | number; type?: string }) {
  return <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">{label}</Label><Input type={type} value={value} readOnly /></div>;
}

function SelectField({ label, value, options }: { label: string; value: string; options: string[] }) {
  return (
    <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">{label}</Label>
      <Select value={value}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{options.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent></Select>
    </div>
  );
}

function StaticForm({ title, children }: { title: string; children: ReactNode }) {
  return <Card><CardHeader><CardTitle className="text-lg font-serif">{title}</CardTitle></CardHeader><CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">{children}</CardContent></Card>;
}

function StatusBadge({ value }: { value?: string }) {
  return <Badge tone={value === "Active" || value === "Approved" ? "green" : value === "Pending" ? "amber" : "red"}>{value ?? "Active"}</Badge>;
}

function FilteredTable<T extends MasterRow | VoucherRow | AreaCompanyStatic>({ rows, columns, exportName, searchKeys }: { rows: T[]; columns: any[]; exportName: string; searchKeys: (keyof T)[] }) {
  const [status, setStatus] = useState("all");
  const filtered = useMemo(() => status === "all" ? rows : rows.filter((r: any) => r.status === status), [rows, status]);
  return <DataTable rows={filtered as any[]} columns={columns} exportName={exportName} searchKeys={searchKeys as any} filters={<Select value={status} onValueChange={setStatus}><SelectTrigger className="h-9 w-40"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All Status</SelectItem><SelectItem value="Active">Active</SelectItem><SelectItem value="Approved">Approved</SelectItem><SelectItem value="Pending">Pending</SelectItem><SelectItem value="Inactive">Inactive</SelectItem></SelectContent></Select>} />;
}

const actionColumn = { key: "actions", label: "Actions", render: () => <div className="flex gap-1"><Button size="sm" variant="ghost">View</Button><Button size="sm" variant="ghost">Edit</Button><Button size="sm" variant="ghost">Disable</Button></div> };

export function SelectCompanyStatic() {
  const nav = useNavigate();
  const companies = scopedCompanies();
  return (
    <TallyPage title={isUnaScoped() ? "Select Assigned Area Company — UNA" : "Select Area Company — All Areas"} description={isUnaScoped() ? "Warehouse Accountant login — UNA Area only." : "Super Accountant — choose from all assigned area companies."} actions={<Button onClick={() => nav("/dashboard/erp/acc/company-create")}><Plus className="w-4 h-4 mr-2" />New Company Form</Button>}>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {companies.slice(0, 6).map((c) => (
          <Card key={c.id} className="border-himfed-green/20 hover:shadow-md transition-shadow">
            <CardContent className="p-5 space-y-4">
              <div className="flex items-start gap-3"><div className="p-3 rounded-lg bg-himfed-green/10"><Building2 className="w-6 h-6 text-himfed-green" /></div><div><div className="font-serif font-bold text-lg">{c.name}</div><div className="text-xs text-muted-foreground">{c.id} · GST {c.gstNumber}</div></div></div>
              <div className="grid grid-cols-3 gap-2 text-center text-sm"><div className="rounded bg-muted/50 p-2"><div className="text-xs text-muted-foreground">FY</div><b>26-27</b></div><div className="rounded bg-muted/50 p-2"><div className="text-xs text-muted-foreground">Godowns</div><b>{godownMastersStatic.filter((g) => String(g.area).includes(c.code)).length || 2}</b></div><div className="rounded bg-muted/50 p-2"><div className="text-xs text-muted-foreground">Status</div><StatusBadge value={c.status} /></div></div>
              <div className="grid grid-cols-2 gap-2"><Button variant="outline" onClick={() => nav("/dashboard/erp/acc/company-info")}>View / Edit</Button><Button onClick={() => nav("/dashboard/erp/acc")}>Open Company</Button></div>
            </CardContent>
          </Card>
        ))}
      </div>
      <FilteredTable rows={companies} exportName="area-companies" searchKeys={["id", "name", "gstNumber", "district"]} columns={companyColumns} />
    </TallyPage>
  );
}

const companyColumns = [
  { key: "id", label: "Company ID", sortable: true },
  { key: "name", label: "Company Name", sortable: true },
  { key: "gstNumber", label: "GST Number" },
  { key: "fyStart", label: "Financial Year", render: (r: AreaCompanyStatic) => `${r.fyStart} to ${r.fyEnd}` },
  { key: "status", label: "Status", render: (r: AreaCompanyStatic) => <StatusBadge value={r.status} /> },
  { key: "createdDate", label: "Created Date", sortable: true },
  actionColumn,
];

export function CompanyCreationStatic() {
  const c = areaCompaniesStatic[0];
  return (
    <TallyPage title="Area Company Creation" description="Static Tally-style company creation with complete form, list view, filtering, export, and action buttons.">
      <Tabs defaultValue="form"><TabsList><TabsTrigger value="form">Create Company Form</TabsTrigger><TabsTrigger value="list">Company List View</TabsTrigger></TabsList>
        <TabsContent value="form" className="space-y-4">
          <StaticForm title="Basic Information"><Field label="Area Company Name" value={c.name} /><Field label="Area Code" value={c.code} /><Field label="Address" value={c.address} /><Field label="District" value={c.district} /><Field label="State" value={c.state} /><Field label="PIN Code" value={c.pin} /><Field label="Phone Number" value={c.phone} /><Field label="Email" value={c.email} /></StaticForm>
          <StaticForm title="GST Information"><SelectField label="GST Registration Type" value={c.gstType} options={["Regular", "Composition", "Unregistered"]} /><Field label="GST Number" value={c.gstNumber} /><Field label="PAN Number" value={c.pan} /><Field label="GST Effective Date" type="date" value={c.gstEffectiveDate} /></StaticForm>
          <StaticForm title="Financial Configuration"><Field label="Financial Year Start Date" type="date" value={c.fyStart} /><Field label="Financial Year End Date" type="date" value={c.fyEnd} /><Field label="Books Beginning Date" type="date" value={c.booksFrom} /><Field label="Currency" value={c.currency} /><SelectField label="Maintain Accounts" value="Yes" options={["Yes", "No"]} /><SelectField label="Maintain Inventory" value="Yes" options={["Yes", "No"]} /></StaticForm>
          <div className="flex gap-2"><Button>Validate Static Form</Button><Button variant="outline">Preview Company</Button><Button variant="outline">Clear</Button></div>
        </TabsContent>
        <TabsContent value="list"><FilteredTable rows={areaCompaniesStatic} exportName="area-company-list" searchKeys={["id", "name", "gstNumber", "district"]} columns={companyColumns} /></TabsContent>
      </Tabs>
    </TallyPage>
  );
}

export function CompanyInformationStatic() {
  const c = scopedCompanies()[0] ?? areaCompaniesStatic[0];
  const [openDlg, setOpenDlg] = useState<null | "gst" | "fy" | "view">(null);
  return (
    <TallyPage title="Company Information" description="Complete company details, GST configuration, financial year settings and company options.">
      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-1">
          <CardContent className="p-5 space-y-3">
            <Building2 className="w-10 h-10 text-himfed-green" />
            <h2 className="font-serif font-bold text-2xl">{c.name}</h2>
            <p className="text-sm text-muted-foreground">{c.address}, {c.district}, {c.state} - {c.pin}</p>
            <StatusBadge value={c.status} />
            <div className="grid grid-cols-2 gap-2 pt-2">
              <Button>Edit Info</Button>
              <Button variant="outline" onClick={() => setOpenDlg("gst")}>GST Config</Button>
              <Button variant="outline" onClick={() => setOpenDlg("fy")}>FY Settings</Button>
              <Button variant="outline" onClick={() => setOpenDlg("view")}>View Settings</Button>
              <Button asChild variant="outline"><Link to="/dashboard/erp/acc/inventory/godowns">Add New Godown</Link></Button>
            </div>
          </CardContent>
        </Card>
        <div className="lg:col-span-2 space-y-4">
          <StaticForm title="Company Details">
            <Field label="Company ID" value={c.id} />
            <Field label="GST Number" value={c.gstNumber} />
            <Field label="PAN" value={c.pan} />
            <Field label="Phone" value={c.phone} />
            <Field label="Email" value={c.email} />
            <Field label="Currency" value={c.currency} />
          </StaticForm>
          <FilteredTable rows={scopedCompanies()} exportName="company-information" searchKeys={["id", "name", "gstNumber"]} columns={companyColumns} />
        </div>
      </div>

      <Dialog open={openDlg === "gst"} onOpenChange={(o) => !o && setOpenDlg(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>GST Configuration — {c.name}</DialogTitle>
            <DialogDescription>GST registration, tax rates and e-invoicing setup.</DialogDescription>
          </DialogHeader>
          <div className="grid md:grid-cols-2 gap-3">
            <Field label="GSTIN" value={c.gstNumber} />
            <Field label="Legal Name" value={c.name} />
            <Field label="PAN" value={c.pan} />
            <SelectField label="Registration Type" value={c.gstType} options={["Regular", "Composition", "Unregistered"]} />
            <Field label="GST Effective Date" type="date" value={c.gstEffectiveDate} />
            <SelectField label="Place of Supply" value={c.state} options={["Himachal Pradesh", "Punjab", "Haryana", "Delhi"]} />
            <SelectField label="GST Frequency" value="Monthly" options={["Monthly", "Quarterly"]} />
            <Field label="Default CGST %" value="9" />
            <Field label="Default SGST %" value="9" />
            <Field label="Default IGST %" value="18" />
            <SelectField label="E-Invoicing" value="Enabled" options={["Enabled", "Disabled"]} />
            <SelectField label="E-Way Bill" value="Enabled" options={["Enabled", "Disabled"]} />
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setOpenDlg(null)}>Close</Button><Button onClick={() => setOpenDlg(null)}>Save GST Config</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={openDlg === "fy"} onOpenChange={(o) => !o && setOpenDlg(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Financial Year Settings — {c.name}</DialogTitle>
            <DialogDescription>Books period, opening balances and year-end policies.</DialogDescription>
          </DialogHeader>
          <div className="grid md:grid-cols-2 gap-3">
            <Field label="Current FY" value="2026-2027" />
            <Field label="FY Start Date" type="date" value={c.fyStart} />
            <Field label="FY End Date" type="date" value={c.fyEnd} />
            <Field label="Books Beginning From" type="date" value={c.booksFrom} />
            <SelectField label="Maintain Accounts" value={c.maintainAccounts ? "Yes" : "No"} options={["Yes", "No"]} />
            <SelectField label="Maintain Inventory" value={c.maintainInventory ? "Yes" : "No"} options={["Yes", "No"]} />
            <SelectField label="Stock Valuation Method" value="Weighted Average" options={["FIFO", "LIFO", "Weighted Average"]} />
            <SelectField label="Books Locked Till" value="2026-03-31" options={["2025-03-31", "2026-03-31", "Not Locked"]} />
            <SelectField label="Auto Close on FY End" value="Yes" options={["Yes", "No"]} />
            <Field label="Opening Cash" value={fmtStaticINR(250000)} />
            <Field label="Opening Bank" value={fmtStaticINR(1850000)} />
            <Field label="Opening Stock Value" value={fmtStaticINR(18250000)} />
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setOpenDlg(null)}>Close</Button><Button onClick={() => setOpenDlg(null)}>Save FY Settings</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={openDlg === "view"} onOpenChange={(o) => !o && setOpenDlg(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>View Settings — {c.name}</DialogTitle>
            <DialogDescription>Display preferences for vouchers, reports and dashboards.</DialogDescription>
          </DialogHeader>
          <div className="grid md:grid-cols-2 gap-3">
            <SelectField label="Default View" value="Tally Classic" options={["Tally Classic", "Modern", "Compact"]} />
            <SelectField label="Date Format" value="DD-MM-YYYY" options={["DD-MM-YYYY", "YYYY-MM-DD", "MM/DD/YYYY"]} />
            <SelectField label="Number Format" value="Indian (1,00,000)" options={["Indian (1,00,000)", "International (100,000)"]} />
            <SelectField label="Default Voucher Mode" value="Item Invoice" options={["Item Invoice", "Accounting Invoice", "As Voucher"]} />
            <SelectField label="Show Inventory in Vouchers" value="Yes" options={["Yes", "No"]} />
            <SelectField label="Show Narration by Default" value="Yes" options={["Yes", "No"]} />
            <SelectField label="Theme" value="Forest Green" options={["Forest Green", "Amber", "System"]} />
            <SelectField label="Rows per Page" value="25" options={["10", "25", "50", "100"]} />
            <div className="flex items-center justify-between rounded border p-3"><span className="text-sm">Enable Print Preview</span><Switch defaultChecked /></div>
            <div className="flex items-center justify-between rounded border p-3"><span className="text-sm">Show Closing Stock on Dashboard</span><Switch defaultChecked /></div>
            <div className="flex items-center justify-between rounded border p-3"><span className="text-sm">Enable Quick Add Shortcuts</span><Switch defaultChecked /></div>
            <div className="flex items-center justify-between rounded border p-3"><span className="text-sm">Compact Sidebar</span><Switch /></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setOpenDlg(null)}>Close</Button><Button onClick={() => setOpenDlg(null)}>Save View Settings</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </TallyPage>
  );
}

function MasterStaticPage({ type }: { type: "groups" | "ledgers" | "voucher-types" }) {
  const map = {
    groups: { title: "Group Master", rows: groupMasters, fields: ["Group Name", "Under Group", "Nature"], keys: ["id", "name", "under", "nature", "status"] },
    ledgers: { title: "Ledger Master", rows: ledgerMasters, fields: ["Ledger Name", "Under Group", "Opening Balance", "Debit/Credit", "GST Applicable", "GST Details", "Address", "Contact Information"], keys: ["id", "name", "under", "openingBalance", "drCr", "gstin", "status"] },
    "voucher-types": { title: "Voucher Type Master", rows: voucherTypeMasters, fields: ["Voucher Type Name", "Prefix", "Category", "Numbering", "Activate / Deactivate"], keys: ["id", "name", "prefix", "category", "numbering", "status"] },
  }[type];
  const sample = map.rows[0];
  const columns = map.keys.map((k) => ({ key: k, label: k.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase()), render: k === "status" ? (r: any) => <StatusBadge value={r.status} /> : undefined })).concat(actionColumn);
  return <TallyPage title={map.title} description="Static master management with add form, list view, filters, pagination and export."><StaticForm title={`Add / Edit ${map.title}`}>{map.fields.map((f, i) => <Field key={f} label={f} value={String(Object.values(sample)[i + 1] ?? f)} />)}<div className="md:col-span-2 lg:col-span-3 flex gap-2"><Button>Save Static Master</Button><Button variant="outline">Reset</Button></div></StaticForm><FilteredTable rows={map.rows} exportName={type} searchKeys={["id", "name"] as any} columns={columns} /></TallyPage>;
}

export const GroupMasterStatic = () => <MasterStaticPage type="groups" />;
export const LedgerMasterStatic = () => <MasterStaticPage type="ledgers" />;
export const VoucherTypeMasterStatic = () => <MasterStaticPage type="voucher-types" />;

function InventoryStaticPage({ type }: { type: "groups" | "items" | "units" | "godowns" }) {
  const map = {
    groups: { title: "Stock Group Master", rows: stockGroupsStatic, fields: ["Stock Group Name", "Under"], keys: ["id", "name", "under", "status"] },
    items: { title: "Stock Item Master", rows: stockItemsStatic, fields: ["Item Name", "Stock Group", "Unit", "HSN/SAC Code", "GST Rate", "Opening Quantity", "Opening Value", "Default Godown"], keys: ["id", "name", "group", "unit", "hsn", "gstRate", "openingQty", "openingValue", "defaultGodown", "status"] },
    units: { title: "Stock Unit Master", rows: stockUnitsStatic, fields: ["Unit Code", "Unit Name", "Decimals"], keys: ["id", "code", "name", "decimals", "status"] },
    godowns: { title: "Godown / Warehouse Master", rows: scopedGodowns(), fields: ["Warehouse Name", "Warehouse Code", "Address", "Area Officer Assigned", "Warehouse User Assigned", "Status"], keys: ["id", "name", "code", "area", "address", "officer", "user", "utilization", "status"] },
  }[type];
  const sample = map.rows[0];
  const columns = map.keys.map((k) => ({ key: k, label: k.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase()), render: k === "status" ? (r: any) => <StatusBadge value={r.status} /> : k === "utilization" ? (r: any) => <Badge tone={Number(r.utilization) > 90 ? "red" : "green"}>{r.utilization}%</Badge> : undefined })).concat(actionColumn);
  return <TallyPage title={map.title} description="Static inventory master with HIMFED Area → multiple Godowns hierarchy."><StaticForm title={`Create / Update ${map.title}`}>{map.fields.map((f, i) => <Field key={f} label={f} value={String(Object.values(sample)[i + 1] ?? f)} />)}<div className="md:col-span-2 lg:col-span-3 flex gap-2"><Button>Save Static Inventory</Button><Button variant="outline">Disable</Button></div></StaticForm><FilteredTable rows={map.rows} exportName={type} searchKeys={["id", "name"] as any} columns={columns} /></TallyPage>;
}

export const StockGroupStatic = () => <InventoryStaticPage type="groups" />;
export const StockUnitStatic = () => <InventoryStaticPage type="units" />;

export function StockItemStatic() {
  const rows = stockItemsStatic;
  const groups = stockGroupsStatic.map((g) => String(g.name));
  const units = stockUnitsStatic.map((u) => String(u.code));
  const godownOptions = scopedGodowns().map((g: any) => String(g.name));
  const [alterId, setAlterId] = useState<string>(String(rows[0].id));
  const alterRow = rows.find((r) => String(r.id) === alterId) ?? rows[0];

  const cols = [
    { key: "id", label: "Item ID", sortable: true },
    { key: "name", label: "Product Name", sortable: true, render: (r: any) => <span className="font-semibold">{r.name}</span> },
    { key: "group", label: "Stock Group", render: (r: any) => <Badge tone="blue">{r.group}</Badge> },
    { key: "unit", label: "Unit" },
    { key: "hsn", label: "HSN/SAC", render: (r: any) => <span className="font-mono text-xs">{r.hsn}</span> },
    { key: "gstRate", label: "GST %", render: (r: any) => `${r.gstRate}%` },
    { key: "openingQty", label: "Opening Qty", className: "text-right" },
    { key: "openingValue", label: "Opening Value", className: "text-right font-mono", render: (r: any) => fmtStaticINR(r.openingValue) },
    { key: "defaultGodown", label: "Default Godown" },
    { key: "status", label: "Status", render: (r: any) => <StatusBadge value={r.status} /> },
    actionColumn,
  ];

  return (
    <TallyPage
      title="Product Master"
      description="Petrol Pump Masters → Product Master. Create, alter and list stock items (products) — Tally-style."
      actions={<Button asChild variant="outline"><Link to="/dashboard/erp/acc/inventory/groups"><Package className="w-4 h-4 mr-2" />Stock Groups</Link></Button>}
    >
      <Tabs defaultValue="create">
        <TabsList>
          <TabsTrigger value="create"><Plus className="w-3 h-3 mr-1" />Create Product</TabsTrigger>
          <TabsTrigger value="alter">Alter Product</TabsTrigger>
          <TabsTrigger value="list">Product List ({rows.length})</TabsTrigger>
        </TabsList>

        {/* ============ CREATE PRODUCT ============ */}
        <TabsContent value="create" className="space-y-4">
          <div className="rounded border-2 border-himfed-green bg-himfed-green/5 p-2 text-xs font-semibold text-himfed-green">
            Stock Item Creation — HIMFED-{scopedCompanies()[0]?.code ?? "UNA"}
          </div>
          <StaticForm title="Product Identification">
            <Field label="Name *" value="HSD" />
            <Field label="Alias" value="High Speed Diesel" />
            <SelectField label="Under (Stock Group) *" value="FUEL" options={groups} />
            <SelectField label="Units *" value="LTR" options={units} />
          </StaticForm>

          <StaticForm title="Statutory Details">
            <SelectField label="GST Applicability" value="Applicable" options={["Applicable", "Not Applicable", "Exempt"]} />
            <SelectField label="HSN/SAC Details" value="As per Company/Stock Group" options={["As per Company/Stock Group", "Specify Details Here"]} />
            <Field label="HSN/SAC Code" value="27101930" />
            <Field label="HSN Description" value="High Speed Diesel Oil" />
            <SelectField label="GST Rate Details" value="As per Company/Stock Group" options={["As per Company/Stock Group", "Specify Details Here"]} />
            <SelectField label="Taxability Type" value="Taxable" options={["Taxable", "Exempt", "Nil Rated"]} />
            <Field label="GST Rate %" value="0" />
            <SelectField label="Type of Supply" value="Goods" options={["Goods", "Services"]} />
            <Field label="Rate of Duty (eg 5)" value="0" />
          </StaticForm>

          <StaticForm title="Opening Balance">
            <Field label="Opening Quantity" value="0" />
            <Field label="Rate per Unit" value="₹ 92.00" />
            <Field label="Opening Value" value={fmtStaticINR(0)} />
            <SelectField label="Default Godown" value={godownOptions[0] ?? "UNA Warehouse"} options={godownOptions} />
          </StaticForm>

          <div className="flex gap-2">
            <Button><Plus className="w-4 h-4 mr-2" />Accept (Save Product)</Button>
            <Button variant="outline">Yes</Button>
            <Button variant="outline">No</Button>
            <Button variant="ghost">Quit</Button>
          </div>
        </TabsContent>

        {/* ============ ALTER PRODUCT ============ */}
        <TabsContent value="alter" className="space-y-4">
          <div className="rounded border-2 border-amber-500 bg-amber-500/5 p-2 text-xs font-semibold text-amber-700">
            Stock Item Alteration — HIMFED-{scopedCompanies()[0]?.code ?? "UNA"}
          </div>
          <Card>
            <CardHeader><CardTitle className="text-lg font-serif">Select Product to Alter</CardTitle></CardHeader>
            <CardContent className="grid md:grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Product Master List</Label>
                <Select value={alterId} onValueChange={setAlterId}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{rows.map((r) => <SelectItem key={String(r.id)} value={String(r.id)}>{String(r.name)}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <Field label="Item Code" value={String(alterRow.id)} />
              <StatusBadge value={String(alterRow.status)} />
            </CardContent>
          </Card>

          <StaticForm title="Product Identification">
            <Field label="Name *" value={String(alterRow.name)} />
            <Field label="Alias" value={String(alterRow.name)} />
            <SelectField label="Under (Stock Group) *" value={String(alterRow.group)} options={groups} />
            <SelectField label="Units *" value={String(alterRow.unit)} options={units} />
          </StaticForm>

          <StaticForm title="Statutory Details">
            <SelectField label="GST Applicability" value="Applicable" options={["Applicable", "Not Applicable", "Exempt"]} />
            <SelectField label="HSN/SAC Details" value="As per Company/Stock Group" options={["As per Company/Stock Group", "Specify Details Here"]} />
            <Field label="HSN/SAC Code" value={String(alterRow.hsn)} />
            <SelectField label="Taxability Type" value={Number(alterRow.gstRate) > 0 ? "Taxable" : "Nil Rated"} options={["Taxable", "Exempt", "Nil Rated"]} />
            <Field label="GST Rate %" value={String(alterRow.gstRate)} />
            <SelectField label="Type of Supply" value="Goods" options={["Goods", "Services"]} />
          </StaticForm>

          <StaticForm title="Opening Balance">
            <Field label="Opening Quantity" value={String(alterRow.openingQty)} />
            <Field label="Opening Value" value={fmtStaticINR(Number(alterRow.openingValue))} />
            <SelectField label="Default Godown" value={String(alterRow.defaultGodown)} options={godownOptions.length ? godownOptions : [String(alterRow.defaultGodown)]} />
          </StaticForm>

          <div className="flex gap-2">
            <Button><FileCheck2 className="w-4 h-4 mr-2" />Accept Changes</Button>
            <Button variant="outline">Yes</Button>
            <Button variant="outline">No</Button>
            <Button variant="destructive">Delete Product</Button>
          </div>
        </TabsContent>

        {/* ============ PRODUCT LIST ============ */}
        <TabsContent value="list" className="space-y-3">
          <Card className="border-himfed-green/20">
            <CardHeader className="pb-3"><CardTitle className="text-base font-serif">PRODUCT MASTER LIST</CardTitle></CardHeader>
            <CardContent>
              <FilteredTable rows={rows} exportName="product-master" searchKeys={["id", "name", "group", "hsn"] as any} columns={cols} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </TallyPage>
  );
}
export function GodownMasterStatic() {
  const rows = scopedGodowns();
  const una = isUnaScoped();
  const areaOptions = una ? ["UNA Area"] : areaCompaniesStatic.map((c) => c.name);
  const cols = ["id", "name", "code", "area", "address", "officer", "user", "capacity", "utilization", "status"].map((k) => ({
    key: k,
    label: k.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase()),
    render: k === "status" ? (r: any) => <StatusBadge value={r.status} />
      : k === "utilization" ? (r: any) => <Badge tone={Number(r.utilization) > 90 ? "red" : "green"}>{r.utilization}%</Badge>
      : k === "capacity" ? (r: any) => `${r.capacity} MT` : undefined,
  })).concat(actionColumn);

  return (
    <TallyPage title="Godown / Warehouse Master" description="Create a new godown under any area with full company-style configuration (basic info, GST, financial year and operations).">
      <Tabs defaultValue="create">
        <TabsList>
          <TabsTrigger value="create"><Plus className="w-3 h-3 mr-1" />Add New Godown</TabsTrigger>
          <TabsTrigger value="list">Godown List View</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-4">
          <StaticForm title="Basic Information">
            <Field label="Warehouse Name" value="New Pekhubela Warehouse" />
            <Field label="Warehouse Code" value="PEK-WH" />
            <SelectField label="Under Area Company" value={areaOptions[0]} options={areaOptions} />
            <Field label="Address Line" value="Pekhubela, Tehsil Haroli" />
            <Field label="District" value={una ? "Una" : "Una"} />
            <SelectField label="State" value="Himachal Pradesh" options={["Himachal Pradesh", "Punjab", "Haryana"]} />
            <Field label="PIN Code" value="174306" />
            <Field label="Phone Number" value="+91 1975 220990" />
            <Field label="Email" value="pekhubela@himfed.in" />
          </StaticForm>

          <StaticForm title="GST Information">
            <SelectField label="GST Registration Type" value="Regular" options={["Regular", "Composition", "Unregistered"]} />
            <Field label="GSTIN" value="02AAACH1234R2Z5" />
            <Field label="PAN Number" value="AAACH1234R" />
            <Field label="GST Effective Date" type="date" value="2017-07-01" />
            <SelectField label="Place of Supply" value="Himachal Pradesh" options={["Himachal Pradesh", "Punjab", "Haryana"]} />
            <SelectField label="E-Way Bill" value="Enabled" options={["Enabled", "Disabled"]} />
          </StaticForm>

          <StaticForm title="Financial Year Settings">
            <Field label="FY Start Date" type="date" value="2026-04-01" />
            <Field label="FY End Date" type="date" value="2027-03-31" />
            <Field label="Books Beginning From" type="date" value="2026-04-01" />
            <Field label="Currency" value="INR" />
            <SelectField label="Maintain Accounts" value="Yes" options={["Yes", "No"]} />
            <SelectField label="Maintain Inventory" value="Yes" options={["Yes", "No"]} />
            <SelectField label="Stock Valuation" value="Weighted Average" options={["FIFO", "LIFO", "Weighted Average"]} />
            <Field label="Opening Stock Value" value={fmtStaticINR(1250000)} />
          </StaticForm>

          <StaticForm title="Operations & Capacity">
            <Field label="Storage Capacity (MT)" value="3200" />
            <Field label="Current Utilization (%)" value="0" />
            <SelectField label="Area Officer Assigned" value={una ? "Bhuvnesh Sood" : "Bhuvnesh Sood"} options={["Bhuvnesh Sood", "Rajeev Bansal", "Anita Sharma", "Vikram Thakur"]} />
            <SelectField label="Warehouse User Assigned" value="Sanjay Kumar" options={["Sanjay Kumar", "Anil Chauhan", "Pooja Devi", "Rohit Kashyap"]} />
            <SelectField label="Default Voucher Mode" value="Item Invoice" options={["Item Invoice", "Accounting Invoice", "As Voucher"]} />
            <SelectField label="Status" value="Active" options={["Active", "Inactive"]} />
          </StaticForm>

          <div className="flex gap-2">
            <Button><Plus className="w-4 h-4 mr-2" />Save New Godown</Button>
            <Button variant="outline">Preview Godown</Button>
            <Button variant="outline">Clear</Button>
          </div>
        </TabsContent>

        <TabsContent value="list">
          <FilteredTable rows={rows} exportName="godowns" searchKeys={["id", "name", "code", "area"] as any} columns={cols} />
        </TabsContent>
      </Tabs>
    </TallyPage>
  );
}

export function TallyDashboardStatic() {
  const stats = scopedDashboardStats();
  const recent = scopedVouchers().slice(0, 10);
  const title = isUnaScoped() ? "Tally Style Dashboard — UNA Area" : "Tally Style Dashboard — All Areas (Super Accountant)";
  return <TallyPage title={title} description="Area Company books with connected warehouses, stock, vouchers, GST and reports."><div className="grid grid-cols-2 lg:grid-cols-4 gap-4"><StatTile label="Total Purchase Today" value={fmtStaticINR(stats.totalPurchaseToday)} tone="blue" /><StatTile label="Total Sales Today" value={fmtStaticINR(stats.totalSalesToday)} tone="green" /><StatTile label="Current Stock Value" value={fmtStaticINR(stats.currentStockValue)} tone="amber" /><StatTile label="Pending Vouchers" value={stats.pendingVouchers} tone="red" /><StatTile label="Cash Balance" value={fmtStaticINR(stats.cashBalance)} /><StatTile label="Bank Balance" value={fmtStaticINR(stats.bankBalance)} /><StatTile label="Receivables" value={fmtStaticINR(stats.receivables)} tone="green" /><StatTile label="Payables" value={fmtStaticINR(stats.payables)} tone="red" /></div><div className="grid md:grid-cols-2 lg:grid-cols-5 gap-3">{moduleCards.map((m) => <Button key={m.to} asChild variant="outline" className="h-20 flex-col gap-2"><Link to={m.to}><m.icon className="w-5 h-5" /><span>{m.label}</span></Link></Button>)}</div><FilteredTable rows={recent} exportName="recent-vouchers" searchKeys={["voucherNo", "party", "ledger"]} columns={voucherColumns} /></TallyPage>;
}

const voucherColumns = [
  { key: "date", label: "Date", sortable: true },
  { key: "voucherNo", label: "Voucher Number" },
  { key: "party", label: "Party" },
  { key: "ledger", label: "Ledger" },
  { key: "item", label: "Stock Item" },
  { key: "godown", label: "Godown" },
  { key: "debit", label: "Debit", className: "text-right", render: (r: VoucherRow) => fmtStaticINR(r.debit) },
  { key: "credit", label: "Credit", className: "text-right", render: (r: VoucherRow) => fmtStaticINR(r.credit) },
  { key: "status", label: "Status", render: (r: VoucherRow) => <StatusBadge value={r.status} /> },
  { key: "actions", label: "Actions", render: () => <div className="flex gap-1"><Button size="sm" variant="ghost"><Printer className="w-3 h-3" /></Button><Button size="sm" variant="ghost">View</Button></div> },
];

export function VoucherStaticPage({ kind }: { kind: VoucherKind }) {
  const rows = scopedVouchers().filter((v) => v.kind === kind);
  const first = rows[0];
  return <TallyPage title={voucherTitle[kind]} description="Static Tally-style voucher entry screen with form, validations preview, list view, filters and export."><StaticForm title={`New ${voucherTitle[kind]}`}><Field label="Voucher Number" value={first.voucherNo} /><Field label="Date" type="date" value={first.date} /><Field label={kind === "sales" ? "Customer Name" : kind === "purchase" ? "Supplier" : "Party / Ledger"} value={first.party} /><Field label="Ledger" value={first.ledger} /><Field label="Invoice Number" value={first.invoiceNo} /><Field label="Stock Item" value={first.item} /><Field label="Godown / Warehouse" value={first.godown} /><Field label="Quantity" value={first.qty} /><Field label="Rate" value={first.rate} /><Field label="GST Details" value={fmtStaticINR(first.gst)} /><Field label="Total Amount" value={fmtStaticINR(first.total)} /><div className="space-y-1.5 md:col-span-2"><Label className="text-xs text-muted-foreground">Narration</Label><Textarea value={first.narration} readOnly /></div><div className="md:col-span-2 lg:col-span-3 flex gap-2"><Button>Save Static Voucher</Button><Button variant="outline"><Upload className="w-4 h-4 mr-2" />Document Upload</Button><Button variant="outline">Preview Accounting Impact</Button></div></StaticForm><FilteredTable rows={rows} exportName={`${kind}-vouchers`} searchKeys={["voucherNo", "party", "ledger", "item"]} columns={voucherColumns} /></TallyPage>;
}

export function DayBookStatic() {
  const SINGLE_DATE = "2026-06-22";
  const rows = scopedVouchers()
    .filter((v) => v.kind === "sales" || v.kind === "journal" || v.kind === "purchase")
    .map((v) => ({ ...v, date: SINGLE_DATE }));
  const dayBookColumns = [
    { key: "date", label: "Date", sortable: true },
    { key: "voucherNo", label: "Voucher Number" },
    { key: "party", label: "Party" },
    { key: "kind", label: "Voucher Type", render: (r: VoucherRow) => <Badge tone="blue">{r.kind.replace("_", " ")}</Badge> },
    { key: "item", label: "Stock Item" },
    { key: "godown", label: "Godown" },
    { key: "debit", label: "Debit", className: "text-right", render: (r: VoucherRow) => fmtStaticINR(r.debit) },
    { key: "credit", label: "Credit", className: "text-right", render: (r: VoucherRow) => fmtStaticINR(r.credit) },
    { key: "status", label: "Status", render: (r: VoucherRow) => <StatusBadge value={r.status} /> },
    { key: "actions", label: "Actions", render: () => <div className="flex gap-1"><Button size="sm" variant="ghost"><Printer className="w-3 h-3" /></Button><Button size="sm" variant="ghost">View</Button></div> },
  ];
  return <TallyPage title="Day Book" description="Sales and Journal vouchers for the day."><FilteredTable rows={rows} exportName="day-book" searchKeys={["voucherNo", "party", "kind", "godown"]} columns={dayBookColumns} /></TallyPage>;

}

export function ReportsLandingStatic() {
  const reports = Object.entries(reportTitle);
  return <TallyPage title="Reports" description="Accounting, inventory, GST and financial statement reports."><div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">{reports.map(([key, label]) => <Button key={key} asChild variant="outline" className="h-16 justify-start"><Link to={`/dashboard/erp/acc/reports/${key}`}><FileText className="w-5 h-5 mr-2" />{label}</Link></Button>)}</div><FilteredTable rows={scopedReportRows()} exportName="reports-summary" searchKeys={["id", "particular", "ledger", "godown"] as any} columns={reportColumns} /></TallyPage>;
}

const reportColumns = ["particular", "ledger", "godown", "opening", "debit", "credit", "closing", "gst", "status"].map((k) => ({ key: k, label: k.replace(/^./, (s) => s.toUpperCase()), render: ["opening", "debit", "credit", "closing", "gst"].includes(k) ? (r: any) => fmtStaticINR(Number(r[k])) : k === "status" ? (r: any) => <StatusBadge value={r.status} /> : undefined }));

export function ReportStaticPage() {
  const { report = "ledger" } = useParams();
  return <TallyPage title={reportTitle[report] ?? "Report"} description="Static filtered report with 10 relevant entries, export and print actions." actions={<><Button variant="outline"><Printer className="w-4 h-4 mr-2" />Print</Button><Button><Download className="w-4 h-4 mr-2" />Export</Button></>}><FilteredTable rows={scopedReportRows()} exportName={report} searchKeys={["id", "particular", "ledger", "godown"] as any} columns={reportColumns} /></TallyPage>;
}

export function DocumentsStatic() {
  return <TallyPage title="Documents" description="Purchase bills, sales bills, GST documents, challans and stock transfer documents."><StaticForm title="Upload / Tag Document"><Field label="Document Type" value="Purchase Bills" /><Field label="Reference Number" value="REF-8600" /><Field label="Company" value={isUnaScoped() ? "UNA Area" : "All Areas"} /><Field label="Warehouse" value={isUnaScoped() ? "UNA Warehouse" : "Multi-Warehouse"} /><Field label="Upload File" value="purchase_bill_2100.pdf" /><div className="md:col-span-2 lg:col-span-3"><Button><Upload className="w-4 h-4 mr-2" />Upload Static Document</Button></div></StaticForm><FilteredTable rows={scopedDocuments()} exportName="documents" searchKeys={["id", "name", "refNo", "warehouse"] as any} columns={["id", "name", "type", "refNo", "company", "warehouse", "uploadedBy", "uploadedAt", "status"].map((k) => ({ key: k, label: k.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase()), render: k === "status" ? (r: any) => <StatusBadge value={r.status} /> : undefined })).concat(actionColumn)} /></TallyPage>;
}

export function AuditLogsStatic() {
  return <TallyPage title="Audit Logs" description="Tracks user, role, company, warehouse, action, old value, new value and date-time."><FilteredTable rows={scopedAuditLogs()} exportName="audit-logs" searchKeys={["id", "userName", "role", "company", "warehouse", "action"] as any} columns={["id", "userName", "role", "company", "warehouse", "action", "oldValue", "newValue", "dateTime"].map((k) => ({ key: k, label: k.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase()) }))} /></TallyPage>;
}

// ============ TANK MASTER — linked to HSD / ULP products ============
const scopedTanks = () => isUnaScoped() ? tanksStatic.filter((t) => UNA_GODOWNS.has(t.godown)) : tanksStatic;

export function TankMasterStatic() {
  const rows = scopedTanks();
  const fuelItems = stockItemsStatic.filter((i) => String(i.name) === "HSD" || String(i.name) === "ULP");
  const godownOptions = scopedGodowns().map((g: any) => String(g.name));
  const [productFilter, setProductFilter] = useState<"all" | "HSD" | "ULP">("all");
  const [alterId, setAlterId] = useState<string>(rows[0]?.id ?? "TNK-001");
  const alterRow = rows.find((r) => r.id === alterId) ?? rows[0];

  const filteredRows = productFilter === "all" ? rows : rows.filter((r) => r.product === productFilter);

  const util = (r: TankRow) => Math.round((r.currentStockLtr / r.capacityLtr) * 100);

  const cols = [
    { key: "id", label: "Tank ID", sortable: true },
    { key: "tankCode", label: "Tank Code", render: (r: TankRow) => <span className="font-mono text-xs font-bold">{r.tankCode}</span> },
    { key: "tankName", label: "Tank Name", sortable: true, render: (r: TankRow) => <span className="font-semibold">{r.tankName}</span> },
    { key: "product", label: "Product", render: (r: TankRow) => <Badge tone={r.product === "HSD" ? "amber" : "green"}>{r.product}</Badge> },
    { key: "productId", label: "Linked Item", render: (r: TankRow) => <span className="font-mono text-xs">{r.productId}</span> },
    { key: "godown", label: "Godown" },
    { key: "area", label: "Area" },
    { key: "capacityLtr", label: "Capacity (L)", className: "text-right", render: (r: TankRow) => r.capacityLtr.toLocaleString() },
    { key: "currentStockLtr", label: "Current Stock (L)", className: "text-right", render: (r: TankRow) => r.currentStockLtr.toLocaleString() },
    { key: "utilization", label: "Utilization", render: (r: TankRow) => <Badge tone={util(r) > 90 ? "red" : util(r) > 60 ? "amber" : "green"}>{util(r)}%</Badge> },
    { key: "dipReading", label: "Dip (cm)", className: "text-right" },
    { key: "status", label: "Status", render: (r: TankRow) => <StatusBadge value={r.status} /> },
    actionColumn,
  ];

  const productChip = (p: "HSD" | "ULP") => (
    <Badge tone={p === "HSD" ? "amber" : "green"}>{p}</Badge>
  );

  return (
    <TallyPage
      title="Tank Master — Petrol Pump"
      description="Every tank is linked to a fuel product (HSD or ULP) and belongs to a godown. Create tanks under each product for accurate dip / stock tracking."
      actions={<Button asChild variant="outline"><Link to="/dashboard/erp/acc/inventory/items"><Package className="w-4 h-4 mr-2" />Product Master</Link></Button>}
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {(["HSD", "ULP"] as const).map((p) => {
          const list = rows.filter((r) => r.product === p);
          const totCap = list.reduce((s, r) => s + r.capacityLtr, 0);
          const totCur = list.reduce((s, r) => s + r.currentStockLtr, 0);
          return (
            <Card key={p} className="border-himfed-green/20">
              <CardContent className="p-4 space-y-1">
                <div className="flex items-center justify-between"><div className="text-xs text-muted-foreground">Product</div>{productChip(p)}</div>
                <div className="text-xl font-serif font-bold">{list.length} Tanks</div>
                <div className="text-xs text-muted-foreground">Capacity {totCap.toLocaleString()} L · Stock {totCur.toLocaleString()} L</div>
              </CardContent>
            </Card>
          );
        })}
        <Card className="border-himfed-green/20"><CardContent className="p-4 space-y-1"><div className="text-xs text-muted-foreground">Total Tanks</div><div className="text-xl font-serif font-bold">{rows.length}</div><div className="text-xs text-muted-foreground">Across {new Set(rows.map((r) => r.godown)).size} godowns</div></CardContent></Card>
        <Card className="border-himfed-green/20"><CardContent className="p-4 space-y-1"><div className="text-xs text-muted-foreground">Above 90% Utilization</div><div className="text-xl font-serif font-bold text-destructive">{rows.filter((r) => util(r) > 90).length}</div><div className="text-xs text-muted-foreground">Refill alert</div></CardContent></Card>
      </div>

      <Tabs defaultValue="create">
        <TabsList>
          <TabsTrigger value="create"><Plus className="w-3 h-3 mr-1" />Create Tank</TabsTrigger>
          <TabsTrigger value="alter">Alter Tank</TabsTrigger>
          <TabsTrigger value="list">Tank List ({rows.length})</TabsTrigger>
        </TabsList>

        {/* ============ CREATE TANK ============ */}
        <TabsContent value="create" className="space-y-4">
          <div className="rounded border-2 border-himfed-green bg-himfed-green/5 p-2 text-xs font-semibold text-himfed-green">
            Tank Creation — Petrol Pump Masters → Tank Master → Create Tank
          </div>
          <StaticForm title="Tank Identification">
            <Field label="Tank Name *" value="ULP TANK 03" />
            <Field label="Tank Code *" value="UNA-ULP-T3" />
            <SelectField label="Linked Product *" value="ULP" options={["HSD", "ULP"]} />
            <SelectField label="Linked Item Code" value="ITM-011" options={fuelItems.map((i) => String(i.id))} />
            <SelectField label="Under (Godown) *" value={godownOptions[0] ?? "UNA Warehouse"} options={godownOptions} />
            <SelectField label="Under Group" value="Primary" options={["Primary", "Fuel Tanks", "Underground Tanks"]} />
          </StaticForm>

          <StaticForm title="Capacity & Calibration">
            <Field label="Total Capacity (Litres) *" value="15000" />
            <Field label="Opening Stock (Litres)" value="0" />
            <Field label="Dead Stock (Litres)" value="200" />
            <Field label="Initial Dip Reading (cm)" value="0" />
            <Field label="Last Calibrated On" type="date" value="2026-04-01" />
            <SelectField label="Tank Type" value="Underground" options={["Underground", "Above Ground"]} />
          </StaticForm>

          <StaticForm title="Operations">
            <SelectField label="Status" value="Active" options={["Active", "Inactive"]} />
            <Field label="Assigned Operator" value="Anil Chauhan" />
            <Field label="Remarks" value="Newly installed ULP tank" />
          </StaticForm>

          <div className="flex gap-2">
            <Button><Plus className="w-4 h-4 mr-2" />Accept (Save Tank)</Button>
            <Button variant="outline">Yes</Button>
            <Button variant="outline">No</Button>
            <Button variant="ghost">Quit</Button>
          </div>
        </TabsContent>

        {/* ============ ALTER TANK ============ */}
        <TabsContent value="alter" className="space-y-4">
          <div className="rounded border-2 border-amber-500 bg-amber-500/5 p-2 text-xs font-semibold text-amber-700">
            Tank Alteration — Select a tank to modify its configuration
          </div>
          <Card>
            <CardHeader><CardTitle className="text-lg font-serif">Select Tank to Alter</CardTitle></CardHeader>
            <CardContent className="grid md:grid-cols-4 gap-3">
              <div className="space-y-1.5 md:col-span-2">
                <Label className="text-xs text-muted-foreground">Tank Master List</Label>
                <Select value={alterId} onValueChange={setAlterId}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{rows.map((r) => <SelectItem key={r.id} value={r.id}>{r.tankCode} · {r.tankName} ({r.product})</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <Field label="Tank ID" value={alterRow?.id ?? ""} />
              <div className="flex items-end gap-2"><StatusBadge value={alterRow?.status} />{alterRow && productChip(alterRow.product)}</div>
            </CardContent>
          </Card>

          {alterRow && (
            <>
              <StaticForm title="Tank Identification">
                <Field label="Tank Name *" value={alterRow.tankName} />
                <Field label="Tank Code *" value={alterRow.tankCode} />
                <SelectField label="Linked Product *" value={alterRow.product} options={["HSD", "ULP"]} />
                <SelectField label="Linked Item Code" value={alterRow.productId} options={fuelItems.map((i) => String(i.id))} />
                <SelectField label="Under (Godown) *" value={alterRow.godown} options={godownOptions.length ? godownOptions : [alterRow.godown]} />
                <Field label="Area" value={alterRow.area} />
              </StaticForm>

              <StaticForm title="Capacity & Calibration">
                <Field label="Total Capacity (Litres) *" value={String(alterRow.capacityLtr)} />
                <Field label="Current Stock (Litres)" value={String(alterRow.currentStockLtr)} />
                <Field label="Current Dip Reading (cm)" value={String(alterRow.dipReading)} />
                <Field label="Last Calibrated On" type="date" value={alterRow.lastCalibratedOn} />
                <Field label="Utilization %" value={`${util(alterRow)}%`} />
                <SelectField label="Status" value={alterRow.status} options={["Active", "Inactive"]} />
              </StaticForm>

              <div className="flex gap-2">
                <Button><FileCheck2 className="w-4 h-4 mr-2" />Accept Changes</Button>
                <Button variant="outline">Yes</Button>
                <Button variant="outline">No</Button>
                <Button variant="destructive">Delete Tank</Button>
              </div>
            </>
          )}
        </TabsContent>

        {/* ============ TANK LIST ============ */}
        <TabsContent value="list" className="space-y-3">
          <Card className="border-himfed-green/20">
            <CardHeader className="pb-3 flex-row items-center justify-between space-y-0">
              <CardTitle className="text-base font-serif">TANK MASTER LIST</CardTitle>
              <Select value={productFilter} onValueChange={(v: any) => setProductFilter(v)}>
                <SelectTrigger className="h-9 w-40"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Products</SelectItem>
                  <SelectItem value="HSD">HSD Only</SelectItem>
                  <SelectItem value="ULP">ULP Only</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent>
              <DataTable
                rows={filteredRows as any[]}
                columns={cols as any}
                exportName="tank-master"
                searchKeys={["id", "tankCode", "tankName", "product", "godown"] as any}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </TallyPage>
  );
}

// ============ DEPARTMENT MASTER — HP Government Departments (simple: only fields relevant for vehicle refueling) ============
export function DepartmentMasterStatic() {
  const rows = departmentsStatic;
  const [statusFilter, setStatusFilter] = useState<"all" | "Active" | "Inactive">("all");
  const [alterId, setAlterId] = useState<string>(rows[0]?.id ?? "DPT-001");
  const alterRow = rows.find((r) => r.id === alterId) ?? rows[0];

  const filtered = statusFilter === "all" ? rows : rows.filter((r) => r.status === statusFilter);
  const vehicleCountByDept = (deptId: string) => vehiclesStatic.filter((v) => v.departmentId === deptId).length;

  const cols = [
    { key: "code", label: "Dept Code", sortable: true, render: (r: DepartmentRow) => <span className="font-mono text-xs font-bold">{r.code}</span> },
    { key: "name", label: "Department Name", sortable: true, render: (r: DepartmentRow) => <div><div className="font-semibold">{r.name}</div><div className="text-xs text-muted-foreground italic">({r.alias})</div></div> },
    { key: "contactPerson", label: "Contact Person" },
    { key: "phone", label: "Phone" },
    { key: "vehicles", label: "Mapped Vehicles", className: "text-right", render: (r: DepartmentRow) => <Badge tone="blue">{vehicleCountByDept(r.id)}</Badge> },
    { key: "status", label: "Status", render: (r: DepartmentRow) => <StatusBadge value={r.status} /> },
    actionColumn,
  ];

  return (
    <TallyPage
      title="Department Master — HP Government"
      description="Register Himachal Pradesh Government departments whose vehicles refuel at HIMFED petrol pumps. Kept intentionally minimal — vehicles are mapped under Vehicle Master."
      actions={<Button asChild variant="outline"><Link to="/dashboard/erp/acc/masters/vehicles"><Truck className="w-4 h-4 mr-2" />Vehicle Master</Link></Button>}
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="border-himfed-green/20"><CardContent className="p-4 space-y-1"><div className="text-xs text-muted-foreground">Total Departments</div><div className="text-xl font-serif font-bold">{rows.length}</div></CardContent></Card>
        <Card className="border-himfed-green/20"><CardContent className="p-4 space-y-1"><div className="text-xs text-muted-foreground">Active</div><div className="text-xl font-serif font-bold text-himfed-green">{rows.filter((r) => r.status === "Active").length}</div></CardContent></Card>
        <Card className="border-himfed-green/20"><CardContent className="p-4 space-y-1"><div className="text-xs text-muted-foreground">Inactive</div><div className="text-xl font-serif font-bold text-destructive">{rows.filter((r) => r.status === "Inactive").length}</div></CardContent></Card>
        <Card className="border-himfed-green/20"><CardContent className="p-4 space-y-1"><div className="text-xs text-muted-foreground">Total Vehicles Mapped</div><div className="text-xl font-serif font-bold">{vehiclesStatic.length}</div></CardContent></Card>
      </div>

      <Tabs defaultValue="create">
        <TabsList>
          <TabsTrigger value="create"><Plus className="w-3 h-3 mr-1" />Department Creation</TabsTrigger>
          <TabsTrigger value="alter">Department Alteration</TabsTrigger>
          <TabsTrigger value="list">Department List ({rows.length})</TabsTrigger>
        </TabsList>

        {/* CREATE */}
        <TabsContent value="create" className="space-y-4">
          <div className="rounded border-2 border-himfed-green bg-himfed-green/5 p-2 text-xs font-semibold text-himfed-green">
            Department Creation — HIMFED-SHIMLA
          </div>
          <StaticForm title="Department Details">
            <Field label="Department Code" value="1380285" />
            <Field label="Department Name *" value="" />
            <Field label="Alias / Short Name" value="" />
            <Field label="Contact Person" value="" />
            <Field label="Phone" value="" />
            <SelectField label="Status" value="Active" options={["Active", "Inactive"]} />
          </StaticForm>
          <div className="flex gap-2">
            <Button><Plus className="w-4 h-4 mr-2" />Accept (Save Department)</Button>
            <Button variant="ghost">Quit</Button>
          </div>
        </TabsContent>

        {/* ALTER */}
        <TabsContent value="alter" className="space-y-4">
          <div className="rounded border-2 border-amber-500 bg-amber-500/5 p-2 text-xs font-semibold text-amber-700">
            Department Alteration — Select a department to modify
          </div>
          <Card>
            <CardHeader><CardTitle className="text-lg font-serif">Select Department</CardTitle></CardHeader>
            <CardContent className="grid md:grid-cols-3 gap-3">
              <div className="space-y-1.5 md:col-span-2">
                <Label className="text-xs text-muted-foreground">Department Master List</Label>
                <Select value={alterId} onValueChange={setAlterId}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{rows.map((r) => <SelectItem key={r.id} value={r.id}>{r.code} · {r.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="flex items-end gap-2"><StatusBadge value={alterRow?.status} /><Badge tone="blue">{vehicleCountByDept(alterRow?.id ?? "")} vehicles</Badge></div>
            </CardContent>
          </Card>
          {alterRow && (
            <>
              <StaticForm title="Department Details">
                <Field label="Department Code" value={alterRow.code} />
                <Field label="Department Name *" value={alterRow.name} />
                <Field label="Alias / Short Name" value={alterRow.alias} />
                <Field label="Contact Person" value={alterRow.contactPerson} />
                <Field label="Phone" value={alterRow.phone} />
                <SelectField label="Status" value={alterRow.status} options={["Active", "Inactive"]} />
              </StaticForm>
              <div className="flex gap-2">
                <Button><FileCheck2 className="w-4 h-4 mr-2" />Accept Changes</Button>
                <Button variant="destructive">Delete Department</Button>
              </div>
            </>
          )}
        </TabsContent>

        {/* LIST */}
        <TabsContent value="list" className="space-y-3">
          <Card className="border-himfed-green/20">
            <CardHeader className="pb-3 flex-row items-center justify-between space-y-0">
              <CardTitle className="text-base font-serif">DEPARTMENT MASTER LIST</CardTitle>
              <Select value={statusFilter} onValueChange={(v: any) => setStatusFilter(v)}>
                <SelectTrigger className="h-9 w-40"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Active">Active Only</SelectItem>
                  <SelectItem value="Inactive">Inactive Only</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent>
              <DataTable
                rows={filtered as any[]}
                columns={cols as any}
                exportName="department-master"
                searchKeys={["code", "name", "alias", "contactPerson"] as any}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </TallyPage>
  );
}

// ============ VEHICLE MASTER — Govt vehicles mapped to Department (Tally PP Vehicle Creation) ============
export function VehicleMasterStatic() {
  const rows = vehiclesStatic;
  const depts = departmentsStatic;
  const [deptFilter, setDeptFilter] = useState<string>("all");
  const [fuelFilter, setFuelFilter] = useState<string>("all");
  const [alterId, setAlterId] = useState<string>(rows[0]?.id ?? "VEH-001");
  const alterRow = rows.find((r) => r.id === alterId) ?? rows[0];

  const filtered = rows.filter((r) =>
    (deptFilter === "all" || r.departmentId === deptFilter) &&
    (fuelFilter === "all" || r.fuelType === fuelFilter)
  );

  const cols = [
    { key: "vehicleNumber", label: "Vehicle Number", sortable: true, render: (r: VehicleRow) => <span className="font-mono font-bold text-himfed-green">{r.vehicleNumber}</span> },
    { key: "departmentName", label: "Department (Mapped)", sortable: true, render: (r: VehicleRow) => <div><div className="font-semibold">{r.departmentName}</div><div className="text-xs text-muted-foreground font-mono">{r.departmentId}</div></div> },
    { key: "vehicleType", label: "Vehicle Type", render: (r: VehicleRow) => <Badge tone="blue">{r.vehicleType}</Badge> },
    { key: "fuelType", label: "Fuel", render: (r: VehicleRow) => <Badge tone={r.fuelType === "HSD" ? "amber" : "green"}>{r.fuelType}</Badge> },
    { key: "driverName", label: "Driver Name" },
    { key: "driverPhone", label: "Driver Phone" },
    { key: "status", label: "Status", render: (r: VehicleRow) => <StatusBadge value={r.status} /> },
    actionColumn,
  ];

  return (
    <TallyPage
      title="Vehicle Master — PP Vehicle Creation"
      description="Register Govt. vehicles that come to the HIMFED petrol pump for refueling. Every vehicle must be mapped to a Department created in Department Master."
      actions={<Button asChild variant="outline"><Link to="/dashboard/erp/acc/masters/departments"><Landmark className="w-4 h-4 mr-2" />Department Master</Link></Button>}
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="border-himfed-green/20"><CardContent className="p-4 space-y-1"><div className="text-xs text-muted-foreground">Total Vehicles</div><div className="text-xl font-serif font-bold">{rows.length}</div></CardContent></Card>
        <Card className="border-himfed-green/20"><CardContent className="p-4 space-y-1"><div className="text-xs text-muted-foreground">HSD Vehicles</div><div className="text-xl font-serif font-bold text-amber-700">{rows.filter((r) => r.fuelType === "HSD").length}</div></CardContent></Card>
        <Card className="border-himfed-green/20"><CardContent className="p-4 space-y-1"><div className="text-xs text-muted-foreground">ULP Vehicles</div><div className="text-xl font-serif font-bold text-himfed-green">{rows.filter((r) => r.fuelType === "ULP").length}</div></CardContent></Card>
        <Card className="border-himfed-green/20"><CardContent className="p-4 space-y-1"><div className="text-xs text-muted-foreground">Departments Covered</div><div className="text-xl font-serif font-bold">{new Set(rows.map((r) => r.departmentId)).size}</div></CardContent></Card>
      </div>

      <Tabs defaultValue="create">
        <TabsList>
          <TabsTrigger value="create"><Plus className="w-3 h-3 mr-1" />Vehicle Creation</TabsTrigger>
          <TabsTrigger value="alter">Vehicle Alteration</TabsTrigger>
          <TabsTrigger value="list">Vehicle Master List ({rows.length})</TabsTrigger>
        </TabsList>

        {/* CREATE */}
        <TabsContent value="create" className="space-y-4">
          <div className="rounded border-2 border-himfed-green bg-himfed-green/5 p-2 text-xs font-semibold text-himfed-green">
            PP Vehicle Creation — HIMFED-SHIMLA
          </div>
          <StaticForm title="Vehicle Master">
            <Field label="Vehicle Number *" value="" />
            <SelectField label="Department Mapping *" value={depts[0]?.name ?? ""} options={depts.map((d) => d.name)} />
            <SelectField label="Vehicle Type" value="Car" options={["Car", "Jeep", "SUV", "Truck", "Bus", "Motorcycle", "Tractor"]} />
            <SelectField label="Fuel Type *" value="HSD" options={["HSD", "ULP"]} />
            <Field label="Driver Name" value="" />
            <Field label="Driver Phone" value="" />
            <SelectField label="Status" value="Active" options={["Active", "Inactive"]} />
          </StaticForm>
          <div className="flex gap-2">
            <Button><Plus className="w-4 h-4 mr-2" />Accept (Save Vehicle)</Button>
            <Button variant="ghost">Quit</Button>
          </div>
        </TabsContent>

        {/* ALTER */}
        <TabsContent value="alter" className="space-y-4">
          <div className="rounded border-2 border-amber-500 bg-amber-500/5 p-2 text-xs font-semibold text-amber-700">
            Vehicle Alteration — Select a vehicle to modify
          </div>
          <Card>
            <CardHeader><CardTitle className="text-lg font-serif">Select Vehicle</CardTitle></CardHeader>
            <CardContent className="grid md:grid-cols-3 gap-3">
              <div className="space-y-1.5 md:col-span-2">
                <Label className="text-xs text-muted-foreground">Vehicle Master List</Label>
                <Select value={alterId} onValueChange={setAlterId}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{rows.map((r) => <SelectItem key={r.id} value={r.id}>{r.vehicleNumber} — {r.departmentName}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="flex items-end gap-2"><StatusBadge value={alterRow?.status} /><Badge tone={alterRow?.fuelType === "HSD" ? "amber" : "green"}>{alterRow?.fuelType}</Badge></div>
            </CardContent>
          </Card>
          {alterRow && (
            <>
              <StaticForm title="Vehicle Master">
                <Field label="Vehicle Number *" value={alterRow.vehicleNumber} />
                <SelectField label="Department Mapping *" value={alterRow.departmentName} options={depts.map((d) => d.name)} />
                <SelectField label="Vehicle Type" value={alterRow.vehicleType} options={["Car", "Jeep", "SUV", "Truck", "Bus", "Motorcycle", "Tractor"]} />
                <SelectField label="Fuel Type *" value={alterRow.fuelType} options={["HSD", "ULP"]} />
                <Field label="Driver Name" value={alterRow.driverName} />
                <Field label="Driver Phone" value={alterRow.driverPhone} />
                <SelectField label="Status" value={alterRow.status} options={["Active", "Inactive"]} />
              </StaticForm>
              <div className="flex gap-2">
                <Button><FileCheck2 className="w-4 h-4 mr-2" />Accept Changes</Button>
                <Button variant="destructive">Delete Vehicle</Button>
              </div>
            </>
          )}
        </TabsContent>

        {/* LIST */}
        <TabsContent value="list" className="space-y-3">
          <Card className="border-himfed-green/20">
            <CardHeader className="pb-3 flex-row items-center justify-between space-y-0 gap-2 flex-wrap">
              <CardTitle className="text-base font-serif">VEHICLE MASTER LIST</CardTitle>
              <div className="flex gap-2">
                <Select value={deptFilter} onValueChange={setDeptFilter}>
                  <SelectTrigger className="h-9 w-64"><SelectValue placeholder="Department" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {depts.map((d) => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={fuelFilter} onValueChange={setFuelFilter}>
                  <SelectTrigger className="h-9 w-32"><SelectValue placeholder="Fuel" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Fuel</SelectItem>
                    <SelectItem value="HSD">HSD</SelectItem>
                    <SelectItem value="ULP">ULP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <DataTable
                rows={filtered as any[]}
                columns={cols as any}
                exportName="vehicle-master"
                searchKeys={["vehicleNumber", "departmentName", "driverName", "driverPhone"] as any}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </TallyPage>
  );
}


// ============ NOZZLE MASTER — each nozzle mapped to Tank + Product (PP Nozzle Creation) ============
export function NozzleMasterStatic() {
  const rows = nozzlesStatic;
  const tanks = tanksStatic;
  const [productFilter, setProductFilter] = useState<string>("all");
  const [tankFilter, setTankFilter] = useState<string>("all");
  const [alterId, setAlterId] = useState<string>(rows[0]?.id ?? "NZ-001");
  const alterRow = rows.find((r) => r.id === alterId) ?? rows[0];

  const filtered = rows.filter((r) =>
    (productFilter === "all" || r.product === productFilter) &&
    (tankFilter === "all" || r.tankId === tankFilter)
  );

  const cols = [
    { key: "nozzleName", label: "Nozzle", sortable: true, render: (r: NozzleRow) => <span className="font-mono font-bold text-himfed-green">{r.nozzleName}</span> },
    { key: "product", label: "Product", render: (r: NozzleRow) => <Badge tone={r.product === "HSD" ? "amber" : "green"}>{r.product}</Badge> },
    { key: "tankName", label: "Tank (Mapped)", sortable: true, render: (r: NozzleRow) => <div><div className="font-semibold">{r.tankName}</div><div className="text-xs text-muted-foreground font-mono">{r.tankId}</div></div> },
    { key: "godown", label: "Godown / Warehouse" },
    { key: "lastReading", label: "Last Totalizer (Ltr)", className: "text-right", render: (r: NozzleRow) => <span className="font-mono">{r.lastReading.toLocaleString("en-IN")}</span> },
    { key: "status", label: "Status", render: (r: NozzleRow) => <StatusBadge value={r.status} /> },
    actionColumn,
  ];

  return (
    <TallyPage
      title="Nozzle Master — PP Nozzle Creation"
      description="Register petrol pump nozzles (e.g. ULP-1 / ULP-2 / HSD-1 / HSD-2). Every nozzle is mapped to a Tank and its Product (HSD or ULP)."
      actions={<Button asChild variant="outline"><Link to="/dashboard/erp/acc/inventory/tanks"><Package className="w-4 h-4 mr-2" />Tank Master</Link></Button>}
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="border-himfed-green/20"><CardContent className="p-4 space-y-1"><div className="text-xs text-muted-foreground">Total Nozzles</div><div className="text-xl font-serif font-bold">{rows.length}</div></CardContent></Card>
        <Card className="border-himfed-green/20"><CardContent className="p-4 space-y-1"><div className="text-xs text-muted-foreground">HSD Nozzles</div><div className="text-xl font-serif font-bold text-amber-700">{rows.filter((r) => r.product === "HSD").length}</div></CardContent></Card>
        <Card className="border-himfed-green/20"><CardContent className="p-4 space-y-1"><div className="text-xs text-muted-foreground">ULP Nozzles</div><div className="text-xl font-serif font-bold text-himfed-green">{rows.filter((r) => r.product === "ULP").length}</div></CardContent></Card>
        <Card className="border-himfed-green/20"><CardContent className="p-4 space-y-1"><div className="text-xs text-muted-foreground">Tanks Covered</div><div className="text-xl font-serif font-bold">{new Set(rows.map((r) => r.tankId)).size}</div></CardContent></Card>
      </div>

      <Tabs defaultValue="create">
        <TabsList>
          <TabsTrigger value="create"><Plus className="w-3 h-3 mr-1" />Nozzle Creation</TabsTrigger>
          <TabsTrigger value="alter">Nozzle Alteration</TabsTrigger>
          <TabsTrigger value="list">Nozzle Master List ({rows.length})</TabsTrigger>
        </TabsList>

        {/* CREATE */}
        <TabsContent value="create" className="space-y-4">
          <div className="rounded border-2 border-himfed-green bg-himfed-green/5 p-2 text-xs font-semibold text-himfed-green">
            PP Nozzle Creation — HIMFED-SHIMLA &nbsp; <span className="text-muted-foreground font-normal">(e.g. ULP-1 / ULP-2 / HSD-1 / HSD-2)</span>
          </div>
          <StaticForm title="Nozzle Master">
            <Field label="Nozzle Name *" value="ULP-1" />
            <SelectField label="Product *" value="ULP" options={["ULP", "HSD"]} />
            <SelectField label="Tank *" value={tanks[2]?.tankName ?? ""} options={tanks.map((t) => `${t.tankCode} · ${t.tankName}`)} />
            <Field label="Opening Totalizer Reading (Ltr)" value="0" />
            <SelectField label="Status" value="Active" options={["Active", "Inactive"]} />
          </StaticForm>
          <div className="flex gap-2">
            <Button><Plus className="w-4 h-4 mr-2" />Accept (Save Nozzle)</Button>
            <Button variant="ghost">Quit</Button>
          </div>
        </TabsContent>

        {/* ALTER */}
        <TabsContent value="alter" className="space-y-4">
          <div className="rounded border-2 border-amber-500 bg-amber-500/5 p-2 text-xs font-semibold text-amber-700">
            Nozzle Alteration — Select a nozzle to modify
          </div>
          <Card>
            <CardHeader><CardTitle className="text-lg font-serif">Select Nozzle</CardTitle></CardHeader>
            <CardContent className="grid md:grid-cols-3 gap-3">
              <div className="space-y-1.5 md:col-span-2">
                <Label className="text-xs text-muted-foreground">Nozzle Master List</Label>
                <Select value={alterId} onValueChange={setAlterId}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{rows.map((r) => <SelectItem key={r.id} value={r.id}>{r.nozzleName} — {r.tankName}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="flex items-end gap-2"><StatusBadge value={alterRow?.status} /><Badge tone={alterRow?.product === "HSD" ? "amber" : "green"}>{alterRow?.product}</Badge></div>
            </CardContent>
          </Card>
          {alterRow && (
            <>
              <StaticForm title="Nozzle Master">
                <Field label="Nozzle Name *" value={alterRow.nozzleName} />
                <SelectField label="Product *" value={alterRow.product} options={["ULP", "HSD"]} />
                <SelectField label="Tank *" value={alterRow.tankName} options={tanks.map((t) => `${t.tankCode} · ${t.tankName}`)} />
                <Field label="Last Totalizer Reading (Ltr)" value={String(alterRow.lastReading)} />
                <SelectField label="Status" value={alterRow.status} options={["Active", "Inactive"]} />
              </StaticForm>
              <div className="flex gap-2">
                <Button><FileCheck2 className="w-4 h-4 mr-2" />Accept Changes</Button>
                <Button variant="destructive">Delete Nozzle</Button>
              </div>
            </>
          )}
        </TabsContent>

        {/* LIST */}
        <TabsContent value="list" className="space-y-3">
          <Card className="border-himfed-green/20">
            <CardHeader className="pb-3 flex-row items-center justify-between space-y-0 gap-2 flex-wrap">
              <CardTitle className="text-base font-serif">NOZZLE MASTER LIST</CardTitle>
              <div className="flex gap-2">
                <Select value={productFilter} onValueChange={setProductFilter}>
                  <SelectTrigger className="h-9 w-32"><SelectValue placeholder="Product" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Products</SelectItem>
                    <SelectItem value="HSD">HSD</SelectItem>
                    <SelectItem value="ULP">ULP</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={tankFilter} onValueChange={setTankFilter}>
                  <SelectTrigger className="h-9 w-64"><SelectValue placeholder="Tank" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Tanks</SelectItem>
                    {tanks.map((t) => <SelectItem key={t.id} value={t.id}>{t.tankCode} · {t.tankName} ({t.godown})</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <DataTable
                rows={filtered as any[]}
                columns={cols as any}
                exportName="nozzle-master"
                searchKeys={["nozzleName", "tankName", "godown", "product"] as any}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </TallyPage>
  );
}

// ============ PUMP TRANSACTIONS — Petrol Pump Daily Entry (Credit / Cash / Card / UPI) ============
export function PumpTransactionsStatic() {
  const rows = pumpTxnsStatic;
  const nozzles = nozzlesStatic;
  const tanks = tanksStatic;
  const vehicles = vehiclesStatic;
  const departments = departmentsStatic;
  const navigate = useNavigate();
  const [sp] = useSearchParams();
  const initialDept = sp.get("dept") ?? departments[0]?.id ?? "";

  const [dateFilter, setDateFilter] = useState<string>("2026-07-14");
  const [modeFilter, setModeFilter] = useState<string>("all");
  const [productFilter, setProductFilter] = useState<string>("all");
  const [nozzleFilter, setNozzleFilter] = useState<string>("all");
  const [formDeptId, setFormDeptId] = useState<string>(initialDept);
  const deptSummary = useMemo(() => formDeptId ? getDeptSummary(formDeptId) : null, [formDeptId]);
  const healthCounts = useMemo(() => getDeptHealthCounts(), []);

  const scoped = rows.filter((r) =>
    r.date === dateFilter &&
    (modeFilter === "all" || r.mode === modeFilter) &&
    (productFilter === "all" || r.product === productFilter) &&
    (nozzleFilter === "all" || r.nozzleId === nozzleFilter)
  );

  const credit = scoped.filter((r) => r.mode === "Credit");
  const cashish = scoped.filter((r) => r.mode !== "Credit");
  const totalQty = scoped.reduce((s, r) => s + r.qty, 0);
  const totalAmt = scoped.reduce((s, r) => s + r.amount, 0);
  const creditAmt = credit.reduce((s, r) => s + r.amount, 0);
  const cashAmt = cashish.filter((r) => r.mode === "Cash").reduce((s, r) => s + r.amount, 0);
  const cardAmt = cashish.filter((r) => r.mode === "Card/POS").reduce((s, r) => s + r.amount, 0);
  const upiAmt = cashish.filter((r) => r.mode === "UPI/QR").reduce((s, r) => s + r.amount, 0);

  // === MAIN LIST columns (Daily Pump Entry — Tally-look) ===
  const modeTone = (m: string) => m === "Credit" ? "amber" : m === "Cash" ? "green" : m === "Card/POS" ? "blue" : "red";
  const mainCols = [
    { key: "date", label: "Date", sortable: true, render: (r: PumpTxnRow) => <span className="font-mono">{r.date}</span> },
    { key: "billNo", label: "Bill No.", sortable: true, render: (r: PumpTxnRow) => <span className="font-mono font-bold text-himfed-green">{r.billNo}</span> },
    { key: "mode", label: "Mode", render: (r: PumpTxnRow) => <Badge tone={modeTone(r.mode) as any}>{r.mode}</Badge> },
    { key: "nozzleName", label: "Nozzle", render: (r: PumpTxnRow) => <div><div className="font-mono font-semibold">{r.nozzleName}</div><div className="text-[10px] text-muted-foreground">{r.nozzleId}</div></div> },
    { key: "product", label: "Product", render: (r: PumpTxnRow) => <Badge tone={r.product === "HSD" ? "amber" : "green"}>{r.product}</Badge> },
    { key: "tankName", label: "Tank (Godown)", render: (r: PumpTxnRow) => <div className="text-xs"><div className="font-semibold">{r.tankName}</div><div className="text-muted-foreground">{r.godown}</div></div> },
    { key: "openingReading", label: "Opening", className: "text-right", render: (r: PumpTxnRow) => <span className="font-mono">{r.openingReading.toLocaleString("en-IN")}</span> },
    { key: "closingReading", label: "Closing", className: "text-right", render: (r: PumpTxnRow) => <span className="font-mono">{r.closingReading.toLocaleString("en-IN")}</span> },
    { key: "qty", label: "Qty (Ltr)", className: "text-right", sortable: true, render: (r: PumpTxnRow) => <span className="font-mono font-bold">{r.qty.toFixed(2)}</span> },
    { key: "rate", label: "Rate", className: "text-right", render: (r: PumpTxnRow) => <span className="font-mono">₹{r.rate.toFixed(2)}</span> },
    { key: "amount", label: "Amount", className: "text-right", sortable: true, render: (r: PumpTxnRow) => <span className="font-mono font-bold text-himfed-green">{fmtStaticINR(r.amount)}</span> },
    { key: "party", label: "Party / Ref", render: (r: PumpTxnRow) => r.mode === "Credit"
        ? <div className="text-xs"><div className="font-semibold">{r.departmentName}</div><div className="text-muted-foreground font-mono">{r.customerCode} · {r.vehicleNumber}</div></div>
        : <div className="text-xs"><div className="font-semibold">{r.mode}</div><div className="text-muted-foreground font-mono">{r.transRef || "—"}</div></div> },
    { key: "operator", label: "Operator / Shift", render: (r: PumpTxnRow) => <div className="text-xs"><div>{r.operator}</div><div className="text-muted-foreground">{r.shift}</div></div> },
    { key: "status", label: "Status", render: (r: PumpTxnRow) => <StatusBadge value={r.status === "Posted" ? "Approved" : "Pending"} /> },
    actionColumn,
  ];

  // === CREDIT SALES columns (matches screenshot 2 exactly) ===
  const creditCols = [
    { key: "sr", label: "SR", className: "w-12", render: (_r: PumpTxnRow, i: number) => <span className="font-mono">{i + 1}</span> },
    { key: "departmentName", label: "Name of Customer", sortable: true, render: (r: PumpTxnRow) => <span className="font-semibold">{r.departmentName}</span> },
    { key: "customerCode", label: "Customer Code", render: (r: PumpTxnRow) => <span className="font-mono">{r.customerCode}</span> },
    { key: "vehicleNumber", label: "Vehicle No", render: (r: PumpTxnRow) => <span className="font-mono">{r.vehicleNumber}</span> },
    { key: "billNo", label: "Bill No", render: (r: PumpTxnRow) => <span className="font-mono text-himfed-green font-bold">{r.billNo}</span> },
    { key: "product", label: "Product", render: (r: PumpTxnRow) => <Badge tone={r.product === "HSD" ? "amber" : "green"}>{r.product}</Badge> },
    { key: "qty", label: "Qty", className: "text-right", render: (r: PumpTxnRow) => <span className="font-mono font-bold">{r.qty.toFixed(2)}</span> },
    { key: "amount", label: "Amount", className: "text-right", render: (r: PumpTxnRow) => <span className="font-mono font-bold">{fmtStaticINR(r.amount)}</span> },
    { key: "date", label: "Date", render: (r: PumpTxnRow) => <span className="font-mono">{new Date(r.date).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "2-digit" })}</span> },
  ];

  // === CASH SALES rollup (matches screenshot 3 exactly) ===
  const cashRollup = [
    { id: "CS-1", sr: 1, transId: "cash", modeKey: "Cash",     qty: cashish.filter(r => r.mode === "Cash").reduce((s, r) => s + r.qty, 0), amount: cashAmt },
    { id: "CS-2", sr: 2, transId: "card/pos", modeKey: "Card/POS", qty: cashish.filter(r => r.mode === "Card/POS").reduce((s, r) => s + r.qty, 0), amount: cardAmt },
    { id: "CS-3", sr: 3, transId: "upi/qr", modeKey: "UPI/QR",   qty: cashish.filter(r => r.mode === "UPI/QR").reduce((s, r) => s + r.qty, 0), amount: upiAmt },
  ];
  const cashCols = [
    { key: "sr", label: "SR", className: "w-12", render: (r: any) => <span className="font-mono">{r.sr}</span> },
    { key: "transId", label: "Trans Id", render: (r: any) => <span className="font-mono">{r.transId}</span> },
    { key: "qty", label: "Qty", className: "text-right", render: (r: any) => <span className="font-mono font-bold">{Number(r.qty).toFixed(2)}</span> },
    { key: "amount", label: "Amount", className: "text-right", render: (r: any) => <span className="font-mono font-bold">{fmtStaticINR(r.amount)}</span> },
    { key: "date", label: "Date", render: () => <span className="font-mono">{new Date(dateFilter).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "2-digit" })}</span> },
  ];

  // Collection Summary (per mode)
  const collectionRows = [
    { id: "CL-1", mode: "Cash",     qty: cashish.filter(r => r.mode === "Cash").reduce((s, r) => s + r.qty, 0), amount: cashAmt, count: cashish.filter(r => r.mode === "Cash").length },
    { id: "CL-2", mode: "Card/POS", qty: cashish.filter(r => r.mode === "Card/POS").reduce((s, r) => s + r.qty, 0), amount: cardAmt, count: cashish.filter(r => r.mode === "Card/POS").length },
    { id: "CL-3", mode: "UPI/QR",   qty: cashish.filter(r => r.mode === "UPI/QR").reduce((s, r) => s + r.qty, 0), amount: upiAmt, count: cashish.filter(r => r.mode === "UPI/QR").length },
    { id: "CL-4", mode: "Credit",   qty: credit.reduce((s, r) => s + r.qty, 0), amount: creditAmt, count: credit.length },
  ];
  const collectionCols = [
    { key: "mode", label: "Collection Mode", render: (r: any) => <Badge tone={modeTone(r.mode) as any}>{r.mode}</Badge> },
    { key: "count", label: "Txn Count", className: "text-right", render: (r: any) => <span className="font-mono">{r.count}</span> },
    { key: "qty", label: "Qty (Ltr)", className: "text-right", render: (r: any) => <span className="font-mono font-bold">{Number(r.qty).toFixed(2)}</span> },
    { key: "amount", label: "Amount", className: "text-right", render: (r: any) => <span className="font-mono font-bold text-himfed-green">{fmtStaticINR(r.amount)}</span> },
  ];

  // Credit Allocation (department-wise)
  const allocMap = new Map<string, { dept: string; code: string; count: number; qty: number; amount: number }>();
  credit.forEach((r) => {
    const k = r.departmentId;
    const cur = allocMap.get(k) ?? { dept: r.departmentName, code: r.customerCode, count: 0, qty: 0, amount: 0 };
    cur.count += 1; cur.qty += r.qty; cur.amount += r.amount;
    allocMap.set(k, cur);
  });
  const allocRows = Array.from(allocMap.entries()).map(([id, v]) => ({ id, ...v }));
  const allocCols = [
    { key: "dept", label: "Department (Customer)", sortable: true, render: (r: any) => <span className="font-semibold">{r.dept}</span> },
    { key: "code", label: "Customer Code", render: (r: any) => <span className="font-mono">{r.code}</span> },
    { key: "count", label: "Bills", className: "text-right", render: (r: any) => <span className="font-mono">{r.count}</span> },
    { key: "qty", label: "Qty (Ltr)", className: "text-right", render: (r: any) => <span className="font-mono">{r.qty.toFixed(2)}</span> },
    { key: "amount", label: "Credit Amount", className: "text-right", render: (r: any) => <span className="font-mono font-bold text-himfed-green">{fmtStaticINR(r.amount)}</span> },
  ];

  return (
    <TallyPage
      title="Pump Transactions — Petrol Pump Daily Entry"
      description="Tally-style daily fuel pump transactions. Every entry is linked to Nozzle → Tank → Product (HSD/ULP), and for Credit sales to Vehicle → Department (Customer)."
      actions={
        <div className="flex gap-2">
          <Button asChild variant="outline"><Link to="/dashboard/erp/acc/masters/nozzles"><Package className="w-4 h-4 mr-2" />Nozzles</Link></Button>
          <Button asChild variant="outline"><Link to="/dashboard/erp/acc/masters/vehicles"><Truck className="w-4 h-4 mr-2" />Vehicles</Link></Button>
          <Button asChild variant="outline"><Link to="/dashboard/erp/acc/masters/departments"><Landmark className="w-4 h-4 mr-2" />Departments</Link></Button>
        </div>
      }
    >
      {/* Tally-style top bar */}
      <div className="rounded border-2 border-himfed-green bg-himfed-green/5 p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="font-bold text-himfed-green tracking-wider">GATEWAY OF TALLY › PETROL PUMP TRANSACTIONS</div>
        <div className="flex gap-2 items-center">
          <Label className="text-[11px] text-muted-foreground">Date</Label>
          <Input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="h-8 w-40" />
          <Select value={modeFilter} onValueChange={setModeFilter}>
            <SelectTrigger className="h-8 w-36"><SelectValue placeholder="Mode" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Modes</SelectItem>
              <SelectItem value="Credit">Credit</SelectItem>
              <SelectItem value="Cash">Cash</SelectItem>
              <SelectItem value="Card/POS">Card/POS</SelectItem>
              <SelectItem value="UPI/QR">UPI/QR</SelectItem>
            </SelectContent>
          </Select>
          <Select value={productFilter} onValueChange={setProductFilter}>
            <SelectTrigger className="h-8 w-32"><SelectValue placeholder="Product" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Products</SelectItem>
              <SelectItem value="HSD">HSD</SelectItem>
              <SelectItem value="ULP">ULP</SelectItem>
            </SelectContent>
          </Select>
          <Select value={nozzleFilter} onValueChange={setNozzleFilter}>
            <SelectTrigger className="h-8 w-48"><SelectValue placeholder="Nozzle" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Nozzles</SelectItem>
              {nozzles.map((n) => <SelectItem key={n.id} value={n.id}>{n.nozzleName} · {n.tankName}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Department Credit Health — clickable status cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <button onClick={() => navigate("/dashboard/erp/acc/outstanding?status=red")}
          className="text-left rounded-xl border-2 border-rose-300 bg-gradient-to-br from-rose-50 to-rose-100 p-4 hover:scale-[1.01] transition">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-rose-500 text-white"><ShieldAlert className="w-5 h-5" /></div>
            <div className="flex-1">
              <div className="text-[11px] uppercase tracking-wider font-bold text-rose-700">🔴 Red — Overdue Depts</div>
              <div className="text-2xl font-serif font-bold text-rose-900">{healthCounts.red}</div>
              <div className="text-[11px] text-rose-700">Overdue amount: <b>{fmtStaticINR(healthCounts.overdueAmount)}</b></div>
            </div>
          </div>
        </button>
        <button onClick={() => navigate("/dashboard/erp/acc/outstanding?status=yellow")}
          className="text-left rounded-xl border-2 border-amber-300 bg-gradient-to-br from-amber-50 to-amber-100 p-4 hover:scale-[1.01] transition">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500 text-white"><Clock className="w-5 h-5" /></div>
            <div className="flex-1">
              <div className="text-[11px] uppercase tracking-wider font-bold text-amber-700">🟡 Yellow — Within Period</div>
              <div className="text-2xl font-serif font-bold text-amber-900">{healthCounts.yellow}</div>
              <div className="text-[11px] text-amber-700">Outstanding within {CREDIT_PERIOD_DAYS}-day credit window</div>
            </div>
          </div>
        </button>
        <button onClick={() => navigate("/dashboard/erp/acc/outstanding?status=green")}
          className="text-left rounded-xl border-2 border-emerald-300 bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 hover:scale-[1.01] transition">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500 text-white"><CheckCircle2 className="w-5 h-5" /></div>
            <div className="flex-1">
              <div className="text-[11px] uppercase tracking-wider font-bold text-emerald-700">🟢 Green — Healthy Depts</div>
              <div className="text-2xl font-serif font-bold text-emerald-900">{healthCounts.green}</div>
              <div className="text-[11px] text-emerald-700">No outstanding · safe to extend credit</div>
            </div>
          </div>
        </button>
      </div>


      {/* KPI tiles */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <Card className="border-himfed-green/20"><CardContent className="p-4 space-y-1"><div className="text-xs text-muted-foreground">Total Txns</div><div className="text-xl font-serif font-bold">{scoped.length}</div></CardContent></Card>
        <Card className="border-himfed-green/20"><CardContent className="p-4 space-y-1"><div className="text-xs text-muted-foreground">Total Qty (Ltr)</div><div className="text-xl font-serif font-bold">{totalQty.toFixed(2)}</div></CardContent></Card>
        <Card className="border-himfed-green/20"><CardContent className="p-4 space-y-1"><div className="text-xs text-muted-foreground">Total Amount</div><div className="text-xl font-serif font-bold text-himfed-green">{fmtStaticINR(totalAmt)}</div></CardContent></Card>
        <Card className="border-amber-500/30"><CardContent className="p-4 space-y-1"><div className="text-xs text-muted-foreground">Credit</div><div className="text-xl font-serif font-bold text-amber-700">{fmtStaticINR(creditAmt)}</div></CardContent></Card>
        <Card className="border-emerald-500/30"><CardContent className="p-4 space-y-1"><div className="text-xs text-muted-foreground">Cash</div><div className="text-xl font-serif font-bold text-emerald-700">{fmtStaticINR(cashAmt)}</div></CardContent></Card>
        <Card className="border-sky-500/30"><CardContent className="p-4 space-y-1"><div className="text-xs text-muted-foreground">Card + UPI</div><div className="text-xl font-serif font-bold text-sky-700">{fmtStaticINR(cardAmt + upiAmt)}</div></CardContent></Card>
      </div>

      <Tabs defaultValue="entry">
        <TabsList>
          <TabsTrigger value="entry"><Plus className="w-3 h-3 mr-1" />Daily Pump Entry</TabsTrigger>
          <TabsTrigger value="sales">Daily Sales Summary</TabsTrigger>
          <TabsTrigger value="collection">Collection Summary</TabsTrigger>
          <TabsTrigger value="credit">Credit Allocation</TabsTrigger>
          <TabsTrigger value="list">All Transactions ({rows.length})</TabsTrigger>
        </TabsList>

        {/* DAILY PUMP ENTRY — create form + today's list */}
        <TabsContent value="entry" className="space-y-4">
          <div className="rounded border-2 border-himfed-green bg-himfed-green/5 p-2 text-xs font-semibold text-himfed-green">
            Daily Pump Entry — HIMFED-SHIMLA &nbsp; <span className="text-muted-foreground font-normal">Enter each nozzle-wise fuel sale (Credit or Cash/Card/UPI)</span>
          </div>
          <StaticForm title="New Pump Transaction">
            <Field label="Date *" type="date" value={dateFilter} />
            <Field label="Bill No. *" value="HIM-26-27-0106" />
            <SelectField label="Mode *" value="Credit" options={["Credit", "Cash", "Card/POS", "UPI/QR"]} />
            <SelectField label="Nozzle *" value={nozzles[3]?.nozzleName ?? ""} options={nozzles.map((n) => `${n.nozzleName} · ${n.tankName}`)} />
            <SelectField label="Product (auto)" value="HSD" options={["HSD", "ULP"]} />
            <SelectField label="Tank (auto from Nozzle)" value={tanks[0]?.tankName ?? ""} options={tanks.map((t) => `${t.tankCode} · ${t.tankName}`)} />
            <Field label="Opening Reading (Ltr)" value="268400" />
            <Field label="Closing Reading (Ltr)" value="268437" />
            <Field label="Qty (Ltr)" value="37.00" />
            <Field label="Rate (₹/Ltr)" value="102.65" />
            <Field label="Amount (₹)" value="3798" />
            <SelectField label="Department (Credit only)" value={departments[0]?.name ?? ""} options={departments.map((d) => `${d.code} · ${d.name}`)} />
            <SelectField label="Vehicle (Credit only)" value={vehicles[0]?.vehicleNumber ?? ""} options={vehicles.map((v) => `${v.vehicleNumber} · ${v.departmentName}`)} />
            <Field label="Trans Ref (POS / UPI id)" value="" />
            <SelectField label="Operator" value="Anil Chauhan" options={["Anil Chauhan", "Pooja Devi", "Rohit Kashyap"]} />
            <SelectField label="Shift" value="Morning" options={["Morning", "Evening", "Night"]} />
          </StaticForm>
          <div className="flex gap-2">
            <Button><Plus className="w-4 h-4 mr-2" />Accept (Post Entry)</Button>
            <Button variant="outline">Reset</Button>
            <Button variant="ghost">Quit</Button>
          </div>

          <Card className="border-himfed-green/20">
            <CardHeader className="pb-3"><CardTitle className="text-base font-serif">TODAY'S POSTED ENTRIES — {dateFilter}</CardTitle></CardHeader>
            <CardContent>
              <DataTable rows={scoped as any[]} columns={mainCols as any} exportName="pump-daily-entry" searchKeys={["billNo", "nozzleName", "departmentName", "vehicleNumber", "transRef"] as any} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* DAILY SALES SUMMARY — Credit + Cash sheets (Tally excel look) */}
        <TabsContent value="sales" className="space-y-6">
          <Card className="border-himfed-green/20">
            <CardHeader className="pb-2 text-center border-b">
              <CardTitle className="text-lg font-serif tracking-wider">CREDIT SALES</CardTitle>
              <div className="text-xs text-muted-foreground">Detailed credit-billed entries for {dateFilter} — linked to Vehicle Master & Department Master</div>
            </CardHeader>
            <CardContent className="pt-4">
              <DataTable
                rows={credit.map((r, i) => ({ ...r, sr: i + 1 })) as any[]}
                columns={creditCols as any}
                exportName={`credit-sales-${dateFilter}`}
                searchKeys={["billNo", "departmentName", "customerCode", "vehicleNumber"] as any}
              />
              <div className="mt-2 flex justify-end gap-6 text-sm font-mono border-t pt-2">
                <span className="text-muted-foreground">Total Qty: <span className="font-bold text-foreground">{credit.reduce((s, r) => s + r.qty, 0).toFixed(2)}</span></span>
                <span className="text-muted-foreground">Total Amount: <span className="font-bold text-himfed-green">{fmtStaticINR(creditAmt)}</span></span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-himfed-green/20">
            <CardHeader className="pb-2 text-center border-b">
              <CardTitle className="text-lg font-serif tracking-wider">CASH SALES</CardTitle>
              <div className="text-xs text-muted-foreground">Aggregated cash / card / UPI collections for {dateFilter}</div>
            </CardHeader>
            <CardContent className="pt-4">
              <DataTable rows={cashRollup as any[]} columns={cashCols as any} exportName={`cash-sales-${dateFilter}`} />
              <div className="mt-2 flex justify-end gap-6 text-sm font-mono border-t pt-2">
                <span className="text-muted-foreground">Total Qty: <span className="font-bold text-foreground">{cashRollup.reduce((s, r) => s + r.qty, 0).toFixed(2)}</span></span>
                <span className="text-muted-foreground">Total Amount: <span className="font-bold text-himfed-green">{fmtStaticINR(cashAmt + cardAmt + upiAmt)}</span></span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* COLLECTION SUMMARY */}
        <TabsContent value="collection" className="space-y-3">
          <Card className="border-himfed-green/20">
            <CardHeader className="pb-3"><CardTitle className="text-base font-serif">COLLECTION SUMMARY — {dateFilter}</CardTitle></CardHeader>
            <CardContent>
              <DataTable rows={collectionRows as any[]} columns={collectionCols as any} exportName="collection-summary" />
              <div className="mt-2 flex justify-end gap-6 text-sm font-mono border-t pt-2">
                <span className="text-muted-foreground">Grand Total: <span className="font-bold text-himfed-green">{fmtStaticINR(totalAmt)}</span></span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* CREDIT ALLOCATION — dept-wise */}
        <TabsContent value="credit" className="space-y-3">
          <Card className="border-amber-500/30">
            <CardHeader className="pb-3"><CardTitle className="text-base font-serif">CREDIT ALLOCATION — Department-wise Outstanding</CardTitle></CardHeader>
            <CardContent>
              <DataTable rows={allocRows as any[]} columns={allocCols as any} exportName="credit-allocation" searchKeys={["dept", "code"] as any} />
              <div className="mt-2 flex justify-end gap-6 text-sm font-mono border-t pt-2">
                <span className="text-muted-foreground">Total Credit Extended: <span className="font-bold text-amber-700">{fmtStaticINR(creditAmt)}</span></span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ALL TRANSACTIONS */}
        <TabsContent value="list" className="space-y-3">
          <Card className="border-himfed-green/20">
            <CardHeader className="pb-3"><CardTitle className="text-base font-serif">PUMP TRANSACTIONS — MASTER LIST</CardTitle></CardHeader>
            <CardContent>
              <DataTable rows={rows as any[]} columns={mainCols as any} exportName="pump-transactions" searchKeys={["billNo", "nozzleName", "departmentName", "vehicleNumber", "transRef", "operator"] as any} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </TallyPage>
  );
}


