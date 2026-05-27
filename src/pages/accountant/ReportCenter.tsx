import LedgerShell from "@/components/accountant/LedgerShell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Printer } from "lucide-react";
import { SALES, PURCHASES, SUBSIDIES, EXPENSES, downloadCSV, fmt, printHTML, AREAS, WAREHOUSES, byKey } from "@/lib/accountant/data";

const reports = [
  { key: "sales", title: "Sales Report", desc: "Comprehensive sales summary with GST & margin", data: () => SALES },
  { key: "purchase", title: "Purchase Report", desc: "Supplier-wise purchase records", data: () => PURCHASES },
  { key: "gst", title: "GST Report", desc: "CGST/SGST register with invoice details", data: () => SALES.map(s => ({ invoice: s.invoiceNo, party: s.party, gst: s.partyGst, taxable: s.amount, cgst: s.cgst, sgst: s.sgst, total: s.cgst+s.sgst })) },
  { key: "subsidy", title: "Subsidy Report", desc: "Government subsidy status & pending amounts", data: () => SUBSIDIES },
  { key: "margin", title: "Margin Report", desc: "Fertilizer/area-wise margin earnings", data: () => byKey(SALES, s => s.fertilizer, s => s.margin) },
  { key: "outstanding", title: "Outstanding Report", desc: "Pending dealer payments & overdue invoices", data: () => SALES.filter(s => s.pending > 0) },
  { key: "warehouse", title: "Warehouse Report", desc: "Warehouse stock & turnover summary", data: () => byKey(SALES, s => s.warehouse, s => s.total).concat(WAREHOUSES.map(w => ({ name: w, value: 0 })).filter(w => !byKey(SALES, s => s.warehouse, s => s.total).find(x => x.name === w.name))) },
  { key: "area", title: "Area Report", desc: "Area-wise revenue & operations summary", data: () => byKey(SALES, s => s.area, s => s.total) },
  { key: "expense", title: "Expense Report", desc: "Operational and transport expense summary", data: () => EXPENSES },
];

export default function ReportCenter() {
  return (
    <LedgerShell title="Report Center" description="Centralized report generation — sales, purchase, GST, subsidy, margin, outstanding & more." icon={FileText}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reports.map(r => (
          <Card key={r.key} className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6 space-y-3">
              <div>
                <h3 className="font-serif font-bold text-lg">{r.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">{r.desc}</p>
              </div>
              <div className="flex gap-2 pt-2 border-t border-border">
                <Button size="sm" variant="outline" className="flex-1" onClick={() => downloadCSV(`${r.key}-${Date.now()}.csv`, r.data() as any)}><Download className="w-4 h-4 mr-1" />CSV</Button>
                <Button size="sm" variant="outline" className="flex-1" onClick={() => downloadCSV(`${r.key}-excel-${Date.now()}.csv`, r.data() as any)}><Download className="w-4 h-4 mr-1" />Excel</Button>
                <Button size="sm" variant="outline" className="flex-1" onClick={() => {
                  const d = r.data() as any[];
                  if (!d.length) return;
                  const headers = Object.keys(d[0]);
                  const rows = d.map(x => `<tr>${headers.map(h => `<td>${x[h] ?? "—"}</td>`).join("")}</tr>`).join("");
                  printHTML(r.title, `<table><thead><tr>${headers.map(h => `<th>${h}</th>`).join("")}</tr></thead><tbody>${rows}</tbody></table>`);
                }}><Printer className="w-4 h-4 mr-1" />PDF</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </LedgerShell>
  );
}
