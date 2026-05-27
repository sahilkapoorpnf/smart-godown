import { useState } from "react";
import LedgerShell from "@/components/accountant/LedgerShell";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ShieldCheck, Search } from "lucide-react";
import { AUDIT_LOGS } from "@/lib/accountant/data";

export default function AuditLog() {
  const [q, setQ] = useState("");
  const filtered = AUDIT_LOGS.filter(l => !q || `${l.user} ${l.action} ${l.module} ${l.ip}`.toLowerCase().includes(q.toLowerCase()));
  return (
    <LedgerShell title="Audit Log Management" description="Every accountant activity tracked — entries, edits, deletions, approvals & exports." icon={ShieldCheck}>
      <Card><CardContent className="pt-6 space-y-3">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search user / action / module / IP..." value={q} onChange={e=>setQ(e.target.value)} className="pl-9" />
        </div>
        <div className="rounded-lg border border-border overflow-auto max-h-[65vh]">
          <Table>
            <TableHeader className="sticky top-0 bg-muted z-10"><TableRow>
              {["User","Action","Module","Date & Time","IP Address"].map(h => <TableHead key={h} className="text-xs">{h}</TableHead>)}
            </TableRow></TableHeader>
            <TableBody>{filtered.map(l => (
              <TableRow key={l.id} className="text-xs hover:bg-muted/30">
                <TableCell className="font-medium">{l.user}</TableCell>
                <TableCell>{l.action}</TableCell>
                <TableCell className="text-muted-foreground">{l.module}</TableCell>
                <TableCell>{l.datetime}</TableCell>
                <TableCell className="font-mono text-muted-foreground">{l.ip}</TableCell>
              </TableRow>
            ))}</TableBody>
          </Table>
        </div>
      </CardContent></Card>
    </LedgerShell>
  );
}
