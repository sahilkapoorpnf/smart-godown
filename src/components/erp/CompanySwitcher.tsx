import { Link } from "react-router-dom";
import { Building2, ChevronDown } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useErp, setActiveCompany, activeCompany, companiesForUser } from "@/lib/erp/store";
import { getCurrentUser } from "@/lib/warehouse/store";

export default function CompanySwitcher() {
  useErp();
  const user = getCurrentUser();
  const co = activeCompany();
  const list = companiesForUser(user?.id, user?.role);

  return (
    <div className="flex items-center gap-3 rounded-xl border border-himfed-green/30 bg-himfed-green/5 px-4 py-2.5">
      <Building2 className="w-5 h-5 text-himfed-green" />
      <div className="flex-1">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Active Company</div>
        <div className="font-serif font-bold text-base text-foreground">{co?.name ?? "No company"}</div>
        {co && <div className="text-[11px] text-muted-foreground">GST: {co.gstNumber} · FY {co.fyStart.slice(0,4)}-{co.fyEnd.slice(2,4)} · {co.district}</div>}
      </div>
      {list.length > 1 && (
        <Select value={co?.id} onValueChange={(v) => setActiveCompany(v)}>
          <SelectTrigger className="w-56 h-9 bg-background"><SelectValue /></SelectTrigger>
          <SelectContent>
            {list.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
          </SelectContent>
        </Select>
      )}
      <Button asChild variant="outline" size="sm">
        <Link to="/dashboard/erp/acc/select-company">Switch / Manage</Link>
      </Button>
    </div>
  );
}
