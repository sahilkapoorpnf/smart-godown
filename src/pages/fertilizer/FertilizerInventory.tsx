import { useMemo, useState } from "react";
import AppShell from "@/components/warehouse/AppShell";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, Column } from "@/components/shared/DataTable";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Boxes, IndianRupee, TrendingDown, Wallet } from "lucide-react";
import {
  useFertilizerStore, companyName, productName, priceFor, inventoryValue, subsidyTotal,
} from "@/lib/fertilizer/store";
import { areaName, getCurrentUser, store, warehouseName } from "@/lib/warehouse/store";
import type { FertilizerStock } from "@/lib/fertilizer/types";

const fmt = (n: number) => `₹ ${n.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
const LOW = 150;

export default function FertilizerInventory() {
  const user = getCurrentUser();
  const { stock } = useFertilizerStore();

  const visible = useMemo(() => {
    if (!user) return [] as FertilizerStock[];
    if (user.role === "warehouse_staff") return stock.filter((s) => s.warehouseId === user.warehouseId);
    if (user.role === "incharge") {
      const whs = store.warehouses.filter((w) => w.areaId === user.areaId).map((w) => w.id);
      return stock.filter((s) => whs.includes(s.warehouseId));
    }
    return stock;
  }, [stock, user]);

  const totalQty = visible.reduce((s, r) => s + r.quantity, 0);
  const value = inventoryValue();
  const subsidy = subsidyTotal();
  const lowCount = visible.filter((r) => r.quantity < LOW).length;

  type Row = FertilizerStock & { id: string; areaId: string; valueAmt: number; subsidyAmt: number };
  const rows: Row[] = visible.map((s, i) => {
    const wh = store.warehouses.find((w) => w.id === s.warehouseId);
    const p = priceFor(s.productId);
    return {
      ...s, id: `${s.warehouseId}-${s.productId}-${i}`,
      areaId: wh?.areaId ?? "",
      valueAmt: p ? p.purchasePrice * s.quantity : 0,
      subsidyAmt: p ? p.subsidy * s.quantity : 0,
    };
  });

  const columns: Column<Row>[] = [
    { key: "warehouseId", label: "Warehouse", render: (r) => warehouseName(r.warehouseId) },
    { key: "areaId", label: "Area", render: (r) => areaName(r.areaId) },
    { key: "productId", label: "Product", render: (r) => productName(r.productId) },
    { key: "companyId", label: "Company", render: (r) => companyName(r.companyId) },
    { key: "quantity", label: "Stock", render: (r) => (
      <span className="font-medium">{r.quantity} Bags {r.quantity < LOW && <Badge variant="outline" className="ml-2 bg-himfed-danger/15 text-himfed-danger border-himfed-danger/30">Low</Badge>}</span>
    )},
    { key: "valueAmt", label: "Stock Value", render: (r) => fmt(r.valueAmt) },
    { key: "subsidyAmt", label: "Subsidy", render: (r) => fmt(r.subsidyAmt) },
  ];

  // Aggregations
  const byArea = new Map<string, number>();
  const byCompany = new Map<string, number>();
  const byProduct = new Map<string, number>();
  rows.forEach((r) => {
    byArea.set(r.areaId, (byArea.get(r.areaId) || 0) + r.quantity);
    byCompany.set(r.companyId, (byCompany.get(r.companyId) || 0) + r.quantity);
    byProduct.set(r.productId, (byProduct.get(r.productId) || 0) + r.quantity);
  });

  return (
    <AppShell allowed={["superadmin", "incharge", "accountant", "joa_it", "warehouse_staff"]}>
      <PageHeader title="Fertilizer Inventory" description="Live warehouse, area, product & company inventory with valuation." icon={Boxes} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card><CardContent className="pt-4"><div className="text-xs text-muted-foreground">Total Stock</div><div className="text-2xl font-bold">{totalQty.toLocaleString()} Bags</div></CardContent></Card>
        <Card><CardContent className="pt-4 flex items-start justify-between"><div><div className="text-xs text-muted-foreground">Stock Value</div><div className="text-2xl font-bold">{fmt(value)}</div></div><IndianRupee className="w-5 h-5 text-primary" /></CardContent></Card>
        <Card><CardContent className="pt-4 flex items-start justify-between"><div><div className="text-xs text-muted-foreground">Subsidy Total</div><div className="text-2xl font-bold text-himfed-success">{fmt(subsidy)}</div></div><Wallet className="w-5 h-5 text-himfed-success" /></CardContent></Card>
        <Card><CardContent className="pt-4 flex items-start justify-between"><div><div className="text-xs text-himfed-danger">Low Stock Alerts</div><div className="text-2xl font-bold text-himfed-danger">{lowCount}</div></div><TrendingDown className="w-5 h-5 text-himfed-danger" /></CardContent></Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Tabs defaultValue="warehouse">
            <TabsList>
              <TabsTrigger value="warehouse">Warehouse-wise</TabsTrigger>
              <TabsTrigger value="area">Area-wise</TabsTrigger>
              <TabsTrigger value="product">Product-wise</TabsTrigger>
              <TabsTrigger value="company">Company-wise</TabsTrigger>
            </TabsList>
            <TabsContent value="warehouse" className="mt-4">
              <DataTable data={rows} columns={columns} searchKey="productId" searchPlaceholder="Search by product id..." showExport />
            </TabsContent>
            <TabsContent value="area" className="mt-4">
              <div className="grid md:grid-cols-2 gap-3">
                {Array.from(byArea.entries()).map(([id, q]) => (
                  <Card key={id}><CardContent className="pt-4 flex items-center justify-between">
                    <div><div className="text-xs text-muted-foreground">{areaName(id)}</div><div className="text-xl font-bold">{q} Bags</div></div>
                  </CardContent></Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="product" className="mt-4">
              <div className="grid md:grid-cols-2 gap-3">
                {Array.from(byProduct.entries()).map(([id, q]) => (
                  <Card key={id}><CardContent className="pt-4 flex items-center justify-between">
                    <div><div className="text-xs text-muted-foreground">{productName(id)}</div><div className="text-xl font-bold">{q} Bags</div></div>
                  </CardContent></Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="company" className="mt-4">
              <div className="grid md:grid-cols-2 gap-3">
                {Array.from(byCompany.entries()).map(([id, q]) => (
                  <Card key={id}><CardContent className="pt-4 flex items-center justify-between">
                    <div><div className="text-xs text-muted-foreground">{companyName(id)}</div><div className="text-xl font-bold">{q} Bags</div></div>
                  </CardContent></Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </AppShell>
  );
}
