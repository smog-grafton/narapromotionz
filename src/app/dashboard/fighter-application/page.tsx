import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { FighterApplicationClient } from "@/components/dashboard/FighterApplicationClient";

export default function DashboardFighterApplicationPage() {
  return (
    <DashboardShell title="Fighter Application">
      <FighterApplicationClient />
    </DashboardShell>
  );
}
