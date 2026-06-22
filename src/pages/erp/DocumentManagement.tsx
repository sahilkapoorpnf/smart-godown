import ErpPage, { Badge } from "@/components/erp/ErpPage";
import { DataTable } from "@/components/erp/DataTable";
import { Button } from "@/components/ui/button";
import { useErp, godownName } from "@/lib/erp/store";
import { FileText, Download } from "lucide-react";

export default function DocumentManagement() {
  const { docs } = useErp();
  return (
    <ErpPage allowed={["admin_accountant", "wh_accountant", "area_officer"]} title="Document Management"
      description="Central repository of GR copies, challans, invoices, sales bills and payment proofs.">
      <DataTable rows={docs} exportName="documents" searchKeys={["name", "refNo", "uploadedBy"] as any}
        columns={[
          { key: "name", label: "File", render: (r) => <span className="flex items-center gap-2 font-medium"><FileText className="w-4 h-4 text-muted-foreground" />{r.name}</span> },
          { key: "type", label: "Type", render: (r) => <Badge tone={r.type === "GR Copy" ? "blue" : r.type === "Purchase Invoice" ? "amber" : r.type === "Sales Bill" ? "green" : "default"}>{r.type}</Badge> },
          { key: "refNo", label: "Ref. No.", render: (r) => <span className="font-mono text-xs">{r.refNo}</span> },
          { key: "godownId", label: "Godown", render: (r) => godownName(r.godownId) },
          { key: "sizeKb", label: "Size", className: "text-right", render: (r) => `${r.sizeKb} KB` },
          { key: "uploadedBy", label: "Uploaded By" },
          { key: "uploadedAt", label: "Uploaded At", sortable: true, render: (r) => new Date(r.uploadedAt).toLocaleString("en-IN") },
          { key: "actions", label: "", render: () => <Button size="sm" variant="ghost"><Download className="w-3 h-3" /></Button> },
        ]} />
    </ErpPage>
  );
}
