import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { MyTicketsClient } from "@/components/dashboard/MyTicketsClient";

export default function DashboardTicketsPage() {
  return (
    <DashboardShell title="My Tickets">
      <MyTicketsClient />
    </DashboardShell>
  );
}
