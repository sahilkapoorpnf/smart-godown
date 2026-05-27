import AppShell from "@/components/warehouse/AppShell";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, Column } from "@/components/shared/DataTable";
import { Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useStore, store } from "@/lib/warehouse/store";
import { ActivityLog, ROLE_LABEL } from "@/lib/warehouse/types";

export default function ActivityLogs() {
  useStore();

  const columns: Column<ActivityLog>[] = [
    { key: "timestamp", label: "Timestamp", sortable: true, render: (l) => new Date(l.timestamp).toLocaleString("en-IN") },
    { key: "user", label: "User", sortable: true },
    { key: "role", label: "Role", render: (l) => <Badge variant="outline">{ROLE_LABEL[l.role]}</Badge> },
    {
      key: "action", label: "Action",
      render: (l) => {
        const tone = l.action.includes("Approved") ? "text-himfed-success" : l.action.includes("Rejected") ? "text-himfed-danger" : l.action.includes("Created") ? "text-himfed-info" : "text-foreground";
        return <span className={`font-medium ${tone}`}>{l.action}</span>;
      },
    },
    { key: "target", label: "Target", render: (l) => l.target || "—" },
    { key: "ip", label: "IP Address" },
  ];

  return (
    <AppShell allowed={["superadmin", "joa_it"]}>
      <PageHeader title="Activity Logs" description="Complete audit trail of every user action." icon={Activity} />
      <DataTable
        data={store.logs}
        columns={columns}
        searchPlaceholder="Search by user or action..."
        searchKey="user"
        emptyMessage="No activity logged yet"
        pageSize={15}
      />
    </AppShell>
  );
}
