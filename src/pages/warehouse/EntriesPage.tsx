import { useMemo, useState } from "react";
import AppShell from "@/components/warehouse/AppShell";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, Column } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, Filter, X, PlusSquare, CheckSquare, ClipboardList } from "lucide-react";
import EntryFormModal from "@/components/warehouse/EntryFormModal";
import EntryReviewModal from "@/components/warehouse/EntryReviewModal";
import { EntryStatusBadge } from "@/components/warehouse/EntryStatusBadge";
import {
  areaName,
  getCurrentUser,
  store,
  useStore,
  userName,
  visibleEntries,
  warehouseName,
} from "@/lib/warehouse/store";
import { WarehouseEntry } from "@/lib/warehouse/types";

type Mode = "mine" | "approvals" | "monitor";

interface Props {
  mode: Mode;
}

const titleByMode: Record<Mode, { title: string; desc: string; icon: any }> = {
  mine: { title: "My Entries", desc: "All inventory entries you've submitted.", icon: ClipboardList },
  approvals: { title: "Pending Approvals", desc: "Review and approve / reject staff submissions.", icon: CheckSquare },
  monitor: { title: "Warehouse Entry Monitoring", desc: "Live monitoring of every entry across all areas.", icon: ClipboardList },
};

export default function EntriesPage({ mode }: Props) {
  useStore();
  const user = getCurrentUser();
  const cfg = titleByMode[mode];

  const [showFilters, setShowFilters] = useState(false);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [fStatus, setFStatus] = useState("");
  const [fArea, setFArea] = useState("");
  const [fWh, setFWh] = useState("");

  const [createOpen, setCreateOpen] = useState(false);
  const [review, setReview] = useState<WarehouseEntry | null>(null);

  const base = useMemo(() => {
    if (!user) return [];
    let list = visibleEntries(user);
    if (mode === "approvals") list = list.filter((e) => e.status === "pending");
    return list;
  }, [user, mode, store.entries.length]);

  const filtered = base.filter((e) => {
    if (from && e.depotDate < from) return false;
    if (to && e.depotDate > to) return false;
    if (fStatus && e.status !== fStatus) return false;
    if (fArea && e.areaId !== fArea) return false;
    if (fWh && e.warehouseId !== fWh) return false;
    return true;
  });

  const resetFilters = () => {
    setFrom(""); setTo(""); setFStatus(""); setFArea(""); setFWh("");
  };

  const columns: Column<WarehouseEntry>[] = [
    { key: "entryCode", label: "Entry ID", sortable: true },
    { key: "depotDate", label: "Depot Date", sortable: true },
    { key: "grNumber", label: "GR No.", sortable: true },
    { key: "truckNumber", label: "Truck" },
    { key: "productName", label: "Product" },
    { key: "company", label: "Company" },
    {
      key: "quantity",
      label: "Qty",
      render: (e) => <span className="font-medium">{e.quantity.toLocaleString()} {e.unit}</span>,
    },
    { key: "warehouseId", label: "Warehouse", render: (e) => warehouseName(e.warehouseId) },
    { key: "areaId", label: "Area", render: (e) => areaName(e.areaId) },
    { key: "createdBy", label: "Created By", render: (e) => userName(e.createdBy) },
    { key: "status", label: "Status", render: (e) => <EntryStatusBadge status={e.status} /> },
    { key: "approvedBy", label: "Reviewed By", render: (e) => e.approvedBy ? userName(e.approvedBy) : "—" },
    {
      key: "approvedAt",
      label: "Review Date",
      render: (e) => (e.approvedAt ? new Date(e.approvedAt).toLocaleDateString("en-IN") : "—"),
    },
  ];

  const counts = {
    total: filtered.length,
    pending: filtered.filter((e) => e.status === "pending").length,
    approved: filtered.filter((e) => e.status === "approved").length,
    rejected: filtered.filter((e) => e.status === "rejected").length,
  };

  return (
    <AppShell>
      <PageHeader title={cfg.title} description={cfg.desc} icon={cfg.icon} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card><CardContent className="pt-4"><div className="text-xs text-muted-foreground">Total</div><div className="text-2xl font-bold">{counts.total}</div></CardContent></Card>
        <Card><CardContent className="pt-4"><div className="text-xs text-himfed-warning">Pending</div><div className="text-2xl font-bold text-himfed-warning">{counts.pending}</div></CardContent></Card>
        <Card><CardContent className="pt-4"><div className="text-xs text-himfed-success">Approved</div><div className="text-2xl font-bold text-himfed-success">{counts.approved}</div></CardContent></Card>
        <Card><CardContent className="pt-4"><div className="text-xs text-himfed-danger">Rejected</div><div className="text-2xl font-bold text-himfed-danger">{counts.rejected}</div></CardContent></Card>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
              <Filter className="w-4 h-4 mr-2" /> Advanced Filters {showFilters && <X className="w-3 h-3 ml-2" />}
            </Button>
            {user?.role === "warehouse_staff" && mode === "mine" && (
              <Button onClick={() => setCreateOpen(true)} className="bg-primary">
                <PlusSquare className="w-4 h-4 mr-2" /> New Entry
              </Button>
            )}
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 p-4 rounded-lg border border-border bg-muted/30">
              <div className="space-y-1"><Label className="text-xs">From</Label><Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} /></div>
              <div className="space-y-1"><Label className="text-xs">To</Label><Input type="date" value={to} onChange={(e) => setTo(e.target.value)} /></div>
              <div className="space-y-1">
                <Label className="text-xs">Status</Label>
                <Select value={fStatus || "all"} onValueChange={(v) => setFStatus(v === "all" ? "" : v)}>
                  <SelectTrigger><SelectValue placeholder="All" /></SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="no_action">No Action</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {user?.role !== "warehouse_staff" && (
                <div className="space-y-1">
                  <Label className="text-xs">Area</Label>
                  <Select value={fArea || "all"} onValueChange={(v) => setFArea(v === "all" ? "" : v)}>
                    <SelectTrigger><SelectValue placeholder="All" /></SelectTrigger>
                    <SelectContent className="bg-popover">
                      <SelectItem value="all">All Areas</SelectItem>
                      {store.areas.map((a) => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              )}
              {user?.role !== "warehouse_staff" && (
                <div className="space-y-1">
                  <Label className="text-xs">Warehouse</Label>
                  <Select value={fWh || "all"} onValueChange={(v) => setFWh(v === "all" ? "" : v)}>
                    <SelectTrigger><SelectValue placeholder="All" /></SelectTrigger>
                    <SelectContent className="bg-popover">
                      <SelectItem value="all">All Warehouses</SelectItem>
                      {store.warehouses
                        .filter((w) => !fArea || w.areaId === fArea)
                        .map((w) => <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="md:col-span-5 flex justify-end">
                <Button variant="ghost" size="sm" onClick={resetFilters}>Reset filters</Button>
              </div>
            </div>
          )}

          <DataTable
            data={filtered}
            columns={columns}
            searchPlaceholder="Search by entry ID, GR, truck..."
            searchKey="grNumber"
            actions={(e) => (
              <Button variant="ghost" size="sm" onClick={() => setReview(e)}>
                <Eye className="w-4 h-4 mr-1" />
                {mode === "approvals" && e.status === "pending" ? "Review" : "View"}
              </Button>
            )}
            emptyMessage="No entries found"
          />
        </CardContent>
      </Card>

      <EntryFormModal open={createOpen} onOpenChange={setCreateOpen} />
      <EntryReviewModal entry={review} open={!!review} onOpenChange={(o) => !o && setReview(null)} />
    </AppShell>
  );
}
