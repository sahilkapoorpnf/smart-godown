import { useMemo, useState } from "react";
import ErpPage from "@/components/erp/ErpPage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Building2, Printer, TrendingUp } from "lucide-react";
import { areaCompaniesStatic, godownMastersStatic, fmtStaticINR } from "@/lib/erp/staticTallyData";
import { getCurrentUser } from "@/lib/warehouse/store";

const allowed = ["wh_accountant", "admin_accountant", "accountant", "superadmin"] as any;

// ===== Dummy P&L figures per warehouse =====
type PLFigures = {
  openingStock: number;
  purchaseAccounts: number;
  directExpenses: number;
  indirectExpenses: number;
  salesAccounts: number;
  directIncomes: number;
  indirectIncomes: number;
  closingStock: number;
};

const WAREHOUSE_PL: Record<string, PLFigures> = {
  "UNA Warehouse":         { openingStock: 0,       purchaseAccounts: 1732095, directExpenses: 400,   indirectExpenses: 5000,  salesAccounts: 142500,  directIncomes: 0,     indirectIncomes: 0,    closingStock: 1618065 },
  "AMB Warehouse":         { openingStock: 120000,  purchaseAccounts: 1248500, directExpenses: 2800,  indirectExpenses: 18400, salesAccounts: 285400,  directIncomes: 4500,  indirectIncomes: 2200, closingStock: 1245800 },
  "HAROLI Warehouse":      { openingStock: 84000,   purchaseAccounts: 845200,  directExpenses: 1900,  indirectExpenses: 12400, salesAccounts: 162400,  directIncomes: 1800,  indirectIncomes: 1200, closingStock: 845200 },
  "BANGANA Warehouse":     { openingStock: 62000,   purchaseAccounts: 612400,  directExpenses: 1200,  indirectExpenses: 8900,  salesAccounts: 118200,  directIncomes: 1200,  indirectIncomes: 800,  closingStock: 612400 },
  "Shimla Central Godown": { openingStock: 245000,  purchaseAccounts: 2245800, directExpenses: 5400,  indirectExpenses: 34500, salesAccounts: 548200,  directIncomes: 8400,  indirectIncomes: 4200, closingStock: 2245800 },
  "Theog Depot":           { openingStock: 72000,   purchaseAccounts: 712400,  directExpenses: 1500,  indirectExpenses: 9800,  salesAccounts: 142000,  directIncomes: 1400,  indirectIncomes: 950,  closingStock: 712400 },
  "Solan Main Warehouse":  { openingStock: 158000,  purchaseAccounts: 1545800, directExpenses: 3800,  indirectExpenses: 24500, salesAccounts: 384500,  directIncomes: 5800,  indirectIncomes: 2800, closingStock: 1545800 },
  "Mandi Regional Godown": { openingStock: 198000,  purchaseAccounts: 1985200, directExpenses: 4900,  indirectExpenses: 31200, salesAccounts: 462100,  directIncomes: 7200,  indirectIncomes: 3500, closingStock: 1985200 },
  "Kangra Depot":          { openingStock: 132000,  purchaseAccounts: 1342500, directExpenses: 3100,  indirectExpenses: 21400, salesAccounts: 342100,  directIncomes: 4800,  indirectIncomes: 2400, closingStock: 1342500 },
  "Hamirpur Depot":        { openingStock: 51000,   purchaseAccounts: 512400,  directExpenses: 1100,  indirectExpenses: 7400,  salesAccounts: 124500,  directIncomes: 1100,  indirectIncomes: 700,  closingStock: 512400 },
};

const ZERO: PLFigures = { openingStock: 0, purchaseAccounts: 0, directExpenses: 0, indirectExpenses: 0, salesAccounts: 0, directIncomes: 0, indirectIncomes: 0, closingStock: 0 };

const sumFigures = (rows: PLFigures[]): PLFigures =>
  rows.reduce((a, r) => ({
    openingStock: a.openingStock + r.openingStock,
    purchaseAccounts: a.purchaseAccounts + r.purchaseAccounts,
    directExpenses: a.directExpenses + r.directExpenses,
    indirectExpenses: a.indirectExpenses + r.indirectExpenses,
    salesAccounts: a.salesAccounts + r.salesAccounts,
    directIncomes: a.directIncomes + r.directIncomes,
    indirectIncomes: a.indirectIncomes + r.indirectIncomes,
    closingStock: a.closingStock + r.closingStock,
  }), ZERO);

const UNA_WAREHOUSES = ["UNA Warehouse", "AMB Warehouse", "HAROLI Warehouse", "BANGANA Warehouse"];

export default function ProfitLossPage() {
  const user = getCurrentUser();
  const isUna = user?.role === "wh_accountant";

  const [area, setArea] = useState<string>("all");
  const [warehouse, setWarehouse] = useState<string>("all");

  const warehouseOptions = useMemo(() => {
    if (isUna) return UNA_WAREHOUSES;
    if (area === "all") return godownMastersStatic.map((g) => String(g.name));
    return godownMastersStatic.filter((g) => g.area === area).map((g) => String(g.name));
  }, [isUna, area]);

  const figures = useMemo(() => {
    let names: string[];
    if (isUna) {
      names = warehouse === "all" ? UNA_WAREHOUSES : [warehouse];
    } else if (warehouse !== "all") {
      names = [warehouse];
    } else if (area !== "all") {
      names = godownMastersStatic.filter((g) => g.area === area).map((g) => String(g.name));
    } else {
      names = Object.keys(WAREHOUSE_PL);
    }
    return sumFigures(names.map((n) => WAREHOUSE_PL[n] ?? ZERO));
  }, [isUna, area, warehouse]);

  // Trading: Dr = Opening + Purchase + Direct Exp + GP c/o ; Cr = Sales + Direct Inc + Closing Stock
  const tradingCr = figures.salesAccounts + figures.directIncomes + figures.closingStock;
  const tradingDrBeforeGP = figures.openingStock + figures.purchaseAccounts + figures.directExpenses;
  const grossProfit = tradingCr - tradingDrBeforeGP; // can be negative (Gross Loss)
  const tradingTotal = tradingCr;

  // P&L: Dr = Indirect Exp + Nett Profit ; Cr = GP b/f + Indirect Inc
  const plCr = (grossProfit > 0 ? grossProfit : 0) + figures.indirectIncomes;
  const plDrBeforeNet = figures.indirectExpenses + (grossProfit < 0 ? -grossProfit : 0);
  const nettProfit = plCr - plDrBeforeNet;
  const plTotal = plCr;

  const scopeTitle = isUna
    ? `HIMFED-Una · ${warehouse === "all" ? "All UNA Warehouses" : warehouse}`
    : warehouse !== "all" ? `HIMFED · ${warehouse}` : area !== "all" ? `HIMFED · ${area}` : `HIMFED · Consolidated (All Areas & Warehouses)`;

  const reset = () => { setArea("all"); setWarehouse("all"); };

  return (
    <ErpPage allowed={allowed} title="Profit & Loss A/c"
      description={isUna ? "Warehouse Accountant — UNA Area" : "Super Accountant — Consolidated across all HIMFED warehouses"}
      actions={<Button variant="outline" onClick={() => window.print()}><Printer className="w-4 h-4 mr-2" />Print</Button>}>

      <div className="rounded-lg border border-himfed-green/20 bg-himfed-green/5 p-3 text-sm flex items-center gap-2">
        <Building2 className="w-4 h-4 text-himfed-green" />
        <span className="font-medium">{isUna ? "Active Company: UNA Area (Warehouse Accountant)" : "All Area Companies — Super Accountant View"}</span>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-base font-serif flex items-center gap-2"><TrendingUp className="w-4 h-4 text-himfed-amber" />Filters</CardTitle></CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-3">
          {!isUna && (
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Area</Label>
              <Select value={area} onValueChange={(v) => { setArea(v); setWarehouse("all"); }}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Areas</SelectItem>
                  {areaCompaniesStatic.map((c) => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Warehouse</Label>
            <Select value={warehouse} onValueChange={setWarehouse}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{isUna ? "All UNA Warehouses" : "All Warehouses"}</SelectItem>
                {warehouseOptions.map((w) => <SelectItem key={w} value={w}>{w}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end"><Button variant="outline" onClick={reset}>Reset Filters</Button></div>
        </CardContent>
      </Card>

      {/* Trading + P&L — Tally style */}
      <Card className="border-himfed-green/30">
        <CardHeader className="pb-3 bg-himfed-green/5 border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-serif">Profit &amp; Loss A/c</CardTitle>
            <div className="text-right text-xs text-muted-foreground">
              <div className="font-semibold text-foreground">{scopeTitle}</div>
              <div>For 1-Apr-26</div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 grid md:grid-cols-2 gap-6">
          {/* DEBIT (Particulars) */}
          <div className="space-y-1">
            <div className="font-serif font-bold tracking-wide border-b pb-2 mb-2 flex justify-between">
              <span>Particulars</span><span>{scopeTitle.split("·").pop()?.trim()}</span>
            </div>
            <Row label="Opening Stock" value={figures.openingStock} highlight />
            <Row label="Purchase Accounts" value={figures.purchaseAccounts} />
            <Row label="Direct Expenses" value={figures.directExpenses} />
            {grossProfit > 0 && <Row label="Gross Profit c/o" value={grossProfit} italic />}
            <TotalRow label="" value={tradingTotal} />

            <div className="h-2" />
            <Row label="Indirect Expenses" value={figures.indirectExpenses} />
            {nettProfit > 0 && <Row label="Nett Profit" value={nettProfit} italic />}
            <TotalRow label="" value={plTotal} />
          </div>

          {/* CREDIT (Particulars) */}
          <div className="space-y-1">
            <div className="font-serif font-bold tracking-wide border-b pb-2 mb-2 flex justify-between">
              <span>Particulars</span><span>{scopeTitle.split("·").pop()?.trim()}</span>
            </div>
            <Row label="Sales Accounts" value={figures.salesAccounts} />
            {figures.directIncomes !== 0 && <Row label="Direct Incomes" value={figures.directIncomes} />}
            <Row label="Closing Stock" value={figures.closingStock} />
            {grossProfit < 0 && <Row label="Gross Loss c/o" value={-grossProfit} italic />}
            <TotalRow label="" value={tradingTotal} />

            <div className="h-2" />
            {grossProfit > 0 && <Row label="Gross Profit b/f" value={grossProfit} italic />}
            {figures.indirectIncomes !== 0 && <Row label="Indirect Incomes" value={figures.indirectIncomes} />}
            {nettProfit < 0 && <Row label="Nett Loss" value={-nettProfit} italic />}
            <TotalRow label="" value={plTotal} />
          </div>
        </CardContent>
        <div className={`mx-4 mb-4 p-3 rounded-lg text-sm flex items-center justify-between ${nettProfit >= 0 ? "bg-himfed-green/10" : "bg-amber-100"}`}>
          <span className="font-medium">{nettProfit >= 0 ? "Nett Profit" : "Nett Loss"}</span>
          <span className="font-mono font-bold">{fmtStaticINR(Math.abs(nettProfit))}</span>
        </div>
      </Card>
    </ErpPage>
  );
}

function Row({ label, value, italic, highlight }: { label: string; value: number; italic?: boolean; highlight?: boolean }) {
  return (
    <div className={`flex justify-between py-0.5 ${italic ? "italic" : "font-medium"} ${highlight ? "bg-himfed-amber/10 px-2 rounded" : ""}`}>
      <span>{label}</span>
      <span className="font-mono">{fmtStaticINR(value)}</span>
    </div>
  );
}

function TotalRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="border-t-2 border-himfed-green mt-2 pt-1 flex justify-between font-bold">
      <span>{label}</span><span className="font-mono">{fmtStaticINR(value)}</span>
    </div>
  );
}
