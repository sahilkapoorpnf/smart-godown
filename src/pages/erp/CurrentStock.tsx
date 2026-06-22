import ErpPage, { fmtINR, Badge } from "@/components/erp/ErpPage";
import { DataTable } from "@/components/erp/DataTable";
import { useErp, computeStockByGodown, godownName } from "@/lib/erp/store";

export default function CurrentStock() {
  const { stockItems, godowns } = useErp();
  const map = computeStockByGodown();
  const rows: { id: string; item: string; godown: string; opening: number; inQ: number; outQ: number; closing: number; value: number; rate: number }[] = [];
  godowns.forEach((g) => {
    stockItems.forEach((it) => {
      const r = map[g.id]?.[it.id];
      if (!r) return;
      const opening = Math.round((it.openingQty / godowns.length));
      const closing = opening + r.inQ - r.outQ;
      rows.push({
        id: `${g.id}_${it.id}`,
        item: it.name, godown: g.name,
        opening, inQ: r.inQ, outQ: r.outQ, closing,
        rate: it.ratePerUnit, value: closing * it.ratePerUnit,
      });
    });
  });

  const totalValue = rows.reduce((s, r) => s + r.value, 0);

  return (
    <ErpPage allowed={["wh_accountant", "admin_accountant"]} title="Current Stock Summary"
      description={`Live closing stock across ${godowns.length} godowns · Total value ${fmtINR(totalValue)}`}>
      <DataTable rows={rows} exportName="current-stock" searchKeys={["item", "godown"] as any}
        columns={[
          { key: "item", label: "Item", sortable: true, render: (r) => <span className="font-semibold">{r.item}</span> },
          { key: "godown", label: "Godown" },
          { key: "opening", label: "Opening", className: "text-right" },
          { key: "inQ", label: "In", className: "text-right text-himfed-green" },
          { key: "outQ", label: "Out", className: "text-right text-destructive" },
          { key: "closing", label: "Closing", className: "text-right font-semibold", render: (r) =>
              <Badge tone={r.closing < 50 ? "red" : r.closing < 150 ? "amber" : "green"}>{r.closing}</Badge> },
          { key: "rate", label: "Rate", className: "text-right font-mono", render: (r) => fmtINR(r.rate) },
          { key: "value", label: "Value", className: "text-right font-mono font-semibold", render: (r) => fmtINR(r.value) },
        ]} />
    </ErpPage>
  );
}
