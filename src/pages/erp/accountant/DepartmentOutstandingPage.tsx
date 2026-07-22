import { useMemo, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import ErpPage from "@/components/erp/ErpPage";
import { DataTable } from "@/components/erp/DataTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { fmtStaticINR } from "@/lib/erp/staticTallyData";
import {
  departmentsExt, pumpTxnsExt, paymentHistoryStatic, getAllDeptSummaries, getDeptSummary,
  getDeptHealthCounts, healthLabel, DeptSummary, HealthStatus, PaymentStatus, CREDIT_PERIOD_DAYS, TODAY,
} from "@/lib/erp/creditData";
import {
  AlertTriangle, ArrowLeft, BookOpen, CheckCircle2, Clock, Download, FileText, IndianRupee, Landmark, Printer, Receipt, ShieldAlert, TrendingUp, Wallet,
} from "lucide-react";

const allowed = ["wh_accountant", "admin_accountant", "accountant", "superadmin"] as any;

const healthBg = (h: HealthStatus) => h === "green"
  ? "bg-emerald-50 border-emerald-300 text-emerald-800"
  : h === "yellow" ? "bg-amber-50 border-amber-300 text-amber-800"
  : "bg-rose-50 border-rose-300 text-rose-800";

const healthDot = (h: HealthStatus) => h === "green" ? "bg-emerald-500" : h === "yellow" ? "bg-amber-500" : "bg-rose-500";

const statusBadge = (s: PaymentStatus) => {
  const map: Record<PaymentStatus, string> = {
    Paid: "bg-emerald-100 text-emerald-800 border-emerald-200",
    Partial: "bg-sky-100 text-sky-800 border-sky-200",
    Pending: "bg-amber-100 text-amber-800 border-amber-200",
    Overdue: "bg-rose-100 text-rose-800 border-rose-200",
  };
  return <span className={`inline-block px-2 py-0.5 border rounded text-[10px] font-bold ${map[s]}`}>{s.toUpperCase()}</span>;
};

// ============================================================
// Main Page: /dashboard/erp/acc/outstanding
// ============================================================
export default function DepartmentOutstandingPage() {
  const [sp, setSp] = useSearchParams();
  const navigate = useNavigate();
  const view = sp.get("view") ?? "list"; // list | ledger | payments
  const filterDept = sp.get("dept") ?? "";
  const filterStatus = (sp.get("status") ?? "all") as "all" | HealthStatus;

  if (view === "ledger" && filterDept) return <DepartmentLedger deptId={filterDept} onBack={() => setSp({})} />;

  const summaries = useMemo(() => getAllDeptSummaries(), []);
  const counts = getDeptHealthCounts();

  const [q, setQ] = useState("");
  const [payFor, setPayFor] = useState<DeptSummary | null>(null);

  const filtered = summaries.filter((s) => {
    if (filterStatus !== "all" && s.health !== filterStatus) return false;
    if (q && !`${s.name} ${s.code} ${s.alias}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  const largest = [...summaries].sort((a, b) => b.totalOutstanding - a.totalOutstanding)[0];
  const oldest = [...summaries].sort((a, b) => b.oldestPendingDays - a.oldestPendingDays)[0];
  const monthlyCollection = paymentHistoryStatic
    .filter((p) => p.paymentDate.slice(0, 7) === TODAY.slice(0, 7))
    .reduce((s, p) => s + p.paymentAmount, 0);
  const avgCredit = Math.round(summaries.reduce((s, x) => s + x.oldestPendingDays, 0) / Math.max(1, summaries.filter((s) => s.totalOutstanding > 0).length));

  const cols = [
    { key: "health", label: "Status", render: (r: DeptSummary) => (
      <div className="flex items-center gap-2"><span className={`w-2.5 h-2.5 rounded-full ${healthDot(r.health)}`} /><span className="text-xs font-semibold">{healthLabel(r.health)}</span></div>
    )},
    { key: "name", label: "Department", sortable: true, render: (r: DeptSummary) => (
      <div><div className="font-semibold">{r.name}</div><div className="text-[11px] text-muted-foreground font-mono">{r.code} · {r.alias}</div></div>
    )},
    { key: "previousOutstanding", label: "Prev O/S", className: "text-right", sortable: true, accessor: (r: DeptSummary) => r.previousOutstanding, render: (r: DeptSummary) => <span className="font-mono">{fmtStaticINR(r.previousOutstanding)}</span> },
    { key: "currentOutstanding", label: "Current O/S", className: "text-right", sortable: true, accessor: (r: DeptSummary) => r.currentOutstanding, render: (r: DeptSummary) => <span className="font-mono">{fmtStaticINR(r.currentOutstanding)}</span> },
    { key: "totalOutstanding", label: "Total O/S", className: "text-right", sortable: true, accessor: (r: DeptSummary) => r.totalOutstanding, render: (r: DeptSummary) => <span className="font-mono font-bold text-himfed-green">{fmtStaticINR(r.totalOutstanding)}</span> },
    { key: "oldestPendingDays", label: "Oldest (days)", className: "text-right", sortable: true, accessor: (r: DeptSummary) => r.oldestPendingDays, render: (r: DeptSummary) => (
      <span className={`font-mono font-bold ${r.oldestPendingDays > CREDIT_PERIOD_DAYS ? "text-rose-700" : r.oldestPendingDays > 0 ? "text-amber-700" : "text-muted-foreground"}`}>{r.oldestPendingDays || "—"}</span>
    )},
    { key: "lastPaymentDate", label: "Last Payment", render: (r: DeptSummary) => (
      <div className="text-xs"><div className="font-mono">{r.lastPaymentDate ?? "—"}</div><div className="text-muted-foreground">{r.lastPaymentAmount ? fmtStaticINR(r.lastPaymentAmount) : ""}</div></div>
    )},
    { key: "paymentStatus", label: "Payment", render: (r: DeptSummary) => statusBadge(r.paymentStatus) },
    { key: "actions", label: "Actions", render: (r: DeptSummary) => (
      <div className="flex gap-1">
        <Button size="sm" variant="outline" onClick={() => setSp({ view: "ledger", dept: r.deptId })}><BookOpen className="w-3 h-3 mr-1" />Ledger</Button>
        <Button size="sm" variant="outline" onClick={() => navigate(`/dashboard/erp/acc/pump-transactions?dept=${r.deptId}`)}><Receipt className="w-3 h-3 mr-1" />Txns</Button>
        <Button size="sm" onClick={() => setPayFor(r)}><Wallet className="w-3 h-3 mr-1" />Receive</Button>
      </div>
    )},
  ];

  const setStatus = (s: string) => {
    const next = new URLSearchParams(sp);
    if (s === "all") next.delete("status"); else next.set("status", s);
    setSp(next);
  };

  return (
    <ErpPage
      title="Department Outstanding Management"
      description="Credit health, ageing and receivables across all HP Govt departments. 15-day credit window auto-flags overdue departments."
      allowed={allowed}
    >
      {/* Health KPI cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <button onClick={() => setStatus("red")} className={`text-left rounded-xl border-2 p-5 transition hover:scale-[1.01] ${filterStatus === "red" ? "ring-2 ring-rose-400" : ""} bg-gradient-to-br from-rose-50 to-rose-100 border-rose-300`}>
          <div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-rose-500 text-white"><ShieldAlert className="w-5 h-5" /></div>
            <div className="flex-1"><div className="text-xs uppercase tracking-wider font-bold text-rose-700">Overdue Departments</div><div className="text-3xl font-serif font-bold text-rose-900">{counts.red}</div><div className="text-xs text-rose-700 mt-1">Overdue: <b>{fmtStaticINR(counts.overdueAmount)}</b> · Immediate recovery</div></div></div>
        </button>
        <button onClick={() => setStatus("yellow")} className={`text-left rounded-xl border-2 p-5 transition hover:scale-[1.01] ${filterStatus === "yellow" ? "ring-2 ring-amber-400" : ""} bg-gradient-to-br from-amber-50 to-amber-100 border-amber-300`}>
          <div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-amber-500 text-white"><Clock className="w-5 h-5" /></div>
            <div className="flex-1"><div className="text-xs uppercase tracking-wider font-bold text-amber-700">Within Credit Period</div><div className="text-3xl font-serif font-bold text-amber-900">{counts.yellow}</div><div className="text-xs text-amber-700 mt-1">Outstanding within 15 days</div></div></div>
        </button>
        <button onClick={() => setStatus("green")} className={`text-left rounded-xl border-2 p-5 transition hover:scale-[1.01] ${filterStatus === "green" ? "ring-2 ring-emerald-400" : ""} bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-300`}>
          <div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-emerald-500 text-white"><CheckCircle2 className="w-5 h-5" /></div>
            <div className="flex-1"><div className="text-xs uppercase tracking-wider font-bold text-emerald-700">Healthy Departments</div><div className="text-3xl font-serif font-bold text-emerald-900">{counts.green}</div><div className="text-xs text-emerald-700 mt-1">No outstanding or fully paid</div></div></div>
        </button>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <Stat label="Total Departments" value={counts.total} icon={<Landmark className="w-4 h-4" />} />
        <Stat label="Total Outstanding" value={fmtStaticINR(counts.totalOutstanding)} icon={<IndianRupee className="w-4 h-4" />} />
        <Stat label="Overdue Amount" value={fmtStaticINR(counts.overdueAmount)} icon={<AlertTriangle className="w-4 h-4" />} tone="rose" />
        <Stat label="Month Collection" value={fmtStaticINR(monthlyCollection)} icon={<TrendingUp className="w-4 h-4" />} tone="emerald" />
        <Stat label="Avg Credit Days" value={avgCredit || 0} icon={<Clock className="w-4 h-4" />} />
        <Stat label="Largest O/S" value={largest?.alias ?? "—"} sub={largest ? fmtStaticINR(largest.totalOutstanding) : ""} icon={<TrendingUp className="w-4 h-4" />} />
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4 flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[220px]">
            <Label className="text-[11px]">Global Search</Label>
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Department, code, alias, receipt no…" className="h-9" />
          </div>
          <div>
            <Label className="text-[11px]">Health Status</Label>
            <Select value={filterStatus} onValueChange={setStatus}>
              <SelectTrigger className="h-9 w-44"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="red">🔴 Overdue</SelectItem>
                <SelectItem value="yellow">🟡 Within Period</SelectItem>
                <SelectItem value="green">🟢 Healthy</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline"><Printer className="w-4 h-4 mr-1" />Print</Button>
        </CardContent>
      </Card>

      <Tabs defaultValue="depts">
        <TabsList>
          <TabsTrigger value="depts">Department Outstanding ({filtered.length})</TabsTrigger>
          <TabsTrigger value="payments">Payment History ({paymentHistoryStatic.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="depts">
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base font-serif">Department-wise Outstanding Ledger</CardTitle></CardHeader>
            <CardContent>
              <DataTable rows={filtered as any[]} columns={cols as any} exportName="department-outstanding" pageSize={15}
                initialSort={{ key: "totalOutstanding", dir: "desc" }} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <PaymentHistoryTable />
        </TabsContent>
      </Tabs>

      {/* Receive Payment Modal */}
      <Dialog open={!!payFor} onOpenChange={(o) => !o && setPayFor(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle className="font-serif">Receive Payment — {payFor?.name}</DialogTitle></DialogHeader>
          {payFor && (
            <div className="space-y-3 text-sm">
              <div className="rounded border p-3 bg-muted/30 grid grid-cols-2 gap-2 text-xs">
                <div><span className="text-muted-foreground">Current O/S: </span><b>{fmtStaticINR(payFor.totalOutstanding)}</b></div>
                <div><span className="text-muted-foreground">Overdue: </span><b className="text-rose-700">{fmtStaticINR(payFor.overdueAmount)}</b></div>
                <div><span className="text-muted-foreground">Oldest Pending: </span><b>{payFor.oldestPendingDays} d</b></div>
                <div><span className="text-muted-foreground">Health: </span><b>{healthLabel(payFor.health)}</b></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Payment Date</Label><Input type="date" defaultValue={TODAY} /></div>
                <div><Label>Amount (₹)</Label><Input defaultValue={payFor.totalOutstanding} /></div>
                <div><Label>Mode</Label>
                  <Select defaultValue="NEFT/RTGS"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>
                    <SelectItem value="Cash">Cash</SelectItem><SelectItem value="Cheque">Cheque</SelectItem>
                    <SelectItem value="NEFT/RTGS">NEFT/RTGS</SelectItem><SelectItem value="UPI">UPI</SelectItem>
                    <SelectItem value="DD">DD</SelectItem></SelectContent></Select>
                </div>
                <div><Label>Reference No.</Label><Input placeholder="Cheque/UTR/Ref" /></div>
                <div className="col-span-2"><Label>Remarks</Label><Textarea rows={2} /></div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setPayFor(null)}>Cancel</Button>
            <Button onClick={() => setPayFor(null)}><Wallet className="w-4 h-4 mr-1" />Save Receipt</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ErpPage>
  );
}

function Stat({ label, value, sub, icon, tone }: { label: string; value: any; sub?: string; icon?: React.ReactNode; tone?: "rose" | "emerald" }) {
  const c = tone === "rose" ? "text-rose-700" : tone === "emerald" ? "text-emerald-700" : "text-foreground";
  return (
    <div className="rounded-xl border bg-card p-3">
      <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-muted-foreground font-medium">{icon}{label}</div>
      <div className={`mt-1 text-lg font-serif font-bold ${c}`}>{value}</div>
      {sub && <div className="text-[11px] text-muted-foreground truncate">{sub}</div>}
    </div>
  );
}

// ============================================================
// Payment History Table
// ============================================================
function PaymentHistoryTable() {
  const cols = [
    { key: "receiptNumber", label: "Receipt No.", sortable: true, render: (r: any) => <span className="font-mono font-bold text-himfed-green">{r.receiptNumber}</span> },
    { key: "paymentDate", label: "Date", sortable: true, render: (r: any) => <span className="font-mono">{r.paymentDate}</span> },
    { key: "departmentName", label: "Department", sortable: true, render: (r: any) => <span className="font-semibold">{r.departmentName}</span> },
    { key: "previousOutstanding", label: "Prev O/S", className: "text-right", render: (r: any) => <span className="font-mono text-muted-foreground">{fmtStaticINR(r.previousOutstanding)}</span> },
    { key: "paymentAmount", label: "Payment", className: "text-right", sortable: true, render: (r: any) => <span className="font-mono font-bold text-emerald-700">{fmtStaticINR(r.paymentAmount)}</span> },
    { key: "currentOutstanding", label: "Current O/S", className: "text-right", render: (r: any) => <span className="font-mono">{fmtStaticINR(r.currentOutstanding)}</span> },
    { key: "paymentMode", label: "Mode", render: (r: any) => <span className="text-xs font-semibold">{r.paymentMode}</span> },
    { key: "referenceNumber", label: "Reference", render: (r: any) => <span className="font-mono text-xs">{r.referenceNumber}</span> },
    { key: "receivedBy", label: "Received By", render: (r: any) => <span className="text-xs">{r.receivedBy}</span> },
    { key: "remarks", label: "Remarks", render: (r: any) => <span className="text-xs text-muted-foreground">{r.remarks}</span> },
  ];
  return (
    <Card>
      <CardHeader className="pb-3"><CardTitle className="text-base font-serif">Payment Receipt History</CardTitle></CardHeader>
      <CardContent>
        <DataTable rows={paymentHistoryStatic as any[]} columns={cols as any} exportName="payment-history"
          searchKeys={["receiptNumber", "departmentName", "referenceNumber", "receivedBy", "remarks"] as any} pageSize={15} />
      </CardContent>
    </Card>
  );
}

// ============================================================
// Department Ledger (transaction-by-transaction with running balance)
// ============================================================
function DepartmentLedger({ deptId, onBack }: { deptId: string; onBack: () => void }) {
  const summary = getDeptSummary(deptId);
  const txns = pumpTxnsExt.filter((t) => t.departmentId === deptId).sort((a, b) => a.date.localeCompare(b.date));
  const pays = paymentHistoryStatic.filter((p) => p.departmentId === deptId);

  // build unified ledger with running balance
  type LedgerRow = {
    id: string; date: string; type: "Bill" | "Payment"; ref: string;
    vehicleNumber: string; driver: string; fuelType: string;
    qty: number; rate: number; amount: number; amountPaid: number;
    outstanding: number; dueDate: string; pendingDays: number; paymentStatus: string; remarks: string;
    balance: number;
  };
  const merged: LedgerRow[] = [];
  txns.forEach((t) => merged.push({
    id: t.id, date: t.date, type: "Bill", ref: t.billNo,
    vehicleNumber: t.vehicleNumber, driver: "—", fuelType: t.product,
    qty: t.qty, rate: t.rate, amount: t.amount, amountPaid: t.paidAmount,
    outstanding: t.outstanding, dueDate: t.dueDate, pendingDays: t.pendingDays,
    paymentStatus: t.paymentStatus, remarks: "", balance: 0,
  }));
  pays.forEach((p) => merged.push({
    id: p.id, date: p.paymentDate, type: "Payment", ref: p.receiptNumber,
    vehicleNumber: "—", driver: "—", fuelType: "—",
    qty: 0, rate: 0, amount: 0, amountPaid: p.paymentAmount,
    outstanding: 0, dueDate: "—", pendingDays: 0, paymentStatus: p.paymentMode, remarks: p.remarks, balance: 0,
  }));
  merged.sort((a, b) => a.date.localeCompare(b.date));
  let running = 0;
  merged.forEach((r) => { running += r.type === "Bill" ? r.amount - r.amountPaid : -r.amountPaid; r.balance = running; });
  merged.reverse();

  const cols = [
    { key: "date", label: "Date", sortable: true, render: (r: LedgerRow) => <span className="font-mono">{r.date}</span> },
    { key: "type", label: "Type", render: (r: LedgerRow) => <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${r.type === "Bill" ? "bg-sky-100 text-sky-800" : "bg-emerald-100 text-emerald-800"}`}>{r.type.toUpperCase()}</span> },
    { key: "ref", label: "Invoice/Receipt", render: (r: LedgerRow) => <span className="font-mono font-bold text-himfed-green">{r.ref}</span> },
    { key: "vehicleNumber", label: "Vehicle", render: (r: LedgerRow) => <span className="font-mono text-xs">{r.vehicleNumber}</span> },
    { key: "fuelType", label: "Fuel", render: (r: LedgerRow) => <span className="text-xs">{r.fuelType}</span> },
    { key: "qty", label: "Qty", className: "text-right", render: (r: LedgerRow) => r.qty ? <span className="font-mono">{r.qty.toFixed(2)}</span> : "—" },
    { key: "rate", label: "Rate", className: "text-right", render: (r: LedgerRow) => r.rate ? <span className="font-mono">₹{r.rate.toFixed(2)}</span> : "—" },
    { key: "amount", label: "Amount", className: "text-right", render: (r: LedgerRow) => r.amount ? <span className="font-mono">{fmtStaticINR(r.amount)}</span> : "—" },
    { key: "amountPaid", label: "Paid", className: "text-right", render: (r: LedgerRow) => r.amountPaid ? <span className="font-mono text-emerald-700">{fmtStaticINR(r.amountPaid)}</span> : "—" },
    { key: "outstanding", label: "Outstanding", className: "text-right", render: (r: LedgerRow) => r.outstanding ? <span className="font-mono font-bold text-rose-700">{fmtStaticINR(r.outstanding)}</span> : "—" },
    { key: "dueDate", label: "Due Date", render: (r: LedgerRow) => <span className="font-mono text-xs">{r.dueDate}</span> },
    { key: "pendingDays", label: "Days", className: "text-right", render: (r: LedgerRow) => r.pendingDays ? <span className={`font-mono font-bold ${r.pendingDays > CREDIT_PERIOD_DAYS ? "text-rose-700" : "text-amber-700"}`}>{r.pendingDays}</span> : "—" },
    { key: "paymentStatus", label: "Status", render: (r: LedgerRow) => <span className="text-[10px] font-bold uppercase">{r.paymentStatus}</span> },
    { key: "balance", label: "Running Bal", className: "text-right", render: (r: LedgerRow) => <span className="font-mono font-bold">{fmtStaticINR(r.balance)}</span> },
  ];

  return (
    <ErpPage title={`Ledger — ${summary.name}`} description={`${summary.code} · ${summary.alias} · Credit period ${summary.creditPeriod} days`} allowed={allowed}
      actions={
        <div className="flex gap-2">
          <Button variant="outline" onClick={onBack}><ArrowLeft className="w-4 h-4 mr-1" />Back</Button>
          <Button variant="outline"><Printer className="w-4 h-4 mr-1" />Print</Button>
          <Button variant="outline"><Download className="w-4 h-4 mr-1" />Statement</Button>
        </div>
      }>
      <div className={`rounded-xl border-2 p-4 ${healthBg(summary.health)}`}>
        <div className="flex items-center gap-3">
          <span className={`w-3 h-3 rounded-full ${healthDot(summary.health)}`} />
          <div className="flex-1">
            <div className="text-sm font-bold uppercase tracking-wider">{healthLabel(summary.health)}</div>
            <div className="text-xs mt-0.5">
              {summary.health === "red" && `Immediate recovery required — oldest bill pending ${summary.oldestPendingDays} days (limit ${CREDIT_PERIOD_DAYS}).`}
              {summary.health === "yellow" && `Outstanding within credit period — ${CREDIT_PERIOD_DAYS - summary.oldestPendingDays} days remaining before overdue.`}
              {summary.health === "green" && "No outstanding or all bills settled — safe to extend further credit."}
            </div>
          </div>
          <div className="text-right"><div className="text-[11px] opacity-80">Total Outstanding</div><div className="font-serif font-bold text-xl">{fmtStaticINR(summary.totalOutstanding)}</div></div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <Stat label="Txns" value={summary.txnCount} />
        <Stat label="Total Billed" value={fmtStaticINR(summary.totalBilled)} />
        <Stat label="Total Paid" value={fmtStaticINR(summary.totalPaid)} tone="emerald" />
        <Stat label="Prev O/S" value={fmtStaticINR(summary.previousOutstanding)} />
        <Stat label="Current O/S" value={fmtStaticINR(summary.currentOutstanding)} />
        <Stat label="Overdue" value={fmtStaticINR(summary.overdueAmount)} tone="rose" />
      </div>

      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-base font-serif">Ledger — Bills & Receipts (Running Balance)</CardTitle></CardHeader>
        <CardContent>
          <DataTable rows={merged as any[]} columns={cols as any} exportName={`ledger-${summary.alias}`} pageSize={20}
            searchKeys={["ref", "vehicleNumber", "paymentStatus"] as any} />
        </CardContent>
      </Card>
    </ErpPage>
  );
}
