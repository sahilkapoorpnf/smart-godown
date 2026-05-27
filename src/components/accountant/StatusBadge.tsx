import { Badge } from "@/components/ui/badge";

const map: Record<string, string> = {
  paid: "bg-emerald-100 text-emerald-800 border-emerald-200",
  released: "bg-emerald-100 text-emerald-800 border-emerald-200",
  approved: "bg-emerald-100 text-emerald-800 border-emerald-200",
  partial: "bg-amber-100 text-amber-800 border-amber-200",
  pending: "bg-amber-100 text-amber-800 border-amber-200",
  overdue: "bg-rose-100 text-rose-800 border-rose-200",
  rejected: "bg-rose-100 text-rose-800 border-rose-200",
  credit: "bg-emerald-100 text-emerald-800 border-emerald-200",
  debit: "bg-rose-100 text-rose-800 border-rose-200",
};

export function SBadge({ s }: { s: string }) {
  const cls = map[s.toLowerCase()] || "bg-muted text-foreground";
  return (
    <Badge variant="outline" className={cls + " text-[10px] font-semibold"}>
      {s.toUpperCase()}
    </Badge>
  );
}
