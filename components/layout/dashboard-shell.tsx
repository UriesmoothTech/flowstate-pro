import type { ReactNode } from "react";
import { Sidebar } from "@/components/navigation/sidebar";

interface DashboardShellProps {
  children: ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="dashboard-shell">
      <Sidebar />
      <main className="dashboard-content">{children}</main>
    </div>
  );
}
