import { useState } from "react";
import AppShell from "@/components/warehouse/AppShell";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, Column } from "@/components/shared/DataTable";
import { FormModal } from "@/components/shared/FormModal";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, Pencil } from "lucide-react";
import { useFertilizerStore, companyName, priceFor } from "@/lib/fertilizer/store";
import type { FertilizerProduct } from "@/lib/fertilizer/types";
import { useStockStore, taxFor, upsertTax } from "@/lib/stock/store";
import { toast } from "sonner";

interface Row extends FertilizerProduct {
  rate: number;
  cgst: number;
  sgst: number;
  margin: number;
}

export default function FertilizerMaster() {
  const { products, companies } = useFertilizerStore();
  useStockStore();

  const rows: Row[] = products.map((p) => {
    const pr = priceFor(p.id);
    const t = taxFor(p.id);
    return { ...p, rate: pr?.sellingPrice ?? 0, cgst: t.cgst, sgst: t.sgst, margin: t.distributionMargin };
  });

  const [edit, setEdit] = useState<Row | null>(null);
  const [form, setForm] = useState({ cgst: 2.5, sgst: 2.5, margin: 5 });

  const open = (r: Row) => { setEdit(r); setForm({ cgst: r.cgst, sgst: r.sgst, margin: r.margin }); };
  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!edit) return;
    upsertTax({ productId: edit.id, cgst: form.cgst, sgst: form.sgst, distributionMargin: form.margin });
    toast.success("Master updated — applies to all new invoices");
    setEdit(null);
  };

  const cols: Column<Row>[] = [
    { key: "code", label: "Code", sortable: true },
    { key: "name", label: "Fertilizer", sortable: true },
    { key: "companyId", label: "Company", render: (r) => companyName(r.companyId) },
    { key: "category", label: "Type" },
    { key: "unit", label: "Unit" },
    { key: "rate", label: "Current Rate", render: (r) => <span className="font-semibold">₹{r.rate}</span> },
    { key: "cgst", label: "CGST %", render: (r) => `${r.cgst}%` },
    { key: "sgst", label: "SGST %", render: (r) => `${r.sgst}%` },
    { key: "margin", label: "Distrib. Margin", render: (r) => `₹${r.margin}/bag` },
    { key: "status", label: "Status", render: (r) => <Badge variant="outline" className={r.status === "active" ? "bg-himfed-success/15 text-himfed-success border-himfed-success/30" : "bg-muted"}>{r.status}</Badge> },
  ];

  return (
    <AppShell allowed={["superadmin"]}>
      <PageHeader title="Fertilizer Master" description="Configure rates, CGST/SGST and distribution margin per fertilizer." icon={Package} />
      <Card>
        <CardContent className="pt-6">
          <DataTable
            data={rows}
            columns={cols}
            searchKey="name"
            searchPlaceholder="Search fertilizer..."
            actions={(r) => (
              <Button size="sm" variant="ghost" onClick={() => open(r)}><Pencil className="w-4 h-4" /></Button>
            )}
          />
        </CardContent>
      </Card>

      <FormModal open={!!edit} onOpenChange={(o) => !o && setEdit(null)} title={`Edit Tax — ${edit?.name ?? ""}`} onSubmit={save} submitLabel="Save Master">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 p-3 rounded-lg bg-muted/30 border text-sm">
            <div>Current rate: <span className="font-semibold">₹{edit?.rate}/bag</span> (managed in Pricing Master)</div>
          </div>
          <div className="space-y-1"><Label>CGST %</Label><Input type="number" step="0.1" value={form.cgst} onChange={(e) => setForm({ ...form, cgst: +e.target.value })} /></div>
          <div className="space-y-1"><Label>SGST %</Label><Input type="number" step="0.1" value={form.sgst} onChange={(e) => setForm({ ...form, sgst: +e.target.value })} /></div>
          <div className="space-y-1 col-span-2"><Label>Distribution Margin (₹ per bag)</Label><Input type="number" step="0.01" value={form.margin} onChange={(e) => setForm({ ...form, margin: +e.target.value })} /></div>
        </div>
      </FormModal>
    </AppShell>
  );
}
