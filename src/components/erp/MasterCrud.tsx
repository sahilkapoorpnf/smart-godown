import { ReactNode, useState } from "react";
import ErpPage from "./ErpPage";
import { DataTable, Column } from "./DataTable";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import CompanySwitcher from "./CompanySwitcher";
import { Role } from "@/lib/warehouse/types";

interface Props<T extends { id: string }> {
  title: string;
  description: string;
  rows: T[];
  searchKeys?: (keyof T)[];
  columns: Column<T>[];
  empty?: { factory: () => T };
  renderForm: (form: T, setForm: (f: T) => void) => ReactNode;
  onSave: (row: T) => void;
  onDelete?: (row: T) => { ok: boolean; reason?: string };
  allowed?: Role[];
}

export default function MasterCrud<T extends { id: string }>({
  title, description, rows, searchKeys, columns, empty, renderForm, onSave, onDelete, allowed,
}: Props<T>) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<T | null>(null);

  const startNew = () => { if (!empty) return; setEditing(empty.factory()); setOpen(true); };
  const startEdit = (r: T) => { setEditing({ ...r }); setOpen(true); };
  const save = () => {
    if (!editing) return;
    onSave(editing);
    toast.success(`${title.replace(/s$/, "")} saved`);
    setOpen(false); setEditing(null);
  };
  const del = (r: T) => {
    if (!onDelete) return;
    const res = onDelete(r);
    if (!res.ok) { toast.error(res.reason ?? "Cannot delete"); return; }
    toast.success("Deleted");
  };

  const augmented: Column<T>[] = [
    ...columns,
    { key: "_actions", label: "", className: "text-right", render: (r) => (
      <div className="flex justify-end gap-1">
        <Button size="sm" variant="ghost" onClick={() => startEdit(r)}><Pencil className="w-3.5 h-3.5" /></Button>
        {onDelete && <Button size="sm" variant="ghost" onClick={() => del(r)}><Trash2 className="w-3.5 h-3.5 text-destructive" /></Button>}
      </div>
    ) },
  ];

  return (
    <ErpPage allowed={allowed} title={title} description={description}
      actions={empty ? <Button onClick={startNew}><Plus className="w-4 h-4 mr-2" />New</Button> : undefined}>
      <CompanySwitcher />
      <DataTable rows={rows} columns={augmented} searchKeys={searchKeys as any} exportName={title.toLowerCase().replace(/\s+/g, "-")} />

      <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setEditing(null); }}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing && rows.some(r => r.id === editing.id) ? "Edit" : "New"} {title.replace(/s$/, "")}</DialogTitle></DialogHeader>
          {editing && <div className="grid grid-cols-2 gap-3">{renderForm(editing, setEditing as any)}</div>}
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={save}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ErpPage>
  );
}

export function Field({ label, children, full }: { label: string; children: ReactNode; full?: boolean }) {
  return (
    <div className={`space-y-1.5 ${full ? "col-span-2" : ""}`}>
      <label className="text-xs text-muted-foreground font-medium">{label}</label>
      {children}
    </div>
  );
}
