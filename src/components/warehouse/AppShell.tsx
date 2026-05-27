import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";
import { Navigate } from "react-router-dom";
import { getCurrentUser } from "@/lib/warehouse/store";
import { Role } from "@/lib/warehouse/types";

interface AppShellProps {
  children: React.ReactNode;
  allowed?: Role[];
}

export default function AppShell({ children, allowed }: AppShellProps) {
  const user = getCurrentUser();
  if (!user) return <Navigate to="/login" replace />;
  if (allowed && !allowed.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
