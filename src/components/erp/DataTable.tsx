import { ReactNode, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Download } from "lucide-react";

export interface Column<T> {
  key: string;
  label: string;
  render?: (row: T) => ReactNode;
  className?: string;
  sortable?: boolean;
  accessor?: (row: T) => string | number;
}

interface Props<T> {
  rows: T[];
  columns: Column<T>[];
  searchKeys?: (keyof T)[];
  initialSort?: { key: string; dir: "asc" | "desc" };
  pageSize?: number;
  filters?: ReactNode;
  toolbar?: ReactNode;
  empty?: string;
  exportName?: string;
}

export function DataTable<T extends Record<string, any>>({
  rows, columns, searchKeys, initialSort, pageSize = 10, filters, toolbar, empty, exportName,
}: Props<T>) {
  const [q, setQ] = useState("");
  const [sort, setSort] = useState(initialSort);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let r = rows;
    if (q && searchKeys?.length) {
      const lo = q.toLowerCase();
      r = r.filter((row) => searchKeys.some((k) => String((row as any)[k] ?? "").toLowerCase().includes(lo)));
    }
    if (sort) {
      const col = columns.find((c) => c.key === sort.key);
      r = [...r].sort((a, b) => {
        const av = col?.accessor ? col.accessor(a) : (a as any)[sort.key];
        const bv = col?.accessor ? col.accessor(b) : (b as any)[sort.key];
        if (av == null) return 1; if (bv == null) return -1;
        const cmp = typeof av === "number" && typeof bv === "number" ? av - bv : String(av).localeCompare(String(bv));
        return sort.dir === "asc" ? cmp : -cmp;
      });
    }
    return r;
  }, [rows, q, sort, columns, searchKeys]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const cur = Math.min(page, totalPages);
  const slice = filtered.slice((cur - 1) * pageSize, cur * pageSize);

  const exportCsv = () => {
    const head = columns.map((c) => c.label).join(",");
    const body = filtered.map((row) =>
      columns.map((c) => {
        const v = c.accessor ? c.accessor(row) : (row as any)[c.key];
        return `"${String(v ?? "").replace(/"/g, '""')}"`;
      }).join(",")
    ).join("\n");
    const blob = new Blob([head + "\n" + body], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${exportName ?? "export"}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        {searchKeys?.length ? (
          <div className="relative">
            <Search className="w-4 h-4 absolute left-2.5 top-2.5 text-muted-foreground" />
            <Input value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} placeholder="Search…" className="h-9 pl-8 w-64" />
          </div>
        ) : null}
        {filters}
        <div className="ml-auto flex items-center gap-2">
          {toolbar}
          <Button variant="outline" size="sm" onClick={exportCsv}><Download className="w-4 h-4 mr-1" /> Export</Button>
        </div>
      </div>

      <div className="border border-border rounded-xl overflow-hidden bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 sticky top-0 z-10">
              <tr>
                {columns.map((c) => (
                  <th key={c.key} className={`text-left font-semibold text-xs uppercase tracking-wider px-3 py-2.5 text-muted-foreground ${c.className ?? ""}`}>
                    <button
                      type="button"
                      className={c.sortable ? "hover:text-foreground" : ""}
                      onClick={() => c.sortable && setSort((s) => s?.key === c.key ? { key: c.key, dir: s.dir === "asc" ? "desc" : "asc" } : { key: c.key, dir: "asc" })}
                    >
                      {c.label}{c.sortable ? (sort?.key === c.key ? (sort.dir === "asc" ? " ↑" : " ↓") : " ↕") : ""}
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {slice.length === 0 ? (
                <tr><td colSpan={columns.length} className="text-center text-muted-foreground py-12">{empty ?? "No records found"}</td></tr>
              ) : slice.map((row, idx) => (
                <tr key={row.id ?? idx} className="border-t border-border hover:bg-muted/30">
                  {columns.map((c) => (
                    <td key={c.key} className={`px-3 py-2.5 ${c.className ?? ""}`}>
                      {c.render ? c.render(row) : String((row as any)[c.key] ?? "—")}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-3 py-2 bg-muted/30 text-xs text-muted-foreground">
          <span>Showing {(cur - 1) * pageSize + 1}–{Math.min(cur * pageSize, filtered.length)} of {filtered.length}</span>
          <div className="flex items-center gap-1">
            <Button size="sm" variant="ghost" disabled={cur === 1} onClick={() => setPage(cur - 1)}>Prev</Button>
            <span className="px-2">{cur} / {totalPages}</span>
            <Button size="sm" variant="ghost" disabled={cur === totalPages} onClick={() => setPage(cur + 1)}>Next</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
