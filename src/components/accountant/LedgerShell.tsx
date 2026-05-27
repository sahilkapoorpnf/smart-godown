import AppShell from "@/components/warehouse/AppShell";
import { PageHeader } from "@/components/shared/PageHeader";
import { LucideIcon } from "lucide-react";

interface Props {
  title: string;
  description?: string;
  icon?: LucideIcon;
  children: React.ReactNode;
}

export default function LedgerShell({ title, description, icon, children }: Props) {
  return (
    <AppShell allowed={["accountant", "superadmin"]}>
      <PageHeader title={title} description={description} icon={icon} />
      {children}
    </AppShell>
  );
}
