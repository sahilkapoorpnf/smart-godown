import { Navigate } from "react-router-dom";
import { Link } from "react-router-dom";
import ErpPage, { StatTile, Badge } from "@/components/erp/ErpPage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/warehouse/store";
import { useErp, godownName } from "@/lib/erp/store";
import { PlusSquare, ClipboardList, AlertCircle, CheckCircle2, Clock, FileText } from "lucide-react";

export default function WhUserDashboard() {
  const user = getCurrentUser();
  const { arrivals } = useErp();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "wh_user") return <Navigate to="/dashboard" replace />;

  const mine = arrivals.filter((a) => a.createdBy === user.id);
  const pending = mine.filter((a) => a.status === "pending");
  const reedit = mine.filter((a) => a.status === "re_edit");
  const approved = mine.filter((a) => a.status === "approved");
  const recent = [...mine].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 6);

  return (
    <ErpPage
      allowed={["wh_user"]}
      title={`Welcome, ${user.name.split(" ")[0]}`}
      description={`${godownName(user.warehouseId)} · Warehouse User Portal`}
      actions={<Button asChild><Link to="/dashboard/erp/wh/new"><PlusSquare className="w-4 h-4 mr-2" /> New Goods Arrival</Link></Button>}
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile label="Total Entries" value={mine.length} sub="Created by me" tone="blue" />
        <StatTile label="Pending Approval" value={pending.length} sub="Awaiting Area Officer" tone="amber" />
        <StatTile label="Re-edit Required" value={reedit.length} sub="Needs correction" tone="red" />
        <StatTile label="Approved" value={approved.length} sub="Verified entries" tone="green" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-lg font-serif">Recent Goods Arrivals</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {recent.map((r) => (
              <div key={r.id} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/30">
                <div>
                  <div className="font-semibold text-sm">{r.entryId} · {r.productName}</div>
                  <div className="text-xs text-muted-foreground">{r.companyName} · {r.quantity} {r.unit} · GR {r.grNumber}</div>
                </div>
                {r.status === "approved" && <Badge tone="green"><CheckCircle2 className="w-3 h-3 mr-1" />Approved</Badge>}
                {r.status === "pending" && <Badge tone="amber"><Clock className="w-3 h-3 mr-1" />Pending</Badge>}
                {r.status === "re_edit" && <Badge tone="red"><AlertCircle className="w-3 h-3 mr-1" />Re-edit</Badge>}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-lg font-serif">Quick Actions</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            <Button asChild variant="outline" className="w-full justify-start"><Link to="/dashboard/erp/wh/new"><PlusSquare className="w-4 h-4 mr-2" />New Arrival Entry</Link></Button>
            <Button asChild variant="outline" className="w-full justify-start"><Link to="/dashboard/erp/wh/mine"><ClipboardList className="w-4 h-4 mr-2" />My Entries</Link></Button>
            <Button asChild variant="outline" className="w-full justify-start"><Link to="/dashboard/erp/wh/recorrect"><FileText className="w-4 h-4 mr-2" />Re-correction Queue ({reedit.length})</Link></Button>
          </CardContent>
        </Card>
      </div>
    </ErpPage>
  );
}
