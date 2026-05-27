import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { MyPaymentsClient } from "@/components/dashboard/MyPaymentsClient";

export default function DashboardPaymentsPage() {
  return (
    <DashboardShell title="Payment History">
      <MyPaymentsClient />
    </DashboardShell>
  );
}
