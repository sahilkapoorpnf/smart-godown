import { useMemo, useState } from "react";
import LedgerShell from "@/components/accountant/LedgerShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  LayoutDashboard,
  IndianRupee,
  Receipt,
  Wallet,
  AlertTriangle,
  Warehouse,
  Clock,
  TrendingUp,
  BadgePercent,
  PiggyBank,
} from "lucide-react";
import {
  AREAS,
  FERTILIZERS,
  FINANCIAL_YEARS,
  SALES,
  STOCK_LEDGER,
  SUBSIDIES,
  byKey,
  dashboardMetrics,
  fmt,
  monthlySalesChart,
} from "@/lib/accountant/data";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const COLORS = ["#2f6f4f", "#d4a23a", "#3c82c6", "#a8503f", "#7b4cb8", "#cf5b8b"];

export default function AccountantDashboard() {
  const [fy, setFy] = useState("2026-27");
  const m = useMemo(() => dashboardMetrics(), []);
  const monthly = useMemo(() => monthlySalesChart(), []);
  const byFert = useMemo(
    () => byKey(SALES, (s) => s.fertilizer, (s) => s.total),
    []
  );
  const byArea = useMemo(() => byKey(SALES, (s) => s.area, (s) => s.total), []);
  const byWh = useMemo(
    () =>
      byKey(
        STOCK_LEDGER.filter((r) => r.date === STOCK_LEDGER[0].date),
        (r) => r.warehouse,
        (r) => r.closing
      ),
    []
  );
  const gstSummary = useMemo(
    () => [
      { name: "CGST", value: Math.round(SALES.reduce((a, b) => a + b.cgst, 0)) },
      { name: "SGST", value: Math.round(SALES.reduce((a, b) => a + b.sgst, 0)) },
    ],
    []
  );
  const subsidySummary = useMemo(
    () => [
      { name: "Released", value: SUBSIDIES.filter((s) => s.status === "Released").reduce((a, b) => a + b.amount, 0) },
      { name: "Pending", value: SUBSIDIES.filter((s) => s.status === "Pending").reduce((a, b) => a + b.amount, 0) },
      { name: "Partial", value: SUBSIDIES.filter((s) => s.status === "Partial").reduce((a, b) => a + b.amount, 0) },
    ],
    []
  );

  const cards = [
    { label: "Total Sales Today", v: fmt(m.sToday), icon: IndianRupee, color: "text-primary", bg: "bg-primary/10" },
    { label: "Monthly Sales", v: fmt(m.sMonth), icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-100" },
    { label: "Total GST Collection", v: fmt(m.gst), icon: BadgePercent, color: "text-blue-600", bg: "bg-blue-100" },
    { label: "Pending Subsidy", v: fmt(m.pendingSubsidy), icon: Wallet, color: "text-amber-600", bg: "bg-amber-100" },
    { label: "Outstanding Payments", v: fmt(m.outstanding), icon: AlertTriangle, color: "text-rose-600", bg: "bg-rose-100" },
    { label: "Current Stock Value", v: fmt(m.stockValue), icon: Warehouse, color: "text-fuchsia-600", bg: "bg-fuchsia-100" },
    { label: "Pending Approvals", v: String(m.pendingApprovals), icon: Clock, color: "text-orange-600", bg: "bg-orange-100" },
    { label: "Total Margin Earned", v: fmt(m.margin), icon: PiggyBank, color: "text-teal-600", bg: "bg-teal-100" },
  ];

  return (
    <LedgerShell
      title="Accountant Dashboard"
      description="Live financial overview — sales, GST, subsidy, stock value, margins & approvals."
      icon={LayoutDashboard}
    >
      <div className="flex justify-end">
        <Select value={fy} onValueChange={setFy}>
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-popover">
            {FINANCIAL_YEARS.map((f) => (
              <SelectItem key={f} value={f}>
                FY {f}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((c) => (
          <Card key={c.label} className="border-border">
            <CardContent className="pt-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs text-muted-foreground">{c.label}</div>
                  <div className={`text-xl font-bold ${c.color}`}>{c.v}</div>
                </div>
                <div className={`p-2 rounded-lg ${c.bg}`}>
                  <c.icon className={`w-5 h-5 ${c.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-serif">Monthly Sales Trend</CardTitle>
          </CardHeader>
          <CardContent style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthly}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" fontSize={11} />
                <YAxis fontSize={11} />
                <Tooltip formatter={(v: any) => fmt(v)} />
                <Area type="monotone" dataKey="value" stroke="#2f6f4f" fill="#2f6f4f33" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-serif">Fertilizer-wise Sales</CardTitle>
          </CardHeader>
          <CardContent style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byFert}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" fontSize={11} />
                <YAxis fontSize={11} />
                <Tooltip formatter={(v: any) => fmt(v)} />
                <Bar dataKey="value" fill="#d4a23a" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-serif">Area-wise Revenue</CardTitle>
          </CardHeader>
          <CardContent style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byArea} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" fontSize={11} />
                <YAxis type="category" dataKey="name" fontSize={11} width={70} />
                <Tooltip formatter={(v: any) => fmt(v)} />
                <Bar dataKey="value" fill="#3c82c6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-serif">Warehouse-wise Stock (Bags)</CardTitle>
          </CardHeader>
          <CardContent style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byWh}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" fontSize={11} />
                <YAxis fontSize={11} />
                <Tooltip />
                <Bar dataKey="value" fill="#7b4cb8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-serif">GST Summary</CardTitle>
          </CardHeader>
          <CardContent style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={gstSummary} dataKey="value" nameKey="name" outerRadius={90} label>
                  {gstSummary.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip formatter={(v: any) => fmt(v)} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-serif">Subsidy Summary</CardTitle>
          </CardHeader>
          <CardContent style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={subsidySummary} dataKey="value" nameKey="name" outerRadius={90} label>
                  {subsidySummary.map((_, i) => (
                    <Cell key={i} fill={COLORS[i + 2]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip formatter={(v: any) => fmt(v)} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </LedgerShell>
  );
}
