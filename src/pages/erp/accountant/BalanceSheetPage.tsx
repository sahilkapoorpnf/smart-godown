import { useMemo, useState } from "react";
import ErpPage from "@/components/erp/ErpPage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Building2, Printer, Scale } from "lucide-react";
import { areaCompaniesStatic, godownMastersStatic, fmtStaticINR } from "@/lib/erp/staticTallyData";
import { getCurrentUser } from "@/lib/warehouse/store";

const allowed = ["wh_accountant", "admin_accountant", "accountant", "superadmin"] as any;

// ===== Dummy Balance Sheet figures per warehouse (Liabilities & Assets) =====
type BSFigures = {
  capital: number; loans: number; dutiesTaxes: number; sundryCreditors: number;
  outputCgst: number; outputSgst: number; branchDiv: number; openingPL: number; currentPL: number;
  closingStock: number; sundryDebtors: number; cashInHand: number; bankBalance: number;
};

const WAREHOUSE_BS: Record<string, BSFigures> = {
  "UNA Warehouse":           { capital: 1450000, loans: 0,      dutiesTaxes: -61576,  sundryCreditors: 403666, outputCgst: 12825, outputSgst: 13979, branchDiv: 1390005, openingPL: 0, currentPL: 23070, closingStock: 1618065, sundryDebtors: 169304, cashInHand: -5400, bankBalance: 0 },
  "AMB Warehouse":           { capital: 980000,  loans: 50000,  dutiesTaxes: -34210,  sundryCreditors: 285420, outputCgst: 9410,  outputSgst: 9410,  branchDiv: 620000,  openingPL: 12000, currentPL: 18500, closingStock: 1245800, sundryDebtors: 84210, cashInHand: 14200, bankBalance: 320000 },
  "HAROLI Warehouse":        { capital: 720000,  loans: 0,      dutiesTaxes: -12450,  sundryCreditors: 198400, outputCgst: 6300,  outputSgst: 6300,  branchDiv: 410000,  openingPL: 8400,  currentPL: 11240, closingStock: 845200,  sundryDebtors: 56100, cashInHand: 8650,  bankBalance: 215000 },
  "BANGANA Warehouse":       { capital: 540000,  loans: 0,      dutiesTaxes: -8900,   sundryCreditors: 152300, outputCgst: 4180,  outputSgst: 4180,  branchDiv: 280000,  openingPL: 5200,  currentPL: 7850,  closingStock: 612400,  sundryDebtors: 38200, cashInHand: 5100,  bankBalance: 142000 },
  "Shimla Central Godown":   { capital: 1820000, loans: 200000, dutiesTaxes: -72100,  sundryCreditors: 512300, outputCgst: 18420, outputSgst: 18420, branchDiv: 1720000, openingPL: 28500, currentPL: 41200, closingStock: 2245800, sundryDebtors: 248400, cashInHand: 21500, bankBalance: 645000 },
  "Theog Depot":             { capital: 640000,  loans: 0,      dutiesTaxes: -14200,  sundryCreditors: 184500, outputCgst: 5400,  outputSgst: 5400,  branchDiv: 340000,  openingPL: 6200,  currentPL: 9800,  closingStock: 712400,  sundryDebtors: 48200, cashInHand: 7400,  bankBalance: 184000 },
  "Solan Main Warehouse":    { capital: 1240000, loans: 120000, dutiesTaxes: -42100,  sundryCreditors: 384500, outputCgst: 12200, outputSgst: 12200, branchDiv: 980000,  openingPL: 18400, currentPL: 24800, closingStock: 1545800, sundryDebtors: 145200, cashInHand: 16800, bankBalance: 412000 },
  "Mandi Regional Godown":   { capital: 1680000, loans: 180000, dutiesTaxes: -58400,  sundryCreditors: 462100, outputCgst: 16800, outputSgst: 16800, branchDiv: 1420000, openingPL: 24500, currentPL: 35200, closingStock: 1985200, sundryDebtors: 198400, cashInHand: 19200, bankBalance: 548000 },
  "Kangra Depot":            { capital: 1120000, loans: 90000,  dutiesTaxes: -38200,  sundryCreditors: 342100, outputCgst: 11200, outputSgst: 11200, branchDiv: 845000,  openingPL: 16400, currentPL: 22100, closingStock: 1342500, sundryDebtors: 128400, cashInHand: 14500, bankBalance: 378000 },
  "Hamirpur Depot":          { capital: 480000,  loans: 0,      dutiesTaxes: -9800,   sundryCreditors: 124500, outputCgst: 3800,  outputSgst: 3800,  branchDiv: 220000,  openingPL: 4200,  currentPL: 6400,  closingStock: 512400,  sundryDebtors: 32100, cashInHand: 4800,  bankBalance: 124000 },
};

const ZERO: BSFigures = { capital: 0, loans: 0, dutiesTaxes: 0, sundryCreditors: 0, outputCgst: 0, outputSgst: 0, branchDiv: 0, openingPL: 0, currentPL: 0, closingStock: 0, sundryDebtors: 0, cashInHand: 0, bankBalance: 0 };

const sumFigures = (rows: BSFigures[]): BSFigures =>
  rows.reduce((a, r) => ({
    capital: a.capital + r.capital, loans: a.loans + r.loans, dutiesTaxes: a.dutiesTaxes + r.dutiesTaxes,
    sundryCreditors: a.sundryCreditors + r.sundryCreditors, outputCgst: a.outputCgst + r.outputCgst,
    outputSgst: a.outputSgst + r.outputSgst, branchDiv: a.branchDiv + r.branchDiv,
    openingPL: a.openingPL + r.openingPL, currentPL: a.currentPL + r.currentPL,
    closingStock: a.closingStock + r.closingStock, sundryDebtors: a.sundryDebtors + r.sundryDebtors,
    cashInHand: a.cashInHand + r.cashInHand, bankBalance: a.bankBalance + r.bankBalance,
  }), ZERO);

const UNA_WAREHOUSES = ["UNA Warehouse", "AMB Warehouse", "HAROLI Warehouse", "BANGANA Warehouse"];

export default function BalanceSheetPage() {
  const user = getCurrentUser();
  const isUna = user?.role === "wh_accountant";

  const [area, setArea] = useState<string>("all");
  const [warehouse, setWarehouse] = useState<string>(isUna ? "all" : "all");

  // Determine warehouse list based on scope
  const warehouseOptions = useMemo(() => {
    if (isUna) return UNA_WAREHOUSES;
    if (area === "all") return godownMastersStatic.map((g) => String(g.name));
    return godownMastersStatic.filter((g) => g.area === area).map((g) => String(g.name));
  }, [isUna, area]);

  // Aggregate figures based on filters
  const figures = useMemo(() => {
    let names: string[];
    if (isUna) {
      names = warehouse === "all" ? UNA_WAREHOUSES : [warehouse];
    } else if (warehouse !== "all") {
      names = [warehouse];
    } else if (area !== "all") {
      names = godownMastersStatic.filter((g) => g.area === area).map((g) => String(g.name));
    } else {
      names = Object.keys(WAREHOUSE_BS);
    }
    return sumFigures(names.map((n) => WAREHOUSE_BS[n] ?? ZERO));
  }, [isUna, area, warehouse]);

  const currentLiabilities = figures.dutiesTaxes + figures.sundryCreditors + figures.outputCgst + figures.outputSgst;
  const profitLoss = figures.openingPL + figures.currentPL;
  const totalLiab = figures.capital + figures.loans + currentLiabilities + figures.branchDiv + profitLoss;
  const totalAssets = figures.closingStock + figures.sundryDebtors + figures.cashInHand + figures.bankBalance;

  const scopeTitle = isUna
    ? `HIMFED-Una · ${warehouse === "all" ? "All UNA Warehouses" : warehouse}`
    : warehouse !== "all" ? `HIMFED · ${warehouse}` : area !== "all" ? `HIMFED · ${area}` : `HIMFED · Consolidated (All Areas & Warehouses)`;

  const reset = () => { setArea("all"); setWarehouse("all"); };

  return (
    <ErpPage allowed={allowed} title="Balance Sheet"
      description={isUna ? "Warehouse Accountant — UNA Area" : "Super Accountant — Consolidated across all HIMFED warehouses"}
      actions={<Button variant="outline" onClick={() => window.print()}><Printer className="w-4 h-4 mr-2" />Print</Button>}>

      <div className="rounded-lg border border-himfed-green/20 bg-himfed-green/5 p-3 text-sm flex items-center gap-2">
        <Building2 className="w-4 h-4 text-himfed-green" />
        <span className="font-medium">{isUna ? "Active Company: UNA Area (Warehouse Accountant)" : "All Area Companies — Super Accountant View"}</span>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-base font-serif flex items-center gap-2"><Scale className="w-4 h-4 text-himfed-amber" />Filters</CardTitle></CardHeader>
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

      {/* Balance Sheet — Tally style */}
      <Card className="border-himfed-green/30">
        <CardHeader className="pb-3 bg-himfed-green/5 border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-serif">Balance Sheet</CardTitle>
            <div className="text-right text-xs text-muted-foreground">
              <div className="font-semibold text-foreground">{scopeTitle}</div>
              <div>as at 1-Apr-26</div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 grid md:grid-cols-2 gap-6">
          {/* LIABILITIES */}
          <div className="space-y-1">
            <div className="font-serif font-bold tracking-wide border-b pb-2 mb-2">Liabilities</div>
            <Group label="Capital Account" total={figures.capital} highlight />
            <Group label="Loans (Liability)" total={figures.loans} />
            <Group label="Current Liabilities" total={currentLiabilities}>
              <SubRow label="Duties & Taxes" value={figures.dutiesTaxes} />
              <SubRow label="Sundry Creditors" value={figures.sundryCreditors} />
              <SubRow label="Output CGST-9%" value={figures.outputCgst} italic />
              <SubRow label="Output SGST-9%" value={figures.outputSgst} italic />
            </Group>
            <Group label="Branch / Divisions" total={figures.branchDiv}>
              <SubRow label="HIMFED-Depot (Inter-branch)" value={figures.branchDiv} italic />
            </Group>
            <Group label="Profit & Loss A/c" total={profitLoss}>
              <SubRow label="Opening Balance" value={figures.openingPL} italic />
              <SubRow label="Current Period" value={figures.currentPL} italic />
            </Group>
            <TotalRow label="Total" value={totalLiab} />
          </div>

          {/* ASSETS */}
          <div className="space-y-1">
            <div className="font-serif font-bold tracking-wide border-b pb-2 mb-2">Assets</div>
            <Group label="Current Assets" total={totalAssets} highlight>
              <SubRow label="Closing Stock" value={figures.closingStock} italic />
              <SubRow label="Sundry Debtors" value={figures.sundryDebtors} italic />
              <SubRow label="Cash-in-Hand" value={figures.cashInHand} italic />
              {figures.bankBalance !== 0 && <SubRow label="Bank Accounts" value={figures.bankBalance} italic />}
            </Group>
            <TotalRow label="Total" value={totalAssets} />
          </div>
        </CardContent>
        <div className={`mx-4 mb-4 p-3 rounded-lg text-sm flex items-center justify-between ${Math.abs(totalLiab - totalAssets) < 1 ? "bg-himfed-green/10" : "bg-amber-100"}`}>
          <span className="font-medium">{Math.abs(totalLiab - totalAssets) < 1 ? "Balanced ✓" : "Difference (Demo Variance)"}</span>
          <span className="font-mono font-bold">{fmtStaticINR(Math.abs(totalLiab - totalAssets))}</span>
        </div>
      </Card>
    </ErpPage>
  );
}

function fmtAmt(v: number) {
  const neg = v < 0;
  const s = fmtStaticINR(Math.abs(v));
  return neg ? `(-)${s}` : s;
}

function Group({ label, total, children, highlight }: { label: string; total: number; children?: React.ReactNode; highlight?: boolean }) {
  return (
    <div className="py-1">
      <div className={`flex justify-between font-semibold ${highlight ? "bg-himfed-amber/10 px-2 rounded" : ""}`}>
        <span>{label}</span>
        <span className="font-mono">{fmtAmt(total)}</span>
      </div>
      {children && <div className="pl-4 mt-1 space-y-0.5">{children}</div>}
    </div>
  );
}

function SubRow({ label, value, italic }: { label: string; value: number; italic?: boolean }) {
  return (
    <div className={`flex justify-between text-sm text-muted-foreground ${italic ? "italic" : ""}`}>
      <span>{label}</span><span className="font-mono">{fmtAmt(value)}</span>
    </div>
  );
}

function TotalRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="border-t-2 border-himfed-green mt-3 pt-2 flex justify-between font-bold">
      <span>{label}</span><span className="font-mono">{fmtStaticINR(value)}</span>
    </div>
  );
}
