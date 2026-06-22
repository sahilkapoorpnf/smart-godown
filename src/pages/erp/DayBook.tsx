import { useState } from "react";
import ErpPage, { Badge, fmtINR } from "@/components/erp/ErpPage";
import { DataTable } from "@/components/erp/DataTable";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useErp, ledgerName, itemName, godownName } from "@/lib/erp/store";

export default function DayBook() {
  const { vouchers } = useErp();
  const [type, setType] = useState<string>("all");
  const [from, setFrom] = useState(""); const [to, setTo] = useState("");

  const SINGLE_DATE = "2026-06-22";
  let rows = vouchers.map((v) => ({ ...v, date: SINGLE_DATE }));
  if (type !== "all") rows = rows.filter((v) => v.kind === type);
  if (from) rows = rows.filter((v) => v.date >= from);
  if (to) rows = rows.filter((v) => v.date <= to);


  const totals = rows.reduce((acc, v) => {
    if (v.kind === "purchase" || v.kind === "payment") acc.dr += v.grandTotal;
    else acc.cr += v.grandTotal;
    return acc;
  }, { dr: 0, cr: 0 });

  return (
    <ErpPage allowed={["wh_accountant", "admin_accountant"]} title="Day Book" description="Chronological listing of every voucher — Tally-style.">
      <DataTable rows={rows} exportName="day-book" searchKeys={["voucherNo", "narration", "invoiceNumber"] as any}
        filters={<>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="w-44 h-9"><SelectValue /></SelectTrigger>
            <SelectContent>
              {["all", "purchase", "sales", "payment", "receipt", "journal", "contra", "stock_transfer"].map((t) =>
                <SelectItem key={t} value={t}>{t === "all" ? "All Voucher Types" : t}</SelectItem>
              )}
            </SelectContent>
          </Select>
          <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="w-40 h-9" />
          <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="w-40 h-9" />
        </>}
        toolbar={<div className="text-xs text-muted-foreground"><span className="font-semibold text-foreground">Dr</span> {fmtINR(totals.dr)} · <span className="font-semibold text-foreground">Cr</span> {fmtINR(totals.cr)}</div>}
        columns={[
          { key: "date", label: "Date", sortable: true },
          { key: "voucherNo", label: "Voucher No.", render: (r) => <span className="font-mono font-semibold">{r.voucherNo}</span> },
          { key: "kind", label: "Type", render: (r) => <Badge tone={r.kind === "purchase" ? "blue" : r.kind === "sales" ? "green" : "amber"}>{r.kind}</Badge> },
          { key: "voucherType", label: "Voucher Type", render: (r) => <Badge tone="default">{r.kind.replace("_", " ")}</Badge> },
          { key: "narration", label: "Narration", render: (r) => <span className="text-xs">{r.narration}</span> },
          { key: "dr", label: "Debit", className: "text-right font-mono", render: (r) => (r.kind === "purchase" || r.kind === "payment") ? fmtINR(r.grandTotal) : "" },
          { key: "cr", label: "Credit", className: "text-right font-mono", render: (r) => !(r.kind === "purchase" || r.kind === "payment") ? fmtINR(r.grandTotal) : "" },
        ]} />
    </ErpPage>
  );
}
