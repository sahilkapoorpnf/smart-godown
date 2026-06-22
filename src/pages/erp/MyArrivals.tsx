import { Navigate, Link } from "react-router-dom";
import ErpPage, { Badge } from "@/components/erp/ErpPage";
import { DataTable } from "@/components/erp/DataTable";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/warehouse/store";
import { useErp, godownName } from "@/lib/erp/store";
import { GoodsArrival } from "@/lib/erp/types";
import { Edit, PlusSquare } from "lucide-react";

interface Props { mode: "mine" | "recorrect" }

export default function MyArrivals({ mode }: Props) {
  const user = getCurrentUser();
  const { arrivals } = useErp();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "wh_user") return <Navigate to="/dashboard" replace />;

  let rows = arrivals.filter((a) => a.createdBy === user.id);
  if (mode === "recorrect") rows = rows.filter((a) => a.status === "re_edit");

  return (
    <ErpPage
      allowed={["wh_user"]}
      title={mode === "recorrect" ? "Re-correction Entries" : "My Entries"}
      description={mode === "recorrect" ? "Entries returned by the Area Officer for correction." : "All goods arrival entries you have created."}
      actions={<Button asChild><Link to="/dashboard/erp/wh/new"><PlusSquare className="w-4 h-4 mr-2" />New Entry</Link></Button>}
    >
      <DataTable<GoodsArrival>
        rows={rows}
        exportName={mode === "recorrect" ? "recorrection-entries" : "my-entries"}
        searchKeys={["entryId", "grNumber", "truckNumber", "productName", "supplierName"]}
        columns={[
          { key: "entryId", label: "Entry ID", sortable: true, render: (r) => <span className="font-mono font-semibold">{r.entryId}</span> },
          { key: "depotDate", label: "Depot Date", sortable: true },
          { key: "grNumber", label: "GR No.", render: (r) => <span className="font-mono">{r.grNumber}</span> },
          { key: "truckNumber", label: "Truck", render: (r) => <span className="font-mono">{r.truckNumber}</span> },
          { key: "productName", label: "Product" },
          { key: "supplierName", label: "Supplier" },
          { key: "quantity", label: "Qty", render: (r) => `${r.quantity} ${r.unit}` },
          { key: "warehouseId", label: "Godown", render: (r) => godownName(r.warehouseId) },
          { key: "status", label: "Status", render: (r) =>
              r.status === "approved" ? <Badge tone="green">Approved</Badge>
              : r.status === "re_edit" ? <Badge tone="red">Re-edit Required</Badge>
              : <Badge tone="amber">Pending Approval</Badge> },
          { key: "actions", label: "", render: (r) => r.status === "re_edit"
              ? <Button asChild size="sm" variant="outline"><Link to={`/dashboard/erp/wh/new?edit=${r.id}`}><Edit className="w-3 h-3 mr-1" />Correct</Link></Button>
              : null,
          },
        ]}
      />
    </ErpPage>
  );
}
