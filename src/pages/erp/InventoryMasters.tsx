import ErpPage, { fmtINR, Badge } from "@/components/erp/ErpPage";
import { DataTable } from "@/components/erp/DataTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useErp, sGroupName, unitName } from "@/lib/erp/store";

export default function InventoryMasters() {
  const { stockGroups, stockUnits, stockItems, godowns } = useErp();
  return (
    <ErpPage allowed={["wh_accountant", "admin_accountant"]} title="Inventory Masters" description="Stock groups, units, items and godowns / depots master.">
      <Tabs defaultValue="items">
        <TabsList>
          <TabsTrigger value="items">Stock Items ({stockItems.length})</TabsTrigger>
          <TabsTrigger value="groups">Stock Groups ({stockGroups.length})</TabsTrigger>
          <TabsTrigger value="units">Units ({stockUnits.length})</TabsTrigger>
          <TabsTrigger value="godowns">Godowns ({godowns.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="items" className="mt-4">
          <DataTable rows={stockItems} exportName="stock-items" searchKeys={["name", "hsn"] as any}
            columns={[
              { key: "name", label: "Item Name", sortable: true, render: (r) => <span className="font-semibold">{r.name}</span> },
              { key: "groupId", label: "Group", render: (r) => sGroupName(r.groupId) },
              { key: "unitId", label: "Unit", render: (r) => unitName(r.unitId) },
              { key: "hsn", label: "HSN", render: (r) => <span className="font-mono text-xs">{r.hsn}</span> },
              { key: "gstRate", label: "GST", render: (r) => `${r.gstRate}%` },
              { key: "openingQty", label: "Opening Qty", className: "text-right" },
              { key: "openingValue", label: "Opening Value", className: "text-right font-mono", render: (r) => fmtINR(r.openingValue) },
              { key: "ratePerUnit", label: "Rate", className: "text-right font-mono", render: (r) => fmtINR(r.ratePerUnit) },
            ]} />
        </TabsContent>

        <TabsContent value="groups" className="mt-4">
          <DataTable rows={stockGroups} exportName="stock-groups" searchKeys={["name"] as any}
            columns={[{ key: "name", label: "Group Name" }, { key: "under", label: "Under" }]} />
        </TabsContent>

        <TabsContent value="units" className="mt-4">
          <DataTable rows={stockUnits} exportName="stock-units" searchKeys={["name", "code"] as any}
            columns={[
              { key: "code", label: "Code", render: (r) => <Badge tone="blue">{r.code}</Badge> },
              { key: "name", label: "Name" },
              { key: "decimals", label: "Decimals" },
            ]} />
        </TabsContent>

        <TabsContent value="godowns" className="mt-4">
          <DataTable rows={godowns} exportName="godowns" searchKeys={["name", "address", "inchargeName"] as any}
            columns={[
              { key: "name", label: "Godown / Depot", render: (r) => <span className="font-semibold">{r.name}</span> },
              { key: "areaId", label: "Area" },
              { key: "address", label: "Address" },
              { key: "capacity", label: "Capacity", className: "text-right", render: (r) => `${r.capacity.toLocaleString()} units` },
              { key: "inchargeName", label: "Incharge" },
            ]} />
        </TabsContent>
      </Tabs>
    </ErpPage>
  );
}
