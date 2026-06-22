import ErpPage, { Badge } from "@/components/erp/ErpPage";
import { DataTable } from "@/components/erp/DataTable";
import { store as whStore } from "@/lib/warehouse/store";
import { ROLE_LABEL } from "@/lib/warehouse/types";
import { useErp, godownName } from "@/lib/erp/store";

export default function AdminUserManagement() {
  const users = whStore.users.filter((u) => ["wh_user", "area_officer", "wh_accountant", "admin_accountant"].includes(u.role));
  const areas = whStore.areas;

  return (
    <ErpPage allowed={["admin_accountant"]} title="ERP User Management"
      description="Manage Warehouse Users, Area Officers, Accountants and Admin Accountants.">
      <DataTable rows={users} exportName="erp-users" searchKeys={["name", "username", "email", "phone"] as any}
        columns={[
          { key: "name", label: "Name", sortable: true, render: (r) => <span className="font-semibold">{r.name}</span> },
          { key: "username", label: "Username", render: (r) => <span className="font-mono text-xs">{r.username}</span> },
          { key: "role", label: "Role", render: (r) => <Badge tone={r.role === "admin_accountant" ? "red" : r.role === "wh_accountant" ? "blue" : r.role === "area_officer" ? "amber" : "green"}>{ROLE_LABEL[r.role]}</Badge> },
          { key: "areaId", label: "Area", render: (r) => areas.find((a) => a.id === r.areaId)?.name ?? "HQ" },
          { key: "warehouseId", label: "Godown", render: (r) => r.warehouseId ? godownName(r.warehouseId) : "—" },
          { key: "email", label: "Email" },
          { key: "phone", label: "Phone" },
          { key: "status", label: "Status", render: (r) => <Badge tone={r.status === "active" ? "green" : "red"}>{r.status}</Badge> },
        ]} />
    </ErpPage>
  );
}
