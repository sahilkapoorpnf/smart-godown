import { ReactNode } from "react";
import AppShell from "@/components/warehouse/AppShell";
import { Role } from "@/lib/warehouse/types";

interface Props {
  title: string;
  description?: string;
  actions?: ReactNode;
  allowed?: Role[];
  children: ReactNode;
}

export default function ErpPage({ title, description, actions, allowed, children }: Props) {
  return (
    <AppShell allowed={allowed}>
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-foreground">{title}</h1>
          {description && <p className="text-muted-foreground mt-1">{description}</p>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
      {children}
    </AppShell>
  );
}

interface StatProps { label: string; value: string | number; sub?: string; tone?: "default" | "green" | "amber" | "red" | "blue" }
export function StatTile({ label, value, sub, tone = "default" }: StatProps) {
  const toneMap: Record<string, string> = {
    default: "from-card to-card border-border",
    green: "from-himfed-green/10 to-himfed-green/5 border-himfed-green/30",
    amber: "from-himfed-amber/15 to-himfed-amber/5 border-himfed-amber/40",
    red: "from-destructive/10 to-destructive/5 border-destructive/30",
    blue: "from-himfed-info/10 to-himfed-info/5 border-himfed-info/30",
  };
  return (
    <div className={`rounded-xl border bg-gradient-to-br p-5 ${toneMap[tone]}`}>
      <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium">{label}</div>
      <div className="mt-2 text-2xl md:text-3xl font-serif font-bold text-foreground">{value}</div>
      {sub && <div className="mt-1 text-xs text-muted-foreground">{sub}</div>}
    </div>
  );
}

export function Badge({ children, tone = "default" }: { children: ReactNode; tone?: "default" | "green" | "amber" | "red" | "blue" }) {
  const map: Record<string, string> = {
    default: "bg-muted text-foreground",
    green: "bg-himfed-green/15 text-himfed-green",
    amber: "bg-himfed-amber/20 text-amber-700",
    red: "bg-destructive/15 text-destructive",
    blue: "bg-himfed-info/15 text-himfed-info",
  };
  return <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${map[tone]}`}>{children}</span>;
}

export const fmtINR = (n: number) =>
  "₹" + (n ?? 0).toLocaleString("en-IN", { maximumFractionDigits: 0 });
