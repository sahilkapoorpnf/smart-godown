import AppShell from "@/components/warehouse/AppShell";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusSquare, ArrowLeft } from "lucide-react";
import EntryFormModal from "@/components/warehouse/EntryFormModal";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, warehouseName, areaName, visibleEntries, useStore } from "@/lib/warehouse/store";
import { EntryStatusBadge } from "@/components/warehouse/EntryStatusBadge";

export default function NewEntry() {
  useStore();
  const user = getCurrentUser();
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

  if (!user) return null;
  const myList = visibleEntries(user).slice(0, 5);

  return (
    <AppShell allowed={["warehouse_staff"]}>
      <PageHeader title="New Warehouse Entry" description="Record a truck unloading at your warehouse." icon={PlusSquare} />

      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <div className="text-xs uppercase text-muted-foreground tracking-wider">Warehouse</div>
              <div className="font-semibold">{warehouseName(user.warehouseId)}</div>
            </div>
            <div>
              <div className="text-xs uppercase text-muted-foreground tracking-wider">Area</div>
              <div className="font-semibold">{areaName(user.areaId)}</div>
            </div>
            <div>
              <div className="text-xs uppercase text-muted-foreground tracking-wider">Operator</div>
              <div className="font-semibold">{user.name}</div>
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <Button onClick={() => setOpen(true)} className="bg-primary">
              <PlusSquare className="w-4 h-4 mr-2" /> Open Entry Form
            </Button>
            <Button variant="outline" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="text-sm font-semibold mb-3">Your latest submissions</div>
          {myList.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">No entries yet.</div>
          ) : (
            <div className="divide-y divide-border">
              {myList.map((e) => (
                <div key={e.id} className="py-2.5 flex items-center justify-between gap-3">
                  <div className="text-sm">
                    <span className="font-medium">{e.entryCode}</span> · {e.productName} · {e.quantity} {e.unit}
                  </div>
                  <EntryStatusBadge status={e.status} />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <EntryFormModal open={open} onOpenChange={setOpen} />
    </AppShell>
  );
}
