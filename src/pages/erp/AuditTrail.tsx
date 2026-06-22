import ErpPage, { Badge } from "@/components/erp/ErpPage";
import { DataTable } from "@/components/erp/DataTable";
import { useErp } from "@/lib/erp/store";

export default function AuditTrail() {
  const { audit } = useErp();
  return (
    <ErpPage allowed={["admin_accountant", "wh_accountant"]} title="Audit Trail"
      description="Every create / update / approve action across the ERP — immutable log.">
      <DataTable rows={audit} exportName="audit-trail" searchKeys={["user", "action", "target"] as any}
        columns={[
          { key: "at", label: "Timestamp", sortable: true, render: (r) => new Date(r.at).toLocaleString("en-IN") },
          { key: "user", label: "User" },
          { key: "role", label: "Role", render: (r) => <Badge tone="blue">{r.role}</Badge> },
          { key: "action", label: "Action" },
          { key: "target", label: "Target", render: (r) => <span className="font-mono text-xs">{r.target}</span> },
          { key: "before", label: "Before → After", render: (r) => r.before ? <span className="text-xs">{r.before} → {r.after}</span> : "—" },
          { key: "ip", label: "IP", render: (r) => <span className="font-mono text-xs">{r.ip}</span> },
        ]} />
    </ErpPage>
  );
}
