import { useMemo, useState } from "react";
import AppShell from "@/components/warehouse/AppShell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Download, Package, Filter } from "lucide-react";

type OutKind = "sales" | "shrinkage" | "shortage" | null;
interface Row {
  date: string;              // display date
  particulars: string;
  vchType: "Purchase" | "Sales" | "Journal";
  vchNo: number;
  inQty?: number;
  inVal?: number;
  outQty?: number;
  outVal?: number;
  outKind?: OutKind;
}

// First 3 entries — same date (latest). Rest — different dates.
const ROWS_ULP: Row[] = [
  { date: "14-Jul-26", particulars: "IOCL",                 vchType: "Purchase", vchNo: 2, inQty: 4000, inVal: 400000 },
  { date: "14-Jul-26", particulars: "",                     vchType: "Journal",  vchNo: 1, outQty: 97,  outVal: 9700, outKind: "shrinkage" },
  { date: "14-Jul-26", particulars: "",                     vchType: "Journal",  vchNo: 3, outQty: 3,   outVal: 300,  outKind: "shortage"  },
  { date: "15-Jul-26", particulars: "Under Secy to GAD",    vchType: "Sales",    vchNo: 2, outQty: 37,  outVal: 4070, outKind: "sales" },
  { date: "16-Jul-26", particulars: "Managing Director CSS",vchType: "Sales",    vchNo: 3, outQty: 43,  outVal: 4730, outKind: "sales" },
  { date: "17-Jul-26", particulars: "Sr. Architect",        vchType: "Sales",    vchNo: 4, outQty: 38,  outVal: 4180, outKind: "sales" },
  { date: "18-Jul-26", particulars: "Cash",                 vchType: "Sales",    vchNo: 6, outQty: 10,  outVal: 1100, outKind: "sales" },
  { date: "19-Jul-26", particulars: "UPI Collection",       vchType: "Sales",    vchNo: 7, outQty: 20,  outVal: 2200, outKind: "sales" },
  { date: "20-Jul-26", particulars: "Card Collection",      vchType: "Sales",    vchNo: 8, outQty: 25,  outVal: 2750, outKind: "sales" },
];

const ROWS_HSD: Row[] = [
  { date: "14-Jul-26", particulars: "IOCL",                 vchType: "Purchase", vchNo: 5, inQty: 6000, inVal: 552000 },
  { date: "14-Jul-26", particulars: "",                     vchType: "Journal",  vchNo: 4, outQty: 120, outVal: 11040, outKind: "shrinkage" },
  { date: "14-Jul-26", particulars: "",                     vchType: "Journal",  vchNo: 6, outQty: 5,   outVal: 460,   outKind: "shortage"  },
  { date: "15-Jul-26", particulars: "PWD Division",         vchType: "Sales",    vchNo: 9,  outQty: 55,  outVal: 5060, outKind: "sales" },
  { date: "16-Jul-26", particulars: "Forest Dept",          vchType: "Sales",    vchNo: 10, outQty: 48,  outVal: 4416, outKind: "sales" },
  { date: "17-Jul-26", particulars: "HRTC Depot",           vchType: "Sales",    vchNo: 11, outQty: 65,  outVal: 5980, outKind: "sales" },
  { date: "18-Jul-26", particulars: "Cash",                 vchType: "Sales",    vchNo: 12, outQty: 15,  outVal: 1380, outKind: "sales" },
  { date: "19-Jul-26", particulars: "UPI Collection",       vchType: "Sales",    vchNo: 13, outQty: 28,  outVal: 2576, outKind: "sales" },
  { date: "20-Jul-26", particulars: "Card Collection",      vchType: "Sales",    vchNo: 14, outQty: 22,  outVal: 2024, outKind: "sales" },
];

const inr = (n: number) => n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const qty = (n: number) => `${n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} litres`;

export default function StockItemVouchers() {
  const [item, setItem] = useState<"ULP" | "HSD">("ULP");
  const [outFilter, setOutFilter] = useState<"all" | "sales" | "shrinkage" | "shortage">("all");

  const rows = item === "ULP" ? ROWS_ULP : ROWS_HSD;

  const filtered = useMemo(() => {
    if (outFilter === "all") return rows;
    return rows.filter(r => !r.outKind || r.outKind === outFilter);
  }, [rows, outFilter]);

  // Totals
  const totals = useMemo(() => {
    const inQ = filtered.reduce((s, r) => s + (r.inQty ?? 0), 0);
    const inV = filtered.reduce((s, r) => s + (r.inVal ?? 0), 0);
    const salesQ = filtered.filter(r => r.outKind === "sales").reduce((s, r) => s + (r.outQty ?? 0), 0);
    const salesV = filtered.filter(r => r.outKind === "sales").reduce((s, r) => s + (r.outVal ?? 0), 0);
    const shrQ   = filtered.filter(r => r.outKind === "shrinkage").reduce((s, r) => s + (r.outQty ?? 0), 0);
    const shrV   = filtered.filter(r => r.outKind === "shrinkage").reduce((s, r) => s + (r.outVal ?? 0), 0);
    const shoQ   = filtered.filter(r => r.outKind === "shortage").reduce((s, r) => s + (r.outQty ?? 0), 0);
    const shoV   = filtered.filter(r => r.outKind === "shortage").reduce((s, r) => s + (r.outVal ?? 0), 0);
    const closeQ = inQ - salesQ - shrQ - shoQ;
    const closeV = inV - salesV - shrV - shoV;
    return { inQ, inV, salesQ, salesV, shrQ, shrV, shoQ, shoV, closeQ, closeV };
  }, [filtered]);

  // Running closing per row
  let runQ = 0, runV = 0;
  const withClosing = filtered.map(r => {
    runQ += (r.inQty ?? 0) - (r.outQty ?? 0);
    runV += (r.inVal ?? 0) - (r.outVal ?? 0);
    return { ...r, closeQ: runQ, closeV: runV };
  });
  // Only the last row displays closing value in Tally — keep same behavior
  const lastIdx = withClosing.length - 1;

  const exportCsv = () => {
    const num = (n?: number) => (n == null || n === 0 ? "" : n);
    const cell = (v: string | number, opts: { bold?: boolean; bg?: string; color?: string; align?: string; colspan?: number; rowspan?: number } = {}) => {
      const style = [
        "border:1px solid #999;padding:4px 8px;",
        opts.bold ? "font-weight:bold;" : "",
        opts.bg ? `background:${opts.bg};` : "",
        opts.color ? `color:${opts.color};` : "",
        opts.align ? `text-align:${opts.align};` : "",
      ].join("");
      const attrs = `${opts.colspan ? ` colspan="${opts.colspan}"` : ""}${opts.rowspan ? ` rowspan="${opts.rowspan}"` : ""}`;
      return `<td style="${style}"${attrs}>${v}</td>`;
    };

    const bodyRows = withClosing.map((r, i) => {
      const isSales = r.outKind === "sales";
      const isShr = r.outKind === "shrinkage";
      const isSho = r.outKind === "shortage";
      return "<tr>" + [
        cell(r.date),
        cell(r.particulars || "—"),
        cell(r.vchType, { bold: true, color: r.vchType === "Purchase" ? "#047857" : r.vchType === "Sales" ? "#1d4ed8" : "#b45309" }),
        cell(r.vchNo, { align: "right" }),
        cell(num(r.inQty), { align: "right", color: "#047857" }),
        cell(num(r.inVal), { align: "right", color: "#047857" }),
        cell(isSales ? num(r.outQty) : "", { align: "right", color: "#1d4ed8" }),
        cell(isSales ? num(r.outVal) : "", { align: "right", color: "#1d4ed8" }),
        cell(isShr ? num(r.outQty) : "", { align: "right", color: "#b45309", bg: "#fef3c7" }),
        cell(isShr ? num(r.outVal) : "", { align: "right", color: "#b45309", bg: "#fef3c7" }),
        cell(isSho ? num(r.outQty) : "", { align: "right", color: "#be123c", bg: "#ffe4e6" }),
        cell(isSho ? num(r.outVal) : "", { align: "right", color: "#be123c", bg: "#ffe4e6" }),
        cell(i === lastIdx ? r.closeQ.toFixed(2) : "", { align: "right", bold: true, color: "#0f5132" }),
        cell(i === lastIdx ? r.closeV.toFixed(2) : "", { align: "right", bold: true, color: "#0f5132" }),
      ].join("") + "</tr>";
    }).join("");

    const header =
      `<tr>` +
        cell("Date", { bold: true, rowspan: 2, bg: "#e5e7eb" }) +
        cell("Particulars", { bold: true, rowspan: 2, bg: "#e5e7eb" }) +
        cell("Vch Type", { bold: true, rowspan: 2, bg: "#e5e7eb" }) +
        cell("Vch No", { bold: true, rowspan: 2, bg: "#e5e7eb", align: "right" }) +
        cell("Inwards", { bold: true, colspan: 2, bg: "#d1fae5", color: "#047857", align: "center" }) +
        cell("Outwards - Sales", { bold: true, colspan: 2, bg: "#dbeafe", color: "#1d4ed8", align: "center" }) +
        cell("Outwards - Shrinkage", { bold: true, colspan: 2, bg: "#fef3c7", color: "#b45309", align: "center" }) +
        cell("Outwards - Shortage", { bold: true, colspan: 2, bg: "#ffe4e6", color: "#be123c", align: "center" }) +
        cell("Closing", { bold: true, colspan: 2, bg: "#dcfce7", color: "#0f5132", align: "center" }) +
      `</tr>` +
      `<tr>` +
        cell("Qty (L)", { bold: true, bg: "#d1fae5", align: "right" }) + cell("Value (₹)", { bold: true, bg: "#d1fae5", align: "right" }) +
        cell("Qty (L)", { bold: true, bg: "#dbeafe", align: "right" }) + cell("Value (₹)", { bold: true, bg: "#dbeafe", align: "right" }) +
        cell("Qty (L)", { bold: true, bg: "#fef3c7", align: "right" }) + cell("Value (₹)", { bold: true, bg: "#fef3c7", align: "right" }) +
        cell("Qty (L)", { bold: true, bg: "#ffe4e6", align: "right" }) + cell("Value (₹)", { bold: true, bg: "#ffe4e6", align: "right" }) +
        cell("Qty (L)", { bold: true, bg: "#dcfce7", align: "right" }) + cell("Value (₹)", { bold: true, bg: "#dcfce7", align: "right" }) +
      `</tr>`;

    const footer = `<tr>` +
      cell("Totals as per 'Default' valuation :", { bold: true, colspan: 4, align: "right", bg: "#f3f4f6" }) +
      cell(totals.inQ.toFixed(2), { bold: true, align: "right", bg: "#f3f4f6", color: "#047857" }) +
      cell(totals.inV.toFixed(2), { bold: true, align: "right", bg: "#f3f4f6", color: "#047857" }) +
      cell(totals.salesQ.toFixed(2), { bold: true, align: "right", bg: "#f3f4f6", color: "#1d4ed8" }) +
      cell(totals.salesV.toFixed(2), { bold: true, align: "right", bg: "#f3f4f6", color: "#1d4ed8" }) +
      cell(totals.shrQ.toFixed(2), { bold: true, align: "right", bg: "#f3f4f6", color: "#b45309" }) +
      cell(totals.shrV.toFixed(2), { bold: true, align: "right", bg: "#f3f4f6", color: "#b45309" }) +
      cell(totals.shoQ.toFixed(2), { bold: true, align: "right", bg: "#f3f4f6", color: "#be123c" }) +
      cell(totals.shoV.toFixed(2), { bold: true, align: "right", bg: "#f3f4f6", color: "#be123c" }) +
      cell(totals.closeQ.toFixed(2), { bold: true, align: "right", bg: "#f3f4f6", color: "#0f5132" }) +
      cell(totals.closeV.toFixed(2), { bold: true, align: "right", bg: "#f3f4f6", color: "#0f5132" }) +
    `</tr>`;

    const title = `<tr><td colspan="14" style="text-align:center;font-weight:bold;font-size:14px;padding:8px;background:#0f5132;color:#fff;">Stock Item Vouchers — ${item} &nbsp; | &nbsp; HIMFED-SHIMLA &nbsp; | &nbsp; 1-Jul-26 to 31-Jul-26</td></tr>`;

    const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"/><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>${item} Vouchers</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:11px;">${title}${header}${bodyRows}${footer}</table></body></html>`;

    const blob = new Blob(["\ufeff", html], { type: "application/vnd.ms-excel" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `stock-item-vouchers-${item}-${Date.now()}.xls`;
    a.click();
  };

  return (
    <AppShell>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-2">
          <div>
            <h1 className="text-2xl font-bold text-primary flex items-center gap-2"><Package className="w-6 h-6"/> Stock Item Vouchers</h1>
            <p className="text-sm text-muted-foreground">Tally-style item ledger — Inwards vs Outwards (Sales / Shrinkage / Shortage) with running closing balance.</p>
          </div>
          <Button variant="outline" size="sm" onClick={exportCsv}><Download className="w-4 h-4 mr-1"/>Export</Button>
        </div>

        {/* Tally-like top bar */}
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <div className="bg-[hsl(var(--primary))] text-primary-foreground px-4 py-2 text-xs font-semibold flex items-center justify-between">
            <span>Stock Item Vouchers</span>
            <span>HIMFED-SHIMLA</span>
            <span>1-Jul-26 to 31-Jul-26</span>
          </div>
          <div className="px-4 py-3 flex flex-wrap gap-3 items-center border-b border-border bg-muted/40">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground font-medium">Stock Item:</span>
              <Select value={item} onValueChange={(v: "ULP" | "HSD") => setItem(v)}>
                <SelectTrigger className="h-8 w-32 font-semibold"><SelectValue/></SelectTrigger>
                <SelectContent className="bg-popover"><SelectItem value="ULP">ULP</SelectItem><SelectItem value="HSD">HSD</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <Filter className="w-3.5 h-3.5 text-muted-foreground"/>
              <span className="text-xs text-muted-foreground font-medium">Outward:</span>
              <Select value={outFilter} onValueChange={(v: any) => setOutFilter(v)}>
                <SelectTrigger className="h-8 w-36"><SelectValue/></SelectTrigger>
                <SelectContent className="bg-popover">
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="shrinkage">Shrinkage</SelectItem>
                  <SelectItem value="shortage">Shortage</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tally-style data table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                {/* Group header row */}
                <tr className="bg-muted/60 border-b border-border">
                  <th rowSpan={2} className="text-left px-3 py-2 font-semibold text-muted-foreground border-r border-border">Date</th>
                  <th rowSpan={2} className="text-left px-3 py-2 font-semibold text-muted-foreground border-r border-border">Particulars</th>
                  <th rowSpan={2} className="text-left px-3 py-2 font-semibold text-muted-foreground border-r border-border">Vch Type</th>
                  <th rowSpan={2} className="text-right px-3 py-2 font-semibold text-muted-foreground border-r border-border">Vch No</th>
                  <th colSpan={2} className="text-center px-3 py-1.5 font-semibold text-emerald-700 border-r border-border bg-emerald-50">Inwards</th>
                  <th colSpan={6} className="text-center px-3 py-1.5 font-semibold text-amber-800 border-r border-border bg-amber-50">Outwards</th>
                  <th colSpan={2} className="text-center px-3 py-1.5 font-semibold text-primary bg-primary/10">Closing</th>
                </tr>
                <tr className="bg-muted/40 border-b border-border">
                  <th className="text-right px-3 py-1.5 font-medium text-emerald-700 border-r border-border bg-emerald-50/60">Qty</th>
                  <th className="text-right px-3 py-1.5 font-medium text-emerald-700 border-r border-border bg-emerald-50/60">Value</th>

                  <th colSpan={2} className="text-center px-2 py-1 font-medium text-blue-700 border-r border-border bg-blue-50/60">Sales</th>
                  <th colSpan={2} className="text-center px-2 py-1 font-medium text-amber-700 border-r border-border bg-amber-50/60">Shrinkage</th>
                  <th colSpan={2} className="text-center px-2 py-1 font-medium text-rose-700 border-r border-border bg-rose-50/60">Shortage</th>

                  <th className="text-right px-3 py-1.5 font-medium text-primary border-r border-border bg-primary/5">Qty</th>
                  <th className="text-right px-3 py-1.5 font-medium text-primary bg-primary/5">Value</th>
                </tr>
                {/* Third row: qty/val under each of Sales/Shrinkage/Shortage */}
                <tr className="bg-muted/30 border-b border-border text-[10px]">
                  <th className="border-r border-border"></th>
                  <th className="border-r border-border"></th>
                  <th className="border-r border-border"></th>
                  <th className="border-r border-border"></th>
                  <th className="border-r border-border"></th>
                  <th className="border-r border-border"></th>
                  <th className="text-right px-2 py-1 text-blue-700 bg-blue-50/40">Qty</th>
                  <th className="text-right px-2 py-1 text-blue-700 border-r border-border bg-blue-50/40">Value</th>
                  <th className="text-right px-2 py-1 text-amber-700 bg-amber-50/40">Qty</th>
                  <th className="text-right px-2 py-1 text-amber-700 border-r border-border bg-amber-50/40">Value</th>
                  <th className="text-right px-2 py-1 text-rose-700 bg-rose-50/40">Qty</th>
                  <th className="text-right px-2 py-1 text-rose-700 border-r border-border bg-rose-50/40">Value</th>
                  <th className="border-r border-border"></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {withClosing.map((r, i) => {
                  const isSales = r.outKind === "sales";
                  const isShr   = r.outKind === "shrinkage";
                  const isSho   = r.outKind === "shortage";
                  return (
                    <tr key={i} className="border-b border-border hover:bg-muted/30">
                      <td className="px-3 py-2 border-r border-border whitespace-nowrap">{r.date}</td>
                      <td className="px-3 py-2 border-r border-border font-medium">
                        {r.particulars || <span className="text-muted-foreground italic">—</span>}
                        {isShr && <Badge variant="outline" className="ml-2 bg-amber-100 text-amber-800 border-amber-300 text-[9px]">SHRINKAGE</Badge>}
                        {isSho && <Badge variant="outline" className="ml-2 bg-rose-100 text-rose-800 border-rose-300 text-[9px]">SHORTAGE</Badge>}
                      </td>
                      <td className={`px-3 py-2 border-r border-border font-semibold ${r.vchType === "Purchase" ? "text-emerald-700" : r.vchType === "Sales" ? "text-blue-700" : "text-amber-700"}`}>{r.vchType}</td>
                      <td className="px-3 py-2 border-r border-border text-right">{r.vchNo}</td>

                      {/* Inwards */}
                      <td className="px-3 py-2 border-r border-border text-right text-emerald-700">{r.inQty ? qty(r.inQty) : ""}</td>
                      <td className="px-3 py-2 border-r border-border text-right text-emerald-700 font-medium">{r.inVal ? inr(r.inVal) : ""}</td>

                      {/* Sales */}
                      <td className="px-2 py-2 text-right text-blue-700">{isSales && r.outQty ? qty(r.outQty) : ""}</td>
                      <td className="px-2 py-2 border-r border-border text-right text-blue-700 font-medium">{isSales && r.outVal ? inr(r.outVal) : ""}</td>
                      {/* Shrinkage */}
                      <td className="px-2 py-2 text-right text-amber-700">{isShr && r.outQty ? qty(r.outQty) : ""}</td>
                      <td className="px-2 py-2 border-r border-border text-right text-amber-700 font-medium">{isShr && r.outVal ? inr(r.outVal) : ""}</td>
                      {/* Shortage */}
                      <td className="px-2 py-2 text-right text-rose-700">{isSho && r.outQty ? qty(r.outQty) : ""}</td>
                      <td className="px-2 py-2 border-r border-border text-right text-rose-700 font-medium">{isSho && r.outVal ? inr(r.outVal) : ""}</td>

                      {/* Closing (Tally shows only on last row) */}
                      <td className="px-3 py-2 border-r border-border text-right text-primary font-semibold">{i === lastIdx ? qty(r.closeQ) : ""}</td>
                      <td className="px-3 py-2 text-right text-primary font-bold">{i === lastIdx ? inr(r.closeV) : ""}</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="bg-muted border-t-2 border-border font-semibold">
                  <td colSpan={4} className="px-3 py-2 border-r border-border text-right">Totals as per 'Default' valuation :</td>
                  <td className="px-3 py-2 border-r border-border text-right text-emerald-700">{qty(totals.inQ)}</td>
                  <td className="px-3 py-2 border-r border-border text-right text-emerald-700">{inr(totals.inV)}</td>
                  <td className="px-2 py-2 text-right text-blue-700">{qty(totals.salesQ)}</td>
                  <td className="px-2 py-2 border-r border-border text-right text-blue-700">{inr(totals.salesV)}</td>
                  <td className="px-2 py-2 text-right text-amber-700">{qty(totals.shrQ)}</td>
                  <td className="px-2 py-2 border-r border-border text-right text-amber-700">{inr(totals.shrV)}</td>
                  <td className="px-2 py-2 text-right text-rose-700">{qty(totals.shoQ)}</td>
                  <td className="px-2 py-2 border-r border-border text-right text-rose-700">{inr(totals.shoV)}</td>
                  <td className="px-3 py-2 border-r border-border text-right text-primary">{qty(totals.closeQ)}</td>
                  <td className="px-3 py-2 text-right text-primary">{inr(totals.closeV)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <Card><CardContent className="pt-4"><div className="text-[11px] text-muted-foreground">Inwards</div><div className="text-lg font-bold text-emerald-700">{qty(totals.inQ)}</div><div className="text-xs text-muted-foreground">₹{inr(totals.inV)}</div></CardContent></Card>
          <Card><CardContent className="pt-4"><div className="text-[11px] text-muted-foreground">Sales</div><div className="text-lg font-bold text-blue-700">{qty(totals.salesQ)}</div><div className="text-xs text-muted-foreground">₹{inr(totals.salesV)}</div></CardContent></Card>
          <Card><CardContent className="pt-4"><div className="text-[11px] text-muted-foreground">Shrinkage</div><div className="text-lg font-bold text-amber-700">{qty(totals.shrQ)}</div><div className="text-xs text-muted-foreground">₹{inr(totals.shrV)}</div></CardContent></Card>
          <Card><CardContent className="pt-4"><div className="text-[11px] text-muted-foreground">Shortage</div><div className="text-lg font-bold text-rose-700">{qty(totals.shoQ)}</div><div className="text-xs text-muted-foreground">₹{inr(totals.shoV)}</div></CardContent></Card>
          <Card><CardContent className="pt-4"><div className="text-[11px] text-muted-foreground">Closing Balance</div><div className="text-lg font-bold text-primary">{qty(totals.closeQ)}</div><div className="text-xs text-muted-foreground">₹{inr(totals.closeV)}</div></CardContent></Card>
        </div>
      </div>
    </AppShell>
  );
}
