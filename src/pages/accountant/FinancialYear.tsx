import { useState } from "react";
import LedgerShell from "@/components/accountant/LedgerShell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarRange, CheckCircle2 } from "lucide-react";
import { FINANCIAL_YEARS, SALES, fmt } from "@/lib/accountant/data";
import { toast } from "sonner";

export default function FinancialYear() {
  const [active, setActive] = useState("2026-27");

  return (
    <LedgerShell title="Financial Year Management" description="Select active FY, auto-reset invoice numbers, manage year-end closing." icon={CalendarRange}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {FINANCIAL_YEARS.map(fy => {
          const isActive = fy === active;
          const records = fy === "2026-27" ? SALES.length : Math.floor(Math.random() * 40) + 20;
          const total = fy === "2026-27" ? SALES.reduce((a,b)=>a+b.total, 0) : Math.random() * 5000000;
          return (
            <Card key={fy} className={isActive ? "ring-2 ring-primary" : ""}>
              <CardContent className="pt-6 space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-serif font-bold text-xl">FY {fy}</h3>
                  {isActive && <Badge variant="outline" className="bg-emerald-100 text-emerald-800 border-emerald-200"><CheckCircle2 className="w-3 h-3 mr-1" />Active</Badge>}
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Total Records</span><span className="font-semibold">{records}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Total Sales</span><span className="font-semibold">{fmt(total)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Invoice Prefix</span><span className="font-mono">HMF/{fy}/</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Status</span><span className="font-semibold">{isActive ? "Open" : "Closed"}</span></div>
                </div>
                <div className="flex gap-2 pt-2 border-t border-border">
                  {!isActive ? (
                    <Button size="sm" variant="outline" className="flex-1" onClick={() => { setActive(fy); toast.success(`Switched to FY ${fy}`); }}>Set Active</Button>
                  ) : (
                    <Button size="sm" variant="outline" className="flex-1" onClick={() => toast.success(`FY ${fy} closing initiated`)}>Close Year</Button>
                  )}
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => toast.info(`Report generated for FY ${fy}`)}>View Reports</Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      <Card><CardContent className="pt-6">
        <h3 className="font-semibold mb-3">Year-End Closing Workflow</h3>
        <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
          <li>Verify all sales & purchase entries are approved and posted.</li>
          <li>Reconcile cash book, bank book and pending payments.</li>
          <li>Generate trial balance and review variance entries.</li>
          <li>Process physical stock verification adjustments.</li>
          <li>Close the financial year and auto-reset invoice numbering for the next FY.</li>
          <li>Archive previous-year reports for audit and statutory compliance.</li>
        </ol>
      </CardContent></Card>
    </LedgerShell>
  );
}
